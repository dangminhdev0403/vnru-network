import "server-only";

import { authServiceUrl } from "@/features/auth/server";
import type { NewsCategoryKey, OfficialNewsArticle } from "./official-news";

const categories: Record<string, NewsCategoryKey> = {
  "science-technology": "science",
  "economy-society": "society",
  education: "education",
  cooperation: "cooperation",
};

const apiCategories: Partial<Record<NewsCategoryKey, string>> = Object.fromEntries(
  Object.entries(categories).map(([api, ui]) => [ui, api]),
);

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
  isFeatured: boolean;
};

export type PublicNewsQuery = {
  locale: string;
  limit?: number;
  offset?: number;
  featured?: boolean;
  excludeId?: string;
  category?: NewsCategoryKey | "all";
  contentTypes?: NonNullable<OfficialNewsArticle["contentType"]>[];
  query?: string;
  scope?: "vietnam" | "russia" | "bilateral";
  period?: "7days" | "30days";
};

export type PublicNewsResult = {
  items: OfficialNewsArticle[];
  total: number;
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
    isFeatured: article.isFeatured,
  };
};

export async function getPublicNews({
  locale,
  limit = 20,
  offset = 0,
  featured,
  excludeId,
  category,
  contentTypes = [],
  query,
  scope,
  period,
}: PublicNewsQuery): Promise<PublicNewsResult> {
  const params = new URLSearchParams({
    locale,
    limit: String(limit),
    offset: String(offset),
  });
  if (featured !== undefined) params.append("featured", String(featured));
  if (excludeId) params.append("excludeId", excludeId);
  if (category && category !== "all")
    params.append("category", apiCategories[category] ?? category);
  contentTypes.forEach((type) => params.append("contentType", type));
  if (query) params.append("q", query);
  if (scope) params.append("scope", scope);
  if (period) params.append("period", period);

  const response = await fetch(authServiceUrl(`api/v1/news?${params}`), {
    next: { revalidate: 60 },
  });
  if (!response.ok) throw new Error(`News API failed: ${response.status}`);
  const result = (await response.json()) as {
    items: ApiArticle[];
    total: number;
  };
  return {
    items: result.items
      .map(mapArticle)
      .filter((article): article is OfficialNewsArticle => Boolean(article)),
    total: result.total,
  };
}

export async function getPublicNewsArticle(
  id: string,
  locale: string,
): Promise<OfficialNewsArticle | undefined> {
  const response = await fetch(
    authServiceUrl(`api/v1/news/${encodeURIComponent(id)}?locale=${locale}`),
    { next: { revalidate: 60 } },
  );
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`News API failed: ${response.status}`);
  return mapArticle((await response.json()) as ApiArticle);
}
