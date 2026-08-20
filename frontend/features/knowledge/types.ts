export type DiscoverySuccess<T> = { status: "success"; items: T[]; nextCursor: string | null };
export type DiscoveryError = { status: "error"; kind: "integration"; message: string };
export type DiscoveryResult<T> = DiscoverySuccess<T> | DiscoveryError;
export type PublicPublication = { id:string; title:string; type:string; language:string; year:number; country:string; organizationRef:string|null; visibility:"PUBLIC"; authors:Array<{id:string;expertRef:string;displayOrder:number}>; topics:Array<{id:string;slug:string;labels:Record<string,string>}> };
export type PublicExpert = { id:string; displayName:string; bio:string|null; country:string; language:string|null; visibility:"PUBLIC"; organization:{id:string;name:string;country:string}; expertises:Array<{id:string;slug:string;labels:Record<string,string>}> };

/** Runtime shape guard: returns true if value looks like a PublicPublication */
export function isPublicPublication(v: unknown): v is PublicPublication {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return o.visibility === "PUBLIC" && typeof o.id === "string" && typeof o.title === "string" && typeof o.type === "string" && typeof o.language === "string" && typeof o.year === "number" && typeof o.country === "string" && Array.isArray(o.authors) && Array.isArray(o.topics);
}

/** Runtime shape guard: returns true if value looks like a PublicExpert */
export function isPublicExpert(v: unknown): v is PublicExpert {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  const organization = o.organization as Record<string, unknown> | undefined;
  return o.visibility === "PUBLIC" && typeof o.id === "string" && typeof o.displayName === "string" && typeof o.country === "string" && !!organization && typeof organization === "object" && typeof organization.id === "string" && typeof organization.name === "string" && typeof organization.country === "string" && Array.isArray(o.expertises) && o.expertises.every((x) => !!x && typeof x === "object" && typeof (x as Record<string, unknown>).id === "string" && typeof (x as Record<string, unknown>).slug === "string" && !!(x as Record<string, unknown>).labels && typeof (x as Record<string, unknown>).labels === "object" && Object.values((x as Record<string, unknown>).labels as Record<string, unknown>).every((label) => typeof label === "string"));
}
