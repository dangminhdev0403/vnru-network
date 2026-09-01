import { httpClient } from "@/lib/httpClient";

export type NewsLocale = "VI" | "EN" | "RU";
export type NewsContentType =
  | "ARTICLE"
  | "EVENT"
  | "ANNOUNCEMENT"
  | "PROJECT"
  | "OPPORTUNITY"
  | "PUBLICATION";
export type NewsTranslation = {
  locale?: NewsLocale;
  title: string;
  summary: string;
  content: string;
  actionLabel?: string | null;
};
export type NewsArticle = {
  id: string;
  category: string;
  contentType: NewsContentType;
  actionUrl: string | null;
  actionClosesAt: string | null;
  sourceUrls: string[];
  coverImageUrl: string | null;
  isFeatured: boolean;
  publishedAt: string | null;
  updatedAt: string;
  translations: NewsTranslation[];
};
export type AdminNewsListFilters = {
  limit?: number;
  offset?: number;
  contentType?: NewsContentType;
  category?: string;
  query?: string;
  sort?: "updated-desc" | "updated-asc" | "title-asc";
  featured?: boolean;
};

export type AdminNewsListItem = {
  id: string;
  category: string;
  contentType: NewsContentType;
  coverImageUrl: string | null;
  isFeatured: boolean;
  publishedAt: string | null;
  updatedAt: string;
  actionClosesAt: string | null;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
  translations: Array<{
    locale: NewsLocale;
    title: string;
    summary: string;
  }>;
};

export type AdminNewsListResponse = {
  items: AdminNewsListItem[];
  total: number;
  counts: { total: number; featured: number };
};

export type NewsInput = {
  category: string;
  contentType: NewsContentType;
  actionUrl?: string | null;
  actionClosesAt?: string | null;
  sourceUrls?: string[];
  coverImageUrl?: string | null;
  isFeatured?: boolean;
  translations: Record<NewsLocale, NewsTranslation>;
};

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await httpClient(path, init);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message || `Yêu cầu thất bại (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const newsRepository = {
  list: (filters?: AdminNewsListFilters, signal?: AbortSignal) => {
    const params = new URLSearchParams();
    if (filters?.limit) params.set("limit", String(filters.limit));
    if (filters?.offset !== undefined)
      params.set("offset", String(filters.offset));

    if (filters?.contentType) params.set("contentType", filters.contentType);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.query) params.set("query", filters.query);
    if (filters?.sort) params.set("sort", filters.sort);
    if (filters?.featured !== undefined)
      params.set("featured", String(filters.featured));
    const queryString = params.toString();
    return json<AdminNewsListResponse>(
      `/api/admin/news${queryString ? `?${queryString}` : ""}`,
      { signal },
    );
  },
  detail: (id: string, signal?: AbortSignal) =>
    json<NewsArticle>(`/api/admin/news/${id}`, { signal }),
  create: (input: NewsInput) =>
    json<NewsArticle>("/api/admin/news", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    }),
  update: ({ id, input }: { id: string; input: Partial<NewsInput> }) =>
    json<NewsArticle>(`/api/admin/news/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    }),
  delete: (id: string) =>
    json<{ ok: true }>(`/api/admin/news/${id}`, { method: "DELETE" }),
  upload: (file: File) => {
    const data = new FormData();
    data.set("file", file);
    return json<{ url: string }>("/api/admin/news/media", {
      method: "POST",
      body: data,
    });
  },
};
