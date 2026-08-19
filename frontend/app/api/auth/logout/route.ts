import { NextRequest, NextResponse } from "next/server";
import { authServiceUrl, backendHeaders, forwardSessionCookie, SESSION_COOKIE_NAME } from "../../../../features/auth/server";

export async function POST(request: NextRequest) {
  const backend = await fetch(authServiceUrl("api/v1/auth/logout"), {
    method: "POST",
    cache: "no-store",
    headers: backendHeaders(request),
  });
  const payload = backend.ok ? await backend.json() : { ok: false };
  const response = NextResponse.json(payload, { status: backend.ok ? 200 : backend.status });
  forwardSessionCookie(backend, response.headers);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
