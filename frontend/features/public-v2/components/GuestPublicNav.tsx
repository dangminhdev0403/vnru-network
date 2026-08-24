"use client";

import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";

type GuestNavActive = "home" | "experts" | "opportunities" | "knowledge";

type GuestPublicNavProps = {
  active: GuestNavActive;
  isAuthenticated?: boolean;
  workspaceHref?: string;
};

const COPY: Record<Locale, {
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
  const t = COPY[locale];
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
    <header className="sticky top-0 z-50 border-b border-blue-100/90 bg-white/95 shadow-[0_8px_28px_-24px_rgba(37,99,235,.55)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] max-w-[1460px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5" aria-label="VN–RU Network">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
            <span className="absolute inset-y-0 left-0 w-[62%] -skew-x-12 bg-blue-600" />
            <span className="absolute inset-y-0 right-0 w-[46%] -skew-x-12 bg-rose-500" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <strong className="block truncate text-[13px] font-extrabold tracking-tight text-slate-950">Mạng lưới KH&CN</strong>
            <small className="block text-[10px] font-semibold tracking-[0.08em] text-slate-500">{t.subtitle}</small>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center rounded-2xl border border-blue-100 bg-blue-50/70 p-1 shadow-inner lg:flex" aria-label="Điều hướng công khai">
          {items.map((item) => {
            const selected = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={selected ? "page" : undefined}
                className={`rounded-xl px-3.5 py-2 text-[11px] font-bold transition-all duration-200 ${selected ? "bg-white text-blue-700 shadow-sm ring-1 ring-blue-200" : "text-slate-600 hover:bg-white/80 hover:text-blue-700"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button type="button" aria-label="Tìm kiếm" className="grid size-9 place-items-center rounded-xl border border-blue-100 bg-white text-sm font-black text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50">⌕</button>
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
            aria-label="Ngôn ngữ"
            className="h-9 rounded-xl border border-blue-100 bg-white px-2 text-[11px] font-extrabold text-slate-700 shadow-sm outline-none transition hover:border-blue-300 focus:border-blue-400"
          >
            <option value="vi">VI</option>
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>
          <Link href={isAuthenticated ? workspaceHref : "/login"} className="inline-flex min-h-9 items-center rounded-xl bg-blue-600 px-3.5 text-[11px] font-extrabold text-white shadow-[0_8px_22px_-10px_rgba(37,99,235,.8)] transition hover:bg-blue-700">
            {isAuthenticated ? t.workspace : t.login}
          </Link>
        </div>
      </div>

      <nav className="border-t border-blue-50 bg-white lg:hidden" aria-label="Điều hướng công khai trên di động">
        <div className="mx-auto flex max-w-[1460px] gap-1.5 overflow-x-auto px-4 py-2 sm:px-6">
          {items.map((item) => {
            const selected = item.key === active;
            return <Link key={item.key} href={item.href} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold ${selected ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>{item.label}</Link>;
          })}
        </div>
      </nav>
    </header>
  );
}
