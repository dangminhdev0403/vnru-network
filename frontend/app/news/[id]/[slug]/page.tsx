import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { GuestNewsArticleV2 } from "@/features/public-v2/components/GuestNewsArticleV2";
import { newsArticleHref } from "@/features/public-v2/data/official-news";
import { getPublicNews, getPublicNewsArticle } from "@/features/public-v2/data/public-news-server";

type PageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getPublicNewsArticle(id, "vi");
  if (!article) notFound();
  return { title: `${article.title} | Mạng lưới RU-VN`, description: article.summary };
}

export default async function Page({ params }: PageProps) {
  const { id, slug } = await params;
  const [article, articles] = await Promise.all([
    getPublicNewsArticle(id, "vi"),
    getPublicNews("vi"),
  ]);
  if (!article) notFound();
  const canonical = newsArticleHref(article);
  if (!canonical.endsWith(`/${slug}`)) permanentRedirect(canonical);
  return <GuestNewsArticleV2 article={article} articles={articles} />;
}
