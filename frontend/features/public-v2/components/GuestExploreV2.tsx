"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/core/i18n/locale";
import { OFFICIAL_NEWS, type OfficialNewsArticle } from "../data/official-news";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { HOME_COPY } from "./GuestHomeV2";
import {
  getNewsFilterTopics,
  GuestNewsAdvancedFilters,
} from "./GuestNewsAdvancedFilters";
import {
  DEFAULT_NEWS_ADVANCED_FILTERS,
  GuestNewsFilterNav,
  newsFilterHref,
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
    stream: "Dòng tin liên tục",
    streamLead: "Cập nhật liên tục những tin tức mới nhất từ các chuyên mục",
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
    stream: "Continuous news",
    streamLead: "Continuously updated news from the network's key categories",
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
    stream: "Лента новостей",
    streamLead: "Постоянно обновляемые новости по основным направлениям сети",
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

const LATEST = OFFICIAL_NEWS.slice(0, 5);
const FEATURED = OFFICIAL_NEWS.slice(5, 9);
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
      href={`/news/${articleId(item)}`}
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

function articleId(item: NewsItem) {
  return item.id;
}

function matchesTopics(
  article: OfficialNewsArticle,
  topics: string[],
): boolean {
  if (topics.length === 0) return true;
  const content =
    `${article.title} ${article.summary} ${article.body.join(" ")}`.toLowerCase();

  return topics.some((topic) => {
    const t = topic.toLowerCase();
    if (t.includes("trí tuệ nhân tạo") || t === "ai") {
      return (
        content.includes("ai") ||
        content.includes("trí tuệ nhân tạo") ||
        content.includes("robot") ||
        content.includes("học máy")
      );
    }
    if (t.includes("lượng tử")) {
      return content.includes("lượng tử") || content.includes("quantum");
    }
    if (t.includes("vật liệu")) {
      return (
        content.includes("vật liệu") ||
        content.includes("nano") ||
        content.includes("skif")
      );
    }
    if (t.includes("năng lượng")) {
      return (
        content.includes("năng lượng") ||
        content.includes("hạt nhân") ||
        content.includes("vver") ||
        content.includes("nguyên tử") ||
        content.includes("rosatom")
      );
    }
    if (t.includes("sinh học")) {
      return (
        content.includes("sinh học") ||
        content.includes("y sinh") ||
        content.includes("y khoa") ||
        content.includes("y tế")
      );
    }
    if (t.includes("vũ trụ") || t.includes("hàng không")) {
      return (
        content.includes("vũ trụ") ||
        content.includes("hàng không") ||
        content.includes("uav") ||
        content.includes("bắc cực")
      );
    }
    if (t.includes("học bổng") || t.includes("tuyển sinh")) {
      return (
        content.includes("học bổng") ||
        content.includes("tuyển sinh") ||
        content.includes("chỉ tiêu")
      );
    }
    if (t.includes("du học") || t.includes("sinh viên")) {
      return (
        content.includes("sinh viên") ||
        content.includes("du học") ||
        content.includes("lưu học sinh") ||
        content.includes("thanh niên")
      );
    }
    if (t.includes("nghiên cứu sinh") || t.includes("tiến sĩ")) {
      return (
        content.includes("nghiên cứu sinh") ||
        content.includes("tiến sĩ") ||
        content.includes("thạc sĩ")
      );
    }
    if (
      t.includes("trao đổi") ||
      t.includes("học thuật") ||
      t.includes("studturizm")
    ) {
      return (
        content.includes("trao đổi") ||
        content.includes("studturizm") ||
        content.includes("tọa đàm") ||
        content.includes("diễn đàn") ||
        content.includes("hội thảo")
      );
    }
    if (
      t.includes("thương mại") ||
      t.includes("logistics") ||
      t.includes("đầu tư")
    ) {
      return (
        content.includes("thương mại") ||
        content.includes("đầu tư") ||
        content.includes("logistics") ||
        content.includes("xuất khẩu") ||
        content.includes("kim ngạch") ||
        content.includes("eaeu")
      );
    }
    if (
      t.includes("kinh tế") ||
      t.includes("công nghiệp") ||
      t.includes("doanh nghiệp")
    ) {
      return (
        content.includes("kinh tế") ||
        content.includes("doanh nghiệp") ||
        content.includes("công nghiệp")
      );
    }
    if (t.includes("chính sách") || t.includes("hiệp định")) {
      return (
        content.includes("chính sách") ||
        content.includes("hiệp định") ||
        content.includes("nghị quyết") ||
        content.includes("phê duyệt")
      );
    }
    if (
      t.includes("việt - nga") ||
      t.includes("đối tác") ||
      t.includes("song phương")
    ) {
      return (
        content.includes("việt - nga") ||
        content.includes("nga - việt") ||
        content.includes("song phương") ||
        content.includes("đối tác") ||
        (content.includes("việt nam") && content.includes("nga"))
      );
    }
    if (t.includes("viện nghiên cứu") || t.includes("trường đại học")) {
      return (
        content.includes("viện") ||
        content.includes("đại học") ||
        content.includes("trường") ||
        content.includes("học viện")
      );
    }
    if (t.includes("du lịch") || t.includes("mice")) {
      return (
        content.includes("du lịch") ||
        content.includes("mice") ||
        content.includes("lữ hành") ||
        content.includes("khách du lịch")
      );
    }
    if (t.includes("văn hóa")) {
      return (
        content.includes("văn hóa") ||
        content.includes("hữu nghị") ||
        content.includes("tiếng nga") ||
        content.includes("tiếng việt")
      );
    }
    return content.includes(t);
  });
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
  const content =
    `${article.title} ${article.summary} ${article.body.join(" ")}`.toLowerCase();

  return contentTypes.some((type) => {
    if (type === "news") {
      return true;
    }
    if (type === "research") {
      return (
        content.includes("nghiên cứu") ||
        content.includes("khoa học") ||
        content.includes("công nghệ") ||
        content.includes("lượng tử") ||
        content.includes("skif") ||
        content.includes("uav") ||
        content.includes("luận án") ||
        content.includes("ai") ||
        content.includes("r&d") ||
        content.includes("bắc cực")
      );
    }
    if (type === "event") {
      return (
        content.includes("sự kiện") ||
        content.includes("diễn đàn") ||
        content.includes("hội thảo") ||
        content.includes("tọa đàm") ||
        content.includes("ngày hội") ||
        content.includes("studturizm") ||
        content.includes("meet global mice") ||
        content.includes("lễ kỷ niệm") ||
        content.includes("khóa học") ||
        content.includes("gặp gỡ")
      );
    }
    if (type === "policy") {
      return (
        content.includes("chính sách") ||
        content.includes("nghị quyết") ||
        content.includes("phê duyệt") ||
        content.includes("chính phủ") ||
        content.includes("quốc hội") ||
        content.includes("chỉ đạo") ||
        content.includes("ủy ban liên chính phủ") ||
        content.includes("chiến lược") ||
        content.includes("thỏa thuận") ||
        content.includes("hiệp định")
      );
    }
    return true;
  });
}

function matchesPeriod(article: OfficialNewsArticle, period: string): boolean {
  if (!period || period === "newest") return true;
  if (period === "7days") {
    return article.id >= 25;
  }
  if (period === "30days") {
    return article.id >= 10;
  }
  return true;
}

export function GuestExploreV2({
  initialCategory = "all",
  initialQuery = "",
  initialAdvancedFilters = DEFAULT_NEWS_ADVANCED_FILTERS,
}: {
  initialCategory?: NewsCategory;
  initialQuery?: string;
  initialAdvancedFilters?: NewsAdvancedFilters;
}) {
  const { locale } = useLocale();
  const t = TEXT[locale] ?? TEXT.vi;
  const [activeCategory, setActiveCategory] =
    useState<NewsCategory>(initialCategory);
  const [advancedFilters, setAdvancedFilters] = useState<NewsAdvancedFilters>(
    () => ({
      ...initialAdvancedFilters,
      topics: [...initialAdvancedFilters.topics],
      contentTypes: [...initialAdvancedFilters.contentTypes],
    }),
  );
  const [query, setQuery] = useState(initialQuery);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const slidingTimerRef = useRef<number | null>(null);
  const selectCategory = (category: NewsCategory) => {
    setActiveCategory(category);
    window.history.replaceState(
      null,
      "",
      newsFilterHref(category, query, advancedFilters),
    );
  };
  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    window.history.replaceState(
      null,
      "",
      newsFilterHref(activeCategory, nextQuery, advancedFilters),
    );
  };

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

  const availableTopics = getNewsFilterTopics(activeCategory);

  const filtered = useMemo(() => {
    let list =
      activeCategory === "all"
        ? OFFICIAL_NEWS
        : OFFICIAL_NEWS.filter((item) => item.category === activeCategory);

    const q = query.trim().toLocaleLowerCase(locale);
    if (q) {
      list = list.filter(
        (item) =>
          item.title.toLocaleLowerCase(locale).includes(q) ||
          item.summary.toLocaleLowerCase(locale).includes(q) ||
          item.body.some((p) => p.toLocaleLowerCase(locale).includes(q)),
      );
    }

    if (advancedFilters.topics.length > 0) {
      list = list.filter((item) => matchesTopics(item, advancedFilters.topics));
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
  }, [activeCategory, advancedFilters, locale, query]);

  const categoryMode =
    activeCategory !== "all" ||
    query.trim().length > 0 ||
    advancedFilters.topics.length > 0 ||
    advancedFilters.scope !== "all" ||
    advancedFilters.contentTypes.length > 0 ||
    advancedFilters.period !== "newest";
  const filteredHalf = Math.ceil(filtered.length / 2);

  useEffect(() => {
    const timer = window.setInterval(
      () => changeSpotlight((current) => (current + 1) % LATEST.length),
      SPOTLIGHT_INTERVAL_MS,
    );
    return () => {
      window.clearInterval(timer);
      if (slidingTimerRef.current) window.clearTimeout(slidingTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <GuestPublicNav active="news" />

      <main className="mx-auto max-w-[1460px] px-4 py-9 sm:px-6 lg:px-8">
        <GuestNewsMasthead />

        <GuestNewsFilterNav
          activeCategory={activeCategory}
          categoryLabels={t.categories}
          clearSearchLabel="Xóa tìm kiếm"
          query={query}
          searchPlaceholder={t.search}
          searchSubmitLabel={t.searchSubmit}
          onCategoryChange={selectCategory}
          onQueryChange={updateQuery}
          filterControl={
            <GuestNewsAdvancedFilters
              availableTopics={availableTopics}
              filters={advancedFilters}
              onApply={(filters) =>
                window.history.replaceState(
                  null,
                  "",
                  newsFilterHref(activeCategory, query, filters),
                )
              }
              onFiltersChange={setAdvancedFilters}
              triggerLabel={t.allCategories}
            />
          }
        />

        {!categoryMode ? (
          <>
            <section className="grid gap-8 lg:grid-cols-[1.35fr_.92fr]">
              <article
                className="relative min-h-[520px] overflow-hidden rounded-2xl bg-slate-950 text-white"
                aria-roledescription="carousel"
                aria-label={t.spotlight}
              >
                <div
                  className="absolute inset-0 flex transition-transform duration-[1500ms] ease-in-out motion-reduce:transition-none"
                  style={{ transform: `translateX(-${spotlightIndex * 100}%)` }}
                >
                  {LATEST.map((item, index) => (
                    <Link
                      key={item.title}
                      href={`/news/${articleId(item)}`}
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
                        <span className="inline-flex min-h-8 items-center rounded-lg bg-blue-600 px-3 text-xs font-black uppercase">
                          {t.spotlight}
                        </span>
                        <h2 className="mt-4 max-w-4xl text-3xl font-black leading-[1.15] tracking-[-0.04em] sm:text-4xl">
                          {item.title}
                        </h2>
                        <p className="mt-4 max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
                          {item.summary}
                        </p>
                        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/85">
                          <span>{t.categories[item.category]}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5">
                  {LATEST.map((item, index) => {
                    const isActive = index === spotlightIndex;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => changeSpotlight(index)}
                        aria-label={`${index + 1} / ${LATEST.length}`}
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
                {LATEST.map((item) => (
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
                {FEATURED.map((item) => (
                  <Link
                    key={item.title}
                    href={`/news/${articleId(item)}`}
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
