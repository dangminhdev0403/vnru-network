import WorkspaceShell from "@/components/shared/WorkspaceShell";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
