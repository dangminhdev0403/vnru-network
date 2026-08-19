const publications = [
  ["PB", "High-temperature materials for energy systems", "Article · 2025 · Advanced materials", "12 related experts"],
  ["PT", "Thermal barrier coating technology", "Patent · technology transfer signal", "6 organizations"],
  ["CF", "Bilateral energy materials forum proceedings", "Conference · RU–VN collaboration", "9 topics"],
];

const experts = [
  ["92%", "Advanced Materials Researcher", "Chủ đề trùng khớp: thermal materials · energy systems", "6 related publications"],
  ["87%", "Energy Systems Laboratory Lead", "Bổ sung năng lực: testing · reactor materials", "3 organization links"],
  ["81%", "Industrial Technology Specialist", "Tín hiệu ứng dụng: pilot · production · market", "2 project signals"],
];

export default function KnowledgeWorkspaceView() {
  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">Module 02 · Knowledge Repository & Expert Directory</span>
          <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Kho tri thức & Danh mục chuyên gia</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Module 02 consume identity/context/capability từ IAM. Surface này đang tích hợp visual/runtime route; dữ liệu bên dưới được ghi rõ là preview cho đến khi frontend contract với knowledge-service / organization-service được nối.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700"><span className="h-2 w-2 rounded-full bg-amber-400" /> Preview data</span>
      </div>

      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#071831] p-6 text-white shadow-[0_24px_70px_rgba(8,32,72,.16)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_36%,rgba(53,140,255,.24),transparent_27%),radial-gradient(circle_at_90%_80%,rgba(239,91,115,.12),transparent_20%)]" />
        <div className="relative z-10 grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(420px,.8fr)] xl:items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-300">Knowledge graph experience</span>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">Expert ↔ Publication ↔ Topic ↔ Organization ↔ Project</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">Mục tiêu là đi từ một truy vấn tới toàn bộ hệ tri thức liên quan và giải thích được vì sao một expert hoặc tổ chức phù hợp cho hợp tác Nga–Việt.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
            <label className="block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400" htmlFor="knowledge-preview-search">Integrated search preview</label>
            <div className="relative mt-3"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">search</span><input id="knowledge-preview-search" type="search" placeholder="vật liệu chịu nhiệt cho hệ năng lượng" className="h-12 w-full rounded-2xl border border-white/10 bg-white px-10 pr-4 text-sm text-slate-950 outline-none focus:ring-4 focus:ring-sky-300/15" /></div>
            <div className="mt-3 flex flex-wrap gap-2">{["Lĩnh vực", "Tổ chức", "Quốc gia", "Chủ đề", "Ngôn ngữ", "Năm"].map((filter) => <span key={filter} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-black text-slate-300">{filter}</span>)}</div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)]">
        <section className="overflow-hidden rounded-[24px] border border-white/10 bg-[#071a38] p-5 text-white shadow-xl sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-black">Knowledge graph preview</h3><p className="mt-1 text-xs text-slate-400">Relationship model cho discovery và partner matching.</p></div><span className="rounded-full bg-sky-400/10 px-2 py-1 text-[10px] font-black text-sky-300">Graph view</span></div>
          <div className="relative mt-5 min-h-[360px] overflow-hidden rounded-[20px] border border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(58,137,255,.18),transparent_33%)]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 360" aria-hidden="true"><path d="M380 180 C290 90 205 88 115 85" fill="none" stroke="rgba(117,215,255,.42)" strokeWidth="2"/><path d="M380 180 C285 190 205 245 120 275" fill="none" stroke="rgba(117,215,255,.28)" strokeWidth="2" strokeDasharray="5 8"/><path d="M380 180 C475 88 575 78 655 90" fill="none" stroke="rgba(255,120,145,.34)" strokeWidth="2"/><path d="M380 180 C478 205 568 265 650 280" fill="none" stroke="rgba(117,215,255,.28)" strokeWidth="2" strokeDasharray="5 8"/></svg>
            <div className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-sky-300/30 bg-blue-700/55 p-4 text-center shadow-2xl"><strong className="text-sm">RU–VN Knowledge Core</strong><span className="mt-1 block text-[10px] text-sky-200">Topics · relations · signals</span></div>
            <div className="absolute left-[7%] top-[14%] rounded-2xl border border-white/10 bg-[#092145]/95 px-4 py-3"><strong className="block text-xs">Expert</strong><span className="text-[10px] text-slate-400">Profile · expertise</span></div>
            <div className="absolute bottom-[12%] left-[8%] rounded-2xl border border-white/10 bg-[#092145]/95 px-4 py-3"><strong className="block text-xs">Publication</strong><span className="text-[10px] text-slate-400">Paper · patent</span></div>
            <div className="absolute right-[7%] top-[14%] rounded-2xl border border-white/10 bg-[#092145]/95 px-4 py-3"><strong className="block text-xs">Organization</strong><span className="text-[10px] text-slate-400">Institution · enterprise</span></div>
            <div className="absolute bottom-[12%] right-[8%] rounded-2xl border border-white/10 bg-[#092145]/95 px-4 py-3"><strong className="block text-xs">Project</strong><span className="text-[10px] text-slate-400">Collaboration signal</span></div>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
          <div><h3 className="text-lg font-black">Expert matching</h3><p className="mt-1 text-xs text-slate-500">Preview: score + lý do, không chỉ một con số.</p></div>
          <div className="mt-5 grid gap-3">
            {experts.map(([score, name, reason, signal]) => (
              <article key={name} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"><div className="flex items-start justify-between gap-3"><strong className="text-sm text-slate-900">{name}</strong><span className="text-lg font-black text-blue-600">{score}</span></div><p className="mt-2 text-xs leading-5 text-slate-600">{reason}</p><span className="mt-3 inline-flex rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-700">{signal}</span></article>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-black">Publications & research outputs</h3><p className="mt-1 text-xs text-slate-500">Article · Patent · Conference</p></div><span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black text-amber-700">Preview</span></div>
          <div className="mt-4 divide-y divide-slate-100">
            {publications.map(([type, title, meta, links]) => (
              <div key={title} className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 py-4 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-xs font-black text-blue-700">{type}</span><div><strong className="text-sm text-slate-900">{title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{meta}</span></div><span className="hidden text-xs font-black text-blue-600 sm:block">{links}</span></div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(29,57,95,.05)] sm:p-6">
          <h3 className="text-lg font-black">Data & Index Ops</h3><p className="mt-1 text-xs text-slate-500">UI chuẩn bị cho pipeline ingestion/indexing; chưa gọi endpoint chưa tồn tại.</p>
          <div className="mt-5 grid gap-3">
            {["ORCID / source input", "Background sync", "Dedup / normalize", "Business data store", "Search index", "Retry / observability"].map((step, index) => (
              <div key={step} className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-xs font-black text-blue-700">{index + 1}</span><strong className="text-xs text-slate-800">{step}</strong></div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">Architecture guardrails</span>
        <div className="mt-3 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-amber-200 bg-white/70 p-4"><strong className="text-sm">OPEN-03 · Profile publishing/edit permissions</strong><p className="mt-1 text-xs leading-5 text-slate-600">Mutation controls chỉ được bật khi backend capability contract được nối. UI không tự quyết định quyền.</p></div><div className="rounded-2xl border border-amber-200 bg-white/70 p-4"><strong className="text-sm">OPEN-04 · Semantic search / matching engine</strong><p className="mt-1 text-xs leading-5 text-slate-600">Không hard-code engine hoặc thuật toán vào frontend cho đến khi architecture decision được chốt.</p></div></div>
      </section>
    </div>
  );
}
