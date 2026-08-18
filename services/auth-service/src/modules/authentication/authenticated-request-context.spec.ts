import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticationService } from './authentication.service';
import {
  AuthenticatedRequestGuard,
  RequirePermission,
} from './authenticated-request-context';

function context(request: object, permission?: string): ExecutionContext {
  const handler = () => undefined;
  if (permission) RequirePermission(permission)(handler);
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
    };
    authService.getCurrentUser.mockResolvedValue(authContext);
    await expect(
      guard.canActivate(context(request, 'research.read')),
    ).resolves.toBe(true);
    expect(request).toMatchObject({ authContext });
  });
});
