import {
  AccessControlPrismaClient,
  AccessControlService,
  ResolveCapabilitiesInput,
} from './access-control.service';

describe('AccessControlService', () => {
  let service: AccessControlService;
  let prisma: {
    roleAssignment: {
      findMany: jest.MockedFunction<
        AccessControlPrismaClient['roleAssignment']['findMany']
      >;
    };
  };

  beforeEach(() => {
    prisma = {
      roleAssignment: {
        findMany: jest.fn(),
      },
    };

    service = new AccessControlService(prisma);
  });

  it('resolves exact capability keys for an active assignment matching (userId, contextType, contextId)', async () => {
    const input: ResolveCapabilitiesInput = {
      userId: 'usr-1',
      contextType: 'ORGANIZATION',
      contextId: 'org-100',
    };

    prisma.roleAssignment.findMany.mockResolvedValue([
      {
        id: 'ra-1',
        userId: 'usr-1',
        contextType: 'ORGANIZATION',
        contextId: 'org-100',
        status: 'ACTIVE',
        role: {
          id: 'role-org-admin',
          name: 'INSTITUTION_ADMIN',
          permissions: [
            {
              permission: {
                id: 'perm-1',
                key: 'organization.members.manage',
              },
            },
            {
              permission: {
                id: 'perm-2',
                key: 'grants.proposals.verify_institutional',
              },
            },
          ],
        },
      },
    ]);

    const capabilities = await service.resolveCapabilities(input);

    expect(prisma.roleAssignment.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'usr-1',
        contextType: 'ORGANIZATION',
        contextId: 'org-100',
        status: 'ACTIVE',
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    expect(capabilities).toEqual([
      'grants.proposals.verify_institutional',
      'organization.members.manage',
    ]);
  });

  it('does not union permissions across different contexts', async () => {
    const orgInput: ResolveCapabilitiesInput = {
      userId: 'usr-1',
      contextType: 'ORGANIZATION',
      contextId: 'org-100',
    };

    prisma.roleAssignment.findMany.mockImplementation(
      ({
        where,
      }: Parameters<
        AccessControlPrismaClient['roleAssignment']['findMany']
      >[0]) => {
        if (
          where.userId === 'usr-1' &&
          where.contextType === 'ORGANIZATION' &&
          where.contextId === 'org-100' &&
          where.status === 'ACTIVE'
        ) {
          return Promise.resolve([
            {
              id: 'ra-1',
              userId: 'usr-1',
              contextType: 'ORGANIZATION',
              contextId: 'org-100',
              status: 'ACTIVE',
              role: {
                id: 'role-researcher',
                name: 'RESEARCHER',
                permissions: [
                  {
                    permission: {
                      id: 'perm-res',
                      key: 'grants.proposals.create',
                    },
                  },
                ],
              },
            },
          ]);
        }

        if (
          where.userId === 'usr-1' &&
          where.contextType === 'REVIEW_PANEL' &&
          where.contextId === 'panel-200' &&
          where.status === 'ACTIVE'
        ) {
          return Promise.resolve([
            {
              id: 'ra-2',
              userId: 'usr-1',
              contextType: 'REVIEW_PANEL',
              contextId: 'panel-200',
              status: 'ACTIVE',
              role: {
                id: 'role-reviewer',
                name: 'REVIEWER',
                permissions: [
                  {
                    permission: {
                      id: 'perm-rev',
                      key: 'reviews.evaluations.score',
                    },
                  },
                ],
              },
            },
          ]);
        }

        return Promise.resolve([]);
      },
    );

    const orgCapabilities = await service.resolveCapabilities(orgInput);
    expect(orgCapabilities).toEqual(['grants.proposals.create']);
    expect(orgCapabilities).not.toContain('reviews.evaluations.score');

    const panelCapabilities = await service.resolveCapabilities({
      userId: 'usr-1',
      contextType: 'REVIEW_PANEL',
      contextId: 'panel-200',
    });
    expect(panelCapabilities).toEqual(['reviews.evaluations.score']);
    expect(panelCapabilities).not.toContain('grants.proposals.create');
  });

  it('fails closed and returns an empty list when assignment is missing or non-existent', async () => {
    prisma.roleAssignment.findMany.mockResolvedValue([]);

    const capabilities = await service.resolveCapabilities({
      userId: 'usr-unassigned',
      contextType: 'ORGANIZATION',
      contextId: 'org-999',
    });

    expect(capabilities).toEqual([]);
  });

  it('fails closed and returns an empty list when role assignment is inactive', async () => {
    // When querying for status: 'ACTIVE', inactive records are not returned by the repository query
    prisma.roleAssignment.findMany.mockResolvedValue([]);

    const capabilities = await service.resolveCapabilities({
      userId: 'usr-inactive',
      contextType: 'ORGANIZATION',
      contextId: 'org-100',
    });

    expect(capabilities).toEqual([]);
  });

  it('returns capability keys only (never role names) and deduplicates multiple role permissions in the same context', async () => {
    prisma.roleAssignment.findMany.mockResolvedValue([
      {
        id: 'ra-10',
        userId: 'usr-2',
        contextType: 'ORGANIZATION',
        contextId: 'org-100',
        status: 'ACTIVE',
        role: {
          id: 'role-faculty',
          name: 'FACULTY_MEMBER',
          permissions: [
            {
              permission: {
                id: 'p-1',
                key: 'grants.proposals.create',
              },
            },
            {
              permission: {
                id: 'p-2',
                key: 'knowledge.publications.submit',
              },
            },
          ],
        },
      },
      {
        id: 'ra-11',
        userId: 'usr-2',
        contextType: 'ORGANIZATION',
        contextId: 'org-100',
        status: 'ACTIVE',
        role: {
          id: 'role-lab-lead',
          name: 'LAB_LEAD',
          permissions: [
            {
              permission: {
                id: 'p-1',
                key: 'grants.proposals.create', // duplicate permission key across roles in same context
              },
            },
            {
              permission: {
                id: 'p-3',
                key: 'projects.milestones.update',
              },
            },
          ],
        },
      },
    ]);

    const capabilities = await service.resolveCapabilities({
      userId: 'usr-2',
      contextType: 'ORGANIZATION',
      contextId: 'org-100',
    });

    // Output must only contain capability keys, never role names (e.g. no 'FACULTY_MEMBER' or 'LAB_LEAD')
    expect(capabilities).toEqual([
      'grants.proposals.create',
      'knowledge.publications.submit',
      'projects.milestones.update',
    ]);
    expect(capabilities).not.toContain('FACULTY_MEMBER');
    expect(capabilities).not.toContain('LAB_LEAD');
    expect(capabilities).not.toContain('role-faculty');
    expect(capabilities).not.toContain('role-lab-lead');
  });
});
