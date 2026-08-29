"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/core/i18n/locale";
import { newsArticleHref, OFFICIAL_NEWS, type OfficialNewsArticle } from "../data/official-news";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { HOME_COPY } from "./GuestHomeV2";
import {
  DEFAULT_NEWS_ADVANCED_FILTERS,
  NEWS_CATEGORIES,
  type NewsAdvancedFilters,
  type NewsCategory,
} from "./GuestNewsFilterNav";
import { GuestNewsMasthead } from "./GuestNewsMasthead";
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
    scrollMore: "Scroll to load more",
    loadingMore: "Loading more news...",
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
    scrollMore: "Прокрутите, чтобы загрузить ещё",
    loadingMore: "Загружаем ещё...",
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
  src?: string;
  label?: string;
}) {
  if (src) {
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
  return (
    <div
      role="img"
      aria-label="Đang tải ảnh"
      className={`animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 motion-reduce:animate-none ${className}`}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

function SmallRow({ item }: { item: NewsItem }) {
  return (
    <Link
      href={newsArticleHref(item)}
      className="grid grid-cols-[128px_minmax(0,1fr)] gap-4 border-b border-slate-100 py-5 first:pt-0 sm:grid-cols-[180px_minmax(0,1fr)]"
    >
      <NewsImage
        src={item.image ?? undefined}
        className="h-[88px] w-full rounded-xl sm:h-[112px]"
      />
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-base font-extrabold leading-[1.4] transition-colors hover:text-blue-700 sm:text-lg">
          {item.title}
        </h3>
        <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-slate-600 sm:text-base">
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
      className="block border-b border-slate-200 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <h3 className="line-clamp-2 text-lg font-bold leading-7 text-slate-900 hover:text-blue-700 sm:text-xl">
        {item.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-base leading-6 text-slate-500">
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
  const [streamPage, setStreamPage] = useState(1);
  const streamArticles =
    streamCategory === "all"
      ? initialArticles
      : initialArticles.filter((article) => article.category === streamCategory);
  const streamPageCount = Math.max(1, Math.ceil(streamArticles.length / 10));
  const paginatedStreamArticles = streamArticles.slice(
    (streamPage - 1) * 10,
    streamPage * 10,
  );
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const slidingTimerRef = useRef<number | null>(null);

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
    <div className="min-h-screen bg-white text-slate-950">
      <GuestPublicNav active="news" />

      <main className="mx-auto max-w-[1460px] px-4 py-9 sm:px-6 lg:px-8">
        <GuestNewsMasthead />


        {!categoryMode ? (
          <>
            <section className="grid gap-8 lg:grid-cols-[1.35fr_.92fr]">
              <article
                className="relative min-h-[360px] overflow-hidden rounded-2xl bg-slate-950 text-white lg:min-h-0"
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
                        className="absolute inset-0 h-full w-full rounded-none"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,18,45,.02)_12%,rgba(3,18,45,.18)_48%,rgba(2,14,35,.94)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                        <span className="mb-3 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                          {t.spotlight}
                        </span>
                        <h2 className="max-w-4xl text-3xl font-black leading-[1.15] tracking-[-0.04em] sm:text-4xl">
                          {item.title}
                        </h2>
                        <p className="mt-4 line-clamp-2 max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
                          {item.summary}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5">
                  {spotlight.map((item, index) => {
                    const isActive = index === spotlightIndex;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => changeSpotlight(index)}
                        aria-label={`${index + 1} / ${spotlight.length}`}
                        aria-current={isActive ? "true" : undefined}
                        className="group grid h-7 w-7 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <span
                          className={`h-2 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none ${
                            isActive
                              ? isSliding
                                ? "w-7 bg-white"
                                : "w-2 bg-white ring-2 ring-white/60"
                              : "w-2 bg-white/40 group-hover:bg-white/75"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </article>
              <aside>
                <div className="mb-4">
                  <h2 className="text-lg font-black uppercase text-blue-600 sm:text-xl">
                    {t.latest}
                  </h2>
                </div>
                {latest.map((item) => (
                  <SmallRow key={item.title} item={item} />
                ))}
              </aside>
            </section>

            <section className="mt-12">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="shrink-0 text-lg font-black uppercase text-blue-600 sm:text-xl">
                  {t.featured}
                </h2>
                <span className="h-px flex-1 bg-blue-100" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {featured.map((item) => (
                  <Link
                    key={item.title}
                    href={newsArticleHref(item)}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-200"
                  >
                    <NewsImage
                      src={item.image ?? undefined}
                      label="Ảnh bài viết"
                      className="h-44 w-full"
                    />
                    <div className="p-4">
                      <h3 className="line-clamp-2 text-base font-extrabold leading-[1.45]">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-slate-600 sm:text-base">
                        {item.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section id="news-stream" className="mt-14 scroll-mt-24">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-black uppercase text-blue-600 sm:text-2xl">
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
                    className="h-11 rounded-xl border border-blue-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {t.categories[category]}
                      </option>
                    ))}
                  </select>
                  <span className="inline-flex h-11 items-center rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-700">
                    {t.newest}
                  </span>
                  <a
                    href="#news-stream"
                    className="inline-flex h-11 items-center rounded-xl bg-slate-100 px-4 text-sm font-bold text-slate-700 hover:bg-slate-200"
                  >
                    ↑ {t.top}
                  </a>
                </div>
              </div>
              <div className="grid gap-x-10 lg:grid-cols-2">
                {paginatedStreamArticles.map((item) => (
                  <TextRow key={item.id} item={item} />
                ))}
              </div>
              {streamPageCount > 1 ? (
                <nav
                  aria-label="Phân trang tin tức"
                  className="mt-8 flex items-center justify-center gap-3"
                >
                  <button
                    type="button"
                    disabled={streamPage === 1}
                    onClick={() => setStreamPage((page) => page - 1)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-base font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ‹
                  </button>
                  <span className="text-base font-semibold text-slate-600">
                    {streamPage} / {streamPageCount}
                  </span>
                  <button
                    type="button"
                    disabled={streamPage === streamPageCount}
                    onClick={() => setStreamPage((page) => page + 1)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-base font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ›
                  </button>
                </nav>
              ) : null}
            </section>
          </>
        ) : (
          <section className="mt-8">
            <div className="mb-5 flex items-center gap-4">
              <h2 className="shrink-0 text-lg font-black uppercase text-blue-600 sm:text-xl">
                {t.latest}
              </h2>
              <span className="h-px flex-1 bg-blue-100" />
            </div>
            {filtered.length ? (
              <div className="grid gap-x-10 lg:grid-cols-2">
                <div>
                  {filtered.slice(0, filteredHalf).map((item) => (
                    <SmallRow key={item.title} item={item} />
                  ))}
                </div>
                <div>
                  {filtered.slice(filteredHalf).map((item) => (
                    <SmallRow key={item.title} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm font-semibold text-slate-500">
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
