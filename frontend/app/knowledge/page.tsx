import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getRouteMetadata } from "@/core/i18n/metadata";
import { GuestKnowledgeV2 } from "@/features/public-v2/components/GuestKnowledgeV2";
import { getPublicNews } from "@/features/public-v2/data/public-news-server";
import { LOCALE_COOKIE_NAME, sanitizeLocale } from "@/features/auth/server";

export function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata("knowledge");
}

export default async function Page() {
  const locale = sanitizeLocale(
    (await cookies()).get(LOCALE_COOKIE_NAME)?.value,
  );
  const result = await getPublicNews({
    locale,
    limit: 100,
    contentTypes: ["KNOWLEDGE"],
  });

  return <GuestKnowledgeV2 articles={result.items} total={result.total} />;
}
