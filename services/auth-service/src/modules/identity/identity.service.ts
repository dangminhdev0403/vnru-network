import { Inject, Injectable } from '@nestjs/common';

export const IDENTITY_PRISMA = 'IDENTITY_PRISMA';

export interface ResolveExternalIdentityInput {
  issuer: string;
  subject: string;
  email?: string;
}

export interface IdentityUser {
  id: string;
  email?: string | null;
  status: string;
}

export interface ExternalIdentityRecord {
  id: string;
  issuer: string;
  subject: string;
  userId: string;
  user?: IdentityUser;
}

export interface IdentityPrismaClient {
  externalIdentity: {
    findFirst: (args: {
      where: { userId: string };
      select: { subject: boolean };
    }) => Promise<{ subject: string } | null>;
    findUnique: (args: {
      where: { issuer_subject: { issuer: string; subject: string } };
      include?: { user: boolean };
    }) => Promise<ExternalIdentityRecord | null>;
    create: (args: {
      data: { issuer: string; subject: string; userId: string };
    }) => Promise<ExternalIdentityRecord>;
  };
  user: {
    findUnique: (args: {
      where: { id: string };
    }) => Promise<IdentityUser | null>;
    create: (args: {
      data: { email?: string; status?: string };
    }) => Promise<IdentityUser>;
  };
  $transaction: <T>(
    callback: (tx: IdentityPrismaClient) => Promise<T>,
  ) => Promise<T>;
}

@Injectable()
export class IdentityService {
  constructor(
    @Inject(IDENTITY_PRISMA)
    private readonly prisma: IdentityPrismaClient,
  ) {}

  async findById(id: string): Promise<IdentityUser | null> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return null;
    }

    return this.prisma.user.findUnique({
      where: { id: id.trim() },
    });
  }

  async findExternalSubject(userId: string): Promise<string | null> {
    const identity = await this.prisma.externalIdentity.findFirst({
      where: { userId },
      select: { subject: true },
    });
    return identity?.subject ?? null;
  }

  async resolveOrCreateByExternalIdentity(
    input: ResolveExternalIdentityInput,
  ): Promise<IdentityUser> {
    const existing = await this.prisma.externalIdentity.findUnique({
      where: {
        issuer_subject: {
          issuer: input.issuer,
          subject: input.subject,
        },
      },
      include: {
        user: true,
      },
    });

    if (existing?.user) {
      return existing.user;
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: input.email,
            status: 'ACTIVE',
          },
        });

        await tx.externalIdentity.create({
          data: {
            issuer: input.issuer,
            subject: input.subject,
            userId: user.id,
          },
        });

        return user;
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        const recovered = await this.prisma.externalIdentity.findUnique({
          where: {
            issuer_subject: {
              issuer: input.issuer,
              subject: input.subject,
            },
          },
          include: {
            user: true,
          },
        });

        if (recovered?.user) {
          return recovered.user;
        }
      }

      throw error;
    }
  }
}
