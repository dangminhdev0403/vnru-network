import { notFound } from "next/navigation";
import { ReviewDetail } from "@/features/reviews/components/ReviewDetail";

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return notFound();
  return <ReviewDetail id={id} />;
}
