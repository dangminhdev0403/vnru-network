"use client";

import Link from "next/link";
import type { Locale } from "@/core/i18n/locale";
import { useLocale } from "@/core/i18n/locale";
import { formatDate } from "@/core/i18n/date-format";
import { localizeReactNode } from "@/core/i18n/localize-react-node";
import type { OfficialNewsArticle } from "../data/official-news";
import { formatNewsTitle, newsArticleHref } from "../data/official-news";
import { GuestPublicNav } from "./GuestPublicNav";
import { PUBLIC_STATIC_TRANSLATIONS } from "./public-static-translations";
import { Reveal } from "@/components/shared/Reveal";

const COPY: Record<
  Locale,
  { title: string; intro: string; empty: string; count: string }
> = {
  vi: {
    title: "Kho tri thức",
    intro: "Nội dung tri thức từ Mạng lưới tri thức Nga - Việt.",
    empty: "Chưa có nội dung tri thức.",
    count: "nội dung",
  },
  en: {
    title: "Knowledge library",
    intro: "Knowledge content from the Russia - Vietnam Knowledge Network.",
    empty: "No knowledge content yet.",
    count: "items",
  },
  ru: {
    title: "База знаний",
    intro: "Материалы Российско-вьетнамской сети знаний.",
    empty: "Материалов пока нет.",
    count: "материалов",
  },
};

const CATEGORY_LABELS: Record<string, Record<Locale, string>> = {
  "knowledge-article": { vi: "Bài báo", en: "Article", ru: "Статья" },
  "knowledge-journal": { vi: "Tạp chí", en: "Journal", ru: "Журнал" },
  "knowledge-invention": { vi: "Sáng chế", en: "Invention", ru: "Изобретение" },
};

export function GuestKnowledgeV2({
  articles,
  total,
}: Readonly<{ articles: OfficialNewsArticle[]; total: number }>) {
  const { locale } = useLocale();
  const t = COPY[locale];

  return localizeReactNode(
    <div className="min-h-screen bg-[#ebf4ff] text-slate-950">
      <GuestPublicNav active="knowledge" />
      <main>
        <section className="border-b border-blue-200/80 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,.22),transparent_38%),linear-gradient(180deg,#dbeafe_0%,#eff6ff_100%)] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            <Reveal y={12}>
              <p className="text-sm font-black uppercase tracking-[0.12em] text-blue-700">
                Mạng lưới tri thức Nga - Việt
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
                {t.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
                {t.intro}
              </p>
            </Reveal>
          </div>
        </section>

        <section
          className="px-4 py-10 sm:px-6 lg:px-8"
          aria-labelledby="knowledge-list-title"
        >
          <div className="mx-auto max-w-[1460px]">
            <Reveal y={10}>
              <div className="flex items-end justify-between gap-4">
                <h2
                  id="knowledge-list-title"
                  className="text-2xl font-black text-slate-950"
                >
                  {t.title}
                </h2>
                <p className="text-sm font-semibold text-slate-600">
                  {`${total} ${t.count}`}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3" aria-label={t.title}>
                {Object.values(CATEGORY_LABELS).map((labels) => (
                  <span
                    key={labels.vi}
                    className="inline-flex min-h-11 items-center rounded-full border border-blue-200 bg-white px-4 text-base font-bold text-blue-800"
                  >
                    {labels[locale]}
                  </span>
                ))}
              </div>
            </Reveal>

            {articles.length ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {articles.map((article) => (
                  <Reveal
                    key={article.id}
                    y={14}
                    delay={Math.min(articles.indexOf(article) * 0.06, 0.36)}
                  >
                    <Link
                      href={newsArticleHref(article)}
                      className="group block h-full rounded-2xl border border-blue-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                        {CATEGORY_LABELS[article.category]?.[locale] ??
                          article.category}
                      </span>
                      <p className="text-sm font-semibold text-blue-700">
                        {formatDate(article.date, locale)}
                      </p>
                      <h3
                        className="mt-3 line-clamp-2 text-xl font-black leading-snug text-slate-950 group-hover:text-blue-700 sm:min-h-[3.5rem]"
                        title={formatNewsTitle(article.title)}
                      >
                        {formatNewsTitle(article.title)}
                      </h3>
                      {article.summary ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:min-h-[4.5rem]">
                          {article.summary}
                        </p>
                      ) : null}
                    </Link>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal y={12}>
                <div className="mt-6 rounded-2xl border border-dashed border-blue-300 bg-white/70 px-6 py-16 text-center">
                  <p className="text-base font-semibold text-slate-600">
                    {t.empty}
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      </main>
    </div>,
    locale,
    PUBLIC_STATIC_TRANSLATIONS,
  );
}
