import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountClientPage from "@/features/auth/components/account/AccountClientPage";
import { SESSION_COOKIE_NAME } from "@/features/auth/server";

export default async function AccountPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get(SESSION_COOKIE_NAME)?.value) {
    redirect("/api/auth/login?returnTo=/account");
  }
  return <AccountClientPage />;
}
