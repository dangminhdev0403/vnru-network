import type { Metadata } from "next";
import { getRouteMetadata } from "@/core/i18n/metadata";
import { requireMemberSession } from "@/features/auth/workspace-server";
import { GuestExpertsV2 } from "@/features/public-v2/components/GuestExpertsV2";

export function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata("experts");
}

export default async function Page() {
  await requireMemberSession("/experts");
  return <GuestExpertsV2 />;
}
