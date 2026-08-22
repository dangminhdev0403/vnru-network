import Link from "next/link";
import type { DiscoveryResult, PublicExpert } from "../types";

const L = {
  vi: { title: "Chuyên gia", search: "Tìm chuyên gia", searchBtn: "Tìm kiếm", filterCountry: "Quốc gia", filterOrg: "Tổ chức", filterTopic: "Lĩnh vực", filterLang: "Ngôn ngữ", empty: "Không có chuyên gia phù hợp.", error: "Không thể tải danh sách chuyên gia.", retry: "Thử lại", next: "Tiếp", clear: "Xóa bộ lọc" },
  en: { title: "Experts", search: "Search experts", searchBtn: "Search", filterCountry: "Country", filterOrg: "Organization", filterTopic: "Topic", filterLang: "Language", empty: "No matching experts found.", error: "Unable to load experts.", retry: "Retry", next: "Next", clear: "Clear filters" },
  ru: { title: "Эксперты", search: "Поиск экспертов", searchBtn: "Найти", filterCountry: "Страна", filterOrg: "Организация", filterTopic: "Тема", filterLang: "Язык", empty: "Подходящих экспертов не найдено.", error: "Не удалось загрузить экспертов.", retry: "Повторить", next: "Далее", clear: "Сбросить фильтры" },
} as const;
type Locale = keyof typeof L;

type Props = Readonly<{
  result: DiscoveryResult<PublicExpert>;
  query: Record<string, string | undefined>;
  locale?: Locale;
}>;

function buildHref(base: Record<string, string | undefined>, overrides: Record<string, string | undefined>): string {
  const merged = { ...base, ...overrides };
  // Remove cursor when filters change
  if (overrides.cursor === undefined && !("cursor" in overrides)) delete merged.cursor;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
  const qs = params.toString();
  return `/experts${qs ? `?${qs}` : ""}`;
}

export default function ExpertList({ result, query, locale = "vi" }: Props) {
  const t = L[locale];
  const hasFilters = query.q || query.country || query.topic || query.language;

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>

      {/* Search & filters */}
      <form className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto_auto]" action="/experts">
        <input
          name="q"
          defaultValue={query.q}
          type="search"
          aria-label={t.search}
          placeholder={t.search}
          className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="country"
          defaultValue={query.country}
          placeholder={t.filterCountry}
          aria-label={t.filterCountry}
          className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="topic"
          defaultValue={query.topic}
          placeholder={t.filterTopic}
          aria-label={t.filterTopic}
          className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="language"
          defaultValue={query.language}
          placeholder={t.filterLang}
          aria-label={t.filterLang}
          className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 transition"
          >
            {t.searchBtn}
          </button>
          {hasFilters && (
            <Link
              href="/experts"
              className="inline-flex h-11 items-center rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              {t.clear}
            </Link>
          )}
        </div>
      </form>

      {/* Results */}
      {result.status === "error" ? (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-950">
          {t.error}
          <Link href={buildHref(query, {})} className="mt-2 block text-xs font-bold text-blue-800 hover:underline">
            {t.retry} →
          </Link>
        </div>
      ) : result.items.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">{t.empty}</p>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((e) => (
              <Link
                key={e.id}
                href={`/experts/${e.id}`}
                className="app-panel card-hover-lift group p-5 transition hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <strong className="text-sm font-bold text-slate-900 group-hover:text-blue-700">{e.displayName}</strong>
                <p className="mt-1 text-xs text-slate-500">
                  {e.organization.name} · {e.country}
                </p>
                {e.bio && (
                  <p className="mt-2 line-clamp-2 text-xs text-slate-600">{e.bio}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-1">
                  {e.expertises.slice(0, 5).map((x) => (
                    <span
                      key={x.id}
                      className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800"
                    >
                      {x.labels.vi ?? x.labels.en ?? x.slug}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {/* Next-cursor pagination */}
          {result.nextCursor && (
            <div className="mt-6 flex justify-center">
              <Link
                href={buildHref(query, { cursor: result.nextCursor })}
                className="inline-flex h-10 items-center rounded-xl border border-slate-300 px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t.next} →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
