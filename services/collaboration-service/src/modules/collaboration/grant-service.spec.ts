import {
  BadRequestException,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { GrantController } from './grant.controller';
import { GrantRepository } from './grant.repository';
import { GrantService } from './grant.service';

const VN_USER_UUID = '11111111-1111-1111-1111-111111111111';
const RU_USER_UUID = '22222222-2222-2222-2222-222222222222';
const RANDOM_USER_UUID = '33333333-3333-3333-3333-333333333333';
const OPPORTUNITY_UUID = '44444444-4444-4444-4444-444444444444';
const PROPOSAL_UUID = '55555555-5555-5555-5555-555555555555';
const VN_REP_UUID = '66666666-6666-6666-6666-666666666666';
const MANAGER_UUID = '77777777-7777-7777-7777-777777777777';
const DECISION_MAKER_UUID = '88888888-8888-8888-8888-888888888888';

describe('Collaboration Service & Controller Tests', () => {
  let controller: GrantController;
  let service: GrantService;
  let repository: GrantRepository;
  let guard: AuthGuard;
  let mockPrisma: any;

  beforeEach(() => {
    process.env.AUTH_SERVICE_URL = 'http://localhost:3001';

    mockPrisma = {
      researchOpportunity: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      jointProposal: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      proposalParticipant: {
        create: jest.fn(),
      },
      collaborationConfirmation: {
        upsert: jest.fn(),
        updateMany: jest.fn(),
      },
      organizationEndorsement: {
        upsert: jest.fn(),
        updateMany: jest.fn(),
      },
      proposalScreening: {
        create: jest.fn(),
      },
      collaborationDecision: {
        create: jest.fn(),
      },
      outboxEvent: {
        create: jest.fn(),
      },
      $transaction: jest.fn((cb) => cb(mockPrisma)),
    };

    repository = new GrantRepository(mockPrisma as any);
    service = new GrantService(repository);
    controller = new GrantController(service);
    guard = new AuthGuard(new Reflector());
  });

  const createMockContext = (headers: Record<string, string>, requiredCapability?: string): ExecutionContext => {
    const request = { headers, user: null };
    const handler = () => {};
    const controllerClass = class {};

    (guard as any).reflector = {
      getAllAndOverride: jest.fn((key) => {
        if (key === 'require_capability') return requiredCapability;
        if (key === 'is_public') return false;
        return undefined;
      }),
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
      getHandler: () => handler,
      getClass: () => controllerClass,
      getType: () => 'http',
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
    } as unknown as ExecutionContext;
  };

  describe('AuthGuard Trust Boundary Tests', () => {
    let originalFetch: typeof global.fetch;

    beforeAll(() => {
      originalFetch = global.fetch;
      global.fetch = jest.fn() as any;
    });

    afterAll(() => {
      global.fetch = originalFetch;
    });

    it('should pass and resolve activeContext when auth-service returns 200 ok and matching capability', async () => {
      const mockUser = {
        userId: VN_USER_UUID,
        sessionId: 'session-123',
        activeContext: { contextType: 'ORGANIZATION', contextId: 'org-123' },
        capabilities: ['collab.proposals.create'],
        authenticationLevel: 'PASSWORD',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const context = createMockContext({ authorization: 'Bearer valid-token' }, 'collab.proposals.create');
      const canActivate = await guard.canActivate(context);

      expect(canActivate).toBe(true);
      expect(context.switchToHttp().getRequest().user).toEqual(mockUser);
    });

    it('should fail unauthorized when no cookie or authorization header is present', async () => {
      const context = createMockContext({});
      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should fail unauthorized when auth-service returns non-200 status', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const context = createMockContext({ cookie: 'session=invalid-cookie' });
      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should fail closed with ForbiddenException on network/connection failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Connection refused'));

      const context = createMockContext({ cookie: 'session=valid' });
      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });

    it('should fail closed with ForbiddenException when activeContext is missing', async () => {
      const mockUser = {
        userId: VN_USER_UUID,
        sessionId: 'session-123',
        activeContext: null,
        capabilities: ['collab.proposals.create'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const context = createMockContext({ cookie: 'session=valid' }, 'collab.proposals.create');
      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });

    it('should fail closed with ForbiddenException when required capability is missing', async () => {
      const mockUser = {
        userId: VN_USER_UUID,
        sessionId: 'session-123',
        activeContext: { contextType: 'ORGANIZATION', contextId: 'org-123' },
        capabilities: ['some.other.capability'],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const context = createMockContext({ cookie: 'session=valid' }, 'collab.proposals.create');
      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Research Opportunity State Transitions & Validation', () => {
    const managerUser = {
      userId: MANAGER_UUID,
      activeContext: { contextType: 'PLATFORM', contextId: 'platform_main' },
      capabilities: ['collab.opportunities.create', 'collab.opportunities.publish'],
    } as any;

    it('should create opportunity in DRAFT state', async () => {
      mockPrisma.researchOpportunity.create.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        title: 'Joint Opportunity 2026',
        state: 'DRAFT',
      });

      const res = await controller.createOpportunity(
        { user: managerUser },
        {
          id: OPPORTUNITY_UUID,
          title: 'Joint Opportunity 2026',
        },
      );

      expect(res.state).toBe('DRAFT');
      expect(mockPrisma.researchOpportunity.create).toHaveBeenCalled();
    });

    it('should publish opportunity only if it is in DRAFT state', async () => {
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        state: 'DRAFT',
      });
      mockPrisma.researchOpportunity.update.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        state: 'PUBLISHED',
      });

      const res = await controller.publishOpportunity({ user: managerUser }, OPPORTUNITY_UUID);
      expect(res.state).toBe('PUBLISHED');
    });

    it('should close opportunity only if it is in PUBLISHED state', async () => {
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        state: 'PUBLISHED',
      });
      mockPrisma.researchOpportunity.update.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        state: 'CLOSED',
      });

      const res = await controller.closeOpportunity({ user: managerUser }, OPPORTUNITY_UUID);
      expect(res.state).toBe('CLOSED');
    });

    it('should fail transition when closing opportunity from DRAFT (invalid transition)', async () => {
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        state: 'DRAFT',
      });

      await expect(
        controller.closeOpportunity({ user: managerUser }, OPPORTUNITY_UUID),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Joint Proposal Logic & Security Gates', () => {
    const vnResearcher = {
      userId: VN_USER_UUID,
      activeContext: { contextType: 'ORGANIZATION', contextId: 'vn-org-ref' },
      capabilities: ['collab.proposals.create'],
    } as any;

    const ruResearcher = {
      userId: RU_USER_UUID,
      activeContext: { contextType: 'ORGANIZATION', contextId: 'ru-org-ref' },
      capabilities: ['collab.proposals.create'],
    } as any;

    const randomResearcher = {
      userId: RANDOM_USER_UUID,
      activeContext: { contextType: 'ORGANIZATION', contextId: 'some-other-org' },
      capabilities: ['collab.proposals.create'],
    } as any;

    it('should create proposal only when opportunity is PUBLISHED and caller is a participant matching context', async () => {
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        state: 'PUBLISHED',
      });
      mockPrisma.jointProposal.create.mockResolvedValueOnce({
        id: PROPOSAL_UUID,
        state: 'DRAFT',
        content: 'Bilateral Quantum Research',
        revision: 1,
      });

      const res = await controller.createProposal(
        { user: vnResearcher },
        {
          id: PROPOSAL_UUID,
          opportunityId: OPPORTUNITY_UUID,
          content: 'Bilateral Quantum Research',
          vnParticipant: { userId: VN_USER_UUID, organizationRef: 'vn-org-ref' },
          ruParticipant: { userId: RU_USER_UUID, organizationRef: 'ru-org-ref' },
        },
      );

      expect(res.state).toBe('DRAFT');
    });

    it('should fail creating proposal if caller is not one of the participants', async () => {
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        state: 'PUBLISHED',
      });

      await expect(
        controller.createProposal(
          { user: randomResearcher },
          {
            id: PROPOSAL_UUID,
            opportunityId: OPPORTUNITY_UUID,
            content: 'Research',
            vnParticipant: { userId: VN_USER_UUID, organizationRef: 'vn-org-ref' },
            ruParticipant: { userId: RU_USER_UUID, organizationRef: 'ru-org-ref' },
          },
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should fail creating proposal if caller context does not match organizationRef', async () => {
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        state: 'PUBLISHED',
      });

      const badVnResearcher = {
        userId: VN_USER_UUID,
        activeContext: { contextType: 'ORGANIZATION', contextId: 'hacked-org-ref' },
        capabilities: ['collab.proposals.create'],
      } as any;

      await expect(
        controller.createProposal(
          { user: badVnResearcher },
          {
            id: PROPOSAL_UUID,
            opportunityId: OPPORTUNITY_UUID,
            content: 'Research',
            vnParticipant: { userId: VN_USER_UUID, organizationRef: 'vn-org-ref' },
            ruParticipant: { userId: RU_USER_UUID, organizationRef: 'ru-org-ref' },
          },
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should revise proposal, invalidate confirmations/endorsements, increment revision, and revert to DRAFT', async () => {
      const proposalDb = {
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        state: 'PAIRED_CONFIRMED',
        content: 'Old Research',
        revision: 1,
        participants: [
          { userId: VN_USER_UUID, organizationRef: 'vn-org-ref', country: 'VN' },
          { userId: RU_USER_UUID, organizationRef: 'ru-org-ref', country: 'RU' },
        ],
        confirmations: [
          { participantId: VN_USER_UUID, confirmed: true },
          { participantId: RU_USER_UUID, confirmed: true },
        ],
        endorsements: [
          { organizationRef: 'vn-org-ref', country: 'VN', endorsed: true },
        ],
      };

      mockPrisma.jointProposal.findUnique.mockResolvedValueOnce(proposalDb);
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({ id: OPPORTUNITY_UUID, state: 'PUBLISHED' });
      mockPrisma.jointProposal.update.mockResolvedValueOnce({
        ...proposalDb,
        content: 'New Revised Research',
        revision: 2,
        state: 'DRAFT',
      });

      const res = await controller.reviseProposal(
        { user: vnResearcher },
        PROPOSAL_UUID,
        {
          content: 'New Revised Research',
          expectedRevision: 1,
        },
      );

      expect(res.state).toBe('DRAFT');
      expect(res.revision).toBe(2);
      expect(res.content).toBe('New Revised Research');

      expect(mockPrisma.collaborationConfirmation.updateMany).toHaveBeenCalledWith({
        where: { proposalId: PROPOSAL_UUID },
        data: { confirmed: false, confirmedAt: null },
      });
      expect(mockPrisma.organizationEndorsement.updateMany).toHaveBeenCalledWith({
        where: { proposalId: PROPOSAL_UUID },
        data: { endorsed: false, endorsedAt: null },
      });
    });

    it('should fail revising proposal if expectedRevision does not match (optimistic concurrency conflict)', async () => {
      mockPrisma.jointProposal.findUnique.mockResolvedValueOnce({
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        revision: 5,
        participants: [{ userId: VN_USER_UUID, organizationRef: 'vn-org-ref', country: 'VN' }],
        confirmations: [],
        endorsements: [],
      });
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
        state: 'PUBLISHED',
      });

      await expect(
        controller.reviseProposal(
          { user: vnResearcher },
          PROPOSAL_UUID,
          {
            content: 'Hacked',
            expectedRevision: 4,
          },
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('should confirm proposal and transition to PAIRED_CONFIRMED when both participants confirm', async () => {
      const proposalDb = {
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        state: 'DRAFT',
        content: 'Bilateral Space Science',
        revision: 1,
        participants: [
          { userId: VN_USER_UUID, organizationRef: 'vn-org-ref', country: 'VN' },
          { userId: RU_USER_UUID, organizationRef: 'ru-org-ref', country: 'RU' },
        ],
        confirmations: [
          { participantId: VN_USER_UUID, confirmed: true },
        ],
      };

      mockPrisma.jointProposal.findUnique.mockResolvedValueOnce(proposalDb);
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({ id: OPPORTUNITY_UUID, state: 'PUBLISHED' });
      mockPrisma.jointProposal.update.mockResolvedValueOnce({
        ...proposalDb,
        state: 'PAIRED_CONFIRMED',
      });

      const res = await controller.confirmProposal({ user: ruResearcher }, PROPOSAL_UUID);

      expect(res.state).toBe('PAIRED_CONFIRMED');
      expect(mockPrisma.collaborationConfirmation.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ participantId: RU_USER_UUID, confirmed: true }),
        }),
      );
    });

    it('should allow organization representative to endorse proposal', async () => {
      const proposalDb = {
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        state: 'PAIRED_CONFIRMED',
        participants: [
          { userId: VN_USER_UUID, organizationRef: 'vn-org-ref', country: 'VN' },
          { userId: RU_USER_UUID, organizationRef: 'ru-org-ref', country: 'RU' },
        ],
      };

      mockPrisma.jointProposal.findUnique.mockResolvedValue(proposalDb);
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({ id: OPPORTUNITY_UUID, state: 'PUBLISHED' });

      const vnRep = {
        userId: VN_REP_UUID,
        activeContext: { contextType: 'ORGANIZATION', contextId: 'vn-org-ref' },
        capabilities: ['collab.proposals.endorse'],
      } as any;

      await controller.endorseProposal({ user: vnRep }, PROPOSAL_UUID);

      expect(mockPrisma.organizationEndorsement.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ organizationRef: 'vn-org-ref', country: 'VN', endorsed: true }),
        }),
      );
    });

    it('should fail submission if proposal is missing organization endorsements', async () => {
      const proposalDb = {
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        state: 'PAIRED_CONFIRMED',
        content: 'Bilateral Quantum Research',
        revision: 1,
        participants: [
          { userId: VN_USER_UUID, organizationRef: 'vn-org-ref', country: 'VN' },
          { userId: RU_USER_UUID, organizationRef: 'ru-org-ref', country: 'RU' },
        ],
        confirmations: [
          { participantId: VN_USER_UUID, confirmed: true },
          { participantId: RU_USER_UUID, confirmed: true },
        ],
        endorsements: [
          { organizationRef: 'vn-org-ref', country: 'VN', endorsed: true },
        ],
      };

      mockPrisma.jointProposal.findUnique.mockResolvedValueOnce(proposalDb);
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({ id: OPPORTUNITY_UUID, state: 'PUBLISHED' });

      await expect(
        controller.submitProposal({ user: vnResearcher }, PROPOSAL_UUID),
      ).rejects.toThrow(BadRequestException);
    });

    it('should submit proposal, transition state to SUBMITTED, and emit collab.proposal.submitted outbox event', async () => {
      const proposalDb = {
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        state: 'PAIRED_CONFIRMED',
        content: 'Bilateral Quantum Research',
        revision: 1,
        participants: [
          { userId: VN_USER_UUID, organizationRef: 'vn-org-ref', country: 'VN' },
          { userId: RU_USER_UUID, organizationRef: 'ru-org-ref', country: 'RU' },
        ],
        confirmations: [
          { participantId: VN_USER_UUID, confirmed: true },
          { participantId: RU_USER_UUID, confirmed: true },
        ],
        endorsements: [
          { organizationRef: 'vn-org-ref', country: 'VN', endorsed: true },
          { organizationRef: 'ru-org-ref', country: 'RU', endorsed: true },
        ],
      };

      mockPrisma.jointProposal.findUnique.mockResolvedValueOnce(proposalDb);
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({ id: OPPORTUNITY_UUID, state: 'PUBLISHED' });
      mockPrisma.jointProposal.update.mockResolvedValueOnce({
        ...proposalDb,
        state: 'SUBMITTED',
      });

      const res = await controller.submitProposal({ user: vnResearcher }, PROPOSAL_UUID);

      expect(res.state).toBe('SUBMITTED');
      expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventType: 'collab.proposal.submitted',
            payload: expect.stringContaining(`"proposalId":"${PROPOSAL_UUID}"`),
          }),
        }),
      );
    });
  });

  describe('Eligibility Screening & Collaboration Decisions', () => {
    const manager = {
      userId: MANAGER_UUID,
      activeContext: { contextType: 'PLATFORM', contextId: 'platform_main' },
      capabilities: ['collab.proposals.screen'],
    } as any;

    const decisionMaker = {
      userId: DECISION_MAKER_UUID,
      activeContext: { contextType: 'PLATFORM', contextId: 'platform_main' },
      capabilities: ['collab.decisions.issue_foundation'],
    } as any;

    it('should allow COLLABORATION_MANAGER to screen proposal as ELIGIBLE', async () => {
      mockPrisma.jointProposal.findUnique.mockResolvedValueOnce({
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        state: 'SUBMITTED',
      });
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
      });
      mockPrisma.jointProposal.update.mockResolvedValueOnce({
        id: PROPOSAL_UUID,
        state: 'ELIGIBLE',
      });

      const res = await controller.screenProposal(
        { user: manager },
        PROPOSAL_UUID,
        {
          eligible: true,
          reason: 'Checks passed',
        },
      );

      expect(res.state).toBe('ELIGIBLE');
      expect(mockPrisma.proposalScreening.create).toHaveBeenCalled();
    });

    it('should allow FOUNDATION_DECISION_MAKER to approve ELIGIBLE proposal and emit collab.decision.approved outbox event', async () => {
      mockPrisma.jointProposal.findUnique.mockResolvedValueOnce({
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        state: 'ELIGIBLE',
      });
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
      });
      mockPrisma.jointProposal.update.mockResolvedValueOnce({
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        state: 'APPROVED',
      });

      const res = await controller.decisionProposal(
        { user: decisionMaker },
        PROPOSAL_UUID,
        {
          approved: true,
          reason: 'Excellent scientific merit',
        },
      );

      expect(res.state).toBe('APPROVED');
      expect(mockPrisma.collaborationDecision.create).toHaveBeenCalled();
      expect(mockPrisma.outboxEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventType: 'collab.decision.approved',
            payload: expect.stringContaining(`"proposalId":"${PROPOSAL_UUID}"`),
          }),
        }),
      );
    });

    it('should fail collaboration decision if proposal state is not ELIGIBLE', async () => {
      mockPrisma.jointProposal.findUnique.mockResolvedValueOnce({
        id: PROPOSAL_UUID,
        opportunityId: OPPORTUNITY_UUID,
        state: 'SUBMITTED',
      });
      mockPrisma.researchOpportunity.findUnique.mockResolvedValueOnce({
        id: OPPORTUNITY_UUID,
      });

      await expect(
        controller.decisionProposal(
          { user: decisionMaker },
          PROPOSAL_UUID,
          {
            approved: true,
            reason: 'Reason',
          },
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
