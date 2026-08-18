import {
  KeycloakOidcService,
  OidcClientBoundary,
} from './keycloak-oidc.service';

describe('KeycloakOidcService', () => {
  let service: KeycloakOidcService;
  let oidcClientBoundary: jest.Mocked<OidcClientBoundary>;

  const syntheticIssuer = 'https://keycloak.example.com/realms/vnru';
  const redirectUri = 'https://portal.example.com/auth/callback';

  beforeEach(() => {
    oidcClientBoundary = {
      buildAuthorizationUrl: jest.fn(),
      processCallback: jest.fn(),
    };

    service = new KeycloakOidcService(oidcClientBoundary);
  });

  describe('createAuthorizationRequest', () => {
    it('builds authorization request with state, nonce, PKCE S256, and expected scopes', async () => {
      const expectedUrl =
        'https://keycloak.example.com/realms/vnru/protocol/openid-connect/auth?client_id=vnru-auth&response_type=code&scope=openid+profile+email&state=synth-state-123&nonce=synth-nonce-456&code_challenge=synth-challenge-789&code_challenge_method=S256&redirect_uri=https%3A%2F%2Fportal.example.com%2Fauth%2Fcallback';

      oidcClientBoundary.buildAuthorizationUrl.mockResolvedValue(expectedUrl);

      const result = await service.createAuthorizationRequest({
        redirectUri,
        state: 'synth-state-123',
        nonce: 'synth-nonce-456',
        codeChallenge: 'synth-challenge-789',
        codeChallengeMethod: 'S256',
      });

      expect(oidcClientBoundary.buildAuthorizationUrl).toHaveBeenCalledWith({
        redirectUri,
        state: 'synth-state-123',
        nonce: 'synth-nonce-456',
        codeChallenge: 'synth-challenge-789',
        codeChallengeMethod: 'S256',
        scope: 'openid profile email',
      });
      expect(result).toBe(expectedUrl);
    });

    it('rejects unsupported code challenge method', async () => {
      await expect(
        service.createAuthorizationRequest({
          redirectUri,
          state: 'synth-state-123',
          nonce: 'synth-nonce-456',
          codeChallenge: 'synth-challenge-789',
          codeChallengeMethod: 'plain' as 'S256',
        }),
      ).rejects.toThrow(
        'Unsupported code challenge method: only S256 is supported',
      );
    });

    it('fails closed when client boundary rejects redirect URI mismatch', async () => {
      oidcClientBoundary.buildAuthorizationUrl.mockRejectedValue(
        new Error('Redirect URI mismatch'),
      );

      await expect(
        service.createAuthorizationRequest({
          redirectUri: 'https://evil.example.com/callback',
          state: 'synth-state-123',
          nonce: 'synth-nonce-456',
          codeChallenge: 'synth-challenge-789',
          codeChallengeMethod: 'S256',
        }),
      ).rejects.toThrow('Redirect URI mismatch');
    });
  });

  describe('handleCallback', () => {
    it('forwards current URL and expected state/nonce/PKCE verifier to client boundary and normalizes claims with MFA level', async () => {
      oidcClientBoundary.processCallback.mockResolvedValue({
        claims: {
          iss: syntheticIssuer,
          sub: 'kc-user-001',
          email: 'researcher@example.com',
          amr: ['pwd', 'otp'],
          acr: 'mfa',
        },
      });

      const result = await service.handleCallback({
        currentUrl:
          'https://portal.example.com/auth/callback?code=synth-auth-code&state=synth-state-123',
        expectedState: 'synth-state-123',
        expectedNonce: 'synth-nonce-456',
        codeVerifier: 'synth-verifier-789',
      });

      expect(oidcClientBoundary.processCallback).toHaveBeenCalledWith({
        currentUrl:
          'https://portal.example.com/auth/callback?code=synth-auth-code&state=synth-state-123',
        expectedState: 'synth-state-123',
        expectedNonce: 'synth-nonce-456',
        codeVerifier: 'synth-verifier-789',
      });

      expect(result).toEqual({
        issuer: syntheticIssuer,
        subject: 'kc-user-001',
        email: 'researcher@example.com',
        authenticationLevel: 'MFA',
      });
    });

    it('normalizes claims when email is omitted and maps single factor authentication level', async () => {
      oidcClientBoundary.processCallback.mockResolvedValue({
        claims: {
          iss: syntheticIssuer,
          sub: 'kc-user-002',
          amr: ['pwd'],
          acr: 'pwd',
        },
      });

      const result = await service.handleCallback({
        currentUrl:
          'https://portal.example.com/auth/callback?code=synth-auth-code-2&state=synth-state-456',
        expectedState: 'synth-state-456',
        expectedNonce: 'synth-nonce-789',
        codeVerifier: 'synth-verifier-012',
      });

      expect(result).toEqual({
        issuer: syntheticIssuer,
        subject: 'kc-user-002',
        authenticationLevel: 'PASSWORD',
      });
      expect(result.email).toBeUndefined();
    });

    it('fails closed when subject claim is missing from provider response', async () => {
      oidcClientBoundary.processCallback.mockResolvedValue({
        claims: {
          iss: syntheticIssuer,
          email: 'invalid@example.com',
          amr: ['pwd'],
        },
      });

      await expect(
        service.handleCallback({
          currentUrl:
            'https://portal.example.com/auth/callback?code=synth-code&state=synth-state',
          expectedState: 'synth-state',
          expectedNonce: 'synth-nonce',
          codeVerifier: 'synth-verifier',
        }),
      ).rejects.toThrow('Missing subject in OIDC claims');
    });

    it('fails closed when issuer claim is missing from provider response', async () => {
      oidcClientBoundary.processCallback.mockResolvedValue({
        claims: {
          sub: 'kc-user-003',
          email: 'no-issuer@example.com',
        },
      });

      await expect(
        service.handleCallback({
          currentUrl:
            'https://portal.example.com/auth/callback?code=synth-code&state=synth-state',
          expectedState: 'synth-state',
          expectedNonce: 'synth-nonce',
          codeVerifier: 'synth-verifier',
        }),
      ).rejects.toThrow('Missing issuer in OIDC claims');
    });
  });
});
