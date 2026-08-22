import type {
  ResearchOpportunity,
  CollaborationProposal,
  CreateProposalInput,
} from "./types";

export class CollabApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "CollabApiError";
  }
}

export function getApiErrorMessage(payload: unknown, fallback = "Request failed"): string {
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
  const res = await fetch(`/api/collab${path}`, {
    ...options,
    headers: {
      accept: "application/json",
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new CollabApiError(res.status, getApiErrorMessage(err));
  }
  return res.json();
}

export interface ListOpportunitiesResult {
  items: ResearchOpportunity[];
  nextCursor?: string | null;
}

export const collabRepository = {
  async listOpportunities(cursor?: string, limit = 20, signal?: AbortSignal): Promise<ListOpportunitiesResult> {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);
    return request<ListOpportunitiesResult>(`/opportunities?${params.toString()}`, { signal });
  },

  async createOpportunity(input: { id?: string; title: string; description?: string }): Promise<ResearchOpportunity> {
    const payload = {
      id: input.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined),
      title: input.title,
      description: input.description,
    };
    return request<ResearchOpportunity>("/opportunities", { method: "POST", body: JSON.stringify(payload) });
  },

  async publishOpportunity(id: string): Promise<ResearchOpportunity> {
    return request<ResearchOpportunity>(`/opportunities/${encodeURIComponent(id)}/publish`, { method: "POST" });
  },

  async closeOpportunity(id: string): Promise<ResearchOpportunity> {
    return request<ResearchOpportunity>(`/opportunities/${encodeURIComponent(id)}/close`, { method: "POST" });
  },

  async getProposal(id: string, signal?: AbortSignal): Promise<CollaborationProposal> {
    return request<CollaborationProposal>(`/proposals/${encodeURIComponent(id)}`, { signal });
  },

  async createProposal(input: CreateProposalInput): Promise<CollaborationProposal> {
    const payload = {
      id: input.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined),
      opportunityId: input.opportunityId,
      content: input.content,
      vnParticipant: input.vnParticipant,
      ruParticipant: input.ruParticipant,
    };
    return request<CollaborationProposal>("/proposals", { method: "POST", body: JSON.stringify(payload) });
  },

  async reviseProposal(id: string, input: { content: string; expectedRevision: number }): Promise<CollaborationProposal> {
    return request<CollaborationProposal>(`/proposals/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(input) });
  },

  async confirmProposal(id: string): Promise<CollaborationProposal> {
    return request<CollaborationProposal>(`/proposals/${encodeURIComponent(id)}/confirm`, { method: "POST" });
  },

  async endorseProposal(id: string): Promise<CollaborationProposal> {
    return request<CollaborationProposal>(`/proposals/${encodeURIComponent(id)}/endorse`, { method: "POST" });
  },

  async submitProposal(id: string): Promise<CollaborationProposal> {
    return request<CollaborationProposal>(`/proposals/${encodeURIComponent(id)}/submit`, { method: "POST" });
  },

  async screenProposal(id: string, input: { eligible: boolean; reason?: string }): Promise<CollaborationProposal> {
    return request<CollaborationProposal>(`/proposals/${encodeURIComponent(id)}/screen`, { method: "POST", body: JSON.stringify(input) });
  },

  async decisionProposal(id: string, input: { approved: boolean; reason?: string; requestRevision?: boolean }): Promise<CollaborationProposal> {
    return request<CollaborationProposal>(`/proposals/${encodeURIComponent(id)}/decision`, { method: "POST", body: JSON.stringify(input) });
  }
};
