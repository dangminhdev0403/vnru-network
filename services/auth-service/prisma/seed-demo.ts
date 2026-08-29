import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import * as fs from 'node:fs';
import { promisify } from 'node:util';
import { z } from 'zod';
import { importFixture } from './import-fixture';

const roles = [
  'SUPER_ADMIN',
  'READER',
  'PORTAL_MEMBER',
  'CONTENT_EDITOR',
] as const;
const customRoles = [
  { name: 'CUSTOM_EMPTY_TEST', permissions: [] },
  { name: 'CUSTOM_PORTAL_TEST', permissions: ['portal.member.access'] },
  {
    name: 'CUSTOM_IAM_TEST',
    permissions: ['iam.audit.view', 'iam.roles.manage', 'iam.users.manage'],
  },
] as const;
const legacyRoleNames = [
  'RESEARCHER',
  'ORGANIZATION_REPRESENTATIVE',
  'REVIEWER',
  'COLLABORATION_MANAGER',
  'FOUNDATION_DECISION_MAKER',
] as const;
const scrypt = promisify(scryptCallback);
const accountsSchema = z.object({
  accounts: z
    .array(
      z.object({
        account: z.string().min(1),
        password: z.string().min(8),
        role: z.enum(roles),
      }),
    )
    .length(7)
    .superRefine((accounts, context) => {
      const counts = Object.fromEntries(
        roles.map((role) => [
          role,
          accounts.filter((account) => account.role === role).length,
        ]),
      );
      if (
        counts.SUPER_ADMIN !== 1 ||
        counts.READER !== 3 ||
        counts.PORTAL_MEMBER !== 2 ||
        counts.CONTENT_EDITOR !== 1
      ) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Demo accounts require 1 SUPER_ADMIN, 3 READER, 2 PORTAL_MEMBER, and 1 CONTENT_EDITOR',
        });
      }
    }),
});

const bindings = {
  SUPER_ADMIN: [
    {
      userId: '6a63ec6d-f493-4d7a-8fb3-fc8f08fd26db',
      assignmentId: '7a23f350-6cbb-49d9-a63a-10e2f136d20e',
    },
  ],
  READER: [
    {
      userId: '7809a72b-8a8e-49b8-897b-bb663ee38021',
      assignmentId: '7809a72b-8a8e-49b8-897b-dd663ee38021',
    },
    {
      userId: '7809a72b-8a8e-49b8-897b-aa663ee38003',
      assignmentId: '7809a72b-8a8e-49b8-897b-dd663ee38002',
    },
    {
      userId: '7809a72b-8a8e-49b8-897b-bb663ee38023',
      assignmentId: '7809a72b-8a8e-49b8-897b-dd663ee38022',
    },
  ],
  PORTAL_MEMBER: [
    {
      userId: '7809a72b-8a8e-49b8-897b-aa663ee38007',
      assignmentId: '7809a72b-8a8e-49b8-897b-dd663ee38004',
    },
    {
      userId: '7809a72b-8a8e-49b8-897b-aa663ee38009',
      assignmentId: '7809a72b-8a8e-49b8-897b-dd663ee38005',
    },
  ],
  CONTENT_EDITOR: [
    {
      userId: '4f128a30-78eb-48ff-8419-8124593653b5',
      assignmentId: '3bc4fec6-d862-4cbf-bb37-446128135b93',
    },
  ],
} as const;

async function main() {
  const accounts = accountsSchema.parse(
    JSON.parse(fs.readFileSync(process.argv[2] ?? '/dev/stdin', 'utf8')),
  ).accounts;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required');
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
  try {
    await importFixture(prisma);
    for (const customRole of customRoles) {
      const role = await prisma.role.upsert({
        where: { name: customRole.name },
        update: {},
        create: { name: customRole.name },
      });
      const permissions = await prisma.permission.findMany({
        where: { key: { in: [...customRole.permissions] } },
        select: { id: true },
      });
      if (permissions.length !== customRole.permissions.length)
        throw new Error(`Missing permission for ${customRole.name}`);
      await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
      if (permissions.length)
        await prisma.rolePermission.createMany({
          data: permissions.map(({ id }) => ({
            roleId: role.id,
            permissionId: id,
          })),
        });
    }
    const indexes = {
      SUPER_ADMIN: 0,
      READER: 0,
      PORTAL_MEMBER: 0,
      CONTENT_EDITOR: 0,
    };
    for (const account of accounts) {
      const binding = bindings[account.role][indexes[account.role]++];
      if (!binding) throw new Error(`Too many ${account.role} demo accounts`);
      const role = await prisma.role.findUniqueOrThrow({
        where: { name: account.role },
        select: { id: true },
      });
      await prisma.user.update({
        where: { id: binding.userId },
        data: {
          email: account.account,
          firstName: account.role === 'SUPER_ADMIN' ? 'Super' : 'Demo',
          lastName: account.role.replaceAll('_', ' '),
          status: 'ACTIVE',
        },
      });
      const salt = randomBytes(16).toString('hex');
      const passwordHash = (
        (await scrypt(account.password, salt, 64)) as Buffer
      ).toString('hex');
      await prisma.localCredential.upsert({
        where: { userId: binding.userId },
        update: { salt, passwordHash },
        create: { userId: binding.userId, salt, passwordHash },
      });
      await prisma.externalIdentity.deleteMany({
        where: {
          OR: [
            { userId: binding.userId },
            { issuer: 'authjs:credentials', subject: account.account },
          ],
        },
      });
      await prisma.externalIdentity.create({
        data: {
          issuer: 'authjs:credentials',
          subject: account.account,
          userId: binding.userId,
        },
      });
      await prisma.roleAssignment.update({
        where: { id: binding.assignmentId },
        data: {
          userId: binding.userId,
          roleId: role.id,
          contextType: 'PLATFORM',
          contextId: 'GLOBAL',
          status: 'ACTIVE',
        },
      });
    }

    const fixtureBindings = Object.values(bindings).flat();
    const activeAssignmentIds = fixtureBindings.map(
      ({ assignmentId }) => assignmentId,
    );
    await prisma.roleAssignment.deleteMany({
      where: {
        userId: { in: fixtureBindings.map(({ userId }) => userId) },
        id: { notIn: activeAssignmentIds },
      },
    });
    await prisma.role.deleteMany({
      where: {
        name: { in: [...legacyRoleNames] },
        roleAssignments: { none: {} },
      },
    });
    await prisma.permission.deleteMany({ where: { roles: { none: {} } } });
    console.log(
      `Provisioned ${accounts.length} Auth.js demo identities for 4 portal roles.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Demo seed failed');
  process.exitCode = 1;
});
