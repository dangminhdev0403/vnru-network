import type { Metadata } from "next";
import { getRouteMetadata } from "@/core/i18n/metadata";
import { NotFoundClient } from "./NotFoundClient";

export function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata("notFound");
}

export default function NotFound() {
  return <NotFoundClient />;
}
