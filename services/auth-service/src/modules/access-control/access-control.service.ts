import { Inject, Injectable } from '@nestjs/common';

export const ACCESS_CONTROL_PRISMA = 'ACCESS_CONTROL_PRISMA';

export interface ResolveCapabilitiesInput {
  userId: string;
  contextType: string;
  contextId: string;
}

export interface RolePermissionRecord {
  id?: string;
  roleId?: string;
  permission: string;
}

export interface RoleRecord {
  id: string;
  name: string;
  permissions?: RolePermissionRecord[];
}

export interface RoleAssignmentRecord {
  id: string;
  userId: string;
  roleId?: string;
  contextType: string;
  contextId: string;
  status: string;
  role: RoleRecord;
}

export interface AccessControlPrismaClient {
  rolePermission: {
    findMany: (args?: {
      select?: { permission: boolean };
      distinct?: ('permission')[];
    }) => Promise<{ permission: string }[]>;
  };
  roleAssignment: {
    findMany: (args: {
      where: {
        userId: string;
        contextType?: string;
        contextId?: string;
        status: string;
      };
      include?: {
        role: {
          include?: {
            permissions: boolean;
          };
          select?: { name: boolean };
        };
      };
    }) => Promise<RoleAssignmentRecord[]>;
  };
}

@Injectable()
export class AccessControlService {
  constructor(
    @Inject(ACCESS_CONTROL_PRISMA)
    private readonly prisma: AccessControlPrismaClient,
  ) {}

  async resolveCapabilities(
    input: ResolveCapabilitiesInput,
  ): Promise<string[]> {
    if (!input.userId || !input.contextType || !input.contextId) {
      return [];
    }

    const assignments = await this.prisma.roleAssignment.findMany({
      where: {
        userId: input.userId,
        contextType: input.contextType,
        contextId: input.contextId,
        status: 'ACTIVE',
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!assignments || assignments.length === 0) {
      return [];
    }

    if (assignments.some(({ role }) => role?.name === 'SUPER_ADMIN')) {
      const allPermissions = await this.prisma.rolePermission.findMany({
        select: { permission: true },
        distinct: ['permission'],
      });
      return allPermissions.map(({ permission }) => permission).sort();
    }

    const permissionKeys = new Set<string>();

    for (const assignment of assignments) {
      if (assignment.status !== 'ACTIVE') {
        continue;
      }
      const rolePermissions = assignment.role?.permissions;
      if (Array.isArray(rolePermissions)) {
        for (const rp of rolePermissions) {
          if (rp.permission) {
            permissionKeys.add(rp.permission);
          }
        }
      }
    }

    return Array.from(permissionKeys).sort();
  }

  async resolveActiveRoleNames(
    input: ResolveCapabilitiesInput,
  ): Promise<string[]> {
    if (!input.userId || !input.contextType || !input.contextId) return [];

    const assignments = await this.prisma.roleAssignment.findMany({
      where: {
        userId: input.userId,
        contextType: input.contextType,
        contextId: input.contextId,
        status: 'ACTIVE',
      },
      include: { role: { select: { name: true } } },
    });

    return [
      ...new Set(
        assignments
          .map(({ role }) => role?.name)
          .filter(
            (name): name is string => Boolean(name) && name !== 'SUPER_ADMIN',
          ),
      ),
    ].sort();
  }

  async resolveSoleActiveContext(
    userId: string,
  ): Promise<{ contextType: string; contextId: string } | null> {
    if (!userId) return null;

    const assignments = await this.prisma.roleAssignment.findMany({
      where: { userId, status: 'ACTIVE' },
    });
    const contexts = new Map(
      assignments.map(({ contextType, contextId }) => [
        `${contextType}\0${contextId}`,
        { contextType, contextId },
      ]),
    );
    return contexts.size === 1 ? [...contexts.values()][0] : null;
  }

  async hasActiveAssignment(
    userId: string,
    contextType: string,
    contextId: string,
    txClient?: AccessControlPrismaClient,
  ): Promise<boolean> {
    if (!userId || !contextType || !contextId) {
      return false;
    }
    const client = txClient ?? this.prisma;
    const assignments = await client.roleAssignment.findMany({
      where: {
        userId,
        contextType,
        contextId,
        status: 'ACTIVE',
      },
    });
    return assignments.length > 0;
  }
}
