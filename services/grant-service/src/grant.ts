export type OpportunityState = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface FundingOpportunity {
  readonly id: string;
  readonly state: OpportunityState;
}

export type ProposalState = 'DRAFT' | 'PAIRED_CONFIRMED' | 'SUBMITTED';

export interface JointProposal {
  readonly id: string;
  readonly opportunityId: string;
  readonly vnParticipantId: string;
  readonly ruParticipantId: string;
  readonly vnConfirmed: boolean;
  readonly ruConfirmed: boolean;
  readonly state: ProposalState;
  readonly content: string;
  readonly revision: number;
}

/**
 * Creates a new FundingOpportunity in DRAFT state.
 */
export function createOpportunity(id: string): FundingOpportunity {
  if (!id.trim()) {
    throw new Error('Opportunity ID is required');
  }
  return Object.freeze({
    id,
    state: 'DRAFT',
  });
}

/**
 * Transitions FundingOpportunity state from DRAFT to PUBLISHED.
 */
export function publishOpportunity(opportunity: FundingOpportunity): FundingOpportunity {
  if (opportunity.state !== 'DRAFT') {
    throw new Error(`Invalid opportunity transition from ${opportunity.state} to PUBLISHED`);
  }
  return Object.freeze({
    ...opportunity,
    state: 'PUBLISHED',
  });
}

/**
 * Transitions FundingOpportunity state from PUBLISHED to CLOSED.
 */
export function closeOpportunity(opportunity: FundingOpportunity): FundingOpportunity {
  if (opportunity.state !== 'PUBLISHED') {
    throw new Error(`Invalid opportunity transition from ${opportunity.state} to CLOSED`);
  }
  return Object.freeze({
    ...opportunity,
    state: 'CLOSED',
  });
}

/**
 * Creates a new JointProposal in DRAFT state.
 * Can only create proposal for a PUBLISHED opportunity.
 */
export function createProposal(
  id: string,
  opportunity: FundingOpportunity,
  vnParticipantId: string,
  ruParticipantId: string,
  content: string
): JointProposal {
  if (!id.trim()) {
    throw new Error('Proposal ID is required');
  }
  if (!vnParticipantId.trim() || !ruParticipantId.trim()) {
    throw new Error('Both VN and RU participant IDs are required');
  }
  if (vnParticipantId === ruParticipantId) {
    throw new Error('VN and RU participants must be different users');
  }
  if (!content.trim()) {
    throw new Error('Proposal content is required');
  }
  if (opportunity.state !== 'PUBLISHED') {
    throw new Error('Cannot create proposal for an opportunity that is not PUBLISHED');
  }
  return Object.freeze({
    id,
    opportunityId: opportunity.id,
    vnParticipantId,
    ruParticipantId,
    vnConfirmed: false,
    ruConfirmed: false,
    state: 'DRAFT',
    content,
    revision: 1,
  });
}

/**
 * Confirms the proposal from a specific participant.
 * Only the exact VN or RU participant may confirm their own side.
 * Both confirmations automatically yield PAIRED_CONFIRMED.
 * Fails closed if opportunity is not PUBLISHED or proposal is already SUBMITTED.
 */
export function confirmProposal(
  proposal: JointProposal,
  opportunity: FundingOpportunity,
  participantId: string
): JointProposal {
  if (opportunity.id !== proposal.opportunityId) {
    throw new Error('Opportunity ID mismatch');
  }
  if (opportunity.state !== 'PUBLISHED') {
    throw new Error('Cannot confirm proposal: opportunity is not PUBLISHED');
  }
  if (proposal.state === 'SUBMITTED') {
    throw new Error('Cannot confirm proposal: already SUBMITTED');
  }
  if (participantId !== proposal.vnParticipantId && participantId !== proposal.ruParticipantId) {
    throw new Error('Invalid participant: not registered for this joint proposal');
  }

  let vnConfirmed = proposal.vnConfirmed;
  let ruConfirmed = proposal.ruConfirmed;

  if (participantId === proposal.vnParticipantId) {
    vnConfirmed = true;
  }
  if (participantId === proposal.ruParticipantId) {
    ruConfirmed = true;
  }

  const state = (vnConfirmed && ruConfirmed) ? 'PAIRED_CONFIRMED' : 'DRAFT';

  return Object.freeze({
    ...proposal,
    vnConfirmed,
    ruConfirmed,
    state,
  });
}

/**
 * Revises the proposal content.
 * Increments revision and invalidates both confirmations (reverts to DRAFT).
 * Only allowed when proposal is editable (not SUBMITTED) and opportunity is PUBLISHED.
 * Enforces optimistic concurrency control using expectedRevision.
 */
export function reviseProposal(
  proposal: JointProposal,
  opportunity: FundingOpportunity,
  newContent: string,
  expectedRevision: number
): JointProposal {
  if (opportunity.id !== proposal.opportunityId) {
    throw new Error('Opportunity ID mismatch');
  }
  if (opportunity.state !== 'PUBLISHED') {
    throw new Error('Cannot revise proposal: opportunity is not PUBLISHED');
  }
  if (proposal.state === 'SUBMITTED') {
    throw new Error('Cannot revise proposal: already SUBMITTED');
  }
  if (!Number.isInteger(expectedRevision) || expectedRevision < 1) {
    throw new Error('Expected revision must be a positive integer');
  }
  if (proposal.revision !== expectedRevision) {
    throw new Error(`Concurrency conflict: expected revision ${expectedRevision} but got ${proposal.revision}`);
  }
  if (!newContent.trim()) {
    throw new Error('Proposal content is required');
  }

  return Object.freeze({
    ...proposal,
    content: newContent,
    vnConfirmed: false,
    ruConfirmed: false,
    state: 'DRAFT',
    revision: proposal.revision + 1,
  });
}

/**
 * Submits the proposal.
 * Submission is only allowed from PAIRED_CONFIRMED state and produces SUBMITTED.
 * Submitted proposals are immutable.
 */
export function submitProposal(proposal: JointProposal, opportunity: FundingOpportunity): JointProposal {
  if (opportunity.id !== proposal.opportunityId) {
    throw new Error('Opportunity ID mismatch');
  }
  if (opportunity.state !== 'PUBLISHED') {
    throw new Error('Cannot submit proposal: opportunity is not PUBLISHED');
  }
  if (proposal.state !== 'PAIRED_CONFIRMED') {
    throw new Error('Cannot submit proposal: must be in PAIRED_CONFIRMED state');
  }

  return Object.freeze({
    ...proposal,
    state: 'SUBMITTED',
  });
}
