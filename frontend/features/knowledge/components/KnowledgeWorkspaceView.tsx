import Link from "next/link";
import type { DiscoveryResult, PublicExpert, PublicPublication } from "../types";

type Props = Readonly<{
  publications: DiscoveryResult<PublicPublication>;
  experts: DiscoveryResult<PublicExpert>;
  query: Record<string, string | undefined>;
}>;

function Retry() {
  return (
    <Link href="/workspace/knowledge" className="mt-2 block text-xs font-bold text-blue-800 hover:underline">
      Thử lại →
    </Link>
  );
}

export default function KnowledgeWorkspaceView({ publications, experts, query }: Props) {
  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <div>
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black uppercase tracking-[.14em] text-blue-800">
            Module 02 · Knowledge Repository &amp; Expert Directory
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-4xl text-slate-900">
          Kho tri thức &amp; Danh mục chuyên gia
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Dữ liệu PUBLIC từ knowledge-service và organization-service. Auth-service vẫn là session authority.
        </p>
      </div>

      <section className="rounded-[28px] bg-[#071831] p-6 text-white sm:p-8">
        <h2 className="text-3xl font-black sm:text-5xl">Expert ↔ Publication ↔ Topic ↔ Organization</h2>
        <form className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            name="q"
            defaultValue={query.q}
            type="search"
            aria-label="Tìm tri thức và chuyên gia"
            placeholder="Tìm công bố hoặc chuyên gia"
            className="h-12 rounded-2xl bg-white px-4 text-slate-900 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-2xl bg-blue-600 px-5 font-black text-white hover:bg-blue-700 transition"
          >
            Tìm kiếm
          </button>
        </form>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-black text-slate-900">Publications &amp; research outputs</h3>
          {publications.status === "error" ? (
            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-950">
              Không thể tải Publications.
              <Retry />
            </div>
          ) : publications.items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Không có công bố phù hợp.</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {publications.items.map((p) => (
                <article key={p.id} className="py-4">
                  <strong className="text-sm text-slate-900">{p.title}</strong>
                  <p className="mt-1 text-xs text-slate-500">
                    {p.type} · {p.year} · {p.country} · {p.language}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.topics.map((t) => (
                      <span
                        key={t.id}
                        className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-800 font-semibold"
                      >
                        {t.labels.vi ?? t.labels.en ?? t.slug}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-black text-slate-900">Experts</h3>
          {experts.status === "error" ? (
            <div className="mt-4 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-950">
              Không thể tải Experts.
              <Retry />
            </div>
          ) : experts.items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">Không có chuyên gia phù hợp.</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {experts.items.map((e) => (
                <article key={e.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <strong className="text-sm text-slate-900">{e.displayName}</strong>
                  <p className="mt-1 text-xs text-slate-500">
                    {e.organization.name} · {e.country}
                  </p>
                  <p className="mt-2 text-xs text-slate-600">{e.bio}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {e.expertises.map((x) => (
                      <span
                        key={x.id}
                        className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-800 font-semibold"
                      >
                        {x.labels.vi ?? x.labels.en ?? x.slug}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-amber-200 bg-amber-50/90 p-6">
          <div className="flex justify-between">
            <h3 className="font-black text-amber-950">Expert Matching</h3>
            <span className="text-xs font-black text-amber-900">Pending</span>
          </div>
          <p className="mt-2 text-xs text-amber-950">
            Chưa có HTTP contract được phê duyệt. Không hiển thị điểm hoặc dữ liệu mô phỏng.
          </p>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="font-black text-slate-900">Knowledge graph &amp; Index Ops</h3>
          <span className="mt-2 block text-xs text-slate-500">Pending backend contracts</span>
        </section>
      </div>
    </div>
  );
}
