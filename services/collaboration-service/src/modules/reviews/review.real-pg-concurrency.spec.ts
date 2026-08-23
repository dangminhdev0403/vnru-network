import { BadRequestException } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/reviews';
import { ReviewRepository } from './review.repository';

const connectionString = process.env.REVIEW_DATABASE_URL || 'postgresql://postgres:root@127.0.0.1:5432/review_db?schema=public';

describe('REAL PostgreSQL Concurrency & Unique Constraints (No Mocks)', () => {
  let prisma: PrismaClient;
  let repository: ReviewRepository;
  const testProposalRef = `prop-pg-${Date.now()}`;
  const testReviewerId = 'a1234567-b123-c123-d123-e1234567890a';
  const testBoardRef = 'BOARD_001';
  let createdAssignmentId: string | null = null;

  beforeAll(async () => {
    prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
    await prisma.$connect();
    repository = new ReviewRepository(prisma);
  });

  afterAll(async () => {
    // Clean up created test data
    if (createdAssignmentId) {
      await prisma.outboxEvent.deleteMany({
        where: {
          payload: {
            path: ['assignmentId'],
            equals: createdAssignmentId,
          },
        },
      });
      await prisma.evaluationRecommendation.deleteMany({
        where: { proposalRef: testProposalRef },
      });
      await prisma.reviewAssignment.deleteMany({
        where: { proposalRef: testProposalRef },
      });
    }
    await prisma.$disconnect();
  });

  it('proves PostgreSQL enforces proposalRef + reviewerId uniqueness under real concurrent assignment creation', async () => {
    const snapshot = {
      title: 'Real PostgreSQL Bilateral Proposal',
      abstract: 'Real concurrency verification abstract',
    };

    // Execute two simultaneous concurrent assignment creations on PostgreSQL
    const [res1, res2] = await Promise.allSettled([
      repository.createAssignment({
        proposalRef: testProposalRef,
        reviewerId: testReviewerId,
        boardRef: testBoardRef,
        snapshot,
      }),
      repository.createAssignment({
        proposalRef: testProposalRef,
        reviewerId: testReviewerId,
        boardRef: testBoardRef,
        snapshot,
      }),
    ]);

    const successes = [res1, res2].filter((r) => r.status === 'fulfilled');
    const rejections = [res1, res2].filter((r) => r.status === 'rejected');

    // Exactly 1 must succeed in inserting to PostgreSQL
    expect(successes).toHaveLength(1);
    const createdAssignment = (successes[0] as PromiseFulfilledResult<any>).value;
    expect(createdAssignment).toBeDefined();
    expect(createdAssignment.proposalRef).toBe(testProposalRef);
    createdAssignmentId = createdAssignment.id;

    // Exactly 1 must fail with deterministic duplicate error
    expect(rejections).toHaveLength(1);
    const rejectedReason = (rejections[0] as PromiseRejectedResult).reason;
    expect(rejectedReason).toBeInstanceOf(BadRequestException);
    expect(rejectedReason.message).toBe('Reviewer is already assigned to this proposal');

    // Verify PostgreSQL database table state
    const assignmentsInDb = await prisma.reviewAssignment.findMany({
      where: { proposalRef: testProposalRef, reviewerId: testReviewerId },
    });
    expect(assignmentsInDb).toHaveLength(1);
  });

  it('proves PostgreSQL conditional update prevents race-condition duplicate review submissions', async () => {
    expect(createdAssignmentId).toBeDefined();
    const assignmentId = createdAssignmentId!;

    // Reviewer declares NO_CONFLICT first
    await repository.saveConflictDeclaration(assignmentId, testReviewerId, 'NO_CONFLICT');

    const scores = {
      scientificMerit: 5,
      feasibility: 4,
      bilateralValue: 5,
      impact: 4,
    };
    const comments = 'Real PostgreSQL evaluation comments exceeding minimum required characters.';

    // Execute two simultaneous concurrent submissions against PostgreSQL
    const [sub1, sub2] = await Promise.allSettled([
      repository.submitEvaluation(assignmentId, testReviewerId, scores, comments),
      repository.submitEvaluation(assignmentId, testReviewerId, scores, comments),
    ]);

    const submitSuccesses = [sub1, sub2].filter((r) => r.status === 'fulfilled');
    const submitRejections = [sub1, sub2].filter((r) => r.status === 'rejected');

    // Exactly 1 submit succeeds in PostgreSQL
    expect(submitSuccesses).toHaveLength(1);
    // Exactly 1 submit fails with 'Evaluation already submitted'
    expect(submitRejections).toHaveLength(1);
    const rejReason = (submitRejections[0] as PromiseRejectedResult).reason;
    expect(rejReason).toBeInstanceOf(BadRequestException);
    expect(rejReason.message).toBe('Evaluation already submitted');

    // Verify DB integrity: exactly 1 review record, status SUBMITTED, exactly 1 outbox event
    const recordsInDb = await prisma.reviewRecord.findMany({
      where: { assignmentId },
    });
    expect(recordsInDb).toHaveLength(1);
    expect(recordsInDb[0].status).toBe('SUBMITTED');

    const finalAssignment = await prisma.reviewAssignment.findUnique({
      where: { id: assignmentId },
    });
    expect(finalAssignment?.status).toBe('SUBMITTED');
  });
});
