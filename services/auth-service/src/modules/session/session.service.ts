import { Inject, Injectable, Optional } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';

export const SESSION_PRISMA = 'SESSION_PRISMA';

export const DEFAULT_MAX_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface CreateSessionInput {
  userId: string;
  ttlMs: number;
}

export interface SessionRecord {
  id: string;
  tokenDigest: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
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
  session: {
    create: (args: {
      data: {
        tokenDigest: string;
        userId: string;
        expiresAt: Date;
      };
    }) => Promise<SessionRecord>;
    findUnique: (args: {
      where: { tokenDigest: string };
    }) => Promise<SessionRecord | null>;
    updateMany: (args: {
      where: {
        tokenDigest?: string;
        userId?: string;
        revokedAt?: null;
      };
      data: { revokedAt: Date };
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
}
