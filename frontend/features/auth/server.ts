export const SESSION_COOKIE_NAME = "vnru_session";
export const RETURN_TO_COOKIE_NAME = "vnru_return_to";
export const LOCALE_COOKIE_NAME = "vnru_locale";

export function sanitizeLocale(value: string | null | undefined): "vi" | "en" | "ru" {
  return value === "en" || value === "ru" ? value : "vi";
}

export function sanitizeReturnTo(value: string | null | undefined): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/workspace";
}

export function resolveLandingPath(capabilities: string[] = []): string {
  if (capabilities.includes("iam.roles.manage") || capabilities.includes("iam.users.manage")) {
    return "/workspace/iam/admin";
  }
  if (capabilities.includes("knowledge.workspace.view")) {
    return "/workspace/knowledge";
  }
  return "/workspace";
}

export function authServiceUrl(path: string): URL {
  const baseUrl = process.env.AUTH_SERVICE_URL;
  if (!baseUrl) throw new Error("AUTH_SERVICE_URL is required");
  return new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
}

export function collabServiceUrl(path: string): URL {
  const baseUrl = process.env.GRANT_SERVICE_URL || process.env.COLLAB_SERVICE_URL || "http://localhost:3003";
  return new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
}

export function backendHeaders(request: Request): Headers {
  const headers = new Headers({ accept: "application/json" });
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  return headers;
}

export function forwardSessionCookie(source: Response, target: Headers): void {
  const cookie = source.headers.get("set-cookie");
  if (!cookie) return;
  target.append("set-cookie", process.env.NODE_ENV === "production" ? cookie : cookie.replace(/;\s*Secure/gi, ""));
}

export async function getCurrentSession(token?: string): Promise<unknown | null> {
  if (!token) return null;
  const response = await fetch(authServiceUrl("api/v1/auth/me"), {
    cache: "no-store",
    headers: { cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}` },
  }).catch(() => null);
  return response?.ok ? response.json() : null;
}
