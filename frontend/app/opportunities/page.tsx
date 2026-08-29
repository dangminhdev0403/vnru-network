import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Cơ hội · RU-VN Network" };

export default function Page() {
  redirect("/news?type=OPPORTUNITY");
}
