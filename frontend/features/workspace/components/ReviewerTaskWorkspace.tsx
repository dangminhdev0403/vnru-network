"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DemoActivityPanel } from "@/features/prototype-v3/components/DemoActivityPanel";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { commitDemoMutation } from "@/features/prototype-v3/demo-backend";

type ReviewerView = "overview" | "assignments" | "evaluation" | "history";
type AssignmentState = "NEW" | "IN_REVIEW" | "SUBMITTED";

const views = new Set<ReviewerView>(["overview", "assignments", "evaluation", "history"]);

const assignments: Array<{ id: string; code: string; title: string; field: string; due: string; state: AssignmentState }> = [
  { id: "rv-01", code: "RU-VN-2026-BIO-08", title: "Độ bền vật liệu Nano-composite trong môi trường biển nhiệt đới", field: "Khoa học Vật liệu & Hóa lý Biển", due: "30/08/2026", state: "IN_REVIEW" },
  { id: "rv-02", code: "RU-VN-2026-AI-04", title: "Mô hình AI dự báo sớm tai biến địa chất ven biển", field: "AI & Địa chất Biển", due: "08/09/2026", state: "NEW" },
  { id: "rv-03", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", field: "Sinh học Biển", due: "18/08/2026", state: "SUBMITTED" },
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

function ScoreField({ id, label, weight, value, onChange }: { id: string; label: string; weight: string; value: number; onChange: (value: number) => void }) {
  return <div className="rounded-xl border border-card-border p-4"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><label htmlFor={id} className="text-sm font-bold text-slate-900 dark:text-white">{label} <span className="font-medium text-slate-500">({weight})</span></label><strong className="font-mono text-lg text-purple-700 dark:text-purple-300">{value.toFixed(1)}/10</strong></div><input id={id} type="range" min="1" max="10" step="0.5" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 w-full accent-purple-700" /></div>;
}

export function ReviewerTaskWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian phản biện…</div>}><ReviewerTaskWorkspaceContent /></React.Suspense>;
}

function ReviewerTaskWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as ReviewerView | null;
  const view: ReviewerView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const [novelty, setNovelty] = React.useState(8.5);
  const [methodology, setMethodology] = React.useState(8.0);
  const [feasibility, setFeasibility] = React.useState(9.0);
  const [impact, setImpact] = React.useState(8.5);
  const [comment, setComment] = React.useState("Đề xuất có luận cứ khoa học rõ, phương pháp phù hợp và thể hiện tính bổ trợ giữa nhóm nghiên cứu Việt Nam – Liên bang Nga.");
  const [submitted, setSubmitted] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [validationMessage, setValidationMessage] = React.useState<string | null>(null);
  const totalScore = novelty * 0.3 + methodology * 0.25 + feasibility * 0.3 + impact * 0.15;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const saveDraft = async () => {
    setBusy(true);
    await commitDemoMutation("reviewer", "Đã lưu bản nháp phản biện", `RU-VN-2026-BIO-08 · ${totalScore.toFixed(2)}/10`);
    setBusy(false);
    showToast("Bản nháp chỉ được ghi vào nhật ký demo.");
  };

  const submitReview = async () => {
    if (comment.trim().length < 30) {
      setValidationMessage("Nhận xét demo cần tối thiểu 30 ký tự để mô phỏng bước nộp.");
      return;
    }
    setValidationMessage(null);
    setBusy(true);
    await commitDemoMutation("reviewer", "Đã mô phỏng nộp phản biện", `RU-VN-2026-BIO-08 · ${totalScore.toFixed(2)}/10`);
    setSubmitted(true);
    setBusy(false);
    showToast("Phiếu đã chuyển sang trạng thái Đã nộp trong UI Preview.");
  };

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Phản biện" />
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-purple-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md"><span className="mr-2 text-xs font-extrabold uppercase tracking-wider text-purple-300">UI Preview</span>{toast}</div>}

      {view === "overview" && <>
        <ViewHeading eyebrow="Không gian phản biện" title="Tổng quan phản biện" description="Tập trung vào hồ sơ được phân công, hạn xử lý và trạng thái phiếu đánh giá. Không lẫn màn nhập điểm vào màn tổng quan." action={<Link href="/workspace/reviewer?view=assignments" className="inline-flex min-h-11 items-center rounded-xl bg-purple-700 px-4 text-sm font-bold text-white hover:bg-purple-800">Mở hồ sơ được phân công →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric value="02" label="Hồ sơ đang mở" detail="1 mới · 1 đang đánh giá" /><Metric value="01" label="Cần hoàn tất sớm" detail="Hạn 30/08/2026" /><Metric value={submitted ? "02" : "01"} label="Đã nộp phản biện" detail="Trong kịch bản demo hiện tại" /><Metric value="8.50" label="Điểm bản nháp hiện tại" detail="RU-VN-2026-BIO-08" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="flex items-end justify-between gap-4 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc cần làm</h2><p className="mt-1 text-sm text-slate-500">Ưu tiên theo hạn và trạng thái.</p></div><StatusPill state="IN_REVIEW" /></div><div className="divide-y divide-card-border"><Link href="/workspace/reviewer?view=evaluation" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-purple-700" aria-hidden="true">rate_review</span><div><strong className="block text-sm text-slate-900 dark:text-white">Hoàn tất phiếu RU-VN-2026-BIO-08</strong><span className="mt-1 block text-xs text-slate-500">Đang có bản nháp điểm và nhận xét</span></div><StatusPill state={submitted ? "SUBMITTED" : "IN_REVIEW"} /></Link><Link href="/workspace/reviewer?view=assignments" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-purple-700" aria-hidden="true">assignment</span><div><strong className="block text-sm text-slate-900 dark:text-white">Đọc hồ sơ RU-VN-2026-AI-04</strong><span className="mt-1 block text-xs text-slate-500">Hồ sơ mới được phân công</span></div><StatusPill state="NEW" /></Link></div></div>
          <aside className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300">Hồ sơ đang xử lý</p><h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">RU-VN-2026-BIO-08</h2><p className="mt-2 text-sm leading-6 text-slate-500">Độ bền vật liệu Nano-composite trong môi trường biển nhiệt đới.</p><dl className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Lĩnh vực</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">Vật liệu biển</dd></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Hạn demo</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">30/08/2026</dd></div></dl><Link href="/workspace/reviewer?view=evaluation" className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Tiếp tục đánh giá →</Link></aside>
        </section>
      </>}

      {view === "assignments" && <>
        <ViewHeading eyebrow="Hồ sơ được phân công" title="Hàng đợi phản biện" description="Mỗi hồ sơ có hạn xử lý, trạng thái và hành động rõ ràng. Hồ sơ đã nộp chuyển sang chỉ đọc thay vì vẫn hiện nút chấm điểm." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="grid gap-3 border-b border-card-border pb-4 text-xs font-bold uppercase tracking-wider text-slate-500 md:grid-cols-[120px_1fr_150px_140px] md:px-3"><span>Mã hồ sơ</span><span>Đề xuất</span><span>Hạn xử lý</span><span>Trạng thái</span></div><div className="divide-y divide-card-border">{assignments.map((item) => <article key={item.id} className="grid gap-3 py-5 md:grid-cols-[120px_1fr_150px_140px] md:items-center md:px-3"><span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">{item.code}</span><div><h2 className="text-sm font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-1 text-xs text-slate-500">{item.field}</p><div className="mt-3 md:hidden"><StatusPill state={item.state} /></div>{item.state !== "SUBMITTED" && <Link href="/workspace/reviewer?view=evaluation" className="mt-3 inline-flex text-sm font-bold text-purple-700 dark:text-purple-300">{item.state === "NEW" ? "Mở hồ sơ" : "Tiếp tục đánh giá"} →</Link>}</div><span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.due}</span><div className="hidden md:block"><StatusPill state={item.state} /></div></article>)}</div></section>
      </>}

      {view === "evaluation" && <>
        <ViewHeading eyebrow="Phiếu đánh giá" title={submitted ? "Phiếu phản biện đã nộp" : "Đánh giá hồ sơ RU-VN-2026-BIO-08"} description={submitted ? "Trạng thái UI Preview đã chuyển sang chỉ đọc sau thao tác nộp demo. Có thể xem lại điểm và nhận xét đã nhập trong phiên này." : "Chấm điểm theo rubric, nhập nhận xét và kiểm tra tổng điểm trước khi mô phỏng bước nộp. Đây không phải thao tác backend."} action={<StatusPill state={submitted ? "SUBMITTED" : "DRAFT"} />} />
        <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><fieldset disabled={submitted || busy} className="space-y-4"><legend className="sr-only">Rubric phản biện</legend><ScoreField id="novelty" label="Tính mới & giá trị khoa học" weight="30%" value={novelty} onChange={setNovelty} /><ScoreField id="methodology" label="Phương pháp nghiên cứu" weight="25%" value={methodology} onChange={setMethodology} /><ScoreField id="feasibility" label="Tính khả thi & bổ trợ song phương" weight="30%" value={feasibility} onChange={setFeasibility} /><ScoreField id="impact" label="Tiềm năng công bố & đào tạo" weight="15%" value={impact} onChange={setImpact} /><div><label htmlFor="review-comment" className="text-sm font-bold text-slate-900 dark:text-white">Nhận xét chuyên môn</label><textarea id="review-comment" rows={6} value={comment} onChange={(event) => { setComment(event.target.value); setValidationMessage(null); }} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm leading-6 text-slate-900 outline-none focus:border-purple-500 dark:bg-slate-950 dark:text-white" />{validationMessage && <p role="alert" className="mt-2 text-sm font-semibold text-red-700 dark:text-red-300">{validationMessage}</p>}</div></fieldset>{!submitted && <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-card-border pt-5"><button type="button" disabled={busy} onClick={() => void saveDraft()} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 disabled:opacity-60 dark:text-slate-200">Lưu bản nháp demo</button><button type="button" disabled={busy} onClick={() => void submitReview()} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white hover:bg-purple-800 disabled:opacity-60">Mô phỏng nộp phản biện</button></div>}{submitted && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"><strong className="block">Đã nộp trong UI Preview</strong><span className="mt-1 block">Không có dữ liệu nghiệp vụ nào được gửi tới backend.</span></div>}</div>
          <aside className="space-y-4"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Tổng điểm quy đổi</p><strong className="mt-2 block font-mono text-4xl text-purple-700 dark:text-purple-300">{totalScore.toFixed(2)}</strong><span className="text-sm font-bold text-slate-500">/ 10</span><div className="mt-4"><StatusPill state="PASS" /></div></div><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Kiểm tra trước khi nộp</h2><ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300"><li>✓ 4 tiêu chí đã có điểm</li><li>✓ Nhận xét chuyên môn có nội dung</li><li>✓ Trạng thái hồ sơ đang cho phép đánh giá demo</li></ul></div></aside>
        </section>
      </>}

      {view === "history" && <>
        <ViewHeading eyebrow="Lịch sử phản biện" title="Các phiếu đã hoàn tất" description="Tách lịch sử khỏi màn chấm điểm. Người dùng chỉ đọc kết quả đã nộp và theo dõi nhật ký thao tác demo." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="divide-y divide-card-border">{[{ code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", score: "8.20", date: "18/08/2026" }, ...(submitted ? [{ code: "RU-VN-2026-BIO-08", title: "Độ bền vật liệu Nano-composite trong môi trường biển", score: totalScore.toFixed(2), date: "24/08/2026" }] : [])].map((item) => <article key={item.code} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><StatusPill state="SUBMITTED" /><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-sm font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-1 text-xs text-slate-500">Nộp: {item.date}</p></div><div className="text-left sm:text-right"><strong className="font-mono text-xl text-purple-700 dark:text-purple-300">{item.score}</strong><span className="block text-xs text-slate-500">/ 10</span></div></article>)}</div></section>
        <DemoActivityPanel scope="reviewer" />
      </>}
    </main>
  );
}
