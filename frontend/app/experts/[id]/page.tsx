import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpertDetailPage } from "@/features/public-discovery/components/PublicDiscoveryPages";
import { EXPERTS, getExpert } from "@/features/public-discovery/mock-data";

export const metadata: Metadata = { title: "Hồ sơ chuyên gia | VN–RU Network" };

export function generateStaticParams() {
  return EXPERTS.map(({ id }) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getExpert(id)) notFound();
  return <ExpertDetailPage id={id} />;
}
