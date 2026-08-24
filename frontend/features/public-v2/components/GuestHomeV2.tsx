import Link from "next/link";
import { GuestExploreMedia } from "./GuestExploreMedia";
import { GuestPublicNav } from "./GuestPublicNav";

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

export function GuestHomeV2({ isAuthenticated, workspaceHref }: { isAuthenticated: boolean; workspaceHref: string }) {
  return (
    <div className="min-h-screen bg-[#ebf4ff] text-slate-950">
      <GuestPublicNav active="home" isAuthenticated={isAuthenticated} workspaceHref={workspaceHref} />

      <main>
        <section className="relative overflow-hidden border-b border-blue-200/80 bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,.25),transparent_40%),linear-gradient(180deg,#dbeafe_0%,#eff6ff_55%,#e1effe_100%)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(59,130,246,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.045)_1px,transparent_1px)] [background-size:42px_42px]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1460px] gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/80 bg-blue-100/90 px-4 py-2 text-xs sm:text-[13px] font-black uppercase tracking-[0.1em] text-blue-800">✦ Cổng kết nối hợp tác song phương</span>
              <h1 className="mt-6 text-balance text-4xl font-black leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[68px]">
                Mạng lưới Tri thức<br />
                <span className="text-blue-600">Khoa học – Công nghệ</span><br />
                <span className="text-slate-900">Nga – Việt</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-[19px] font-normal leading-relaxed text-slate-700">
                Nền tảng kết nối trực tiếp các chuyên gia, viện nghiên cứu, trường đại học và cơ hội hợp tác KH&CN giữa Việt Nam và Liên bang Nga.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm md:text-[15px] font-bold text-slate-700">
                <span className="inline-flex items-center gap-2"><b className="text-base text-blue-600">◉</b> 2 quốc gia</span>
                <span className="inline-flex items-center gap-2"><b className="text-base text-blue-600">◎</b> 500+ chuyên gia</span>
                <span className="inline-flex items-center gap-2"><b className="text-base text-blue-600">◇</b> 300+ dự án hợp tác</span>
                <span className="inline-flex items-center gap-2"><b className="text-base text-blue-600">✦</b> 20+ lĩnh vực</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3.5">
                <Link href={isAuthenticated ? workspaceHref : "/register"} className="inline-flex min-h-12 items-center rounded-xl bg-blue-600 px-6 text-sm sm:text-base font-bold text-white shadow-[0_14px_32px_-14px_rgba(37,99,235,.9)] transition hover:-translate-y-0.5 hover:bg-blue-700">{isAuthenticated ? "Vào không gian làm việc →" : "Gia nhập mạng lưới →"}</Link>
                <Link href="/opportunities" className="inline-flex min-h-12 items-center rounded-xl border border-blue-300 bg-white/90 px-6 text-sm sm:text-base font-bold text-blue-700 shadow-xs transition hover:border-blue-400 hover:bg-white">Khám phá cơ hội hợp tác</Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[640px]">
              <div className="relative overflow-hidden rounded-[32px] border border-blue-200 bg-gradient-to-b from-white/95 via-blue-50/90 to-sky-100/70 p-7 shadow-[0_24px_60px_-18px_rgba(37,99,235,0.22)] backdrop-blur-xl sm:p-8">
                <div className="absolute -right-12 -top-12 size-48 rounded-full bg-blue-200/50 blur-3xl" aria-hidden="true" />
                <div className="absolute -left-12 -bottom-12 size-48 rounded-full bg-sky-200/50 blur-3xl" aria-hidden="true" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3 border-b border-blue-200/80 pb-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-100/80 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-blue-800">
                      ✦ Cổng thông tin Song phương
                    </span>
                    <div className="flex items-center gap-1.5 rounded-full border border-blue-200/90 bg-white/85 px-2.5 py-1 text-xs font-black text-slate-700 shadow-xs">
                      <span className="grid size-5 place-items-center rounded-full bg-red-600 text-[10px] text-yellow-300 shadow-xs">★</span>
                      <span className="text-[10px] font-extrabold text-blue-600">↔</span>
                      <span className="flex size-5 flex-col overflow-hidden rounded-full border border-slate-200 shadow-xs">
                        <span className="h-1/3 bg-white" />
                        <span className="h-1/3 bg-blue-600" />
                        <span className="h-1/3 bg-red-600" />
                      </span>
                      <span className="ml-1 text-[11px] font-black uppercase text-blue-700">VN – RU</span>
                    </div>
                  </div>

                  <h2 className="mt-4 text-xl sm:text-2xl font-black leading-snug tracking-tight text-slate-950">
                    Cầu nối trực tiếp giữa các viện nghiên cứu và trường đại học hàng đầu Việt Nam – Liên bang Nga.
                  </h2>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-4 rounded-2xl border border-blue-200/80 bg-white/85 p-4 shadow-xs transition hover:border-blue-300 hover:bg-white">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-sm">
                        16
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-black text-slate-950">Viện nghiên cứu & Đại học trọng điểm</h3>
                        <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
                          Hợp tác trực tiếp giữa VAST, Viện Hàn lâm Khoa học Nga (RAS), ĐHQG Hà Nội, Bách Khoa và MISIS.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-2xl border border-blue-200/80 bg-white/85 p-4 shadow-xs transition hover:border-blue-300 hover:bg-white">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-sm">
                        500+
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-black text-slate-950">Chuyên gia khoa học song phương</h3>
                        <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
                          Đội ngũ giáo sư và nhà khoa học sẵn sàng kết nối, phản biện độc lập và đồng chủ trì đề tài.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-2xl border border-blue-200/80 bg-white/85 p-4 shadow-xs transition hover:border-blue-300 hover:bg-white">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-lg font-black text-white shadow-sm">
                        14
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-black text-slate-950">Hướng nghiên cứu trọng điểm năm 2026</h3>
                        <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
                          Ưu tiên các lĩnh vực AI, Khoa học Biển, Vật liệu Nano, Năng lượng mới và Chuyển giao công nghệ.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-2">
                    <Link
                      href="/opportunities"
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 text-sm sm:text-base font-bold text-white shadow-[0_12px_30px_-12px_rgba(37,99,235,0.8)] transition hover:bg-blue-700"
                    >
                      Khám phá cơ hội hợp tác ngay →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <GuestExploreMedia />

        <section id="about" className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px] rounded-[32px] border border-blue-200/90 bg-gradient-to-b from-blue-100/70 via-sky-50/80 to-blue-50/60 p-6 shadow-[0_22px_70px_-40px_rgba(37,99,235,.28)] sm:p-9">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-blue-700">Hệ sinh thái mạng lưới</p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950">Khám phá hệ sinh thái của chúng tôi</h2>
              </div>
              <div className="hidden gap-2.5 sm:flex">
                <button type="button" className="grid size-9 place-items-center rounded-full border border-blue-200 bg-white/90 text-lg font-bold text-blue-700 shadow-xs transition hover:bg-white">‹</button>
                <button type="button" className="grid size-9 place-items-center rounded-full border border-blue-200 bg-white/90 text-lg font-bold text-blue-700 shadow-xs transition hover:bg-white">›</button>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {ecosystem.map((item) => (
                <Link key={item.title} href={item.href} className="group rounded-2xl border border-blue-200/80 bg-white/90 p-6 shadow-[0_14px_35px_-30px_rgba(37,99,235,.35)] transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-[0_20px_45px_-28px_rgba(37,99,235,.5)]">
                  <span className="grid size-12 place-items-center rounded-xl bg-blue-100 text-2xl font-black text-blue-700 ring-1 ring-blue-200">{item.icon}</span>
                  <h3 className="mt-5 text-base sm:text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  <span className="mt-5 inline-flex text-xs sm:text-sm font-extrabold text-blue-600 transition group-hover:translate-x-1">Khám phá →</span>
                </Link>
              ))}
            </div>

            <div id="events" className="mt-12 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-blue-700">Sự kiện & Hội thảo</p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">Sự kiện nổi bật</h2>
              </div>
              <Link href="/#events" className="text-xs sm:text-sm font-bold text-blue-700 transition hover:text-blue-900">Xem tất cả sự kiện →</Link>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              {events.map((event) => (
                <article key={event.title} className="overflow-hidden rounded-2xl border border-blue-200/80 bg-white/95 shadow-[0_14px_38px_-30px_rgba(37,99,235,.35)]">
                  <div className={`relative h-32 bg-gradient-to-br ${event.tone}`}>
                    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,white_0_2px,transparent_3px),radial-gradient(circle_at_70%_60%,white_0_1px,transparent_2px)] [background-size:34px_34px]" />
                    <div className="absolute left-4 top-4 rounded-xl bg-white px-3 py-2 text-center shadow-xs">
                      <strong className="block text-xl sm:text-2xl font-black leading-none text-blue-700">{event.date}</strong>
                      <small className="mt-1 block text-[9px] sm:text-[10px] font-bold uppercase text-slate-500">{event.month}</small>
                    </div>
                    <span className="absolute bottom-3 left-4 rounded-full bg-blue-700/90 px-3 py-1 text-[9px] sm:text-[10px] font-black tracking-wider text-white">{event.kind}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm sm:text-base font-bold leading-snug text-slate-950">{event.title}</h3>
                    <p className="mt-3 text-xs sm:text-sm font-medium text-slate-600">◎ {event.place}</p>
                    <p className="mt-1 text-xs text-slate-400">◷ Năm 2026</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-blue-200/90 bg-blue-100/70 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {[["500+", "Chuyên gia"], ["300+", "Dự án hợp tác"], ["20+", "Lĩnh vực"], ["50+", "Tổ chức đối tác"]].map(([value, label]) => (
                <div key={label} className="flex items-center gap-3.5 rounded-xl bg-white/95 p-4 shadow-xs">
                  <span className="grid size-11 place-items-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">◌</span>
                  <span>
                    <strong className="block text-2xl sm:text-3xl font-black text-slate-950">{value}</strong>
                    <small className="text-xs sm:text-sm font-semibold text-slate-600">{label}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="news" className="border-t border-blue-200/90 bg-[#e3eefc] pt-14 pb-10 text-slate-700">
        <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3.5" aria-label="Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xs">
                  <span className="absolute inset-y-0 left-0 w-[62%] -skew-x-12 bg-blue-600" />
                  <span className="absolute inset-y-0 right-0 w-[46%] -skew-x-12 bg-rose-500" />
                </span>
                <span>
                  <strong className="block text-base sm:text-lg font-black tracking-tight text-slate-950">Mạng lưới Tri thức KH&CN</strong>
                  <small className="block text-xs font-extrabold tracking-wider text-slate-600 uppercase">Nga – Việt</small>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-600">
                Cổng thông tin & điều phối hợp tác khoa học công nghệ độc lập giữa các viện nghiên cứu, trường đại học trọng điểm của Việt Nam và Liên bang Nga.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-xs font-bold text-blue-800 shadow-xs">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Cổng dữ liệu mở KH&CN 2026
                </span>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">Khám phá hệ sinh thái</h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li><Link href="/opportunities" className="transition hover:text-blue-700 hover:underline">Chương trình & Cơ hội nghiên cứu</Link></li>
                <li><Link href="/experts" className="transition hover:text-blue-700 hover:underline">Mạng lưới Chuyên gia xác thực</Link></li>
                <li><Link href="/knowledge" className="transition hover:text-blue-700 hover:underline">Kho tri thức & Báo cáo KH&CN</Link></li>
                <li><Link href="/#about" className="transition hover:text-blue-700 hover:underline">Viện & Đại học đối tác liên kết</Link></li>
                <li><Link href="/#events" className="transition hover:text-blue-700 hover:underline">Hội thảo & Diễn đàn khoa học</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">Hướng trọng điểm</h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li><span className="text-slate-700">Trí tuệ nhân tạo & Dữ liệu</span></li>
                <li><span className="text-slate-700">Khoa học Biển & Hải dương</span></li>
                <li><span className="text-slate-700">Vật liệu mới & Nano</span></li>
                <li><span className="text-slate-700">Năng lượng sạch & Nguyên tử</span></li>
                <li><span className="text-slate-700">Công nghệ sinh học biển</span></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">Điều phối & Liên hệ</h4>
              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600">
                <div>
                  <strong className="block font-bold text-slate-900">Văn phòng Điều phối Hà Nội:</strong>
                  <span>Viện Hàn lâm KH&CN Việt Nam (VAST), 18 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</span>
                </div>
                <div>
                  <strong className="block font-bold text-slate-900">Văn phòng Đối tác Moskva:</strong>
                  <span>Viện Hàn lâm Khoa học Nga (RAS), Leninsky Prospekt 14, Moskva</span>
                </div>
                <div className="pt-1">
                  <span className="block font-medium">Hỗ trợ kỹ thuật & kết nối đề tài:</span>
                  <a href="mailto:contact@vnru-network.org" className="font-bold text-blue-700 transition hover:underline">contact@vnru-network.org</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blue-200/80 pt-8 text-xs sm:text-sm font-medium text-slate-600 md:flex-row">
            <p>© 2026 Mạng lưới Tri thức Khoa học – Công nghệ Nga – Việt. Bảo lưu mọi quyền.</p>
            <div className="flex flex-wrap gap-5 font-semibold text-slate-600">
              <Link href="/#about" className="hover:text-blue-700">Điều khoản hợp tác</Link>
              <Link href="/#about" className="hover:text-blue-700">Chính sách bảo mật</Link>
              <Link href="/#about" className="hover:text-blue-700">Chuẩn mực đạo đức nghiên cứu</Link>
              <Link href="/#about" className="hover:text-blue-700">Dữ liệu mở song phương</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
