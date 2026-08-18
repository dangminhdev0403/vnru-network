import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { validateConfig } from '../../config';
import { IdentityService, IdentityUser } from '../identity/identity-public';
import {
  DEFAULT_MAX_SESSION_TTL_MS,
  SessionService,
} from '../session/session-public';
import { KeycloakOidcService } from './keycloak-oidc.service';

export interface BeginLoginInput {
  redirectUri?: string;
}

export interface BeginLoginResult {
  authorizationUrl: string;
}

export interface HandleCallbackInput {
  currentUrl: string;
  state: string;
}

export interface CallbackResult {
  token: string;
  user: IdentityUser;
}

export interface AuthenticatedUser {
  userId: string;
  sessionId: string;
}

interface TransientStateEntry {
  nonce: string;
  codeVerifier: string;
  expiresAt: number;
}

@Injectable()
export class AuthenticationService {
  // ponytail: single-process transient store, move to shared TTL store only when horizontal scaling.
  private readonly transientStates = new Map<string, TransientStateEntry>();
  private readonly stateTtlMs = 10 * 60 * 1000; // 10 minutes

  constructor(
    private readonly oidcService: KeycloakOidcService,
    private readonly identityService: IdentityService,
    private readonly sessionService: SessionService,
  ) {}

  private cleanupExpiredStates(): void {
    const now = Date.now();
    for (const [state, entry] of this.transientStates.entries()) {
      if (now >= entry.expiresAt) {
        this.transientStates.delete(state);
      }
    }
  }

  private getConfiguredRedirectUri(): string {
    return validateConfig().KEYCLOAK_REDIRECT_URI;
  }

  async beginLogin(params?: BeginLoginInput): Promise<BeginLoginResult> {
    this.cleanupExpiredStates();

    const configured = this.getConfiguredRedirectUri();
    let redirectUri: string;
    if (params?.redirectUri) {
      if (params.redirectUri !== configured) {
        throw new Error('Redirect URI mismatch');
      }
      redirectUri = params.redirectUri;
    } else {
      redirectUri = configured;
    }

    const state = randomBytes(32).toString('base64url');
    const nonce = randomBytes(32).toString('base64url');
    const codeVerifier = randomBytes(32).toString('base64url');
    const codeChallenge = createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    this.transientStates.set(state, {
      nonce,
      codeVerifier,
      expiresAt: Date.now() + this.stateTtlMs,
    });

    try {
      const authorizationUrl =
        await this.oidcService.createAuthorizationRequest({
          redirectUri,
          state,
          nonce,
          codeChallenge,
          codeChallengeMethod: 'S256',
        });

      return { authorizationUrl };
    } catch (error) {
      this.transientStates.delete(state);
      throw error;
    }
  }

  async handleCallback(params: HandleCallbackInput): Promise<CallbackResult> {
    this.cleanupExpiredStates();

    if (
      !params?.state ||
      typeof params.state !== 'string' ||
      params.state.trim() === ''
    ) {
      throw new UnauthorizedException('Missing or invalid state parameter');
    }

    const entry = this.transientStates.get(params.state);
    if (!entry) {
      throw new UnauthorizedException('State not found or already consumed');
    }

    // Consume and delete BEFORE async provider work for single-use / replay protection
    this.transientStates.delete(params.state);

    if (Date.now() >= entry.expiresAt) {
      throw new UnauthorizedException('Expired state parameter');
    }

    const oidcUser = await this.oidcService.handleCallback({
      currentUrl: params.currentUrl,
      expectedState: params.state,
      expectedNonce: entry.nonce,
      codeVerifier: entry.codeVerifier,
    });

    const user = await this.identityService.resolveOrCreateByExternalIdentity({
      issuer: oidcUser.issuer,
      subject: oidcUser.subject,
      email: oidcUser.email,
    });

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Identity is inactive or unauthorized');
    }

    const sessionResult = await this.sessionService.createSession({
      userId: user.id,
      ttlMs: DEFAULT_MAX_SESSION_TTL_MS,
    });

    return {
      token: sessionResult.token,
      user,
    };
  }

  async getCurrentUser(
    token?: string | null,
  ): Promise<AuthenticatedUser | null> {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      return null;
    }

    const session = await this.sessionService.validateSession(token.trim());
    if (!session) {
      return null;
    }

    return {
      userId: session.userId,
      sessionId: session.id,
    };
  }

  async logout(token?: string | null): Promise<void> {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      return;
    }

    await this.sessionService.revokeSession(token.trim());
  }
}
