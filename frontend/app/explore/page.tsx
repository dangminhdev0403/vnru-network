import type { Metadata } from "next";
import { GuestExploreV2 } from "@/features/public-v2/components/GuestExploreV2";

export const metadata: Metadata = {
  title: "Tin tức | Mạng lưới tri thức Nga - Việt",
  description:
    "Tin tức khoa học, công nghệ, hợp tác quốc tế, đổi mới sáng tạo, giáo dục và dòng tin liên tục Nga - Việt.",
};

export default function Page() {
  return <GuestExploreV2 />;
}
