"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";

const COPY: Record<
  Locale,
  {
    title: string;
    lead: string;
  }
> = {
  vi: {
    title: "Tin tức",
    lead: "Theo dõi những chuyển động mới nhất về khoa học, công nghệ, đổi mới sáng tạo và hợp tác tri thức Nga - Việt.",
  },
  en: {
    title: "News",
    lead: "Follow the latest developments in science, technology, innovation and Vietnam - Russia knowledge cooperation.",
  },
  ru: {
    title: "Новости",
    lead: "Следите за последними новостями науки, технологий, инноваций и российско-вьетнамского сотрудничества.",
  },
};

export function GuestNewsMasthead() {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;

  return (
    <section className="mb-8">
      <h1 className="font-serif text-3xl font-black text-[#082352] sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-2.5 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
        {t.lead}
      </p>
    </section>
  );
}
