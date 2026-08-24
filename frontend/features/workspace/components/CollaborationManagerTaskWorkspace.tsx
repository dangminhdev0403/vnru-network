"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DemoActivityPanel } from "@/features/prototype-v3/components/DemoActivityPanel";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { commitDemoMutation } from "@/features/prototype-v3/demo-backend";
import { WorkspaceTaskDialog } from "./WorkspaceTaskDialog";

type ManagerView = "overview" | "opportunities" | "screening" | "assignments" | "projects" | "reports";
type OpportunityState = "DRAFT" | "PUBLISHED";
type ScreeningState = "SUBMITTED" | "NEEDS_INFO" | "ELIGIBLE" | "NOT_ELIGIBLE";
type ReportState = "PENDING" | "RETURNED" | "APPROVED";

type Opportunity = { id: string; code: string; title: string; field: string; closes: string; state: OpportunityState };
type ScreeningItem = { id: string; code: string; title: string; organizations: string; state: ScreeningState; note: string };
type ReviewAssignment = { id: string; code: string; title: string; reviewer: string | null; deadline: string; conflict: boolean };
type ReportItem = { id: string; code: string; title: string; period: string; progress: number; state: ReportState };

type DialogState =
  | { kind: "create-opportunity" }
  | { kind: "opportunity"; id: string }
  | { kind: "screening"; id: string }
  | { kind: "assignment"; id: string }
  | { kind: "report"; id: string }
  | null;

const views = new Set<ManagerView>(["overview", "opportunities", "screening", "assignments", "projects", "reports"]);

const reviewerCandidates = [
  { name: "Chuyên gia #07", field: "Vật liệu biển", load: "1 hồ sơ đang mở", conflict: false },
  { name: "Chuyên gia #12", field: "Vật liệu nano", load: "2 hồ sơ đang mở", conflict: false },
  { name: "Chuyên gia #21", field: "Hóa lý bề mặt", load: "1 hồ sơ đang mở", conflict: true },
];

function statusClass(tone: "green" | "amber" | "blue" | "red" | "slate") {
  if (tone === "green") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  if (tone === "red") return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300";
  if (tone === "slate") return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300";
}

function StatusPill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "green" | "amber" | "blue" | "red" | "slate" }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClass(tone)}`}>{children}</span>;
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><strong className="block text-3xl font-extrabold text-slate-950 dark:text-white">{value}</strong><span className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">{label}</span><small className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</small></div>;
}

function ViewHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="flex flex-col gap-5 border-b border-card-border pb-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</header>;
}

export function CollaborationManagerTaskWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian điều phối…</div>}><CollaborationManagerTaskWorkspaceContent /></React.Suspense>;
}

function CollaborationManagerTaskWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as ManagerView | null;
  const view: ManagerView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const [opportunities, setOpportunities] = React.useState<Opportunity[]>([
    { id: "op-01", code: "OPP-2026-MARINE", title: "Vật liệu và cảm biến cho môi trường biển", field: "Vật liệu · Cảm biến", closes: "30/09/2026", state: "PUBLISHED" },
    { id: "op-02", code: "OPP-2026-AI", title: "AI cho quan trắc và dự báo rủi ro ven biển", field: "AI · Địa chất biển", closes: "15/10/2026", state: "DRAFT" },
  ]);
  const [screenings, setScreenings] = React.useState<ScreeningItem[]>([
    { id: "sc-01", code: "RU-VN-2026-NANO-01", title: "Độ bền vật liệu Nano-composite trong môi trường biển nhiệt đới", organizations: "Tổ chức VN ↔ FEB RAS", state: "SUBMITTED", note: "Đủ hai phía nghiên cứu; chờ rà soát tính đầy đủ hồ sơ." },
    { id: "sc-02", code: "RU-VN-2026-AI-04", title: "Mô hình AI dự báo sớm tai biến địa chất ven biển", organizations: "Đơn vị VN ↔ MISIS", state: "NEEDS_INFO", note: "Thiếu mô tả nguồn dữ liệu dùng chung và phạm vi thử nghiệm." },
    { id: "sc-03", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", organizations: "Đơn vị VN ↔ POI RAS", state: "ELIGIBLE", note: "Đã qua sàng lọc demo; sẵn sàng phân công phản biện." },
  ]);
  const [assignments, setAssignments] = React.useState<ReviewAssignment[]>([
    { id: "as-01", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", reviewer: null, deadline: "08/09/2026", conflict: false },
    { id: "as-02", code: "RU-VN-2026-BIO-08", title: "Độ bền vật liệu Nano-composite trong môi trường biển nhiệt đới", reviewer: "Chuyên gia #07", deadline: "30/08/2026", conflict: false },
  ]);
  const [reports, setReports] = React.useState<ReportItem[]>([
    { id: "rp-01", code: "RU-VN-2026-BIO-08", title: "Báo cáo tiến độ giai đoạn 2", period: "Q2/2026", progress: 75, state: "PENDING" },
    { id: "rp-02", code: "RU-VN-2025-OCEAN-03", title: "Báo cáo tiến độ giai đoạn 1", period: "H1/2026", progress: 48, state: "RETURNED" },
    { id: "rp-03", code: "RU-VN-2025-DATA-06", title: "Báo cáo hoàn tất mốc tích hợp dữ liệu", period: "M3", progress: 100, state: "APPROVED" },
  ]);
  const [dialog, setDialog] = React.useState<DialogState>(null);
  const [selectedReviewer, setSelectedReviewer] = React.useState("Chuyên gia #07");
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [alert, setAlert] = React.useState("Có 1 hồ sơ đủ điều kiện nhưng chưa được phân công phản biện.");
  const [opportunityTitle, setOpportunityTitle] = React.useState("");
  const [opportunityField, setOpportunityField] = React.useState("");
  const [opportunityCloses, setOpportunityCloses] = React.useState("");
  const [opportunityError, setOpportunityError] = React.useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  };

  const mutate = async (action: string, detail: string, after: () => void) => {
    setBusy(true);
    await commitDemoMutation("manager", action, detail);
    after();
    setBusy(false);
    setDialog(null);
    showToast(`${action} · chỉ cập nhật luồng mô phỏng.`);
  };

  const screeningTone = (state: ScreeningState) => state === "ELIGIBLE" ? "green" : state === "NEEDS_INFO" ? "amber" : state === "NOT_ELIGIBLE" ? "red" : "blue";
  const reportTone = (state: ReportState) => state === "APPROVED" ? "green" : state === "RETURNED" ? "amber" : "blue";

  const createOpportunity = () => {
    if (!opportunityTitle.trim() || !opportunityField.trim() || !opportunityCloses) {
      setOpportunityError("Nhập tên, lĩnh vực và hạn nhận hồ sơ để tạo bản nháp demo.");
      return;
    }
    const code = `OPP-DEMO-${String(opportunities.length + 1).padStart(2, "0")}`;
    void mutate("Đã tạo cơ hội bản nháp", `${code} · ${opportunityTitle.trim()}`, () => {
      setOpportunities((items) => [{ id: `op-${Date.now()}`, code, title: opportunityTitle.trim(), field: opportunityField.trim(), closes: new Intl.DateTimeFormat("vi-VN").format(new Date(`${opportunityCloses}T00:00:00`)), state: "DRAFT" }, ...items]);
      setOpportunityTitle("");
      setOpportunityField("");
      setOpportunityCloses("");
      setOpportunityError(null);
    });
  };

  const activeOpportunity = dialog?.kind === "opportunity" ? opportunities.find((item) => item.id === dialog.id) : null;
  const activeScreening = dialog?.kind === "screening" ? screenings.find((item) => item.id === dialog.id) : null;
  const activeAssignment = dialog?.kind === "assignment" ? assignments.find((item) => item.id === dialog.id) : null;
  const activeReport = dialog?.kind === "report" ? reports.find((item) => item.id === dialog.id) : null;

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Điều phối hợp tác" />
      {alert && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-950 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100 sm:flex-row sm:items-center sm:justify-between"><span><strong>Cần chú ý:</strong> {alert}</span><button type="button" onClick={() => setAlert("")} className="text-left font-bold text-cyan-800 dark:text-cyan-200">Đã hiểu</button></div>}
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-cyan-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md"><span className="mr-2 text-xs font-extrabold uppercase tracking-wider text-cyan-300">UI Preview</span>{toast}</div>}

      {view === "overview" && <>
        <ViewHeading eyebrow="Điều phối hợp tác" title="Bàn điều phối chương trình" description="Theo dõi cơ hội nghiên cứu, hồ sơ mới nộp, phân công phản biện và báo cáo đang chờ xử lý. Đây là UI Preview; không có business backend được gọi." action={<Link href="/workspace/collaboration?view=screening" className="inline-flex min-h-11 items-center rounded-xl bg-cyan-700 px-4 text-sm font-bold text-white hover:bg-cyan-800">Mở hàng đợi sàng lọc →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric value="01" label="Cơ hội bản nháp" detail="Có thể mở và mô phỏng công bố" /><Metric value="02" label="Hồ sơ cần sàng lọc" detail="1 mới nộp · 1 cần bổ sung" /><Metric value="01" label="Chưa phân phản biện" detail="Hồ sơ đã qua sàng lọc" /><Metric value="01" label="Báo cáo chờ xử lý" detail="Có thể duyệt hoặc trả lại demo" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
          <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="flex items-end justify-between gap-4 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc cần làm</h2><p className="mt-1 text-sm text-slate-500">Các handoff đang chờ Điều phối hợp tác xử lý.</p></div><StatusPill tone="amber">3 việc</StatusPill></div><div className="divide-y divide-card-border"><Link href="/workspace/collaboration?view=screening" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-cyan-700" aria-hidden="true">rule</span><div><strong className="block text-sm text-slate-900 dark:text-white">Sàng lọc RU-VN-2026-NANO-01</strong><span className="mt-1 block text-xs text-slate-500">Hồ sơ mới nộp từ nhóm nghiên cứu</span></div><StatusPill>Đã nộp</StatusPill></Link><Link href="/workspace/collaboration?view=assignments" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-cyan-700" aria-hidden="true">assignment_ind</span><div><strong className="block text-sm text-slate-900 dark:text-white">Phân công phản biện RU-VN-2026-MAR-02</strong><span className="mt-1 block text-xs text-slate-500">Đã đủ điều kiện</span></div><StatusPill tone="green">Sẵn sàng</StatusPill></Link><Link href="/workspace/collaboration?view=reports" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-cyan-700" aria-hidden="true">description</span><div><strong className="block text-sm text-slate-900 dark:text-white">Rà soát báo cáo RU-VN-2026-BIO-08</strong><span className="mt-1 block text-xs text-slate-500">Tiến độ mô phỏng 75%</span></div><StatusPill tone="amber">Chờ xử lý</StatusPill></Link></div></div>
          <aside className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">Vai trò điều phối</p><h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">Không thay thế tổ chức hay phản biện</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Điều phối hợp tác xử lý luồng ở cấp chương trình: công bố cơ hội, sàng lọc, phân công phản biện và xử lý báo cáo. Đại diện tổ chức vẫn chịu trách nhiệm xác nhận ở phạm vi tổ chức; Reviewer vẫn độc lập chấm hồ sơ.</p></aside>
        </section>
        <DemoActivityPanel scope="manager" />
      </>}

      {view === "opportunities" && <>
        <ViewHeading eyebrow="Cơ hội nghiên cứu" title="Quản lý cơ hội hợp tác" description="Tạo bản nháp, xem chi tiết và mô phỏng công bố cơ hội. Trạng thái demo được thể hiện ngay trên danh sách." action={<button type="button" disabled={busy} onClick={() => setDialog({ kind: "create-opportunity" })} className="min-h-11 rounded-xl bg-cyan-700 px-4 text-sm font-bold text-white hover:bg-cyan-800 disabled:opacity-60">+ Tạo cơ hội</button>} />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="divide-y divide-card-border">{opportunities.map((item) => <article key={item.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><StatusPill tone={item.state === "PUBLISHED" ? "green" : "slate"}>{item.state === "PUBLISHED" ? "Đã công bố" : "Bản nháp"}</StatusPill><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.field} · Hạn demo: {item.closes}</p></div><button type="button" onClick={() => setDialog({ kind: "opportunity", id: item.id })} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Xem chi tiết</button></article>)}</div></section>
      </>}

      {view === "screening" && <>
        <ViewHeading eyebrow="Sàng lọc đề xuất" title="Hàng đợi kiểm tra điều kiện" description="Mở hồ sơ để xem checklist, ghi chú và mô phỏng chuyển trạng thái: đủ điều kiện, cần bổ sung hoặc không đủ điều kiện." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="divide-y divide-card-border">{screenings.map((item) => <article key={item.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><StatusPill tone={screeningTone(item.state)}>{item.state === "ELIGIBLE" ? "Đủ điều kiện" : item.state === "NEEDS_INFO" ? "Cần bổ sung" : item.state === "NOT_ELIGIBLE" ? "Không đủ điều kiện" : "Đã nộp"}</StatusPill><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.organizations}</p></div><button type="button" onClick={() => setDialog({ kind: "screening", id: item.id })} className="min-h-10 rounded-lg bg-cyan-700 px-3 text-sm font-bold text-white">Mở kiểm tra</button></article>)}</div></section>
      </>}

      {view === "assignments" && <>
        <ViewHeading eyebrow="Phân công phản biện" title="Bàn phân công Reviewer" description="Chỉ hồ sơ đã qua sàng lọc mới xuất hiện. Mở box chi tiết để so sánh ứng viên, cảnh báo xung đột và mô phỏng phân công." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="divide-y divide-card-border">{assignments.map((item) => <article key={item.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><StatusPill tone={item.reviewer ? "green" : "amber"}>{item.reviewer ? "Đã phân công" : "Chưa phân công"}</StatusPill><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">Reviewer: {item.reviewer ?? "Chưa chọn"} · Hạn: {item.deadline}</p></div><button type="button" onClick={() => { setSelectedReviewer(item.reviewer ?? "Chuyên gia #07"); setDialog({ kind: "assignment", id: item.id }); }} className="min-h-10 rounded-lg bg-cyan-700 px-3 text-sm font-bold text-white">{item.reviewer ? "Xem phân công" : "Chọn Reviewer"}</button></article>)}</div></section>
      </>}

      {view === "projects" && <>
        <ViewHeading eyebrow="Dự án" title="Theo dõi dự án song phương" description="Màn đọc phục vụ Điều phối hợp tác: tiến độ, mốc gần nhất và đơn vị tham gia. Không có thao tác tài chính." />
        <section className="grid gap-4 lg:grid-cols-2">{[
          ["RU-VN-2026-BIO-08", "Độ bền vật liệu Nano-composite", "75%", "Mốc 2 · Thử nghiệm gia tốc"],
          ["RU-VN-2025-OCEAN-03", "Đồng bộ chuỗi quan trắc hải dương học", "48%", "Mốc 1 · Đồng bộ dữ liệu"],
        ].map(([code, title, progress, next]) => <article key={code} className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs text-slate-500">{code}</span><StatusPill tone="blue">Đang triển khai</StatusPill></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{title}</h2><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-cyan-700" style={{ width: progress }} /></div><div className="mt-2 flex justify-between gap-4 text-xs text-slate-500"><span>{progress}</span><span>{next}</span></div></article>)}</section>
      </>}

      {view === "reports" && <>
        <ViewHeading eyebrow="Báo cáo chờ xử lý" title="Rà soát báo cáo tiến độ" description="Xem chi tiết, mô phỏng duyệt hoặc trả lại để chỉnh sửa. Không có funding, budget, giải ngân hay chỉ số tài chính." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="divide-y divide-card-border">{reports.map((item) => <article key={item.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><StatusPill tone={reportTone(item.state)}>{item.state === "APPROVED" ? "Đã duyệt" : item.state === "RETURNED" ? "Đã trả lại" : "Chờ xử lý"}</StatusPill><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.period} · Tiến độ mô phỏng {item.progress}%</p></div><button type="button" onClick={() => setDialog({ kind: "report", id: item.id })} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Xem báo cáo</button></article>)}</div></section>
      </>}

      {activeOpportunity && <WorkspaceTaskDialog title={activeOpportunity.title} eyebrow="Chi tiết cơ hội" tone="blue" onClose={() => setDialog(null)} footer={<>{activeOpportunity.state === "DRAFT" && <button type="button" disabled={busy} onClick={() => void mutate("Đã mô phỏng công bố cơ hội", activeOpportunity.code, () => setOpportunities((items) => items.map((item) => item.id === activeOpportunity.id ? { ...item, state: "PUBLISHED" } : item)))} className="min-h-10 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white disabled:opacity-60">Mô phỏng công bố</button>}<button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Đóng</button></>}><dl className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Mã cơ hội</dt><dd className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">{activeOpportunity.code}</dd></div><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Trạng thái</dt><dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{activeOpportunity.state === "PUBLISHED" ? "Đã công bố" : "Bản nháp"}</dd></div><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Lĩnh vực</dt><dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{activeOpportunity.field}</dd></div><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Hạn demo</dt><dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{activeOpportunity.closes}</dd></div></dl></WorkspaceTaskDialog>}

      {activeScreening && <WorkspaceTaskDialog title={activeScreening.title} eyebrow="Kiểm tra điều kiện" tone="blue" onClose={() => setDialog(null)} footer={<><button type="button" disabled={busy} onClick={() => void mutate("Đã yêu cầu bổ sung hồ sơ", activeScreening.code, () => setScreenings((items) => items.map((item) => item.id === activeScreening.id ? { ...item, state: "NEEDS_INFO" } : item)))} className="min-h-10 rounded-lg border border-amber-300 px-4 text-sm font-bold text-amber-800 dark:border-amber-800 dark:text-amber-200">Yêu cầu bổ sung</button><button type="button" disabled={busy} onClick={() => void mutate("Đã đánh dấu đủ điều kiện", activeScreening.code, () => { setScreenings((items) => items.map((item) => item.id === activeScreening.id ? { ...item, state: "ELIGIBLE" } : item)); setAlert("Có hồ sơ vừa qua sàng lọc; hãy chuyển sang Phân công phản biện."); })} className="min-h-10 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white disabled:opacity-60">Đủ điều kiện</button></>}><div className="rounded-xl border border-card-border p-4"><p className="text-sm font-bold text-slate-900 dark:text-white">Checklist minh họa</p><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300"><li>✓ Hai phía nghiên cứu đã được xác định</li><li>✓ Tổ chức tham gia đã được kê khai</li><li>✓ Phạm vi nghiên cứu không chứa nội dung tài chính</li><li>• {activeScreening.note}</li></ul></div></WorkspaceTaskDialog>}

      {activeAssignment && <WorkspaceTaskDialog title={activeAssignment.title} eyebrow="Phân công phản biện" tone="blue" onClose={() => setDialog(null)} footer={<><button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Hủy</button><button type="button" disabled={busy || reviewerCandidates.find((candidate) => candidate.name === selectedReviewer)?.conflict} onClick={() => void mutate("Đã mô phỏng phân công phản biện", `${activeAssignment.code} · ${selectedReviewer}`, () => { setAssignments((items) => items.map((item) => item.id === activeAssignment.id ? { ...item, reviewer: selectedReviewer } : item)); setAlert("Phân công demo đã cập nhật; Reviewer tương ứng cần nhận hồ sơ ở bước kế tiếp."); })} className="min-h-10 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Xác nhận phân công</button></>}><div className="space-y-3">{reviewerCandidates.map((candidate) => <label key={candidate.name} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${selectedReviewer === candidate.name ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30" : "border-card-border"}`}><input type="radio" name="reviewer" value={candidate.name} checked={selectedReviewer === candidate.name} onChange={() => setSelectedReviewer(candidate.name)} className="mt-1" /><span className="min-w-0 flex-1"><strong className="block text-sm text-slate-900 dark:text-white">{candidate.name}</strong><span className="mt-1 block text-xs text-slate-500">{candidate.field} · {candidate.load}</span>{candidate.conflict && <span role="alert" className="mt-2 block text-xs font-bold text-rose-700 dark:text-rose-300">Cảnh báo xung đột lợi ích demo — không thể chọn.</span>}</span></label>)}</div></WorkspaceTaskDialog>}

      {activeReport && <WorkspaceTaskDialog title={activeReport.title} eyebrow="Báo cáo tiến độ" tone="blue" onClose={() => setDialog(null)} footer={<>{activeReport.state !== "APPROVED" && <><button type="button" disabled={busy} onClick={() => void mutate("Đã trả báo cáo để chỉnh sửa", activeReport.code, () => setReports((items) => items.map((item) => item.id === activeReport.id ? { ...item, state: "RETURNED" } : item)))} className="min-h-10 rounded-lg border border-amber-300 px-4 text-sm font-bold text-amber-800 dark:border-amber-800 dark:text-amber-200">Trả lại chỉnh sửa</button><button type="button" disabled={busy} onClick={() => void mutate("Đã mô phỏng duyệt báo cáo", activeReport.code, () => setReports((items) => items.map((item) => item.id === activeReport.id ? { ...item, state: "APPROVED" } : item)))} className="min-h-10 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white disabled:opacity-60">Mô phỏng duyệt</button></>}<button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Đóng</button></>}><div className="grid gap-4 sm:grid-cols-3"><Metric value={`${activeReport.progress}%`} label="Tiến độ" detail="Dữ liệu mô phỏng" /><Metric value={activeReport.period} label="Kỳ báo cáo" detail="Không chứa dữ liệu tài chính" /><Metric value={activeReport.state === "APPROVED" ? "Đã duyệt" : activeReport.state === "RETURNED" ? "Cần sửa" : "Chờ xử lý"} label="Trạng thái" detail="Cập nhật trong UI Preview" /></div></WorkspaceTaskDialog>}
      {dialog?.kind === "create-opportunity" && <WorkspaceTaskDialog title="Tạo cơ hội nghiên cứu" eyebrow="Bản nháp cơ hội" tone="blue" onClose={() => { setDialog(null); setOpportunityError(null); }} footer={<><button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Hủy</button><button type="button" disabled={busy} onClick={createOpportunity} className="min-h-10 rounded-lg bg-cyan-700 px-4 text-sm font-bold text-white hover:bg-cyan-800 disabled:opacity-60">Lưu bản nháp</button></>}><div className="space-y-4"><div><label htmlFor="opportunity-title" className="text-sm font-bold text-slate-900 dark:text-white">Tên cơ hội</label><input id="opportunity-title" autoFocus value={opportunityTitle} onChange={(event) => { setOpportunityTitle(event.target.value); setOpportunityError(null); }} placeholder="Ví dụ: Vật liệu thông minh cho môi trường biển" className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-950 dark:text-white" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="opportunity-field" className="text-sm font-bold text-slate-900 dark:text-white">Lĩnh vực</label><input id="opportunity-field" value={opportunityField} onChange={(event) => { setOpportunityField(event.target.value); setOpportunityError(null); }} placeholder="Vật liệu · Cảm biến" className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-950 dark:text-white" /></div><div><label htmlFor="opportunity-closes" className="text-sm font-bold text-slate-900 dark:text-white">Hạn nhận hồ sơ</label><input id="opportunity-closes" type="date" value={opportunityCloses} onChange={(event) => { setOpportunityCloses(event.target.value); setOpportunityError(null); }} className="mt-2 min-h-11 w-full rounded-xl border border-card-border bg-white px-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:bg-slate-950 dark:text-white" /></div></div>{opportunityError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">{opportunityError}</p>}<p className="text-xs leading-5 text-slate-500">Bản nháp chỉ tồn tại trong phiên UI Preview và sẽ xuất hiện ngay đầu danh sách sau khi lưu.</p></div></WorkspaceTaskDialog>}
    </main>
  );
}
