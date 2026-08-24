import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { DEFAULT_MAX_SESSION_TTL_MS } from '../session/session-public';
import { SessionService } from '../session/session-public';
import {
  AuthenticatedUser,
  AuthenticationService,
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
import { IdentityService } from '../identity/identity.service';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

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
  ) {}

  private async profileUser(req: AuthenticatedRequest) {
    const userId = req.authContext?.userId;
    if (!userId) throw new UnauthorizedException('Authentication required');
    const user = await this.identityService.findById(userId);
    if (!user) throw new NotFoundException('Identity not found');
    return user;
  }

  @Get('profile')
  @UseGuards(AuthenticatedRequestGuard)
  async getProfile(@Req() req: AuthenticatedRequest): Promise<UserProfile> {
    const user = await this.profileUser(req);
    return {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
    };
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
    const userId = (await this.profileUser(req)).id;
    const user = await this.identityService.updateProfile(userId, {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
    });
    return {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
    };
  }

  @Get('mfa')
  @UseGuards(AuthenticatedRequestGuard)
  async getMfaStatus(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ enabled: false }> {
    await this.profileUser(req);
    return { enabled: false };
  }

  @Post('exchange')
  async exchange(
    @Body()
    body: {
      account?: unknown;
      timestamp?: unknown;
      signature?: unknown;
    },
  ): Promise<{ token: string }> {
    if (
      typeof body?.account !== 'string' ||
      !body.account.trim() ||
      typeof body.timestamp !== 'string' ||
      typeof body.signature !== 'string' ||
      !/^[a-f0-9]{64}$/i.test(body.signature)
    ) {
      throw new BadRequestException('Invalid authentication assertion');
    }
    const result = await this.authService.exchangeAuthJsAssertion({
      account: body.account.trim(),
      timestamp: body.timestamp,
      signature: body.signature,
    });
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
