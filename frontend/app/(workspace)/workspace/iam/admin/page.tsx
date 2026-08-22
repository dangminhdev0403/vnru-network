import { redirect } from "next/navigation";

export default async function IamAdminPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ view?: string }> }>) {
  const requestedView = (await searchParams).view;
  if (requestedView === "roles") {
    redirect("/admin/access/roles");
  }
  if (requestedView === "overview") {
    redirect("/admin/access/users");
  }
  redirect("/admin/access");
}
