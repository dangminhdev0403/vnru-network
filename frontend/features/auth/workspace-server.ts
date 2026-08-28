import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentSession, isSystemAdministrator, resolveLandingPath, SESSION_COOKIE_NAME } from "./server";

type WorkspaceSession = {
  capabilities?: unknown;
};

function readCapabilities(session: WorkspaceSession): string[] {
  return Array.isArray(session.capabilities)
    ? session.capabilities.filter((value): value is string => typeof value === "string")
    : [];
}

export async function requireWorkspaceSession(returnTo: string): Promise<string[]> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = await getCurrentSession(token) as WorkspaceSession | null;
  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
  return readCapabilities(session);
}

export async function requireMemberSession(returnTo: string): Promise<string[]> {
  const capabilities = await requireWorkspaceSession(returnTo);
  if (isSystemAdministrator(capabilities)) redirect("/admin/access");
  if (resolveLandingPath(capabilities) !== "/workspace") redirect(resolveLandingPath(capabilities));
  return capabilities;
}