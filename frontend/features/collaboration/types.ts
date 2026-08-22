export type OpportunityStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type ProposalStatus =
  | "DRAFT"
  | "COUNTERPART_PENDING"
  | "COUNTERPART_CONFIRMED"
  | "ENDORSED"
  | "SUBMITTED"
  | "SCREENING"
  | "ELIGIBLE"
  | "INELIGIBLE"
  | "IN_REVIEW"
  | "REVIEWED"
  | "ACCEPTED"
  | "REJECTED";

export interface ResearchOpportunity {
  id: string;
  code: string;
  title: string;
  description: string;
  status: OpportunityStatus;
  openDate: string;
  closeDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationProposal {
  id: string;
  opportunityRef: string;
  title: string;
  summary: string;
  leadResearcherId: string;
  counterpartResearcherId: string;
  leadOrganizationRef: string;
  counterpartOrganizationRef: string;
  counterpartConfirmed: boolean;
  leadEndorsed: boolean;
  counterpartEndorsed: boolean;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationDecision {
  id: string;
  proposalRef: string;
  foundationId: string;
  decision: "ACCEPTED" | "REJECTED";
  rationale: string;
  issuedAt: string;
}
