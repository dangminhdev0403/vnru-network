import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  UserStatus,
  RoleAssignmentStatus,
  User,
  Role,
  RoleAssignment,
} from '@prisma/client';
import { ACCESS_CONTROL_PRISMA } from './access-control.service';

export interface UserSelectResult {
  id: string;
  email: string | null;
  status: UserStatus;
}

export interface RoleWithPermissions {
  id: string;
  name: string;
  permissions: {
    permission: {
      key: string;
    } | null;
  }[];
}

export interface MappedRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface IamAdminPrismaClient {
  $transaction<T>(
    fn: (tx: Omit<IamAdminPrismaClient, '$transaction'>) => Promise<T>,
  ): Promise<T>;
  user: {
    findMany(args: {
      take: number;
      skip: number;
      orderBy?: { id: 'asc' | 'desc' };
      select?: { id: boolean; email: boolean; status: boolean };
    }): Promise<UserSelectResult[]>;
    findUnique(args: { where: { id: string } }): Promise<User | null>;
    update(args: {
      where: { id: string };
      data: { status: UserStatus };
      select?: { id: boolean; email: boolean; status: boolean };
    }): Promise<UserSelectResult>;
  };
  role: {
    findMany(args: {
      take: number;
      skip: number;
      orderBy?: { name: 'asc' | 'desc' };
      include?: {
        permissions: {
          include: {
            permission: boolean;
          };
        };
      };
    }): Promise<RoleWithPermissions[]>;
    findUnique(args: { where: { id: string } }): Promise<Role | null>;
  };
  roleAssignment: {
    upsert(args: {
      where: {
        userId_roleId_contextType_contextId: {
          userId: string;
          roleId: string;
          contextType: string;
          contextId: string;
        };
      };
      update: { status: RoleAssignmentStatus };
      create: {
        userId: string;
        roleId: string;
        contextType: string;
        contextId: string;
        status: RoleAssignmentStatus;
      };
    }): Promise<RoleAssignment>;
  };
  session: {
    updateMany(args: {
      where: { userId: string; revokedAt: null };
      data: { revokedAt: Date };
    }): Promise<{ count: number }>;
  };
  securityAuditEvent: {
    create(args: {
      data: {
        event: string;
        actorId: string;
        targetId: string;
        context: any;
      };
    }): Promise<any>;
  };
}

@Injectable()
export class IamAdminService {
  constructor(
    @Inject(ACCESS_CONTROL_PRISMA)
    private readonly prisma: IamAdminPrismaClient,
  ) {}

  async listUsers(limit: number, offset: number): Promise<UserSelectResult[]> {
    return this.prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });
  }

  async setUserStatus(
    id: string,
    status: UserStatus,
    actorId: string,
  ): Promise<UserSelectResult> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id },
        data: { status },
        select: {
          id: true,
          email: true,
          status: true,
        },
      });

      if (status === UserStatus.INACTIVE) {
        await tx.session.updateMany({
          where: {
            userId: id,
            revokedAt: null,
          },
          data: {
            revokedAt: new Date(),
          },
        });
      }

      await tx.securityAuditEvent.create({
        data: {
          event: 'IAM_USER_STATUS_CHANGED',
          actorId,
          targetId: id,
          context: { status },
        },
      });

      return updatedUser;
    });
  }

  async listRoles(limit: number, offset: number): Promise<MappedRole[]> {
    const roles = await this.prisma.role.findMany({
      take: limit,
      skip: offset,
      orderBy: { name: 'asc' },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return roles.map((role) => {
      const permissionKeys: string[] = role.permissions
        .map((rp) => rp.permission?.key)
        .filter((key): key is string => typeof key === 'string');

      return {
        id: role.id,
        name: role.name,
        permissions: [...permissionKeys].sort(),
      };
    });
  }

  async upsertRoleAssignment(
    input: {
      userId: string;
      roleId: string;
      contextType: string;
      contextId: string;
      status: RoleAssignmentStatus;
    },
    actorId: string,
  ): Promise<RoleAssignment> {
    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: input.roleId },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.roleAssignment.upsert({
        where: {
          userId_roleId_contextType_contextId: {
            userId: input.userId,
            roleId: input.roleId,
            contextType: input.contextType,
            contextId: input.contextId,
          },
        },
        update: {
          status: input.status,
        },
        create: {
          userId: input.userId,
          roleId: input.roleId,
          contextType: input.contextType,
          contextId: input.contextId,
          status: input.status,
        },
      });

      await tx.securityAuditEvent.create({
        data: {
          event: 'IAM_ROLE_ASSIGNMENT_CHANGED',
          actorId,
          targetId: input.userId,
          context: {
            roleId: input.roleId,
            contextType: input.contextType,
            contextId: input.contextId,
            status: input.status,
          },
        },
      });

      return assignment;
    });
  }
}
