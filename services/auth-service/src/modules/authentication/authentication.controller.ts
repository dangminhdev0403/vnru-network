import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { validateConfig } from '../../config';
import { DEFAULT_MAX_SESSION_TTL_MS } from '../session/session-public';
import { SessionService } from '../session/session-public';
import {
  AuthenticatedUser,
  AuthenticationService,
  CallbackResult,
} from './authentication.service';
import {
  AuthenticatedRequestGuard,
  extractSessionCookie,
  SESSION_COOKIE_NAME,
} from './authenticated-request-context';
import type {
  AuthenticatedRequest,
  RequestWithCookies,
} from './authenticated-request-context';

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: DEFAULT_MAX_SESSION_TTL_MS,
};

@Controller('api/v1/auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly sessionService: SessionService,
  ) {}

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

  @Post('context')
  async switchContext(
    @Body() body: { contextType?: unknown; contextId?: unknown },
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ contextType: string; contextId: string }> {
    const token = extractSessionCookie(req);
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }
    if (
      typeof body?.contextType !== 'string' ||
      !body.contextType.trim() ||
      typeof body?.contextId !== 'string' ||
      !body.contextId.trim()
    ) {
      throw new BadRequestException('Context type and id are required');
    }

    const target = {
      contextType: body.contextType.trim(),
      contextId: body.contextId.trim(),
    };
    try {
      const result = await this.sessionService.switchContext(token, target);
      res.cookie(SESSION_COOKIE_NAME, result.token, SESSION_COOKIE_OPTIONS);
      return target;
    } catch {
      throw new ForbiddenException('Context switch denied');
    }
  }

  @Post('logout')
  async logout(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean; logoutUrl: string }> {
    const token = extractSessionCookie(req) ?? '';
    await this.authService.logout(token);

    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    const config = validateConfig();
    const postLogoutRedirectUri = new URL('/', config.KEYCLOAK_REDIRECT_URI);
    const logoutUrl = new URL(
      `${config.KEYCLOAK_ISSUER_URL.replace(/\/$/, '')}/protocol/openid-connect/logout`,
    );
    logoutUrl.searchParams.set('client_id', config.KEYCLOAK_CLIENT_ID);
    logoutUrl.searchParams.set(
      'post_logout_redirect_uri',
      postLogoutRedirectUri.href,
    );

    return { ok: true, logoutUrl: logoutUrl.href };
  }

  @Get('sessions')
  @UseGuards(AuthenticatedRequestGuard)
  async getSessions(@Req() req: AuthenticatedRequest) {
    const authContext = req.authContext;
    if (!authContext) {
      throw new UnauthorizedException('Authentication required');
    }

    const sessions = await this.sessionService.getActiveSessionsForUser(
      authContext.userId,
    );

    return sessions.map((session) => ({
      id: session.id,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      activeContext:
        session.activeContextType && session.activeContextId
          ? {
              contextType: session.activeContextType,
              contextId: session.activeContextId,
            }
          : null,
      current: session.id === authContext.sessionId,
    }));
  }

  @Delete('sessions/:sessionId')
  @UseGuards(AuthenticatedRequestGuard)
  async revokeSession(
    @Param('sessionId') sessionId: string,
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean }> {
    if (!sessionId || !sessionId.trim()) {
      throw new BadRequestException('Session ID is required');
    }

    const authContext = req.authContext;
    if (!authContext) {
      throw new UnauthorizedException('Authentication required');
    }

    const session = await this.sessionService.getSessionById(sessionId.trim());
    if (!session || session.userId !== authContext.userId) {
      throw new NotFoundException('Session not found');
    }

    const success = await this.sessionService.revokeSessionByIdForUser(
      sessionId.trim(),
      authContext.userId,
    );
    if (!success) {
      throw new NotFoundException('Session not found or not owned by user');
    }

    if (session.id === authContext.sessionId) {
      res.clearCookie(SESSION_COOKIE_NAME, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      });
    }

    return { ok: true };
  }

  @Delete('sessions')
  @UseGuards(AuthenticatedRequestGuard)
  async revokeOtherSessions(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ ok: boolean }> {
    const authContext = req.authContext;
    if (!authContext) {
      throw new UnauthorizedException('Authentication required');
    }

    await this.sessionService.revokeOtherSessionsForUser(
      authContext.userId,
      authContext.sessionId,
    );

    return { ok: true };
  }
}
