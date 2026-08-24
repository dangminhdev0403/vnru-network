"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";

const COPY: Record<Locale, { knowledge: string; experts: string; opportunities: string; join: string; joinShort: string; repo: string; mock: string }> = {
  vi: { knowledge: "Tri thức", experts: "Chuyên gia", opportunities: "Cơ hội nghiên cứu", join: "Gia nhập mạng lưới", joinShort: "Gia nhập", repo: "Kho tri thức công cộng", mock: "Public preview · Dữ liệu minh hoạ, không phải số liệu vận hành chính thức." },
  en: { knowledge: "Knowledge", experts: "Experts", opportunities: "Research opportunities", join: "Join the network", joinShort: "Join", repo: "Public knowledge repository", mock: "Public preview · Illustrative data, not official operational records." },
  ru: { knowledge: "Знания", experts: "Эксперты", opportunities: "Исследовательские возможности", join: "Вступить в сеть", joinShort: "Вступить", repo: "Открытое хранилище знаний", mock: "Публичный прототип · Демонстрационные, не официальные операционные данные." },
};

export function PublicDiscoveryShell({ children, current }: { children: ReactNode; current: "experts" | "opportunities" }) {
  const { locale, setLocale } = useLocale();
  const t = COPY[locale];

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  return <div className="knowledge-discovery min-h-screen bg-[#f5f1e8] text-[#0b1c30]">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06152f]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-[1380px] items-center gap-3 px-4 sm:px-6">
        <Link href="/knowledge" className="flex min-w-0 items-center gap-3" aria-label="VN–RU Network">
          <span className="relative grid h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white"><span className="absolute inset-y-0 left-0 w-[64%] -skew-x-12 bg-[#1d4ed8]"/><span className="absolute inset-y-0 right-0 w-[48%] -skew-x-12 bg-[#dc2626]"/></span>
          <span className="min-w-0"><strong className="block truncate text-sm sm:text-base">VN–RU Network</strong><small className="hidden text-xs font-bold uppercase tracking-[0.16em] text-blue-100 sm:block">{t.repo}</small></span>
        </Link>
        <nav className="ml-auto hidden items-center gap-6 text-sm font-semibold text-slate-200 lg:flex" aria-label="Public discovery">
          <Link href="/knowledge">{t.knowledge}</Link>
          <Link href="/experts" aria-current={current === "experts" ? "page" : undefined} className={current === "experts" ? "text-white underline decoration-blue-400 decoration-2 underline-offset-8" : ""}>{t.experts}</Link>
          <Link href="/opportunities" aria-current={current === "opportunities" ? "page" : undefined} className={current === "opportunities" ? "text-white underline decoration-red-400 decoration-2 underline-offset-8" : ""}>{t.opportunities}</Link>
        </nav>
        <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label="Language / Ngôn ngữ / Язык" className="ml-auto h-10 rounded-lg border border-white/20 bg-[#0b223d] px-2 text-xs font-extrabold text-white focus-visible:ring-2 focus-visible:ring-sky-300 lg:ml-0"><option value="vi">VI</option><option value="ru">RU</option><option value="en">EN</option></select>
        <Link href="/login" className="inline-flex min-h-10 items-center rounded-lg bg-[#2563eb] px-3 text-xs font-extrabold text-white hover:bg-[#1d4ed8] sm:px-4 sm:text-sm"><span className="hidden sm:inline">{t.join}</span><span className="sm:hidden">{t.joinShort}</span></Link>
      </div>
    </header>
    {children}
    <footer className="bg-[#06152f] px-4 py-10 text-white sm:px-6"><div className="mx-auto flex max-w-[1380px] flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between"><div><strong className="font-serif text-xl">VN–RU Network</strong><p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">{t.mock}</p></div><nav className="flex flex-wrap gap-5 text-sm font-semibold text-slate-200"><Link href="/knowledge">{t.knowledge}</Link><Link href="/experts">{t.experts}</Link><Link href="/opportunities">{t.opportunities}</Link></nav></div></footer>
  </div>;
}
