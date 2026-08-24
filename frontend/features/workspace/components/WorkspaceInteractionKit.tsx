"use client";

import Link from "next/link";
import React from "react";
import {
  markAllDemoNotificationsRead,
  markDemoNotificationRead,
  type DemoScope,
  useDemoActivity,
  useDemoNotifications,
} from "@/features/prototype-v3/demo-backend";

export type WorkspaceTone = "blue" | "cyan" | "teal" | "purple" | "green" | "amber" | "red" | "slate";

const toneClasses: Record<WorkspaceTone, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-300",
  teal: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300",
  purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  amber: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  red: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
  slate: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
};

export function WorkspaceStatus({ children, tone = "slate" }: { children: React.ReactNode; tone?: WorkspaceTone }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${toneClasses[tone]}`}>{children}</span>;
}

export function WorkspaceViewHeader({
  eyebrow,
  title,
  description,
  tone = "blue",
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  tone?: WorkspaceTone;
  action?: React.ReactNode;
}) {
  const eyebrowTone = tone === "cyan" ? "text-cyan-700 dark:text-cyan-300" : tone === "teal" ? "text-teal-700 dark:text-teal-300" : tone === "purple" ? "text-purple-700 dark:text-purple-300" : "text-blue-700 dark:text-blue-300";
  return (
    <header className="flex flex-col gap-5 border-b border-card-border pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-4xl">
        <p className={`text-xs font-extrabold uppercase tracking-[0.14em] ${eyebrowTone}`}>{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function WorkspaceMetric({
  value,
  label,
  detail,
  href,
  tone = "blue",
}: {
  value: string;
  label: string;
  detail: string;
  href?: string;
  tone?: WorkspaceTone;
}) {
  const body = (
    <>
      <strong className="block text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</strong>
      <span className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">{label}</span>
      <small className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</small>
      {href && <span className={`mt-4 inline-flex text-xs font-extrabold ${toneClasses[tone].split(" ").find((item) => item.startsWith("text-")) ?? "text-blue-700"}`}>Mở danh sách →</span>}
    </>
  );
  const classes = "rounded-2xl border border-card-border bg-card-surface-area p-5 text-left transition-shadow hover:shadow-md motion-reduce:transition-none";
  return href ? <Link href={href} className={classes}>{body}</Link> : <div className={classes}>{body}</div>;
}

export function WorkspaceCollectionToolbar({
  query,
  onQueryChange,
  placeholder,
  filters,
  activeFilter,
  onFilterChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  filters: Array<{ value: string; label: string; count?: number }>;
  activeFilter: string;
  onFilterChange: (value: string) => void;
}) {
  return (
    <div className="space-y-4 border-b border-card-border pb-4">
      <label className="relative block max-w-xl">
        <span className="sr-only">Tìm kiếm</span>
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-slate-400" aria-hidden="true">search</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          className="min-h-11 w-full rounded-xl border border-card-border bg-white pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-950"
        />
      </label>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc trạng thái">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={activeFilter === filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`min-h-10 rounded-lg border px-3 text-sm font-bold transition-colors motion-reduce:transition-none ${activeFilter === filter.value ? "border-slate-900 bg-slate-900 text-white dark:border-blue-600 dark:bg-blue-700" : "border-card-border text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"}`}
          >
            {filter.label}{typeof filter.count === "number" ? ` (${filter.count})` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}

export type WorkflowStepState = "done" | "current" | "waiting" | "blocked";

export function WorkspaceWorkflowStepper({
  steps,
}: {
  steps: Array<{ label: string; detail?: string; state: WorkflowStepState }>;
}) {
  return (
    <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-3" aria-label="Tiến trình xử lý">
      {steps.map((step, index) => {
        const icon = step.state === "done" ? "check_circle" : step.state === "blocked" ? "error" : step.state === "current" ? "radio_button_checked" : "radio_button_unchecked";
        const tone = step.state === "done" ? "text-emerald-700 dark:text-emerald-300" : step.state === "blocked" ? "text-rose-700 dark:text-rose-300" : step.state === "current" ? "text-blue-700 dark:text-blue-300" : "text-slate-400";
        return (
          <li key={`${index}-${step.label}`} className="flex gap-3 rounded-xl border border-card-border p-3">
            <span className={`material-symbols-outlined mt-0.5 text-xl ${tone}`} aria-hidden="true">{icon}</span>
            <div className="min-w-0">
              <strong className="block text-sm text-slate-900 dark:text-white">{step.label}</strong>
              {step.detail && <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{step.detail}</span>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export interface WorkspaceSeedNotification {
  id: string;
  title: string;
  detail: string;
  href?: string;
  createdAt: string;
  read?: boolean;
}

export function WorkspaceNotificationPanel({ scope, seed = [] }: { scope: DemoScope; seed?: WorkspaceSeedNotification[] }) {
  const dynamic = useDemoNotifications(scope);
  const [readSeedIds, setReadSeedIds] = React.useState<string[]>([]);
  const notifications = [
    ...dynamic,
    ...seed.map((item) => ({ ...item, scope, read: item.read || readSeedIds.includes(item.id) })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const unread = notifications.filter((item) => !item.read).length;

  const markAll = () => {
    markAllDemoNotificationsRead(scope);
    setReadSeedIds(seed.map((item) => item.id));
  };

  return (
    <section className="rounded-2xl border border-card-border bg-card-surface-area p-5">
      <div className="flex items-center justify-between gap-3 border-b border-card-border pb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Thông báo</p>
          <h2 className="mt-1 text-base font-bold text-slate-950 dark:text-white">{unread ? `${unread} việc mới cần chú ý` : "Đã xem hết thông báo"}</h2>
        </div>
        {unread > 0 && <button type="button" onClick={markAll} className="min-h-10 rounded-lg px-3 text-xs font-bold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/40">Đánh dấu đã đọc</button>}
      </div>
      {notifications.length ? (
        <ul className="divide-y divide-card-border">
          {notifications.slice(0, 6).map((item) => {
            const isSeed = seed.some((seedItem) => seedItem.id === item.id);
            const content = (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {!item.read && <span className="size-2 rounded-full bg-blue-600" aria-label="Chưa đọc" />}
                  <strong className="text-sm text-slate-900 dark:text-white">{item.title}</strong>
                </div>
                <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{item.detail}</span>
              </div>
            );
            return (
              <li key={item.id} className="flex items-start gap-3 py-3">
                <span className="material-symbols-outlined mt-0.5 text-lg text-blue-600" aria-hidden="true">notifications</span>
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={() => isSeed ? setReadSeedIds((ids) => [...ids, item.id]) : markDemoNotificationRead(item.id)}
                    className="min-w-0 flex-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    {content}
                  </Link>
                ) : content}
              </li>
            );
          })}
        </ul>
      ) : <p className="py-5 text-sm text-slate-500">Chưa có thông báo trong phiên preview.</p>}
    </section>
  );
}

export interface WorkspaceTimelineSeed {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
  tone?: WorkspaceTone;
}

export function WorkspaceActivityTimeline({
  scope,
  entityCode,
  seed = [],
}: {
  scope: DemoScope;
  entityCode?: string;
  seed?: WorkspaceTimelineSeed[];
}) {
  const dynamic = useDemoActivity(scope)
    .filter((item) => !entityCode || item.detail.includes(entityCode))
    .map((item) => ({ id: item.id, title: item.action, detail: item.detail, createdAt: item.createdAt, tone: "blue" as WorkspaceTone }));
  const rows = [...dynamic, ...seed].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <section className="rounded-2xl border border-card-border bg-card-surface-area p-5">
      <div className="border-b border-card-border pb-3">
        <h2 className="text-base font-bold text-slate-950 dark:text-white">Diễn biến xử lý</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">Timeline giúp kiểm tra ai làm gì và hồ sơ đang chuyển sang bước nào trong UI Preview.</p>
      </div>
      {rows.length ? (
        <ol className="mt-4 space-y-4 border-l border-card-border pl-5">
          {rows.slice(0, 8).map((row) => (
            <li key={row.id} className="relative">
              <span className={`absolute -left-[25px] top-1.5 size-2.5 rounded-full border-2 border-white dark:border-slate-950 ${row.tone === "red" ? "bg-rose-600" : row.tone === "amber" ? "bg-amber-500" : row.tone === "green" ? "bg-emerald-600" : "bg-blue-600"}`} aria-hidden="true" />
              <strong className="block text-sm text-slate-900 dark:text-white">{row.title}</strong>
              <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{row.detail}</span>
              <time className="mt-1 block text-[11px] font-semibold text-slate-400" dateTime={row.createdAt}>{new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(row.createdAt))}</time>
            </li>
          ))}
        </ol>
      ) : <p className="py-5 text-sm text-slate-500">Chưa có hoạt động phù hợp.</p>}
    </section>
  );
}

export function WorkspaceEmptyState({ title, detail, action }: { title: string; detail: string; action?: React.ReactNode }) {
  return (
    <div className="py-12 text-center">
      <span className="material-symbols-outlined text-4xl text-slate-400" aria-hidden="true">inbox</span>
      <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{detail}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
