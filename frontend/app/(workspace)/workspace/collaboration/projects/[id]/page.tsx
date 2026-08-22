import { notFound } from "next/navigation";
import { ProjectDetail } from "@/features/projects/components/ProjectDetail";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return notFound();
  return <ProjectDetail id={id} />;
}
