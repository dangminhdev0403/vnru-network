import type { Metadata } from 'next';
import { OrganizationInteractiveWorkspace } from '@/features/workspace/demo-v2/OrganizationInteractiveWorkspace';
import { requireWorkspaceCapability } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'Đại diện Tổ chức (Organization) · VN–RU Network',
  description: 'Thẩm định hồ sơ và xác nhận phạm vi tổ chức trong không gian hợp tác song phương'
};

export default async function Page() {
  await requireWorkspaceCapability('/workspace/organization', ['collab.proposals.endorse']);
  return <OrganizationInteractiveWorkspace />;
}
