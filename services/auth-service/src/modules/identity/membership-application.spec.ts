import { BadRequestException, ConflictException } from '@nestjs/common';
import { MembershipApplicationController } from './membership-application.controller';
import {
  MembershipApplicationService,
  MembershipApplicationPrismaClient,
} from './membership-application.service';

describe('membership applications', () => {
  const created = {
    id: 'application-1',
    status: 'PENDING',
    submittedAt: new Date('2026-08-26T00:00:00.000Z'),
  };
  let prisma: MembershipApplicationPrismaClient;
  let service: MembershipApplicationService;
  let controller: MembershipApplicationController;

  beforeEach(() => {
    prisma = {
      membershipApplication: {
        create: jest.fn().mockResolvedValue(created),
      },
    };
    service = new MembershipApplicationService(prisma);
    controller = new MembershipApplicationController(service);
  });

  it('validates, trims and stores a pending application without creating an account', async () => {
    await expect(
      controller.create({
        fullName: '  Nguyễn Văn An  ',
        email: '  MEMBER@EXAMPLE.ORG ',
        organization: '  VAST  ',
        professionalRole: '  Nhà nghiên cứu  ',
        interest: '  Vật liệu mới và hợp tác khoa học  ',
      }),
    ).resolves.toEqual(created);

    expect(prisma.membershipApplication.create).toHaveBeenCalledWith({
      data: {
        fullName: 'Nguyễn Văn An',
        email: 'member@example.org',
        organization: 'VAST',
        professionalRole: 'Nhà nghiên cứu',
        interest: 'Vật liệu mới và hợp tác khoa học',
      },
      select: { id: true, status: true, submittedAt: true },
    });
  });

  it('rejects invalid public input', async () => {
    await expect(
      controller.create({ email: 'not-an-email' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.membershipApplication.create).not.toHaveBeenCalled();
  });

  it('returns conflict for an existing pending application', async () => {
    (prisma.membershipApplication.create as jest.Mock).mockRejectedValue({
      code: 'P2002',
    });
    await expect(
      controller.create({
        fullName: 'Nguyễn Văn An',
        email: 'member@example.org',
        organization: 'VAST',
        professionalRole: 'Nhà nghiên cứu',
        interest: 'Vật liệu mới và hợp tác khoa học',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
