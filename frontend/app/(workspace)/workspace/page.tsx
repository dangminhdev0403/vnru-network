import type { Metadata } from "next";
import { requireMemberSession } from "@/features/auth/workspace-server";
import { UnifiedWorkspaceDashboard } from "@/features/workspace/components/UnifiedWorkspaceDashboard";

export const metadata: Metadata = {
  title: "Không gian thành viên · RU-VN Network",
  description: "Tin tức, tri thức, chuyên gia và thông tin tuyển chọn đề tài dành cho thành viên mạng lưới.",
};

export default async function Page() {
  await requireMemberSession("/workspace");
  return <UnifiedWorkspaceDashboard />;
}
