"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { WorkspaceTaskDialog } from "@/features/workspace/components/WorkspaceTaskDialog";
import { useDemoWorkflow } from "./DemoWorkflowProvider";
import { ActivityTimeline, CollectionToolbar, EmptyState, FilterChip, InlineNotice, MetricCard, PageHeader, Panel, RoleNotificationCenter, StatusPill, WorkflowStepper } from "./WorkflowUI";
import type { ReviewAssignment, ReviewState } from "./types";

type View = "overview" | "assignments" | "evaluation" | "history";
const views = new Set<View>(["overview", "assignments", "evaluation", "history"]);

const reviewLabel = (state: ReviewState) => state === "UNASSIGNED" ? "Chưa phân công" : state === "ASSIGNED" ? "Mới phân công" : state === "IN_REVIEW" ? "Đang phản biện" : state === "OVERDUE" ? "Quá hạn" : state === "SUBMITTED" ? "Đã nộp" : "Đã hủy";
const reviewTone = (state: ReviewState): "slate" | "blue" | "purple" | "red" | "green" => state === "SUBMITTED" ? "green" : state === "OVERDUE" ? "red" : state === "IN_REVIEW" ? "purple" : state === "ASSIGNED" ? "blue" : "slate";

export function ReviewerInteractiveWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian phản biện…</div>}><Content /></React.Suspense>;
}

function Content() {
  const params = useSearchParams();
  const requested = params.get("view") as View | null;
  const view = requested && views.has(requested) ? requested : "overview";
  const { reviews, activities, startReview, saveReviewDraft, submitReview } = useDemoWorkflow();
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"ALL" | ReviewState>("ALL");
  const [selectedId, setSelectedId] = React.useState<string | null>(params.get("id"));
  const [workbenchId, setWorkbenchId] = React.useState<string | null>(params.get("id"));
  const [novelty, setNovelty] = React.useState(8.5);
  const [methodology, setMethodology] = React.useState(8);
  const [feasibility, setFeasibility] = React.useState(8.5);
  const [impact, setImpact] = React.useState(8);
  const [comment, setComment] = React.useState("Đề xuất có luận cứ khoa học rõ, phương pháp phù hợp và thể hiện tính bổ trợ giữa nhóm nghiên cứu Việt Nam – Liên bang Nga.");
  const [confirmSubmit, setConfirmSubmit] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = params.get("id");
    if (id) {
      setSelectedId(id);
      setWorkbenchId(id);
    }
  }, [params]);

  const assignedToMe = reviews.filter((item) => item.reviewer === "Chuyên gia #07" || item.state === "SUBMITTED");
  const active = assignedToMe.filter((item) => item.state !== "SUBMITTED" && item.state !== "CANCELLED");
  const history = assignedToMe.filter((item) => item.state === "SUBMITTED" || item.state === "CANCELLED");
  const selected = reviews.find((item) => item.id === selectedId) ?? null;
  const workbench = reviews.find((item) => item.id === workbenchId) ?? null;
  const total = novelty * .3 + methodology * .25 + feasibility * .3 + impact * .15;

  const filtered = assignedToMe.filter((item) => {
    const hit = `${item.code} ${item.title} ${item.field}`.toLowerCase().includes(query.trim().toLowerCase());
    return hit && (filter === "ALL" || item.state === filter);
  });

  const openWorkbench = (item: ReviewAssignment) => {
    if (item.conflict || item.state === "CANCELLED") return;
    if (item.state === "ASSIGNED") startReview(item.id);
    setWorkbenchId(item.id);
    setNovelty(item.score ?? 8.5);
    setMethodology(item.score ?? 8);
    setFeasibility(item.score ?? 8.5);
    setImpact(item.score ?? 8);
    setComment(item.comment ?? "");
    setMessage(null);
  };

  const save = () => {
    if (!workbench) return;
    if (comment.trim().length < 30) {
      setMessage("Nhận xét cần tối thiểu 30 ký tự trước khi lưu bản nháp.");
      return;
    }
    saveReviewDraft(workbench.id, total, comment);
    setMessage("Đã lưu bản nháp. Điểm và nhận xét được giữ trong shared workflow state.");
  };

  const submit = () => {
    if (!workbench) return;
    submitReview(workbench.id, total, comment);
    setConfirmSubmit(false);
    setMessage("Đã nộp phản biện. Cơ quan quyết định vừa nhận task mới qua notification.");
  };

  return <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
    <RoleNotificationCenter role="REVIEWER" />

    {view === "overview" && <>
      <PageHeader eyebrow="Hội đồng phản biện" title="Bàn làm việc phản biện" description="Reviewer chỉ xử lý hồ sơ được phân công. Dashboard ưu tiên deadline, xung đột và trạng thái workbench thay vì sao chép màn Điều phối." action={<Link href="/workspace/reviewer?view=assignments" className="inline-flex min-h-11 items-center rounded-xl bg-purple-700 px-4 text-sm font-bold text-white">Mở hàng đợi của tôi →</Link>} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard value={active.length} label="Đang mở" detail="Hồ sơ reviewer cần xử lý" href="/workspace/reviewer?view=assignments" /><MetricCard value={active.filter((item) => item.state === "OVERDUE").length} label="Quá hạn" detail="Ưu tiên xử lý ngay" href="/workspace/reviewer?view=assignments&status=OVERDUE" urgent /><MetricCard value={history.filter((item) => item.state === "SUBMITTED").length} label="Đã nộp" detail="Chuyển sang read-only" href="/workspace/reviewer?view=history" /><MetricCard value={reviews.filter((item) => item.conflict).length} label="Xung đột" detail="Không thể mở workbench" /></section>
      <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><Panel><div className="flex items-end justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Ưu tiên phản biện</h2><p className="text-sm text-slate-500">Sắp theo deadline và trạng thái.</p></div><StatusPill tone={active.some((item) => item.state === "OVERDUE") ? "red" : "purple"}>{active.length} việc</StatusPill></div><div className="divide-y divide-card-border">{active.map((item) => <button key={item.id} type="button" onClick={() => { setSelectedId(item.id); }} className="grid w-full gap-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center"><span><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code} · hạn {item.deadline}</span></span><StatusPill tone={reviewTone(item.state)}>{reviewLabel(item.state)}</StatusPill></button>)}</div></Panel><Panel><h2 className="text-lg font-bold text-slate-950 dark:text-white">Ranh giới vai trò</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><li>• Không tự chọn proposal.</li><li>• Không phân reviewer khác.</li><li>• Không ban hành quyết định.</li><li>• Sau submit, phiếu chỉ đọc và được handoff sang Cơ quan quyết định.</li></ul></Panel></section>
    </>}

    {view === "assignments" && <>
      <PageHeader eyebrow="Hồ sơ được phân công" title="Hàng đợi phản biện" description="Collection-first: tìm, lọc, mở hồ sơ, kiểm tra conflict và deadline; chỉ sau đó mới vào workbench đánh giá." />
      <CollectionToolbar query={query} onQueryChange={setQuery}><div className="flex flex-wrap gap-2"><FilterChip active={filter === "ALL"} onClick={() => setFilter("ALL")}>Tất cả {assignedToMe.length}</FilterChip><FilterChip active={filter === "ASSIGNED"} onClick={() => setFilter("ASSIGNED")}>Mới</FilterChip><FilterChip active={filter === "IN_REVIEW"} onClick={() => setFilter("IN_REVIEW")}>Đang làm</FilterChip><FilterChip active={filter === "OVERDUE"} onClick={() => setFilter("OVERDUE")}>Quá hạn</FilterChip><FilterChip active={filter === "SUBMITTED"} onClick={() => setFilter("SUBMITTED")}>Đã nộp</FilterChip></div></CollectionToolbar>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)]"><Panel>{filtered.length ? <div className="divide-y divide-card-border">{filtered.map((item) => <article key={item.id} className={`py-5 ${selectedId === item.id ? "rounded-xl bg-blue-50 px-3 dark:bg-blue-950/20" : ""}`}><div className="flex flex-wrap items-center gap-2"><StatusPill tone={reviewTone(item.state)}>{reviewLabel(item.state)}</StatusPill>{item.conflict && <StatusPill tone="red">Conflict</StatusPill>}<span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.field} · Hạn {item.deadline}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setSelectedId(item.id)} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Xem hồ sơ</button>{item.state !== "SUBMITTED" && item.state !== "CANCELLED" && !item.conflict && <button type="button" onClick={() => openWorkbench(item)} className="min-h-10 rounded-lg bg-purple-700 px-3 text-sm font-bold text-white">{item.state === "ASSIGNED" ? "Bắt đầu phản biện" : "Tiếp tục đánh giá"}</button>}</div></article>)}</div> : <EmptyState title="Không có hồ sơ" detail="Đổi bộ lọc hoặc từ khóa để xem các trường hợp khác." />}</Panel><Panel>{selected ? <div className="space-y-5"><div><div className="flex flex-wrap gap-2"><StatusPill tone={reviewTone(selected.state)}>{reviewLabel(selected.state)}</StatusPill>{selected.conflict && <StatusPill tone="red">Xung đột lợi ích</StatusPill>}</div><h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">{selected.title}</h2><p className="mt-1 font-mono text-xs text-slate-500">{selected.code}</p></div><WorkflowStepper current="review" /><dl className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Lĩnh vực</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selected.field}</dd></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Deadline</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selected.deadline}</dd></div></dl>{selected.conflict && <InlineNotice tone="danger" title="Không thể phản biện">Hồ sơ có xung đột lợi ích trong dữ liệu mẫu. Reviewer không được phép mở workbench.</InlineNotice>}<div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Hoạt động hồ sơ</h3><div className="mt-3"><ActivityTimeline items={activities.filter((activity) => activity.entityId === selected.id)} /></div></div></div> : <EmptyState title="Chọn một hồ sơ" detail="Detail sẽ hiển thị ở đây thay vì nhảy thẳng vào một phiếu cố định." />}</Panel></section>
    </>}

    {view === "evaluation" && <>
      {!workbench ? <><PageHeader eyebrow="Phiếu đánh giá" title="Chọn hồ sơ để đánh giá" description="Không mở thẳng một phiếu hard-code. Reviewer chọn từ collection theo trạng thái và deadline." /><Panel><div className="divide-y divide-card-border">{active.map((item) => <button key={item.id} type="button" disabled={item.conflict} onClick={() => openWorkbench(item)} className="grid w-full gap-3 py-4 text-left disabled:cursor-not-allowed disabled:opacity-50 sm:grid-cols-[1fr_auto] sm:items-center"><span><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code} · {item.deadline}</span></span><span className="flex items-center gap-2"><StatusPill tone={reviewTone(item.state)}>{reviewLabel(item.state)}</StatusPill><span className="text-sm font-bold text-purple-700 dark:text-purple-300">Mở workbench →</span></span></button>)}</div></Panel></> : <><PageHeader eyebrow="Workbench phản biện" title={`Đánh giá ${workbench.code}`} description="Rubric, nhận xét, lưu nháp và submit là workflow riêng của Reviewer; submit sẽ tạo handoff thật trong shared demo state." action={<button type="button" onClick={() => setWorkbenchId(null)} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">← Trở lại danh sách</button>} />{message && <InlineNotice tone={message.startsWith("Đã") ? "success" : "warning"} title="Trạng thái workbench">{message}</InlineNotice>}<section className="grid gap-5 xl:grid-cols-[1fr_320px]"><Panel><div className="space-y-4">{[
        ["Tính mới & giá trị khoa học", novelty, setNovelty, "30%"],
        ["Phương pháp nghiên cứu", methodology, setMethodology, "25%"],
        ["Tính khả thi & bổ trợ song phương", feasibility, setFeasibility, "30%"],
        ["Tiềm năng công bố & đào tạo", impact, setImpact, "15%"],
      ].map(([label, value, setter, weight]) => <div key={String(label)} className="rounded-xl border border-card-border p-4"><div className="flex items-center justify-between gap-3"><label className="text-sm font-bold text-slate-900 dark:text-white">{String(label)} <span className="font-medium text-slate-500">({String(weight)})</span></label><strong className="font-mono text-purple-700 dark:text-purple-300">{Number(value).toFixed(1)}/10</strong></div><input type="range" min="1" max="10" step="0.5" value={Number(value)} onChange={(event) => (setter as React.Dispatch<React.SetStateAction<number>>)(Number(event.target.value))} className="mt-4 w-full accent-purple-700" /></div>)}<div><label htmlFor="review-comment-v2" className="text-sm font-bold text-slate-900 dark:text-white">Nhận xét chuyên môn</label><textarea id="review-comment-v2" rows={7} value={comment} onChange={(event) => { setComment(event.target.value); setMessage(null); }} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm leading-6 text-slate-900 outline-none focus:border-purple-500 dark:bg-slate-950 dark:text-white" /></div><div className="flex flex-wrap justify-end gap-2 border-t border-card-border pt-5"><button type="button" onClick={save} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Lưu bản nháp</button><button type="button" disabled={comment.trim().length < 30} onClick={() => setConfirmSubmit(true)} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Xem trước & nộp</button></div></div></Panel><aside className="space-y-4"><Panel><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Tổng điểm</p><strong className="mt-2 block font-mono text-4xl text-purple-700 dark:text-purple-300">{total.toFixed(2)}</strong><span className="text-sm text-slate-500">/ 10</span></Panel><InlineNotice tone={workbench.state === "OVERDUE" ? "danger" : "info"} title={workbench.state === "OVERDUE" ? "Đã quá hạn" : "Kiểm tra trước submit"}>4 tiêu chí đã có điểm · nhận xét tối thiểu 30 ký tự · submit sẽ khóa phiếu và gửi notification sang Cơ quan quyết định.</InlineNotice></aside></section></>}</>}

    {view === "history" && <><PageHeader eyebrow="Lịch sử phản biện" title="Phiếu đã hoàn tất" description="Collection read-only; mỗi item vẫn có detail và activity thay vì chỉ một dòng text." /><Panel><div className="divide-y divide-card-border">{history.map((item) => <article key={item.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex gap-2"><StatusPill tone={reviewTone(item.state)}>{reviewLabel(item.state)}</StatusPill><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.score ? `${item.score.toFixed(2)}/10 · ` : ""}{item.comment ?? "Không có nhận xét."}</p></div><button type="button" onClick={() => setSelectedId(item.id)} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Xem read-only</button></article>)}</div></Panel></>}

    {confirmSubmit && workbench && <WorkspaceTaskDialog title="Xác nhận nộp phản biện" eyebrow={workbench.code} tone="purple" onClose={() => setConfirmSubmit(false)} footer={<><button type="button" onClick={() => setConfirmSubmit(false)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Quay lại</button><button type="button" onClick={submit} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white">Nộp phản biện</button></>}><div className="space-y-4"><InlineNotice tone="warning" title="Sau khi nộp">Phiếu chuyển sang read-only. Cơ quan quyết định sẽ nhận task mới trong notification center.</InlineNotice><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Tổng điểm</span><strong className="mt-1 block text-2xl text-slate-950 dark:text-white">{total.toFixed(2)}/10</strong></div><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Nhận xét</span><strong className="mt-1 block text-sm text-slate-950 dark:text-white">{comment.length} ký tự</strong></div></div></div></WorkspaceTaskDialog>}
  </main>;
}
