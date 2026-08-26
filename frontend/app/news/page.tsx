import type { Metadata } from "next";
import { GuestNewsV2 } from "@/features/public-v2/components/GuestNewsV2";

export const metadata: Metadata = {
  title: "Tin tức | Mạng lưới tri thức Nga - Việt",
  description:
    "Dòng tin khoa học, công nghệ, hợp tác quốc tế, giáo dục và đổi mới sáng tạo Nga - Việt.",
};

export default function Page() {
  return <GuestNewsV2 />;
}
