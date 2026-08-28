"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { EXPERTS, OPPORTUNITIES } from "@/features/public-discovery/mock-data";
import knowledgeNetworkArtwork from "@/public/images/vn-ru-knowledge-network.png";

type Resource = {
  type: "materials" | "energy" | "digital";
  kind: string;
  year: string;
  title: string;
  description: string;
  tags: string[];
};
type Copy = {
  brand: string;
  repo: string;
  topics: string;
  resourcesLabel: string;
  join: string;
  joinNetwork: string;
  back: string;
  kicker: string;
  title: string;
  typed: string;
  intro: string;
  explore: string;
  connect: string;
  russia: string;
  vietnam: string;
  route: string;
  caption: string;
  trails: string;
  sectionTitle: string;
  note: string;
  filters: [string, string, string, string];
  joinKicker: string;
  joinTitle: string;
  joinBody: string;
  resources: Resource[];
};

const COPY: Record<Locale, Copy> = {
  vi: {
    brand: "Mạng lưới RU-VN",
    repo: "Kho tri thức công cộng",
    topics: "Chủ đề",
    resourcesLabel: "Tư liệu",
    join: "Gia nhập",
    joinNetwork: "Gia nhập mạng lưới",
    back: "Trở về trang giới thiệu",
    kicker: "Khám phá · Xem · Tham khảo",
    title: "Tri thức kết nối",
    typed: "Việt Nam – Liên bang Nga.",
    intro:
      "Bắt đầu từ một câu hỏi, đi qua chủ đề và bối cảnh để tìm ra những hướng nghiên cứu đáng tham khảo trong hệ sinh thái khoa học Việt Nam – Liên bang Nga.",
    explore: "Bắt đầu khám phá",
    connect: "Gia nhập để kết nối",
    russia: "Liên bang Nga",
    vietnam: "Việt Nam",
    route: "Tuyến tri thức song phương",
    caption: "Hai hệ sinh thái · Một mạng tri thức",
    trails: "Các tuyến khám phá",
    sectionTitle: "Chọn một chủ đề. Theo dấu các mối liên hệ.",
    note: "Nội dung dưới đây là lớp giới thiệu công cộng, được trình bày theo chủ đề để định hướng đọc và tham khảo; không phải số liệu vận hành hay hồ sơ công bố chính thức.",
    filters: ["Tất cả", "Vật liệu mới", "Năng lượng", "AI & dữ liệu"],
    joinKicker: "Từ tham khảo đến kết nối",
    joinTitle:
      "Gia nhập mạng lưới để hiện diện trong đúng bối cảnh chuyên môn.",
    joinBody:
      "Đăng nhập qua cổng danh tính hiện có để quản lý hồ sơ và tiếp cận các khu vực phù hợp với vai trò được cấp.",
    resources: [
      {
        type: "materials",
        kind: "Chuyên đề",
        year: "Tổng quan",
        title: "Vật liệu chức năng trong môi trường nhiệt độ cao",
        description:
          "Lối vào theo chủ đề để tham khảo hướng nghiên cứu, thuật ngữ và các mối liên hệ chuyên môn.",
        tags: ["Vật liệu", "Nhiệt", "Liên ngành"],
      },
      {
        type: "energy",
        kind: "Tuyển tập",
        year: "Đang mở rộng",
        title: "Chuyển đổi và lưu trữ năng lượng cho hệ thống bền vững",
        description:
          "Khám phá bối cảnh nghiên cứu từ vật liệu lưu trữ đến tối ưu vận hành hệ thống năng lượng.",
        tags: ["Năng lượng", "Lưu trữ", "Hệ thống"],
      },
      {
        type: "digital",
        kind: "Hồ sơ chủ đề",
        year: "Tham khảo",
        title: "AI trong phân tích dữ liệu khoa học đa ngôn ngữ",
        description:
          "Một tuyến đọc về mô hình ngôn ngữ, tìm kiếm ngữ nghĩa và kết nối tri thức Việt–Nga.",
        tags: ["AI", "Dữ liệu", "Đa ngôn ngữ"],
      },
    ],
  },
  en: {
    brand: "RU-VN Network",
    repo: "Public knowledge repository",
    topics: "Topics",
    resourcesLabel: "Resources",
    join: "Join",
    joinNetwork: "Join the network",
    back: "Back to introduction",
    kicker: "Discover · View · Reference",
    title: "Knowledge connects",
    typed: "Vietnam – Russian Federation.",
    intro:
      "Start with a question, move through topics and context, and uncover research directions across the Vietnam–Russia scientific ecosystem.",
    explore: "Start exploring",
    connect: "Join to connect",
    russia: "Russian Federation",
    vietnam: "Vietnam",
    route: "Bilateral knowledge route",
    caption: "Two ecosystems · One knowledge network",
    trails: "Discovery trails",
    sectionTitle: "Choose a topic. Follow the connections.",
    note: "The content below is a public discovery layer for orientation and reference; it is not operational data or an official publication record.",
    filters: ["All", "Advanced materials", "Energy", "AI & data"],
    joinKicker: "From reference to connection",
    joinTitle: "Join the network and be seen in the right research context.",
    joinBody:
      "Sign in through the existing identity gateway to manage your profile and access areas appropriate to your assigned role.",
    resources: [
      {
        type: "materials",
        kind: "Research brief",
        year: "Overview",
        title: "Functional materials in high-temperature environments",
        description:
          "A topic-led entry point into research directions, terminology, and professional relationships.",
        tags: ["Materials", "Thermal", "Interdisciplinary"],
      },
      {
        type: "energy",
        kind: "Collection",
        year: "Expanding",
        title: "Energy conversion and storage for sustainable systems",
        description:
          "Explore the context from storage materials to energy-system optimization.",
        tags: ["Energy", "Storage", "Systems"],
      },
      {
        type: "digital",
        kind: "Topic profile",
        year: "Reference",
        title: "AI for multilingual scientific-data analysis",
        description:
          "A trail across language models, semantic search, and Vietnam–Russia knowledge connections.",
        tags: ["AI", "Data", "Multilingual"],
      },
    ],
  },
  ru: {
    brand: "Сеть RU-VN",
    repo: "Открытое хранилище знаний",
    topics: "Темы",
    resourcesLabel: "Материалы",
    join: "Вступить",
    joinNetwork: "Вступить в сеть",
    back: "Вернуться к обзору",
    kicker: "Исследовать · Смотреть · Изучать",
    title: "Знания объединяют",
    typed: "Вьетнам – Российская Федерация.",
    intro:
      "Начните с вопроса, пройдите через темы и контекст и откройте перспективные направления исследований в научной экосистеме России и Вьетнама.",
    explore: "Начать исследование",
    connect: "Вступить и связаться",
    russia: "Российская Федерация",
    vietnam: "Вьетнам",
    route: "Двусторонний маршрут знаний",
    caption: "Две экосистемы · Одна сеть знаний",
    trails: "Маршруты исследования",
    sectionTitle: "Выберите тему. Проследите связи.",
    note: "Материалы ниже предназначены для навигации и изучения; это не операционные данные и не официальные публикационные записи.",
    filters: ["Все", "Новые материалы", "Энергетика", "ИИ и данные"],
    joinKicker: "От изучения к сотрудничеству",
    joinTitle:
      "Вступайте в сеть, чтобы быть представленными в профессиональном контексте.",
    joinBody:
      "Войдите через действующий шлюз идентификации, чтобы управлять профилем и получить доступ согласно назначенной роли.",
    resources: [
      {
        type: "materials",
        kind: "Тематический обзор",
        year: "Обзор",
        title: "Функциональные материалы для высокотемпературных сред",
        description:
          "Тематическая точка входа в направления исследований, терминологию и профессиональные связи.",
        tags: ["Материалы", "Температура", "Междисциплинарность"],
      },
      {
        type: "energy",
        kind: "Коллекция",
        year: "Дополняется",
        title: "Преобразование и хранение энергии для устойчивых систем",
        description:
          "Исследуйте контекст от материалов для хранения до оптимизации энергетических систем.",
        tags: ["Энергетика", "Хранение", "Системы"],
      },
      {
        type: "digital",
        kind: "Профиль темы",
        year: "Справочный материал",
        title: "ИИ в анализе многоязычных научных данных",
        description:
          "Маршрут по языковым моделям, семантическому поиску и российско-вьетнамским связям знаний.",
        tags: ["ИИ", "Данные", "Многоязычие"],
      },
    ],
  },
};

const DISCOVERY_COPY: Record<
  Locale,
  {
    experts: string;
    expertsTitle: string;
    opportunities: string;
    opportunitiesTitle: string;
    viewAll: string;
    detail: string;
    mock: string;
  }
> = {
  vi: {
    experts: "Chuyên gia",
    expertsTitle: "Gặp những người đang định hình các hướng nghiên cứu.",
    opportunities: "Cơ hội nghiên cứu",
    opportunitiesTitle: "Tìm điểm bắt đầu cho một hợp tác song phương.",
    viewAll: "Xem tất cả",
    detail: "Xem chi tiết",
    mock: "Dữ liệu minh hoạ",
  },
  en: {
    experts: "Experts",
    expertsTitle: "Meet the people shaping these research directions.",
    opportunities: "Research opportunities",
    opportunitiesTitle: "Find a starting point for bilateral collaboration.",
    viewAll: "View all",
    detail: "View details",
    mock: "Illustrative data",
  },
  ru: {
    experts: "Эксперты",
    expertsTitle: "Познакомьтесь с теми, кто формирует научные направления.",
    opportunities: "Исследовательские возможности",
    opportunitiesTitle: "Найдите точку входа для двустороннего сотрудничества.",
    viewAll: "Смотреть все",
    detail: "Подробнее",
    mock: "Демонстрационные данные",
  },
};

const RESOURCE_ROUTES: Record<
  Resource["type"],
  { expertId: string; opportunityId: string }
> = {
  materials: {
    expertId: "nguyen-van-an",
    opportunityId: "functional-materials",
  },
  energy: {
    expertId: "elena-kurchatova",
    opportunityId: "functional-materials",
  },
  digital: { expertId: "le-thi-mai", opportunityId: "ai-scientific-data" },
};

function useTyping(text: string, reduced: boolean | null) {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (reduced) return;
    const chars = [
      ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
        text,
      ),
    ].map(({ segment }) => segment);
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setTyped(chars.slice(0, index).join(""));
      if (index >= chars.length) clearInterval(timer);
    }, 42);
    return () => clearInterval(timer);
  }, [reduced, text]);
  return reduced ? text : typed;
}

function BilateralMap({
  t,
  experts,
  opportunities,
  reduced,
}: {
  t: Copy;
  experts: string;
  opportunities: string;
  reduced: boolean | null;
}) {
  const paths = [
    { index: "01", href: "#topics", label: t.topics },
    { index: "02", href: "#experts", label: experts },
    { index: "03", href: "#opportunities", label: opportunities },
  ];

  return (
    <motion.figure
      initial={false}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.24 }}
      className="mx-auto w-full max-w-[340px] sm:max-w-[520px]"
    >
      <div className="rounded-[1.75rem] border border-white/10 bg-[#071a38]/60 p-3 shadow-[0_28px_80px_-42px_rgba(56,189,248,.75)] backdrop-blur-sm sm:p-4">
        <Image
          src={knowledgeNetworkArtwork}
          alt={`${t.russia} — ${t.vietnam}. ${t.caption}`}
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 488px, (min-width: 640px) 70vw, 316px"
          className="h-auto w-full object-contain"
        />
        <figcaption className="mt-2 grid grid-cols-3 border-t border-white/10 pt-2">
          {paths.map((path) => (
            <a
              key={path.href}
              href={path.href}
              className="group min-w-0 border-r border-white/10 px-2 py-2 last:border-r-0 sm:px-3"
            >
              <span className="block text-[0.625rem] font-black tracking-[0.14em] text-sky-300">
                {path.index}
              </span>
              <span className="mt-1 block truncate text-xs font-bold text-slate-200 transition-colors group-hover:text-white">
                {path.label}
              </span>
            </a>
          ))}
        </figcaption>
      </div>
    </motion.figure>
  );
}

export function KnowledgeDiscovery() {
  const { locale } = useLocale();
  const t = COPY[locale];
  const discovery = DISCOVERY_COPY[locale];
  const [topic, setTopic] = useState<"all" | Resource["type"]>("all");
  const reduced = useReducedMotion();
  const typed = useTyping(t.typed, reduced);
  const filters = [
    { id: "all" as const, label: t.filters[0] },
    { id: "materials" as const, label: t.filters[1] },
    { id: "energy" as const, label: t.filters[2] },
    { id: "digital" as const, label: t.filters[3] },
  ];
  const visible = useMemo(
    () => t.resources.filter((item) => topic === "all" || item.type === topic),
    [t.resources, topic],
  );
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return (
    <div className="knowledge-discovery min-h-screen bg-[#f5f1e8] text-[#0b1c30]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06152f]/90 text-white backdrop-blur-xl">
        <div className="mx-auto flex min-h-18 max-w-[1380px] items-center gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            aria-label={t.brand}
          >
            <span className="relative grid h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white">
              <span className="absolute inset-y-0 left-0 w-[64%] -skew-x-12 bg-[#1d4ed8]" />
              <span className="absolute inset-y-0 right-0 w-[48%] -skew-x-12 bg-[#dc2626]" />
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-sm sm:text-base">
                {t.brand}
              </strong>
              <small className="hidden text-xs font-bold uppercase tracking-[0.16em] text-blue-100 sm:block">
                {t.repo}
              </small>
            </span>
          </Link>
          <nav
            className="ml-auto hidden items-center gap-6 text-sm font-semibold text-slate-200 lg:flex"
            aria-label={t.resourcesLabel}
          >
            <a href="#topics">{t.topics}</a>
            <a href="#experts">{discovery.experts}</a>
            <a href="#opportunities">{discovery.opportunities}</a>
            <a href="#join">{t.join}</a>
          </nav>
          <LanguageSwitcher variant="dark" />
          <Link
            href="/login"
            className="inline-flex min-h-10 items-center rounded-lg bg-[#2563eb] px-3 text-xs font-extrabold text-white hover:bg-[#1d4ed8] sm:px-4 sm:text-sm"
          >
            <span className="hidden sm:inline">{t.joinNetwork}</span>
            <span className="sm:hidden">{t.join}</span>
          </Link>
        </div>
        <nav
          className="border-t border-white/10 lg:hidden"
          aria-label={t.resourcesLabel}
        >
          <div className="mx-auto flex max-w-[1380px] gap-6 overflow-x-auto px-4 py-3 text-xs font-bold text-slate-200 sm:px-6">
            <a className="shrink-0" href="#topics">
              {t.topics}
            </a>
            <a className="shrink-0" href="#experts">
              {discovery.experts}
            </a>
            <a className="shrink-0" href="#opportunities">
              {discovery.opportunities}
            </a>
            <a className="shrink-0" href="#join">
              {t.join}
            </a>
          </div>
        </nav>
      </header>
      <main>
        <section className="knowledge-hero relative isolate overflow-hidden bg-[#06152f] px-4 py-10 text-white sm:px-6 sm:py-12">
          <div
            className="knowledge-mesh absolute inset-0 -z-10"
            aria-hidden="true"
          />
          <div className="mx-auto grid max-w-[1380px] items-center gap-6 lg:grid-cols-2">
            <motion.div initial={false}>
              <Link
                href="/#knowledge"
                className="mb-6 inline-flex text-xs font-bold uppercase tracking-[0.18em] text-blue-200"
              >
                ← {t.back}
              </Link>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#7dd3fc]">
                {t.kicker}
              </p>
              <h1 className="max-w-3xl font-serif text-[clamp(2.125rem,3.4vw,3rem)] font-semibold leading-[1.02] tracking-[-.035em]">
                <span className="block">{t.title}</span>
                <span className="mt-1 block min-h-[1.02em] text-[#9fc0ff]">
                  {typed}
                  <i className="typing-caret" aria-hidden="true" />
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#cbdaf0]">
                {t.intro}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#topics"
                  className="inline-flex min-h-12 items-center rounded-xl bg-white px-5 text-sm font-extrabold text-[#06152f] transition hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0"
                >
                  {t.explore} ↓
                </a>
                <Link
                  href="/login"
                  className="inline-flex min-h-12 items-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
                >
                  {t.connect} ↗
                </Link>
              </div>
            </motion.div>
            <BilateralMap
              t={t}
              experts={discovery.experts}
              opportunities={discovery.opportunities}
              reduced={reduced}
            />
          </div>
        </section>
        <section
          id="topics"
          className="!scroll-mt-32 px-4 py-16 sm:px-6 sm:py-24 lg:!scroll-mt-20"
        >
          <div className="mx-auto max-w-[1380px]">
            <div className="grid gap-8 border-b border-[#0b1c30]/15 pb-10 lg:grid-cols-[1fr_.6fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1d4ed8]">
                  {t.trails}
                </p>
                <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-6xl">
                  {t.sectionTitle}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-600 lg:justify-self-end">
                {t.note}
              </p>
            </div>
            <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="group">
              {filters.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTopic(item.id)}
                  aria-pressed={topic === item.id}
                  className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-bold ${topic === item.id ? "border-[#0b1c30] bg-[#0b1c30] text-white" : "border-[#0b1c30]/15 bg-white/40 text-slate-700"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <motion.div
              id="resources"
              layout
              className="mt-8 border-t border-[#0b1c30]/15"
            >
              {visible.map((item) => {
                const route = RESOURCE_ROUTES[item.type];
                return (
                  <motion.article
                    layout
                    key={item.title}
                    className="group grid gap-5 border-b border-[#0b1c30]/15 py-8 sm:py-10 lg:grid-cols-[150px_minmax(0,1fr)_300px]"
                  >
                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#1d4ed8]">
                        {item.kind}
                      </span>
                      <span className="mt-2 block text-xs text-slate-500">
                        {item.year}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-semibold transition-colors group-hover:text-[#153d7a] sm:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    <div className="self-start lg:text-right">
                      <div className="flex flex-wrap content-start items-start gap-2 lg:justify-end">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex shrink-0 items-center rounded-full border border-[#0b1c30]/15 bg-white/50 px-3 py-1.5 text-xs font-semibold leading-4 text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 lg:justify-end">
                        <Link
                          href={`/experts/${route.expertId}`}
                          className="text-xs font-extrabold text-[#1d4ed8] underline decoration-blue-300 underline-offset-4"
                        >
                          {discovery.experts} →
                        </Link>
                        <Link
                          href={`/opportunities/${route.opportunityId}`}
                          className="text-xs font-extrabold text-[#1d4ed8] underline decoration-blue-300 underline-offset-4"
                        >
                          {discovery.opportunities} →
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </div>
        </section>
        <section
          id="experts"
          className="!scroll-mt-32 bg-[#fbf8f1] px-4 py-14 sm:px-6 sm:py-20 lg:!scroll-mt-20"
        >
          <div className="mx-auto max-w-[1380px]">
            <div className="flex flex-col gap-5 border-b border-[#0b1c30]/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1d4ed8]">
                  {discovery.experts} · {discovery.mock}
                </p>
                <h2 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                  {discovery.expertsTitle}
                </h2>
              </div>
              <Link
                href="/experts"
                className="inline-flex min-h-11 items-center text-sm font-extrabold text-[#1d4ed8] underline decoration-blue-300 underline-offset-4"
              >
                {discovery.viewAll} →
              </Link>
            </div>
            <div>
              {EXPERTS.map((expert) => {
                const copy = expert.copy[locale];
                return (
                  <article
                    key={expert.id}
                    className="grid gap-4 border-b border-[#0b1c30]/15 py-7 sm:grid-cols-[64px_minmax(0,1fr)_240px] sm:items-center"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#0b223d] text-xs font-extrabold text-white">
                      {expert.initials}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-semibold">
                        <Link
                          href={`/experts/${expert.id}`}
                          className="hover:text-[#1d4ed8]"
                        >
                          {expert.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {copy.discipline} · {expert.institution}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <Link
                        href={`/experts/${expert.id}`}
                        className="text-sm font-extrabold text-[#1d4ed8]"
                      >
                        {discovery.detail} →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <section
          id="opportunities"
          className="!scroll-mt-32 px-4 py-14 sm:px-6 sm:py-20 lg:!scroll-mt-20"
        >
          <div className="mx-auto max-w-[1380px]">
            <div className="flex flex-col gap-5 border-b border-[#0b1c30]/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                  {discovery.opportunities} · {discovery.mock}
                </p>
                <h2 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                  {discovery.opportunitiesTitle}
                </h2>
              </div>
              <Link
                href="/opportunities"
                className="inline-flex min-h-11 items-center text-sm font-extrabold text-[#1d4ed8] underline decoration-blue-300 underline-offset-4"
              >
                {discovery.viewAll} →
              </Link>
            </div>
            <div>
              {OPPORTUNITIES.map((opportunity) => {
                const copy = opportunity.copy[locale];
                return (
                  <article
                    key={opportunity.id}
                    className="grid gap-5 border-b border-[#0b1c30]/15 py-7 lg:grid-cols-[minmax(0,1fr)_280px]"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#dc2626]/10 px-3 py-1 text-xs font-extrabold text-[#b91c1c]">
                          {copy.status}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                          {copy.scope}
                        </span>
                      </div>
                      <h3 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl">
                        <Link
                          href={`/opportunities/${opportunity.id}`}
                          className="hover:text-[#1d4ed8]"
                        >
                          {copy.title}
                        </Link>
                      </h3>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                        {copy.summary}
                      </p>
                    </div>
                    <div className="lg:text-right">
                      <Link
                        href={`/opportunities/${opportunity.id}`}
                        className="inline-flex min-h-11 items-center text-sm font-extrabold text-[#1d4ed8]"
                      >
                        {discovery.detail} →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <section id="join" className="px-4 pb-20 sm:px-6 sm:pb-28">
          <div className="knowledge-join mx-auto grid max-w-[1380px] gap-8 overflow-hidden rounded-[2rem] border border-blue-200/15 bg-[#06152f] p-7 text-white sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7dd3fc]">
                {t.joinKicker}
              </p>
              <h2 className="mt-3 max-w-3xl font-serif text-3xl font-semibold sm:text-5xl">
                {t.joinTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                {t.joinBody}
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-extrabold text-[#06152f]"
            >
              {t.joinNetwork} ↗
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
