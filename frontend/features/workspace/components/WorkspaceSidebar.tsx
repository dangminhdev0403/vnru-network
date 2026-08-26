"use client";

import SidebarFrame, { type NavSection } from "@/components/shared/SidebarFrame";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { useCurrentUser } from "@/features/auth/server-state";
import { filterNavSections, resolveUserPersonas } from "@/features/workspace/config/workspace-registry";

export interface WorkspaceSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const labels: Record<Locale, Record<string, string>> = {
  vi: {
    networkWorkspace: "KHÔNG GIAN THÀNH VIÊN",
    overview: "Tổng quan",
    member: "Thành viên mạng lưới",
    administration: "QUẢN TRỊ HỆ THỐNG",
    governance: "Quản trị danh tính (IAM)",
    account: "TÀI KHOẢN & BẢO MẬT",
    accountProfile: "Tài khoản cá nhân",
    security: "Bảo mật & phiên đăng nhập",
  },
  en: {
    networkWorkspace: "MEMBER WORKSPACE",
    overview: "Overview",
    member: "Network member",
    administration: "SYSTEM ADMINISTRATION",
    governance: "Identity governance (IAM)",
    account: "ACCOUNT & SECURITY",
    accountProfile: "Account profile",
    security: "Security & sessions",
  },
  ru: {
    networkWorkspace: "ПРОСТРАНСТВО УЧАСТНИКА",
    overview: "Обзор",
    member: "Участник сети",
    administration: "УПРАВЛЕНИЕ СИСТЕМОЙ",
    governance: "Управление доступом (IAM)",
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
    fullName?: string;
    displayName?: string;
    name?: string;
    username?: string;
    email?: string;
    capabilities?: string[];
    activeContext?: { contextType: string; contextId: string } | null;
  } | undefined;
  const capabilities = user?.capabilities ?? [];
  const persona = resolveUserPersonas(capabilities)[0];
  const userName = [user?.fullName, user?.displayName, user?.name, user?.username, user?.email]
    .find((value): value is string => typeof value === "string" && value.trim().length > 0);
  const contextLabel = user?.activeContext?.contextType === "PLATFORM"
    ? (locale === "vi" ? "Toàn hệ thống" : locale === "ru" ? "Вся система" : "Platform-wide")
    : user?.activeContext
      ? `${user.activeContext.contextType} / ${user.activeContext.contextId}`
      : undefined;
  const sections: NavSection[] = filterNavSections(capabilities).map((section) => ({
    label: t[section.labelKey] || section.labelKey,
    items: section.items.map((item) => ({
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
      userName={userName}
      userMeta={persona?.key === "WORKSPACE_MEMBER" ? t.member : contextLabel}
    />
  );
}
