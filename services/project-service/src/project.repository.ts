import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaClient, ProjectStatus, ResourceRole, MilestoneStatus, ReportStatus } from '@prisma/client';

import {
  BootstrapProjectDto,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  CreateReportDto,
  UpdateReportDto,
} from './project-types';

@Injectable()
export class ProjectRepository {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async findByRef(proposalRef: string, decisionRef: string) {
    return this.prisma.project.findFirst({
      where: {
        OR: [
          { proposalRef },
          { decisionRef },
        ],
      },
      include: {
        members: true,
      },
    });
  }

  async bootstrapProject(dto: BootstrapProjectDto) {
    const existing = await this.findByRef(dto.proposalRef, dto.decisionRef);
    if (existing) return existing;
    try {
      return await this.prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
          data: {
            proposalRef: dto.proposalRef,
            decisionRef: dto.decisionRef,
            title: dto.title,
            description: dto.description,
            status: ProjectStatus.ACTIVE,
          },
        });
        await tx.projectMember.create({ data: { projectId: project.id, userId: dto.leadId, role: ResourceRole.LEAD } });
        await tx.outboxEvent.create({
          data: {
            eventType: 'projects.lifecycle.created',
            payload: { projectId: project.id, proposalRef: project.proposalRef, decisionRef: project.decisionRef, status: ProjectStatus.ACTIVE },
          },
        });
        return tx.project.findUnique({ where: { id: project.id }, include: { members: true } });
      });
    } catch (err: any) {
      if (err?.code === 'P2002') {
        const raced = await this.findByRef(dto.proposalRef, dto.decisionRef);
        if (raced) return raced;
      }
      throw err;
    }
  }

  async findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        members: true,
        milestones: {
          include: { deliverables: true, decisions: true },
        },
        reports: true,
        outcomes: true,
      },
    });
  }

  async listProjects(
    filter: { userId?: string },
    limit: number,
    cursor?: { createdAt: string; id: string }
  ) {
    const filters: any[] = [];

    if (filter.userId) {
      filters.push({
        members: {
          some: { userId: filter.userId },
        },
      });
    }

    if (cursor) {
      filters.push({
        OR: [
          { createdAt: { lt: new Date(cursor.createdAt) } },
          {
            createdAt: new Date(cursor.createdAt),
            id: { lt: cursor.id },
          },
        ],
      });
    }

    const where = filters.length > 0 ? { AND: filters } : undefined;

    return this.prisma.project.findMany({
      where,
      take: limit,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
      include: {
        members: true,
      },
    });
  }

  async addMember(projectId: string, userId: string, role: ResourceRole) {
    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role,
      },
    });
  }

  async getMembers(projectId: string) {
    return this.prisma.projectMember.findMany({
      where: { projectId },
    });
  }

  async createMilestone(projectId: string, dto: CreateMilestoneDto) {
    return this.prisma.$transaction(async (tx) => {
      const milestone = await tx.projectMilestone.create({
        data: {
          projectId,
          title: dto.title,
          description: dto.description,
          dueDate: new Date(dto.dueDate),
          status: MilestoneStatus.DRAFT,
        },
      });

      if (dto.deliverables && dto.deliverables.length > 0) {
        await tx.projectDeliverable.createMany({
          data: dto.deliverables.map((d) => ({
            milestoneId: milestone.id,
            title: d.title,
            description: d.description,
            url: d.url,
          })),
        });
      }

      return tx.projectMilestone.findUnique({
        where: { id: milestone.id },
        include: { deliverables: true },
      });
    });
  }

  async updateMilestone(milestoneId: string, dto: UpdateMilestoneDto, currentVersion: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const updateData: any = {};
        if (dto.title !== undefined) updateData.title = dto.title;
        if (dto.description !== undefined) updateData.description = dto.description;
        if (dto.dueDate !== undefined) updateData.dueDate = new Date(dto.dueDate);
        updateData.expectedVersion = { increment: 1 };

        const milestone = await tx.projectMilestone.update({
          where: {
            id: milestoneId,
            expectedVersion: currentVersion,
          },
          data: updateData,
        });

        if (dto.deliverables !== undefined) {
          // Delete old deliverables
          await tx.projectDeliverable.deleteMany({
            where: { milestoneId },
          });

          if (dto.deliverables.length > 0) {
            await tx.projectDeliverable.createMany({
              data: dto.deliverables.map((d) => ({
                milestoneId,
                title: d.title,
                description: d.description,
                url: d.url,
              })),
            });
          }
        }

        return tx.projectMilestone.findUnique({
          where: { id: milestoneId },
          include: { deliverables: true },
        });
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new ConflictException('Stale update: The project milestone was updated by another request.');
      }
      throw err;
    }
  }

  async submitMilestone(milestoneId: string, currentVersion: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const milestone = await tx.projectMilestone.update({
          where: { id: milestoneId, expectedVersion: currentVersion },
          data: { status: MilestoneStatus.SUBMITTED, expectedVersion: { increment: 1 } },
        });
        await tx.outboxEvent.create({ data: { eventType: 'projects.milestone.submitted', payload: { milestoneId, projectId: milestone.projectId } } });
        return milestone;
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new ConflictException('Stale update: The project milestone was updated by another request.');
      }
      throw err;
    }
  }

  async reviewMilestone(
    milestoneId: string,
    approved: boolean,
    feedback: string | undefined,
    reviewerId: string,
    currentVersion: number
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const newStatus = approved ? MilestoneStatus.APPROVED : MilestoneStatus.REVISION_REQUESTED;

        const milestone = await tx.projectMilestone.update({
          where: {
            id: milestoneId,
            expectedVersion: currentVersion,
          },
          data: {
            status: newStatus,
            expectedVersion: { increment: 1 },
          },
        });

        await tx.milestoneDecision.create({
          data: {
            milestoneId,
            reviewerId,
            status: newStatus,
            feedback,
          },
        });

        await tx.outboxEvent.create({
          data: {
            eventType: 'projects.milestone.updated',
            payload: {
              milestoneId,
              projectId: milestone.projectId,
              status: newStatus,
              updatedAt: milestone.updatedAt,
            },
          },
        });

        return tx.projectMilestone.findUnique({
          where: { id: milestoneId },
          include: { decisions: true },
        });
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new ConflictException('Stale update: The project milestone was updated by another request.');
      }
      throw err;
    }
  }

  async createReport(projectId: string, dto: CreateReportDto) {
    return this.prisma.progressReport.create({
      data: {
        projectId,
        milestoneId: dto.milestoneId || null,
        title: dto.title,
        content: dto.content,
        status: ReportStatus.DRAFT,
      },
    });
  }

  async updateReport(reportId: string, dto: UpdateReportDto, currentVersion: number) {
    try {
      const updateData: any = {};
      if (dto.title !== undefined) updateData.title = dto.title;
      if (dto.content !== undefined) updateData.content = dto.content;
      updateData.expectedVersion = { increment: 1 };

      return await this.prisma.progressReport.update({
        where: {
          id: reportId,
          expectedVersion: currentVersion,
        },
        data: updateData,
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new ConflictException('Stale update: The progress report was updated by another request.');
      }
      throw err;
    }
  }

  async submitReport(reportId: string, currentVersion: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const report = await tx.progressReport.update({
          where: { id: reportId, expectedVersion: currentVersion },
          data: { status: ReportStatus.SUBMITTED, expectedVersion: { increment: 1 } },
        });
        await tx.outboxEvent.create({ data: { eventType: 'projects.report.submitted', payload: { reportId, projectId: report.projectId } } });
        return report;
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new ConflictException('Stale update: The progress report was updated by another request.');
      }
      throw err;
    }
  }

  async reviewReport(
    reportId: string,
    approved: boolean,
    feedback: string | undefined,
    currentVersion: number
  ) {
    try {
      const newStatus = approved ? ReportStatus.APPROVED : ReportStatus.REVISION_REQUESTED;

      return await this.prisma.progressReport.update({
        where: {
          id: reportId,
          expectedVersion: currentVersion,
        },
        data: {
          status: newStatus,
          expectedVersion: { increment: 1 },
        },
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new ConflictException('Stale update: The progress report was updated by another request.');
      }
      throw err;
    }
  }

  async addOutcome(projectId: string, outcomeType: string, outcomeRef: string) {
    return this.prisma.projectOutcomeRef.create({
      data: {
        projectId,
        outcomeType,
        outcomeRef,
      },
    });
  }

  async completeProject(projectId: string, currentVersion: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const project = await tx.project.update({
          where: {
            id: projectId,
            expectedVersion: currentVersion,
          },
          data: {
            status: ProjectStatus.COMPLETED,
            expectedVersion: { increment: 1 },
          },
        });

        await tx.outboxEvent.create({
          data: {
            eventType: 'projects.lifecycle.completed',
            payload: {
              projectId,
              proposalRef: project.proposalRef,
              decisionRef: project.decisionRef,
              status: ProjectStatus.COMPLETED,
            },
          },
        });

        return project;
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new ConflictException('Stale update: The project was updated by another request.');
      }
      throw err;
    }
  }

  async terminateProject(projectId: string, reason: string, currentVersion: number) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const project = await tx.project.update({
          where: {
            id: projectId,
            expectedVersion: currentVersion,
          },
          data: {
            status: ProjectStatus.TERMINATED,
            terminationReason: reason,
            expectedVersion: { increment: 1 },
          },
        });

        await tx.outboxEvent.create({
          data: {
            eventType: 'projects.lifecycle.terminated',
            payload: {
              projectId,
              proposalRef: project.proposalRef,
              decisionRef: project.decisionRef,
              status: ProjectStatus.TERMINATED,
              terminationReason: reason,
            },
          },
        });

        return project;
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new ConflictException('Stale update: The project was updated by another request.');
      }
      throw err;
    }
  }
}
