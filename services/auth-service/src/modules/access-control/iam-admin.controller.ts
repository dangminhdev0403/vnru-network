import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { RoleAssignment } from '@prisma/client';
import { z } from 'zod';
import {
  AuthenticatedRequestGuard,
  RequirePermission,
} from '../authentication/authenticated-request-context';
import type { AuthenticatedRequest } from '../authentication/authenticated-request-context';
import {
  IamAdminService,
  UserSelectResult,
  MappedRole,
} from './iam-admin.service';

const paginationSchema = z.object({
  limit: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().int().min(1).max(100).default(10),
  ),
  offset: z.preprocess(
    (val) => (val === undefined ? undefined : Number(val)),
    z.number().int().min(0).default(0),
  ),
});

const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE'], {
  message: 'Status must be ACTIVE or INACTIVE',
});

const uuidSchema = z.string().uuid({ message: 'ID must be a valid UUID' });

const roleAssignmentSchema = z.object({
  userId: z.string().uuid({ message: 'User ID must be a valid UUID' }),
  roleId: z.string().uuid({ message: 'Role ID must be a valid UUID' }),
  contextType: z
    .string()
    .trim()
    .min(1, { message: 'Context type is required' }),
  contextId: z.string().trim().min(1, { message: 'Context ID is required' }),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Status must be ACTIVE or INACTIVE',
  }),
});

const rolePermissionsSchema = z.object({
  permissions: z.array(z.string().trim().min(1)).max(200).refine(
    (permissions) => new Set(permissions).size === permissions.length,
    { message: 'Permissions must be unique' },
  ),
});

@Controller('api/v1/admin')
@UseGuards(AuthenticatedRequestGuard)
@RequirePermission('iam.users.manage')
export class IamAdminController {
  constructor(private readonly iamAdminService: IamAdminService) {}

  @Get('users')
  async listUsers(
    @Query() query: Record<string, unknown>,
    @Req() req?: AuthenticatedRequest,
  ): Promise<UserSelectResult[]> {
    const parsed = paginationSchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues[0]?.message || 'Invalid pagination parameters',
      );
    }
    const { limit, offset } = parsed.data;
    return this.iamAdminService.listUsers(
      limit,
      offset,
      req?.authContext?.userId,
      req?.authContext?.activeContext,
    );
  }

  @Patch('users/:id/status')
  async setUserStatus(
    @Param('id') id: string,
    @Body() body: { status?: unknown },
    @Req() req: AuthenticatedRequest,
  ): Promise<UserSelectResult> {
    const parsedId = uuidSchema.safeParse(id);
    if (!parsedId.success) {
      throw new BadRequestException(
        parsedId.error.issues[0]?.message || 'Invalid User ID',
      );
    }

    const parsedStatus = userStatusSchema.safeParse(body?.status);
    if (!parsedStatus.success) {
      throw new BadRequestException(
        parsedStatus.error.issues[0]?.message || 'Invalid status',
      );
    }

    const actorId = req.authContext?.userId;
    if (!actorId) {
      throw new UnauthorizedException('Actor ID not found in request context');
    }

    return this.iamAdminService.setUserStatus(
      parsedId.data,
      parsedStatus.data,
      actorId,
      req.authContext?.activeContext ?? undefined,
    );
  }

  @Get('roles')
  async listRoles(
    @Query() query: Record<string, unknown>,
  ): Promise<MappedRole[]> {
    const parsed = paginationSchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues[0]?.message || 'Invalid pagination parameters',
      );
    }
    const { limit, offset } = parsed.data;
    return this.iamAdminService.listRoles(limit, offset);
  }

  @Patch('roles/:id/permissions')
  @RequirePermission('iam.roles.manage')
  async replaceRolePermissions(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Req() req: AuthenticatedRequest,
  ): Promise<MappedRole> {
    const parsedId = uuidSchema.safeParse(id);
    const parsedBody = rolePermissionsSchema.safeParse(body);
    if (!parsedId.success || !parsedBody.success) {
      throw new BadRequestException(
        parsedId.error?.issues[0]?.message ?? parsedBody.error?.issues[0]?.message,
      );
    }
    const actorId = req.authContext?.userId;
    if (!actorId) throw new UnauthorizedException('Actor ID not found in request context');
    return this.iamAdminService.replaceRolePermissions(
      parsedId.data,
      parsedBody.data.permissions,
      actorId,
      req.authContext?.activeContext ?? undefined,
    );
  }

  @Post('role-assignments')
  async upsertRoleAssignment(
    @Body() body: Record<string, unknown>,
    @Req() req: AuthenticatedRequest,
  ): Promise<RoleAssignment> {
    const parsed = roleAssignmentSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues[0]?.message || 'Invalid role assignment data',
      );
    }

    const actorId = req.authContext?.userId;
    if (!actorId) {
      throw new UnauthorizedException('Actor ID not found in request context');
    }

    return this.iamAdminService.upsertRoleAssignment(parsed.data, actorId);
  }
}
