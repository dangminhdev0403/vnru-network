import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpportunityDetailPage } from "@/features/public-discovery/components/PublicDiscoveryPages";
import { OPPORTUNITIES, getOpportunity } from "@/features/public-discovery/mock-data";

export const metadata: Metadata = { title: "Chi tiết cơ hội nghiên cứu | VN–RU Network" };

export function generateStaticParams() {
  return OPPORTUNITIES.map(({ id }) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getOpportunity(id)) notFound();
  return <OpportunityDetailPage id={id} />;
}
