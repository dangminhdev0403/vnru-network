import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "../../../features/auth/server";
import IamClientPage from "./IamClientPage";

export default async function IamAdminPage() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME);
  if (!session?.value) redirect("/api/auth/login?returnTo=/admin/iam");
  return <IamClientPage />;
}
