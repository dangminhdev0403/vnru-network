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
  | "SUBMITTED"
  | "ELIGIBLE"
  | "INELIGIBLE"
  | "APPROVED"
  | "REJECTED"
  | "REVISION_REQUESTED";

export interface ProposalParticipant {
  id?: string;
  userId: string;
  organizationRef: string;
  country: "VN" | "RU";
}

export interface ProposalConfirmation {
  participantId: string;
  confirmed: boolean;
  confirmedAt?: string | null;
}

export interface ProposalEndorsement {
  organizationRef: string;
  country: "VN" | "RU";
  endorsed: boolean;
  endorsedAt?: string | null;
}

export interface CollaborationProposal {
  id: string;
  opportunityId: string;
  content: string;
  revision: number;
  state: ProposalState;
  participants: ProposalParticipant[];
  confirmations: ProposalConfirmation[];
  endorsements: ProposalEndorsement[];
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
