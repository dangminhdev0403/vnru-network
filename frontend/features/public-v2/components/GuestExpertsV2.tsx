"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/core/i18n/locale";
import { EXPERTS } from "@/features/public-discovery/mock-data";
import { GuestPublicNav } from "./GuestPublicNav";

export function GuestExpertsV2() {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<"all" | "VN" | "RU">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(locale);
    return EXPERTS.filter((expert) => {
      const countryMatch = country === "all" || expert.country === country;
      const text = `${expert.name} ${expert.institution} ${expert.copy[locale].discipline} ${expert.topics.join(" ")}`.toLocaleLowerCase(locale);
      return countryMatch && (!q || text.includes(q));
    });
  }, [country, locale, query]);

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-950">
      <GuestPublicNav active="experts" />

      <main>
        <section className="relative overflow-hidden border-b border-blue-100 bg-[radial-gradient(circle_at_82%_20%,rgba(59,130,246,.20),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(59,130,246,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.04)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1460px] gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-blue-700">Mạng lưới chuyên gia</span>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">Khám phá chuyên gia Nga – Việt</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">Kết nối với các chuyên gia hàng đầu theo lĩnh vực khoa học, tổ chức, quốc gia và hướng nghiên cứu phù hợp.</p>
              <div className="mt-6 flex max-w-3xl flex-col gap-2 sm:flex-row">
                <div className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 shadow-sm focus-within:border-blue-300">
                  <span className="text-blue-600">⌕</span>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, lĩnh vực, tổ chức..." className="min-w-0 flex-1 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400" />
                </div>
                <button className="min-h-11 rounded-xl bg-blue-600 px-5 text-xs font-extrabold text-white shadow-[0_10px_26px_-14px_rgba(37,99,235,.8)] transition hover:bg-blue-700">Tìm kiếm</button>
                <button className="min-h-11 rounded-xl border border-blue-100 bg-white px-4 text-xs font-extrabold text-blue-700 shadow-sm transition hover:bg-blue-50">☷ Bộ lọc</button>
              </div>
            </div>

            <div className="relative hidden h-52 lg:block">
              <div className="absolute left-4 right-4 top-1/2 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
              <div className="absolute bottom-8 left-1/4 right-8 top-8 rounded-[45%] border border-blue-200/70" />
              {EXPERTS.map((expert, index) => {
                const positions = ["left-[10%] top-[34%]", "left-[48%] top-[5%]", "right-[4%] top-[38%]"];
                return <Link key={expert.id} href={`/experts/${expert.id}`} className={`absolute grid size-16 place-items-center rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-blue-300 text-xs font-black text-blue-800 shadow-[0_12px_30px_-12px_rgba(37,99,235,.65)] ${positions[index] ?? "left-1/2 top-1/2"}`}>{expert.initials}</Link>;
              })}
              {["left-[31%] top-[18%]","left-[66%] top-[26%]","left-[26%] bottom-[10%]","right-[18%] bottom-[4%]"].map((pos) => <span key={pos} className={`absolute size-2 rounded-full bg-blue-500 ring-4 ring-blue-100 ${pos}`} />)}
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            <div className="grid gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_16px_40px_-34px_rgba(37,99,235,.5)] sm:grid-cols-2 lg:grid-cols-4">
              {[["520+","Chuyên gia"],["150+","Tổ chức"],["20+","Lĩnh vực"],["2","Quốc gia"]].map(([value,label]) => <div key={label} className="flex items-center gap-3 rounded-xl bg-blue-50/60 p-3"><span className="grid size-9 place-items-center rounded-xl bg-blue-100 text-blue-700">◎</span><span><strong className="block text-xl font-black text-slate-950">{value}</strong><small className="text-[10px] font-semibold text-slate-500">{label}</small></span></div>)}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {[["all","Tất cả"],["VN","Việt Nam"],["RU","Liên bang Nga"]].map(([id,label]) => <button key={id} type="button" onClick={() => setCountry(id as "all" | "VN" | "RU")} className={`rounded-full px-3.5 py-2 text-[10px] font-extrabold transition ${country === id ? "bg-blue-100 text-blue-700 ring-1 ring-blue-200" : "border border-blue-100 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>{label}</button>)}
                {["Lĩnh vực","Tổ chức","Vai trò"].map((item) => <button key={item} type="button" className="rounded-full border border-blue-100 bg-white px-3.5 py-2 text-[10px] font-extrabold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">{item} ⌄</button>)}
              </div>
              <div className="text-[10px] font-bold text-slate-500">{filtered.length} hồ sơ phù hợp · Sắp xếp: <span className="text-blue-700">Mới nhất</span></div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((expert) => {
                const copy = expert.copy[locale];
                return (
                  <article key={expert.id} className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_16px_38px_-32px_rgba(37,99,235,.5)] transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_22px_46px_-28px_rgba(37,99,235,.58)]">
                    <div className="flex items-start gap-3">
                      <div className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-100 to-blue-300 text-sm font-black text-blue-800 ring-4 ring-blue-50">{expert.initials}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5"><h2 className="truncate text-sm font-black text-slate-950">{expert.name}</h2><span className="text-blue-600">●</span></div>
                        <p className="mt-1 text-[10px] font-semibold text-slate-500">{expert.country === "VN" ? "Nhà nghiên cứu · Việt Nam" : "Giáo sư · Liên bang Nga"}</p>
                        <p className="mt-1 line-clamp-1 text-[10px] text-slate-400">{expert.institution}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {expert.topics.slice(0, 3).map((topic) => <span key={topic} className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-700 ring-1 ring-blue-100">{topic}</span>)}
                    </div>

                    <p className="mt-4 line-clamp-3 text-[11px] leading-5 text-slate-500">{copy.bio}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 border-y border-blue-50 py-3 text-[10px] font-bold text-slate-600">
                      <span>▣ {18 + expert.publications.length * 4} dự án</span>
                      <span>□ {expert.publications.length * 16 + 24} công bố</span>
                    </div>

                    <Link href={`/experts/${expert.id}`} className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-blue-100 bg-blue-50/60 text-[10px] font-extrabold text-blue-700 transition group-hover:border-blue-300 group-hover:bg-blue-600 group-hover:text-white">Xem hồ sơ</Link>
                  </article>
                );
              })}
            </div>

            {filtered.length === 0 && <div className="mt-6 rounded-2xl border border-dashed border-blue-200 bg-white p-10 text-center text-xs font-semibold text-slate-500">Không có chuyên gia phù hợp với bộ lọc hiện tại.</div>}

            <section className="mt-8 flex flex-col gap-5 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-100/70 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-blue-100 text-2xl text-blue-700">◎</span><div><h2 className="text-lg font-black text-slate-950">Bạn là chuyên gia?</h2><p className="mt-1 text-[11px] leading-5 text-slate-500">Tham gia mạng lưới để kết nối, hợp tác và chia sẻ tri thức với cộng đồng khoa học Nga – Việt.</p></div></div>
              <Link href="/login" className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 text-[11px] font-extrabold text-white shadow-[0_10px_26px_-14px_rgba(37,99,235,.8)] transition hover:bg-blue-700">Gia nhập ngay →</Link>
            </section>
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-100 bg-white px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-[1460px] flex-col gap-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between"><strong className="text-slate-800">Mạng lưới KH&CN Nga – Việt</strong><div className="flex gap-5"><Link href="/">Trang chủ</Link><Link href="/opportunities">Hợp tác</Link><Link href="/knowledge">Tri thức</Link></div></div></footer>
    </div>
  );
}
