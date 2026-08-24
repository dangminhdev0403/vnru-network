import type { Metadata } from 'next';
import { EnterpriseWorkspace } from '@/features/prototype-v3/components/EnterpriseWorkspace';
import { requireWorkspaceCapability } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'Đại diện Doanh nghiệp (Enterprise 2+2) · VN–RU Network',
  description: 'Mô hình liên danh 2+2 giữa viện trường và doanh nghiệp Việt - Nga'
};

export default async function Page() {
  await requireWorkspaceCapability('/workspace/enterprise', ['collab.opportunities.create']);
  return <EnterpriseWorkspace />;
}
