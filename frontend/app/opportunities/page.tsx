import type { Metadata } from "next";
import { GuestOpportunitiesV2 } from "@/features/public-v2/components/GuestOpportunitiesV2";

export const metadata: Metadata = {
  title: "Cơ hội Hợp tác Nghiên cứu | Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt",
  description: "Khám phá các chương trình kêu gọi đề xuất đề tài nghiên cứu song phương Việt Nam – Liên bang Nga.",
};

export default function Page() {
  return <GuestOpportunitiesV2 />;
}
