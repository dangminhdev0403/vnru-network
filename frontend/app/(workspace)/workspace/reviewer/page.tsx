import type { Metadata } from 'next';
import { ReviewerTaskWorkspace } from '@/features/workspace/components/ReviewerTaskWorkspace';
import { requireWorkspaceCapability } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'Hội đồng Phản biện (Reviewer) · VN–RU Network',
  description: 'Đánh giá hồ sơ phản biện ẩn danh với rubric chấm điểm đa tiêu chí'
};

export default async function Page() {
  await requireWorkspaceCapability('/workspace/reviewer', ['reviews.assignments.view_assigned']);
  return <ReviewerTaskWorkspace />;
}
