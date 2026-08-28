import type { Metadata } from "next";
import { requireMemberSession } from "@/features/auth/workspace-server";
import { GuestExpertsV2 } from "@/features/public-v2/components/GuestExpertsV2";

export const metadata: Metadata = { title: "Mạng lưới chuyên gia · RU-VN Network" };

export default async function Page() {
  await requireMemberSession("/experts");
  return <GuestExpertsV2 />;
}
