"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DemoActivityPanel } from "@/features/prototype-v3/components/DemoActivityPanel";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { commitDemoMutation } from "@/features/prototype-v3/demo-backend";
import { MOCK_PROPOSALS } from "@/features/prototype-v3/mock-data";
import { WorkspaceTaskDialog } from "./WorkspaceTaskDialog";

type ResearcherView = "overview" | "knowledge" | "collaboration" | "projects" | "academic";
type MilestoneState = "DONE" | "IN_PROGRESS" | "TODO";
type DialogState =
  | { kind: "create-proposal" }
  | { kind: "report-draft" }
  | { kind: "proposal"; id: string }
  | { kind: "knowledge"; id: string }
  | { kind: "project" }
  | { kind: "academic"; id: string }
  | null;

const views = new Set<ResearcherView>(["overview", "knowledge", "collaboration", "projects", "academic"]);

const knowledgeItems = [
  { id: "kn-01", type: "Công bố", title: "Nano-composite chịu ăn mòn trong môi trường biển nhiệt đới", meta: "Q1 · 2026 · Vật liệu", status: "Đã công bố", summary: "Kết quả mẫu về độ bền bề mặt và cơ chế ăn mòn trong điều kiện biển nhiệt đới." },
  { id: "kn-02", type: "Bộ dữ liệu", title: "Chuỗi quan trắc độ mặn và nhiệt độ Hòn Mun 2024–2026", meta: "Dữ liệu nghiên cứu · Hải dương học", status: "Đã chia sẻ", summary: "Bộ dữ liệu minh họa phục vụ đối chiếu điều kiện môi trường giữa các nhóm nghiên cứu." },
  { id: "kn-03", type: "Bản thảo", title: "Biến tính bề mặt silica cho lớp phủ composite", meta: "Đang hoàn thiện · Đồng tác giả VN–RU", status: "Bản nháp", summary: "Bản thảo mẫu đang được nhóm nghiên cứu song phương hoàn thiện trước khi công bố." },
  { id: "kn-04", type: "Chủ đề", title: "Vật liệu mới & công nghệ chế tạo", meta: "18 chuyên gia liên quan", status: "Theo dõi", summary: "Chủ đề kết nối các công bố, chuyên gia và cơ hội cộng tác có liên quan." },
];

const academicItems = [
  { id: "ac-01", date: "05–09/09/2026", title: "VN–RU Marine Materials Workshop", place: "Nha Trang · Hybrid", status: "OPEN", detail: "Workshop minh họa về vật liệu biển và thử nghiệm môi trường." },
  { id: "ac-02", date: "18/10/2026", title: "Seminar FEB RAS: Deep-sea Biofouling", place: "Vladivostok · Online", status: "OPEN", detail: "Seminar trực tuyến minh họa kết nối nhóm nghiên cứu hai phía." },
  { id: "ac-03", date: "11–20/11/2026", title: "Trao đổi nhóm nghiên cứu vật liệu biển", place: "MISIS · Moskva", status: "PLANNED", detail: "Kế hoạch trao đổi học thuật đang ở trạng thái dự kiến trong UI Preview." },
];

function pillClass(tone: "blue" | "green" | "amber" | "slate" | "red") {
  if (tone === "green") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  if (tone === "red") return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300";
  if (tone === "slate") return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300";
}

function StatusPill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "amber" | "slate" | "red" }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${pillClass(tone)}`}>{children}</span>;
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><strong className="block text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</strong><span className="mt-2 block text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span><small className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</small></div>;
}

function ViewHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="flex flex-col gap-5 border-b border-card-border pb-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</header>;
}

export function ResearcherTaskWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian nghiên cứu…</div>}><ResearcherTaskWorkspaceContent /></React.Suspense>;
}

function ResearcherTaskWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as ResearcherView | null;
  const view: ResearcherView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const [toast, setToast] = React.useState<string | null>(null);
  const [alert, setAlert] = React.useState("RU-VN-2026-NANO-01 đang chờ bước ghép đối tác nghiên cứu trước khi có thể gửi đề xuất.");
  const [busy, setBusy] = React.useState(false);
  const [dialog, setDialog] = React.useState<DialogState>(null);
  const [draftCreated, setDraftCreated] = React.useState(false);
  const [draftTitle, setDraftTitle] = React.useState("");
  const [draftField, setDraftField] = React.useState("");
  const [draftPartner, setDraftPartner] = React.useState("");
  const [draftError, setDraftError] = React.useState<string | null>(null);
  const [reportSummary, setReportSummary] = React.useState("Đã hoàn tất chuỗi thử nghiệm gia tốc đầu tiên; nhóm Việt Nam và Liên bang Nga đang đối chiếu dữ liệu mẫu.");
  const [reportSavedAt, setReportSavedAt] = React.useState<string | null>(null);
  const [pairedProposalIds, setPairedProposalIds] = React.useState<string[]>([]);
  const [submittedProposalIds, setSubmittedProposalIds] = React.useState<string[]>([]);
  const [knowledgeQuery, setKnowledgeQuery] = React.useState("");
  const [registeredAcademicIds, setRegisteredAcademicIds] = React.useState<string[]>([]);
  const [milestones, setMilestones] = React.useState<Array<{ id: string; title: string; due: string; state: MilestoneState }>>([
    { id: "m1", title: "Thiết lập quy trình thử nghiệm & mẫu chuẩn", due: "15/05/2026", state: "DONE" },
    { id: "m2", title: "Thử nghiệm gia tốc môi trường biển", due: "30/09/2026", state: "IN_PROGRESS" },
    { id: "m3", title: "Đối chiếu dữ liệu VN–RU & bản thảo công bố", due: "20/12/2026", state: "TODO" },
  ]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  };

  const runAction = async (action: string, detail: string, after?: () => void) => {
    setBusy(true);
    await commitDemoMutation("researcher", action, detail);
    after?.();
    setBusy(false);
    showToast(`${action} · chỉ cập nhật kịch bản demo.`);
  };

  const filteredKnowledge = knowledgeItems.filter((item) => {
    const query = knowledgeQuery.trim().toLocaleLowerCase("vi");
    return !query || `${item.title} ${item.type} ${item.meta}`.toLocaleLowerCase("vi").includes(query);
  });

  const completeCurrentMilestone = () => {
    const current = milestones.find((item) => item.state === "IN_PROGRESS");
    if (!current) return;
    void runAction("Đã cập nhật mốc tiến độ", current.title, () => {
      setMilestones((items) => {
        const currentIndex = items.findIndex((item) => item.id === current.id);
        return items.map((item, index) => {
          if (item.id === current.id) return { ...item, state: "DONE" as const };
          if (index === currentIndex + 1 && item.state === "TODO") return { ...item, state: "IN_PROGRESS" as const };
          return item;
        });
      });
      setAlert("Mốc tiến độ demo đã chuyển trạng thái; kiểm tra mốc kế tiếp trong Dự án của tôi.");
    });
  };

  const createProposalDraft = () => {
    if (!draftTitle.trim() || !draftField.trim() || !draftPartner.trim()) {
      setDraftError("Nhập tên đề xuất, lĩnh vực và đối tác dự kiến để tạo bản nháp demo.");
      return;
    }
    void runAction("Đã tạo bản nháp đề xuất", `RU-VN-DRAFT-NEW · ${draftTitle.trim()}`, () => {
      setDraftCreated(true);
      setDraftError(null);
      setDialog(null);
      setAlert("Bản nháp đề xuất đã xuất hiện trong danh sách; tiếp tục hoàn thiện mục tiêu và nhóm tham gia trong phiên demo.");
    });
  };

  const saveReportDraft = () => {
    if (reportSummary.trim().length < 30) return;
    void runAction("Đã lưu bản nháp báo cáo", "Q2/2026 · RU-VN-2026-BIO-08", () => {
      setReportSavedAt(new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
      setDialog(null);
      setAlert("Bản nháp báo cáo demo đã cập nhật; bước submit thật chỉ khả dụng khi business backend được triển khai.");
    });
  };

  const activeProposal = dialog?.kind === "proposal" ? MOCK_PROPOSALS.find((item) => item.id === dialog.id) : null;
  const activeKnowledge = dialog?.kind === "knowledge" ? knowledgeItems.find((item) => item.id === dialog.id) : null;
  const activeAcademic = dialog?.kind === "academic" ? academicItems.find((item) => item.id === dialog.id) : null;

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Nhà nghiên cứu" />
      {alert && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 sm:flex-row sm:items-center sm:justify-between"><span><strong>Cần chú ý:</strong> {alert}</span><button type="button" onClick={() => setAlert("")} className="text-left font-bold text-blue-800 dark:text-blue-200">Đã hiểu</button></div>}
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-blue-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md"><span className="mr-2 text-xs font-extrabold uppercase tracking-wider text-blue-300">UI Preview</span>{toast}</div>}

      {view === "overview" && <>
        <ViewHeading eyebrow="Không gian nhà nghiên cứu" title="Tổng quan công việc nghiên cứu" description="Ưu tiên việc cần xử lý, theo dõi đề xuất và dự án song phương trong một điểm vào. Dữ liệu bên dưới là kịch bản minh họa, không phải trạng thái backend nghiệp vụ." action={<Link href="/workspace/researcher?view=collaboration" className="inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800">Mở cộng tác nghiên cứu →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric value="02" label="Việc cần phản hồi" detail="Ghép đối tác · hoàn thiện đề xuất" /><Metric value="01" label="Hồ sơ đang phản biện" detail="RU-VN-2026-AI-04" /><Metric value="01" label="Dự án đang triển khai" detail="Mốc 2 đang thực hiện" /><Metric value="03" label="Hoạt động học thuật" detail="2 đang mở · 1 dự kiến" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="flex items-end justify-between gap-4 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc cần làm</h2><p className="mt-1 text-sm text-slate-500">Bấm từng việc để đi đúng màn xử lý.</p></div><StatusPill tone="amber">2 cần xử lý</StatusPill></div><div className="divide-y divide-card-border"><Link href="/workspace/researcher?view=collaboration" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-blue-700" aria-hidden="true">group_add</span><div><strong className="block text-sm text-slate-900 dark:text-white">Hoàn tất ghép đối tác RU-VN-2026-NANO-01</strong><span className="mt-1 block text-xs text-slate-500">Đề xuất chưa đủ điều kiện gửi</span></div><StatusPill tone="amber">Cần hành động</StatusPill></Link><Link href="/workspace/researcher?view=projects" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-blue-700" aria-hidden="true">flag</span><div><strong className="block text-sm text-slate-900 dark:text-white">Cập nhật mốc thử nghiệm gia tốc</strong><span className="mt-1 block text-xs text-slate-500">Hạn minh họa: 30/09/2026</span></div><StatusPill>Đang thực hiện</StatusPill></Link></div></div><aside className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">Handoff hiện tại</p><h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">Researcher → Organization → Manager</h2><p className="mt-3 text-sm leading-6 text-slate-500">Sau khi ghép đối tác và đủ xác nhận tổ chức, Researcher gửi đề xuất; bước tiếp theo trong flow là Điều phối hợp tác sàng lọc hồ sơ.</p></aside></section>
        <DemoActivityPanel scope="researcher" />
      </>}

      {view === "knowledge" && <>
        <ViewHeading eyebrow="Tri thức của tôi" title="Hồ sơ tri thức & kết quả nghiên cứu" description="Quyền hiện tại là xem và khám phá tri thức. Không hiển thị hành động tạo/publish vì capability hiện có chỉ cho phép xem." />
        <section className="grid gap-5 lg:grid-cols-[1fr_320px]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><label htmlFor="knowledge-search" className="text-sm font-bold text-slate-800 dark:text-slate-100">Tìm trong hồ sơ tri thức</label><div className="mt-2 flex items-center gap-3 rounded-xl border border-card-border bg-white px-3 dark:bg-slate-950"><span className="material-symbols-outlined text-slate-400" aria-hidden="true">search</span><input id="knowledge-search" value={knowledgeQuery} onChange={(event) => setKnowledgeQuery(event.target.value)} placeholder="Tên công bố, chủ đề, bộ dữ liệu…" className="min-h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" /></div><div className="mt-5 divide-y divide-card-border">{filteredKnowledge.map((item) => <article key={item.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><StatusPill>{item.type}</StatusPill><StatusPill tone={item.status === "Bản nháp" ? "slate" : "green"}>{item.status}</StatusPill></div><h2 className="mt-3 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.meta}</p></div><button type="button" onClick={() => setDialog({ kind: "knowledge", id: item.id })} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Xem chi tiết</button></article>)}{filteredKnowledge.length === 0 && <div className="py-10 text-center"><span className="material-symbols-outlined text-3xl text-slate-400" aria-hidden="true">search_off</span><p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Không có mục demo phù hợp.</p><button type="button" onClick={() => setKnowledgeQuery("")} className="mt-3 text-sm font-bold text-blue-700 dark:text-blue-300">Xóa tìm kiếm</button></div>}</div></div><aside className="space-y-4"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Phạm vi quyền</p><strong className="mt-2 block text-lg text-slate-950 dark:text-white">knowledge.workspace.view</strong><p className="mt-3 text-xs leading-5 text-slate-500">Đây là quyền xem. Các action biên tập/publish không được giả lập khi chưa có capability tương ứng.</p></div><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Chuyên gia liên quan</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Khám phá các hồ sơ chuyên môn có liên hệ với nội dung đang xem.</p><Link href="/experts" className="mt-4 inline-flex text-sm font-bold text-blue-700 dark:text-blue-300">Khám phá chuyên gia →</Link></div></aside></section>
      </>}

      {view === "collaboration" && <>
        <ViewHeading eyebrow="Cộng tác nghiên cứu" title="Đề xuất & ghép nhóm song phương" description="Mở chi tiết từng hồ sơ để xem hai phía, trạng thái, bước tiếp theo và action hợp lệ trong UI Preview." action={<button type="button" disabled={busy} onClick={() => setDialog({ kind: "create-proposal" })} className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">{draftCreated ? "Chỉnh bản nháp demo" : "+ Soạn đề xuất mới"}</button>} />
        <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="flex items-end justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Danh sách đề xuất</h2><p className="mt-1 text-sm text-slate-500">Chọn “Xem hồ sơ” để mở modal chi tiết.</p></div><span className="text-xs font-bold text-slate-500">{MOCK_PROPOSALS.length + (draftCreated ? 1 : 0)} hồ sơ</span></div><div className="divide-y divide-card-border">{draftCreated && <article className="py-5"><div className="flex flex-wrap items-center gap-2"><StatusPill tone="slate">Bản nháp</StatusPill><span className="font-mono text-xs text-slate-500">RU-VN-DRAFT-NEW</span></div><h3 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{draftTitle}</h3><p className="mt-2 text-sm text-slate-500">{draftField} · Đối tác dự kiến: {draftPartner}</p><button type="button" onClick={() => setDialog({ kind: "create-proposal" })} className="mt-4 min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Tiếp tục soạn</button></article>}{MOCK_PROPOSALS.map((proposal) => { const paired = pairedProposalIds.includes(proposal.id); const submitted = submittedProposalIds.includes(proposal.id); const tone = submitted || proposal.status === "ACTIVE" ? "green" : proposal.status === "PENDING_COPI" && !paired ? "amber" : "blue"; return <article key={proposal.id} className="py-5"><div className="flex flex-wrap items-center gap-2"><StatusPill tone={tone}>{submitted ? "Đã gửi đề xuất demo" : paired && proposal.status === "PENDING_COPI" ? "Đã ghép đối tác demo" : proposal.statusLabel}</StatusPill><span className="font-mono text-xs text-slate-500">{proposal.code}</span></div><h3 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{proposal.title}</h3><p className="mt-2 text-sm text-slate-500">{proposal.vnOrg} ↔ {proposal.ruOrg}</p><button type="button" onClick={() => setDialog({ kind: "proposal", id: proposal.id })} className="mt-4 min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Xem hồ sơ</button></article>; })}</div></div><aside className="space-y-4"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">Readiness mẫu</p><h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">RU-VN-2026-NANO-01</h2><div className="mt-5 space-y-3"><div className="flex items-center justify-between rounded-xl border border-card-border p-3"><span className="text-sm font-bold text-slate-900 dark:text-white">Nhóm nghiên cứu</span><StatusPill tone={pairedProposalIds.includes("p-01") ? "green" : "amber"}>{pairedProposalIds.includes("p-01") ? "Đã ghép" : "Chờ"}</StatusPill></div><div className="flex items-center justify-between rounded-xl border border-card-border p-3"><span className="text-sm font-bold text-slate-900 dark:text-white">Xác nhận tổ chức</span><StatusPill tone="slate">Chờ handoff</StatusPill></div><div className="flex items-center justify-between rounded-xl border border-card-border p-3"><span className="text-sm font-bold text-slate-900 dark:text-white">Gửi đề xuất</span><StatusPill tone={submittedProposalIds.includes("p-01") ? "green" : "slate"}>{submittedProposalIds.includes("p-01") ? "Đã gửi demo" : "Chưa"}</StatusPill></div></div></div><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Ranh giới demo</h2><p className="mt-2 text-sm leading-6 text-slate-500">Các action chỉ thay đổi state trong UI Preview. Không có thông báo nào khẳng định backend cộng tác đã ghi nhận.</p></div></aside></section>
      </>}

      {view === "projects" && <>
        <ViewHeading eyebrow="Dự án của tôi" title="Theo dõi dự án & mốc tiến độ" description="Tách trạng thái dự án khỏi đề xuất. Có thể mở chi tiết dự án, hoàn tất mốc hiện tại và mô phỏng lưu báo cáo." action={<button type="button" disabled={busy || !milestones.some((item) => item.state === "IN_PROGRESS")} onClick={completeCurrentMilestone} className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">Hoàn tất mốc hiện tại</button>} />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="grid gap-5 border-b border-card-border pb-5 lg:grid-cols-[1fr_auto] lg:items-start"><div><div className="flex flex-wrap gap-2"><StatusPill tone="green">Đang triển khai</StatusPill><span className="font-mono text-xs text-slate-500">RU-VN-2026-BIO-08</span></div><h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">Khảo sát đa dạng sinh học và động lực học hải lưu vùng biển chuyển tiếp Việt – Nga</h2><p className="mt-2 text-sm text-slate-500">VAST ↔ FEB RAS · 36 tháng</p><button type="button" onClick={() => setDialog({ kind: "project" })} className="mt-4 min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Xem chi tiết dự án</button></div><div className="min-w-48 rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Tiến độ minh họa</span><strong className="mt-1 block text-3xl text-slate-950 dark:text-white">75%</strong><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full w-3/4 rounded-full bg-blue-700" /></div></div></div><div className="mt-5 grid gap-3 lg:grid-cols-3">{milestones.map((milestone, index) => <article key={milestone.id} className="rounded-xl border border-card-border p-4"><div className="flex items-center justify-between gap-2"><span className="text-xs font-extrabold text-slate-500">MỐC {index + 1}</span><StatusPill tone={milestone.state === "DONE" ? "green" : milestone.state === "IN_PROGRESS" ? "blue" : "slate"}>{milestone.state === "DONE" ? "Hoàn tất" : milestone.state === "IN_PROGRESS" ? "Đang làm" : "Chưa bắt đầu"}</StatusPill></div><h3 className="mt-3 text-sm font-bold leading-6 text-slate-900 dark:text-white">{milestone.title}</h3><p className="mt-2 text-xs text-slate-500">Mốc thời gian: {milestone.due}</p></article>)}</div></section>
        <section className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-base font-bold text-slate-950 dark:text-white">Tài liệu tiến độ</h2><p className="mt-2 text-sm text-slate-500">Biên bản thử nghiệm, ghi chú nhóm và tài liệu minh chứng.</p><button type="button" onClick={() => setDialog({ kind: "project" })} className="mt-4 min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Mở tài liệu & chi tiết</button></div><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-bold text-slate-950 dark:text-white">Báo cáo gần nhất</h2>{reportSavedAt && <StatusPill tone="green">Đã lưu {reportSavedAt}</StatusPill>}</div><p className="mt-2 text-sm text-slate-500">Báo cáo tiến độ Q2/2026 · trạng thái minh họa: bản nháp.</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{reportSummary}</p><button type="button" disabled={busy} onClick={() => setDialog({ kind: "report-draft" })} className="mt-4 min-h-10 rounded-lg bg-blue-700 px-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">{reportSavedAt ? "Tiếp tục chỉnh báo cáo" : "Soạn báo cáo tiến độ"}</button></div></section>
      </>}

      {view === "academic" && <>
        <ViewHeading eyebrow="Học thuật & trao đổi" title="Hoạt động học thuật song phương" description="Theo dõi hội thảo, seminar và kế hoạch trao đổi nhóm nghiên cứu mà không trộn vào màn đề xuất hoặc dự án." />
        <section className="grid gap-4 lg:grid-cols-3">{academicItems.map((item) => { const registered = registeredAcademicIds.includes(item.id); return <article key={item.id} className="flex flex-col rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-2"><StatusPill tone={registered ? "green" : item.status === "OPEN" ? "blue" : "slate"}>{registered ? "Đã đăng ký demo" : item.status === "OPEN" ? "Đang mở" : "Dự kiến"}</StatusPill><span className="text-xs font-bold text-slate-500">{item.date}</span></div><h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.place}</p><div className="mt-auto flex flex-wrap gap-2 pt-5"><button type="button" onClick={() => setDialog({ kind: "academic", id: item.id })} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Xem chi tiết</button>{item.status === "OPEN" && <button type="button" disabled={busy || registered} onClick={() => void runAction("Đã đăng ký hoạt động học thuật", item.title, () => setRegisteredAcademicIds((ids) => [...ids, item.id]))} className="min-h-10 rounded-lg bg-blue-700 px-3 text-sm font-bold text-white disabled:opacity-60">{registered ? "Đã ghi nhận" : "Mô phỏng đăng ký"}</button>}</div></article>; })}</section>
        <DemoActivityPanel scope="researcher" />
      </>}

      {activeProposal && <WorkspaceTaskDialog title={activeProposal.title} eyebrow={`Đề xuất · ${activeProposal.code}`} tone="blue" onClose={() => setDialog(null)} footer={<><button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Đóng</button>{activeProposal.status === "PENDING_COPI" && !pairedProposalIds.includes(activeProposal.id) && <button type="button" disabled={busy} onClick={() => void runAction("Đã mô phỏng xác nhận ghép đối tác", activeProposal.code, () => { setPairedProposalIds((ids) => [...ids, activeProposal.id]); setDialog(null); setAlert("Đối tác demo đã được xác nhận; bước tiếp theo là xác nhận tổ chức trước khi gửi hồ sơ."); })} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-60">Mô phỏng xác nhận đối tác</button>}{pairedProposalIds.includes(activeProposal.id) && !submittedProposalIds.includes(activeProposal.id) && <button type="button" disabled={busy} onClick={() => void runAction("Đã mô phỏng gửi đề xuất", activeProposal.code, () => { setSubmittedProposalIds((ids) => [...ids, activeProposal.id]); setDialog(null); setAlert("Đề xuất demo đã chuyển sang bước sàng lọc của Điều phối hợp tác."); })} className="min-h-10 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white disabled:opacity-60">Mô phỏng gửi đề xuất</button>}</>}><div className="space-y-5"><div className="grid gap-3 sm:grid-cols-2"><Metric value={activeProposal.statusLabel} label="Trạng thái gốc" detail="Dữ liệu minh họa" /><Metric value={`${activeProposal.durationMonths} tháng`} label="Thời lượng" detail="Kế hoạch nghiên cứu" /></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-card-border p-4"><p className="text-xs font-bold text-slate-500">Phía Việt Nam</p><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{activeProposal.vnPi}</strong><span className="mt-1 block text-xs text-slate-500">{activeProposal.vnOrg}</span></div><div className="rounded-xl border border-card-border p-4"><p className="text-xs font-bold text-slate-500">Phía Liên bang Nga</p><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{activeProposal.ruPi}</strong><span className="mt-1 block text-xs text-slate-500">{activeProposal.ruOrg}</span></div></div><div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-900 dark:text-slate-300"><strong className="block text-slate-900 dark:text-white">Kết quả dự kiến</strong>{activeProposal.expectedOutcomes}</div></div></WorkspaceTaskDialog>}

      {activeKnowledge && <WorkspaceTaskDialog title={activeKnowledge.title} eyebrow={activeKnowledge.type} tone="blue" onClose={() => setDialog(null)} footer={<button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white">Đóng</button>}><div className="space-y-4"><div className="flex flex-wrap gap-2"><StatusPill>{activeKnowledge.type}</StatusPill><StatusPill tone={activeKnowledge.status === "Bản nháp" ? "slate" : "green"}>{activeKnowledge.status}</StatusPill></div><p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{activeKnowledge.summary}</p><div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">{activeKnowledge.meta}</div></div></WorkspaceTaskDialog>}

      {dialog?.kind === "project" && <WorkspaceTaskDialog title="RU-VN-2026-BIO-08 · Chi tiết dự án" eyebrow="Dự án của tôi" tone="blue" onClose={() => setDialog(null)} footer={<button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white">Đóng</button>}><div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><Metric value="75%" label="Tiến độ" detail="Dữ liệu minh họa" /><Metric value="Mốc 2" label="Mốc hiện tại" detail="Thử nghiệm gia tốc" /><Metric value="36 tháng" label="Thời lượng" detail="Kế hoạch mẫu" /></div><div className="rounded-xl border border-card-border p-4"><h3 className="text-sm font-bold text-slate-900 dark:text-white">Tài liệu & bằng chứng tiến độ</h3><ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300"><li>• Biên bản thử nghiệm gia tốc — dữ liệu mẫu</li><li>• Ghi chú họp nhóm VN–RU — dữ liệu mẫu</li><li>• Bản nháp báo cáo Q2/2026 — dữ liệu mẫu</li></ul></div></div></WorkspaceTaskDialog>}

      {activeAcademic && <WorkspaceTaskDialog title={activeAcademic.title} eyebrow="Hoạt động học thuật" tone="blue" onClose={() => setDialog(null)} footer={<button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white">Đóng</button>}><div className="space-y-3"><p className="text-sm leading-6 text-slate-700 dark:text-slate-200">{activeAcademic.detail}</p><dl className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Thời gian</dt><dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{activeAcademic.date}</dd></div><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Địa điểm</dt><dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{activeAcademic.place}</dd></div></dl></div></WorkspaceTaskDialog>}
      {dialog?.kind === "create-proposal" && <WorkspaceTaskDialog title={draftCreated ? "Chỉnh bản nháp đề xuất" : "Soạn đề xuất nghiên cứu"} eyebrow="Bản nháp đề xuất" tone="blue" onClose={() => { setDialog(null); setDraftError(null); }} footer={<><button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Hủy</button><button type="button" disabled={busy} onClick={createProposalDraft} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">{draftCreated ? "Cập nhật bản nháp" : "Tạo bản nháp"}</button></>}><div className="space-y-4"><div><label htmlFor="proposal-title" className="text-sm font-bold text-slate-900 dark:text-white">Tên đề xuất</label><input id="proposal-title" autoFocus value={draftTitle} onChange={(event) => { setDraftTitle(event.target.value); setDraftError(null); }} placeholder="Ví dụ: Vật liệu chống ăn mòn cho vùng biển nhiệt đới" className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:bg-slate-950 dark:text-white" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="proposal-field" className="text-sm font-bold text-slate-900 dark:text-white">Lĩnh vực nghiên cứu</label><input id="proposal-field" value={draftField} onChange={(event) => { setDraftField(event.target.value); setDraftError(null); }} placeholder="Vật liệu mới" className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:bg-slate-950 dark:text-white" /></div><div><label htmlFor="proposal-partner" className="text-sm font-bold text-slate-900 dark:text-white">Đối tác dự kiến</label><input id="proposal-partner" value={draftPartner} onChange={(event) => { setDraftPartner(event.target.value); setDraftError(null); }} placeholder="FEB RAS" className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:bg-slate-950 dark:text-white" /></div></div>{draftError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">{draftError}</p>}<p className="text-xs leading-5 text-slate-500">Bản nháp sẽ xuất hiện trong danh sách của phiên UI Preview; chưa được gửi tới backend nghiệp vụ.</p></div></WorkspaceTaskDialog>}

      {dialog?.kind === "report-draft" && <WorkspaceTaskDialog title="Báo cáo tiến độ Q2/2026" eyebrow="Bản nháp báo cáo" tone="blue" onClose={() => setDialog(null)} footer={<><button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Hủy</button><button type="button" disabled={busy || reportSummary.trim().length < 30} onClick={saveReportDraft} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">Lưu bản nháp</button></>}><div><label htmlFor="report-summary" className="text-sm font-bold text-slate-900 dark:text-white">Tóm tắt tiến độ</label><textarea id="report-summary" autoFocus rows={7} value={reportSummary} onChange={(event) => setReportSummary(event.target.value)} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm leading-6 text-slate-900 outline-none focus:border-blue-500 dark:bg-slate-950 dark:text-white" /><div className="mt-2 flex items-start justify-between gap-4 text-xs"><span className={reportSummary.trim().length < 30 ? "font-semibold text-rose-700 dark:text-rose-300" : "text-slate-500"}>{reportSummary.trim().length < 30 ? "Cần tối thiểu 30 ký tự để lưu bản nháp." : "Nội dung đủ điều kiện lưu trong UI Preview."}</span><span className="shrink-0 text-slate-500">{reportSummary.trim().length} ký tự</span></div></div></WorkspaceTaskDialog>}
    </main>
  );
}
