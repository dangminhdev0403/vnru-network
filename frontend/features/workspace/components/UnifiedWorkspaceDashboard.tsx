"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { useDemoWorkflow } from "@/features/workspace/demo-v2/DemoWorkflowProvider";
import { ActivityTimeline, WorkflowStepper } from "@/features/workspace/demo-v2/WorkflowUI";
import type { WorkflowRole } from "@/features/workspace/demo-v2/types";
import Link from "next/link";

type ModuleKey = "research" | "review" | "organization" | "coordination" | "decision";

const modules: Record<ModuleKey, { capabilities: string[]; href: string; icon: string; role: WorkflowRole; tone: string }> = {
  research: { capabilities: ["collab.proposals.create"], href: "/workspace/researcher?view=collaboration", icon: "science", role: "RESEARCHER", tone: "border-blue-200 bg-blue-50 text-blue-700" },
  review: { capabilities: ["reviews.assignments.view_assigned"], href: "/workspace/reviewer?view=assignments", icon: "rate_review", role: "REVIEWER", tone: "border-purple-200 bg-purple-50 text-purple-700" },
  organization: { capabilities: ["collab.proposals.endorse"], href: "/workspace/organization?view=endorsements", icon: "domain_verification", role: "ORGANIZATION_REPRESENTATIVE", tone: "border-teal-200 bg-teal-50 text-teal-700" },
  coordination: { capabilities: ["collab.opportunities.create", "collab.proposals.screen", "reviews.assignments.manage"], href: "/workspace/collaboration?view=screening", icon: "hub", role: "COLLABORATION_MANAGER", tone: "border-cyan-200 bg-cyan-50 text-cyan-700" },
  decision: { capabilities: ["collab.decisions.issue_foundation"], href: "/workspace/decisions?view=queue", icon: "gavel", role: "FOUNDATION_DECISION_MAKER", tone: "border-slate-200 bg-slate-100 text-slate-700" },
};

const copy: Record<Locale, {
  eyebrow: string; title: string; description: string; scope: string; priority: string;
  metrics: [string, string, string, string]; work: string; workHint: string;
  flow: string; flowHint: string; activity: string; activityHint: string; open: string;
  module: Record<ModuleKey, [string, string, string]>;
}> = {
  vi: {
    eyebrow: "Không gian thành viên", title: "Trung tâm công việc VN–RU",
    description: "Một workspace duy nhất cho toàn bộ vòng đời nghiên cứu. Module và thao tác được mở theo quyền trong ngữ cảnh hiện tại, không còn chuyển qua lại giữa dashboard vai trò.",
    scope: "Workspace thành viên thống nhất", priority: "Mở việc ưu tiên",
    metrics: ["Module được truy cập", "Việc cần chú ý", "Dự án đang hoạt động", "Thông báo chưa đọc"],
    work: "Công việc của tôi", workHint: "Chỉ hiển thị module được cấp quyền trong ngữ cảnh hiện tại.",
    flow: "Một vòng đời nghiên cứu", flowHint: "Các bước nối tiếp nhau trong cùng workspace; role chỉ xác định ai được thao tác ở từng bước.",
    activity: "Diễn biến gần đây", activityHint: "Dấu vết mô phỏng chung của đề xuất, phản biện, quyết định và dự án.", open: "Mở module",
    module: {
      research: ["Tri thức & đề xuất", "Khám phá tri thức, lập đề xuất và theo dõi dự án của bạn.", "đề xuất cần xử lý"],
      review: ["Phản biện", "Xử lý hồ sơ được phân công và lưu phiếu đánh giá.", "hồ sơ đang mở"],
      organization: ["Xác nhận tổ chức", "Rà soát tư cách, nguồn lực và nghĩa vụ của tổ chức.", "hồ sơ chờ xác nhận"],
      coordination: ["Điều phối chương trình", "Quản lý cơ hội, sàng lọc, phân công và báo cáo.", "việc điều phối"],
      decision: ["Quyết định", "Xem hồ sơ hoàn tất đánh giá và ghi nhận quyết định.", "hồ sơ chờ quyết định"],
    },
  },
  en: {
    eyebrow: "Member workspace", title: "VN–RU work center",
    description: "One workspace for the full research lifecycle. Modules and actions follow the capabilities in the active context—there is no dashboard persona switching.",
    scope: "the unified member workspace", priority: "Open priority task",
    metrics: ["Available modules", "Items needing attention", "Active projects", "Unread notifications"],
    work: "My work", workHint: "Only modules allowed in the active context are shown.",
    flow: "One research lifecycle", flowHint: "Every step stays in one workspace; roles only determine who may act at each step.",
    activity: "Recent activity", activityHint: "Shared preview history for proposals, reviews, decisions, and projects.", open: "Open module",
    module: {
      research: ["Knowledge & proposals", "Explore knowledge, prepare proposals, and track your projects.", "proposals need attention"],
      review: ["Peer review", "Process assigned dossiers and maintain evaluation forms.", "reviews are open"],
      organization: ["Organization endorsement", "Verify organization eligibility, resources, and obligations.", "dossiers await endorsement"],
      coordination: ["Programme coordination", "Manage calls, screening, assignments, and reports.", "coordination items"],
      decision: ["Decisions", "Review completed evaluations and record programme decisions.", "dossiers await decision"],
    },
  },
  ru: {
    eyebrow: "Пространство участника", title: "Рабочий центр VN–RU",
    description: "Единое пространство для полного цикла исследований. Модули и действия определяются правами активного контекста — переключение ролевых панелей не требуется.",
    scope: "едином пространстве участника", priority: "Открыть приоритетную задачу",
    metrics: ["Доступные модули", "Требуют внимания", "Активные проекты", "Непрочитанные уведомления"],
    work: "Моя работа", workHint: "Показаны только модули, разрешённые в активном контексте.",
    flow: "Единый цикл исследования", flowHint: "Все этапы находятся в одном пространстве; роли определяют только доступные действия.",
    activity: "Последние события", activityHint: "Общая демонстрационная история заявок, экспертизы, решений и проектов.", open: "Открыть модуль",
    module: {
      research: ["Знания и заявки", "Изучение знаний, подготовка заявок и отслеживание проектов.", "заявок требуют внимания"],
      review: ["Экспертиза", "Работа с назначенными заявками и формами оценки.", "экспертиз открыто"],
      organization: ["Подтверждение организации", "Проверка статуса, ресурсов и обязательств организации.", "заявок ждут подтверждения"],
      coordination: ["Координация программы", "Возможности, отбор, назначения и отчёты.", "задач координации"],
      decision: ["Решения", "Рассмотрение завершённых экспертиз и фиксация решений.", "заявок ждут решения"],
    },
  },
};

export function UnifiedWorkspaceDashboard({ capabilities }: { capabilities: string[] }) {
  const { locale } = useLocale();
  const t = copy[locale] || copy.vi;
  const workflow = useDemoWorkflow();
  const taskCount: Record<ModuleKey, number> = {
    research: workflow.proposals.filter((item) => ["DRAFT", "WAITING_PARTNER", "WAITING_ORG_CONFIRMATION", "NEEDS_INFO", "REVISION"].includes(item.state)).length,
    review: workflow.reviews.filter((item) => !["SUBMITTED", "CANCELLED"].includes(item.state)).length,
    organization: workflow.endorsements.filter((item) => ["PENDING", "NEEDS_INFO"].includes(item.state)).length,
    coordination: workflow.proposals.filter((item) => ["SUBMITTED", "ELIGIBLE", "IN_REVIEW"].includes(item.state)).length + workflow.reports.filter((item) => ["SUBMITTED", "PENDING", "OVERDUE"].includes(item.state)).length,
    decision: workflow.decisions.filter((item) => item.state === "PENDING").length,
  };
  const visible = (Object.keys(modules) as ModuleKey[]).filter((key) => modules[key].capabilities.some((capability) => capabilities.includes(capability)));
  const roles = new Set(visible.map((key) => modules[key].role));
  const pending = visible.reduce((total, key) => total + taskCount[key], 0);
  const unread = workflow.notifications.filter((item) => roles.has(item.role) && !item.read).length;
  const priority = visible.find((key) => taskCount[key] > 0) ?? visible[0];
  const metricValues = [visible.length, pending, workflow.projects.filter((item) => ["ACTIVE", "AT_RISK", "BLOCKED"].includes(item.state)).length, unread];

  return <div className="mx-auto w-full max-w-[1600px] space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <WorkspacePreviewNotice scope={t.scope} />
    <header className="grid gap-6 border-b border-card-border pb-7 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-4xl"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">{t.eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{t.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{t.description}</p></div>{priority && <Link href={modules[priority].href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none">{t.priority}<span aria-hidden="true">→</span></Link>}</header>
    <section aria-label="Workspace metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metricValues.map((value, index) => <div key={t.metrics[index]} className="rounded-2xl border border-card-border bg-card-surface-area p-5"><strong className="block font-mono text-3xl font-extrabold text-slate-950">{String(value).padStart(2, "0")}</strong><span className="mt-2 block text-sm font-bold text-slate-700">{t.metrics[index]}</span></div>)}</section>
    <section><div className="mb-4"><h2 className="text-xl font-bold text-slate-950">{t.work}</h2><p className="mt-1 text-sm text-slate-500">{t.workHint}</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((key) => <Link key={key} href={modules[key].href} className="group rounded-2xl border border-card-border bg-card-surface-area p-5 transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transform-none motion-reduce:transition-none"><div className="flex items-start justify-between gap-4"><span className={`grid size-11 shrink-0 place-items-center rounded-xl border ${modules[key].tone}`}><span className="material-symbols-outlined" aria-hidden="true">{modules[key].icon}</span></span><span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold text-slate-700">{taskCount[key]}</span></div><h3 className="mt-5 text-lg font-bold text-slate-950">{t.module[key][0]}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{t.module[key][1]}</p><div className="mt-5 flex items-center justify-between border-t border-card-border pt-4 text-xs font-bold"><span className="text-slate-500">{taskCount[key]} {t.module[key][2]}</span><span className="text-blue-700 group-hover:text-blue-800">{t.open} →</span></div></Link>)}</div></section>
    <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><h2 className="text-lg font-bold text-slate-950">{t.flow}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{t.flowHint}</p><div className="mt-5"><WorkflowStepper current="proposal" /></div></section>
    <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><h2 className="text-lg font-bold text-slate-950">{t.activity}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{t.activityHint}</p><div className="mt-5"><ActivityTimeline items={workflow.activities.slice(0, 6)} /></div></section>
  </div>;
}
