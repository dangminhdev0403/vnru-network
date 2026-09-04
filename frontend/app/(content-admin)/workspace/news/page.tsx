import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getRouteMetadata } from "@/core/i18n/metadata";
import { requireWorkspaceSession } from "@/features/auth/workspace-server";
import { AdminNewsStudio } from "@/features/news/AdminNewsStudio";

export function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata("newsAdmin");
}

export default async function Page() {
  const capabilities = await requireWorkspaceSession("/workspace/news");
  if (!capabilities.some((item) => item.startsWith("content.article."))) {
    redirect("/workspace");
  }
  return <AdminNewsStudio />;
}

