export type ProjectStatus = "ACTIVE" | "COMPLETED" | "TERMINATED";
export type WorkStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REVISION_REQUESTED";

export interface ProjectMember { id: string; userId: string; role: "LEAD" | "MEMBER" }
export interface Deliverable { id?: string; title: string; description?: string | null; url?: string | null }
export interface Milestone { id: string; title: string; description?: string | null; dueDate: string; status: WorkStatus; expectedVersion: number; deliverables: Deliverable[] }
export interface ProgressReport { id: string; milestoneId?: string | null; title: string; content: string; status: WorkStatus; expectedVersion: number }
export interface ProjectOutcome { id: string; outcomeType: string; outcomeRef: string }
export interface Project {
  id: string;
  proposalRef: string;
  decisionRef: string;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  expectedVersion: number;
  members: ProjectMember[];
  milestones: Milestone[];
  reports: ProgressReport[];
  outcomes: ProjectOutcome[];
}
export interface ProjectList { items: Project[]; nextCursor: string | null }
export interface BootstrapProjectInput { decisionRef: string; proposalRef: string; title: string; description?: string; leadId: string; approved: true }
export interface AddMemberInput { userId: string; role: "LEAD" | "MEMBER" }
export interface CreateMilestoneInput { title: string; description?: string; dueDate: string; deliverables?: Deliverable[] }
export interface UpdateMilestoneInput { title?: string; description?: string; dueDate?: string; deliverables?: Deliverable[]; expectedVersion: number }
export interface CreateReportInput { milestoneId?: string; title: string; content: string }
export interface UpdateReportInput { title?: string; content?: string; expectedVersion: number }
export interface SubmitInput { expectedVersion: number }
export interface ReviewInput extends SubmitInput { approved: boolean; feedback?: string }
export interface OutcomeInput { outcomeType: string; outcomeRef: string }
export interface TerminateInput extends SubmitInput { reason: string }
