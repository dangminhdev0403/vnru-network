import { getPublications } from "@/features/publications/repository";
import { getLabels } from "@/features/publications/types";
import PublicationList from "@/features/publications/components/PublicationList";

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export const metadata = { title: "Knowledge Repository — VN-RU Network" };

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<Params> }) {
  const raw = await searchParams;
  const lang = one(raw.lang) ?? "en";
  const t = getLabels(lang);
  const query = {
    q: one(raw.q),
    country: one(raw.country),
    organization: one(raw.organization),
    topic: one(raw.topic),
    language: one(raw.language),
    year: one(raw.year),
    cursor: one(raw.cursor),
    limit: "20",
  };
  const data = await getPublications(query);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
          {t.pageTitle}
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">{t.pageDesc}</p>
      </header>

      <form className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto]" role="search">
        <input
          name="q"
          defaultValue={query.q}
          type="search"
          aria-label={t.search}
          placeholder={t.searchPlaceholder}
          className="h-11 rounded-xl border border-outline-variant bg-surface px-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          type="submit"
          className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-on-secondary hover:bg-secondary/90 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          {t.search}
        </button>
      </form>

      <PublicationList data={data} query={query} labels={t} lang={lang} />
    </main>
  );
}
