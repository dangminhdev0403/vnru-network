import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { validateConfig } from '../../config';
import { AccessControlService } from '../access-control/access-control.service';
import { IdentityService, IdentityUser } from '../identity/identity-public';
import {
  DEFAULT_MAX_SESSION_TTL_MS,
  SessionService,
} from '../session/session-public';

export const AUTHJS_CREDENTIALS_ISSUER = 'authjs:credentials';
const BRIDGE_MAX_AGE_MS = 30_000;

export interface CallbackResult {
  token: string;
  user: IdentityUser;
}
export type ExchangeResult = CallbackResult;
export interface AuthJsExchangeInput {
  account: string;
  timestamp: string;
  signature: string;
}

export interface AuthenticatedUser {
  userId: string;
  email: string | null;
  fullName: string | null;
  roles: string[];
  sessionId: string;
  activeContext: { contextType: string; contextId: string } | null;
  capabilities: string[];
  authenticationLevel: 'PASSWORD' | 'MFA';
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly identityService: IdentityService,
    private readonly sessionService: SessionService,
    private readonly accessControlService: AccessControlService,
  ) {}

  async exchangeAuthJsAssertion(
    input: AuthJsExchangeInput,
  ): Promise<ExchangeResult> {
    const timestamp = Number(input.timestamp);
    if (
      !Number.isSafeInteger(timestamp) ||
      Math.abs(Date.now() - timestamp) > BRIDGE_MAX_AGE_MS
    ) {
      throw new UnauthorizedException('Expired authentication assertion');
    }
    const expected = createHmac('sha256', validateConfig().AUTH_BRIDGE_SECRET)
      .update(`${input.timestamp}\n${input.account}`)
      .digest();
    const supplied = Buffer.from(input.signature, 'hex');
    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      throw new UnauthorizedException('Invalid authentication assertion');
    }

    const user = await this.identityService.resolveOrCreateByExternalIdentity({
      issuer: AUTHJS_CREDENTIALS_ISSUER,
      subject: input.account,
      email: input.account.includes('@') ? input.account : undefined,
    });
    if (user.status !== 'ACTIVE')
      throw new UnauthorizedException('Identity is inactive or unauthorized');
    const session = await this.sessionService.createSession({
      userId: user.id,
      ttlMs: DEFAULT_MAX_SESSION_TTL_MS,
      authenticationLevel: 'PASSWORD',
    });
    return { token: session.token, user };
  }

  async getCurrentUser(
    token?: string | null,
  ): Promise<AuthenticatedUser | null> {
    if (!token?.trim()) return null;
    const session = await this.sessionService.validateSession(token.trim());
    if (!session) return null;
    const user = await this.identityService.findById(session.userId);
    if (!user || user.status !== 'ACTIVE') return null;
    const activeContext =
      session.activeContextType && session.activeContextId
        ? {
            contextType: session.activeContextType,
            contextId: session.activeContextId,
          }
        : null;
    const authorizationInput = activeContext
      ? { userId: session.userId, ...activeContext }
      : null;
    const [capabilities, roles] = authorizationInput
      ? await Promise.all([
          this.accessControlService.resolveCapabilities(authorizationInput),
          this.accessControlService.resolveActiveRoleNames(authorizationInput),
        ])
      : [[], []];
    const fullName =
      [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || null;
    return {
      userId: session.userId,
      email: user.email ?? null,
      fullName,
      roles,
      sessionId: session.id,
      activeContext,
      capabilities,
      authenticationLevel: session.authenticationLevel,
    };
  }

  async logout(token?: string | null): Promise<void> {
    if (token?.trim()) await this.sessionService.revokeSession(token.trim());
  }
}
