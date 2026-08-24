import type { Metadata } from "next";
import { CollaborationManagerInteractiveWorkspace } from "@/features/workspace/components/CollaborationManagerInteractiveWorkspace";
import { requireWorkspaceCapability } from "@/features/auth/workspace-server";

export const metadata: Metadata = {
  title: "Điều phối hợp tác · VN–RU Network",
  description: "Điều phối cơ hội, sàng lọc đề xuất, phân công phản biện và báo cáo trong UI Preview",
};

export default async function Page() {
  await requireWorkspaceCapability("/workspace/collaboration", ["collab.opportunities.create"]);
  return <CollaborationManagerInteractiveWorkspace />;
}
