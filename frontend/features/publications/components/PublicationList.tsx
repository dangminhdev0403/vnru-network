import Link from "next/link";
import type { DiscoveryResult, PublicPublication, Labels } from "../types";

type Props = Readonly<{
  data: DiscoveryResult<PublicPublication>;
  query: Record<string, string | undefined>;
  labels: Labels;
  lang: string;
}>;

function TopicBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-xs text-blue-800 font-semibold">
      {label}
    </span>
  );
}

export default function PublicationList({ data, query, labels: t, lang }: Props) {
  if (data.status === "error") {
    return (
      <div role="alert" className="rounded-2xl bg-error-container border border-error/20 p-5 text-sm text-on-error-container">
        <p>{t.errorLoading}</p>
        <Link href="/knowledge" className="mt-2 inline-block text-xs font-bold text-error hover:underline">
          {t.retry} →
        </Link>
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <div className="rounded-2xl border border-outline-variant bg-surface-variant p-8 text-center">
        <p className="text-sm text-on-surface-variant">{t.noResults}</p>
        {Object.values(query).some(Boolean) && (
          <Link href="/knowledge" className="mt-3 inline-block text-xs font-bold text-secondary hover:underline">
            {t.filterAll} →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-outline-variant">
        {data.items.map((p) => (
          <article key={p.id} className="py-4">
            <Link href={`/publications/${p.id}`} className="group">
              <h3 className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                {p.title}
              </h3>
            </Link>
            <p className="mt-1 text-xs text-on-surface-variant">
              {p.type} · {p.year} · {p.country} · {p.language}
            </p>
            {p.topics.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1" role="list" aria-label={t.topics}>
                {p.topics.map((topic) => (
                  <span role="listitem" key={topic.id}>
                    <TopicBadge label={topic.labels[lang] ?? topic.labels.en ?? topic.slug} />
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {data.nextCursor && (
        <nav aria-label={t.loadMore} className="mt-4">
          <Link
            href={{ pathname: "/knowledge", query: { ...query, cursor: data.nextCursor } }}
            className="inline-flex items-center rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-on-secondary hover:bg-secondary/90 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            {t.loadMore} →
          </Link>
        </nav>
      )}
    </div>
  );
}
