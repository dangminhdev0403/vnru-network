import { notFound, permanentRedirect } from "next/navigation";
import { newsArticleHref } from "@/features/public-v2/data/official-news";
import { getPublicNewsArticle } from "@/features/public-v2/data/public-news-server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getPublicNewsArticle(id, "vi");
  if (!article) notFound();
  permanentRedirect(newsArticleHref(article));
}
