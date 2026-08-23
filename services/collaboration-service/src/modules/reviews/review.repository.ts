import { Inject, Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '../../generated/reviews';

export const REVIEW_PRISMA = Symbol('REVIEW_PRISMA');

export function isValidUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

@Injectable()
export class ReviewRepository {
  constructor(@Inject(REVIEW_PRISMA) private readonly prisma: PrismaClient) {}

  async createAssignment(params: {
    proposalRef: string;
    reviewerId: string;
    boardRef: string;
    snapshot: any;
  }) {
    if (!isValidUuid(params.reviewerId)) {
      throw new BadRequestException('reviewerId must be a valid UUID');
    }
    if (!params.boardRef.trim()) throw new BadRequestException('boardRef is required');

    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.reviewAssignment.create({
        data: {
          proposalRef: params.proposalRef,
          reviewerId: params.reviewerId,
          boardRef: params.boardRef,
          status: 'PENDING',
        },
      });

      await tx.proposalSnapshot.create({
        data: {
          assignmentId: assignment.id,
          proposalRef: params.proposalRef,
          snapshot: params.snapshot,
        },
      });

      return tx.reviewAssignment.findUnique({
        where: { id: assignment.id },
        include: { snapshot: true },
      });
    });
  }

  async findAssignments(filters: {
    reviewerId?: string;
    boardRef?: string;
    limit: number;
    offset: number;
  }) {
    const where: any = {};
    if (filters.reviewerId) {
      if (!isValidUuid(filters.reviewerId)) {
        throw new BadRequestException('reviewerId must be a valid UUID');
      }
      where.reviewerId = filters.reviewerId;
    }
    if (filters.boardRef) where.boardRef = filters.boardRef;

    const items = await this.prisma.reviewAssignment.findMany({
      where,
      take: filters.limit,
      skip: filters.offset,
      orderBy: { createdAt: 'desc' },
      include: {
        snapshot: true,
        conflict: true,
        reviewRecord: {
          include: { scores: true },
        },
      },
    });

    const total = await this.prisma.reviewAssignment.count({ where });

    return { items, total };
  }

  async findAssignmentById(id: string) {
    if (!isValidUuid(id)) {
      throw new BadRequestException('Invalid assignment ID format');
    }

    const assignment = await this.prisma.reviewAssignment.findUnique({
      where: { id },
      include: {
        snapshot: true,
        conflict: true,
        reviewRecord: {
          include: { scores: true },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async saveConflictDeclaration(assignmentId: string, reviewerId: string, declaration: 'CONFLICT' | 'NO_CONFLICT') {
    if (!isValidUuid(assignmentId)) {
      throw new BadRequestException('Invalid assignment ID format');
    }

    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.reviewAssignment.findUnique({
        where: { id: assignmentId },
      });

      if (!assignment) {
        throw new NotFoundException(`Assignment not found`);
      }

      if (assignment.reviewerId !== reviewerId) {
        throw new ForbiddenException('Reviewer mismatch'); // Handled at service layer, throwing here to be safe
      }

      if (assignment.status === 'SUBMITTED') {
        throw new BadRequestException('Cannot declare conflict on a submitted evaluation');
      }

      const conflict = await tx.conflictDeclaration.upsert({
        where: { assignmentId },
        update: { declaration },
        create: {
          assignmentId,
          reviewerId,
          declaration,
        },
      });

      // Update assignment status
      const newStatus = declaration === 'CONFLICT' ? 'CONFLICT' : 'PENDING';
      await tx.reviewAssignment.update({
        where: { id: assignmentId },
        data: { status: newStatus },
      });

      return conflict;
    });
  }

  async saveEvaluation(
    assignmentId: string,
    reviewerId: string,
    scores: { scientificMerit?: number; feasibility?: number; bilateralValue?: number; impact?: number },
    comments?: string,
  ) {
    if (!isValidUuid(assignmentId)) {
      throw new BadRequestException('Invalid assignment ID format');
    }

    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.reviewAssignment.findUnique({
        where: { id: assignmentId },
        include: { conflict: true },
      });

      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }

      if (assignment.reviewerId !== reviewerId) {
        throw new ForbiddenException('Reviewer mismatch');
      }

      if (assignment.status === 'SUBMITTED') {
        throw new BadRequestException('Cannot update a submitted evaluation');
      }

      // Conflict checks
      if (!assignment.conflict || assignment.conflict.declaration !== 'NO_CONFLICT') {
        throw new BadRequestException('Must declare NO_CONFLICT before saving evaluation scores');
      }

      const record = await tx.reviewRecord.upsert({
        where: { assignmentId },
        update: {
          comments,
          status: 'DRAFT',
        },
        create: {
          assignmentId,
          reviewerId,
          status: 'DRAFT',
          comments,
        },
      });

      // Update assignment status to DRAFT
      await tx.reviewAssignment.update({
        where: { id: assignmentId },
        data: { status: 'DRAFT' },
      });

      // Upsert scores
      const dimensions = ['scientificMerit', 'feasibility', 'bilateralValue', 'impact'] as const;
      for (const dim of dimensions) {
        const val = scores[dim];
        if (val !== undefined) {
          if (val < 1 || val > 5) {
            throw new BadRequestException(`Score for ${dim} must be between 1 and 5`);
          }
          await tx.evaluationScore.upsert({
            where: {
              reviewRecordId_dimension: {
                reviewRecordId: record.id,
                dimension: dim,
              },
            },
            update: { score: val },
            create: {
              reviewRecordId: record.id,
              dimension: dim,
              score: val,
            },
          });
        }
      }

      return tx.reviewRecord.findUnique({
        where: { id: record.id },
        include: { scores: true },
      });
    });
  }

  async submitEvaluation(
    assignmentId: string,
    reviewerId: string,
    scores: { scientificMerit: number; feasibility: number; bilateralValue: number; impact: number },
    comments: string,
  ) {
    if (!isValidUuid(assignmentId)) {
      throw new BadRequestException('Invalid assignment ID format');
    }

    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.reviewAssignment.findUnique({
        where: { id: assignmentId },
        include: { conflict: true },
      });

      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }

      if (assignment.reviewerId !== reviewerId) {
        throw new ForbiddenException('Reviewer mismatch');
      }

      if (assignment.status === 'SUBMITTED') {
        throw new BadRequestException('Evaluation already submitted');
      }

      // Conflict checks
      if (!assignment.conflict || assignment.conflict.declaration !== 'NO_CONFLICT') {
        throw new BadRequestException('Must declare NO_CONFLICT before submitting evaluation');
      }

      // Score validation
      const dimensions = ['scientificMerit', 'feasibility', 'bilateralValue', 'impact'] as const;
      for (const dim of dimensions) {
        const val = scores[dim];
        if (val === undefined || val === null) {
          throw new BadRequestException(`Score for ${dim} is required for submission`);
        }
        if (val < 1 || val > 5) {
          throw new BadRequestException(`Score for ${dim} must be between 1 and 5`);
        }
      }

      if (!comments || typeof comments !== 'string' || comments.trim().length < 10) {
        throw new BadRequestException('Comments must be at least 10 characters long');
      }

      const record = await tx.reviewRecord.upsert({
        where: { assignmentId },
        update: {
          comments,
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
        create: {
          assignmentId,
          reviewerId,
          status: 'SUBMITTED',
          comments,
          submittedAt: new Date(),
        },
      });

      // Update assignment status to SUBMITTED atomically
      const updateResult = await tx.reviewAssignment.updateMany({
        where: { id: assignmentId, status: { not: 'SUBMITTED' } },
        data: { status: 'SUBMITTED' },
      });

      if (updateResult.count === 0) {
        throw new BadRequestException('Evaluation already submitted');
      }

      // Upsert scores
      for (const dim of dimensions) {
        await tx.evaluationScore.upsert({
          where: {
            reviewRecordId_dimension: {
              reviewRecordId: record.id,
              dimension: dim,
            },
          },
          update: { score: scores[dim] },
          create: {
            reviewRecordId: record.id,
            dimension: dim,
            score: scores[dim],
          },
        });
      }

      // Calculate new averages recursively for proposalRef
      const submittedReviews = await tx.reviewRecord.findMany({
        where: {
          assignment: { proposalRef: assignment.proposalRef },
          status: 'SUBMITTED',
        },
        include: { scores: true },
      });

      const totalReviews = submittedReviews.length;
      let sumScientificMerit = 0;
      let sumFeasibility = 0;
      let sumBilateralValue = 0;
      let sumImpact = 0;

      for (const rev of submittedReviews) {
        for (const sc of rev.scores) {
          if (sc.dimension === 'scientificMerit') sumScientificMerit += sc.score;
          if (sc.dimension === 'feasibility') sumFeasibility += sc.score;
          if (sc.dimension === 'bilateralValue') sumBilateralValue += sc.score;
          if (sc.dimension === 'impact') sumImpact += sc.score;
        }
      }

      const averageScientificMerit = sumScientificMerit / totalReviews;
      const averageFeasibility = sumFeasibility / totalReviews;
      const averageBilateralValue = sumBilateralValue / totalReviews;
      const averageImpact = sumImpact / totalReviews;
      const overallAverage = (averageScientificMerit + averageFeasibility + averageBilateralValue + averageImpact) / 4;

      await tx.evaluationRecommendation.upsert({
        where: { proposalRef: assignment.proposalRef },
        update: {
          averageScientificMerit,
          averageFeasibility,
          averageBilateralValue,
          averageImpact,
          overallAverage,
          totalReviews,
        },
        create: {
          proposalRef: assignment.proposalRef,
          averageScientificMerit,
          averageFeasibility,
          averageBilateralValue,
          averageImpact,
          overallAverage,
          totalReviews,
        },
      });

      // Create outbox event
      const finalScores = await tx.evaluationScore.findMany({
        where: { reviewRecordId: record.id },
      });

      const payload = {
        assignmentId,
        proposalRef: assignment.proposalRef,
        reviewerId,
        scores: finalScores.reduce((acc, curr) => {
          acc[curr.dimension] = curr.score;
          return acc;
        }, {} as Record<string, number>),
        comments,
        submittedAt: record.submittedAt,
      };

      await tx.outboxEvent.create({
        data: {
          eventType: 'reviews.evaluation.submitted',
          payload,
        },
      });

      return tx.reviewRecord.findUnique({
        where: { id: record.id },
        include: { scores: true },
      });
    });
  }

  async getRecommendation(proposalRef: string) {
    return this.prisma.evaluationRecommendation.findUnique({ where: { proposalRef } });
  }
}
