import type { Metadata } from "next";
import { GuestExploreV2 } from "@/features/public-v2/components/GuestExploreV2";
import {
  NEWS_CATEGORIES,
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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
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
      initialQuery={query}
    />
  );
}
