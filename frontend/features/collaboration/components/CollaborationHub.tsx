"use client";

import Link from "next/link";
import { useLocale } from "@/app/HomeMotion";
import { useCurrentUser } from "@/features/auth/server-state";
import { hasCapability } from "@/features/workspace/config/workspace-registry";

const dict: Record<string, { title: string; intro: string; opps: [string, string]; reviews: [string, string]; projects: [string, string] }> = {
  vi: {
    title: "Trung tâm Hợp tác",
    intro: "Theo dõi vòng đời cộng tác từ cơ hội nghiên cứu, đề xuất song phương, phản biện đến triển khai dự án.",
    opps: ["Cơ hội cộng tác nghiên cứu", "Khám phá và quản lý các cơ hội nghiên cứu song phương"],
    reviews: ["Phân công phản biện", "Khai báo xung đột và gửi đánh giá ẩn danh"],
    projects: ["Dự án nghiên cứu", "Theo dõi nhóm, mốc tiến độ, báo cáo và kết quả"]
  },
  en: {
    title: "Collaboration Hub",
    intro: "Follow the research collaboration lifecycle from opportunities, bilateral proposals and reviews through project delivery.",
    opps: ["Research Collaboration Opportunities", "Discover and manage bilateral research opportunities"],
    reviews: ["Review Assignments", "Declare conflicts and submit anonymous evaluations"],
    projects: ["Research Projects", "Track teams, milestones, reports, and outcomes"]
  },
  ru: {
    title: "Центр сотрудничества",
    intro: "Полный цикл совместных исследований: от возможностей и двусторонних заявок до экспертизы и реализации проектов.",
    opps: ["Возможности сотрудничества", "Поиск и управление двусторонними научными возможностями"],
    reviews: ["Назначения на рецензирование", "Конфликты интересов и анонимная оценка"],
    projects: ["Научные проекты", "Команды, этапы, отчёты и результаты"]
  }
};

export function CollaborationHub() {
  const { locale } = useLocale();
  const t = dict[locale] ?? dict.vi;
  const currentUser = useCurrentUser();
  const capabilities = (currentUser.data as { capabilities?: string[] })?.capabilities ?? [];

  const cards: { href: string; item: [string, string]; requiredCapabilities: string[] }[] = [
    {
      href: "/workspace/collaboration/opportunities",
      item: t.opps,
      requiredCapabilities: ["collab.opportunities.create", "collab.opportunities.publish", "collab.proposals.create"],
    },
    {
      href: "/workspace/collaboration/reviews",
      item: t.reviews,
      requiredCapabilities: ["reviews.assignments.view_assigned", "reviews.assignments.manage"],
    },
    {
      href: "/workspace/collaboration/projects",
      item: t.projects,
      requiredCapabilities: ["projects.projects.view", "projects.projects.manage"],
    },
  ];

  const visibleCards = cards.filter((card) => hasCapability(capabilities, card.requiredCapabilities));

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <h1 className="text-2xl font-bold">{t.title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-text-secondary">{t.intro}</p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {visibleCards.map(({ href, item }) => (
          <Link key={href} href={href} className="app-panel block p-5 focus-visible:ring">
            <h2 className="text-lg font-semibold">{item[0]}</h2>
            <p className="mt-2 text-sm text-text-secondary">{item[1]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
