import { AuthError } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "../../../../auth";
import { isSameOriginRequest, publicRequestUrl, sanitizeReturnTo } from "../../../../features/auth/server";

export function GET(request: NextRequest) {
  const login = publicRequestUrl(request, "/login");
  login.searchParams.set("returnTo", sanitizeReturnTo(request.nextUrl.searchParams.get("returnTo")));
  return NextResponse.redirect(login);
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid login origin" }, { status: 403 });
  }
  const form = await request.formData();
  const returnTo = sanitizeReturnTo(form.get("returnTo")?.toString());
  try {
    await signIn("credentials", {
      account: form.get("account"),
      password: form.get("password"),
      redirectTo: returnTo,
    });
  } catch (error) {
    if (!(error instanceof AuthError)) throw error;
    const login = publicRequestUrl(request, "/login");
    login.searchParams.set("returnTo", returnTo);
    login.searchParams.set("error", "CredentialsSignin");
    return NextResponse.redirect(login);
  }
}
