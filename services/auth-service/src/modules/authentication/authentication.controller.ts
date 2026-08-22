import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
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
  RequireMfa,
  SESSION_COOKIE_NAME,
} from './authenticated-request-context';
import type {
  AuthenticatedRequest,
  RequestWithCookies,
} from './authenticated-request-context';
import { IdentityService } from '../identity/identity.service';
import {
  KeycloakProfileService,
  MfaStatus,
  UserProfile,
} from './keycloak-profile.service';

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
    private readonly identityService: IdentityService,
    private readonly profileService: KeycloakProfileService,
  ) {}

  private async profileSubject(req: AuthenticatedRequest): Promise<string> {
    const userId = req.authContext?.userId;
    if (!userId) throw new UnauthorizedException('Authentication required');
    const subject = await this.identityService.findExternalSubject(userId);
    if (!subject) throw new NotFoundException('External identity not found');
    return subject;
  }

  @Get('profile')
  @UseGuards(AuthenticatedRequestGuard)
  async getProfile(@Req() req: AuthenticatedRequest): Promise<UserProfile> {
    return this.profileService.get(await this.profileSubject(req));
  }

  @Patch('profile')
  @UseGuards(AuthenticatedRequestGuard)
  async updateProfile(
    @Body() body: { firstName?: unknown; lastName?: unknown },
    @Req() req: AuthenticatedRequest,
  ): Promise<UserProfile> {
    if (
      typeof body?.firstName !== 'string' ||
      typeof body?.lastName !== 'string' ||
      body.firstName.trim().length > 100 ||
      body.lastName.trim().length > 100
    ) {
      throw new BadRequestException('Invalid profile');
    }
    return this.profileService.update(await this.profileSubject(req), {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
    });
  }

  @Get('mfa')
  @UseGuards(AuthenticatedRequestGuard)
  async getMfaStatus(@Req() req: AuthenticatedRequest): Promise<MfaStatus> {
    return this.profileService.getMfaStatus(await this.profileSubject(req));
  }

  @Delete('mfa')
  @UseGuards(AuthenticatedRequestGuard)
  @RequireMfa()
  async disableMfa(@Req() req: AuthenticatedRequest): Promise<MfaStatus> {
    return this.profileService.disableMfa(await this.profileSubject(req));
  }

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

  @Post('exchange')
  async exchange(
    @Headers('authorization') authorization?: string,
  ): Promise<{ token: string }> {
    const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!accessToken) throw new UnauthorizedException('Bearer token required');
    const result = await this.authService.exchangeKeycloakToken(accessToken);
    return { token: result.token };
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
    const currentUser = await this.authService.getCurrentUser(token);
    if (currentUser) {
      const subject = await this.identityService.findExternalSubject(
        currentUser.userId,
      );
      if (subject) await this.profileService.logout(subject);
    }
    await this.authService.logout(token);

    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    return { ok: true, logoutUrl: '/' };
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
