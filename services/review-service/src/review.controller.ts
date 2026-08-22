import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ReviewService } from './review.service';
import { RequireContext, RequireCapability, CurrentUser } from './decorators';
import type { AuthenticatedUser } from './auth.guard';

@Controller('api/v1/reviews')
@UseGuards(AuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('assignments')
  @RequireCapability('reviews.assignments.manage')
  async createAssignment(
    @Body()
    body: {
      proposalRef: string;
      reviewerId: string;
      boardRef: string;
      proposalSnapshot: unknown;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (
      !body ||
      typeof body.proposalRef !== 'string' ||
      typeof body.reviewerId !== 'string' ||
      typeof body.boardRef !== 'string' ||
      !body.proposalSnapshot
    ) {
      throw new BadRequestException('proposalRef, reviewerId, boardRef, and proposalSnapshot are required');
    }
    return this.reviewService.createAssignment(body, user);
  }

  @Get('assignments')
  async listAssignments(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limitStr?: string,
    @Query('offset') offsetStr?: string,
  ) {
    const limit = limitStr ? parseInt(limitStr, 10) : 10;
    const offset = offsetStr ? parseInt(offsetStr, 10) : 0;
    return this.reviewService.listAssignments(user, limit, offset);
  }

  @Get('assignments/:id')
  async getAssignmentDetail(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewService.getAssignmentDetail(id, user);
  }

  // Conflict Declare - resource path
  @Post('assignments/:id/conflict')
  @RequireContext('REVIEW_BOARD')
  async declareConflictForAssignment(
    @Param('id') id: string,
    @Body() body: { declaration?: unknown },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const declaration = body?.declaration;
    if (declaration !== 'CONFLICT' && declaration !== 'NO_CONFLICT') {
      throw new BadRequestException('declaration must be either CONFLICT or NO_CONFLICT');
    }
    return this.reviewService.declareConflict(id, declaration, user);
  }

  // Conflict Declare - direct path
  @Post('conflict/declare')
  @RequireContext('REVIEW_BOARD')
  async declareConflict(
    @Body() body: { assignmentId?: unknown; declaration?: unknown },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const assignmentId = body?.assignmentId;
    const declaration = body?.declaration;
    if (typeof assignmentId !== 'string' || !assignmentId.trim()) {
      throw new BadRequestException('assignmentId is required');
    }
    if (declaration !== 'CONFLICT' && declaration !== 'NO_CONFLICT') {
      throw new BadRequestException('declaration must be either CONFLICT or NO_CONFLICT');
    }
    return this.reviewService.declareConflict(assignmentId.trim(), declaration, user);
  }

  // Save Evaluation - resource path
  @Post('assignments/:id/evaluation/save')
  @RequireContext('REVIEW_BOARD')
  async saveEvaluationForAssignment(
    @Param('id') id: string,
    @Body()
    body: {
      scientificMerit?: number;
      feasibility?: number;
      bilateralValue?: number;
      impact?: number;
      comments?: string;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewService.saveEvaluation(id, body, body?.comments, user);
  }

  // Save Evaluation - direct path
  @Post('evaluations/save')
  @RequireContext('REVIEW_BOARD')
  async saveEvaluation(
    @Body()
    body: {
      assignmentId?: unknown;
      scientificMerit?: number;
      feasibility?: number;
      bilateralValue?: number;
      impact?: number;
      comments?: string;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const assignmentId = body?.assignmentId;
    if (typeof assignmentId !== 'string' || !assignmentId.trim()) {
      throw new BadRequestException('assignmentId is required');
    }
    return this.reviewService.saveEvaluation(assignmentId.trim(), body, body?.comments, user);
  }

  // Submit Evaluation - resource path
  @Post('assignments/:id/evaluation/submit')
  @RequireContext('REVIEW_BOARD')
  async submitEvaluationForAssignment(
    @Param('id') id: string,
    @Body()
    body: {
      scientificMerit: number;
      feasibility: number;
      bilateralValue: number;
      impact: number;
      comments: string;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewService.submitEvaluation(id, body, body?.comments, user);
  }

  // Submit Evaluation - direct path
  @Post('evaluations/submit')
  @RequireContext('REVIEW_BOARD')
  async submitEvaluation(
    @Body()
    body: {
      assignmentId?: unknown;
      scientificMerit: number;
      feasibility: number;
      bilateralValue: number;
      impact: number;
      comments: string;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const assignmentId = body?.assignmentId;
    if (typeof assignmentId !== 'string' || !assignmentId.trim()) {
      throw new BadRequestException('assignmentId is required');
    }
    return this.reviewService.submitEvaluation(assignmentId.trim(), body, body?.comments, user);
  }

  // Recommendation - path 1
  @Get('proposals/:proposalRef/recommendation')
  @RequireCapability('reviews.assignments.manage')
  async getRecommendation(
    @Param('proposalRef') proposalRef: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!proposalRef || !proposalRef.trim()) {
      throw new BadRequestException('proposalRef is required');
    }
    return this.reviewService.getRecommendation(proposalRef.trim(), user);
  }

  // Recommendation - path 2
  @Get('recommendations/:proposalRef')
  @RequireCapability('reviews.assignments.manage')
  async getRecommendationAlternative(
    @Param('proposalRef') proposalRef: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!proposalRef || !proposalRef.trim()) {
      throw new BadRequestException('proposalRef is required');
    }
    return this.reviewService.getRecommendation(proposalRef.trim(), user);
  }
}
