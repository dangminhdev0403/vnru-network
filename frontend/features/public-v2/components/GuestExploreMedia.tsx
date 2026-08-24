import Link from "next/link";

const moments = [
  {
    title: "Kết nối nhóm nghiên cứu",
    meta: "Hà Nội · Việt Nam",
    tag: "Hợp tác",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Đối thoại khoa học song phương",
    meta: "Moscow · Liên bang Nga",
    tag: "Diễn đàn",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "AI & dữ liệu khoa học",
    meta: "Phòng nghiên cứu liên kết",
    tag: "Công nghệ",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Đào tạo & trao đổi chuyên gia",
    meta: "Việt Nam ↔ Liên bang Nga",
    tag: "Học thuật",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Không gian đổi mới sáng tạo",
    meta: "Hệ sinh thái KH&CN",
    tag: "Đổi mới",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Mạng lưới chuyên gia đa lĩnh vực",
    meta: "20+ lĩnh vực nghiên cứu",
    tag: "Chuyên gia",
    image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=82",
  },
];

const bannerItems = [
  "Khoa học biển",
  "AI & dữ liệu",
  "Vật liệu mới",
  "Năng lượng",
  "Công nghệ sinh học",
  "Robot & tự động hoá",
  "Chuyển giao tri thức",
  "Hợp tác Nga – Việt",
];

export function GuestExploreMedia() {
  return (
    <>
      <section id="visual-stories" className="border-b border-blue-200/80 bg-[#e7f2fe] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1460px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-blue-700">Hình ảnh mạng lưới</p>
              <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950">Khoảnh khắc kết nối Nga – Việt</h2>
              <p className="mt-2.5 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">Không gian hình ảnh dành cho hoạt động nghiên cứu, hội thảo, trao đổi chuyên gia và những điểm chạm nổi bật của mạng lưới.</p>
            </div>
            <Link href="/experts" className="inline-flex min-h-11 items-center self-start rounded-xl border border-blue-200 bg-white/95 px-5 text-xs sm:text-sm font-bold text-blue-700 shadow-xs transition hover:border-blue-300 hover:bg-white sm:self-auto">
              Khám phá mạng lưới →
            </Link>
          </div>

          <div className="mt-8 grid auto-rows-[200px] gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[230px]">
            {moments.map((item, index) => (
              <article
                key={item.title}
                className={`group relative isolate overflow-hidden rounded-[24px] border border-blue-100 bg-blue-100 shadow-[0_22px_55px_-40px_rgba(37,99,235,.85)] ${index === 0 ? "sm:row-span-2 lg:col-span-2" : ""} ${index === 3 ? "lg:col-span-2" : ""}`}
              >
                <div
                  className="absolute inset-0 scale-[1.01] bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.image})` }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06152f]/90 via-[#0b3c91]/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="inline-flex rounded-full border border-white/25 bg-blue-600/90 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white backdrop-blur">{item.tag}</span>
                  <h3 className="mt-2.5 text-base sm:text-lg md:text-xl xl:text-2xl font-bold leading-snug text-white">{item.title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm font-medium text-blue-100">{item.meta}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[30px] border border-blue-200 bg-[radial-gradient(circle_at_15%_20%,rgba(147,197,253,.46),transparent_28%),linear-gradient(110deg,#0b5de8_0%,#1677ff_45%,#55b7ff_100%)] px-6 py-8 text-white shadow-[0_28px_75px_-42px_rgba(37,99,235,.95)] sm:px-10 sm:py-10">
            <div className="absolute -right-16 -top-20 size-64 rounded-full border border-white/20" aria-hidden="true" />
            <div className="absolute right-10 top-5 size-32 rounded-full border border-white/15" aria-hidden="true" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs sm:text-[13px] font-black uppercase tracking-wider backdrop-blur">Mạng lưới đang chuyển động</span>
                <h3 className="mt-4 max-w-3xl text-2xl sm:text-3xl md:text-4xl font-black leading-snug tracking-tight">Theo dõi những kết nối mới, hoạt động mới và cơ hội hợp tác đang hình thành mỗi ngày.</h3>
                <div className="mt-5 flex max-w-3xl gap-2.5 overflow-hidden">
                  <div className="guest-banner-slide flex w-max gap-2.5">
                    {[...bannerItems, ...bannerItems].map((item, index) => (
                      <span key={`${item}-banner-${index}`} className="shrink-0 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs sm:text-sm font-bold text-white backdrop-blur">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
              <Link href="/opportunities" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-7 text-sm sm:text-base font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50">
                Xem cơ hội đang mở →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes guestMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes guestBannerSlide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .guest-marquee { animation: guestMarquee 34s linear infinite; }
        .guest-banner-slide { animation: guestBannerSlide 26s linear infinite; }
        .guest-marquee:hover, .guest-banner-slide:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .guest-marquee, .guest-banner-slide { animation: none; }
        }
      `}</style>
    </>
  );
}
