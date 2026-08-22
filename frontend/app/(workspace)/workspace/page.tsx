import { getExperts, getPublications } from "@/features/knowledge/repositories/module2.repository";
import DashboardView from "@/features/workspace/components/DashboardView";

export default async function WorkspacePage() {
  const [publications, experts] = await Promise.all([getPublications({ limit: "3" }), getExperts({ limit: "3" })]);
  return <DashboardView publications={publications} experts={experts} />;
}
