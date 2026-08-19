import Link from "next/link";

const metrics = [
  { label: "Đối tác đang theo dõi", value: "05", note: "UI preview" },
  { label: "Công bố đã lưu", value: "18", note: "UI preview" },
  { label: "Expert matches", value: "07", note: "UI preview" },
  { label: "2+2 opportunities", value: "03", note: "UI preview" },
];

const knowledgeItems = [
  ["PB", "High-temperature materials for energy systems", "Công bố · vật liệu tiên tiến · Nga–Việt"],
  ["EX", "Chuyên gia vật liệu & năng lượng", "Expert · 18 công bố liên quan · đối tác tiềm năng"],
  ["OR", "Viện nghiên cứu công nghệ & năng lượng", "Tổ chức · năng lực phòng thí nghiệm · R&D"],
];

const matches = [
  ["92%", "Advanced materials researcher", "Trùng hướng nghiên cứu · 6 công bố liên quan"],
  ["87%", "Energy systems laboratory", "Bổ sung năng lực thử nghiệm · cùng nhóm chủ đề"],
  ["81%", "Industrial technology partner", "Phù hợp nhu cầu pilot · tín hiệu ứng dụng"],
];

export default function DashboardView() {
  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Runtime workspace · preview data
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">Workspace Nga–Việt</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Một điểm vào sau đăng nhập để chuyển từ identity/context sang khám phá tri thức, ghép nối chuyên gia và hình thành hợp tác song phương.</p>
        </div>
        <Link href="/workspace/knowledge" className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">Khám phá Module 02 →</Link>
      </div>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#071831] p-6 text-white shadow-[0_24px_70px_rgba(8,32,72,.16)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_34%,rgba(53,140,255,.28),transparent_26%),radial-gradient(circle_at_92%_84%,rgba(239,91,115,.12),transparent_22%)]" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-sky-200">RU–VN integrated workspace</span>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">Identity rõ ràng. Tri thức liên kết. Hợp tác có đường đi.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">Module 01 cung cấp identity, active context và capability. Module 02 dùng context đó để hiển thị tri thức, chuyên gia và các tín hiệu ghép nối phù hợp.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/workspace/iam" className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white">Mở IAM workspace</Link>
            <Link href="/workspace/knowledge" className="rounded-xl border border-white/15 bg-white/[0.08] px-4 py-3 text-sm font-black text-white">Mở Knowledge workspace</Link>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_12px_34px_rgba(29,57,95,.05)]">
            <span className="text-xs font-bold text-slate-500">{metric.label}</span>
            <strong className="mt-2 block text-3xl font-black tracking-[-0.04em] text-slate-950">{metric.value}</strong>
            <span className="mt-3 inline-flex rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-amber-700">{metric.note}</span>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,.75fr)]">
        <div className="grid gap-5">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div><h3 className="text-lg font-black tracking-tight">Knowledge discovery</h3><p className="mt-1 text-xs text-slate-500">Dữ liệu minh họa UI — chưa phải KPI/runtime data.</p></div>
              <Link href="/workspace/knowledge" className="text-xs font-black text-blue-600">Xem Module 02 →</Link>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {knowledgeItems.map(([icon, title, meta]) => (
                <div key={title} className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 py-4 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-xs font-black text-blue-700">{icon}</span>
                  <div><strong className="text-sm text-slate-900">{title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{meta}</span></div>
                  <span className="hidden rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-600 sm:inline-flex">Preview</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-black tracking-tight">Expert matching</h3><p className="mt-1 text-xs text-slate-500">Điểm phù hợp luôn đi kèm lý do giải thích.</p></div><span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">Explainable</span></div>
            <div className="mt-4 grid gap-3">
              {matches.map(([score, title, reason]) => (
                <div key={title} className="grid grid-cols-[58px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <strong className="text-xl font-black text-blue-600">{score}</strong>
                  <div><strong className="text-sm text-slate-900">{title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{reason}</span></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid content-start gap-5">
          <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
            <h3 className="text-lg font-black tracking-tight">Quick actions</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Link href="/workspace/knowledge" className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"><strong className="block text-sm">Tìm tri thức</strong><span className="mt-1 block text-xs text-slate-500">Publications · experts · topics</span></Link>
              <Link href="/workspace/iam" className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"><strong className="block text-sm">Xem access context</strong><span className="mt-1 block text-xs text-slate-500">Identity · scope · capability</span></Link>
              <Link href="/admin/iam" className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"><strong className="block text-sm">Access Administration</strong><span className="mt-1 block text-xs text-slate-500">Backend-enforced governance</span></Link>
              <Link href="/security" className="rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40"><strong className="block text-sm">Security & Sessions</strong><span className="mt-1 block text-xs text-slate-500">Session controls · security trail</span></Link>
            </div>
          </section>

          <section className="overflow-hidden rounded-[24px] border border-white/10 bg-[#071a38] p-5 text-white shadow-xl sm:p-6">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-300">2+2 collaboration pipeline</span>
            <h3 className="mt-3 text-xl font-black">Từ match đến consortium</h3>
            <div className="mt-5 grid gap-3">
              {["Discover topic / problem", "Match experts & organizations", "RU–VN 2+2 structure", "Pilot / proposal readiness"].map((item, index) => (
                <div key={item} className="grid grid-cols-[34px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/15 text-xs font-black text-sky-300">0{index + 1}</span><span className="text-xs font-bold text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
