import type { Metadata } from "next";
import { GuestKnowledgeV2 } from "@/features/public-v2/components/GuestKnowledgeV2";

export const metadata: Metadata = {
  title: "Kho Tri thức KH&CN | Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt",
  description: "Khám phá các chuyên đề, công trình nghiên cứu và cơ sở dữ liệu khoa học công nghệ song phương Việt Nam – Liên bang Nga.",
};

export default function KnowledgePage() {
  return <GuestKnowledgeV2 />;
}
