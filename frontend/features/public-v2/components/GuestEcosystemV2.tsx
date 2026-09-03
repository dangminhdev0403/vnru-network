"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { z } from "zod";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { localizeReactNode } from "@/core/i18n/localize-react-node";
import { HOME_COPY } from "./GuestHomeV2";
import { ECOSYSTEM_TRANSLATIONS } from "./GuestEcosystemV2.copy";
import {
  DOCUMENT_PARTNERS,
  type EcosystemPartner,
} from "./GuestEcosystemPartners";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";
import { Reveal } from "@/components/shared/Reveal";

type EcosystemTabId = "opportunities" | "members" | "projects" | "library";

const connectFormSchema = (locale: Locale) => {
  const message = (vi: string, en: string, ru: string) =>
    locale === "ru" ? ru : locale === "en" ? en : vi;

  return z.object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        message(
          "Vui lòng nhập họ và tên.",
          "Please enter your full name.",
          "Введите имя и фамилию.",
        ),
      ),
    organization: z
      .string()
      .trim()
      .min(
        2,
        message(
          "Vui lòng nhập cơ quan hoặc trường.",
          "Please enter your institution.",
          "Укажите организацию или университет.",
        ),
      ),
    email: z
      .string()
      .trim()
      .email(
        message(
          "Email không hợp lệ.",
          "Invalid email address.",
          "Некорректный адрес электронной почты.",
        ),
      ),
    message: z
      .string()
      .trim()
      .min(
        10,
        message(
          "Nội dung cần ít nhất 10 ký tự.",
          "The message must contain at least 10 characters.",
          "Сообщение должно содержать не менее 10 символов.",
        ),
      ),
  });
};

type ConnectField = keyof z.infer<ReturnType<typeof connectFormSchema>>;

const TAB_LABELS: Record<Locale, Record<EcosystemTabId, string>> = {
  vi: {
    opportunities: "Cơ hội hợp tác",
    members: "Đối tác",
    projects: "Dự án & Kết quả",
    library: "Thư viện tri thức",
  },
  ru: {
    opportunities: "Возможности",
    members: "Участники сети",
    projects: "Проекты & результаты",
    library: "Библиотека знаний",
  },
  en: {
    opportunities: "Opportunities",
    members: "Network partners",
    projects: "Projects & Results",
    library: "Knowledge Library",
  },
};

const SECTION_OFFSETS: Record<EcosystemTabId, number> = {
  opportunities: 135,
  members: 135,
  projects: 135,
  library: 135,
};

const SECTION_IDS: Record<EcosystemTabId, string> = {
  opportunities: "opportunities",
  members: "members",
  projects: "projects",
  library: "knowledge-library",
};

function customSmoothScroll(
  targetY: number,
  duration = 800,
  onComplete?: () => void,
) {
  if (typeof window === "undefined") return;
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const diff = targetY - startY;
  if (Math.abs(diff) < 3) {
    onComplete?.();
    return;
  }

  const root = document.documentElement;
  const prevScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  document.body.style.scrollBehavior = "auto";

  const startTime = performance.now();

  function easeInOutQuint(t: number): number {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
  }

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuint(progress);

    window.scrollTo(0, Math.round(startY + diff * eased));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      root.style.scrollBehavior = prevScrollBehavior;
      document.body.style.scrollBehavior = "";
      onComplete?.();
    }
  }

  requestAnimationFrame(step);
}

// ══════════════════ DATA: CHUYÊN GIA (ẢNH, TÊN, CHỨC VỤ) ══════════════════
type ExpertItem = {
  name: string;
  role: string;
  image?: string;
};

const EXPERTS_RAW: ExpertItem[] = [
  {
    name: "Nguyễn Quốc Hùng",
    role: "Chủ tịch Hội đồng điều phối",
    image: "/images/board/nguyen-quoc-hung.webp",
  },
  {
    name: "Trần Đức Tùng",
    role: "Giám đốc Kỹ thuật Mạng lưới",
    image: "/images/board/tran-duc-tung.webp",
  },
];

const EXPERTS_LIST: ExpertItem[] = [...EXPERTS_RAW]
  .filter((expert) => Boolean(expert.image))
  .sort((a, b) => a.name.localeCompare(b.name, "vi"));

// ══════════════════ DATA: TỔ CHỨC ══════════════════
type OrganizationItem = Omit<EcosystemPartner, "country"> & {
  location: string;
  country?: EcosystemPartner["country"];
};

const ORGANIZATIONS_RAW: OrganizationItem[] = [
  {
    name: "Bauman MSTU",
    fullName: "Đại học Kỹ thuật Quốc gia Moskva mang tên N.E. Bauman",
    location: "Moskva, LB Nga",
    logo: "/images/partners/ecosystem-bmstu.webp",
    country: "russia",
    website: "https://bmstu.ru/",
  },
  {
    name: "JINR Dubna",
    fullName: "Viện Nghiên cứu Hạt nhân Liên hiệp Dubna",
    location: "Dubna, LB Nga",
    logo: "/images/partners/ecosystem-jinr.webp",
    country: "russia",
    website: "https://www.jinr.ru/",
  },
  {
    name: "Lomonosov MSU",
    fullName: "Đại học Quốc gia Moskva mang tên M.V. Lomonosov",
    location: "Moskva, LB Nga",
    logo: "/images/partners/ecosystem-msu.webp",
    country: "russia",
    website: "https://www.msu.ru/",
  },
  {
    name: "MAI",
    fullName: "Đại học Hàng không Moskva (Viện Nghiên cứu Quốc gia)",
    location: "Moskva, LB Nga",
    logo: "/images/partners/ecosystem-mai.webp",
    country: "russia",
    website: "https://mai.ru/",
  },
  {
    name: "Quỹ Truyền thống và Hữu nghị",
    fullName: "Quỹ Thúc đẩy Hợp tác Nga - Việt “Truyền thống và Hữu nghị”",
    location: "Moskva & Hà Nội",
    logo: "/images/partners/ecosystem-traditions-friendship.webp",
    country: "russia",
    website: "https://fonddruzhba.ru/",
  },
  {
    name: "RAS",
    fullName: "Viện Hàn lâm Khoa học Liên bang Nga (Российская академия наук)",
    location: "Liên bang Nga",
    logo: "/images/partners/ecosystem-ras.webp",
    country: "russia",
    website: "https://new.ras.ru/",
  },
  {
    name: "SPbPU",
    fullName: "Đại học Bách khoa Saint Petersburg Đại đế",
    location: "Saint Petersburg, LB Nga",
    logo: "/images/partners/ecosystem-spbpu.webp",
    country: "russia",
    website: "https://www.spbstu.ru/",
  },
  {
    name: "VAST",
    fullName: "Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
    location: "Hà Nội, Việt Nam",
    logo: "/images/partners/ecosystem-vast.webp",
    country: "vietnam",
    website: "https://vast.gov.vn/",
  },
  {
    name: "VNU Hanoi",
    fullName: "Đại học Quốc gia Hà Nội",
    location: "Hà Nội, Việt Nam",
    logo: "/images/partners/ecosystem-vnu-hanoi.webp",
    country: "vietnam",
    website: "https://vnu.edu.vn/",
  },
];

const TEMPORARILY_HIDDEN_ORGANIZATIONS = new Set([
  "Bauman MSTU",
  "JINR Dubna",
  "Lomonosov MSU",
  "MAI",
  "Quỹ Truyền thống và Hữu nghị",
  "RAS",
]);

const ORGANIZATIONS_LIST: OrganizationItem[] = [
  ...ORGANIZATIONS_RAW.filter(
    (org) => !TEMPORARILY_HIDDEN_ORGANIZATIONS.has(org.name),
  ),
  ...DOCUMENT_PARTNERS.map((partner) => ({
    ...partner,
    location: partner.country === "russia" ? "Liên bang Nga" : "Việt Nam",
  })),
].sort((a, b) => a.name.localeCompare(b.name, "vi"));

// ══════════════════ DATA: TÀI TRỢ / FELLOWSHIPS & GRANTS (INTERUSSIA) ══════════════════
const GRANTS_ITEMS = [
  {
    id: "nuclear-technologies",
    image: "/images/opportunities/interussia-nuclear.webp",
    date: "30.04.2026",
    title: {
      vi: "Call for Applications: InteRussia Fellowship in Nuclear Technologies",
      en: "Call for Applications: InteRussia Fellowship in Nuclear Technologies",
      ru: "Приём заявок: Стажировка InteRussia в области ядерных технологий",
    },
    desc: {
      vi: "The InteRussia team announces a call for applications to join the fellowship for foreign specialists in nuclear technologies.",
      en: "The InteRussia team announces a call for applications to join the fellowship for foreign specialists in nuclear technologies.",
      ru: "Команда InteRussia объявляет о приёме заявок на стажировку для иностранных специалистов в области ядерных технологий.",
    },
    cta: {
      vi: "Read more →",
      en: "Read more →",
      ru: "Подробнее →",
    },
    href: "https://interussia.com/announce_en",
  },
  {
    id: "ir-specialists",
    image: "/images/opportunities/interussia-ir.webp",
    date: "30.04.2026",
    title: {
      vi: "Call for Applications: InteRussia Fellowship for IR Specialists",
      en: "Call for Applications: InteRussia Fellowship for IR Specialists",
      ru: "Приём заявок: Стажировка InteRussia для специалистов в области МО",
    },
    desc: {
      vi: "The InteRussia team announces a call for applications to join the fellowship for foreign specialists in international relations.",
      en: "The InteRussia team announces a call for applications to join the fellowship for foreign specialists in international relations.",
      ru: "Команда InteRussia объявляет о приёме заявок на стажировку для иностранных специалистов в области международных отношений.",
    },
    cta: {
      vi: "Read more →",
      en: "Read more →",
      ru: "Подробнее →",
    },
    href: "https://interussia.com/announce_en",
  },
  {
    id: "scientific-cooperation",
    image: "/images/opportunities/interussia-gorchakov.webp",
    date: "30.04.2026",
    title: {
      vi: "Call for Applications: Gorchakov Fund Bilateral Research Grants",
      en: "Call for Applications: Gorchakov Fund Bilateral Research Grants",
      ru: "Приём заявок: Гранты Фонда Горчакова на двусторонние исследования",
    },
    desc: {
      vi: "The Gorchakov Fund announces funding support for international scientific research projects and bilateral exchanges.",
      en: "The Gorchakov Fund announces funding support for international scientific research projects and bilateral exchanges.",
      ru: "Фонд Горчакова объявляет о выделении грантов на международные исследовательские проекты и академические обмены.",
    },
    cta: {
      vi: "Read more →",
      en: "Read more →",
      ru: "Подробнее →",
    },
    href: "https://gorchakovfund.ru",
  },
];

// ══════════════════ DATA: KHOÁ HỌC BỔNG KHAI SÁNG RESULTS ══════════════════
const KHAISANG_RESULTS = [
  {
    candidate: "Nguyễn Thành Long",
    batch: "Đợt 1 / 2026",
    host: "Đại học Kỹ thuật Quốc gia Moskva Bauman",
    topic:
      "Thuật toán định vị và dẫn đường cho hệ thống thiết bị bay tự hành (UAV)",
    status: "Đã phê duyệt cấp học bổng toàn phần",
  },
  {
    candidate: "Vũ Thị Quỳnh Nga",
    batch: "Đợt 1 / 2026",
    host: "Đại học Khoa học & Công nghệ Quốc gia MISIS",
    topic:
      "Nghiên cứu vật liệu nano oxit kim loại ứng dụng trong lưu trữ năng lượng xanh",
    status: "Đã phê duyệt tài trợ đề tài & sinh hoạt phí",
  },
  {
    candidate: "Hoàng Minh Trí",
    batch: "Đợt 1 / 2026",
    host: "Đại học Quốc gia Moskva Lomonosov",
    topic:
      "Mô hình hóa động lực học biển và biến đổi môi trường sinh thái vịnh Bắc Bộ",
    status: "Đã phê duyệt cấp kinh phí nghiên cứu sinh",
  },
  {
    candidate: "Đỗ Khánh Linh",
    batch: "Đợt 2 / 2026",
    host: "Đại học Bách khoa Saint Petersburg (SPbPU)",
    topic: "Thiết kế vật liệu composite chịu nhiệt cho tuabin khí thế hệ mới",
    status: "Đã thông qua vòng bảo vệ đề cương",
  },
  {
    candidate: "Phạm Hải Đăng",
    batch: "Đợt 2 / 2026",
    host: "Viện Nghiên cứu Hạt nhân Dubna (JINR)",
    topic:
      "Ứng dụng chùm tia ion năng lượng cao trong phân tích cấu trúc vi mô",
    status: "Đã phê duyệt tài trợ thực tập chuyên ngành",
  },
];

export function GuestEcosystemV2({
  isAuthenticated,
  workspaceHref,
}: Readonly<{ isAuthenticated: boolean; workspaceHref: string }>) {
  const { locale } = useLocale();
  const homeCopy = HOME_COPY[locale] ?? HOME_COPY.vi;

  const [activeSection, setActiveSection] =
    useState<EcosystemTabId>("opportunities");
  const [ecosystemMenuOpen, setEcosystemMenuOpen] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sub-tabs for Opportunities
  const [oppSubTab, setOppSubTab] = useState<
    "connect" | "call-for-papers" | "grants"
  >("connect");
  // Sub-tabs for Members
  const [memberSubTab, setMemberSubTab] = useState<"experts" | "organizations">(
    "experts",
  );
  // Sub-tabs for Library
  const [libSubTab, setLibSubTab] = useState<
    "articles" | "journals" | "patents"
  >("articles");

  // State for Connect Form
  const [connectForm, setConnectForm] = useState({
    fullName: "",
    organization: "",
    email: "",
    phone: "",
    field: "Vật liệu tiên tiến & Năng lượng",
    message: "",
  });
  const [connectErrors, setConnectErrors] = useState<
    Partial<Record<ConnectField, string>>
  >({});
  const [connectSubmitted, setConnectSubmitted] = useState(false);

  // State for Khaisang Results Modal
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [searchResultQuery, setSearchResultQuery] = useState("");

  useEffect(() => {
    const sectionIds: { id: string; tab: EcosystemTabId }[] = [
      { id: "opportunities", tab: "opportunities" },
      { id: "members", tab: "members" },
      { id: "projects", tab: "projects" },
      { id: "knowledge-library", tab: "library" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const matched = sectionIds.find(
            (s) => s.id === visibleEntries[0].target.id,
          );
          if (matched) {
            setActiveSection(matched.tab);
          }
        }
      },
      {
        rootMargin: "-120px 0px -50% 0px",
        threshold: [0, 0.1, 0.25],
      },
    );

    sectionIds.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToSection = (targetId: string, tabId: EcosystemTabId) => {
    setActiveSection(tabId);
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (tabId === "opportunities") {
      const targetPosition = 0;
      const distance = Math.abs(targetPosition - window.pageYOffset);
      const duration = Math.min(Math.max(Math.sqrt(distance) * 28, 650), 950);

      customSmoothScroll(targetPosition, duration, () => {
        isScrollingRef.current = false;
      });

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, duration + 80);

      window.history.replaceState(null, "", `#opportunities`);
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = SECTION_OFFSETS[tabId] ?? 135;
      const targetPosition = Math.max(
        0,
        el.getBoundingClientRect().top + window.pageYOffset - navOffset,
      );
      const distance = Math.abs(targetPosition - window.pageYOffset);

      const duration = Math.min(Math.max(Math.sqrt(distance) * 28, 700), 1050);
      customSmoothScroll(targetPosition, duration, () => {
        isScrollingRef.current = false;
      });

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, duration + 80);

      window.history.replaceState(null, "", `#${targetId}`);
    }
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = connectFormSchema(locale).safeParse(connectForm);
    if (!result.success) {
      const errors: Partial<Record<ConnectField, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as ConnectField;
        errors[field] ??= issue.message;
      }
      setConnectErrors(errors);
      return;
    }
    setConnectErrors({});
    setConnectSubmitted(true);
  };

  const filteredResults = KHAISANG_RESULTS.filter(
    (item) =>
      item.candidate.toLowerCase().includes(searchResultQuery.toLowerCase()) ||
      item.host.toLowerCase().includes(searchResultQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchResultQuery.toLowerCase()),
  );

  return localizeReactNode(
    <div className="min-h-screen bg-[#edf3f9] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <GuestPublicNav
        active="ecosystem"
        isAuthenticated={isAuthenticated}
        workspaceHref={workspaceHref}
      />

      {/* ═══════════ STICKY SUB-TABS BAR ═══════════ */}
      <nav
        className="sticky top-[74px] z-40 border-b border-blue-200/70 bg-[#edf3f9]/90 pt-2.5 pb-2.5 sm:pt-3 sm:pb-0 backdrop-blur-md transition-all duration-200"
        aria-label="Ecosystem navigation"
      >
        <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
          <div className="sm:hidden">
            <button
              type="button"
              aria-expanded={ecosystemMenuOpen}
              aria-controls="ecosystem-mobile-menu"
              onClick={() => setEcosystemMenuOpen((open) => !open)}
              className="flex min-h-11 w-full items-center justify-between rounded-xl border border-blue-200 bg-white px-4 text-left text-base font-bold text-[#082352] shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {TAB_LABELS[locale]?.[activeSection] ??
                TAB_LABELS.vi[activeSection]}
              <span aria-hidden="true">⌄</span>
            </button>
            {ecosystemMenuOpen && (
              <div
                id="ecosystem-mobile-menu"
                className="mt-2 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm"
              >
                {(
                  ["opportunities", "members", "projects", "library"] as const
                ).map((tabId) => (
                  <button
                    key={tabId}
                    type="button"
                    aria-current={activeSection === tabId ? "page" : undefined}
                    onClick={() => {
                      setEcosystemMenuOpen(false);
                      scrollToSection(SECTION_IDS[tabId], tabId);
                    }}
                    className={`block min-h-11 w-full border-b border-blue-100 px-4 py-3 text-left text-base font-bold last:border-0 ${
                      activeSection === tabId
                        ? "bg-blue-600 text-white"
                        : "text-slate-700 hover:bg-blue-50"
                    }`}
                  >
                    {TAB_LABELS[locale]?.[tabId] ?? TAB_LABELS.vi[tabId]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mx-auto hidden w-max items-center gap-1 rounded-xl border border-blue-200/80 bg-white/95 p-1 shadow-xs sm:flex">
            {(["opportunities", "members", "projects", "library"] as const).map(
              (tabId) => {
                const isActive = activeSection === tabId;
                return (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => scrollToSection(SECTION_IDS[tabId], tabId)}
                    className={`relative inline-flex min-h-11 items-center gap-2 rounded-lg px-5 py-2 text-base font-bold whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                      isActive
                        ? "text-white"
                        : "text-slate-700 hover:bg-blue-50/70 hover:text-blue-900"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="ecosystem-tab-indicator"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                        className="absolute inset-0 rounded-lg bg-blue-600 shadow-sm shadow-blue-600/20"
                      />
                    )}
                    <span
                      className={`relative z-10 size-2 rounded-full ${
                        isActive ? "bg-white" : "bg-slate-300"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="relative z-10">
                      {TAB_LABELS[locale]?.[tabId] ?? TAB_LABELS.vi[tabId]}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>
      </nav>

      <main id="main-content">
        {/* ════════════════════════════════════════════════════════════════
            1. CƠ HỘI HỢP TÁC (#opportunities)
            ════════════════════════════════════════════════════════════════ */}
        <section
          id="opportunities"
          className="scroll-mt-32 px-4 pt-6 pb-12 sm:px-6 sm:pt-7 sm:pb-16 lg:px-8 lg:pt-8 lg:pb-16"
        >
          <div className="mx-auto max-w-[1460px]">
            {/* Header section */}
            <Reveal y={10} className="text-center mb-4 sm:mb-5">
              <h2 className="font-serif text-2xl font-black tracking-tight text-[#082352] sm:text-3xl">
                Cơ hội hợp tác
              </h2>
            </Reveal>

            {/* Inner Sub-tab Switcher: Kết nối | Công bố | Tài trợ */}
            <div className="mx-auto mb-6 sm:mb-8 max-w-2xl">
              <div className="grid grid-cols-3 rounded-xl border border-blue-200 bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setOppSubTab("connect")}
                  aria-pressed={oppSubTab === "connect"}
                  className={`min-h-11 rounded-lg px-2 py-2 text-base font-bold transition-colors sm:px-4 ${
                    oppSubTab === "connect"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  Kết nối
                </button>
                <button
                  type="button"
                  onClick={() => setOppSubTab("call-for-papers")}
                  aria-pressed={oppSubTab === "call-for-papers"}
                  className={`min-h-11 rounded-lg px-2 py-2 text-base font-bold transition-colors sm:px-4 ${
                    oppSubTab === "call-for-papers"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  Công bố
                </button>
                <button
                  type="button"
                  onClick={() => setOppSubTab("grants")}
                  aria-pressed={oppSubTab === "grants"}
                  className={`min-h-11 rounded-lg px-2 py-2 text-base font-bold transition-colors sm:px-4 ${
                    oppSubTab === "grants"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  Tài trợ
                </button>
              </div>
            </div>

            {/* SUBTAB 1: KẾT NỐI (Interactive Form) */}
            {oppSubTab === "connect" && (
              <div className="mx-auto max-w-4xl rounded-3xl border border-blue-200/90 bg-white p-8 shadow-md sm:p-12">
                <div className="mb-8 text-center sm:text-left">
                  <h3 className="font-serif text-2xl font-bold text-[#082352] sm:text-3xl">
                    Đăng ký Kết nối Hợp tác Song phương
                  </h3>
                </div>

                {connectSubmitted ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                    <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-600 text-2xl text-white">
                      ✓
                    </div>
                    <h4 className="mt-4 font-serif text-2xl font-bold text-emerald-950">
                      Gửi yêu cầu kết nối thành công!
                    </h4>
                    <p className="mt-2 text-sm text-emerald-800 sm:text-base">
                      Cảm ơn <strong>{connectForm.fullName}</strong>. Chúng tôi
                      đã tiếp nhận thông tin và sẽ gửi phản hồi đến email{" "}
                      <strong>{connectForm.email}</strong> sớm nhất.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setConnectSubmitted(false);
                        setConnectForm({
                          fullName: "",
                          organization: "",
                          email: "",
                          phone: "",
                          field: "Vật liệu tiên tiến & Năng lượng",
                          message: "",
                        });
                      }}
                      className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-800"
                    >
                      Gửi đề xuất khác
                    </button>
                  </div>
                ) : (
                  <form
                    noValidate
                    onSubmit={handleConnectSubmit}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="connect-fullname"
                          className="block text-sm font-bold text-slate-800"
                        >
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="connect-fullname"
                          type="text"
                          value={connectForm.fullName}
                          onChange={(e) => {
                            setConnectForm({
                              ...connectForm,
                              fullName: e.target.value,
                            });
                            setConnectErrors({
                              ...connectErrors,
                              fullName: undefined,
                            });
                          }}
                          aria-invalid={!!connectErrors.fullName}
                          aria-describedby={
                            connectErrors.fullName
                              ? "connect-fullname-error"
                              : undefined
                          }
                          placeholder="GS.TS / ThS / Nhà nghiên cứu..."
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-base text-slate-900 outline-none! focus-visible:border-blue-600"
                        />
                        {connectErrors.fullName && (
                          <p
                            id="connect-fullname-error"
                            className="mt-1 text-sm font-semibold text-red-600"
                          >
                            {connectErrors.fullName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="connect-org"
                          className="block text-sm font-bold text-slate-800"
                        >
                          Cơ quan / Viện nghiên cứu / Trường ĐH{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="connect-org"
                          type="text"
                          value={connectForm.organization}
                          onChange={(e) => {
                            setConnectForm({
                              ...connectForm,
                              organization: e.target.value,
                            });
                            setConnectErrors({
                              ...connectErrors,
                              organization: undefined,
                            });
                          }}
                          aria-invalid={!!connectErrors.organization}
                          aria-describedby={
                            connectErrors.organization
                              ? "connect-org-error"
                              : undefined
                          }
                          placeholder="Tên viện / trường / doanh nghiệp..."
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-base text-slate-900 outline-none! focus-visible:border-blue-600"
                        />
                        {connectErrors.organization && (
                          <p
                            id="connect-org-error"
                            className="mt-1 text-sm font-semibold text-red-600"
                          >
                            {connectErrors.organization}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="connect-email"
                          className="block text-sm font-bold text-slate-800"
                        >
                          Email liên hệ <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="connect-email"
                          type="email"
                          value={connectForm.email}
                          onChange={(e) => {
                            setConnectForm({
                              ...connectForm,
                              email: e.target.value,
                            });
                            setConnectErrors({
                              ...connectErrors,
                              email: undefined,
                            });
                          }}
                          aria-invalid={!!connectErrors.email}
                          aria-describedby={
                            connectErrors.email
                              ? "connect-email-error"
                              : undefined
                          }
                          placeholder="email@institution.edu.vn"
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-base text-slate-900 outline-none! focus-visible:border-blue-600"
                        />
                        {connectErrors.email && (
                          <p
                            id="connect-email-error"
                            className="mt-1 text-sm font-semibold text-red-600"
                          >
                            {connectErrors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="connect-field"
                          className="block text-sm font-bold text-slate-800"
                        >
                          Lĩnh vực nghiên cứu quan tâm
                        </label>
                        <select
                          id="connect-field"
                          value={connectForm.field}
                          onChange={(e) =>
                            setConnectForm({
                              ...connectForm,
                              field: e.target.value,
                            })
                          }
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-base text-slate-900 outline-none! focus-visible:border-blue-600"
                        >
                          <option value="Vật liệu tiên tiến & Năng lượng">
                            Vật liệu tiên tiến & Năng lượng mới
                          </option>
                          <option value="Trí tuệ nhân tạo & Dữ liệu lớn">
                            Trí tuệ nhân tạo & Dữ liệu lớn (AI/Data)
                          </option>
                          <option value="Hàng không vũ trụ & Điều khiển tự động">
                            Hàng không vũ trụ & Điều khiển tự động (UAV)
                          </option>
                          <option value="Công nghệ Lượng tử">
                            Công nghệ Lượng tử & Cảm biến
                          </option>
                          <option value="Khoa học Biển & Môi trường">
                            Khoa học Biển & Biến đổi khí hậu
                          </option>
                          <option value="Công nghệ Hạt nhân & Y sinh">
                            Công nghệ Hạt nhân & Y sinh
                          </option>
                          <option value="Khoa học Xã hội & Dịch thuật Chuyên khảo">
                            Khoa học Xã hội, Ngôn ngữ & Dịch thuật
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="connect-message"
                        className="block text-sm font-bold text-slate-800"
                      >
                        Nội dung đề xuất hợp tác / Nhu cầu kết nối{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="connect-message"
                        rows={4}
                        value={connectForm.message}
                        onChange={(e) => {
                          setConnectForm({
                            ...connectForm,
                            message: e.target.value,
                          });
                          setConnectErrors({
                            ...connectErrors,
                            message: undefined,
                          });
                        }}
                        aria-invalid={!!connectErrors.message}
                        aria-describedby={
                          connectErrors.message
                            ? "connect-message-error"
                            : undefined
                        }
                        placeholder="Mô tả tóm tắt định hướng đề tài, phòng thí nghiệm mong muốn liên kết hoặc nhu cầu trao đổi chuyên gia..."
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50/50 p-4 text-base text-slate-900 outline-none! focus-visible:border-blue-600"
                      />
                      {connectErrors.message && (
                        <p
                          id="connect-message-error"
                          className="mt-1 text-sm font-semibold text-red-600"
                        >
                          {connectErrors.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 text-base font-black text-white shadow-md shadow-blue-600/25 transition duration-150 hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                      >
                        <span>Gửi yêu cầu kết nối</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* SUBTAB 2: CÔNG BỐ */}
            {oppSubTab === "call-for-papers" && (
              <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
                <article className="flex flex-col justify-between rounded-2xl border border-blue-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md sm:p-5">
                  <div>
                    <h3 className="font-serif line-clamp-2 min-h-[44px] text-base font-bold leading-snug text-[#082352] sm:text-lg">
                      Chương trình Học bổng Nghiên cứu InteRussia Fellowships
                      2026
                    </h3>
                    <p className="mt-2 line-clamp-3 min-h-[48px] text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Chương trình học bổng uy tín dành cho các nhà khoa học,
                      chuyên gia trẻ quốc tế sang nghiên cứu trực tiếp tại các
                      viện và trường ĐH hàng đầu của Nga. Tài trợ toàn phần vé
                      máy bay, chỗ ở tại Moskva và sinh hoạt phí.
                    </p>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <a
                      href="https://interussia.com/announce_en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 sm:text-sm"
                    >
                      <span>Xem thông báo chính thức</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>

                <article className="flex flex-col justify-between rounded-2xl border border-blue-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md sm:p-5">
                  <div>
                    <h3 className="font-serif line-clamp-2 min-h-[44px] text-base font-bold leading-snug text-[#082352] sm:text-lg">
                      Hội nghị Khoa học Quốc tế Song phương VAST – RAS (Nga –
                      Việt)
                    </h3>
                    <p className="mt-2 line-clamp-3 min-h-[48px] text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Kêu gọi gửi bài báo tham luận khoa học cho Hội thảo khoa
                      học quốc tế thường niên giữa Viện Hàn lâm KHCN Việt Nam và
                      Viện Hàn lâm Khoa học Nga trong các lĩnh vực vật liệu,
                      công nghệ sinh học và chuyển đổi số.
                    </p>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <Link
                      href="/news/3/meet-global-mice-congress-2026-du-kien-dien-ra-tai-moskva"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 sm:text-sm"
                    >
                      <span>Xem chi tiết</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>

                <article className="flex flex-col justify-between rounded-2xl border border-blue-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md sm:p-5">
                  <div>
                    <h3 className="font-serif line-clamp-2 min-h-[44px] text-base font-bold leading-snug text-[#082352] sm:text-lg">
                      Chuyên san Hợp tác Khoa học Song phương Việt Nam – Liên
                      bang Nga
                    </h3>
                    <p className="mt-2 line-clamp-3 min-h-[48px] text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Đợt tiếp nhận công trình nghiên cứu gốc từ các nhóm tác
                      giả liên kết hai nước đăng trên chuyên san đặc biệt của
                      các tạp chí khoa học quốc tế uy tín thuộc hệ thống RAS &
                      VAST.
                    </p>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <Link
                      href="/news"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 sm:text-sm"
                    >
                      <span>Xem chi tiết</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              </div>
            )}

            {/* SUBTAB 3: TÀI TRỢ */}
            {oppSubTab === "grants" && (
              <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
                {GRANTS_ITEMS.map((item) => (
                  <article
                    key={item.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-rose-300 hover:shadow-md sm:p-4"
                  >
                    <div>
                      {/* Scaled Proportional Banner */}
                      <div className="relative aspect-[418/235] w-full overflow-hidden rounded-xl bg-[#5a0d1e] shadow-xs">
                        <Image
                          src={item.image}
                          alt={item.title[locale] ?? item.title.vi}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Date Meta */}
                      <div className="mt-2.5 text-[11px] font-medium text-slate-500">
                        {item.date}
                      </div>

                      {/* Title */}
                      <h3 className="mt-1 line-clamp-2 min-h-[38px] text-xs font-bold leading-snug text-[#781428] transition-colors group-hover:text-[#5a0d1e] sm:text-sm">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {item.title[locale] ?? item.title.vi}
                        </a>
                      </h3>

                      {/* Description */}
                      <p className="mt-1 line-clamp-2 min-h-[32px] text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                        {item.desc[locale] ?? item.desc.vi}
                      </p>
                    </div>

                    {/* Bottom Read More CTA */}
                    <div className="mt-2 pt-1">
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#781428] transition hover:text-[#5a0d1e] hover:underline"
                      >
                        <span>{item.cta[locale] ?? item.cta.vi}</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            2. THÀNH VIÊN (#members / #network-directory)
            ════════════════════════════════════════════════════════════════ */}
        <section
          id="members"
          className="scroll-mt-32 border-t border-blue-200/50 bg-[#e7f0fa] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
        >
          <div id="network-directory" className="mx-auto max-w-[1460px]">
            <Reveal y={10} className="text-center mb-4 sm:mb-5">
              <h2 className="font-serif text-2xl font-black tracking-tight text-[#082352] sm:text-3xl">
                Đối tác mạng lưới
              </h2>
            </Reveal>

            {/* Sub-tab Switcher: Chuyên gia | Tổ chức */}
            <div className="mx-auto mb-6 sm:mb-8 max-w-2xl">
              <div className="grid grid-cols-2 rounded-xl border border-blue-200 bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setMemberSubTab("experts")}
                  aria-pressed={memberSubTab === "experts"}
                  className={`min-h-11 rounded-lg px-2 py-2 text-base font-bold transition-colors sm:px-4 ${
                    memberSubTab === "experts"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  Chuyên gia
                </button>
                <button
                  type="button"
                  onClick={() => setMemberSubTab("organizations")}
                  aria-pressed={memberSubTab === "organizations"}
                  className={`min-h-11 rounded-lg px-2 py-2 text-base font-bold transition-colors sm:px-4 ${
                    memberSubTab === "organizations"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  Đối tác
                </button>
              </div>
            </div>

            {/* TAB 1: CHUYÊN GIA (ẢNH, TÊN, CHỨC VỤ) */}
            {memberSubTab === "experts" && (
              <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
                {EXPERTS_LIST.map((expert) => (
                  <article
                    key={expert.name}
                    className="flex items-center gap-4 rounded-2xl border border-blue-200/90 bg-white p-4.5 shadow-xs transition duration-150 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-blue-200 bg-gradient-to-br from-blue-100 to-slate-200 shadow-xs">
                      {expert.image ? (
                        <Image
                          src={expert.image}
                          alt={expert.name}
                          fill
                          sizes="56px"
                          className="object-cover object-top"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center font-serif text-lg font-black text-blue-900">
                          {expert.name.split(" ").slice(-1)[0][0]}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-serif text-lg font-bold text-[#082352] sm:text-xl">
                        {expert.name}
                      </h3>
                      <div className="mt-0.5 text-sm font-bold text-blue-700">
                        {expert.role}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* TAB 2: ĐỐI TÁC */}
            {memberSubTab === "organizations" && (
              <div className="space-y-8">
                {(["russia", "vietnam"] as const).map((country) => (
                  <section key={country}>
                    <h3 className="mb-4 font-serif text-xl font-black text-[#082352]">
                      {country === "russia"
                        ? "Về phía Nga"
                        : "Về phía Việt Nam"}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {ORGANIZATIONS_LIST.filter(
                        (org) => org.country === country,
                      ).map((org) => {
                        const content = (
                          <>
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xs">
                              <Image
                                src={org.logo}
                                alt=""
                                fill
                                sizes="56px"
                                className="object-contain p-2"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-serif text-lg font-bold text-[#082352]">
                                {org.name}
                              </h4>
                              <div className="mt-0.5 text-xs text-slate-600">
                                {org.fullName}
                              </div>
                            </div>
                          </>
                        );
                        const className =
                          "flex items-center gap-4 rounded-2xl border border-blue-200/90 bg-white p-4.5 shadow-xs transition duration-150 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

                        return org.website ? (
                          <a
                            key={org.name}
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${org.name} — Trang web`}
                            className={className}
                          >
                            {content}
                          </a>
                        ) : (
                          <article key={org.name} className={className}>
                            {content}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            3. DỰ ÁN & KẾT QUẢ (#projects) - BALANCED LIST FORMAT
            ════════════════════════════════════════════════════════════════ */}
        <section
          id="projects"
          className="scroll-mt-32 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
        >
          <div className="mx-auto max-w-[1460px]">
            <Reveal y={10} className="text-center mb-6 sm:mb-8">
              <h2 className="font-serif text-2xl font-black tracking-tight text-[#082352] sm:text-3xl">
                Dự án & Kết quả
              </h2>
            </Reveal>

            <div className="space-y-4 max-w-5xl mx-auto">
              {/* DỰ ÁN 1: HỌC BỔNG KHAI SÁNG */}
              <article className="flex flex-col gap-5 rounded-2xl border border-blue-200/90 bg-white p-6 shadow-xs transition hover:border-blue-400 hover:shadow-md lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h3 className="font-serif text-xl font-bold text-[#082352] sm:text-2xl">
                    Chương trình Học bổng & Đề tài “Khai sáng” (Khaisang
                    Initiative)
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                    Sáng kiến của Quỹ Thúc đẩy Hợp tác Nga - Việt tài trợ kinh
                    phí sinh hoạt, hỗ trợ bảo vệ luận án và kết nối phòng thí
                    nghiệm cho các nghiên cứu sinh, nhà khoa học trẻ tại LB Nga.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap sm:flex-nowrap items-center gap-3 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResultsModal(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700"
                  >
                    <span>Tra cứu Kết quả</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection("opportunities", "opportunities");
                      setOppSubTab("connect");
                      setConnectForm((prev) => ({
                        ...prev,
                        message:
                          "Tôi muốn tìm hiểu thông tin và nộp hồ sơ xin xét duyệt Chương trình Học bổng Khai sáng.",
                      }));
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700"
                  >
                    <span>Đăng ký tham gia</span>
                  </button>
                </div>
              </article>

              {/* DỰ ÁN 2: NĂNG LƯỢNG SẠCH & PIN THẾ HỆ MỚI */}
              <article className="flex flex-col gap-5 rounded-2xl border border-blue-200/90 bg-white p-6 shadow-xs transition hover:border-blue-400 hover:shadow-md lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h3 className="font-serif text-xl font-bold text-[#082352] sm:text-2xl">
                    Dự án Hợp tác Nghiên cứu Năng lượng Sạch & Pin Thế hệ Mới
                    Nga – Việt
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                    Chương trình tài trợ liên kết giữa VAST và MISIS / SPbPU
                    nhằm chế tạo vật liệu lưu trữ năng lượng bền vững và pin
                    trạng thái rắn (kinh phí dự kiến lên tới 15.000.000 RUB).
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap sm:flex-nowrap items-center gap-3 lg:justify-end">
                  <Link
                    href="/news/1/mang-tri-thuc-tro-ve"
                    className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    <span>Xem chi tiết</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection("opportunities", "opportunities");
                      setOppSubTab("connect");
                      setConnectForm((prev) => ({
                        ...prev,
                        field: "Vật liệu tiên tiến & Năng lượng",
                        message:
                          "Tôi quan tâm đến Gói tài trợ Đề tài Năng lượng Sạch & Pin thế hệ mới và muốn đăng ký tham gia.",
                      }));
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700"
                  >
                    <span>Đăng ký tham gia</span>
                  </button>
                </div>
              </article>

              {/* DỰ ÁN 3: AI & BIG DATA */}
              <article className="flex flex-col gap-5 rounded-2xl border border-blue-200/90 bg-white p-6 shadow-xs transition hover:border-blue-400 hover:shadow-md lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h3 className="font-serif text-xl font-bold text-[#082352] sm:text-2xl">
                    Dự án Trung tâm Đổi mới AI & Xử lý Dữ liệu Lớn Song phương
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                    Sáng kiến thành lập mạng lưới phòng thí nghiệm ảo về AI,
                    dịch máy đa ngữ Nga – Việt và phân tích dữ liệu quan trắc
                    viễn thám không gian giữa Đại học Quốc gia Hà Nội và ĐH
                    Bauman.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap sm:flex-nowrap items-center gap-3 lg:justify-end">
                  <Link
                    href="/news/5/truong-dai-hoc-khoa-hoc-tu-nhien-va-rosatom-quantum-thuc-day-hop-tac-trong-linh-vuc-cong-nghe-luong-tu"
                    className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    <span>Xem chi tiết</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection("opportunities", "opportunities");
                      setOppSubTab("connect");
                      setConnectForm((prev) => ({
                        ...prev,
                        field: "Trí tuệ nhân tạo & Dữ liệu lớn",
                        message:
                          "Tôi muốn tham gia Nhóm nghiên cứu thuộc Dự án Trung tâm Đổi mới AI & Xử lý Dữ liệu lớn.",
                      }));
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700"
                  >
                    <span>Đăng ký tham gia</span>
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. THƯ VIỆN TRI THỨC (#knowledge-library)
            ════════════════════════════════════════════════════════════════ */}
        <section
          id="knowledge-library"
          className="scroll-mt-32 border-t border-blue-200/50 bg-[#e7f0fa] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14"
        >
          <div className="mx-auto max-w-[1460px]">
            <Reveal y={10} className="text-center mb-4 sm:mb-5">
              <h2 className="font-serif text-2xl font-black tracking-tight text-[#082352] sm:text-3xl">
                Thư viện tri thức
              </h2>
            </Reveal>

            {/* Sub-tab Switcher: Bài báo | Tạp chí | Sở hữu trí tuệ */}
            <div className="mx-auto mb-6 sm:mb-8 max-w-2xl">
              <div className="grid grid-cols-3 rounded-xl border border-blue-200 bg-white p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setLibSubTab("articles")}
                  aria-pressed={libSubTab === "articles"}
                  className={`min-h-11 rounded-lg px-2 py-2 text-base font-bold transition-colors sm:px-4 ${
                    libSubTab === "articles"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  Bài báo
                </button>
                <button
                  type="button"
                  onClick={() => setLibSubTab("journals")}
                  aria-pressed={libSubTab === "journals"}
                  className={`min-h-11 rounded-lg px-2 py-2 text-base font-bold transition-colors sm:px-4 ${
                    libSubTab === "journals"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  Tạp chí
                </button>
                <button
                  type="button"
                  onClick={() => setLibSubTab("patents")}
                  aria-pressed={libSubTab === "patents"}
                  className={`min-h-11 rounded-lg px-2 py-2 text-base font-bold transition-colors sm:px-4 ${
                    libSubTab === "patents"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-blue-900"
                  }`}
                >
                  Sáng chế
                </button>
              </div>
            </div>

            {/* SUBTAB 1: BÀI BÁO (Articles) */}
            {libSubTab === "articles" && (
              <div className="grid gap-6 md:grid-cols-3">
                <article className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md">
                  <div>
                    <h3 className="font-serif text-lg font-bold leading-snug text-[#082352]">
                      Functional composites and surface engineering for extreme
                      thermal environments
                    </h3>
                    <div className="mt-2 text-xs font-medium text-slate-500">
                      Tác giả: GS.TS Nguyễn Văn An, Prof. Elena Kurchatova
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Nghiên cứu cấu trúc composite nền gốm chịu nhiệt độ cực
                      cao ứng dụng trong động cơ đẩy và vỏ bọc bảo vệ nhiệt thế
                      hệ mới.
                    </p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <Link
                      href="/news/1/mang-tri-thuc-tro-ve"
                      className="text-xs font-extrabold text-blue-600 hover:text-blue-800"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </article>

                <article className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md">
                  <div>
                    <h3 className="font-serif text-lg font-bold leading-snug text-[#082352]">
                      Multisource remote sensing and machine learning for marine
                      environmental observation
                    </h3>
                    <div className="mt-2 text-xs font-medium text-slate-500">
                      Tác giả: PGS.TS Bùi Bảo Thiện, PGS.TS Lê Thị Mai
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Tích hợp dữ liệu viễn thám radar và quang học kết hợp mạng
                      nơ-ron học sâu để dự báo xâm nhập mặn và biến động rạn san
                      hô ven bờ.
                    </p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <Link
                      href="/news/5/truong-dai-hoc-khoa-hoc-tu-nhien-va-rosatom-quantum-thuc-day-hop-tac-trong-linh-vuc-cong-nghe-luong-tu"
                      className="text-xs font-extrabold text-blue-600 hover:text-blue-800"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </article>

                <article className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md">
                  <div>
                    <h3 className="font-serif text-lg font-bold leading-snug text-[#082352]">
                      Quantum computing algorithms and simulation frameworks for
                      bilateral research
                    </h3>
                    <div className="mt-2 text-xs font-medium text-slate-500">
                      Tác giả: Denis Avetisyan, PGS.TS Ngạc An Bang
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Khung mô phỏng tính toán lượng tử hỗ trợ phát triển thuốc
                      sinh học và giải mã các cấu trúc phân tử phức tạp.
                    </p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <Link
                      href="/news/5/truong-dai-hoc-khoa-hoc-tu-nhien-va-rosatom-quantum-thuc-day-hop-tac-trong-linh-vuc-cong-nghe-luong-tu"
                      className="text-xs font-extrabold text-blue-600 hover:text-blue-800"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </article>
              </div>
            )}

            {/* SUBTAB 2: TẠP CHÍ (Journals) */}
            {libSubTab === "journals" && (
              <div className="grid gap-6 md:grid-cols-3">
                <article className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md">
                  <div>
                    <h3 className="font-serif text-xl font-bold leading-snug text-[#082352]">
                      Tạp chí Khoa học & Công nghệ Song phương Nga – Việt
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Ấn phẩm học thuật quốc tế xuất bản 4 số/năm bằng tiếng Anh
                      và tiếng Nga, giới thiệu các kết quả nghiên cứu hợp tác
                      mới nhất giữa hai nước.
                    </p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <span className="text-xs font-extrabold text-slate-500">
                      ISSN: 2831-9042 · Chỉ mục Scopus
                    </span>
                  </div>
                </article>

                <article className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md">
                  <div>
                    <h3 className="font-serif text-xl font-bold leading-snug text-[#082352]">
                      Kỷ yếu Diễn đàn Khoa học Quốc tế VAST – RAS
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Tổng hợp toàn văn các báo cáo khoa học của các nhà khoa
                      học hai nước trong các kỳ hội nghị song phương thường
                      niên.
                    </p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <span className="text-xs font-extrabold text-slate-500">
                      ISBN: 978-604-913-882-1
                    </span>
                  </div>
                </article>

                <article className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md">
                  <div>
                    <h3 className="font-serif text-xl font-bold leading-snug text-[#082352]">
                      Bản tin Đổi mới Sáng tạo & Chuyển giao Tri thức
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Bản tin phân tích xu hướng công nghệ cao của Nga, chính
                      sách khoa học và cơ hội chuyển giao công nghệ cho doanh
                      nghiệp Việt Nam.
                    </p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <span className="text-xs font-extrabold text-slate-500">
                      Phát hành hàng tháng
                    </span>
                  </div>
                </article>
              </div>
            )}

            {/* SUBTAB 3: SỞ HỮU TRÍ TUỆ / SÁNG CHẾ (Patents) */}
            {libSubTab === "patents" && (
              <div className="grid gap-6 md:grid-cols-3">
                <article className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md">
                  <div>
                    <h3 className="font-serif text-xl font-bold leading-snug text-[#082352]">
                      Quy trình tổng hợp vật liệu composite gốm nền cacbua siêu
                      chịu nhiệt
                    </h3>
                    <div className="mt-2 text-xs font-extrabold text-blue-700">
                      Mã bằng: RU2789124 / VN-45892
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Chủ sở hữu: Viện Hàn lâm KHCN Việt Nam & Đại học Bauman.
                      Bảo hộ độc quyền quy trình thiêu kết áp suất cao cho linh
                      kiện hàng không.
                    </p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-emerald-700">
                      Trạng thái: Đang bảo hộ hiệu lực
                    </span>
                  </div>
                </article>

                <article className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md">
                  <div>
                    <h3 className="font-serif text-xl font-bold leading-snug text-[#082352]">
                      Thiết bị bay không người lái tự hành thu thập mẫu nước
                      biển tầng nông
                    </h3>
                    <div className="mt-2 text-xs font-extrabold text-blue-700">
                      Mã đăng ký: VN-GPHI-2026-089
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Tác giả: Nhóm nghiên cứu NCS Phạm Quốc Phòng & Viện Hải
                      dương học. Thiết kế cơ cấu thả mẫu tự cân bằng trong điều
                      kiện sóng cấp 4.
                    </p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-blue-700">
                      Trạng thái: Đã cấp bằng
                    </span>
                  </div>
                </article>

                <article className="flex flex-col justify-between rounded-3xl border border-blue-200 bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md">
                  <div>
                    <h3 className="font-serif text-xl font-bold leading-snug text-[#082352]">
                      Thuật toán giải mã tín hiệu quang học cho cảm biến lượng
                      tử độ nhạy cao
                    </h3>
                    <div className="mt-2 text-xs font-extrabold text-blue-700">
                      Mã bằng: RU2801452-C1
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      Chủ sở hữu: Rosatom Quantum JV & Trường ĐH Khoa học Tự
                      nhiên ĐHQGHN. Ứng dụng trong thiết bị đo địa từ trường và
                      địa chất ngầm.
                    </p>
                  </div>
                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-purple-700">
                      Trạng thái: Đang bảo hộ hiệu lực
                    </span>
                  </div>
                </article>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════════════════════════════
          MODAL: TRA CỨU KẾT QUẢ HỌC BỔNG KHAI SÁNG
          ════════════════════════════════════════════════════════════════ */}
      {showResultsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="results-modal-title"
        >
          <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-3xl border border-blue-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  DỮ LIỆU CÔNG BỐ CHÍNH THỨC
                </span>
                <h3
                  id="results-modal-title"
                  className="mt-1 font-serif text-2xl font-black text-[#082352] sm:text-3xl"
                >
                  Kết quả Xét duyệt Học bổng & Đề tài “Khai sáng”
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResultsModal(false)}
                className="grid size-10 place-items-center rounded-full bg-slate-100 text-lg font-bold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                aria-label="Đóng cửa sổ"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={searchResultQuery}
                onChange={(e) => setSearchResultQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên ứng viên, trường ĐH, đề tài nghiên cứu..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
              {filteredResults.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm.
                </div>
              ) : (
                filteredResults.map((res) => (
                  <div
                    key={res.candidate}
                    className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 transition hover:bg-blue-50/80"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="font-serif text-lg font-bold text-[#082352]">
                        {res.candidate}
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 self-start sm:self-auto">
                        ✔ {res.status}
                      </span>
                    </div>
                    <div className="mt-1 text-xs font-extrabold text-blue-700">
                      Trường tiếp nhận: {res.host} · {res.batch}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700 sm:text-sm">
                      <strong>Đề tài:</strong> {res.topic}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4 flex justify-between items-center text-xs text-slate-500">
              <span>Nguồn: Hội đồng Khoa học Quỹ Truyền thống và Hữu nghị</span>
              <button
                type="button"
                onClick={() => setShowResultsModal(false)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <GuestPublicFooter copy={homeCopy} />
    </div>,
    locale,
    ECOSYSTEM_TRANSLATIONS,
  );
}
