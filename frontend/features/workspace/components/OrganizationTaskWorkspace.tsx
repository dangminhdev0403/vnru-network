"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DemoActivityPanel } from "@/features/prototype-v3/components/DemoActivityPanel";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { commitDemoMutation } from "@/features/prototype-v3/demo-backend";

type OrganizationView = "overview" | "endorsements" | "projects" | "activity";
type EndorsementState = "PENDING" | "NEEDS_INFO" | "ENDORSED";

type EndorsementItem = {
  id: string;
  code: string;
  title: string;
  lead: string;
  leadOrg: string;
  partnerOrg: string;
  facilities: string;
  state: EndorsementState;
};

const views = new Set<OrganizationView>(["overview", "endorsements", "projects", "activity"]);

const initialEndorsements: EndorsementItem[] = [
  {
    id: "org-01",
    code: "RU-VN-2026-NANO-01",
    title: "Độ bền và biến tính bề mặt vật liệu Nano-composite trong môi trường biển nhiệt đới",
    lead: "GS.TS. Trần Đình Nam",
    leadOrg: "Viện Hải dương học",
    partnerOrg: "FEB RAS Vladivostok",
    facilities: "Trạm thử nghiệm biển Hòn Mun · Phòng thí nghiệm ăn mòn biển",
    state: "PENDING",
  },
  {
    id: "org-02",
    code: "RU-VN-2026-AI-04",
    title: "Mô hình AI dự báo sớm tai biến địa chất và sạt lở bờ biển",
    lead: "PGS.TS. Lê Hoài Thanh",
    leadOrg: "Đơn vị nghiên cứu liên kết",
    partnerOrg: "MISIS Moskva",
    facilities: "Hạ tầng tính toán và bộ dữ liệu quan trắc cần được làm rõ",
    state: "NEEDS_INFO",
  },
  {
    id: "org-03",
    code: "RU-VN-2026-MAR-02",
    title: "Hệ thống trao đổi dữ liệu hải dương học và giám sát đa dạng sinh học biển",
    lead: "TS. Nguyễn Văn Hùng",
    leadOrg: "Viện Tài nguyên & Môi trường biển",
    partnerOrg: "POI RAS",
    facilities: "Tàu nghiên cứu khoa học biển · Trung tâm tích hợp dữ liệu",
    state: "ENDORSED",
  },
];

const projects = [
  { code: "RU-VN-2026-BIO-08", title: "Khảo sát đa dạng sinh học vùng biển chuyển tiếp Việt – Nga", partner: "FEB RAS", progress: 75, state: "Đang triển khai", next: "Rà soát báo cáo tiến độ Q2/2026" },
  { code: "RU-VN-2025-OCEAN-03", title: "Đồng bộ chuỗi quan trắc hải dương học ven bờ", partner: "POI RAS", progress: 48, state: "Đang triển khai", next: "Xác nhận kế hoạch sử dụng tàu nghiên cứu" },
];

function stateCopy(state: EndorsementState) {
  if (state === "ENDORSED") return "Đã xác nhận";
  if (state === "NEEDS_INFO") return "Cần bổ sung";
  return "Chờ xác nhận";
}

function StatePill({ state }: { state: EndorsementState }) {
  const classes = state === "ENDORSED"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
    : state === "NEEDS_INFO"
      ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
      : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${classes}`}>{stateCopy(state)}</span>;
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return <div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><strong className="block text-3xl font-extrabold text-slate-950 dark:text-white">{value}</strong><span className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">{label}</span><small className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</small></div>;
}

function ViewHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="flex flex-col gap-5 border-b border-card-border pb-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</header>;
}

export function OrganizationTaskWorkspace() {
  return <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian tổ chức…</div>}><OrganizationTaskWorkspaceContent /></React.Suspense>;
}

function OrganizationTaskWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as OrganizationView | null;
  const view: OrganizationView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const [items, setItems] = React.useState(initialEndorsements);
  const [filter, setFilter] = React.useState<"ALL" | EndorsementState>("ALL");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const filteredItems = items.filter((item) => filter === "ALL" || item.state === filter);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const updateEndorsement = async (id: string, state: EndorsementState) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    const action = state === "ENDORSED" ? "Đã mô phỏng xác nhận tổ chức" : "Đã yêu cầu bổ sung thông tin";
    setBusy(true);
    await commitDemoMutation("organization", action, `${item.code} · ${item.title}`);
    setItems((current) => current.map((entry) => entry.id === id ? { ...entry, state } : entry));
    setBusy(false);
    setSelectedId(null);
    showToast(`${action} · chỉ cập nhật dữ liệu demo.`);
  };

  const counts = {
    pending: items.filter((item) => item.state === "PENDING").length,
    needsInfo: items.filter((item) => item.state === "NEEDS_INFO").length,
    endorsed: items.filter((item) => item.state === "ENDORSED").length,
  };

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Đại diện tổ chức" />
      <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200"><strong>Kịch bản minh họa:</strong> một tổ chức nghiên cứu Việt Nam phối hợp với các đối tác RAS. Tên tổ chức trong dữ liệu mẫu không đại diện cho context tài khoản đang đăng nhập.</div>
      {toast && <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-teal-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md"><span className="mr-2 text-xs font-extrabold uppercase tracking-wider text-teal-300">UI Preview</span>{toast}</div>}

      {view === "overview" && <>
        <ViewHeading eyebrow="Không gian đại diện tổ chức" title="Tổng quan công việc tổ chức" description="Tập trung vào hồ sơ cần xác nhận, dự án thuộc phạm vi tổ chức và việc cần theo dõi. Các nav còn lại mở đúng lõi nghiệp vụ thay vì cuộn trong cùng một dashboard." action={<Link href="/workspace/organization?view=endorsements" className="inline-flex min-h-11 items-center rounded-xl bg-teal-700 px-4 text-sm font-bold text-white hover:bg-teal-800">Mở hàng đợi xác nhận →</Link>} />
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric value={String(counts.pending).padStart(2, "0")} label="Chờ xác nhận" detail="Hồ sơ có đủ dữ liệu để quyết định demo" /><Metric value={String(counts.needsInfo).padStart(2, "0")} label="Cần bổ sung" detail="Chưa đủ thông tin về nguồn lực hoặc phạm vi" /><Metric value={String(projects.length).padStart(2, "0")} label="Dự án liên quan" detail="Đang triển khai trong kịch bản mẫu" /><Metric value={String(counts.endorsed).padStart(2, "0")} label="Đã xác nhận" detail="Có thể xem lại ở hàng đợi" /></section>
        <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="flex items-end justify-between gap-4 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc cần làm</h2><p className="mt-1 text-sm text-slate-500">Ưu tiên hồ sơ cần quyết định hoặc bổ sung.</p></div><span className="text-xs font-bold text-amber-700 dark:text-amber-300">{counts.pending + counts.needsInfo} việc</span></div><div className="divide-y divide-card-border">{items.filter((item) => item.state !== "ENDORSED").map((item) => <Link key={item.id} href="/workspace/organization?view=endorsements" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="material-symbols-outlined text-teal-700" aria-hidden="true">fact_check</span><div><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block font-mono text-xs text-slate-500">{item.code}</span></div><StatePill state={item.state} /></Link>)}</div></div>
          <aside className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-300">Phạm vi xác nhận</p><h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">Tổ chức xác nhận những gì?</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><li>• Tư cách chủ trì của đơn vị.</li><li>• Khả năng sử dụng hạ tầng nghiên cứu đã kê khai.</li><li>• Sự phù hợp của cán bộ và đơn vị tham gia.</li><li>• Thông tin cần bổ sung trước bước tiếp theo.</li></ul></aside>
        </section>
      </>}

      {view === "endorsements" && <>
        <ViewHeading eyebrow="Đề xuất cần xác nhận" title="Hàng đợi xác nhận tổ chức" description="Mỗi hồ sơ có một trạng thái rõ ràng và hai hành động demo có ý nghĩa: xác nhận hoặc yêu cầu bổ sung. Không có thông báo giả rằng backend đã ghi nhận." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6">
          <div className="flex flex-wrap gap-2 border-b border-card-border pb-4" role="group" aria-label="Lọc trạng thái hồ sơ">{([
            ["ALL", `Tất cả (${items.length})`],
            ["PENDING", `Chờ xác nhận (${counts.pending})`],
            ["NEEDS_INFO", `Cần bổ sung (${counts.needsInfo})`],
            ["ENDORSED", `Đã xác nhận (${counts.endorsed})`],
          ] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} aria-pressed={filter === value} className={`min-h-10 rounded-lg px-3 text-sm font-bold ${filter === value ? "bg-teal-700 text-white" : "border border-card-border text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"}`}>{label}</button>)}</div>
          <div className="divide-y divide-card-border">{filteredItems.map((item) => <article key={item.id} className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><StatePill state={item.state} /><span className="font-mono text-xs text-slate-500">{item.code}</span></div><h2 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">Chủ nhiệm: {item.lead} · {item.leadOrg}</p><p className="mt-1 text-sm text-slate-500">Đối tác: {item.partnerOrg}</p></div><button type="button" onClick={() => setSelectedId(item.id)} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Xem hồ sơ</button></article>)}</div>
          {filteredItems.length === 0 && <div className="py-10 text-center"><span className="material-symbols-outlined text-3xl text-slate-400" aria-hidden="true">inbox</span><p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Không có hồ sơ demo ở trạng thái này.</p><button type="button" onClick={() => setFilter("ALL")} className="mt-3 text-sm font-bold text-teal-700 dark:text-teal-300">Xem tất cả</button></div>}
        </section>
        {selected && <section role="dialog" aria-modal="true" aria-labelledby="org-dossier-title" className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4"><div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-card-border bg-card-surface-area shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-card-border p-5"><div><span className="font-mono text-xs text-slate-500">{selected.code}</span><h2 id="org-dossier-title" className="mt-1 text-lg font-bold text-slate-950 dark:text-white">Hồ sơ xác nhận tổ chức</h2></div><button type="button" aria-label="Đóng hồ sơ" onClick={() => setSelectedId(null)} className="grid size-10 place-items-center rounded-lg border border-card-border text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"><span className="material-symbols-outlined" aria-hidden="true">close</span></button></div><div className="space-y-4 p-5"><StatePill state={selected.state} /><h3 className="text-xl font-bold leading-7 text-slate-950 dark:text-white">{selected.title}</h3><dl className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Chủ nhiệm</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selected.lead}</dd></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"><dt className="text-xs font-bold text-slate-500">Đối tác</dt><dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selected.partnerOrg}</dd></div></dl><div className="rounded-xl border border-card-border p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hạ tầng / nguồn lực kê khai</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{selected.facilities}</p></div></div><div className="flex flex-wrap justify-end gap-2 border-t border-card-border p-5"><button type="button" onClick={() => setSelectedId(null)} className="min-h-10 rounded-lg border border-card-border px-4 text-sm font-bold text-slate-700 dark:text-slate-200">Đóng</button>{selected.state !== "ENDORSED" && <button type="button" disabled={busy} onClick={() => void updateEndorsement(selected.id, "NEEDS_INFO")} className="min-h-10 rounded-lg border border-rose-200 px-4 text-sm font-bold text-rose-700 disabled:opacity-60 dark:border-rose-900 dark:text-rose-300">Yêu cầu bổ sung demo</button>}{selected.state !== "ENDORSED" && <button type="button" disabled={busy} onClick={() => void updateEndorsement(selected.id, "ENDORSED")} className="min-h-10 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60">Mô phỏng xác nhận</button>}</div></div></section>}
      </>}

      {view === "projects" && <>
        <ViewHeading eyebrow="Dự án liên quan" title="Dự án trong phạm vi tổ chức" description="Cho đại diện tổ chức theo dõi tiến độ, mốc cần phối hợp và tài liệu liên quan; không trộn quyền cập nhật tiến độ của nhà nghiên cứu vào đây." />
        <section className="grid gap-5 xl:grid-cols-2">{projects.map((project) => <article key={project.code} className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">{project.state}</span><span className="font-mono text-xs text-slate-500">{project.code}</span></div><h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{project.title}</h2><p className="mt-2 text-sm text-slate-500">Đối tác: {project.partner}</p><div className="mt-5"><div className="flex items-center justify-between text-xs font-bold text-slate-500"><span>Tiến độ minh họa</span><span>{project.progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full rounded-full bg-teal-700" style={{ width: `${project.progress}%` }} /></div></div><div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Việc tổ chức cần theo dõi</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{project.next}</strong></div><button type="button" onClick={() => showToast(`Mở ${project.code} ở chế độ theo dõi UI Preview.`)} className="mt-4 min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Xem chi tiết dự án</button></article>)}</section>
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-base font-bold text-slate-950 dark:text-white">Ranh giới thao tác</h2><p className="mt-2 text-sm leading-6 text-slate-500">Màn đại diện tổ chức chỉ theo dõi và xác nhận phần thuộc phạm vi tổ chức. Cập nhật mốc nghiên cứu nằm ở không gian Nhà nghiên cứu; phê duyệt nghiệp vụ thật chỉ tồn tại khi backend tương ứng được triển khai.</p></section>
      </>}

      {view === "activity" && <>
        <ViewHeading eyebrow="Hoạt động tổ chức" title="Nhật ký & diễn biến xử lý" description="Hiển thị thao tác demo của phiên hiện tại và một timeline mẫu giúp kiểm thử trạng thái, thay vì dùng trang hoạt động như một bản sao dashboard." />
        <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><h2 className="text-lg font-bold text-slate-950 dark:text-white">Diễn biến hồ sơ mẫu</h2><ol className="mt-5 space-y-4 border-l border-card-border pl-5">{[
          ["24/08/2026 · 10:20", "RU-VN-2026-NANO-01", "Hồ sơ chuyển tới tổ chức để xác nhận thông tin chủ trì."],
          ["23/08/2026 · 16:05", "RU-VN-2026-AI-04", "Đánh dấu cần bổ sung mô tả hạ tầng tính toán."],
          ["20/08/2026 · 09:40", "RU-VN-2026-MAR-02", "Hoàn tất bước xác nhận trong kịch bản dữ liệu mẫu."],
        ].map(([time, code, detail]) => <li key={`${time}-${code}`} className="relative"><span className="absolute -left-[26px] top-1.5 size-3 rounded-full border-2 border-teal-700 bg-card-surface-area" /><time className="text-xs font-bold text-slate-500">{time}</time><strong className="mt-1 block font-mono text-xs text-teal-700 dark:text-teal-300">{code}</strong><p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{detail}</p></li>)}</ol></section>
        <DemoActivityPanel scope="organization" />
      </>}
    </main>
  );
}
