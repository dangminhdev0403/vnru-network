import { Inject, Injectable } from '@nestjs/common';
import { Country, OpportunityState, PrismaClient, ProposalState } from '../../generated/collaboration';

export const COLLAB_PRISMA = Symbol('COLLAB_PRISMA');

@Injectable()
export class GrantRepository {
  constructor(@Inject(COLLAB_PRISMA) private readonly prisma: PrismaClient) {}

  async findPublishedOpportunities(limit: number, cursor?: { id: string; createdAt: Date }) {
    return this.findOpportunities(limit, ['PUBLISHED'], cursor);
  }

  async findOpportunities(limit: number, states?: OpportunityState[], cursor?: { id: string; createdAt: Date }) {
    const filters: any[] = [];
    if (states && states.length > 0) {
      filters.push({ state: { in: states } });
    }
    if (cursor) {
      filters.push({
        OR: [
          { createdAt: { lt: cursor.createdAt } },
          { createdAt: cursor.createdAt, id: { lt: cursor.id } },
        ],
      });
    }
    return (this.prisma as any).researchOpportunity.findMany({
      where: filters.length > 0 ? { AND: filters } : {},
      take: limit,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }

  async createOpportunity(data: {
    id: string;
    title: string;
    description?: string;
    state: OpportunityState;
  }) {
    return (this.prisma as any).researchOpportunity.create({
      data: {
        id: data.id,
        title: data.title,
        description: data.description,
        state: data.state,
      },
    });
  }

  async updateOpportunityState(id: string, expectedState: OpportunityState, state: OpportunityState, eventType: string) {
    return this.prisma.$transaction(async (tx: any) => {
      const opportunity = await tx.researchOpportunity.update({ where: { id, state: expectedState }, data: { state } });
      await tx.outboxEvent.create({ data: { eventType, payload: JSON.stringify({ opportunityId: id, state }) } });
      return opportunity;
    });
  }

  async findOpportunityById(id: string) {
    return (this.prisma as any).researchOpportunity.findUnique({
      where: { id },
    });
  }

  async createProposal(data: {
    id: string;
    opportunityId: string;
    state: ProposalState;
    content: string;
    revision: number;
    participants: { userId: string; organizationRef: string; country: Country }[];
  }) {
    return this.prisma.jointProposal.create({
      data: {
        id: data.id,
        opportunityId: data.opportunityId,
        state: data.state,
        content: data.content,
        revision: data.revision,
        participants: {
          create: data.participants.map((p) => ({
            userId: p.userId,
            organizationRef: p.organizationRef,
            country: p.country,
          })),
        },
      },
      include: {
        participants: true,
        confirmations: true,
        endorsements: true,
      },
    });
  }

  async findProposalById(id: string) {
    return this.prisma.jointProposal.findUnique({
      where: { id },
      include: {
        participants: true,
        confirmations: true,
        endorsements: true,
        screenings: true,
        decisions: true,
      },
    });
  }

  async findApprovedDecision(decisionRef: string, proposalRef: string) {
    return this.prisma.collaborationDecision.findFirst({
      where: { id: decisionRef, proposalId: proposalRef, approved: true },
      select: { id: true },
    });
  }

  async executeInTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
