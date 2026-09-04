import type { Metadata } from "next";
import { getRouteMetadata } from "@/core/i18n/metadata";
import { requireMemberSession } from "@/features/auth/workspace-server";
import { UnifiedWorkspaceDashboard } from "@/features/workspace/components/UnifiedWorkspaceDashboard";

export function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata("workspace");
}

export default async function Page() {
  await requireMemberSession("/workspace");
  return <UnifiedWorkspaceDashboard />;
}
