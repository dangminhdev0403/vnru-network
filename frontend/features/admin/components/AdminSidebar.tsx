"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import SidebarFrame, { type NavSection } from "@/components/shared/SidebarFrame";
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
    dataGovernance: "QUẢN TRỊ DỮ LIỆU",
    auditControl: "KIỂM TOÁN & GIÁM SÁT",
    users: "Quản lý người dùng",
    roles: "Vai trò & quyền",
    assignments: "Phân công vai trò",
    catalogs: "Danh mục chuẩn hóa",
    audit: "Nhật ký kiểm toán",
  },
  en: {
    adminKicker: "System Administration",
    access: "ACCESS MANAGEMENT",
    dataGovernance: "DATA GOVERNANCE",
    auditControl: "AUDIT & COMPLIANCE",
    users: "User Management",
    roles: "Roles & Permissions",
    assignments: "Role Assignments",
    catalogs: "Standardized Catalogs",
    audit: "System Audit Logs",
  },
  ru: {
    adminKicker: "Администрирование системы",
    access: "УПРАВЛЕНИЕ ДОСТУПОМ",
    dataGovernance: "УПРАВЛЕНИЕ ДАННЫМИ",
    auditControl: "АУДИТ И КОНТРОЛЬ",
    users: "Управление пользователями",
    roles: "Роли и права",
    assignments: "Назначение ролей",
    catalogs: "Системные справочники",
    audit: "Журнал аудита",
  },
};

export default function AdminSidebar({
  isSidebarOpen,
  toggleSidebar,
  isMobile,
  onItemClick,
}: AdminSidebarProps) {
  const { locale } = useLocale();
  const t = labels[locale] || labels.vi;
  const currentUser = useCurrentUser();
  const capabilities = (currentUser.data as { capabilities?: string[] })?.capabilities ?? [];

  const rawSections = filterAdminNavSections(capabilities);
  const sections: NavSection[] = rawSections.map((s) => ({
    label: t[s.labelKey] || s.labelKey,
    items: s.items.map((item) => ({
      href: item.href,
      label: t[item.labelKey] || item.labelKey,
      icon: item.icon,
    })),
  }));

  return (
    <SidebarFrame
      sections={sections}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      isMobile={isMobile}
      onItemClick={onItemClick}
      badgeText={t.adminKicker}
    />
  );
}
