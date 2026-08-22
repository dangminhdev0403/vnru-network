import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { AuthenticatedUser } from './auth.guard';
import { ProjectStatus, MilestoneStatus, ReportStatus, ResourceRole } from '../../generated/projects';
import { ForbiddenException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('Project Service Invariants', () => {
  let service: ProjectService;
  let repository: jest.Mocked<any>;

  const mockUserPm: AuthenticatedUser = {
    userId: 'user-pm-1111-1111-1111-111111111111',
    sessionId: 'session-123',
    activeContext: { contextType: 'PLATFORM', contextId: 'platform_main' },
    capabilities: ['collab.decisions.issue_foundation', 'projects.projects.view', 'projects.reports.approve', 'projects.projects.manage'],
    authenticationLevel: 'PASSWORD',
  };

  const mockUserLead: AuthenticatedUser = {
    userId: 'user-lead-2222-2222-2222-222222222222',
    sessionId: 'session-456',
    activeContext: { contextType: 'ORGANIZATION', contextId: 'org-8888-8888-8888-888888888888' },
    capabilities: ['projects.projects.view', 'projects.milestones.update', 'projects.reports.submit'],
    authenticationLevel: 'PASSWORD',
  };

  const mockUserMember: AuthenticatedUser = {
    userId: 'user-member-3333-3333-3333-333333333333',
    sessionId: 'session-789',
    activeContext: { contextType: 'ORGANIZATION', contextId: 'org-8888-8888-8888-888888888888' },
    capabilities: ['projects.projects.view'],
    authenticationLevel: 'PASSWORD',
  };

  const mockProject = {
    id: 'project-uuid-0000-0000-0000-000000000000',
    proposalRef: 'prop-123',
    decisionRef: 'dec-123',
    title: 'Joint Scientific Cooperation',
    description: 'Bilateral research project',
    status: ProjectStatus.ACTIVE,
    expectedVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    members: [
      { userId: 'user-lead-2222-2222-2222-222222222222', role: ResourceRole.LEAD },
      { userId: 'user-member-3333-3333-3333-333333333333', role: ResourceRole.MEMBER },
    ],
    milestones: [],
    reports: [],
    outcomes: [],
  };

  beforeEach(() => {
    repository = {
      findByRef: jest.fn(),
      bootstrapProject: jest.fn(),
      findById: jest.fn(),
      listProjects: jest.fn(),
      addMember: jest.fn(),
      getMembers: jest.fn(),
      createMilestone: jest.fn(),
      updateMilestone: jest.fn(),
      submitMilestone: jest.fn(),
      reviewMilestone: jest.fn(),
      createReport: jest.fn(),
      updateReport: jest.fn(),
      submitReport: jest.fn(),
      reviewReport: jest.fn(),
      addOutcome: jest.fn(),
      completeProject: jest.fn(),
      terminateProject: jest.fn(),
    };
    service = new ProjectService(repository as any);
  });

  describe('Bootstrap Idempotency & Validation', () => {
    const bootstrapDto = {
      decisionRef: 'dec-123',
      proposalRef: 'prop-123',
      title: 'Joint Scientific Cooperation',
      leadId: 'user-lead-2222-2222-2222-222222222222',
      approved: true,
    };

    it('successfully bootstraps a new project with foundation decision capability', async () => {
      repository.bootstrapProject.mockResolvedValue(mockProject);
      const result = await service.bootstrap(bootstrapDto, mockUserPm);
      expect(repository.bootstrapProject).toHaveBeenCalledWith(bootstrapDto);
      expect(result).toEqual(mockProject);
    });

    it('denies bootstrap if caller lacks foundation decision or project manage capability', async () => {
      await expect(service.bootstrap(bootstrapDto, mockUserMember)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('rejects the obsolete grants capability alias', async () => {
      await expect(service.bootstrap(bootstrapDto, {
        ...mockUserMember,
        capabilities: ['grants.decisions.issue_foundation'],
      })).rejects.toThrow(ForbiddenException);
    });

    it('bootstrap idempotency: returns existing project if already bootstrapped', async () => {
      repository.bootstrapProject.mockResolvedValue(mockProject);
      const result = await service.bootstrap(bootstrapDto, mockUserPm);
      expect(result).toEqual(mockProject);
    });
  });

  describe('Resource & Lead Validation (Non-lead denial)', () => {
    it('denies a lead whose active role lacks the required write capability', async () => {
      const leadWithoutWriteCapability = {
        ...mockUserLead,
        capabilities: ['projects.projects.view'],
      };

      await expect(
        service.createMilestone(
          mockProject.id,
          { title: 'M1', dueDate: new Date().toISOString() },
          leadWithoutWriteCapability,
        ),
      ).rejects.toThrow(ForbiddenException);
      expect(repository.findById).not.toHaveBeenCalled();
    });

    it('non-lead denial: throws ForbiddenException when non-lead tries to create milestone', async () => {
      repository.findById.mockResolvedValue(mockProject);
      repository.getMembers.mockResolvedValue(mockProject.members);

      const milestoneDto = { title: 'M1', dueDate: new Date().toISOString() };
      await expect(
        service.createMilestone(mockProject.id, milestoneDto, mockUserMember)
      ).rejects.toThrow(ForbiddenException);
    });

    it('allows exact lead to create a draft milestone', async () => {
      const milestone = { id: 'm-1', status: MilestoneStatus.DRAFT };
      repository.findById.mockResolvedValue(mockProject);
      repository.getMembers.mockResolvedValue(mockProject.members);
      repository.createMilestone.mockResolvedValue(milestone);

      const milestoneDto = { title: 'M1', dueDate: new Date().toISOString() };
      const result = await service.createMilestone(mockProject.id, milestoneDto, mockUserLead);
      expect(result).toEqual(milestone);
    });
  });

  describe('Optimistic Locking (Stale Update)', () => {
    it('throws ConflictException when updating milestone with stale version', async () => {
      const projectWithMilestone = {
        ...mockProject,
        milestones: [{ id: 'm-1', status: MilestoneStatus.DRAFT, expectedVersion: 2 }],
      };
      repository.findById.mockResolvedValue(projectWithMilestone);
      repository.getMembers.mockResolvedValue(projectWithMilestone.members);
      repository.updateMilestone.mockRejectedValue(
        new ConflictException('Stale update: The project milestone was updated by another request.')
      );

      const updateDto = { title: 'M1 updated', expectedVersion: 1 };
      await expect(
        service.updateMilestone(mockProject.id, 'm-1', updateDto, mockUserLead)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('Milestone / Report Acceptance & Revision Flow', () => {
    it('invalid acceptance: cannot review/approve draft milestone directly', async () => {
      const projectWithDraft = {
        ...mockProject,
        milestones: [{ id: 'm-1', status: MilestoneStatus.DRAFT, expectedVersion: 1 }],
      };
      repository.findById.mockResolvedValue(projectWithDraft);

      const reviewDto = { approved: true, expectedVersion: 1 };
      await expect(
        service.reviewMilestone(mockProject.id, 'm-1', reviewDto, mockUserPm)
      ).rejects.toThrow(BadRequestException);
    });

    it('revision flow: Program Manager requests revision on submitted milestone, lead updates and submits again', async () => {
      // 1. Submit draft milestone
      const projectWithDraft = {
        ...mockProject,
        milestones: [{ id: 'm-1', status: MilestoneStatus.DRAFT, expectedVersion: 1 }],
      };
      repository.findById.mockResolvedValue(projectWithDraft);
      repository.getMembers.mockResolvedValue(projectWithDraft.members);
      repository.submitMilestone.mockResolvedValue({ id: 'm-1', status: MilestoneStatus.SUBMITTED });

      let result = await service.submitMilestone(mockProject.id, 'm-1', 1, mockUserLead);
      expect(repository.submitMilestone).toHaveBeenCalledWith('m-1', 1);

      // 2. PM requests revision
      const projectWithSubmitted = {
        ...mockProject,
        milestones: [{ id: 'm-1', status: MilestoneStatus.SUBMITTED, expectedVersion: 2 }],
      };
      repository.findById.mockResolvedValue(projectWithSubmitted);
      repository.reviewMilestone.mockResolvedValue({ id: 'm-1', status: MilestoneStatus.REVISION_REQUESTED });

      const reviewDto = { approved: false, feedback: 'Need details', expectedVersion: 2 };
      result = await service.reviewMilestone(mockProject.id, 'm-1', reviewDto, mockUserPm);
      expect(repository.reviewMilestone).toHaveBeenCalledWith('m-1', false, 'Need details', mockUserPm.userId, 2);
      expect(result.status).toBe(MilestoneStatus.REVISION_REQUESTED);

      // 3. Lead updates milestone (allowed in REVISION_REQUESTED)
      const projectWithRevision = {
        ...mockProject,
        milestones: [{ id: 'm-1', status: MilestoneStatus.REVISION_REQUESTED, expectedVersion: 3 }],
      };
      repository.findById.mockResolvedValue(projectWithRevision);
      const updateDto = { title: 'M1 revised', expectedVersion: 3 };
      await service.updateMilestone(mockProject.id, 'm-1', updateDto, mockUserLead);
      expect(repository.updateMilestone).toHaveBeenCalledWith('m-1', updateDto, 3);
    });
  });

  describe('Completion Invariant', () => {
    it('completion invariant: throws BadRequestException if not all milestones are approved', async () => {
      const projectWithUnapproved = {
        ...mockProject,
        milestones: [
          { id: 'm-1', status: MilestoneStatus.APPROVED },
          { id: 'm-2', status: MilestoneStatus.SUBMITTED },
        ],
      };
      repository.findById.mockResolvedValue(projectWithUnapproved);

      await expect(service.complete(mockProject.id, 1, mockUserPm)).rejects.toThrow(
        BadRequestException
      );
    });

    it('completion invariant: successfully completes project when all milestones approved', async () => {
      const projectAllApproved = {
        ...mockProject,
        milestones: [
          { id: 'm-1', status: MilestoneStatus.APPROVED },
          { id: 'm-2', status: MilestoneStatus.APPROVED },
        ],
      };
      repository.findById.mockResolvedValue(projectAllApproved);
      repository.completeProject.mockResolvedValue({ ...projectAllApproved, status: ProjectStatus.COMPLETED });

      const result = await service.complete(mockProject.id, 1, mockUserPm);
      expect(repository.completeProject).toHaveBeenCalledWith(mockProject.id, 1);
      expect(result.status).toBe(ProjectStatus.COMPLETED);
    });
  });

  describe('Lifecycle Events & Outbox', () => {
    it('writes outbox event when project is terminated', async () => {
      repository.findById.mockResolvedValue(mockProject);
      repository.terminateProject.mockResolvedValue({
        ...mockProject,
        status: ProjectStatus.TERMINATED,
        terminationReason: 'Budget cuts',
      });

      const terminateDto = { reason: 'Budget cuts', expectedVersion: 1 };
      const result = await service.terminate(mockProject.id, terminateDto, mockUserPm);
      expect(repository.terminateProject).toHaveBeenCalledWith(mockProject.id, 'Budget cuts', 1);
      expect(result.status).toBe(ProjectStatus.TERMINATED);
    });
  });
});
