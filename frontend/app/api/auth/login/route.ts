import { NextRequest } from "next/server";
import { signIn } from "../../../../auth";
import {
  LOCALE_COOKIE_NAME,
  sanitizeLocale,
  sanitizeReturnTo,
} from "../../../../features/auth/server";

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action");
  const prompt = request.nextUrl.searchParams.get("prompt");
  await signIn(
    "keycloak",
    {
      redirectTo: sanitizeReturnTo(
        request.nextUrl.searchParams.get("returnTo"),
      ),
    },
    {
      ui_locales: sanitizeLocale(
        request.cookies.get(LOCALE_COOKIE_NAME)?.value,
      ),
      ...(action === "CONFIGURE_TOTP"
        ? { kc_action: action }
        : action === "REGISTER"
          ? { prompt: "create" }
          : {}),
      ...(prompt === "login" ? { prompt } : {}),
    },
  );
}
