"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { DEMO_KNOWLEDGE_RESOURCES, type KnowledgeType } from "@/features/workspace/mock-data/knowledge";
import { GuestPublicNav } from "./GuestPublicNav";

const TYPE_LABELS: Record<KnowledgeType, Record<Locale, string>> = {
  PUBLICATION: { vi: "Công bố khoa học", en: "Publication", ru: "Научная публикация" },
  DATASET: { vi: "Bộ dữ liệu mở", en: "Open Dataset", ru: "Набор данных" },
  MANUSCRIPT: { vi: "Bản thảo nghiên cứu", en: "Research Manuscript", ru: "Рукопись исследования" },
  TECHNICAL_REPORT: { vi: "Báo cáo kỹ thuật", en: "Technical Report", ru: "Технический отчет" },
  GUIDELINE: { vi: "Hướng dẫn & Quy chuẩn", en: "Guideline & Standard", ru: "Руководство и стандарт" },
  TOPIC: { vi: "Chuyên đề tổng quan", en: "Topic Brief", ru: "Тематический обзор" },
};

const COPY: Record<Locale, {
  kicker: string;
  title1: string;
  title2: string;
  title3: string;
  intro: string;
  searchPlaceholder: string;
  searchBtn: string;
  filterAll: string;
  materials: string;
  ocean: string;
  aiData: string;
  energy: string;
  biotech: string;
  typeFilter: string;
  accessFilter: string;
  allTypes: string;
  allAccess: string;
  openAccess: string;
  restricted: string;
  internal: string;
  resultsCount: string;
  readMore: string;
  authorsLabel: string;
  featuredTracksTitle: string;
  featuredTracksDesc: string;
  openScienceTitle: string;
  openScienceDesc: string;
  joinTitle: string;
  joinDesc: string;
  joinBtn: string;
}> = {
  vi: {
    kicker: "CSDL Tri thức Song phương · VAST & RAS",
    title1: "Kho Tri thức Khoa học",
    title2: "& Dữ liệu Hợp tác Song phương",
    title3: "Nga – Việt",
    intro: "Tra cứu hệ thống chuyên đề, công bố khoa học, bộ dữ liệu đo đạc và báo cáo kỹ thuật song phương giữa các viện nghiên cứu, trường đại học hàng đầu Việt Nam và Liên bang Nga.",
    searchPlaceholder: "Tìm kiếm tài liệu theo tên đề tài, từ khóa, tác giả, DOI...",
    searchBtn: "Tìm kiếm",
    filterAll: "Tất cả lĩnh vực",
    materials: "Vật liệu mới & Nano",
    ocean: "Khoa học Biển & Hải dương",
    aiData: "AI & Dữ liệu khoa học",
    energy: "Năng lượng sạch & Nguyên tử",
    biotech: "Công nghệ sinh học biển",
    typeFilter: "Loại tài liệu",
    accessFilter: "Quyền truy cập",
    allTypes: "Tất cả loại hình",
    allAccess: "Tất cả quyền",
    openAccess: "Truy cập mở (Open)",
    restricted: "Hạn chế (Restricted)",
    internal: "Nội bộ mạng lưới",
    resultsCount: "tài liệu khoa học phù hợp",
    readMore: "Xem chi tiết tài liệu",
    authorsLabel: "Nhóm tác giả:",
    featuredTracksTitle: "Các hướng chuyên đề trọng điểm 2026",
    featuredTracksDesc: "Các cụm nghiên cứu liên ngành đang có tiến độ phối hợp cao giữa các nhóm nghiên cứu hai nước.",
    openScienceTitle: "Cam kết Khoa học Mở & Bảo mật Dữ liệu Song phương",
    openScienceDesc: "Tất cả bộ dữ liệu và tài liệu công bố trong kho tri thức tuân thủ nguyên tắc dữ liệu FAIR (Findable, Accessible, Interoperable, Reusable) và thỏa thuận trao đổi học thuật độc lập giữa Viện Hàn lâm KH&CN Việt Nam (VAST) và Viện Hàn lâm Khoa học Nga (RAS).",
    joinTitle: "Bạn có công trình hoặc bộ dữ liệu muốn đóng góp vào Mạng lưới?",
    joinDesc: "Gia nhập mạng lưới với tư cách nhà khoa học hoặc đại diện tổ chức để chia sẻ ấn phẩm, đồng tác giả và tiếp cận các nguồn tư liệu học thuật độc quyền.",
    joinBtn: "Gia nhập mạng lưới tri thức →",
  },
  en: {
    kicker: "Bilateral Knowledge Repository · VAST & RAS",
    title1: "Scientific Knowledge Base",
    title2: "& Bilateral Research Data",
    title3: "Russia – Vietnam",
    intro: "Explore research topics, peer-reviewed publications, observational datasets, and technical reports across leading institutes and universities in Vietnam and the Russian Federation.",
    searchPlaceholder: "Search by document title, keywords, authors, DOI...",
    searchBtn: "Search",
    filterAll: "All Fields",
    materials: "Advanced Materials & Nano",
    ocean: "Oceanography & Marine Sciences",
    aiData: "AI & Scientific Data",
    energy: "Clean & Nuclear Energy",
    biotech: "Marine Biotechnology",
    typeFilter: "Document Type",
    accessFilter: "Access Level",
    allTypes: "All Types",
    allAccess: "All Access",
    openAccess: "Open Access",
    restricted: "Restricted",
    internal: "Network Internal",
    resultsCount: "matching scientific documents",
    readMore: "View Document Details",
    authorsLabel: "Authors:",
    featuredTracksTitle: "Priority Thematic Tracks 2026",
    featuredTracksDesc: "Interdisciplinary research clusters with active bilateral working groups between Vietnam and Russia.",
    openScienceTitle: "Open Science Commitment & Data Governance",
    openScienceDesc: "All published datasets and papers strictly follow the FAIR principles and adhere to bilateral academic cooperation protocols between VAST and RAS.",
    joinTitle: "Have research work or datasets to contribute?",
    joinDesc: "Join the network as a researcher or institutional representative to publish manuscripts, collaborate on datasets, and access bilateral research archives.",
    joinBtn: "Join the Knowledge Network →",
  },
  ru: {
    kicker: "Двустороннее хранилище знаний · ВАНТ и РАН",
    title1: "База научных знаний",
    title2: "и данные совместных исследований",
    title3: "Россия – Вьетнам",
    intro: "Поиск по тематическим обзорам, научным публикациям, массивам данных наблюдений и техническим отчетам ведущих институтов и университетов Вьетнама и РФ.",
    searchPlaceholder: "Поиск по названию, ключевым словам, авторам, DOI...",
    searchBtn: "Искать",
    filterAll: "Все области",
    materials: "Новые материалы и нано",
    ocean: "Океанология и морские науки",
    aiData: "ИИ и научные данные",
    energy: "Чистая и атомная энергетика",
    biotech: "Морская биотехнология",
    typeFilter: "Тип документа",
    accessFilter: "Доступ",
    allTypes: "Все типы",
    allAccess: "Любой доступ",
    openAccess: "Открытый доступ",
    restricted: "Ограниченный доступ",
    internal: "Для участников сети",
    resultsCount: "найденных документов",
    readMore: "Подробнее о документе",
    authorsLabel: "Авторы:",
    featuredTracksTitle: "Приоритетные тематические направления 2026",
    featuredTracksDesc: "Междисциплинарные исследовательские кластеры с активным двусторонним взаимодействием рабочих групп.",
    openScienceTitle: "Принципы открытой науки и защита данных",
    openScienceDesc: "Все наборы данных и публикации соответствуют принципам FAIR и соглашениям об академическом обмене между ВАНТ и РАН.",
    joinTitle: "Хотите внести результаты исследований в базу знаний?",
    joinDesc: "Вступайте в сеть в качестве исследователя или представителя организации для публикации материалов и доступа к архивам.",
    joinBtn: "Присоединиться к сети знаний →",
  },
};

export function GuestKnowledgeV2() {
  const { locale } = useLocale();
  const t = COPY[locale];
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedAccess, setSelectedAccess] = useState<string>("all");

  const topicFilters = useMemo(() => [
    { id: "all", label: t.filterAll, matchKeyword: "" },
    { id: "materials", label: t.materials, matchKeyword: "vật liệu" },
    { id: "ocean", label: t.ocean, matchKeyword: "hải dương" },
    { id: "aiData", label: t.aiData, matchKeyword: "ai" },
    { id: "energy", label: t.energy, matchKeyword: "năng lượng" },
    { id: "biotech", label: t.biotech, matchKeyword: "sinh học" },
  ], [t.aiData, t.biotech, t.energy, t.filterAll, t.materials, t.ocean]);

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_KNOWLEDGE_RESOURCES.filter((res) => {
      // Type match
      if (selectedType !== "all" && res.type !== selectedType) return false;
      // Access match
      if (selectedAccess !== "all" && res.accessLevel !== selectedAccess) return false;
      // Topic match
      if (selectedTopic !== "all") {
        const target = topicFilters.find((f) => f.id === selectedTopic);
        if (target?.matchKeyword) {
          const content = `${res.topics.join(" ")} ${res.meta} ${res.title}`.toLowerCase();
          if (!content.includes(target.matchKeyword)) return false;
        }
      }
      // Query match
      if (q) {
        const text = `${res.title} ${res.summary} ${res.topics.join(" ")} ${res.authors?.join(" ") || ""} ${res.doi || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [query, selectedTopic, selectedType, selectedAccess, topicFilters]);

  return (
    <div className="min-h-screen bg-[#ebf4ff] text-slate-950">
      <GuestPublicNav active="knowledge" />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-blue-200/80 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,.22),transparent_38%),linear-gradient(180deg,#dbeafe_0%,#eff6ff_55%,#e1effe_100%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(59,130,246,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.045)_1px,transparent_1px)] [background-size:42px_42px]" aria-hidden="true" />
          <div className="relative mx-auto max-w-[1460px]">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/80 bg-blue-100/90 px-4 py-2 text-xs sm:text-[13px] font-black uppercase tracking-[0.1em] text-blue-800">
                ✦ {t.kicker}
              </span>
              <h1 className="mt-6 text-balance text-4xl font-black leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[68px]">
                {t.title1}<br />
                <span className="text-blue-600">{t.title2}</span><br />
                <span className="text-slate-900">{t.title3}</span>
              </h1>
              <p className="mt-6 max-w-3xl text-base sm:text-lg md:text-[19px] font-normal leading-relaxed text-slate-700">
                {t.intro}
              </p>

              {/* Search Bar */}
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
                    <button type="button" onClick={() => setQuery("")} className="text-xs font-bold text-slate-400 hover:text-slate-600">✕</button>
                  )}
                </div>
                <button
                  type="button"
                  className="inline-flex min-h-13 items-center justify-center rounded-xl bg-blue-600 px-7 text-sm sm:text-base font-bold text-white shadow-[0_12px_28px_-12px_rgba(37,99,235,.85)] transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  {t.searchBtn}
                </button>
              </div>

              {/* Quick stats pills */}
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm md:text-[15px] font-bold text-slate-700">
                <span className="inline-flex items-center gap-2"><b className="text-base text-blue-600">◉</b> 350+ Tài liệu & Chuyên đề</span>
                <span className="inline-flex items-center gap-2"><b className="text-base text-blue-600">◎</b> 14 Hướng nghiên cứu 2026</span>
                <span className="inline-flex items-center gap-2"><b className="text-base text-blue-600">◇</b> 100% Dữ liệu xác thực</span>
                <span className="inline-flex items-center gap-2"><b className="text-base text-blue-600">✦</b> Open Science VAST – RAS</span>
              </div>
            </div>
          </div>
        </section>

        {/* Explorer Content Section */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            {/* Top Filter Bar */}
            <div className="rounded-2xl border border-blue-200/80 bg-white/90 p-5 shadow-[0_16px_40px_-32px_rgba(37,99,235,.4)]">
              {/* Category pills */}
              <div className="flex flex-wrap items-center gap-2.5">
                {topicFilters.map((tf) => (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => setSelectedTopic(tf.id)}
                    className={`rounded-xl px-4.5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                      selectedTopic === tf.id
                        ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                        : "border border-blue-200/80 bg-blue-50/50 text-slate-700 hover:bg-blue-100/70 hover:text-blue-800"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Secondary Select Dropdowns */}
              <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-blue-100 pt-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    aria-label={t.typeFilter}
                    className="h-10 rounded-xl border border-blue-200 bg-white px-3 text-xs sm:text-sm font-bold text-slate-700 shadow-xs outline-none transition focus:border-blue-400"
                  >
                    <option value="all">{t.allTypes}</option>
                    <option value="PUBLICATION">{TYPE_LABELS.PUBLICATION[locale]}</option>
                    <option value="DATASET">{TYPE_LABELS.DATASET[locale]}</option>
                    <option value="TECHNICAL_REPORT">{TYPE_LABELS.TECHNICAL_REPORT[locale]}</option>
                    <option value="MANUSCRIPT">{TYPE_LABELS.MANUSCRIPT[locale]}</option>
                    <option value="TOPIC">{TYPE_LABELS.TOPIC[locale]}</option>
                  </select>

                  <select
                    value={selectedAccess}
                    onChange={(e) => setSelectedAccess(e.target.value)}
                    aria-label={t.accessFilter}
                    className="h-10 rounded-xl border border-blue-200 bg-white px-3 text-xs sm:text-sm font-bold text-slate-700 shadow-xs outline-none transition focus:border-blue-400"
                  >
                    <option value="all">{t.allAccess}</option>
                    <option value="OPEN">{t.openAccess}</option>
                    <option value="INTERNAL">{t.internal}</option>
                    <option value="RESTRICTED">{t.restricted}</option>
                  </select>
                </div>

                <div className="text-xs sm:text-sm font-extrabold text-slate-600">
                  <span className="text-blue-700">{filteredResources.length}</span> {t.resultsCount}
                </div>
              </div>
            </div>

            {/* Knowledge Resources Cards Grid */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {filteredResources.map((res) => {
                const typeLabel = TYPE_LABELS[res.type]?.[locale] || res.type;
                const isOpen = res.accessLevel === "OPEN";

                return (
                  <article
                    key={res.id}
                    className="group flex flex-col justify-between rounded-3xl border border-blue-200/90 bg-white/95 p-6 sm:p-7 shadow-[0_16px_40px_-32px_rgba(37,99,235,.45)] transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_50px_-28px_rgba(37,99,235,.6)]"
                  >
                    <div>
                      {/* Card Top Metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-blue-800">
                          {typeLabel}
                        </span>

                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          isOpen ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          <span className={`size-2 rounded-full ${isOpen ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {isOpen ? t.openAccess : t.internal}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 text-xl sm:text-2xl font-black leading-snug text-slate-950 transition group-hover:text-blue-700">
                        {res.title}
                      </h3>

                      {/* Meta snippet */}
                      <p className="mt-1.5 text-xs sm:text-sm font-semibold text-blue-700">
                        {res.meta} {res.year ? `· Năm ${res.year}` : ""} {res.doi ? `· DOI: ${res.doi}` : ""}
                      </p>

                      {/* Summary */}
                      <p className="mt-3.5 text-sm sm:text-[15px] leading-relaxed text-slate-600">
                        {res.summary}
                      </p>

                      {/* Authors */}
                      {res.authors && res.authors.length > 0 && (
                        <div className="mt-4 text-xs sm:text-sm text-slate-700">
                          <strong className="font-bold text-slate-900">{t.authorsLabel}</strong> {res.authors.join(", ")}
                        </div>
                      )}
                    </div>

                    {/* Card Bottom: Tags & Actions */}
                    <div className="mt-6 border-t border-blue-100 pt-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {res.topics.map((tag) => (
                            <span key={tag} className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-slate-700">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          href="/login"
                          className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-blue-700 transition hover:text-blue-900 hover:underline"
                        >
                          {t.readMore} →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Featured Thematic Tracks */}
            <div className="mt-16 rounded-3xl border border-blue-200/90 bg-gradient-to-b from-[#e0efff] to-[#eff6ff] p-8 sm:p-10 shadow-[0_20px_50px_-32px_rgba(37,99,235,.4)]">
              <div className="max-w-3xl">
                <span className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-blue-800">
                  ✦ Tuyến tri thức song phương
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black text-slate-950">
                  {t.featuredTracksTitle}
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                  {t.featuredTracksDesc}
                </p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Nano-composite & Lớp phủ bảo vệ biển",
                    track: "Vật liệu mới",
                    count: "48 bài báo & báo cáo",
                    collab: "Viện KH Vật liệu (VAST) – Viện Hóa vô cơ (RAS)",
                  },
                  {
                    title: "Hệ thống phao quan trắc & CSDL Hải dương",
                    track: "Khoa học Biển",
                    count: "12 bộ dữ liệu chuỗi thời gian",
                    collab: "Viện Hải dương học – Viện Hải dương học Shirshov",
                  },
                  {
                    title: "Xử lý dữ liệu ngôn ngữ khoa học đa ngữ",
                    track: "AI & Dữ liệu",
                    count: "24 mô hình & chuyên đề",
                    collab: "ĐHQG Hà Nội – Viện Hàn lâm Khoa học Nga",
                  },
                ].map((track) => (
                  <div key={track.title} className="rounded-2xl border border-blue-200/80 bg-white/90 p-6 shadow-xs">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                      {track.track}
                    </span>
                    <h3 className="mt-3 text-lg font-black text-slate-950">{track.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm font-semibold text-blue-700">{track.count}</p>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">{track.collab}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Science Protocol Banner */}
            <div className="mt-12 flex flex-col gap-6 rounded-3xl border border-blue-300/80 bg-white p-7 sm:p-9 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-emerald-500" />
                  <h3 className="text-base sm:text-lg font-black text-slate-950">{t.openScienceTitle}</h3>
                </div>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {t.openScienceDesc}
                </p>
              </div>
              <Link
                href="/opportunities"
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700"
              >
                Khám phá đề tài hợp tác →
              </Link>
            </div>

            {/* Join CTA Box */}
            <div className="mt-12 rounded-3xl border border-blue-300 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 sm:p-12 text-white shadow-[0_24px_50px_-24px_rgba(37,99,235,.8)]">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <span className="rounded-full border border-blue-300/40 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-100">
                  ✦ Đóng góp vào hệ sinh thái
                </span>
                <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
                  {t.joinTitle}
                </h2>
                <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-blue-100">
                  {t.joinDesc}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    href="/login"
                    className="inline-flex min-h-12 items-center rounded-xl bg-white px-7 text-sm sm:text-base font-extrabold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    {t.joinBtn}
                  </Link>
                  <Link
                    href="/experts"
                    className="inline-flex min-h-12 items-center rounded-xl border border-white/30 bg-white/10 px-6 text-sm sm:text-base font-bold text-white transition hover:bg-white/20"
                  >
                    Xem mạng lưới chuyên gia
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional 4-Column Footer */}
      <footer id="news" className="border-t border-blue-200/90 bg-[#e3eefc] pt-14 pb-10 text-slate-700">
        <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3.5" aria-label="Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xs">
                  <span className="absolute inset-y-0 left-0 w-[62%] -skew-x-12 bg-blue-600" />
                  <span className="absolute inset-y-0 right-0 w-[46%] -skew-x-12 bg-rose-500" />
                </span>
                <span>
                  <strong className="block text-base sm:text-lg font-black tracking-tight text-slate-950">Mạng lưới Tri thức KH&CN</strong>
                  <small className="block text-xs font-extrabold tracking-wider text-slate-600 uppercase">Nga – Việt</small>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-600">
                Cổng thông tin & điều phối hợp tác khoa học công nghệ độc lập giữa các viện nghiên cứu, trường đại học trọng điểm của Việt Nam và Liên bang Nga.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-xs font-bold text-blue-800 shadow-xs">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Cổng dữ liệu mở KH&CN 2026
                </span>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">Khám phá hệ sinh thái</h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li><Link href="/opportunities" className="transition hover:text-blue-700 hover:underline">Chương trình & Cơ hội nghiên cứu</Link></li>
                <li><Link href="/experts" className="transition hover:text-blue-700 hover:underline">Mạng lưới Chuyên gia xác thực</Link></li>
                <li><Link href="/knowledge" className="transition hover:text-blue-700 hover:underline">Kho tri thức & Báo cáo KH&CN</Link></li>
                <li><Link href="/#about" className="transition hover:text-blue-700 hover:underline">Viện & Đại học đối tác liên kết</Link></li>
                <li><Link href="/#events" className="transition hover:text-blue-700 hover:underline">Hội thảo & Diễn đàn khoa học</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">Hướng trọng điểm</h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li><span className="text-slate-700">Trí tuệ nhân tạo & Dữ liệu</span></li>
                <li><span className="text-slate-700">Khoa học Biển & Hải dương</span></li>
                <li><span className="text-slate-700">Vật liệu mới & Nano</span></li>
                <li><span className="text-slate-700">Năng lượng sạch & Nguyên tử</span></li>
                <li><span className="text-slate-700">Công nghệ sinh học biển</span></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">Điều phối & Liên hệ</h4>
              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600">
                <div>
                  <strong className="block font-bold text-slate-900">Văn phòng Điều phối Hà Nội:</strong>
                  <span>Viện Hàn lâm KH&CN Việt Nam (VAST), 18 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</span>
                </div>
                <div>
                  <strong className="block font-bold text-slate-900">Văn phòng Đối tác Moskva:</strong>
                  <span>Viện Hàn lâm Khoa học Nga (RAS), Leninsky Prospekt 14, Moskva</span>
                </div>
                <div className="pt-1">
                  <span className="block font-medium">Hỗ trợ kỹ thuật & kết nối đề tài:</span>
                  <a href="mailto:contact@vnru-network.org" className="font-bold text-blue-700 transition hover:underline">contact@vnru-network.org</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blue-200/80 pt-8 text-xs sm:text-sm font-medium text-slate-600 md:flex-row">
            <p>© 2026 Mạng lưới Tri thức Khoa học – Công nghệ Nga – Việt. Bảo lưu mọi quyền.</p>
            <div className="flex flex-wrap gap-5 font-semibold text-slate-600">
              <Link href="/#about" className="hover:text-blue-700">Điều khoản hợp tác</Link>
              <Link href="/#about" className="hover:text-blue-700">Chính sách bảo mật</Link>
              <Link href="/#about" className="hover:text-blue-700">Chuẩn mực đạo đức nghiên cứu</Link>
              <Link href="/#about" className="hover:text-blue-700">Dữ liệu mở song phương</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
