import { httpClient } from "@/lib/httpClient";

export type NewsStatus = "DRAFT" | "PUBLISHED";
export type NewsLocale = "VI" | "EN" | "RU";
export type NewsContentType = "ARTICLE" | "EVENT" | "ANNOUNCEMENT" | "PROJECT" | "OPPORTUNITY" | "PUBLICATION";
export type NewsTranslation = { locale?: NewsLocale; title: string; summary: string; content: string; actionLabel?: string | null };
export type NewsArticle = {
  id: string;
  category: string;
  contentType: NewsContentType;
  actionUrl: string | null;
  actionClosesAt: string | null;
  sourceUrls: string[];
  coverImageUrl: string | null;
  status: NewsStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  updatedAt: string;
  translations: NewsTranslation[];
};
export type NewsInput = {
  category: string;
  contentType: NewsContentType;
  actionUrl?: string | null;
  actionClosesAt?: string | null;
  sourceUrls?: string[];
  coverImageUrl?: string | null;
  translations: Record<NewsLocale, NewsTranslation>;
};

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await httpClient(path, init);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || `Yêu cầu thất bại (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const newsRepository = {
  list: (status?: NewsStatus, signal?: AbortSignal) =>
    json<NewsArticle[]>(`/api/admin/news?limit=20&offset=0${status ? `&status=${status}` : ""}`, { signal }),
  detail: (id: string, signal?: AbortSignal) => json<NewsArticle>(`/api/admin/news/${id}`, { signal }),
  create: (input: NewsInput) => json<NewsArticle>("/api/admin/news", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }),
  update: ({ id, input }: { id: string; input: Partial<NewsInput> }) => json<NewsArticle>(`/api/admin/news/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(input) }),
  upload: (file: File) => {
    const data = new FormData();
    data.set("file", file);
    return json<{ url: string }>("/api/admin/news/media", { method: "POST", body: data });
  },
  publish: ({ id, isFeatured }: { id: string; isFeatured: boolean }) => json<NewsArticle>(`/api/admin/news/${id}/publish`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ isFeatured }) }),
  unpublish: (id: string) => json<NewsArticle>(`/api/admin/news/${id}/unpublish`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }),
};
