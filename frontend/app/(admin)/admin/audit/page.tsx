"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import Link from "next/link";
import React from "react";

const auditCopy: Record<
  Locale,
  {
    kicker: string;
    title: string;
    description: string;
    backToAdmin: string;
    outboxNote: string;
    auditCategories: { title: string; desc: string; source: string; icon: string }[];
  }
> = {
  vi: {
    kicker: "Kiểm toán & Giám sát Nền tảng",
    title: "Nhật ký Kiểm toán Hệ thống",
    description: "Theo dõi toàn bộ các sự kiện thay đổi phân quyền, quản trị danh tính và các quyết định hệ thống được ghi nhận tại outbox.",
    backToAdmin: "← Quay lại Quản trị Phân quyền",
    outboxNote: "Tất cả sự kiện quản trị (IAM mutations, role assignments, status changes) được ghi nhận bất biến và kiểm toán tại transactional outbox của auth-service.",
    auditCategories: [
      { title: "Sự kiện Thay đổi Vai trò & Quyền", desc: "Ghi nhận thao tác cập nhật role-permission matrix và thay đổi quyền", source: "auth-service.role_permission_audit", icon: "policy" },
      { title: "Sự kiện Phân công Vai trò", desc: "Ghi nhận việc gán vai trò theo ngữ cảnh (PLATFORM, ORGANIZATION, REVIEW_BOARD)", source: "auth-service.role_assignment_audit", icon: "badge" },
      { title: "Sự kiện Trạng thái Người dùng", desc: "Ghi nhận thao tác khóa / mở khóa tài khoản người dùng nền tảng", source: "auth-service.user_status_audit", icon: "manage_accounts" },
    ],
  },
  en: {
    kicker: "Platform Audit & Compliance",
    title: "System Audit Logs",
    description: "Track all role assignment modifications, identity governance events, and system decisions recorded in transactional outboxes.",
    backToAdmin: "← Back to Access Administration",
    outboxNote: "All governance mutations (IAM changes, role assignments, status updates) are immutably logged and audited via auth-service transactional outbox.",
    auditCategories: [
      { title: "Role & Permission Changes", desc: "Audit logs for role-permission matrix updates and capability changes", source: "auth-service.role_permission_audit", icon: "policy" },
      { title: "Role Assignment Events", desc: "Audit logs for contextual role assignments (PLATFORM, ORGANIZATION, REVIEW_BOARD)", source: "auth-service.role_assignment_audit", icon: "badge" },
      { title: "User Status Events", desc: "Audit logs for user account lock and activation actions", source: "auth-service.user_status_audit", icon: "manage_accounts" },
    ],
  },
  ru: {
    kicker: "Аудит и контроль платформы",
    title: "Системный журнал аудита",
    description: "Мониторинг всех событий изменения прав доступа, назначения ролей и системных решений в транзакционных outbox.",
    backToAdmin: "← Назад к администрированию",
    outboxNote: "Все административные действия (изменения IAM, назначение ролей, блокировки) неизменно фиксируются через outbox auth-service.",
    auditCategories: [
      { title: "Изменения ролей и прав", desc: "Логирование обновлений матрицы прав и полномочий ролей", source: "auth-service.role_permission_audit", icon: "policy" },
      { title: "События назначения ролей", desc: "Логирование контекстных назначений ролей (PLATFORM, ORGANIZATION, REVIEW_BOARD)", source: "auth-service.role_assignment_audit", icon: "badge" },
      { title: "События статусов пользователей", desc: "Логирование блокировки и активации учетных записей", source: "auth-service.user_status_audit", icon: "manage_accounts" },
    ],
  },
};

export default function AdminAuditPage() {
  const { locale } = useLocale();
  const t = auditCopy[locale] || auditCopy.vi;

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="module-kicker inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em]">
            <span className="size-1.5 rounded-full bg-[var(--accent-network)]" />
            <span>{t.kicker}</span>
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-text-primary">
            {t.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
            {t.description}
          </p>
        </div>
        <Link
          href="/admin/access"
          className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {t.backToAdmin}
        </Link>
      </div>

      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs font-medium text-blue-800 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-300">
        {t.outboxNote}
      </div>

      <div className="space-y-4">
        {t.auditCategories.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] transition hover:border-[var(--accent-primary)] flex items-start gap-4"
          >
            <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400 mt-1">{item.icon}</span>
            <div className="min-w-0 flex-1">
              <strong className="block text-base font-bold text-text-primary">{item.title}</strong>
              <p className="mt-1 text-xs text-text-secondary">{item.desc}</p>
              <code className="mt-2 inline-block rounded-md bg-[var(--surface-secondary)] px-2 py-0.5 text-[11px] font-mono text-text-secondary">
                Source: {item.source}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
