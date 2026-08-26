import RoleDetailPage from "@/features/admin/access/components/RoleDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function RoleDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <RoleDetailPage roleId={id} />;
}
