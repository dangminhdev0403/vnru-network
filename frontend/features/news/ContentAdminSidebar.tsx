"use client";

import SidebarFrame from "@/components/shared/SidebarFrame";
import { useLocale } from "@/core/i18n/locale";
import { useCurrentUser } from "@/features/auth/server-state";
import { useSearchParams } from "next/navigation";

const labels = {
  vi: {
    badge: "Quản trị nội dung",
    section: "NỘI DUNG CỔNG",
    overview: "Tổng quan",
    articles: "Quản lý tin tức",
    announcements: "Công bố",
    events: "Sự kiện",
    projects: "Dự án",
    opportunities: "Cơ hội",
    create: "Viết bài mới",
    account: "TÀI KHOẢN",
    security: "Tài khoản",
  },
  en: {
    badge: "Content administration",
    section: "PORTAL CONTENT",
    overview: "Overview",
    articles: "Manage news",
    announcements: "Announcements",
    events: "Events",
    projects: "Projects",
    opportunities: "Opportunities",
    create: "New article",
    account: "ACCOUNT",
    security: "Account",
  },
  ru: {
    badge: "Управление контентом",
    section: "КОНТЕНТ ПОРТАЛА",
    overview: "Обзор",
    articles: "Управление новостями",
    announcements: "Объявления",
    events: "События",
    projects: "Проекты",
    opportunities: "Возможности",
    create: "Новая статья",
    account: "УЧЁТНАЯ ЗАПИСЬ",
    security: "Аккаунт",
  },
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
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const activeView =
    view === "new"
      ? (searchParams.get("type") ?? "ARTICLE")
      : view === "all"
        ? "ARTICLE"
        : view;

  return (
    <SidebarFrame
      activeHref={
        activeView
          ? `/workspace/news?view=${activeView}`
          : "/workspace/news"
      }
      sections={[
        {
          label: t.section,
          items: [
            {
              href: "/workspace/news",
              label: t.overview,
              icon: "space_dashboard",
            },
            {
              href: "/workspace/news?view=ARTICLE",
              label: t.articles,
              icon: "newspaper",
            },
            {
              href: "/workspace/news?view=ANNOUNCEMENT",
              label: t.announcements,
              icon: "campaign",
            },
            {
              href: "/workspace/news?view=EVENT",
              label: t.events,
              icon: "event",
            },
            {
              href: "/workspace/news?view=PROJECT",
              label: t.projects,
              icon: "workspaces",
            },
            {
              href: "/workspace/news?view=OPPORTUNITY",
              label: t.opportunities,
              icon: "lightbulb",
            },
          ],
        },
        {
          label: t.account,
          items: [{ href: "/security", label: t.security, icon: "person" }],
        },
      ]}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      isMobile={isMobile}
      onItemClick={onItemClick}
      badgeText={t.badge}
      contextLabel={
        context ? `${context.contextType} / ${context.contextId}` : undefined
      }
    />
  );
}
