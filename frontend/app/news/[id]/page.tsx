import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuestNewsArticleV2 } from "@/features/public-v2/components/GuestNewsArticleV2";

const VALID_IDS = new Set(Array.from({ length: 28 }, (_, index) => String(index + 1)));

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Bài viết #${id} | Mạng lưới tri thức Nga - Việt`,
    description:
      "Bài viết khoa học, công nghệ, hợp tác quốc tế và đổi mới sáng tạo trên Mạng lưới tri thức Nga - Việt.",
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  if (!VALID_IDS.has(id)) {
    notFound();
  }

  return <GuestNewsArticleV2 articleId={Number(id)} />;
}
