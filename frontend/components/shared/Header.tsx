"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const pageTitles: Record<string, string> = {
  "/workspace": "Tổng quan",
  "/workspace/knowledge": "Kho tri thức & Chuyên gia",
  "/workspace/iam": "IAM & Governance",
  "/admin/iam": "IAM Administration",
  "/security": "Security & Sessions",
};

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const currentTitle = pageTitles[pathname] || "Russia-Vietnam Science-Technology Intelligence Network";

  return (
    <header className="sticky top-0 z-30 flex h-18 items-center gap-3 border-b border-outline-variant bg-background/90 px-4 backdrop-blur-xl transition-colors sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        aria-label="Mở menu"
        onClick={onMenuClick}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-card-border bg-card-background text-on-surface xl:hidden cursor-pointer shadow-xs transition hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>

      {/* Breadcrumb Path */}
      <div className="hidden items-center gap-2 text-xs text-text-secondary sm:flex">
        <Link href="/workspace" className="font-semibold text-text-secondary hover:text-blue-600 transition">
          Workspace
        </Link>
        <span>/</span>
        <strong className="text-text-primary font-bold">{currentTitle}</strong>
      </div>

      {/* Global Search with ⌘K */}
      <div className="relative ml-auto hidden w-[min(460px,40vw)] md:block">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-text-tertiary">
          search
        </span>
        <input
          ref={searchInputRef}
          type="search"
          aria-label="Tìm kiếm toàn Portal"
          placeholder="Tìm chuyên gia, công bố, chủ đề…"
          className="h-11 w-full rounded-2xl border border-card-border bg-card-background pl-10 pr-16 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-card-border bg-card-surface-area px-2 py-0.5 text-xs font-bold text-text-tertiary">
          ⌘K
        </kbd>
      </div>

      {/* Actions (Language Switcher, Theme Toggle, Context Active) */}
      <div className="flex items-center gap-2.5">
        {/* Language Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex h-11 items-center gap-1.5 rounded-2xl border border-card-border bg-card-background px-3 text-xs font-bold text-text-primary transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer outline-none shadow-xs"
          >
            <span>{languages.find((l) => l.code === locale)?.flag}</span>
            <span className="uppercase">{locale}</span>
          </button>

          {isLangOpen && (
            <div
              className="absolute right-0 mt-1.5 w-36 overflow-hidden rounded-2xl border border-card-border bg-card-background p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setIsLangOpen(false)}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLocale(lang.code);
                    setIsLangOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer ${
                    locale === lang.code
                      ? "bg-blue-600 text-white font-bold"
                      : "text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-primary"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Chuyển sang chế độ ${theme === "dark" ? "Sáng" : "Tối"}`}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-card-border bg-card-background text-text-primary transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer outline-none shadow-xs"
          >
            <span className="material-symbols-outlined text-xl text-amber-500 dark:text-amber-400">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
        )}

        {/* Context Active Badge */}
        <div className="flex h-11 items-center gap-2 rounded-2xl border border-card-border bg-card-background px-3 text-xs font-black text-text-primary shadow-xs">
          <span className="size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950 animate-pulse" />
          <span className="hidden xl:inline">Context active</span>
        </div>
      </div>
    </header>
  );
}
