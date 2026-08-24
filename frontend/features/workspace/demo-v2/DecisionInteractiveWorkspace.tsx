"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { WorkspaceTaskDialog } from "@/features/workspace/components/WorkspaceTaskDialog";
import { useDemoWorkflow } from "./DemoWorkflowProvider";
import { ActivityTimeline, CollectionToolbar, EmptyState, InlineNotice, MetricCard, PageHeader, Panel, RoleNotificationCenter, StatusPill, WorkflowStepper } from "./WorkflowUI";
import type { DecisionState } from "./types";

type View = "overview" | "queue" | "history" | "projects";
const views = new Set<View>(["overview", "queue", "history", "projects"]);
const label: Record<DecisionState, string> = { PENDING: "Chờ quyết định", REVISION: "Yêu cầu hoàn thiện", APPROVED: "Đã chấp thuận", REJECTED: "Không chấp thuận" };
const tone = (state: DecisionState): "slate" | "amber" | "green" | "red" => state === "APPROVED" ? "green" : state === "REVISION" ? "amber" : state === "REJECTED" ? "red" : "slate";

export function DecisionInteractiveWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian quyết định…</div>}><Content /></React.Suspense>;
}

function Content() {
  const params = useSearchParams();
  const requested = params.get("view") as View | null;
  const view = requested && views.has(requested) ? requested : "overview";
  const { decisions, projects, activities, issueDecision } = useDemoWorkflow();
  const [query, setQuery] = React.useState("");
  const [selectedDecisionId, setSelectedDecisionId] = React.useState<string | null>(params.get("id"));
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(params.get("id"));
  const [action, setAction] = React.useState<DecisionState | null>(null);
  const [rationale, setRationale] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = params.get("id");
    if (view === "queue" || view === "history") setSelectedDecisionId(id);
    if (view === "projects") setSelectedProjectId(id);
  }, [params, view]);

  const pending = decisions.filter((item) => item.state === "PENDING");
  const history = decisions.filter((item) => item.state !== "PENDING");
  const selected = decisions.find((item) => item.id === selectedDecisionId) ?? null;
  const selectedProject = projects.find((item) => item.id === selectedProjectId) ?? null;
  const filteredPending = pending.filter((item) => `${item.code} ${item.title} ${item.organizations}`.toLowerCase().includes(query.toLowerCase()));
  const filteredHistory = history.filter((item) => `${item.code} ${item.title} ${item.organizations} ${item.rationale ?? ""}`.toLowerCase().includes(query.toLowerCase()));

  const openDecisionAction = (state: DecisionState) => {
    if (!selected) return;
    setRationale(selected.rationale ?? "Hồ sơ đáp ứng yêu cầu khoa học và thể hiện rõ giá trị hợp tác song phương trong phạm vi chương trình.");
    setAction(state);
  };

  const confirm = () => {
    if (!selected || !action || rationale.trim().length < 20) return;
    issueDecision(selected.id, action, rationale.trim());
    setAction(null);
    setToast(action === "APPROVED" ? "Đã chấp thuận; dự án được kích hoạt và các vai trò liên quan nhận notification." : action === "REVISION" ? "Đã yêu cầu hoàn thiện; Nhà nghiên cứu nhận task mới." : "Đã ghi nhận không chấp thuận và đóng bước quyết định.");
    window.setTimeout(() => setToast(null), 3200);
  };

  return <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
    <RoleNotificationCenter role="FOUNDATION_DECISION_MAKER" />
    {toast && <div role="status" className="fixed bottom-5 right-5 z-50 max-w-md rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl">{toast}</div>}

    {view === "overview" && <>
      <PageHeader eyebrow="Cơ quan quyết định" title="Bàn quyết định hồ sơ" description="Chỉ nhận hồ sơ đã đi qua xác nhận tổ chức, sàng lọc và phản biện. Vai trò này không tạo proposal, không phân reviewer và không xử lý nghiệp vụ tài chính." action={<Link href="/workspace/decisions?view=queue" className="inline-flex min-h-11 items-center rounded-xl bg-slate-800 px-4 text-sm font-bold text-white dark:bg-blue-700">Mở hồ sơ chờ quyết định →</Link>} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard value={pending.length} label="Chờ quyết định" detail="Đã hoàn tất phản biện" href="/workspace/decisions?view=queue" urgent={pending.length > 0} /><MetricCard value={history.filter((item) => item.state === "APPROVED").length} label="Đã chấp thuận" detail="Có thể chuyển triển khai" href="/workspace/decisions?view=history" /><MetricCard value={history.filter((item) => item.state === "REVISION").length} label="Yêu cầu hoàn thiện" detail="Có thể quay lại hàng đợi" href="/workspace/decisions?view=history" /><MetricCard value={projects.filter((item) => item.state === "ACTIVE").length} label="Dự án sau quyết định" detail="Theo dõi read-only" href="/workspace/decisions?view=projects" /></section>
      <section className="grid gap-5 xl:grid-cols-[1.12fr_.88fr]"><Panel><div className="flex items-center justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Hồ sơ sẵn sàng</h2><p className="text-sm text-slate-500">Chỉ những hồ sơ đủ đầu vào mới xuất hiện.</p></div><StatusPill tone="slate">{pending.length} hồ sơ</StatusPill></div><div className="divide-y divide-card-border">{pending.map((item) => <Link key={item.id} href={`/workspace/decisions?view=queue&id=${item.id}`} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center"><span><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code} · {item.score.toFixed(2)}/10</span></span><span className="text-sm font-bold text-blue-700 dark:text-blue-300">Xem hồ sơ →</span></Link>)}</div></Panel><Panel><h2 className="text-lg font-bold text-slate-950 dark:text-white">Đầu vào quyết định</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><li>• Xác nhận của các tổ chức.</li><li>• Kết quả sàng lọc điều kiện.</li><li>• Điểm và nhận xét phản biện.</li><li>• Lịch sử xử lý hồ sơ.</li></ul></Panel></section>
    </>}

    {view === "queue" && <>
      <PageHeader eyebrow="Hồ sơ chờ quyết định" title="Hàng đợi quyết định" description="Collection → detail → quyết định. Không mở thẳng một hồ sơ cố định và mọi action đều yêu cầu rationale trước khi handoff." />
      <CollectionToolbar query={query} onQueryChange={setQuery} />
      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]"><Panel>{filteredPending.length ? <div className="divide-y divide-card-border">{filteredPending.map((item) => <article key={item.id} className={`py-5 ${selectedDecisionId === item.id ? "rounded-xl bg-blue-50 px-3 dark:bg-blue-950/20" : ""}`}><div className="flex flex-wrap gap-2"><StatusPill tone="slate">Chờ quyết định</StatusPill><span className="font-mono text-xs text-slate-500">{item.code}</span><span className="text-xs font-bold text-slate-500">{item.score.toFixed(2)}/10</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.organizations}</p><button type="button" onClick={() => setSelectedDecisionId(item.id)} className="mt-4 min-h-10 rounded-lg bg-slate-800 px-3 text-sm font-bold text-white dark:bg-blue-700">Xem & quyết định</button></article>)}</div> : <EmptyState title="Không còn hồ sơ chờ quyết định" detail="Khi Reviewer submit một phiếu mới, shared workflow state sẽ đưa hồ sơ vào đây." />}</Panel><Panel>{selected ? <div className="space-y-5"><div><div className="flex items-center justify-between gap-3"><StatusPill tone={tone(selected.state)}>{label[selected.state]}</StatusPill><strong className="text-2xl text-blue-700 dark:text-blue-300">{selected.score.toFixed(2)}/10</strong></div><h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">{selected.title}</h2><p className="mt-1 font-mono text-xs text-slate-500">{selected.code}</p></div><WorkflowStepper current="decision" /><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Sàng lọc</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">Đạt</strong></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Tổ chức</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">Đã xác nhận</strong></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Phản biện</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{selected.score.toFixed(2)}/10</strong></div></div>{selected.state === "PENDING" && <div className="flex flex-wrap gap-2 border-t border-card-border pt-5"><button type="button" onClick={() => openDecisionAction("REVISION")} className="min-h-10 rounded-lg border border-amber-300 px-3 text-sm font-bold text-amber-800 dark:border-amber-800 dark:text-amber-200">Yêu cầu hoàn thiện</button><button type="button" onClick={() => openDecisionAction("REJECTED")} className="min-h-10 rounded-lg border border-rose-300 px-3 text-sm font-bold text-rose-700 dark:border-rose-900 dark:text-rose-300">Không chấp thuận</button><button type="button" onClick={() => openDecisionAction("APPROVED")} className="min-h-10 rounded-lg bg-blue-700 px-3 text-sm font-bold text-white">Chấp thuận</button></div>}<div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Dấu vết quyết định</h3><div className="mt-3"><ActivityTimeline items={activities.filter((item) => item.entityId === selected.id)} /></div></div></div> : <EmptyState title="Chọn một hồ sơ" detail="Tóm tắt đầu vào, workflow và action quyết định sẽ hiển thị ở đây." />}</Panel></section>
    </>}

    {view === "history" && <>
      <PageHeader eyebrow="Đã quyết định" title="Lịch sử quyết định" description="Không còn list text đơn giản. Mỗi quyết định mở được detail read-only gồm rationale, thời điểm và activity." />
      <CollectionToolbar query={query} onQueryChange={setQuery} placeholder="Tìm mã hồ sơ, kết quả hoặc lý do..." />
      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]"><Panel><div className="divide-y divide-card-border">{filteredHistory.map((item) => <article key={item.id} className={`py-5 ${selectedDecisionId === item.id ? "rounded-xl bg-blue-50 px-3 dark:bg-blue-950/20" : ""}`}><div className="flex flex-wrap gap-2"><StatusPill tone={tone(item.state)}>{label[item.state]}</StatusPill><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.rationale ?? "Chưa có lý do."}</p><button type="button" onClick={() => setSelectedDecisionId(item.id)} className="mt-4 min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Xem quyết định</button></article>)}</div></Panel><Panel>{selected && selected.state !== "PENDING" ? <div className="space-y-5"><div><StatusPill tone={tone(selected.state)}>{label[selected.state]}</StatusPill><h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">{selected.title}</h2><p className="mt-1 font-mono text-xs text-slate-500">{selected.code}</p></div><div className="rounded-xl border border-card-border p-4"><span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Lý do quyết định</span><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{selected.rationale}</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Điểm tổng hợp</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{selected.score.toFixed(2)}/10</strong></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Thời điểm</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{selected.decidedAt ?? "—"}</strong></div></div><ActivityTimeline items={activities.filter((item) => item.entityId === selected.id)} /></div> : <EmptyState title="Chọn một quyết định" detail="Detail read-only sẽ hiển thị lý do và dấu vết xử lý." />}</Panel></section>
    </>}

    {view === "projects" && <>
      <PageHeader eyebrow="Dự án sau quyết định" title="Theo dõi triển khai read-only" description="Cơ quan quyết định chỉ theo dõi kết quả sau phê duyệt; không cập nhật milestone và không can thiệp workflow của Nhà nghiên cứu." />
      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]"><Panel><div className="grid gap-4 md:grid-cols-2">{projects.map((item) => <button key={item.id} type="button" onClick={() => setSelectedProjectId(item.id)} className={`rounded-xl border p-4 text-left ${selectedProjectId === item.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "border-card-border"}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs text-slate-500">{item.code}</span><StatusPill tone={item.state === "COMPLETED" ? "green" : item.state === "BLOCKED" ? "red" : "blue"}>{item.state}</StatusPill></div><h2 className="mt-3 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-blue-700" style={{ width: `${item.progress}%` }} /></div><p className="mt-3 text-xs text-slate-500">{item.progress}% · {item.next}</p></button>)}</div></Panel><Panel>{selectedProject ? <div className="space-y-5"><div><span className="font-mono text-xs text-slate-500">{selectedProject.code}</span><h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{selectedProject.title}</h2></div><InlineNotice tone={selectedProject.state === "BLOCKED" ? "danger" : "info"} title="Theo dõi sau quyết định">{selectedProject.next}</InlineNotice><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Tiến độ</span><strong className="mt-1 block text-2xl text-slate-950 dark:text-white">{selectedProject.progress}%</strong></div><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Đối tác</span><strong className="mt-1 block text-sm text-slate-950 dark:text-white">{selectedProject.partner}</strong></div></div><ActivityTimeline items={activities.filter((item) => item.entityId === selectedProject.id)} /></div> : <EmptyState title="Chọn dự án" detail="Xem trạng thái read-only sau quyết định." />}</Panel></section>
    </>}

    {action && selected && <WorkspaceTaskDialog title={action === "APPROVED" ? "Chấp thuận hồ sơ" : action === "REVISION" ? "Yêu cầu hoàn thiện" : "Không chấp thuận hồ sơ"} eyebrow={selected.code} tone="slate" onClose={() => setAction(null)} footer={<><button type="button" onClick={() => setAction(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Quay lại</button><button type="button" disabled={rationale.trim().length < 20} onClick={confirm} className="min-h-10 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Ban hành trong UI Preview</button></>}><div className="space-y-4"><InlineNotice tone={action === "APPROVED" ? "success" : action === "REVISION" ? "warning" : "danger"} title="Hậu quả workflow">{action === "APPROVED" ? "Dự án được kích hoạt; Nhà nghiên cứu và Đại diện tổ chức nhận notification." : action === "REVISION" ? "Hồ sơ quay về trạng thái cần hoàn thiện; Nhà nghiên cứu nhận task mới." : "Hồ sơ kết thúc ở trạng thái không chấp thuận."}</InlineNotice><div><label htmlFor="decision-rationale-v2" className="text-sm font-bold text-slate-900 dark:text-white">Lý do quyết định</label><textarea id="decision-rationale-v2" rows={6} value={rationale} onChange={(event) => setRationale(event.target.value)} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm leading-6 text-slate-900 outline-none focus:border-blue-500 dark:bg-slate-950 dark:text-white" /><p className="mt-1 text-xs text-slate-500">Tối thiểu 20 ký tự để tránh quyết định thiếu rationale.</p></div></div></WorkspaceTaskDialog>}
  </main>;
}
