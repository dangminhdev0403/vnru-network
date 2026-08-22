import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/features/auth/server";
import IamClientPage from "./IamClientPage";
import RolePermissionsPage from "./RolePermissionsPage";

type View = "overview" | "roles";

export default async function IamAdminPage({ searchParams }: Readonly<{ searchParams: Promise<{ view?: string }> }>) {
  const session = (await cookies()).get(SESSION_COOKIE_NAME);
  if (!session?.value) redirect("/api/auth/login?returnTo=/workspace/iam/admin");

  const requestedView = (await searchParams).view;
  const initialView: View = requestedView === "roles" ? "roles" : "overview";
  return initialView === "roles" ? <RolePermissionsPage /> : <IamClientPage initialView="overview" />;
}
