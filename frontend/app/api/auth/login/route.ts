import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  LOCALE_COOKIE_NAME,
  RETURN_TO_COOKIE_NAME,
  sanitizeLocale,
  sanitizeReturnTo,
} from "../../../../features/auth/server";

export async function GET(request: NextRequest) {
  const returnTo = sanitizeReturnTo(
    request.nextUrl.searchParams.get("returnTo"),
  );
  try {
    const backend = await fetch(authServiceUrl("api/v1/auth/login"), {
      cache: "no-store",
      redirect: "manual",
    });
    const location = backend.headers.get("location");
    if (backend.status < 300 || backend.status >= 400 || !location)
      throw new Error("Keycloak unavailable");

    const authorizationUrl = new URL(location);
    authorizationUrl.searchParams.set(
      "ui_locales",
      sanitizeLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value),
    );
    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set(RETURN_TO_COOKIE_NAME, returnTo, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600,
    });
    return response;
  } catch {
    const unavailable = new URL("/login", request.url);
    unavailable.searchParams.set("returnTo", returnTo);
    unavailable.searchParams.set("error", "configuration-unavailable");
    return NextResponse.redirect(unavailable);
  }
}
