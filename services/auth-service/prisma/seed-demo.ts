import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'node:fs';
import { z } from 'zod';
import { importFixture } from './import-fixture';

const roles = [
  'SUPER_ADMIN',
  'RESEARCHER',
  'ORGANIZATION_REPRESENTATIVE',
  'REVIEWER',
  'COLLABORATION_MANAGER',
  'FOUNDATION_DECISION_MAKER',
] as const;
const accountsSchema = z.object({
  accounts: z
    .array(
      z.object({
        account: z.string().min(1),
        password: z.string().min(8),
        role: z.enum(roles),
      }),
    )
    .length(6)
    .refine(
      (accounts) =>
        new Set(accounts.map(({ role }) => role)).size === accounts.length,
      'Each demo role must occur exactly once',
    ),
});

const fixtureUserByRole = {
  SUPER_ADMIN: '6a63ec6d-f493-4d7a-8fb3-fc8f08fd26db',
  RESEARCHER: '7809a72b-8a8e-49b8-897b-bb663ee38021',
  ORGANIZATION_REPRESENTATIVE: '7809a72b-8a8e-49b8-897b-aa663ee38003',
  REVIEWER: '7809a72b-8a8e-49b8-897b-aa663ee38005',
  COLLABORATION_MANAGER: '7809a72b-8a8e-49b8-897b-aa663ee38007',
  FOUNDATION_DECISION_MAKER: '7809a72b-8a8e-49b8-897b-aa663ee38009',
} as const;
const fixtureRoleIds = {
  SUPER_ADMIN: 'e4f570dc-3a5d-4091-b5ee-4274fe9a6a7d',
  RESEARCHER: '7809a72b-8a8e-49b8-897b-ff663ee38001',
  ORGANIZATION_REPRESENTATIVE: '7809a72b-8a8e-49b8-897b-ff663ee38002',
  REVIEWER: '7809a72b-8a8e-49b8-897b-ff663ee38003',
  COLLABORATION_MANAGER: '7809a72b-8a8e-49b8-897b-ff663ee38004',
  FOUNDATION_DECISION_MAKER: '7809a72b-8a8e-49b8-897b-ff663ee38005',
} as const;
const fixtureAssignments = {
  SUPER_ADMIN: {
    id: '7a23f350-6cbb-49d9-a63a-10e2f136d20e',
    contextType: 'PLATFORM',
    contextId: 'GLOBAL',
  },
  RESEARCHER: {
    id: '7809a72b-8a8e-49b8-897b-dd663ee38021',
    contextType: 'ORGANIZATION',
    contextId: 'a5b7d6e4-8d4e-4fdf-9753-1579b248a3e7',
  },
  ORGANIZATION_REPRESENTATIVE: {
    id: '7809a72b-8a8e-49b8-897b-dd663ee38002',
    contextType: 'ORGANIZATION',
    contextId: 'e1d5a7d3-7d1a-47ef-b203-d2d89f7db387',
  },
  REVIEWER: {
    id: '7809a72b-8a8e-49b8-897b-dd663ee38003',
    contextType: 'REVIEW_BOARD',
    contextId: 'BOARD_001',
  },
  COLLABORATION_MANAGER: {
    id: '7809a72b-8a8e-49b8-897b-dd663ee38004',
    contextType: 'PLATFORM',
    contextId: 'GLOBAL',
  },
  FOUNDATION_DECISION_MAKER: {
    id: '7809a72b-8a8e-49b8-897b-dd663ee38005',
    contextType: 'PLATFORM',
    contextId: 'GLOBAL',
  },
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
    for (const account of accounts) {
      const userId = fixtureUserByRole[account.role];
      const assignment = fixtureAssignments[account.role];
      await prisma.user.upsert({
        where: { id: userId },
        update: { email: account.account, status: 'ACTIVE' },
        create: { id: userId, email: account.account, status: 'ACTIVE' },
      });
      await prisma.externalIdentity.deleteMany({ where: { userId } });
      await prisma.externalIdentity.create({
        data: {
          issuer: 'authjs:credentials',
          subject: account.account,
          userId,
        },
      });
      await prisma.roleAssignment.upsert({
        where: { id: assignment.id },
        update: {
          userId,
          roleId: fixtureRoleIds[account.role],
          contextType: assignment.contextType,
          contextId: assignment.contextId,
          status: 'ACTIVE',
        },
        create: {
          ...assignment,
          userId,
          roleId: fixtureRoleIds[account.role],
          status: 'ACTIVE',
        },
      });
    }
    console.log(
      `Provisioned ${accounts.length} Auth.js demo identities and role assignments.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Demo seed failed');
  process.exitCode = 1;
});
