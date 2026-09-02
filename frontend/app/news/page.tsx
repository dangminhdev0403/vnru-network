import type { Metadata } from "next";
import { GuestExploreV2 } from "@/features/public-v2/components/GuestExploreV2";
import { getPublicNews } from "@/features/public-v2/data/public-news-server";
import {
  DEFAULT_NEWS_ADVANCED_FILTERS,
  NEWS_CATEGORIES,
  NEWS_FILTER_CONTENT_TYPES,
  NEWS_FILTER_PERIODS,
  NEWS_FILTER_SCOPES,
  type NewsAdvancedFilters,
  type NewsCategory,
} from "@/features/public-v2/components/GuestNewsFilterNav";

export const metadata: Metadata = {
  title: "Tin tức | Mạng lưới tri thức Nga - Việt",
  description:
    "Tin Khoa học - Công nghệ, Kinh tế - Xã hội, Giáo dục đào tạo và Hợp tác Nga - Việt.",
};

function isNewsCategory(value: string): value is NewsCategory {
  return NEWS_CATEGORIES.some((category) => category === value);
}

function parseAdvancedFilters(params: {
  scope?: string | string[];
  type?: string | string[];
  period?: string | string[];
}): NewsAdvancedFilters {
  const contentTypeValues = Array.isArray(params.type)
    ? params.type
    : [params.type];
  const contentTypes = NEWS_FILTER_CONTENT_TYPES.filter((type) =>
    contentTypeValues.includes(type),
  );
  const scopeValue =
    typeof params.scope === "string" ? params.scope : "all";
  const periodValue =
    typeof params.period === "string" ? params.period : "newest";

  return {
    ...DEFAULT_NEWS_ADVANCED_FILTERS,
    scope:
      NEWS_FILTER_SCOPES.find((scope) => scope === scopeValue) ?? "all",
    contentTypes,
    period:
      NEWS_FILTER_PERIODS.find((period) => period === periodValue) ?? "newest",
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
    period?: string | string[];
    q?: string | string[];
    scope?: string | string[];
    streamCategory?: string | string[];
    streamPage?: string | string[];
    type?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const categoryValue =
    typeof params.category === "string" ? params.category : "all";
  const category = isNewsCategory(categoryValue) ? categoryValue : "all";
  const query =
    typeof params.q === "string" ? params.q.trim().slice(0, 200) : "";
  const filters = parseAdvancedFilters(params);
  const filterPageValue =
    typeof params.page === "string" ? Number.parseInt(params.page, 10) : 1;
  const filterPage =
    Number.isFinite(filterPageValue) && filterPageValue > 0
      ? filterPageValue
      : 1;
  const categoryMode =
    category !== "all" ||
    Boolean(query) ||
    filters.scope !== "all" ||
    filters.contentTypes.length > 0 ||
    filters.period !== "newest";

  const streamCategoryValue =
    typeof params.streamCategory === "string" ? params.streamCategory : "all";
  const streamCategory = isNewsCategory(streamCategoryValue)
    ? streamCategoryValue
    : "all";
  const requestedPage =
    typeof params.streamPage === "string"
      ? Number.parseInt(params.streamPage, 10)
      : 1;
  const streamPage = Number.isFinite(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;

  if (categoryMode) {
    const result = await getPublicNews({
      locale: "vi",
      limit: 10,
      offset: (filterPage - 1) * 10,
      category,
      contentTypes: filters.contentTypes,
      query: query || undefined,
      scope: filters.scope === "all" ? undefined : filters.scope,
      period: filters.period === "newest" ? undefined : filters.period,
    });
    return (
      <GuestExploreV2
        initialArticles={result.items}
        initialCategory={category}
        initialAdvancedFilters={filters}
        initialQuery={query}
        filteredTotal={result.total}
        filteredPage={filterPage}
      />
    );
  }

  const [latest, featured, stream] = await Promise.all([
    getPublicNews({ locale: "vi", limit: 4 }),
    getPublicNews({ locale: "vi", limit: 4, featured: true }),
    getPublicNews({
      locale: "vi",
      limit: 10,
      offset: (streamPage - 1) * 10,
      category: streamCategory,
    }),
  ]);

  return (
    <GuestExploreV2
      latestArticles={latest.items}
      featuredArticles={featured.items}
      streamArticles={stream.items}
      streamTotal={stream.total}
      streamPage={streamPage}
      streamCategory={streamCategory}
    />
  );
}
