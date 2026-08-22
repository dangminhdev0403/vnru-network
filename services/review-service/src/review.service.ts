import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { validateProposalSnapshot } from './anonymizer';
import type { AuthenticatedUser } from './auth.guard';

@Injectable()
export class ReviewService {
  constructor(private readonly repository: ReviewRepository) {}

  async createAssignment(
    params: {
      proposalRef: string;
      reviewerId: string;
      boardRef: string;
      fundingProgramRef: string;
      proposalSnapshot: unknown;
    },
    user: AuthenticatedUser,
  ) {
    // 1. Verify program manager role/capabilities in the controller, but double-check here as well
    if (user.activeContext?.contextType !== 'FUNDING_PROGRAM' || !user.capabilities.includes('reviews.assignments.manage')) {
      throw new ForbiddenException('Only program managers in the funding program context can manage review assignments');
    }

    // 2. Validate proposal snapshot
    if (!validateProposalSnapshot(params.proposalSnapshot)) {
      throw new BadRequestException('Proposal snapshot failed anonymization validation. Keys must only be title, abstract, objectives, methodology, expectedOutcomes, keywords. Values and keys cannot contain identity identifiers.');
    }

    if (user.activeContext.contextId !== params.fundingProgramRef) {
      throw new ForbiddenException('Funding program context mismatch');
    }

    return this.repository.createAssignment({
      proposalRef: params.proposalRef,
      reviewerId: params.reviewerId,
      boardRef: params.boardRef,
      fundingProgramRef: params.fundingProgramRef,
      snapshot: params.proposalSnapshot,
    });
  }

  async listAssignments(user: AuthenticatedUser, limit = 10, offset = 0) {
    const maxLimit = 50;
    const boundedLimit = Math.min(Math.max(1, limit), maxLimit);
    const boundedOffset = Math.max(0, offset);

    if (user.activeContext?.contextType === 'FUNDING_PROGRAM' && user.capabilities.includes('reviews.assignments.manage')) {
      // Program manager can see all assignments
      return this.repository.findAssignments({
        fundingProgramRef: user.activeContext.contextId,
        limit: boundedLimit,
        offset: boundedOffset,
      });
    } else if (user.activeContext?.contextType === 'REVIEW_BOARD' && user.capabilities.includes('reviews.assignments.view_assigned')) {
      // Reviewer can see only their assigned records
      return this.repository.findAssignments({
        reviewerId: user.userId,
        boardRef: user.activeContext.contextId,
        limit: boundedLimit,
        offset: boundedOffset,
      });
    } else {
      throw new ForbiddenException('Insufficient permissions to view assignments');
    }
  }

  async getAssignmentDetail(id: string, user: AuthenticatedUser) {
    const assignment = await this.repository.findAssignmentById(id);

    if (user.activeContext?.contextType === 'FUNDING_PROGRAM' && user.capabilities.includes('reviews.assignments.manage')) {
      if (assignment.fundingProgramRef !== user.activeContext.contextId) {
        throw new ForbiddenException('Assignment belongs to another funding program');
      }
      return assignment;
    } else if (user.activeContext?.contextType === 'REVIEW_BOARD' && user.capabilities.includes('reviews.assignments.view_assigned')) {
      if (assignment.reviewerId !== user.userId || assignment.boardRef !== user.activeContext.contextId) {
        throw new ForbiddenException('You can only see your own assigned review assignment matching your active board context');
      }
      return assignment;
    } else {
      throw new ForbiddenException('Insufficient permissions to view this assignment');
    }
  }

  async declareConflict(assignmentId: string, declaration: 'CONFLICT' | 'NO_CONFLICT', user: AuthenticatedUser) {
    // Reviewer active context verification
    if (user.activeContext?.contextType !== 'REVIEW_BOARD' || !user.capabilities.includes('reviews.assignments.view_assigned')) {
      throw new ForbiddenException('Only reviewers in active review board context can declare conflict');
    }

    const assignment = await this.repository.findAssignmentById(assignmentId);
    if (assignment.reviewerId !== user.userId || assignment.boardRef !== user.activeContext.contextId) {
      throw new ForbiddenException('You can only declare conflict on your own assigned assignment matching your active board context');
    }

    return this.repository.saveConflictDeclaration(assignmentId, user.userId, declaration);
  }

  async saveEvaluation(
    assignmentId: string,
    scores: { scientificMerit?: number; feasibility?: number; bilateralValue?: number; impact?: number },
    comments: string | undefined,
    user: AuthenticatedUser,
  ) {
    if (user.activeContext?.contextType !== 'REVIEW_BOARD' || !user.capabilities.includes('reviews.evaluations.score')) {
      throw new ForbiddenException('Only reviewers in active review board context can save evaluations');
    }

    const assignment = await this.repository.findAssignmentById(assignmentId);
    if (assignment.reviewerId !== user.userId || !user.activeContext || assignment.boardRef !== user.activeContext.contextId) {
      throw new ForbiddenException('You can only save scores for your own assigned assignment');
    }

    return this.repository.saveEvaluation(assignmentId, user.userId, scores, comments);
  }

  async submitEvaluation(
    assignmentId: string,
    scores: { scientificMerit: number; feasibility: number; bilateralValue: number; impact: number },
    comments: string,
    user: AuthenticatedUser,
  ) {
    if (user.activeContext?.contextType !== 'REVIEW_BOARD' || !user.capabilities.includes('reviews.evaluations.submit')) {
      throw new ForbiddenException('Only reviewers in active review board context can submit evaluations');
    }

    const assignment = await this.repository.findAssignmentById(assignmentId);
    if (assignment.reviewerId !== user.userId || !user.activeContext || assignment.boardRef !== user.activeContext.contextId) {
      throw new ForbiddenException('You can only submit evaluations for your own assigned assignment');
    }

    return this.repository.submitEvaluation(assignmentId, user.userId, scores, comments);
  }

  async getRecommendation(proposalRef: string, user: AuthenticatedUser) {
    if (user.activeContext?.contextType !== 'FUNDING_PROGRAM' || !user.capabilities.includes('reviews.assignments.manage')) {
      throw new ForbiddenException('Only program managers in the funding program context can view proposal recommendations');
    }

    const recommendation = await this.repository.getRecommendation(proposalRef, user.activeContext.contextId);
    if (!recommendation) {
      throw new NotFoundException(`No recommendation found for proposal ${proposalRef}`);
    }

    return recommendation;
  }
}
