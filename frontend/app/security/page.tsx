import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "../../features/auth/server";
import SecurityClientPage from "./SecurityClientPage";
import WorkspaceShell from "../../components/shared/WorkspaceShell";

export default async function SecurityPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    redirect("/api/auth/login?returnTo=/security");
  }

  return (
    <WorkspaceShell>
      <SecurityClientPage />
    </WorkspaceShell>
  );
}
