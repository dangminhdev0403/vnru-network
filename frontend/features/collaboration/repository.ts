import type {
  ResearchOpportunity,
  CollaborationProposal,
  CreateProposalInput,
} from "./types";

export class CollabApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "CollabApiError";
  }
}

export function getApiErrorMessage(
  payload: unknown,
  fallback: string = "Request failed",
): string {
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

export interface ListOpportunitiesResult {
  data: ResearchOpportunity[];
  nextCursor?: string | null;
}

export async function listOpportunities(
  cursor?: string,
  limit: number = 20,
): Promise<ListOpportunitiesResult> {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) {
    params.set("cursor", cursor);
  }

  const res = await fetch(`/api/collab/opportunities?${params.toString()}`, {
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new CollabApiError(
      res.status,
      getApiErrorMessage(err, "Failed to load opportunities"),
    );
  }

  const json = await res.json();
  if (Array.isArray(json)) {
    return { data: json };
  }
  return {
    data: json.data || [],
    nextCursor: json.nextCursor,
  };
}

export async function createOpportunity(input: {
  id?: string;
  title: string;
  description?: string;
}): Promise<ResearchOpportunity> {
  const payload = {
    id: input.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined),
    title: input.title,
    ...(input.description ? { description: input.description } : {}),
  };

  const res = await fetch("/api/collab/opportunities", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new CollabApiError(
      res.status,
      getApiErrorMessage(err, "Create opportunity failed"),
    );
  }

  return res.json();
}

export async function getProposalById(
  id: string,
): Promise<CollaborationProposal> {
  const res = await fetch(`/api/collab/proposals/${encodeURIComponent(id)}`, {
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new CollabApiError(
      res.status,
      getApiErrorMessage(err, "Failed to load proposal"),
    );
  }

  return res.json();
}

export async function createProposal(
  input: CreateProposalInput,
): Promise<CollaborationProposal> {
  const payload = {
    id: input.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined),
    opportunityId: input.opportunityId,
    content: input.content,
    vnParticipant: input.vnParticipant,
    ruParticipant: input.ruParticipant,
  };

  const res = await fetch("/api/collab/proposals", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new CollabApiError(
      res.status,
      getApiErrorMessage(err, "Create proposal failed"),
    );
  }

  return res.json();
}
