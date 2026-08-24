"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { commitDemoMutation, useDemoHandoffs } from "@/features/prototype-v3/demo-backend";
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

type OrganizationView = "overview" | "endorsements" | "projects" | "activity";
type EndorsementState = "PENDING" | "NEEDS_INFO" | "ENDORSED" | "DECLINED" | "WITHDRAWN" | "EXPIRED";
type ProjectOrgState = "OK" | "ACTION_REQUIRED" | "WAITING_PARTNER" | "COMPLETED";

type Endorsement = { id: string; code: string; title: string; lead: string; vnOrg: string; partnerOrg: string; facilities: string; people: string; state: EndorsementState; submittedAt: string };
type OrgProject = { id: string; code: string; title: string; partner: string; progress: number; state: ProjectOrgState; organizationTask: string; due: string };

const views = new Set<OrganizationView>(["overview", "endorsements", "projects", "activity"]);

const initialEndorsements: Endorsement[] = [
  { id: "o1", code: "RU-VN-2026-NANO-01", title: "Độ bền vật liệu Nano-composite trong môi trường biển nhiệt đới", lead: "GS.TS. Trần Đình Nam", vnOrg: "Viện Hải dương học", partnerOrg: "FEB RAS", facilities: "Trạm thử nghiệm biển Hòn Mun; phòng thí nghiệm ăn mòn biển", people: "Nhóm vật liệu biển 6 thành viên", state: "PENDING", submittedAt: "24/08 · 10:20" },
  { id: "o2", code: "RU-VN-2026-AI-04", title: "Mô hình AI dự báo sớm tai biến địa chất ven biển", lead: "PGS.TS. Lê Hoài Thanh", vnOrg: "VAST", partnerOrg: "MISIS", facilities: "Hạ tầng tính toán đã kê khai nhưng thiếu phạm vi dữ liệu", people: "Nhóm AI địa chất 5 thành viên", state: "NEEDS_INFO", submittedAt: "23/08 · 14:10" },
  { id: "o3", code: "RU-VN-2026-MAR-02", title: "Giám sát đa dạng sinh học biển bằng dữ liệu ảnh", lead: "TS. Nguyễn Văn Hùng", vnOrg: "IMER", partnerOrg: "POI RAS", facilities: "Tàu nghiên cứu; trung tâm tích hợp dữ liệu", people: "Nhóm sinh học biển 8 thành viên", state: "ENDORSED", submittedAt: "21/08 · 09:00" },
  { id: "o4", code: "RU-VN-2026-ROBOT-03", title: "Robot tự hành lấy mẫu vùng nước nông", lead: "TS. Phạm Minh Quân", vnOrg: "ĐHQG TP.HCM", partnerOrg: "FESTU", facilities: "Bể thử robot và khu vực thử nghiệm ven bờ", people: "Nhóm robot 7 thành viên", state: "PENDING", submittedAt: "22/08 · 16:30" },
  { id: "o5", code: "RU-VN-2026-GEO-09", title: "Đối chiếu trầm tích vùng cửa sông nhiệt đới", lead: "TS. Bùi Lan Anh", vnOrg: "IMER", partnerOrg: "POI RAS", facilities: "Thiết bị lấy mẫu trầm tích", people: "Nhóm địa chất biển 4 thành viên", state: "DECLINED", submittedAt: "18/08 · 11:20" },
  { id: "o6", code: "RU-VN-2026-SENSOR-06", title: "Cảm biến quang học theo dõi chất lượng nước", lead: "PGS.TS. Nguyễn Hải", vnOrg: "VAST", partnerOrg: "FEB RAS", facilities: "Phòng quang học biển", people: "Nhóm cảm biến 5 thành viên", state: "EXPIRED", submittedAt: "01/08 · 08:00" },
  { id: "o7", code: "RU-VN-2025-CHEM-06", title: "Trao đổi dữ liệu hóa học nước biển", lead: "TS. Lê Minh", vnOrg: "VAST", partnerOrg: "FEB RAS", facilities: "Phòng hóa học biển", people: "Nhóm hóa học 3 thành viên", state: "WITHDRAWN", submittedAt: "15/07 · 13:40" },
];

const projects: OrgProject[] = [
  { id: "op1", code: "RU-VN-2026-BIO-08", title: "Khảo sát đa dạng sinh học vùng biển chuyển tiếp Việt – Nga", partner: "FEB RAS", progress: 75, state: "ACTION_REQUIRED", organizationTask: "Xác nhận lịch sử dụng tàu nghiên cứu cho đợt khảo sát tháng 9", due: "27/08/2026" },
  { id: "op2", code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", partner: "POI RAS", progress: 48, state: "OK", organizationTask: "Theo dõi tiến độ; chưa có việc cần xác nhận", due: "15/09/2026" },
  { id: "op3", code: "RU-VN-2026-SENSOR-02", title: "Mạng cảm biến độ mặn phục vụ quan trắc ven bờ", partner: "FESTU", progress: 20, state: "WAITING_PARTNER", organizationTask: "Chờ đối tác xác nhận lịch chuyển thiết bị thử nghiệm", due: "04/09/2026" },
  { id: "op4", code: "RU-VN-2025-GEO-04", title: "Bản đồ trầm tích cửa sông so sánh", partner: "POI RAS", progress: 62, state: "ACTION_REQUIRED", organizationTask: "Bổ sung xác nhận khả năng sử dụng kho mẫu", due: "29/08/2026" },
  { id: "op5", code: "RU-VN-2024-DATA-07", title: "Chuẩn hóa metadata dữ liệu hải dương học", partner: "FEB RAS", progress: 100, state: "COMPLETED", organizationTask: "Đã hoàn tất nghĩa vụ tổ chức", due: "12/12/2025" },
];

function endorsementMeta(state: EndorsementState): { label: string; tone: WorkspaceTone } {
  const map: Record<EndorsementState, { label: string; tone: WorkspaceTone }> = {
    PENDING: { label: "Chờ xác nhận", tone: "amber" }, NEEDS_INFO: { label: "Cần bổ sung", tone: "red" }, ENDORSED: { label: "Đã xác nhận", tone: "green" }, DECLINED: { label: "Không xác nhận", tone: "red" }, WITHDRAWN: { label: "Đã thu hồi", tone: "slate" }, EXPIRED: { label: "Hết hạn", tone: "slate" },
  };
  return map[state];
}

function projectMeta(state: ProjectOrgState): { label: string; tone: WorkspaceTone } {
  if (state === "ACTION_REQUIRED") return { label: "Tổ chức cần xử lý", tone: "red" };
  if (state === "WAITING_PARTNER") return { label: "Chờ đối tác", tone: "amber" };
  if (state === "COMPLETED") return { label: "Hoàn tất", tone: "green" };
  return { label: "Đang theo dõi", tone: "teal" };
}

export function OrganizationInteractiveWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian tổ chức…</div>}><OrganizationWorkspaceContent /></React.Suspense>;
}

function OrganizationWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as OrganizationView | null;
  const view: OrganizationView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const handoffs = useDemoHandoffs("organization");
  const [overrides, setOverrides] = React.useState<Record<string, EndorsementState>>({});
  const [projectOverrides, setProjectOverrides] = React.useState<Record<string, ProjectOrgState>>({});
  const [selectedCode, setSelectedCode] = React.useState("RU-VN-2026-NANO-01");
  const [selectedProjectCode, setSelectedProjectCode] = React.useState("RU-VN-2026-BIO-08");
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("ACTION");
  const [checkLead, setCheckLead] = React.useState(true);
  const [checkFacilities, setCheckFacilities] = React.useState(false);
  const [checkPeople, setCheckPeople] = React.useState(true);
  const [note, setNote] = React.useState("Vui lòng bổ sung phạm vi sử dụng hạ tầng và đầu mối phụ trách trực tiếp.");
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  const dynamicEndorsements: Endorsement[] = handoffs.filter((item) => item.stage === "ORG_ENDORSEMENT_REQUEST" && !initialEndorsements.some((record) => record.code === item.entityCode)).map((item) => ({ id: item.id, code: item.entityCode, title: item.title, lead: "Nhà nghiên cứu gửi trong phiên preview", vnOrg: "Đơn vị nghiên cứu VN", partnerOrg: "Đối tác Liên bang Nga", facilities: "Chờ tổ chức rà soát hạ tầng kê khai", people: "Chờ tổ chức xác nhận nhóm tham gia", state: "PENDING", submittedAt: "Vừa nhận" }));
  const items = [...dynamicEndorsements, ...initialEndorsements].map((item) => ({ ...item, state: overrides[item.code] ?? item.state }));
  const selected = items.find((item) => item.code === selectedCode) ?? items[0];
  const selectedProject = projects.map((item) => ({ ...item, state: projectOverrides[item.code] ?? item.state })).find((item) => item.code === selectedProjectCode) ?? projects[0];
  const actionStates: EndorsementState[] = ["PENDING", "NEEDS_INFO"];
  const q = query.trim().toLocaleLowerCase("vi");
  const filtered = items.filter((item) => (!q || `${item.code} ${item.title} ${item.lead} ${item.partnerOrg}`.toLocaleLowerCase("vi").includes(q)) && (filter === "ALL" || filter === "ACTION" ? (filter === "ALL" || actionStates.includes(item.state)) : item.state === filter));
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(null), 2800); };

  const mutate = async (action: string, detail: string, after: () => void, options?: Parameters<typeof commitDemoMutation>[3]) => {
    setBusy(true); await commitDemoMutation("organization", action, detail, options); after(); setBusy(false); showToast(`${action} · trạng thái preview đã cập nhật.`);
  };

  const endorse = (item: Endorsement) => {
    if (!checkLead || !checkFacilities || !checkPeople) return;
    void mutate("Đã xác nhận phạm vi tổ chức", `${item.code} · nhân sự, hạ tầng và tư cách chủ trì đã được xác nhận`, () => setOverrides((current) => ({ ...current, [item.code]: "ENDORSED" })), {
      notifications: [
        { scope: "manager", title: "Tổ chức đã xác nhận đề xuất", detail: `${item.code} có thể chuyển sang sàng lọc.`, href: "/workspace/collaboration?view=screening" },
        { scope: "researcher", title: "Tổ chức đã xác nhận hồ sơ", detail: `${item.code} đã hoàn tất bước xác nhận tổ chức.`, href: "/workspace/researcher?view=collaboration" },
      ],
      handoffs: [{ to: "manager", entityCode: item.code, title: item.title, stage: "ORG_ENDORSED" }],
    });
  };

  const requestInfo = (item: Endorsement) => {
    if (note.trim().length < 12) return;
    void mutate("Đã yêu cầu bổ sung thông tin tổ chức", `${item.code} · ${note.trim()}`, () => setOverrides((current) => ({ ...current, [item.code]: "NEEDS_INFO" })), {
      notifications: [{ scope: "researcher", title: "Tổ chức yêu cầu bổ sung", detail: `${item.code}: ${note.trim()}`, href: "/workspace/researcher?view=collaboration" }],
      handoffs: [{ to: "researcher", entityCode: item.code, title: item.title, stage: "ORG_NEEDS_INFO" }],
    });
  };

  const decline = (item: Endorsement) => {
    void mutate("Đã từ chối xác nhận phạm vi tổ chức", `${item.code} · tổ chức không xác nhận khả năng tham gia trong phạm vi hiện tại`, () => setOverrides((current) => ({ ...current, [item.code]: "DECLINED" })), {
      notifications: [{ scope: "researcher", title: "Tổ chức không xác nhận đề xuất", detail: `${item.code} cần điều chỉnh phạm vi hoặc đơn vị tham gia.`, href: "/workspace/researcher?view=collaboration" }],
    });
  };

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Đại diện tổ chức" />
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-teal-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md">{toast}</div>}

      {view === "overview" && <>
        <WorkspaceViewHeader eyebrow="Không gian đại diện tổ chức" title="Bàn xác nhận của tổ chức" tone="teal" description="Vai trò này không chấm điểm khoa học và không điều phối reviewer. Nhiệm vụ chính là xác nhận tư cách đơn vị, nhân sự, hạ tầng và theo dõi nghĩa vụ của tổ chức trong dự án." action={<Link href="/workspace/organization?view=endorsements" className="inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-4 text-sm font-bold text-white">Mở hàng đợi xác nhận →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><WorkspaceMetric value={String(items.filter((item) => item.state === "PENDING").length).padStart(2, "0")} label="Chờ xác nhận" detail="Cần rà soát 3 nhóm thông tin" href="/workspace/organization?view=endorsements&status=PENDING" tone="teal" /><WorkspaceMetric value={String(items.filter((item) => item.state === "NEEDS_INFO").length).padStart(2, "0")} label="Cần bổ sung" detail="Đã gửi yêu cầu cho nhà nghiên cứu" href="/workspace/organization?view=endorsements&status=NEEDS_INFO" tone="red" /><WorkspaceMetric value={String(projects.filter((item) => item.state === "ACTION_REQUIRED").length).padStart(2, "0")} label="Dự án cần tổ chức xử lý" detail="Xác nhận nguồn lực hoặc lịch phối hợp" href="/workspace/organization?view=projects" tone="red" /><WorkspaceMetric value={String(items.filter((item) => item.state === "ENDORSED").length).padStart(2, "0")} label="Đã xác nhận" detail="Có thể xem lại dấu vết xử lý" href="/workspace/organization?view=endorsements&status=ENDORSED" tone="green" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-end justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc tổ chức cần xử lý</h2><p className="mt-1 text-sm text-slate-500">Tách rõ xác nhận proposal và nghĩa vụ dự án.</p></div><WorkspaceStatus tone="amber">{items.filter((item) => actionStates.includes(item.state)).length + projects.filter((item) => item.state === "ACTION_REQUIRED").length} việc</WorkspaceStatus></div><div className="divide-y divide-card-border">{items.filter((item) => actionStates.includes(item.state)).slice(0, 4).map((item) => <Link key={item.id} href="/workspace/organization?view=endorsements" onClick={() => setSelectedCode(item.code)} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code} · {item.partnerOrg}</span></div><WorkspaceStatus tone={endorsementMeta(item.state).tone}>{endorsementMeta(item.state).label}</WorkspaceStatus></Link>)}</div></div><WorkspaceNotificationPanel scope="organization" seed={[{ id: "org-n1", title: "NANO-01 chờ xác nhận", detail: "Rà soát tư cách chủ trì, nhân sự và hạ tầng trước khi xác nhận.", href: "/workspace/organization?view=endorsements", createdAt: "2026-08-24T10:20:00+07:00" }, { id: "org-n2", title: "BIO-08 cần xác nhận lịch tàu", detail: "Mốc phối hợp của tổ chức đến hạn 27/08.", href: "/workspace/organization?view=projects", createdAt: "2026-08-24T08:00:00+07:00" }]} /></section>
      </>}

      {view === "endorsements" && <>
        <WorkspaceViewHeader eyebrow="Đề xuất cần xác nhận" title="Hàng đợi xác nhận tổ chức" tone="teal" description="Danh sách bao phủ chờ xác nhận, cần bổ sung, đã xác nhận, không xác nhận, thu hồi và hết hạn. Chọn hồ sơ để kiểm tra checklist trước khi action." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><WorkspaceCollectionToolbar query={query} onQueryChange={setQuery} placeholder="Tìm mã, tên đề xuất, chủ nhiệm hoặc đối tác…" activeFilter={filter} onFilterChange={setFilter} filters={[{ value: "ACTION", label: "Cần xử lý", count: items.filter((item) => actionStates.includes(item.state)).length }, { value: "PENDING", label: "Chờ xác nhận", count: items.filter((item) => item.state === "PENDING").length }, { value: "NEEDS_INFO", label: "Cần bổ sung", count: items.filter((item) => item.state === "NEEDS_INFO").length }, { value: "ENDORSED", label: "Đã xác nhận", count: items.filter((item) => item.state === "ENDORSED").length }, { value: "ALL", label: "Tất cả", count: items.length }]} /><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]"><div className="divide-y divide-card-border">{filtered.length ? filtered.map((item) => <button key={item.id} type="button" onClick={() => { setSelectedCode(item.code); setCheckLead(true); setCheckFacilities(false); setCheckPeople(true); }} className={`grid w-full gap-3 px-3 py-4 text-left sm:grid-cols-[1fr_auto] sm:items-center ${selected.code === item.code ? "rounded-xl bg-teal-50 dark:bg-teal-950/20" : ""}`}><div><div className="flex flex-wrap gap-2"><WorkspaceStatus tone={endorsementMeta(item.state).tone}>{endorsementMeta(item.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{item.code}</span></div><strong className="mt-2 block text-sm leading-6 text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-500">{item.lead} · {item.partnerOrg} · nhận {item.submittedAt}</span></div><span className="text-sm font-bold text-teal-700 dark:text-teal-300">Rà soát →</span></button>) : <WorkspaceEmptyState title="Không có hồ sơ phù hợp" detail="Thử đổi bộ lọc hoặc từ khóa." />}</div><aside className="h-fit rounded-2xl border border-card-border bg-slate-50 p-5 dark:bg-slate-950/50"><div className="flex flex-wrap items-center justify-between gap-2"><WorkspaceStatus tone={endorsementMeta(selected.state).tone}>{endorsementMeta(selected.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selected.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{selected.title}</h2><p className="mt-2 text-sm text-slate-500">{selected.lead} · {selected.vnOrg} ↔ {selected.partnerOrg}</p><div className="mt-4 space-y-2">{[{ key: "lead", label: "Tư cách chủ trì và đầu mối", checked: checkLead, set: setCheckLead }, { key: "facility", label: "Hạ tầng / nguồn lực kê khai", checked: checkFacilities, set: setCheckFacilities }, { key: "people", label: "Nhân sự tham gia thuộc phạm vi tổ chức", checked: checkPeople, set: setCheckPeople }].map((check) => <label key={check.key} className="flex items-start gap-3 rounded-xl border border-card-border bg-white p-3 dark:bg-slate-900"><input type="checkbox" checked={check.checked} onChange={(event) => check.set(event.target.checked)} disabled={!actionStates.includes(selected.state)} className="mt-1 size-4" /><span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{check.label}</span></label>)}</div><div className="mt-4 rounded-xl border border-card-border bg-white p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Hạ tầng kê khai</span><p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{selected.facilities}</p><span className="mt-3 block text-xs font-bold text-slate-500">Nhân sự</span><p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{selected.people}</p></div>{actionStates.includes(selected.state) && <div className="mt-4"><label htmlFor="org-note-v2" className="text-xs font-bold text-slate-500">Ghi chú khi yêu cầu bổ sung</label><textarea id="org-note-v2" rows={3} value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 w-full rounded-xl border border-card-border bg-white p-3 text-sm dark:bg-slate-900" /></div>}<div className="mt-5 flex flex-wrap gap-2">{actionStates.includes(selected.state) && <><button type="button" disabled={busy || !(checkLead && checkFacilities && checkPeople)} onClick={() => endorse(selected)} className="min-h-10 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Xác nhận tổ chức</button><button type="button" disabled={busy || note.trim().length < 12} onClick={() => requestInfo(selected)} className="min-h-10 rounded-lg border border-amber-300 px-4 text-sm font-bold text-amber-800 disabled:opacity-50 dark:border-amber-800 dark:text-amber-200">Yêu cầu bổ sung</button><button type="button" disabled={busy} onClick={() => decline(selected)} className="min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-bold text-rose-700 dark:border-rose-900 dark:text-rose-300">Không xác nhận</button></>}{!actionStates.includes(selected.state) && <p className="text-xs font-semibold text-slate-500">Hồ sơ ở trạng thái cuối hoặc không còn hiệu lực; chỉ đọc.</p>}</div></aside></div></section><WorkspaceActivityTimeline scope="organization" entityCode={selected.code} seed={[{ id: `${selected.code}-received`, title: "Tổ chức nhận đề xuất", detail: `${selected.code} được chuyển tới để xác nhận phạm vi tham gia.`, createdAt: "2026-08-23T09:10:00+07:00", tone: "teal" }]} />
      </>}

      {view === "projects" && <>
        <WorkspaceViewHeader eyebrow="Dự án liên quan" title="Dự án trong phạm vi tổ chức" tone="teal" description="Vai trò tổ chức theo dõi nghĩa vụ về hạ tầng, lịch phối hợp và đầu mối; không sửa milestone nghiên cứu thay Nhà nghiên cứu." />
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]"><div className="grid gap-4 lg:grid-cols-2">{projects.map((project) => { const state = projectOverrides[project.code] ?? project.state; return <button key={project.id} type="button" onClick={() => setSelectedProjectCode(project.code)} className={`rounded-2xl border bg-card-surface-area p-5 text-left ${selectedProject.code === project.code ? "border-teal-500" : "border-card-border"}`}><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={projectMeta(state).tone}>{projectMeta(state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{project.code}</span></div><strong className="mt-3 block text-base leading-6 text-slate-950 dark:text-white">{project.title}</strong><span className="mt-2 block text-xs text-slate-500">Đối tác {project.partner} · tiến độ {project.progress}%</span><div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">{project.organizationTask}</div></button>; })}</div><aside className="h-fit rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-2"><WorkspaceStatus tone={projectMeta(projectOverrides[selectedProject.code] ?? selectedProject.state).tone}>{projectMeta(projectOverrides[selectedProject.code] ?? selectedProject.state).label}</WorkspaceStatus><span className="font-mono text-xs text-slate-500">{selectedProject.code}</span></div><h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{selectedProject.title}</h2><div className="mt-4"><WorkspaceWorkflowStepper steps={[{ label: "Dự án đã hình thành", state: "done" }, { label: "Theo dõi cam kết tổ chức", state: (projectOverrides[selectedProject.code] ?? selectedProject.state) === "ACTION_REQUIRED" ? "current" : "done" }, { label: "Phối hợp đối tác", state: (projectOverrides[selectedProject.code] ?? selectedProject.state) === "WAITING_PARTNER" ? "current" : "waiting" }, { label: "Hoàn tất nghĩa vụ", state: (projectOverrides[selectedProject.code] ?? selectedProject.state) === "COMPLETED" ? "done" : "waiting" }]} /></div><div className="mt-4 rounded-xl border border-card-border p-4"><span className="text-xs font-bold text-slate-500">Việc của tổ chức</span><strong className="mt-1 block text-sm leading-6 text-slate-900 dark:text-white">{selectedProject.organizationTask}</strong><span className="mt-2 block text-xs text-slate-500">Hạn: {selectedProject.due}</span></div>{(projectOverrides[selectedProject.code] ?? selectedProject.state) === "ACTION_REQUIRED" && <button type="button" disabled={busy} onClick={() => void mutate("Đã xác nhận việc phối hợp của tổ chức", `${selectedProject.code} · ${selectedProject.organizationTask}`, () => setProjectOverrides((current) => ({ ...current, [selectedProject.code]: "OK" })))} className="mt-4 min-h-10 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white disabled:opacity-60">Xác nhận đã phối hợp</button>}</aside></section>
      </>}

      {view === "activity" && <><WorkspaceViewHeader eyebrow="Hoạt động tổ chức" title="Nhật ký & handoff" tone="teal" description="Theo dõi những xác nhận, yêu cầu bổ sung và việc phối hợp do chính vai trò tổ chức thực hiện." /><WorkspaceActivityTimeline scope="organization" seed={[{ id: "org-a1", title: "Xác nhận MAR-02", detail: "Tổ chức xác nhận hạ tầng và nhân sự cho RU-VN-2026-MAR-02.", createdAt: "2026-08-21T15:30:00+07:00", tone: "green" }, { id: "org-a2", title: "Yêu cầu bổ sung AI-04", detail: "Cần làm rõ phạm vi dữ liệu và hạ tầng tính toán.", createdAt: "2026-08-23T14:20:00+07:00", tone: "amber" }]} /></>}
    </main>
  );
}
