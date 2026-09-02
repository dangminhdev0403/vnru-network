"use client";

import { useState } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { formatDateTime } from "@/core/i18n/date-format";

const copy: Record<Locale, Record<string, string>> = {
  vi: {
    title: "Nhật ký truy cập & Phân quyền",
    desc: "Giám sát các sự kiện bảo mật, cấp quyền và thao tác quản trị trong hệ thống.",
    searchPlaceholder: "Tìm theo tên sự kiện, actor hoặc đối tượng…",
    allEvents: "Tất cả sự kiện",
    colEvent: "Sự kiện (Event)",
    colActor: "Người thực hiện (Actor)",
    colTarget: "Đối tượng (Target)",
    colContext: "Ngữ cảnh",
    colTime: "Thời gian",
    statusVerified: "Xác thực bởi IAM",
  },
  en: {
    title: "Access & Security Logs",
    desc: "Audit trail for security events, permission mutations, and administrative operations.",
    searchPlaceholder: "Search by event, actor, or target ID...",
    allEvents: "All events",
    colEvent: "Event",
    colActor: "Actor",
    colTarget: "Target",
    colContext: "Context",
    colTime: "Timestamp",
    statusVerified: "IAM Verified",
  },
  ru: {
    title: "Журнал доступа и безопасности",
    desc: "Аудит событий безопасности, изменений прав и административных действий.",
    searchPlaceholder: "Поиск по событию, инициатору или объекту...",
    allEvents: "Все события",
    colEvent: "Событие",
    colActor: "Инициатор",
    colTarget: "Объект",
    colContext: "Контекст",
    colTime: "Время",
    statusVerified: "Проверено IAM",
  },
};

const SAMPLE_LOGS = [
  {
    id: "log-1",
    event: "IAM_ROLE_PERMISSIONS_CHANGED",
    actor: "super-admin-fixture@vnru.invalid",
    target: "CONTENT_EDITOR (Role ID)",
    context: "PLATFORM / GLOBAL",
    timestamp: "2026-08-26 14:15:30",
  },
  {
    id: "log-2",
    event: "IAM_ROLE_ASSIGNMENT_CREATED",
    actor: "super-admin-fixture@vnru.invalid",
    target: "portal-manager@vnru.network",
    context: "PLATFORM / GLOBAL",
    timestamp: "2026-08-26 13:45:12",
  },
  {
    id: "log-3",
    event: "IAM_USER_STATUS_CHANGED",
    actor: "super-admin-fixture@vnru.invalid",
    target: "member-vn@vnru.network",
    context: "STATUS: ACTIVE",
    timestamp: "2026-08-26 12:20:00",
  },
  {
    id: "log-4",
    event: "IAM_USER_PASSWORD_RESET",
    actor: "super-admin-fixture@vnru.invalid",
    target: "member-ru@vnru.network",
    context: "SESSIONS REVOKED",
    timestamp: "2026-08-26 11:05:44",
  },
];

export default function AccessLogsPage() {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_LOGS.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.event.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      l.target.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-w-0 space-y-6 p-4 text-text-primary sm:p-6 lg:p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{t.desc}</p>
      </header>

      {/* ── Filter ── */}
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2">
          <span className="material-symbols-outlined text-base text-text-secondary">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-secondary)] text-[11px] font-bold uppercase tracking-[.06em] text-text-secondary">
              <tr>
                <th className="px-5 py-3.5">{t.colEvent}</th>
                <th className="px-5 py-3.5">{t.colActor}</th>
                <th className="px-5 py-3.5">{t.colTarget}</th>
                <th className="px-5 py-3.5">{t.colContext}</th>
                <th className="px-5 py-3.5">{t.colTime}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-[var(--surface-secondary)]/50"
                >
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span className="material-symbols-outlined text-sm">
                        shield
                      </span>
                      {log.event}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200">
                    {log.actor}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                    {log.target}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {log.context}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-text-secondary">
                    {formatDateTime(log.timestamp, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
