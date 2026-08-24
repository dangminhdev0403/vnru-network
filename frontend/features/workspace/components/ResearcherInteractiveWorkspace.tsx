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

type ResearcherView = "overview" | "knowledge" | "collaboration" | "projects" | "academic";
type ProposalState = "DRAFT" | "WAITING_PARTNER" | "WAITING_ORG" | "NEEDS_INFO" | "SUBMITTED" | "SCREENING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "WITHDRAWN";
type ProjectState = "PLANNED" | "ACTIVE" | "AT_RISK" | "PAUSED" | "COMPLETED";
type AcademicState = "OPEN" | "REGISTERED" | "WAITLIST" | "CLOSED";

type Proposal = { id: string; code: string; title: string; field: string; vnOrg: string; ruOrg: string; partner: string; state: ProposalState; next: string; updated: string };
type Project = { id: string; code: string; title: string; partner: string; progress: number; state: ProjectState; milestone: string; due: string };
type KnowledgeItem = { id: string; type: string; title: string; meta: string; status: string };
type AcademicItem = { id: string; title: string; date: string; place: string; state: AcademicState; detail: string };

const views = new Set<ResearcherView>(["overview", "knowledge", "collaboration", "projects", "academic"]);

const initialProposals: Proposal[] = [
  { id: "p01", code: "RU-VN-DRAFT-07", title: "Cảm biến quang học cho môi trường biển nhiệt đới", field: "Cảm biến", vnOrg: "VAST", ruOrg: "Chưa chọn", partner: "Chưa có", state: "DRAFT", next: "Hoàn thiện mục tiêu và nhóm dự kiến", updated: "Hôm nay" },
  { id: "p02", code: "RU-VN-2026-NANO-01", title: "Độ bền vật liệu Nano-composite trong môi trường biển nhiệt đới", field: "Vật liệu mới", vnOrg: "Viện Hải dương học", ruOrg: "FEB RAS", partner: "Prof. Elena Kurchatova", state: "WAITING_ORG", next: "Gửi tổ chức xác nhận phạm vi tham gia", updated: "12 phút trước" },
  { id: "p03", code: "RU-VN-2026-AI-04", title: "Mô hình AI dự báo sớm tai biến địa chất ven biển", field: "AI & Địa chất", vnOrg: "VAST", ruOrg: "MISIS", partner: "Dr. Pavel Antonov", state: "NEEDS_INFO", next: "Bổ sung mô tả nguồn dữ liệu dùng chung", updated: "1 giờ trước" },
  { id: "p04", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", field: "Sinh học biển", vnOrg: "IMER", ruOrg: "POI RAS", partner: "Dr. Irina Volkova", state: "IN_REVIEW", next: "Chờ kết quả phản biện", updated: "Hôm qua" },
  { id: "p05", code: "RU-VN-2026-DATA-05", title: "Chuẩn hóa dữ liệu quan trắc ven bờ Việt Nam – Liên bang Nga", field: "Dữ liệu khoa học", vnOrg: "VAST", ruOrg: "FEB RAS", partner: "Dr. Alexey Morozov", state: "SCREENING", next: "Điều phối đang sàng lọc hồ sơ", updated: "Hôm qua" },
  { id: "p06", code: "RU-VN-2026-ROBOT-03", title: "Robot tự hành lấy mẫu vùng nước nông", field: "Robot biển", vnOrg: "ĐHQG TP.HCM", ruOrg: "FESTU", partner: "Chưa xác nhận", state: "WAITING_PARTNER", next: "Xác nhận nhóm phối hợp phía Liên bang Nga", updated: "2 ngày trước" },
  { id: "p07", code: "RU-VN-2026-BIO-08", title: "Khảo sát đa dạng sinh học vùng biển chuyển tiếp Việt – Nga", field: "Sinh học biển", vnOrg: "VAST", ruOrg: "FEB RAS", partner: "Prof. S. Orlov", state: "APPROVED", next: "Theo dõi dự án đã hình thành", updated: "4 ngày trước" },
  { id: "p08", code: "RU-VN-2026-GEO-09", title: "Đối chiếu trầm tích vùng cửa sông nhiệt đới", field: "Địa chất biển", vnOrg: "IMER", ruOrg: "POI RAS", partner: "Dr. D. Sokolov", state: "SUBMITTED", next: "Chờ tiếp nhận sàng lọc", updated: "5 ngày trước" },
  { id: "p09", code: "RU-VN-2025-SEA-11", title: "Phân tích ảnh vệ tinh vùng nước ven bờ", field: "Viễn thám", vnOrg: "VAST", ruOrg: "IKI RAS", partner: "Dr. A. Petrov", state: "REJECTED", next: "Xem lý do và tạo phiên bản mới nếu cần", updated: "12 ngày trước" },
  { id: "p10", code: "RU-VN-2025-CHEM-06", title: "Trao đổi dữ liệu hóa học nước biển", field: "Hóa học biển", vnOrg: "VAST", ruOrg: "FEB RAS", partner: "Dr. M. Ivanova", state: "WITHDRAWN", next: "Hồ sơ đã thu hồi", updated: "20 ngày trước" },
];

const initialProjects: Project[] = [
  { id: "pr1", code: "RU-VN-2026-BIO-08", title: "Khảo sát đa dạng sinh học vùng biển chuyển tiếp Việt – Nga", partner: "FEB RAS", progress: 75, state: "ACTIVE", milestone: "Đối chiếu dữ liệu mẫu VN–RU", due: "30/09/2026" },
  { id: "pr2", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", partner: "POI RAS", progress: 48, state: "AT_RISK", milestone: "Bổ sung bộ dữ liệu tháng 8", due: "28/08/2026" },
  { id: "pr3", code: "RU-VN-2026-SENSOR-02", title: "Mạng cảm biến độ mặn phục vụ quan trắc ven bờ", partner: "FESTU", progress: 20, state: "ACTIVE", milestone: "Hiệu chỉnh cảm biến đợt 1", due: "15/10/2026" },
  { id: "pr4", code: "RU-VN-2026-ALG-01", title: "Đối chiếu mẫu tảo biển nhiệt đới", partner: "FEB RAS", progress: 0, state: "PLANNED", milestone: "Khởi động nhóm nghiên cứu", due: "01/11/2026" },
  { id: "pr5", code: "RU-VN-2025-GEO-04", title: "Bản đồ trầm tích cửa sông so sánh", partner: "POI RAS", progress: 62, state: "PAUSED", milestone: "Chờ bổ sung dữ liệu khảo sát", due: "Chưa xác định" },
  { id: "pr6", code: "RU-VN-2024-DATA-07", title: "Chuẩn hóa metadata dữ liệu hải dương học", partner: "FEB RAS", progress: 100, state: "COMPLETED", milestone: "Đã hoàn tất", due: "12/12/2025" },
];

const knowledgeItems: KnowledgeItem[] = [
  { id: "k1", type: "Công bố", title: "Nano-composite chịu ăn mòn trong môi trường biển nhiệt đới", meta: "Q1 · 2026 · Vật liệu", status: "Đã công bố" },
  { id: "k2", type: "Bộ dữ liệu", title: "Chuỗi quan trắc độ mặn và nhiệt độ Hòn Mun 2024–2026", meta: "Hải dương học · 8.2 GB", status: "Đã chia sẻ" },
  { id: "k3", type: "Bản thảo", title: "Biến tính bề mặt silica cho lớp phủ composite", meta: "Đồng tác giả VN–RU", status: "Bản nháp" },
  { id: "k4", type: "Notebook", title: "Pipeline tiền xử lý ảnh sinh vật phù du", meta: "Python · nghiên cứu nội bộ", status: "Đang cập nhật" },
  { id: "k5", type: "Bộ dữ liệu", title: "Ảnh đáy biển vùng chuyển tiếp Nha Trang", meta: "Sinh học biển · 4.1 GB", status: "Hạn chế" },
  { id: "k6", type: "Công bố", title: "So sánh mô hình lan truyền trầm tích cửa sông", meta: "2025 · Địa chất biển", status: "Đã công bố" },
  { id: "k7", type: "Ghi chú", title: "Biên bản seminar vật liệu biển VN–RU", meta: "05/08/2026", status: "Nội bộ" },
  { id: "k8", type: "Chủ đề", title: "Vật liệu mới & công nghệ chế tạo", meta: "18 chuyên gia liên quan", status: "Theo dõi" },
  { id: "k9", type: "Bản thảo", title: "Đánh giá độ ổn định cảm biến quang học", meta: "Đang phản biện nội bộ", status: "Cần sửa" },
  { id: "k10", type: "Bộ dữ liệu", title: "Dữ liệu thử nghiệm gia tốc lớp phủ", meta: "Vật liệu · 1.7 GB", status: "Đã chia sẻ" },
];

const academicItems: AcademicItem[] = [
  { id: "a1", title: "VN–RU Marine Materials Workshop", date: "05–09/09/2026", place: "Nha Trang · Hybrid", state: "OPEN", detail: "Workshop về vật liệu biển và thử nghiệm môi trường." },
  { id: "a2", title: "Seminar FEB RAS: Deep-sea Biofouling", date: "18/10/2026", place: "Vladivostok · Online", state: "REGISTERED", detail: "Seminar trực tuyến kết nối nhóm sinh học biển hai phía." },
  { id: "a3", title: "Trao đổi nhóm nghiên cứu vật liệu biển", date: "11–20/11/2026", place: "MISIS · Moskva", state: "WAITLIST", detail: "Kế hoạch trao đổi học thuật đang chờ xác nhận suất tham gia." },
  { id: "a4", title: "Data Harmonization Clinic", date: "25/09/2026", place: "Online", state: "OPEN", detail: "Phiên làm việc về metadata và khả năng tái sử dụng dữ liệu." },
  { id: "a5", title: "Young Researchers Poster Session", date: "02/10/2026", place: "Hà Nội", state: "OPEN", detail: "Phiên poster cho nghiên cứu viên trẻ trong mạng lưới." },
  { id: "a6", title: "Coastal AI Methods Seminar", date: "14/08/2026", place: "Online", state: "CLOSED", detail: "Sự kiện đã kết thúc, chỉ còn tài liệu xem lại." },
];

function proposalMeta(state: ProposalState): { label: string; tone: WorkspaceTone } {
  const map: Record<ProposalState, { label: string; tone: WorkspaceTone }> = {
    DRAFT: { label: "Bản nháp", tone: "slate" }, WAITING_PARTNER: { label: "Chờ đối tác", tone: "amber" }, WAITING_ORG: { label: "Chờ tổ chức", tone: "amber" }, NEEDS_INFO: { label: "Cần bổ sung", tone: "red" }, SUBMITTED: { label: "Đã gửi", tone: "blue" }, SCREENING: { label: "Đang sàng lọc", tone: "cyan" }, IN_REVIEW: { label: "Đang phản biện", tone: "purple" }, APPROVED: { label: "Đã chấp thuận", tone: "green" }, REJECTED: { label: "Không chấp thuận", tone: "red" }, WITHDRAWN: { label: "Đã thu hồi", tone: "slate" },
  };
  return map[state];
}

function projectMeta(state: ProjectState): { label: string; tone: WorkspaceTone } {
  if (state === "ACTIVE") return { label: "Đang triển khai", tone: "blue" };
  if (state === "AT_RISK") return { label: "Cần chú ý", tone: "red" };
  if (state === "PAUSED") return { label: "Tạm dừng", tone: "amber" };
  if (state === "COMPLETED") return { label: "Hoàn tất", tone: "green" };
  return { label: "Dự kiến", tone: "slate" };
}

export function ResearcherInteractiveWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian nghiên cứu…</div>}><ResearcherWorkspaceContent /></React.Suspense>;
}

function ResearcherWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as ResearcherView | null;
  const view: ResearcherView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const decisionHandoffs = useDemoHandoffs("researcher");
  const [proposalOverrides, setProposalOverrides] = React.useState<Record<string, ProposalState>>({});
  const [projectOverrides, setProjectOverrides] = React.useState<Record<string, ProjectState>>({});
  const [selectedProposalCode, setSelectedProposalCode] = React.useState("RU-VN-2026-NANO-01");
  const [selectedProjectCode, setSelectedProjectCode] = React.useState("RU-VN-2026-BIO-08");
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("ACTION");
  const [projectFilter, setProjectFilter] = React.useState("ALL");
  const [knowledgeQuery, setKnowledgeQuery] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [createDialog, setCreateDialog] = React.useState(false);
  const [draftTitle, setDraftTitle] = React.useState("");
  const [draftField, setDraftField] = React.useState("");
  const [academicOverrides, setAcademicOverrides] = React.useState<Record<string, AcademicState>>({});

  const dynamicProjects: Project[] = decisionHandoffs.filter((item) => item.stage === "PROJECT_APPROVED" && !initialProjects.some((project) => project.code === item.entityCode)).map((item) => ({ id: item.id, code: item.entityCode, title: item.title, partner: "Đối tác VN–RU", progress: 0, state: "PLANNED", milestone: "Khởi động dự án sau quyết định", due: "Chưa đặt" }));
  const proposals = initialProposals.map((item) => ({ ...item, state: proposalOverrides[item.code] ?? item.state }));
  const projects = [...dynamicProjects, ...initialProjects].map((item) => ({ ...item, state: projectOverrides[item.code] ?? item.state }));
  const selectedProposal = proposals.find((item) => item.code === selectedProposalCode) ?? proposals[0];
  const selectedProject = projects.find((item) => item.code === selectedProjectCode) ?? projects[0];
  const actionStates: ProposalState[] = ["DRAFT", "WAITING_PARTNER", "WAITING_ORG", "NEEDS_INFO"];
  const normalizedQuery = query.trim().toLocaleLowerCase("vi");
  const filteredProposals = proposals.filter((item) => (!normalizedQuery || `${item.code} ${item.title} ${item.field}`.toLocaleLowerCase("vi").includes(normalizedQuery)) && (filter === "ALL" || filter === "ACTION" ? (filter === "ALL" || actionStates.includes(item.state)) : item.state === filter));
  const filteredProjects = projects.filter((item) => projectFilter === "ALL" || item.state === projectFilter);
  const filteredKnowledge = knowledgeItems.filter((item) => !knowledgeQuery.trim() || `${item.title} ${item.type} ${item.meta}`.toLocaleLowerCase("vi").includes(knowledgeQuery.trim().toLocaleLowerCase("vi")));
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2800); };

  const mutate = async (action: string, detail: string, after: () => void, options?: Parameters<typeof commitDemoMutation>[3]) => {
    setBusy(true); await commitDemoMutation("researcher", action, detail, options); after(); setBusy(false); showToast(`${action} · trạng thái preview đã cập nhật.`);
  };

  const requestOrganizationEndorsement = (proposal: Proposal) => {
    void mutate("Đã gửi yêu cầu xác nhận tổ chức", `${proposal.code} · ${proposal.title}`, () => setProposalOverrides((current) => ({ ...current, [proposal.code]: "WAITING_ORG" })), {
      notifications: [{ scope: "organization", title: "Có đề xuất cần tổ chức xác nhận", detail: `${proposal.code} cần xác nhận phạm vi đơn vị và nguồn lực.`, href: "/workspace/organization?view=endorsements" }],
      handoffs: [{ to: "organization", entityCode: proposal.code, title: proposal.title, stage: "ORG_ENDORSEMENT_REQUEST" }],
    });
  };

  const resubmitInformation = (proposal: Proposal) => {
    void mutate("Đã bổ sung và gửi lại hồ sơ", `${proposal.code} · bổ sung dữ liệu theo yêu cầu`, () => setProposalOverrides((current) => ({ ...current, [proposal.code]: "SUBMITTED" })), {
      notifications: [{ scope: "manager", title: "Hồ sơ đã bổ sung thông tin", detail: `${proposal.code} sẵn sàng được sàng lọc lại.`, href: "/workspace/collaboration?view=screening" }],
      handoffs: [{ to: "manager", entityCode: proposal.code, title: proposal.title, stage: "PROPOSAL_RESUBMITTED" }],
    });
  };

  const confirmPartner = (proposal: Proposal) => {
    void mutate("Đã xác nhận nhóm phối hợp", `${proposal.code} · đối tác dự kiến đã được xác nhận`, () => setProposalOverrides((current) => ({ ...current, [proposal.code]: "WAITING_ORG" })));
  };

  const createDraft = () => {
    if (!draftTitle.trim() || !draftField.trim()) return;
    showToast("Đã tạo bản nháp mới trong phiên preview."); setCreateDialog(false); setDraftTitle(""); setDraftField("");
  };

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Nhà nghiên cứu" />
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-blue-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md">{toast}</div>}

      {view === "overview" && <>
        <WorkspaceViewHeader eyebrow="Không gian nhà nghiên cứu" title="Bàn công việc nghiên cứu" description="Nhà nghiên cứu tập trung vào đề xuất, hồ sơ cần bổ sung, dự án, tri thức và hoạt động học thuật. Dashboard ưu tiên việc cần làm chứ không chỉ hiển thị số liệu." action={<Link href="/workspace/researcher?view=collaboration" className="inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800">Mở đề xuất & cộng tác →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><WorkspaceMetric value={String(proposals.filter((item) => actionStates.includes(item.state)).length).padStart(2, "0")} label="Cần tôi xử lý" detail="Bản nháp, đối tác, tổ chức hoặc bổ sung" href="/workspace/researcher?view=collaboration&status=ACTION" /><WorkspaceMetric value={String(projects.filter((item) => item.state === "AT_RISK").length).padStart(2, "0")} label="Dự án cần chú ý" detail="Mốc tiến độ đang có rủi ro" href="/workspace/researcher?view=projects&status=AT_RISK" tone="red" /><WorkspaceMetric value={String(proposals.filter((item) => item.state === "IN_REVIEW").length).padStart(2, "0")} label="Đang phản biện" detail="Chỉ theo dõi, chưa có action" href="/workspace/researcher?view=collaboration&status=IN_REVIEW" tone="purple" /><WorkspaceMetric value={String(academicItems.filter((item) => item.state === "OPEN").length).padStart(2, "0")} label="Hoạt động đang mở" detail="Workshop, seminar và phiên trao đổi" href="/workspace/researcher?view=academic" tone="green" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-end justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc cần làm tiếp theo</h2><p className="mt-1 text-sm text-slate-500">Tác vụ thuộc quyền của Nhà nghiên cứu, không lẫn việc của Reviewer hay Điều phối.</p></div><WorkspaceStatus tone="amber">{proposals.filter((item) => actionStates.includes(item.state)).length} việc</WorkspaceStatus></div><div className="divide-y divide-card-border">{proposals.filter((item) => actionStates.includes(item.state)).slice(0, 5).map((item) => <Link key={item.id} href="/workspace/researcher?view=collaboration" onClick={() => setSelectedProposalCode(item.code)} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code} · {item.next}</span></div><WorkspaceStatus tone={proposalMeta(item.state).tone}>{proposalMeta(item.state).label}</WorkspaceStatus></Link>)}</div></div><WorkspaceNotificationPanel scope="researcher" seed={[{ id: "r-n1", title: "AI-04 cần bổ sung", detail: "Điều phối yêu cầu làm rõ nguồn dữ liệu dùng chung.", href: "/workspace/researcher?view=collaboration", createdAt: "2026-08-24T10:00:00+07:00" }, { id: "r-n2", title: "OCEAN-03 có mốc gần hạn", detail: "Bổ sung bộ dữ liệu tháng 8 trước 28/08.", href: "/workspace/researcher?view=projects&status=AT_RISK", createdAt: "2026-08-24T08:20:00+07:00" }]} /></section>
      </>}

      {view === "collaboration" && <>
        <WorkspaceViewHeader eyebrow="Cộng tác nghiên cứu" title="Đề xuất & ghép nhóm song phương" description="Collection-first: tìm và lọc đề xuất, chọn hồ sơ để xem readiness, rồi chỉ hiện action phù hợp với trạng thái của Nhà nghiên cứu." action={<button type="button" onClick={() => setCreateDialog(true)} className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white">+ Soạn đề xuất mới</button>} />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><WorkspaceCollectionToolbar query={query} onQueryChange={setQuery} placeholder="Tìm mã, tên đề xuất hoặc lĩnh vực…" activeFilter={filter} onFilterChange={setFilter} filters={[{ value: "ACTION", label: "Cần tôi xử lý", count: proposals.filter((item) => actionStates.includes(item.state)).length }, { value: "IN_REVIEW", label: "Đang phản biện", count: proposals.filter((item) => item.state === "IN_REVIEW").length }, { value: "APPROVED", label: "Đã chấp thuận", count: proposals.filter((item) => item.state === "APPROVED").length }, { value: "REJECTED", label: "Không chấp thuận", count: proposals.filter((item) => item.state === "REJECTED").length }, { value: "ALL", label: "Tất cả", count: proposals.length }]} /><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]"><div className="divide-y divide-card-border">{filteredProposals.length ? filteredProposals.map((item) => <button key={item.id} type="button" onClick={() => setSelectedProposalCode(item.code)} aria-pressed={selectedProposal.code === item.code} className={`grid w-full gap-3 px-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center ${selectedProposal.code === item.code ? "rounded-xl bg-blue-50 dark:bg-blue-950/20" : ""}`}><div><div className="flex flex-wrap gap-2"><WorkspaceStatus tone={proposalMeta(item.state).tone}>{proposalMeta(item.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><strong className="mt-2 block text-sm leading-6 text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.vnOrg} ↔ {item.ruOrg} · {item.updated}</span></div><span className="text-sm font-bold text-blue-700 dark:text-blue-300">Mở hồ sơ →</span></button>) : <WorkspaceEmptyState title="Không có đề xuất phù hợp" detail="Thử đổi bộ lọc hoặc từ khóa tìm kiếm." />}</div><aside className="h-fit rounded-2xl border border-card-border bg-slate-50 p-5 dark:bg-slate-950/50"><div className="flex flex-wrap items-center justify-between gap-2"><WorkspaceStatus tone={proposalMeta(selectedProposal.state).tone}>{proposalMeta(selectedProposal.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selectedProposal.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{selectedProposal.title}</h2><p className="mt-2 text-sm text-slate-500">Đối tác: {selectedProposal.partner}</p><div className="mt-4"><WorkspaceWorkflowStepper steps={[{ label: "Soạn đề xuất", state: selectedProposal.state === "DRAFT" ? "current" : "done" }, { label: "Ghép nhóm", state: selectedProposal.state === "WAITING_PARTNER" ? "current" : selectedProposal.state === "DRAFT" ? "waiting" : "done" }, { label: "Tổ chức xác nhận", state: selectedProposal.state === "WAITING_ORG" ? "current" : ["DRAFT", "WAITING_PARTNER"].includes(selectedProposal.state) ? "waiting" : "done" }, { label: "Sàng lọc", state: selectedProposal.state === "NEEDS_INFO" ? "blocked" : selectedProposal.state === "SCREENING" || selectedProposal.state === "SUBMITTED" ? "current" : ["IN_REVIEW", "APPROVED", "REJECTED"].includes(selectedProposal.state) ? "done" : "waiting" }, { label: "Phản biện", state: selectedProposal.state === "IN_REVIEW" ? "current" : ["APPROVED", "REJECTED"].includes(selectedProposal.state) ? "done" : "waiting" }, { label: "Quyết định", state: ["APPROVED", "REJECTED"].includes(selectedProposal.state) ? "done" : "waiting" }]} /></div><div className="mt-5 rounded-xl border border-card-border bg-white p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Bước tiếp theo</span><strong className="mt-1 block text-sm leading-6 text-slate-900 dark:text-white">{selectedProposal.next}</strong></div><div className="mt-5 flex flex-wrap gap-2">{selectedProposal.state === "DRAFT" && <button type="button" className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white">Tiếp tục hoàn thiện</button>}{selectedProposal.state === "WAITING_PARTNER" && <button type="button" disabled={busy} onClick={() => confirmPartner(selectedProposal)} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-60">Xác nhận nhóm phối hợp</button>}{selectedProposal.state === "WAITING_ORG" && <button type="button" disabled={busy} onClick={() => requestOrganizationEndorsement(selectedProposal)} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-60">Gửi tổ chức xác nhận</button>}{selectedProposal.state === "NEEDS_INFO" && <button type="button" disabled={busy} onClick={() => resubmitInformation(selectedProposal)} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-60">Bổ sung & gửi lại</button>}{selectedProposal.state === "APPROVED" && <Link href="/workspace/researcher?view=projects" className="inline-flex min-h-10 items-center rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white">Mở dự án liên quan →</Link>}{["SUBMITTED", "SCREENING", "IN_REVIEW"].includes(selectedProposal.state) && <p className="text-xs font-semibold text-slate-500">Hồ sơ đang ở bước của role khác; Nhà nghiên cứu chỉ theo dõi.</p>}</div></aside></div></section><WorkspaceActivityTimeline scope="researcher" entityCode={selectedProposal.code} seed={[{ id: `${selectedProposal.code}-created`, title: "Đề xuất được tạo", detail: `${selectedProposal.code} được tạo trong không gian Nhà nghiên cứu.`, createdAt: "2026-08-20T09:00:00+07:00", tone: "blue" }]} />
      </>}

      {view === "projects" && <>
        <WorkspaceViewHeader eyebrow="Dự án của tôi" title="Danh sách dự án & mốc tiến độ" description="Không mở thẳng một dự án cố định. Chọn dự án theo trạng thái để xem milestone, rủi ro và action cập nhật thuộc quyền Nhà nghiên cứu." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex flex-wrap gap-2 border-b border-card-border pb-4">{(["ALL", "ACTIVE", "AT_RISK", "PLANNED", "PAUSED", "COMPLETED"] as const).map((value) => <button key={value} type="button" onClick={() => setProjectFilter(value)} aria-pressed={projectFilter === value} className={`min-h-10 rounded-lg border px-3 text-sm font-bold ${projectFilter === value ? "border-blue-700 bg-blue-700 text-white" : "border-card-border text-slate-700 dark:text-slate-200"}`}>{value === "ALL" ? `Tất cả (${projects.length})` : `${projectMeta(value).label} (${projects.filter((item) => item.state === value).length})`}</button>)}</div><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]"><div className="grid gap-4 lg:grid-cols-2">{filteredProjects.map((project) => <button key={project.id} type="button" onClick={() => setSelectedProjectCode(project.code)} className={`rounded-2xl border p-5 text-left ${selectedProject.code === project.code ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-card-border"}`}><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={projectMeta(project.state).tone}>{projectMeta(project.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{project.code}</span></div><strong className="mt-3 block text-base leading-6 text-slate-950 dark:text-white">{project.title}</strong><span className="mt-2 block text-xs text-slate-500">Đối tác {project.partner} · mốc {project.due}</span><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-blue-700" style={{ width: `${project.progress}%` }} /></div><span className="mt-2 block text-xs font-bold text-slate-500">{project.progress}%</span></button>)}</div><aside className="h-fit rounded-2xl border border-card-border bg-slate-50 p-5 dark:bg-slate-950/50"><div className="flex flex-wrap items-center justify-between gap-2"><WorkspaceStatus tone={projectMeta(selectedProject.state).tone}>{projectMeta(selectedProject.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selectedProject.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{selectedProject.title}</h2><div className="mt-4 rounded-xl border border-card-border bg-white p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Mốc hiện tại</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{selectedProject.milestone}</strong><span className="mt-1 block text-xs text-slate-500">Hạn {selectedProject.due}</span></div>{["ACTIVE", "AT_RISK"].includes(selectedProject.state) && <div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={() => void mutate("Đã cập nhật mốc tiến độ", `${selectedProject.code} · ${selectedProject.milestone}`, () => setProjectOverrides((current) => ({ ...current, [selectedProject.code]: "ACTIVE" })))} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-60">Cập nhật mốc</button><button type="button" className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Soạn báo cáo tiến độ</button></div>}{selectedProject.state === "PAUSED" && <p className="mt-4 text-xs font-semibold text-amber-800 dark:text-amber-200">Dự án đang tạm dừng; cập nhật milestone bị khóa cho đến khi được tiếp tục.</p>}{selectedProject.state === "COMPLETED" && <p className="mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300">Dự án đã hoàn tất; nội dung chuyển sang chỉ đọc.</p>}</aside></div></section><WorkspaceActivityTimeline scope="researcher" entityCode={selectedProject.code} />
      </>}

      {view === "knowledge" && <><WorkspaceViewHeader eyebrow="Tri thức của tôi" title="Kho tri thức nghiên cứu" description="Tìm và mở nhiều loại tài sản tri thức: công bố, dữ liệu, bản thảo, notebook và ghi chú. Trạng thái chia sẻ khác nhau để kiểm tra UI." /><section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><label className="relative block max-w-xl"><span className="sr-only">Tìm tri thức</span><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400" aria-hidden="true">search</span><input type="search" value={knowledgeQuery} onChange={(event) => setKnowledgeQuery(event.target.value)} placeholder="Tìm công bố, dữ liệu, bản thảo…" className="min-h-11 w-full rounded-xl border border-card-border bg-white pl-10 pr-3 text-sm dark:bg-slate-950" /></label><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredKnowledge.map((item) => <article key={item.id} className="rounded-xl border border-card-border p-4"><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={item.status === "Cần sửa" ? "red" : item.status === "Bản nháp" || item.status === "Nội bộ" ? "slate" : "green"}>{item.status}</WorkspaceStatus><span className="text-xs font-bold text-slate-500">{item.type}</span></div><h2 className="mt-3 text-sm font-bold leading-6 text-slate-900 dark:text-white">{item.title}</h2><p className="mt-2 text-xs text-slate-500">{item.meta}</p><button type="button" className="mt-4 min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Mở chi tiết</button></article>)}</div></section></>}

      {view === "academic" && <><WorkspaceViewHeader eyebrow="Học thuật & trao đổi" title="Hoạt động học thuật" description="Sự kiện có trạng thái mở, đã đăng ký, danh sách chờ và đã đóng; action đăng ký chỉ xuất hiện ở trường hợp phù hợp." /><section className="grid gap-4 lg:grid-cols-2">{academicItems.map((item) => { const state = academicOverrides[item.id] ?? item.state; return <article key={item.id} className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={state === "OPEN" ? "green" : state === "REGISTERED" ? "blue" : state === "WAITLIST" ? "amber" : "slate"}>{state === "OPEN" ? "Đang mở" : state === "REGISTERED" ? "Đã đăng ký" : state === "WAITLIST" ? "Danh sách chờ" : "Đã đóng"}</WorkspaceStatus><span className="text-xs font-bold text-slate-500">{item.date}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.place}</p><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>{state === "OPEN" && <button type="button" onClick={() => { setAcademicOverrides((current) => ({ ...current, [item.id]: "REGISTERED" })); showToast(`Đã đăng ký ${item.title}.`); }} className="mt-4 min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white">Đăng ký tham gia</button>}{state === "REGISTERED" && <button type="button" onClick={() => setAcademicOverrides((current) => ({ ...current, [item.id]: "OPEN" }))} className="mt-4 min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Hủy đăng ký</button>}</article>; })}</section></>}

      {createDialog && <WorkspaceTaskDialog title="Soạn đề xuất nghiên cứu" eyebrow="Bản nháp mới" tone="blue" onClose={() => setCreateDialog(false)} footer={<><button type="button" onClick={() => setCreateDialog(false)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Hủy</button><button type="button" disabled={!draftTitle.trim() || !draftField.trim()} onClick={createDraft} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-50">Tạo bản nháp</button></>}><div className="space-y-4"><div><label htmlFor="researcher-draft-title" className="text-sm font-bold text-slate-900 dark:text-white">Tên đề xuất</label><input id="researcher-draft-title" value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 dark:bg-slate-950" /></div><div><label htmlFor="researcher-draft-field" className="text-sm font-bold text-slate-900 dark:text-white">Lĩnh vực</label><input id="researcher-draft-field" value={draftField} onChange={(event) => setDraftField(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 dark:bg-slate-950" /></div><p className="text-xs leading-5 text-slate-500">Bản nháp chưa chuyển sang role khác cho đến khi nhóm phối hợp và tổ chức được xác nhận.</p></div></WorkspaceTaskDialog>}
    </main>
  );
}
