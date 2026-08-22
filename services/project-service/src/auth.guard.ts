import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

export interface AuthenticatedUser {
  userId: string;
  sessionId: string;
  activeContext: { contextType: string; contextId: string } | null;
  capabilities: string[];
  authenticationLevel: 'PASSWORD' | 'MFA';
}

function isAuthenticatedUser(value: unknown): value is AuthenticatedUser {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const user = value as Record<string, unknown>;
  if (Object.keys(user).some((key) => !['userId', 'sessionId', 'activeContext', 'capabilities', 'authenticationLevel'].includes(key))) return false;
  const active = user.activeContext;
  return typeof user.userId === 'string' && !!user.userId && typeof user.sessionId === 'string' && !!user.sessionId
    && (user.authenticationLevel === 'PASSWORD' || user.authenticationLevel === 'MFA')
    && Array.isArray(user.capabilities) && user.capabilities.every((item) => typeof item === 'string')
    && !!active && typeof active === 'object' && !Array.isArray(active) && Object.keys(active).length === 2
    && typeof (active as Record<string, unknown>).contextType === 'string'
    && typeof (active as Record<string, unknown>).contextId === 'string';
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const cookie = request.headers.cookie;
    const authorization = request.headers.authorization;
    if (!cookie && !authorization) throw new UnauthorizedException('Authentication required');
    const baseUrl = process.env.AUTH_SERVICE_URL;
    if (!baseUrl) throw new ForbiddenException('AUTH_SERVICE_URL not configured');
    let response: Response;
    try {
      response = await fetch(`${baseUrl}/api/v1/auth/me`, {
        headers: { ...(cookie ? { cookie: String(cookie) } : {}), ...(authorization ? { authorization: String(authorization) } : {}) },
        signal: AbortSignal.timeout(3000),
      });
    } catch { throw new ForbiddenException('Authentication service unavailable'); }
    if (!response.ok) throw new UnauthorizedException('Invalid or expired session');
    let user: unknown;
    try { user = await response.json(); } catch { throw new ForbiddenException('Malformed authentication response'); }
    if (!isAuthenticatedUser(user)) throw new ForbiddenException('Malformed authentication response');
    request.user = user;
    return true;
  }
}
