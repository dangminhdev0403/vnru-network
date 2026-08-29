import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GuestEcosystemV2 } from "@/features/public-v2/components/GuestEcosystemV2";
import {
  getCurrentSession,
  resolveLandingPath,
  SESSION_COOKIE_NAME,
} from "@/features/auth/server";

export const metadata: Metadata = {
  title: "Hệ sinh thái | Mạng lưới RU-VN",
  description:
    "Chương trình tài trợ khoa học, dự án Khai sáng và thư viện tri thức song phương Việt Nam – Liên bang Nga.",
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
