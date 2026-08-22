"use client";

import Link from "next/link";
import { useLocale } from "@/app/HomeMotion";

const dict: Record<string, { title: string; intro: string; opps: [string, string]; reviews: [string, string]; projects: [string, string] }> = {
  vi: { title: "Trung tâm Hợp tác", intro: "Theo dõi toàn bộ vòng đời từ cơ hội tài trợ đến phản biện và triển khai dự án.", opps: ["Cơ hội", "Khám phá và quản lý chương trình tài trợ"], reviews: ["Phân công phản biện", "Khai báo xung đột và gửi đánh giá ẩn danh"], projects: ["Dự án", "Theo dõi nhóm, mốc tiến độ, báo cáo và kết quả"] },
  en: { title: "Collaboration Hub", intro: "Follow the complete lifecycle from funding opportunities through reviews and project delivery.", opps: ["Opportunities", "Discover and manage funding programmes"], reviews: ["Review Assignments", "Declare conflicts and submit anonymous evaluations"], projects: ["Projects", "Track teams, milestones, reports, and outcomes"] },
  ru: { title: "Центр сотрудничества", intro: "Полный цикл: конкурсы, рецензирование и реализация проектов.", opps: ["Возможности", "Поиск и управление программами финансирования"], reviews: ["Назначения на рецензирование", "Конфликты интересов и анонимная оценка"], projects: ["Проекты", "Команды, этапы, отчёты и результаты"] }
};

export function CollaborationHub() {
  const { locale } = useLocale();
  const t = dict[locale] ?? dict.vi;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <h1 className="text-2xl font-bold">{t.title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-text-secondary">{t.intro}</p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[["/workspace/collaboration/opportunities", t.opps], ["/workspace/collaboration/reviews", t.reviews], ["/workspace/collaboration/projects", t.projects]].map(([href, item]) => <Link key={href as string} href={href as string} className="app-panel block p-5 focus-visible:ring">
          <h2 className="text-lg font-semibold">{item[0]}</h2>
          <p className="mt-2 text-sm text-text-secondary">{item[1]}</p>
        </Link>)}
      </div>
    </div>
  );
}
