"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GuestExploreMedia } from "./GuestExploreMedia";
import { GuestPublicNav } from "./GuestPublicNav";

const TYPING_PHRASES = [
  "Trí tuệ nhân tạo (AI) & Dữ liệu lớn",
  "Vật liệu Nano & Công nghệ mới",
  "Khoa học Biển & Hải dương học",
  "Năng lượng sạch & Bền vững",
  "Y sinh & Công nghệ sinh học",
];

function TypewriterText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPING_PHRASES[phraseIndex];
    const delay =
      !isDeleting && charIndex === currentPhrase.length
        ? 2200 // Pause on complete word
        : isDeleting
        ? 30 // Smooth fast deleting
        : 70; // Smooth typing speed

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setCharIndex((prev) => prev + 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  const displayedText = TYPING_PHRASES[phraseIndex].slice(0, charIndex);

  return (
    <span className="inline-flex items-center whitespace-nowrap">
      <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
        {displayedText}
      </span>
      <span
        className="ml-1.5 inline-block h-[1.05em] w-[2.5px] rounded-full bg-blue-600 align-middle animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
}

const ecosystem = [
  {
    icon: "↔",
    title: "Cơ hội hợp tác",
    desc: "Tìm kiếm và đề xuất các cơ hội hợp tác nghiên cứu, chuyển giao và đồng phát triển.",
    href: "/opportunities",
    accent: "bg-blue-600 text-white shadow-blue-500/20",
    badge: "Bilateral Calls",
    tone: "border-blue-200/90 hover:border-blue-400",
  },
  {
    icon: "◎",
    title: "Chuyên gia & Tổ chức",
    desc: "Kết nối với chuyên gia và tổ chức khoa học phù hợp theo lĩnh vực và năng lực.",
    href: "/experts",
    accent: "bg-indigo-600 text-white shadow-indigo-500/20",
    badge: "Verified Experts",
    tone: "border-indigo-200/90 hover:border-indigo-400",
  },
  {
    icon: "◈",
    title: "Dự án & Kết quả",
    desc: "Theo dõi các hướng nghiên cứu song phương, kết quả và mốc triển khai nổi bật.",
    href: "/opportunities",
    accent: "bg-emerald-600 text-white shadow-emerald-500/20",
    badge: "Joint Projects",
    tone: "border-emerald-200/90 hover:border-emerald-400",
  },
  {
    icon: "□",
    title: "Tri thức & Tài liệu",
    desc: "Khám phá kho tri thức, công bố và tài liệu nghiên cứu dùng chung trong mạng lưới.",
    href: "/knowledge",
    accent: "bg-amber-600 text-white shadow-amber-500/20",
    badge: "Open Science",
    tone: "border-amber-200/90 hover:border-amber-400",
  },
];

const events = [
  { date: "25", month: "THG 8", kind: "HỘI THẢO", title: "Hội thảo Khoa học & Công nghệ Nga – Việt 2026", place: "Hà Nội, Việt Nam", tone: "from-blue-700 via-blue-500 to-cyan-300" },
  { date: "10", month: "THG 9", kind: "HỘI NGHỊ", title: "Diễn đàn Hợp tác Đổi mới sáng tạo Việt Nam – Liên bang Nga", place: "TP. Hồ Chí Minh, Việt Nam", tone: "from-sky-700 via-blue-500 to-indigo-300" },
  { date: "18", month: "THG 9", kind: "ĐÀO TẠO", title: "Khóa đào tạo AI & Robotics ứng dụng trong nghiên cứu", place: "Online", tone: "from-indigo-700 via-blue-600 to-sky-300" },
];

export function GuestHomeV2({ isAuthenticated, workspaceHref }: { isAuthenticated: boolean; workspaceHref: string }) {
  return (
    <div className="min-h-screen bg-[#ebf4ff] text-slate-950 font-sans">
      <GuestPublicNav active="home" isAuthenticated={isAuthenticated} workspaceHref={workspaceHref} />

      <main>
        <section className="relative overflow-hidden border-b border-blue-200/80 bg-blue-50 px-4 py-12 sm:px-6 lg:px-8 lg:py-18">
          <Image
            src="/brand/vnru-network-banner-2026.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none object-cover object-center"
          />
          <div className="relative mx-auto grid max-w-[1460px] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            {/* Left Column */}
            <div className="flex max-w-3xl flex-col justify-between">
              <div>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs sm:text-[13px] font-bold text-blue-700 shadow-sm shadow-blue-500/5 backdrop-blur transition hover:border-blue-300">
                    <span className="size-2 rounded-full bg-cyan-500 shadow-xs shadow-cyan-400" />
                    Cổng kết nối hợp tác song phương
                  </span>
                </div>

                <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[52px] xl:text-[56px] font-black leading-[1.12] tracking-tight text-slate-950">
                  <span className="block">Mạng lưới Tri thức</span>
                  <span className="block bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 bg-clip-text text-transparent">Khoa học – Công nghệ</span>
                  <span className="block text-slate-900">Nga – Việt</span>
                </h1>

                {/* Prominent, Large Dynamic Priority Tagline */}
                <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <span className="inline-flex items-center gap-2 text-slate-700 font-bold text-sm sm:text-base md:text-[17px] shrink-0">
                    <span className="size-2.5 rounded-full bg-blue-600 shadow-xs shadow-blue-400 animate-pulse" />
                    Lĩnh vực ưu tiên:
                  </span>
                  <span className="inline-flex h-10 items-center rounded-xl border border-blue-200/90 bg-white/95 px-4 text-sm sm:text-base md:text-[16.5px] font-extrabold text-blue-700 shadow-xs">
                    <TypewriterText />
                  </span>
                </div>

                <p className="mt-4 max-w-2xl text-lg sm:text-xl md:text-[20px] font-normal leading-relaxed text-slate-700">
                  Nền tảng kết nối trực tiếp các chuyên gia, viện nghiên cứu, trường đại học và cơ hội hợp tác KH&CN giữa Việt Nam và Liên bang Nga.
                </p>

                {/* Bright Bilateral Strategic Focus Cards with Larger Typography */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="rounded-2xl border border-white/55 bg-white/48 p-4 shadow-sm shadow-sky-500/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-white/62 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 text-sm font-bold text-white shadow-sm shadow-blue-500/30">⚡</span>
                      <span className="rounded-full border border-sky-200/80 bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700">Trọng điểm</span>
                    </div>
                    <strong className="mt-3 block text-base sm:text-[17px] font-extrabold text-slate-950">Đề tài 2026</strong>
                    <p className="mt-1.5 text-sm sm:text-[14.5px] text-slate-600 leading-snug font-medium">AI, Vật liệu Nano & Biển sâu</p>
                  </div>

                  <div className="rounded-2xl border border-white/55 bg-white/48 p-4 shadow-sm shadow-indigo-500/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-white/62 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-400 text-sm font-bold text-white shadow-sm shadow-indigo-500/30">🏛</span>
                      <span className="rounded-full border border-indigo-200/80 bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">Học thuật</span>
                    </div>
                    <strong className="mt-3 block text-base sm:text-[17px] font-extrabold text-slate-950">Đơn vị bảo trợ</strong>
                    <p className="mt-1.5 text-sm sm:text-[14.5px] text-slate-600 leading-snug font-medium">Quỹ Truyền thống & Hữu nghị / VAST</p>
                  </div>

                  <div className="rounded-2xl border border-white/55 bg-white/48 p-4 shadow-sm shadow-emerald-500/5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-white/62 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 text-sm font-bold text-white shadow-sm shadow-emerald-500/30">🌐</span>
                      <span className="rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">Dữ liệu mở</span>
                    </div>
                    <strong className="mt-3 block text-base sm:text-[17px] font-extrabold text-slate-950">Cơ chế song phương</strong>
                    <p className="mt-1.5 text-sm sm:text-[14.5px] text-slate-600 leading-snug font-medium">Đồng tài trợ đề tài & Lab dùng chung</p>
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-1">
                <div className="flex flex-wrap items-center gap-2.5 text-sm sm:text-base font-bold text-slate-800">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200/90 bg-white px-4 py-2.5 text-slate-800 shadow-sm shadow-blue-500/5 transition hover:shadow-xs">
                    <span className="size-2.5 rounded-full bg-rose-500 shadow-xs shadow-rose-400" /> 2 quốc gia
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200/90 bg-white px-4 py-2.5 text-slate-800 shadow-sm shadow-blue-500/5 transition hover:shadow-xs">
                    <span className="size-2.5 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400" /> 500+ chuyên gia
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200/90 bg-white px-4 py-2.5 text-slate-800 shadow-sm shadow-blue-500/5 transition hover:shadow-xs">
                    <span className="size-2.5 rounded-full bg-teal-500 shadow-xs shadow-teal-400" /> 300+ dự án hợp tác
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200/90 bg-white px-4 py-2.5 text-slate-800 shadow-sm shadow-blue-500/5 transition hover:shadow-xs">
                    <span className="size-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-400" /> 20+ lĩnh vực
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3.5">
                  <Link
                    href={isAuthenticated ? workspaceHref : "/login"}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-7 text-sm sm:text-base font-bold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:shadow-blue-600/45 active:translate-y-0"
                  >
                    {isAuthenticated ? "Vào không gian làm việc →" : "Đăng nhập →"}
                  </Link>
                  <Link
                    href="/opportunities"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-300/90 bg-white px-7 text-sm sm:text-base font-bold text-blue-700 shadow-xs transition hover:border-blue-400 hover:bg-blue-50/50 active:translate-y-0"
                  >
                    Khám phá cơ hội hợp tác
                  </Link>
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Hệ thống trực tuyến 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/50 bg-sky-50/36 p-6 shadow-[0_20px_50px_-20px_rgba(37,99,235,0.2)] backdrop-blur-sm transition duration-500 hover:bg-sky-50/46 hover:shadow-[0_25px_60px_-15px_rgba(37,99,235,0.26)] sm:p-7">
                <div className="absolute -right-12 -top-12 size-48 rounded-full bg-blue-100/60 blur-3xl" aria-hidden="true" />
                <div className="absolute -left-12 -bottom-12 size-48 rounded-full bg-sky-100/60 blur-3xl" aria-hidden="true" />

                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-xs">
                        <span className="size-2 rounded-full bg-blue-600" />
                        Cổng thông tin Song phương
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl sm:text-2xl font-bold leading-snug tracking-tight text-slate-950">
                      Cầu nối trực tiếp giữa các viện nghiên cứu và trường đại học hàng đầu Việt Nam – Liên bang Nga.
                    </h2>

                    <div className="mt-5 space-y-4">
                      <div className="flex items-start gap-4 rounded-2xl border border-white/55 bg-white/40 p-4.5 shadow-2xs backdrop-blur-sm transition duration-300 hover:border-white/75 hover:bg-white/54 hover:shadow-xs">
                        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-lg font-black text-white opacity-88 shadow-sm shadow-blue-500/25">
                          16
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-950">Viện nghiên cứu & Đại học trọng điểm</h3>
                            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">Học thuật</span>
                          </div>
                          <p className="mt-1.5 text-base sm:text-[16px] font-normal leading-relaxed text-slate-600">
                            Hợp tác trực tiếp giữa VAST, Viện Hàn lâm Khoa học Nga (RAS), ĐHQG Hà Nội, Bách Khoa và MISIS.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-2xl border border-white/55 bg-white/40 p-4.5 shadow-2xs backdrop-blur-sm transition duration-300 hover:border-white/75 hover:bg-white/54 hover:shadow-xs">
                        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-base sm:text-lg font-black text-white opacity-88 shadow-sm shadow-indigo-500/25">
                          500+
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-950">Chuyên gia khoa học song phương</h3>
                            <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-700">Chuyên gia</span>
                          </div>
                          <p className="mt-1.5 text-base sm:text-[16px] font-normal leading-relaxed text-slate-600">
                            Đội ngũ giáo sư và nhà khoa học sẵn sàng kết nối, phản biện độc lập và đồng chủ trì đề tài.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-2xl border border-white/55 bg-white/40 p-4.5 shadow-2xs backdrop-blur-sm transition duration-300 hover:border-white/75 hover:bg-white/54 hover:shadow-xs">
                        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-lg font-black text-white opacity-88 shadow-sm shadow-emerald-500/25">
                          14
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-extrabold text-slate-950">Hướng nghiên cứu trọng điểm năm 2026</h3>
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">Nghiên cứu</span>
                          </div>
                          <p className="mt-1.5 text-base sm:text-[16px] font-normal leading-relaxed text-slate-600">
                            Ưu tiên các lĩnh vực AI, Khoa học Biển, Vật liệu Nano, Năng lượng mới và Chuyển giao công nghệ.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-1">
                    <Link
                      href="/opportunities"
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm sm:text-base font-bold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.8)] transition hover:from-blue-700 hover:to-indigo-700"
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
              <div className="max-w-3xl">
                <p className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-blue-700">Hệ sinh thái mạng lưới</p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950">Khám phá hệ sinh thái của chúng tôi</h2>
                <p className="mt-3 text-lg sm:text-xl md:text-[20px] font-normal leading-relaxed text-slate-700">Không gian tích hợp toàn diện các trụ cột tri thức, mạng lưới chuyên gia, chương trình đề tài và dữ liệu mở song phương.</p>
              </div>
              <div className="hidden gap-2.5 sm:flex">
                <button type="button" className="grid size-9 place-items-center rounded-full border border-blue-200 bg-white/90 text-lg font-bold text-blue-700 shadow-xs transition hover:bg-white" aria-label="Trang trước">‹</button>
                <button type="button" className="grid size-9 place-items-center rounded-full border border-blue-200 bg-white/90 text-lg font-bold text-blue-700 shadow-xs transition hover:bg-white" aria-label="Trang sau">›</button>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {ecosystem.map((item) => (
                <Link key={item.title} href={item.href} className={`group block h-full rounded-2xl border ${item.tone} bg-white/90 p-6 shadow-[0_14px_35px_-30px_rgba(37,99,235,.35)] transition duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_20px_45px_-28px_rgba(37,99,235,.5)]`}>
                  <div className="flex items-center justify-between">
                    <span className={`grid size-12 place-items-center rounded-xl ${item.accent} text-2xl font-black shadow-sm`}>{item.icon}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{item.badge}</span>
                  </div>
                  <h3 className="mt-5 text-lg sm:text-xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2.5 text-base sm:text-[17px] leading-relaxed text-slate-700 font-normal">{item.desc}</p>
                  <span className="mt-5 inline-flex text-sm sm:text-base font-extrabold text-blue-600 transition group-hover:translate-x-1">Khám phá →</span>
                </Link>
              ))}
            </div>

            <div id="events" className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-blue-700">Sự kiện & Hội thảo</p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">Sự kiện nổi bật</h2>
                <p className="mt-2 text-lg sm:text-xl font-normal leading-relaxed text-slate-700">Các diễn đàn học thuật, hội nghị khoa học và chương trình đào tạo phối hợp giữa hai nước.</p>
              </div>
              <Link href="/#events" className="text-sm sm:text-base font-bold text-blue-700 transition hover:text-blue-900">Xem tất cả sự kiện →</Link>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {events.map((event) => (
                <article key={event.title} className="overflow-hidden rounded-2xl border border-blue-200/80 bg-white/95 shadow-[0_14px_38px_-30px_rgba(37,99,235,.35)] transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className={`relative h-32 bg-gradient-to-br ${event.tone}`}>
                    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,white_0_2px,transparent_3px),radial-gradient(circle_at_70%_60%,white_0_1px,transparent_2px)] [background-size:34px_34px]" />
                    <div className="absolute left-4 top-4 rounded-xl bg-white px-3 py-2 text-center shadow-xs">
                      <strong className="block text-xl sm:text-2xl font-black leading-none text-blue-700">{event.date}</strong>
                      <small className="mt-1 block text-[9px] sm:text-[10px] font-bold uppercase text-slate-500">{event.month}</small>
                    </div>
                    <span className="absolute bottom-3 left-4 rounded-full bg-blue-700/90 px-3 py-1 text-[9px] sm:text-[10px] font-black tracking-wider text-white">{event.kind}</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold leading-snug text-slate-950">{event.title}</h3>
                    <p className="mt-3 text-base font-medium text-slate-700">◎ {event.place}</p>
                    <p className="mt-1.5 text-sm font-medium text-slate-500">◷ Năm 2026</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-blue-200/90 bg-blue-100/70 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { val: "500+", lbl: "Chuyên gia", col: "from-blue-600 to-indigo-600" },
                { val: "300+", lbl: "Dự án hợp tác", col: "from-emerald-600 to-teal-600" },
                { val: "20+", lbl: "Lĩnh vực trọng điểm", col: "from-purple-600 to-pink-600" },
                { val: "50+", lbl: "Tổ chức đối tác", col: "from-amber-600 to-orange-600" },
              ].map(({ val, lbl, col }) => (
                <div key={lbl} className="flex items-center gap-3.5 rounded-xl bg-white/95 p-4.5 shadow-xs transition hover:shadow-sm">
                  <span className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${col} text-xl font-black text-white shadow-xs`}>✓</span>
                  <span>
                    <strong className="block text-2xl sm:text-3xl font-black text-slate-950">{val}</strong>
                    <small className="text-base font-semibold text-slate-700">{lbl}</small>
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
                  <strong className="block font-bold text-slate-900">Quỹ Truyền thống và Hữu nghị:</strong>
                  <span>125047, Moskva, Đường Tverskaya-Yamskaya số 1, Tòa nhà 30, Văn phòng 01B, Liên bang Nga</span>
                </div>
                <div className="pt-1">
                  <span className="block font-medium">Hỗ trợ kỹ thuật & kết nối đề tài:</span>
                  <a href="mailto:info@fonddruzhba.ru" className="font-bold text-blue-700 transition hover:underline">info@fonddruzhba.ru</a>
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
