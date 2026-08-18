import { NextRequest, NextResponse } from "next/server";
import { authServiceUrl, RETURN_TO_COOKIE_NAME, sanitizeReturnTo } from "../../../../features/auth/server";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(authServiceUrl("api/v1/auth/login"));
  response.cookies.set(RETURN_TO_COOKIE_NAME, sanitizeReturnTo(request.nextUrl.searchParams.get("returnTo")), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return response;
}
