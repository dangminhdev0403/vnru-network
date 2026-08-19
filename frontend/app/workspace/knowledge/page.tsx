import KnowledgeWorkspaceView from "../../../features/knowledge/components/KnowledgeWorkspaceView";
import { getExperts, getPublications } from "../../../features/knowledge/repositories/module2.repository";
type Params=Record<string,string|string[]|undefined>;
const one=(value:string|string[]|undefined)=>typeof value==="string"?value:undefined;
export default async function KnowledgeWorkspacePage({searchParams}:{searchParams:Promise<Params>}){const raw=await searchParams;const query={q:one(raw.q),country:one(raw.country),organization:one(raw.organization),topic:one(raw.topic),language:one(raw.language),year:one(raw.year),cursor:one(raw.cursor),limit:"20"};const [publications,experts]=await Promise.all([getPublications(query),getExperts({...query,year:undefined})]);return <KnowledgeWorkspaceView publications={publications} experts={experts} query={query}/>;}
