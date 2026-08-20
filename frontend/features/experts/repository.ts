import type { DiscoveryResult, ExpertDetailResult, ExpertMatchesResult, PublicExpert, ExpertDetail, ExpertMatch } from "./types";


type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isExpert = (v: unknown): v is ExpertDetail => isObject(v) && v.visibility === "PUBLIC" && typeof v.id === "string" && typeof v.displayName === "string" && isObject(v.organization) && typeof v.organization.id === "string" && typeof v.organization.name === "string" && typeof v.organization.country === "string" && Array.isArray(v.expertises) && v.expertises.every((x) => isObject(x) && typeof x.id === "string" && typeof x.slug === "string" && isObject(x.labels) && Object.values(x.labels).every((label) => typeof label === "string"));
const isMatch = (v: unknown): v is ExpertMatch => isObject(v) && isExpert(v.expert) && Array.isArray(v.reasons) && v.reasons.every((r) => isObject(r) && typeof r.id === "string" && typeof r.slug === "string" && isObject(r.labels) && Object.values(r.labels).every((label) => typeof label === "string"));

function serviceUrl(path: string): string | null {
  const base = process.env.ORGANIZATION_SERVICE_URL;
  if (!base) return null;
  return new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
}

/** Reuse the exact envelope parsing from the knowledge module's fetchDiscoverySection. */
export async function getExperts(
  query: Record<string, string | undefined> = {},
  fetcher: Fetcher = fetch
): Promise<DiscoveryResult<PublicExpert>> {
  const url = serviceUrl("api/v1/experts");
  if (!url) return { status: "error", kind: "integration", message: "Expert service unavailable" };
  try {
    const u = new URL(url);
    for (const [k, v] of Object.entries(query)) if (v) u.searchParams.set(k, v);
    const res = await fetcher(u.toString(), { cache: "no-store", headers: { accept: "application/json" } });
    if (!res.ok) return { status: "error", kind: "integration", message: "Expert service unavailable" };
    const body: unknown = await res.json();
    if (!body || typeof body !== "object") throw new Error("bad");
    const envelope = body as { items?: unknown; nextCursor?: unknown };
    if (!Array.isArray(envelope.items) || !envelope.items.every(isExpert)) throw new Error("bad");
    return { status: "success", items: envelope.items as PublicExpert[], nextCursor: typeof envelope.nextCursor === "string" ? envelope.nextCursor : null };
  } catch { return { status: "error", kind: "integration", message: "Expert service unavailable" }; }
}

export async function getExpertById(
  id: string,
  fetcher: Fetcher = fetch
): Promise<ExpertDetailResult> {
  const url = serviceUrl(`api/v1/experts/${encodeURIComponent(id)}`);
  if (!url) return { status: "error", kind: "integration", message: "Expert service unavailable" };
  try {
    const res = await fetcher(url, { cache: "no-store", headers: { accept: "application/json" } });
    if (res.status === 404) return { status: "error", kind: "not_found", message: "Expert not found" };
    if (!res.ok) return { status: "error", kind: "integration", message: "Expert service unavailable" };
    const expert: unknown = await res.json();
    if (!isExpert(expert)) throw new Error("bad");
    return { status: "success", expert };
  } catch { return { status: "error", kind: "integration", message: "Expert service unavailable" }; }
}

export async function getExpertMatches(
  id: string,
  fetcher: Fetcher = fetch
): Promise<ExpertMatchesResult> {
  const url = serviceUrl(`api/v1/experts/${encodeURIComponent(id)}/matches`);
  if (!url) return { status: "error", kind: "integration", message: "Expert service unavailable" };
  try {
    const res = await fetcher(url, { cache: "no-store", headers: { accept: "application/json" } });
    if (!res.ok) return { status: "error", kind: "integration", message: "Matching service unavailable" };
    const body: unknown = await res.json();
    if (!body || typeof body !== "object" || !Array.isArray((body as { items?: unknown }).items) || !(body as { items: unknown[] }).items.every(isMatch)) {
      throw new Error("bad");
    }
    return { status: "success", items: (body as { items: ExpertMatch[] }).items };
  } catch { return { status: "error", kind: "integration", message: "Matching service unavailable" }; }
}
