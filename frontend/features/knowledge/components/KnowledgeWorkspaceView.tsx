"use client";

import Link from "next/link";
import React from "react";
import type { DiscoveryResult, PublicExpert, PublicPublication } from "../types";

type Props = Readonly<{
  publications: DiscoveryResult<PublicPublication>;
  experts: DiscoveryResult<PublicExpert>;
  query: Record<string, string | undefined>;
}>;

/** Build a URL-safe query string from current filters, optionally overriding keys */
function buildHref(query: Record<string, string | undefined>, overrides: Record<string, string | undefined> = {}): string {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
  const qs = params.toString();
  return `/workspace/knowledge${qs ? `?${qs}` : ""}`;
}

export default function KnowledgeWorkspaceView({ publications, experts, query }: Props) {
  const retryHref = buildHref(query);
  const hasActiveFilters = !!(query.q || query.country || query.organization || query.topic || query.language || query.year);

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <div>
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800 px-3 py-1.5 text-xs font-black uppercase tracking-[.14em] text-blue-800 dark:text-blue-300">
            Module 02 · Knowledge Repository &amp; Expert Directory
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-4xl text-text-primary">
          Kho tri thức &amp; Danh mục chuyên gia
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Dữ liệu PUBLIC từ knowledge-service và organization-service. Auth-service vẫn là session authority.
        </p>
      </div>

      {/* Signal Surface Search & Filters Form */}
      <section className="signal-surface overflow-hidden rounded-2xl p-6 text-white sm:p-8 shadow-xl">
        <h2 className="text-3xl font-black sm:text-5xl">
          Expert ↔ Publication ↔ Topic ↔ Organization
        </h2>
        <form className="mt-6 space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              name="q"
              defaultValue={query.q}
              type="search"
              aria-label="Tìm tri thức và chuyên gia"
              placeholder="Tìm công bố hoặc chuyên gia"
              className="h-12 rounded-2xl bg-white px-4 text-slate-900 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-5 font-black text-white hover:bg-blue-700 transition cursor-pointer shadow-md"
            >
              Tìm kiếm
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <input
              name="country"
              defaultValue={query.country}
              placeholder="Quốc gia"
              aria-label="Lọc theo quốc gia"
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="organization"
              defaultValue={query.organization}
              placeholder="Tổ chức"
              aria-label="Lọc theo tổ chức"
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="topic"
              defaultValue={query.topic}
              placeholder="Chủ đề"
              aria-label="Lọc theo chủ đề"
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="language"
              defaultValue={query.language}
              placeholder="Ngôn ngữ"
              aria-label="Lọc theo ngôn ngữ"
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="year"
              defaultValue={query.year}
              placeholder="Năm"
              aria-label="Lọc theo năm"
              className="h-10 rounded-xl bg-white/10 px-3 text-sm text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>
      </section>

      {/* Main Results Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Publications section */}
        <section className="app-panel p-6" aria-label="Publications">
          <h3 className="text-lg font-black text-text-primary">
            Publications &amp; research outputs
          </h3>
          {publications.status === "error" ? (
            <div className="mt-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-sm text-rose-950 dark:text-rose-200">
              Không thể tải Publications.
              <Link href={retryHref} className="mt-2 block text-xs font-bold text-blue-800 dark:text-blue-400 hover:underline">
                Thử lại →
              </Link>
            </div>
          ) : publications.items.length === 0 ? (
            <div className="mt-4 text-sm text-text-tertiary">
              <p>Không có công bố phù hợp.</p>
              {hasActiveFilters && (
                <Link href="/workspace/knowledge" className="mt-1 block text-xs font-bold text-blue-600 hover:underline">
                  Xoá bộ lọc →
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="mt-4 divide-y divide-card-border">
                {publications.items.map((p) => (
                  <article key={p.id} className="py-4">
                    <strong className="text-sm font-bold text-text-primary block">
                      {p.title}
                    </strong>
                    <p className="mt-1 text-xs text-text-secondary">
                      {p.type} · {p.year} · {p.country} · {p.language}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.topics.map((t) => (
                        <span
                          key={t.id}
                          className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-300 font-semibold"
                        >
                          {t.labels.vi ?? t.labels.en ?? t.slug}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              {publications.status === "success" && publications.nextCursor && (
                <Link
                  href={buildHref(query, { publicationCursor: publications.nextCursor })}
                  className="mt-4 inline-block rounded-xl border border-card-border bg-card-surface-area px-4 py-2 text-xs font-bold text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Trang tiếp →
                </Link>
              )}
            </>
          )}
        </section>

        {/* Experts section */}
        <section className="app-panel p-6" aria-label="Experts">
          <h3 className="text-lg font-black text-text-primary">Experts</h3>
          {experts.status === "error" ? (
            <div className="mt-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 p-4 text-sm text-rose-950 dark:text-rose-200">
              Không thể tải Experts.
              <Link href={retryHref} className="mt-2 block text-xs font-bold text-blue-800 dark:text-blue-400 hover:underline">
                Thử lại →
              </Link>
            </div>
          ) : experts.items.length === 0 ? (
            <div className="mt-4 text-sm text-text-tertiary">
              <p>Không có chuyên gia phù hợp.</p>
              {hasActiveFilters && (
                <Link href="/workspace/knowledge" className="mt-1 block text-xs font-bold text-blue-600 hover:underline">
                  Xoá bộ lọc →
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="mt-4 grid gap-3">
                {experts.items.map((e) => (
                  <article
                    key={e.id}
                    className="rounded-2xl border border-card-border bg-card-surface-area p-4"
                  >
                    <strong className="text-sm font-bold text-text-primary block">
                      {e.displayName}
                    </strong>
                    <p className="mt-1 text-xs text-text-secondary">
                      {e.organization?.name} · {e.country}
                    </p>
                    {e.bio && <p className="mt-2 text-xs text-text-tertiary">{e.bio}</p>}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {e.expertises.map((x) => (
                        <span
                          key={x.id}
                          className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-300 font-semibold"
                        >
                          {x.labels.vi ?? x.labels.en ?? x.slug}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              {experts.status === "success" && experts.nextCursor && (
                <Link
                  href={buildHref(query, { expertCursor: experts.nextCursor })}
                  className="mt-4 inline-block rounded-xl border border-card-border bg-card-surface-area px-4 py-2 text-xs font-bold text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Trang tiếp →
                </Link>
              )}
            </>
          )}
        </section>
      </div>

      {/* Bottom Information Callouts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/90 dark:bg-amber-950/20 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-amber-950 dark:text-amber-200">Expert Matching</h3>
            <Link href="/experts" className="text-xs font-black text-amber-900 dark:text-amber-400 hover:underline">
              Khám phá →
            </Link>
          </div>
          <p className="mt-2 text-xs text-amber-950 dark:text-amber-300">
            Matching dùng organization-service và hiển thị lý do chuyên môn chung trong hồ sơ chuyên gia.
          </p>
        </section>
        <section className="rounded-3xl border border-card-border bg-card-background p-6">
          <h3 className="font-black text-text-primary">Knowledge graph &amp; Index Ops</h3>
          <span className="mt-2 block text-xs text-text-secondary">Pending backend contracts</span>
        </section>
      </div>
    </div>
  );
}
