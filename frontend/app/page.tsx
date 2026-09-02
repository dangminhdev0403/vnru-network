import { cookies } from "next/headers";
import { GuestHomeV2 } from "@/features/public-v2/components/GuestHomeV2";
import { getPublicNews } from "@/features/public-v2/data/public-news-server";
import {
  getCurrentSession,
  LOCALE_COOKIE_NAME,
  resolveLandingPath,
  sanitizeLocale,
  SESSION_COOKIE_NAME,
} from "../features/auth/server";

type HomeSession = {
  capabilities?: string[];
};

export default async function Home() {
  const cookieStore = await cookies();
  const locale = sanitizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const [session, news, events] = await Promise.all([
    getCurrentSession(cookieStore.get(SESSION_COOKIE_NAME)?.value) as Promise<HomeSession | null>,
    getPublicNews({ locale, limit: 4, contentTypes: ["ARTICLE"] }).then(({ items }) => items),
    getPublicNews({ locale, limit: 4, contentTypes: ["EVENT"] }).then(({ items }) => items),
  ]);
  const capabilities = Array.isArray(session?.capabilities) ? session.capabilities : [];
  const landingPath = resolveLandingPath(capabilities);
  const workspaceHref = session && landingPath === "/" ? "/account" : landingPath;

  return (
    <GuestHomeV2
      isAuthenticated={Boolean(session)}
      news={news}
      events={events}
      workspaceHref={workspaceHref}
    />
  );
}
