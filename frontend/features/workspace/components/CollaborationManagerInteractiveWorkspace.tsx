"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { commitDemoMutation, useDemoHandoffs } from "@/features/prototype-v3/demo-backend";
import { WorkspaceTaskDialog } from "./WorkspaceTaskDialog";
import {
  WorkspaceActivityTimeline,
  WorkspaceCollectionToolbar,
  WorkspaceEmptyState,
  WorkspaceMetric,
  WorkspaceNotificationPanel,
  WorkspaceStatus,
  WorkspaceViewHeader,
  WorkspaceWorkflowStepper,
  type WorkspaceTone,
} from "./WorkspaceInteractionKit";

type ManagerView = "overview" | "opportunities" | "screening" | "assignments" | "projects" | "reports";
type OpportunityState = "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
type ScreeningState = "NEW" | "IN_SCREENING" | "NEEDS_INFO" | "ELIGIBLE" | "NOT_ELIGIBLE";
type AssignmentState = "UNASSIGNED" | "ASSIGNED" | "CONFLICT" | "DECLINED" | "COMPLETED";
type ReportState = "PENDING" | "RETURNED" | "APPROVED" | "OVERDUE";

type Opportunity = { id: string; code: string; title: string; field: string; closes: string; state: OpportunityState; submissions: number };
type Screening = { id: string; code: string; title: string; organizations: string; state: ScreeningState; completeness: number; note: string };
type Assignment = { id: string; code: string; title: string; reviewer: string | null; deadline: string; state: AssignmentState; field: string };
type Report = { id: string; code: string; title: string; period: string; progress: number; state: ReportState; owner: string };
type ProgrammeProject = { id: string; code: string; title: string; progress: number; state: "ACTIVE" | "AT_RISK" | "PAUSED" | "COMPLETED"; next: string };

const views = new Set<ManagerView>(["overview", "opportunities", "screening", "assignments", "projects", "reports"]);

const opportunities: Opportunity[] = [
  { id: "op1", code: "OPP-2026-MARINE", title: "Vật liệu và cảm biến cho môi trường biển", field: "Vật liệu · Cảm biến", closes: "30/09/2026", state: "PUBLISHED", submissions: 7 },
  { id: "op2", code: "OPP-2026-AI", title: "AI cho quan trắc và dự báo rủi ro ven biển", field: "AI · Địa chất biển", closes: "15/10/2026", state: "DRAFT", submissions: 0 },
  { id: "op3", code: "OPP-2026-DATA", title: "Dữ liệu liên thông phục vụ nghiên cứu biển", field: "Dữ liệu khoa học", closes: "05/10/2026", state: "PUBLISHED", submissions: 5 },
  { id: "op4", code: "OPP-2026-ROBOT", title: "Robot và thiết bị tự hành nghiên cứu biển", field: "Robot", closes: "20/09/2026", state: "PUBLISHED", submissions: 3 },
  { id: "op5", code: "OPP-2026-GEO", title: "Địa chất biển và vùng cửa sông", field: "Địa chất", closes: "15/08/2026", state: "CLOSED", submissions: 9 },
  { id: "op6", code: "OPP-2025-OCEAN", title: "Hải dương học ven bờ song phương", field: "Hải dương học", closes: "30/11/2025", state: "ARCHIVED", submissions: 12 },
];

const initialScreenings: Screening[] = [
  { id: "sc1", code: "RU-VN-2026-NANO-01", title: "Độ bền vật liệu Nano-composite trong môi trường biển nhiệt đới", organizations: "Viện Hải dương học ↔ FEB RAS", state: "NEW", completeness: 100, note: "Đã đủ xác nhận tổ chức; chờ bắt đầu sàng lọc." },
  { id: "sc2", code: "RU-VN-2026-AI-04", title: "Mô hình AI dự báo sớm tai biến địa chất ven biển", organizations: "VAST ↔ MISIS", state: "NEEDS_INFO", completeness: 72, note: "Thiếu mô tả nguồn dữ liệu dùng chung và phạm vi thử nghiệm." },
  { id: "sc3", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", organizations: "IMER ↔ POI RAS", state: "ELIGIBLE", completeness: 100, note: "Đã qua sàng lọc; sẵn sàng phân công phản biện." },
  { id: "sc4", code: "RU-VN-2026-DATA-05", title: "Chuẩn hóa dữ liệu quan trắc ven bờ Việt Nam – Liên bang Nga", organizations: "VAST ↔ FEB RAS", state: "IN_SCREENING", completeness: 94, note: "Đang kiểm tra phạm vi dữ liệu và vai trò hai phía." },
  { id: "sc5", code: "RU-VN-2026-ROBOT-03", title: "Robot tự hành lấy mẫu vùng nước nông", organizations: "ĐHQG TP.HCM ↔ FESTU", state: "NEW", completeness: 86, note: "Cần rà soát đủ xác nhận nhóm phối hợp." },
  { id: "sc6", code: "RU-VN-2026-GEO-09", title: "Đối chiếu trầm tích vùng cửa sông nhiệt đới", organizations: "IMER ↔ POI RAS", state: "NOT_ELIGIBLE", completeness: 81, note: "Phạm vi tổ chức không được xác nhận trong vòng xử lý trước." },
];

const initialAssignments: Assignment[] = [
  { id: "as1", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", reviewer: null, deadline: "08/09/2026", state: "UNASSIGNED", field: "Sinh học biển" },
  { id: "as2", code: "RU-VN-2026-BIO-08", title: "Khảo sát đa dạng sinh học vùng biển chuyển tiếp Việt – Nga", reviewer: "Chuyên gia #07", deadline: "30/08/2026", state: "ASSIGNED", field: "Sinh học biển" },
  { id: "as3", code: "RU-VN-2026-MAT-11", title: "Lớp phủ chống ăn mòn cho thiết bị nghiên cứu biển", reviewer: "Chuyên gia #21", deadline: "15/09/2026", state: "CONFLICT", field: "Vật liệu biển" },
  { id: "as4", code: "RU-VN-2026-DATA-08", title: "Kiến trúc metadata liên thông cho dữ liệu biển", reviewer: "Chuyên gia #12", deadline: "12/09/2026", state: "DECLINED", field: "Dữ liệu khoa học" },
  { id: "as5", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", reviewer: "Chuyên gia #03", deadline: "18/08/2026", state: "COMPLETED", field: "Hải dương học" },
];

const reports: Report[] = [
  { id: "rp1", code: "RU-VN-2026-BIO-08", title: "Báo cáo tiến độ giai đoạn 2", period: "Q2/2026", progress: 75, state: "PENDING", owner: "Nhóm nghiên cứu BIO-08" },
  { id: "rp2", code: "RU-VN-2025-OCEAN-03", title: "Báo cáo tiến độ giai đoạn 1", period: "H1/2026", progress: 48, state: "RETURNED", owner: "Nhóm OCEAN-03" },
  { id: "rp3", code: "RU-VN-2025-DATA-06", title: "Báo cáo hoàn tất mốc tích hợp dữ liệu", period: "M3", progress: 100, state: "APPROVED", owner: "Nhóm DATA-06" },
  { id: "rp4", code: "RU-VN-2026-SENSOR-02", title: "Báo cáo hiệu chỉnh cảm biến đợt 1", period: "M2", progress: 20, state: "OVERDUE", owner: "Nhóm SENSOR-02" },
  { id: "rp5", code: "RU-VN-2026-GEO-04", title: "Báo cáo lấy mẫu cửa sông", period: "M4", progress: 62, state: "PENDING", owner: "Nhóm GEO-04" },
];

const programmeProjects: ProgrammeProject[] = [
  { id: "pp1", code: "RU-VN-2026-BIO-08", title: "Khảo sát đa dạng sinh học vùng biển chuyển tiếp Việt – Nga", progress: 75, state: "ACTIVE", next: "Theo dõi báo cáo Q2 và mốc đối chiếu dữ liệu" },
  { id: "pp2", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", progress: 48, state: "AT_RISK", next: "Điều phối làm rõ dữ liệu tháng 8" },
  { id: "pp3", code: "RU-VN-2026-SENSOR-02", title: "Mạng cảm biến độ mặn phục vụ quan trắc ven bờ", progress: 20, state: "ACTIVE", next: "Chờ báo cáo hiệu chỉnh cảm biến" },
  { id: "pp4", code: "RU-VN-2025-GEO-04", title: "Bản đồ trầm tích cửa sông so sánh", progress: 62, state: "PAUSED", next: "Chờ xác nhận kho mẫu từ tổ chức" },
  { id: "pp5", code: "RU-VN-2024-DATA-07", title: "Chuẩn hóa metadata dữ liệu hải dương học", progress: 100, state: "COMPLETED", next: "Đã hoàn tất" },
];

const reviewers = [
  { name: "Chuyên gia #07", field: "Vật liệu & sinh học biển", load: 1, conflict: false },
  { name: "Chuyên gia #12", field: "Dữ liệu & AI", load: 2, conflict: false },
  { name: "Chuyên gia #18", field: "Hải dương học", load: 0, conflict: false },
  { name: "Chuyên gia #21", field: "Hóa lý bề mặt", load: 1, conflict: true },
  { name: "Chuyên gia #26", field: "Robot biển", load: 3, conflict: false },
];

function opportunityMeta(state: OpportunityState): { label: string; tone: WorkspaceTone } {
  if (state === "PUBLISHED") return { label: "Đang công bố", tone: "green" };
  if (state === "DRAFT") return { label: "Bản nháp", tone: "slate" };
  if (state === "CLOSED") return { label: "Đã đóng", tone: "amber" };
  return { label: "Lưu trữ", tone: "slate" };
}
function screeningMeta(state: ScreeningState): { label: string; tone: WorkspaceTone } {
  if (state === "NEW") return { label: "Mới tiếp nhận", tone: "blue" };
  if (state === "IN_SCREENING") return { label: "Đang sàng lọc", tone: "cyan" };
  if (state === "NEEDS_INFO") return { label: "Cần bổ sung", tone: "amber" };
  if (state === "ELIGIBLE") return { label: "Đủ điều kiện", tone: "green" };
  return { label: "Không đủ điều kiện", tone: "red" };
}
function assignmentMeta(state: AssignmentState): { label: string; tone: WorkspaceTone } {
  if (state === "UNASSIGNED") return { label: "Chưa phân công", tone: "amber" };
  if (state === "ASSIGNED") return { label: "Đã phân công", tone: "blue" };
  if (state === "CONFLICT") return { label: "Xung đột", tone: "red" };
  if (state === "DECLINED") return { label: "Reviewer từ chối", tone: "amber" };
  return { label: "Đã hoàn tất", tone: "green" };
}
function reportMeta(state: ReportState): { label: string; tone: WorkspaceTone } {
  if (state === "PENDING") return { label: "Chờ xử lý", tone: "blue" };
  if (state === "RETURNED") return { label: "Đã trả chỉnh sửa", tone: "amber" };
  if (state === "OVERDUE") return { label: "Quá hạn", tone: "red" };
  return { label: "Đã duyệt", tone: "green" };
}

export function CollaborationManagerInteractiveWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian điều phối…</div>}><ManagerWorkspaceContent /></React.Suspense>;
}

function ManagerWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as ManagerView | null;
  const view: ManagerView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const handoffs = useDemoHandoffs("manager");
  const [opportunityOverrides, setOpportunityOverrides] = React.useState<Record<string, OpportunityState>>({});
  const [screeningOverrides, setScreeningOverrides] = React.useState<Record<string, ScreeningState>>({});
  const [assignmentOverrides, setAssignmentOverrides] = React.useState<Record<string, AssignmentState>>({});
  const [assignmentReviewer, setAssignmentReviewer] = React.useState<Record<string, string>>({});
  const [generatedAssignments, setGeneratedAssignments] = React.useState<Assignment[]>([]);
  const [reportOverrides, setReportOverrides] = React.useState<Record<string, ReportState>>({});
  const [selectedScreenCode, setSelectedScreenCode] = React.useState("RU-VN-2026-NANO-01");
  const [selectedAssignmentCode, setSelectedAssignmentCode] = React.useState("RU-VN-2026-MAR-02");
  const [selectedReportCode, setSelectedReportCode] = React.useState("RU-VN-2026-BIO-08");
  const [selectedOpportunityCode, setSelectedOpportunityCode] = React.useState("OPP-2026-AI");
  const [screenQuery, setScreenQuery] = React.useState("");
  const [screenFilter, setScreenFilter] = React.useState("ACTION");
  const [selectedReviewer, setSelectedReviewer] = React.useState("Chuyên gia #18");
  const [infoNote, setInfoNote] = React.useState("Vui lòng bổ sung mô tả dữ liệu dùng chung, nguồn gốc dữ liệu và phạm vi kiểm chứng giữa hai nhóm.");
  const [reportNote, setReportNote] = React.useState("Cần bổ sung kết quả đối chiếu dữ liệu và mô tả rõ mốc tiếp theo.");
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [createOpportunityOpen, setCreateOpportunityOpen] = React.useState(false);
  const [opTitle, setOpTitle] = React.useState("");
  const [opField, setOpField] = React.useState("");
  const [opClose, setOpClose] = React.useState("");

  const dynamicScreenings: Screening[] = handoffs.filter((item) => ["ORG_ENDORSED", "PROPOSAL_RESUBMITTED"].includes(item.stage) && !initialScreenings.some((screening) => screening.code === item.entityCode)).map((item) => ({ id: item.id, code: item.entityCode, title: item.title, organizations: "Đã hoàn tất handoff trước", state: "NEW", completeness: 100, note: "Hồ sơ được chuyển vào hàng đợi sàng lọc trong phiên preview." }));
  const screenings = [...dynamicScreenings, ...initialScreenings].map((item) => ({ ...item, state: screeningOverrides[item.code] ?? item.state }));
  const conflictCodes = new Set(handoffs.filter((item) => item.stage === "REVIEWER_CONFLICT").map((item) => item.entityCode));
  const assignments = [...generatedAssignments, ...initialAssignments].map((item) => ({ ...item, reviewer: assignmentReviewer[item.code] ?? item.reviewer, state: conflictCodes.has(item.code) ? "CONFLICT" as const : assignmentOverrides[item.code] ?? item.state }));
  const reportItems = reports.map((item) => ({ ...item, state: reportOverrides[item.code] ?? item.state }));
  const opportunityItems = opportunities.map((item) => ({ ...item, state: opportunityOverrides[item.code] ?? item.state }));
  const selectedScreen = screenings.find((item) => item.code === selectedScreenCode) ?? screenings[0];
  const selectedAssignment = assignments.find((item) => item.code === selectedAssignmentCode) ?? assignments[0];
  const selectedReport = reportItems.find((item) => item.code === selectedReportCode) ?? reportItems[0];
  const selectedOpportunity = opportunityItems.find((item) => item.code === selectedOpportunityCode) ?? opportunityItems[0];
  const actionScreenStates: ScreeningState[] = ["NEW", "IN_SCREENING", "NEEDS_INFO"];
  const q = screenQuery.trim().toLocaleLowerCase("vi");
  const filteredScreens = screenings.filter((item) => (!q || `${item.code} ${item.title} ${item.organizations}`.toLocaleLowerCase("vi").includes(q)) && (screenFilter === "ALL" || screenFilter === "ACTION" ? (screenFilter === "ALL" || actionScreenStates.includes(item.state)) : item.state === screenFilter));
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2800); };
  const mutate = async (action: string, detail: string, after: () => void, options?: Parameters<typeof commitDemoMutation>[3]) => { setBusy(true); await commitDemoMutation("manager", action, detail, options); after(); setBusy(false); showToast(`${action} · trạng thái preview đã cập nhật.`); };

  const markEligible = (item: Screening) => {
    void mutate("Đã xác nhận hồ sơ đủ điều kiện", `${item.code} · chuyển sang phân công phản biện`, () => {
      setScreeningOverrides((current) => ({ ...current, [item.code]: "ELIGIBLE" }));
      if (!assignments.some((assignment) => assignment.code === item.code)) setGeneratedAssignments((current) => [{ id: `gen-${item.id}`, code: item.code, title: item.title, reviewer: null, deadline: "10/09/2026", state: "UNASSIGNED", field: "Theo hồ sơ sàng lọc" }, ...current]);
    });
  };

  const requestInfo = (item: Screening) => {
    if (infoNote.trim().length < 15) return;
    void mutate("Đã yêu cầu nhà nghiên cứu bổ sung", `${item.code} · ${infoNote.trim()}`, () => setScreeningOverrides((current) => ({ ...current, [item.code]: "NEEDS_INFO" })), {
      notifications: [{ scope: "researcher", title: "Điều phối yêu cầu bổ sung hồ sơ", detail: `${item.code}: ${infoNote.trim()}`, href: "/workspace/researcher?view=collaboration" }],
      handoffs: [{ to: "researcher", entityCode: item.code, title: item.title, stage: "SCREENING_NEEDS_INFO" }],
    });
  };

  const assignReviewer = (item: Assignment) => {
    const candidate = reviewers.find((reviewer) => reviewer.name === selectedReviewer);
    if (!candidate || candidate.conflict) return;
    void mutate("Đã phân công Reviewer", `${item.code} · ${candidate.name}`, () => { setAssignmentReviewer((current) => ({ ...current, [item.code]: candidate.name })); setAssignmentOverrides((current) => ({ ...current, [item.code]: "ASSIGNED" })); }, {
      notifications: [{ scope: "reviewer", title: "Bạn có hồ sơ phản biện mới", detail: `${item.code} · hạn ${item.deadline}.`, href: `/workspace/reviewer?view=assignments&id=${item.code}` }],
      handoffs: [{ to: "reviewer", entityCode: item.code, title: item.title, stage: "REVIEW_ASSIGNED" }],
    });
  };

  const updateReport = (item: Report, state: ReportState) => {
    void mutate(state === "APPROVED" ? "Đã duyệt báo cáo tiến độ" : "Đã trả báo cáo để chỉnh sửa", `${item.code} · ${item.period}${state === "RETURNED" ? ` · ${reportNote}` : ""}`, () => setReportOverrides((current) => ({ ...current, [item.code]: state })), {
      notifications: [{ scope: "researcher", title: state === "APPROVED" ? "Báo cáo tiến độ đã được duyệt" : "Báo cáo cần chỉnh sửa", detail: `${item.code} · ${item.period}${state === "RETURNED" ? `: ${reportNote}` : ""}`, href: "/workspace/researcher?view=projects" }],
    });
  };

  const createOpportunity = () => {
    if (!opTitle.trim() || !opField.trim() || !opClose) return;
    showToast(`Đã tạo bản nháp cơ hội: ${opTitle.trim()}.`); setCreateOpportunityOpen(false); setOpTitle(""); setOpField(""); setOpClose("");
  };

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Điều phối hợp tác" />
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-cyan-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md">{toast}</div>}

      {view === "overview" && <>
        <WorkspaceViewHeader eyebrow="Điều phối hợp tác" title="Bàn điều phối chương trình" tone="cyan" description="Điều phối quản lý intake và handoff giữa các bước: cơ hội → sàng lọc → phân Reviewer → theo dõi dự án/báo cáo. Không chấm điểm thay Reviewer và không ban hành quyết định." action={<Link href="/workspace/collaboration?view=screening" className="inline-flex min-h-11 items-center rounded-xl bg-cyan-700 px-4 text-sm font-bold text-white">Mở hàng đợi sàng lọc →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><WorkspaceMetric value={String(screenings.filter((item) => actionScreenStates.includes(item.state)).length).padStart(2, "0")} label="Cần sàng lọc" detail="Mới, đang xử lý hoặc cần bổ sung" href="/workspace/collaboration?view=screening" tone="cyan" /><WorkspaceMetric value={String(assignments.filter((item) => ["UNASSIGNED", "CONFLICT", "DECLINED"].includes(item.state)).length).padStart(2, "0")} label="Cần phân Reviewer" detail="Chưa phân công hoặc cần phân lại" href="/workspace/collaboration?view=assignments" tone="red" /><WorkspaceMetric value={String(reportItems.filter((item) => ["PENDING", "OVERDUE"].includes(item.state)).length).padStart(2, "0")} label="Báo cáo chờ xử lý" detail="Duyệt hoặc trả lại có lý do" href="/workspace/collaboration?view=reports" tone="amber" /><WorkspaceMetric value={String(programmeProjects.filter((item) => item.state === "AT_RISK").length).padStart(2, "0")} label="Dự án cần chú ý" detail="Điều phối theo dõi, không sửa milestone nghiên cứu" href="/workspace/collaboration?view=projects" tone="red" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-end justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Handoff đang chờ điều phối</h2><p className="mt-1 text-sm text-slate-500">Mỗi dòng trỏ đúng bước cần xử lý, không phải danh sách trang trí.</p></div><WorkspaceStatus tone="amber">Ưu tiên theo luồng</WorkspaceStatus></div><div className="divide-y divide-card-border"><Link href="/workspace/collaboration?view=screening" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-cyan-700" aria-hidden="true">fact_check</span><div><strong className="block text-sm text-slate-900 dark:text-white">Sàng lọc hồ sơ mới / bổ sung</strong><span className="text-xs text-slate-500">{screenings.filter((item) => actionScreenStates.includes(item.state)).length} hồ sơ cần kiểm tra</span></div><span className="text-sm font-bold text-cyan-700">Mở →</span></Link><Link href="/workspace/collaboration?view=assignments" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-cyan-700" aria-hidden="true">group_add</span><div><strong className="block text-sm text-slate-900 dark:text-white">Phân công / phân lại Reviewer</strong><span className="text-xs text-slate-500">Xử lý chưa phân công, từ chối và xung đột</span></div><span className="text-sm font-bold text-cyan-700">Mở →</span></Link><Link href="/workspace/collaboration?view=reports" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-cyan-700" aria-hidden="true">description</span><div><strong className="block text-sm text-slate-900 dark:text-white">Báo cáo tiến độ</strong><span className="text-xs text-slate-500">Có báo cáo quá hạn và chờ xử lý</span></div><span className="text-sm font-bold text-cyan-700">Mở →</span></Link></div></div><WorkspaceNotificationPanel scope="manager" seed={[{ id: "m-n1", title: "MAR-02 chưa có Reviewer", detail: "Hồ sơ đã đủ điều kiện và cần được phân công.", href: "/workspace/collaboration?view=assignments", createdAt: "2026-08-24T10:40:00+07:00" }, { id: "m-n2", title: "SENSOR-02 có báo cáo quá hạn", detail: "Cần kiểm tra và phản hồi nhóm nghiên cứu.", href: "/workspace/collaboration?view=reports", createdAt: "2026-08-24T08:10:00+07:00" }]} /></section>
      </>}

      {view === "opportunities" && <>
        <WorkspaceViewHeader eyebrow="Cơ hội nghiên cứu" title="Quản lý vòng đời cơ hội" tone="cyan" description="Điều phối tạo bản nháp, công bố và đóng cơ hội; số hồ sơ nộp giúp kiểm tra trạng thái collection. Không dùng chung workflow với đề xuất của Nhà nghiên cứu." action={<button type="button" onClick={() => setCreateOpportunityOpen(true)} className="min-h-11 rounded-xl bg-cyan-700 px-4 text-sm font-bold text-white">+ Tạo cơ hội</button>} />
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{opportunityItems.map((item) => <button key={item.id} type="button" onClick={() => setSelectedOpportunityCode(item.code)} className={`rounded-2xl border bg-card-surface-area p-5 text-left ${selectedOpportunity.code === item.code ? "border-cyan-500" : "border-card-border"}`}><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={opportunityMeta(item.state).tone}>{opportunityMeta(item.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.field} · hạn {item.closes}</p><div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Hồ sơ đã nộp</span><strong className="text-lg text-slate-950 dark:text-white">{item.submissions}</strong></div></button>)}</section>
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex gap-2"><WorkspaceStatus tone={opportunityMeta(selectedOpportunity.state).tone}>{opportunityMeta(selectedOpportunity.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selectedOpportunity.code}</span></div><h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{selectedOpportunity.title}</h2></div><div className="flex flex-wrap gap-2">{selectedOpportunity.state === "DRAFT" && <button type="button" disabled={busy} onClick={() => void mutate("Đã công bố cơ hội", selectedOpportunity.code, () => setOpportunityOverrides((current) => ({ ...current, [selectedOpportunity.code]: "PUBLISHED" })))} className="min-h-10 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white">Công bố cơ hội</button>}{selectedOpportunity.state === "PUBLISHED" && <button type="button" disabled={busy} onClick={() => void mutate("Đã đóng nhận hồ sơ", selectedOpportunity.code, () => setOpportunityOverrides((current) => ({ ...current, [selectedOpportunity.code]: "CLOSED" })))} className="min-h-10 rounded-lg border border-amber-300 px-4 text-sm font-bold text-amber-800 dark:border-amber-800 dark:text-amber-200">Đóng nhận hồ sơ</button>}{selectedOpportunity.state === "CLOSED" && <button type="button" disabled={busy} onClick={() => void mutate("Đã lưu trữ cơ hội", selectedOpportunity.code, () => setOpportunityOverrides((current) => ({ ...current, [selectedOpportunity.code]: "ARCHIVED" })))} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Lưu trữ</button>}</div></div></section>
      </>}

      {view === "screening" && <>
        <WorkspaceViewHeader eyebrow="Sàng lọc đề xuất" title="Hàng đợi sàng lọc" tone="cyan" description="Collection → detail → quyết định sàng lọc. Điều phối kiểm tra tính đầy đủ và điều kiện quy trình, không thay Reviewer đánh giá chuyên môn." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><WorkspaceCollectionToolbar query={screenQuery} onQueryChange={setScreenQuery} placeholder="Tìm mã, tên hồ sơ hoặc tổ chức…" activeFilter={screenFilter} onFilterChange={setScreenFilter} filters={[{ value: "ACTION", label: "Cần xử lý", count: screenings.filter((item) => actionScreenStates.includes(item.state)).length }, { value: "NEW", label: "Mới", count: screenings.filter((item) => item.state === "NEW").length }, { value: "NEEDS_INFO", label: "Cần bổ sung", count: screenings.filter((item) => item.state === "NEEDS_INFO").length }, { value: "ELIGIBLE", label: "Đủ điều kiện", count: screenings.filter((item) => item.state === "ELIGIBLE").length }, { value: "ALL", label: "Tất cả", count: screenings.length }]} /><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]"><div className="divide-y divide-card-border">{filteredScreens.length ? filteredScreens.map((item) => <button key={item.id} type="button" onClick={() => setSelectedScreenCode(item.code)} className={`grid w-full gap-3 px-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center ${selectedScreen.code === item.code ? "rounded-xl bg-cyan-50 dark:bg-cyan-950/20" : ""}`}><div><div className="flex gap-2"><WorkspaceStatus tone={screeningMeta(item.state).tone}>{screeningMeta(item.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><strong className="mt-2 block text-sm leading-6 text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.organizations} · đầy đủ {item.completeness}%</span></div><span className="text-sm font-bold text-cyan-700">Kiểm tra →</span></button>) : <WorkspaceEmptyState title="Không có hồ sơ phù hợp" detail="Thử đổi bộ lọc hoặc từ khóa." />}</div><aside className="h-fit rounded-2xl border border-card-border bg-slate-50 p-5 dark:bg-slate-950/50"><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={screeningMeta(selectedScreen.state).tone}>{screeningMeta(selectedScreen.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selectedScreen.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{selectedScreen.title}</h2><div className="mt-4"><WorkspaceWorkflowStepper steps={[{ label: "Tổ chức xác nhận", state: "done" }, { label: "Sàng lọc", state: selectedScreen.state === "NEEDS_INFO" ? "blocked" : ["ELIGIBLE", "NOT_ELIGIBLE"].includes(selectedScreen.state) ? "done" : "current" }, { label: "Phân Reviewer", state: selectedScreen.state === "ELIGIBLE" ? "current" : "waiting" }, { label: "Phản biện", state: "waiting" }]} /></div><div className="mt-4 rounded-xl border border-card-border bg-white p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Ghi chú sàng lọc</span><p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{selectedScreen.note}</p></div>{actionScreenStates.includes(selectedScreen.state) && <div className="mt-4"><label htmlFor="screen-note-v2" className="text-xs font-bold text-slate-500">Yêu cầu bổ sung</label><textarea id="screen-note-v2" rows={3} value={infoNote} onChange={(event) => setInfoNote(event.target.value)} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm dark:bg-slate-900" /></div>}<div className="mt-5 flex flex-wrap gap-2">{selectedScreen.state === "NEW" && <button type="button" onClick={() => setScreeningOverrides((current) => ({ ...current, [selectedScreen.code]: "IN_SCREENING" }))} className="min-h-10 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white">Bắt đầu sàng lọc</button>}{["NEW", "IN_SCREENING", "NEEDS_INFO"].includes(selectedScreen.state) && <><button type="button" disabled={busy} onClick={() => markEligible(selectedScreen)} className="min-h-10 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white disabled:opacity-60">Đủ điều kiện</button><button type="button" disabled={busy || infoNote.trim().length < 15} onClick={() => requestInfo(selectedScreen)} className="min-h-10 rounded-lg border border-amber-300 px-4 text-sm font-bold text-amber-800 disabled:opacity-50 dark:border-amber-800 dark:text-amber-200">Yêu cầu bổ sung</button><button type="button" disabled={busy} onClick={() => void mutate("Đã đánh dấu không đủ điều kiện", selectedScreen.code, () => setScreeningOverrides((current) => ({ ...current, [selectedScreen.code]: "NOT_ELIGIBLE" })))} className="min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-bold text-rose-700">Không đủ điều kiện</button></>}{selectedScreen.state === "ELIGIBLE" && <Link href="/workspace/collaboration?view=assignments" className="inline-flex min-h-10 items-center rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white">Sang phân Reviewer →</Link>}</div></aside></div></section><WorkspaceActivityTimeline scope="manager" entityCode={selectedScreen.code} />
      </>}

      {view === "assignments" && <>
        <WorkspaceViewHeader eyebrow="Phân công phản biện" title="Điều phối Reviewer" tone="cyan" description="Điều phối xử lý hồ sơ chưa phân công, reviewer từ chối hoặc xung đột; chọn người theo chuyên môn, tải hiện tại và cảnh báo conflict." />
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_460px]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="divide-y divide-card-border">{assignments.map((item) => <button key={item.id} type="button" onClick={() => setSelectedAssignmentCode(item.code)} className={`grid w-full gap-3 px-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center ${selectedAssignment.code === item.code ? "rounded-xl bg-cyan-50 dark:bg-cyan-950/20" : ""}`}><div><div className="flex gap-2"><WorkspaceStatus tone={assignmentMeta(item.state).tone}>{assignmentMeta(item.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><strong className="mt-2 block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.reviewer ?? "Chưa có Reviewer"} · hạn {item.deadline}</span></div><span className="text-sm font-bold text-cyan-700">Phân công →</span></button>)}</div></div><aside className="h-fit rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={assignmentMeta(selectedAssignment.state).tone}>{assignmentMeta(selectedAssignment.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selectedAssignment.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{selectedAssignment.title}</h2><div className="mt-4 space-y-2">{reviewers.map((candidate) => <label key={candidate.name} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${selectedReviewer === candidate.name ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20" : "border-card-border"}`}><input type="radio" name="reviewer-v2" checked={selectedReviewer === candidate.name} onChange={() => setSelectedReviewer(candidate.name)} className="mt-1" /><span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900 dark:text-white">{candidate.name}</strong><span className="mt-1 block text-xs text-slate-500">{candidate.field} · {candidate.load} hồ sơ đang mở</span>{candidate.conflict && <span className="mt-1 block text-xs font-bold text-rose-700 dark:text-rose-300">Có xung đột lợi ích — không thể phân công</span>}</span></label>)}</div>{["UNASSIGNED", "CONFLICT", "DECLINED"].includes(selectedAssignment.state) ? <button type="button" disabled={busy || reviewers.find((item) => item.name === selectedReviewer)?.conflict} onClick={() => assignReviewer(selectedAssignment)} className="mt-4 min-h-10 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Xác nhận phân công</button> : <p className="mt-4 text-xs font-semibold text-slate-500">Hồ sơ đang ở Reviewer hoặc đã hoàn tất; chỉ phân lại khi có conflict/từ chối.</p>}</aside></section><WorkspaceActivityTimeline scope="manager" entityCode={selectedAssignment.code} />
      </>}

      {view === "projects" && <><WorkspaceViewHeader eyebrow="Dự án chương trình" title="Theo dõi danh mục dự án" tone="cyan" description="Điều phối nhìn cross-project để phát hiện rủi ro và handoff, nhưng không sửa milestone nghiên cứu thay Nhà nghiên cứu." /><section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{programmeProjects.map((project) => <article key={project.id} className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={project.state === "AT_RISK" ? "red" : project.state === "PAUSED" ? "amber" : project.state === "COMPLETED" ? "green" : "cyan"}>{project.state === "AT_RISK" ? "Cần chú ý" : project.state === "PAUSED" ? "Tạm dừng" : project.state === "COMPLETED" ? "Hoàn tất" : "Đang triển khai"}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{project.code}</span></div><h2 className="mt-3 text-base font-bold leading-6 text-slate-950 dark:text-white">{project.title}</h2><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-cyan-700" style={{ width: `${project.progress}%` }} /></div><span className="mt-2 block text-xs font-bold text-slate-500">{project.progress}%</span><div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">{project.next}</div></article>)}</section></>}

      {view === "reports" && <>
        <WorkspaceViewHeader eyebrow="Báo cáo tiến độ" title="Hàng đợi báo cáo" tone="cyan" description="Điều phối đọc báo cáo, trả lại kèm yêu cầu rõ ràng hoặc xác nhận đã xử lý. Không trộn dữ liệu tài chính vào luồng này." />
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="divide-y divide-card-border">{reportItems.map((item) => <button key={item.id} type="button" onClick={() => setSelectedReportCode(item.code)} className={`grid w-full gap-3 px-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center ${selectedReport.code === item.code ? "rounded-xl bg-cyan-50 dark:bg-cyan-950/20" : ""}`}><div><div className="flex gap-2"><WorkspaceStatus tone={reportMeta(item.state).tone}>{reportMeta(item.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><strong className="mt-2 block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.period} · {item.owner} · tiến độ {item.progress}%</span></div><span className="text-sm font-bold text-cyan-700">Xử lý →</span></button>)}</div></div><aside className="h-fit rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={reportMeta(selectedReport.state).tone}>{reportMeta(selectedReport.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selectedReport.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{selectedReport.title}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Kỳ báo cáo</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{selectedReport.period}</strong></div><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Tiến độ mô tả</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{selectedReport.progress}%</strong></div></div>{["PENDING", "OVERDUE", "RETURNED"].includes(selectedReport.state) && <><label htmlFor="report-note-v2" className="mt-4 block text-xs font-bold text-slate-500">Ghi chú khi trả lại</label><textarea id="report-note-v2" rows={4} value={reportNote} onChange={(event) => setReportNote(event.target.value)} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm dark:bg-slate-950" /><div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={() => updateReport(selectedReport, "APPROVED")} className="min-h-10 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white disabled:opacity-60">Xác nhận báo cáo</button><button type="button" disabled={busy || reportNote.trim().length < 15} onClick={() => updateReport(selectedReport, "RETURNED")} className="min-h-10 rounded-lg border border-amber-300 px-4 text-sm font-bold text-amber-800 disabled:opacity-50 dark:border-amber-800 dark:text-amber-200">Trả lại chỉnh sửa</button></div></>}</aside></section>
      </>}

      {createOpportunityOpen && <WorkspaceTaskDialog title="Tạo cơ hội nghiên cứu" eyebrow="Bản nháp cơ hội" tone="blue" onClose={() => setCreateOpportunityOpen(false)} footer={<><button type="button" onClick={() => setCreateOpportunityOpen(false)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Hủy</button><button type="button" disabled={!opTitle.trim() || !opField.trim() || !opClose} onClick={createOpportunity} className="min-h-10 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white disabled:opacity-50">Lưu bản nháp</button></>}><div className="space-y-4"><div><label htmlFor="manager-op-title" className="text-sm font-bold text-slate-900 dark:text-white">Tên cơ hội</label><input id="manager-op-title" value={opTitle} onChange={(event) => setOpTitle(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 dark:bg-slate-950" /></div><div><label htmlFor="manager-op-field" className="text-sm font-bold text-slate-900 dark:text-white">Lĩnh vực</label><input id="manager-op-field" value={opField} onChange={(event) => setOpField(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 dark:bg-slate-950" /></div><div><label htmlFor="manager-op-close" className="text-sm font-bold text-slate-900 dark:text-white">Hạn nhận hồ sơ</label><input id="manager-op-close" type="date" value={opClose} onChange={(event) => setOpClose(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 dark:bg-slate-950" /></div></div></WorkspaceTaskDialog>}
    </main>
  );
}
