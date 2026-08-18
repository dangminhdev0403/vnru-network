import { SessionRecord, SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  let prisma: {
    session: {
      create: jest.Mock<
        Promise<SessionRecord>,
        [{ data: { tokenDigest: string; userId: string; expiresAt: Date } }]
      >;
      findUnique: jest.Mock<
        Promise<SessionRecord | null>,
        [{ where: { tokenDigest: string } }]
      >;
      updateMany: jest.Mock<
        Promise<{ count: number }>,
        [
          {
            where: {
              tokenDigest?: string;
              userId?: string;
              revokedAt?: null;
            };
            data: { revokedAt: Date };
          },
        ]
      >;
    };
  };

  const fixedNow = new Date('2026-08-18T00:00:00.000Z');
  const syntheticToken = 'synthetic-opaque-token-xyz789';
  const syntheticDigest = 'synthetic-sha256-digest-abc123';

  beforeEach(() => {
    prisma = {
      session: {
        create: jest.fn<
          Promise<SessionRecord>,
          [{ data: { tokenDigest: string; userId: string; expiresAt: Date } }]
        >(),
        findUnique: jest.fn<
          Promise<SessionRecord | null>,
          [{ where: { tokenDigest: string } }]
        >(),
        updateMany: jest.fn<
          Promise<{ count: number }>,
          [
            {
              where: {
                tokenDigest?: string;
                userId?: string;
                revokedAt?: null;
              };
              data: { revokedAt: Date };
            },
          ]
        >(),
      },
    };

    service = new SessionService(prisma, {
      generateToken: () => syntheticToken,
      hashToken: (token: string) =>
        token === syntheticToken ? syntheticDigest : `hashed-${token}`,
      now: () => fixedNow,
    });
  });

  describe('createSession', () => {
    it('returns plaintext token once and persists only SHA-256 digest, userId, and bounded expiresAt', async () => {
      const ttlMs = 1000 * 60 * 60 * 24; // 24 hours
      const expectedExpiresAt = new Date(fixedNow.getTime() + ttlMs);
      const createdRecord: SessionRecord = {
        id: 'sess-1',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: expectedExpiresAt,
        createdAt: fixedNow,
        revokedAt: null,
      };

      prisma.session.create.mockResolvedValue(createdRecord);

      const result = await service.createSession({
        userId: 'usr-1',
        ttlMs,
      });

      expect(prisma.session.create).toHaveBeenCalledTimes(1);
      expect(prisma.session.create).toHaveBeenCalledWith({
        data: {
          tokenDigest: syntheticDigest,
          userId: 'usr-1',
          expiresAt: expectedExpiresAt,
        },
      });
      expect(result).toEqual({
        token: syntheticToken,
        session: createdRecord,
      });
    });

    it('rejects non-positive ttlMs', async () => {
      await expect(
        service.createSession({
          userId: 'usr-1',
          ttlMs: 0,
        }),
      ).rejects.toThrow('Session TTL must be a positive number');

      await expect(
        service.createSession({
          userId: 'usr-1',
          ttlMs: -1000,
        }),
      ).rejects.toThrow('Session TTL must be a positive number');
    });

    it('caps ttlMs at maxTtlMs configuration', async () => {
      const cappedService = new SessionService(prisma, {
        generateToken: () => syntheticToken,
        hashToken: () => syntheticDigest,
        now: () => fixedNow,
        maxTtlMs: 1000 * 60 * 60, // 1 hour cap
      });

      const requestedTtlMs = 1000 * 60 * 60 * 24; // 24 hours
      const expectedExpiresAt = new Date(fixedNow.getTime() + 1000 * 60 * 60);

      const createdRecord: SessionRecord = {
        id: 'sess-capped',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: expectedExpiresAt,
        createdAt: fixedNow,
        revokedAt: null,
      };
      prisma.session.create.mockResolvedValue(createdRecord);

      await cappedService.createSession({
        userId: 'usr-1',
        ttlMs: requestedTtlMs,
      });

      expect(prisma.session.create).toHaveBeenCalledWith({
        data: {
          tokenDigest: syntheticDigest,
          userId: 'usr-1',
          expiresAt: expectedExpiresAt,
        },
      });
    });

    it('uses production default crypto generators when options are omitted', async () => {
      const defaultService = new SessionService(prisma);

      const createdRecord: SessionRecord = {
        id: 'sess-default',
        tokenDigest: 'any-digest',
        userId: 'usr-default',
        expiresAt: new Date(Date.now() + 10000),
        createdAt: new Date(),
        revokedAt: null,
      };
      prisma.session.create.mockResolvedValue(createdRecord);

      const result = await defaultService.createSession({
        userId: 'usr-default',
        ttlMs: 10000,
      });

      expect(typeof result.token).toBe('string');
      expect(result.token.length).toBeGreaterThan(0);
      expect(prisma.session.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateSession', () => {
    it('hashes presented token and returns active session when valid and unexpired', async () => {
      const activeRecord: SessionRecord = {
        id: 'sess-1',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() + 60000),
        createdAt: fixedNow,
        revokedAt: null,
      };

      prisma.session.findUnique.mockResolvedValue(activeRecord);

      const result = await service.validateSession(syntheticToken);

      expect(prisma.session.findUnique).toHaveBeenCalledWith({
        where: { tokenDigest: syntheticDigest },
      });
      expect(result).toEqual(activeRecord);
    });

    it('returns null and fails closed when session record is not found', async () => {
      prisma.session.findUnique.mockResolvedValue(null);

      const result = await service.validateSession('missing-token');

      expect(result).toBeNull();
    });

    it('returns null and fails closed when session is expired', async () => {
      const expiredRecord: SessionRecord = {
        id: 'sess-expired',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() - 1000),
        createdAt: new Date(fixedNow.getTime() - 10000),
        revokedAt: null,
      };

      prisma.session.findUnique.mockResolvedValue(expiredRecord);

      const result = await service.validateSession(syntheticToken);

      expect(result).toBeNull();
    });

    it('returns null when session expiresAt is exactly equal to now', async () => {
      const boundaryRecord: SessionRecord = {
        id: 'sess-boundary',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: fixedNow,
        createdAt: new Date(fixedNow.getTime() - 10000),
        revokedAt: null,
      };

      prisma.session.findUnique.mockResolvedValue(boundaryRecord);

      const result = await service.validateSession(syntheticToken);

      expect(result).toBeNull();
    });

    it('returns null and fails closed when session has been revoked', async () => {
      const revokedRecord: SessionRecord = {
        id: 'sess-revoked',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() + 60000),
        createdAt: fixedNow,
        revokedAt: new Date(fixedNow.getTime() - 500),
      };

      prisma.session.findUnique.mockResolvedValue(revokedRecord);

      const result = await service.validateSession(syntheticToken);

      expect(result).toBeNull();
    });
  });

  describe('revokeSession', () => {
    it('revokes a single session idempotently by hashing the presented token and updating digest record', async () => {
      prisma.session.updateMany.mockResolvedValue({ count: 1 });

      await service.revokeSession(syntheticToken);

      expect(prisma.session.updateMany).toHaveBeenCalledTimes(1);
      expect(prisma.session.updateMany).toHaveBeenCalledWith({
        where: {
          tokenDigest: syntheticDigest,
          revokedAt: null,
        },
        data: { revokedAt: fixedNow },
      });
    });
  });

  describe('revokeAllForUser', () => {
    it('revokes all active sessions for a user by userId', async () => {
      prisma.session.updateMany.mockResolvedValue({ count: 3 });

      await service.revokeAllForUser('usr-1');

      expect(prisma.session.updateMany).toHaveBeenCalledTimes(1);
      expect(prisma.session.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'usr-1',
          revokedAt: null,
        },
        data: {
          revokedAt: fixedNow,
        },
      });
    });
  });
});
