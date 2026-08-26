import type { Metadata } from "next";
import { requireMemberSession } from "@/features/auth/workspace-server";
import { GuestOpportunitiesV2 } from "@/features/public-v2/components/GuestOpportunitiesV2";

export const metadata: Metadata = { title: "Tuyển chọn đề tài · VN–RU Network" };

export default async function Page() {
  await requireMemberSession("/opportunities");
  return <GuestOpportunitiesV2 />;
}
