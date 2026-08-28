"use client";

import SidebarFrame from "@/components/shared/SidebarFrame";
import { useLocale } from "@/core/i18n/locale";
import { useCurrentUser } from "@/features/auth/server-state";

const labels = {
  vi: { badge: "Quản trị nội dung", section: "NỘI DUNG CỔNG", news: "Quản lý tin tức", account: "TÀI KHOẢN", security: "Tài khoản" },
  en: { badge: "Content administration", section: "PORTAL CONTENT", news: "Manage news", account: "ACCOUNT", security: "Account" },
  ru: { badge: "Управление контентом", section: "КОНТЕНТ ПОРТАЛА", news: "Управление новостями", account: "УЧЁТНАЯ ЗАПИСЬ", security: "Аккаунт" },
} as const;

export default function ContentAdminSidebar({
  isSidebarOpen,
  toggleSidebar,
  isMobile = false,
  onItemClick,
}: {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}) {
  const { locale } = useLocale();
  const t = labels[locale] ?? labels.vi;
  const currentUser = useCurrentUser();
  const context = currentUser.data?.activeContext;

  return (
    <SidebarFrame
      sections={[
        { label: t.section, items: [{ href: "/workspace/news", label: t.news, icon: "newspaper" }] },
        { label: t.account, items: [{ href: "/security", label: t.security, icon: "person" }] },
      ]}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      isMobile={isMobile}
      onItemClick={onItemClick}
      badgeText={t.badge}
      contextLabel={context ? `${context.contextType} / ${context.contextId}` : undefined}
    />
  );
}
