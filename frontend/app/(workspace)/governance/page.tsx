import type { Metadata } from 'next';
import { GovernanceWorkspace } from '@/features/prototype-v3/components/GovernanceWorkspace';

export const metadata: Metadata = {
  title: 'Quản trị Hệ thống (Governance IAM) · VN–RU Network',
  description: 'Quản lý danh tính OIDC, ma trận phân quyền IAM và kiểm duyệt an toàn'
};

export default function Page() {
  return <GovernanceWorkspace />;
}
