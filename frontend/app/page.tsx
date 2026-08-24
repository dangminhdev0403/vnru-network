import { cookies } from "next/headers";
import { GuestHomeV2 } from "@/features/public-v2/components/GuestHomeV2";
import {
  getCurrentSession,
  resolveLandingPath,
  SESSION_COOKIE_NAME,
} from "../features/auth/server";

type HomeSession = {
  capabilities?: string[];
};

export default async function Home() {
  const session = (await getCurrentSession(
    (await cookies()).get(SESSION_COOKIE_NAME)?.value,
  )) as HomeSession | null;
  const workspaceHref = session
    ? resolveLandingPath(
        Array.isArray(session.capabilities) ? session.capabilities : [],
      )
    : "/account";

  return (
    <GuestHomeV2
      isAuthenticated={Boolean(session)}
      workspaceHref={workspaceHref}
    />
  );
}
