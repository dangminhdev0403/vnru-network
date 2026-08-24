"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import SidebarFrame, { type NavSection } from "@/components/shared/SidebarFrame";
import { useCurrentUser } from "@/features/auth/server-state";
import { filterNavSections, resolveUserPersonas } from "@/features/workspace/config/workspace-registry";
import React from "react";

export interface WorkspaceSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

const labels: Record<Locale, Record<string, string>> = {
  vi: {
    networkWorkspace: "KHÔNG GIAN MẠNG LƯỚI",
    research: "NGHIÊN CỨU & TRI THỨC",
    review: "PHẢN BIỆN",
    organizationSection: "TỔ CHỨC",
    coordination: "ĐIỀU PHỐI",
    decisionSection: "QUYẾT ĐỊNH",
    member: "Thành viên mạng lưới",
    roleWorkspace: "KHÔNG GIAN VAI TRÒ",
    overview: "Tổng quan",
    myKnowledge: "Tri thức của tôi",
    researchCollaboration: "Cộng tác nghiên cứu",
    myProjects: "Dự án của tôi",
    academicExchange: "Học thuật & Trao đổi",
    reviewOverview: "Tổng quan phản biện",
    assignedDossiers: "Hồ sơ được phân công",
    evaluationWorkspace: "Phiếu đánh giá",
    reviewHistory: "Lịch sử phản biện",
    organizationOverview: "Tổng quan tổ chức",
    endorsementQueue: "Đề xuất cần xác nhận",
    relatedProjects: "Dự án liên quan",
    organizationActivity: "Hoạt động tổ chức",
    managerOverview: "Tổng quan điều phối",
    opportunityManagement: "Cơ hội nghiên cứu",
    proposalScreening: "Sàng lọc đề xuất",
    reviewAssignments: "Phân công phản biện",
    programProjects: "Dự án chương trình",
    reportApprovals: "Báo cáo chờ xử lý",
    decisionOverview: "Tổng quan quyết định",
    decisionQueue: "Hồ sơ chờ quyết định",
    decisionHistory: "Đã quyết định",
    decisionProjects: "Dự án liên quan",
    workspaceHub: "Tổng quan",
    researcher: "Nhà nghiên cứu",
    reviewer: "Hội đồng Phản biện",
    organization: "Đại diện Tổ chức",
    manager: "Điều phối hợp tác",
    decision: "Cơ quan quyết định",
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
    networkWorkspace: "NETWORK WORKSPACE",
    research: "RESEARCH & KNOWLEDGE",
    review: "PEER REVIEW",
    organizationSection: "ORGANIZATION",
    coordination: "COORDINATION",
    decisionSection: "DECISIONS",
    member: "Network member",
    roleWorkspace: "ROLE WORKSPACE",
    overview: "Overview",
    myKnowledge: "My knowledge",
    researchCollaboration: "Research collaboration",
    myProjects: "My projects",
    academicExchange: "Academic exchange",
    reviewOverview: "Review overview",
    assignedDossiers: "Assigned dossiers",
    evaluationWorkspace: "Evaluation form",
    reviewHistory: "Review history",
    organizationOverview: "Organization overview",
    endorsementQueue: "Endorsement queue",
    relatedProjects: "Related projects",
    organizationActivity: "Organization activity",
    managerOverview: "Coordination overview",
    opportunityManagement: "Research opportunities",
    proposalScreening: "Proposal screening",
    reviewAssignments: "Reviewer assignments",
    programProjects: "Programme projects",
    reportApprovals: "Reports to process",
    decisionOverview: "Decision overview",
    decisionQueue: "Pending decisions",
    decisionHistory: "Decision history",
    decisionProjects: "Related projects",
    workspaceHub: "Overview",
    researcher: "Researcher",
    reviewer: "Peer Reviewer",
    organization: "Organization Representative",
    manager: "Collaboration Coordinator",
    decision: "Decision Authority",
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
    networkWorkspace: "СЕТЕВОЕ ПРОСТРАНСТВО",
    research: "ИССЛЕДОВАНИЯ И ЗНАНИЯ",
    review: "ЭКСПЕРТИЗА",
    organizationSection: "ОРГАНИЗАЦИЯ",
    coordination: "КООРДИНАЦИЯ",
    decisionSection: "РЕШЕНИЯ",
    member: "Участник сети",
    roleWorkspace: "РАБОЧЕЕ ПРОСТРАНСТВО РОЛИ",
    overview: "Обзор",
    myKnowledge: "Мои знания",
    researchCollaboration: "Научное сотрудничество",
    myProjects: "Мои проекты",
    academicExchange: "Академический обмен",
    reviewOverview: "Обзор экспертизы",
    assignedDossiers: "Назначенные заявки",
    evaluationWorkspace: "Форма оценки",
    reviewHistory: "История экспертизы",
    organizationOverview: "Обзор организации",
    endorsementQueue: "Заявки на подтверждение",
    relatedProjects: "Связанные проекты",
    organizationActivity: "Активность организации",
    managerOverview: "Обзор координации",
    opportunityManagement: "Исследовательские возможности",
    proposalScreening: "Предварительная проверка",
    reviewAssignments: "Назначение экспертов",
    programProjects: "Проекты программы",
    reportApprovals: "Отчёты на рассмотрении",
    decisionOverview: "Обзор решений",
    decisionQueue: "Ожидают решения",
    decisionHistory: "Принятые решения",
    decisionProjects: "Связанные проекты",
    workspaceHub: "Обзор",
    researcher: "Исследователь",
    reviewer: "Экспертный совет",
    organization: "Представитель организации",
    manager: "Координатор сотрудничества",
    decision: "Орган принятия решений",
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
  const personaLabelKey = persona?.key === "WORKSPACE_MEMBER" ? "member" : undefined;
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
      userName={userName}
      userMeta={personaLabelKey ? t[personaLabelKey] : contextLabel}
    />
  );
}
