import type { DiscoveryResult, PublicExpert, PublicPublication } from "../types";

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;
export async function fetchDiscoverySection<T>(baseUrl:string, query:Record<string,string|undefined>, fetcher:Fetcher=fetch):Promise<DiscoveryResult<T>> {
  try {
    const url=new URL(baseUrl); for(const [key,value] of Object.entries(query)) if(value) url.searchParams.set(key,value);
    const response=await fetcher(url.toString(),{cache:"no-store",headers:{accept:"application/json"}});
    if(!response.ok) return {status:"error",kind:"integration",message:"Module 02 service unavailable"};
    const body:unknown=await response.json();
    if(!body||typeof body!=="object") throw new Error("Invalid Module 02 response");
    const envelope=body as {items?:unknown;nextCursor?:unknown};
    if(!Array.isArray(envelope.items)||!(envelope.nextCursor===null||typeof envelope.nextCursor==="string")) throw new Error("Invalid Module 02 response");
    return {status:"success",items:envelope.items as T[],nextCursor:envelope.nextCursor};
  } catch { return {status:"error",kind:"integration",message:"Module 02 service unavailable"}; }
}
function serviceUrl(name:"KNOWLEDGE_SERVICE_URL"|"ORGANIZATION_SERVICE_URL",path:string){const base=process.env[name];if(!base)return null;return new URL(path,base.endsWith("/")?base:`${base}/`).toString();}
export function getPublications(query:Record<string,string|undefined>={}){const url=serviceUrl("KNOWLEDGE_SERVICE_URL","api/v1/publications");return url?fetchDiscoverySection<PublicPublication>(url,query):Promise.resolve({status:"error",kind:"integration",message:"Module 02 service unavailable"} as const);}
export function getExperts(query:Record<string,string|undefined>={}){const url=serviceUrl("ORGANIZATION_SERVICE_URL","api/v1/experts");return url?fetchDiscoverySection<PublicExpert>(url,query):Promise.resolve({status:"error",kind:"integration",message:"Module 02 service unavailable"} as const);}
