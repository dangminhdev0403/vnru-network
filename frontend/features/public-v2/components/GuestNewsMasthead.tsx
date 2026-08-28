"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";

const COPY: Record<
  Locale,
  {
    title: string;
    lead: string;
    live: string;
    stats: readonly { value: string; label: string }[];
  }
> = {
  vi: {
    title: "Tin tức",
    lead: "Theo dõi những chuyển động mới nhất về khoa học, công nghệ, đổi mới sáng tạo và hợp tác tri thức Nga - Việt.",
    live: "Cập nhật liên tục",
    stats: [
      { value: "04", label: "Chuyên mục" },
      { value: "24/7", label: "Cập nhật" },
      { value: "VN · RU", label: "Song phương" },
    ],
  },
  en: {
    title: "News",
    lead: "Follow the latest developments in science, technology, innovation and Vietnam - Russia knowledge cooperation.",
    live: "Continuous updates",
    stats: [
      { value: "04", label: "Categories" },
      { value: "24/7", label: "Updates" },
      { value: "VN · RU", label: "Bilateral" },
    ],
  },
  ru: {
    title: "Новости",
    lead: "Следите за последними новостями науки, технологий, инноваций и российско-вьетнамского сотрудничества.",
    live: "Постоянное обновление",
    stats: [
      { value: "04", label: "Рубрики" },
      { value: "24/7", label: "Обновление" },
      { value: "VN · RU", label: "Партнерство" },
    ],
  },
};

export function GuestNewsMasthead() {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;

  return (
    <section className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-black uppercase tracking-[-0.03em] text-blue-600 sm:text-4xl">
            {t.title}
          </h1>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-extrabold uppercase text-emerald-700">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {t.live}
          </span>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          {t.lead}
        </p>
      </div>

      <div className="grid w-full grid-cols-3 overflow-hidden rounded-2xl border border-blue-100 bg-white xl:w-auto">
        {t.stats.map((stat, index) => (
          <div
            key={stat.value}
            className={`min-w-0 px-3 py-4 text-center sm:px-6 xl:min-w-40 ${
              index ? "border-l border-blue-100" : ""
            }`}
          >
            <strong className="block text-xl font-black text-blue-600">
              {stat.value}
            </strong>
            <span className="mt-1 block text-sm font-bold uppercase leading-tight text-slate-500">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
