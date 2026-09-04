import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { GuestNewsArticleV2 } from "@/features/public-v2/components/GuestNewsArticleV2";
import {
  formatNewsTitle,
  newsArticleHref,
} from "@/features/public-v2/data/official-news";
import { getPublicNews, getPublicNewsArticle } from "@/features/public-v2/data/public-news-server";
import { LOCALE_COOKIE_NAME, sanitizeLocale } from "@/features/auth/server";
import { PORTAL_NAME } from "@/core/i18n/metadata";

type PageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const locale = sanitizeLocale((await cookies()).get(LOCALE_COOKIE_NAME)?.value);
  const article = await getPublicNewsArticle(id, locale);
  if (!article) notFound();
  return {
    title: `${formatNewsTitle(article.title)} | ${PORTAL_NAME[locale]}`,
    description: article.summary,
  };
}

export default async function Page({ params }: PageProps) {
  const { id, slug } = await params;
  const locale = sanitizeLocale((await cookies()).get(LOCALE_COOKIE_NAME)?.value);
  const article = await getPublicNewsArticle(id, locale);
  if (!article) notFound();
  const canonical = newsArticleHref(article);
  if (!canonical.endsWith(`/${slug}`)) permanentRedirect(canonical);
  const [related, latest, moreLatest] = await Promise.all([
    getPublicNews({ locale, limit: 4, category: article.category, excludeId: id }),
    getPublicNews({ locale, limit: 5, excludeId: id }),
    getPublicNews({ locale, limit: 4, offset: 5, excludeId: id }),
  ]);
  return (
    <GuestNewsArticleV2
      article={article}
      related={related.items}
      latest={latest.items}
      moreLatest={moreLatest.items}
    />
  );
}
