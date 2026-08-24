import type { Metadata } from 'next';
import { PrototypeHub } from '@/features/prototype-v3/components/PrototypeHub';

export const metadata: Metadata = {
  title: 'Workspace Control Center · VN–RU Network',
  description: 'Trung tâm điều phối không gian làm việc và vai trò theo mô hình Prototype V3.'
};

export default function Page() {
  return <PrototypeHub />;
}
