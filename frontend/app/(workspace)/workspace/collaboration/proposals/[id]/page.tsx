import { notFound } from "next/navigation";
import { ProposalDetail } from "@/features/collaboration/components/ProposalDetail";

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return notFound();
  return <ProposalDetail id={id} />;
}
