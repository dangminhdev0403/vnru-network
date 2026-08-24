"use client";

import Link from "next/link";
import React from "react";
import { useDemoWorkflow } from "./DemoWorkflowProvider";
import type { ActivityItem, WorkflowRole } from "./types";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="flex flex-col gap-5 border-b border-card-border pb-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-4xl"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{description}</p></div>{action && <div className="shrink-0">{action}</div>}</header>;
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-card-border bg-card-surface-area p-5 md:p-6 ${className}`}>{children}</section>;
}

export function MetricCard({ value, label, detail, href, urgent = false }: { value: string | number; label: string; detail: string; href?: string; urgent?: boolean }) {
  const content = <><strong className={`block text-3xl font-extrabold ${urgent ? "text-rose-700 dark:text-rose-300" : "text-slate-950 dark:text-white"}`}>{value}</strong><span className="mt-2 block text-sm font-bold text-slate-900 dark:text-white">{label}</span><small className="mt-1 block text-xs leading-5 text-slate-500">{detail}</small>{href && <span className="mt-3 block text-xs font-bold text-blue-700 dark:text-blue-300">Mở danh sách →</span>}</>;
  return href ? <Link href={href} className="rounded-2xl border border-card-border bg-card-surface-area p-5 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">{content}</Link> : <div className="rounded-2xl border border-card-border bg-card-surface-area p-5">{content}</div>;
}

const toneClass: Record<string, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  amber: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  red: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
  blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
  purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300",
  slate: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export function StatusPill({ children, tone = "slate" }: { children: React.ReactNode; tone?: keyof typeof toneClass }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${toneClass[tone]}`}>{children}</span>;
}

export function CollectionToolbar({ query, onQueryChange, children, placeholder = "Tìm theo mã hoặc tiêu đề..." }: { query: string; onQueryChange: (value: string) => void; children?: React.ReactNode; placeholder?: string }) {
  return <div className="flex flex-col gap-3 rounded-2xl border border-card-border bg-card-surface-area p-4 lg:flex-row lg:items-center"><div className="relative flex-1"><span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400" aria-hidden="true">search</span><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder={placeholder} className="min-h-11 w-full rounded-xl border border-card-border bg-white pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 dark:bg-slate-950 dark:text-white" /></div>{children}</div>;
}

export function FilterChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`min-h-10 rounded-xl border px-3 text-sm font-bold ${active ? "border-blue-700 bg-blue-700 text-white" : "border-card-border bg-card-surface-area text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"}`}>{children}</button>;
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: React.ReactNode }) {
  return <div className="py-12 text-center"><span className="material-symbols-outlined text-4xl text-slate-400" aria-hidden="true">inbox</span><h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{detail}</p>{action && <div className="mt-4">{action}</div>}</div>;
}

export function InlineNotice({ tone = "info", title, children }: { tone?: "info" | "warning" | "danger" | "success"; title: string; children: React.ReactNode }) {
  const cls = tone === "danger" ? "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-100" : tone === "warning" ? "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100" : tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100" : "border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100";
  return <div className={`rounded-xl border px-4 py-3 text-sm leading-6 ${cls}`}><strong className="block">{title}</strong><span>{children}</span></div>;
}

export function ActivityTimeline({ items, empty = "Chưa có hoạt động cho đối tượng này." }: { items: ActivityItem[]; empty?: string }) {
  if (!items.length) return <EmptyState title="Chưa có hoạt động" detail={empty} />;
  return <ol className="space-y-0 border-l border-card-border pl-5">{items.map((item) => <li key={item.id} className="relative pb-5"><span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-950" /><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><strong className="text-sm text-slate-900 dark:text-white">{item.action}</strong><span className="text-xs text-slate-500">{item.createdAt}</span></div><p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p><span className="mt-1 block text-xs font-semibold text-slate-500">{item.actor}</span></li>)}</ol>;
}

export function WorkflowStepper({ current }: { current: "proposal" | "organization" | "screening" | "review" | "decision" | "project" }) {
  const steps = [
    ["proposal", "Đề xuất"],
    ["organization", "Xác nhận tổ chức"],
    ["screening", "Sàng lọc"],
    ["review", "Phản biện"],
    ["decision", "Quyết định"],
    ["project", "Triển khai"],
  ] as const;
  const currentIndex = steps.findIndex(([key]) => key === current);
  return <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">{steps.map(([key, label], index) => <div key={key} className={`rounded-xl border p-3 ${index < currentIndex ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30" : index === currentIndex ? "border-blue-500 bg-blue-50 ring-1 ring-blue-400 dark:bg-blue-950/30" : "border-card-border bg-slate-50 dark:bg-slate-900"}`}><span className="text-xs font-extrabold text-slate-500">{index < currentIndex ? "✓" : index === currentIndex ? "●" : "○"} BƯỚC {index + 1}</span><strong className="mt-1 block text-xs text-slate-900 dark:text-white">{label}</strong></div>)}</div>;
}

export function RoleNotificationCenter({ role }: { role: WorkflowRole }) {
  const { notifications, markNotificationRead, markRoleNotificationsRead } = useDemoWorkflow();
  const [open, setOpen] = React.useState(false);
  const roleNotifications = notifications.filter((item) => item.role === role);
  const unread = roleNotifications.filter((item) => !item.read).length;
  return <div className="relative flex justify-end"><button type="button" onClick={() => setOpen((value) => !value)} className="relative inline-flex min-h-10 items-center gap-2 rounded-xl border border-card-border bg-card-surface-area px-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"><span className="material-symbols-outlined text-xl" aria-hidden="true">notifications</span>Thông báo{unread > 0 && <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs text-white">{unread}</span>}</button>{open && <div className="absolute right-0 top-12 z-50 w-[min(92vw,420px)] rounded-2xl border border-card-border bg-card-surface-area p-4 shadow-2xl"><div className="flex items-center justify-between gap-3 border-b border-card-border pb-3"><div><h2 className="text-base font-bold text-slate-950 dark:text-white">Thông báo</h2><p className="text-xs text-slate-500">{unread} chưa đọc · liên kết trực tiếp tới tác vụ</p></div><button type="button" onClick={() => markRoleNotificationsRead(role)} className="text-xs font-bold text-blue-700 dark:text-blue-300">Đọc tất cả</button></div><div className="max-h-[420px] overflow-y-auto">{roleNotifications.length ? roleNotifications.map((item) => <Link key={item.id} href={item.href} onClick={() => { markNotificationRead(item.id); setOpen(false); }} className={`block border-b border-card-border py-4 last:border-b-0 ${item.read ? "opacity-65" : ""}`}><div className="flex items-start gap-3"><span className={`mt-1 size-2.5 shrink-0 rounded-full ${item.read ? "bg-slate-300" : item.tone === "danger" ? "bg-rose-500" : item.tone === "warning" ? "bg-amber-500" : item.tone === "success" ? "bg-emerald-500" : "bg-blue-500"}`} /><span className="min-w-0"><strong className="block text-sm text-slate-900 dark:text-white">{item.title}</strong><span className="mt-1 block text-sm leading-5 text-slate-600 dark:text-slate-300">{item.message}</span><span className="mt-1 block text-xs text-slate-500">{item.createdAt}</span></span></div></Link>) : <EmptyState title="Không có thông báo" detail="Các handoff và thay đổi trạng thái mới sẽ xuất hiện tại đây." />}</div></div>}</div>;
}
