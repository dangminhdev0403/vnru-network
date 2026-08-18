import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response } from 'express';
import { validateConfig } from '../../config';
import { DEFAULT_MAX_SESSION_TTL_MS } from '../session/session-public';
import {
  AuthenticatedUser,
  AuthenticationService,
  CallbackResult,
} from './authentication.service';

export const SESSION_COOKIE_NAME = 'vnru_session';

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: DEFAULT_MAX_SESSION_TTL_MS,
};

export interface RequestWithCookies {
  cookies?: unknown;
  headers?: {
    cookie?: string | string[] | undefined;
    Cookie?: string | string[] | undefined;
    [key: string]: unknown;
  };
  url?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractSessionCookie(req: RequestWithCookies): string | undefined {
  if (isRecord(req?.cookies)) {
    const val = req.cookies[SESSION_COOKIE_NAME];
    if (typeof val === 'string' && val.trim() !== '') {
      return val.trim();
    }
  }

  const rawCookie = req?.headers?.cookie ?? req?.headers?.Cookie;
  const cookieHeader = Array.isArray(rawCookie)
    ? rawCookie.join('; ')
    : typeof rawCookie === 'string'
      ? rawCookie
      : '';

  if (cookieHeader.trim() !== '') {
    const parts = cookieHeader.split(';');
    for (const part of parts) {
      const [rawName, ...rest] = part.trim().split('=');
      if (rawName === SESSION_COOKIE_NAME) {
        const val = rest.join('=').trim();
        if (val) {
          try {
            return decodeURIComponent(val);
          } catch {
            return val;
          }
        }
      }
    }
  }

  return undefined;
}

@Controller('api/v1/auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  private getConfiguredRedirectUri(): string {
    return validateConfig().KEYCLOAK_REDIRECT_URI;
  }

  @Get('login')
  async login(@Res() res: Response): Promise<void> {
    const { authorizationUrl } = await this.authService.beginLogin();
    res.redirect(authorizationUrl);
  }

  @Get('callback')
  async callback(
    @Query() query: Record<string, string | undefined>,
    @Req() _req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Pick<CallbackResult, 'user'>> {
    if (!query || typeof query.state !== 'string' || !query.state.trim()) {
      throw new BadRequestException('Missing or invalid state parameter');
    }
    if (typeof query.code !== 'string' || !query.code.trim()) {
      throw new BadRequestException('Missing or invalid code parameter');
    }

    const configuredRedirectUri = this.getConfiguredRedirectUri();
    const callbackUrl = new URL(configuredRedirectUri);
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === 'string') {
        callbackUrl.searchParams.set(key, value);
      }
    }

    const result = await this.authService.handleCallback({
      currentUrl: callbackUrl.toString(),
      state: query.state.trim(),
    });

    res.cookie(SESSION_COOKIE_NAME, result.token, SESSION_COOKIE_OPTIONS);

    return {
      user: result.user,
    };
  }

  @Get('me')
  async me(@Req() req: RequestWithCookies): Promise<AuthenticatedUser> {
    const token = extractSessionCookie(req);
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    const user = await this.authService.getCurrentUser(token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return user;
  }

  @Post('logout')
  async logout(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean }> {
    const token = extractSessionCookie(req) ?? '';
    await this.authService.logout(token);

    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    return { ok: true };
  }
}
