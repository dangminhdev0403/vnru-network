import {
  SessionRecord,
  SessionService,
  SessionPrismaClient,
} from './session.service';
import { AccessControlService } from '../access-control/access-control.service';

describe('SessionService', () => {
  let service: SessionService;
  let prisma: {
    session: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      updateMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let accessControlService: {
    hasActiveAssignment: jest.Mock;
    resolveSoleActiveContext: jest.Mock;
  };
  let tokenSequence: string[];
  let tokenIndex: number;

  const fixedNow = new Date('2026-08-18T00:00:00.000Z');
  const syntheticToken = 'synthetic-opaque-token-xyz789';
  const syntheticDigest = 'synthetic-sha256-digest-abc123';

  beforeEach(() => {
    prisma = {
      session: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        updateMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    prisma.$transaction.mockImplementation(
      (cb: (tx: SessionPrismaClient) => Promise<unknown>) => cb(prisma),
    );

    accessControlService = {
      hasActiveAssignment: jest.fn(),
      resolveSoleActiveContext: jest.fn().mockResolvedValue(null),
    };

    tokenSequence = [];
    tokenIndex = 0;

    service = new SessionService(
      prisma,
      accessControlService as unknown as AccessControlService,
      {
        generateToken: () => {
          if (tokenIndex < tokenSequence.length) {
            const token = tokenSequence[tokenIndex];
            tokenIndex += 1;
            return token;
          }
          return syntheticToken;
        },
        hashToken: (token: string) =>
          token === syntheticToken ? syntheticDigest : `hashed-${token}`,
        now: () => fixedNow,
      },
    );
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
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
      };

      prisma.session.create.mockResolvedValue(createdRecord);

      const result = await service.createSession({
        userId: 'usr-1',
        ttlMs,
        authenticationLevel: 'PASSWORD',
      });

      expect(prisma.session.create).toHaveBeenCalledTimes(1);
      expect(prisma.session.create).toHaveBeenCalledWith({
        data: {
          tokenDigest: syntheticDigest,
          userId: 'usr-1',
          expiresAt: expectedExpiresAt,
          authenticationLevel: 'PASSWORD',
        },
      });
      expect(result).toEqual({
        token: syntheticToken,
        session: createdRecord,
      });
    });

    it('uses the sole active authorization context for a new session', async () => {
      accessControlService.resolveSoleActiveContext.mockResolvedValue({
        contextType: 'PLATFORM',
        contextId: 'GLOBAL',
      });
      prisma.session.create.mockImplementation(({ data }) =>
        Promise.resolve({
          id: 'sess-admin',
          createdAt: fixedNow,
          revokedAt: null,
          ...data,
        }),
      );

      await service.createSession({ userId: 'usr-admin', ttlMs: 60_000 });

      expect(prisma.session.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          activeContextType: 'PLATFORM',
          activeContextId: 'GLOBAL',
        }),
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
      const cappedService = new SessionService(
        prisma,
        accessControlService as unknown as AccessControlService,
        {
          generateToken: () => syntheticToken,
          hashToken: () => syntheticDigest,
          now: () => fixedNow,
          maxTtlMs: 1000 * 60 * 60, // 1 hour cap
        },
      );

      const requestedTtlMs = 1000 * 60 * 60 * 24; // 24 hours
      const expectedExpiresAt = new Date(fixedNow.getTime() + 1000 * 60 * 60);

      const createdRecord: SessionRecord = {
        id: 'sess-capped',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: expectedExpiresAt,
        createdAt: fixedNow,
        revokedAt: null,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
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
          authenticationLevel: 'PASSWORD',
        },
      });
    });

    it('uses production default crypto generators when options are omitted', async () => {
      const defaultService = new SessionService(
        prisma,
        accessControlService as unknown as AccessControlService,
      );

      const createdRecord: SessionRecord = {
        id: 'sess-default',
        tokenDigest: 'any-digest',
        userId: 'usr-default',
        expiresAt: new Date(Date.now() + 10000),
        createdAt: new Date(),
        revokedAt: null,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
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
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
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
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
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
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
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
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
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

  describe('getActiveSessionsForUser', () => {
    it('returns unexpired, non-revoked sessions for a user', async () => {
      const activeSessions: SessionRecord[] = [
        {
          id: 'sess-1',
          tokenDigest: 'digest-1',
          userId: 'usr-1',
          expiresAt: new Date(fixedNow.getTime() + 60000),
          createdAt: fixedNow,
          revokedAt: null,
          activeContextType: null,
          activeContextId: null,
          authenticationLevel: 'PASSWORD',
        },
      ];
      prisma.session.findMany.mockResolvedValue(activeSessions);

      const result = await service.getActiveSessionsForUser('usr-1');

      expect(prisma.session.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'usr-1',
          revokedAt: null,
          expiresAt: { gt: fixedNow },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      expect(result).toEqual(activeSessions);
    });
  });

  describe('revokeSessionByIdForUser', () => {
    it('revokes session by id and returns true if user matches and exists', async () => {
      const targetSession: SessionRecord = {
        id: 'sess-target',
        tokenDigest: 'digest-target',
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() + 60000),
        createdAt: fixedNow,
        revokedAt: null,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
      };
      prisma.session.findUnique.mockResolvedValue(targetSession);
      prisma.session.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.revokeSessionByIdForUser(
        'sess-target',
        'usr-1',
      );

      expect(prisma.session.findUnique).toHaveBeenCalledWith({
        where: { id: 'sess-target' },
      });
      expect(prisma.session.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'sess-target',
          userId: 'usr-1',
          revokedAt: null,
        },
        data: {
          revokedAt: fixedNow,
        },
      });
      expect(result).toBe(true);
    });

    it('returns false and does not update if session does not exist', async () => {
      prisma.session.findUnique.mockResolvedValue(null);

      const result = await service.revokeSessionByIdForUser(
        'sess-missing',
        'usr-1',
      );

      expect(result).toBe(false);
      expect(prisma.session.updateMany).not.toHaveBeenCalled();
    });

    it('returns false and does not update if session user does not match', async () => {
      const targetSession: SessionRecord = {
        id: 'sess-target',
        tokenDigest: 'digest-target',
        userId: 'usr-other',
        expiresAt: new Date(fixedNow.getTime() + 60000),
        createdAt: fixedNow,
        revokedAt: null,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
      };
      prisma.session.findUnique.mockResolvedValue(targetSession);

      const result = await service.revokeSessionByIdForUser(
        'sess-target',
        'usr-1',
      );

      expect(result).toBe(false);
      expect(prisma.session.updateMany).not.toHaveBeenCalled();
    });
  });

  describe('revokeOtherSessionsForUser', () => {
    it('revokes all other active sessions for a user, preserving currentSessionId', async () => {
      prisma.session.updateMany.mockResolvedValue({ count: 2 });

      await service.revokeOtherSessionsForUser('usr-1', 'sess-current');

      expect(prisma.session.updateMany).toHaveBeenCalledTimes(1);
      expect(prisma.session.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'usr-1',
          id: { not: 'sess-current' },
          revokedAt: null,
        },
        data: {
          revokedAt: fixedNow,
        },
      });
    });
  });

  describe('getSessionById', () => {
    it('finds session by id using findUnique', async () => {
      const targetSession: SessionRecord = {
        id: 'sess-1',
        tokenDigest: 'digest-1',
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() + 60000),
        createdAt: fixedNow,
        revokedAt: null,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
      };
      prisma.session.findUnique.mockResolvedValue(targetSession);

      const result = await service.getSessionById('sess-1');

      expect(prisma.session.findUnique).toHaveBeenCalledWith({
        where: { id: 'sess-1' },
      });
      expect(result).toEqual(targetSession);
    });
  });

  describe('switchContext', () => {
    const target = { contextType: 'ORGANIZATION', contextId: 'org-100' };

    it('valid switch validates exact user/context and rotates digest', async () => {
      const activeRecord: SessionRecord = {
        id: 'sess-1',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() + 60000),
        createdAt: fixedNow,
        revokedAt: null,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
      };

      const updatedRecord: SessionRecord = {
        ...activeRecord,
        tokenDigest: 'hashed-new-token-123',
        activeContextType: target.contextType,
        activeContextId: target.contextId,
        authenticationLevel: 'PASSWORD',
      };

      // Mock database finding the active session first
      prisma.session.findUnique
        .mockResolvedValueOnce(activeRecord) // first call for old digest
        .mockResolvedValueOnce(updatedRecord); // second call for new digest

      // Mock access control to return true
      accessControlService.hasActiveAssignment.mockResolvedValue(true);

      // Mock updateMany to succeed (count = 1)
      prisma.session.updateMany.mockResolvedValue({ count: 1 });

      const newPlainToken = 'new-token-123';
      tokenSequence = [newPlainToken];
      tokenIndex = 0;

      const result = await service.switchContext(syntheticToken, target);

      expect(prisma.session.findUnique).toHaveBeenNthCalledWith(1, {
        where: { tokenDigest: syntheticDigest },
      });

      expect(accessControlService.hasActiveAssignment).toHaveBeenCalledWith(
        'usr-1',
        target.contextType,
        target.contextId,
        prisma,
      );

      expect(prisma.session.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'sess-1',
          tokenDigest: syntheticDigest,
          userId: 'usr-1',
          revokedAt: null,
          expiresAt: { gt: fixedNow },
        },
        data: {
          tokenDigest: 'hashed-new-token-123',
          activeContextType: target.contextType,
          activeContextId: target.contextId,
        },
      });

      expect(prisma.session.findUnique).toHaveBeenNthCalledWith(2, {
        where: { tokenDigest: 'hashed-new-token-123' },
      });

      expect(result).toEqual({
        token: newPlainToken,
        session: updatedRecord,
      });
    });

    it('invalid assignment does not mutate session', async () => {
      const activeRecord: SessionRecord = {
        id: 'sess-1',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() + 60000),
        createdAt: fixedNow,
        revokedAt: null,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
      };

      prisma.session.findUnique.mockResolvedValue(activeRecord);
      accessControlService.hasActiveAssignment.mockResolvedValue(false);

      await expect(
        service.switchContext(syntheticToken, target),
      ).rejects.toThrow('Active role assignment not found for target context');

      expect(prisma.session.updateMany).not.toHaveBeenCalled();
    });

    it('expired session does not mutate', async () => {
      const expiredRecord: SessionRecord = {
        id: 'sess-1',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() - 1000),
        createdAt: fixedNow,
        revokedAt: null,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
      };

      prisma.session.findUnique.mockResolvedValue(expiredRecord);

      await expect(
        service.switchContext(syntheticToken, target),
      ).rejects.toThrow('Session is expired');

      expect(accessControlService.hasActiveAssignment).not.toHaveBeenCalled();
      expect(prisma.session.updateMany).not.toHaveBeenCalled();
    });

    it('revoked session does not mutate', async () => {
      const revokedRecord: SessionRecord = {
        id: 'sess-1',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() + 60000),
        createdAt: fixedNow,
        revokedAt: fixedNow,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
      };

      prisma.session.findUnique.mockResolvedValue(revokedRecord);

      await expect(
        service.switchContext(syntheticToken, target),
      ).rejects.toThrow('Session is revoked');

      expect(accessControlService.hasActiveAssignment).not.toHaveBeenCalled();
      expect(prisma.session.updateMany).not.toHaveBeenCalled();
    });

    it('stale/concurrent conditional update fails and throws', async () => {
      const activeRecord: SessionRecord = {
        id: 'sess-1',
        tokenDigest: syntheticDigest,
        userId: 'usr-1',
        expiresAt: new Date(fixedNow.getTime() + 60000),
        createdAt: fixedNow,
        revokedAt: null,
        activeContextType: null,
        activeContextId: null,
        authenticationLevel: 'PASSWORD',
      };

      prisma.session.findUnique.mockResolvedValue(activeRecord);
      accessControlService.hasActiveAssignment.mockResolvedValue(true);
      prisma.session.updateMany.mockResolvedValue({ count: 0 }); // concurrent update won the race!

      await expect(
        service.switchContext(syntheticToken, target),
      ).rejects.toThrow('Concurrent/stale session update detected');
    });
  });
});
