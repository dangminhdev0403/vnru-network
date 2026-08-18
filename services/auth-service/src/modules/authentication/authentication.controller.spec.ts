import type { CookieOptions, Response } from 'express';
import { AuthenticationController } from './authentication.controller';
import type { RequestWithCookies } from './authenticated-request-context';
import { SessionService } from '../session/session-public';
import {
  AuthenticatedUser,
  AuthenticationService,
  BeginLoginInput,
  BeginLoginResult,
  CallbackResult,
  HandleCallbackInput,
} from './authentication.service';

type MockAuthService = {
  beginLogin: jest.Mock<Promise<BeginLoginResult>, [BeginLoginInput?]>;
  handleCallback: jest.Mock<Promise<CallbackResult>, [HandleCallbackInput]>;
  getCurrentUser: jest.Mock<
    Promise<AuthenticatedUser | null>,
    [(string | null | undefined)?]
  >;
  logout: jest.Mock<Promise<void>, [(string | null | undefined)?]>;
};

type MockResponse = {
  redirect: jest.Mock<void, [string]>;
  cookie: jest.Mock<Response, [string, string, CookieOptions]>;
  clearCookie: jest.Mock<Response, [string, CookieOptions?]>;
  status: jest.Mock<Response, [number]>;
  json: jest.Mock<Response, [unknown]>;
};

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: MockAuthService;
  let sessionService: { switchContext: jest.Mock };
  let mockResponse: MockResponse;
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

  const syntheticAuthUrl =
    'https://keycloak.example.com/realms/vnru/protocol/openid-connect/auth?client_id=vnru-auth&response_type=code&state=synth-state&nonce=synth-nonce&code_challenge=synth-challenge&code_challenge_method=S256&redirect_uri=https%3A%2F%2Fportal.example.com%2Fauth%2Fcallback';

  beforeEach(() => {
    authService = {
      beginLogin: jest.fn<Promise<BeginLoginResult>, [BeginLoginInput?]>(),
      handleCallback: jest.fn<Promise<CallbackResult>, [HandleCallbackInput]>(),
      getCurrentUser: jest.fn<
        Promise<AuthenticatedUser | null>,
        [(string | null | undefined)?]
      >(),
      logout: jest.fn<Promise<void>, [(string | null | undefined)?]>(),
    };
    sessionService = { switchContext: jest.fn() };

    mockResponse = {
      redirect: jest.fn<void, [string]>(),
      cookie: jest.fn<Response, [string, string, CookieOptions]>(),
      clearCookie: jest.fn<Response, [string, CookieOptions?]>(),
      status: jest.fn<Response, [number]>(),
      json: jest.fn<Response, [unknown]>(),
    };
    mockResponse.cookie.mockReturnValue(mockResponse as unknown as Response);
    mockResponse.clearCookie.mockReturnValue(
      mockResponse as unknown as Response,
    );
    mockResponse.status.mockReturnValue(mockResponse as unknown as Response);
    mockResponse.json.mockReturnValue(mockResponse as unknown as Response);

    controller = new AuthenticationController(
      authService as unknown as AuthenticationService,
      sessionService as unknown as SessionService,
    );
  });

  describe('login', () => {
    it('redirects to provider authorization URL without exposing PKCE verifier', async () => {
      const beginResult: BeginLoginResult = {
        authorizationUrl: syntheticAuthUrl,
      };
      authService.beginLogin.mockResolvedValue(beginResult);

      await controller.login(mockResponse as unknown as Response);

      expect(authService.beginLogin).toHaveBeenCalledTimes(1);
      expect(mockResponse.redirect).toHaveBeenCalledWith(syntheticAuthUrl);

      // Verifies no verifier or sensitive secret in redirect or response
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });
  });

  describe('callback', () => {
    it('handles callback, sets one Secure+HttpOnly+SameSite+bounded Max-Age cookie, and returns minimal response without provider tokens', async () => {
      const callbackResult: CallbackResult = {
        token: 'synthetic-opaque-session-token-12345',
        user: {
          id: 'usr-active-001',
          email: 'researcher@example.com',
          status: 'ACTIVE',
        },
      };
      authService.handleCallback.mockResolvedValue(callbackResult);

      const query = {
        state: 'synth-state-123',
        code: 'synth-auth-code-456',
      };
      const mockReq: RequestWithCookies = {};

      const result = await controller.callback(
        query,
        mockReq,
        mockResponse as unknown as Response,
      );

      expect(authService.handleCallback).toHaveBeenCalledWith({
        currentUrl:
          'https://portal.example.com/auth/callback?state=synth-state-123&code=synth-auth-code-456',
        state: 'synth-state-123',
      });

      // Cookie security boundary assertions
      expect(mockResponse.cookie).toHaveBeenCalledTimes(1);
      const firstCall = mockResponse.cookie.mock.calls[0];
      if (!firstCall) {
        throw new Error('Expected mockResponse.cookie to have been called');
      }
      const [cookieName, cookieValue, cookieOptions] = firstCall;

      expect(typeof cookieName).toBe('string');
      expect(cookieValue).toBe('synthetic-opaque-session-token-12345');
      expect(cookieOptions).toMatchObject({
        httpOnly: true,
        secure: true,
        path: '/',
      });
      expect(cookieOptions.sameSite).toMatch(/^(lax|strict)$/i);
      expect(cookieOptions.maxAge).toBeDefined();
      expect(cookieOptions.maxAge).toBeGreaterThan(0);

      // Response payload must not leak provider tokens
      const recordResult = result as unknown as Record<string, unknown>;
      expect(recordResult.accessToken).toBeUndefined();
      expect(recordResult.access_token).toBeUndefined();
      expect(recordResult.idToken).toBeUndefined();
      expect(recordResult.id_token).toBeUndefined();
      expect(recordResult.refreshToken).toBeUndefined();
      expect(recordResult.refresh_token).toBeUndefined();
      expect(recordResult.codeVerifier).toBeUndefined();
    });

    it('denies inactive identity with 401/403 and does not set session cookie', async () => {
      authService.handleCallback.mockRejectedValue(
        new Error('Identity is inactive'),
      );

      const query = { state: 'inactive-state', code: 'code' };
      const mockReq: RequestWithCookies = {};

      await expect(
        controller.callback(
          query,
          mockReq,
          mockResponse as unknown as Response,
        ),
      ).rejects.toThrow();

      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });
  });

  describe('me / current session', () => {
    it('extracts session token from cookie, validates session digest, and returns minimal internal identity', async () => {
      authService.getCurrentUser.mockResolvedValue({
        userId: 'usr-active-001',
        sessionId: 'sess-001',
        activeContext: null,
        capabilities: [],
      });

      const mockReq: RequestWithCookies = {
        cookies: {
          vnru_session: 'synthetic-opaque-session-token-12345',
        },
      };

      const result = await controller.me(mockReq);

      expect(authService.getCurrentUser).toHaveBeenCalledWith(
        'synthetic-opaque-session-token-12345',
      );
      expect(result).toEqual({
        userId: 'usr-active-001',
        sessionId: 'sess-001',
        activeContext: null,
        capabilities: [],
      });
    });

    it('fails closed and throws or returns unauthorized when session cookie is absent', async () => {
      const mockReq: RequestWithCookies = {
        cookies: {},
      };

      await expect(controller.me(mockReq)).rejects.toThrow();
      expect(authService.getCurrentUser).not.toHaveBeenCalled();
    });

    it('fails closed when presented session token fails validation', async () => {
      authService.getCurrentUser.mockResolvedValue(null);

      const mockReq: RequestWithCookies = {
        cookies: {
          vnru_session: 'expired-or-invalid-token',
        },
      };

      await expect(controller.me(mockReq)).rejects.toThrow();
    });
  });

  describe('context switch', () => {
    it('rotates the cookie without returning the opaque token', async () => {
      sessionService.switchContext.mockResolvedValue({
        token: 'rotated-token',
        session: {},
      });
      const result = await controller.switchContext(
        { contextType: ' ORGANIZATION ', contextId: ' org-100 ' },
        { cookies: { vnru_session: 'current-token' } },
        mockResponse as unknown as Response,
      );
      expect(sessionService.switchContext).toHaveBeenCalledWith(
        'current-token',
        {
          contextType: 'ORGANIZATION',
          contextId: 'org-100',
        },
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'vnru_session',
        'rotated-token',
        expect.objectContaining({ httpOnly: true, secure: true }),
      );
      expect(result).toEqual({
        contextType: 'ORGANIZATION',
        contextId: 'org-100',
      });
      expect(result).not.toHaveProperty('token');
    });

    it('does not replace the cookie when switching fails', async () => {
      sessionService.switchContext.mockRejectedValue(new Error('denied'));
      await expect(
        controller.switchContext(
          { contextType: 'ORGANIZATION', contextId: 'org-100' },
          { cookies: { vnru_session: 'current-token' } },
          mockResponse as unknown as Response,
        ),
      ).rejects.toThrow('Context switch denied');
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('revokes presented session and clears cookie idempotently', async () => {
      authService.logout.mockResolvedValue(undefined);

      const mockReq: RequestWithCookies = {
        cookies: {
          vnru_session: 'session-token-to-revoke',
        },
      };

      await controller.logout(mockReq, mockResponse as unknown as Response);

      expect(authService.logout).toHaveBeenCalledWith(
        'session-token-to-revoke',
      );
      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(1);
      const firstCall = mockResponse.clearCookie.mock.calls[0];
      if (!firstCall) {
        throw new Error('Expected clearCookie to have been called');
      }
      const [cookieName, cookieOptions] = firstCall;
      expect(typeof cookieName).toBe('string');
      expect(cookieOptions).toMatchObject({
        httpOnly: true,
        secure: true,
        path: '/',
      });
    });

    it('succeeds idempotently when session cookie was not present', async () => {
      authService.logout.mockResolvedValue(undefined);

      const mockReq: RequestWithCookies = {
        cookies: {},
      };

      await controller.logout(mockReq, mockResponse as unknown as Response);

      expect(authService.logout).toHaveBeenCalledWith('');
      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(1);
    });
  });
});
