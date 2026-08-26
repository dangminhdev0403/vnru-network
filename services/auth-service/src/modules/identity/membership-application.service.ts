import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IDENTITY_PRISMA } from './identity.service';

export interface MembershipApplicationPrismaClient {
  membershipApplication: {
    create: (args: {
      data: {
        fullName: string;
        email: string;
        organization: string;
        professionalRole: string;
        interest: string;
      };
      select: { id: true; status: true; submittedAt: true };
    }) => Promise<{
      id: string;
      status: string;
      submittedAt: Date;
    }>;
  };
}

@Injectable()
export class MembershipApplicationService {
  constructor(
    @Inject(IDENTITY_PRISMA)
    private readonly prisma: MembershipApplicationPrismaClient,
  ) {}

  async create(data: {
    fullName: string;
    email: string;
    organization: string;
    professionalRole: string;
    interest: string;
  }) {
    try {
      return await this.prisma.membershipApplication.create({
        data,
        select: { id: true, status: true, submittedAt: true },
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'A pending application already exists for this email',
        );
      }
      throw error;
    }
  }
}
