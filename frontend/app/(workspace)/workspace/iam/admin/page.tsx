import { redirect } from "next/navigation";

export default function LegacyIamAdminPage() {
  redirect("/admin/access");
}
