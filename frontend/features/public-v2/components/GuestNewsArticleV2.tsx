"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/core/i18n/locale";
import {
  OFFICIAL_NEWS,
  getOfficialNewsArticle,
  type NewsCategoryKey,
  type OfficialNewsArticle,
} from "../data/official-news";
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

type Category = NewsCategoryKey;

const categoryLabels: Record<Category, string> = {
  science: "Khoa học - Công nghệ",
  society: "Kinh tế - Xã hội",
  education: "Giáo dục đào tạo",
  cooperation: "Hợp tác",
};

const filterCopy = {
  vi: {
    search: "Tìm kiếm tin tức...",
    searchSubmit: "Tìm kiếm",
    clear: "Xóa tìm kiếm",
    open: "Mở bộ lọc tin tức",
    categories: { all: "Tất cả", ...categoryLabels },
  },
  en: {
    search: "Search news...",
    searchSubmit: "Search",
    clear: "Clear search",
    open: "Open news filters",
    categories: {
      all: "All",
      science: "Science - Technology",
      society: "Economy - Society",
      education: "Education and Training",
      cooperation: "Cooperation",
    },
  },
  ru: {
    search: "Поиск новостей...",
    searchSubmit: "Найти",
    clear: "Очистить поиск",
    open: "Открыть фильтры новостей",
    categories: {
      all: "Все",
      science: "Наука - Технологии",
      society: "Экономика - Общество",
      education: "Образование и подготовка",
      cooperation: "Сотрудничество",
    },
  },
} as const;

const ui = {
  vi: {
    home: "Trang chủ",
    about: "Giới thiệu",
    login: "Đăng nhập",
    news: "Tin tức",
    related: "Tin liên quan",
    popular: "Tin đọc nhiều",
    share: "Chia sẻ",
    tags: "Từ khóa",
  },
  en: {
    home: "Home",
    about: "About",
    login: "Sign in",
    news: "News",
    related: "Related news",
    popular: "Most read",
    share: "Share",
    tags: "Tags",
  },
  ru: {
    home: "Главная",
    about: "О сети",
    login: "Войти",
    news: "Новости",
    related: "Похожие материалы",
    popular: "Популярное",
    share: "Поделиться",
    tags: "Теги",
  },
} as const;

function ArticleVisual({ category }: { category: Category }) {
  const initials: Record<Category, string> = {
    science: "KHOA HỌC · CÔNG NGHỆ",
    society: "KINH TẾ · XÃ HỘI",
    education: "GIÁO DỤC ĐÀO TẠO",
    cooperation: "HỢP TÁC",
  };

  return (
    <div className="relative grid min-h-[360px] place-items-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_35%,#2874d8_0%,#0b4a9d_35%,#062b65_75%,#041d47_100%)] text-white sm:min-h-[440px]">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute left-[8%] top-[18%] h-28 w-44 rounded-lg bg-red-600/75 shadow-2xl">
        <span className="grid h-full place-items-center text-4xl">★</span>
      </div>
      <div className="absolute right-[8%] top-[18%] h-28 w-44 overflow-hidden rounded-lg shadow-2xl">
        <div className="h-1/3 bg-white" />
        <div className="h-1/3 bg-blue-600" />
        <div className="h-1/3 bg-red-600" />
      </div>
      <div className="absolute left-1/2 top-[42%] size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/50 shadow-[0_0_70px_rgba(56,189,248,.38)]" />
      <div className="absolute left-1/2 top-[42%] h-36 w-52 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[50%] border border-cyan-100/60" />
      <div className="absolute left-1/2 top-[42%] h-36 w-52 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-cyan-100/60" />
      <div className="relative z-10 mt-40 rounded-full border border-white/20 bg-slate-950/35 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] backdrop-blur-sm">
        {initials[category]}
      </div>
    </div>
  );
}

function Thumb({ item }: { item: OfficialNewsArticle }) {
  if (item.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.image}
        alt=""
        className="h-20 w-28 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#0d4da1,#3f80cf_55%,#133f7d)]">
      <div className="absolute -right-6 -top-6 size-16 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-4 size-20 rounded-full bg-white/10" />
      <span className="absolute inset-0 grid place-items-center text-sm font-black uppercase text-white/80">
        {categoryLabels[item.category].split(" ")[0]}
      </span>
    </div>
  );
}

function ShareButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="grid size-9 place-items-center rounded-full border border-blue-100 bg-blue-50 text-xs font-black text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
    >
      {label}
    </button>
  );
}

export function GuestNewsArticleV2({ articleId }: { articleId: number }) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = ui[locale] ?? ui.vi;
  const filters = filterCopy[locale] ?? filterCopy.vi;
  const [filterQuery, setFilterQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState<NewsAdvancedFilters>(
    () => ({
      ...DEFAULT_NEWS_ADVANCED_FILTERS,
      topics: [],
      contentTypes: [],
    }),
  );
  const article = getOfficialNewsArticle(articleId);
  const availableTopics = getNewsFilterTopics(article.category);
  const related = OFFICIAL_NEWS
    .filter(
      (item) =>
        item.id !== article.id &&
        (item.category === article.category || item.category === "cooperation"),
    )
    .slice(0, 4);
  const popular = OFFICIAL_NEWS.filter((item) => item.id !== article.id).slice(0, 5);
  const bottomRelated = OFFICIAL_NEWS
    .filter((item) => item.id !== article.id)
    .slice(5, 9);

  const openNews = (category: NewsCategory, query = filterQuery) => {
    router.push(newsFilterHref(category, query, advancedFilters));
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <GuestPublicNav active="news" />

      <main className="mx-auto max-w-[1460px] px-4 py-9 sm:px-6 lg:px-8">
        <GuestNewsMasthead />

        <GuestNewsFilterNav
          activeCategory={article.category}
          categoryLabels={filters.categories}
          clearSearchLabel={filters.clear}
          query={filterQuery}
          searchPlaceholder={filters.search}
          searchSubmitLabel={filters.searchSubmit}
          onCategoryChange={openNews}
          onQueryChange={setFilterQuery}
          onSearchSubmit={(query) => openNews(article.category, query)}
          filterControl={
            <GuestNewsAdvancedFilters
              availableTopics={availableTopics}
              filters={advancedFilters}
              onApply={(nextFilters) =>
                router.push(
                  newsFilterHref(
                    article.category,
                    filterQuery,
                    nextFilters,
                  ),
                )
              }
              onFiltersChange={setAdvancedFilters}
              triggerLabel={filters.open}
            />
          }
        />

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            {t.home}
          </Link>
          <span>›</span>
          <Link href="/news" className="hover:text-blue-600">
            {t.news}
          </Link>
          <span>›</span>
          <span className="text-blue-600">
            {categoryLabels[article.category]}
          </span>
        </div>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <header>
              <h2 className="max-w-5xl text-3xl font-black leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-5xl">
                {article.title}
              </h2>
              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600 sm:text-lg">
                {article.summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-blue-100 py-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>Mạng lưới tri thức Nga - Việt</span>
                  <span>•</span>
                  <span>{1_200 + article.id * 17} lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mr-1 text-sm text-slate-500">
                    {t.share}:
                  </span>
                  <ShareButton label="f" />
                  <ShareButton label="Z" />
                  <ShareButton label="↗" />
                </div>
              </div>
            </header>

            <div className="mt-7">
              {article.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.image} alt={article.title} className="max-h-[640px] w-full rounded-2xl object-cover" />
              ) : (
                <ArticleVisual category={article.category} />
              )}
            </div>

            <div className="mt-8 space-y-6 text-lg leading-8 text-slate-800">
              {article.body.map((paragraph, index) => (
                <p key={`${article.id}-${index}`}>{paragraph}</p>
              ))}
              {article.sources.length > 0 && (
                <div className="border-t border-blue-100 pt-5 text-sm text-slate-600">
                  <span className="font-bold">Nguồn: </span>
                  {article.sources.map((source) => (
                    <a key={source} href={source} target="_blank" rel="noopener noreferrer" className="block break-all text-blue-700 hover:underline">
                      {source}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-blue-100 pt-6">
              <span className="mr-2 text-sm font-black text-slate-700">
                {t.tags}:
              </span>
              {[
                "Việt Nam - Nga",
                categoryLabels[article.category],
                "hợp tác khoa học",
                "đổi mới sáng tạo",
                "công nghệ cao",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_6px_22px_rgba(37,99,235,.05)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black uppercase text-blue-600">
                  {t.related}
                </h2>
                <Link href="/news" className="text-xs font-black text-blue-600">
                  Xem tất cả →
                </Link>
              </div>
              <div className="grid gap-4">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="flex gap-3 border-b border-blue-50 pb-4 last:border-0 last:pb-0"
                    >
                      <Thumb item={item} />
                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold leading-6 text-slate-900">
                          {item.title}
                        </h3>
                      </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_6px_22px_rgba(37,99,235,.05)]">
              <h2 className="mb-4 text-lg font-black uppercase text-blue-600">
                {t.popular}
              </h2>
              <div className="divide-y divide-blue-100">
                {popular.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group block py-4 first:pt-0 last:pb-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <span className="block text-base font-bold leading-6 text-slate-800 transition-colors group-hover:text-blue-700">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-12 border-t border-blue-100 pt-8">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="shrink-0 text-xl font-black uppercase text-blue-600">
              {t.related}
            </h2>
            <div className="h-px flex-1 bg-blue-100" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {bottomRelated.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_5px_18px_rgba(37,99,235,.05)] transition hover:-translate-y-1 hover:border-blue-200"
              >
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-36 w-full object-cover" />
                ) : (
                  <div className="h-36 bg-[linear-gradient(135deg,#104a9c,#3c7acb_55%,#143d76)]" />
                )}
                <div className="p-4">
                  <h3 className="text-base font-extrabold leading-6">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <GuestPublicFooter copy={HOME_COPY[locale]} />
    </div>
  );
}
