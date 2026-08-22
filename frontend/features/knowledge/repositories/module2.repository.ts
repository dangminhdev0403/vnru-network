import type { DiscoveryResult, PublicExpert, PublicPublication } from "../types";

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;
const isPublicPublication = (value: unknown): value is PublicPublication => isObject(value) && value.visibility === "PUBLIC" && typeof value.id === "string" && typeof value.title === "string" && Array.isArray(value.authors) && Array.isArray(value.topics);
const isPublicExpert = (value: unknown): value is PublicExpert => isObject(value) && value.visibility === "PUBLIC" && typeof value.id === "string" && typeof value.displayName === "string" && isObject(value.organization) && Array.isArray(value.expertises);

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;
type ItemGuard<T> = (v: unknown) => v is T;

export async function fetchDiscoverySection<T>(baseUrl:string, query:Record<string,string|undefined>, fetcher:Fetcher=fetch, guard?:ItemGuard<T>):Promise<DiscoveryResult<T>> {
  try {
    const url=new URL(baseUrl); for(const [key,value] of Object.entries(query)) if(value) url.searchParams.set(key,value);
    const response=await fetcher(url.toString(),{cache:"no-store",headers:{accept:"application/json"}});
    if(!response.ok) return {status:"error",kind:"integration",message:"Module 02 service unavailable"};
    const body:unknown=await response.json();
    if(!body||typeof body!=="object") throw new Error("Invalid Module 02 response");
    const envelope=body as {items?:unknown;nextCursor?:unknown};
    if(!Array.isArray(envelope.items)||!(envelope.nextCursor===null||typeof envelope.nextCursor==="string")) throw new Error("Invalid Module 02 response");
    if (guard && !envelope.items.every(guard)) throw new Error("Invalid Module 02 item");
    const items = envelope.items as T[];
    return {status:"success",items,nextCursor:envelope.nextCursor};
  } catch { return {status:"error",kind:"integration",message:"Module 02 service unavailable"}; }
}
function serviceUrl(path:string){const base=process.env.KNOWLEDGE_SERVICE_URL;if(!base)return null;return new URL(path,base.endsWith("/")?base:`${base}/`).toString();}
export function getPublications(query:Record<string,string|undefined>={}){const url=serviceUrl("api/v1/publications");return url?fetchDiscoverySection<PublicPublication>(url,query,fetch,isPublicPublication):Promise.resolve({status:"error",kind:"integration",message:"Module 02 service unavailable"} as const);}
export function getExperts(query:Record<string,string|undefined>={}){const url=serviceUrl("api/v1/experts");return url?fetchDiscoverySection<PublicExpert>(url,query,fetch,isPublicExpert):Promise.resolve({status:"error",kind:"integration",message:"Module 02 service unavailable"} as const);}
