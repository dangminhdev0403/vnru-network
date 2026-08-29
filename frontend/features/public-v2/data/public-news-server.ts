import "server-only";

import { authServiceUrl } from "@/features/auth/server";
import { OFFICIAL_NEWS, getOfficialNewsArticle, type NewsCategoryKey, type OfficialNewsArticle } from "./official-news";

const categories: Record<string, NewsCategoryKey> = {
  "science-technology": "science",
  "economy-society": "society",
  education: "education",
  cooperation: "cooperation",
};

type ApiArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  contentType: OfficialNewsArticle["contentType"];
  coverImageUrl: string | null;
  publishedAt: string | null;
  sourceUrls: string[];
  actionUrl: string | null;
  actionClosesAt: string | null;
  actionLabel: string | null;
};

const mapArticle = (article: ApiArticle): OfficialNewsArticle | undefined => {
  const category = categories[article.category];
  if (!category) return undefined;
  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    category,
    date: article.publishedAt ?? "",
    image: article.coverImageUrl,
    body: article.content.split(/\n{2,}/).filter(Boolean),
    sources: article.sourceUrls,
    contentType: article.contentType,
    actionUrl: article.actionUrl,
    actionClosesAt: article.actionClosesAt,
    actionLabel: article.actionLabel,
  };
};

export async function getPublicNews(locale: string): Promise<OfficialNewsArticle[]> {
  try {
    const response = await fetch(authServiceUrl(`api/v1/news?limit=100&locale=${locale}`), { next: { revalidate: 60 } });
    if (!response.ok) return OFFICIAL_NEWS;
    const articles = await response.json() as ApiArticle[];
    const mapped = articles.map(mapArticle).filter((article): article is OfficialNewsArticle => Boolean(article));
    return mapped.length ? mapped : OFFICIAL_NEWS;
  } catch {
    return OFFICIAL_NEWS;
  }
}

export async function getPublicNewsArticle(id: string, locale: string): Promise<OfficialNewsArticle | undefined> {
  try {
    const response = await fetch(authServiceUrl(`api/v1/news/${encodeURIComponent(id)}?locale=${locale}`), { next: { revalidate: 60 } });
    if (response.ok) return mapArticle(await response.json() as ApiArticle);
  } catch {
    // Local fallback keeps the official catalog available before migration/import.
  }
  return getOfficialNewsArticle(id);
}
