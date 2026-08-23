import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { AuthenticatedUser } from './auth.guard';
import {
  BootstrapProjectDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  CreateReportDto,
  UpdateReportDto,
  ReviewDto,
  OutcomeDto,
  TerminateDto,
} from './project-types';
import { ProjectStatus, MilestoneStatus, ReportStatus, ResourceRole } from '../../generated/projects';
import { GrantService } from '../collaboration/grant.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly repository: ProjectRepository,
    private readonly collaboration: GrantService,
  ) {}

  async bootstrap(dto: BootstrapProjectDto, user: AuthenticatedUser) {
    const context = user.activeContext;
    if (!context) {
      throw new ForbiddenException('Active authorization context required');
    }

    if (
      !user.capabilities.includes('collab.decisions.issue_foundation') &&
      !user.capabilities.includes('projects.projects.manage')
    ) {
      throw new ForbiddenException('Access denied: Missing foundation decision or projects management capability');
    }

    await this.collaboration.assertApprovedDecision(dto.decisionRef, dto.proposalRef);
    return this.repository.bootstrapProject(dto);
  }

  async findOne(id: string, user: AuthenticatedUser) {
    if (!user.capabilities.includes('projects.projects.view')) {
      throw new ForbiddenException('Missing projects.projects.view capability');
    }
    const project = await this.repository.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const isMember = project.members.some((m) => m.userId === user.userId);
    const isManager =
      user.capabilities.includes('projects.reports.approve') ||
      user.capabilities.includes('projects.projects.manage') ||
      user.capabilities.includes('collab.decisions.issue_foundation');

    if (!isMember && !isManager) {
      throw new ForbiddenException('Access denied: You are not a member or manager of this project');
    }

    return project;
  }

  async list(query: { limit?: number; cursor?: string }, user: AuthenticatedUser) {
    if (!user.capabilities.includes('projects.projects.view')) {
      throw new ForbiddenException('Missing projects.projects.view capability');
    }
    const limit = query.limit ? Math.min(Math.max(1, query.limit), 50) : 20;
    let decodedCursor: { createdAt: string; id: string } | undefined;

    if (query.cursor) {
      try {
        const json = Buffer.from(query.cursor, 'base64url').toString('utf8');
        decodedCursor = JSON.parse(json);
      } catch {
        throw new BadRequestException('Invalid cursor');
      }
    }

    const isManager =
      user.capabilities.includes('projects.reports.approve') ||
      user.capabilities.includes('projects.projects.manage') ||
      user.capabilities.includes('collab.decisions.issue_foundation');

    const filter: { userId?: string } = {};
    if (!isManager) {
      filter.userId = user.userId;
    }

    const projects = await this.repository.listProjects(filter, limit + 1, decodedCursor);
    const hasMore = projects.length > limit;
    const visible = projects.slice(0, limit);

    let nextCursor: string | null = null;
    if (hasMore && visible.length > 0) {
      const last = visible[visible.length - 1];
      nextCursor = Buffer.from(
        JSON.stringify({
          createdAt: last.createdAt.toISOString(),
          id: last.id,
        }),
        'utf8'
      ).toString('base64url');
    }

    return {
      items: visible,
      nextCursor,
    };
  }

  async getMembers(projectId: string, user: AuthenticatedUser) {
    await this.findOne(projectId, user);
    return this.repository.getMembers(projectId);
  }

  async addMember(projectId: string, targetUserId: string, role: 'LEAD' | 'MEMBER', user: AuthenticatedUser) {
    const project = await this.findOne(projectId, user);
    await this.checkProgramManager(project, user);

    const members = await this.repository.getMembers(projectId);
    const alreadyMember = members.some((m) => m.userId === targetUserId);
    if (alreadyMember) {
      throw new BadRequestException('User is already a member of this project');
    }

    return this.repository.addMember(projectId, targetUserId, role);
  }

  async createMilestone(projectId: string, dto: CreateMilestoneDto, user: AuthenticatedUser) {
    this.requireCapability(user, 'projects.milestones.update');
    const project = await this.findOne(projectId, user);
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Cannot add milestones to a non-active project');
    }
    await this.checkLead(projectId, user.userId);

    return this.repository.createMilestone(projectId, dto);
  }

  async updateMilestone(
    projectId: string,
    milestoneId: string,
    dto: UpdateMilestoneDto,
    user: AuthenticatedUser
  ) {
    this.requireCapability(user, 'projects.milestones.update');
    const project = await this.findOne(projectId, user);
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Cannot update milestones of a non-active project');
    }
    await this.checkLead(projectId, user.userId);

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.status !== MilestoneStatus.DRAFT && milestone.status !== MilestoneStatus.REVISION_REQUESTED) {
      throw new BadRequestException('Can only update milestones in DRAFT or REVISION_REQUESTED status');
    }

    return this.repository.updateMilestone(milestoneId, dto, dto.expectedVersion);
  }

  async submitMilestone(projectId: string, milestoneId: string, expectedVersion: number, user: AuthenticatedUser) {
    this.requireCapability(user, 'projects.milestones.update');
    const project = await this.findOne(projectId, user);
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Cannot submit milestones of a non-active project');
    }
    await this.checkLead(projectId, user.userId);

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.status !== MilestoneStatus.DRAFT && milestone.status !== MilestoneStatus.REVISION_REQUESTED) {
      throw new BadRequestException('Can only submit milestones in DRAFT or REVISION_REQUESTED status');
    }

    return this.repository.submitMilestone(milestoneId, expectedVersion);
  }

  async reviewMilestone(
    projectId: string,
    milestoneId: string,
    dto: ReviewDto,
    user: AuthenticatedUser
  ) {
    const project = await this.findOne(projectId, user);
    await this.checkProgramManager(project, user);

    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.status !== MilestoneStatus.SUBMITTED) {
      throw new BadRequestException('Can only review milestones in SUBMITTED status');
    }

    return this.repository.reviewMilestone(
      milestoneId,
      dto.approved,
      dto.feedback,
      user.userId,
      dto.expectedVersion
    );
  }

  async createReport(projectId: string, dto: CreateReportDto, user: AuthenticatedUser) {
    this.requireCapability(user, 'projects.reports.submit');
    const project = await this.findOne(projectId, user);
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Cannot create progress reports for a non-active project');
    }
    await this.checkLead(projectId, user.userId);

    if (dto.milestoneId) {
      const milestone = project.milestones.find((m) => m.id === dto.milestoneId);
      if (!milestone) {
        throw new NotFoundException('Milestone not found');
      }
    }

    return this.repository.createReport(projectId, dto);
  }

  async updateReport(
    projectId: string,
    reportId: string,
    dto: UpdateReportDto,
    user: AuthenticatedUser
  ) {
    this.requireCapability(user, 'projects.reports.submit');
    const project = await this.findOne(projectId, user);
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Cannot update progress reports of a non-active project');
    }
    await this.checkLead(projectId, user.userId);

    const report = project.reports.find((r) => r.id === reportId);
    if (!report) {
      throw new NotFoundException('Progress report not found');
    }

    if (report.status !== ReportStatus.DRAFT && report.status !== ReportStatus.REVISION_REQUESTED) {
      throw new BadRequestException('Can only update reports in DRAFT or REVISION_REQUESTED status');
    }

    return this.repository.updateReport(reportId, dto, dto.expectedVersion);
  }

  async submitReport(projectId: string, reportId: string, expectedVersion: number, user: AuthenticatedUser) {
    this.requireCapability(user, 'projects.reports.submit');
    const project = await this.findOne(projectId, user);
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Cannot submit progress reports of a non-active project');
    }
    await this.checkLead(projectId, user.userId);

    const report = project.reports.find((r) => r.id === reportId);
    if (!report) {
      throw new NotFoundException('Progress report not found');
    }

    if (report.status !== ReportStatus.DRAFT && report.status !== ReportStatus.REVISION_REQUESTED) {
      throw new BadRequestException('Can only submit reports in DRAFT or REVISION_REQUESTED status');
    }

    return this.repository.submitReport(reportId, expectedVersion);
  }

  async reviewReport(
    projectId: string,
    reportId: string,
    dto: ReviewDto,
    user: AuthenticatedUser
  ) {
    const project = await this.findOne(projectId, user);
    await this.checkProgramManager(project, user);

    const report = project.reports.find((r) => r.id === reportId);
    if (!report) {
      throw new NotFoundException('Progress report not found');
    }

    if (report.status !== ReportStatus.SUBMITTED) {
      throw new BadRequestException('Can only review reports in SUBMITTED status');
    }

    return this.repository.reviewReport(reportId, dto.approved, dto.feedback, dto.expectedVersion);
  }

  async addOutcome(projectId: string, dto: OutcomeDto, user: AuthenticatedUser) {
    this.requireCapability(user, 'projects.milestones.update');
    const project = await this.findOne(projectId, user);
    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Cannot add outcomes to a non-active project');
    }
    await this.checkLead(projectId, user.userId);

    const alreadyRegistered = project.outcomes.some(
      (o) => o.outcomeType === dto.outcomeType && o.outcomeRef === dto.outcomeRef
    );
    if (alreadyRegistered) {
      throw new BadRequestException('Outcome reference already registered on this project');
    }

    return this.repository.addOutcome(projectId, dto.outcomeType, dto.outcomeRef);
  }

  async complete(projectId: string, expectedVersion: number, user: AuthenticatedUser) {
    const project = await this.findOne(projectId, user);
    await this.checkProgramManager(project, user);

    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Project is not in ACTIVE status');
    }

    if (project.milestones.length === 0) {
      throw new BadRequestException('Cannot complete project: No milestones defined');
    }

    const allApproved = project.milestones.every((m) => m.status === MilestoneStatus.APPROVED)
      && project.reports.every((r) => r.status === ReportStatus.APPROVED);
    if (!allApproved) {
      throw new BadRequestException('Cannot complete project: Not all milestones and reports are approved');
    }

    return this.repository.completeProject(projectId, expectedVersion);
  }

  async terminate(projectId: string, dto: TerminateDto, user: AuthenticatedUser) {
    const project = await this.findOne(projectId, user);
    await this.checkProgramManager(project, user);

    if (project.status !== ProjectStatus.ACTIVE) {
      throw new BadRequestException('Project is not in ACTIVE status');
    }

    return this.repository.terminateProject(projectId, dto.reason, dto.expectedVersion);
  }

  // --- Helper Methods ---

  private requireCapability(user: AuthenticatedUser, capability: string) {
    if (!user.capabilities.includes(capability)) throw new ForbiddenException(`Missing ${capability} capability`);
  }

  private async checkLead(projectId: string, userId: string) {
    const members = await this.repository.getMembers(projectId);
    const lead = members.find((m) => m.role === ResourceRole.LEAD);
    if (!lead || lead.userId !== userId) {
      throw new ForbiddenException('Operation restricted to Project Lead');
    }
  }

  private async checkProgramManager(project: any, user: AuthenticatedUser) {
    if (
      !user.capabilities.includes('projects.reports.approve') &&
      !user.capabilities.includes('projects.projects.manage') &&
      !user.capabilities.includes('collab.decisions.issue_foundation')
    ) {
      throw new ForbiddenException('Access denied: Program Manager capability is required');
    }
  }
}
