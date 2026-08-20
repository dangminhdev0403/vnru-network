// Re-export shared envelope types from knowledge module; expert-specific additions below.
import type { DiscoverySuccess, DiscoveryError, DiscoveryResult } from "../knowledge/types";
export type { DiscoverySuccess, DiscoveryError, DiscoveryResult };

// Matches the PublicExpert shape from knowledge/types but kept local to avoid coupling detail pages to the knowledge feature.
export type { PublicExpert } from "../knowledge/types";

/** Single expert detail (same shape as list item — backend returns identical projection). */
export type ExpertDetail = {
  id: string;
  displayName: string;
  bio: string | null;
  country: string;
  language: string | null;
  visibility: "PUBLIC";
  organization: { id: string; name: string; country: string };
  expertises: Array<{ id: string; slug: string; labels: Record<string, string> }>;
};

/** A partner suggestion from GET /api/v1/experts/:id/matches */
export type ExpertMatch = {
  expert: ExpertDetail;
  reasons: Array<{ id: string; slug: string; labels: Record<string, string> }>;
};

export type ExpertDetailResult =
  | { status: "success"; expert: ExpertDetail }
  | { status: "error"; kind: "not_found" | "integration"; message: string };

export type ExpertMatchesResult =
  | { status: "success"; items: ExpertMatch[] }
  | { status: "error"; kind: "integration"; message: string };
