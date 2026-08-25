"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, type Locale } from "@/core/i18n/locale";

type Copy = {
  badge: string;
  title: string;
  description: string;
  helperStrong: string;
  helperText: string;
  home: string;
  explore: string;
  searchPlaceholder: string;
  search: string;
  russia: string;
  vietnam: string;
};

const COPY: Record<Locale, Copy> = {
  vi: {
    badge: "Trang không tồn tại",
    title: "Không tìm thấy trang bạn cần",
    description:
      "Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.",
    helperStrong: "Bạn có thể quay lại trang chủ",
    helperText: "hoặc khám phá những nội dung hữu ích khác.",
    home: "Về trang chủ",
    explore: "Khám phá ngay",
    searchPlaceholder: "Tìm kiếm nội dung bạn quan tâm...",
    search: "Tìm kiếm",
    russia: "RUSSIA",
    vietnam: "VIETNAM",
  },
  en: {
    badge: "Page not found",
    title: "We could not find that page",
    description:
      "The page may have been removed, renamed, or is temporarily unavailable.",
    helperStrong: "You can return to the homepage",
    helperText: "or explore other useful content.",
    home: "Back to home",
    explore: "Explore now",
    searchPlaceholder: "Search for content...",
    search: "Search",
    russia: "RUSSIA",
    vietnam: "VIETNAM",
  },
  ru: {
    badge: "Страница не найдена",
    title: "Не удалось найти нужную страницу",
    description:
      "Возможно, страница была удалена, переименована или временно недоступна.",
    helperStrong: "Вы можете вернуться на главную",
    helperText: "или посмотреть другие полезные материалы.",
    home: "На главную",
    explore: "Перейти к обзору",
    searchPlaceholder: "Поиск материалов...",
    search: "Поиск",
    russia: "RUSSIA",
    vietnam: "VIETNAM",
  },
};

function GlobeArtwork({ t }: { t: Copy }) {
  return (
    <div className="relative mx-auto flex min-h-[420px] w-full max-w-[720px] items-center justify-center lg:min-h-[560px]">
      <div
        className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_48%,rgba(59,130,246,.12),rgba(59,130,246,.035)_44%,transparent_72%)] blur-2xl"
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 720 620"
        role="img"
        aria-label="Kết nối tri thức Nga - Việt"
        className="relative z-10 h-auto w-full overflow-visible"
      >
        <defs>
          <radialGradient id="globeFill" cx="45%" cy="38%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="58%" stopColor="#f8fbff" />
            <stop offset="100%" stopColor="#eef5ff" />
          </radialGradient>
          <linearGradient id="routeGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g opacity="0.5">
          <path d="M48 134 L150 70 L282 100 L370 42 L520 80 L650 44" stroke="#cfe0ff" strokeWidth="1.2" fill="none" />
          <path d="M88 214 L208 154 L332 184 L462 116 L662 166" stroke="#d9e6fb" strokeWidth="1.2" fill="none" />
          <path d="M110 90 L182 242 L314 66 L410 226 L585 112 L676 282" stroke="#d9e6fb" strokeWidth="1.2" fill="none" />
          {[ [48,134],[150,70],[282,100],[370,42],[520,80],[650,44],[88,214],[208,154],[332,184],[462,116],[662,166],[182,242],[410,226],[585,112],[676,282] ].map(([cx, cy], index) => (
            <circle key={index} cx={cx} cy={cy} r="3.5" fill="#9fc2ff" />
          ))}
        </g>

        <g transform="translate(98 45)">
          <circle cx="325" cy="275" r="218" fill="url(#globeFill)" stroke="#cfe0ff" strokeWidth="1.5" />
          <ellipse cx="325" cy="275" rx="218" ry="88" fill="none" stroke="#dbe8ff" strokeWidth="1.2" />
          <ellipse cx="325" cy="275" rx="218" ry="155" fill="none" stroke="#e2ecff" strokeWidth="1.2" />
          <ellipse cx="325" cy="275" rx="92" ry="218" fill="none" stroke="#dbe8ff" strokeWidth="1.2" />
          <ellipse cx="325" cy="275" rx="154" ry="218" fill="none" stroke="#e2ecff" strokeWidth="1.2" />

          <g fill="#c8d9f6" opacity="0.95">
            <path d="M223 117c32-25 77-39 126-36 48 3 85 19 114 46-35 6-62 17-78 33-23 22-32 45-55 57-24 12-57 8-88-2-25-8-49-25-69-46 14-18 29-36 50-52Z" />
            <path d="M170 221c30-20 69-25 102-11 25 10 38 31 52 51 10 15 24 29 41 42-24 7-46 20-64 39-18 19-28 42-42 63-33-14-62-40-79-73-18-35-23-76-10-111Z" />
            <path d="M347 305c31-4 60 8 83 27 26 21 43 51 51 85-22 24-52 41-86 50-19-17-36-36-47-59-13-27-17-63-1-103Z" />
            <path d="M466 247c22-10 48-10 70 1 19 9 34 25 43 43-7 25-19 48-36 68-20-3-40-10-55-23-25-21-34-54-22-89Z" />
          </g>

          <g fill="#b7cff7" opacity="0.82">
            {Array.from({ length: 84 }).map((_, index) => {
              const angle = (index / 84) * Math.PI * 2;
              const radius = 150 + (index % 5) * 10;
              const cx = 325 + Math.cos(angle) * radius;
              const cy = 275 + Math.sin(angle) * radius * 0.68;
              return <circle key={index} cx={cx} cy={cy} r="2" />;
            })}
          </g>

          <path
            d="M296 124 C382 148 420 207 414 306"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#softGlow)"
          />
          <path
            d="M296 124 C382 148 420 207 414 306"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          <g transform="translate(292 115)" filter="url(#softGlow)">
            <path d="M0 0c-12 0-22 10-22 22 0 17 22 39 22 39s22-22 22-39C22 10 12 0 0 0Z" fill="#2563eb" />
            <circle cx="0" cy="22" r="7" fill="white" />
          </g>
          <text x="332" y="143" fill="#1d4ed8" fontSize="18" fontWeight="800">{t.russia}</text>

          <g transform="translate(414 300)" filter="url(#softGlow)">
            <path d="M0 0c-12 0-22 10-22 22 0 17 22 39 22 39s22-22 22-39C22 10 12 0 0 0Z" fill="#ef4444" />
            <circle cx="0" cy="22" r="7" fill="white" />
          </g>
          <text x="448" y="329" fill="#1d4ed8" fontSize="18" fontWeight="800">{t.vietnam}</text>

          <g opacity="0.48" fill="none" stroke="#b7cff7" strokeWidth="1.1">
            <ellipse cx="325" cy="275" rx="274" ry="112" transform="rotate(-12 325 275)" />
            <ellipse cx="325" cy="275" rx="286" ry="156" transform="rotate(19 325 275)" />
          </g>
        </g>

        <g opacity="0.55" fill="#d6e3f7">
          <path d="M56 532h32v-64h16v64h28v-94h22v94h24v-51h18v51h28v-120h24v120h28v-80h20v80h38v-58h18v58h45v-94h24v94h29v-70h20v70h38v-114h22v114h24v-80h18v80h37v-62h18v62h30v-98h22v98h28v-49h17v49h35v24H56Z" />
        </g>

        <g opacity="0.42" fill="none" stroke="#bcd2f4" strokeWidth="2">
          <path d="M38 534c78-60 132-111 197-159 38 42 75 93 120 159" />
          <path d="M470 534h198M510 534c44-86 86-86 128 0M552 534c25-62 48-98 68-141 17 38 29 87 48 141" />
        </g>

        <g opacity="0.55">
          <ellipse cx="474" cy="570" rx="172" ry="34" fill="none" stroke="#c8dbfa" strokeWidth="1.5" />
          <ellipse cx="474" cy="570" rx="128" ry="24" fill="none" stroke="#b5cff7" strokeWidth="1.5" />
          <ellipse cx="474" cy="570" rx="84" ry="14" fill="none" stroke="#93baf8" strokeWidth="1.5" />
          <circle cx="474" cy="570" r="5" fill="#60a5fa" filter="url(#softGlow)" />
        </g>
      </svg>
    </div>
  );
}

export function NotFoundClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;
  const [query, setQuery] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/explore?query=${encodeURIComponent(value)}` : "/explore");
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white text-slate-950 selection:bg-blue-100 selection:text-blue-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_32%,rgba(59,130,246,.07),transparent_32%),radial-gradient(circle_at_20%_82%,rgba(59,130,246,.045),transparent_25%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-45 [background-image:linear-gradient(rgba(59,130,246,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.025)_1px,transparent_1px)] [background-size:52px_52px]" aria-hidden="true" />

      <section className="mx-auto grid min-h-screen max-w-[1520px] items-center gap-5 px-5 py-10 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12 xl:px-16">
        <div className="relative z-10 mx-auto w-full max-w-[620px] lg:mx-0">
          <div className="inline-flex min-h-11 items-center gap-3 rounded-full border border-blue-300 bg-white px-5 text-xs font-black uppercase tracking-[0.08em] text-blue-600 shadow-[0_8px_28px_rgba(37,99,235,.06)]">
            <span className="grid size-6 place-items-center rounded-full border border-blue-300" aria-hidden="true">
              <span className="size-2 rounded-full bg-blue-600" />
            </span>
            {t.badge}
          </div>

          <div className="mt-7 select-none">
            <div
              className="inline-block text-[clamp(9rem,17vw,15.5rem)] font-black leading-[.78] tracking-[-0.085em] text-transparent drop-shadow-[0_18px_24px_rgba(37,99,235,.16)]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg,#dfeaff_0%,#60a5fa_30%,#2563eb_67%,#0b55df_100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextStroke: "1px rgba(37,99,235,.18)",
              }}
              aria-label="404"
            >
              404
            </div>
          </div>

          <h1 className="mt-7 text-balance text-3xl font-black leading-tight tracking-[-0.035em] text-[#071426] sm:text-4xl lg:text-[42px]">
            {t.title}
          </h1>
          <p className="mt-4 max-w-[560px] text-base leading-7 text-slate-600 sm:text-lg">
            {t.description}
          </p>

          <div className="mt-7 flex max-w-[560px] items-center" aria-hidden="true">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500 to-blue-200" />
            <span className="size-2 rounded-full bg-blue-600 shadow-[0_0_0_5px_rgba(37,99,235,.08)]" />
          </div>

          <div className="mt-7 flex max-w-[560px] items-center gap-4 rounded-2xl border border-blue-200 bg-white/90 p-4 shadow-[0_10px_36px_rgba(37,99,235,.06)]">
            <div className="grid size-14 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.7 2.5 4.2 5.5 4.2 9S14.7 18.5 12 21M12 3C9.3 5.5 7.8 8.5 7.8 12S9.3 18.5 12 21" />
              </svg>
            </div>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">
              <strong className="block font-black text-blue-600">{t.helperStrong}</strong>
              {t.helperText}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-blue-600 px-7 text-sm font-black text-white shadow-[0_12px_28px_rgba(37,99,235,.24)] transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-blue-600 motion-reduce:transition-none"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m3 11 9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 10v10h14V10M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t.home}
            </Link>

            <Link
              href="/explore"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-blue-300 bg-white px-7 text-sm font-black text-slate-900 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-blue-600 motion-reduce:transition-none"
            >
              <svg viewBox="0 0 24 24" className="size-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" strokeLinejoin="round" />
              </svg>
              {t.explore}
            </Link>
          </div>
        </div>

        <GlobeArtwork t={t} />

        <form
          onSubmit={handleSearch}
          className="mx-auto flex w-full max-w-[930px] gap-3 rounded-2xl border border-blue-100 bg-white/95 p-3 shadow-[0_14px_42px_rgba(37,99,235,.08)] lg:col-span-2"
        >
          <label className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl border border-blue-100 bg-white px-4 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
            <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="6.7" />
              <path d="m16 16 4 4" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
            />
          </label>
          <button
            type="submit"
            className="min-h-14 shrink-0 rounded-xl bg-blue-600 px-6 text-sm font-black text-white shadow-[0_10px_22px_rgba(37,99,235,.18)] transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 motion-reduce:transition-none sm:px-8"
          >
            {t.search}
          </button>
        </form>
      </section>
    </main>
  );
}
