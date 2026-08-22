import { NextResponse } from "next/server";
import { signOut } from "../../../../auth";
import {
  authServiceUrl,
  backendHeaders,
  SESSION_COOKIE_NAME,
} from "../../../../features/auth/server";

export async function POST(request: Request) {
  const backend = await fetch(authServiceUrl("api/v1/auth/logout"), {
    method: "POST",
    headers: backendHeaders(request),
  });
  if (!backend.ok) {
    return NextResponse.json({ error: "Logout failed" }, { status: 502 });
  }

  await signOut({ redirect: false });
  const response = NextResponse.json({
    ok: true,
    logoutUrl: new URL("/", request.url).href,
  });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
