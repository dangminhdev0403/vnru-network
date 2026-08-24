"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DemoActivityPanel } from "@/features/prototype-v3/components/DemoActivityPanel";
import { WorkspacePreviewNotice } from "@/features/prototype-v3/components/WorkspacePreviewNotice";
import { commitDemoMutation } from "@/features/prototype-v3/demo-backend";
import { MOCK_PROPOSALS } from "@/features/prototype-v3/mock-data";

type ResearcherView = "overview" | "knowledge" | "collaboration" | "projects" | "academic";
type MilestoneState = "DONE" | "IN_PROGRESS" | "TODO";

const views = new Set<ResearcherView>(["overview", "knowledge", "collaboration", "projects", "academic"]);

const knowledgeItems = [
  { id: "kn-01", type: "Công bố", title: "Nano-composite chịu ăn mòn trong môi trường biển nhiệt đới", meta: "Q1 · 2026 · Vật liệu", status: "Đã công bố" },
  { id: "kn-02", type: "Bộ dữ liệu", title: "Chuỗi quan trắc độ mặn và nhiệt độ Hòn Mun 2024–2026", meta: "Dữ liệu nghiên cứu · Hải dương học", status: "Đã chia sẻ" },
  { id: "kn-03", type: "Bản thảo", title: "Biến tính bề mặt silica cho lớp phủ composite", meta: "Đang hoàn thiện · Đồng tác giả VN–RU", status: "Bản nháp" },
  { id: "kn-04", type: "Chủ đề", title: "Vật liệu mới & công nghệ chế tạo", meta: "18 chuyên gia liên quan", status: "Theo dõi" },
];

const academicItems = [
  { id: "ac-01", date: "05–09/09/2026", title: "VN–RU Marine Materials Workshop", place: "Nha Trang · Hybrid", status: "OPEN" },
  { id: "ac-02", date: "18/10/2026", title: "Seminar FEB RAS: Deep-sea Biofouling", place: "Vladivostok · Online", status: "OPEN" },
  { id: "ac-03", date: "11–20/11/2026", title: "Trao đổi nhóm nghiên cứu vật liệu biển", place: "MISIS · Moskva", status: "PLANNED" },
];

function pillClass(tone: "blue" | "green" | "amber" | "slate") {
  if (tone === "green") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (tone === "amber") return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  if (tone === "slate") return "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300";
}

function StatusPill({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "amber" | "slate" }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${pillClass(tone)}`}>{children}</span>;
}

function Metric({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card-surface-area p-5">
      <strong className="block text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</strong>
      <span className="mt-2 block text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
      <small className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</small>
    </div>
  );
}

function ViewHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-5 border-b border-card-border pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function ResearcherTaskWorkspace() {
  return (
    <React.Suspense fallback={<div className="p-8 text-sm text-slate-500">Đang mở không gian nghiên cứu…</div>}>
      <ResearcherTaskWorkspaceContent />
    </React.Suspense>
  );
}

function ResearcherTaskWorkspaceContent() {
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") as ResearcherView | null;
  const view: ResearcherView = requestedView && views.has(requestedView) ? requestedView : "overview";
  const [toast, setToast] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [draftCreated, setDraftCreated] = React.useState(false);
  const [inviteSent, setInviteSent] = React.useState(false);
  const [knowledgeQuery, setKnowledgeQuery] = React.useState("");
  const [registeredAcademicIds, setRegisteredAcademicIds] = React.useState<string[]>([]);
  const [milestones, setMilestones] = React.useState<Array<{ id: string; title: string; due: string; state: MilestoneState }>>([
    { id: "m1", title: "Thiết lập quy trình thử nghiệm & mẫu chuẩn", due: "15/05/2026", state: "DONE" },
    { id: "m2", title: "Thử nghiệm gia tốc môi trường biển", due: "30/09/2026", state: "IN_PROGRESS" },
    { id: "m3", title: "Đối chiếu dữ liệu VN–RU & bản thảo công bố", due: "20/12/2026", state: "TODO" },
  ]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const runAction = async (action: string, detail: string, after?: () => void) => {
    setBusy(true);
    await commitDemoMutation("researcher", action, detail);
    after?.();
    setBusy(false);
    showToast(`${action} · chỉ cập nhật kịch bản demo.`);
  };

  const filteredKnowledge = knowledgeItems.filter((item) => {
    const query = knowledgeQuery.trim().toLocaleLowerCase("vi");
    return !query || `${item.title} ${item.type} ${item.meta}`.toLocaleLowerCase("vi").includes(query);
  });

  const completeCurrentMilestone = () => {
    const current = milestones.find((item) => item.state === "IN_PROGRESS");
    if (!current) return;
    void runAction("Đã cập nhật mốc tiến độ", current.title, () => {
      setMilestones((items) => {
        const currentIndex = items.findIndex((item) => item.id === current.id);
        return items.map((item, index) => {
          if (item.id === current.id) return { ...item, state: "DONE" as const };
          if (index === currentIndex + 1 && item.state === "TODO") return { ...item, state: "IN_PROGRESS" as const };
          return item;
        });
      });
    });
  };

  return (
    <main className="w-full space-y-7 px-5 py-7 md:px-8 lg:px-10 xl:px-12">
      <WorkspacePreviewNotice scope="không gian Nhà nghiên cứu" />
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-5 left-4 right-4 z-50 rounded-xl border border-blue-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl sm:left-auto sm:right-6 sm:max-w-md">
          <span className="mr-2 text-xs font-extrabold uppercase tracking-wider text-blue-300">UI Preview</span>{toast}
        </div>
      )}

      {view === "overview" && (
        <>
          <ViewHeading
            eyebrow="Không gian nhà nghiên cứu"
            title="Tổng quan công việc nghiên cứu"
            description="Ưu tiên việc cần xử lý, theo dõi đề xuất và dự án song phương trong một điểm vào. Dữ liệu bên dưới là kịch bản minh họa, không phải trạng thái backend nghiệp vụ."
            action={<Link href="/workspace/researcher?view=collaboration" className="inline-flex min-h-11 items-center rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800">Mở cộng tác nghiên cứu →</Link>}
          />
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Chỉ số công việc">
            <Metric value="02" label="Việc cần phản hồi" detail="1 lời mời Co-PI · 1 đề xuất cần hoàn thiện" />
            <Metric value="01" label="Hồ sơ đang phản biện" detail="RU-VN-2026-AI-04" />
            <Metric value="01" label="Dự án đang triển khai" detail="Mốc 2 đang thực hiện" />
            <Metric value="03" label="Hoạt động học thuật" detail="2 đang mở · 1 đang lên kế hoạch" />
          </section>
          <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6">
              <div className="flex items-end justify-between gap-4 border-b border-card-border pb-4">
                <div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Việc cần làm</h2><p className="mt-1 text-sm text-slate-500">Xếp theo trạng thái cần hành động.</p></div>
                <StatusPill tone="amber">2 cần xử lý</StatusPill>
              </div>
              <div className="divide-y divide-card-border">
                <Link href="/workspace/researcher?view=collaboration" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <span className="material-symbols-outlined text-blue-700" aria-hidden="true">group_add</span>
                  <div><strong className="block text-sm text-slate-900 dark:text-white">Hoàn tất ghép Co-PI cho RU-VN-2026-NANO-01</strong><span className="mt-1 block text-xs text-slate-500">Đối tác dự kiến: FEB RAS Vladivostok</span></div>
                  <StatusPill tone="amber">Chờ phản hồi</StatusPill>
                </Link>
                <Link href="/workspace/researcher?view=projects" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <span className="material-symbols-outlined text-blue-700" aria-hidden="true">flag</span>
                  <div><strong className="block text-sm text-slate-900 dark:text-white">Cập nhật mốc thử nghiệm gia tốc</strong><span className="mt-1 block text-xs text-slate-500">Hạn minh họa: 30/09/2026</span></div>
                  <StatusPill>Đang thực hiện</StatusPill>
                </Link>
                <Link href="/workspace/researcher?view=knowledge" className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <span className="material-symbols-outlined text-blue-700" aria-hidden="true">library_books</span>
                  <div><strong className="block text-sm text-slate-900 dark:text-white">Hoàn thiện bản thảo đồng tác giả VN–RU</strong><span className="mt-1 block text-xs text-slate-500">Biến tính bề mặt silica cho lớp phủ composite</span></div>
                  <StatusPill tone="slate">Bản nháp</StatusPill>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Hồ sơ mẫu đang theo dõi</h2>
              <p className="mt-1 text-sm text-slate-500">RU-VN-2026-NANO-01</p>
              <ol className="mt-5 space-y-4">
                {[
                  ["Ý tưởng", "Hoàn tất", "green"],
                  ["Ghép Co-PI", inviteSent ? "Đã gửi lời mời demo" : "Cần hành động", inviteSent ? "blue" : "amber"],
                  ["Xác nhận tổ chức", "Chưa bắt đầu", "slate"],
                  ["Nộp đề xuất", "Chưa bắt đầu", "slate"],
                ].map(([label, state, tone], index) => (
                  <li key={label} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-card-border text-xs font-extrabold text-slate-700 dark:text-slate-200">{index + 1}</span>
                    <div className="min-w-0 flex-1"><strong className="block text-sm text-slate-900 dark:text-white">{label}</strong><span className="mt-1 block text-xs text-slate-500">{state}</span></div>
                    <StatusPill tone={tone as "blue" | "green" | "amber" | "slate"}>{state}</StatusPill>
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <DemoActivityPanel scope="researcher" />
        </>
      )}

      {view === "knowledge" && (
        <>
          <ViewHeading
            eyebrow="Tri thức của tôi"
            title="Hồ sơ tri thức & kết quả nghiên cứu"
            description="Quản lý các kết quả khoa học trong kịch bản demo, rà soát trạng thái chia sẻ và tìm nhanh nội dung liên quan."
            action={<button type="button" disabled={busy} onClick={() => void runAction("Đã tạo bản nháp tri thức", "Bản ghi công bố mới") } className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">+ Thêm kết quả nghiên cứu</button>}
          />
          <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6">
              <label htmlFor="knowledge-search" className="text-sm font-bold text-slate-800 dark:text-slate-100">Tìm trong hồ sơ tri thức</label>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-card-border bg-white px-3 dark:bg-slate-950">
                <span className="material-symbols-outlined text-slate-400" aria-hidden="true">search</span>
                <input id="knowledge-search" value={knowledgeQuery} onChange={(event) => setKnowledgeQuery(event.target.value)} placeholder="Tên công bố, chủ đề, bộ dữ liệu…" className="min-h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" />
              </div>
              <div className="mt-5 divide-y divide-card-border">
                {filteredKnowledge.map((item) => (
                  <article key={item.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div><div className="flex flex-wrap items-center gap-2"><StatusPill>{item.type}</StatusPill><StatusPill tone={item.status === "Bản nháp" ? "slate" : "green"}>{item.status}</StatusPill></div><h2 className="mt-3 text-base font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.meta}</p></div>
                    <button type="button" onClick={() => showToast(`Đang xem ${item.type.toLocaleLowerCase("vi")} trong UI Preview.`)} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Xem chi tiết</button>
                  </article>
                ))}
                {filteredKnowledge.length === 0 && <div className="py-10 text-center"><span className="material-symbols-outlined text-3xl text-slate-400" aria-hidden="true">search_off</span><p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Không có mục demo phù hợp.</p><button type="button" onClick={() => setKnowledgeQuery("")} className="mt-3 text-sm font-bold text-blue-700 dark:text-blue-300">Xóa tìm kiếm</button></div>}
              </div>
            </div>
            <aside className="space-y-4">
              <div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Độ hoàn thiện hồ sơ</p><strong className="mt-2 block text-3xl text-slate-950 dark:text-white">82%</strong><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full w-[82%] rounded-full bg-blue-700" /></div><p className="mt-3 text-xs leading-5 text-slate-500">Còn thiếu 1 bộ từ khóa song ngữ và liên kết ORCID trong kịch bản demo.</p></div>
              <div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Chuyên gia liên quan</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">3 hồ sơ có giao thoa về vật liệu biển.</p><Link href="/experts" className="mt-4 inline-flex text-sm font-bold text-blue-700 dark:text-blue-300">Khám phá chuyên gia →</Link></div>
            </aside>
          </section>
        </>
      )}

      {view === "collaboration" && (
        <>
          <ViewHeading
            eyebrow="Cộng tác nghiên cứu"
            title="Đề xuất & ghép nhóm song phương"
            description="Mỗi hồ sơ hiển thị rõ bước hiện tại, việc tiếp theo và hành động demo tương ứng; không giả lập thành công backend."
            action={<button type="button" disabled={busy || draftCreated} onClick={() => void runAction("Đã tạo bản nháp đề xuất", "RU-VN-DRAFT-NEW", () => setDraftCreated(true))} className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">{draftCreated ? "Đã có bản nháp demo" : "+ Soạn đề xuất mới"}</button>}
          />
          <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6">
              <div className="flex items-end justify-between gap-3 border-b border-card-border pb-4"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Danh sách đề xuất</h2><p className="mt-1 text-sm text-slate-500">4 trạng thái khác nhau để kiểm thử luồng.</p></div><span className="text-xs font-bold text-slate-500">{MOCK_PROPOSALS.length + (draftCreated ? 1 : 0)} hồ sơ</span></div>
              <div className="divide-y divide-card-border">
                {draftCreated && <article className="py-5"><div className="flex flex-wrap items-center gap-2"><StatusPill tone="slate">Bản nháp</StatusPill><span className="font-mono text-xs text-slate-500">RU-VN-DRAFT-NEW</span></div><h3 className="mt-2 text-base font-bold text-slate-950 dark:text-white">Đề xuất nghiên cứu mới chưa đặt tên</h3><p className="mt-2 text-sm text-slate-500">Bước tiếp theo: bổ sung mục tiêu, nhóm tham gia và đối tác song phương.</p></article>}
                {MOCK_PROPOSALS.map((proposal) => {
                  const tone = proposal.status === "ACTIVE" ? "green" : proposal.status === "PENDING_COPI" ? "amber" : "blue";
                  return <article key={proposal.id} className="py-5"><div className="flex flex-wrap items-center gap-2"><StatusPill tone={tone}>{proposal.statusLabel}</StatusPill><span className="font-mono text-xs text-slate-500">{proposal.code}</span></div><h3 className="mt-2 text-base font-bold text-slate-950 dark:text-white">{proposal.title}</h3><p className="mt-2 text-sm text-slate-500">{proposal.vnOrg} ↔ {proposal.ruOrg}</p><div className="mt-4 flex flex-wrap gap-2">{proposal.status === "PENDING_COPI" && <button type="button" disabled={busy || inviteSent} onClick={() => void runAction("Đã tạo lời mời Co-PI", `${proposal.ruPi} · ${proposal.code}`, () => setInviteSent(true))} className="min-h-10 rounded-lg bg-blue-700 px-3 text-sm font-bold text-white disabled:opacity-60">{inviteSent ? "Đã gửi bước demo" : "Mô phỏng mời Co-PI"}</button>}<button type="button" onClick={() => showToast(`Mở hồ sơ ${proposal.code} trong UI Preview.`)} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">Xem hồ sơ</button></div></article>;
                })}
              </div>
            </div>
            <aside className="space-y-4">
              <div className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">Hồ sơ ưu tiên</p><h2 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">RU-VN-2026-NANO-01</h2><div className="mt-5 space-y-3">{[["Phía Việt Nam", "GS.TS. Trần Đình Nam", "green"],["Phía Liên bang Nga", inviteSent ? "Lời mời demo đã tạo" : "Chờ xác nhận Co-PI", inviteSent ? "blue" : "amber"],["Xác nhận tổ chức", "Chưa thực hiện", "slate"]].map(([label, state, tone]) => <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-card-border p-3"><div><span className="block text-xs font-bold text-slate-500">{label}</span><strong className="mt-1 block text-sm text-slate-900 dark:text-white">{state}</strong></div><StatusPill tone={tone as "blue" | "green" | "amber" | "slate"}>{tone === "green" ? "Sẵn sàng" : tone === "amber" ? "Chờ" : tone === "blue" ? "Đã tạo" : "Khóa"}</StatusPill></div>)}</div></div>
              <div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-sm font-bold text-slate-900 dark:text-white">Nguyên tắc demo</h2><p className="mt-2 text-sm leading-6 text-slate-500">Các nút ở màn này chỉ đổi trạng thái UI/nhật ký demo. Khi backend cộng tác được triển khai, cùng vị trí hành động mới được nối API thật.</p></div>
            </aside>
          </section>
        </>
      )}

      {view === "projects" && (
        <>
          <ViewHeading
            eyebrow="Dự án của tôi"
            title="Theo dõi dự án & mốc tiến độ"
            description="Tách riêng trạng thái dự án khỏi đề xuất. Người dùng nhìn thấy mốc hiện tại, việc cần cập nhật và bước tiếp theo."
            action={<button type="button" disabled={busy || !milestones.some((item) => item.state === "IN_PROGRESS")} onClick={completeCurrentMilestone} className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">Hoàn tất mốc hiện tại</button>}
          />
          <section className="rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6">
            <div className="grid gap-5 border-b border-card-border pb-5 lg:grid-cols-[1fr_auto] lg:items-start"><div><div className="flex flex-wrap gap-2"><StatusPill tone="green">Đang triển khai</StatusPill><span className="font-mono text-xs text-slate-500">RU-VN-2026-BIO-08</span></div><h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">Khảo sát đa dạng sinh học và động lực học hải lưu vùng biển chuyển tiếp Việt – Nga</h2><p className="mt-2 text-sm text-slate-500">VAST ↔ FEB RAS · 36 tháng</p></div><div className="min-w-48 rounded-xl bg-slate-50 p-4 dark:bg-slate-900"><span className="text-xs font-bold text-slate-500">Tiến độ minh họa</span><strong className="mt-1 block text-3xl text-slate-950 dark:text-white">75%</strong><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-full w-3/4 rounded-full bg-blue-700" /></div></div></div>
            <div className="mt-5 grid gap-3 lg:grid-cols-3">{milestones.map((milestone, index) => <article key={milestone.id} className="rounded-xl border border-card-border p-4"><div className="flex items-center justify-between gap-2"><span className="text-xs font-extrabold text-slate-500">MỐC {index + 1}</span><StatusPill tone={milestone.state === "DONE" ? "green" : milestone.state === "IN_PROGRESS" ? "blue" : "slate"}>{milestone.state === "DONE" ? "Hoàn tất" : milestone.state === "IN_PROGRESS" ? "Đang làm" : "Chưa bắt đầu"}</StatusPill></div><h3 className="mt-3 text-sm font-bold leading-6 text-slate-900 dark:text-white">{milestone.title}</h3><p className="mt-2 text-xs text-slate-500">Mốc thời gian: {milestone.due}</p></article>)}</div>
          </section>
          <section className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-base font-bold text-slate-950 dark:text-white">Tài liệu tiến độ</h2><p className="mt-2 text-sm text-slate-500">Biên bản thử nghiệm, ghi chú nhóm và tài liệu minh chứng đang được mô phỏng.</p><button type="button" onClick={() => showToast("Mở khu vực tài liệu tiến độ trong UI Preview.")} className="mt-4 min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 dark:text-slate-200">Mở tài liệu</button></div><div className="rounded-2xl border border-card-border bg-card-surface-area p-5"><h2 className="text-base font-bold text-slate-950 dark:text-white">Báo cáo gần nhất</h2><p className="mt-2 text-sm text-slate-500">Báo cáo tiến độ Q2/2026 · trạng thái minh họa: đã lưu bản nháp.</p><button type="button" disabled={busy} onClick={() => void runAction("Đã lưu bản nháp báo cáo", "Q2/2026 · RU-VN-2026-BIO-08")} className="mt-4 min-h-10 rounded-lg bg-blue-700 px-3 text-sm font-bold text-white disabled:opacity-60">Mô phỏng lưu báo cáo</button></div></section>
        </>
      )}

      {view === "academic" && (
        <>
          <ViewHeading
            eyebrow="Học thuật & trao đổi"
            title="Hoạt động học thuật song phương"
            description="Theo dõi hội thảo, seminar và kế hoạch trao đổi nhóm nghiên cứu mà không trộn vào màn đề xuất hoặc dự án."
            action={<button type="button" disabled={busy} onClick={() => void runAction("Đã tạo kế hoạch trao đổi học thuật", "Kế hoạch mới ở trạng thái bản nháp") } className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60">+ Tạo kế hoạch demo</button>}
          />
          <section className="grid gap-4 lg:grid-cols-3">{academicItems.map((item) => { const registered = registeredAcademicIds.includes(item.id); return <article key={item.id} className="flex flex-col rounded-2xl border border-card-border bg-card-surface-area p-5"><div className="flex items-center justify-between gap-2"><StatusPill tone={registered ? "green" : item.status === "OPEN" ? "blue" : "slate"}>{registered ? "Đã đăng ký demo" : item.status === "OPEN" ? "Đang mở" : "Đang lên kế hoạch"}</StatusPill><span className="text-xs font-bold text-slate-500">{item.date}</span></div><h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">{item.title}</h2><p className="mt-2 text-sm text-slate-500">{item.place}</p><div className="mt-auto pt-5"><button type="button" disabled={busy || registered} onClick={() => void runAction("Đã đăng ký hoạt động học thuật", item.title, () => setRegisteredAcademicIds((ids) => [...ids, item.id]))} className="min-h-10 rounded-lg border border-card-border px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:text-slate-200 dark:hover:bg-slate-800">{registered ? "Đã ghi nhận" : "Mô phỏng đăng ký"}</button></div></article>; })}</section>
          <DemoActivityPanel scope="researcher" />
        </>
      )}
    </main>
  );
}
