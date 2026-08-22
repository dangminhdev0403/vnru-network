import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

const ALLOWED_CAPABILITIES = [
  'knowledge.workspace.view',
  'experts.matches.view',
  'grants.proposals.create',
  'grants.proposals.confirm_paired',
  'grants.proposals.submit',
  'projects.projects.view',
  'projects.milestones.update',
  'projects.reports.submit',
  'grants.proposals.endorse',
  'projects.reports.view_org',
  'reviews.assignments.view_assigned',
  'reviews.evaluations.score',
  'reviews.evaluations.submit',
  'grants.opportunities.create',
  'grants.opportunities.publish',
  'grants.proposals.screen',
  'reviews.assignments.manage',
  'projects.reports.approve',
  'grants.decisions.issue_foundation',
] as const;

const ALLOWED_ROLES = [
  'KNOWLEDGE_CURATOR',
  'RESEARCHER',
  'ORGANIZATION_REPRESENTATIVE',
  'REVIEWER',
  'PROGRAM_MANAGER',
  'FOUNDATION_DECISION_MAKER',
] as const;

const ALLOWED_CONTEXT_TYPES = [
  'PLATFORM',
  'ORGANIZATION',
  'REVIEW_BOARD',
  'FUNDING_PROGRAM',
] as const;

const ROLE_POLICIES: Record<(typeof ALLOWED_ROLES)[number], {
  contextType: (typeof ALLOWED_CONTEXT_TYPES)[number];
  capabilities: readonly (typeof ALLOWED_CAPABILITIES)[number][];
}> = {
  KNOWLEDGE_CURATOR: { contextType: 'PLATFORM', capabilities: ['knowledge.workspace.view', 'experts.matches.view'] },
  RESEARCHER: { contextType: 'ORGANIZATION', capabilities: ['grants.proposals.create', 'grants.proposals.confirm_paired', 'grants.proposals.submit', 'projects.projects.view', 'projects.milestones.update', 'projects.reports.submit'] },
  ORGANIZATION_REPRESENTATIVE: { contextType: 'ORGANIZATION', capabilities: ['grants.proposals.endorse', 'projects.projects.view', 'projects.reports.view_org'] },
  REVIEWER: { contextType: 'REVIEW_BOARD', capabilities: ['reviews.assignments.view_assigned', 'reviews.evaluations.score', 'reviews.evaluations.submit'] },
  PROGRAM_MANAGER: { contextType: 'FUNDING_PROGRAM', capabilities: ['grants.opportunities.create', 'grants.opportunities.publish', 'grants.proposals.screen', 'reviews.assignments.manage', 'projects.projects.view', 'projects.reports.approve'] },
  FOUNDATION_DECISION_MAKER: { contextType: 'FUNDING_PROGRAM', capabilities: ['grants.decisions.issue_foundation', 'projects.projects.view'] },
};

const singleFixtureSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
  }),
  externalIdentity: z.object({
    id: z.string().uuid(),
    issuer: z.string().url(),
    subject: z.string().min(1),
  }),
  role: z.object({
    id: z.string().uuid(),
    name: z.enum(ALLOWED_ROLES),
  }),
  permissions: z
    .array(
      z.object({
        id: z.string().uuid(),
        key: z.enum(ALLOWED_CAPABILITIES),
      }),
    )
    .refine(
      (permissions) => new Set(permissions.map(({ key }) => key)).size === permissions.length,
      'Permissions must be unique within a fixture'
    ),
  roleAssignment: z.object({
    id: z.string().uuid(),
    contextType: z.enum(ALLOWED_CONTEXT_TYPES),
    contextId: z.string().min(1),
    status: z.enum(['ACTIVE', 'INACTIVE']),
  }),
}).superRefine((fixture, context) => {
  const policy = ROLE_POLICIES[fixture.role.name];
  const actual = fixture.permissions.map(({ key }) => key).sort();
  const expected = [...policy.capabilities].sort();
  if (fixture.roleAssignment.contextType !== policy.contextType) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['roleAssignment', 'contextType'], message: `Role ${fixture.role.name} requires ${policy.contextType} context` });
  }
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['permissions'], message: `Role ${fixture.role.name} must have its exact capability set` });
  }
});

const fixturesDocumentSchema = z.object({
  _metadata: z.object({
    description: z.string(),
    warning: z.string(),
  }),
  fixtures: z.array(singleFixtureSchema),
});

export async function importFixture(prisma: PrismaClient, fixturePath?: string) {
  const resolvedPath = fixturePath ?? path.join(__dirname, 'account.json');
  const rawData = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  const data = fixturesDocumentSchema.parse(rawData);

  return prisma.$transaction(async (tx) => {
    const results: { userId: string; roleId: string }[] = [];
    for (const item of data.fixtures) {
      const user = await tx.user.upsert({
        where: { id: item.user.id },
        update: { email: item.user.email, status: item.user.status },
        create: item.user,
      });

      await tx.externalIdentity.upsert({
        where: {
          issuer_subject: {
            issuer: item.externalIdentity.issuer,
            subject: item.externalIdentity.subject,
          },
        },
        update: { userId: user.id },
        create: { ...item.externalIdentity, userId: user.id },
      });

      const role = await tx.role.upsert({
        where: { name: item.role.name },
        update: {},
        create: item.role,
      });

      await tx.rolePermission.deleteMany({ where: { roleId: role.id } });
      for (const permission of item.permissions) {
        const stored = await tx.permission.upsert({
          where: { key: permission.key },
          update: {},
          create: permission,
        });

        await tx.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: stored.id } },
          update: {},
          create: { roleId: role.id, permissionId: stored.id },
        });
      }

      await tx.roleAssignment.upsert({
        where: {
          userId_roleId_contextType_contextId: {
            userId: user.id,
            roleId: role.id,
            contextType: item.roleAssignment.contextType,
            contextId: item.roleAssignment.contextId,
          },
        },
        update: { status: item.roleAssignment.status },
        create: {
          ...item.roleAssignment,
          userId: user.id,
          roleId: role.id,
        },
      });

      results.push({ userId: user.id, roleId: role.id });
    }
    return results;
  });
}

if (require.main === module) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required');
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  importFixture(prisma)
    .then(() => console.log('Imported synthetic workflow role fixtures.'))
    .catch((error: unknown) => {
      console.error('Failed to import synthetic workflow role fixtures:', error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
