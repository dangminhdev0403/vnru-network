import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AuthenticationService,
  AuthenticatedUser,
} from './authentication.service';

export const SESSION_COOKIE_NAME = 'vnru_session';
const REQUIRED_PERMISSION = 'requiredPermission';

export interface RequestWithCookies {
  cookies?: unknown;
  headers?: {
    cookie?: string | string[] | undefined;
    Cookie?: string | string[] | undefined;
    [key: string]: unknown;
  };
  url?: string;
}

export interface AuthenticatedRequest extends RequestWithCookies {
  authContext?: AuthenticatedUser;
}

export const RequirePermission = (permission: string) =>
  SetMetadata(REQUIRED_PERMISSION, permission);

export const REQUIRE_MFA_KEY = 'requireMfa';
export const RequireMfa = () => SetMetadata(REQUIRE_MFA_KEY, true);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function extractSessionCookie(
  request: RequestWithCookies,
): string | undefined {
  if (isRecord(request.cookies)) {
    const value = request.cookies[SESSION_COOKIE_NAME];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  const raw = request.headers?.cookie ?? request.headers?.Cookie;
  const header = Array.isArray(raw) ? raw.join('; ') : raw;
  if (typeof header !== 'string') return undefined;

  for (const part of header.split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name !== SESSION_COOKIE_NAME || !value.length) continue;
    const token = value.join('=').trim();
    try {
      return decodeURIComponent(token);
    } catch {
      return token;
    }
  }
  return undefined;
}

@Injectable()
export class AuthenticatedRequestGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractSessionCookie(request);
    if (!token) throw new UnauthorizedException('Authentication required');

    const authContext = await this.authenticationService.getCurrentUser(token);
    if (!authContext) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const requireMfa = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_MFA_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requireMfa && authContext.authenticationLevel !== 'MFA') {
      throw new ForbiddenException('Multi-factor authentication required');
    }

    const permission = this.reflector.getAllAndOverride<string>(
      REQUIRED_PERMISSION,
      [context.getHandler(), context.getClass()],
    );
    if (
      permission &&
      (!authContext.activeContext ||
        !authContext.capabilities.includes(permission))
    ) {
      throw new ForbiddenException('Permission denied for active context');
    }

    request.authContext = authContext;
    return true;
  }
}
