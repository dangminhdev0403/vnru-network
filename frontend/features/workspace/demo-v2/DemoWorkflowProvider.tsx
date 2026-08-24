"use client";

import React from "react";
import {
  DEMO_ACTIVITIES,
  DEMO_DECISIONS,
  DEMO_ENDORSEMENTS,
  DEMO_NOTIFICATIONS,
  DEMO_OPPORTUNITIES,
  DEMO_PROJECTS,
  DEMO_PROPOSALS,
  DEMO_REPORTS,
  DEMO_REVIEWS,
} from "./mock-data";
import type {
  ActivityItem,
  Decision,
  DecisionState,
  Opportunity,
  OrganizationEndorsement,
  Project,
  Proposal,
  ProposalState,
  ReportItem,
  ReviewAssignment,
  WorkflowNotification,
  WorkflowRole,
} from "./types";

type DemoWorkflowContextValue = {
  proposals: Proposal[];
  reviews: ReviewAssignment[];
  decisions: Decision[];
  projects: Project[];
  opportunities: Opportunity[];
  reports: ReportItem[];
  endorsements: OrganizationEndorsement[];
  notifications: WorkflowNotification[];
  activities: ActivityItem[];
  updateProposalState: (proposalId: string, state: ProposalState, actor: string, detail: string) => void;
  submitProposal: (proposalId: string) => void;
  screenProposal: (proposalId: string, outcome: "NEEDS_INFO" | "ELIGIBLE" | "NOT_ELIGIBLE", note: string) => void;
  assignReviewer: (reviewId: string, reviewer: string) => void;
  startReview: (reviewId: string) => void;
  saveReviewDraft: (reviewId: string, score: number, comment: string) => void;
  submitReview: (reviewId: string, score: number, comment: string) => void;
  issueDecision: (decisionId: string, state: DecisionState, rationale: string) => void;
  updateEndorsement: (endorsementId: string, state: OrganizationEndorsement["state"], note?: string) => void;
  createOpportunity: (input: Pick<Opportunity, "title" | "field" | "closes">) => void;
  publishOpportunity: (opportunityId: string) => void;
  updateReport: (reportId: string, state: ReportItem["state"]) => void;
  completeMilestone: (projectId: string, milestoneId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markRoleNotificationsRead: (role: WorkflowRole) => void;
  addNotification: (notification: Omit<WorkflowNotification, "id" | "createdAt" | "read">) => void;
};

const DemoWorkflowContext = React.createContext<DemoWorkflowContextValue | null>(null);

const nowLabel = () => "vừa xong";
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function DemoWorkflowProvider({ children }: { children: React.ReactNode }) {
  const [proposals, setProposals] = React.useState(DEMO_PROPOSALS);
  const [reviews, setReviews] = React.useState(DEMO_REVIEWS);
  const [decisions, setDecisions] = React.useState(DEMO_DECISIONS);
  const [projects, setProjects] = React.useState(DEMO_PROJECTS);
  const [opportunities, setOpportunities] = React.useState(DEMO_OPPORTUNITIES);
  const [reports, setReports] = React.useState(DEMO_REPORTS);
  const [endorsements, setEndorsements] = React.useState(DEMO_ENDORSEMENTS);
  const [notifications, setNotifications] = React.useState(DEMO_NOTIFICATIONS);
  const [activities, setActivities] = React.useState(DEMO_ACTIVITIES);

  const pushActivity = React.useCallback((item: Omit<ActivityItem, "id" | "createdAt">) => {
    setActivities((current) => [{ ...item, id: makeId("act"), createdAt: nowLabel() }, ...current]);
  }, []);

  const addNotification = React.useCallback((item: Omit<WorkflowNotification, "id" | "createdAt" | "read">) => {
    setNotifications((current) => [{ ...item, id: makeId("noti"), createdAt: nowLabel(), read: false }, ...current]);
  }, []);

  const updateProposalState = React.useCallback((proposalId: string, state: ProposalState, actor: string, detail: string) => {
    setProposals((current) => current.map((item) => item.id === proposalId ? { ...item, state, updatedAt: nowLabel() } : item));
    pushActivity({ entityId: proposalId, entityType: "proposal", actor, action: `Chuyển trạng thái → ${state}`, detail });
  }, [pushActivity]);

  const submitProposal = React.useCallback((proposalId: string) => {
    const proposal = proposals.find((item) => item.id === proposalId);
    if (!proposal) return;
    updateProposalState(proposalId, "SUBMITTED", "Nhà nghiên cứu", "Đề xuất đã gửi sang hàng đợi sàng lọc.");
    addNotification({
      role: "COLLABORATION_MANAGER",
      title: "Có đề xuất mới cần sàng lọc",
      message: `${proposal.code} vừa được Nhà nghiên cứu gửi.`,
      href: `/workspace/collaboration?view=screening&id=${proposal.id}`,
      tone: "info",
    });
  }, [addNotification, proposals, updateProposalState]);

  const screenProposal = React.useCallback((proposalId: string, outcome: "NEEDS_INFO" | "ELIGIBLE" | "NOT_ELIGIBLE", note: string) => {
    const proposal = proposals.find((item) => item.id === proposalId);
    if (!proposal) return;
    updateProposalState(proposalId, outcome, "Điều phối hợp tác", note || "Đã cập nhật kết quả sàng lọc.");
    if (outcome === "NEEDS_INFO") {
      addNotification({ role: "RESEARCHER", title: "Đề xuất cần bổ sung", message: `${proposal.code}: ${note || "Cần bổ sung thông tin trước khi sàng lọc lại."}`, href: `/workspace/researcher?view=collaboration&id=${proposal.id}`, tone: "warning" });
    }
    if (outcome === "ELIGIBLE") {
      const existing = reviews.find((review) => review.proposalId === proposalId);
      if (!existing) {
        setReviews((current) => [{ id: makeId("rv"), proposalId, code: proposal.code, title: proposal.title, field: proposal.field, reviewer: null, deadline: proposal.deadline, state: "UNASSIGNED" }, ...current]);
      }
      addNotification({ role: "COLLABORATION_MANAGER", title: "Hồ sơ sẵn sàng phân phản biện", message: `${proposal.code} đã đủ điều kiện.`, href: "/workspace/collaboration?view=assignments", tone: "success" });
    }
    if (outcome === "NOT_ELIGIBLE") {
      addNotification({ role: "RESEARCHER", title: "Đề xuất không qua sàng lọc", message: `${proposal.code}: ${note || "Không đáp ứng điều kiện ở vòng sàng lọc."}`, href: `/workspace/researcher?view=collaboration&id=${proposal.id}`, tone: "danger" });
    }
  }, [addNotification, proposals, reviews, updateProposalState]);

  const assignReviewer = React.useCallback((reviewId: string, reviewer: string) => {
    const review = reviews.find((item) => item.id === reviewId);
    if (!review) return;
    setReviews((current) => current.map((item) => item.id === reviewId ? { ...item, reviewer, state: "ASSIGNED", conflict: false } : item));
    setProposals((current) => current.map((item) => item.id === review.proposalId ? { ...item, state: "IN_REVIEW", updatedAt: nowLabel() } : item));
    pushActivity({ entityId: reviewId, entityType: "review", actor: "Điều phối hợp tác", action: "Phân công phản biện", detail: `${reviewer} nhận hồ sơ ${review.code}.` });
    addNotification({ role: "REVIEWER", title: "Bạn có phân công phản biện mới", message: `${review.code} · hạn ${review.deadline}`, href: `/workspace/reviewer?view=assignments&id=${review.id}`, tone: "info" });
  }, [addNotification, pushActivity, reviews]);

  const startReview = React.useCallback((reviewId: string) => {
    const review = reviews.find((item) => item.id === reviewId);
    if (!review || review.state === "CANCELLED" || review.conflict) return;
    setReviews((current) => current.map((item) => item.id === reviewId ? { ...item, state: "IN_REVIEW" } : item));
    pushActivity({ entityId: reviewId, entityType: "review", actor: "Reviewer", action: "Bắt đầu phản biện", detail: `Đã mở workbench cho ${review.code}.` });
  }, [pushActivity, reviews]);

  const saveReviewDraft = React.useCallback((reviewId: string, score: number, comment: string) => {
    const review = reviews.find((item) => item.id === reviewId);
    if (!review) return;
    setReviews((current) => current.map((item) => item.id === reviewId ? { ...item, state: "IN_REVIEW", score, comment, savedAt: nowLabel() } : item));
    pushActivity({ entityId: reviewId, entityType: "review", actor: "Reviewer", action: "Lưu bản nháp", detail: `${score.toFixed(2)}/10 · ${comment.slice(0, 70)}` });
  }, [pushActivity, reviews]);

  const submitReview = React.useCallback((reviewId: string, score: number, comment: string) => {
    const review = reviews.find((item) => item.id === reviewId);
    if (!review) return;
    setReviews((current) => current.map((item) => item.id === reviewId ? { ...item, state: "SUBMITTED", score, comment, savedAt: nowLabel() } : item));
    pushActivity({ entityId: reviewId, entityType: "review", actor: "Reviewer", action: "Nộp phản biện", detail: `${score.toFixed(2)}/10 · chuyển sang Cơ quan quyết định.` });
    setDecisions((current) => {
      if (current.some((item) => item.proposalId === review.proposalId)) return current.map((item) => item.proposalId === review.proposalId ? { ...item, state: "PENDING", score } : item);
      const proposal = proposals.find((item) => item.id === review.proposalId);
      if (!proposal) return current;
      return [{ id: makeId("dc"), proposalId: proposal.id, code: proposal.code, title: proposal.title, organizations: `${proposal.vnOrg} ↔ ${proposal.ruOrg}`, score, state: "PENDING" }, ...current];
    });
    addNotification({ role: "FOUNDATION_DECISION_MAKER", title: "Hồ sơ đã hoàn tất phản biện", message: `${review.code} sẵn sàng cho bước quyết định.`, href: "/workspace/decisions?view=queue", tone: "info" });
  }, [addNotification, proposals, pushActivity, reviews]);

  const issueDecision = React.useCallback((decisionId: string, state: DecisionState, rationale: string) => {
    const decision = decisions.find((item) => item.id === decisionId);
    if (!decision) return;
    setDecisions((current) => current.map((item) => item.id === decisionId ? { ...item, state, rationale, decidedAt: nowLabel() } : item));
    setProposals((current) => current.map((item) => item.id === decision.proposalId ? { ...item, state: state === "APPROVED" ? "APPROVED" : state === "REVISION" ? "REVISION" : "REJECTED", updatedAt: nowLabel() } : item));
    pushActivity({ entityId: decisionId, entityType: "decision", actor: "Cơ quan quyết định", action: state === "APPROVED" ? "Chấp thuận" : state === "REVISION" ? "Yêu cầu hoàn thiện" : "Không chấp thuận", detail: rationale });
    const targetTone = state === "APPROVED" ? "success" : state === "REVISION" ? "warning" : "danger";
    addNotification({ role: "RESEARCHER", title: `Quyết định: ${state}`, message: `${decision.code}: ${rationale}`, href: `/workspace/researcher?view=collaboration&id=${decision.proposalId}`, tone: targetTone });
    if (state === "APPROVED") {
      const proposal = proposals.find((item) => item.id === decision.proposalId);
      if (proposal) {
        setProjects((current) => {
          const existing = current.find((item) => item.proposalId === proposal.id);
          if (existing) return current.map((item) => item.proposalId === proposal.id ? { ...item, state: "ACTIVE" as const, next: "Khởi động dự án và xác nhận mốc đầu tiên" } : item);
          return [{ id: makeId("pr"), proposalId: proposal.id, code: proposal.code, title: proposal.title, partner: proposal.ruOrg, state: "ACTIVE", progress: 0, next: "Khởi động dự án và xác nhận mốc đầu tiên", milestones: [{ id: makeId("ms"), title: "Khởi động dự án", due: proposal.deadline, state: "IN_PROGRESS" }] }, ...current];
        });
        addNotification({ role: "ORGANIZATION_REPRESENTATIVE", title: "Dự án mới được kích hoạt", message: `${proposal.code} đã được chấp thuận và chuyển sang triển khai.`, href: "/workspace/organization?view=projects", tone: "success" });
      }
    }
  }, [addNotification, decisions, proposals, pushActivity]);

  const updateEndorsement = React.useCallback((endorsementId: string, state: OrganizationEndorsement["state"], note = "") => {
    const endorsement = endorsements.find((item) => item.id === endorsementId);
    if (!endorsement) return;
    setEndorsements((current) => current.map((item) => item.id === endorsementId ? { ...item, state } : item));
    pushActivity({ entityId: endorsementId, entityType: "organization", actor: "Đại diện tổ chức", action: state === "ENDORSED" ? "Xác nhận hồ sơ" : state === "NEEDS_INFO" ? "Yêu cầu bổ sung" : state === "DECLINED" ? "Từ chối xác nhận" : "Cập nhật hồ sơ", detail: note || endorsement.code });
    if (state === "ENDORSED") {
      setProposals((current) => current.map((item) => item.id === endorsement.proposalId && item.state === "WAITING_ORG_CONFIRMATION" ? { ...item, state: "SUBMITTED", updatedAt: nowLabel() } : item));
      addNotification({ role: "COLLABORATION_MANAGER", title: "Tổ chức đã xác nhận", message: `${endorsement.code} sẵn sàng tiếp tục sàng lọc.`, href: `/workspace/collaboration?view=screening&id=${endorsement.proposalId}`, tone: "success" });
    } else if (state === "NEEDS_INFO") {
      addNotification({ role: "RESEARCHER", title: "Tổ chức yêu cầu bổ sung", message: `${endorsement.code}: ${note || "Cần bổ sung hồ sơ tổ chức."}`, href: `/workspace/researcher?view=collaboration&id=${endorsement.proposalId}`, tone: "warning" });
    }
  }, [addNotification, endorsements, pushActivity]);

  const createOpportunity = React.useCallback((input: Pick<Opportunity, "title" | "field" | "closes">) => {
    const code = `OPP-DEMO-${String(opportunities.length + 1).padStart(2, "0")}`;
    const item: Opportunity = { id: makeId("op"), code, ...input, state: "DRAFT" };
    setOpportunities((current) => [item, ...current]);
    pushActivity({ entityId: item.id, entityType: "opportunity", actor: "Điều phối hợp tác", action: "Tạo cơ hội", detail: `${code} · ${item.title}` });
  }, [opportunities.length, pushActivity]);

  const publishOpportunity = React.useCallback((opportunityId: string) => {
    const opportunity = opportunities.find((item) => item.id === opportunityId);
    if (!opportunity) return;
    setOpportunities((current) => current.map((item) => item.id === opportunityId ? { ...item, state: "PUBLISHED" } : item));
    pushActivity({ entityId: opportunityId, entityType: "opportunity", actor: "Điều phối hợp tác", action: "Công bố cơ hội", detail: opportunity.code });
    addNotification({ role: "RESEARCHER", title: "Có cơ hội nghiên cứu mới", message: `${opportunity.title} · hạn ${opportunity.closes}`, href: "/workspace/researcher?view=collaboration", tone: "info" });
  }, [addNotification, opportunities, pushActivity]);

  const updateReport = React.useCallback((reportId: string, state: ReportItem["state"]) => {
    const report = reports.find((item) => item.id === reportId);
    if (!report) return;
    setReports((current) => current.map((item) => item.id === reportId ? { ...item, state } : item));
    pushActivity({ entityId: reportId, entityType: "report", actor: "Điều phối hợp tác", action: state === "APPROVED" ? "Duyệt báo cáo" : state === "RETURNED" ? "Trả báo cáo" : "Cập nhật báo cáo", detail: `${report.code} · ${report.period}` });
    addNotification({ role: "RESEARCHER", title: state === "APPROVED" ? "Báo cáo đã được duyệt" : "Báo cáo cần chỉnh sửa", message: `${report.code} · ${report.period}`, href: `/workspace/researcher?view=projects&id=${report.projectId}`, tone: state === "APPROVED" ? "success" : "warning" });
  }, [addNotification, pushActivity, reports]);

  const completeMilestone = React.useCallback((projectId: string, milestoneId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    setProjects((current) => current.map((item) => {
      if (item.id !== projectId) return item;
      const currentIndex = item.milestones.findIndex((milestone) => milestone.id === milestoneId);
      const milestones = item.milestones.map((milestone, index) => milestone.id === milestoneId
        ? { ...milestone, state: "DONE" as const }
        : index === currentIndex + 1 && milestone.state === "TODO"
          ? { ...milestone, state: "IN_PROGRESS" as const }
          : milestone);
      const done = milestones.filter((milestone) => milestone.state === "DONE").length;
      const progress = milestones.length ? Math.round((done / milestones.length) * 100) : item.progress;
      return { ...item, milestones, progress, state: progress >= 100 ? "COMPLETED" as const : item.state };
    }));
    pushActivity({ entityId: projectId, entityType: "project", actor: "Nhà nghiên cứu", action: "Hoàn tất mốc", detail: `${project.code} · ${milestoneId}` });
    addNotification({ role: "ORGANIZATION_REPRESENTATIVE", title: "Dự án cập nhật mốc", message: `${project.code} vừa hoàn tất một mốc tiến độ.`, href: `/workspace/organization?view=projects&id=${project.id}`, tone: "info" });
  }, [addNotification, projects, pushActivity]);

  const markNotificationRead = React.useCallback((notificationId: string) => {
    setNotifications((current) => current.map((item) => item.id === notificationId ? { ...item, read: true } : item));
  }, []);

  const markRoleNotificationsRead = React.useCallback((role: WorkflowRole) => {
    setNotifications((current) => current.map((item) => item.role === role ? { ...item, read: true } : item));
  }, []);

  const value = React.useMemo<DemoWorkflowContextValue>(() => ({
    proposals,
    reviews,
    decisions,
    projects,
    opportunities,
    reports,
    endorsements,
    notifications,
    activities,
    updateProposalState,
    submitProposal,
    screenProposal,
    assignReviewer,
    startReview,
    saveReviewDraft,
    submitReview,
    issueDecision,
    updateEndorsement,
    createOpportunity,
    publishOpportunity,
    updateReport,
    completeMilestone,
    markNotificationRead,
    markRoleNotificationsRead,
    addNotification,
  }), [
    activities,
    addNotification,
    assignReviewer,
    completeMilestone,
    createOpportunity,
    decisions,
    endorsements,
    issueDecision,
    markNotificationRead,
    markRoleNotificationsRead,
    notifications,
    opportunities,
    projects,
    proposals,
    publishOpportunity,
    reports,
    reviews,
    saveReviewDraft,
    screenProposal,
    startReview,
    submitProposal,
    submitReview,
    updateEndorsement,
    updateProposalState,
    updateReport,
  ]);

  return <DemoWorkflowContext.Provider value={value}>{children}</DemoWorkflowContext.Provider>;
}

export function useDemoWorkflow() {
  const context = React.useContext(DemoWorkflowContext);
  if (!context) throw new Error("useDemoWorkflow must be used inside DemoWorkflowProvider");
  return context;
}
