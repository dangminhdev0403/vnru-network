"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import Link from "next/link";
import React from "react";
import type {
  DiscoveryResult,
  PublicExpert,
  PublicPublication,
} from "../../knowledge/types";

type Props = Readonly<{
  publications: DiscoveryResult<PublicPublication>;
  experts: DiscoveryResult<PublicExpert>;
}>;

const dashboardCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    exploreKnowledge: string;
    heroHeading: string;
    openIam: string;
    openKnowledge: string;
    publicationsTitle: string;
    viewAllPubs: string;
    noPubs: string;
    expertsTitle: string;
    fullDirectory: string;
    noExperts: string;
    accessAdmin: string;
    securitySessions: string;
    formatCountry: (country?: string) => string;
  }
> = {
  vi: {
    eyebrow: "Không gian làm việc thời gian thực · Dữ liệu công khai",
    title: "Bảng điều khiển Không gian làm việc Nga – Việt",
    subtitle:
      "Danh tính & ngữ cảnh từ IAM. Tri thức & chuyên gia công khai từ Kho Tri thức.",
    exploreKnowledge: "Khám phá Kho Tri thức →",
    heroHeading: "Danh tính rõ ràng. Tri thức liên kết. Hợp tác có lộ trình.",
    openIam: "Mở IAM Workspace",
    openKnowledge: "Mở Kho Tri thức",
    publicationsTitle: "Công bố & Tài liệu Nghiên cứu",
    viewAllPubs: "Xem tất cả →",
    noPubs: "Công bố tạm thời không khả dụng hoặc chưa có dữ liệu.",
    expertsTitle: "Danh bạ Chuyên gia",
    fullDirectory: "Danh bạ đầy đủ →",
    noExperts: "Chuyên gia tạm thời không khả dụng hoặc chưa có dữ liệu.",
    accessAdmin: "Quản trị phân quyền →",
    securitySessions: "Phiên làm việc & Bảo mật →",
    formatCountry: (c) =>
      c === "VN" ? "Việt Nam" : c === "RU" ? "Liên bang Nga" : c || "N/A",
  },
  en: {
    eyebrow: "Runtime Workspace · Verified Public Discovery",
    title: "Russia–Vietnam Workspace Dashboard",
    subtitle:
      "Identity & active context from IAM. Public research & experts from Knowledge Repository.",
    exploreKnowledge: "Explore Knowledge →",
    heroHeading:
      "Verified Identity. Connected Intelligence. Actionable Cooperation.",
    openIam: "Open IAM Workspace",
    openKnowledge: "Open Knowledge Workspace",
    publicationsTitle: "Research Publications",
    viewAllPubs: "View all →",
    noPubs: "Publications are temporarily unavailable or empty.",
    expertsTitle: "Expert Directory",
    fullDirectory: "Full directory →",
    noExperts: "Experts are temporarily unavailable or empty.",
    accessAdmin: "Access Administration →",
    securitySessions: "Security & Sessions →",
    formatCountry: (c) =>
      c === "VN" ? "Vietnam" : c === "RU" ? "Russian Federation" : c || "N/A",
  },
  ru: {
    eyebrow: "Рабочее пространство · Открытая база данных",
    title: "Панель управления РФ — СРВ",
    subtitle:
      "Идентификация и контекст из IAM. Публикации и эксперты из базы знаний.",
    exploreKnowledge: "Обзор базы знаний →",
    heroHeading:
      "Проверенная идентичность. Связанные знания. Дорожная карта сотрудничества.",
    openIam: "Открыть IAM",
    openKnowledge: "Открыть базу знаний",
    publicationsTitle: "Научные публикации",
    viewAllPubs: "Смотреть все →",
    noPubs: "Публикации временно недоступны или отсутствуют.",
    expertsTitle: "Каталог экспертов",
    fullDirectory: "Полный каталог →",
    noExperts: "Эксперты временно недоступны или отсутствуют.",
    accessAdmin: "Администрирование доступа →",
    securitySessions: "Сессии и безопасность →",
    formatCountry: (c) =>
      c === "VN" ? "Вьетнам" : c === "RU" ? "Российская Федерация" : c || "N/A",
  },
};

export default function DashboardView({ publications, experts }: Props) {
  const { locale } = useLocale();
  const t = dashboardCopy[locale] || dashboardCopy.vi;

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div>
            <span className="inline-flex rounded-full border border-card-border bg-card-background px-3 py-1.5 text-xs font-black uppercase tracking-wider text-text-primary shadow-xs">
              {t.eyebrow}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl text-text-primary">
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">{t.subtitle}</p>
        </div>
        <Link
          href="/workspace/knowledge"
          className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700 transition shadow-md"
        >
          {t.exploreKnowledge}
        </Link>
      </div>

      {/* Signal Surface Hero Banner */}
      <section className="signal-surface overflow-hidden rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-black sm:text-5xl">{t.heroHeading}</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/workspace/iam"
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-500 transition shadow-xs"
          >
            {t.openIam}
          </Link>
          <Link
            href="/workspace/knowledge"
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-black text-white hover:bg-white/10 transition"
          >
            {t.openKnowledge}
          </Link>
        </div>
      </section>

      {/* No aggregate contract: render only downstream discovery records. */}
      {/* Discovery Panels */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Publications Panel */}
        <section className="app-panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-text-primary">
              {t.publicationsTitle}
            </h3>
            <Link
              href="/workspace/knowledge"
              className="text-xs font-black text-blue-600 hover:underline dark:text-blue-400"
            >
              {t.viewAllPubs}
            </Link>
          </div>
          {publications.status === "success" &&
          publications.items.length > 0 ? (
            <div className="mt-3 divide-y divide-card-border">
              {publications.items.map((p) => (
                <div key={p.id} className="py-3.5">
                  <strong className="text-sm font-bold text-text-primary block">
                    {p.title}
                  </strong>
                  <span className="mt-1 block text-xs text-text-secondary">
                    {p.type} · {p.year} · {t.formatCountry(p.country)}
                  </span>
                  {p.topics && p.topics.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.topics.map((tItem) => (
                        <span
                          key={tItem.id}
                          className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-300"
                        >
                          {locale === "ru"
                            ? (tItem.labels.ru ?? tItem.labels.en ?? tItem.slug)
                            : locale === "en"
                              ? (tItem.labels.en ?? tItem.slug)
                              : (tItem.labels.vi ??
                                tItem.labels.en ??
                                tItem.slug)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-text-tertiary">{t.noPubs}</p>
          )}
        </section>

        {/* Experts Panel */}
        <section className="app-panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-text-primary">
              {t.expertsTitle}
            </h3>
            <Link
              href="/workspace/knowledge"
              className="text-xs font-black text-blue-600 hover:underline dark:text-blue-400"
            >
              {t.fullDirectory}
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
                    <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-xs font-bold text-sky-600 dark:text-sky-300 uppercase">
                      {e.country}
                    </span>
                  </div>
                  <span className="mt-1 block text-xs text-text-secondary">
                    {e.organization?.name} · {t.formatCountry(e.country)}
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
            <p className="mt-4 text-sm text-text-tertiary">{t.noExperts}</p>
          )}
        </section>
      </div>

      {/* Bottom Governance Link Cards */}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href="/admin/access"
          className="rounded-2xl border border-card-border bg-card-background p-4 text-sm font-black text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
        >
          {t.accessAdmin}
        </Link>
        <Link
          href="/workspace/iam/security"
          className="rounded-2xl border border-card-border bg-card-background p-4 text-sm font-black text-text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
        >
          {t.securitySessions}
        </Link>
      </div>
    </div>
  );
}
