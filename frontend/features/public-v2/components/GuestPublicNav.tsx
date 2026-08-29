"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
    workspace: "Tài khoản",
    menu: "Mở menu",
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
    workspace: "Account",
    menu: "Open menu",
  },
  ru: {
    brandTitle: "Сеть знаний Россия – Вьетнам",
    home: "Главная",
    about: "О сети",
    ecosystem: "Экосистема",
    news: "Новости",
    contact: "Контакты",
    register: "Регистрация",
    login: "Войти",
    workspace: "Аккаунт",
    menu: "Открыть меню",
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
    if (pathname === "/ecosystem") return "ecosystem";
    if (pathname === "/about") return "about";
    if (pathname === "/") {
      if (currentHash === "#ecosystem") return "ecosystem";
      if (currentHash === "#contact") return "contact";
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
    { key: "contact", label: t.contact, href: "/#contact" },
  ];

  return (
    <header
      translate="no"
      className="sticky top-0 z-50 border-b border-blue-200/80 bg-[#edf5fe]/95 shadow-[0_4px_20px_-12px_rgba(37,99,235,.2)] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[74px] max-w-[1536px] items-center justify-between gap-x-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label={t.brandTitle}
          onClick={() => setClickedKey("home")}
        >
          <BrandMark className="size-11 shrink-0 shadow-xs sm:size-[50px]" />
          <strong className="hidden truncate text-sm font-black tracking-tight text-slate-950 sm:block xl:text-lg">
            {t.brandTitle}
          </strong>
        </Link>

        <div className="hidden items-center justify-center lg:flex">
          <nav
            className="flex items-center justify-center rounded-xl border border-blue-200/80 bg-blue-100/70 p-1 shadow-2xs"
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
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-2.5 py-1.5 text-center text-sm font-bold uppercase leading-tight transition-all duration-150 xl:px-4 xl:py-2 xl:text-base ${selected ? "bg-blue-600 font-extrabold text-white shadow-2xs" : "text-blue-950 hover:bg-white/70 hover:text-blue-700"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher variant="light" compact />

          {!isAuthenticated ? (
            <Link
              href="/register"
              className="hidden h-10 items-center justify-center whitespace-nowrap rounded-xl border border-blue-300 bg-white px-3.5 text-center text-sm font-bold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 lg:inline-flex xl:h-11 xl:px-4 xl:text-base"
            >
              {t.register}
            </Link>
          ) : null}

          <Link
            href={isAuthenticated ? workspaceHref : "/login"}
            className="hidden h-10 items-center justify-center whitespace-nowrap rounded-xl bg-blue-600 px-3.5 text-center text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 lg:inline-flex xl:h-11 xl:px-4 xl:text-base"
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
