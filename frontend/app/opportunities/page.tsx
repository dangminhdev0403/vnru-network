import type { Metadata } from "next";
import { OpportunitiesIndexPage } from "@/features/public-discovery/components/PublicDiscoveryPages";

export const metadata: Metadata = { title: "Cơ hội nghiên cứu | VN–RU Network", description: "Public preview of bilateral research collaboration opportunities." };

export default function Page() {
  return <OpportunitiesIndexPage />;
}
