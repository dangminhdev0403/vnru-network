import { NextResponse } from "next/server";
import { auth } from "./auth";
import {
  authServiceUrl,
  backendHeaders,
  sanitizeReturnTo,
  SESSION_COOKIE_NAME,
} from "./features/auth/server";

export default auth(async function proxy(request) {
  const legacyRoutes: Record<string, string> = {
    "/admin/iam": "/workspace/iam/admin",
    "/security": "/workspace/iam/security",
  };
  const canonicalPath = legacyRoutes[request.nextUrl.pathname];
  if (canonicalPath) {
    const target = request.nextUrl.clone();
    target.pathname = canonicalPath;
    return NextResponse.redirect(target);
  }

  if (request.cookies.has(SESSION_COOKIE_NAME)) {
    const session = await fetch(authServiceUrl("api/v1/auth/me"), {
      cache: "no-store",
      headers: backendHeaders(request),
    }).catch(() => null);
    if (session?.ok) return NextResponse.next();

    if ((request.auth as typeof request.auth & { error?: string })?.error) {
      await fetch(authServiceUrl("api/v1/auth/logout"), {
        method: "POST",
        headers: backendHeaders(request),
      }).catch(() => null);
      const login = new URL("/login", request.url);
      login.searchParams.set("error", "RefreshTokenError");
      const response = NextResponse.redirect(login);
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
  }
  const login = new URL("/login", request.url);
  login.searchParams.set(
    "returnTo",
    sanitizeReturnTo(`${request.nextUrl.pathname}${request.nextUrl.search}`),
  );
  return NextResponse.redirect(login);
});

export const config = {
  matcher: ["/workspace/:path*", "/admin/iam", "/security"],
};
