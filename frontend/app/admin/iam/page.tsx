import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "../../../features/auth/server";
import IamClientPage from "./IamClientPage";

type View = "overview" | "roles" | "assignments";

export default async function IamAdminPage({ searchParams }: Readonly<{ searchParams: Promise<{ view?: string }> }>) {
  const session = (await cookies()).get(SESSION_COOKIE_NAME);
  if (!session?.value) redirect("/api/auth/login?returnTo=/admin/iam");

  const requestedView = (await searchParams).view;
  const initialView: View = requestedView === "roles" || requestedView === "assignments" ? requestedView : "overview";
  return <IamClientPage initialView={initialView} />;
}
