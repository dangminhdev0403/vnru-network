import type { Metadata } from 'next';
import { EnterpriseWorkspace } from '@/features/prototype-v3/components/EnterpriseWorkspace';
import { requireWorkspaceSession } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'UI Preview · Liên danh Enterprise 2+2 · VN–RU Network',
  description: 'Bản xem trước mô hình liên danh 2+2 giữa viện trường và doanh nghiệp Việt - Nga'
};

export default async function Page() {
  await requireWorkspaceSession('/workspace/enterprise');
  return <EnterpriseWorkspace />;
}
