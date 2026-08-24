import type { Metadata } from "next";
import { DecisionInteractiveWorkspace } from "@/features/workspace/components/DecisionInteractiveWorkspace";
import { requireWorkspaceCapability } from "@/features/auth/workspace-server";

export const metadata: Metadata = {
  title: "Quyết định chương trình · VN–RU Network",
  description: "Xem hồ sơ đã qua sàng lọc, phản biện và mô phỏng quyết định nghiệp vụ",
};

export default async function Page() {
  await requireWorkspaceCapability("/workspace/decisions", ["collab.decisions.issue_foundation"]);
  return <DecisionInteractiveWorkspace />;
}
