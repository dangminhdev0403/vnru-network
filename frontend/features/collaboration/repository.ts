import type { ResearchOpportunity, CollaborationProposal } from "./types";

export class CollabApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "CollabApiError";
  }
}

export async function listOpportunities(): Promise<ResearchOpportunity[]> {
  const res = await fetch("/api/collab/opportunities", {
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new CollabApiError(res.status, "Failed to load opportunities");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.items || [];
}

export async function createOpportunity(input: {
  code: string;
  title: string;
  description: string;
  openDate: string;
  closeDate: string;
}): Promise<ResearchOpportunity> {
  const res = await fetch("/api/collab/opportunities", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Create opportunity failed" }));
    throw new CollabApiError(res.status, err.error || "Create opportunity failed");
  }
  return res.json();
}

export async function getProposalById(id: string): Promise<CollaborationProposal> {
  const res = await fetch(`/api/collab/proposals/${encodeURIComponent(id)}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new CollabApiError(res.status, "Failed to load proposal");
  }
  return res.json();
}

export async function createProposal(input: {
  opportunityRef: string;
  title: string;
  summary: string;
  leadResearcherId: string;
  counterpartResearcherId: string;
  leadOrganizationRef: string;
  counterpartOrganizationRef: string;
}): Promise<CollaborationProposal> {
  const res = await fetch("/api/collab/proposals", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Create proposal failed" }));
    throw new CollabApiError(res.status, err.error || "Create proposal failed");
  }
  return res.json();
}
