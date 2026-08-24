import Link from "next/link";
import { GuestPublicNav } from "./GuestPublicNav";

export function GuestHomeV2({ isAuthenticated, workspaceHref }: { isAuthenticated: boolean; workspaceHref: string }) {
  const ecosystem = [
    { icon: "↔", title: "Cơ hội hợp tác", desc: "Tìm kiếm và đề xuất các cơ hội hợp tác nghiên cứu, chuyển giao và đồng phát triển.", href: "/opportunities" },
    { icon: "◎", title: "Chuyên gia & Tổ chức", desc: "Kết nối với chuyên gia và tổ chức khoa học phù hợp theo lĩnh vực và năng lực.", href: "/experts" },
    { icon: "▣", title: "Dự án & Kết quả", desc: "Theo dõi các hướng nghiên cứu song phương, kết quả và mốc triển khai nổi bật.", href: "/opportunities" },
    { icon: "□", title: "Tri thức & Tài liệu", desc: "Khám phá kho tri thức, công bố và tài liệu nghiên cứu dùng chung trong mạng lưới.", href: "/knowledge" },
  ];

  const events = [
    { date: "25", month: "THG 8", kind: "HỘI THẢO", title: "Hội thảo Khoa học & Công nghệ Nga – Việt 2026", place: "Hà Nội, Việt Nam", tone: "from-blue-700 via-blue-500 to-cyan-300" },
    { date: "10", month: "THG 9", kind: "HỘI NGHỊ", title: "Diễn đàn Hợp tác Đổi mới sáng tạo Việt Nam – Liên bang Nga", place: "TP. Hồ Chí Minh, Việt Nam", tone: "from-sky-700 via-blue-500 to-indigo-300" },
    { date: "18", month: "THG 9", kind: "ĐÀO TẠO", title: "Khóa đào tạo AI & Robotics ứng dụng trong nghiên cứu", place: "Online", tone: "from-indigo-700 via-blue-600 to-sky-300" },
  ];

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-950">
      <GuestPublicNav active="home" isAuthenticated={isAuthenticated} workspaceHref={workspaceHref} />

      <main>
        <section className="relative overflow-hidden border-b border-blue-100 bg-[radial-gradient(circle_at_75%_28%,rgba(59,130,246,.18),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(59,130,246,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.045)_1px,transparent_1px)] [background-size:42px_42px]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1460px] gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-blue-700">
                ✦ Kết nối tri thức · Kiến tạo tương lai
              </span>
              <h1 className="mt-5 text-balance text-4xl font-black leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[58px]">
                Kết nối tri thức,<br />
                <span className="text-blue-600">Kiến tạo đột phá</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-slate-600 sm:text-[15px]">
                Mạng lưới hợp tác Khoa học & Công nghệ giữa Nga và Việt Nam — nơi chuyên gia, tổ chức, tri thức và cơ hội nghiên cứu gặp nhau.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold text-slate-600">
                <span className="inline-flex items-center gap-1.5"><b className="text-blue-600">◉</b> 2 quốc gia</span>
                <span className="inline-flex items-center gap-1.5"><b className="text-blue-600">◎</b> 500+ chuyên gia</span>
                <span className="inline-flex items-center gap-1.5"><b className="text-blue-600">◇</b> 300+ dự án hợp tác</span>
                <span className="inline-flex items-center gap-1.5"><b className="text-blue-600">✦</b> 20+ lĩnh vực</span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={isAuthenticated ? workspaceHref : "/login"} className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-xs font-extrabold text-white shadow-[0_12px_30px_-15px_rgba(37,99,235,.9)] transition hover:-translate-y-0.5 hover:bg-blue-700">
                  {isAuthenticated ? "Vào không gian làm việc →" : "Gia nhập mạng lưới →"}
                </Link>
                <Link href="/opportunities" className="inline-flex min-h-11 items-center rounded-xl border border-blue-200 bg-white px-5 text-xs font-extrabold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50">
                  Khám phá cơ hội hợp tác
                </Link>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[620px] items-center justify-center py-4">
              <div className="relative aspect-square w-[76%] min-w-[300px] rounded-full border border-blue-200/80 bg-[radial-gradient(circle_at_38%_34%,#ffffff_0%,#dcecff_34%,#8bc2ff_67%,#2f7eea_100%)] shadow-[0_35px_90px_-34px_rgba(37,99,235,.65)]">
                <div className="absolute inset-[8%] rounded-full border border-white/55" />
                <div className="absolute inset-[18%] rounded-full border border-white/45" />
                <div className="absolute left-[10%] right-[10%] top-1/2 h-px bg-white/60" />
                <div className="absolute bottom-[10%] left-1/2 top-[10%] w-px bg-white/45" />
                <div className="absolute left-[17%] top-[43%] grid size-14 place-items-center rounded-full border-4 border-white bg-red-500 text-xl text-yellow-300 shadow-lg">★</div>
                <div className="absolute right-[18%] top-[43%] overflow-hidden rounded-full border-4 border-white shadow-lg">
                  <div className="h-[18px] w-[54px] bg-white" />
                  <div className="h-[18px] w-[54px] bg-blue-600" />
                  <div className="h-[18px] w-[54px] bg-red-500" />
                </div>
                {["left-[25%] top-[20%]","right-[22%] top-[24%]","left-[30%] bottom-[20%]","right-[30%] bottom-[18%]","left-[48%] top-[8%]"].map((pos) => <span key={pos} className={`absolute size-2 rounded-full border-2 border-white bg-blue-600 shadow ${pos}`} />)}
              </div>
              <div className="absolute inset-x-[12%] top-1/2 h-px -rotate-12 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="absolute inset-x-[15%] top-1/2 h-px rotate-12 bg-gradient-to-r from-transparent via-blue-400/45 to-transparent" />
            </div>
          </div>
        </section>

        <section id="about" className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px] rounded-[28px] border border-blue-100 bg-gradient-to-b from-blue-50/80 to-white p-5 shadow-[0_22px_70px_-48px_rgba(37,99,235,.55)] sm:p-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-blue-600">Hệ sinh thái mạng lưới</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Khám phá hệ sinh thái của chúng tôi</h2>
              </div>
              <div className="hidden gap-2 sm:flex"><button className="grid size-8 place-items-center rounded-full border border-blue-100 bg-white text-blue-700">‹</button><button className="grid size-8 place-items-center rounded-full border border-blue-100 bg-white text-blue-700">›</button></div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ecosystem.map((item) => (
                <Link key={item.title} href={item.href} className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_14px_35px_-30px_rgba(37,99,235,.5)] transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_20px_45px_-28px_rgba(37,99,235,.6)]">
                  <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-xl font-black text-blue-600 ring-1 ring-blue-100">{item.icon}</span>
                  <h3 className="mt-4 text-sm font-extrabold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">{item.desc}</p>
                  <span className="mt-4 inline-flex text-[11px] font-extrabold text-blue-600 transition group-hover:translate-x-1">Khám phá →</span>
                </Link>
              ))}
            </div>

            <div id="events" className="mt-8 flex items-end justify-between gap-4">
              <h2 className="text-xl font-black tracking-tight">Sự kiện nổi bật</h2>
              <Link href="/#events" className="text-[11px] font-extrabold text-blue-600">Xem tất cả →</Link>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {events.map((event) => (
                <article key={event.title} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_14px_38px_-30px_rgba(37,99,235,.45)]">
                  <div className={`relative h-28 bg-gradient-to-br ${event.tone}`}>
                    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,white_0_2px,transparent_3px),radial-gradient(circle_at_70%_60%,white_0_1px,transparent_2px)] [background-size:34px_34px]" />
                    <div className="absolute left-4 top-4 rounded-xl bg-white px-2.5 py-2 text-center shadow"><strong className="block text-lg leading-none text-blue-700">{event.date}</strong><small className="mt-1 block text-[8px] font-bold uppercase text-slate-500">{event.month}</small></div>
                    <span className="absolute bottom-3 left-4 rounded-full bg-blue-700/90 px-2.5 py-1 text-[8px] font-black tracking-wide text-white">{event.kind}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-extrabold leading-5 text-slate-950">{event.title}</h3>
                    <p className="mt-3 text-[10px] font-semibold text-slate-500">◎ {event.place}</p>
                    <p className="mt-1 text-[10px] text-slate-400">◷ 2026</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:grid-cols-2 xl:grid-cols-4">
              {[ ["500+","Chuyên gia"], ["300+","Dự án hợp tác"], ["20+","Lĩnh vực"], ["50+","Tổ chức đối tác"] ].map(([value,label]) => <div key={label} className="flex items-center gap-3 rounded-xl bg-white/85 p-3"><span className="grid size-9 place-items-center rounded-xl bg-blue-100 text-lg text-blue-700">◌</span><span><strong className="block text-xl font-black text-slate-950">{value}</strong><small className="text-[10px] font-semibold text-slate-500">{label}</small></span></div>)}
            </div>
          </div>
        </section>
      </main>

      <footer id="news" className="border-t border-blue-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1460px] flex-col gap-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <strong className="text-slate-800">Mạng lưới KH&CN Nga – Việt</strong>
          <div className="flex flex-wrap gap-5"><Link href="/experts">Chuyên gia</Link><Link href="/opportunities">Hợp tác</Link><Link href="/knowledge">Tri thức</Link></div>
        </div>
      </footer>
    </div>
  );
}
