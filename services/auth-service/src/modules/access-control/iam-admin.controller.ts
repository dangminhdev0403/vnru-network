import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { RoleAssignment } from '@prisma/client';
import { z } from 'zod';
import {
  AuthenticatedRequestGuard,
  RequirePermission,
} from '../authentication/authenticated-request-context';
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

@Controller('api/v1/admin')
@UseGuards(AuthenticatedRequestGuard)
@RequirePermission('iam.users.manage')
export class IamAdminController {
  constructor(private readonly iamAdminService: IamAdminService) {}

  @Get('users')
  async listUsers(
    @Query() query: Record<string, unknown>,
  ): Promise<UserSelectResult[]> {
    const parsed = paginationSchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues[0]?.message || 'Invalid pagination parameters',
      );
    }
    const { limit, offset } = parsed.data;
    return this.iamAdminService.listUsers(limit, offset);
  }

  @Patch('users/:id/status')
  async setUserStatus(
    @Param('id') id: string,
    @Body() body: { status?: unknown },
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

    return this.iamAdminService.setUserStatus(parsedId.data, parsedStatus.data);
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

  @Post('role-assignments')
  async upsertRoleAssignment(
    @Body() body: Record<string, unknown>,
  ): Promise<RoleAssignment> {
    const parsed = roleAssignmentSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues[0]?.message || 'Invalid role assignment data',
      );
    }

    return this.iamAdminService.upsertRoleAssignment(parsed.data);
  }
}
