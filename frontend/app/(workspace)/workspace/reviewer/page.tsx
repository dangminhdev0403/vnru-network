import type { Metadata } from 'next';
import { ReviewerWorkspace } from '@/features/prototype-v3/components/ReviewerWorkspace';

export const metadata: Metadata = {
  title: 'Hội đồng Phản biện (Reviewer) · VN–RU Network',
  description: 'Đánh giá hồ sơ phản biện ẩn danh với rubric chấm điểm đa tiêu chí'
};

export default function Page() {
  return <ReviewerWorkspace />;
}
