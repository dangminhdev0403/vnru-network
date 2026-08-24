import type { Metadata } from 'next';
import { ReviewerInteractiveWorkspace } from '@/features/workspace/components/ReviewerInteractiveWorkspace';
import { requireWorkspaceCapability } from '@/features/auth/workspace-server';

export const metadata: Metadata = {
  title: 'Hội đồng Phản biện (Reviewer) · VN–RU Network',
  description: 'Đánh giá hồ sơ phản biện ẩn danh với rubric chấm điểm đa tiêu chí'
};

export default async function Page() {
  await requireWorkspaceCapability('/workspace/reviewer', ['reviews.assignments.view_assigned']);
  return <ReviewerInteractiveWorkspace />;
}
