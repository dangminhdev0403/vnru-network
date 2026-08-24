export type WorkflowRole =
  | "RESEARCHER"
  | "REVIEWER"
  | "ORGANIZATION_REPRESENTATIVE"
  | "COLLABORATION_MANAGER"
  | "FOUNDATION_DECISION_MAKER";

export type ProposalState =
  | "DRAFT"
  | "WAITING_PARTNER"
  | "WAITING_ORG_CONFIRMATION"
  | "SUBMITTED"
  | "NEEDS_INFO"
  | "ELIGIBLE"
  | "NOT_ELIGIBLE"
  | "IN_REVIEW"
  | "REVISION"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN"
  | "CANCELLED";

export type ReviewState =
  | "UNASSIGNED"
  | "ASSIGNED"
  | "NEW"
  | "IN_REVIEW"
  | "DRAFT"
  | "OVERDUE"
  | "CONFLICT"
  | "SUBMITTED"
  | "CANCELLED";

export type DecisionState = "PENDING" | "REVISION" | "APPROVED" | "REJECTED";
export type ProjectState = "PLANNED" | "ACTIVE" | "AT_RISK" | "BLOCKED" | "COMPLETED" | "CANCELLED";
export type MilestoneState = "TODO" | "IN_PROGRESS" | "DONE" | "OVERDUE";

export type Proposal = {
  id: string;
  code: string;
  title: string;
  field: string;
  vnOrg: string;
  ruOrg: string;
  vnPi: string;
  ruPi: string;
  state: ProposalState;
  deadline: string;
  updatedAt: string;
  readiness: number;
  missing?: string[];
  note?: string;
};

export type ReviewAssignment = {
  id: string;
  proposalId: string;
  code: string;
  title: string;
  field: string;
  reviewer: string | null;
  deadline: string;
  state: ReviewState;
  conflict?: boolean;
  score?: number;
  comment?: string;
  savedAt?: string;
};

export type Decision = {
  id: string;
  proposalId: string;
  code: string;
  title: string;
  organizations: string;
  score: number;
  state: DecisionState;
  rationale?: string;
  decidedAt?: string;
};

export type Milestone = {
  id: string;
  title: string;
  due: string;
  state: MilestoneState;
};

export type Project = {
  id: string;
  proposalId: string;
  code: string;
  title: string;
  partner: string;
  state: ProjectState;
  progress: number;
  next: string;
  milestones: Milestone[];
};

export type Opportunity = {
  id: string;
  code: string;
  title: string;
  field: string;
  closes: string;
  state: "DRAFT" | "PUBLISHED" | "CLOSED";
};

export type ReportItem = {
  id: string;
  projectId: string;
  code: string;
  title: string;
  period: string;
  progress: number;
  state: "DRAFT" | "SUBMITTED" | "PENDING" | "RETURNED" | "APPROVED" | "OVERDUE";
};

export type OrganizationEndorsement = {
  id: string;
  proposalId: string;
  code: string;
  title: string;
  lead: string;
  partnerOrg: string;
  facilities: string;
  state: "PENDING" | "NEEDS_INFO" | "ENDORSED" | "DECLINED";
  deadline: string;
};

export type WorkflowNotification = {
  id: string;
  role: WorkflowRole;
  title: string;
  message: string;
  href: string;
  read: boolean;
  createdAt: string;
  tone?: "info" | "warning" | "success" | "danger";
};

export type ActivityItem = {
  id: string;
  entityId: string;
  entityType: "proposal" | "review" | "decision" | "project" | "organization" | "opportunity" | "report";
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
};
