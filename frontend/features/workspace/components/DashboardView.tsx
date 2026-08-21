"use client";

import Link from "next/link";
import React from "react";
import type { DiscoveryResult, PublicExpert, PublicPublication } from "../../knowledge/types";

type Props = Readonly<{
  publications: DiscoveryResult<PublicPublication>;
  experts: DiscoveryResult<PublicExpert>;
}>;

const metrics = [
  { label: "Đối tác đang theo dõi", value: "18", tag: "Bilateral" },
  { label: "Công bố đã lưu", value: "42", tag: "Publications" },
  { label: "Expert matches", value: "26", tag: "Matching" },
  { label: "2+2 opportunities", value: "7", tag: "Consortium" },
];

export default function DashboardView({ publications, experts }: Props) {
  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div>
            <span className="inline-flex rounded-full border border-card-border bg-card-background px-3 py-1.5 text-xs font-black uppercase tracking-wider text-text-primary shadow-xs">
              Runtime workspace · real PUBLIC discovery
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl text-text-primary">
            Workspace Nga–Việt
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Identity/context từ Module 01. Publications/Experts PUBLIC từ Module 02.
          </p>
        </div>
        <Link
          href="/workspace/knowledge"
          className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700 transition shadow-md"
        >
          Khám phá Module 02 →
        </Link>
      </div>

      {/* Signal Surface Hero Banner */}
      <section className="signal-surface overflow-hidden rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-black sm:text-5xl">
          Identity rõ ràng. Tri thức liên kết. Hợp tác có đường đi.
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/workspace/iam"
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-500 transition shadow-xs"
          >
            Mở IAM workspace
          </Link>
          <Link
            href="/workspace/knowledge"
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-black text-white hover:bg-white/10 transition"
          >
            Mở Knowledge workspace
          </Link>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <article key={item.label} className="app-panel p-5 transition hover:shadow-md">
            <span className="text-xs font-bold text-text-secondary">{item.label}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <strong className="block text-2xl font-black text-text-primary">
                {item.value}
              </strong>
              <span className="inline-flex rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                {item.tag}
              </span>
            </div>
            <span className="mt-3 inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              Live synchronized
            </span>
          </article>
        ))}
      </div>

      {/* Discovery Panels */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Publications Panel */}
        <section className="app-panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-text-primary">Publications</h3>
            <Link
              href="/workspace/knowledge"
              className="text-xs font-black text-blue-600 hover:underline dark:text-blue-400"
            >
              Xem tất cả →
            </Link>
          </div>
          {publications.status === "success" && publications.items.length > 0 ? (
            <div className="mt-3 divide-y divide-card-border">
              {publications.items.map((p) => (
                <div key={p.id} className="py-3.5">
                  <strong className="text-sm font-bold text-text-primary block">
                    {p.title}
                  </strong>
                  <span className="mt-1 block text-xs text-text-secondary">
                    {p.type} · {p.year} · {p.country}
                  </span>
                  {p.topics && p.topics.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.topics.map((t) => (
                        <span
                          key={t.id}
                          className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-300"
                        >
                          {t.labels.vi ?? t.labels.en ?? t.slug}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-tertiary">
              Publications tạm thời không khả dụng hoặc chưa có dữ liệu.
            </p>
          )}
        </section>

        {/* Experts Panel */}
        <section className="app-panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-text-primary">Experts</h3>
            <Link
              href="/workspace/knowledge"
              className="text-xs font-black text-blue-600 hover:underline dark:text-blue-400"
            >
              Danh bạ đầy đủ →
            </Link>
          </div>
          {experts.status === "success" && experts.items.length > 0 ? (
            <div className="mt-3 grid gap-3">
              {experts.items.map((e) => (
                <div
                  key={e.id}
                  className="rounded-2xl bg-card-surface-area border border-card-border p-3.5 transition hover:shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-text-primary">
                      {e.displayName}
                    </strong>
                    <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-300 uppercase">
                      {e.country}
                    </span>
                  </div>
                  <span className="mt-1 block text-xs text-text-secondary">
                    {e.organization?.name} · {e.country}
                  </span>
                  {e.bio && (
                    <p className="mt-1 text-xs text-text-tertiary line-clamp-2">
                      {e.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-tertiary">
              Experts tạm thời không khả dụng hoặc chưa có dữ liệu.
            </p>
          )}
        </section>
      </div>

      {/* Bottom Governance Link Cards */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/admin/iam"
          className="rounded-2xl border border-card-border bg-card-background p-4 text-sm font-black text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
        >
          Access Administration →
        </Link>
        <Link
          href="/security"
          className="rounded-2xl border border-card-border bg-card-background p-4 text-sm font-black text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
        >
          Security &amp; Sessions →
        </Link>
      </div>
    </div>
  );
}
