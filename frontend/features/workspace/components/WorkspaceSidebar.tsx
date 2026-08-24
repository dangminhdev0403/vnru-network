"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import SidebarFrame, { type NavSection } from "@/components/shared/SidebarFrame";
import { useCurrentUser } from "@/features/auth/server-state";
import { filterNavSections } from "@/features/workspace/config/workspace-registry";
import React from "react";

export interface WorkspaceSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const labels: Record<Locale, Record<string, string>> = {
  vi: {
    workspaceModules: "KHÔNG GIAN CỦA TÔI",
    workspaceHub: "Tổng quan",
    researcher: "Nhà nghiên cứu (Researcher)",
    reviewer: "Hội đồng Phản biện",
    organization: "Đại diện Tổ chức (VAST)",
    enterprise: "Doanh nghiệp (Liên danh 2+2)",
    leadership: "Lãnh đạo Chiến lược",
    administration: "QUẢN TRỊ HỆ THỐNG",
    governance: "Quản trị Danh tính (IAM)",
    adminOverview: "Tổng quan Quản trị",
    accessControl: "Phân quyền",
    audit: "Nhật ký kiểm toán",
    account: "TÀI KHOẢN & BẢO MẬT",
    accountProfile: "Tài khoản cá nhân",
    security: "Bảo mật & Phiên đăng nhập",
  },
  en: {
    workspaceModules: "MY WORKSPACE",
    workspaceHub: "Overview",
    researcher: "Researcher",
    reviewer: "Peer Reviewer",
    organization: "Organization Rep",
    enterprise: "Enterprise (2+2)",
    leadership: "Strategic Leadership",
    administration: "SYSTEM ADMINISTRATION",
    governance: "Identity Governance (IAM)",
    adminOverview: "Admin Overview",
    accessControl: "Access Control",
    audit: "Audit Log",
    account: "ACCOUNT & SECURITY",
    accountProfile: "Account Profile",
    security: "Security & Sessions",
  },
  ru: {
    workspaceModules: "МОЁ РАБОЧЕЕ ПРОСТРАНСТВО",
    workspaceHub: "Обзор",
    researcher: "Исследователь",
    reviewer: "Экспертный совет",
    organization: "Организация",
    enterprise: "Предприятие (2+2)",
    leadership: "Руководство",
    administration: "УПРАВЛЕНИЕ СИСТЕМОЙ",
    governance: "Управление доступом (IAM)",
    adminOverview: "Обзор",
    accessControl: "Управление доступом",
    audit: "Журнал аудита",
    account: "УЧЁТНАЯ ЗАПИСЬ И БЕЗОПАСНОСТЬ",
    accountProfile: "Учётная запись",
    security: "Безопасность и сессии",
  },
};

export default function WorkspaceSidebar({
  isSidebarOpen,
  toggleSidebar,
  isMobile,
  onItemClick,
}: WorkspaceSidebarProps) {
  const { locale } = useLocale();
  const t = labels[locale] || labels.vi;
  const currentUser = useCurrentUser();
  const user = currentUser.data as {
    capabilities?: string[];
    activeContext?: { contextType: string; contextId: string } | null;
  } | undefined;
  const capabilities = user?.capabilities ?? [];
  const contextLabel = user?.activeContext?.contextType === "PLATFORM"
    ? (locale === "vi" ? "Toàn hệ thống" : locale === "ru" ? "Вся система" : "Platform-wide")
    : user?.activeContext
      ? `${user.activeContext.contextType} / ${user.activeContext.contextId}`
      : undefined;

  const rawSections = filterNavSections(capabilities);
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
      contextLabel={contextLabel}
    />
  );
}
