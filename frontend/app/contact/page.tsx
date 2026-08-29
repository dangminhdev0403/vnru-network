import type { Metadata } from "next";
import { GuestContactV2 } from "@/features/public-v2/components/GuestContactV2";

export const metadata: Metadata = {
  title: "Liên hệ | Mạng lưới RU-VN",
  description: "Thông tin liên hệ chính thức của Mạng lưới RU-VN.",
};

export default function Page() {
  return <GuestContactV2 />;
}
