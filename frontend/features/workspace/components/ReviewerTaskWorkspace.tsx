"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DemoActivityPanel } from "@/features/prototype-v3/components/DemoActivityPanel";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { commitDemoMutation } from "@/features/prototype-v3/demo-backend";
import { WorkspaceTaskDialog } from "./WorkspaceTaskDialog";

type ReviewerView = "overview" | "assignments" | "evaluation" | "history";
type AssignmentState = "NEW" | "IN_REVIEW" | "SUBMITTED";
type Assignment = { id: string; code: string; title: string; field: string; due: string; state: AssignmentState; summary: string };
type DialogState = { kind: "assignment"; id: string } | { kind: "submit" } | null;

const views = new Set<ReviewerView>(["overview", "assignments", "evaluation", "history"]);
const initialAssignments: Assignment[] = [
  { id: "rv-01", code: "RU-VN-2026-BIO-08", title: "Độ bền vật liệu Nano-composite trong môi trường biển nhiệt đới", field: "Khoa học Vật liệu & Hóa lý Biển", due: "30/08/2026", state: "IN_REVIEW", summary: "Hồ sơ minh họa tập trung vào độ bền bề mặt, quy trình thử nghiệm gia tốc và tính bổ trợ giữa hai nhóm nghiên cứu." },
  { id: "rv-02", code: "RU-VN-2026-AI-04", title: "Mô hình AI dự báo sớm tai biến địa chất ven biển", field: "AI & Địa chất Biển", due: "08/09/2026", state: "NEW", summary: "Hồ sơ mới được phân công; cần đọc phương pháp, bộ dữ liệu và kế hoạch đối chiếu kết quả." },
  { id: "rv-03", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", field: "Sinh học Biển", due: "18/08/2026", state: "SUBMITTED", summary: "Hồ sơ đã nộp phản biện trong dữ liệu mẫu và chỉ được xem lại." },
];

function StatusPill({ state }: { state: AssignmentState | "PASS" | "DRAFT" }) {
  const copy = state === "NEW" ? "Mới phân công" : state === "IN_REVIEW" ? "Đang đánh giá" : state === "SUBMITTED" ? "Đã nộp" : state === "PASS" ? "Hợp lệ" : "Bản nháp";
  const classes = state === "SUBMITTED" || state === "PASS"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
    : state === "IN_REVIEW"
      ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300"
      : state === "NEW"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${classes}`}>{copy}</span>;
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><strong className="block text-3xl font-extrabold text-slate-950 dark:text-white">{value}</strong><span className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">{label}</span><small className="mt-1 block text-xs leading-5 text-slate-500">{detail}</small></div>;
}

function ViewHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="flex flex-col gap-5 border-b border-card-border pb-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-purple-700 dark:text-purple-300">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</header>;
}

function ScoreField({ id, label, weight, value, onChange, disabled }: { id: string; label: string; weight: string; value: number; onChange: (value: number) => void; disabled: boolean }) {
  return <div className="rounded-xl border border-card-border p-4"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><label htmlFor={id} className="text-sm font-bold text-slate-900 dark:text-white">{label} <span className="font-medium text-slate-500">({weight})</span></label><strong className="font-mono text-lg text-purple-700 dark:text-purple-300">{value.toFixed(1)}/10</strong></div><input id={id} disabled={disabled} type="range" min="1" max="10" step="0.5" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 w-full accent-purple-700 disabled:opacity-50" /></div>;
}

export function ReviewerTaskWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian phản biện…</div>}><ReviewerTaskWorkspaceContent /></React.Suspense>;
}

function ReviewerTaskWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as ReviewerView | null;
  const view: ReviewerView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const [assignments, setAssignments] = React.useState(initialAssignments);
  const [dialog, setDialog] = React.useState<DialogState>(null);
  const [novelty, setNovelty] = React.useState(8.5);
  const [methodology, setMethodology] = React.useState(8.0);
  const [feasibility, setFeasibility] = React.useState(9.0);
  const [impact, setImpact] = React.useState(8.5);
  const [comment, setComment] = React.useState("Đề xuất có luận cứ khoa học rõ, phương pháp phù hợp và thể hiện tính bổ trợ giữa nhóm nghiên cứu Việt Nam – Liên bang Nga.");
  const [submitted, setSubmitted] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [alert, setAlert] = React.useState("Có 1 hồ sơ mới được phân công và 1 phiếu đang cần hoàn tất.");
  const [validationMessage, setValidationMessage] = React.useState<string | null>(null);
  const [draftSavedAt, setDraftSavedAt] = React.useState<string | null>(null);
  const totalScore = novelty * 0.3 + methodology * 0.25 + feasibility * 0.3 + impact * 0.15;
  const selectedAssignment = dialog?.kind === "assignment" ? assignments.find((item) => item.id === dialog.id) : null;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  };

  const saveDraft = async () => {
    setBusy(true);
    await commitDemoMutation("reviewer", "Đã lưu bản nháp phản biện", `RU-VN-2026-BIO-08 · ${totalScore.toFixed(2)}/10`);
    setDraftSavedAt(new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    setBusy(false);
    showToast("Bản nháp đã được cập nhật trong phiên demo.");
  };

  const requestSubmit = () => {
    if (comment.trim().length < 30) {
      setValidationMessage("Nhận xét demo cần tối thiểu 30 ký tự để mô phỏng bước nộp.");
      setAlert("Phiếu chưa đủ điều kiện nộp: hãy bổ sung nhận xét chuyên môn.");
      return;
    }
    setValidationMessage(null);
    setDialog({ kind: "submit" });
  };

  const confirmSubmit = async () => {
    setBusy(true);
    await commitDemoMutation("reviewer", "Đã mô phỏng nộp phản biện", `RU-VN-2026-BIO-08 · ${totalScore.toFixed(2)}/10`);
    setSubmitted(true);
    setAssignments((items) => items.map((item) => item.code === "RU-VN-2026-BIO-08" ? { ...item, state: "SUBMITTED" } : item));
    setBusy(false);
    setDialog(null);
    setAlert("Phản biện demo đã hoàn tất; bước tiếp theo của flow là Cơ quan quyết định xem kết quả tổng hợp.");
    showToast("Phiếu đã chuyển sang trạng thái Đã nộp trong UI Preview.");
  };

  const startReview = async (id: string) => {
    const item = assignments.find((entry) => entry.id === id);
    if (!item || item.state !== "NEW") return;
    setBusy(true);
    await commitDemoMutation("reviewer", "Đã mở hồ sơ phản biện", item.code);
    setAssignments((items) => items.map((entry) => entry.id === id ? { ...entry, state: "IN_REVIEW" } : entry));
    setBusy(false);
    setDialog(null);
    showToast("Hồ sơ đã chuyển sang trạng thái Đang đánh giá trong UI Preview.");
  };

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Phản biện" />
      {alert && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-950 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-100 sm:flex-row sm:items-center sm:justify-between"><span><strong>Cần chú ý:</strong> {alert}</span><button type="button" onClick={() => setAlert("")} className="text-left font-bold text-purple-800 dark:text-purple-200">Đã hiểu</button></div>}
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-purple-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md"><span className="mr-2 text-xs font-extrabold uppercase tracking-wider text-purple-300">UI Preview</span>{toast}</div>}

      {view === "overview" && <>
        <ViewHeading eyebrow="Không gian phản biện" title="Tổng quan phản biện" description="Tập trung vào hồ sơ được phân công, hạn xử lý và trạng thái phiếu đánh giá. Reviewer chỉ xử lý hồ sơ được giao." action={<Link href="/workspace/reviewer?view=assignments" className="inline-flex min-h-11 items-center rounded-xl bg-purple-700 px-4 text-sm font-bold text-white hover:bg-purple-800">Mở hồ sơ được phân công →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric value={String(assignments.filter((item) => item.state !== "SUBMITTED").length).padStart(2, "0")} label="Hồ sơ đang mở" detail="Mới hoặc đang đánh giá" /><Metric value="01" label="Cần hoàn tất sớm" detail="Hạn 30/08/2026" /><Metric value={String(assignments.filter((item) => item.state === "SUBMITTED").length).padStart(2, "0")} label="Đã nộp phản biện" detail="Trong kịch bản demo" /><Metric value={totalScore.toFixed(2)} label="Điểm bản nháp" detail="RU-VN-2026-BIO-08" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="flex items-end justify-between gap-4 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc cần làm</h2><p className="mt-1 text-sm text-slate-500">Ưu tiên theo hạn và trạng thái.</p></div><StatusPill state={submitted ? "SUBMITTED" : "IN_REVIEW"} /></div><div className="divide-y divide-card-border">{assignments.filter((item) => item.state !== "SUBMITTED").map((item) => <button key={item.id} type="button" onClick={() => setDialog({ kind: "assignment", id: item.id })} className="grid w-full gap-3 py-4 text-left sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-purple-700" aria-hidden="true">assignment</span><div><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code} · Hạn {item.due}</span></div><StatusPill state={item.state} /></button>)}</div></div><aside className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">Ranh giới phản biện</p><h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">Độc lập và theo phân công</h2><p className="mt-3 text-sm leading-6 text-slate-500">Reviewer không tự chọn proposal, không assign reviewer khác và không ban hành quyết định. Sau khi submit, phiếu chuyển sang chỉ đọc.</p></aside></section>
      </>}

      {view === "assignments" && <>
        <ViewHeading eyebrow="Hồ sơ được phân công" title="Hàng đợi phản biện" description="Bấm “Xem chi tiết” để mở modal hồ sơ, xem deadline, tóm tắt và chuyển hồ sơ mới sang trạng thái đánh giá." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="divide-y divide-card-border">{assignments.map((item) => <article key={item.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><StatusPill state={item.state} /><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.field} · Hạn {item.due}</p></div><button type="button" onClick={() => setDialog({ kind: "assignment", id: item.id })} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Xem chi tiết</button></article>)}</div></section>
      </>}

      {view === "evaluation" && <>
        {draftSavedAt && !submitted && <div role="status" className="flex items-center gap-3 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm text-purple-900 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-100"><span className="material-symbols-outlined text-purple-700 dark:text-purple-300" aria-hidden="true">cloud_done</span><span><strong>Bản nháp đã lưu lúc {draftSavedAt}</strong><span className="block text-xs opacity-75">Điểm và nhận xét hiện tại được giữ trong phiên UI Preview.</span></span></div>}
        <ViewHeading eyebrow="Phiếu đánh giá" title={submitted ? "Phiếu phản biện đã nộp" : "Đánh giá hồ sơ RU-VN-2026-BIO-08"} description={submitted ? "Phiếu đã chuyển sang chỉ đọc sau thao tác nộp demo." : "Chấm điểm theo rubric, nhập nhận xét, lưu bản nháp và mở modal xác nhận trước khi nộp."} action={<StatusPill state={submitted ? "SUBMITTED" : "DRAFT"} />} />
        <section className="grid gap-5 xl:grid-cols-[1fr_320px]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="space-y-4"><ScoreField id="novelty" label="Tính mới & giá trị khoa học" weight="30%" value={novelty} onChange={setNovelty} disabled={submitted || busy} /><ScoreField id="methodology" label="Phương pháp nghiên cứu" weight="25%" value={methodology} onChange={setMethodology} disabled={submitted || busy} /><ScoreField id="feasibility" label="Tính khả thi & bổ trợ song phương" weight="30%" value={feasibility} onChange={setFeasibility} disabled={submitted || busy} /><ScoreField id="impact" label="Tiềm năng công bố & đào tạo" weight="15%" value={impact} onChange={setImpact} disabled={submitted || busy} /><div><label htmlFor="review-comment" className="text-sm font-bold text-slate-900 dark:text-white">Nhận xét chuyên môn</label><textarea id="review-comment" disabled={submitted || busy} rows={6} value={comment} onChange={(event) => { setComment(event.target.value); setValidationMessage(null); }} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm leading-6 text-slate-900 outline-none focus:border-purple-500 disabled:opacity-60 dark:bg-slate-950 dark:text-white" />{validationMessage && <p role="alert" className="mt-2 text-sm font-semibold text-red-700 dark:text-red-300">{validationMessage}</p>}</div></div>{!submitted && <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-card-border pt-5"><button type="button" disabled={busy} onClick={() => void saveDraft()} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 disabled:opacity-60 dark:text-slate-200">Lưu bản nháp demo</button><button type="button" disabled={busy} onClick={requestSubmit} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white hover:bg-purple-800 disabled:opacity-60">Xem trước & nộp</button></div>}{submitted && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"><strong className="block">Đã nộp trong UI Preview</strong><span className="mt-1 block">Không có dữ liệu nghiệp vụ nào được gửi tới backend.</span></div>}</div><aside className="space-y-4"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Tổng điểm quy đổi</p><strong className="mt-2 block font-mono text-4xl text-purple-700 dark:text-purple-300">{totalScore.toFixed(2)}</strong><span className="text-sm font-bold text-slate-500">/ 10</span><div className="mt-4"><StatusPill state="PASS" /></div></div><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Kiểm tra trước khi nộp</h2><ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300"><li>✓ 4 tiêu chí đã có điểm</li><li>✓ Nhận xét tối thiểu 30 ký tự</li><li>✓ Modal xác nhận trước submit</li></ul></div></aside></section>
      </>}

      {view === "history" && <>
        <ViewHeading eyebrow="Lịch sử phản biện" title="Các phiếu đã hoàn tất" description="Chỉ đọc kết quả đã nộp và xem nhật ký thao tác demo." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="divide-y divide-card-border">{assignments.filter((item) => item.state === "SUBMITTED").map((item) => <article key={item.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><StatusPill state="SUBMITTED" /><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-sm font-bold text-slate-950 dark:text-white">{item.title}</h2></div><button type="button" onClick={() => setDialog({ kind: "assignment", id: item.id })} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Xem lại</button></article>)}</div></section>
        <DemoActivityPanel scope="reviewer" />
      </>}

      {selectedAssignment && <WorkspaceTaskDialog title={selectedAssignment.title} eyebrow={`Hồ sơ phản biện · ${selectedAssignment.code}`} tone="purple" onClose={() => setDialog(null)} footer={<><button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Đóng</button>{selectedAssignment.state === "NEW" && <button type="button" disabled={busy} onClick={() => void startReview(selectedAssignment.id)} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white disabled:opacity-60">Bắt đầu đánh giá demo</button>}{selectedAssignment.state === "IN_REVIEW" && <Link href="/workspace/reviewer?view=evaluation" onClick={() => setDialog(null)} className="inline-flex min-h-10 items-center rounded-lg bg-purple-700 px-4 text-sm font-bold text-white">Mở phiếu đánh giá</Link>}</>}><div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><Metric value={selectedAssignment.due} label="Hạn xử lý" detail="Ngày minh họa" /><Metric value={selectedAssignment.field} label="Lĩnh vực" detail="Phạm vi phản biện" /><Metric value={selectedAssignment.state === "SUBMITTED" ? "Chỉ đọc" : "Có thể xử lý"} label="Quyền hiện tại" detail="Theo trạng thái hồ sơ" /></div><div className="rounded-xl border border-card-border p-4"><h3 className="text-sm font-bold text-slate-900 dark:text-white">Tóm tắt hồ sơ</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedAssignment.summary}</p></div><div className="rounded-xl bg-purple-50 p-4 text-sm leading-6 text-purple-950 dark:bg-purple-950/30 dark:text-purple-100"><strong className="block">Ẩn danh phản biện</strong>Thông tin hiển thị trong UI Preview chỉ phục vụ mô phỏng nghiệp vụ; danh tính reviewer không được đưa vào luồng hiển thị cho Researcher.</div></div></WorkspaceTaskDialog>}

      {dialog?.kind === "submit" && <WorkspaceTaskDialog title="Xác nhận nộp phiếu phản biện" eyebrow="Bước cuối trước khi nộp" tone="purple" onClose={() => setDialog(null)} footer={<><button type="button" onClick={() => setDialog(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Quay lại kiểm tra</button><button type="button" disabled={busy} onClick={() => void confirmSubmit()} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white disabled:opacity-60">Mô phỏng nộp phản biện</button></>}><div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><Metric value={`${totalScore.toFixed(2)}/10`} label="Tổng điểm" detail="Tính từ rubric" /><Metric value="4/4" label="Tiêu chí" detail="Đã có điểm" /></div><div className="rounded-xl border border-card-border p-4"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Nhận xét sẽ nộp</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{comment}</p></div><p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><strong>UI Preview:</strong> xác nhận này chỉ chuyển state demo sang “Đã nộp”; không gọi business backend.</p></div></WorkspaceTaskDialog>}
    </main>
  );
}
