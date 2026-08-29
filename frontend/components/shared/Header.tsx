"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser, useLogout } from "@/features/auth/server-state";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { formatRoleName } from "@/features/admin/access/config/role-display";

interface HeaderProps {
  readonly onMenuClick?: () => void;
}

const headerCopy: Record<
  Locale,
  {
    workspaceCrumb: string;
    adminCrumb: string;
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
    adminCrumb: "Quản trị hệ thống",
    contextActive: "Ngữ cảnh hoạt động",
    account: "Tài khoản",
    signOut: "Đăng xuất",
    openMenu: "Mở menu",
    titles: {
      "/workspace": "Tổng quan",
      "/workspace/publish": "Gửi bài đăng",
      "/account": "Hồ sơ cá nhân",
      "/security": "Tài khoản",
      "/admin/access": "Tổng quan phân quyền",
      "/admin/access/users": "Quản lý người dùng",
      "/admin/access/roles": "Vai trò & quyền",
      "/admin/access/permissions": "Danh mục quyền",
      "/admin/access/logs": "Nhật ký truy cập",
    },
    defaultTitle: "Mạng lưới tri thức Nga - Việt",
  },
  en: {
    workspaceCrumb: "Workspace",
    adminCrumb: "System Administration",
    contextActive: "Context active",
    account: "Account",
    signOut: "Sign out",
    openMenu: "Open menu",
    titles: {
      "/workspace": "Overview",
      "/workspace/publish": "Publish Article",
      "/account": "Account Profile",
      "/security": "Account",
      "/admin/access": "Access Governance",
      "/admin/access/users": "User Management",
      "/admin/access/roles": "Roles & Permissions",
      "/admin/access/permissions": "Permission Catalog",
      "/admin/access/logs": "Access Logs",
    },
    defaultTitle: "Russia - Vietnam Knowledge Network",
  },
  ru: {
    workspaceCrumb: "Рабочее пространство",
    adminCrumb: "Администрирование системы",
    contextActive: "Контекст активен",
    account: "Аккаунт",
    signOut: "Выйти",
    openMenu: "Открыть меню",
    titles: {
      "/workspace": "Обзор",
      "/workspace/publish": "Публикация",
      "/account": "Учётная запись",
      "/security": "Учётная запись",
      "/admin/access": "Обзор доступа",
      "/admin/access/users": "Управление пользователями",
      "/admin/access/roles": "Роли и права",
      "/admin/access/permissions": "Каталог прав",
      "/admin/access/logs": "Журнал доступа",
    },
    defaultTitle: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
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
  const avatarInitial =
    label?.trim().charAt(0).toLocaleUpperCase(locale) || "A";
  const capabilities = currentUser.data?.capabilities ?? [];
  const roleName =
    currentUser.data?.roles?.[0] ??
    (capabilities.includes("iam.roles.manage") ||
    capabilities.includes("iam.users.manage")
      ? "SYSTEM_ADMIN"
      : capabilities.includes("portal.member.access")
        ? "PORTAL_MEMBER"
        : undefined);

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
    <header className="sticky top-0 z-30 flex h-[68px] min-w-0 items-center gap-2 border-b border-[var(--border)] bg-[var(--surface)]/95 px-3 backdrop-blur-md sm:gap-3 sm:px-4 md:px-6 lg:px-8">
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
      <div className="hidden min-w-0 items-center gap-2 text-xs text-text-secondary sm:flex">
        <Link
          href={pathname.startsWith("/admin") ? "/admin/access" : "/workspace"}
          className="font-semibold text-text-secondary transition hover:text-[var(--accent-primary)]"
        >
          {pathname.startsWith("/admin") ? t.adminCrumb : t.workspaceCrumb}
        </Link>
        <span>/</span>
        <strong className="truncate font-bold text-text-primary">
          {currentTitle}
        </strong>
      </div>

      {/* Actions (Language Switcher, Theme Toggle, Context Active) */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
        {/* Language Switcher */}
        <LanguageSwitcher variant="workspace" compact />

        {/* User Profile Details Menu */}
        <details className="group relative">
          <summary
            aria-label={t.account}
            className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl px-1.5 outline-none transition hover:bg-[var(--surface-secondary)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--accent-primary)] text-sm font-bold text-white">
              {avatarInitial}
            </span>
            <span className="hidden min-w-0 max-w-36 text-left lg:block">
              <strong className="block truncate text-sm leading-tight text-text-primary">
                {label || currentUser.data?.email || t.account}
              </strong>
              {roleName ? (
                <span className="mt-0.5 block truncate text-[11px] font-semibold leading-tight text-text-secondary">
                  {formatRoleName(roleName, locale)}
                </span>
              ) : null}
            </span>
            <span className="material-symbols-outlined hidden text-base text-text-secondary lg:block">
              expand_more
            </span>
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface-raised)] p-1.5 shadow-[var(--shadow-soft)]">
            {label && (
              <div className="border-b border-[var(--border)] px-3 py-2.5">
                <strong className="block truncate text-sm text-text-primary">
                  {label}
                </strong>
                {roleName ? (
                  <span className="mt-0.5 block truncate text-xs font-semibold text-[var(--accent-primary)]">
                    {formatRoleName(roleName, locale)}
                  </span>
                ) : null}
                {currentUser.data?.email &&
                  currentUser.data.email !== label && (
                    <span className="mt-0.5 block truncate text-xs text-text-secondary">
                      {currentUser.data.email}
                    </span>
                  )}
              </div>
            )}
            <Link
              href="/security"
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
