"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useCurrentUser, useLogout } from "@/features/auth/server-state";

interface HeaderProps {
  onMenuClick?: () => void;
}

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const headerCopy: Record<
  Locale,
  {
    workspaceCrumb: string;
    searchPlaceholder: string;
    contextActive: string;
    account: string;
    signOut: string;
    openMenu: string;
    themeToggle: (isDark: boolean) => string;
    themeModes: { light: string; dark: string; system: string };
    titles: Record<string, string>;
    defaultTitle: string;
  }
> = {
  vi: {
    workspaceCrumb: "Không gian làm việc",
    searchPlaceholder: "Tìm chuyên gia, công bố, chủ đề…",
    contextActive: "Ngữ cảnh hoạt động",
    account: "Tài khoản",
    signOut: "Đăng xuất",
    openMenu: "Mở menu",
    themeToggle: (isDark) => `Chuyển sang chế độ ${isDark ? "Sáng" : "Tối"}`,
    themeModes: { light: "Sáng", dark: "Tối", system: "Hệ thống" },
    titles: {
      "/workspace": "Tổng quan",
      "/workspace/knowledge": "Kho tri thức & Chuyên gia",
      "/workspace/collaboration": "Cộng tác nghiên cứu",
      "/workspace/iam": "Quản trị danh tính & truy cập (IAM)",
      "/workspace/iam/admin": "Quản trị phân quyền",
      "/workspace/iam/security": "Phiên làm việc & Bảo mật",
      "/admin/access": "Quản trị phân quyền",
      "/admin/access/users": "Quản lý người dùng",
      "/admin/access/roles": "Vai trò & quyền",
      "/admin/access/assignments": "Phân công vai trò",
      "/admin/audit": "Nhật ký kiểm toán",
      "/admin/catalogs": "Danh mục chuẩn hóa",
    },
    defaultTitle: "Mạng lưới KH&CN Việt – Nga",
  },
  en: {
    workspaceCrumb: "Workspace",
    searchPlaceholder: "Search experts, publications, topics…",
    contextActive: "Context active",
    account: "Account",
    signOut: "Sign out",
    openMenu: "Open menu",
    themeToggle: (isDark) => `Switch to ${isDark ? "Light" : "Dark"} mode`,
    themeModes: { light: "Light", dark: "Dark", system: "System" },
    titles: {
      "/workspace": "Overview",
      "/workspace/knowledge": "Knowledge & Experts",
      "/workspace/collaboration": "Research Collaboration",
      "/workspace/iam": "Identity & Access Management (IAM)",
      "/workspace/iam/admin": "Access Administration",
      "/workspace/iam/security": "Security & Sessions",
      "/admin/access": "Access Administration",
      "/admin/access/users": "User Management",
      "/admin/access/roles": "Roles & Permissions",
      "/admin/access/assignments": "Role Assignments",
      "/admin/audit": "Audit Logs",
      "/admin/catalogs": "Standardized Catalogs",
    },
    defaultTitle: "VN–RU S&T Network",
  },
  ru: {
    workspaceCrumb: "Рабочее пространство",
    searchPlaceholder: "Поиск экспертов, публикаций, тем…",
    contextActive: "Контекст активен",
    account: "Аккаунт",
    signOut: "Выйти",
    openMenu: "Открыть меню",
    themeToggle: (isDark) =>
      `Переключить на ${isDark ? "Светлую" : "Темную"} тему`,
    themeModes: { light: "Светлая", dark: "Темная", system: "Системная" },
    titles: {
      "/workspace": "Обзор",
      "/workspace/knowledge": "База знаний и эксперты",
      "/workspace/collaboration": "Научное сотрудничество",
      "/workspace/iam": "Управление доступом (IAM)",
      "/workspace/iam/admin": "Администрирование IAM",
      "/workspace/iam/security": "Сессии и безопасность",
      "/admin/access": "Администрирование IAM",
      "/admin/access/users": "Управление пользователями",
      "/admin/access/roles": "Роли и права",
      "/admin/access/assignments": "Назначение ролей",
      "/admin/audit": "Журнал аудита",
      "/admin/catalogs": "Стандартизированные каталоги",
    },
    defaultTitle: "Сеть НТИ РФ — СРВ",
  },
};

const themeModesList: { value: "light" | "dark" | "system"; key: "light" | "dark" | "system" }[] = [
  { value: "light", key: "light" },
  { value: "dark", key: "dark" },
  { value: "system", key: "system" },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLocale();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const currentUser = useCurrentUser();
  const logout = useLogout();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = headerCopy[locale] || headerCopy.vi;

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

  const label = currentUser.data
    ? [
        currentUser.data.displayName,
        currentUser.data.name,
        currentUser.data.username,
        currentUser.data.email,
      ].find(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0,
      )
    : undefined;
  const avatarInitial = label?.trim().charAt(0).toLocaleUpperCase(locale) || "A";

  const signOut = async () => {
    try {
      const payload = await logout.mutateAsync();
      router.push(payload.logoutUrl || "/");
    } catch {
      router.push("/");
    }
  };

  const currentTitle = t.titles[pathname] || t.defaultTitle;

  return (
    <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Mobile Menu Button */}
      <button
        type="button"
        aria-label={t.openMenu}
        onClick={onMenuClick}
        className="grid size-10 shrink-0 place-items-center rounded-xl text-text-primary transition hover:bg-[var(--surface-secondary)] xl:hidden"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>

      {/* Breadcrumb Path */}
      <div className="hidden items-center gap-2 text-xs text-text-secondary sm:flex">
        <Link
          href="/workspace"
          className="font-semibold text-text-secondary transition hover:text-[var(--accent-primary)]"
        >
          {t.workspaceCrumb}
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
          aria-label={t.searchPlaceholder}
          placeholder={t.searchPlaceholder}
          className="h-11 w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-secondary)] pl-10 pr-16 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition focus:border-[var(--accent-primary)] focus:bg-[var(--surface)] focus:ring-3 focus:ring-blue-500/10"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-[var(--surface)] px-2 py-0.5 text-xs font-semibold text-text-tertiary">
          ⌘K
        </kbd>
      </div>

      {/* Actions (Language Switcher, Theme Toggle, Context Active) */}
      <div className="flex items-center gap-2.5">
        {/* Language Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsLangOpen(!isLangOpen);
              setIsThemeOpen(false);
            }}
            className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-text-primary transition hover:bg-[var(--surface-secondary)]"
            aria-label={
              languages.find((language) => language.code === locale)?.label
            }
          >
            <span className="uppercase">{locale}</span>
          </button>

          {isLangOpen && (
            <div
              className="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface-raised)] p-1.5 shadow-[var(--shadow-soft)]"
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
                      ? "bg-[var(--surface-secondary)] text-[var(--accent-primary)] font-bold"
                      : "text-text-secondary hover:bg-[var(--surface-secondary)] hover:text-text-primary"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme mode control */}
        {mounted && (
          <div className="relative">
            <button
              type="button"
              aria-label={t.themeToggle(theme === "dark")}
              aria-expanded={isThemeOpen}
              onClick={() => {
                setIsThemeOpen(!isThemeOpen);
                setIsLangOpen(false);
              }}
              className="grid size-10 place-items-center rounded-xl text-text-secondary transition hover:bg-[var(--surface-secondary)] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
            >
              <span className="material-symbols-outlined text-xl">contrast</span>
            </button>
            {isThemeOpen && (
              <div
                className="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface-raised)] p-1.5 shadow-[var(--shadow-soft)]"
                onMouseLeave={() => setIsThemeOpen(false)}
              >
                {themeModesList.map(({ value: mode, key }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setTheme(mode);
                      setIsThemeOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      theme === mode
                        ? "bg-[var(--accent-primary)] text-white"
                        : "text-text-secondary hover:bg-[var(--surface-secondary)] hover:text-text-primary"
                    }`}
                  >
                    {t.themeModes[key]}
                    {theme === mode && <span className="material-symbols-outlined text-base">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <details className="group relative">
          <summary
            aria-label={t.account}
            className="grid size-10 cursor-pointer list-none place-items-center rounded-full bg-[var(--accent-primary)] text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
          >
            {avatarInitial}
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface-raised)] p-1.5 shadow-[var(--shadow-soft)]">
            <Link
              href="/workspace/iam/security"
              className="flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-text-primary hover:bg-card-surface-area"
            >
              {t.account}
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40"
            >
              {t.signOut}
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
