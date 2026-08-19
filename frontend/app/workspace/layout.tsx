import type { Metadata } from "next";
import WorkspaceShell from "../../components/shared/WorkspaceShell";

export const metadata: Metadata = {
  title: "Workspace | RU–VN Portal",
  description: "Authenticated RU–VN knowledge, IAM, and collaboration workspace.",
};

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
