import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getRouteMetadata } from "@/core/i18n/metadata";

export function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata("opportunities");
}

export default function Page() {
  redirect("/news?type=OPPORTUNITY");
}
