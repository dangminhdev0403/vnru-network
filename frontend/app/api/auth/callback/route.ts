import { NextRequest, NextResponse } from "next/server";
import { authServiceUrl, forwardSessionCookie, RETURN_TO_COOKIE_NAME, sanitizeReturnTo } from "../../../../features/auth/server";

export async function GET(request: NextRequest) {
  const backendUrl = authServiceUrl("api/v1/auth/callback");
  backendUrl.search = request.nextUrl.search;
  const backend = await fetch(backendUrl, { cache: "no-store", redirect: "manual" });
  if (!backend.ok) return NextResponse.redirect(new URL("/login?error=callback", request.url));

  const response = NextResponse.redirect(new URL(sanitizeReturnTo(request.cookies.get(RETURN_TO_COOKIE_NAME)?.value), request.url));
  response.cookies.delete(RETURN_TO_COOKIE_NAME);
  forwardSessionCookie(backend, response.headers);
  return response;
}
