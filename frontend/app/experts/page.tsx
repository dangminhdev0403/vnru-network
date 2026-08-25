import type { Metadata } from "next";
import { GuestExpertsV2 } from "@/features/public-v2/components/GuestExpertsV2";

export const metadata: Metadata = {
  title: "Chuyên gia | Mạng lưới tri thức Nga - Việt",
  description: "Khám phá chuyên gia trong Mạng lưới tri thức Nga - Việt.",
};

export default function Page() {
  return <GuestExpertsV2 />;
}
