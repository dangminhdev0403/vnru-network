import type { Metadata } from "next";
import { requireMemberSession } from "@/features/auth/workspace-server";
import { ContentPublishStudio } from "@/features/workspace/components/ContentPublishStudio";

export const metadata: Metadata = {
  title: "Soạn & Quản lý bài đăng · VN–RU Network",
  description:
    "Soạn thảo bài viết, tải đính kèm tài liệu và gửi duyệt xuất bản trên mạng lưới tri thức Việt - Nga.",
};

export default async function PublishPage() {
  await requireMemberSession("/workspace/publish");
  return <ContentPublishStudio />;
}
