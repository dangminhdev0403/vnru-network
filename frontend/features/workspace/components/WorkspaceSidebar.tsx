"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
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
    overview: "TỔNG QUAN",
    governance: "BẢO MẬT & QUẢN TRỊ",
    workspaceOverview: "Không gian làm việc",
    knowledge: "Kho tri thức & Chuyên gia",
    collaboration: "Cộng tác nghiên cứu",
    iam: "Quản trị danh tính",
    sessions: "Phiên làm việc & Bảo mật",
  },
  en: {
    overview: "OVERVIEW",
    governance: "SECURITY & GOVERNANCE",
    workspaceOverview: "Overview",
    knowledge: "Knowledge & Experts",
    collaboration: "Research Collaboration",
    iam: "Identity & Access",
    sessions: "Security & Sessions",
  },
  ru: {
    overview: "ОБЗОР",
    governance: "БЕЗОПАСНОСТЬ И УПРАВЛЕНИЕ",
    workspaceOverview: "Обзор",
    knowledge: "База знаний и эксперты",
    collaboration: "Научное сотрудничество",
    iam: "Управление доступом",
    sessions: "Сессии и безопасность",
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
  const capabilities = (currentUser.data as { capabilities?: string[] })?.capabilities ?? [];

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
    />
  );
}
