export type OpportunityState = "DRAFT" | "PUBLISHED" | "CLOSED";

export interface ResearchOpportunity {
  id: string;
  title: string;
  description?: string | null;
  state: OpportunityState;
  createdAt: string;
  updatedAt: string;
}

export type ProposalState =
  | "DRAFT"
  | "PAIRED_CONFIRMED"
  | "ENDORSED"
  | "SUBMITTED"
  | "SCREENED_ELIGIBLE"
  | "SCREENED_INELIGIBLE"
  | "DECIDED_ACCEPTED"
  | "DECIDED_REJECTED";

export interface ProposalParticipant {
  userId: string;
  organizationRef: string;
  confirmedAt?: string | null;
  endorsedAt?: string | null;
}

export interface CollaborationProposal {
  id: string;
  opportunityId: string;
  content: string;
  revisionNumber: number;
  state: ProposalState;
  vnParticipant: ProposalParticipant;
  ruParticipant: ProposalParticipant;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProposalParticipant {
  userId: string;
  organizationRef: string;
}

export interface CreateProposalInput {
  id?: string;
  opportunityId: string;
  content: string;
  vnParticipant: CreateProposalParticipant;
  ruParticipant: CreateProposalParticipant;
}

export interface CollaborationDecision {
  id: string;
  proposalId: string;
  decision: "ACCEPTED" | "REJECTED";
  rationale: string;
  issuedAt: string;
}
