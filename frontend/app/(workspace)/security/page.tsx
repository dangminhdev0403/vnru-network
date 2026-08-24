import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SecurityClientPage from "@/features/auth/components/security/SecurityClientPage";
import { SESSION_COOKIE_NAME } from "@/features/auth/server";

export default async function SecurityPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get(SESSION_COOKIE_NAME)?.value) {
    redirect("/api/auth/login?returnTo=/security");
  }
  return <SecurityClientPage />;
}
