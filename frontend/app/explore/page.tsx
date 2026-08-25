import type { Metadata } from "next";
import { GuestExploreV2 } from "@/features/public-v2/components/GuestExploreV2";

export const metadata: Metadata = {
  title: "Khám phá | Mạng lưới tri thức Nga - Việt",
  description: "Khám phá hợp tác, chuyên gia và tri thức khoa học Nga - Việt.",
};

export default function Page() {
  return <GuestExploreV2 />;
}
