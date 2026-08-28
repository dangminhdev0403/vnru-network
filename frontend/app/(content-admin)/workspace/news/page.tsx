import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireWorkspaceSession } from "@/features/auth/workspace-server";
import { AdminNewsStudio } from "@/features/news/AdminNewsStudio";

export const metadata: Metadata = { title: "Quản lý tin tức · RU-VN Network" };

export default async function Page() {
  const capabilities = await requireWorkspaceSession("/workspace/news");
  if (!capabilities.some((item) => item.startsWith("content.article."))) {
    redirect("/workspace");
  }
  return <AdminNewsStudio />;
}

