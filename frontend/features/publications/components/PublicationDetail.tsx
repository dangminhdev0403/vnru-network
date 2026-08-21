import Link from "next/link";
import type { DetailResult, Labels } from "../types";

type Props = Readonly<{
  data: DetailResult;
  labels: Labels;
  lang: string;
}>;

export default function PublicationDetail({ data, labels: t, lang }: Props) {
  if (data.status === "error") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div role="alert" className="rounded-2xl bg-error-container border border-error/20 p-5 text-sm text-on-error-container">
          <p>{t.errorDetail}</p>
          <Link href="/knowledge" className="mt-2 inline-block text-xs font-bold text-error hover:underline">
            {t.retry} →
          </Link>
        </div>
      </div>
    );
  }

  if (data.status === "not_found") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-outline-variant bg-surface-variant p-8 text-center">
          <p className="text-sm text-on-surface-variant">{t.notFound}</p>
          <Link href="/knowledge" className="mt-3 inline-block text-xs font-bold text-secondary hover:underline">
            {t.backToList}
          </Link>
        </div>
      </div>
    );
  }

  const pub = data.item;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6">
        <Link href="/knowledge" className="text-sm font-bold text-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
          {t.backToList}
        </Link>
      </nav>

      <article>
        <header>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
            {pub.title}
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            {pub.type} · {pub.year} · {pub.country} · {pub.language}
          </p>
        </header>

        {pub.abstract && (
          <section className="mt-6" aria-label={t.abstract}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">{t.abstract}</h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface">{pub.abstract}</p>
          </section>
        )}

        {pub.authors.length > 0 && (
          <section className="mt-6" aria-label={t.authors}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">{t.authors}</h2>
            <ul className="mt-2 space-y-1">
              {pub.authors.map((a) => (
                <li key={a.id} className="text-sm text-on-surface">{a.expertRef}</li>
              ))}
            </ul>
          </section>
        )}

        {pub.topics.length > 0 && (
          <section className="mt-6" aria-label={t.topics}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-on-surface-variant">{t.topics}</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pub.topics.map((topic) => (
                <span
                  key={topic.id}
                  className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-1 text-xs text-blue-800 font-semibold"
                >
                  {topic.labels[lang] ?? topic.labels.en ?? topic.slug}
                </span>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
