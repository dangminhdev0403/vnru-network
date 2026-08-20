import Link from "next/link";
import type { DiscoveryResult, PublicExpert, PublicPublication } from "../../knowledge/types";

type Props=Readonly<{publications:DiscoveryResult<PublicPublication>;experts:DiscoveryResult<PublicExpert>}>;
const metrics=["Đối tác đang theo dõi","Công bố đã lưu","Expert matches","2+2 opportunities"];
export default function DashboardView({ publications, experts }: Props) {
  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase text-slate-700">
              Runtime workspace · real PUBLIC discovery
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl text-slate-900">Workspace Nga–Việt</h1>
          <p className="mt-2 text-sm text-slate-600">
            Identity/context từ Module 01. Publications/Experts PUBLIC từ Module 02.
          </p>
        </div>
        <Link href="/workspace/knowledge" className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700 transition">
          Khám phá Module 02 →
        </Link>
      </div>

      <section className="rounded-[28px] bg-[#071831] p-8 text-white">
        <h2 className="text-3xl font-black sm:text-5xl">
          Identity rõ ràng. Tri thức liên kết. Hợp tác có đường đi.
        </h2>
        <div className="mt-6 flex gap-3">
          <Link href="/workspace/iam" className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700 transition">
            Mở IAM workspace
          </Link>
          <Link href="/workspace/knowledge" className="rounded-xl border border-white/20 px-4 py-3 text-sm font-black text-white hover:bg-white/10 transition">
            Mở Knowledge workspace
          </Link>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((label) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <span className="text-xs font-bold text-slate-600">{label}</span>
            <strong className="mt-2 block text-xl font-black text-slate-400">Pending</strong>
            <span className="mt-3 inline-flex rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-black text-amber-900">
              No aggregate contract
            </span>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-black text-slate-900">Publications</h3>
            <Link href="/workspace/knowledge" className="text-xs font-black text-blue-600 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          {publications.status === "success" ? (
            <div className="mt-3 divide-y divide-slate-100">
              {publications.items.map((p) => (
                <div key={p.id} className="py-3">
                  <strong className="text-sm text-slate-900">{p.title}</strong>
                  <span className="block text-xs text-slate-500">
                    {p.type} · {p.year} · {p.country}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-rose-700">Publications tạm thời không khả dụng.</p>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-black text-slate-900">Experts</h3>
            <span className="text-xs font-black text-amber-900">Matching pending</span>
          </div>
          {experts.status === "success" ? (
            <div className="mt-3 grid gap-3">
              {experts.items.map((e) => (
                <div key={e.id} className="rounded-2xl bg-slate-50/80 border border-slate-200 p-3">
                  <strong className="text-sm text-slate-900">{e.displayName}</strong>
                  <span className="block text-xs text-slate-500">
                    {e.organization.name} · {e.country}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-rose-700">Experts tạm thời không khả dụng.</p>
          )}
        </section>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/admin/iam" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-slate-900 hover:bg-slate-50 transition">
          Access Administration
        </Link>
        <Link href="/security" className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-slate-900 hover:bg-slate-50 transition">
          Security &amp; Sessions
        </Link>
      </div>
    </div>
  );
}
