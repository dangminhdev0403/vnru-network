"use client";

import SidebarFrame from "@/components/shared/SidebarFrame";
import { useLocale } from "@/core/i18n/locale";
import { useCurrentUser } from "@/features/auth/server-state";

const labels = {
  vi: { badge: "Quản trị nội dung", section: "NỘI DUNG CỔNG", overview: "Tổng quan", articles: "Danh sách bài viết", featured: "Tin nổi bật", announcements: "Công bố", events: "Sự kiện", projects: "Dự án", opportunities: "Cơ hội", create: "Viết bài mới", account: "TÀI KHOẢN", security: "Tài khoản" },
  en: { badge: "Content administration", section: "PORTAL CONTENT", overview: "Overview", articles: "Articles", featured: "Featured news", announcements: "Announcements", events: "Events", projects: "Projects", opportunities: "Opportunities", create: "New article", account: "ACCOUNT", security: "Account" },
  ru: { badge: "Управление контентом", section: "КОНТЕНТ ПОРТАЛА", overview: "Обзор", articles: "Статьи", featured: "Избранные новости", announcements: "Объявления", events: "События", projects: "Проекты", opportunities: "Возможности", create: "Новая статья", account: "УЧЁТНАЯ ЗАПИСЬ", security: "Аккаунт" },
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
        { label: t.section, items: [
          { href: "/workspace/news", label: t.overview, icon: "space_dashboard" },
          { href: "/workspace/news?view=all", label: t.articles, icon: "newspaper" },
          { href: "/workspace/news?view=featured", label: t.featured, icon: "star" },
          { href: "/workspace/news?view=ANNOUNCEMENT", label: t.announcements, icon: "campaign" },
          { href: "/workspace/news?view=EVENT", label: t.events, icon: "event" },
          { href: "/workspace/news?view=PROJECT", label: t.projects, icon: "workspaces" },
          { href: "/workspace/news?view=OPPORTUNITY", label: t.opportunities, icon: "lightbulb" },
          { href: "/workspace/news?view=new", label: t.create, icon: "add_circle" },
        ] },
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
