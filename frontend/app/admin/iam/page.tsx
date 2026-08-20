import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "../../../features/auth/server";
import IamClientPage from "./IamClientPage";
import WorkspaceShell from "../../../components/shared/WorkspaceShell";

export default async function IamAdminPage() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME);
  if (!session?.value) redirect("/api/auth/login?returnTo=/admin/iam");
  return (
    <WorkspaceShell>
      <IamClientPage />
    </WorkspaceShell>
  );
}
