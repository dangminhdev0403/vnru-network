import { Inject, Injectable } from '@nestjs/common';

export const ACCESS_CONTROL_PRISMA = 'ACCESS_CONTROL_PRISMA';

export interface ResolveCapabilitiesInput {
  userId: string;
  contextType: string;
  contextId: string;
}

export interface PermissionRecord {
  id: string;
  key: string;
}

export interface RolePermissionRecord {
  id?: string;
  roleId?: string;
  permissionId?: string;
  permission: PermissionRecord;
}

export interface RoleRecord {
  id: string;
  name: string;
  permissions: RolePermissionRecord[];
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
  roleAssignment: {
    findMany: (args: {
      where: {
        userId: string;
        contextType: string;
        contextId: string;
        status: string;
      };
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: boolean;
              };
            };
          };
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
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!assignments || assignments.length === 0) {
      return [];
    }

    const permissionKeys = new Set<string>();

    for (const assignment of assignments) {
      if (assignment.status !== 'ACTIVE') {
        continue;
      }
      const rolePermissions = assignment.role?.permissions;
      if (Array.isArray(rolePermissions)) {
        for (const rp of rolePermissions) {
          if (rp.permission?.key) {
            permissionKeys.add(rp.permission.key);
          }
        }
      }
    }

    return Array.from(permissionKeys).sort();
  }
}
