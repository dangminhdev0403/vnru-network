import { importFixture } from '../../../prisma/import-fixture';
import * as path from 'path';
import * as fs from 'fs';

describe('Workflow Role Fixtures Importer', () => {
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn((callback) => callback(mockPrisma)),
      user: {
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.create })),
      },
      externalIdentity: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.create.id, ...args.create })),
      },
      role: {
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id || args.create.id, ...args.create })),
        findUnique: jest.fn(),
      },
      permission: {
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.create.id, ...args.create })),
        findUnique: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'perm-id', key: args.where.key })),
      },
      rolePermission: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'rp-id', ...args.create })),
      },
      roleAssignment: {
        upsert: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.create.id, ...args.create })),
      },
    };
  });

  it('proves shape, exact capabilities, context, and idempotency intent for all fixtures', async () => {
    const fixturePath = path.join(__dirname, '../../../prisma/account.json');
    
    // Import fixtures
    const results = await importFixture(mockPrisma, fixturePath);

    expect(results).toHaveLength(9);
    expect(mockPrisma.externalIdentity.deleteMany).toHaveBeenCalledWith({
      where: {
        issuer: 'http://127.0.0.1:8081/realms/vnru',
        subject: 'curator-keycloak-subject-uuid-1234',
        id: { not: '7809a72b-8a8e-49b8-897b-bb663ee38712' },
      },
    });
    expect(mockPrisma.externalIdentity.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-bb663ee38712' },
        update: expect.objectContaining({
          issuer: 'http://127.0.0.1:8081/realms/vnru',
          subject: 'curator-keycloak-subject-uuid-1234',
        }),
      }),
    );

    // 1. KNOWLEDGE_CURATOR Checks
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-bb663ee38711' },
        create: {
          id: '7809a72b-8a8e-49b8-897b-bb663ee38711',
          email: 'curator@vnru.network',
          status: 'ACTIVE',
        },
      }),
    );
    expect(mockPrisma.role.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'KNOWLEDGE_CURATOR' },
      }),
    );
    expect(mockPrisma.permission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'knowledge.workspace.view' },
      }),
    );
    expect(mockPrisma.roleAssignment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-bb663ee38716' },
        update: expect.objectContaining({ contextType: 'PLATFORM', contextId: 'GLOBAL' }),
      }),
    );

    // 2. RESEARCHER VN Checks
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-aa663ee38001' },
        create: {
          id: '7809a72b-8a8e-49b8-897b-aa663ee38001',
          email: 'researcher@vnru.network',
          status: 'ACTIVE',
        },
      }),
    );
    expect(mockPrisma.role.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'RESEARCHER' },
      }),
    );
    const researcherPermissions = [
      'knowledge.workspace.view',
      'collab.proposals.create',
      'collab.proposals.confirm_paired',
      'collab.proposals.submit',
      'projects.projects.view',
      'projects.milestones.update',
      'projects.reports.submit',
    ];
    for (const key of researcherPermissions) {
      expect(mockPrisma.permission.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { key },
        }),
      );
    }
    expect(mockPrisma.roleAssignment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: expect.any(String) }),
        update: expect.objectContaining({ userId: '7809a72b-8a8e-49b8-897b-aa663ee38001', roleId: '7809a72b-8a8e-49b8-897b-ff663ee38001', contextType: 'ORGANIZATION', contextId: 'e1d5a7d3-7d1a-47ef-b203-d2d89f7db387' }),
      }),
    );

    // 3. RESEARCHER RU Checks
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-bb663ee38021' },
        create: {
          id: '7809a72b-8a8e-49b8-897b-bb663ee38021',
          email: 'researcher_ru@vnru.network',
          status: 'ACTIVE',
        },
      }),
    );
    expect(mockPrisma.roleAssignment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: expect.any(String) }),
        update: expect.objectContaining({ userId: '7809a72b-8a8e-49b8-897b-bb663ee38021', roleId: '7809a72b-8a8e-49b8-897b-ff663ee38001', contextType: 'ORGANIZATION', contextId: 'ORG_002' }),
      }),
    );

    // 4. ORGANIZATION_REPRESENTATIVE VN Checks
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-aa663ee38003' },
      }),
    );
    expect(mockPrisma.role.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'ORGANIZATION_REPRESENTATIVE' },
      }),
    );
    expect(mockPrisma.permission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'collab.proposals.endorse' },
      }),
    );
    expect(mockPrisma.roleAssignment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: expect.any(String) }),
        update: expect.objectContaining({ userId: '7809a72b-8a8e-49b8-897b-aa663ee38003', roleId: '7809a72b-8a8e-49b8-897b-ff663ee38002', contextType: 'ORGANIZATION', contextId: 'ORG_001' }),
      }),
    );

    // 5. ORGANIZATION_REPRESENTATIVE RU Checks
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-bb663ee38023' },
        create: {
          id: '7809a72b-8a8e-49b8-897b-bb663ee38023',
          email: 'org_rep_ru@vnru.network',
          status: 'ACTIVE',
        },
      }),
    );
    expect(mockPrisma.roleAssignment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: expect.any(String) }),
        update: expect.objectContaining({ userId: '7809a72b-8a8e-49b8-897b-bb663ee38023', roleId: '7809a72b-8a8e-49b8-897b-ff663ee38002', contextType: 'ORGANIZATION', contextId: 'ORG_002' }),
      }),
    );

    // 4. REVIEWER Checks
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-aa663ee38005' },
      }),
    );
    expect(mockPrisma.role.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'REVIEWER' },
      }),
    );
    expect(mockPrisma.permission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'reviews.evaluations.score' },
      }),
    );
    expect(mockPrisma.roleAssignment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: expect.any(String) }),
        update: expect.objectContaining({ userId: '7809a72b-8a8e-49b8-897b-aa663ee38005', roleId: '7809a72b-8a8e-49b8-897b-ff663ee38003', contextType: 'REVIEW_BOARD', contextId: expect.any(String) }),
      }),
    );

    // 5. COLLABORATION_MANAGER Checks
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-aa663ee38007' },
      }),
    );
    expect(mockPrisma.role.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'COLLABORATION_MANAGER' },
      }),
    );
    expect(mockPrisma.roleAssignment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: expect.any(String) }),
        update: expect.objectContaining({ userId: '7809a72b-8a8e-49b8-897b-aa663ee38007', roleId: '7809a72b-8a8e-49b8-897b-ff663ee38004', contextType: 'PLATFORM', contextId: 'GLOBAL' }),
      }),
    );

    // 6. FOUNDATION_DECISION_MAKER Checks
    expect(mockPrisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '7809a72b-8a8e-49b8-897b-aa663ee38009' },
      }),
    );
    expect(mockPrisma.role.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'FOUNDATION_DECISION_MAKER' },
      }),
    );
    expect(mockPrisma.permission.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'collab.decisions.issue_foundation' },
      }),
    );

    // The local full-access account remains provisioned through the fixture.
    const allRoleCalls = mockPrisma.role.upsert.mock.calls.map((call: any) => call[0].where.name);
    expect(allRoleCalls).toContain('SUPER_ADMIN');
    for (const key of ['iam.users.manage', 'iam.roles.manage', 'iam.audit.view']) {
      expect(mockPrisma.permission.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { key } }),
      );
    }

    // Run again to verify idempotency intent (successive execution should not fail and behave same way)
    await expect(importFixture(mockPrisma, fixturePath)).resolves.not.toThrow();
  });

  it('fails validation when role is not in the allowlist', async () => {
    const invalidFixture = {
      _metadata: {
        description: 'Test invalid role',
        warning: 'None',
      },
      fixtures: [
        {
          user: {
            id: '7809a72b-8a8e-49b8-897b-aa663ee38001',
            email: 'admin@vnru.network',
            status: 'ACTIVE',
          },
          externalIdentity: {
            id: '7809a72b-8a8e-49b8-897b-aa663ee38002',
            issuer: 'http://localhost:8081/realms/vnru',
            subject: 'admin-subject',
          },
          role: {
            id: '7809a72b-8a8e-49b8-897b-ff663ee38001',
            name: 'UNKNOWN_ADMIN', // Invalid, not in ALLOWED_ROLES
          },
          permissions: [
            {
              id: '7809a72b-8a8e-49b8-897b-ee663ee38001',
              key: 'projects.projects.view',
            },
          ],
          roleAssignment: {
            id: '7809a72b-8a8e-49b8-897b-dd663ee38001',
            contextType: 'ORGANIZATION',
            contextId: 'ORG_001',
            status: 'ACTIVE',
          },
        },
      ],
    };

    const tempFilePath = path.join(__dirname, 'temp-invalid-role.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(invalidFixture));

    try {
      await expect(importFixture(mockPrisma, tempFilePath)).rejects.toThrow();
    } finally {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  });

  it('fails validation when a known capability or context belongs to another role', async () => {
    const fixturePath = path.join(__dirname, '../../../prisma/account.json');
    const document = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    document.fixtures[1].permissions = document.fixtures[2].permissions;
    document.fixtures[1].roleAssignment.contextType = 'REVIEW_BOARD';
    const tempFilePath = path.join(__dirname, 'temp-invalid-role-policy.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(document));
    try {
      await expect(importFixture(mockPrisma, tempFilePath)).rejects.toThrow(/exact capability set|requires ORGANIZATION/);
    } finally {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    }
  });

  it('fails validation when capability is not in the allowlist', async () => {
    const invalidFixture = {
      _metadata: {
        description: 'Test invalid capability',
        warning: 'None',
      },
      fixtures: [
        {
          user: {
            id: '7809a72b-8a8e-49b8-897b-aa663ee38001',
            email: 'researcher@vnru.network',
            status: 'ACTIVE',
          },
          externalIdentity: {
            id: '7809a72b-8a8e-49b8-897b-aa663ee38002',
            issuer: 'http://localhost:8081/realms/vnru',
            subject: 'researcher-subject',
          },
          role: {
            id: '7809a72b-8a8e-49b8-897b-ff663ee38001',
            name: 'RESEARCHER',
          },
          permissions: [
            {
              id: '7809a72b-8a8e-49b8-897b-ee663ee38001',
              key: 'admin.all.access', // Invalid permission key
            },
          ],
          roleAssignment: {
            id: '7809a72b-8a8e-49b8-897b-dd663ee38001',
            contextType: 'ORGANIZATION',
            contextId: 'ORG_001',
            status: 'ACTIVE',
          },
        },
      ],
    };

    const tempFilePath = path.join(__dirname, 'temp-invalid-capability.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(invalidFixture));

    try {
      await expect(importFixture(mockPrisma, tempFilePath)).rejects.toThrow();
    } finally {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  });
});
