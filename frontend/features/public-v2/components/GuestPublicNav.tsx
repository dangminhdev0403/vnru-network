"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";

type GuestNavActive = "home" | "about" | "opportunities" | "experts" | "knowledge" | "events" | "news";

type GuestPublicNavProps = {
  active?: GuestNavActive;
  isAuthenticated?: boolean;
  workspaceHref?: string;
};

const COPY: Record<Locale, {
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
}> = {
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
    brandTitle: "Сеть знаний НТИ",
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

export function GuestPublicNav({ active, isAuthenticated = false, workspaceHref = "/workspace" }: GuestPublicNavProps) {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const [clickedKey, setClickedKey] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState<string>("");
  const t = COPY[locale];

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
    <header className="sticky top-0 z-50 border-b border-blue-200/80 bg-[#edf5fe]/95 shadow-[0_8px_28px_-20px_rgba(37,99,235,.35)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[80px] max-w-[1460px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3.5" aria-label="Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt" onClick={() => setClickedKey("home")}>
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xs">
            <span className="absolute inset-y-0 left-0 w-[62%] -skew-x-12 bg-blue-600" />
            <span className="absolute inset-y-0 right-0 w-[46%] -skew-x-12 bg-rose-500" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <strong className="block truncate text-base sm:text-lg font-black tracking-tight text-slate-950">{t.brandTitle}</strong>
            <small className="block text-xs sm:text-[13px] font-extrabold tracking-[0.08em] text-slate-600 uppercase">{t.subtitle}</small>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center rounded-2xl border border-blue-200/90 bg-blue-100/80 p-1.5 shadow-inner lg:flex" aria-label="Điều hướng công khai">
          {items.map((item) => {
            const selected = item.key === activeKey;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setClickedKey(item.key)}
                aria-current={selected ? "page" : undefined}
                className={`rounded-xl px-4.5 py-2.5 text-sm sm:text-base font-extrabold transition-all duration-200 ${selected ? "bg-white text-blue-700 shadow-sm font-black" : "text-slate-700 hover:bg-white/80 hover:text-blue-700"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <button type="button" aria-label="Tìm kiếm" className="grid size-11 place-items-center rounded-xl border border-blue-200 bg-white text-lg font-black text-blue-700 shadow-xs transition hover:border-blue-300 hover:bg-blue-50">⌕</button>
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
            aria-label="Ngôn ngữ"
            className="h-11 rounded-xl border border-blue-200 bg-white px-3 text-sm sm:text-base font-extrabold text-slate-700 shadow-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
          >
            <option value="vi">VI</option>
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>
          <Link href={isAuthenticated ? workspaceHref : "/login"} className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm sm:text-base font-extrabold text-white shadow-[0_8px_22px_-10px_rgba(37,99,235,.8)] transition hover:bg-blue-700">
            {isAuthenticated ? t.workspace : t.login}
          </Link>
        </div>
      </div>

      <nav className="border-t border-blue-200/60 bg-[#edf5fe] lg:hidden" aria-label="Điều hướng công khai trên di động">
        <div className="mx-auto flex max-w-[1460px] gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {items.map((item) => {
            const selected = item.key === activeKey;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setClickedKey(item.key)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm sm:text-base font-bold transition-all ${selected ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-300" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
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
