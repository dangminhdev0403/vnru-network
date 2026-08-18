import { NextRequest, NextResponse } from "next/server";
import { authServiceUrl, backendHeaders, sanitizeReturnTo, SESSION_COOKIE_NAME } from "./features/auth/server";

export async function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE_NAME)) {
    const session = await fetch(authServiceUrl("api/v1/auth/me"), {
      cache: "no-store",
      headers: backendHeaders(request),
    }).catch(() => null);
    if (session?.ok) return NextResponse.next();
  }
  const login = new URL("/login", request.url);
  login.searchParams.set("returnTo", sanitizeReturnTo(`${request.nextUrl.pathname}${request.nextUrl.search}`));
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/workspace/:path*", "/security/:path*", "/admin/:path*"] };
