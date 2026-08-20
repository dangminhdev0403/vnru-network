import type { PublicPublication, PublicPublicationDetail, DiscoveryResult, DetailResult } from "./types";


function serviceUrl(path: string): string | null {
  const base = process.env.KNOWLEDGE_SERVICE_URL;
  if (!base) return null;
  return new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
}

const ERR_UNAVAILABLE = { status: "error", kind: "integration", message: "Knowledge service unavailable" } as const;
const isPublication = (v: unknown): v is PublicPublication => !!v && typeof v === "object" && (v as Record<string, unknown>).visibility === "PUBLIC" && typeof (v as Record<string, unknown>).id === "string" && typeof (v as Record<string, unknown>).title === "string" && typeof (v as Record<string, unknown>).language === "string" && Array.isArray((v as Record<string, unknown>).authors) && Array.isArray((v as Record<string, unknown>).topics);


export async function getPublications(query: Record<string, string | undefined> = {}): Promise<DiscoveryResult<PublicPublication>> {
  const base = serviceUrl("api/v1/publications");
  if (!base) return ERR_UNAVAILABLE;
  try {
    const url = new URL(base);
    for (const [key, value] of Object.entries(query)) if (value) url.searchParams.set(key, value);
    const response = await fetch(url, { cache: "no-store", headers: { accept: "application/json" } });
    if (!response.ok) return ERR_UNAVAILABLE;
    const body: unknown = await response.json();
    if (!body || typeof body !== "object") return ERR_UNAVAILABLE;
    const envelope = body as { items?: unknown; nextCursor?: unknown };
    if (!Array.isArray(envelope.items) || !envelope.items.every(isPublication) || !(envelope.nextCursor === null || typeof envelope.nextCursor === "string")) return ERR_UNAVAILABLE;
    return { status: "success", items: envelope.items as PublicPublication[], nextCursor: envelope.nextCursor };
  } catch {
    return ERR_UNAVAILABLE;
  }
}

export async function getPublicationById(id: string): Promise<DetailResult> {
  const url = serviceUrl(`api/v1/publications/${encodeURIComponent(id)}`);
  if (!url) return ERR_UNAVAILABLE;
  try {
    const res = await fetch(url, { cache: "no-store", headers: { accept: "application/json" } });
    if (res.status === 404) return { status: "not_found" };
    if (!res.ok) return ERR_UNAVAILABLE;
    const body: unknown = await res.json();
    if (!isPublication(body) || !("abstract" in body) || !(body.abstract === null || typeof body.abstract === "string")) return ERR_UNAVAILABLE;
    return { status: "success", item: body as PublicPublicationDetail };
  } catch {
    return ERR_UNAVAILABLE;
  }
}
