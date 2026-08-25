"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { BrandMark } from "@/components/shared/BrandMark";

type GuestNavActive =
  | "home"
  | "about"
  | "explore"
  | "opportunities"
  | "experts"
  | "knowledge"
  | "events"
  | "news";

type GuestPublicNavProps = {
  active?: GuestNavActive;
  isAuthenticated?: boolean;
  workspaceHref?: string;
};

const COPY: Record<
  Locale,
  {
    brandTitle: string;
    home: string;
    about: string;
    explore: string;
    events: string;
    news: string;
    login: string;
    workspace: string;
    discoveryNav: string;
    discoveryOverview: string;
    opportunities: string;
    experts: string;
    knowledge: string;
    currentArea: string;
  }
> = {
  vi: {
    brandTitle: "Mạng lưới tri thức Nga - Việt",
    home: "Trang chủ",
    about: "Giới thiệu",
    explore: "Khám phá",
    events: "Sự kiện",
    news: "Tin tức",
    login: "Đăng nhập",
    workspace: "Không gian làm việc",
    discoveryNav: "Các khu vực khám phá",
    discoveryOverview: "Tổng quan",
    opportunities: "Hợp tác",
    experts: "Chuyên gia",
    knowledge: "Tri thức",
    currentArea: "Đang xem",
  },
  en: {
    brandTitle: "Russia - Vietnam Knowledge Network",
    home: "Home",
    about: "About",
    explore: "Explore",
    events: "Events",
    news: "News",
    login: "Sign in",
    workspace: "Workspace",
    discoveryNav: "Discovery areas",
    discoveryOverview: "Overview",
    opportunities: "Collaboration",
    experts: "Experts",
    knowledge: "Knowledge",
    currentArea: "Current",
  },
  ru: {
    brandTitle: "Российско-вьетнамская сеть знаний",
    home: "Главная",
    about: "О сети",
    explore: "Обзор",
    events: "События",
    news: "Новости",
    login: "Войти",
    workspace: "Рабочее пространство",
    discoveryNav: "Разделы обзора",
    discoveryOverview: "Обзор",
    opportunities: "Сотрудничество",
    experts: "Эксперты",
    knowledge: "Знания",
    currentArea: "Открыто",
  },
};

export function GuestPublicNav({
  active,
  isAuthenticated = false,
  workspaceHref = "/workspace",
}: GuestPublicNavProps) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const [clickedKey, setClickedKey] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState<string>("");
  const t = COPY[locale] ?? COPY.vi;

  useEffect(() => {
    const handleHash = () => {
      setCurrentHash(typeof window !== "undefined" ? window.location.hash : "");
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const resolveActive = (): string => {
    if (clickedKey) return clickedKey;
    if (
      pathname === "/explore" ||
      pathname.startsWith("/experts") ||
      pathname.startsWith("/opportunities") ||
      pathname.startsWith("/knowledge")
    )
      return "explore";
    if (pathname === "/") {
      if (currentHash === "#about") return "about";
      if (currentHash === "#events") return "events";
      if (currentHash === "#news") return "news";
      return "home";
    }
    return active || "home";
  };

  const activeKey = resolveActive();
  const isDiscoveryRoute =
    pathname === "/explore" ||
    pathname.startsWith("/experts") ||
    pathname.startsWith("/opportunities") ||
    pathname.startsWith("/knowledge");

  const items = [
    { key: "home", label: t.home, href: "/" },
    { key: "about", label: t.about, href: "/#about" },
    { key: "explore", label: t.explore, href: "/explore" },
    { key: "events", label: t.events, href: "/#events" },
    { key: "news", label: t.news, href: "/#news" },
  ];

  const discoveryItems = [
    { key: "explore", label: t.discoveryOverview, href: "/explore", index: "00" },
    { key: "opportunities", label: t.opportunities, href: "/opportunities", index: "01" },
    { key: "experts", label: t.experts, href: "/experts", index: "02" },
    { key: "knowledge", label: t.knowledge, href: "/knowledge", index: "03" },
  ];

  const discoveryActiveKey = pathname.startsWith("/opportunities")
    ? "opportunities"
    : pathname.startsWith("/experts")
      ? "experts"
      : pathname.startsWith("/knowledge")
        ? "knowledge"
        : "explore";

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/80 bg-[#edf5fe]/95 shadow-[0_4px_20px_-12px_rgba(37,99,235,.2)] backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1460px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label={t.brandTitle}
          onClick={() => setClickedKey("home")}
        >
          <BrandMark className="size-11 shadow-xs" />
          <span className="hidden min-w-0 sm:block">
            <strong className="block truncate text-[15px] sm:text-[16px] font-extrabold tracking-tight text-slate-950">
              {t.brandTitle}
            </strong>
          </span>
        </Link>

        <nav
          className="hidden items-center rounded-xl border border-blue-200/80 bg-blue-100/70 p-1 shadow-2xs xl:flex"
          aria-label="Điều hướng công khai"
        >
          {items.map((item) => {
            const selected = item.key === activeKey;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setClickedKey(item.key)}
                aria-current={selected ? "page" : undefined}
                className={`rounded-lg px-3.5 py-1.5 text-base font-bold uppercase leading-[1.2] transition-all duration-150 ${selected ? "bg-white text-blue-700 shadow-2xs font-extrabold" : "text-slate-700 hover:bg-white/70 hover:text-blue-700"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher variant="light" />

          <Link
            href={isAuthenticated ? workspaceHref : "/login"}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
          >
            {isAuthenticated ? t.workspace : t.login}
          </Link>
        </div>
      </div>

      <nav
        className="border-t border-blue-200/60 bg-[#edf5fe] xl:hidden"
        aria-label="Điều hướng công khai trên di động"
      >
        <div className="mx-auto flex max-w-[1460px] gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-6">
          {items.map((item) => {
            const selected = item.key === activeKey;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setClickedKey(item.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-base font-bold uppercase leading-[1.2] transition-all ${selected ? "bg-blue-600 text-white shadow-2xs" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {isDiscoveryRoute && (
        <nav
          className="border-t border-blue-200/80 bg-white/95"
          aria-label={t.discoveryNav}
        >
          <div className="mx-auto flex max-w-[1460px] gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
            {discoveryItems.map((item) => {
              const selected = item.key === discoveryActiveKey;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={selected ? "page" : undefined}
                  className={`group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-base font-bold leading-[1.2] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${selected ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-blue-200 bg-blue-50/60 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"}`}
                >
                  <span
                    className={`text-sm font-black tabular-nums ${selected ? "text-blue-100" : "text-blue-600"}`}
                    aria-hidden="true"
                  >
                    {item.index}
                  </span>
                  <span>{item.label}</span>
                  {selected && (
                    <span className="rounded bg-white/16 px-2 py-1 text-sm font-bold">
                      {t.currentArea}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
