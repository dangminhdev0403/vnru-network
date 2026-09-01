"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/core/i18n/locale";
import {
  formatNewsTitle,
  newsArticleHref,
  OFFICIAL_NEWS,
  type OfficialNewsArticle,
} from "../data/official-news";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { HOME_COPY } from "./GuestHomeV2";
import {
  DEFAULT_NEWS_ADVANCED_FILTERS,
  NEWS_CATEGORIES,
  type NewsAdvancedFilters,
  type NewsCategory,
} from "./GuestNewsFilterNav";

import { GuestPublicNav } from "./GuestPublicNav";

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

const DEFAULT_FALLBACK_IMAGES = [
  "/images/home-bilateral-gateway.jpg",
];

function NewsImage({
  className = "",
  src,
  label = "Ảnh",
  fallbackIndex = 0,
}: {
  className?: string;
  src?: string | null;
  label?: string;
  fallbackIndex?: number;
}) {
  const fallbackSrc =
    DEFAULT_FALLBACK_IMAGES[fallbackIndex % DEFAULT_FALLBACK_IMAGES.length];
  const finalSrc = src || fallbackSrc;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={finalSrc}
      alt={label}
      loading="lazy"
      className={`object-cover ${className}`}
    />
  );
}

function SmallRow({ item, index = 0 }: { item: NewsItem; index?: number }) {
  return (
    <Link
      href={newsArticleHref(item)}
      className="group flex flex-1 items-center gap-3.5 py-2 first:pt-0 last:pb-0"
    >
      <div className="relative h-[68px] w-[92px] shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-2xs sm:h-[74px] sm:w-[102px]">
        <NewsImage
          src={item.image ?? undefined}
          fallbackIndex={index + 1}
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

function matchesScope(article: OfficialNewsArticle, scope: string): boolean {
  if (!scope || scope === "all") return true;
  const content =
    `${article.title} ${article.summary} ${article.body.join(" ")}`.toLowerCase();

  if (scope === "vietnam") {
    return (
      content.includes("việt nam") ||
      content.includes("hà nội") ||
      content.includes("tp.hcm") ||
      content.includes("thành phố hồ chí minh") ||
      content.includes("đà nẵng") ||
      content.includes("bình dương") ||
      content.includes("quảng bình") ||
      content.includes("vast") ||
      content.includes("đhqg") ||
      content.includes("quốc hội")
    );
  }
  if (scope === "russia") {
    return (
      content.includes("nga") ||
      content.includes("liên bang nga") ||
      content.includes("moskva") ||
      content.includes("saint petersburg") ||
      content.includes("rosatom") ||
      content.includes("bauman") ||
      content.includes("herzen") ||
      content.includes("rostov") ||
      content.includes("stavropol") ||
      content.includes("fefu")
    );
  }
  if (scope === "bilateral") {
    return (
      content.includes("việt - nga") ||
      content.includes("nga - việt") ||
      content.includes("việt nam - liên bang nga") ||
      content.includes("việt nam và nga") ||
      content.includes("song phương") ||
      content.includes("quỹ truyền thống và hữu nghị") ||
      (content.includes("việt nam") && content.includes("nga"))
    );
  }
  return true;
}

function matchesContentType(
  article: OfficialNewsArticle,
  contentTypes: string[],
): boolean {
  if (contentTypes.length === 0) return true;
  return contentTypes.includes(article.contentType ?? "ARTICLE");
}

function matchesPeriod(article: OfficialNewsArticle, period: string): boolean {
  if (!period || period === "newest") return true;
  if (typeof article.id !== "number") return true;
  if (period === "7days") return article.id >= 25;
  if (period === "30days") return article.id >= 10;
  return true;
}

export function GuestExploreV2({
  initialArticles = OFFICIAL_NEWS,
  initialCategory = "all",
  initialQuery = "",
  initialAdvancedFilters = DEFAULT_NEWS_ADVANCED_FILTERS,
}: {
  initialArticles?: OfficialNewsArticle[];
  initialCategory?: NewsCategory;
  initialQuery?: string;
  initialAdvancedFilters?: NewsAdvancedFilters;
}) {
  const { locale } = useLocale();
  const t = TEXT[locale] ?? TEXT.vi;
  const activeCategory = initialCategory;
  const advancedFilters = initialAdvancedFilters;
  const query = initialQuery;
  const latest = initialArticles.slice(0, 4);
  const featured = initialArticles.slice(4, 8);
  const spotlight = featured;
  const availableCategories = NEWS_CATEGORIES.filter(
    (category) =>
      category === "all" ||
      initialArticles.some((article) => article.category === category),
  );
  const [streamCategory, setStreamCategory] = useState<NewsCategory>("all");
  const streamArticles =
    streamCategory === "all"
      ? initialArticles
      : initialArticles.filter(
          (article) => article.category === streamCategory,
        );
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const slidingTimerRef = useRef<number | null>(null);
  const [streamPage, setStreamPage] = useState(1);
  const streamPageCount = Math.ceil(streamArticles.length / 10);
  const paginatedStreamArticles = streamArticles.slice(
    (streamPage - 1) * 10,
    streamPage * 10,
  );

  const changeSpotlight = (nextIndex: number | ((curr: number) => number)) => {
    setIsSliding(true);
    setSpotlightIndex(nextIndex);
    if (slidingTimerRef.current) {
      window.clearTimeout(slidingTimerRef.current);
    }
    slidingTimerRef.current = window.setTimeout(() => {
      setIsSliding(false);
    }, 1200);
  };

  const filtered = useMemo(() => {
    let list =
      activeCategory === "all"
        ? initialArticles
        : initialArticles.filter((item) => item.category === activeCategory);

    const q = query.trim().toLocaleLowerCase(locale);
    if (q) {
      list = list.filter(
        (item) =>
          item.title.toLocaleLowerCase(locale).includes(q) ||
          item.summary.toLocaleLowerCase(locale).includes(q) ||
          item.body.some((p) => p.toLocaleLowerCase(locale).includes(q)),
      );
    }

    if (advancedFilters.scope !== "all") {
      list = list.filter((item) => matchesScope(item, advancedFilters.scope));
    }

    if (advancedFilters.contentTypes.length > 0) {
      list = list.filter((item) =>
        matchesContentType(item, advancedFilters.contentTypes),
      );
    }

    if (advancedFilters.period !== "newest") {
      list = list.filter((item) => matchesPeriod(item, advancedFilters.period));
    }

    return list;
  }, [activeCategory, advancedFilters, initialArticles, locale, query]);

  const categoryMode =
    activeCategory !== "all" ||
    query.trim().length > 0 ||
    advancedFilters.scope !== "all" ||
    advancedFilters.contentTypes.length > 0 ||
    advancedFilters.period !== "newest";
  const filteredHalf = Math.ceil(filtered.length / 2);

  useEffect(() => {
    const timer = window.setInterval(
      () => changeSpotlight((current) => (current + 1) % spotlight.length),
      SPOTLIGHT_INTERVAL_MS,
    );
    return () => {
      window.clearInterval(timer);
      if (slidingTimerRef.current) window.clearTimeout(slidingTimerRef.current);
    };
  }, [spotlight.length]);

  return (
    <div className="min-h-screen bg-[#edf3f9] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <GuestPublicNav active="news" />

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
                <div
                  className="absolute inset-0 flex transition-transform duration-[1500ms] ease-in-out motion-reduce:transition-none"
                  style={{ transform: `translateX(-${spotlightIndex * 100}%)` }}
                >
                  {spotlight.map((item, index) => (
                    <Link
                      key={item.title}
                      href={newsArticleHref(item)}
                      className="relative min-w-full"
                      aria-hidden={index !== spotlightIndex}
                      tabIndex={index === spotlightIndex ? 0 : -1}
                    >
                      <NewsImage
                        src={item.image ?? undefined}
                        label="Ảnh bài viết nổi bật"
                        fallbackIndex={index}
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
                  {latest.map((item, index) => (
                    <SmallRow key={item.title} item={item} index={index} />
                  ))}
                </div>
              </aside>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                FEATURED ARTICLES (4 CARDS)
                ════════════════════════════════════════════════════════════════ */}
            <section className="mt-12">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="shrink-0 font-serif text-xl font-bold text-[#082352] sm:text-2xl">
                  {t.featured}
                </h2>
                <span className="h-px flex-1 bg-blue-200/70" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {featured.map((item, index) => (
                  <Link
                    key={item.title}
                    href={newsArticleHref(item)}
                    className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-200/90 bg-white shadow-xs transition duration-150 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md"
                  >
                    <div>
                      <div className="overflow-hidden bg-slate-100">
                        <NewsImage
                          src={item.image ?? undefined}
                          label="Ảnh bài viết"
                          fallbackIndex={index}
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
                ))}
              </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                NEWS STREAM & CATEGORY DROPDOWN
                ════════════════════════════════════════════════════════════════ */}
            <section id="news-stream" className="mt-14 scroll-mt-24">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
                    onChange={(event) => {
                      setStreamCategory(event.target.value as NewsCategory);
                      setStreamPage(1);
                    }}
                    className="h-11 rounded-xl border border-blue-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs"
                  >
                    {availableCategories.map((category) => (
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
              </div>

              <div className="rounded-3xl border border-blue-200/90 bg-white p-6 shadow-xs sm:p-8">
                <div className="grid gap-x-12 gap-y-2 lg:grid-cols-2">
                  {paginatedStreamArticles.map((item) => (
                    <TextRow key={item.id} item={item} />
                  ))}
                </div>

                {streamPageCount > 1 ? (
                  <nav
                    aria-label="Phân trang tin tức"
                    className="mt-8 flex items-center justify-center gap-3 border-t border-slate-100 pt-6"
                  >
                    <button
                      type="button"
                      disabled={streamPage === 1}
                      onClick={() => setStreamPage((page) => page - 1)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ‹ Trang trước
                    </button>
                    <span className="text-sm font-semibold text-slate-600">
                      {streamPage} / {streamPageCount}
                    </span>
                    <button
                      type="button"
                      disabled={streamPage === streamPageCount}
                      onClick={() => setStreamPage((page) => page + 1)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Trang sau ›
                    </button>
                  </nav>
                ) : null}
              </div>
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
              <div className="grid gap-6 md:grid-cols-2">
                {filtered.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-blue-200/90 bg-white p-4 shadow-xs"
                  >
                    <SmallRow item={item} index={index} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-sm font-semibold text-slate-500">
                {t.noResults}
              </div>
            )}
          </section>
        )}
      </main>

      <GuestPublicFooter copy={HOME_COPY[locale]} />
    </div>
  );
}
