import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentSession, sanitizeReturnTo, SESSION_COOKIE_NAME } from "../../features/auth/server";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { returnTo } = await searchParams;
  const destination = sanitizeReturnTo(typeof returnTo === "string" ? returnTo : undefined);
  const session = await getCurrentSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  redirect(session ? destination : `/api/auth/login?returnTo=${encodeURIComponent(destination)}`);
}
