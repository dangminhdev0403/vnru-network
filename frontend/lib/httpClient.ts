let redirecting = false;

export async function httpClient(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  if (!path.startsWith("/api/")) {
    throw new Error(`Internal API path must start with /api/: ${path}`);
  }

  const response = await fetch(path, {
    credentials: "same-origin",
    cache: "no-store",
    ...init,
  });
  if (
    response.status === 401 &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/login" &&
    !window.location.pathname.startsWith("/workspace") &&
    !window.location.pathname.startsWith("/governance") &&
    !redirecting
  ) {
    redirecting = true;
    const returnTo = `${window.location.pathname}${window.location.search}`;
    // OAuth requires a document navigation; this helper cannot use React hooks.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(
      `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }
  return response;
}
