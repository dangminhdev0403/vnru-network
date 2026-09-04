"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { localizeReactNode } from "@/core/i18n/localize-react-node";
import { PUBLIC_STATIC_TRANSLATIONS } from "./public-static-translations";
import { EXPERTS, type Expert } from "@/features/public-discovery/mock-data";
import { HOME_COPY } from "./GuestHomeV2";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";
import { Reveal } from "@/components/shared/Reveal";

const COPY: Record<
  Locale,
  {
    brandTitle: string;
    kicker: string;
    title1: string;
    title2: string;
    intro: string;
    searchPlaceholder: string;
    searchBtn: string;
    allCountries: string;
    vietnam: string;
    russia: string;
    resultsCount: string;
    noResults: string;
    viewProfile: string;
    closeModal: string;
    connectExpert: string;
    biography: string;
    researchFocus: string;
    topics: string;
    publications: string;
    projectsCount: string;
    publicationsCount: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
    stats: readonly string[];
    vietnameseResearcher: string;
    russianProfessor: string;
    joinKicker: string;
    opportunitiesBtn: string;
    publicationMeta: string;
  }
> = {
  vi: {
    brandTitle: "Mạng lưới tri thức Nga - Việt",
    kicker: "Mạng lưới Chuyên gia Xác thực · VAST & RAS",
    title1: "Khám phá Chuyên gia Khoa học",
    title2: "Nga – Việt",
    intro:
      "Kết nối trực tiếp với các giáo sư, nhà nghiên cứu và chuyên gia đầu ngành theo từng lĩnh vực khoa học, tổ chức viện/trường và định hướng đề tài song phương.",
    searchPlaceholder:
      "Tìm theo tên chuyên gia, viện nghiên cứu, chuyên môn, từ khóa...",
    searchBtn: "Tìm kiếm",
    allCountries: "Tất cả quốc gia",
    vietnam: "Việt Nam",
    russia: "Liên bang Nga",
    resultsCount: "chuyên gia phù hợp",
    noResults: "Không có chuyên gia phù hợp với bộ lọc hiện tại.",
    viewProfile: "Xem hồ sơ chi tiết",
    closeModal: "Đóng",
    connectExpert: "Kết nối hợp tác với chuyên gia →",
    biography: "Tiểu sử & Chuyên môn",
    researchFocus: "Hướng nghiên cứu trọng điểm",
    topics: "Lĩnh vực & Từ khóa chuyên môn",
    publications: "Công trình công bố tiêu biểu",
    projectsCount: "Dự án hợp tác",
    publicationsCount: "Bài báo & Công bố",
    ctaTitle: "Bạn là nhà khoa học hoặc chuyên gia nghiên cứu?",
    ctaDesc:
      "Gia nhập mạng lưới để kết nối, hợp tác đề tài và chia sẻ công trình với cộng đồng khoa học song phương Nga – Việt.",
    ctaBtn: "Gia nhập mạng lưới chuyên gia →",
    stats: ["520+ Chuyên gia", "150+ Viện & Đại học", "20+ Lĩnh vực khoa học", "Xác thực VAST – RAS"],
    vietnameseResearcher: "Nhà nghiên cứu · Việt Nam",
    russianProfessor: "Giáo sư · Liên bang Nga",
    joinKicker: "Tham gia mạng lưới",
    opportunitiesBtn: "Khám phá cơ hội hợp tác",
    publicationMeta: "Tạp chí khoa học quốc tế uy tín · Đồng tác giả song phương",
  },
  en: {
    brandTitle: "Russia - Vietnam Knowledge Network",
    kicker: "Verified Expert Network · VAST & RAS",
    title1: "Discover Scientific Experts",
    title2: "Russia – Vietnam",
    intro:
      "Connect directly with professors, principal investigators, and researchers across leading academic institutions in Vietnam and the Russian Federation.",
    searchPlaceholder:
      "Search by expert name, institution, discipline, keywords...",
    searchBtn: "Search",
    allCountries: "All Countries",
    vietnam: "Vietnam",
    russia: "Russian Federation",
    resultsCount: "matching experts",
    noResults: "No experts match the current search filters.",
    viewProfile: "View Detailed Profile",
    closeModal: "Close",
    connectExpert: "Connect with Expert →",
    biography: "Biography & Background",
    researchFocus: "Key Research Focus",
    topics: "Fields & Topic Keywords",
    publications: "Selected Publications",
    projectsCount: "Collaborative Projects",
    publicationsCount: "Publications & Articles",
    ctaTitle: "Are you a researcher or academic specialist?",
    ctaDesc:
      "Join the network to collaborate on research calls, share data, and partner with the bilateral scientific community.",
    ctaBtn: "Join the Expert Directory →",
    stats: ["520+ Experts", "150+ Institutes & Universities", "20+ Scientific Fields", "Verified by VAST – RAS"],
    vietnameseResearcher: "Researcher · Vietnam",
    russianProfessor: "Professor · Russian Federation",
    joinKicker: "Join the network",
    opportunitiesBtn: "Explore collaboration opportunities",
    publicationMeta: "Leading international scientific journal · Bilateral co-authors",
  },
  ru: {
    brandTitle: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
    kicker: "Сеть верифицированных экспертов · Фонд «Традиции и дружба»",
    title1: "Научные эксперты",
    title2: "Россия – Вьетнам",
    intro:
      "Прямая связь с ведущими профессорами, исследователями и специалистами академических институтов и университетов России и Вьетнама.",
    searchPlaceholder:
      "Поиск по имени, институту, научной дисциплине, ключевым словам...",
    searchBtn: "Искать",
    allCountries: "Все страны",
    vietnam: "Вьетнам",
    russia: "Российская Федерация",
    resultsCount: "найденных экспертов",
    noResults: "Эксперты по текущим критериям не найдены.",
    viewProfile: "Профиль эксперта",
    closeModal: "Закрыть",
    connectExpert: "Связаться с экспертом →",
    biography: "Биография и квалификация",
    researchFocus: "Ключевые направления исследований",
    topics: "Научные направления и ключевые слова",
    publications: "Избранные публикации",
    projectsCount: "Совместных проектов",
    publicationsCount: "Статей и публикаций",
    ctaTitle: "Вы являетесь исследователем или экспертом?",
    ctaDesc:
      "Вступайте в сеть для поиска партнеров, участия в совместных конкурсах и обмена научными данными.",
    ctaBtn: "Присоединиться к экспертам →",
    stats: ["520+ экспертов", "150+ институтов и университетов", "20+ научных направлений", "Верификация ВАНТ – РАН"],
    vietnameseResearcher: "Исследователь · Вьетнам",
    russianProfessor: "Профессор · Российская Федерация",
    joinKicker: "Присоединиться к сети",
    opportunitiesBtn: "Возможности сотрудничества",
    publicationMeta: "Ведущий международный научный журнал · Двустороннее соавторство",
  },
};

export function GuestExpertsV2() {
  const { locale } = useLocale();
  const t = COPY[locale];
  const homeCopy = HOME_COPY[locale] ?? HOME_COPY.vi;
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<"all" | "VN" | "RU">("all");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedExpert(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(locale);
    return EXPERTS.filter((expert) => {
      const countryMatch = country === "all" || expert.country === country;
      const text =
        `${expert.name} ${expert.institution} ${expert.copy[locale].discipline} ${expert.topics.join(" ")}`.toLocaleLowerCase(
          locale,
        );
      return countryMatch && (!q || text.includes(q));
    });
  }, [country, locale, query]);

  return localizeReactNode(
    <div className="min-h-screen bg-[#ebf4ff] text-slate-950">
      <GuestPublicNav active="experts" />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-blue-200/80 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,.22),transparent_38%),linear-gradient(180deg,#dbeafe_0%,#eff6ff_55%,#e1effe_100%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div
            className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(59,130,246,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.045)_1px,transparent_1px)] [background-size:42px_42px]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[1460px]">
            <div className="max-w-4xl">
              <Reveal y={10} delay={0.05}>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/80 bg-blue-100/90 px-4 py-2 text-xs sm:text-[13px] font-black uppercase tracking-[0.1em] text-blue-800">
                  ✦ {t.kicker}
                </span>
              </Reveal>
              <Reveal y={14} delay={0.12}>
                <h1 className="mt-6 text-balance text-4xl font-black leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[68px]">
                  {t.title1}
                  <br />
                  <span className="text-blue-600">{t.title2}</span>
                </h1>
              </Reveal>
              <Reveal y={12} delay={0.18}>
                <p className="mt-6 max-w-3xl text-base sm:text-lg md:text-[19px] font-normal leading-relaxed text-slate-700">
                  {t.intro}
                </p>
              </Reveal>

              {/* Search Bar */}
              <Reveal y={12} delay={0.24}>
                <div className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
                  <div className="flex min-h-13 flex-1 items-center gap-3 rounded-xl border border-blue-300/80 bg-white/95 px-4.5 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                    <span className="text-lg font-bold text-blue-600">⌕</span>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="min-w-0 flex-1 bg-transparent text-sm sm:text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="inline-flex min-h-13 items-center justify-center rounded-xl bg-blue-600 px-7 text-sm sm:text-base font-bold text-white shadow-[0_12px_28px_-12px_rgba(37,99,235,.85)] transition hover:-translate-y-0.5 hover:bg-blue-700 active:scale-[0.98]"
                  >
                    {t.searchBtn}
                  </button>
                </div>
              </Reveal>

              {/* Quick stats pills */}
              <Reveal y={10} delay={0.3}>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm md:text-[15px] font-bold text-slate-700">
                  {t.stats.map((stat, index) => (
                    <span key={stat} className="inline-flex items-center gap-2">
                      <b className="text-base text-blue-600">{["◉", "◎", "◇", "✦"][index]}</b> {stat}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Experts Explorer Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            {/* Filter Bar */}
            <Reveal y={10}>
              <div className="flex flex-col gap-4 rounded-2xl border border-blue-200/80 bg-white/90 p-4.5 shadow-[0_16px_40px_-32px_rgba(37,99,235,.4)] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2.5">
                  {[
                    ["all", t.allCountries],
                    ["VN", t.vietnam],
                    ["RU", t.russia],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCountry(id as "all" | "VN" | "RU")}
                      className={`rounded-xl px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 active:scale-[0.98] ${
                        country === id
                          ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                          : "border border-blue-200/80 bg-blue-50/50 text-slate-700 hover:bg-blue-100/70 hover:text-blue-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="text-xs sm:text-sm font-extrabold text-slate-600">
                  <span className="text-blue-700">{filtered.length}</span>{" "}
                  {t.resultsCount}
                </div>
              </div>
            </Reveal>

            {/* Experts Grid */}
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((expert) => {
                const copy = expert.copy[locale];
                return (
                  <Reveal
                    key={expert.id}
                    y={14}
                    delay={Math.min(filtered.indexOf(expert) * 0.06, 0.36)}
                    className="h-full"
                  >
                    <article
                      className="group flex h-full flex-col justify-between rounded-3xl border border-blue-200/90 bg-white/95 p-6 sm:p-7 shadow-[0_16px_40px_-32px_rgba(37,99,235,.45)] transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_50px_-28px_rgba(37,99,235,.6)]"
                    >
                      <div>
                        {/* Avatar & Header */}
                        <div className="flex items-start gap-4">
                          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-300 text-base font-black text-blue-800 shadow-xs ring-4 ring-blue-50">
                            {expert.initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h2 className="truncate text-lg sm:text-xl font-black text-slate-950 transition group-hover:text-blue-700">
                                {expert.name}
                              </h2>
                              <span className="text-blue-600">●</span>
                            </div>
                            <p className="mt-1 text-xs sm:text-sm font-bold text-blue-700">
                              {expert.country === "VN"
                                ? t.vietnameseResearcher
                                : t.russianProfessor}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 font-medium">
                              {expert.institution}
                            </p>
                          </div>
                        </div>

                        {/* Topic Tags */}
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {expert.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-slate-700"
                            >
                              #{topic}
                            </span>
                          ))}
                        </div>

                        {/* Bio snippet */}
                        <p className="mt-4 line-clamp-3 text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
                          {copy.bio}
                        </p>
                      </div>

                      <div>
                        {/* Meta stats */}
                        <div className="mt-5 grid grid-cols-2 gap-2 border-y border-blue-100 py-3 text-xs font-extrabold text-slate-600">
                          <span>
                            ▣ {18 + expert.publications.length * 4}{" "}
                            {t.projectsCount}
                          </span>
                          <span>
                            □ {expert.publications.length * 16 + 24}{" "}
                            {t.publicationsCount}
                          </span>
                        </div>

                        {/* View Profile Button (Opens Modal) */}
                        <button
                          type="button"
                          onClick={() => setSelectedExpert(expert)}
                          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-xs sm:text-sm font-extrabold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
                        >
                          {t.viewProfile}
                        </button>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <Reveal y={12}>
                <div className="mt-8 rounded-3xl border border-dashed border-blue-300 bg-white/90 p-12 text-center text-sm sm:text-base font-semibold text-slate-600">
                  {t.noResults}
                </div>
              </Reveal>
            )}

            {/* CTA Box */}
            <Reveal y={14}>
              <div className="mt-14 rounded-3xl border border-blue-300 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 sm:p-12 text-white shadow-[0_24px_50px_-24px_rgba(37,99,235,.8)]">
                <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                  <span className="rounded-full border border-blue-300/40 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-100">
                    ✦ {t.joinKicker}
                  </span>
                  <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
                    {t.ctaTitle}
                  </h2>
                  <p className="mt-3.5 max-w-2xl text-base sm:text-lg leading-relaxed text-blue-100 font-normal">
                    {t.ctaDesc}
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Link
                      href="/login"
                      className="inline-flex min-h-12 items-center rounded-xl bg-white px-7 text-sm sm:text-base font-extrabold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50 active:scale-[0.98]"
                    >
                      {t.ctaBtn}
                    </Link>
                    <Link
                      href="/opportunities"
                      className="inline-flex min-h-12 items-center rounded-xl border border-white/30 bg-white/10 px-6 text-sm sm:text-base font-bold text-white transition hover:bg-white/20 active:scale-[0.98]"
                    >
                      {t.opportunitiesBtn}
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Expert Detail Modal Box */}
      {selectedExpert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="expert-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedExpert(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-blue-200 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedExpert(null)}
              aria-label={t.closeModal}
              className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-slate-100 text-lg font-black text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-300 text-2xl font-black text-blue-800 shadow-md ring-4 ring-blue-50">
                {selectedExpert.initials}
              </div>
              <div className="min-w-0 flex-1 pr-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                      selectedExpert.country === "VN"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {selectedExpert.country === "VN"
                      ? "🇻🇳 Việt Nam · VAST"
                      : "🇷🇺 Liên bang Nga · RAS"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    {selectedExpert.copy[locale].discipline}
                  </span>
                </div>

                <h2
                  id="expert-modal-title"
                  className="mt-3 text-2xl sm:text-3xl font-black text-slate-950"
                >
                  {selectedExpert.name}
                </h2>
                <p className="mt-1 text-sm sm:text-base font-semibold text-slate-600">
                  {selectedExpert.institution}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="mt-6 space-y-6 border-t border-blue-100 pt-6">
              {/* Biography */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-800">
                  ✦ {t.biography}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-700">
                  {selectedExpert.copy[locale].bio}
                </p>
              </div>

              {/* Research Focus */}
              <div className="rounded-2xl border border-blue-200/80 bg-blue-50/70 p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-800">
                  ✦ {t.researchFocus}
                </h3>
                <p className="mt-2 text-sm sm:text-[15px] font-medium leading-relaxed text-slate-800">
                  {selectedExpert.copy[locale].focus}
                </p>
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {t.topics}
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {selectedExpert.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-xl border border-blue-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-bold text-blue-700 shadow-2xs"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selected Publications */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {t.publications}
                </h3>
                <div className="mt-3 space-y-2.5">
                  {selectedExpert.publications.map((pub, idx) => (
                    <div
                      key={pub}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs sm:text-sm"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-blue-100 text-xs font-black text-blue-700">
                        0{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <strong className="block font-bold text-slate-900">
                          {pub}
                        </strong>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {t.publicationMeta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-4 text-center">
                <div>
                  <strong className="block text-xl sm:text-2xl font-black text-slate-950">
                    {18 + selectedExpert.publications.length * 4}
                  </strong>
                  <span className="text-xs font-bold text-slate-500">
                    {t.projectsCount}
                  </span>
                </div>
                <div>
                  <strong className="block text-xl sm:text-2xl font-black text-slate-950">
                    {selectedExpert.publications.length * 16 + 24}
                  </strong>
                  <span className="text-xs font-bold text-slate-500">
                    {t.publicationsCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-blue-100 pt-6 sm:flex-row">
              <button
                type="button"
                onClick={() => setSelectedExpert(null)}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                {t.closeModal}
              </button>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-md transition hover:bg-blue-700"
              >
                {t.connectExpert}
              </Link>
            </div>
          </div>
        </div>
      )}

      <GuestPublicFooter copy={homeCopy} />
    </div>,
    locale,
    PUBLIC_STATIC_TRANSLATIONS,
  );
}
