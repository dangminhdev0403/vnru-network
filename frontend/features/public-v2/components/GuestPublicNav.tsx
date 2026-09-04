"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { BrandMark } from "@/components/shared/BrandMark";
import { MenuIcon } from "@/components/shared/icons/SidebarIcons";

type GuestNavActive =
  | "home"
  | "about"
  | "ecosystem"
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
    ecosystem: string;
    news: string;
    contact: string;
    register: string;
    login: string;
    workspace: string;
    menu: string;
    navigation: string;
  }
> = {
  vi: {
    brandTitle: "Mạng lưới tri thức Nga - Việt",
    home: "Trang chủ",
    about: "Giới thiệu",
    ecosystem: "Hệ sinh thái",
    news: "Tin tức",
    contact: "Liên hệ",
    register: "Đăng ký",
    login: "Đăng nhập",
    workspace: "Vào không gian làm việc",
    menu: "Mở menu",
    navigation: "Điều hướng công khai",
  },
  en: {
    brandTitle: "Russia - Vietnam Knowledge Network",
    home: "Home",
    about: "About",
    ecosystem: "Ecosystem",
    news: "News",
    contact: "Contact",
    register: "Register",
    login: "Sign in",
    workspace: "Workspace",
    menu: "Open menu",
    navigation: "Public navigation",
  },
  ru: {
    brandTitle: "Российско-вьетнамская сеть знаний",
    home: "Главная",
    about: "О сети",
    ecosystem: "Экосистема",
    news: "Новости",
    contact: "Контакты",
    register: "Регистрация",
    login: "Войти",
    workspace: "Рабочее пространство",
    menu: "Открыть меню",
    navigation: "Публичная навигация",
  },
};

const BRAND_TITLE: Record<Locale, { line1: string; line2: string }> = {
  vi: {
    line1: "Mạng lưới Tri thức",
    line2: "Nga - Việt",
  },
  en: {
    line1: "Knowledge Network",
    line2: "Russia - Vietnam",
  },
  ru: {
    line1: "Российско-Вьетнамская",
    line2: "сеть знаний",
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
  const brand = BRAND_TITLE[locale] ?? BRAND_TITLE.vi;

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
    if (pathname === "/ecosystem") return "ecosystem";
    if (pathname === "/about") return "about";
    if (pathname === "/contact" || pathname.startsWith("/contact"))
      return "contact";
    if (pathname === "/") {
      if (currentHash === "#ecosystem") return "ecosystem";
      return "home";
    }
    return active || "home";
  };

  const activeKey = resolveActive();
  const items = [
    { key: "home", label: t.home, href: "/" },
    { key: "about", label: t.about, href: "/about" },
    { key: "ecosystem", label: t.ecosystem, href: "/ecosystem" },
    { key: "news", label: t.news, href: "/news" },
    { key: "contact", label: t.contact, href: "/contact" },
  ];

  return (
    <header
      translate="no"
      className="sticky top-0 z-50 border-b border-blue-200/80 bg-[#edf5fe]/95 shadow-[0_4px_20px_-12px_rgba(37,99,235,.2)] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[74px] max-w-[1536px] items-center justify-between gap-x-2 px-4 sm:px-6 lg:gap-x-3 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label={t.brandTitle}
          onClick={() => setClickedKey("home")}
        >
          <BrandMark className="size-11 shrink-0 shadow-xs sm:size-[50px]" />
          <div className="hidden flex-col justify-center leading-tight sm:flex">
            <span className="text-sm font-black tracking-tight text-slate-950 sm:text-base xl:text-[17px]">
              {brand.line1}
            </span>
            <span className="text-xs font-black tracking-tight text-blue-700 sm:text-sm xl:text-[15px]">
              {brand.line2}
            </span>
          </div>
        </Link>

        <div className="hidden items-center justify-center lg:flex">
          <nav
            className="flex items-center justify-center rounded-xl border border-blue-200/80 bg-blue-100/70 p-1 shadow-2xs"
            aria-label={t.navigation}
          >
            {items.map((item) => {
              const selected = item.key === activeKey;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setClickedKey(item.key)}
                  aria-current={selected ? "page" : undefined}
                  className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2 py-1.5 text-center text-xs font-bold uppercase leading-tight transition-colors duration-150 xl:px-3 xl:py-1.5 xl:text-sm 2xl:px-4 2xl:py-2 2xl:text-base ${
                    selected
                      ? "text-white"
                      : "text-blue-950 hover:bg-white/70 hover:text-blue-700"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="public-nav-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                      className="absolute inset-0 rounded-lg bg-blue-600 shadow-2xs"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 xl:gap-3">
          <LanguageSwitcher variant="light" compact refreshOnChange />

          {!isAuthenticated ? (
            <Link
              href="/register"
              className="hidden h-9 items-center justify-center whitespace-nowrap rounded-xl border border-blue-300 bg-white px-2.5 text-center text-xs font-bold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 lg:inline-flex xl:h-10 xl:px-3.5 xl:text-sm 2xl:h-11 2xl:px-4 2xl:text-base"
            >
              {t.register}
            </Link>
          ) : null}

          <Link
            href={isAuthenticated ? workspaceHref : "/login"}
            className="hidden h-9 items-center justify-center whitespace-nowrap rounded-xl bg-blue-600 px-2.5 text-center text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 lg:inline-flex xl:h-10 xl:px-3.5 xl:text-sm 2xl:h-11 2xl:px-4 2xl:text-base"
          >
            {isAuthenticated ? t.workspace : t.login}
          </Link>

          <details className="group static lg:hidden">
            <summary
              aria-label={t.menu}
              className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-blue-200 bg-white text-blue-950 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden"
            >
              <MenuIcon aria-hidden="true" />
            </summary>
            <div className="absolute inset-x-4 top-[calc(100%+8px)] rounded-2xl border border-blue-200 bg-white p-3 shadow-xl sm:inset-x-6">
              <nav className="grid gap-1" aria-label={t.menu}>
                {items.map((item) => {
                  const selected = item.key === activeKey;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setClickedKey(item.key)}
                      aria-current={selected ? "page" : undefined}
                      className={`flex min-h-11 items-center justify-center rounded-xl px-4 text-center text-base font-bold ${selected ? "bg-blue-600 text-white" : "text-blue-950 hover:bg-blue-50"}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-3 grid gap-2 border-t border-blue-100 pt-3 sm:grid-cols-2">
                {!isAuthenticated ? (
                  <Link
                    href="/register"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-300 px-3 text-base font-bold text-blue-700"
                  >
                    {t.register}
                  </Link>
                ) : null}
                <Link
                  href={isAuthenticated ? workspaceHref : "/login"}
                  className={`${isAuthenticated ? "col-span-2" : ""} inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-3 text-base font-bold text-white`}
                >
                  {isAuthenticated ? t.workspace : t.login}
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
