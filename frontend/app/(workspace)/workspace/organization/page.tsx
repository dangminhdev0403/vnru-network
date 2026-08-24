import type { Metadata } from 'next';
import { OrganizationWorkspace } from '@/features/prototype-v3/components/OrganizationWorkspace';
import { requireWorkspaceCapability } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'Đại diện Tổ chức (Organization) · VN–RU Network',
  description: 'Thẩm định hồ sơ và cấp xác nhận bảo trợ cơ sở vật chất VAST'
};

export default async function Page() {
  await requireWorkspaceCapability('/workspace/organization', ['collab.proposals.endorse']);
  return <OrganizationWorkspace />;
}
