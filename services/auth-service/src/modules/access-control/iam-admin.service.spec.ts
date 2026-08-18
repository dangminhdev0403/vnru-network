import { NotFoundException } from '@nestjs/common';
import { UserStatus, RoleAssignmentStatus } from '@prisma/client';
import { IamAdminService } from './iam-admin.service';

describe('IamAdminService', () => {
  let service: IamAdminService;
  let prismaMock: {
    $transaction: jest.Mock;
    user: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    role: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
    roleAssignment: {
      upsert: jest.Mock;
    };
    session: {
      updateMany: jest.Mock;
    };
    securityAuditEvent: {
      create: jest.Mock;
    };
  };

  beforeEach(() => {
    prismaMock = {
      $transaction: jest
        .fn()
        .mockImplementation(<T>(fn: (tx: any) => Promise<T>): Promise<T> =>
          fn(prismaMock),
        ),
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      role: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      roleAssignment: {
        upsert: jest.fn(),
      },
      session: {
        updateMany: jest.fn(),
      },
      securityAuditEvent: {
        create: jest.fn(),
      },
    };

    service = new IamAdminService(prismaMock);
  });

  describe('listUsers', () => {
    it('returns a list of users mapped and paginated', async () => {
      const users = [
        { id: 'usr-1', email: 'test1@example.com', status: UserStatus.ACTIVE },
        {
          id: 'usr-2',
          email: 'test2@example.com',
          status: UserStatus.INACTIVE,
        },
      ];
      prismaMock.user.findMany.mockResolvedValue(users);

      const result = await service.listUsers(10, 0);

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          email: true,
          status: true,
        },
      });
      expect(result).toEqual(users);
    });
  });

  describe('setUserStatus', () => {
    it('updates user status, revokes sessions if status is INACTIVE, and writes audit event in transaction', async () => {
      const existingUser = {
        id: 'usr-1',
        email: 'test@example.com',
        status: UserStatus.ACTIVE,
      };
      const updatedUser = {
        id: 'usr-1',
        email: 'test@example.com',
        status: UserStatus.INACTIVE,
      };

      prismaMock.user.findUnique.mockResolvedValue(existingUser);
      prismaMock.user.update.mockResolvedValue(updatedUser);
      prismaMock.session.updateMany.mockResolvedValue({ count: 2 });
      prismaMock.securityAuditEvent.create.mockResolvedValue({ id: 'audit-1' });

      const result = await service.setUserStatus(
        'usr-1',
        UserStatus.INACTIVE,
        'actor-usr-123',
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'usr-1' },
      });
      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'usr-1' },
        data: { status: UserStatus.INACTIVE },
        select: {
          id: true,
          email: true,
          status: true,
        },
      });
      expect(prismaMock.session.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'usr-1',
          revokedAt: null,
        },
        data: {
          revokedAt: expect.any(Date) as unknown,
        },
      });
      expect(prismaMock.securityAuditEvent.create).toHaveBeenCalledWith({
        data: {
          event: 'IAM_USER_STATUS_CHANGED',
          actorId: 'actor-usr-123',
          targetId: 'usr-1',
          context: { status: UserStatus.INACTIVE },
        },
      });
      expect(result).toEqual(updatedUser);
    });

    it('updates user status, does NOT revoke sessions if status is ACTIVE, and writes audit event in transaction', async () => {
      const existingUser = {
        id: 'usr-1',
        email: 'test@example.com',
        status: UserStatus.INACTIVE,
      };
      const updatedUser = {
        id: 'usr-1',
        email: 'test@example.com',
        status: UserStatus.ACTIVE,
      };

      prismaMock.user.findUnique.mockResolvedValue(existingUser);
      prismaMock.user.update.mockResolvedValue(updatedUser);
      prismaMock.securityAuditEvent.create.mockResolvedValue({ id: 'audit-2' });

      const result = await service.setUserStatus(
        'usr-1',
        UserStatus.ACTIVE,
        'actor-usr-123',
      );

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'usr-1' },
      });
      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.session.updateMany).not.toHaveBeenCalled();
      expect(prismaMock.securityAuditEvent.create).toHaveBeenCalledWith({
        data: {
          event: 'IAM_USER_STATUS_CHANGED',
          actorId: 'actor-usr-123',
          targetId: 'usr-1',
          context: { status: UserStatus.ACTIVE },
        },
      });
      expect(result).toEqual(updatedUser);
    });

    it('throws NotFoundException if user is not found and does not start transaction', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.setUserStatus(
          'usr-nonexistent',
          UserStatus.ACTIVE,
          'actor-usr-123',
        ),
      ).rejects.toThrow(NotFoundException);
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });

    it('rolls back transaction (rethrows error) if audit event logging fails', async () => {
      const existingUser = {
        id: 'usr-1',
        email: 'test@example.com',
        status: UserStatus.ACTIVE,
      };
      const updatedUser = {
        id: 'usr-1',
        email: 'test@example.com',
        status: UserStatus.INACTIVE,
      };

      prismaMock.user.findUnique.mockResolvedValue(existingUser);
      prismaMock.user.update.mockResolvedValue(updatedUser);
      prismaMock.session.updateMany.mockResolvedValue({ count: 2 });
      prismaMock.securityAuditEvent.create.mockRejectedValue(
        new Error('Database error during audit insert'),
      );

      await expect(
        service.setUserStatus('usr-1', UserStatus.INACTIVE, 'actor-usr-123'),
      ).rejects.toThrow('Database error during audit insert');

      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.securityAuditEvent.create).toHaveBeenCalled();
    });
  });

  describe('listRoles', () => {
    it('returns roles with mapped and sorted permission keys', async () => {
      const rolesFromPrisma = [
        {
          id: 'role-1',
          name: 'ADMIN',
          permissions: [
            { permission: { key: 'iam.users.manage' } },
            { permission: { key: 'iam.roles.manage' } },
          ],
        },
        {
          id: 'role-2',
          name: 'USER',
          permissions: [
            { permission: { key: 'knowledge.publications.submit' } },
          ],
        },
      ];
      prismaMock.role.findMany.mockResolvedValue(rolesFromPrisma);

      const result = await service.listRoles(5, 0);

      expect(prismaMock.role.findMany).toHaveBeenCalledWith({
        take: 5,
        skip: 0,
        orderBy: { name: 'asc' },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
      expect(result).toEqual([
        {
          id: 'role-1',
          name: 'ADMIN',
          permissions: ['iam.roles.manage', 'iam.users.manage'],
        },
        {
          id: 'role-2',
          name: 'USER',
          permissions: ['knowledge.publications.submit'],
        },
      ]);
    });
  });

  describe('upsertRoleAssignment', () => {
    const input = {
      userId: 'usr-1',
      roleId: 'role-1',
      contextType: 'ORGANIZATION',
      contextId: 'org-123',
      status: RoleAssignmentStatus.ACTIVE,
    };

    it('performs upsert, logs security audit event and returns result inside transaction', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'usr-1' });
      prismaMock.role.findUnique.mockResolvedValue({ id: 'role-1' });
      prismaMock.roleAssignment.upsert.mockResolvedValue({
        id: 'assignment-1',
        ...input,
      });
      prismaMock.securityAuditEvent.create.mockResolvedValue({ id: 'audit-3' });

      const result = await service.upsertRoleAssignment(input, 'actor-usr-123');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'usr-1' },
      });
      expect(prismaMock.role.findUnique).toHaveBeenCalledWith({
        where: { id: 'role-1' },
      });
      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.roleAssignment.upsert).toHaveBeenCalledWith({
        where: {
          userId_roleId_contextType_contextId: {
            userId: 'usr-1',
            roleId: 'role-1',
            contextType: 'ORGANIZATION',
            contextId: 'org-123',
          },
        },
        update: {
          status: RoleAssignmentStatus.ACTIVE,
        },
        create: {
          userId: 'usr-1',
          roleId: 'role-1',
          contextType: 'ORGANIZATION',
          contextId: 'org-123',
          status: RoleAssignmentStatus.ACTIVE,
        },
      });
      expect(prismaMock.securityAuditEvent.create).toHaveBeenCalledWith({
        data: {
          event: 'IAM_ROLE_ASSIGNMENT_CHANGED',
          actorId: 'actor-usr-123',
          targetId: 'usr-1',
          context: {
            roleId: 'role-1',
            contextType: 'ORGANIZATION',
            contextId: 'org-123',
            status: RoleAssignmentStatus.ACTIVE,
          },
        },
      });
      expect(result).toEqual({ id: 'assignment-1', ...input });
    });

    it('throws NotFoundException if user does not exist and does not start transaction', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.upsertRoleAssignment(input, 'actor-usr-123'),
      ).rejects.toThrow(NotFoundException);
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
      expect(prismaMock.role.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.roleAssignment.upsert).not.toHaveBeenCalled();
    });

    it('throws NotFoundException if role does not exist and does not start transaction', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'usr-1' });
      prismaMock.role.findUnique.mockResolvedValue(null);

      await expect(
        service.upsertRoleAssignment(input, 'actor-usr-123'),
      ).rejects.toThrow(NotFoundException);
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
      expect(prismaMock.roleAssignment.upsert).not.toHaveBeenCalled();
    });

    it('rolls back transaction (rethrows error) if audit event logging fails', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'usr-1' });
      prismaMock.role.findUnique.mockResolvedValue({ id: 'role-1' });
      prismaMock.roleAssignment.upsert.mockResolvedValue({
        id: 'assignment-1',
        ...input,
      });
      prismaMock.securityAuditEvent.create.mockRejectedValue(
        new Error('Audit log error'),
      );

      await expect(
        service.upsertRoleAssignment(input, 'actor-usr-123'),
      ).rejects.toThrow('Audit log error');

      expect(prismaMock.$transaction).toHaveBeenCalled();
      expect(prismaMock.securityAuditEvent.create).toHaveBeenCalled();
    });
  });
});
