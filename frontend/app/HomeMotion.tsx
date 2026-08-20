"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import translations from "./home-translations.json";

export type Locale = "vi" | "en" | "ru";

export const useLocale = create<{ locale: Locale; setLocale: (locale: Locale) => void }>()(
  persist((set) => ({ locale: "vi", setLocale: (locale) => set({ locale }) }), { name: "vnru-locale" })
);

export function HomeMotion({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { locale, setLocale } = useLocale();
  const shouldReduceMotion = useReducedMotion();
  const [loggingOut, setLoggingOut] = useState(false);

  const t = (key: string): string => {
    const dict = (translations as Record<Locale, Record<string, string>>)[locale] || translations.vi;
    return dict[key] || (translations.vi as Record<string, string>)[key] || key;
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      const { logoutUrl } = (await response.json()) as { logoutUrl?: string };
      window.location.assign(logoutUrl || "/");
    } catch {
      window.location.assign("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#06152f] text-white font-sans selection:bg-blue-600 selection:text-white">
      {/* ─── Top Navigation Bar ─── */}
      <header className="sticky top-0 z-50 bg-[#06152f]/90 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="#top" className="flex items-center gap-3" aria-label="RU-VN Portal">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/20 bg-white shadow-md">
              <span className="absolute inset-y-0 left-0 w-[64%] -skew-x-12 bg-[#1d4ed8]" />
              <span className="absolute inset-y-0 right-0 w-[48%] -skew-x-12 bg-[#dc2626]" />
            </span>
            <span className="leading-tight">
              <strong className="block text-base font-bold tracking-tight text-white">{t("RU–VN Portal")}</strong>
              <small className="block text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                {t("Science · Technology · Cooperation")}
              </small>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-white/90 md:flex" aria-label="Menu chính">
            <a href="#network" className="transition hover:text-white">{t("Mạng lưới tri thức")}</a>
            <a href="#modules" className="transition hover:text-white">{t("Năng lực")}</a>
            <a href="#knowledge" className="transition hover:text-white">{t("Kho tri thức")}</a>
            <a href="#cooperation" className="transition hover:text-white">{t("Hợp tác 2+2")}</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-xl border border-white/15 bg-white/5 p-1 text-xs font-bold" role="group" aria-label="Ngôn ngữ / Language / Язык">
              {(["vi", "en", "ru"] as const).map((code) => {
                const active = locale === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      active ? "bg-white text-[#06152f] shadow-xs" : "text-slate-300 hover:text-white"
                    }`}
                    aria-pressed={active}
                  >
                    {code.toUpperCase()}
                  </button>
                );
              })}
            </div>

            {/* Auth Button */}
            {isAuthenticated ? (
              <a
                href="#logout"
                onClick={handleLogout}
                className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
              >
                {locale === "ru" ? "Выйти →" : locale === "en" ? "Sign out →" : "Đăng xuất →"}
              </a>
            ) : (
              <Link
                href="/login"
                className="rounded-xl bg-[#1d4ed8] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#1e40af]"
              >
                {t("Đăng nhập →")}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main id="top">
        {/* ─── Hero Section ─── */}
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {t("Mạng lưới")}{" "}
                  <span className="text-white underline decoration-[#3b82f6] decoration-4 underline-offset-8">
                    {t("tri thức Nga–Việt")}
                  </span>{" "}
                  {t("với bản đồ kết nối sống động.")}
                </h1>
                <p className="mt-6 text-base leading-relaxed text-white/90 sm:text-lg">
                  {t("RU–VN Portal kết nối nhà khoa học, công bố, chủ đề nghiên cứu, tổ chức, doanh nghiệp và dự án thành một mạng tri thức xuyên biên giới — nơi bản đồ Nga–Việt không chỉ để nhìn thấy địa lý, mà để nhìn thấy các luồng liên kết, tín hiệu hợp tác và cơ hội hình thành consortium thực sự.")}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#network"
                    className="inline-flex items-center justify-center rounded-xl bg-[#1d4ed8] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#1e40af]"
                  >
                    {t("Khám phá mạng tri thức")}
                  </a>
                  <a
                    href="#cooperation"
                    className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    {t("Tìm hiểu mô hình 2+2")}
                  </a>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-semibold text-white/90">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    {t("Tri thức liên kết xuyên Nga – Việt")}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    {t("Gợi ý đối tác có lý do giải thích")}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    {t("Semantic search · expert matching")}
                  </span>
                </div>
              </motion.div>

              {/* ─── Hero Visual Stage ─── */}
              <div className="relative min-h-[440px] rounded-3xl border border-white/15 bg-[#0c1e38] p-6 shadow-2xl backdrop-blur-xl">
                {/* Search Mock Card */}
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white">
                    <span className="text-sm">⌕</span>
                    <span>{t("vật liệu chịu nhiệt cho lò phản ứng")}</span>
                    <span className="ml-auto rounded-md bg-white/15 px-2 py-0.5 font-bold">{t("Tìm kiếm")}</span>
                  </div>
                  <div className="mt-3 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-black text-white">P</span>
                    <div>
                      <strong className="block text-xs font-bold text-white">{t("Công bố liên quan đến vật liệu nhiệt độ cao")}</strong>
                      <span className="mt-0.5 block text-[11px] text-slate-300">{t("Chủ đề · Công bố · Việt Nam")}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-black text-white">E</span>
                    <div>
                      <strong className="block text-xs font-bold text-white">{t("Chuyên gia nghiên cứu vật liệu & năng lượng")}</strong>
                      <span className="mt-0.5 block text-[11px] text-slate-300">{t("Chuyên môn · Công bố · Tổ chức")}</span>
                    </div>
                  </div>
                </div>

                {/* Flags Bridge Card */}
                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-center">
                  <div className="rounded-xl bg-white/10 p-2">
                    <strong className="block text-sm font-bold text-white">{t("RU")}</strong>
                    <span className="text-[10px] text-slate-300">{t("Liên bang Nga")}</span>
                  </div>
                  <div className="h-1 w-10 rounded-full bg-linear-to-r from-[#2563eb] to-[#dc2626]" />
                  <div className="rounded-xl bg-white/10 p-2">
                    <strong className="block text-sm font-bold text-white">{t("VN")}</strong>
                    <span className="text-[10px] text-slate-300">{t("Việt Nam")}</span>
                  </div>
                </div>

                {/* Partner Match Card */}
                <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-300">{t("Đối tác đề xuất")}</span>
                      <strong className="block text-xs font-bold text-white">{t("Research Partner")}</strong>
                    </div>
                    <span className="rounded-lg border border-white/20 bg-white/15 px-2.5 py-1 text-xs font-black text-white">
                      Khớp nối cao
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {t("Chủ đề tương đồng")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {t("Công bố liên quan")}
                    </span>
                    <span className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {t("Bổ sung chuyên môn")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Trust Bar ─── */}
        <section className="border-y border-white/10 bg-[#040d1e] px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="border-r border-white/10 pr-4">
              <strong className="font-serif text-2xl font-bold text-white sm:text-3xl">03</strong>
              <span className="mt-1 block text-xs text-white/90">{t("module lõi của Portal")}</span>
            </div>
            <div className="border-r border-white/10 pr-4">
              <strong className="font-serif text-2xl font-bold text-white sm:text-3xl">04</strong>
              <span className="mt-1 block text-xs text-white/90">{t("nhóm thành phần tối thiểu trong mô hình 2+2")}</span>
            </div>
            <div className="border-r border-white/10 pr-4">
              <strong className="font-serif text-2xl font-bold text-white sm:text-3xl">01</strong>
              <span className="mt-1 block text-xs text-white/90">{t("cổng danh tính & phân quyền thống nhất")}</span>
            </div>
            <div>
              <strong className="font-serif text-2xl font-bold text-white sm:text-3xl">∞</strong>
              <span className="mt-1 block text-xs text-white/90">{t("mối liên kết tri thức có thể khám phá")}</span>
            </div>
          </div>
        </section>

        {/* ─── Core Capabilities (3 Strategic Modules) ─── */}
        <section id="modules" className="bg-[#f8fafc] px-4 py-20 text-[#0b192c] sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              {t("Một hạ tầng số. Ba năng lực chiến lược.")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#334155]">
              {t("Danh tính và governance tạo nền tin cậy. Mạng lưới tri thức tạo năng lực khám phá. Quy trình 2+2 biến kết nối thành cấu trúc hợp tác nghiên cứu – doanh nghiệp song phương.")}
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {/* Module 01 */}
              <article className="flex flex-col rounded-3xl border border-[#e2e8f0] bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#1d4ed8]">{t("MODULE 01")}</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#0b192c]">{t("IAM / Governance")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#334155]">
                  {t("Cổng danh tính thống nhất cho toàn Portal, xác định người dùng là ai, đang ở context nào và được phép làm gì.")}
                </p>
                <ul className="mt-4 space-y-2 text-xs font-medium text-[#1e293b]">
                  <li className="flex items-center gap-2">• {t("SSO / Identity Provider")}</li>
                  <li className="flex items-center gap-2">• {t("Role, permission & resource scope")}</li>
                  <li className="flex items-center gap-2">• {t("Session, 2FA theo policy, audit")}</li>
                </ul>
                <span className="mt-auto pt-6 text-xs font-bold text-slate-500">{t("Nền tảng truy cập thống nhất")}</span>
              </article>

              {/* Module 02 */}
              <article className="flex flex-col rounded-3xl border border-[#e2e8f0] bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#1d4ed8]">{t("MODULE 02")}</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#0b192c]">{t("Kho tri thức & Chuyên gia")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#334155]">
                  {t("Biến dữ liệu khoa học phân tán thành mạng tri thức có thể tìm kiếm, liên kết và hỗ trợ ghép nối đối tác.")}
                </p>
                <ul className="mt-4 space-y-2 text-xs font-medium text-[#1e293b]">
                  <li className="flex items-center gap-2">• {t("Công bố, bằng sáng chế, tài liệu")}</li>
                  <li className="flex items-center gap-2">• {t("Hồ sơ chuyên gia & hướng nghiên cứu")}</li>
                  <li className="flex items-center gap-2">• {t("Tìm kiếm ngữ nghĩa & gợi ý đối tác")}</li>
                </ul>
                <a href="#knowledge" className="mt-auto pt-6 text-xs font-bold text-[#1d4ed8] hover:underline">
                  {t("Khám phá kho tri thức →")}
                </a>
              </article>

              {/* Module 03 */}
              <article className="flex flex-col rounded-3xl border border-[#e2e8f0] bg-white p-7 shadow-xs transition hover:-translate-y-1 hover:shadow-md">
                <span className="text-xs font-black uppercase tracking-wider text-[#1d4ed8]">{t("MODULE 03")}</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-[#0b192c]">{t("Tài trợ & Dự án 2+2")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#334155]">
                  {t("Hình thành cấu trúc hợp tác cân bằng giữa khối nghiên cứu và doanh nghiệp của cả Việt Nam và Liên bang Nga.")}
                </p>
                <ul className="mt-4 space-y-2 text-xs font-medium text-[#1e293b]">
                  <li className="flex items-center gap-2">• {t("Viện/Trường Việt Nam")}</li>
                  <li className="flex items-center gap-2">• {t("Doanh nghiệp Việt Nam")}</li>
                  <li className="flex items-center gap-2">• {t("Viện/Trường Nga + Doanh nghiệp Nga")}</li>
                </ul>
                <a href="#cooperation" className="mt-auto pt-6 text-xs font-bold text-[#1d4ed8] hover:underline">
                  {t("Xem mô hình 2+2 →")}
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* ─── Intelligent Knowledge Repository Section ─── */}
        <section id="knowledge" className="bg-[#06152f] px-4 py-20 text-white sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("Đi từ một truy vấn đến cả hệ sinh thái tri thức.")}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/90">
                  {t("Người dùng không cần biết dữ liệu nằm ở “kho” nào. Một trải nghiệm tìm kiếm toàn cổng có thể dẫn từ công bố đến tác giả, chủ đề, tổ chức, dự án và những chuyên gia liên quan trong toàn mạng lưới Nga–Việt.")}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                    <strong className="block text-sm font-bold text-white">{t("Tìm kiếm ngữ nghĩa")}</strong>
                    <span className="mt-1 block text-xs text-white/90">{t("Khám phá nội dung theo ý nghĩa, không chỉ khớp từ khóa.")}</span>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                    <strong className="block text-sm font-bold text-white">{t("Ghép nối giải thích được")}</strong>
                    <span className="mt-1 block text-xs text-white/90">{t("Hiển thị lý do phù hợp: chủ đề, công bố, hướng nghiên cứu.")}</span>
                  </div>
                </div>
              </div>

              {/* Search Showcase Component */}
              <div className="rounded-3xl border border-white/15 bg-[#0c1e38] p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white">
                  <span>⌕</span>
                  <span>{t("Tìm chuyên gia, công bố, chủ đề…")}</span>
                  <span className="ml-auto font-bold">↵</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {[t("Lĩnh vực"), t("Tổ chức"), t("Quốc gia"), t("Chủ đề"), t("Ngôn ngữ"), t("Năm")].map((filter) => (
                    <span key={filter} className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-white">
                      {filter}
                    </span>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-bold text-white">EX</span>
                      <div>
                        <strong className="block text-xs font-bold text-white">{t("Chuyên gia vật liệu tiên tiến")}</strong>
                        <span className="text-[11px] text-slate-300">{t("18 công bố liên quan · Nghiên cứu vật liệu")}</span>
                      </div>
                    </div>
                    <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">{t("CHUYÊN GIA")}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-bold text-white">PB</span>
                      <div>
                        <strong className="block text-xs font-bold text-white">{t("High-temperature materials for energy systems")}</strong>
                        <span className="text-[11px] text-slate-300">{t("Công bố · Chủ đề liên quan · 2025")}</span>
                      </div>
                    </div>
                    <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">{t("CÔNG BỐ")}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/15 text-xs font-bold text-white">OR</span>
                      <div>
                        <strong className="block text-xs font-bold text-white">{t("Viện nghiên cứu công nghệ & năng lượng")}</strong>
                        <span className="text-[11px] text-slate-300">{t("Tổ chức · Nga / Việt Nam")}</span>
                      </div>
                    </div>
                    <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">{t("TỔ CHỨC")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 2+2 Cooperation Model ─── */}
        <section id="cooperation" className="bg-[#040d1e] px-4 py-20 text-white sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              {t("Mô hình 2+2: cấu trúc hợp tác chiến lược giữa nghiên cứu và ứng dụng.")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/90">
              {t("2+2 không chỉ là bốn ô thông tin. Đây là khung hợp tác tối thiểu để kết nối một viện/trường và một doanh nghiệp của Liên bang Nga với một viện/trường và một doanh nghiệp của Việt Nam — tạo ra một hệ hợp tác cân bằng, có năng lực nghiên cứu, thử nghiệm, ứng dụng và thương mại hóa.")}
            </p>

            <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              {/* Russia Ecosystem */}
              <div className="rounded-3xl border border-white/15 bg-[#0c1e38] p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{t("RU ecosystem")}</span>
                    <h3 className="font-serif text-xl font-bold text-white">{t("🇷🇺 Liên bang Nga")}</h3>
                  </div>
                  <span className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold text-white">
                    {t("Research + Industry")}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-white/90">
                  {t("Phía Nga cung cấp năng lực nghiên cứu chuyên sâu, cơ sở thí nghiệm, công nghệ nền và khả năng ứng dụng – công nghiệp hóa trong hệ sinh thái doanh nghiệp.")}
                </p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                    <strong className="block text-xs font-bold text-white">01 · {t("Viện / Trường")}</strong>
                    <span className="mt-1 block text-[11px] text-white/80">{t("Bổ sung chuyên môn, công nghệ, phòng thí nghiệm và đội ngũ nghiên cứu.")}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                    <strong className="block text-xs font-bold text-white">02 · {t("Doanh nghiệp")}</strong>
                    <span className="mt-1 block text-[11px] text-white/80">{t("Năng lực ứng dụng, công nghiệp hóa và tiếp cận thị trường Nga.")}</span>
                  </div>
                </div>
              </div>

              {/* Center 2+2 Symbol */}
              <div className="grid place-items-center py-4 lg:py-0">
                <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-white/20 bg-[#06152f] text-center shadow-lg">
                  <span className="text-xs font-bold text-slate-300">{t("RU–VN")}</span>
                  <span className="text-lg font-black text-white">{t("2+2")}</span>
                </div>
              </div>

              {/* Vietnam Ecosystem */}
              <div className="rounded-3xl border border-white/15 bg-[#0c1e38] p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{t("VN ecosystem")}</span>
                    <h3 className="font-serif text-xl font-bold text-white">{t("🇻🇳 Việt Nam")}</h3>
                  </div>
                  <span className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold text-white">
                    {t("Research + Industry")}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-white/90">
                  {t("Phía Việt Nam mang vào bài toán năng lực nghiên cứu, phát triển tri thức, thử nghiệm ứng dụng và mạng lưới doanh nghiệp có nhu cầu triển khai, sản xuất và mở rộng thị trường.")}
                </p>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                    <strong className="block text-xs font-bold text-white">03 · {t("Viện / Trường")}</strong>
                    <span className="mt-1 block text-[11px] text-white/80">{t("Tạo và phát triển tri thức, công nghệ, năng lực nghiên cứu.")}</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                    <strong className="block text-xs font-bold text-white">04 · {t("Doanh nghiệp")}</strong>
                    <span className="mt-1 block text-[11px] text-white/80">{t("Nhu cầu ứng dụng, thử nghiệm, sản xuất và thị trường.")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Collaboration Flow ─── */}
        <section id="collaboration" className="bg-[#06152f] px-4 py-20 text-white sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              {t("Từ một điểm tri thức đến một quan hệ hợp tác thực sự.")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/90">
              {t("RU–VN Portal không dừng ở việc hiển thị hồ sơ hay công bố. Mạng lưới tri thức giúp người dùng đi từ khám phá chủ đề, tìm chuyên gia phù hợp, hiểu lý do ghép nối và tiến tới cấu trúc hợp tác song phương 2+2.")}
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-white/15 bg-[#0c1e38] p-6 shadow-xl">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">01</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-white">{t("Discover")}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/90">
                  {t("Tìm kiếm toàn cổng theo chủ đề, lĩnh vực, tổ chức, quốc gia và đối tượng tri thức.")}
                </p>
              </div>

              <div className="rounded-3xl border border-white/30 bg-[#1d4ed8]/20 p-6 shadow-xl">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">02</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-white">{t("Match")}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/90">
                  {t("Gợi ý chuyên gia và đối tác dựa trên công bố, hướng nghiên cứu và các tín hiệu tương đồng có thể giải thích.")}
                </p>
              </div>

              <div className="rounded-3xl border border-white/15 bg-[#0c1e38] p-6 shadow-xl">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">03</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-white">{t("Collaborate")}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/90">
                  {t("Chuyển kết nối phù hợp thành cấu trúc nghiên cứu – doanh nghiệp Nga–Việt quanh một mục tiêu hoặc công nghệ chung.")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Call to Action ─── */}
        <section className="bg-[#040d1e] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-3xl border border-white/15 bg-[#06152f] p-8 sm:p-12">
            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
              {t("Biến mạng tri thức Nga–Việt thành năng lực hợp tác có thể hành động.")}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/90">
              {t("RU–VN Portal không dừng ở việc số hóa dữ liệu. Portal tạo một lớp kết nối giữa con người, tri thức, tổ chức và dự án — để từ một công bố có thể tìm ra chuyên gia, từ chuyên gia tìm ra đối tác, và từ đối tác hình thành cấu trúc hợp tác Nga–Việt có thể triển khai thực tế.")}
            </p>
            <div className="mt-6">
              <a
                href="#top"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 border border-white/20 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
              >
                {t("Bắt đầu khám phá ↑")}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/10 bg-[#06152f] px-4 py-8 text-xs text-slate-400 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="relative grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded-md border border-white/20 bg-white">
              <span className="absolute inset-y-0 left-0 w-[64%] -skew-x-12 bg-[#1d4ed8]" />
              <span className="absolute inset-y-0 right-0 w-[48%] -skew-x-12 bg-[#dc2626]" />
            </span>
            <span>RU–VN Portal</span>
          </div>
          <div className="flex flex-wrap gap-4 font-semibold text-slate-300">
            <a href="#network" className="hover:text-white">{t("Mạng lưới tri thức")}</a>
            <a href="#modules" className="hover:text-white">{t("Năng lực")}</a>
            <a href="#knowledge" className="hover:text-white">{t("Kho tri thức")}</a>
            <a href="#cooperation" className="hover:text-white">{t("Hợp tác 2+2")}</a>
          </div>
          <div>{t("Concept landing page · dựa trên tài liệu phân tích RU–VN Portal")}</div>
        </div>
      </footer>
    </div>
  );
}
