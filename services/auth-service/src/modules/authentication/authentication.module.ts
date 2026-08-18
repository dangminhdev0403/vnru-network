import { Module } from '@nestjs/common';
import * as client from 'openid-client';
import { validateConfig } from '../../config';
import { IdentityModule } from '../identity/identity.module';
import { SessionModule } from '../session/session.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import {
  KeycloakOidcService,
  OIDC_CLIENT_BOUNDARY,
  OidcAuthorizationUrlParams,
  OidcCallbackResult,
  OidcClientBoundary,
  OidcProcessCallbackParams,
} from './keycloak-oidc.service';

@Module({
  imports: [IdentityModule, SessionModule],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: OIDC_CLIENT_BOUNDARY,
      useFactory: (): OidcClientBoundary => {
        const config = validateConfig();
        const configuredRedirectUri = config.KEYCLOAK_REDIRECT_URI;
        let configPromise: Promise<client.Configuration> | null = null;
        const getConfig = (): Promise<client.Configuration> => {
          if (!configPromise) {
            configPromise = client
              .discovery(
                new URL(config.KEYCLOAK_ISSUER_URL),
                config.KEYCLOAK_CLIENT_ID,
              )
              .catch((err) => {
                configPromise = null;
                throw err;
              });
          }
          return configPromise;
        };

        return {
          async buildAuthorizationUrl(
            params: OidcAuthorizationUrlParams,
          ): Promise<string> {
            if (params.redirectUri !== configuredRedirectUri) {
              throw new Error('Redirect URI mismatch');
            }
            const oidcConfig = await getConfig();
            const authorizationUrl = client.buildAuthorizationUrl(oidcConfig, {
              redirect_uri: configuredRedirectUri,
              state: params.state,
              nonce: params.nonce,
              code_challenge: params.codeChallenge,
              code_challenge_method: params.codeChallengeMethod,
              scope: params.scope,
            });
            return authorizationUrl.href;
          },
          async processCallback(
            params: OidcProcessCallbackParams,
          ): Promise<OidcCallbackResult> {
            const currentUrl = new URL(params.currentUrl);
            const cleanUrl = new URL(currentUrl.href);
            cleanUrl.search = '';
            cleanUrl.hash = '';
            if (cleanUrl.href !== configuredRedirectUri) {
              throw new Error('Redirect URI mismatch');
            }

            const oidcConfig = await getConfig();
            const tokenSet = await client.authorizationCodeGrant(
              oidcConfig,
              currentUrl,
              {
                pkceCodeVerifier: params.codeVerifier,
                expectedState: params.expectedState,
                expectedNonce: params.expectedNonce,
              },
            );

            const claims = tokenSet.claims();
            if (!claims) {
              throw new Error(
                'No verified ID token claims found in token response',
              );
            }

            return { claims };
          },
        };
      },
    },
    KeycloakOidcService,
    AuthenticationService,
  ],
  exports: [AuthenticationService, KeycloakOidcService, OIDC_CLIENT_BOUNDARY],
})
export class AuthenticationModule {}
