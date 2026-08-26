"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser, useLogout } from "@/features/auth/server-state";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

interface HeaderProps {
  readonly onMenuClick?: () => void;
}

const headerCopy: Record<
  Locale,
  {
    workspaceCrumb: string;
    contextActive: string;
    account: string;
    signOut: string;
    openMenu: string;
    titles: Record<string, string>;
    defaultTitle: string;
  }
> = {
  vi: {
    workspaceCrumb: "Không gian làm việc",
    contextActive: "Ngữ cảnh hoạt động",
    account: "Tài khoản",
    signOut: "Đăng xuất",
    openMenu: "Mở menu",
    titles: {
      "/workspace": "Tổng quan",
      "/account": "Tài khoản",
      "/security": "Bảo mật & Phiên đăng nhập",
      "/admin/access": "Quản trị phân quyền",
      "/admin/access/users": "Quản lý người dùng",
      "/admin/access/roles": "Vai trò & quyền",
      "/admin/access/assignments": "Phân công vai trò",
      "/admin/audit": "Nhật ký kiểm toán",
    },
    defaultTitle: "Mạng lưới KH & CN Việt – Nga",
  },
  en: {
    workspaceCrumb: "Workspace",
    contextActive: "Context active",
    account: "Account",
    signOut: "Sign out",
    openMenu: "Open menu",
    titles: {
      "/workspace": "Overview",
      "/account": "Account",
      "/security": "Security & Sessions",
      "/admin/access": "Access Administration",
      "/admin/access/users": "User Management",
      "/admin/access/roles": "Roles & Permissions",
      "/admin/access/assignments": "Role Assignments",
      "/admin/audit": "Audit Logs",
    },
    defaultTitle: "VN–RU S & T Network",
  },
  ru: {
    workspaceCrumb: "Рабочее пространство",
    contextActive: "Контекст активен",
    account: "Аккаунт",
    signOut: "Выйти",
    openMenu: "Открыть меню",
    titles: {
      "/workspace": "Обзор",
      "/account": "Учётная запись",
      "/security": "Безопасность и сессии",
      "/admin/access": "Администрирование IAM",
      "/admin/access/users": "Управление пользователями",
      "/admin/access/roles": "Роли и права",
      "/admin/access/assignments": "Назначение ролей",
      "/admin/audit": "Журнал аудита",
    },
    defaultTitle: "Сеть НТИ РФ — СРВ",
  },
};

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const currentUser = useCurrentUser();
  const logout = useLogout();
  const t = headerCopy[locale] || headerCopy.vi;

  const label = currentUser.data
    ? [
        currentUser.data.fullName,
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

      {/* Actions (Language Switcher, Theme Toggle, Context Active) */}
      <div className="ml-auto flex items-center gap-2.5">
        {/* Language Switcher */}
        <LanguageSwitcher variant="workspace" />

        {/* User Profile Details Menu */}
        <details className="group relative">
          <summary
            aria-label={t.account}
            className="grid size-10 cursor-pointer list-none place-items-center rounded-full bg-[var(--accent-primary)] text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
          >
            {avatarInitial}
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface-raised)] p-1.5 shadow-[var(--shadow-soft)]">
            {label && (
              <div className="border-b border-[var(--border)] px-3 py-2.5">
                <strong className="block truncate text-sm text-text-primary">{label}</strong>
                {currentUser.data?.email && currentUser.data.email !== label && (
                  <span className="mt-0.5 block truncate text-xs text-text-secondary">{currentUser.data.email}</span>
                )}
              </div>
            )}
            <Link
              href="/account"
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
