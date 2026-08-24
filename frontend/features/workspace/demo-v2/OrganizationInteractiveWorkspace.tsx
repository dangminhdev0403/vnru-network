"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { WorkspaceTaskDialog } from "@/features/workspace/components/WorkspaceTaskDialog";
import { useDemoWorkflow } from "./DemoWorkflowProvider";
import { ActivityTimeline, CollectionToolbar, EmptyState, FilterChip, InlineNotice, MetricCard, PageHeader, Panel, RoleNotificationCenter, StatusPill, WorkflowStepper } from "./WorkflowUI";
import type { OrganizationEndorsement } from "./types";

type View = "overview" | "endorsements" | "projects" | "activity";
const views = new Set<View>(["overview", "endorsements", "projects", "activity"]);
const label: Record<OrganizationEndorsement["state"], string> = { PENDING: "Chờ xác nhận", NEEDS_INFO: "Cần bổ sung", ENDORSED: "Đã xác nhận", DECLINED: "Không xác nhận" };
const tone = (state: OrganizationEndorsement["state"]): "amber" | "blue" | "green" | "red" => state === "PENDING" ? "amber" : state === "NEEDS_INFO" ? "blue" : state === "ENDORSED" ? "green" : "red";

export function OrganizationInteractiveWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian tổ chức…</div>}><Content /></React.Suspense>;
}

function Content() {
  const params = useSearchParams();
  const requested = params.get("view") as View | null;
  const view = requested && views.has(requested) ? requested : "overview";
  const { endorsements, projects, activities, updateEndorsement } = useDemoWorkflow();
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"ALL" | OrganizationEndorsement["state"]>("ALL");
  const [selectedId, setSelectedId] = React.useState<string | null>(params.get("id"));
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(params.get("id"));
  const [action, setAction] = React.useState<"ENDORSE" | "NEEDS_INFO" | "DECLINE" | null>(null);
  const [note, setNote] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    const id = params.get("id");
    if (view === "endorsements" && id) setSelectedId(id);
    if (view === "projects" && id) setSelectedProjectId(id);
  }, [params, view]);

  const selected = endorsements.find((item) => item.id === selectedId) ?? null;
  const selectedProject = projects.find((item) => item.id === selectedProjectId) ?? null;
  const pending = endorsements.filter((item) => ["PENDING", "NEEDS_INFO"].includes(item.state));
  const filtered = endorsements.filter((item) => {
    const hit = `${item.code} ${item.title} ${item.lead} ${item.partnerOrg}`.toLowerCase().includes(query.trim().toLowerCase());
    return hit && (filter === "ALL" || item.state === filter);
  });

  const confirmAction = () => {
    if (!selected || !action) return;
    const next = action === "ENDORSE" ? "ENDORSED" : action === "NEEDS_INFO" ? "NEEDS_INFO" : "DECLINED";
    if (next !== "ENDORSED" && note.trim().length < 10) return;
    updateEndorsement(selected.id, next, note);
    setAction(null);
    setNote("");
    setToast(next === "ENDORSED" ? "Đã xác nhận hồ sơ; Điều phối hợp tác vừa nhận handoff." : next === "NEEDS_INFO" ? "Đã gửi yêu cầu bổ sung cho Nhà nghiên cứu." : "Đã ghi nhận không xác nhận hồ sơ.");
    window.setTimeout(() => setToast(null), 3000);
  };

  return <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
    <RoleNotificationCenter role="ORGANIZATION_REPRESENTATIVE" />
    {toast && <div role="status" className="fixed bottom-5 right-5 z-50 max-w-md rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-2xl">{toast}</div>}

    {view === "overview" && <>
      <PageHeader eyebrow="Đại diện tổ chức" title="Bàn xác nhận & theo dõi tổ chức" description="Vai trò này không xử lý phản biện hay quyết định. Trọng tâm là xác nhận nguồn lực/phạm vi tổ chức và theo dõi dự án thuộc đơn vị." action={<Link href="/workspace/organization?view=endorsements" className="inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-4 text-sm font-bold text-white">Mở hồ sơ cần xác nhận →</Link>} />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard value={pending.length} label="Cần xác nhận" detail="Hồ sơ đang chờ tổ chức" href="/workspace/organization?view=endorsements" urgent={pending.some((item) => item.state === "PENDING")} /><MetricCard value={endorsements.filter((item) => item.state === "NEEDS_INFO").length} label="Đang chờ bổ sung" detail="Nhà nghiên cứu cần phản hồi" href="/workspace/organization?view=endorsements&status=NEEDS_INFO" /><MetricCard value={projects.filter((item) => ["ACTIVE", "BLOCKED"].includes(item.state)).length} label="Dự án đang theo dõi" detail="Chỉ xem phạm vi tổ chức" href="/workspace/organization?view=projects" /><MetricCard value={activities.filter((item) => item.entityType === "organization").length} label="Hoạt động tổ chức" detail="Dấu vết xác nhận và handoff" href="/workspace/organization?view=activity" /></section>
      <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><Panel><div className="flex items-center justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Hồ sơ cần xử lý</h2><p className="text-sm text-slate-500">Ưu tiên theo deadline xác nhận.</p></div><StatusPill tone="amber">{pending.length} hồ sơ</StatusPill></div><div className="divide-y divide-card-border">{pending.map((item) => <Link key={item.id} href={`/workspace/organization?view=endorsements&id=${item.id}`} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center"><span><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code} · hạn {item.deadline}</span></span><StatusPill tone={tone(item.state)}>{label[item.state]}</StatusPill></Link>)}</div></Panel><Panel><h2 className="text-lg font-bold text-slate-950 dark:text-white">Vai trò tổ chức xác nhận gì?</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><li>• Nhân sự thuộc đơn vị và tư cách tham gia.</li><li>• Hạ tầng / nguồn lực phi tài chính đã kê khai.</li><li>• Phạm vi phối hợp của tổ chức.</li><li>• Không phê duyệt khoa học, không chấm điểm, không xử lý ngân sách.</li></ul></Panel></section>
    </>}

    {view === "endorsements" && <>
      <PageHeader eyebrow="Xác nhận tổ chức" title="Hàng đợi hồ sơ tổ chức" description="List → detail → xác nhận / yêu cầu bổ sung / từ chối. Mỗi action có lý do và tạo handoff sang đúng vai trò tiếp theo." />
      <CollectionToolbar query={query} onQueryChange={setQuery}><div className="flex flex-wrap gap-2"><FilterChip active={filter === "ALL"} onClick={() => setFilter("ALL")}>Tất cả {endorsements.length}</FilterChip><FilterChip active={filter === "PENDING"} onClick={() => setFilter("PENDING")}>Chờ xác nhận</FilterChip><FilterChip active={filter === "NEEDS_INFO"} onClick={() => setFilter("NEEDS_INFO")}>Cần bổ sung</FilterChip><FilterChip active={filter === "ENDORSED"} onClick={() => setFilter("ENDORSED")}>Đã xác nhận</FilterChip></div></CollectionToolbar>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(400px,.95fr)]"><Panel>{filtered.length ? <div className="divide-y divide-card-border">{filtered.map((item) => <article key={item.id} className={`py-5 ${selectedId === item.id ? "rounded-xl bg-teal-50 px-3 dark:bg-teal-950/20" : ""}`}><div className="flex flex-wrap items-center gap-2"><StatusPill tone={tone(item.state)}>{label[item.state]}</StatusPill><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">Chủ nhiệm: {item.lead} · Đối tác: {item.partnerOrg}</p><p className="mt-1 text-xs text-slate-500">Hạn xử lý {item.deadline}</p><button type="button" onClick={() => setSelectedId(item.id)} className="mt-4 min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Xem hồ sơ</button></article>)}</div> : <EmptyState title="Không có hồ sơ" detail="Không có item phù hợp bộ lọc hiện tại." />}</Panel><Panel>{selected ? <div className="space-y-5"><div><div className="flex flex-wrap gap-2"><StatusPill tone={tone(selected.state)}>{label[selected.state]}</StatusPill><span className="font-mono text-xs text-slate-500">{selected.code}</span></div><h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">{selected.title}</h2></div><WorkflowStepper current="organization" /><dl className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Chủ nhiệm</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selected.lead}</dd></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Đối tác</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selected.partnerOrg}</dd></div></dl><div className="rounded-xl border border-card-border p-4"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Hạ tầng / nguồn lực kê khai</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{selected.facilities}</p></div>{selected.state !== "ENDORSED" && selected.state !== "DECLINED" && <div className="flex flex-wrap gap-2 border-t border-card-border pt-5"><button type="button" onClick={() => setAction("NEEDS_INFO")} className="min-h-10 rounded-lg border border-amber-300 px-3 text-sm font-bold text-amber-800 dark:border-amber-800 dark:text-amber-200">Yêu cầu bổ sung</button><button type="button" onClick={() => setAction("DECLINE")} className="min-h-10 rounded-lg border border-rose-300 px-3 text-sm font-bold text-rose-700 dark:border-rose-900 dark:text-rose-300">Không xác nhận</button><button type="button" onClick={() => setAction("ENDORSE")} className="min-h-10 rounded-lg bg-teal-700 px-3 text-sm font-bold text-white">Xác nhận tổ chức</button></div>}<div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Hoạt động</h3><div className="mt-3"><ActivityTimeline items={activities.filter((item) => item.entityId === selected.id || item.entityId === selected.proposalId)} /></div></div></div> : <EmptyState title="Chọn một hồ sơ" detail="Thông tin tổ chức, workflow và các action hợp lệ sẽ xuất hiện ở đây." />}</Panel></section>
    </>}

    {view === "projects" && <>
      <PageHeader eyebrow="Dự án liên quan" title="Theo dõi dự án trong phạm vi tổ chức" description="Đại diện tổ chức không cập nhật milestone khoa học. UI tập trung vào trạng thái, điểm nghẽn cần phối hợp và hoạt động liên quan đến đơn vị." />
      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]"><Panel><div className="grid gap-4 md:grid-cols-2">{projects.map((project) => <button key={project.id} type="button" onClick={() => setSelectedProjectId(project.id)} className={`rounded-xl border p-4 text-left ${selectedProjectId === project.id ? "border-teal-500 bg-teal-50 dark:bg-teal-950/20" : "border-card-border"}`}><div className="flex items-center justify-between gap-3"><span className="font-mono text-xs text-slate-500">{project.code}</span><StatusPill tone={project.state === "BLOCKED" ? "red" : project.state === "COMPLETED" ? "green" : "blue"}>{project.state}</StatusPill></div><h2 className="mt-3 text-base font-bold text-slate-950 dark:text-white">{project.title}</h2><p className="mt-2 text-sm text-slate-500">Đối tác {project.partner}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-teal-700" style={{ width: `${project.progress}%` }} /></div><p className="mt-3 text-xs text-slate-500">Cần theo dõi: {project.next}</p></button>)}</div></Panel><Panel>{selectedProject ? <div className="space-y-5"><div className="flex items-center justify-between gap-3"><div><span className="font-mono text-xs text-slate-500">{selectedProject.code}</span><h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{selectedProject.title}</h2></div><strong className="text-3xl text-teal-700 dark:text-teal-300">{selectedProject.progress}%</strong></div>{selectedProject.state === "BLOCKED" ? <InlineNotice tone="danger" title="Điểm nghẽn cần phối hợp">{selectedProject.next}</InlineNotice> : <InlineNotice tone="info" title="Việc tổ chức cần theo dõi">{selectedProject.next}</InlineNotice>}<div className="rounded-xl border border-card-border p-4"><h3 className="text-sm font-bold text-slate-900 dark:text-white">Tài liệu theo dõi mẫu</h3><ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300"><li>• Biên bản phối hợp tổ chức VN–RU</li><li>• Tóm tắt mốc tiến độ gần nhất</li><li>• Danh sách nguồn lực cần xác nhận</li></ul></div><ActivityTimeline items={activities.filter((item) => item.entityId === selectedProject.id)} /></div> : <EmptyState title="Chọn dự án" detail="Xem trạng thái và điểm phối hợp thuộc trách nhiệm tổ chức." />}</Panel></section>
    </>}

    {view === "activity" && <><PageHeader eyebrow="Hoạt động tổ chức" title="Dòng sự kiện xác nhận & phối hợp" description="Timeline riêng cho vai trò tổ chức, giúp thấy rõ ai xác nhận gì và handoff đi đâu." /><Panel><ActivityTimeline items={activities.filter((item) => item.entityType === "organization" || item.entityType === "project")} /></Panel></>}

    {action && selected && <WorkspaceTaskDialog title={action === "ENDORSE" ? "Xác nhận hồ sơ tổ chức" : action === "NEEDS_INFO" ? "Yêu cầu bổ sung hồ sơ" : "Không xác nhận hồ sơ"} eyebrow={selected.code} tone="teal" onClose={() => { setAction(null); setNote(""); }} footer={<><button type="button" onClick={() => { setAction(null); setNote(""); }} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Hủy</button><button type="button" disabled={action !== "ENDORSE" && note.trim().length < 10} onClick={confirmAction} className="min-h-10 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white disabled:opacity-50">Xác nhận thao tác</button></>}><div className="space-y-4"><InlineNotice tone={action === "ENDORSE" ? "success" : action === "DECLINE" ? "danger" : "warning"} title="Hậu quả workflow">{action === "ENDORSE" ? "Hồ sơ sẽ được handoff sang Điều phối hợp tác." : action === "NEEDS_INFO" ? "Nhà nghiên cứu sẽ nhận notification cần bổ sung." : "Trạng thái tổ chức chuyển sang Không xác nhận."}</InlineNotice>{action !== "ENDORSE" && <div><label htmlFor="org-note" className="text-sm font-bold text-slate-900 dark:text-white">Lý do / nội dung yêu cầu</label><textarea id="org-note" rows={5} value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm text-slate-900 outline-none focus:border-teal-500 dark:bg-slate-950 dark:text-white" /><p className="mt-1 text-xs text-slate-500">Tối thiểu 10 ký tự để tránh action thiếu ngữ cảnh.</p></div>}</div></WorkspaceTaskDialog>}
  </main>;
}
