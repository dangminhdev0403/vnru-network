import { NextResponse } from "next/server";
import { signOut } from "../../../../auth";
import {
  authServiceUrl,
  backendHeaders,
  publicRequestUrl,
  sanitizeReturnTo,
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
    logoutUrl: publicRequestUrl(request, "/").href,
  });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}

export async function GET(request: Request) {
  await fetch(authServiceUrl("api/v1/auth/logout"), {
    method: "POST",
    headers: backendHeaders(request),
  }).catch(() => null);
  await signOut({ redirect: false });
  const returnTo = sanitizeReturnTo(new URL(request.url).searchParams.get("returnTo"));
  const login = publicRequestUrl(request, "/api/auth/login");
  login.searchParams.set("returnTo", returnTo);
  const response = NextResponse.redirect(login);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
