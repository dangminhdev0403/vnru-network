"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DemoActivityPanel } from "@/features/prototype-v3/components/DemoActivityPanel";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { commitDemoMutation } from "@/features/prototype-v3/demo-backend";
import { WorkspaceTaskDialog } from "./WorkspaceTaskDialog";

type DecisionView = "overview" | "queue" | "history" | "projects";
type DecisionState = "PENDING" | "APPROVED" | "REVISION" | "REJECTED";

type DecisionItem = {
  id: string;
  code: string;
  title: string;
  organizations: string;
  screening: string;
  reviewSummary: string;
  score: string;
  state: DecisionState;
  rationale?: string;
};

const views = new Set<DecisionView>(["overview", "queue", "history", "projects"]);

const initialItems: DecisionItem[] = [
  {
    id: "dc-01",
    code: "RU-VN-2026-MAR-02",
    title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh",
    organizations: "Đơn vị nghiên cứu VN ↔ POI RAS",
    screening: "Đủ điều kiện",
    reviewSummary: "Phản biện hoàn tất; khuyến nghị chấp thuận với chỉnh sửa nhỏ.",
    score: "8.6/10",
    state: "PENDING",
  },
  {
    id: "dc-02",
    code: "RU-VN-2025-OCEAN-03",
    title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ",
    organizations: "Đơn vị nghiên cứu VN ↔ FEB RAS",
    screening: "Đủ điều kiện",
    reviewSummary: "Đã hoàn tất phản biện và xử lý ý kiến.",
    score: "8.9/10",
    state: "APPROVED",
    rationale: "Hồ sơ đáp ứng yêu cầu khoa học và hợp tác song phương trong kịch bản demo.",
  },
];

function stateLabel(state: DecisionState) {
  if (state === "APPROVED") return "Đã chấp thuận";
  if (state === "REVISION") return "Yêu cầu hoàn thiện";
  if (state === "REJECTED") return "Không chấp thuận";
  return "Chờ quyết định";
}

function stateClass(state: DecisionState) {
  if (state === "APPROVED") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (state === "REVISION") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  if (state === "REJECTED") return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300";
  return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

function StatusPill({ state }: { state: DecisionState }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${stateClass(state)}`}>{stateLabel(state)}</span>;
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><strong className="block text-3xl font-extrabold text-slate-950 dark:text-white">{value}</strong><span className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">{label}</span><small className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</small></div>;
}

function ViewHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="flex flex-col gap-5 border-b border-card-border pb-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</header>;
}

export function DecisionTaskWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian quyết định…</div>}><DecisionTaskWorkspaceContent /></React.Suspense>;
}

function DecisionTaskWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as DecisionView | null;
  const view: DecisionView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const [items, setItems] = React.useState(initialItems);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [rationale, setRationale] = React.useState("Hồ sơ đáp ứng yêu cầu khoa học và thể hiện rõ giá trị hợp tác song phương.");
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [alert, setAlert] = React.useState("Có 1 hồ sơ đã hoàn tất phản biện và đang chờ quyết định.");
  const selected = items.find((item) => item.id === selectedId) ?? null;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  };

  const issueDecision = async (state: DecisionState) => {
    if (!selected) return;
    if (rationale.trim().length < 20) {
      setAlert("Lý do quyết định demo cần ít nhất 20 ký tự để mô phỏng bước ban hành.");
      return;
    }
    setBusy(true);
    await commitDemoMutation("decision", `Đã mô phỏng ${stateLabel(state).toLocaleLowerCase("vi")}`, `${selected.code} · ${rationale}`);
    setItems((current) => current.map((item) => item.id === selected.id ? { ...item, state, rationale } : item));
    setBusy(false);
    setSelectedId(null);
    setAlert(state === "APPROVED" ? "Quyết định demo đã hoàn tất; hồ sơ có thể chuyển sang bước triển khai dự án trong flow mô phỏng." : "Trạng thái hồ sơ demo đã được cập nhật theo quyết định vừa chọn.");
    showToast(`${stateLabel(state)} · chỉ cập nhật UI Preview.`);
  };

  const pending = items.filter((item) => item.state === "PENDING");
  const history = items.filter((item) => item.state !== "PENDING");

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Quyết định" />
      <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><strong>Phạm vi vai trò:</strong> đưa ra quyết định nghiệp vụ trên hồ sơ đã qua sàng lọc và phản biện. Giao diện không bao gồm tài trợ, ngân sách, giải ngân hay chức năng tài chính.</div>
      {alert && <div role="alert" className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 sm:flex-row sm:items-center sm:justify-between"><span>{alert}</span><button type="button" onClick={() => setAlert("")} className="text-left font-bold text-blue-800 dark:text-blue-200">Đã hiểu</button></div>}
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md"><span className="mr-2 text-xs font-extrabold uppercase tracking-wider text-blue-300">UI Preview</span>{toast}</div>}

      {view === "overview" && <>
        <ViewHeading eyebrow="Cơ quan quyết định" title="Tổng quan hồ sơ chờ quyết định" description="Tập trung vào hồ sơ đã đủ điều kiện để xem xét, quyết định đã ban hành và dự án liên quan. Đây là preview task-oriented, không phải Leadership Analytics." action={<Link href="/workspace/decisions?view=queue" className="inline-flex min-h-11 items-center rounded-xl bg-slate-800 px-4 text-sm font-bold text-white hover:bg-slate-900 dark:bg-blue-700 dark:hover:bg-blue-800">Mở hồ sơ chờ quyết định →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric value={String(pending.length).padStart(2, "0")} label="Chờ quyết định" detail="Đã qua sàng lọc và phản biện" /><Metric value={String(history.filter((item) => item.state === "APPROVED").length).padStart(2, "0")} label="Đã chấp thuận" detail="Trong kịch bản demo" /><Metric value={String(history.filter((item) => item.state === "REVISION").length).padStart(2, "0")} label="Cần hoàn thiện" detail="Có thể quay lại hàng đợi" /><Metric value="02" label="Dự án liên quan" detail="Theo dõi sau quyết định" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.08fr_.92fr]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="flex items-end justify-between gap-4 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc cần xử lý</h2><p className="mt-1 text-sm text-slate-500">Hồ sơ đã sẵn sàng cho bước quyết định.</p></div><StatusPill state="PENDING" /></div><div className="divide-y divide-card-border">{pending.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className="grid w-full gap-3 py-4 text-left sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-blue-700" aria-hidden="true">gavel</span><div><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code}</span></div><span className="text-sm font-bold text-blue-700 dark:text-blue-300">Xem hồ sơ →</span></button>)}</div></div><aside className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Dữ liệu đầu vào</p><h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">Quyết định dựa trên gì?</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><li>• Trạng thái xác nhận của các tổ chức.</li><li>• Kết quả sàng lọc điều kiện.</li><li>• Tổng hợp phản biện và khuyến nghị.</li><li>• Lịch sử xử lý hồ sơ.</li></ul></aside></section>
        <DemoActivityPanel scope="decision" />
      </>}

      {view === "queue" && <>
        <ViewHeading eyebrow="Hồ sơ chờ quyết định" title="Hàng đợi quyết định" description="Mở từng hồ sơ để xem tóm tắt sàng lọc, phản biện, timeline và mô phỏng một trong ba kết quả: chấp thuận, yêu cầu hoàn thiện, không chấp thuận." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="divide-y divide-card-border">{pending.length > 0 ? pending.map((item) => <article key={item.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><StatusPill state={item.state} /><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.organizations} · Điểm tổng hợp {item.score}</p></div><button type="button" onClick={() => setSelectedId(item.id)} className="min-h-10 rounded-lg bg-slate-800 px-3 text-sm font-bold text-white dark:bg-blue-700">Xem & quyết định</button></article>) : <div className="py-12 text-center"><span className="material-symbols-outlined text-4xl text-slate-400" aria-hidden="true">task_alt</span><p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Không còn hồ sơ demo chờ quyết định.</p></div>}</div></section>
      </>}

      {view === "history" && <>
        <ViewHeading eyebrow="Đã quyết định" title="Lịch sử quyết định" description="Các hồ sơ đã xử lý được trình bày ở chế độ chỉ đọc với trạng thái, lý do và dấu vết hoạt động demo." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="divide-y divide-card-border">{history.map((item) => <article key={item.id} className="py-5"><div className="flex flex-wrap items-center gap-2"><StatusPill state={item.state} /><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{item.rationale ?? "Không có lý do lưu trong dữ liệu mẫu."}</p></article>)}</div></section>
        <DemoActivityPanel scope="decision" />
      </>}

      {view === "projects" && <>
        <ViewHeading eyebrow="Dự án" title="Theo dõi dự án sau quyết định" description="Chỉ đọc trạng thái triển khai của các hồ sơ đã được chấp thuận. Không hiển thị hoặc xử lý bất kỳ dữ liệu tài chính nào." />
        <section className="grid gap-4 lg:grid-cols-2">{[
          ["RU-VN-2025-OCEAN-03", "Đồng bộ chuỗi quan trắc hải dương học ven bờ", "48%", "Đang triển khai"],
          ["RU-VN-2026-BIO-08", "Độ bền vật liệu Nano-composite", "75%", "Đang triển khai"],
        ].map(([code, title, progress, state]) => <article key={code} className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs text-slate-500">{code}</span><span className="text-xs font-bold text-blue-700 dark:text-blue-300">{state}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{title}</h2><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-blue-700" style={{ width: progress }} /></div><span className="mt-2 block text-xs text-slate-500">Tiến độ mô phỏng {progress}</span></article>)}</section>
      </>}

      {selected && <WorkspaceTaskDialog title={selected.title} eyebrow="Hồ sơ quyết định" tone="slate" onClose={() => setSelectedId(null)} footer={<><button type="button" disabled={busy} onClick={() => void issueDecision("REVISION")} className="min-h-10 rounded-lg border border-amber-300 px-4 text-sm font-bold text-amber-800 dark:border-amber-800 dark:text-amber-200">Yêu cầu hoàn thiện</button><button type="button" disabled={busy} onClick={() => void issueDecision("REJECTED")} className="min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-bold text-rose-700 dark:border-rose-900 dark:text-rose-300">Không chấp thuận</button><button type="button" disabled={busy} onClick={() => void issueDecision("APPROVED")} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-60">Mô phỏng chấp thuận</button></>}><div className="space-y-5"><div className="grid gap-3 sm:grid-cols-3"><Metric value={selected.score} label="Điểm tổng hợp" detail="Từ phản biện demo" /><Metric value="Đạt" label="Sàng lọc" detail={selected.screening} /><Metric value="2/2" label="Tổ chức" detail="Đã xác nhận trong kịch bản" /></div><div className="rounded-xl border border-card-border p-4"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Tóm tắt phản biện</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{selected.reviewSummary}</p></div><div><label htmlFor="decision-rationale" className="text-sm font-bold text-slate-900 dark:text-white">Lý do / ghi chú quyết định demo</label><textarea id="decision-rationale" rows={4} value={rationale} onChange={(event) => setRationale(event.target.value)} className="mt-2 w-full rounded-xl border border-card-border bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:bg-slate-950 dark:text-white" /></div></div></WorkspaceTaskDialog>}
    </main>
  );
}
