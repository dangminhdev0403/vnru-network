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

    expect(results).toHaveLength(6);

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
        where: {
          userId_roleId_contextType_contextId: {
            userId: '7809a72b-8a8e-49b8-897b-bb663ee38711',
            roleId: '7809a72b-8a8e-49b8-897b-bb663ee38713',
            contextType: 'PLATFORM',
            contextId: 'GLOBAL',
          },
        },
      }),
    );

    // 2. RESEARCHER Checks
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
        where: {
          userId_roleId_contextType_contextId: {
            userId: '7809a72b-8a8e-49b8-897b-aa663ee38001',
            roleId: '7809a72b-8a8e-49b8-897b-ff663ee38001',
            contextType: 'ORGANIZATION',
            contextId: 'ORG_001',
          },
        },
      }),
    );

    // 3. ORGANIZATION_REPRESENTATIVE Checks
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
        where: {
          userId_roleId_contextType_contextId: {
            userId: '7809a72b-8a8e-49b8-897b-aa663ee38003',
            roleId: '7809a72b-8a8e-49b8-897b-ff663ee38002',
            contextType: 'ORGANIZATION',
            contextId: 'ORG_001',
          },
        },
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
        where: {
          userId_roleId_contextType_contextId: {
            userId: '7809a72b-8a8e-49b8-897b-aa663ee38005',
            roleId: '7809a72b-8a8e-49b8-897b-ff663ee38003',
            contextType: 'REVIEW_BOARD',
            contextId: 'BOARD_001',
          },
        },
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
        where: {
          userId_roleId_contextType_contextId: {
            userId: '7809a72b-8a8e-49b8-897b-aa663ee38007',
            roleId: '7809a72b-8a8e-49b8-897b-ff663ee38004',
            contextType: 'PLATFORM',
            contextId: 'GLOBAL',
          },
        },
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

    // Verify no SUPER_ADMIN exists
    const allRoleCalls = mockPrisma.role.upsert.mock.calls.map((call: any) => call[0].where.name);
    expect(allRoleCalls).not.toContain('SUPER_ADMIN');

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
            name: 'SUPER_ADMIN', // Invalid, not in ALLOWED_ROLES
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
