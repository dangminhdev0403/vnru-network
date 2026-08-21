import Link from "next/link";
import { getPublications } from "@/features/publications/repository";
import { getExperts } from "@/features/experts/repository";

const one = (value: string | string[] | undefined) => typeof value === "string" ? value : undefined;
type Params = Record<string, string | string[] | undefined>;

export const metadata = { title: "Search - Russia-Vietnam Science-Technology Intelligence Network" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const raw = await searchParams;
  const q = one(raw.q) ?? "";
  const type = one(raw.type) === "publications" || one(raw.type) === "experts" ? one(raw.type)! : "all";
  const query = { q: q || undefined, limit: "10" };
  const [publications, experts] = await Promise.all([getPublications(query), getExperts(query)]);
  const partial = publications.status === "error" || experts.status === "error";

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-black tracking-tight text-on-surface sm:text-4xl">Integrated search</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Search public publications and experts from one place.</p>
      </header>

      <form action="/search" className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]" role="search">
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Search
          <input name="q" defaultValue={q} type="search" placeholder="Publication, expert or topic" className="h-11 rounded-xl border border-outline-variant bg-surface px-4 font-normal focus:outline-none focus:ring-2 focus:ring-secondary" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-on-surface">
          Result type
          <select name="type" defaultValue={type} className="h-11 rounded-xl border border-outline-variant bg-surface px-4 font-normal focus:outline-none focus:ring-2 focus:ring-secondary">
            <option value="all">All</option>
            <option value="publications">Publications</option>
            <option value="experts">Experts</option>
          </select>
        </label>
        <button type="submit" className="h-11 self-end rounded-xl bg-secondary px-5 text-sm font-bold text-on-secondary transition hover:bg-secondary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">Search</button>
      </form>

      {partial && <p role="status" className="mt-6 rounded-xl border border-outline-variant bg-surface-variant p-4 text-sm text-on-surface-variant">Partial results. One source is temporarily unavailable.</p>}

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {(type === "all" || type === "publications") && (
          <section aria-labelledby="publication-results">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <h2 id="publication-results" className="text-xl font-bold text-on-surface">Publications</h2>
              <Link href={{ pathname: "/knowledge", query: q ? { q } : {} }} className="text-sm font-semibold text-secondary hover:underline">View all</Link>
            </div>
            {publications.status === "success" ? publications.items.length ? (
              <div className="divide-y divide-outline-variant">
                {publications.items.map((publication) => (
                  <article key={publication.id} className="py-4">
                    <Link href={`/publications/${publication.id}`} className="font-bold text-on-surface hover:text-secondary">{publication.title}</Link>
                    <p className="mt-1 text-xs text-on-surface-variant">{publication.type} / {publication.year} / {publication.country}</p>
                  </article>
                ))}
              </div>
            ) : <p className="py-5 text-sm text-on-surface-variant">No publications found.</p> : <p className="py-5 text-sm text-on-surface-variant">Publications are unavailable.</p>}
          </section>
        )}

        {(type === "all" || type === "experts") && (
          <section aria-labelledby="expert-results">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <h2 id="expert-results" className="text-xl font-bold text-on-surface">Experts</h2>
              <Link href={{ pathname: "/experts", query: q ? { q } : {} }} className="text-sm font-semibold text-secondary hover:underline">View all</Link>
            </div>
            {experts.status === "success" ? experts.items.length ? (
              <div className="divide-y divide-outline-variant">
                {experts.items.map((expert) => (
                  <article key={expert.id} className="py-4">
                    <Link href={`/experts/${expert.id}`} className="font-bold text-on-surface hover:text-secondary">{expert.displayName}</Link>
                    <p className="mt-1 text-xs text-on-surface-variant">{expert.organization.name} / {expert.country}</p>
                  </article>
                ))}
              </div>
            ) : <p className="py-5 text-sm text-on-surface-variant">No experts found.</p> : <p className="py-5 text-sm text-on-surface-variant">Experts are unavailable.</p>}
          </section>
        )}
      </div>
    </main>
  );
}
