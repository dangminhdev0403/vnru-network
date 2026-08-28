import AdminShell from "@/features/admin/components/AdminShell";

export default function ContentAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell area="content">{children}</AdminShell>;
}
