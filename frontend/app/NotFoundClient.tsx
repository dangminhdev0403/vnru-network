"use client";

import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";

type Copy = {
  title: string;
  description: string;
  helper: string;
  home: string;
  explore: string;
  russia: string;
  vietnam: string;
};

const COPY: Record<Locale, Copy> = {
  vi: {
    title: "Không tìm thấy trang bạn cần",
    description: "Địa chỉ này có thể đã thay đổi, bị xóa hoặc tạm thời không khả dụng.",
    helper: "Chọn một điểm đến để tiếp tục hành trình trong mạng lưới tri thức Nga - Việt.",
    home: "Về trang chủ",
    explore: "Khám phá nội dung",
    russia: "NGA",
    vietnam: "VIỆT NAM",
  },
  en: {
    title: "We could not find that page",
    description: "This address may have changed, been removed, or be temporarily unavailable.",
    helper: "Choose a destination to continue through the Russia - Vietnam knowledge network.",
    home: "Back to home",
    explore: "Explore content",
    russia: "RUSSIA",
    vietnam: "VIETNAM",
  },
  ru: {
    title: "Не удалось найти нужную страницу",
    description: "Возможно, этот адрес изменён, удалён или временно недоступен.",
    helper: "Выберите направление, чтобы продолжить работу в российско-вьетнамской сети знаний.",
    home: "На главную",
    explore: "Перейти к материалам",
    russia: "РОССИЯ",
    vietnam: "ВЬЕТНАМ",
  },
};

function RouteMap({ t }: { t: Copy }) {
  return (
    <div className="relative min-h-[360px] overflow-hidden bg-[#071a33] text-white lg:min-h-screen">
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(147,197,253,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,.08)_1px,transparent_1px)] [background-size:56px_56px]" aria-hidden="true" />
      <svg viewBox="0 0 720 760" className="absolute inset-0 h-full w-full" role="img" aria-label="Kết nối Nga - Việt">
        <g fill="none" stroke="#31557c" strokeWidth="1">
          <ellipse cx="378" cy="366" rx="278" ry="278" />
          <ellipse cx="378" cy="366" rx="278" ry="104" />
          <ellipse cx="378" cy="366" rx="278" ry="190" />
          <ellipse cx="378" cy="366" rx="112" ry="278" />
          <ellipse cx="378" cy="366" rx="200" ry="278" />
        </g>
        <g fill="#123a62" stroke="#4d78a3" strokeWidth="1">
          <path d="M207 191c55-47 136-70 214-55 62 12 119 48 150 99-47 3-91 22-119 54-24 27-48 45-91 45-59 0-119-36-154-79-18-22-18-45 0-64Z" />
          <path d="M176 322c39-28 91-34 129-12 33 19 40 55 70 79-45 18-69 57-83 103-56-18-100-69-116-125-5-17-5-31 0-45Z" />
          <path d="M395 412c47-14 102 13 130 54 19 28 26 65 18 99-36 35-81 58-130 68-25-31-45-68-48-109-3-43 5-82 30-112Z" />
        </g>
        <path d="M312 218C420 239 487 321 474 477" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="8 10" strokeLinecap="round" />
        <circle cx="312" cy="218" r="20" fill="#2563eb" />
        <circle cx="312" cy="218" r="7" fill="white" />
        <circle cx="474" cy="477" r="20" fill="#e34b55" />
        <circle cx="474" cy="477" r="7" fill="white" />
        <text x="345" y="225" fill="#dbeafe" fontSize="18" fontWeight="800">{t.russia}</text>
        <text x="507" y="484" fill="#fee2e2" fontSize="18" fontWeight="800">{t.vietnam}</text>
        <g fill="#60a5fa">
          {[[154,160],[605,160],[115,410],[628,414],[225,632],[574,623]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />)}
        </g>
      </svg>
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between border-t border-blue-300/25 pt-4 text-sm text-blue-100 sm:inset-x-10 sm:bottom-10">
        <span>55.7558° N</span>
        <span className="text-right">21.0285° N</span>
      </div>
    </div>
  );
}

export function NotFoundClient() {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;

  return (
    <main className="min-h-screen bg-[#f4f8fd] text-[#071a33] selection:bg-blue-200 selection:text-blue-950">
      <section className="grid min-h-screen lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative flex items-center px-5 py-14 sm:px-10 lg:px-16 xl:px-24">
          <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(37,99,235,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,.035)_1px,transparent_1px)] [background-size:56px_56px]" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-[680px] lg:mx-0">
            <div className="flex items-end gap-4 border-b border-blue-200 pb-7 sm:gap-6">
              <strong className="font-serif text-[clamp(7rem,22vw,13rem)] font-bold leading-[.72] tracking-[-0.04em] text-blue-600">404</strong>
              <span className="mb-1 hidden h-16 w-px bg-blue-300 sm:block" aria-hidden="true" />
              <span className="mb-1 max-w-32 text-base font-bold leading-6 text-blue-900 sm:block">HTTP<br />NOT FOUND</span>
            </div>

            <h1 className="mt-10 max-w-[620px] text-balance font-serif text-4xl font-semibold leading-tight tracking-[-0.025em] text-[#071a33] sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-5 max-w-[590px] text-lg leading-8 text-slate-600">{t.description}</p>
            <p className="mt-4 max-w-[590px] text-base leading-7 text-slate-500">{t.helper}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-blue-600 px-7 text-base font-bold text-white shadow-[0_12px_28px_rgba(37,99,235,.22)] transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 motion-reduce:transition-none">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t.home}
              </Link>
              <Link href="/news" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md border border-blue-300 bg-white px-7 text-base font-bold text-blue-900 transition-colors hover:border-blue-500 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 motion-reduce:transition-none">
                {t.explore}
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
          </div>
        </div>

        <RouteMap t={t} />
      </section>
    </main>
  );
}
