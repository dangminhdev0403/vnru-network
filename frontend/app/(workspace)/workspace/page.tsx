import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSystemAdministrator, resolveLandingPath } from "@/features/auth/server";
import { requireWorkspaceSession } from "@/features/auth/workspace-server";
import { UnifiedWorkspaceDashboard } from "@/features/workspace/components/UnifiedWorkspaceDashboard";

export const metadata: Metadata = {
  title: "Không gian thành viên · VN–RU Network",
  description: "Trung tâm công việc thống nhất cho vòng đời nghiên cứu Việt Nam – Liên bang Nga.",
};

export default async function Page() {
  const capabilities = await requireWorkspaceSession("/workspace");
  if (isSystemAdministrator(capabilities)) redirect("/admin/access");
  if (resolveLandingPath(capabilities) !== "/workspace") redirect("/account");
  return <UnifiedWorkspaceDashboard capabilities={capabilities} />;
}
