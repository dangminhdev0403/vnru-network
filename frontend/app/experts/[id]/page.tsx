import ExpertDetail from "../../../features/experts/components/ExpertDetail";
import { getExpertById, getExpertMatches } from "../../../features/experts/repository";
import PublicHeader from "@/components/shared/PublicHeader";
import { notFound } from "next/navigation";

export default async function ExpertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [expertResult, matchesResult] = await Promise.all([
    getExpertById(id),
    getExpertMatches(id),
  ]);

  if (expertResult.status === "error" && expertResult.kind === "not_found") {
    notFound();
  }

  return (
    <>
      <PublicHeader />
      <ExpertDetail expertResult={expertResult} matchesResult={matchesResult} id={id} />
    </>
  );
}
