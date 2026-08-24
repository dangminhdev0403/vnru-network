import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  backendHeaders,
} from "../../../../features/auth/server";

const sections = {
  profile: "personal-info",
  security: "account-security/signing-in",
} as const;

export async function GET(request: NextRequest) {
  const session = await fetch(authServiceUrl("api/v1/auth/me"), {
    cache: "no-store",
    headers: backendHeaders(request),
  });
  if (!session.ok)
    return NextResponse.redirect(
      new URL("/api/auth/login?returnTo=/account", request.url),
    );

  const section =
    request.nextUrl.searchParams.get("section") === "security"
      ? "security"
      : "profile";
  const issuer = process.env.KEYCLOAK_ISSUER_URL;
  if (!issuer)
    return NextResponse.json(
      { error: "KEYCLOAK_ISSUER_URL is required" },
      { status: 503 },
    );

  return NextResponse.redirect(
    `${issuer.replace(/\/$/, "")}/account/#/${sections[section]}`,
  );
}
