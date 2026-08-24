import type { Metadata } from 'next';
import { ResearcherWorkspace } from '@/features/prototype-v3/components/ResearcherWorkspace';

export const metadata: Metadata = {
  title: 'Nhà nghiên cứu (Researcher) · VN–RU Network',
  description: 'Không gian nghiên cứu song phương Việt - Nga'
};

export default function Page() {
  return <ResearcherWorkspace />;
}
