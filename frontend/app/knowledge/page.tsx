import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Ấn phẩm · RU-VN Network" };

export default function Page() {
  redirect("/news?type=PUBLICATION");
}
