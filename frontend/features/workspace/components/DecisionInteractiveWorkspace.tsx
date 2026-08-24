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

type DecisionView = "overview" | "queue" | "history" | "projects";
type DecisionState = "PENDING" | "APPROVED" | "REVISION" | "REJECTED" | "DEFERRED";

type DecisionItem = { id: string; code: string; title: string; organizations: string; screening: string; reviewSummary: string; score: string; state: DecisionState; rationale?: string; reviewedAt?: string };
type DecisionProject = { id: string; code: string; title: string; progress: number; state: "PLANNED" | "ACTIVE" | "AT_RISK" | "COMPLETED"; next: string; organizations: string };

const views = new Set<DecisionView>(["overview", "queue", "history", "projects"]);

const initialItems: DecisionItem[] = [
  { id: "d1", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", organizations: "IMER ↔ POI RAS", screening: "Đủ điều kiện", reviewSummary: "Hai phản biện đã hoàn tất; khuyến nghị chấp thuận với chỉnh sửa nhỏ.", score: "8.6/10", state: "PENDING" },
  { id: "d2", code: "RU-VN-2026-AI-04", title: "Mô hình AI dự báo sớm tai biến địa chất ven biển", organizations: "VAST ↔ MISIS", screening: "Đủ điều kiện sau bổ sung", reviewSummary: "Phản biện ghi nhận phương pháp tốt nhưng cần làm rõ kế hoạch kiểm chứng.", score: "7.9/10", state: "PENDING" },
  { id: "d3", code: "RU-VN-2026-DATA-05", title: "Chuẩn hóa dữ liệu quan trắc ven bờ Việt Nam – Liên bang Nga", organizations: "VAST ↔ FEB RAS", screening: "Đủ điều kiện", reviewSummary: "Một ý kiến chuyên môn cần được tổng hợp thêm trước quyết định cuối.", score: "8.1/10", state: "DEFERRED", rationale: "Tạm hoãn để bổ sung tổng hợp ý kiến phản biện." },
  { id: "d4", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", organizations: "VAST ↔ POI RAS", screening: "Đủ điều kiện", reviewSummary: "Phản biện hoàn tất, không còn ý kiến tồn đọng.", score: "8.9/10", state: "APPROVED", rationale: "Hồ sơ đáp ứng yêu cầu khoa học và hợp tác song phương.", reviewedAt: "10/07/2026" },
  { id: "d5", code: "RU-VN-2026-GEO-09", title: "Đối chiếu trầm tích vùng cửa sông nhiệt đới", organizations: "IMER ↔ POI RAS", screening: "Đủ điều kiện", reviewSummary: "Cần điều chỉnh phạm vi lấy mẫu trước khi có thể xem xét lại.", score: "6.8/10", state: "REVISION", rationale: "Yêu cầu hoàn thiện phạm vi nghiên cứu và kế hoạch lấy mẫu.", reviewedAt: "19/08/2026" },
  { id: "d6", code: "RU-VN-2025-SEA-11", title: "Phân tích ảnh vệ tinh vùng nước ven bờ", organizations: "VAST ↔ IKI RAS", screening: "Đủ điều kiện", reviewSummary: "Bằng chứng phương pháp chưa đủ thuyết phục ở vòng hiện tại.", score: "5.9/10", state: "REJECTED", rationale: "Chưa đáp ứng yêu cầu về phương pháp và khả năng kiểm chứng.", reviewedAt: "12/08/2026" },
  { id: "d7", code: "RU-VN-2026-BIO-08", title: "Khảo sát đa dạng sinh học vùng biển chuyển tiếp Việt – Nga", organizations: "VAST ↔ FEB RAS", screening: "Đủ điều kiện", reviewSummary: "Phản biện thống nhất mức phù hợp cao và khuyến nghị triển khai.", score: "9.1/10", state: "APPROVED", rationale: "Giá trị khoa học rõ, bổ trợ hai phía tốt và kế hoạch triển khai phù hợp.", reviewedAt: "15/08/2026" },
];

const projects: DecisionProject[] = [
  { id: "dp1", code: "RU-VN-2026-BIO-08", title: "Khảo sát đa dạng sinh học vùng biển chuyển tiếp Việt – Nga", progress: 75, state: "ACTIVE", next: "Báo cáo Q2 đang được Điều phối theo dõi", organizations: "VAST ↔ FEB RAS" },
  { id: "dp2", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", progress: 48, state: "AT_RISK", next: "Chậm bổ sung dữ liệu tháng 8", organizations: "VAST ↔ POI RAS" },
  { id: "dp3", code: "RU-VN-2026-SENSOR-02", title: "Mạng cảm biến độ mặn phục vụ quan trắc ven bờ", progress: 20, state: "ACTIVE", next: "Hiệu chỉnh cảm biến đợt 1", organizations: "VAST ↔ FESTU" },
  { id: "dp4", code: "RU-VN-2026-ALG-01", title: "Đối chiếu mẫu tảo biển nhiệt đới", progress: 0, state: "PLANNED", next: "Chuẩn bị khởi động dự án", organizations: "IMER ↔ FEB RAS" },
  { id: "dp5", code: "RU-VN-2024-DATA-07", title: "Chuẩn hóa metadata dữ liệu hải dương học", progress: 100, state: "COMPLETED", next: "Đã hoàn tất", organizations: "VAST ↔ FEB RAS" },
];

function decisionMeta(state: DecisionState): { label: string; tone: WorkspaceTone } {
  if (state === "PENDING") return { label: "Chờ quyết định", tone: "blue" };
  if (state === "APPROVED") return { label: "Đã chấp thuận", tone: "green" };
  if (state === "REVISION") return { label: "Yêu cầu hoàn thiện", tone: "amber" };
  if (state === "REJECTED") return { label: "Không chấp thuận", tone: "red" };
  return { label: "Tạm hoãn", tone: "slate" };
}

export function DecisionInteractiveWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian quyết định…</div>}><DecisionWorkspaceContent /></React.Suspense>;
}

function DecisionWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as DecisionView | null;
  const view: DecisionView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const handoffs = useDemoHandoffs("decision");
  const [overrides, setOverrides] = React.useState<Record<string, DecisionState>>({});
  const [rationales, setRationales] = React.useState<Record<string, string>>({});
  const [selectedCode, setSelectedCode] = React.useState("RU-VN-2026-MAR-02");
  const [selectedProjectCode, setSelectedProjectCode] = React.useState("RU-VN-2026-BIO-08");
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("OPEN");
  const [ackEvidence, setAckEvidence] = React.useState(false);
  const [rationale, setRationale] = React.useState("Hồ sơ đáp ứng yêu cầu khoa học, có tính bổ trợ song phương và đủ căn cứ để đưa ra quyết định trong kịch bản preview.");
  const [confirmState, setConfirmState] = React.useState<DecisionState | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  const dynamicItems: DecisionItem[] = handoffs.filter((item) => item.stage === "REVIEW_SUBMITTED" && !initialItems.some((record) => record.code === item.entityCode)).map((item) => ({ id: item.id, code: item.entityCode, title: item.title, organizations: "Đã hoàn tất xác nhận và sàng lọc", screening: "Đủ điều kiện", reviewSummary: "Phiếu phản biện vừa được chuyển từ Reviewer trong phiên preview.", score: "8.4/10", state: "PENDING" }));
  const items = [...dynamicItems, ...initialItems].map((item) => ({ ...item, state: overrides[item.code] ?? item.state, rationale: rationales[item.code] ?? item.rationale }));
  const selected = items.find((item) => item.code === selectedCode) ?? items[0];
  const selectedProject = projects.find((item) => item.code === selectedProjectCode) ?? projects[0];
  const queueStates: DecisionState[] = ["PENDING", "DEFERRED"];
  const q = query.trim().toLocaleLowerCase("vi");
  const filtered = items.filter((item) => (!q || `${item.code} ${item.title} ${item.organizations}`.toLocaleLowerCase("vi").includes(q)) && (filter === "ALL" || filter === "OPEN" ? (filter === "ALL" || queueStates.includes(item.state)) : item.state === filter));
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2800); };

  const issueDecision = async (state: DecisionState) => {
    if (!selected || rationale.trim().length < 25 || !ackEvidence) return;
    setBusy(true);
    await commitDemoMutation("decision", `Đã ban hành: ${decisionMeta(state).label}`, `${selected.code} · ${rationale.trim()}`, state === "APPROVED" ? {
      notifications: [
        { scope: "researcher", title: "Đề xuất đã được chấp thuận", detail: `${selected.code} chuyển sang bước hình thành dự án.`, href: "/workspace/researcher?view=projects" },
        { scope: "organization", title: "Đề xuất đã được chấp thuận", detail: `${selected.code} xuất hiện trong danh sách dự án liên quan.`, href: "/workspace/organization?view=projects" },
        { scope: "manager", title: "Quyết định đã ban hành", detail: `${selected.code} được chấp thuận và chuyển sang theo dõi dự án.`, href: "/workspace/collaboration?view=projects" },
      ],
      handoffs: [
        { to: "researcher", entityCode: selected.code, title: selected.title, stage: "PROJECT_APPROVED" },
        { to: "organization", entityCode: selected.code, title: selected.title, stage: "PROJECT_APPROVED" },
        { to: "manager", entityCode: selected.code, title: selected.title, stage: "PROJECT_APPROVED" },
      ],
    } : {
      notifications: [
        { scope: "researcher", title: state === "REVISION" ? "Hồ sơ cần hoàn thiện" : state === "REJECTED" ? "Hồ sơ không được chấp thuận" : "Quyết định tạm hoãn", detail: `${selected.code}: ${rationale.trim()}`, href: "/workspace/researcher?view=collaboration" },
        { scope: "manager", title: "Trạng thái quyết định đã cập nhật", detail: `${selected.code} · ${decisionMeta(state).label}.`, href: "/workspace/collaboration?view=screening" },
      ],
    });
    setOverrides((current) => ({ ...current, [selected.code]: state }));
    setRationales((current) => ({ ...current, [selected.code]: rationale.trim() }));
    setBusy(false);
    setConfirmState(null);
    setAckEvidence(false);
    showToast(`${decisionMeta(state).label} · hồ sơ đã chuyển trạng thái trong preview.`);
  };

  const requestDecision = (state: DecisionState) => {
    if (rationale.trim().length < 25 || !ackEvidence) return;
    setConfirmState(state);
  };

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Quyết định" />
      <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><strong>Ranh giới vai trò:</strong> chỉ xem xét hồ sơ đã qua xác nhận, sàng lọc và phản biện. Vai trò này không sửa đề xuất, không phân Reviewer và không cập nhật milestone nghiên cứu.</div>
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-blue-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md">{toast}</div>}

      {view === "overview" && <>
        <WorkspaceViewHeader eyebrow="Cơ quan quyết định" title="Bàn quyết định nghiệp vụ" description="Dashboard tập trung hồ sơ đã đủ căn cứ để quyết định, hồ sơ tạm hoãn và dấu vết quyết định đã ban hành. Action quyết định chỉ xuất hiện sau khi kiểm tra đủ bằng chứng đầu vào." action={<Link href="/workspace/decisions?view=queue" className="inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 text-sm font-bold text-white">Mở hàng đợi quyết định →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><WorkspaceMetric value={String(items.filter((item) => item.state === "PENDING").length).padStart(2, "0")} label="Chờ quyết định" detail="Đã qua phản biện" href="/workspace/decisions?view=queue" /><WorkspaceMetric value={String(items.filter((item) => item.state === "DEFERRED").length).padStart(2, "0")} label="Tạm hoãn" detail="Cần thêm căn cứ trước quyết định" href="/workspace/decisions?view=queue&status=DEFERRED" tone="slate" /><WorkspaceMetric value={String(items.filter((item) => item.state === "REVISION").length).padStart(2, "0")} label="Cần hoàn thiện" detail="Đã ban hành yêu cầu chỉnh sửa" href="/workspace/decisions?view=history&status=REVISION" tone="amber" /><WorkspaceMetric value={String(items.filter((item) => item.state === "APPROVED").length).padStart(2, "0")} label="Đã chấp thuận" detail="Có thể theo dõi dự án liên quan" href="/workspace/decisions?view=projects" tone="green" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-end justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Hồ sơ cần quyết định</h2><p className="mt-1 text-sm text-slate-500">Chỉ hiển thị hồ sơ đã hoàn tất các bước trước.</p></div><WorkspaceStatus tone="blue">{items.filter((item) => queueStates.includes(item.state)).length} hồ sơ</WorkspaceStatus></div><div className="divide-y divide-card-border">{items.filter((item) => queueStates.includes(item.state)).map((item) => <Link key={item.id} href="/workspace/decisions?view=queue" onClick={() => setSelectedCode(item.code)} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code} · tổng hợp {item.score}</span></div><WorkspaceStatus tone={decisionMeta(item.state).tone}>{decisionMeta(item.state).label}</WorkspaceStatus></Link>)}</div></div><WorkspaceNotificationPanel scope="decision" seed={[{ id: "d-n1", title: "MAR-02 đã hoàn tất phản biện", detail: "Hồ sơ sẵn sàng để xem xét quyết định.", href: "/workspace/decisions?view=queue", createdAt: "2026-08-24T10:50:00+07:00" }, { id: "d-n2", title: "DATA-05 đang tạm hoãn", detail: "Cần kiểm tra tổng hợp ý kiến trước khi mở lại quyết định.", href: "/workspace/decisions?view=queue&status=DEFERRED", createdAt: "2026-08-24T08:15:00+07:00" }]} /></section>
      </>}

      {view === "queue" && <>
        <WorkspaceViewHeader eyebrow="Hồ sơ chờ quyết định" title="Hàng đợi quyết định" description="Collection → dossier detail → xác nhận bằng chứng → quyết định. Không vào thẳng một modal chung cho mọi hồ sơ." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><WorkspaceCollectionToolbar query={query} onQueryChange={setQuery} placeholder="Tìm mã hồ sơ, tên hoặc tổ chức…" activeFilter={filter} onFilterChange={setFilter} filters={[{ value: "OPEN", label: "Cần quyết định", count: items.filter((item) => queueStates.includes(item.state)).length }, { value: "PENDING", label: "Sẵn sàng", count: items.filter((item) => item.state === "PENDING").length }, { value: "DEFERRED", label: "Tạm hoãn", count: items.filter((item) => item.state === "DEFERRED").length }, { value: "ALL", label: "Tất cả", count: items.length }]} /><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_470px]"><div className="divide-y divide-card-border">{filtered.length ? filtered.map((item) => <button key={item.id} type="button" onClick={() => { setSelectedCode(item.code); setRationale(item.rationale || "Hồ sơ đáp ứng yêu cầu khoa học, có tính bổ trợ song phương và đủ căn cứ để đưa ra quyết định trong kịch bản preview."); setAckEvidence(false); }} className={`grid w-full gap-3 px-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center ${selected.code === item.code ? "rounded-xl bg-blue-50 dark:bg-blue-950/20" : ""}`}><div><div className="flex gap-2"><WorkspaceStatus tone={decisionMeta(item.state).tone}>{decisionMeta(item.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><strong className="mt-2 block text-sm leading-6 text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.organizations} · điểm tổng hợp {item.score}</span></div><span className="text-sm font-bold text-blue-700">Mở dossier →</span></button>) : <WorkspaceEmptyState title="Không có hồ sơ phù hợp" detail="Thử đổi bộ lọc hoặc từ khóa." />}</div><aside className="h-fit rounded-2xl border border-card-border bg-slate-50 p-5 dark:bg-slate-950/50"><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={decisionMeta(selected.state).tone}>{decisionMeta(selected.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selected.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{selected.title}</h2><div className="mt-4"><WorkspaceWorkflowStepper steps={[{ label: "Tổ chức xác nhận", state: "done" }, { label: "Sàng lọc", state: "done" }, { label: "Phản biện", state: "done" }, { label: "Quyết định", state: queueStates.includes(selected.state) ? "current" : "done" }, { label: "Dự án", state: selected.state === "APPROVED" ? "current" : "waiting" }]} /></div><div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1"><div className="rounded-xl border border-card-border bg-white p-3 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Sàng lọc</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{selected.screening}</strong></div><div className="rounded-xl border border-card-border bg-white p-3 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Điểm phản biện</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{selected.score}</strong></div><div className="rounded-xl border border-card-border bg-white p-3 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Tổ chức</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">Đã xác nhận hai phía</strong></div></div><div className="mt-4 rounded-xl border border-card-border bg-white p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Tổng hợp phản biện</span><p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{selected.reviewSummary}</p></div>{queueStates.includes(selected.state) && <><label className="mt-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30"><input type="checkbox" checked={ackEvidence} onChange={(event) => setAckEvidence(event.target.checked)} className="mt-1 size-4" /><span className="text-sm font-semibold text-blue-950 dark:text-blue-100">Tôi đã xem trạng thái tổ chức, kết quả sàng lọc và tổng hợp phản biện trước khi quyết định.</span></label><label htmlFor="decision-rationale-v2" className="mt-4 block text-xs font-bold text-slate-500">Lý do / ghi chú quyết định</label><textarea id="decision-rationale-v2" rows={5} value={rationale} onChange={(event) => setRationale(event.target.value)} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm leading-6 dark:bg-slate-900" /><div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={!ackEvidence || rationale.trim().length < 25} onClick={() => requestDecision("APPROVED")} className="min-h-10 rounded-lg bg-emerald-700 px-4 text-sm font-bold text-white disabled:opacity-50">Chấp thuận</button><button type="button" disabled={!ackEvidence || rationale.trim().length < 25} onClick={() => requestDecision("REVISION")} className="min-h-10 rounded-lg border border-amber-300 px-4 text-sm font-bold text-amber-800 disabled:opacity-50 dark:border-amber-800 dark:text-amber-200">Yêu cầu hoàn thiện</button><button type="button" disabled={!ackEvidence || rationale.trim().length < 25} onClick={() => requestDecision("DEFERRED")} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 disabled:opacity-50 dark:text-slate-200">Tạm hoãn</button><button type="button" disabled={!ackEvidence || rationale.trim().length < 25} onClick={() => requestDecision("REJECTED")} className="min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-bold text-rose-700 disabled:opacity-50">Không chấp thuận</button></div></>}</aside></div></section><WorkspaceActivityTimeline scope="decision" entityCode={selected.code} seed={[{ id: `${selected.code}-ready`, title: "Hồ sơ đủ căn cứ quyết định", detail: `${selected.code} đã hoàn tất sàng lọc và phản biện.`, createdAt: "2026-08-24T09:20:00+07:00", tone: "blue" }]} />
      </>}

      {view === "history" && <>
        <WorkspaceViewHeader eyebrow="Đã quyết định" title="Lịch sử quyết định" description="Collection read-only có trạng thái, lý do và khả năng chọn từng dossier để tra lại; không chỉ hiển thị một đoạn rationale tĩnh." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="divide-y divide-card-border">{items.filter((item) => !queueStates.includes(item.state)).map((item) => <button key={item.id} type="button" onClick={() => setSelectedCode(item.code)} className="grid w-full gap-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex gap-2"><WorkspaceStatus tone={decisionMeta(item.state).tone}>{decisionMeta(item.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><strong className="mt-2 block text-sm text-slate-900 dark:text-white">{item.title}</strong><p className="mt-1 text-xs leading-5 text-slate-500">{item.rationale}</p></div><span className="text-xs font-bold text-slate-500">{item.reviewedAt || "Vừa cập nhật"}</span></button>)}</div></section>{selected && !queueStates.includes(selected.state) && <WorkspaceActivityTimeline scope="decision" entityCode={selected.code} seed={[{ id: `${selected.code}-decision`, title: decisionMeta(selected.state).label, detail: `${selected.code} · ${selected.rationale || "Đã ban hành quyết định."}`, createdAt: "2026-08-20T13:00:00+07:00", tone: decisionMeta(selected.state).tone }]} />}
      </>}

      {view === "projects" && <>
        <WorkspaceViewHeader eyebrow="Dự án sau quyết định" title="Theo dõi kết quả triển khai" description="Cơ quan quyết định chỉ đọc trạng thái dự án hình thành từ hồ sơ đã chấp thuận; không cập nhật milestone hay xử lý báo cáo thay các role vận hành." />
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]"><div className="grid gap-4 lg:grid-cols-2">{projects.map((project) => <button key={project.id} type="button" onClick={() => setSelectedProjectCode(project.code)} className={`rounded-2xl border bg-card-surface-area p-5 text-left ${selectedProject.code === project.code ? "border-blue-500" : "border-card-border"}`}><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={project.state === "AT_RISK" ? "red" : project.state === "COMPLETED" ? "green" : project.state === "PLANNED" ? "slate" : "blue"}>{project.state === "AT_RISK" ? "Cần chú ý" : project.state === "COMPLETED" ? "Hoàn tất" : project.state === "PLANNED" ? "Dự kiến" : "Đang triển khai"}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{project.code}</span></div><h2 className="mt-3 text-base font-bold leading-6 text-slate-950 dark:text-white">{project.title}</h2><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-blue-700" style={{ width: `${project.progress}%` }} /></div><span className="mt-2 block text-xs font-bold text-slate-500">{project.progress}%</span></button>)}</div><aside className="h-fit rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={selectedProject.state === "AT_RISK" ? "red" : selectedProject.state === "COMPLETED" ? "green" : selectedProject.state === "PLANNED" ? "slate" : "blue"}>{selectedProject.state === "AT_RISK" ? "Cần chú ý" : selectedProject.state === "COMPLETED" ? "Hoàn tất" : selectedProject.state === "PLANNED" ? "Dự kiến" : "Đang triển khai"}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selectedProject.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{selectedProject.title}</h2><p className="mt-2 text-sm text-slate-500">{selectedProject.organizations}</p><div className="mt-4 rounded-xl border border-card-border p-4"><span className="text-xs font-bold text-slate-500">Diễn biến tiếp theo</span><strong className="mt-1 block text-sm leading-6 text-slate-900 dark:text-white">{selectedProject.next}</strong></div><p className="mt-4 text-xs font-semibold text-slate-500">Chế độ chỉ đọc theo đúng ranh giới vai trò.</p></aside></section>
      </>}

      {confirmState && selected && <WorkspaceTaskDialog title="Xác nhận quyết định" eyebrow={selected.code} tone="blue" onClose={() => setConfirmState(null)} footer={<><button type="button" onClick={() => setConfirmState(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Quay lại</button><button type="button" disabled={busy} onClick={() => void issueDecision(confirmState)} className={`min-h-10 rounded-lg px-4 text-sm font-bold text-white disabled:opacity-60 ${confirmState === "APPROVED" ? "bg-emerald-700" : confirmState === "REJECTED" ? "bg-rose-700" : confirmState === "REVISION" ? "bg-amber-700" : "bg-slate-700"}`}>Xác nhận {decisionMeta(confirmState).label.toLocaleLowerCase("vi")}</button></>}><div className="space-y-4"><div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-sm font-bold text-slate-900 dark:text-white">Kết quả dự kiến</span><WorkspaceStatus tone={decisionMeta(confirmState).tone}>{decisionMeta(confirmState).label}</WorkspaceStatus></div><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{rationale}</p>{confirmState === "APPROVED" && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">Sau xác nhận, Researcher, Tổ chức và Điều phối sẽ nhận handoff sang bước dự án trong preview.</p>}</div></WorkspaceTaskDialog>}
    </main>
  );
}
