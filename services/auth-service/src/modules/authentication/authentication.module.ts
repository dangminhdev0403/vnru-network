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
        let clientPromise: Promise<client.Client> | null = null;
        const getClient = (): Promise<client.Client> => {
          if (!clientPromise) {
            clientPromise = client.Issuer.discover(config.KEYCLOAK_ISSUER_URL)
              .then((issuer) => {
                return new issuer.Client({
                  client_id: config.KEYCLOAK_CLIENT_ID,
                  redirect_uris: [configuredRedirectUri],
                  response_types: ['code'],
                });
              })
              .catch((err) => {
                clientPromise = null;
                throw err;
              });
          }
          return clientPromise;
        };

        return {
          async buildAuthorizationUrl(
            params: OidcAuthorizationUrlParams,
          ): Promise<string> {
            if (params.redirectUri !== configuredRedirectUri) {
              throw new Error('Redirect URI mismatch');
            }
            const oidcClient = await getClient();
            const authorizationUrl = oidcClient.authorizationUrl({
              redirect_uri: configuredRedirectUri,
              state: params.state,
              nonce: params.nonce,
              code_challenge: params.codeChallenge,
              code_challenge_method: params.codeChallengeMethod,
              scope: params.scope,
            });
            return authorizationUrl;
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

            const oidcClient = await getClient();
            const callbackParams = oidcClient.callbackParams(params.currentUrl);
            const tokenSet = await oidcClient.callback(
              configuredRedirectUri,
              callbackParams,
              {
                state: params.expectedState,
                nonce: params.expectedNonce,
                code_verifier: params.codeVerifier,
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
