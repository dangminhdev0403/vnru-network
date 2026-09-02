"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useLocale, type Locale } from "@/core/i18n/locale";

type SurfaceKey = "news" | "knowledge" | "experts" | "opportunities";

const surfaces: Record<SurfaceKey, { href: string; icon: string }> = {
  news: { href: "/news", icon: "newspaper" },
  knowledge: { href: "/knowledge", icon: "library_books" },
  experts: { href: "/experts", icon: "groups" },
  opportunities: { href: "/opportunities", icon: "campaign" },
};

const copy: Record<
  Locale,
  {
    title: string;
    description: string;
    open: string;
    surface: Record<SurfaceKey, [string, string]>;
  }
> = {
  vi: {
    title: "Thông tin dành cho thành viên mạng lưới",
    description:
      "Theo dõi tin tức, tra cứu kho tri thức, tìm chuyên gia và xem thông tin tuyển chọn đề tài trong một nơi.",
    open: "Mở",
    surface: {
      news: [
        "Tin tức & sự kiện",
        "Cập nhật hoạt động, thông báo và sự kiện của mạng lưới.",
      ],
      knowledge: [
        "Kho tri thức",
        "Tra cứu tài liệu, dữ liệu nghiên cứu và công bố khoa học.",
      ],
      experts: [
        "Mạng lưới chuyên gia",
        "Tìm chuyên gia và tổ chức theo lĩnh vực chuyên môn.",
      ],
      opportunities: [
        "Tuyển chọn đề tài",
        "Xem chương trình, điều kiện và thời hạn tuyển chọn.",
      ],
    },
  },
  en: {
    title: "Information for network members",
    description:
      "Follow news, browse knowledge, find experts, and review research calls in one place.",
    open: "Open",
    surface: {
      news: [
        "News & events",
        "Follow network activities, announcements, and events.",
      ],
      knowledge: [
        "Knowledge base",
        "Browse research resources, datasets, and publications.",
      ],
      experts: ["Expert network", "Find experts and organizations by field."],
      opportunities: [
        "Research calls",
        "Review programmes, eligibility, and deadlines.",
      ],
    },
  },
  ru: {
    title: "Информация для участников сети",
    description:
      "Новости, база знаний, эксперты и конкурсы исследовательских проектов в одном месте.",
    open: "Открыть",
    surface: {
      news: ["Новости и события", "События, объявления и деятельность сети."],
      knowledge: [
        "База знаний",
        "Материалы, исследовательские данные и публикации.",
      ],
      experts: [
        "Сеть экспертов",
        "Поиск экспертов и организаций по направлениям.",
      ],
      opportunities: [
        "Конкурсы проектов",
        "Программы, условия участия và сроки подачи.",
      ],
    },
  },
};

export function UnifiedWorkspaceDashboard() {
  const { locale } = useLocale();
  const t = copy[locale] || copy.vi;

  return (
    <motion.main
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12"
    >
      <header className="max-w-3xl border-b border-card-border pb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-[70ch] text-base leading-7 text-slate-600">
          {t.description}
        </p>
      </header>

      <nav className="divide-y divide-card-border" aria-label={t.title}>
        {(Object.keys(surfaces) as SurfaceKey[]).map((key, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
          >
            <Link
              href={surfaces[key].href}
              className="group grid gap-4 py-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center"
            >
              <span
                className="grid size-12 place-items-center rounded-lg bg-blue-50 text-blue-700 transition-transform duration-200 group-hover:scale-105"
                aria-hidden="true"
              >
                <span className="material-symbols-outlined">
                  {surfaces[key].icon}
                </span>
              </span>
              <span>
                <strong className="block font-serif text-xl font-semibold text-slate-950 group-hover:text-blue-800">
                  {t.surface[key][0]}
                </strong>
                <span className="mt-1 block text-base leading-7 text-slate-600">
                  {t.surface[key][1]}
                </span>
              </span>
              <span className="text-base font-bold text-blue-700 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-800">
                {t.open} →
              </span>
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.main>
  );
}
