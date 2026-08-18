import {
  ExternalIdentityRecord,
  IdentityPrismaClient,
  IdentityService,
  IdentityUser,
} from './identity.service';

describe('IdentityService', () => {
  let service: IdentityService;
  let prisma: {
    externalIdentity: {
      findUnique: jest.Mock<
        Promise<ExternalIdentityRecord | null>,
        [
          {
            where: { issuer_subject: { issuer: string; subject: string } };
            include?: { user: boolean };
          },
        ]
      >;
      create: jest.Mock<
        Promise<ExternalIdentityRecord>,
        [{ data: { issuer: string; subject: string; userId: string } }]
      >;
    };
    user: {
      create: jest.Mock<
        Promise<IdentityUser>,
        [{ data: { email?: string; status?: string } }]
      >;
    };
    $transaction: jest.Mock<
      Promise<unknown>,
      [(tx: IdentityPrismaClient) => Promise<unknown>]
    >;
  };

  beforeEach(() => {
    prisma = {
      externalIdentity: {
        findUnique: jest.fn<
          Promise<ExternalIdentityRecord | null>,
          [
            {
              where: { issuer_subject: { issuer: string; subject: string } };
              include?: { user: boolean };
            },
          ]
        >(),
        create: jest.fn<
          Promise<ExternalIdentityRecord>,
          [{ data: { issuer: string; subject: string; userId: string } }]
        >(),
      },
      user: {
        create: jest.fn<
          Promise<IdentityUser>,
          [{ data: { email?: string; status?: string } }]
        >(),
      },
      $transaction: jest.fn(
        async <T>(
          callback: (tx: IdentityPrismaClient) => Promise<T>,
        ): Promise<T> => callback(prisma as unknown as IdentityPrismaClient),
      ),
    };

    service = new IdentityService(prisma as unknown as IdentityPrismaClient);
  });

  it('returns existing user when external identity linkage exists', async () => {
    const existingUser: IdentityUser = {
      id: 'usr-1',
      status: 'ACTIVE',
      email: 'user1@example.com',
    };

    prisma.externalIdentity.findUnique.mockResolvedValue({
      id: 'ext-1',
      issuer: 'https://idp.example.com',
      subject: 'sub-101',
      userId: existingUser.id,
      user: existingUser,
    });

    const result = await service.resolveOrCreateByExternalIdentity({
      issuer: 'https://idp.example.com',
      subject: 'sub-101',
      email: 'user1@example.com',
    });

    expect(result).toEqual(existingUser);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('atomically creates user and external identity when linkage is absent', async () => {
    prisma.externalIdentity.findUnique.mockResolvedValue(null);

    const newUser: IdentityUser = {
      id: 'usr-2',
      status: 'ACTIVE',
      email: 'user2@example.com',
    };

    prisma.user.create.mockResolvedValue(newUser);
    prisma.externalIdentity.create.mockResolvedValue({
      id: 'ext-2',
      issuer: 'https://idp.example.com',
      subject: 'sub-202',
      userId: newUser.id,
    });

    const result = await service.resolveOrCreateByExternalIdentity({
      issuer: 'https://idp.example.com',
      subject: 'sub-202',
      email: 'user2@example.com',
    });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'user2@example.com',
        status: 'ACTIVE',
      },
    });
    expect(prisma.externalIdentity.create).toHaveBeenCalledWith({
      data: {
        issuer: 'https://idp.example.com',
        subject: 'sub-202',
        userId: newUser.id,
      },
    });
    expect(result).toEqual(newUser);
  });

  it('returns inactive user with status for caller denial when linkage resolves to inactive account', async () => {
    const inactiveUser: IdentityUser = {
      id: 'usr-3',
      status: 'INACTIVE',
      email: 'user3@example.com',
    };

    prisma.externalIdentity.findUnique.mockResolvedValue({
      id: 'ext-3',
      issuer: 'https://idp.example.com',
      subject: 'sub-303',
      userId: inactiveUser.id,
      user: inactiveUser,
    });

    const result = await service.resolveOrCreateByExternalIdentity({
      issuer: 'https://idp.example.com',
      subject: 'sub-303',
      email: 'user3@example.com',
    });

    expect(result).toEqual(inactiveUser);
    expect(result.status).toBe('INACTIVE');
  });

  it('recovers by fetching existing linkage if creation races and encounters a unique constraint violation', async () => {
    prisma.externalIdentity.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'ext-race',
        issuer: 'https://idp.example.com',
        subject: 'sub-race',
        userId: 'usr-race',
        user: {
          id: 'usr-race',
          status: 'ACTIVE',
          email: 'race@example.com',
        },
      });

    prisma.$transaction.mockRejectedValueOnce({
      code: 'P2002',
    });

    const result = await service.resolveOrCreateByExternalIdentity({
      issuer: 'https://idp.example.com',
      subject: 'sub-race',
      email: 'race@example.com',
    });

    expect(result).toEqual({
      id: 'usr-race',
      status: 'ACTIVE',
      email: 'race@example.com',
    });
  });

  it('rethrows non-P2002 errors without attempting recovery', async () => {
    prisma.externalIdentity.findUnique.mockResolvedValueOnce(null);

    const genericError = new Error('Database connection failed');
    prisma.$transaction.mockRejectedValueOnce(genericError);

    await expect(
      service.resolveOrCreateByExternalIdentity({
        issuer: 'https://idp.example.com',
        subject: 'sub-error',
        email: 'error@example.com',
      }),
    ).rejects.toThrow('Database connection failed');

    expect(prisma.externalIdentity.findUnique).toHaveBeenCalledTimes(1);
  });
});
