import type { Metadata } from "next";
import { GuestAboutV2 } from "@/features/public-v2/components/GuestAboutV2";

export const metadata: Metadata = {
  title: "Kết nối tri thức, kiến tạo tương lai | Mạng lưới tri thức Nga - Việt",
  description:
    "Cầu nối tri thức bền vững giữa Việt Nam và Liên bang Nga.",
};

export default function Page() {
  return <GuestAboutV2 />;
}
