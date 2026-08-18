import { Inject, Injectable } from '@nestjs/common';

export const OIDC_CLIENT_BOUNDARY = 'OIDC_CLIENT_BOUNDARY';

export interface OidcAuthorizationUrlParams {
  redirectUri: string;
  state: string;
  nonce: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
  scope: string;
}

export interface OidcClaims {
  iss?: string;
  sub?: string;
  email?: string;
  amr?: string[];
  acr?: string;
  [key: string]: unknown;
}

export interface OidcCallbackResult {
  claims: OidcClaims;
}

export interface OidcProcessCallbackParams {
  currentUrl: string;
  expectedState: string;
  expectedNonce: string;
  codeVerifier: string;
}

export interface OidcClientBoundary {
  buildAuthorizationUrl: (
    params: OidcAuthorizationUrlParams,
  ) => Promise<string>;
  processCallback: (
    params: OidcProcessCallbackParams,
  ) => Promise<OidcCallbackResult>;
}

export interface CreateAuthorizationRequestParams {
  redirectUri: string;
  state: string;
  nonce: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
}

export interface HandleCallbackParams {
  currentUrl: string;
  expectedState: string;
  expectedNonce: string;
  codeVerifier: string;
}

export interface NormalizedOidcUser {
  issuer: string;
  subject: string;
  email?: string;
  authenticationLevel: 'PASSWORD' | 'MFA';
}

@Injectable()
export class KeycloakOidcService {
  private static readonly DEFAULT_SCOPE = 'openid profile email';

  constructor(
    @Inject(OIDC_CLIENT_BOUNDARY)
    private readonly oidcClientBoundary: OidcClientBoundary,
  ) {}

  async createAuthorizationRequest(
    params: CreateAuthorizationRequestParams,
  ): Promise<string> {
    if (params.codeChallengeMethod !== 'S256') {
      throw new Error(
        'Unsupported code challenge method: only S256 is supported',
      );
    }

    return this.oidcClientBoundary.buildAuthorizationUrl({
      redirectUri: params.redirectUri,
      state: params.state,
      nonce: params.nonce,
      codeChallenge: params.codeChallenge,
      codeChallengeMethod: 'S256',
      scope: KeycloakOidcService.DEFAULT_SCOPE,
    });
  }

  async handleCallback(
    params: HandleCallbackParams,
  ): Promise<NormalizedOidcUser> {
    const result = await this.oidcClientBoundary.processCallback({
      currentUrl: params.currentUrl,
      expectedState: params.expectedState,
      expectedNonce: params.expectedNonce,
      codeVerifier: params.codeVerifier,
    });

    const claims = result?.claims;

    if (
      !claims?.iss ||
      typeof claims.iss !== 'string' ||
      claims.iss.trim() === ''
    ) {
      throw new Error('Missing issuer in OIDC claims');
    }

    if (
      !claims?.sub ||
      typeof claims.sub !== 'string' ||
      claims.sub.trim() === ''
    ) {
      throw new Error('Missing subject in OIDC claims');
    }

    const email =
      typeof claims.email === 'string' && claims.email.trim() !== ''
        ? claims.email
        : undefined;

    const hasMfaAmr =
      Array.isArray(claims.amr) &&
      claims.amr.some(
        (val) =>
          typeof val === 'string' &&
          (val.toLowerCase() === 'otp' ||
            val.toLowerCase() === 'mfa' ||
            val.toLowerCase().includes('otp') ||
            val.toLowerCase().includes('mfa')),
      );

    const hasMfaAcr =
      typeof claims.acr === 'string' &&
      (claims.acr.toLowerCase() === 'mfa' ||
        claims.acr.toLowerCase().includes('mfa'));

    const authenticationLevel: 'PASSWORD' | 'MFA' =
      hasMfaAmr || hasMfaAcr ? 'MFA' : 'PASSWORD';

    const normalizedUser: NormalizedOidcUser = {
      issuer: claims.iss,
      subject: claims.sub,
      authenticationLevel,
    };

    if (email !== undefined) {
      normalizedUser.email = email;
    }

    return normalizedUser;
  }
}
