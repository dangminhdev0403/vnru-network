import type { AssignmentList, CreateReviewAssignmentInput, EvaluationInput, EvaluationRecommendation, ReviewAssignment } from "./types";

export class ReviewApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ReviewApiError";
  }
}

function getApiErrorMessage(payload: unknown, fallback = "Request failed"): string {
  if (!payload || typeof payload !== "object") return fallback;
  const p = payload as Record<string, unknown>;
  if (typeof p.error === "string") return p.error;
  if (p.error && typeof p.error === "object") {
    const errObj = p.error as Record<string, unknown>;
    if (typeof errObj.message === "string") return errObj.message;
  }
  if (typeof p.message === "string") return p.message;
  return fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/reviews${path}`, {
    ...options,
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new ReviewApiError(res.status, getApiErrorMessage(err));
  }
  return res.json();
}

export const reviewRepository = {
  async createAssignment(input: CreateReviewAssignmentInput) {
    return request<ReviewAssignment>("/assignments", { method: "POST", body: JSON.stringify(input) });
  },
  async listAssignments(offset = 0, limit = 20, signal?: AbortSignal) {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    return request<AssignmentList>(`/assignments?${params.toString()}`, { signal });
  },
  async getAssignmentDetail(id: string, signal?: AbortSignal) {
    return request<ReviewAssignment>(`/assignments/${encodeURIComponent(id)}`, { signal });
  },
  async declareConflict(id: string, declaration: 'CONFLICT' | 'NO_CONFLICT') {
    return request<ReviewAssignment>(`/assignments/${encodeURIComponent(id)}/conflict`, { method: "POST", body: JSON.stringify({ declaration }) });
  },
  async saveEvaluation(id: string, evaluation: EvaluationInput) {
    return request<ReviewAssignment>(`/assignments/${encodeURIComponent(id)}/evaluation/save`, { method: "POST", body: JSON.stringify(evaluation) });
  },
  async submitEvaluation(id: string, evaluation: Required<EvaluationInput>) {
    return request<ReviewAssignment>(`/assignments/${encodeURIComponent(id)}/evaluation/submit`, { method: "POST", body: JSON.stringify(evaluation) });
  },
  async getRecommendation(proposalRef: string, signal?: AbortSignal) {
    return request<EvaluationRecommendation>(`/proposals/${encodeURIComponent(proposalRef)}/recommendation`, { signal });
  }
};
