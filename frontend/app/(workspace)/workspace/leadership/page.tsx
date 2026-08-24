import type { Metadata } from 'next';
import { LeadershipWorkspace } from '@/features/prototype-v3/components/LeadershipWorkspace';
import { requireWorkspaceCapability } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'Lãnh đạo Chiến lược (Leadership) · VN–RU Network',
  description: 'Trung tâm báo cáo chiến lược và phân tích dữ liệu hợp tác khoa học vĩ mô'
};

export default async function Page() {
  await requireWorkspaceCapability('/workspace/leadership', ['collab.decisions.issue_foundation']);
  return <LeadershipWorkspace />;
}
