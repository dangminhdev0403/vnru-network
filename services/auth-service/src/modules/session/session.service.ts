import { Inject, Injectable, Optional } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import {
  AccessControlService,
  AccessControlPrismaClient,
} from '../access-control/access-control.service';

export const SESSION_PRISMA = 'SESSION_PRISMA';

export const DEFAULT_MAX_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface CreateSessionInput {
  userId: string;
  ttlMs: number;
  authenticationLevel?: 'PASSWORD' | 'MFA';
}

export interface SessionRecord {
  id: string;
  tokenDigest: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  activeContextType: string | null;
  activeContextId: string | null;
  authenticationLevel: 'PASSWORD' | 'MFA';
}

export interface CreateSessionResult {
  token: string;
  session: SessionRecord;
}

export interface SessionServiceOptions {
  generateToken?: () => string;
  hashToken?: (token: string) => string;
  now?: () => Date;
  maxTtlMs?: number;
}

export interface SessionPrismaClient {
  $transaction?: <T>(
    fn: (tx: SessionPrismaClient & AccessControlPrismaClient) => Promise<T>,
  ) => Promise<T>;
  session: {
    create: (args: {
      data: {
        tokenDigest: string;
        userId: string;
        expiresAt: Date;
        activeContextType?: string | null;
        activeContextId?: string | null;
        authenticationLevel?: 'PASSWORD' | 'MFA';
      };
    }) => Promise<SessionRecord>;
    findUnique: (args: {
      where: { tokenDigest: string };
    }) => Promise<SessionRecord | null>;
    updateMany: (args: {
      where: {
        id?: string;
        tokenDigest?: string;
        userId?: string;
        revokedAt?: null;
        expiresAt?: { gt: Date };
      };
      data: {
        tokenDigest?: string;
        revokedAt?: Date;
        activeContextType?: string | null;
        activeContextId?: string | null;
      };
    }) => Promise<{ count: number }>;
  };
}

@Injectable()
export class SessionService {
  private readonly generateToken: () => string;
  private readonly hashToken: (token: string) => string;
  private readonly now: () => Date;
  private readonly maxTtlMs: number;

  constructor(
    @Inject(SESSION_PRISMA)
    private readonly prisma: SessionPrismaClient,
    private readonly accessControlService: AccessControlService,
    @Optional()
    options?: SessionServiceOptions,
  ) {
    this.generateToken =
      options?.generateToken ?? (() => randomBytes(32).toString('base64url'));
    this.hashToken =
      options?.hashToken ??
      ((token: string) => createHash('sha256').update(token).digest('hex'));
    this.now = options?.now ?? (() => new Date());
    this.maxTtlMs = options?.maxTtlMs ?? DEFAULT_MAX_SESSION_TTL_MS;
  }

  async createSession(input: CreateSessionInput): Promise<CreateSessionResult> {
    if (!Number.isFinite(input.ttlMs) || input.ttlMs <= 0) {
      throw new Error('Session TTL must be a positive number');
    }

    const effectiveTtlMs = Math.min(input.ttlMs, this.maxTtlMs);
    const token = this.generateToken();
    const tokenDigest = this.hashToken(token);
    const now = this.now();
    const expiresAt = new Date(now.getTime() + effectiveTtlMs);

    const session = await this.prisma.session.create({
      data: {
        tokenDigest,
        userId: input.userId,
        expiresAt,
        authenticationLevel: input.authenticationLevel ?? 'PASSWORD',
      },
    });

    return {
      token,
      session,
    };
  }

  async validateSession(token: string): Promise<SessionRecord | null> {
    const tokenDigest = this.hashToken(token);
    const session = await this.prisma.session.findUnique({
      where: { tokenDigest },
    });

    if (!session) {
      return null;
    }

    if (session.revokedAt !== null) {
      return null;
    }

    const now = this.now();
    if (session.expiresAt.getTime() <= now.getTime()) {
      return null;
    }

    return session;
  }

  async revokeSession(token: string): Promise<void> {
    const tokenDigest = this.hashToken(token);
    const now = this.now();

    await this.prisma.session.updateMany({
      where: {
        tokenDigest,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    const now = this.now();

    await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    });
  }

  async switchContext(
    currentPlainToken: string,
    target: { contextType: string; contextId: string },
  ): Promise<{ token: string; session: SessionRecord }> {
    const oldDigest = this.hashToken(currentPlainToken);
    const newPlainToken = this.generateToken();
    const newDigest = this.hashToken(newPlainToken);
    const now = this.now();

    if (!this.prisma.$transaction) {
      throw new Error('Prisma transaction client not available');
    }

    const updatedSession = await this.prisma.$transaction(
      async (tx: SessionPrismaClient & AccessControlPrismaClient) => {
        const session = await tx.session.findUnique({
          where: { tokenDigest: oldDigest },
        });

        if (!session) {
          throw new Error('Session not found');
        }
        if (session.revokedAt !== null) {
          throw new Error('Session is revoked');
        }
        if (session.expiresAt.getTime() <= now.getTime()) {
          throw new Error('Session is expired');
        }

        const hasActive = await this.accessControlService.hasActiveAssignment(
          session.userId,
          target.contextType,
          target.contextId,
          tx,
        );

        if (!hasActive) {
          throw new Error(
            'Active role assignment not found for target context',
          );
        }

        const updateResult = await tx.session.updateMany({
          where: {
            id: session.id,
            tokenDigest: oldDigest,
            userId: session.userId,
            revokedAt: null,
            expiresAt: { gt: now },
          },
          data: {
            tokenDigest: newDigest,
            activeContextType: target.contextType,
            activeContextId: target.contextId,
          },
        });

        if (updateResult.count !== 1) {
          throw new Error('Concurrent/stale session update detected');
        }

        const resultSession = await tx.session.findUnique({
          where: { tokenDigest: newDigest },
        });

        if (!resultSession) {
          throw new Error('Failed to retrieve updated session');
        }

        return resultSession;
      },
    );

    return {
      token: newPlainToken,
      session: updatedSession,
    };
  }
}
