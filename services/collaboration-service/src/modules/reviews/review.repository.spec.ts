import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';

describe('ReviewRepository Transactional & Logic Tests', () => {
  let repository: ReviewRepository;
  let mockPrisma: any;
  let mockTx: any;

  beforeEach(() => {
    mockTx = {
      reviewAssignment: {
        findUnique: jest.fn(),
        findFirst: jest.fn().mockResolvedValue(null),
        update: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        create: jest.fn(),
      },
      proposalSnapshot: {
        create: jest.fn(),
      },
      conflictDeclaration: {
        upsert: jest.fn(),
      },
      reviewRecord: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        upsert: jest.fn(),
      },
      evaluationScore: {
        findMany: jest.fn(),
        upsert: jest.fn(),
      },
      evaluationRecommendation: {
        upsert: jest.fn(),
      },
      outboxEvent: {
        create: jest.fn(),
      },
    };

    mockPrisma = {
      $transaction: jest.fn().mockImplementation((cb) => cb(mockTx)),
      reviewAssignment: mockTx.reviewAssignment,
      evaluationRecommendation: mockTx.evaluationRecommendation,
    };

    repository = new ReviewRepository(mockPrisma as any);
  });

  describe('Assignment Context Contract', () => {
    it('accepts the canonical stable review board reference', async () => {
      mockTx.reviewAssignment.create.mockResolvedValue({ id: 'd5dee5a7-593d-4240-94a3-35ae8e21fd26' });
      mockTx.reviewAssignment.findUnique.mockResolvedValue({ id: 'd5dee5a7-593d-4240-94a3-35ae8e21fd26' });

      await repository.createAssignment({
        proposalRef: 'proposal-1',
        reviewerId: 'a1234567-b123-c123-d123-e1234567890a',
        boardRef: 'BOARD_001',
        snapshot: { title: 'Anonymous proposal' },
      });

      expect(mockTx.reviewAssignment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ boardRef: 'BOARD_001' }),
      });
    });
  });

  describe('Conflict Declaration Gate', () => {
    it('should save conflict declaration and set assignment status to CONFLICT', async () => {
      const assignmentId = 'd5dee5a7-593d-4240-94a3-35ae8e21fd26';
      const reviewerId = 'a1234567-b123-c123-d123-e1234567890a';

      mockTx.reviewAssignment.findUnique.mockResolvedValue({
        id: assignmentId,
        reviewerId,
        status: 'PENDING',
      });
      mockTx.conflictDeclaration.upsert.mockResolvedValue({ id: 'conf-1', declaration: 'CONFLICT' });

      await repository.saveConflictDeclaration(assignmentId, reviewerId, 'CONFLICT');

      expect(mockTx.conflictDeclaration.upsert).toHaveBeenCalledWith({
        where: { assignmentId },
        update: { declaration: 'CONFLICT' },
        create: { assignmentId, reviewerId, declaration: 'CONFLICT' },
      });
      expect(mockTx.reviewAssignment.update).toHaveBeenCalledWith({
        where: { id: assignmentId },
        data: { status: 'CONFLICT' },
      });
    });

    it('should throw BadRequestException if declaring conflict on a SUBMITTED evaluation', async () => {
      const assignmentId = 'd5dee5a7-593d-4240-94a3-35ae8e21fd26';
      const reviewerId = 'a1234567-b123-c123-d123-e1234567890a';

      mockTx.reviewAssignment.findUnique.mockResolvedValue({
        id: assignmentId,
        reviewerId,
        status: 'SUBMITTED',
      });

      await expect(
        repository.saveConflictDeclaration(assignmentId, reviewerId, 'CONFLICT')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('COI Block during Evaluation', () => {
    it('should throw BadRequestException if saving evaluation with no conflict declared', async () => {
      const assignmentId = 'd5dee5a7-593d-4240-94a3-35ae8e21fd26';
      const reviewerId = 'a1234567-b123-c123-d123-e1234567890a';

      mockTx.reviewAssignment.findUnique.mockResolvedValue({
        id: assignmentId,
        reviewerId,
        status: 'PENDING',
        conflict: null, // NO conflict declared yet
      });

      await expect(
        repository.saveEvaluation(assignmentId, reviewerId, { scientificMerit: 4 })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if saving evaluation with CONFLICT status declared', async () => {
      const assignmentId = 'd5dee5a7-593d-4240-94a3-35ae8e21fd26';
      const reviewerId = 'a1234567-b123-c123-d123-e1234567890a';

      mockTx.reviewAssignment.findUnique.mockResolvedValue({
        id: assignmentId,
        reviewerId,
        status: 'CONFLICT',
        conflict: { declaration: 'CONFLICT' },
      });

      await expect(
        repository.saveEvaluation(assignmentId, reviewerId, { scientificMerit: 4 })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Score Bounds Enforcement', () => {
    it('should throw BadRequestException if saving score lower than 1 or greater than 5', async () => {
      const assignmentId = 'd5dee5a7-593d-4240-94a3-35ae8e21fd26';
      const reviewerId = 'a1234567-b123-c123-d123-e1234567890a';

      mockTx.reviewAssignment.findUnique.mockResolvedValue({
        id: assignmentId,
        reviewerId,
        status: 'PENDING',
        conflict: { declaration: 'NO_CONFLICT' },
      });
      mockTx.reviewRecord.upsert.mockResolvedValue({ id: 'rec-1' });

      await expect(
        repository.saveEvaluation(assignmentId, reviewerId, { scientificMerit: 0 })
      ).rejects.toThrow(BadRequestException);

      await expect(
        repository.saveEvaluation(assignmentId, reviewerId, { scientificMerit: 6 })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Submission Immutability Gate', () => {
    it('should throw BadRequestException if saving evaluation on an already SUBMITTED assignment', async () => {
      const assignmentId = 'd5dee5a7-593d-4240-94a3-35ae8e21fd26';
      const reviewerId = 'a1234567-b123-c123-d123-e1234567890a';

      mockTx.reviewAssignment.findUnique.mockResolvedValue({
        id: assignmentId,
        reviewerId,
        status: 'SUBMITTED',
        conflict: { declaration: 'NO_CONFLICT' },
      });

      await expect(
        repository.saveEvaluation(assignmentId, reviewerId, { scientificMerit: 4 })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if submitting evaluation on an already SUBMITTED assignment', async () => {
      const assignmentId = 'd5dee5a7-593d-4240-94a3-35ae8e21fd26';
      const reviewerId = 'a1234567-b123-c123-d123-e1234567890a';

      mockTx.reviewAssignment.findUnique.mockResolvedValue({
        id: assignmentId,
        reviewerId,
        status: 'SUBMITTED',
        conflict: { declaration: 'NO_CONFLICT' },
      });

      const scores = { scientificMerit: 4, feasibility: 4, bilateralValue: 4, impact: 4 };
      await expect(
        repository.submitEvaluation(assignmentId, reviewerId, scores, 'Valid comments length')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Deterministic Recommendation & Outbox Event Invariants', () => {
    it('should recalculate average scores and emit reviews.evaluation.submitted outbox event on submit', async () => {
      const assignmentId = 'd5dee5a7-593d-4240-94a3-35ae8e21fd26';
      const reviewerId = 'a1234567-b123-c123-d123-e1234567890a';
      const proposalRef = 'prop-ref-999';

      mockTx.reviewAssignment.findUnique.mockResolvedValue({
        id: assignmentId,
        reviewerId,
        proposalRef,
        status: 'DRAFT',
        conflict: { declaration: 'NO_CONFLICT' },
      });

      mockTx.reviewRecord.upsert.mockResolvedValue({
        id: 'rec-1',
        submittedAt: new Date('2026-08-20T00:00:00Z'),
      });

      // Mock other submitted reviews for same proposal to test deterministic average calculation
      mockTx.reviewRecord.findMany.mockResolvedValue([
        {
          id: 'rec-1',
          scores: [
            { dimension: 'scientificMerit', score: 5 },
            { dimension: 'feasibility', score: 4 },
            { dimension: 'bilateralValue', score: 4 },
            { dimension: 'impact', score: 5 },
          ],
        },
        {
          id: 'rec-2',
          scores: [
            { dimension: 'scientificMerit', score: 4 },
            { dimension: 'feasibility', score: 4 },
            { dimension: 'bilateralValue', score: 2 },
            { dimension: 'impact', score: 3 },
          ],
        },
      ]);

      mockTx.evaluationScore.findMany.mockResolvedValue([
        { dimension: 'scientificMerit', score: 5 },
        { dimension: 'feasibility', score: 4 },
        { dimension: 'bilateralValue', score: 4 },
        { dimension: 'impact', score: 5 },
      ]);

      mockTx.reviewRecord.findUnique.mockResolvedValue({
        id: 'rec-1',
        status: 'SUBMITTED',
      });

      const scores = { scientificMerit: 5, feasibility: 4, bilateralValue: 4, impact: 5 };
      await repository.submitEvaluation(assignmentId, reviewerId, scores, 'This comments is longer than ten characters.');

      // Verify evaluation recommendation average scores calculation
      // ScientificMerit: (5 + 4) / 2 = 4.5
      // Feasibility: (4 + 4) / 2 = 4.0
      // BilateralValue: (4 + 2) / 2 = 3.0
      // Impact: (5 + 3) / 2 = 4.0
      // OverallAverage: (4.5 + 4.0 + 3.0 + 4.0) / 4 = 3.875
      expect(mockTx.evaluationRecommendation.upsert).toHaveBeenCalledWith({
        where: { proposalRef },
        update: {
          averageScientificMerit: 4.5,
          averageFeasibility: 4.0,
          averageBilateralValue: 3.0,
          averageImpact: 4.0,
          overallAverage: 3.875,
          totalReviews: 2,
        },
        create: {
          proposalRef,
          averageScientificMerit: 4.5,
          averageFeasibility: 4.0,
          averageBilateralValue: 3.0,
          averageImpact: 4.0,
          overallAverage: 3.875,
          totalReviews: 2,
        },
      });

      // Verify outbox event creation inside the transaction
      expect(mockTx.outboxEvent.create).toHaveBeenCalledWith({
        data: {
          eventType: 'reviews.evaluation.submitted',
          payload: {
            assignmentId,
            proposalRef,
            reviewerId,
            scores: {
              scientificMerit: 5,
              feasibility: 4,
              bilateralValue: 4,
              impact: 5,
            },
            comments: 'This comments is longer than ten characters.',
            submittedAt: expect.any(Date),
          },
        },
      });
    });
  });
});
