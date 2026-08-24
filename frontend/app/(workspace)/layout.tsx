import WorkspaceShell from "@/components/shared/WorkspaceShell";
import { DemoWorkflowProvider } from "@/features/workspace/demo-v2/DemoWorkflowProvider";

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <DemoWorkflowProvider>
      <WorkspaceShell>{children}</WorkspaceShell>
    </DemoWorkflowProvider>
  );
}
