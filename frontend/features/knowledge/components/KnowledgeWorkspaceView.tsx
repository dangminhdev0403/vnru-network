"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/cn";
import type {
  DiscoveryResult,
  PublicExpert,
  PublicPublication,
} from "../types";

type Props = Readonly<{
  publications: DiscoveryResult<PublicPublication>;
  experts: DiscoveryResult<PublicExpert>;
  query: Record<string, string | undefined>;
  canViewMatches?: boolean;
}>;

const knowledgeCopy: Record<
  Locale,
  {
    kicker: string;
    title: string;
    subtitle: string;
    heroHeading: string;
    searchPlaceholder: string;
    searchButton: string;
    filterCountry: string;
    filterOrg: string;
    filterTopic: string;
    filterLang: string;
    filterYear: string;
    clearFilters: string;
    publicationsTitle: string;
    errorPubs: string;
    retry: string;
    noPubs: string;
    expertsTitle: string;
    errorExperts: string;
    noExperts: string;
    nextPage: string;
    expertMatchingTitle: string;
    explore: string;
    expertMatchingDesc: string;
    graphTitle: string;
    graphDesc: string;
    formatCountry: (country?: string) => string;
  }
> = {
  vi: {
    kicker: "Module 02 · Kho Tri thức & Danh bạ Chuyên gia",
    title: "Kho Tri thức & Danh bạ Chuyên gia",
    subtitle:
      "Dữ liệu công khai từ knowledge-service và organization-service. Auth-service duy trì quyền hạn phiên.",
    heroHeading: "Chuyên gia ↔ Công bố ↔ Chủ đề ↔ Tổ chức",
    searchPlaceholder: "Tìm kiếm công bố hoặc chuyên gia nghiên cứu…",
    searchButton: "Tìm kiếm",
    filterCountry: "Quốc gia (VN/RU)",
    filterOrg: "Tổ chức / Viện",
    filterTopic: "Chủ đề",
    filterLang: "Ngôn ngữ",
    filterYear: "Năm công bố",
    clearFilters: "Xoá bộ lọc →",
    publicationsTitle: "Công bố & Tài liệu Nghiên cứu",
    errorPubs: "Không thể tải danh mục công bố.",
    retry: "Thử lại →",
    noPubs: "Không tìm thấy công bố phù hợp.",
    expertsTitle: "Danh bạ Chuyên gia Song phương",
    errorExperts: "Không thể tải danh sách chuyên gia.",
    noExperts: "Không tìm thấy chuyên gia phù hợp.",
    nextPage: "Trang tiếp →",
    expertMatchingTitle: "Ghép cặp & Gợi ý Hợp tác",
    explore: "Khám phá →",
    expertMatchingDesc:
      "Cơ chế matching tự động dựa trên tín hiệu chuyên môn từ organization-service và danh mục công bố.",
    graphTitle: "Knowledge Graph & Vận hành Chỉ mục",
    graphDesc:
      "Đang hoàn thiện module kết nối đồ thị tri thức đa phương thức và mạng lưới liên kết khoa học.",
    formatCountry: (c) =>
      c === "VN" ? "Việt Nam" : c === "RU" ? "Liên bang Nga" : c || "N/A",
  },
  en: {
    kicker: "Module 02 · Knowledge Repository & Expert Directory",
    title: "Knowledge Repository & Expert Directory",
    subtitle:
      "Verified public research from knowledge-service and organization-service. Auth-service manages sessions.",
    heroHeading: "Expert ↔ Publication ↔ Topic ↔ Organization",
    searchPlaceholder: "Search research publications or scientific experts…",
    searchButton: "Search",
    filterCountry: "Country (VN/RU)",
    filterOrg: "Organization",
    filterTopic: "Topic",
    filterLang: "Language",
    filterYear: "Year",
    clearFilters: "Clear filters →",
    publicationsTitle: "Publications & Research Outputs",
    errorPubs: "Failed to load publications.",
    retry: "Retry →",
    noPubs: "No publications matching the criteria.",
    expertsTitle: "Bilateral Expert Directory",
    errorExperts: "Failed to load experts.",
    noExperts: "No experts matching the criteria.",
    nextPage: "Next page →",
    expertMatchingTitle: "Expert Matching & Matchmaking",
    explore: "Explore →",
    expertMatchingDesc:
      "Automated matching engine powered by organization-service capabilities and research publications.",
    graphTitle: "Knowledge Graph & Index Operations",
    graphDesc:
      "Pending multimodal knowledge graph indexing and bilateral science connection mesh.",
    formatCountry: (c) =>
      c === "VN" ? "Vietnam" : c === "RU" ? "Russian Federation" : c || "N/A",
  },
  ru: {
    kicker: "Модуль 02 · База знаний и Каталог экспертов",
    title: "База знаний и Каталог экспертов",
    subtitle:
      "Открытые данные из knowledge-service и organization-service. Auth-service управляет сессиями.",
    heroHeading: "Эксперт ↔ Публикация ↔ Тема ↔ Организация",
    searchPlaceholder: "Поиск публикаций или научных экспертов…",
    searchButton: "Поиск",
    filterCountry: "Страна (VN/RU)",
    filterOrg: "Организация",
    filterTopic: "Тематика",
    filterLang: "Язык",
    filterYear: "Год",
    clearFilters: "Сбросить фильтры →",
    publicationsTitle: "Научные публикации и результаты",
    errorPubs: "Не удалось загрузить публикации.",
    retry: "Повторить →",
    noPubs: "Подходящих публикаций не найдено.",
    expertsTitle: "Каталог двусторонних экспертов",
    errorExperts: "Не удалось загрузить экспертов.",
    noExperts: "Подходящих экспертов не найдено.",
    nextPage: "Следующая страница →",
    expertMatchingTitle: "Матчинг экспертов и сотрудничество",
    explore: "Подробнее →",
    expertMatchingDesc:
      "Механизм подбора экспертов на основе данных organization-service и каталога публикаций.",
    graphTitle: "Граф знаний и индексация",
    graphDesc:
      "Формирование мультимодального графа научных связей Россия — Вьетнам.",
    formatCountry: (c) =>
      c === "VN" ? "Вьетнам" : c === "RU" ? "Российская Федерация" : c || "N/A",
  },
};

/** Build a URL-safe query string from current filters, optionally overriding keys */
function buildHref(
  query: Record<string, string | undefined>,
  overrides: Record<string, string | undefined> = {},
): string {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
  const qs = params.toString();
  return `/workspace/knowledge${qs ? `?${qs}` : ""}`;
}

export default function KnowledgeWorkspaceView({
  publications,
  experts,
  query,
  canViewMatches = false,
}: Props) {
  const { locale } = useLocale();
  const t = knowledgeCopy[locale] || knowledgeCopy.vi;
  const retryHref = buildHref(query);
  const hasActiveFilters = !!(
    query.q ||
    query.country ||
    query.organization ||
    query.topic ||
    query.language ||
    query.year
  );

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <div>
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800 px-3 py-1.5 text-xs font-black uppercase tracking-[.14em] text-blue-800 dark:text-blue-300">
            {t.kicker}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-4xl text-text-primary">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{t.subtitle}</p>
      </div>

      {/* Signal Surface Search & Filters Form */}
      <section className="signal-surface overflow-hidden rounded-2xl p-6 text-white sm:p-8 shadow-xl">
        <h2 className="text-3xl font-black sm:text-5xl">{t.heroHeading}</h2>
        <form className="mt-6 space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              name="q"
              defaultValue={query.q}
              type="search"
              aria-label={t.searchPlaceholder}
              placeholder={t.searchPlaceholder}
              className="h-12 rounded-2xl bg-white px-4 text-slate-900 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-5 font-black text-white hover:bg-blue-700 transition cursor-pointer shadow-md"
            >
              {t.searchButton}
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <input
              name="country"
              defaultValue={query.country}
              placeholder={t.filterCountry}
              aria-label={t.filterCountry}
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="organization"
              defaultValue={query.organization}
              placeholder={t.filterOrg}
              aria-label={t.filterOrg}
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="topic"
              defaultValue={query.topic}
              placeholder={t.filterTopic}
              aria-label={t.filterTopic}
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="language"
              defaultValue={query.language}
              placeholder={t.filterLang}
              aria-label={t.filterLang}
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="year"
              defaultValue={query.year}
              placeholder={t.filterYear}
              aria-label={t.filterYear}
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </section>

      {/* Main Results Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Publications section */}
        <section className="app-panel p-6" aria-label="Publications">
          <h3 className="text-lg font-black text-text-primary">
            {t.publicationsTitle}
          </h3>
          {publications.status === "error" ? (
            <div className="mt-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-sm text-rose-950 dark:text-rose-200">
              {t.errorPubs}
              <Link
                href={retryHref}
                className="mt-2 block text-xs font-bold text-blue-800 dark:text-blue-400 hover:underline"
              >
                {t.retry}
              </Link>
            </div>
          ) : publications.items.length === 0 ? (
            <div className="mt-4 text-sm text-text-tertiary">
              <p>{t.noPubs}</p>
              {hasActiveFilters && (
                <Link
                  href="/workspace/knowledge"
                  className="mt-1 block text-xs font-bold text-blue-600 hover:underline"
                >
                  {t.clearFilters}
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="mt-4 divide-y divide-card-border">
                {publications.items.map((p) => (
                  <article key={p.id} className="py-4">
                    <strong className="text-sm font-bold text-text-primary block">
                      {p.title}
                    </strong>
                    <p className="mt-1 text-xs text-text-secondary">
                      {p.type} · {p.year} · {t.formatCountry(p.country)} ·{" "}
                      {p.language}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.topics.map((tItem) => (
                        <span
                          key={tItem.id}
                          className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-300 font-semibold"
                        >
                          {locale === "ru"
                            ? (tItem.labels.ru ?? tItem.labels.en ?? tItem.slug)
                            : locale === "en"
                              ? (tItem.labels.en ?? tItem.slug)
                              : (tItem.labels.vi ??
                                tItem.labels.en ??
                                tItem.slug)}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              {publications.status === "success" && publications.nextCursor && (
                <Link
                  href={buildHref(query, {
                    publicationCursor: publications.nextCursor,
                  })}
                  className="mt-4 inline-block rounded-xl border border-card-border bg-card-surface-area px-4 py-2 text-xs font-bold text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {t.nextPage}
                </Link>
              )}
            </>
          )}
        </section>

        {/* Experts section */}
        <section className="app-panel p-6" aria-label="Experts">
          <h3 className="text-lg font-black text-text-primary">
            {t.expertsTitle}
          </h3>
          {experts.status === "error" ? (
            <div className="mt-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-sm text-rose-950 dark:text-rose-200">
              {t.errorExperts}
              <Link
                href={retryHref}
                className="mt-2 block text-xs font-bold text-blue-800 dark:text-blue-400 hover:underline"
              >
                {t.retry}
              </Link>
            </div>
          ) : experts.items.length === 0 ? (
            <div className="mt-4 text-sm text-text-tertiary">
              <p>{t.noExperts}</p>
              {hasActiveFilters && (
                <Link
                  href="/workspace/knowledge"
                  className="mt-1 block text-xs font-bold text-blue-600 hover:underline"
                >
                  {t.clearFilters}
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-3">
                {experts.items.map((e) => (
                  <article
                    key={e.id}
                    className="rounded-2xl border border-card-border bg-card-surface-area p-4"
                  >
                    <strong className="text-sm font-bold text-text-primary block">
                      {e.displayName}
                    </strong>
                    <p className="mt-1 text-xs text-text-secondary">
                      {e.organization?.name} · {t.formatCountry(e.country)}
                    </p>
                    {e.bio && (
                      <p className="mt-2 text-xs text-text-tertiary">{e.bio}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {e.expertises.map((x) => (
                        <span
                          key={x.id}
                          className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-300 font-semibold"
                        >
                          {locale === "ru"
                            ? (x.labels.ru ?? x.labels.en ?? x.slug)
                            : locale === "en"
                              ? (x.labels.en ?? x.slug)
                              : (x.labels.vi ?? x.labels.en ?? x.slug)}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              {experts.status === "success" && experts.nextCursor && (
                <Link
                  href={buildHref(query, { expertCursor: experts.nextCursor })}
                  className="mt-4 inline-block rounded-xl border border-card-border bg-card-surface-area px-4 py-2 text-xs font-bold text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {t.nextPage}
                </Link>
              )}
            </>
          )}
        </section>
      </div>

      {/* Bottom Information Callouts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {canViewMatches && (
          <section className="rounded-3xl border border-amber-200/80 bg-linear-to-br from-amber-50/70 to-orange-50/40 p-6 shadow-xs dark:border-amber-800/60 dark:from-amber-950/20 dark:to-orange-950/10">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-amber-950 dark:text-amber-200">
                {t.expertMatchingTitle}
              </h3>
              <Link
                href="/experts"
                className="text-xs font-black text-amber-900 dark:text-amber-400 hover:underline"
              >
                {t.explore}
              </Link>
            </div>
            <p className="mt-2 text-xs text-amber-950 dark:text-amber-300">
              {t.expertMatchingDesc}
            </p>
          </section>
        )}
        <section className={cn(
          "rounded-3xl border border-card-border bg-card-background p-6",
          !canViewMatches && "lg:col-span-2"
        )}>
          <h3 className="font-black text-text-primary">{t.graphTitle}</h3>
          <span className="mt-2 block text-xs text-text-secondary">
            {t.graphDesc}
          </span>
        </section>
      </div>
    </div>
  );
}
