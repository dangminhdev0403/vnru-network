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
  | "news"
  | "opportunities"
  | "experts"
  | "knowledge"
  | "contact";

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
    news: string;
    contact: string;
    login: string;
    workspace: string;
  }
> = {
  vi: {
    brandTitle: "Mạng lưới tri thức Nga - Việt",
    home: "Trang chủ",
    about: "Giới thiệu",
    news: "Tin tức",
    contact: "Liên hệ",
    login: "Đăng nhập",
    workspace: "Không gian làm việc",
  },
  en: {
    brandTitle: "Mạng lưới tri thức Nga - Việt",
    home: "Home",
    about: "About",
    news: "News",
    contact: "Contact",
    login: "Sign in",
    workspace: "Workspace",
  },
  ru: {
    brandTitle: "Mạng lưới tri thức Nga - Việt",
    home: "Главная",
    about: "О сети",
    news: "Новости",
    contact: "Контакты",
    login: "Войти",
    workspace: "Рабочее пространство",
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
    if (pathname.startsWith("/news")) return "news";
    if (pathname === "/") {
      if (currentHash === "#about") return "about";
      if (currentHash === "#contact") return "contact";
      return "home";
    }
    return active || "home";
  };

  const activeKey = resolveActive();
  const items = [
    { key: "home", label: t.home, href: "/" },
    { key: "about", label: t.about, href: "/#about" },
    { key: "news", label: t.news, href: "/news" },
    { key: "contact", label: t.contact, href: "/#contact" },
  ];

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
          <strong className="hidden truncate text-base font-extrabold text-slate-950 sm:block">
            {t.brandTitle}
          </strong>
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
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-base font-bold uppercase leading-[1.2] transition-all ${selected ? "bg-blue-600 text-white shadow-2xs" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}
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
