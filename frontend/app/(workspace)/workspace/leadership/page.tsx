import type { Metadata } from 'next';
import { LeadershipWorkspace } from '@/features/prototype-v3/components/LeadershipWorkspace';
import { requireWorkspaceSession } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'UI Preview · Phân tích Leadership · VN–RU Network',
  description: 'Bản xem trước báo cáo chiến lược và phân tích dữ liệu hợp tác khoa học vĩ mô'
};

export default async function Page() {
  await requireWorkspaceSession('/workspace/leadership');
  return <LeadershipWorkspace />;
}
