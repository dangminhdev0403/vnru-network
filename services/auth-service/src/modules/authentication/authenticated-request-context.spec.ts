import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticationService } from './authentication.service';
import {
  AuthenticatedRequestGuard,
  RequireAnyPermission,
  RequirePermission,
  RequireMfa,
} from './authenticated-request-context';

function context(
  request: object,
  permission?: string,
  requireMfa?: boolean,
  anyPermissions?: string[],
): ExecutionContext {
  const handler = () => undefined;
  if (permission) RequirePermission(permission)(handler);
  if (requireMfa) RequireMfa()(handler);
  if (anyPermissions) RequireAnyPermission(...anyPermissions)(handler);
  return {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => handler,
    getClass: () => class TestController {},
  } as unknown as ExecutionContext;
}

describe('AuthenticatedRequestGuard', () => {
  const authService = { getCurrentUser: jest.fn() };
  const guard = new AuthenticatedRequestGuard(
    new Reflector(),
    authService as unknown as AuthenticationService,
  );

  beforeEach(() => jest.clearAllMocks());

  it('rejects missing session', async () => {
    await expect(
      guard.canActivate(context({ headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a capability outside the active context', async () => {
    authService.getCurrentUser.mockResolvedValue({
      userId: 'usr-1',
      sessionId: 'sess-1',
      activeContext: { contextType: 'ORG', contextId: 'org-1' },
      capabilities: ['research.read'],
      authenticationLevel: 'PASSWORD',
    });
    await expect(
      guard.canActivate(
        context({ cookies: { vnru_session: 'opaque-token' } }, 'iam.manage'),
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('attaches the exact authorized context', async () => {
    const request = { cookies: { vnru_session: 'opaque-token' } };
    const authContext = {
      userId: 'usr-1',
      sessionId: 'sess-1',
      activeContext: { contextType: 'ORG', contextId: 'org-1' },
      capabilities: ['research.read'],
      authenticationLevel: 'PASSWORD',
    };
    authService.getCurrentUser.mockResolvedValue(authContext);
    await expect(
      guard.canActivate(context(request, 'research.read')),
    ).resolves.toBe(true);
    expect(request).toMatchObject({ authContext });
  });

  it('accepts any one declared capability', async () => {
    const request = { cookies: { vnru_session: 'opaque-token' } };
    authService.getCurrentUser.mockResolvedValue({
      userId: 'usr-1',
      sessionId: 'sess-1',
      activeContext: { contextType: 'PLATFORM', contextId: 'GLOBAL' },
      capabilities: ['content.article.update'],
      authenticationLevel: 'PASSWORD',
    });
    await expect(
      guard.canActivate(
        context(request, undefined, false, [
          'content.article.create',
          'content.article.update',
        ]),
      ),
    ).resolves.toBe(true);
  });

  it('rejects request requiring MFA if session only has PASSWORD level', async () => {
    authService.getCurrentUser.mockResolvedValue({
      userId: 'usr-1',
      sessionId: 'sess-1',
      activeContext: null,
      capabilities: [],
      authenticationLevel: 'PASSWORD',
    });
    await expect(
      guard.canActivate(
        context({ cookies: { vnru_session: 'opaque-token' } }, undefined, true),
      ),
    ).rejects.toThrow(
      new ForbiddenException('Multi-factor authentication required'),
    );
  });

  it('allows request requiring MFA if session has MFA level', async () => {
    const request = { cookies: { vnru_session: 'opaque-token' } };
    const authContext = {
      userId: 'usr-1',
      sessionId: 'sess-1',
      activeContext: null,
      capabilities: [],
      authenticationLevel: 'MFA',
    };
    authService.getCurrentUser.mockResolvedValue(authContext);
    await expect(
      guard.canActivate(context(request, undefined, true)),
    ).resolves.toBe(true);
    expect(request).toMatchObject({ authContext });
  });
});
