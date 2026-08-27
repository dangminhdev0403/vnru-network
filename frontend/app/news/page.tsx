import type { Metadata } from "next";
import { GuestExploreV2 } from "@/features/public-v2/components/GuestExploreV2";

export const metadata: Metadata = {
  title: "Tin tức | Mạng lưới tri thức Nga - Việt",
  description:
    "Tin Khoa học - Công nghệ, Kinh tế - Xã hội, Giáo dục đào tạo và Hợp tác Nga - Việt.",
};

export default function Page() {
  return <GuestExploreV2 />;
}
