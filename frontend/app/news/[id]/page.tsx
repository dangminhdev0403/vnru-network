import { notFound, permanentRedirect } from "next/navigation";
import { cookies } from "next/headers";
import { newsArticleHref } from "@/features/public-v2/data/official-news";
import { getPublicNewsArticle } from "@/features/public-v2/data/public-news-server";
import { LOCALE_COOKIE_NAME, sanitizeLocale } from "@/features/auth/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = sanitizeLocale((await cookies()).get(LOCALE_COOKIE_NAME)?.value);
  const article = await getPublicNewsArticle(id, locale);
  if (!article) notFound();
  permanentRedirect(newsArticleHref(article));
}
