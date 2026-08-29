import type { ReactNode } from "react";

export type NewsCategory =
  | "all"
  | "science"
  | "cooperation"
  | "education"
  | "society";

export const NEWS_CATEGORIES: readonly NewsCategory[] = [
  "all",
  "science",
  "society",
  "education",
  "cooperation",
];

export const NEWS_FILTER_SCOPES = [
  "all",
  "vietnam",
  "russia",
  "bilateral",
] as const;
export const NEWS_FILTER_CONTENT_TYPES = [
  "ARTICLE",
  "EVENT",
  "ANNOUNCEMENT",
  "PROJECT",
  "OPPORTUNITY",
  "PUBLICATION",
] as const;
export const NEWS_FILTER_PERIODS = ["newest", "7days", "30days"] as const;

export type NewsAdvancedFilters = {
  scope: (typeof NEWS_FILTER_SCOPES)[number];
  contentTypes: Array<(typeof NEWS_FILTER_CONTENT_TYPES)[number]>;
  period: (typeof NEWS_FILTER_PERIODS)[number];
};

export const DEFAULT_NEWS_ADVANCED_FILTERS: NewsAdvancedFilters = {
  scope: "all",
  contentTypes: [],
  period: "newest",
};

export function newsFilterHref(
  category: NewsCategory,
  query = "",
  filters: NewsAdvancedFilters = DEFAULT_NEWS_ADVANCED_FILTERS,
) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (query.trim()) params.set("q", query.trim().slice(0, 200));

  if (filters.scope !== "all") params.set("scope", filters.scope);
  filters.contentTypes.forEach((type) => params.append("type", type));
  if (filters.period !== "newest") params.set("period", filters.period);
  const search = params.toString();
  return `/news${search ? `?${search}` : ""}`;
}

type GuestNewsFilterNavProps = {
  activeCategory: NewsCategory;
  categoryLabels: Readonly<Record<NewsCategory, string>>;
  clearSearchLabel: string;
  filterControl: ReactNode;
  onCategoryChange: (category: NewsCategory) => void;
  onQueryChange: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  query: string;
  searchPlaceholder: string;
  searchSubmitLabel: string;
};

export function GuestNewsFilterNav({
  activeCategory,
  categoryLabels,
  clearSearchLabel,
  filterControl,
  onCategoryChange,
  onQueryChange,
  onSearchSubmit,
  query,
  searchPlaceholder,
  searchSubmitLabel,
}: GuestNewsFilterNavProps) {
  return (
    <section
      id="news-filters"
      aria-label={searchPlaceholder}
      className="relative z-30 mb-8 overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm has-[details[open]]:rounded-b-none"
    >
      <div className="grid w-full grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 sm:grid-cols-3 xl:grid-cols-5">
        {NEWS_CATEGORIES.map((category, index) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            aria-pressed={activeCategory === category}
            className={`flex min-h-11 w-full items-center justify-center px-3 text-center text-sm font-bold transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 ${
              index === 0 ? "rounded-tl-2xl" : ""
            } ${index === NEWS_CATEGORIES.length - 1 ? "rounded-tr-2xl" : ""} ${
              activeCategory === category
                ? "bg-blue-600 font-black text-white"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-blue-600"
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      <form
        className="flex w-full items-center gap-2 p-2.5 sm:p-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSearchSubmit?.(query);
        }}
      >
        {filterControl}

        <label className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50/80 px-4 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]">
          <input
            name="q"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            type="search"
            maxLength={200}
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="mr-2 grid size-11 place-items-center text-sm font-bold text-slate-400 hover:text-slate-600"
              aria-label={clearSearchLabel}
            >
              ×
            </button>
          ) : null}
        </label>
        <button
          type="submit"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-4 text-base font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {searchSubmitLabel}
        </button>
      </form>
    </section>
  );
}
