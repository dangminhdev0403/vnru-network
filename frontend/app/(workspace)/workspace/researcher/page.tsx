import type { Metadata } from 'next';
import { ResearcherTaskWorkspace } from '@/features/workspace/components/ResearcherTaskWorkspace';
import { requireWorkspaceCapability } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'Nhà nghiên cứu (Researcher) · VN–RU Network',
  description: 'Không gian nghiên cứu song phương Việt - Nga'
};

export default async function Page() {
  await requireWorkspaceCapability('/workspace/researcher', ['collab.proposals.create']);
  return <ResearcherTaskWorkspace />;
}
