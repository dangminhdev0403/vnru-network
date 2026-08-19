import type { Metadata } from "next";
import { NotFoundClient } from "./NotFoundClient";

export const metadata: Metadata = {
  title: "404 - Trang không tìm thấy | VN-RU Knowledge Network",
  description:
    "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển trên Cổng thông tin Mạng lưới tri thức Nga – Việt.",
};

export default function NotFound() {
  return <NotFoundClient />;
}
