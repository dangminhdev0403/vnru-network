import {
  AuthenticationService,
  BeginLoginResult,
  CallbackResult,
} from './authentication.service';
import {
  CreateAuthorizationRequestParams,
  HandleCallbackParams,
  KeycloakOidcService,
  NormalizedOidcUser,
} from './keycloak-oidc.service';
import {
  IdentityService,
  IdentityUser,
  ResolveExternalIdentityInput,
} from '../identity/identity-public';
import {
  CreateSessionInput,
  CreateSessionResult,
  SessionRecord,
  SessionService,
} from '../session/session-public';

type MockOidcService = {
  createAuthorizationRequest: jest.Mock<
    Promise<string>,
    [CreateAuthorizationRequestParams]
  >;
  handleCallback: jest.Mock<
    Promise<NormalizedOidcUser>,
    [HandleCallbackParams]
  >;
};

type MockIdentityService = {
  resolveOrCreateByExternalIdentity: jest.Mock<
    Promise<IdentityUser>,
    [ResolveExternalIdentityInput]
  >;
  findById: jest.Mock<Promise<IdentityUser | null>, [string]>;
};

type MockSessionService = {
  createSession: jest.Mock<Promise<CreateSessionResult>, [CreateSessionInput]>;
  validateSession: jest.Mock<Promise<SessionRecord | null>, [string]>;
  revokeSession: jest.Mock<Promise<void>, [string]>;
  revokeAllForUser: jest.Mock<Promise<void>, [string]>;
};

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let oidcService: MockOidcService;
  let identityService: MockIdentityService;
  let sessionService: MockSessionService;
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

  const syntheticIssuer = 'https://keycloak.example.com/realms/vnru';
  const redirectUri = 'https://portal.example.com/auth/callback';
  const syntheticAuthUrl =
    'https://keycloak.example.com/realms/vnru/protocol/openid-connect/auth?client_id=vnru-auth&response_type=code&state=synth-state&nonce=synth-nonce&code_challenge=synth-challenge&code_challenge_method=S256&redirect_uri=https%3A%2F%2Fportal.example.com%2Fauth%2Fcallback';

  beforeEach(() => {
    oidcService = {
      createAuthorizationRequest: jest.fn<
        Promise<string>,
        [CreateAuthorizationRequestParams]
      >(),
      handleCallback: jest.fn<
        Promise<NormalizedOidcUser>,
        [HandleCallbackParams]
      >(),
    };

    identityService = {
      resolveOrCreateByExternalIdentity: jest.fn<
        Promise<IdentityUser>,
        [ResolveExternalIdentityInput]
      >(),
      findById: jest.fn<Promise<IdentityUser | null>, [string]>(),
    };

    sessionService = {
      createSession: jest.fn<
        Promise<CreateSessionResult>,
        [CreateSessionInput]
      >(),
      validateSession: jest.fn<Promise<SessionRecord | null>, [string]>(),
      revokeSession: jest.fn<Promise<void>, [string]>(),
      revokeAllForUser: jest.fn<Promise<void>, [string]>(),
    };

    service = new AuthenticationService(
      oidcService as unknown as KeycloakOidcService,
      identityService as unknown as IdentityService,
      sessionService as unknown as SessionService,
    );
  });

  describe('beginLogin', () => {
    it('creates server-side transient state/nonce/PKCE verifier, calls OIDC provider with S256 challenge, and returns authorization URL without exposing verifier', async () => {
      oidcService.createAuthorizationRequest.mockResolvedValue(
        syntheticAuthUrl,
      );

      const result: BeginLoginResult = await service.beginLogin({
        redirectUri,
      });

      expect(oidcService.createAuthorizationRequest).toHaveBeenCalledTimes(1);
      const firstCall = oidcService.createAuthorizationRequest.mock.calls[0];
      if (!firstCall) {
        throw new Error('Expected createAuthorizationRequest call');
      }
      const callArgs = firstCall[0];

      expect(callArgs.redirectUri).toBe(redirectUri);
      expect(typeof callArgs.state).toBe('string');
      expect(callArgs.state.length).toBeGreaterThanOrEqual(16);
      expect(typeof callArgs.nonce).toBe('string');
      expect(callArgs.nonce.length).toBeGreaterThanOrEqual(16);
      expect(typeof callArgs.codeChallenge).toBe('string');
      expect(callArgs.codeChallenge.length).toBeGreaterThanOrEqual(16);
      expect(callArgs.codeChallengeMethod).toBe('S256');

      expect(result.authorizationUrl).toBe(syntheticAuthUrl);

      // Security invariant: PKCE code_verifier must never be exposed to the caller/response
      const recordResult = result as unknown as Record<string, unknown>;
      expect(recordResult.codeVerifier).toBeUndefined();
      expect(recordResult.verifier).toBeUndefined();
      expect(recordResult.code_verifier).toBeUndefined();
      expect(recordResult.nonce).toBeUndefined();
    });

    it('generates unique state and nonce for distinct login requests', async () => {
      oidcService.createAuthorizationRequest.mockResolvedValue(
        syntheticAuthUrl,
      );

      await service.beginLogin({ redirectUri });
      await service.beginLogin({ redirectUri });

      const firstCall = oidcService.createAuthorizationRequest.mock.calls[0];
      const secondCall = oidcService.createAuthorizationRequest.mock.calls[1];
      if (!firstCall || !secondCall) {
        throw new Error('Expected two createAuthorizationRequest calls');
      }
      const firstCallArgs = firstCall[0];
      const secondCallArgs = secondCall[0];

      expect(firstCallArgs.state).not.toBe(secondCallArgs.state);
      expect(firstCallArgs.nonce).not.toBe(secondCallArgs.nonce);
      expect(firstCallArgs.codeChallenge).not.toBe(
        secondCallArgs.codeChallenge,
      );
    });

    it('deletes transient state if OIDC authorization URL generation rejects', async () => {
      oidcService.createAuthorizationRequest.mockRejectedValue(
        new Error('OIDC provider error'),
      );

      await expect(service.beginLogin({ redirectUri })).rejects.toThrow(
        'OIDC provider error',
      );
    });
  });

  describe('handleCallback', () => {
    it('consumes transient values once, resolves active identity, and creates opaque session without returning provider tokens', async () => {
      oidcService.createAuthorizationRequest.mockResolvedValue(
        syntheticAuthUrl,
      );
      await service.beginLogin({ redirectUri });

      const firstAuthCall =
        oidcService.createAuthorizationRequest.mock.calls[0];
      if (!firstAuthCall) {
        throw new Error('Expected createAuthorizationRequest call');
      }
      const capturedState = firstAuthCall[0].state;
      const capturedNonce = firstAuthCall[0].nonce;

      const normalizedOidcUser: NormalizedOidcUser = {
        issuer: syntheticIssuer,
        subject: 'sub-researcher-001',
        email: 'researcher@example.com',
        authenticationLevel: 'PASSWORD',
      };
      oidcService.handleCallback.mockResolvedValue(normalizedOidcUser);

      const activeUser: IdentityUser = {
        id: 'usr-active-001',
        email: 'researcher@example.com',
        status: 'ACTIVE',
      };
      identityService.resolveOrCreateByExternalIdentity.mockResolvedValue(
        activeUser,
      );

      const createdSessionResult: CreateSessionResult = {
        token: 'synthetic-opaque-session-token-abc123xyz',
        session: {
          id: 'sess-001',
          tokenDigest: 'digest-001',
          userId: activeUser.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          createdAt: new Date(),
          revokedAt: null,
        },
      };
      sessionService.createSession.mockResolvedValue(createdSessionResult);

      const callbackUrl = `https://portal.example.com/auth/callback?code=synth-code-123&state=${capturedState}`;
      const result: CallbackResult = await service.handleCallback({
        currentUrl: callbackUrl,
        state: capturedState,
      });

      // Verifies transient state was passed to OIDC processor
      expect(oidcService.handleCallback).toHaveBeenCalledTimes(1);
      const callbackCall = oidcService.handleCallback.mock.calls[0];
      if (!callbackCall) {
        throw new Error('Expected handleCallback call');
      }
      const callbackArgs = callbackCall[0];
      expect(callbackArgs.currentUrl).toBe(callbackUrl);
      expect(callbackArgs.expectedState).toBe(capturedState);
      expect(callbackArgs.expectedNonce).toBe(capturedNonce);
      expect(typeof callbackArgs.codeVerifier).toBe('string');
      expect(callbackArgs.codeVerifier.length).toBeGreaterThan(0);

      // Verifies identity resolution
      expect(
        identityService.resolveOrCreateByExternalIdentity,
      ).toHaveBeenCalledWith({
        issuer: syntheticIssuer,
        subject: 'sub-researcher-001',
        email: 'researcher@example.com',
      });

      // Verifies session creation for active identity
      expect(sessionService.createSession).toHaveBeenCalledTimes(1);
      const createSessionCall = sessionService.createSession.mock.calls[0];
      if (!createSessionCall) {
        throw new Error('Expected createSession call');
      }
      const sessionArgs = createSessionCall[0];
      expect(sessionArgs.userId).toBe(activeUser.id);
      expect(typeof sessionArgs.ttlMs).toBe('number');
      expect(sessionArgs.ttlMs).toBeGreaterThan(0);

      // Verifies returned result contains opaque session token and internal identity
      expect(result.token).toBe('synthetic-opaque-session-token-abc123xyz');
      expect(result.user).toEqual(activeUser);

      // Security invariant: Provider tokens must never be exposed or returned
      const recordResult = result as unknown as Record<string, unknown>;
      expect(recordResult.accessToken).toBeUndefined();
      expect(recordResult.access_token).toBeUndefined();
      expect(recordResult.idToken).toBeUndefined();
      expect(recordResult.id_token).toBeUndefined();
      expect(recordResult.refreshToken).toBeUndefined();
      expect(recordResult.refresh_token).toBeUndefined();
    });

    it('fails closed and prevents replay when transient state is consumed more than once', async () => {
      oidcService.createAuthorizationRequest.mockResolvedValue(
        syntheticAuthUrl,
      );
      await service.beginLogin({ redirectUri });
      const firstAuthCall =
        oidcService.createAuthorizationRequest.mock.calls[0];
      if (!firstAuthCall) {
        throw new Error('Expected createAuthorizationRequest call');
      }
      const capturedState = firstAuthCall[0].state;

      oidcService.handleCallback.mockResolvedValue({
        issuer: syntheticIssuer,
        subject: 'sub-001',
        email: 'test@example.com',
        authenticationLevel: 'PASSWORD',
      });
      identityService.resolveOrCreateByExternalIdentity.mockResolvedValue({
        id: 'usr-001',
        email: 'test@example.com',
        status: 'ACTIVE',
      });
      sessionService.createSession.mockResolvedValue({
        token: 'token-1',
        session: {
          id: 'sess-1',
          tokenDigest: 'digest-1',
          userId: 'usr-001',
          expiresAt: new Date(Date.now() + 60000),
          createdAt: new Date(),
          revokedAt: null,
        },
      });

      const callbackUrl = `https://portal.example.com/auth/callback?code=synth-code&state=${capturedState}`;

      // First callback consumes transient state successfully
      await service.handleCallback({
        currentUrl: callbackUrl,
        state: capturedState,
      });

      // Second callback with the same state must fail closed (single-use transient state)
      await expect(
        service.handleCallback({
          currentUrl: callbackUrl,
          state: capturedState,
        }),
      ).rejects.toThrow(/state/i);

      expect(sessionService.createSession).toHaveBeenCalledTimes(1);
    });

    it('fails closed when state parameter is unknown or missing from transient store', async () => {
      await expect(
        service.handleCallback({
          currentUrl:
            'https://portal.example.com/auth/callback?code=synth-code&state=unknown-state',
          state: 'unknown-state',
        }),
      ).rejects.toThrow(/state/i);

      expect(oidcService.handleCallback).not.toHaveBeenCalled();
      expect(
        identityService.resolveOrCreateByExternalIdentity,
      ).not.toHaveBeenCalled();
      expect(sessionService.createSession).not.toHaveBeenCalled();
    });

    it('denies inactive identity before session creation', async () => {
      oidcService.createAuthorizationRequest.mockResolvedValue(
        syntheticAuthUrl,
      );
      await service.beginLogin({ redirectUri });
      const firstAuthCall =
        oidcService.createAuthorizationRequest.mock.calls[0];
      if (!firstAuthCall) {
        throw new Error('Expected createAuthorizationRequest call');
      }
      const capturedState = firstAuthCall[0].state;

      oidcService.handleCallback.mockResolvedValue({
        issuer: syntheticIssuer,
        subject: 'sub-inactive-002',
        email: 'inactive@example.com',
        authenticationLevel: 'PASSWORD',
      });

      const inactiveUser: IdentityUser = {
        id: 'usr-inactive-002',
        email: 'inactive@example.com',
        status: 'INACTIVE',
      };
      identityService.resolveOrCreateByExternalIdentity.mockResolvedValue(
        inactiveUser,
      );

      const callbackUrl = `https://portal.example.com/auth/callback?code=synth-code-inactive&state=${capturedState}`;

      await expect(
        service.handleCallback({
          currentUrl: callbackUrl,
          state: capturedState,
        }),
      ).rejects.toThrow(/inactive|denied|unauthorized/i);

      // Invariant: session must NEVER be created for an inactive user
      expect(sessionService.createSession).not.toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('returns minimal internal identity after session digest validation when user is active', async () => {
      const activeSession: SessionRecord = {
        id: 'sess-001',
        tokenDigest: 'digest-001',
        userId: 'usr-active-001',
        expiresAt: new Date(Date.now() + 60000),
        createdAt: new Date(),
        revokedAt: null,
      };
      sessionService.validateSession.mockResolvedValue(activeSession);
      identityService.findById.mockResolvedValue({
        id: 'usr-active-001',
        email: 'researcher@example.com',
        status: 'ACTIVE',
      });

      const user = await service.getCurrentUser('presented-session-token');

      expect(sessionService.validateSession).toHaveBeenCalledWith(
        'presented-session-token',
      );
      expect(identityService.findById).toHaveBeenCalledWith('usr-active-001');
      expect(user).toEqual({
        userId: 'usr-active-001',
        sessionId: 'sess-001',
      });
    });

    it('returns null and fails closed when user is inactive', async () => {
      const activeSession: SessionRecord = {
        id: 'sess-002',
        tokenDigest: 'digest-002',
        userId: 'usr-inactive-002',
        expiresAt: new Date(Date.now() + 60000),
        createdAt: new Date(),
        revokedAt: null,
      };
      sessionService.validateSession.mockResolvedValue(activeSession);
      identityService.findById.mockResolvedValue({
        id: 'usr-inactive-002',
        email: 'inactive@example.com',
        status: 'INACTIVE',
      });

      const user = await service.getCurrentUser('presented-session-token');

      expect(sessionService.validateSession).toHaveBeenCalledWith(
        'presented-session-token',
      );
      expect(identityService.findById).toHaveBeenCalledWith('usr-inactive-002');
      expect(user).toBeNull();
    });

    it('returns null and fails closed when user record is missing', async () => {
      const activeSession: SessionRecord = {
        id: 'sess-003',
        tokenDigest: 'digest-003',
        userId: 'usr-missing-003',
        expiresAt: new Date(Date.now() + 60000),
        createdAt: new Date(),
        revokedAt: null,
      };
      sessionService.validateSession.mockResolvedValue(activeSession);
      identityService.findById.mockResolvedValue(null);

      const user = await service.getCurrentUser('presented-session-token');

      expect(sessionService.validateSession).toHaveBeenCalledWith(
        'presented-session-token',
      );
      expect(identityService.findById).toHaveBeenCalledWith('usr-missing-003');
      expect(user).toBeNull();
    });

    it('returns null and fails closed when session token is invalid, expired, or revoked', async () => {
      sessionService.validateSession.mockResolvedValue(null);

      const user = await service.getCurrentUser('invalid-or-expired-token');

      expect(sessionService.validateSession).toHaveBeenCalledWith(
        'invalid-or-expired-token',
      );
      expect(identityService.findById).not.toHaveBeenCalled();
      expect(user).toBeNull();
    });

    it('returns null when token is empty or omitted', async () => {
      const user = await service.getCurrentUser('');

      expect(sessionService.validateSession).not.toHaveBeenCalled();
      expect(identityService.findById).not.toHaveBeenCalled();
      expect(user).toBeNull();
    });
  });

  describe('logout', () => {
    it('revokes presented session idempotently via session service', async () => {
      sessionService.revokeSession.mockResolvedValue(undefined);

      await service.logout('session-token-to-revoke');

      expect(sessionService.revokeSession).toHaveBeenCalledTimes(1);
      expect(sessionService.revokeSession).toHaveBeenCalledWith(
        'session-token-to-revoke',
      );
    });

    it('succeeds idempotently when session token is omitted or empty', async () => {
      await expect(service.logout('')).resolves.toBeUndefined();
      expect(sessionService.revokeSession).not.toHaveBeenCalled();
    });
  });
});
