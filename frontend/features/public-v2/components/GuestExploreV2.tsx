"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/core/i18n/locale";
import { localizeReactNode } from "@/core/i18n/localize-react-node";
import { PUBLIC_STATIC_TRANSLATIONS } from "./public-static-translations";
import {
  formatNewsTitle,
  newsArticleHref,
  type OfficialNewsArticle,
} from "../data/official-news";
import {
  DEFAULT_NEWS_ADVANCED_FILTERS,
  NEWS_CATEGORIES,
  type NewsAdvancedFilters,
  type NewsCategory,
} from "./GuestNewsFilterNav";
import { Reveal } from "@/components/shared/Reveal";

type NewsItem = OfficialNewsArticle;

const TEXT = {
  vi: {
    brand: "Mạng lưới tri thức Nga - Việt",
    home: "Trang chủ",
    about: "Giới thiệu",
    explore: "Khám phá",
    login: "Đăng nhập",
    latest: "Tin mới nhất",
    featured: "Tin tức nổi bật",
    stream: "Tin tức",
    search: "Tìm kiếm tin tức...",
    searchSubmit: "Tìm kiếm",
    viewAll: "Xem tất cả",
    spotlight: "Tiêu điểm",
    allCategories: "Tất cả chuyên mục",
    newest: "Mới nhất",
    top: "Lên đầu",
    noResults: "Không tìm thấy bài viết phù hợp.",
    scrollMore: "Cuộn xuống để tải thêm",
    loadingMore: "Đang tải thêm tin...",
    showing: "Hiển thị",
    articles: "tin",
    categories: {
      all: "Tất cả",
      science: "Khoa học - Công nghệ",
      society: "Kinh tế - Xã hội",
      education: "Giáo dục đào tạo",
      cooperation: "Hợp tác",
    },
  },
  en: {
    brand: "Mạng lưới tri thức Nga - Việt",
    home: "Home",
    about: "About",
    explore: "Explore",
    login: "Sign in",
    latest: "Latest news",
    featured: "Featured news",
    stream: "News",
    search: "Search news...",
    searchSubmit: "Search",
    viewAll: "View all",
    spotlight: "Spotlight",
    allCategories: "All categories",
    newest: "Newest",
    top: "Top",
    noResults: "No matching articles found.",
    showing: "Showing",
    articles: "articles",
    categories: {
      all: "All",
      science: "Science - Technology",
      society: "Economy - Society",
      education: "Education and Training",
      cooperation: "Cooperation",
    },
  },
  ru: {
    brand: "Mạng lưới tri thức Nga - Việt",
    home: "Главная",
    about: "О сети",
    explore: "Обзор",
    login: "Войти",
    latest: "Последние новости",
    featured: "Главные материалы",
    stream: "Новости",
    search: "Поиск новостей...",
    searchSubmit: "Найти",
    viewAll: "Все материалы",
    spotlight: "Главное",
    allCategories: "Все категории",
    newest: "Сначала новые",
    top: "Наверх",
    noResults: "Подходящие материалы не найдены.",
    showing: "Показано",
    articles: "материалов",
    categories: {
      all: "Все",
      science: "Наука - Технологии",
      society: "Экономика - Общество",
      education: "Образование и подготовка",
      cooperation: "Сотрудничество",
    },
  },
} as const;

const SPOTLIGHT_INTERVAL_MS = 5_000;

function NewsImage({
  className = "",
  src,
  label = "Ảnh",
}: {
  className?: string;
  src?: string | null;
  label?: string;
}) {
  if (!src)
    return (
      <div
        role="img"
        aria-label={label}
        className={`grid place-items-center bg-slate-100 text-slate-400 ${className}`}
      >
        <span className="material-symbols-outlined text-3xl">image</span>
      </div>
    );
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={label}
      loading="lazy"
      className={`object-cover ${className}`}
    />
  );
}

function SmallRow({ item }: { item: NewsItem }) {
  return (
    <Link
      href={newsArticleHref(item)}
      className="group flex flex-1 items-center gap-3.5 py-2 first:pt-0 last:pb-0"
    >
      <div className="relative h-[68px] w-[92px] shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-2xs sm:h-[74px] sm:w-[102px]">
        <NewsImage
          src={item.image ?? undefined}
          className="size-full transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-serif text-sm font-bold leading-snug text-[#082352] transition-colors group-hover:text-blue-600 sm:text-[15px]">
          {formatNewsTitle(item.title)}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
          {item.summary}
        </p>
      </div>
    </Link>
  );
}

function TextRow({ item }: { item: NewsItem }) {
  return (
    <Link
      href={newsArticleHref(item)}
      className="group block border-b border-slate-200 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <h3 className="line-clamp-2 font-serif text-base font-bold leading-snug text-[#082352] transition group-hover:text-blue-600 sm:text-lg">
        {formatNewsTitle(item.title)}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">
        {item.summary}
      </p>
    </Link>
  );
}

export function GuestExploreV2({
  initialArticles = [],
  latestArticles = [],
  featuredArticles = [],
  streamArticles = [],
  streamTotal = 0,
  streamPage = 1,
  streamCategory = "all",
  filteredTotal = 0,
  filteredPage = 1,
  initialCategory = "all",
  initialQuery = "",
  initialAdvancedFilters = DEFAULT_NEWS_ADVANCED_FILTERS,
}: {
  initialArticles?: OfficialNewsArticle[];
  latestArticles?: OfficialNewsArticle[];
  featuredArticles?: OfficialNewsArticle[];
  streamArticles?: OfficialNewsArticle[];
  streamTotal?: number;
  streamPage?: number;
  streamCategory?: NewsCategory;
  filteredTotal?: number;
  filteredPage?: number;
  initialCategory?: NewsCategory;
  initialQuery?: string;
  initialAdvancedFilters?: NewsAdvancedFilters;
}) {
  const { locale } = useLocale();
  const router = useRouter();
  const t = TEXT[locale] ?? TEXT.vi;
  const activeCategory = initialCategory;
  const advancedFilters = initialAdvancedFilters;
  const query = initialQuery;
  const latest = latestArticles;
  const featured = featuredArticles;
  const spotlight = featuredArticles;
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const streamPageCount = Math.ceil(streamTotal / 10);
  const filteredPageCount = Math.ceil(filteredTotal / 10);

  const changeSpotlight = (nextIndex: number | ((curr: number) => number)) => {
    setSpotlightIndex(nextIndex);
  };

  const filtered = initialArticles;

  const categoryMode =
    activeCategory !== "all" ||
    query.trim().length > 0 ||
    advancedFilters.scope !== "all" ||
    advancedFilters.contentTypes.length > 0 ||
    advancedFilters.period !== "newest";
  const streamHref = (page: number, category = streamCategory) => {
    const params = new URLSearchParams();
    if (category !== "all") params.set("streamCategory", category);
    if (page > 1) params.set("streamPage", String(page));
    const search = params.toString();
    return `/news${search ? `?${search}` : ""}#news-stream`;
  };
  const filteredHref = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    return `/news?${params}`;
  };

  useEffect(() => {
    const timer = window.setInterval(
      () => changeSpotlight((current) => (current + 1) % spotlight.length),
      SPOTLIGHT_INTERVAL_MS,
    );
    return () => {
      window.clearInterval(timer);
    };
  }, [spotlight.length, spotlightIndex]);

  return localizeReactNode(
    <div className="min-h-screen bg-[#edf3f9] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <main className="mx-auto max-w-[1460px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {!categoryMode ? (
          <>
            {/* ════════════════════════════════════════════════════════════════
                TOP HERO SECTION: SPOTLIGHT (LEFT) + LATEST (RIGHT)
                ════════════════════════════════════════════════════════════════ */}
            <section className="grid gap-6 lg:grid-cols-[1.35fr_.92fr]">
              {/* SPOTLIGHT CAROUSEL CARD */}
              <article
                className="relative h-[380px] overflow-hidden rounded-3xl border border-blue-200/90 bg-slate-950 text-white shadow-sm sm:h-[440px] lg:h-[490px]"
                aria-roledescription="carousel"
                aria-label={t.spotlight}
              >
                <div className="absolute inset-0">
                  {spotlight.map((item, index) => (
                    <Link
                      key={item.title}
                      href={newsArticleHref(item)}
                      className={`absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none ${
                        index === spotlightIndex
                          ? "z-10 opacity-100"
                          : "pointer-events-none opacity-0"
                      }`}
                      aria-hidden={index !== spotlightIndex}
                      tabIndex={index === spotlightIndex ? 0 : -1}
                    >
                      <NewsImage
                        src={item.image ?? undefined}
                        label="Ảnh bài viết nổi bật"
                        className="absolute inset-0 h-full w-full rounded-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-12 sm:p-8 sm:pb-14">
                        <div className="text-xs font-bold text-blue-300 mb-2">
                          {t.categories[item.category] ?? item.category}
                        </div>
                        <h2 className="max-w-4xl font-serif text-xl font-bold leading-snug text-white transition hover:text-blue-200 sm:text-2xl lg:text-3xl">
                          {formatNewsTitle(item.title)}
                        </h2>
                        <p className="mt-2.5 line-clamp-2 max-w-3xl text-xs leading-relaxed text-slate-200 sm:text-sm sm:leading-normal">
                          {item.summary}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* CAROUSEL INDICATOR DOTS */}
                <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 rounded-full bg-slate-950/50 px-2.5 py-1 backdrop-blur-xs">
                  {spotlight.map((item, index) => {
                    const isActive = index === spotlightIndex;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => changeSpotlight(index)}
                        aria-label={`${index + 1} / ${spotlight.length}`}
                        aria-current={isActive ? "true" : undefined}
                        className="group grid h-5 w-5 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-white"
                      >
                        <span
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isActive
                              ? "w-5 bg-white"
                              : "w-1.5 bg-white/40 group-hover:bg-white/75"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </article>

              {/* LATEST COLUMN */}
              <aside className="flex h-[380px] flex-col justify-between rounded-3xl border border-blue-200/90 bg-white p-5 shadow-xs sm:h-[440px] sm:p-6 lg:h-[490px]">
                <div className="mb-1">
                  <h2 className="font-serif text-lg font-bold text-[#082352] sm:text-xl">
                    {t.latest}
                  </h2>
                </div>
                <div className="flex flex-1 flex-col justify-between divide-y divide-slate-100 py-1">
                  {latest.map((item) => (
                    <SmallRow key={item.title} item={item} />
                  ))}
                </div>
              </aside>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                FEATURED ARTICLES (4 CARDS)
                ════════════════════════════════════════════════════════════════ */}
            <section className="mt-12">
              <Reveal y={10} className="mb-5 flex items-center gap-4">
                <h2 className="shrink-0 font-serif text-xl font-bold text-[#082352] sm:text-2xl">
                  {t.featured}
                </h2>
                <span className="h-px flex-1 bg-blue-200/70" />
              </Reveal>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featured.map((item, index) => (
                  <Reveal key={item.title} y={12} delay={index * 0.05}>
                    <Link
                      href={newsArticleHref(item)}
                      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-200/90 bg-white shadow-xs transition duration-150 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md"
                    >
                      <div>
                        <div className="overflow-hidden bg-slate-100">
                          <NewsImage
                            src={item.image ?? undefined}
                            label="Ảnh bài viết"
                            className="h-44 w-full"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="line-clamp-2 font-serif text-base font-bold leading-snug text-[#082352] transition group-hover:text-blue-600">
                            {formatNewsTitle(item.title)}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                            {item.summary}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                NEWS STREAM & CATEGORY DROPDOWN
                ════════════════════════════════════════════════════════════════ */}
            <section id="news-stream" className="mt-14 scroll-mt-24">
              <Reveal
                y={10}
                className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#082352] sm:text-3xl">
                    {t.stream}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor="news-stream-category">
                    {t.allCategories}
                  </label>
                  <select
                    id="news-stream-category"
                    value={streamCategory}
                    onChange={(event) =>
                      router.push(
                        streamHref(1, event.target.value as NewsCategory),
                      )
                    }
                    className="h-11 rounded-xl border border-blue-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs"
                  >
                    {NEWS_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {t.categories[category]}
                      </option>
                    ))}
                  </select>
                  <span className="inline-flex h-11 items-center rounded-xl bg-white border border-blue-200 px-4 text-sm font-bold text-slate-700 shadow-2xs">
                    {t.newest}
                  </span>
                  <a
                    href="#news-stream"
                    className="inline-flex h-11 items-center rounded-xl bg-white border border-blue-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
                  >
                    ↑ {t.top}
                  </a>
                </div>
              </Reveal>

              <Reveal
                y={12}
                className="rounded-3xl border border-blue-200/90 bg-white p-6 shadow-xs sm:p-8"
              >
                <div className="grid gap-x-12 gap-y-2 lg:grid-cols-2">
                  {streamArticles.map((item) => (
                    <TextRow key={item.id} item={item} />
                  ))}
                </div>

                {streamPageCount > 1 ? (
                  <nav
                    aria-label="Phân trang tin tức"
                    className="mt-8 flex items-center justify-center gap-3 border-t border-slate-100 pt-6"
                  >
                    <Link
                      aria-disabled={streamPage === 1}
                      href={
                        streamPage === 1
                          ? "#news-stream"
                          : streamHref(streamPage - 1)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-40"
                    >
                      ‹ Trang trước
                    </Link>
                    <span className="text-sm font-semibold text-slate-600">
                      {streamPage} / {streamPageCount}
                    </span>
                    <Link
                      aria-disabled={streamPage === streamPageCount}
                      href={
                        streamPage === streamPageCount
                          ? "#news-stream"
                          : streamHref(streamPage + 1)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-40"
                    >
                      Trang sau ›
                    </Link>
                  </nav>
                ) : null}
              </Reveal>
            </section>
          </>
        ) : (
          <section className="mt-8">
            <div className="mb-5 flex items-center gap-4">
              <h2 className="shrink-0 font-serif text-xl font-bold text-[#082352] sm:text-2xl">
                {t.latest}
              </h2>
              <span className="h-px flex-1 bg-blue-200/70" />
            </div>
            {filtered.length ? (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {filtered.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-blue-200/90 bg-white p-4 shadow-xs"
                    >
                      <SmallRow item={item} />
                    </div>
                  ))}
                </div>
                {filteredPageCount > 1 ? (
                  <nav
                    aria-label="Phân trang kết quả"
                    className="mt-8 flex items-center justify-center gap-3"
                  >
                    <Link
                      aria-disabled={filteredPage === 1}
                      href={
                        filteredPage === 1
                          ? "#"
                          : filteredHref(filteredPage - 1)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold aria-disabled:pointer-events-none aria-disabled:opacity-40"
                    >
                      ‹ Trang trước
                    </Link>
                    <span className="text-sm font-semibold text-slate-600">
                      {filteredPage} / {filteredPageCount}
                    </span>
                    <Link
                      aria-disabled={filteredPage === filteredPageCount}
                      href={
                        filteredPage === filteredPageCount
                          ? "#"
                          : filteredHref(filteredPage + 1)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold aria-disabled:pointer-events-none aria-disabled:opacity-40"
                    >
                      Trang sau ›
                    </Link>
                  </nav>
                ) : null}
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-sm font-semibold text-slate-500">
                {t.noResults}
              </div>
            )}
          </section>
        )}
      </main>
    </div>,
    locale,
    PUBLIC_STATIC_TRANSLATIONS,
  );
}
