import type { Metadata } from "next";
import { requireMemberSession } from "@/features/auth/workspace-server";
import { GuestKnowledgeV2 } from "@/features/public-v2/components/GuestKnowledgeV2";

export const metadata: Metadata = { title: "Kho tri thức · VN–RU Network" };

export default async function Page() {
  await requireMemberSession("/knowledge");
  return <GuestKnowledgeV2 />;
}
