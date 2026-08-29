import type { Metadata } from "next";
import { GuestAboutV2 } from "@/features/public-v2/components/GuestAboutV2";

export const metadata: Metadata = {
  title: "Về chúng tôi | Mạng lưới RU-VN",
  description:
    "Mạng lưới Tri thức Việt Nam - Liên bang Nga kết nối giới trí thức, viện, trường và doanh nghiệp hai nước.",
};

export default function Page() {
  return <GuestAboutV2 />;
}
