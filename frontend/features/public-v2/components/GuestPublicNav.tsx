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
    collaboration: string;
    experts: string;
    knowledge: string;
    events: string;
    news: string;
    login: string;
    workspace: string;
    subtitle: string;
  }
> = {
  vi: {
    brandTitle: "Mạng lưới Tri thức KH&CN",
    home: "Trang chủ",
    about: "Giới thiệu",
    collaboration: "Hợp tác",
    experts: "Chuyên gia",
    knowledge: "Tri thức",
    events: "Sự kiện",
    news: "Tin tức",
    login: "Đăng nhập",
    workspace: "Không gian làm việc",
    subtitle: "Nga – Việt",
  },
  en: {
    brandTitle: "S&T Knowledge Network",
    home: "Home",
    about: "About",
    collaboration: "Collaboration",
    experts: "Experts",
    knowledge: "Knowledge",
    events: "Events",
    news: "News",
    login: "Sign in",
    workspace: "Workspace",
    subtitle: "Russia – Vietnam",
  },
  ru: {
    brandTitle: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
    home: "Главная",
    about: "О сети",
    collaboration: "Сотрудничество",
    experts: "Эксперты",
    knowledge: "Знания",
    events: "События",
    news: "Новости",
    login: "Войти",
    workspace: "Рабочее пространство",
    subtitle: "Россия – Вьетнам",
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
    if (pathname === "/experts") return "experts";
    if (pathname === "/opportunities") return "opportunities";
    if (pathname === "/knowledge") return "knowledge";
    if (pathname === "/") {
      if (currentHash === "#about") return "about";
      if (currentHash === "#events") return "events";
      if (currentHash === "#news") return "news";
      return "home";
    }
    return active || "home";
  };

  const activeKey = resolveActive();

  const items = [
    { key: "home", label: t.home, href: "/" },
    { key: "about", label: t.about, href: "/#about" },
    { key: "opportunities", label: t.collaboration, href: "/opportunities" },
    { key: "experts", label: t.experts, href: "/experts" },
    { key: "knowledge", label: t.knowledge, href: "/knowledge" },
    { key: "events", label: t.events, href: "/#events" },
    { key: "news", label: t.news, href: "/#news" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/80 bg-[#edf5fe]/95 shadow-[0_4px_20px_-12px_rgba(37,99,235,.2)] backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1460px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label="Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt"
          onClick={() => setClickedKey("home")}
        >
          <BrandMark className="size-11 shadow-xs" />
          <span className="hidden min-w-0 sm:block">
            <strong className="block truncate text-[15px] sm:text-[16px] font-extrabold tracking-tight text-slate-950">
              {t.brandTitle}
            </strong>
            <small className="block text-[11.5px] font-bold tracking-[0.06em] text-slate-500 uppercase">
              {t.subtitle}
            </small>
          </span>
        </Link>

        <nav
          className="hidden items-center rounded-xl border border-blue-200/80 bg-blue-100/70 p-1 shadow-2xs lg:flex"
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
                className={`rounded-lg px-3.5 py-1.5 text-[14px] font-bold transition-all duration-150 ${selected ? "bg-white text-blue-700 shadow-2xs font-extrabold" : "text-slate-700 hover:bg-white/70 hover:text-blue-700"}`}
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
        className="border-t border-blue-200/60 bg-[#edf5fe] lg:hidden"
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
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all ${selected ? "bg-blue-600 text-white shadow-2xs" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
