import type { Metadata } from "next";
import { KnowledgeDiscovery } from "@/features/public-home/components/KnowledgeDiscovery";

export const metadata: Metadata = {
  title: "Kho tri thức | VN–RU Network",
  description: "Khám phá các chủ đề và tư liệu khoa học trong mạng lưới Việt Nam – Liên bang Nga.",
};

export default function KnowledgePage() {
  return <KnowledgeDiscovery />;
}
