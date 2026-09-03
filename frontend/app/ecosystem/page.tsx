import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GuestEcosystemV2 } from "@/features/public-v2/components/GuestEcosystemV2";
import { getPublicNews } from "@/features/public-v2/data/public-news-server";
import {
  getCurrentSession,
  LOCALE_COOKIE_NAME,
  resolveLandingPath,
  sanitizeLocale,
  SESSION_COOKIE_NAME,
} from "@/features/auth/server";

export const metadata: Metadata = {
  title: "Hệ sinh thái | Mạng lưới RU-VN",
  description:
    "Chương trình tài trợ khoa học, dự án Khai sáng và thư viện tri thức song phương Việt Nam – Liên bang Nga.",
};

export default async function Page() {
  const cookieStore = await cookies();
  const locale = sanitizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const [sessionResult, knowledge] = await Promise.all([
    getCurrentSession(cookieStore.get(SESSION_COOKIE_NAME)?.value),
    getPublicNews({
      locale,
      limit: 100,
      contentTypes: ["KNOWLEDGE"],
    }),
  ]);
  const session = sessionResult as { capabilities?: string[] } | null;
  const capabilities = Array.isArray(session?.capabilities)
    ? session.capabilities
    : [];

  return (
    <GuestEcosystemV2
      isAuthenticated={Boolean(session)}
      knowledgeArticles={knowledge.items}
      workspaceHref={session ? resolveLandingPath(capabilities) : "/account"}
    />
  );
}
