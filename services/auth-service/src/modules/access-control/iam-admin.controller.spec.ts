import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  UserStatus,
  RoleAssignmentStatus,
  RoleAssignment,
} from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { IamAdminController } from './iam-admin.controller';
import { IamAdminService } from './iam-admin.service';
import {
  AuthenticatedRequestGuard,
  AuthenticatedRequest,
} from '../authentication/authenticated-request-context';
import { AuthenticationService } from '../authentication/authentication.service';

describe('IamAdminController', () => {
  let controller: IamAdminController;
  let serviceMock: {
    listUsers: jest.Mock;
    setUserStatus: jest.Mock;
    listRoles: jest.Mock;
    upsertRoleAssignment: jest.Mock;
  };
  let authServiceMock: Record<string, unknown>;

  beforeEach(() => {
    serviceMock = {
      listUsers: jest.fn(),
      setUserStatus: jest.fn(),
      listRoles: jest.fn(),
      upsertRoleAssignment: jest.fn(),
    };

    authServiceMock = {};

    controller = new IamAdminController(
      serviceMock as unknown as IamAdminService,
    );
  });

  describe('Validation & Direct Invocation', () => {
    describe('listUsers', () => {
      it('calls service with parsed limit and offset', async () => {
        serviceMock.listUsers.mockResolvedValue([]);
        const result = await controller.listUsers({ limit: '15', offset: '5' });

        expect(serviceMock.listUsers).toHaveBeenCalledWith(15, 5);
        expect(result).toEqual([]);
      });

      it('applies default pagination values', async () => {
        serviceMock.listUsers.mockResolvedValue([]);
        const result = await controller.listUsers({});

        expect(serviceMock.listUsers).toHaveBeenCalledWith(10, 0);
        expect(result).toEqual([]);
      });

      it('throws BadRequestException for invalid limit', async () => {
        await expect(controller.listUsers({ limit: 'abc' })).rejects.toThrow(
          BadRequestException,
        );
      });

      it('throws BadRequestException for negative offset', async () => {
        await expect(controller.listUsers({ offset: '-1' })).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('setUserStatus', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const mockReq = {
        authContext: {
          userId: 'actor-usr-123',
        },
      } as unknown as AuthenticatedRequest;

      it('calls service with valid uuid, active status, and actorId', async () => {
        serviceMock.setUserStatus.mockResolvedValue({
          id: validUuid,
          status: UserStatus.ACTIVE,
          email: 'test@example.com',
        });
        const result = await controller.setUserStatus(
          validUuid,
          { status: UserStatus.ACTIVE },
          mockReq,
        );

        expect(serviceMock.setUserStatus).toHaveBeenCalledWith(
          validUuid,
          UserStatus.ACTIVE,
          'actor-usr-123',
        );
        expect(result).toEqual({
          id: validUuid,
          status: UserStatus.ACTIVE,
          email: 'test@example.com',
        });
      });

      it('throws UnauthorizedException if authContext is missing', async () => {
        const reqWithoutAuth = {} as unknown as AuthenticatedRequest;
        await expect(
          controller.setUserStatus(
            validUuid,
            { status: UserStatus.ACTIVE },
            reqWithoutAuth,
          ),
        ).rejects.toThrow(UnauthorizedException);
        expect(serviceMock.setUserStatus).not.toHaveBeenCalled();
      });

      it('throws UnauthorizedException if userId is missing in authContext', async () => {
        const reqWithoutUserId = {
          authContext: {},
        } as unknown as AuthenticatedRequest;
        await expect(
          controller.setUserStatus(
            validUuid,
            { status: UserStatus.ACTIVE },
            reqWithoutUserId,
          ),
        ).rejects.toThrow(UnauthorizedException);
        expect(serviceMock.setUserStatus).not.toHaveBeenCalled();
      });

      it('throws BadRequestException for non-uuid ID', async () => {
        await expect(
          controller.setUserStatus(
            'invalid-id',
            { status: UserStatus.ACTIVE },
            mockReq,
          ),
        ).rejects.toThrow(BadRequestException);
      });

      it('throws BadRequestException for invalid status value', async () => {
        await expect(
          controller.setUserStatus(validUuid, { status: 'PENDING' }, mockReq),
        ).rejects.toThrow(BadRequestException);
      });

      it('throws BadRequestException for missing status in body', async () => {
        await expect(
          controller.setUserStatus(validUuid, {}, mockReq),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('listRoles', () => {
      it('calls service with parsed limit and offset', async () => {
        serviceMock.listRoles.mockResolvedValue([]);
        const result = await controller.listRoles({
          limit: '20',
          offset: '10',
        });

        expect(serviceMock.listRoles).toHaveBeenCalledWith(20, 10);
        expect(result).toEqual([]);
      });

      it('throws BadRequestException for invalid offset', async () => {
        await expect(controller.listRoles({ offset: 'xyz' })).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('upsertRoleAssignment', () => {
      const validUserUuid = '123e4567-e89b-12d3-a456-426614174000';
      const validRoleUuid = '987f6543-e21b-44d5-a789-0123456789ab';
      const mockReq = {
        authContext: {
          userId: 'actor-usr-123',
        },
      } as unknown as AuthenticatedRequest;

      const validPayload = {
        userId: validUserUuid,
        roleId: validRoleUuid,
        contextType: 'ORGANIZATION',
        contextId: 'org-123',
        status: RoleAssignmentStatus.ACTIVE,
      };

      it('calls service with valid role assignment payload and actorId', async () => {
        const mockResult: RoleAssignment = {
          id: 'ra-1',
          userId: validUserUuid,
          roleId: validRoleUuid,
          contextType: 'ORGANIZATION',
          contextId: 'org-123',
          status: RoleAssignmentStatus.ACTIVE,
          createdAt: new Date(),
        };
        serviceMock.upsertRoleAssignment.mockResolvedValue(mockResult);
        const result = await controller.upsertRoleAssignment(
          validPayload,
          mockReq,
        );

        expect(serviceMock.upsertRoleAssignment).toHaveBeenCalledWith(
          validPayload,
          'actor-usr-123',
        );
        expect(result).toEqual(mockResult);
      });

      it('throws UnauthorizedException if authContext is missing', async () => {
        const reqWithoutAuth = {} as unknown as AuthenticatedRequest;
        await expect(
          controller.upsertRoleAssignment(validPayload, reqWithoutAuth),
        ).rejects.toThrow(UnauthorizedException);
        expect(serviceMock.upsertRoleAssignment).not.toHaveBeenCalled();
      });

      it('throws UnauthorizedException if userId is missing in authContext', async () => {
        const reqWithoutUserId = {
          authContext: {},
        } as unknown as AuthenticatedRequest;
        await expect(
          controller.upsertRoleAssignment(validPayload, reqWithoutUserId),
        ).rejects.toThrow(UnauthorizedException);
        expect(serviceMock.upsertRoleAssignment).not.toHaveBeenCalled();
      });

      it('throws BadRequestException for invalid user UUID', async () => {
        const payload = { ...validPayload, userId: 'invalid' };
        await expect(
          controller.upsertRoleAssignment(payload, mockReq),
        ).rejects.toThrow(BadRequestException);
      });

      it('throws BadRequestException for empty contextType', async () => {
        const payload = { ...validPayload, contextType: '   ' };
        await expect(
          controller.upsertRoleAssignment(payload, mockReq),
        ).rejects.toThrow(BadRequestException);
      });

      it('throws BadRequestException for invalid status', async () => {
        const payload = { ...validPayload, status: 'EXPIRED' };
        await expect(
          controller.upsertRoleAssignment(payload, mockReq),
        ).rejects.toThrow(BadRequestException);
      });
    });
  });

  describe('Guards and Metadata Reflection', () => {
    let appModule: TestingModule;

    beforeEach(async () => {
      appModule = await Test.createTestingModule({
        controllers: [IamAdminController],
        providers: [
          { provide: IamAdminService, useValue: serviceMock },
          { provide: AuthenticationService, useValue: authServiceMock },
          Reflector,
        ],
      }).compile();
    });

    it('has AuthenticatedRequestGuard applied', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        IamAdminController,
      ) as unknown[];
      expect(guards).toContain(AuthenticatedRequestGuard);
    });

    it('requires the iam.users.manage permission at the class level', () => {
      const reflector = appModule.get<Reflector>(Reflector);
      const permission = reflector.get<string>(
        'requiredPermission',
        IamAdminController,
      );
      expect(permission).toBe('iam.users.manage');
    });
  });
});
