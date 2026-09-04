"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { newsResource } from "./resource";
import { AnimatedNumber } from "./AnimatedNumber";
import { useLocale } from "@/core/i18n/locale";
import {
  localizeReactNode,
  localizeText,
} from "@/core/i18n/localize-react-node";
import { ADMIN_NEWS_TRANSLATIONS } from "./admin-news-translations";
import type {
  AdminNewsListItem,
  NewsContentType,
  NewsLocale,
} from "./repository";

const news = newsResource.bind(undefined);

interface ContentDomainConfig {
  type: NewsContentType;
  view: string;
  label: string;
  icon: string;
  tone: {
    bg: string;
    text: string;
    border: string;
    bar: string;
  };
  description: string;
}

const CONTENT_DOMAINS: ContentDomainConfig[] = [
  {
    type: "ARTICLE",
    view: "ARTICLE",
    label: "Tin tức",
    icon: "newspaper",
    tone: {
      bg: "bg-blue-50/80",
      text: "text-blue-700",
      border: "border-blue-200/80",
      bar: "bg-blue-600",
    },
    description:
      "Tin khoa học, công nghệ, kinh tế - xã hội và hợp tác song phương.",
  },
  {
    type: "ANNOUNCEMENT",
    view: "ANNOUNCEMENT",
    label: "Công bố",
    icon: "campaign",
    tone: {
      bg: "bg-sky-50/80",
      text: "text-sky-700",
      border: "border-sky-200/80",
      bar: "bg-sky-600",
    },
    description:
      "Thông báo tuyển sinh, chương trình và văn bản học thuật chính thức.",
  },
  {
    type: "EVENT",
    view: "EVENT",
    label: "Sự kiện",
    icon: "event",
    tone: {
      bg: "bg-indigo-50/80",
      text: "text-indigo-700",
      border: "border-indigo-200/80",
      bar: "bg-indigo-600",
    },
    description: "Hội thảo chuyên gia, diễn đàn khoa học, triển lãm hợp tác.",
  },
  {
    type: "PROJECT",
    view: "PROJECT",
    label: "Dự án",
    icon: "workspaces",
    tone: {
      bg: "bg-emerald-50/80",
      text: "text-emerald-700",
      border: "border-emerald-200/80",
      bar: "bg-emerald-600",
    },
    description: "Dự án hợp tác nghiên cứu, chuyển giao công nghệ song phương.",
  },
  {
    type: "OPPORTUNITY",
    view: "OPPORTUNITY",
    label: "Cơ hội",
    icon: "lightbulb",
    tone: {
      bg: "bg-amber-50/80",
      text: "text-amber-700",
      border: "border-amber-200/80",
      bar: "bg-amber-600",
    },
    description:
      "Học bổng, tài trợ nghiên cứu và chương trình giao lưu quốc tế.",
  },
  {
    type: "KNOWLEDGE",
    view: "KNOWLEDGE",
    label: "Tri thức",
    icon: "school",
    tone: {
      bg: "bg-purple-50/80",
      text: "text-purple-700",
      border: "border-purple-200/80",
      bar: "bg-purple-600",
    },
    description:
      "Thư viện bài báo khoa học, tạp chí chuyên ngành và bằng sáng chế.",
  },
];

const categoryLabels: Record<string, string> = {
  "science-technology": "Khoa học - Công nghệ",
  "economy-society": "Kinh tế - Xã hội",
  education: "Giáo dục",
  cooperation: "Hợp tác",
  "knowledge-article": "Bài báo",
  "knowledge-journal": "Tạp chí",
  "knowledge-invention": "Sáng chế",
};

const domainNameMap: Record<NewsContentType, string> = {
  ARTICLE: "Tin tức",
  EVENT: "Sự kiện",
  ANNOUNCEMENT: "Công bố",
  PROJECT: "Dự án",
  OPPORTUNITY: "Cơ hội",
  KNOWLEDGE: "Tri thức",
  PUBLICATION: "Ấn phẩm",
};

function formatDisplayDate(isoString?: string | null): string {
  if (!isoString) return "--/--/----";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "--/--/----";
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
}

interface ContentOverviewDashboardProps {
  onSelectArticle: (article: AdminNewsListItem) => void;
  onResetForNew: () => void;
}

export function ContentOverviewDashboard({
  onSelectArticle,
  onResetForNew,
}: ContentOverviewDashboardProps) {
  const router = useRouter();
  const uiLocale = useLocale((state) => state.locale);
  const listLocale = uiLocale.toUpperCase() as NewsLocale;
  const t = (value: string) =>
    localizeText(value, uiLocale, ADMIN_NEWS_TRANSLATIONS);

  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Close create menu on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target as Node)
      ) {
        setIsCreateMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCreateMenuOpen(false);
      }
    }
    if (isCreateMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isCreateMenuOpen]);

  // Global query: loads overall counts and latest items across all types
  const globalQuery = useQuery(
    news.queries.list.options({
      locale: listLocale,
      limit: 100, // retrieve enough for timeline analysis
      offset: 0,
    }),
  );

  // Parallel lightweight queries for the 6 domains
  const domainQueries = useQueries({
    queries: CONTENT_DOMAINS.map((domain) => ({
      ...news.queries.list.options({
        locale: listLocale,
        contentType: domain.type,
        limit: 1,
        offset: 0,
      }),
      staleTime: 60_000,
    })),
  });

  const totalAllCount = globalQuery.data?.counts?.total ?? 0;
  const publishedCount = globalQuery.data?.counts?.published ?? 0;
  const draftCount = Math.max(0, totalAllCount - publishedCount);

  const allItems = useMemo(
    () => globalQuery.data?.items ?? [],
    [globalQuery.data?.items],
  );

  const recentTableItems = useMemo(() => allItems.slice(0, 7), [allItems]);

  // Domain breakdown calculation
  const domainCounts = useMemo(() => {
    return CONTENT_DOMAINS.map((domain, index) => {
      const queryResult = domainQueries[index];
      const count = queryResult?.data?.counts?.total ?? 0;
      const published = queryResult?.data?.counts?.published ?? 0;
      return {
        ...domain,
        count,
        published,
        percentage: totalAllCount > 0 ? (count / totalAllCount) * 100 : 0,
      };
    });
  }, [domainQueries, totalAllCount]);

  // Real timeline aggregation from actual article timestamps
  const timelineData = useMemo(() => {
    if (!allItems.length) return [];

    const dateMap = new Map<string, number>();
    for (const item of allItems) {
      const iso = item.publishedAt || item.updatedAt;
      if (!iso) continue;
      const key = iso.slice(0, 10); // YYYY-MM-DD
      dateMap.set(key, (dateMap.get(key) ?? 0) + 1);
    }

    const sortedEntries = Array.from(dateMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0]),
    );

    // If data points are clustered, format into display friendly items
    return sortedEntries.map(([dateKey, count]) => {
      const [, m, d] = dateKey.split("-");
      return {
        key: dateKey,
        label: `${d}/${m}`,
        count,
      };
    });
  }, [allItems]);

  // SVG Chart geometry
  const chartGeometry = useMemo(() => {
    const width = 520;
    const height = 180;
    const paddingLeft = 36;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 32;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    if (timelineData.length === 0) {
      return {
        width,
        height,
        points: [],
        pathD: "",
        areaD: "",
        maxCount: 0,
        yTicks: [],
      };
    }

    const counts = timelineData.map((d) => d.count);
    const maxCount = Math.max(...counts, 5);
    const stepX =
      timelineData.length > 1
        ? plotWidth / (timelineData.length - 1)
        : plotWidth / 2;

    const points = timelineData.map((d, index) => {
      const x =
        timelineData.length > 1
          ? paddingLeft + index * stepX
          : paddingLeft + plotWidth / 2;
      const y = paddingTop + plotHeight - (d.count / maxCount) * plotHeight;
      return { ...d, x, y };
    });

    // Build smooth cubic bezier or straight lines
    let pathD = "";
    if (points.length === 1) {
      pathD = `M ${paddingLeft} ${points[0].y} L ${paddingLeft + plotWidth} ${points[0].y}`;
    } else {
      pathD = points.reduce((acc, pt, i, arr) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = arr[i - 1];
        const cpX1 = prev.x + (pt.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (pt.x - prev.x) / 2;
        const cpY2 = pt.y;
        return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
      }, "");
    }

    const baseY = paddingTop + plotHeight;
    const firstX = points[0]?.x ?? paddingLeft;
    const lastX = points[points.length - 1]?.x ?? paddingLeft + plotWidth;
    const areaD = `${pathD} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;

    const yTicks = [
      { val: maxCount, y: paddingTop },
      { val: Math.round(maxCount / 2), y: paddingTop + plotHeight / 2 },
      { val: 0, y: baseY },
    ];

    return {
      width,
      height,
      points,
      pathD,
      areaD,
      maxCount,
      yTicks,
    };
  }, [timelineData]);

  const [currentTimestamp] = useState(() => Date.now());

  // Operational attention derived from real data
  const attentionData = useMemo(() => {
    const drafts = allItems.filter((item) => !item.publishedAt);
    const withDeadlines = allItems
      .filter((item) => Boolean(item.actionClosesAt))
      .map((item) => {
        const closeTime = new Date(item.actionClosesAt!).getTime();
        const diffDays = Math.ceil(
          (closeTime - currentTimestamp) / (1000 * 60 * 60 * 24),
        );
        return {
          item,
          diffDays,
          isExpired: diffDays < 0,
          isUrgent: diffDays >= 0 && diffDays <= 14,
        };
      })
      .sort((a, b) => a.diffDays - b.diffDays);

    return {
      drafts,
      withDeadlines,
      hasPendingAction: drafts.length > 0 || withDeadlines.length > 0,
    };
  }, [allItems, currentTimestamp]);

  const isLoading = globalQuery.isLoading;

  const handleCreateType = (type: NewsContentType) => {
    setIsCreateMenuOpen(false);
    router.push(`/workspace/news?view=new&type=${type}`);
  };

  return localizeReactNode(
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* ═══════════════ 1. PAGE HEADER & GLOBAL CREATE ACTION ═══════════════ */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            {t("Trung tâm nội dung")}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t("Tổng quan nội dung cổng")}
          </h1>
          <p className="mt-1.5 text-base font-normal text-slate-600 max-w-2xl">
            {t(
              "Tổng quan hoạt động và nội dung trên toàn hệ thống mạng lưới Nga - Việt.",
            )}
          </p>
        </div>

        {/* Global Create Dropdown */}
        <div className="relative shrink-0" ref={createMenuRef}>
          <button
            type="button"
            onClick={() => setIsCreateMenuOpen((prev) => !prev)}
            aria-expanded={isCreateMenuOpen}
            aria-haspopup="true"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-base font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span
              className="material-symbols-outlined text-xl leading-none font-bold"
              aria-hidden="true"
            >
              add
            </span>
            <span>{t("Tạo nội dung mới")}</span>
            <span
              className={`material-symbols-outlined text-lg leading-none transition-transform duration-200 ${
                isCreateMenuOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            >
              expand_more
            </span>
          </button>

          {isCreateMenuOpen ? (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 motion-reduce:animate-none"
              role="menu"
              aria-orientation="vertical"
            >
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                {t("Chọn loại hình nội dung")}
              </div>
              <div className="py-1">
                {CONTENT_DOMAINS.map((domain) => (
                  <button
                    key={domain.type}
                    type="button"
                    role="menuitem"
                    onClick={() => handleCreateType(domain.type)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <span
                      className="material-symbols-outlined text-lg text-slate-500"
                      aria-hidden="true"
                    >
                      {domain.icon}
                    </span>
                    <span>{t(`Tạo ${domain.label.toLowerCase()}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {/* ═══════════════ 2. TOP SUMMARY METRICS (3 FOCUSED KPIS) ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        aria-label={t("Tổng quan nội dung")}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {/* Total Content */}
        <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-600">
              {t("Tổng nội dung")}
            </span>
            <div
              className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-2xl">
                description
              </span>
            </div>
          </div>
          <strong className="mt-3 block text-3xl font-extrabold tracking-tight text-slate-900">
            {isLoading ? (
              "—"
            ) : (
              <AnimatedNumber value={totalAllCount} duration={1300} />
            )}
          </strong>
          <span className="mt-1 block text-sm text-slate-500">
            {t("Phân bổ trên 6 phân hệ")}
          </span>
        </article>

        {/* Published Content */}
        <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-600">
              {t("Đã xuất bản")}
            </span>
            <div
              className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-2xl">
                check_circle
              </span>
            </div>
          </div>
          <strong className="mt-3 block text-3xl font-extrabold tracking-tight text-slate-900">
            {isLoading ? (
              "—"
            ) : (
              <AnimatedNumber value={publishedCount} duration={1300} />
            )}
          </strong>
          <span className="mt-1 block text-sm text-slate-500">
            {totalAllCount > 0
              ? `${Math.round((publishedCount / totalAllCount) * 100)}% đang hiển thị công khai`
              : t("Đang hiển thị công khai")}
          </span>
        </article>

        {/* Drafts / Action Required */}
        <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-600">
              {t("Bản nháp / Cần xử lý")}
            </span>
            <div
              className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined text-2xl">
                edit_document
              </span>
            </div>
          </div>
          <strong className="mt-3 block text-3xl font-extrabold tracking-tight text-slate-900">
            {isLoading ? (
              "—"
            ) : (
              <AnimatedNumber value={draftCount} duration={1300} />
            )}
          </strong>
          <span className="mt-1 block text-sm text-slate-500">
            {draftCount > 0 ? t("Chờ duyệt xuất bản") : t("Tất cả đã xuất bản")}
          </span>
        </article>
      </motion.section>

      {/* ═══════════════ 3. TWO PRIMARY VISUALIZATIONS SIDE-BY-SIDE ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        aria-label="Phân tích trực quan nội dung"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* Visualization 1: Content Distribution (Horizontal Comparative Bars) */}
        <article className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  {t("Phân bổ nội dung")}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {t(
                    "Tỷ lệ nội dung được quản lý trên từng phân hệ công khai.",
                  )}
                </p>
              </div>
              <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                {isLoading ? (
                  "—"
                ) : (
                  <AnimatedNumber value={totalAllCount} duration={1300} />
                )}{" "}
                {t("nội dung")}
              </span>
            </div>

            {/* Proportional Overview Bar */}
            <div
              className="mt-5 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/60"
              role="progressbar"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tỷ lệ phân bổ nội dung"
            >
              {domainCounts.map((domain) =>
                domain.count > 0 ? (
                  <div
                    key={domain.type}
                    className={`h-full transition-all duration-700 ${domain.tone.bar}`}
                    style={{ width: `${Math.max(2, domain.percentage)}%` }}
                    title={`${t(domain.label)}: ${domain.count} (${Math.round(domain.percentage)}%)`}
                  />
                ) : null,
              )}
            </div>

            {/* Comparative Breakdown Rows */}
            <div className="mt-5 space-y-3.5">
              {domainCounts.map((domain) => (
                <Link
                  key={domain.type}
                  href={`/workspace/news?view=${domain.view}`}
                  className="group block rounded-xl p-2 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-lg text-slate-500 group-hover:text-blue-600 transition">
                        {domain.icon}
                      </span>
                      <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition">
                        {t(domain.label)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-800">
                        <AnimatedNumber value={domain.count} duration={1200} />
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        (
                        <AnimatedNumber
                          value={Math.round(domain.percentage)}
                          duration={1200}
                        />
                        %)
                      </span>
                      <span
                        className="material-symbols-outlined text-sm text-slate-400 opacity-0 group-hover:opacity-100 transition"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </div>
                  </div>

                  {/* Individual comparative bar */}
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${domain.tone.bar}`}
                      style={{
                        width: `${Math.max(domain.count > 0 ? 3 : 0, domain.percentage)}%`,
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>

        {/* Visualization 2: Activity Over Time (Real SVG Line/Area Chart) */}
        <article className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  {t("Hoạt động nội dung")}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {t("Tần suất biên tập và xuất bản nội dung theo thời gian.")}
                </p>
              </div>
              <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {t("30 ngày gần đây")}
              </span>
            </div>

            {/* Interactive SVG Chart Canvas */}
            <div className="relative mt-6 w-full">
              {isLoading ? (
                <div className="flex h-48 w-full items-center justify-center text-sm text-slate-500">
                  <span className="material-symbols-outlined mr-2 animate-spin text-xl text-blue-600">
                    progress_activity
                  </span>
                  {t("Đang tải dữ liệu thực tế…")}
                </div>
              ) : timelineData.length === 0 ? (
                <div className="flex h-48 w-full items-center justify-center text-sm text-slate-400">
                  Chưa có dữ liệu hoạt động trong khoảng thời gian này.
                </div>
              ) : (
                <div className="w-full overflow-hidden">
                  <svg
                    viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
                    className="w-full h-48 overflow-visible"
                    aria-label="Biểu đồ hoạt động nội dung theo thời gian"
                  >
                    <defs>
                      <linearGradient
                        id="areaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity="0.0"
                        />
                      </linearGradient>
                    </defs>

                    {/* Y-Axis Grid Lines & Labels */}
                    {chartGeometry.yTicks.map((tick) => (
                      <g key={tick.val} className="text-slate-300">
                        <line
                          x1={36}
                          y1={tick.y}
                          x2={chartGeometry.width - 20}
                          y2={tick.y}
                          stroke="#e2e8f0"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={28}
                          y={tick.y + 4}
                          textAnchor="end"
                          fontSize="11"
                          fill="#94a3b8"
                          className="font-mono font-medium"
                        >
                          {tick.val}
                        </text>
                      </g>
                    ))}

                    {/* Shaded Area Fill */}
                    {chartGeometry.areaD ? (
                      <path
                        d={chartGeometry.areaD}
                        fill="url(#areaGradient)"
                        className="transition-all duration-300"
                      />
                    ) : null}

                    {/* Stroke Line */}
                    {chartGeometry.pathD ? (
                      <path
                        d={chartGeometry.pathD}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-300"
                      />
                    ) : null}

                    {/* Data Points */}
                    {chartGeometry.points.map((pt) => (
                      <g
                        key={pt.key}
                        className="group cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            date: pt.label,
                            count: pt.count,
                            x: pt.x,
                            y: pt.y,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredPoint?.date === pt.label ? 6 : 4}
                          fill="#ffffff"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                          className="transition-all duration-150"
                        />
                        {/* X-axis Label */}
                        <text
                          x={pt.x}
                          y={chartGeometry.height - 10}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#64748b"
                          className="font-medium"
                        >
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* Hover Tooltip Overlay */}
                  {hoveredPoint ? (
                    <div
                      className="pointer-events-none absolute -top-2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-md transition-all duration-150 -translate-x-1/2 z-10"
                      style={{
                        left: `${(hoveredPoint.x / chartGeometry.width) * 100}%`,
                      }}
                    >
                      <div className="font-bold">
                        {hoveredPoint.count} nội dung
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {hoveredPoint.date}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dữ liệu thực tế từ hệ thống quản trị</span>
            <span className="font-semibold text-slate-700">
              Tổng cộng {allItems.length} lượt xử lý
            </span>
          </div>
        </article>
      </motion.section>

      {/* ═══════════════ 4. CONTENT-DOMAIN OVERVIEW (6 COMPACT NAVIGATION CARDS) ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        aria-label={t("Các phân hệ nội dung")}
      >
        <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-3.5">
          {t("Các phân hệ nội dung")}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {domainCounts.map((domain) => (
            <Link
              key={domain.type}
              href={`/workspace/news?view=${domain.view}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition hover:border-blue-400 hover:shadow-xs focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`grid size-9 place-items-center rounded-lg ${domain.tone.bg} ${domain.tone.text}`}
                    aria-hidden="true"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {domain.icon}
                    </span>
                  </span>
                  <span className="font-mono text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                    <AnimatedNumber value={domain.count} duration={1200} />
                  </span>
                </div>
                <h3 className="mt-2.5 text-sm font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-1">
                  {t(domain.label)}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  <AnimatedNumber value={domain.published} duration={1200} />{" "}
                  {t("Đã xuất bản")}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-800">
                <span>{t("Quản lý")}</span>
                <span
                  className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════ 5. RECENT ACTIVITY & OPERATIONAL STATE ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        aria-label={t("Hoạt động gần đây")}
        className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              {t("Hoạt động gần đây")}
            </h2>
            <p className="mt-0.5 text-sm text-slate-600">
              {t("Các bài viết, thông báo và dự án được cập nhật mới nhất.")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Operational status pill */}
            {!attentionData.hasPendingAction ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span
                  className="size-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                <span>
                  {t(
                    "Toàn bộ bài viết, công bố và dự án đang hoạt động bình thường.",
                  )}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                <span
                  className="material-symbols-outlined text-sm text-amber-700"
                  aria-hidden="true"
                >
                  warning
                </span>
                <span>{attentionData.drafts.length} bản nháp cần duyệt</span>
              </span>
            )}

            <Link
              href="/workspace/news?view=ARTICLE"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              <span>{t("Xem tất cả")}</span>
              <span
                className="material-symbols-outlined text-base"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        {/* Compact Cross-Content Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th scope="col" className="pb-3 pr-3">
                  {t("Loại hình")}
                </th>
                <th scope="col" className="pb-3 px-3">
                  {t("Tiêu đề / Nội dung")}
                </th>
                <th scope="col" className="pb-3 px-3 text-center">
                  {t("Trạng thái")}
                </th>
                <th scope="col" className="pb-3 pl-3 text-right">
                  {t("Cập nhật")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm text-slate-500"
                  >
                    <span className="material-symbols-outlined mr-2 animate-spin align-middle text-xl text-blue-600">
                      progress_activity
                    </span>
                    {t("Đang tải dữ liệu thực tế…")}
                  </td>
                </tr>
              ) : null}

              {!isLoading && recentTableItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-sm text-slate-500"
                  >
                    {t("Chưa có hoạt động nào được ghi nhận.")}
                  </td>
                </tr>
              ) : null}

              {!isLoading &&
                recentTableItems.map((item) => {
                  const domainName =
                    domainNameMap[item.contentType] || item.contentType;
                  const title = item.translations[0]?.title || item.id;
                  const categoryLabel =
                    categoryLabels[item.category] || item.category;
                  const dateStr = formatDisplayDate(
                    item.updatedAt || item.publishedAt,
                  );
                  const isDraft = !item.publishedAt;

                  return (
                    <tr
                      key={item.id}
                      className="group transition hover:bg-slate-50/80 cursor-pointer"
                      onClick={() => onSelectArticle(item)}
                    >
                      {/* Domain Badge */}
                      <td className="py-3.5 pr-3 align-middle whitespace-nowrap">
                        <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                          {t(domainName)}
                        </span>
                      </td>

                      {/* Title & Category */}
                      <td className="py-3.5 px-3 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                            {title}
                          </span>
                          <span className="text-xs text-slate-500">
                            {categoryLabel}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 align-middle text-center whitespace-nowrap">
                        {isDraft ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            {t("Bản nháp")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {t("Đã xuất bản")}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 pl-3 align-middle text-right text-xs font-medium text-slate-500 whitespace-nowrap">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 sm:hidden">
          <Link
            href="/workspace/news?view=ARTICLE"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            <span>{t("Xem tất cả")}</span>
            <span
              className="material-symbols-outlined text-base"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </Link>
        </div>
      </motion.section>
    </motion.div>,
    uiLocale,
    ADMIN_NEWS_TRANSLATIONS,
  );
}
