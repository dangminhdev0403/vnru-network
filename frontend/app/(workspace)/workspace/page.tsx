import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { resolveLandingPath } from "@/features/auth/server";
import { requireWorkspaceSession } from "@/features/auth/workspace-server";

export const metadata: Metadata = {
  title: 'Workspace Control Center · VN–RU Network',
  description: 'Trung tâm điều phối không gian làm việc và vai trò theo mô hình Prototype V3.'
};

export default async function Page() {
  const capabilities = await requireWorkspaceSession("/workspace");
  redirect(resolveLandingPath(capabilities));
}
