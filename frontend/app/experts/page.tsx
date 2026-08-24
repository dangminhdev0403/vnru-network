import type { Metadata } from "next";
import { ExpertsIndexPage } from "@/features/public-discovery/components/PublicDiscoveryPages";

export const metadata: Metadata = { title: "Chuyên gia | VN–RU Network", description: "Public preview of experts across the Vietnam–Russia knowledge network." };

export default function Page() {
  return <ExpertsIndexPage />;
}
