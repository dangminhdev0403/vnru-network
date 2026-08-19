import { redirect } from "next/navigation";
import { sanitizeReturnTo } from "../../features/auth/server";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { returnTo } = await searchParams;
  redirect(`/api/auth/login?returnTo=${encodeURIComponent(sanitizeReturnTo(typeof returnTo === "string" ? returnTo : undefined))}`);
}
