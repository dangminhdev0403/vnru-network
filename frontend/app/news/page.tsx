import type { Metadata } from "next";
import { GuestExploreV2 } from "@/features/public-v2/components/GuestExploreV2";
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
  topic?: string | string[];
  scope?: string | string[];
  type?: string | string[];
  period?: string | string[];
}): NewsAdvancedFilters {
  const topics = (Array.isArray(params.topic) ? params.topic : [params.topic])
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim().slice(0, 100))
    .filter(Boolean)
    .slice(0, 12);
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
    topics,
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
    period?: string | string[];
    q?: string | string[];
    scope?: string | string[];
    topic?: string | string[];
    type?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const categoryValue =
    typeof params.category === "string" ? params.category : "all";
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 200) : "";

  return (
    <GuestExploreV2
      initialCategory={
        isNewsCategory(categoryValue) ? categoryValue : "all"
      }
      initialAdvancedFilters={parseAdvancedFilters(params)}
      initialQuery={query}
    />
  );
}
