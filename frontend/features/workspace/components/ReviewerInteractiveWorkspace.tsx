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

type ReviewerView = "overview" | "assignments" | "evaluation" | "history";
type ReviewState = "NEW" | "IN_REVIEW" | "WAITING_INFO" | "CONFLICT" | "OVERDUE" | "DRAFT" | "SUBMITTED" | "CANCELLED";

type Assignment = {
  id: string;
  code: string;
  title: string;
  field: string;
  due: string;
  state: ReviewState;
  summary: string;
  source: string;
};

const views = new Set<ReviewerView>(["overview", "assignments", "evaluation", "history"]);

const initialAssignments: Assignment[] = [
  { id: "rv-01", code: "RU-VN-2026-BIO-08", title: "Độ bền vật liệu Nano-composite trong môi trường biển nhiệt đới", field: "Vật liệu biển", due: "30/08/2026", state: "IN_REVIEW", summary: "Đánh giá tính mới, phương pháp thử nghiệm gia tốc và mức bổ trợ giữa hai nhóm nghiên cứu.", source: "Điều phối hợp tác" },
  { id: "rv-02", code: "RU-VN-2026-AI-04", title: "Mô hình AI dự báo sớm tai biến địa chất ven biển", field: "AI & Địa chất biển", due: "08/09/2026", state: "NEW", summary: "Hồ sơ mới được phân công, cần kiểm tra phương pháp, dữ liệu và khả năng kiểm chứng song phương.", source: "Điều phối hợp tác" },
  { id: "rv-03", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", field: "Sinh học biển", due: "24/08/2026", state: "OVERDUE", summary: "Phiếu chưa nộp đúng hạn; vẫn có thể hoàn thiện trong kịch bản preview.", source: "Điều phối hợp tác" },
  { id: "rv-04", code: "RU-VN-2026-DATA-05", title: "Chuẩn hóa dữ liệu quan trắc ven bờ Việt Nam – Liên bang Nga", field: "Dữ liệu khoa học", due: "12/09/2026", state: "WAITING_INFO", summary: "Đang chờ nhóm đề xuất bổ sung mô tả nguồn dữ liệu trước khi tiếp tục phản biện.", source: "Điều phối hợp tác" },
  { id: "rv-05", code: "RU-VN-2026-MAT-11", title: "Lớp phủ chống ăn mòn cho thiết bị nghiên cứu biển", field: "Hóa lý bề mặt", due: "15/09/2026", state: "CONFLICT", summary: "Reviewer đã khai báo xung đột lợi ích; hồ sơ cần được điều phối phân công lại.", source: "Điều phối hợp tác" },
  { id: "rv-06", code: "RU-VN-2026-ROBOT-03", title: "Robot tự hành lấy mẫu vùng nước nông", field: "Robot biển", due: "18/09/2026", state: "DRAFT", summary: "Đã lưu bản nháp điểm và nhận xét nhưng chưa nộp.", source: "Điều phối hợp tác" },
  { id: "rv-07", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", field: "Hải dương học", due: "18/08/2026", state: "SUBMITTED", summary: "Phiếu đã nộp và chuyển sang chỉ đọc.", source: "Điều phối hợp tác" },
  { id: "rv-08", code: "RU-VN-2026-GEO-09", title: "Đối chiếu trầm tích vùng cửa sông nhiệt đới", field: "Địa chất biển", due: "20/08/2026", state: "CANCELLED", summary: "Phân công đã bị hủy do thay đổi hội đồng phản biện.", source: "Điều phối hợp tác" },
];

function stateMeta(state: ReviewState): { label: string; tone: WorkspaceTone } {
  if (state === "NEW") return { label: "Mới phân công", tone: "amber" };
  if (state === "IN_REVIEW") return { label: "Đang phản biện", tone: "purple" };
  if (state === "WAITING_INFO") return { label: "Chờ bổ sung", tone: "amber" };
  if (state === "CONFLICT") return { label: "Xung đột lợi ích", tone: "red" };
  if (state === "OVERDUE") return { label: "Quá hạn", tone: "red" };
  if (state === "DRAFT") return { label: "Bản nháp", tone: "blue" };
  if (state === "SUBMITTED") return { label: "Đã nộp", tone: "green" };
  return { label: "Đã hủy", tone: "slate" };
}

function ScoreField({ label, weight, value, onChange, disabled }: { label: string; weight: string; value: number; onChange: (value: number) => void; disabled: boolean }) {
  return (
    <label className="block rounded-xl border border-card-border p-4">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-900 dark:text-white">
        <span>{label} <span className="font-medium text-slate-500">({weight})</span></span>
        <strong className="font-mono text-purple-700 dark:text-purple-300">{value.toFixed(1)}/10</strong>
      </span>
      <input type="range" min="1" max="10" step="0.5" value={value} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 w-full accent-purple-700 disabled:opacity-50" />
    </label>
  );
}

export function ReviewerInteractiveWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian phản biện…</div>}><ReviewerWorkspaceContent /></React.Suspense>;
}

function ReviewerWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as ReviewerView | null;
  const view: ReviewerView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const handoffs = useDemoHandoffs("reviewer");
  const [overrides, setOverrides] = React.useState<Record<string, ReviewState>>({});
  const [selectedCode, setSelectedCode] = React.useState(searchParams.get("id") || "RU-VN-2026-AI-04");
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("OPEN");
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [submitConfirm, setSubmitConfirm] = React.useState(false);
  const [novelty, setNovelty] = React.useState(8.5);
  const [methodology, setMethodology] = React.useState(8);
  const [feasibility, setFeasibility] = React.useState(8.5);
  const [impact, setImpact] = React.useState(8);
  const [comment, setComment] = React.useState("Đề xuất có luận cứ khoa học rõ, phương pháp phù hợp và thể hiện tính bổ trợ giữa nhóm nghiên cứu Việt Nam – Liên bang Nga.");
  const [validation, setValidation] = React.useState<string | null>(null);

  const dynamicAssignments: Assignment[] = handoffs
    .filter((item) => item.stage === "REVIEW_ASSIGNED" && !initialAssignments.some((assignment) => assignment.code === item.entityCode))
    .map((item) => ({ id: item.id, code: item.entityCode, title: item.title, field: "Hồ sơ được điều phối", due: "10/09/2026", state: "NEW", summary: "Hồ sơ được chuyển từ Điều phối hợp tác trong phiên preview hiện tại.", source: "Điều phối hợp tác · handoff" }));

  const assignments = [...dynamicAssignments, ...initialAssignments].map((item) => ({ ...item, state: overrides[item.code] ?? item.state }));
  const selected = assignments.find((item) => item.code === selectedCode) ?? assignments[0];
  const openStates: ReviewState[] = ["NEW", "IN_REVIEW", "WAITING_INFO", "CONFLICT", "OVERDUE", "DRAFT"];
  const normalizedQuery = query.trim().toLocaleLowerCase("vi");
  const filtered = assignments.filter((item) => {
    const matchesQuery = !normalizedQuery || `${item.code} ${item.title} ${item.field}`.toLocaleLowerCase("vi").includes(normalizedQuery);
    const matchesFilter = filter === "ALL" || (filter === "OPEN" ? openStates.includes(item.state) : item.state === filter);
    return matchesQuery && matchesFilter;
  });
  const totalScore = novelty * 0.3 + methodology * 0.25 + feasibility * 0.3 + impact * 0.15;
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2800); };

  const mutate = async (action: string, detail: string, after: () => void, options?: Parameters<typeof commitDemoMutation>[3]) => {
    setBusy(true);
    await commitDemoMutation("reviewer", action, detail, options);
    after();
    setBusy(false);
    showToast(`${action} · trạng thái preview đã cập nhật.`);
  };

  const startReview = (item: Assignment) => {
    void mutate("Đã bắt đầu phản biện", `${item.code} · ${item.title}`, () => setOverrides((current) => ({ ...current, [item.code]: "IN_REVIEW" })));
  };

  const reportConflict = (item: Assignment) => {
    void mutate(
      "Đã khai báo xung đột lợi ích",
      `${item.code} · cần điều phối lại reviewer`,
      () => setOverrides((current) => ({ ...current, [item.code]: "CONFLICT" })),
      {
        notifications: [{ scope: "manager", title: "Reviewer báo xung đột lợi ích", detail: `${item.code} cần phân công reviewer khác.`, href: "/workspace/collaboration?view=assignments" }],
        handoffs: [{ to: "manager", entityCode: item.code, title: item.title, stage: "REVIEWER_CONFLICT" }],
      },
    );
  };

  const saveDraft = () => {
    if (!selected) return;
    void mutate("Đã lưu bản nháp phản biện", `${selected.code} · ${totalScore.toFixed(2)}/10`, () => setOverrides((current) => ({ ...current, [selected.code]: "DRAFT" })));
  };

  const requestSubmit = () => {
    if (!selected) return;
    if (comment.trim().length < 30) {
      setValidation("Nhận xét cần ít nhất 30 ký tự trước khi nộp phiếu.");
      return;
    }
    setValidation(null);
    setSubmitConfirm(true);
  };

  const confirmSubmit = () => {
    if (!selected) return;
    void mutate(
      "Đã nộp phản biện",
      `${selected.code} · tổng điểm ${totalScore.toFixed(2)}/10`,
      () => { setOverrides((current) => ({ ...current, [selected.code]: "SUBMITTED" })); setSubmitConfirm(false); },
      {
        notifications: [
          { scope: "decision", title: "Hồ sơ đã hoàn tất phản biện", detail: `${selected.code} sẵn sàng cho bước quyết định.`, href: "/workspace/decisions?view=queue" },
          { scope: "manager", title: "Reviewer đã nộp phiếu", detail: `${selected.code} đã hoàn tất phản biện.`, href: "/workspace/collaboration?view=assignments" },
        ],
        handoffs: [{ to: "decision", entityCode: selected.code, title: selected.title, stage: "REVIEW_SUBMITTED" }],
      },
    );
  };

  const selectedState = selected ? stateMeta(selected.state) : stateMeta("NEW");
  const canEvaluate = selected && ["IN_REVIEW", "OVERDUE", "DRAFT"].includes(selected.state);

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Phản biện" />
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-purple-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md">{toast}</div>}

      {view === "overview" && <>
        <WorkspaceViewHeader eyebrow="Không gian phản biện" title="Bàn làm việc của Reviewer" tone="purple" description="Reviewer chỉ xử lý hồ sơ được phân công: nhận hồ sơ, kiểm tra xung đột, đánh giá theo rubric, lưu nháp và nộp phiếu. Không tự chọn proposal và không ban hành quyết định." action={<Link href="/workspace/reviewer?view=assignments" className="inline-flex min-h-11 items-center rounded-xl bg-purple-700 px-4 text-sm font-bold text-white hover:bg-purple-800">Mở hàng đợi phản biện →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <WorkspaceMetric value={String(assignments.filter((item) => openStates.includes(item.state)).length).padStart(2, "0")} label="Hồ sơ đang mở" detail="Mới, đang làm hoặc chờ xử lý" href="/workspace/reviewer?view=assignments" tone="purple" />
          <WorkspaceMetric value={String(assignments.filter((item) => item.state === "OVERDUE").length).padStart(2, "0")} label="Quá hạn" detail="Cần ưu tiên hoàn tất" href="/workspace/reviewer?view=assignments&status=OVERDUE" tone="red" />
          <WorkspaceMetric value={String(assignments.filter((item) => item.state === "CONFLICT").length).padStart(2, "0")} label="Xung đột" detail="Chờ điều phối lại reviewer" href="/workspace/reviewer?view=assignments&status=CONFLICT" tone="red" />
          <WorkspaceMetric value={String(assignments.filter((item) => item.state === "SUBMITTED").length).padStart(2, "0")} label="Đã nộp" detail="Phiếu chuyển sang chỉ đọc" href="/workspace/reviewer?view=history" tone="green" />
        </section>
        <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6">
            <div className="flex items-end justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc cần làm</h2><p className="mt-1 text-sm text-slate-500">Ưu tiên quá hạn, hồ sơ mới và bản nháp chưa nộp.</p></div><WorkspaceStatus tone="red">{assignments.filter((item) => item.state === "OVERDUE").length} quá hạn</WorkspaceStatus></div>
            <div className="divide-y divide-card-border">{assignments.filter((item) => ["OVERDUE", "NEW", "DRAFT", "IN_REVIEW"].includes(item.state)).slice(0, 5).map((item) => <button key={item.id} type="button" onClick={() => { setSelectedCode(item.code); }} className="grid w-full gap-3 py-4 text-left sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-purple-700" aria-hidden="true">assignment</span><div><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code} · hạn {item.due}</span></div><WorkspaceStatus tone={stateMeta(item.state).tone}>{stateMeta(item.state).label}</WorkspaceStatus></button>)}</div>
          </div>
          <WorkspaceNotificationPanel scope="reviewer" seed={[
            { id: "rv-n1", title: "BIO-08 còn 2 ngày", detail: "Phiếu đang ở trạng thái Đang phản biện.", href: "/workspace/reviewer?view=evaluation&id=RU-VN-2026-BIO-08", createdAt: "2026-08-24T08:10:00+07:00" },
            { id: "rv-n2", title: "MAR-02 đã quá hạn", detail: "Ưu tiên hoàn tất hoặc báo điều phối nếu có vướng mắc.", href: "/workspace/reviewer?view=assignments&status=OVERDUE", createdAt: "2026-08-24T07:20:00+07:00" },
          ]} />
        </section>
      </>}

      {view === "assignments" && <>
        <WorkspaceViewHeader eyebrow="Hồ sơ được phân công" title="Hàng đợi phản biện" tone="purple" description="Danh sách bao phủ hồ sơ mới, đang làm, chờ bổ sung, quá hạn, xung đột, bản nháp, đã nộp và đã hủy. Chọn một hồ sơ để mở panel chi tiết trước khi thao tác." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6">
          <WorkspaceCollectionToolbar query={query} onQueryChange={setQuery} placeholder="Tìm theo mã hồ sơ, tên hoặc lĩnh vực…" activeFilter={filter} onFilterChange={setFilter} filters={[
            { value: "OPEN", label: "Đang mở", count: assignments.filter((item) => openStates.includes(item.state)).length },
            { value: "NEW", label: "Mới", count: assignments.filter((item) => item.state === "NEW").length },
            { value: "OVERDUE", label: "Quá hạn", count: assignments.filter((item) => item.state === "OVERDUE").length },
            { value: "CONFLICT", label: "Xung đột", count: assignments.filter((item) => item.state === "CONFLICT").length },
            { value: "SUBMITTED", label: "Đã nộp", count: assignments.filter((item) => item.state === "SUBMITTED").length },
            { value: "ALL", label: "Tất cả", count: assignments.length },
          ]} />
          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
            <div className="divide-y divide-card-border">{filtered.length ? filtered.map((item) => <button key={item.id} type="button" onClick={() => setSelectedCode(item.code)} aria-pressed={selected?.code === item.code} className={`grid w-full gap-3 px-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center ${selected?.code === item.code ? "rounded-xl bg-purple-50 dark:bg-purple-950/20" : ""}`}><div><div className="flex flex-wrap items-center gap-2"><WorkspaceStatus tone={stateMeta(item.state).tone}>{stateMeta(item.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><strong className="mt-2 block text-sm leading-6 text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.field} · hạn {item.due}</span></div><span className="text-sm font-bold text-purple-700 dark:text-purple-300">Mở chi tiết →</span></button>) : <WorkspaceEmptyState title="Không có hồ sơ phù hợp" detail="Thử đổi từ khóa hoặc bộ lọc trạng thái." action={<button type="button" onClick={() => { setQuery(""); setFilter("ALL"); }} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white">Xóa bộ lọc</button>} />}</div>
            {selected && <aside className="h-fit rounded-2xl border border-card-border bg-slate-50 p-5 dark:bg-slate-950/50"><div className="flex flex-wrap items-center justify-between gap-2"><WorkspaceStatus tone={selectedState.tone}>{selectedState.label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selected.code}</span></div><h2 className="mt-3 text-lg font-bold leading-7 text-slate-950 dark:text-white">{selected.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{selected.summary}</p><dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><div className="rounded-xl border border-card-border bg-white p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Hạn phản biện</dt><dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{selected.due}</dd></div><div className="rounded-xl border border-card-border bg-white p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Nguồn phân công</dt><dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{selected.source}</dd></div></dl><div className="mt-5"><WorkspaceWorkflowStepper steps={[{ label: "Phân công", state: "done" }, { label: "Kiểm tra xung đột", state: selected.state === "CONFLICT" ? "blocked" : "done" }, { label: "Đánh giá", state: selected.state === "NEW" ? "waiting" : selected.state === "SUBMITTED" ? "done" : selected.state === "CANCELLED" || selected.state === "WAITING_INFO" ? "blocked" : "current" }, { label: "Nộp phiếu", state: selected.state === "SUBMITTED" ? "done" : "waiting" }]} /></div><div className="mt-5 flex flex-wrap gap-2">{selected.state === "NEW" && <button type="button" disabled={busy} onClick={() => startReview(selected)} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white disabled:opacity-60">Bắt đầu phản biện</button>}{["NEW", "IN_REVIEW", "DRAFT", "OVERDUE"].includes(selected.state) && <button type="button" disabled={busy} onClick={() => reportConflict(selected)} className="min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-bold text-rose-700 dark:border-rose-900 dark:text-rose-300">Báo xung đột</button>}{["IN_REVIEW", "DRAFT", "OVERDUE"].includes(selected.state) && <Link href={`/workspace/reviewer?view=evaluation&id=${selected.code}`} className="inline-flex min-h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white dark:bg-purple-700">Mở phiếu đánh giá →</Link>}{selected.state === "WAITING_INFO" && <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">Không thể chấm điểm khi hồ sơ đang chờ bổ sung.</p>}{selected.state === "CANCELLED" && <p className="text-xs font-semibold text-slate-500">Phân công đã hủy; hồ sơ chỉ đọc.</p>}</div></aside>}
          </div>
        </section>
        {selected && <WorkspaceActivityTimeline scope="reviewer" entityCode={selected.code} seed={[{ id: `${selected.code}-seed`, title: "Hồ sơ được phân công", detail: `${selected.code} được Điều phối hợp tác chuyển tới Reviewer.`, createdAt: "2026-08-22T10:20:00+07:00", tone: "purple" }]} />}
      </>}

      {view === "evaluation" && <>
        <WorkspaceViewHeader eyebrow="Phiếu đánh giá" title="Workbench phản biện" tone="purple" description="Không mở thẳng một hồ sơ cố định: chọn hồ sơ đang xử lý ở cột trái, kiểm tra trạng thái rồi mới chấm điểm. Hồ sơ chờ bổ sung, xung đột, đã hủy hoặc đã nộp được khóa đúng ngữ cảnh." action={selected && <WorkspaceStatus tone={selectedState.tone}>{selectedState.label}</WorkspaceStatus>} />
        <section className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-card-border bg-card-surface-area p-4"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Chọn hồ sơ để đánh giá</h2><div className="mt-3 space-y-2">{assignments.filter((item) => ["IN_REVIEW", "DRAFT", "OVERDUE", "SUBMITTED"].includes(item.state)).map((item) => <button key={item.id} type="button" onClick={() => setSelectedCode(item.code)} aria-pressed={selected?.code === item.code} className={`w-full rounded-xl border p-3 text-left ${selected?.code === item.code ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" : "border-card-border"}`}><span className="font-mono text-xs text-slate-500">{item.code}</span><strong className="mt-1 block text-sm leading-5 text-slate-900 dark:text-white">{item.title}</strong><span className="mt-2 block"><WorkspaceStatus tone={stateMeta(item.state).tone}>{stateMeta(item.state).label}</WorkspaceStatus></span></button>)}</div></aside>
          {selected ? <div className="space-y-5"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex flex-col gap-3 border-b border-card-border pb-4 sm:flex-row sm:items-start sm:justify-between"><div><span className="font-mono text-xs text-slate-500">{selected.code}</span><h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{selected.title}</h2></div><WorkspaceStatus tone={selectedState.tone}>{selectedState.label}</WorkspaceStatus></div>{canEvaluate || selected.state === "SUBMITTED" ? <><div className="mt-5 space-y-4"><ScoreField label="Tính mới & giá trị khoa học" weight="30%" value={novelty} onChange={setNovelty} disabled={!canEvaluate || busy} /><ScoreField label="Phương pháp nghiên cứu" weight="25%" value={methodology} onChange={setMethodology} disabled={!canEvaluate || busy} /><ScoreField label="Tính khả thi & bổ trợ song phương" weight="30%" value={feasibility} onChange={setFeasibility} disabled={!canEvaluate || busy} /><ScoreField label="Tiềm năng công bố & đào tạo" weight="15%" value={impact} onChange={setImpact} disabled={!canEvaluate || busy} /><div><label htmlFor="review-comment-v2" className="text-sm font-bold text-slate-900 dark:text-white">Nhận xét chuyên môn</label><textarea id="review-comment-v2" rows={6} disabled={!canEvaluate || busy} value={comment} onChange={(event) => { setComment(event.target.value); setValidation(null); }} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm leading-6 text-slate-900 outline-none focus:border-purple-500 disabled:opacity-60 dark:bg-slate-950 dark:text-white" />{validation && <p role="alert" className="mt-2 text-sm font-semibold text-rose-700 dark:text-rose-300">{validation}</p>}</div></div><div className="mt-5 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"><div><span className="text-xs font-bold text-slate-500">Tổng điểm quy đổi</span><strong className="mt-1 block font-mono text-3xl text-purple-700 dark:text-purple-300">{totalScore.toFixed(2)}/10</strong></div>{canEvaluate ? <div className="flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={saveDraft} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Lưu bản nháp</button><button type="button" disabled={busy} onClick={requestSubmit} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white disabled:opacity-60">Xem trước & nộp</button></div> : <WorkspaceStatus tone="green">Phiếu chỉ đọc sau khi nộp</WorkspaceStatus>}</div></> : <WorkspaceEmptyState title="Hồ sơ chưa thể đánh giá" detail="Quay lại hàng đợi để xử lý xung đột, chờ bổ sung hoặc chọn hồ sơ khác." />}</div><WorkspaceActivityTimeline scope="reviewer" entityCode={selected.code} /></div> : null}
        </section>
      </>}

      {view === "history" && <>
        <WorkspaceViewHeader eyebrow="Lịch sử phản biện" title="Phiếu đã hoàn tất" tone="purple" description="Danh sách read-only để tra lại hồ sơ đã nộp thay vì hiển thị một đoạn text tĩnh. Có thể chọn từng phiếu để xem trạng thái và diễn biến xử lý." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="divide-y divide-card-border">{assignments.filter((item) => item.state === "SUBMITTED").map((item) => <button key={item.id} type="button" onClick={() => setSelectedCode(item.code)} className="grid w-full gap-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex gap-2"><WorkspaceStatus tone="green">Đã nộp</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><strong className="mt-2 block text-sm text-slate-900 dark:text-white">{item.title}</strong></div><Link href={`/workspace/reviewer?view=evaluation&id=${item.code}`} onClick={(event) => event.stopPropagation()} className="text-sm font-bold text-purple-700 dark:text-purple-300">Xem phiếu →</Link></button>)}</div></section>
      </>}

      {submitConfirm && selected && <WorkspaceTaskDialog title="Xác nhận nộp phiếu phản biện" eyebrow={selected.code} tone="purple" onClose={() => setSubmitConfirm(false)} footer={<><button type="button" onClick={() => setSubmitConfirm(false)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Quay lại chỉnh</button><button type="button" disabled={busy} onClick={confirmSubmit} className="min-h-10 rounded-lg bg-purple-700 px-4 text-sm font-bold text-white disabled:opacity-60">Xác nhận nộp</button></>}><div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Tổng điểm</span><strong className="mt-1 block font-mono text-2xl text-purple-700 dark:text-purple-300">{totalScore.toFixed(2)}/10</strong></div><div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Sau khi nộp</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">Phiếu chuyển sang chỉ đọc</strong></div></div><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">Kết quả preview sẽ tạo thông báo cho Điều phối hợp tác và chuyển hồ sơ sang hàng đợi của Cơ quan quyết định.</p></div></WorkspaceTaskDialog>}
    </main>
  );
}
