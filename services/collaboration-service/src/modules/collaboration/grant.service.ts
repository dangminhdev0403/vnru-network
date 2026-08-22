import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticatedUser } from './auth.guard';
import {
  closeOpportunity,
  confirmProposal,
  createOpportunity,
  createProposal,
  publishOpportunity,
  reviseProposal,
  submitProposal,
} from './grant';
import { GrantRepository } from './grant.repository';
import { encodeCursor, OpportunityQuery } from './opportunity-query';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUuid(id: string, name: string) {
  if (!id || typeof id !== 'string' || !UUID_RE.test(id)) {
    throw new BadRequestException({ error: { code: 'INVALID_ID', message: `Invalid ${name}: must be a valid UUID` } });
  }
}

function validateString(val: string, name: string, minLength = 1) {
  if (typeof val !== 'string' || val.trim().length < minLength) {
    throw new BadRequestException({ error: { code: 'INVALID_INPUT', message: `${name} must be a non-empty string` } });
  }
}

@Injectable()
export class GrantService {
  constructor(private readonly repository: GrantRepository) {}

  async listOpportunities(query: OpportunityQuery) {
    const limit = query.limit;
    const dbOpportunities = await this.repository.findPublishedOpportunities(
      limit + 1,
      query.cursor
        ? {
            id: query.cursor.id,
            createdAt: new Date(query.cursor.createdAt),
          }
        : undefined,
    );

    const hasMore = dbOpportunities.length > limit;
    const visible = dbOpportunities.slice(0, limit);

    return {
      items: visible.map((o: any) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        state: o.state,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      })),
      nextCursor: hasMore
        ? encodeCursor({
            createdAt: visible.at(-1)!.createdAt.toISOString(),
            id: visible.at(-1)!.id,
          })
        : null,
    };
  }

  async createOpportunity(
    user: AuthenticatedUser,
    dto: { id: string; title: string; description?: string },
  ) {
    validateUuid(dto.id, 'id');
    validateString(dto.title, 'title');

    const domainOpportunity = createOpportunity(dto.id);

    try {
      return await this.repository.createOpportunity({
        id: dto.id,
        title: dto.title.trim(),
        description: dto.description?.trim(),
        state: domainOpportunity.state,
      });
    } catch (err: any) {
      if (err && (err.code === 'P2002' || String(err.message).includes('unique'))) {
        throw new ConflictException({ error: { code: 'DUPLICATE_ID', message: 'Opportunity already exists' } });
      }
      throw err;
    }
  }

  async publishOpportunity(user: AuthenticatedUser, id: string) {
    validateUuid(id, 'id');

    const opportunity = await this.repository.findOpportunityById(id);
    if (!opportunity) {
      throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
    }

    const mappedOpportunity = { id: opportunity.id, state: opportunity.state as any };
    try {
      const updatedDomain = publishOpportunity(mappedOpportunity);
      return await this.repository.updateOpportunityState(id, opportunity.state, updatedDomain.state, 'collab.opportunity.published');
    } catch (err: any) {
      throw new BadRequestException({ error: { code: 'INVALID_TRANSITION', message: err.message } });
    }
  }

  async closeOpportunity(user: AuthenticatedUser, id: string) {
    validateUuid(id, 'id');

    const opportunity = await this.repository.findOpportunityById(id);
    if (!opportunity) {
      throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
    }

    const mappedOpportunity = { id: opportunity.id, state: opportunity.state as any };
    try {
      const updatedDomain = closeOpportunity(mappedOpportunity);
      return await this.repository.updateOpportunityState(id, opportunity.state, updatedDomain.state, 'collab.opportunity.closed');
    } catch (err: any) {
      throw new BadRequestException({ error: { code: 'INVALID_TRANSITION', message: err.message } });
    }
  }

  async createProposal(
    user: AuthenticatedUser,
    dto: {
      id: string;
      opportunityId: string;
      content: string;
      vnParticipant: { userId: string; organizationRef: string };
      ruParticipant: { userId: string; organizationRef: string };
    },
  ) {
    validateUuid(dto.id, 'id');
    validateUuid(dto.opportunityId, 'opportunityId');
    validateString(dto.content, 'content');
    validateUuid(dto.vnParticipant?.userId, 'vnParticipant.userId');
    validateString(dto.vnParticipant?.organizationRef, 'vnParticipant.organizationRef');
    validateUuid(dto.ruParticipant?.userId, 'ruParticipant.userId');
    validateString(dto.ruParticipant?.organizationRef, 'ruParticipant.organizationRef');

    if (dto.vnParticipant.userId === dto.ruParticipant.userId) {
      throw new BadRequestException({
        error: { code: 'INVALID_PARTICIPANTS', message: 'VN and RU participants must be different users' },
      });
    }

    const opportunity = await this.repository.findOpportunityById(dto.opportunityId);
    if (!opportunity) {
      throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
    }

    const isVn = user.userId === dto.vnParticipant.userId;
    const isRu = user.userId === dto.ruParticipant.userId;

    if (!isVn && !isRu) {
      throw new ForbiddenException({
        error: { code: 'FORBIDDEN', message: 'Caller must be one of the proposal participants' },
      });
    }

    const targetOrgRef = isVn ? dto.vnParticipant.organizationRef : dto.ruParticipant.organizationRef;
    if (user.activeContext?.contextId !== targetOrgRef) {
      throw new ForbiddenException({
        error: { code: 'FORBIDDEN', message: 'Caller context ID must match their participant organizationRef' },
      });
    }

    const mappedOpportunity = { id: opportunity.id, state: opportunity.state as any };
    try {
      const domainProposal = createProposal(
        dto.id,
        mappedOpportunity,
        dto.vnParticipant.userId,
        dto.ruParticipant.userId,
        dto.content,
      );

      return await this.repository.createProposal({
        id: dto.id,
        opportunityId: dto.opportunityId,
        state: domainProposal.state,
        content: dto.content.trim(),
        revision: domainProposal.revision,
        participants: [
          { userId: dto.vnParticipant.userId, organizationRef: dto.vnParticipant.organizationRef, country: 'VN' },
          { userId: dto.ruParticipant.userId, organizationRef: dto.ruParticipant.organizationRef, country: 'RU' },
        ],
      });
    } catch (err: any) {
      if (err && (err.code === 'P2002' || String(err.message).includes('unique'))) {
        throw new ConflictException({ error: { code: 'DUPLICATE_ID', message: 'Proposal already exists' } });
      }
      throw new BadRequestException({ error: { code: 'INVALID_TRANSITION', message: err.message } });
    }
  }

  async getProposal(user: AuthenticatedUser, id: string) {
    validateUuid(id, 'id');

    const proposal = await this.repository.findProposalById(id);
    if (!proposal) {
      throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Proposal not found' } });
    }

    const vnParticipant = proposal.participants.find((p) => p.country === 'VN');
    const ruParticipant = proposal.participants.find((p) => p.country === 'RU');

    const isVn = user.userId === vnParticipant?.userId;
    const isRu = user.userId === ruParticipant?.userId;

    let isAuthorized = false;
    if (isVn) {
      isAuthorized = user.activeContext?.contextId === vnParticipant?.organizationRef;
    } else if (isRu) {
      isAuthorized = user.activeContext?.contextId === ruParticipant?.organizationRef;
    } else if (user.activeContext?.contextType === 'PLATFORM') {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new ForbiddenException({
        error: { code: 'FORBIDDEN', message: 'Not authorized to view this proposal' },
      });
    }

    return proposal;
  }

  async reviseProposal(user: AuthenticatedUser, id: string, dto: { content: string; expectedRevision: number }) {
    validateUuid(id, 'id');
    validateString(dto.content, 'content');
    if (!Number.isInteger(dto.expectedRevision) || dto.expectedRevision < 1) {
      throw new BadRequestException({
        error: { code: 'INVALID_REVISION', message: 'Expected revision must be a positive integer' },
      });
    }

    return await this.repository.executeInTransaction(async (tx: any) => {
      const proposal = await tx.jointProposal.findUnique({
        where: { id },
        include: { participants: true, confirmations: true, endorsements: true },
      });
      if (!proposal) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Proposal not found' } });
      }

      const opportunity = await tx.researchOpportunity.findUnique({
        where: { id: proposal.opportunityId },
      });
      if (!opportunity) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
      }

      const vnParticipant = proposal.participants.find((p: any) => p.country === 'VN');
      const ruParticipant = proposal.participants.find((p: any) => p.country === 'RU');

      const isVn = user.userId === vnParticipant?.userId;
      const isRu = user.userId === ruParticipant?.userId;

      if (!isVn && !isRu) {
        throw new ForbiddenException({
          error: { code: 'FORBIDDEN', message: 'Only participants may revise proposal' },
        });
      }

      const targetOrgRef = isVn ? vnParticipant?.organizationRef : ruParticipant?.organizationRef;
      if (user.activeContext?.contextId !== targetOrgRef) {
        throw new ForbiddenException({
          error: { code: 'FORBIDDEN', message: 'Caller context ID must match their participant organizationRef' },
        });
      }

      const vnConfirmation = proposal.confirmations.find((c: any) => c.participantId === vnParticipant?.userId);
      const ruConfirmation = proposal.confirmations.find((c: any) => c.participantId === ruParticipant?.userId);

      const mappedOpportunity = { id: opportunity.id, state: opportunity.state as any };
      const mappedProposal = {
        id: proposal.id,
        opportunityId: proposal.opportunityId,
        vnParticipantId: vnParticipant?.userId || '',
        ruParticipantId: ruParticipant?.userId || '',
        vnConfirmed: vnConfirmation?.confirmed ?? false,
        ruConfirmed: ruConfirmation?.confirmed ?? false,
        state: proposal.state as any,
        content: proposal.content,
        revision: proposal.revision,
      };

      let revisedDomain;
      try {
        revisedDomain = reviseProposal(mappedProposal, mappedOpportunity, dto.content, dto.expectedRevision);
      } catch (err: any) {
        if (err.message.includes('Concurrency conflict')) {
          throw new ConflictException({ error: { code: 'CONCURRENCY_CONFLICT', message: err.message } });
        }
        throw new BadRequestException({ error: { code: 'INVALID_TRANSITION', message: err.message } });
      }

      await tx.collaborationConfirmation.updateMany({
        where: { proposalId: id },
        data: { confirmed: false, confirmedAt: null },
      });

      await tx.organizationEndorsement.updateMany({
        where: { proposalId: id },
        data: { endorsed: false, endorsedAt: null },
      });

      try {
        return await tx.jointProposal.update({
          where: { id, revision: dto.expectedRevision },
          data: { content: revisedDomain.content.trim(), revision: revisedDomain.revision, state: revisedDomain.state },
          include: { participants: true, confirmations: true, endorsements: true },
        });
      } catch (err: any) {
        if (err?.code === 'P2025') throw new ConflictException({ error: { code: 'CONCURRENCY_CONFLICT', message: 'Proposal revision changed' } });
        throw err;
      }
    });
  }

  async confirmProposal(user: AuthenticatedUser, id: string) {
    validateUuid(id, 'id');

    return await this.repository.executeInTransaction(async (tx: any) => {
      const proposal = await tx.jointProposal.findUnique({
        where: { id },
        include: { participants: true, confirmations: true },
      });
      if (!proposal) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Proposal not found' } });
      }

      const opportunity = await tx.researchOpportunity.findUnique({
        where: { id: proposal.opportunityId },
      });
      if (!opportunity) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
      }

      const vnParticipant = proposal.participants.find((p: any) => p.country === 'VN');
      const ruParticipant = proposal.participants.find((p: any) => p.country === 'RU');

      const isVn = user.userId === vnParticipant?.userId;
      const isRu = user.userId === ruParticipant?.userId;

      if (!isVn && !isRu) {
        throw new ForbiddenException({
          error: { code: 'FORBIDDEN', message: 'Invalid participant: not registered for this joint proposal' },
        });
      }

      const targetOrgRef = isVn ? vnParticipant?.organizationRef : ruParticipant?.organizationRef;
      if (user.activeContext?.contextId !== targetOrgRef) {
        throw new ForbiddenException({
          error: { code: 'FORBIDDEN', message: 'Caller context ID must match their participant organizationRef' },
        });
      }

      const vnConfirmation = proposal.confirmations.find((c: any) => c.participantId === vnParticipant?.userId);
      const ruConfirmation = proposal.confirmations.find((c: any) => c.participantId === ruParticipant?.userId);

      const mappedOpportunity = { id: opportunity.id, state: opportunity.state as any };
      const mappedProposal = {
        id: proposal.id,
        opportunityId: proposal.opportunityId,
        vnParticipantId: vnParticipant?.userId || '',
        ruParticipantId: ruParticipant?.userId || '',
        vnConfirmed: vnConfirmation?.confirmed ?? false,
        ruConfirmed: ruConfirmation?.confirmed ?? false,
        state: proposal.state as any,
        content: proposal.content,
        revision: proposal.revision,
      };

      let updatedDomain;
      try {
        updatedDomain = confirmProposal(mappedProposal, mappedOpportunity, user.userId);
      } catch (err: any) {
        throw new BadRequestException({ error: { code: 'INVALID_TRANSITION', message: err.message } });
      }

      await tx.collaborationConfirmation.upsert({
        where: {
          proposalId_participantId: {
            proposalId: id,
            participantId: user.userId,
          },
        },
        create: {
          proposalId: id,
          participantId: user.userId,
          confirmed: true,
          confirmedAt: new Date(),
        },
        update: {
          confirmed: true,
          confirmedAt: new Date(),
        },
      });

      return await tx.jointProposal.update({
        where: { id },
        data: {
          state: updatedDomain.state,
        },
        include: {
          participants: true,
          confirmations: true,
          endorsements: true,
        },
      });
    });
  }

  async endorseProposal(user: AuthenticatedUser, id: string) {
    validateUuid(id, 'id');

    return await this.repository.executeInTransaction(async (tx: any) => {
      const proposal = await tx.jointProposal.findUnique({
        where: { id },
        include: { participants: true },
      });
      if (!proposal) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Proposal not found' } });
      }

      const opportunity = await tx.researchOpportunity.findUnique({
        where: { id: proposal.opportunityId },
      });
      if (!opportunity) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
      }

      if (opportunity.state !== 'PUBLISHED') {
        throw new BadRequestException({
          error: { code: 'INVALID_STATE', message: 'Cannot endorse proposal: opportunity is not PUBLISHED' },
        });
      }

      const immutableStates = ['SUBMITTED', 'ELIGIBLE', 'INELIGIBLE', 'APPROVED', 'REJECTED'];
      if (immutableStates.includes(proposal.state)) {
        throw new BadRequestException({
          error: { code: 'INVALID_STATE', message: 'Cannot endorse proposal: already SUBMITTED or decided' },
        });
      }

      const vnParticipant = proposal.participants.find((p: any) => p.country === 'VN');
      const ruParticipant = proposal.participants.find((p: any) => p.country === 'RU');

      if (user.activeContext?.contextType !== 'ORGANIZATION') {
        throw new ForbiddenException({
          error: { code: 'FORBIDDEN', message: 'Endorsement requires ORGANIZATION context type' },
        });
      }

      const isVnOrg = user.activeContext?.contextId === vnParticipant?.organizationRef;
      const isRuOrg = user.activeContext?.contextId === ruParticipant?.organizationRef;

      if (!isVnOrg && !isRuOrg) {
        throw new ForbiddenException({
          error: { code: 'FORBIDDEN', message: 'Organization context does not match any participant organization' },
        });
      }

      const country = isVnOrg ? 'VN' : 'RU';
      const organizationRef = isVnOrg ? vnParticipant!.organizationRef : ruParticipant!.organizationRef;

      await tx.organizationEndorsement.upsert({
        where: {
          proposalId_country: {
            proposalId: id,
            country,
          },
        },
        create: {
          proposalId: id,
          organizationRef,
          country,
          endorsed: true,
          endorsedAt: new Date(),
        },
        update: {
          endorsed: true,
          endorsedAt: new Date(),
        },
      });

      return await tx.jointProposal.findUnique({
        where: { id },
        include: {
          participants: true,
          confirmations: true,
          endorsements: true,
        },
      });
    });
  }

  async submitProposal(user: AuthenticatedUser, id: string) {
    validateUuid(id, 'id');

    return await this.repository.executeInTransaction(async (tx: any) => {
      const proposal = await tx.jointProposal.findUnique({
        where: { id },
        include: { participants: true, confirmations: true, endorsements: true },
      });
      if (!proposal) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Proposal not found' } });
      }

      const opportunity = await tx.researchOpportunity.findUnique({
        where: { id: proposal.opportunityId },
      });
      if (!opportunity) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
      }

      const vnParticipant = proposal.participants.find((p: any) => p.country === 'VN');
      const ruParticipant = proposal.participants.find((p: any) => p.country === 'RU');

      const isVn = user.userId === vnParticipant?.userId;
      const isRu = user.userId === ruParticipant?.userId;

      if (!isVn && !isRu) {
        throw new ForbiddenException({
          error: { code: 'FORBIDDEN', message: 'Only participants may submit proposal' },
        });
      }

      const targetOrgRef = isVn ? vnParticipant?.organizationRef : ruParticipant?.organizationRef;
      if (user.activeContext?.contextId !== targetOrgRef) {
        throw new ForbiddenException({
          error: { code: 'FORBIDDEN', message: 'Caller context ID must match their participant organizationRef' },
        });
      }

      const vnConfirmation = proposal.confirmations.find(
        (c: any) => c.participantId === vnParticipant?.userId && c.confirmed,
      );
      const ruConfirmation = proposal.confirmations.find(
        (c: any) => c.participantId === ruParticipant?.userId && c.confirmed,
      );

      const vnEndorsement = proposal.endorsements.find(
        (e: any) => e.organizationRef === vnParticipant?.organizationRef && e.endorsed,
      );
      const ruEndorsement = proposal.endorsements.find(
        (e: any) => e.organizationRef === ruParticipant?.organizationRef && e.endorsed,
      );

      if (!vnConfirmation || !ruConfirmation) {
        throw new BadRequestException({
          error: { code: 'MISSING_CONFIRMATION', message: 'Cannot submit: missing paired confirmations' },
        });
      }

      if (!vnEndorsement || !ruEndorsement) {
        throw new BadRequestException({
          error: { code: 'MISSING_ENDORSEMENT', message: 'Cannot submit: missing paired organization endorsements' },
        });
      }

      const mappedOpportunity = { id: opportunity.id, state: opportunity.state as any };
      const mappedProposal = {
        id: proposal.id,
        opportunityId: proposal.opportunityId,
        vnParticipantId: vnParticipant?.userId || '',
        ruParticipantId: ruParticipant?.userId || '',
        vnConfirmed: true,
        ruConfirmed: true,
        state: proposal.state as any,
        content: proposal.content,
        revision: proposal.revision,
      };

      let updatedDomain;
      try {
        updatedDomain = submitProposal(mappedProposal, mappedOpportunity);
      } catch (err: any) {
        throw new BadRequestException({ error: { code: 'INVALID_TRANSITION', message: err.message } });
      }

      const updatedProposal = await tx.jointProposal.update({
        where: { id },
        data: {
          state: updatedDomain.state,
        },
        include: {
          participants: true,
          confirmations: true,
          endorsements: true,
        },
      });

      await tx.outboxEvent.create({
        data: {
          eventType: 'collab.proposal.submitted',
          payload: JSON.stringify({
            proposalId: updatedProposal.id,
            opportunityId: updatedProposal.opportunityId,
            vnParticipantId: vnParticipant?.userId,
            ruParticipantId: ruParticipant?.userId,
            vnOrganizationRef: vnParticipant?.organizationRef,
            ruOrganizationRef: ruParticipant?.organizationRef,
            content: updatedProposal.content,
            revision: updatedProposal.revision,
            submittedAt: new Date().toISOString(),
          }),
        },
      });

      return updatedProposal;
    });
  }

  async screenProposal(user: AuthenticatedUser, id: string, dto: { eligible: boolean; reason: string }) {
    validateUuid(id, 'id');
    validateString(dto.reason, 'reason');

    return await this.repository.executeInTransaction(async (tx: any) => {
      const proposal = await tx.jointProposal.findUnique({
        where: { id },
      });
      if (!proposal) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Proposal not found' } });
      }

      const opportunity = await tx.researchOpportunity.findUnique({
        where: { id: proposal.opportunityId },
      });
      if (!opportunity) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
      }

      if (proposal.state !== 'SUBMITTED') {
        throw new BadRequestException({
          error: { code: 'INVALID_STATE', message: 'Only SUBMITTED proposals can be screened' },
        });
      }

      const targetState = dto.eligible ? 'ELIGIBLE' : 'INELIGIBLE';

      await tx.proposalScreening.create({
        data: {
          proposalId: id,
          eligible: dto.eligible,
          reason: dto.reason.trim(),
          screenedBy: user.userId,
        },
      });

      return await tx.jointProposal.update({
        where: { id },
        data: {
          state: targetState,
        },
        include: {
          participants: true,
          confirmations: true,
          endorsements: true,
          screenings: true,
        },
      });
    });
  }

  async decisionProposal(
    user: AuthenticatedUser,
    id: string,
    dto: { approved: boolean; reason: string; requestRevision?: boolean },
  ) {
    validateUuid(id, 'id');
    validateString(dto.reason, 'reason');

    return await this.repository.executeInTransaction(async (tx: any) => {
      const proposal = await tx.jointProposal.findUnique({
        where: { id },
      });
      if (!proposal) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Proposal not found' } });
      }

      const opportunity = await tx.researchOpportunity.findUnique({
        where: { id: proposal.opportunityId },
      });
      if (!opportunity) {
        throw new NotFoundException({ error: { code: 'NOT_FOUND', message: 'Opportunity not found' } });
      }

      if (proposal.state !== 'ELIGIBLE') {
        throw new BadRequestException({
          error: { code: 'INVALID_STATE', message: 'Collaboration decision is only allowed for ELIGIBLE proposals' },
        });
      }

      let targetState = 'REJECTED';
      if (dto.approved) {
        targetState = 'APPROVED';
      } else if (dto.requestRevision) {
        targetState = 'REVISION_REQUESTED';
      }

      await tx.collaborationDecision.create({
        data: {
          proposalId: id,
          approved: dto.approved,
          reason: dto.reason.trim(),
          decidedBy: user.userId,
        },
      });

      const updatedProposal = await tx.jointProposal.update({
        where: { id },
        data: {
          state: targetState,
        },
        include: {
          participants: true,
          confirmations: true,
          endorsements: true,
          screenings: true,
          decisions: true,
        },
      });

      if (targetState === 'APPROVED') {
        await tx.outboxEvent.create({
          data: {
            eventType: 'collab.decision.approved',
            payload: JSON.stringify({
              proposalId: updatedProposal.id,
              opportunityId: updatedProposal.opportunityId,
              approvedAt: new Date().toISOString(),
              reason: dto.reason.trim(),
              decidedBy: user.userId,
            }),
          },
        });
      }

      return updatedProposal;
    });
  }
}
