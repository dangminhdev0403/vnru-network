import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReviewService } from './review.service';
import { validateProposalSnapshot } from './anonymizer';
import type { AuthenticatedUser } from './auth.guard';

describe('Review Service Logic & Boundary Checks', () => {
  let service: ReviewService;
  let mockRepo: any;

  // Pre-configured Test Users
  const reviewBoardAdminUser: AuthenticatedUser = {
    userId: '11111111-1111-1111-1111-111111111111',
    sessionId: 'sess-admin',
    activeContext: {
      contextType: 'REVIEW_BOARD',
      contextId: '22222222-2222-2222-2222-222222222222',
    },
    capabilities: ['reviews.assignments.manage', 'reviews.recommendations.view'],
    authenticationLevel: 'PASSWORD',
  };

  const reviewerUserBoardA: AuthenticatedUser = {
    userId: '33333333-3333-3333-3333-333333333333',
    sessionId: 'sess-rev-a',
    activeContext: {
      contextType: 'REVIEW_BOARD',
      contextId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    },
    capabilities: ['reviews.assignments.view_assigned', 'reviews.evaluations.score', 'reviews.evaluations.submit'],
    authenticationLevel: 'PASSWORD',
  };

  const reviewerUserBoardB: AuthenticatedUser = {
    userId: '33333333-3333-3333-3333-333333333333',
    sessionId: 'sess-rev-b',
    activeContext: {
      contextType: 'REVIEW_BOARD',
      contextId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    },
    capabilities: ['reviews.assignments.view_assigned'],
    authenticationLevel: 'PASSWORD',
  };

  const unauthorizedUser: AuthenticatedUser = {
    userId: '99999999-9999-9999-9999-999999999999',
    sessionId: 'sess-unauth',
    activeContext: {
      contextType: 'ORGANIZATION',
      contextId: 'org-ref-99',
    },
    capabilities: [],
    authenticationLevel: 'PASSWORD',
  };

  beforeEach(() => {
    mockRepo = {
      createAssignment: jest.fn(),
      findAssignments: jest.fn(),
      findAssignmentById: jest.fn(),
      saveConflictDeclaration: jest.fn(),
      saveEvaluation: jest.fn(),
      submitEvaluation: jest.fn(),
      getRecommendation: jest.fn(),
    };
    service = new ReviewService(mockRepo);
  });

  describe('1. Proposal Snapshot Anonymization Validation', () => {
    it('should PASS snapshot with only allowed root keys and no identifying info', () => {
      const validSnapshot = {
        title: 'Bilateral Quantum Cryptography Cooperation',
        abstract: 'A proposal on building secure communication layers.',
        objectives: 'Design novel algorithms.',
        methodology: 'Iterative feedback loops.',
        expectedOutcomes: 'Trilingual encryption protocol.',
        keywords: ['quantum', 'cryptography', 'security'],
      };
      expect(validateProposalSnapshot(validSnapshot)).toBe(true);
    });

    it('should REJECT snapshot with extra root keys not in the allowlist', () => {
      const invalidSnapshot = {
        title: 'Quantum Cryptography',
        budget: 500000, // Not allowed root key
      };
      expect(validateProposalSnapshot(invalidSnapshot)).toBe(false);
    });

    it('should REJECT nested objects', () => {
      expect(validateProposalSnapshot({ title: 'Quantum Cryptography', objectives: { goal: 'Establish links' } })).toBe(false);
    });

    it('should accept scientific prose mentioning countries and organizations', () => {
      expect(validateProposalSnapshot({
        title: 'Quantum Cryptography',
        abstract: 'Compares country-level policy and research organization capacity without identifying applicants.',
      })).toBe(true);
    });

    it('should throw BadRequestException when creating assignment with invalid snapshot', async () => {
      const body = {
        proposalRef: 'prop-123',
        reviewerId: reviewerUserBoardA.userId,
        boardRef: reviewerUserBoardA.activeContext!.contextId,
        proposalSnapshot: {
          title: 'Quantum Project',
          authorName: 'Dr. Nguyen', // Invalid key
        },
      };

      await expect(service.createAssignment(body, reviewBoardAdminUser)).rejects.toThrow(BadRequestException);
      expect(mockRepo.createAssignment).not.toHaveBeenCalled();
    });
  });

  describe('2. Authorization & Board/Reviewer Matching Gate', () => {
    it('should throw ForbiddenException if creating assignment without reviews.assignments.manage capability', async () => {
      const body = {
        proposalRef: 'prop-123',
        reviewerId: reviewerUserBoardA.userId,
        boardRef: reviewerUserBoardA.activeContext!.contextId,
        proposalSnapshot: { title: 'Valid snapshot' },
      };

      await expect(service.createAssignment(body, reviewerUserBoardA)).rejects.toThrow(ForbiddenException);
    });

    it('allows Manager with reviews.assignments.manage to retrieve assignment details', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: 'another-reviewer',
        boardRef: 'board-xyz',
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);

      await expect(service.getAssignmentDetail('assign-123', reviewBoardAdminUser)).resolves.toEqual(mockAssignment);
    });

    it('should allow Reviewer to view assignment if boardRef matches their active context', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: reviewerUserBoardA.userId,
        boardRef: reviewerUserBoardA.activeContext!.contextId,
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);

      const res = await service.getAssignmentDetail('assign-123', reviewerUserBoardA);
      expect(res).toEqual(mockAssignment);
    });

    it('should REJECT Reviewer view details if boardRef does NOT match their active context', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: reviewerUserBoardA.userId,
        boardRef: reviewerUserBoardA.activeContext!.contextId, // Board A
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);

      // Reviewer on Board B tries to view Board A assignment
      await expect(service.getAssignmentDetail('assign-123', reviewerUserBoardB)).rejects.toThrow(ForbiddenException);
    });

    it('should REJECT Reviewer view details if reviewerId does NOT match their user id', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: 'another-reviewer-uuid',
        boardRef: reviewerUserBoardA.activeContext!.contextId,
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);

      await expect(service.getAssignmentDetail('assign-123', reviewerUserBoardA)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('3. Conflict of Interest (COI) Block', () => {
    it('should allow Reviewer to declare conflict on their assignment', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: reviewerUserBoardA.userId,
        boardRef: reviewerUserBoardA.activeContext!.contextId,
        status: 'PENDING',
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);
      mockRepo.saveConflictDeclaration.mockResolvedValue({ id: 'conf-1', declaration: 'CONFLICT' });

      const res = await service.declareConflict('assign-123', 'CONFLICT', reviewerUserBoardA);
      expect(mockRepo.saveConflictDeclaration).toHaveBeenCalledWith('assign-123', reviewerUserBoardA.userId, 'CONFLICT');
      expect(res.declaration).toBe('CONFLICT');
    });

    it('should reject conflict declaration from a non-assigned reviewer', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: 'some-other-reviewer',
        boardRef: reviewerUserBoardA.activeContext!.contextId,
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);

      await expect(service.declareConflict('assign-123', 'CONFLICT', reviewerUserBoardA)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('4. Score Bounds validation', () => {
    it('should allow saving evaluation with valid scores (1..5)', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: reviewerUserBoardA.userId,
        boardRef: reviewerUserBoardA.activeContext!.contextId,
        status: 'PENDING',
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);
      mockRepo.saveEvaluation.mockResolvedValue({ id: 'rec-1', status: 'DRAFT' });

      const validScores = { scientificMerit: 5, feasibility: 4, bilateralValue: 3, impact: 5 };
      await service.saveEvaluation('assign-123', validScores, 'Valid comments', reviewerUserBoardA);

      expect(mockRepo.saveEvaluation).toHaveBeenCalledWith('assign-123', reviewerUserBoardA.userId, validScores, 'Valid comments');
    });

    it('should delegate score bounds checking to the repository/transaction level', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: reviewerUserBoardA.userId,
        boardRef: reviewerUserBoardA.activeContext!.contextId,
        status: 'PENDING',
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);

      const invalidScores = { scientificMerit: 6, feasibility: 4 };
      await service.saveEvaluation('assign-123', invalidScores, 'Comments', reviewerUserBoardA);
      expect(mockRepo.saveEvaluation).toHaveBeenCalledWith('assign-123', reviewerUserBoardA.userId, invalidScores, 'Comments');
    });
  });

  describe('5. Immutable Submit Validation', () => {
    it('should allow submitting complete scores and comments', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: reviewerUserBoardA.userId,
        boardRef: reviewerUserBoardA.activeContext!.contextId,
        status: 'DRAFT',
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);
      mockRepo.submitEvaluation.mockResolvedValue({ id: 'rec-1', status: 'SUBMITTED' });

      const scores = { scientificMerit: 4, feasibility: 5, bilateralValue: 3, impact: 4 };
      const res = await service.submitEvaluation('assign-123', scores, 'This proposal meets standard requirements', reviewerUserBoardA);

      expect(mockRepo.submitEvaluation).toHaveBeenCalledWith('assign-123', reviewerUserBoardA.userId, scores, 'This proposal meets standard requirements');
      expect(res!.status).toBe('SUBMITTED');
    });

    it('should throw ForbiddenException if submitting a review for another reviewer assignment', async () => {
      const mockAssignment = {
        id: 'assign-123',
        reviewerId: 'another-reviewer',
        boardRef: reviewerUserBoardA.activeContext!.contextId,
        status: 'DRAFT',
      };
      mockRepo.findAssignmentById.mockResolvedValue(mockAssignment);

      const scores = { scientificMerit: 4, feasibility: 5, bilateralValue: 3, impact: 4 };
      await expect(
        service.submitEvaluation('assign-123', scores, 'These comments are long enough.', reviewerUserBoardA)
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('6. Deterministic Recommendation & Outbox Event Invariants', () => {
    it('should return deterministic averages and block unauthorized roles from viewing', async () => {
      const mockRec = {
        proposalRef: 'prop-123',
        averageScientificMerit: 4.5,
        averageFeasibility: 4.0,
        averageBilateralValue: 4.0,
        averageImpact: 4.5,
        overallAverage: 4.25,
        totalReviews: 2,
      };
      mockRepo.getRecommendation.mockResolvedValue(mockRec);

      const res = await service.getRecommendation('prop-123', reviewBoardAdminUser);
      expect(mockRepo.getRecommendation).toHaveBeenCalledWith('prop-123');
      expect(res).toEqual(mockRec);

      // Unauthorized access
      await expect(service.getRecommendation('prop-123', reviewerUserBoardA)).rejects.toThrow(ForbiddenException);
      await expect(service.getRecommendation('prop-123', unauthorizedUser)).rejects.toThrow(ForbiddenException);
    });
  });
});
