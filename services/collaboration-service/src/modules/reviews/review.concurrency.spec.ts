import { BadRequestException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';

describe('Review Submission Concurrency & Race-Condition Isolation', () => {
  let repository: ReviewRepository;
  let mockPrisma: any;
  let assignmentDbState: any;
  let outboxEventsCreated: any[];
  let reviewRecordsCreated: any[];

  beforeEach(() => {
    assignmentDbState = {
      id: 'd5dee5a7-593d-4240-94a3-35ae8e21fd26',
      status: 'PENDING',
      proposalRef: 'prop-12345',
      reviewerId: 'a1234567-b123-c123-d123-e1234567890a',
      conflict: { declaration: 'NO_CONFLICT' },
    };
    outboxEventsCreated = [];
    reviewRecordsCreated = [];

    // Simulated transactional engine mimicking PostgreSQL row-level locks and conditional update
    const mockTx = {
      reviewAssignment: {
        findUnique: jest.fn().mockImplementation(() => Promise.resolve({ ...assignmentDbState })),
        updateMany: jest.fn().mockImplementation(async ({ where, data }: { where: any; data: any }) => {
          // Atomic conditional update simulation: UPDATE ... WHERE id = $1 AND status != 'SUBMITTED'
          if (assignmentDbState.id === where.id && assignmentDbState.status !== 'SUBMITTED') {
            assignmentDbState.status = data.status;
            return { count: 1 };
          }
          return { count: 0 };
        }),
      },
      reviewRecord: {
        findUnique: jest.fn().mockResolvedValue({ id: 'rec-1', status: 'SUBMITTED', scores: [] }),
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'rec-1',
            scores: [
              { dimension: 'scientificMerit', score: 5 },
              { dimension: 'feasibility', score: 4 },
              { dimension: 'bilateralValue', score: 5 },
              { dimension: 'impact', score: 4 },
            ],
          },
        ]),
        upsert: jest.fn().mockImplementation(async (args: any) => {
          reviewRecordsCreated.push(args);
          return { id: 'rec-1', status: 'SUBMITTED' };
        }),
      },
      evaluationScore: {
        findMany: jest.fn().mockResolvedValue([]),
        upsert: jest.fn().mockResolvedValue({ id: 'score-1' }),
      },
      evaluationRecommendation: {
        upsert: jest.fn().mockResolvedValue({ id: 'rec-overall' }),
      },
      outboxEvent: {
        create: jest.fn().mockImplementation(async (args: any) => {
          outboxEventsCreated.push(args);
          return { id: 'outbox-1' };
        }),
      },
    };

    mockPrisma = {
      $transaction: jest.fn().mockImplementation((cb: (tx: any) => Promise<any>) => cb(mockTx)),
      reviewAssignment: mockTx.reviewAssignment,
      evaluationRecommendation: mockTx.evaluationRecommendation,
    };

    repository = new ReviewRepository(mockPrisma as any);
  });

  it('handles 2 simultaneous concurrent submitEvaluation calls: exactly 1 succeeds and 1 is rejected without duplicate outbox events', async () => {
    const assignmentId = 'd5dee5a7-593d-4240-94a3-35ae8e21fd26';
    const reviewerId = 'a1234567-b123-c123-d123-e1234567890a';
    const scores = { scientificMerit: 5, feasibility: 4, bilateralValue: 5, impact: 4 };
    const comments = 'Evaluation feedback comments of sufficient length.';

    // Execute two concurrent submissions simultaneously
    const [result1, result2] = await Promise.allSettled([
      repository.submitEvaluation(assignmentId, reviewerId, scores, comments),
      repository.submitEvaluation(assignmentId, reviewerId, scores, comments),
    ]);

    const successes = [result1, result2].filter((r) => r.status === 'fulfilled');
    const rejections = [result1, result2].filter((r) => r.status === 'rejected');

    // Exactly 1 must succeed
    expect(successes).toHaveLength(1);
    // Exactly 1 must be rejected with 'Evaluation already submitted'
    expect(rejections).toHaveLength(1);
    const rejectedReason = (rejections[0] as PromiseRejectedResult).reason;
    expect(rejectedReason).toBeInstanceOf(BadRequestException);
    expect(rejectedReason.message).toBe('Evaluation already submitted');

    // Final state of assignment is SUBMITTED
    expect(assignmentDbState.status).toBe('SUBMITTED');
    // Exactly 1 outbox event was generated
    expect(outboxEventsCreated).toHaveLength(1);
    expect(outboxEventsCreated[0].data.eventType).toBe('reviews.evaluation.submitted');
  });
});
