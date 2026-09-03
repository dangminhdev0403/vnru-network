"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import SidebarFrame, {
  type NavSection,
} from "@/components/shared/SidebarFrame";
import { useCurrentUser } from "@/features/auth/server-state";
import { filterAdminNavSections } from "@/features/admin/config/admin-nav-registry";
import React from "react";

export interface AdminSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const labels: Record<Locale, Record<string, string>> = {
  vi: {
    adminKicker: "Quản trị hệ thống",
    access: "QUẢN TRỊ TRUY CẬP",
    overview: "Tổng quan",
    users: "Quản lý người dùng",
    roles: "Vai trò & quyền",
    permissions: "Danh mục quyền",
    logs: "Nhật ký truy cập",
    accountSection: "TÀI KHOẢN",
    account: "Tài khoản",
  },
  en: {
    adminKicker: "System Administration",
    access: "ACCESS MANAGEMENT",
    overview: "Overview",
    users: "User Management",
    roles: "Roles & Permissions",
    permissions: "Permission Catalog",
    logs: "Access Logs",
    accountSection: "ACCOUNT",
    account: "Account",
  },
  ru: {
    adminKicker: "Администрирование системы",
    access: "УПРАВЛЕНИЕ ДОСТУПОМ",
    overview: "Обзор",
    users: "Управление пользователями",
    roles: "Роли и права",
    permissions: "Каталог прав",
    logs: "Журнал доступа",
    accountSection: "УЧЁТНАЯ ЗАПИСЬ",
    account: "Учётная запись",
  },
};

export default function AdminSidebar({
  isSidebarOpen,
  toggleSidebar,
  isMobile = false,
  onItemClick,
}: AdminSidebarProps) {
  const { locale } = useLocale();
  const t = labels[locale] || labels.vi;
  const currentUser = useCurrentUser();
  const user = currentUser.data as
    | {
        capabilities?: string[];
        activeContext?: { contextType: string; contextId: string } | null;
      }
    | undefined;
  const capabilities = user?.capabilities ?? [];
  const contextLabel =
    user?.activeContext?.contextType === "PLATFORM"
      ? locale === "vi"
        ? "Toàn hệ thống"
        : locale === "ru"
          ? "Вся система"
          : "Platform-wide"
      : user?.activeContext
        ? `${user.activeContext.contextType} / ${user.activeContext.contextId}`
        : undefined;

  const rawSections = filterAdminNavSections(capabilities);
  const sections: NavSection[] = rawSections.map((s) => ({
    label: t[s.labelKey] || s.labelKey,
    items: s.items.map((item) => ({
      href: item.href,
      label: t[item.labelKey] || item.labelKey,
      icon: item.icon,
    })),
  }));

  sections.push({
    label: t.accountSection,
    items: [{ href: "/security", label: t.account, icon: "person" }],
  });

  return (
    <SidebarFrame
      sections={sections}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      isMobile={isMobile}
      onItemClick={onItemClick}
      badgeText={t.adminKicker}
      contextLabel={contextLabel}
    />
  );
}
