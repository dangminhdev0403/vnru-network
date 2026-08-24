import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'node:fs';
import { z } from 'zod';
import { importFixture } from './import-fixture';

const accountsSchema = z.object({
  accounts: z
    .array(
      z.object({
        account: z.string().min(1),
        password: z.string().min(8),
        role: z.enum([
          'SUPER_ADMIN',
          'RESEARCHER',
          'ORGANIZATION_REPRESENTATIVE',
          'REVIEWER',
          'COLLABORATION_MANAGER',
          'FOUNDATION_DECISION_MAKER',
        ]),
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

type Account = z.infer<typeof accountsSchema>['accounts'][number];

async function request(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok)
    throw new Error(`${init?.method ?? 'GET'} ${url}: ${response.status}`);
  return response;
}

async function adminToken(baseUrl: string, username: string, password: string) {
  const response = await request(
    `${baseUrl}/realms/master/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username,
        password,
      }),
    },
  );
  const body = (await response.json()) as { access_token?: unknown };
  if (typeof body.access_token !== 'string')
    throw new Error('Keycloak returned no admin token');
  return body.access_token;
}

async function provisionKeycloak(accounts: Account[]) {
  const baseUrl = process.env.KEYCLOAK_ADMIN_URL ?? 'http://keycloak:8080';
  const publicUrl = process.env.KEYCLOAK_PUBLIC_URL ?? baseUrl;
  const realm = process.env.KEYCLOAK_REALM ?? 'vnru';
  const admin = process.env.KEYCLOAK_ADMIN ?? 'admin';
  const password = process.env.KEYCLOAK_ADMIN_PASSWORD;
  if (!password) throw new Error('KEYCLOAK_ADMIN_PASSWORD is required');

  let token: string | undefined;
  for (let attempt = 0; attempt < 30 && !token; attempt += 1) {
    try {
      token = await adminToken(baseUrl, admin, password);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
  }
  if (!token) throw new Error('Keycloak did not become ready');
  const headers = {
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  };

  const realmUrl = `${baseUrl}/admin/realms/${realm}`;
  const existingRealm = await fetch(realmUrl, { headers });
  if (existingRealm.status === 404) {
    await request(`${baseUrl}/admin/realms`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        realm,
        enabled: true,
        registrationAllowed: true,
        resetPasswordAllowed: true,
        loginTheme: 'vnru',
      }),
    });
  } else if (existingRealm.ok) {
    await request(realmUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        ...(await existingRealm.json()),
        registrationAllowed: true,
        resetPasswordAllowed: true,
        loginTheme: 'vnru',
      }),
    });
  } else throw new Error(`Unable to inspect realm: ${existingRealm.status}`);

  const ensureClient = async (
    clientId: string,
    secret: string,
    profile = false,
  ) => {
    const found = (await request(
      `${realmUrl}/clients?clientId=${encodeURIComponent(clientId)}`,
      { headers },
    ).then((r) => r.json())) as Array<{ id: string }>;
    const data = profile
      ? {
          clientId,
          secret,
          enabled: true,
          publicClient: false,
          serviceAccountsEnabled: true,
          standardFlowEnabled: false,
        }
      : {
          clientId,
          secret,
          enabled: true,
          publicClient: false,
          standardFlowEnabled: true,
          directAccessGrantsEnabled: false,
          redirectUris: [
            `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/api/auth/callback/keycloak`,
          ],
          webOrigins: [process.env.FRONTEND_URL ?? 'http://localhost:3000'],
        };
    if (found[0])
      await request(`${realmUrl}/clients/${found[0].id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    else
      await request(`${realmUrl}/clients`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    return (
      (await request(
        `${realmUrl}/clients?clientId=${encodeURIComponent(clientId)}`,
        { headers },
      ).then((r) => r.json())) as Array<{ id: string }>
    )[0]?.id;
  };
  await ensureClient(
    'vnru-auth',
    process.env.KEYCLOAK_CLIENT_SECRET ?? 'vnru-demo-client-secret',
  );
  const profileClient = await ensureClient(
    'vnru-profile-service',
    process.env.KEYCLOAK_PROFILE_CLIENT_SECRET ?? 'vnru-demo-profile-secret',
    true,
  );
  if (!profileClient) throw new Error('Unable to resolve profile client');
  const serviceAccount = (await request(
    `${realmUrl}/clients/${profileClient}/service-account-user`,
    { headers },
  ).then((r) => r.json())) as { id: string };
  const realmManagement = (
    (await request(`${realmUrl}/clients?clientId=realm-management`, {
      headers,
    }).then((r) => r.json())) as Array<{ id: string }>
  )[0];
  if (!realmManagement) throw new Error('realm-management client is missing');
  const availableRoles = (await request(
    `${realmUrl}/users/${serviceAccount.id}/role-mappings/clients/${realmManagement.id}/available`,
    { headers },
  ).then((r) => r.json())) as Array<{ id: string; name: string }>;
  const profileRoles = availableRoles.filter(
    ({ name }) => name === 'manage-users' || name === 'view-users',
  );
  if (profileRoles.length)
    await request(
      `${realmUrl}/users/${serviceAccount.id}/role-mappings/clients/${realmManagement.id}`,
      { method: 'POST', headers, body: JSON.stringify(profileRoles) },
    );

  const subjects = new Map<Account['role'], string>();
  for (const account of accounts) {
    const matches = (await request(
      `${realmUrl}/users?username=${encodeURIComponent(account.account)}&exact=true`,
      { headers },
    ).then((r) => r.json())) as Array<{ id: string }>;
    let subject: string | undefined = matches[0]?.id;
    if (!subject) {
      const response = await request(`${realmUrl}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          username: account.account,
          enabled: true,
          email: account.account.includes('@') ? account.account : undefined,
          emailVerified: account.account.includes('@'),
        }),
      });
      subject = response.headers.get('location')?.split('/').pop() ?? undefined;
    }
    if (!subject)
      throw new Error(`Unable to resolve Keycloak user for ${account.role}`);
    await request(`${realmUrl}/users/${subject}/reset-password`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        type: 'password',
        temporary: false,
        value: account.password,
      }),
    });
    subjects.set(account.role, subject);
  }
  return { issuer: `${publicUrl}/realms/${realm}`, subjects };
}

async function main() {
  const accountPath = process.argv[2] ?? '/dev/stdin';
  const accounts = accountsSchema.parse(
    JSON.parse(fs.readFileSync(accountPath, 'utf8')),
  ).accounts;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required');
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
  try {
    const { issuer, subjects } = await provisionKeycloak(accounts);
    await importFixture(prisma);
    for (const account of accounts) {
      const userId = fixtureUserByRole[account.role];
      const roleId = fixtureRoleIds[account.role];
      const assignment = fixtureAssignments[account.role];
      const subject = subjects.get(account.role);
      if (!subject) throw new Error(`Missing subject for ${account.role}`);
      await prisma.user.upsert({
        where: { id: userId },
        update: { email: account.account, status: 'ACTIVE' },
        create: { id: userId, email: account.account, status: 'ACTIVE' },
      });
      await prisma.externalIdentity.deleteMany({ where: { userId } });
      await prisma.externalIdentity.create({
        data: { issuer, subject, userId },
      });
      await prisma.roleAssignment.upsert({
        where: { id: assignment.id },
        update: {
          userId,
          roleId,
          contextType: assignment.contextType,
          contextId: assignment.contextId,
          status: 'ACTIVE',
        },
        create: { ...assignment, userId, roleId, status: 'ACTIVE' },
      });
    }
  } finally {
    await prisma.$disconnect();
  }
  console.log(
    `Provisioned ${accounts.length} demo identities and role assignments.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Demo seed failed');
  process.exitCode = 1;
});
