/* eslint-disable @typescript-eslint/unbound-method */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Test, TestingModule } from '@nestjs/testing';
import * as client from 'openid-client';
import { AuthenticationModule } from './authentication.module';
import {
  OIDC_CLIENT_BOUNDARY,
  OidcClientBoundary,
} from './keycloak-oidc.service';

const mockClientInstance = {
  authorizationUrl: jest.fn(),
  callbackParams: jest.fn(),
  callback: jest.fn(),
};

const mockIssuerInstance = {
  Client: jest.fn().mockImplementation(() => mockClientInstance),
};

jest.mock('openid-client', () => {
  return {
    Issuer: {
      discover: jest
        .fn()
        .mockImplementation(() => Promise.resolve(mockIssuerInstance)),
    },
  };
});

describe('OidcClientBoundary Factory (v5 API adapter)', () => {
  let boundary: OidcClientBoundary;
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
    process.env.DATABASE_URL =
      'postgresql://synthetic:dummy@localhost:5432/dummy';
    process.env.KEYCLOAK_ISSUER_URL =
      'https://keycloak.example.com/realms/vnru';
    process.env.KEYCLOAK_CLIENT_ID = 'vnru-auth';
    process.env.KEYCLOAK_REDIRECT_URI =
      'https://portal.example.com/auth/callback';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthenticationModule],
    }).compile();

    boundary = module.get<OidcClientBoundary>(OIDC_CLIENT_BOUNDARY);
  });

  it('is successfully defined and does not perform network lookup on module compilation', () => {
    expect(boundary).toBeDefined();
    expect(client.Issuer.discover).not.toHaveBeenCalled();
  });

  it('memoizes discovery and clears cache after rejection', async () => {
    const discoverSpy = jest.spyOn(client.Issuer, 'discover');

    // First, let discovery reject
    discoverSpy.mockRejectedValueOnce(new Error('DNS resolution failed'));

    await expect(
      boundary.buildAuthorizationUrl({
        redirectUri: 'https://portal.example.com/auth/callback',
        state: 'state',
        nonce: 'nonce',
        codeChallenge: 'challenge',
        codeChallengeMethod: 'S256',
        scope: 'openid profile email',
      }),
    ).rejects.toThrow('DNS resolution failed');

    expect(discoverSpy).toHaveBeenCalledTimes(1);

    // After failure, next call should attempt discovery again (cache cleared)
    discoverSpy.mockResolvedValueOnce(mockIssuerInstance as any);

    mockClientInstance.authorizationUrl.mockReturnValueOnce('https://auth.url');

    const url = await boundary.buildAuthorizationUrl({
      redirectUri: 'https://portal.example.com/auth/callback',
      state: 'state',
      nonce: 'nonce',
      codeChallenge: 'challenge',
      codeChallengeMethod: 'S256',
      scope: 'openid profile email',
    });

    expect(url).toBe('https://auth.url');
    expect(discoverSpy).toHaveBeenCalledTimes(2);

    // Subsequent call should reuse the resolved client and NOT call discover again (memoized)
    mockClientInstance.authorizationUrl.mockReturnValueOnce('https://auth.url');

    const url2 = await boundary.buildAuthorizationUrl({
      redirectUri: 'https://portal.example.com/auth/callback',
      state: 'state',
      nonce: 'nonce',
      codeChallenge: 'challenge',
      codeChallengeMethod: 'S256',
      scope: 'openid profile email',
    });

    expect(url2).toBe('https://auth.url');
    expect(discoverSpy).toHaveBeenCalledTimes(2);
  });

  it('correctly maps v5 parameters for authorizationUrl and processCallback', async () => {
    const discoverSpy = jest.spyOn(client.Issuer, 'discover');
    discoverSpy.mockResolvedValue(mockIssuerInstance as any);

    mockClientInstance.authorizationUrl.mockReturnValue('https://auth.url');
    mockClientInstance.callbackParams.mockReturnValue({
      code: 'auth-code',
      state: 'state',
    });
    mockClientInstance.callback.mockResolvedValue({
      claims: () => ({
        iss: 'https://keycloak.example.com/realms/vnru',
        sub: 'user-1',
      }),
    });

    // Verify buildAuthorizationUrl
    const url = await boundary.buildAuthorizationUrl({
      redirectUri: 'https://portal.example.com/auth/callback',
      state: 'state-123',
      nonce: 'nonce-123',
      codeChallenge: 'challenge-123',
      codeChallengeMethod: 'S256',
      scope: 'openid profile email',
    });

    expect(url).toBe('https://auth.url');
    expect(mockClientInstance.authorizationUrl).toHaveBeenCalledWith({
      redirect_uri: 'https://portal.example.com/auth/callback',
      state: 'state-123',
      nonce: 'nonce-123',
      code_challenge: 'challenge-123',
      code_challenge_method: 'S256',
      scope: 'openid profile email',
    });

    // Verify processCallback
    const result = await boundary.processCallback({
      currentUrl:
        'https://portal.example.com/auth/callback?code=auth-code&state=state-123',
      expectedState: 'state-123',
      expectedNonce: 'nonce-123',
      codeVerifier: 'verifier-123',
    });

    expect(mockClientInstance.callbackParams).toHaveBeenCalledWith(
      'https://portal.example.com/auth/callback?code=auth-code&state=state-123',
    );
    expect(mockClientInstance.callback).toHaveBeenCalledWith(
      'https://portal.example.com/auth/callback',
      { code: 'auth-code', state: 'state' },
      {
        state: 'state-123',
        nonce: 'nonce-123',
        code_verifier: 'verifier-123',
      },
    );
    expect(result.claims).toEqual({
      iss: 'https://keycloak.example.com/realms/vnru',
      sub: 'user-1',
    });
  });
});
