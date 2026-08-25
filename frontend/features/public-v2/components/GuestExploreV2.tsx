"use client";

import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { GuestPublicNav } from "./GuestPublicNav";

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    lead: string;
    open: string;
    areas: { href: string; index: string; title: string; description: string }[];
  }
> = {
  vi: {
    eyebrow: "Không gian khám phá công khai",
    title: "Khám phá mạng lưới tri thức Nga - Việt",
    lead:
      "Một điểm truy cập chung tới các cơ hội hợp tác, hồ sơ chuyên gia và nguồn tri thức khoa học song phương.",
    open: "Mở khu vực",
    areas: [
      {
        href: "/opportunities",
        index: "01",
        title: "Hợp tác",
        description:
          "Khám phá các chương trình, lời mời nghiên cứu và điểm bắt đầu cho hợp tác song phương.",
      },
      {
        href: "/experts",
        index: "02",
        title: "Chuyên gia",
        description:
          "Tìm kiếm nhà khoa học theo chuyên môn, tổ chức và định hướng nghiên cứu.",
      },
      {
        href: "/knowledge",
        index: "03",
        title: "Tri thức",
        description:
          "Tra cứu chuyên đề, công bố, dữ liệu và báo cáo khoa học Nga - Việt.",
      },
    ],
  },
  en: {
    eyebrow: "Public discovery space",
    title: "Explore the Russia - Vietnam Knowledge Network",
    lead:
      "One gateway to bilateral collaboration opportunities, expert profiles, and scientific knowledge resources.",
    open: "Open area",
    areas: [
      {
        href: "/opportunities",
        index: "01",
        title: "Collaboration",
        description:
          "Explore programmes, research calls, and starting points for bilateral cooperation.",
      },
      {
        href: "/experts",
        index: "02",
        title: "Experts",
        description:
          "Find researchers by expertise, institution, and scientific direction.",
      },
      {
        href: "/knowledge",
        index: "03",
        title: "Knowledge",
        description:
          "Browse bilateral topics, publications, datasets, and scientific reports.",
      },
    ],
  },
  ru: {
    eyebrow: "Открытое пространство поиска",
    title: "Российско-вьетнамская сеть знаний",
    lead:
      "Единая точка доступа к возможностям сотрудничества, профилям экспертов и научным ресурсам двух стран.",
    open: "Открыть раздел",
    areas: [
      {
        href: "/opportunities",
        index: "01",
        title: "Сотрудничество",
        description:
          "Программы, научные конкурсы и возможности для двустороннего сотрудничества.",
      },
      {
        href: "/experts",
        index: "02",
        title: "Эксперты",
        description:
          "Поиск исследователей по компетенциям, организациям и научным направлениям.",
      },
      {
        href: "/knowledge",
        index: "03",
        title: "Знания",
        description:
          "Темы, публикации, наборы данных и научные отчёты России и Вьетнама.",
      },
    ],
  },
};

export function GuestExploreV2() {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;

  return (
    <div className="min-h-screen bg-[#ebf4ff] text-slate-950">
      <GuestPublicNav active="explore" />
      <main>
        <section className="relative overflow-hidden border-b border-blue-200/80 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,.22),transparent_38%),linear-gradient(180deg,#dbeafe_0%,#eff6ff_55%,#e1effe_100%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(59,130,246,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.045)_1px,transparent_1px)] [background-size:42px_42px]" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1280px]">
            <p className="text-sm font-black uppercase leading-[1.2] tracking-[0.14em] text-blue-700">
              {t.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-balance font-serif text-4xl font-semibold leading-[1.2] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700">
              {t.lead}
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto grid max-w-[1280px] gap-5 lg:grid-cols-3">
            {t.areas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group flex min-h-72 flex-col justify-between rounded-2xl border border-blue-200/80 bg-white/90 p-7 shadow-[0_16px_40px_-32px_rgba(37,99,235,.45)] transition duration-200 hover:-translate-y-1 hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
              >
                <span className="text-sm font-black leading-[1.2] tracking-[0.14em] text-blue-700">
                  {area.index}
                </span>
                <div className="mt-12">
                  <h2 className="font-serif text-3xl font-semibold leading-[1.2] group-hover:text-blue-700">
                    {area.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-600">
                    {area.description}
                  </p>
                  <span className="mt-7 inline-flex min-h-11 items-center text-base font-bold uppercase leading-[1.2] text-blue-700">
                    {t.open} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
