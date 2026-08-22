import type {
  AddMemberInput,
  CreateMilestoneInput,
  CreateReportInput,
  OutcomeInput,
  Project,
  ProjectList,
  ProjectMember,
  ReviewInput,
  SubmitInput,
  TerminateInput,
  UpdateMilestoneInput,
  UpdateReportInput,
} from "./types";

export class ProjectApiError extends Error {
  constructor(public status: number, message: string) { super(message); this.name = "ProjectApiError"; }
}

function message(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "Request failed";
  const value = payload as Record<string, unknown>;
  if (typeof value.message === "string") return value.message;
  if (value.error && typeof value.error === "object" && typeof (value.error as Record<string, unknown>).message === "string") return (value.error as Record<string, string>).message;
  return "Request failed";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/projects${path}`, { ...options, headers: { accept: "application/json", ...(options.body ? { "content-type": "application/json" } : {}), ...options.headers } });
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new ProjectApiError(response.status, message(payload));
  return payload as T;
}

const body = (value: object): RequestInit => ({ method: "POST", body: JSON.stringify(value) });
export const projectRepository = {
  list: (signal?: AbortSignal) => request<ProjectList>("/", { signal }),
  getDetail: (id: string, signal?: AbortSignal) => request<Project>(`/${encodeURIComponent(id)}`, { signal }),
  getMembers: (id: string, signal?: AbortSignal) => request<ProjectMember[]>(`/${encodeURIComponent(id)}/members`, { signal }),
  addMember: (id: string, input: AddMemberInput) => request<ProjectMember>(`/${encodeURIComponent(id)}/members`, body(input)),
  createMilestone: (id: string, input: CreateMilestoneInput) => request<Project>(`/${encodeURIComponent(id)}/milestones`, body(input)),
  updateMilestone: (id: string, itemId: string, input: UpdateMilestoneInput) => request<Project>(`/${encodeURIComponent(id)}/milestones/${encodeURIComponent(itemId)}`, { method: "PATCH", body: JSON.stringify(input) }),
  submitMilestone: (id: string, itemId: string, input: SubmitInput) => request<Project>(`/${encodeURIComponent(id)}/milestones/${encodeURIComponent(itemId)}/submit`, body(input)),
  reviewMilestone: (id: string, itemId: string, input: ReviewInput) => request<Project>(`/${encodeURIComponent(id)}/milestones/${encodeURIComponent(itemId)}/review`, body(input)),
  createReport: (id: string, input: CreateReportInput) => request<Project>(`/${encodeURIComponent(id)}/reports`, body(input)),
  updateReport: (id: string, itemId: string, input: UpdateReportInput) => request<Project>(`/${encodeURIComponent(id)}/reports/${encodeURIComponent(itemId)}`, { method: "PATCH", body: JSON.stringify(input) }),
  submitReport: (id: string, itemId: string, input: SubmitInput) => request<Project>(`/${encodeURIComponent(id)}/reports/${encodeURIComponent(itemId)}/submit`, body(input)),
  reviewReport: (id: string, itemId: string, input: ReviewInput) => request<Project>(`/${encodeURIComponent(id)}/reports/${encodeURIComponent(itemId)}/review`, body(input)),
  addOutcome: (id: string, input: OutcomeInput) => request<Project>(`/${encodeURIComponent(id)}/outcomes`, body(input)),
  complete: (id: string, input: SubmitInput) => request<Project>(`/${encodeURIComponent(id)}/complete`, body(input)),
  terminate: (id: string, input: TerminateInput) => request<Project>(`/${encodeURIComponent(id)}/terminate`, body(input)),
};
