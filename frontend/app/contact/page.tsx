import type { Metadata } from "next";
import { GuestContactV2 } from "@/features/public-v2/components/GuestContactV2";

export const metadata: Metadata = {
  title: "Liên hệ & Hợp tác | Mạng lưới Tri thức Nga - Việt",
  description:
    "Cổng kết nối và liên hệ hợp tác khoa học công nghệ, giáo dục đào tạo giữa các viện nghiên cứu, trường đại học Việt Nam và Liên bang Nga.",
};

export default function Page() {
  return <GuestContactV2 />;
}
