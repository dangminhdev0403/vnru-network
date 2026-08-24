import { NextResponse } from "next/server";
import { auth } from "./auth";
import {
  authServiceUrl,
  backendHeaders,
  isSystemAdministrator,
  sanitizeReturnTo,
  SESSION_COOKIE_NAME,
} from "./features/auth/server";

export default auth(async function proxy(request) {
  if (
    request.nextUrl.pathname.startsWith("/governance")
  ) {
    return NextResponse.next();
  }

  const legacyRoutes: Record<string, string> = {
    "/admin/iam": "/admin/access",
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
    if ((request.auth as typeof request.auth & { error?: string })?.error) {
      const logout = new URL("/api/auth/logout", request.url);
      logout.searchParams.set("returnTo", `${request.nextUrl.pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(logout);
    }

    if (session?.ok) {
      const isWorkspacePath = request.nextUrl.pathname === "/workspace"
        || request.nextUrl.pathname.startsWith("/workspace/");
      if (isWorkspacePath) {
        const me = (await session.json().catch(() => null)) as { capabilities?: string[] } | null;
        const capabilities = me?.capabilities ?? [];
        if (isSystemAdministrator(capabilities)) {
          const target = request.nextUrl.clone();
          target.pathname = "/admin/access";
          target.search = "";
          return NextResponse.redirect(target);
        }
      }
      return NextResponse.next();
    }
  }
  const login = new URL("/login", request.url);
  login.searchParams.set(
    "returnTo",
    sanitizeReturnTo(`${request.nextUrl.pathname}${request.nextUrl.search}`),
  );
  const response = NextResponse.redirect(login);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
});

export const config = {
  matcher: ["/workspace/:path*", "/admin/:path*", "/admin/iam", "/account", "/security"],
};
