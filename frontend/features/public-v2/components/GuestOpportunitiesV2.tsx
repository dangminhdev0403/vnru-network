"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { localizeReactNode } from "@/core/i18n/localize-react-node";
import { PUBLIC_STATIC_TRANSLATIONS } from "./public-static-translations";
import { DEMO_OPPORTUNITIES } from "@/features/workspace/mock-data/opportunities";
import { GuestPublicNav } from "./GuestPublicNav";

const COPY: Record<
  Locale,
  {
    brandTitle: string;
    kicker: string;
    title1: string;
    title2: string;
    title3: string;
    intro: string;
    searchPlaceholder: string;
    searchBtn: string;
    allFields: string;
    materials: string;
    ocean: string;
    aiData: string;
    energy: string;
    biotech: string;
    statusFilter: string;
    allStatus: string;
    openStatus: string;
    draftStatus: string;
    closedStatus: string;
    scopeFilter: string;
    allScopes: string;
    resultsCount: string;
    viewDetail: string;
    applyNow: string;
    findExperts: string;
    eligibleLabel: string;
    deadlineLabel: string;
    howItWorksTitle: string;
    howItWorksDesc: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
  }
> = {
  vi: {
    brandTitle: "Mạng lưới tri thức Nga - Việt",
    kicker: "Chương trình Hợp tác KH & CN Trọng điểm · 2026",
    title1: "Cơ hội Hợp tác Nghiên cứu",
    title2: "Khoa học – Công nghệ",
    title3: "Nga – Việt",
    intro:
      "Khám phá các chương trình kêu gọi đề xuất đề tài song phương, tài trợ nghiên cứu học thuật độc lập và thành lập nhóm nghiên cứu chung giữa các viện và trường đại học Việt Nam – Liên bang Nga.",
    searchPlaceholder:
      "Tìm kiếm đề tài theo tên chương trình, mã đề xuất, từ khóa, chuyên ngành...",
    searchBtn: "Tìm kiếm",
    allFields: "Tất cả lĩnh vực",
    materials: "Vật liệu mới & Nano",
    ocean: "Khoa học Biển & Hải dương",
    aiData: "AI & Dữ liệu",
    energy: "Năng lượng sạch",
    biotech: "Sinh học & Dược liệu",
    statusFilter: "Trạng thái",
    allStatus: "Tất cả trạng thái",
    openStatus: "Đang mở nhận hồ sơ",
    draftStatus: "Chuẩn bị mở đợt mới",
    closedStatus: "Đã hoàn thành đợt tuyển",
    scopeFilter: "Quy mô hợp tác",
    allScopes: "Tất cả quy mô",
    resultsCount: "cơ hội hợp tác nghiên cứu phù hợp",
    viewDetail: "Xem chi tiết đề tài",
    applyNow: "Gửi đề xuất nghiên cứu",
    findExperts: "Tìm chuyên gia",
    eligibleLabel: "Đối tác hợp lệ:",
    deadlineLabel: "Hạn nhận hồ sơ:",
    howItWorksTitle: "Quy trình kết nối đề tài nghiên cứu song phương",
    howItWorksDesc:
      "Quy trình 4 bước tinh gọn giúp các nhà khoa học và tổ chức tiếp cận đề tài nghiên cứu khoa học song phương.",
    step1Title: "1. Khám phá & Chọn đề tài",
    step1Desc:
      "Tra cứu các chương trình kêu gọi đề tài phù hợp với năng lực và định hướng nghiên cứu của bạn.",
    step2Title: "2. Ghép nối chuyên gia đối tác",
    step2Desc:
      "Kết nối với đồng tác giả hoặc phòng thí nghiệm tại Việt Nam hoặc Liên bang Nga qua mạng lưới chuyên gia.",
    step3Title: "3. Thuyết minh & Thẩm định",
    step3Desc:
      "Soạn thảo đề xuất khoa học chung và gửi thẩm định qua hội đồng chuyên môn độc lập của Mạng lưới.",
    step4Title: "4. Triển khai & Công bố",
    step4Desc:
      "Tiến hành nghiên cứu, chia sẻ dữ liệu thử nghiệm và công bố kết quả khoa học trên các tạp chí uy tín.",
    ctaTitle: "Tổ chức của bạn muốn công bố đề tài hoặc mời hợp tác mới?",
    ctaDesc:
      "Đăng nhập với vai trò Đại diện Tổ chức hoặc Điều phối viên để tạo chương trình hợp tác mới và tiếp cận các nhà khoa học hàng đầu.",
    ctaBtn: "Đăng ký mở đề tài hợp tác →",
  },
  en: {
    brandTitle: "Russia - Vietnam Knowledge Network",
    kicker: "Priority S & T Collaboration Programmes · 2026",
    title1: "Bilateral Research",
    title2: "Collaboration Opportunities",
    title3: "Russia – Vietnam",
    intro:
      "Explore open calls for bilateral proposals, independent academic initiatives, and joint research-group formations across leading institutes and universities in Vietnam and the Russian Federation.",
    searchPlaceholder:
      "Search opportunities by title, code, keywords, discipline...",
    searchBtn: "Search",
    allFields: "All Fields",
    materials: "Advanced Materials & Nano",
    ocean: "Oceanography & Marine Sciences",
    aiData: "AI & Scientific Data",
    energy: "Clean Energy",
    biotech: "Biotech & Pharmaceuticals",
    statusFilter: "Status",
    allStatus: "All Statuses",
    openStatus: "Open for Proposals",
    draftStatus: "Upcoming Call",
    closedStatus: "Closed",
    scopeFilter: "Collaboration Scope",
    allScopes: "All Scopes",
    resultsCount: "matching research opportunities",
    viewDetail: "View Opportunity Details",
    applyNow: "Submit Research Proposal",
    findExperts: "Find Experts",
    eligibleLabel: "Eligible Partners:",
    deadlineLabel: "Closing Date:",
    howItWorksTitle: "How Bilateral Research Collaboration Works",
    howItWorksDesc:
      "A streamlined 4-step framework to connect scientists, laboratories, and bilateral research programmes.",
    step1Title: "1. Discover & Select Call",
    step1Desc:
      "Browse open research opportunities aligned with your academic focus and equipment capacity.",
    step2Title: "2. Pair with Bilateral Partners",
    step2Desc:
      "Connect with co-investigators or partner institutes in Vietnam or Russia via our verified expert directory.",
    step3Title: "3. Submit & Independent Peer Review",
    step3Desc:
      "Draft your joint proposal and undergo evaluation by the independent peer-review council.",
    step4Title: "4. Execute & Joint Publication",
    step4Desc:
      "Conduct research, exchange observational datasets, and co-author high-impact publications.",
    ctaTitle: "Looking to launch a new research call or joint laboratory?",
    ctaDesc:
      "Sign in with an Organization Representative or Coordinator persona to publish bilateral calls and recruit top scientific talent.",
    ctaBtn: "Launch a Research Opportunity →",
  },
  ru: {
    brandTitle: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
    kicker: "Приоритетные программы НТИ · Фонд «Традиции и дружба»",
    title1: "Возможности совместных",
    title2: "научных исследований",
    title3: "Россия – Вьетнам",
    intro:
      "Конкурсы совместных исследовательских проектов, грантовые программы и формирование двусторонних научных коллективов институтов и университетов России и Вьетнама.",
    searchPlaceholder:
      "Поиск по названию конкурса, коду, ключевым словам, дисциплине...",
    searchBtn: "Искать",
    allFields: "Все области",
    materials: "Новые материалы и нано",
    ocean: "Океанология и морские науки",
    aiData: "ИИ и данные",
    energy: "Чистая энергетика",
    biotech: "Биотехнологии и фармакология",
    statusFilter: "Статус",
    allStatus: "Любой статус",
    openStatus: "Приём заявок открыт",
    draftStatus: "Планируемый конкурс",
    closedStatus: "Приём завершён",
    scopeFilter: "Масштаб сотрудничества",
    allScopes: "Все масштабы",
    resultsCount: "найденных возможностей",
    viewDetail: "Подробнее о конкурсе",
    applyNow: "Подать заявку",
    findExperts: "Найти экспертов",
    eligibleLabel: "Требования к участникам:",
    deadlineLabel: "Срок подачи:",
    howItWorksTitle: "Порядок реализации двусторонних проектов",
    howItWorksDesc:
      "Пошаговый процесс взаимодействия научных групп и исследовательских организаций двух стран.",
    step1Title: "1. Выбор направления",
    step1Desc:
      "Изучение открытых конкурсов, соответствующих научному профилю вашей лаборатории.",
    step2Title: "2. Подбор партнеров",
    step2Desc:
      "Поиск соавторов и партнеров в России или Вьетнаме через верифицированную базу экспертов.",
    step3Title: "3. Подготовка и экспертиза",
    step3Desc:
      "Формирование совместной заявки и прохождение независимой научной экспертизы.",
    step4Title: "4. Проведение исследований",
    step4Desc:
      "Выполнение работ, обмен научными данными и совместные публикации в рецензируемых журналах.",
    ctaTitle:
      "Хотите объявить новый конкурс или создать совместную лабораторию?",
    ctaDesc:
      "Войдите как представитель организации или координатор для публикации программ и привлечения исследователей.",
    ctaBtn: "Создать совместный конкурс →",
  },
};

export function GuestOpportunitiesV2() {
  const { locale } = useLocale();
  const t = COPY[locale];
  const [query, setQuery] = useState("");
  const [selectedField, setSelectedField] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const fieldFilters = useMemo(
    () => [
      { id: "all", label: t.allFields, matchKeyword: "" },
      { id: "materials", label: t.materials, matchKeyword: "vật liệu" },
      { id: "ocean", label: t.ocean, matchKeyword: "biển" },
      { id: "aiData", label: t.aiData, matchKeyword: "ai" },
      { id: "energy", label: t.energy, matchKeyword: "năng lượng" },
      { id: "biotech", label: t.biotech, matchKeyword: "sinh học" },
    ],
    [t.aiData, t.allFields, t.biotech, t.energy, t.materials, t.ocean],
  );

  const filteredOpportunities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_OPPORTUNITIES.filter((opp) => {
      // Status filter
      if (selectedStatus === "open" && opp.state !== "PUBLISHED") return false;
      if (selectedStatus === "draft" && opp.state !== "DRAFT") return false;
      // Field filter
      if (selectedField !== "all") {
        const target = fieldFilters.find((f) => f.id === selectedField);
        if (target?.matchKeyword) {
          const content =
            `${opp.field} ${opp.title} ${opp.topics?.join(" ") || ""}`.toLowerCase();
          if (!content.includes(target.matchKeyword)) return false;
        }
      }
      // Query filter
      if (q) {
        const text =
          `${opp.title} ${opp.code} ${opp.field} ${opp.summary || ""} ${opp.topics?.join(" ") || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [fieldFilters, query, selectedField, selectedStatus]);

  return localizeReactNode(
    <div className="min-h-screen bg-[#ebf4ff] text-slate-950">
      <GuestPublicNav active="opportunities" />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-blue-200/80 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,.22),transparent_38%),linear-gradient(180deg,#dbeafe_0%,#eff6ff_55%,#e1effe_100%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div
            className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(59,130,246,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.045)_1px,transparent_1px)] [background-size:42px_42px]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[1460px]">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/80 bg-blue-100/90 px-4 py-2 text-xs sm:text-[13px] font-black uppercase tracking-[0.1em] text-blue-800">
                ✦ {t.kicker}
              </span>
              <h1 className="mt-6 text-balance text-4xl font-black leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[68px]">
                {t.title1}
                <br />
                <span className="text-blue-600">{t.title2}</span>
                <br />
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
                  className="inline-flex min-h-13 items-center justify-center rounded-xl bg-blue-600 px-7 text-sm sm:text-base font-bold text-white shadow-[0_12px_28px_-12px_rgba(37,99,235,.85)] transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  {t.searchBtn}
                </button>
              </div>

              {/* Quick stats pills */}
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm md:text-[15px] font-bold text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <b className="text-base text-blue-600">◉</b> 300+ Đề tài đã
                  kết nối
                </span>
                <span className="inline-flex items-center gap-2">
                  <b className="text-base text-blue-600">◎</b> 14 Lĩnh vực ưu
                  tiên 2026
                </span>
                <span className="inline-flex items-center gap-2">
                  <b className="text-base text-blue-600">◇</b> 100% Học thuật &
                  Nghiên cứu
                </span>
                <span className="inline-flex items-center gap-2">
                  <b className="text-base text-blue-600">✦</b> Chương trình VAST
                  – RAS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Opportunities Explorer */}
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            {/* Filter Bar */}
            <div className="rounded-2xl border border-blue-200/80 bg-white/90 p-5 shadow-[0_16px_40px_-32px_rgba(37,99,235,.4)]">
              {/* Field filter buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {fieldFilters.map((ff) => (
                  <button
                    key={ff.id}
                    type="button"
                    onClick={() => setSelectedField(ff.id)}
                    className={`rounded-xl px-4.5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                      selectedField === ff.id
                        ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                        : "border border-blue-200/80 bg-blue-50/50 text-slate-700 hover:bg-blue-100/70 hover:text-blue-800"
                    }`}
                  >
                    {ff.label}
                  </button>
                ))}
              </div>

              {/* Status filter dropdown and count */}
              <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-blue-100 pt-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    aria-label={t.statusFilter}
                    className="h-10 rounded-xl border border-blue-200 bg-white px-3 text-xs sm:text-sm font-bold text-slate-700 shadow-xs outline-none transition focus:border-blue-400"
                  >
                    <option value="all">{t.allStatus}</option>
                    <option value="open">{t.openStatus}</option>
                    <option value="draft">{t.draftStatus}</option>
                  </select>
                </div>

                <div className="text-xs sm:text-sm font-extrabold text-slate-600">
                  <span className="text-blue-700">
                    {filteredOpportunities.length}
                  </span>{" "}
                  {t.resultsCount}
                </div>
              </div>
            </div>

            {/* Opportunities List / Cards */}
            <div className="mt-8 space-y-6">
              {filteredOpportunities.map((opp) => {
                const isOpen = opp.state === "PUBLISHED";

                return (
                  <article
                    key={opp.id}
                    className="group rounded-3xl border border-blue-200/90 bg-white/95 p-6 sm:p-8 shadow-[0_16px_40px_-32px_rgba(37,99,235,.45)] transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_24px_50px_-28px_rgba(37,99,235,.6)]"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-4xl min-w-0 flex-1">
                        {/* Top Badges */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                              isOpen
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            <span
                              className={`size-2 rounded-full ${isOpen ? "bg-emerald-500" : "bg-amber-500"}`}
                            />
                            {isOpen ? t.openStatus : t.draftStatus}
                          </span>

                          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-mono font-bold text-blue-800">
                            {opp.code}
                          </span>

                          <span className="rounded-full border border-blue-200/80 bg-slate-100/90 px-3 py-1 text-xs font-bold text-slate-800">
                            {opp.field}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="mt-3.5 text-2xl sm:text-3xl font-black text-slate-950 transition group-hover:text-blue-700">
                          {opp.title}
                        </h2>

                        {/* Summary */}
                        <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-700 font-normal">
                          {opp.summary}
                        </p>

                        {/* Scope & Partner Requirement */}
                        {opp.eligiblePartners && (
                          <div className="mt-4 rounded-xl bg-blue-50/70 p-3.5 text-xs sm:text-sm text-slate-700">
                            <strong className="font-bold text-slate-900">
                              {t.eligibleLabel}
                            </strong>{" "}
                            {opp.eligiblePartners}
                          </div>
                        )}

                        {/* Topics */}
                        {opp.topics && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {opp.topics.map((topic) => (
                              <span
                                key={topic}
                                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700"
                              >
                                #{topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Meta & Actions */}
                      <div className="flex shrink-0 flex-col items-start gap-4 border-t border-blue-100 pt-5 lg:w-72 lg:items-end lg:border-t-0 lg:pt-0">
                        <div className="text-xs sm:text-sm font-semibold text-slate-600 lg:text-right">
                          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            {t.deadlineLabel}
                          </span>
                          <strong className="mt-1 block text-base font-black text-slate-900">
                            {opp.closes}
                          </strong>
                        </div>

                        <div className="flex w-full flex-col gap-2.5 sm:flex-row lg:flex-col">
                          <Link
                            href="/login"
                            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700"
                          >
                            {t.applyNow} →
                          </Link>
                          <Link
                            href="/experts"
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 text-sm font-bold text-blue-700 shadow-xs transition hover:bg-blue-50"
                          >
                            {t.findExperts}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* How Bilateral Collaboration Works */}
            <div className="mt-16 rounded-3xl border border-blue-200/90 bg-gradient-to-b from-[#e0efff] to-[#eff6ff] p-8 sm:p-12 shadow-[0_20px_50px_-32px_rgba(37,99,235,.4)]">
              <div className="max-w-3xl">
                <span className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-blue-800">
                  ✦ Quy trình hợp tác song phương
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black text-slate-950">
                  {t.howItWorksTitle}
                </h2>
                <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-700 font-normal">
                  {t.howItWorksDesc}
                </p>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: t.step1Title, desc: t.step1Desc },
                  { title: t.step2Title, desc: t.step2Desc },
                  { title: t.step3Title, desc: t.step3Desc },
                  { title: t.step4Title, desc: t.step4Desc },
                ].map((step, idx) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-blue-200/80 bg-white/95 p-6 shadow-xs"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white">
                      0{idx + 1}
                    </span>
                    <h3 className="mt-4 text-base sm:text-lg font-black text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="mt-12 rounded-3xl border border-blue-300 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 sm:p-12 text-white shadow-[0_24px_50px_-24px_rgba(37,99,235,.8)]">
              <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
                <span className="rounded-full border border-blue-300/40 bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-100">
                  ✦ Mở rộng mạng lưới hợp tác
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
                    className="inline-flex min-h-12 items-center rounded-xl bg-white px-7 text-sm sm:text-base font-extrabold text-blue-700 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    {t.ctaBtn}
                  </Link>
                  <Link
                    href="/knowledge"
                    className="inline-flex min-h-12 items-center rounded-xl border border-white/30 bg-white/10 px-6 text-sm sm:text-base font-bold text-white transition hover:bg-white/20"
                  >
                    Khám phá kho tri thức
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional 4-Column Footer */}
      <footer
        id="contact"
        className="scroll-mt-24 border-t border-blue-200/90 bg-[#e3eefc] pt-14 pb-10 text-slate-700"
      >
        <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3.5"
                aria-label={t.brandTitle}
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xs">
                  <span className="absolute inset-y-0 left-0 w-[62%] -skew-x-12 bg-blue-600" />
                  <span className="absolute inset-y-0 right-0 w-[46%] -skew-x-12 bg-rose-500" />
                </span>
                <span>
                  <strong className="block text-base sm:text-lg font-black tracking-tight text-slate-950">
                    {t.brandTitle}
                  </strong>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-600">
                Cổng thông tin & điều phối hợp tác khoa học công nghệ độc lập
                giữa các viện nghiên cứu, trường đại học trọng điểm của Việt Nam
                và Liên bang Nga.
              </p>
            </div>

            <div className="xl:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">
                Khám phá hệ sinh thái
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li>
                  <Link
                    href="/opportunities"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    Chương trình & Cơ hội nghiên cứu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/experts"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    Mạng lưới Chuyên gia xác thực
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    Kho tri thức & Báo cáo KH & CN
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    Viện & Đại học đối tác liên kết
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#events"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    Hội thảo & Diễn đàn khoa học
                  </Link>
                </li>
              </ul>
            </div>

            <div className="xl:col-span-2">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">
                Hướng trọng điểm
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li>
                  <span className="text-slate-700">
                    Trí tuệ nhân tạo & Dữ liệu
                  </span>
                </li>
                <li>
                  <span className="text-slate-700">
                    Khoa học Biển & Hải dương
                  </span>
                </li>
                <li>
                  <span className="text-slate-700">Vật liệu mới & Nano</span>
                </li>
                <li>
                  <span className="text-slate-700">
                    Năng lượng sạch & Nguyên tử
                  </span>
                </li>
                <li>
                  <span className="text-slate-700">
                    Công nghệ sinh học biển
                  </span>
                </li>
              </ul>
            </div>

            <div className="xl:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">
                Điều phối & Liên hệ
              </h4>
              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600">
                <div>
                  <strong className="block font-bold text-slate-900">
                    Quỹ Truyền thống và Hữu nghị:
                  </strong>
                  <span>
                    125047, Moskva, Đường Tverskaya-Yamskaya số 1, Tòa nhà 30,
                    Văn phòng 01B, Liên bang Nga
                  </span>
                </div>
                <div className="pt-1">
                  <span className="block font-medium">Email:</span>
                  <a
                    href="mailto:info@fonddruzhba.ru"
                    className="font-bold text-blue-700 transition hover:underline"
                  >
                    info@fonddruzhba.ru
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blue-200/80 pt-8 text-xs sm:text-sm font-medium text-slate-600 md:flex-row">
            <p>© 2026 Mạng lưới tri thức Nga - Việt. Bảo lưu mọi quyền.</p>
            <div className="flex flex-wrap gap-5 font-semibold text-slate-600">
              <Link href="/#about" className="hover:text-blue-700">
                Điều khoản hợp tác
              </Link>
              <Link href="/#about" className="hover:text-blue-700">
                Chính sách bảo mật
              </Link>
              <Link href="/#about" className="hover:text-blue-700">
                Chuẩn mực đạo đức nghiên cứu
              </Link>
              <Link href="/#about" className="hover:text-blue-700">
                Dữ liệu mở song phương
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>,
    locale,
    PUBLIC_STATIC_TRANSLATIONS,
  );
}
