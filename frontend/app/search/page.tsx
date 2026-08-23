import Link from "next/link";
import { cookies } from "next/headers";
import { getPublications } from "@/features/publications/repository";
import { getExperts } from "@/features/experts/repository";
import PublicHeader from "@/components/shared/PublicHeader";
import type { Locale } from "@/app/HomeMotion";

const one = (value: string | string[] | undefined) => typeof value === "string" ? value : undefined;
type Params = Record<string, string | string[] | undefined>;
const copy: Record<Locale, Record<string, string>> = {
  vi: { title: "Tìm kiếm tích hợp", intro: "Tìm công bố công khai và chuyên gia tại một nơi.", search: "Tìm kiếm", placeholder: "Công bố, chuyên gia hoặc chủ đề", type: "Loại kết quả", all: "Tất cả", publications: "Công bố", experts: "Chuyên gia", partial: "Kết quả chưa đầy đủ. Một nguồn dữ liệu tạm thời không khả dụng.", viewAll: "Xem tất cả", noPublications: "Không tìm thấy công bố.", publicationsUnavailable: "Dữ liệu công bố không khả dụng.", noExperts: "Không tìm thấy chuyên gia.", expertsUnavailable: "Dữ liệu chuyên gia không khả dụng." },
  en: { title: "Integrated search", intro: "Search public publications and experts from one place.", search: "Search", placeholder: "Publication, expert or topic", type: "Result type", all: "All", publications: "Publications", experts: "Experts", partial: "Partial results. One source is temporarily unavailable.", viewAll: "View all", noPublications: "No publications found.", publicationsUnavailable: "Publications are unavailable.", noExperts: "No experts found.", expertsUnavailable: "Experts are unavailable." },
  ru: { title: "Интегрированный поиск", intro: "Поиск открытых публикаций и экспертов в одном месте.", search: "Поиск", placeholder: "Публикация, эксперт или тема", type: "Тип результата", all: "Все", publications: "Публикации", experts: "Эксперты", partial: "Результаты неполные. Один источник временно недоступен.", viewAll: "Показать все", noPublications: "Публикации не найдены.", publicationsUnavailable: "Публикации недоступны.", noExperts: "Эксперты не найдены.", expertsUnavailable: "Эксперты недоступны." },
};

export const metadata = { title: "Search - Russia-Vietnam Science-Technology Intelligence Network" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const locale = ((await cookies()).get("vnru_locale")?.value ?? "vi") as Locale;
  const t = copy[locale] ?? copy.vi;
  const raw = await searchParams;
  const q = one(raw.q) ?? "";
  const type = one(raw.type) === "publications" || one(raw.type) === "experts" ? one(raw.type)! : "all";
  const query = { q: q || undefined, limit: "10" };
  const [publications, experts] = await Promise.all([getPublications(query), getExperts(query)]);
  const partial = publications.status === "error" || experts.status === "error";

  return <><PublicHeader /><main className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
    <header className="max-w-2xl"><h1 className="font-serif text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">{t.title}</h1><p className="mt-2 text-sm text-on-surface-variant">{t.intro}</p></header>
    <form action="/search" className="app-panel mt-6 grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto]" role="search">
      <label className="grid gap-2 text-sm font-semibold text-on-surface">{t.search}<input name="q" defaultValue={q} type="search" placeholder={t.placeholder} className="h-11 rounded-xl border border-outline-variant bg-surface px-4 font-normal focus:outline-none focus:ring-2 focus:ring-secondary" /></label>
      <label className="grid gap-2 text-sm font-semibold text-on-surface">{t.type}<select name="type" defaultValue={type} className="h-11 rounded-xl border border-outline-variant bg-surface px-4 font-normal focus:outline-none focus:ring-2 focus:ring-secondary"><option value="all">{t.all}</option><option value="publications">{t.publications}</option><option value="experts">{t.experts}</option></select></label>
      <button type="submit" className="h-11 self-end rounded-xl bg-secondary px-5 text-sm font-bold text-on-secondary transition hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">{t.search}</button>
    </form>
    {partial && <p role="status" className="mt-6 rounded-xl border border-outline-variant bg-surface-variant p-4 text-sm text-on-surface-variant">{t.partial}</p>}
    <div className="mt-8 grid gap-10 lg:grid-cols-2">
      {(type === "all" || type === "publications") && <section aria-labelledby="publication-results"><div className="flex items-center justify-between border-b border-outline-variant pb-3"><h2 id="publication-results" className="text-xl font-bold text-on-surface">{t.publications}</h2><Link href={{ pathname: "/knowledge", query: q ? { q } : {} }} className="text-sm font-semibold text-secondary hover:underline">{t.viewAll}</Link></div>{publications.status === "success" ? publications.items.length ? <div className="divide-y divide-outline-variant">{publications.items.map((publication) => <article key={publication.id} className="py-4"><Link href={`/publications/${publication.id}`} className="font-bold text-on-surface hover:text-secondary">{publication.title}</Link><p className="mt-1 text-xs text-on-surface-variant">{publication.type} / {publication.year} / {publication.country}</p></article>)}</div> : <p className="py-5 text-sm text-on-surface-variant">{t.noPublications}</p> : <p className="py-5 text-sm text-on-surface-variant">{t.publicationsUnavailable}</p>}</section>}
      {(type === "all" || type === "experts") && <section aria-labelledby="expert-results"><div className="flex items-center justify-between border-b border-outline-variant pb-3"><h2 id="expert-results" className="text-xl font-bold text-on-surface">{t.experts}</h2><Link href={{ pathname: "/experts", query: q ? { q } : {} }} className="text-sm font-semibold text-secondary hover:underline">{t.viewAll}</Link></div>{experts.status === "success" ? experts.items.length ? <div className="divide-y divide-outline-variant">{experts.items.map((expert) => <article key={expert.id} className="py-4"><Link href={`/experts/${expert.id}`} className="font-bold text-on-surface hover:text-secondary">{expert.displayName}</Link><p className="mt-1 text-xs text-on-surface-variant">{expert.organization.name} / {expert.country}</p></article>)}</div> : <p className="py-5 text-sm text-on-surface-variant">{t.noExperts}</p> : <p className="py-5 text-sm text-on-surface-variant">{t.expertsUnavailable}</p>}</section>}
    </div>
  </main></>;
}
