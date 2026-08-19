export type DiscoverySuccess<T> = { status: "success"; items: T[]; nextCursor: string | null };
export type DiscoveryError = { status: "error"; kind: "integration"; message: string };
export type DiscoveryResult<T> = DiscoverySuccess<T> | DiscoveryError;
export type PublicPublication = { id:string; title:string; type:string; language:string; year:number; country:string; organizationRef:string|null; visibility:"PUBLIC"; authors:Array<{id:string;expertRef:string;displayOrder:number}>; topics:Array<{id:string;slug:string;labels:Record<string,string>}> };
export type PublicExpert = { id:string; displayName:string; bio:string|null; country:string; language:string|null; visibility:"PUBLIC"; organization:{id:string;name:string;country:string}; expertises:Array<{id:string;slug:string;labels:Record<string,string>}> };
