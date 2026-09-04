import type { Metadata } from "next";
import { getRouteMetadata } from "@/core/i18n/metadata";
import { GuestAboutV2 } from "@/features/public-v2/components/GuestAboutV2";

export function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata("about");
}

export default function Page() {
  return <GuestAboutV2 />;
}
