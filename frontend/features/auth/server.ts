export const SESSION_COOKIE_NAME = "vnru_session";
export const RETURN_TO_COOKIE_NAME = "vnru_return_to";
export const LOCALE_COOKIE_NAME = "vnru_locale";

export function sanitizeLocale(
  value: string | null | undefined,
): "vi" | "en" | "ru" {
  return value === "en" || value === "ru" ? value : "vi";
}

export function sanitizeReturnTo(value: string | null | undefined): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || !URL.canParse(origin)) return false;
  const source = new URL(origin);
  const requestUrl = new URL(request.url);
  const host = request.headers.get("x-forwarded-host")?.split(",", 1)[0]?.trim()
    || requestUrl.host;
  const protocol = request.headers.get("x-forwarded-proto")?.split(",", 1)[0]?.trim()
    || requestUrl.protocol.slice(0, -1);
  const target = new URL(`${protocol}://${host}`);
  return source.origin === target.origin
    || request.headers.get("sec-fetch-site") === "same-origin";
}

export function isSystemAdministrator(capabilities: string[] = []): boolean {
  return (
    capabilities.includes("iam.roles.manage") ||
    capabilities.includes("iam.users.manage")
  );
}

export function resolveLandingPath(capabilities: string[] = []): string {
  if (isSystemAdministrator(capabilities)) {
    return "/admin/access";
  }
  if (capabilities.some((item) => item.startsWith("content.article."))) {
    return "/workspace/news";
  }
  if (capabilities.includes("portal.member.access")) {
    return "/workspace";
  }
  return "/";
}

export function authServiceUrl(path: string): URL {
  const baseUrl = process.env.AUTH_SERVICE_URL;
  if (!baseUrl) throw new Error("AUTH_SERVICE_URL is required");
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
  target.append(
    "set-cookie",
    process.env.NODE_ENV === "production"
      ? cookie
      : cookie.replace(/;\s*Secure/gi, ""),
  );
}

export async function getCurrentSession(
  token?: string,
): Promise<unknown | null> {
  if (!token) return null;
  const response = await fetch(authServiceUrl("api/v1/auth/me"), {
    cache: "no-store",
    headers: { cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}` },
  }).catch(() => null);
  return response?.ok ? response.json() : null;
}
