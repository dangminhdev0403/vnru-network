import type { Metadata } from "next";
import { getRouteMetadata } from "@/core/i18n/metadata";
import { GuestContactV2 } from "@/features/public-v2/components/GuestContactV2";

export function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata("contact");
}

export default function Page() {
  return <GuestContactV2 />;
}
