import { backendHeaders, authServiceUrl } from "../../../../features/auth/server";

export async function GET(request: Request) {
  const backend = await fetch(authServiceUrl("api/v1/auth/me"), {
    cache: "no-store",
    headers: backendHeaders(request),
  });
  return new Response(backend.body, {
    status: backend.status,
    headers: { "cache-control": "no-store", "content-type": backend.headers.get("content-type") ?? "application/json" },
  });
}
