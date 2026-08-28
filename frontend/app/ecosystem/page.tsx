import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GuestEcosystemV2 } from "@/features/public-v2/components/GuestEcosystemV2";
import {
  getCurrentSession,
  resolveLandingPath,
  SESSION_COOKIE_NAME,
} from "@/features/auth/server";

export const metadata: Metadata = {
  title: "Hệ sinh thái hợp tác | Mạng lưới tri thức Nga - Việt",
  description:
    "Khám phá chuyên gia, tổ chức, dự án, cơ hội hợp tác và nguồn tri thức Việt – Nga.",
};

export default async function Page() {
  const session = (await getCurrentSession(
    (await cookies()).get(SESSION_COOKIE_NAME)?.value,
  )) as { capabilities?: string[] } | null;
  const capabilities = Array.isArray(session?.capabilities)
    ? session.capabilities
    : [];

  return (
    <GuestEcosystemV2
      isAuthenticated={Boolean(session)}
      workspaceHref={session ? resolveLandingPath(capabilities) : "/account"}
    />
  );
}
