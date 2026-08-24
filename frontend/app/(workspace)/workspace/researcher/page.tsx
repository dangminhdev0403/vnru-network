import type { Metadata } from 'next';
import { ResearcherInteractiveWorkspace } from '@/features/workspace/demo-v2/ResearcherInteractiveWorkspace';
import { requireWorkspaceCapability } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'Nhà nghiên cứu (Researcher) · VN–RU Network',
  description: 'Không gian nghiên cứu song phương Việt - Nga'
};

export default async function Page() {
  await requireWorkspaceCapability('/workspace/researcher', ['collab.proposals.create']);
  return <ResearcherInteractiveWorkspace />;
}
