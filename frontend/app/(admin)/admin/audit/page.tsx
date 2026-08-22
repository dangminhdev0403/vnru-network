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
    gapNoticeTitle: string;
    gapNoticeDesc: string;
    auditCategories: { title: string; desc: string; icon: string; status: string }[];
  }
> = {
  vi: {
    kicker: "Kiểm toán & Giám sát Nền tảng",
    title: "Nhật ký Kiểm toán Hệ thống",
    description: "Khung kiến trúc theo dõi các sự kiện thay đổi phân quyền, quản trị danh tính và các quyết định hệ thống.",
    backToAdmin: "← Quay lại Quản trị Phân quyền",
    gapNoticeTitle: "Trạng thái tích hợp Backend",
    gapNoticeDesc: "Giao diện hiện đang ở chế độ đặc tả kiến trúc. Endpoint truy vấn lịch sử kiểm toán chuyên biệt (Audit Query API) chưa được triển khai tại auth-service backend.",
    auditCategories: [
      { title: "Sự kiện Thay đổi Vai trò & Quyền", desc: "Theo dõi các thao tác cập nhật cấu hình role và phân quyền hệ thống.", icon: "policy", status: "Đang chờ Audit API" },
      { title: "Sự kiện Phân công Vai trò", desc: "Theo dõi việc gán vai trò theo ngữ cảnh (PLATFORM, ORGANIZATION, REVIEW_BOARD).", icon: "badge", status: "Đang chờ Audit API" },
      { title: "Sự kiện Trạng thái Người dùng", desc: "Theo dõi thao tác khóa và mở khóa tài khoản người dùng nền tảng.", icon: "manage_accounts", status: "Đang chờ Audit API" },
    ],
  },
  en: {
    kicker: "Platform Audit & Compliance",
    title: "System Audit Logs",
    description: "Architectural specification for tracking role assignment modifications, identity governance events, and system decisions.",
    backToAdmin: "← Back to Access Administration",
    gapNoticeTitle: "Backend Integration Status",
    gapNoticeDesc: "This surface is currently in architectural specification mode. Dedicated historical audit log query endpoints have not yet been exposed by the backend services.",
    auditCategories: [
      { title: "Role & Permission Modifications", desc: "Tracking configuration changes to roles and system capabilities.", icon: "policy", status: "Awaiting Audit API" },
      { title: "Role Assignment Events", desc: "Tracking contextual role assignments (PLATFORM, ORGANIZATION, REVIEW_BOARD).", icon: "badge", status: "Awaiting Audit API" },
      { title: "User Status Events", desc: "Tracking account lock and activation actions on platform identities.", icon: "manage_accounts", status: "Awaiting Audit API" },
    ],
  },
  ru: {
    kicker: "Аудит и контроль платформы",
    title: "Системный журнал аудита",
    description: "Архитектурная спецификация мониторинга событий изменения прав доступа, назначения ролей и системных решений.",
    backToAdmin: "← Назад к администрированию",
    gapNoticeTitle: "Статус интеграции с бэкендом",
    gapNoticeDesc: "Страница находится в режиме архитектурной спецификации. Выделенный API для запроса исторических журналов аудита пока не реализован на бэкенде.",
    auditCategories: [
      { title: "Изменения ролей и прав", desc: "Мониторинг обновлений конфигурации ролей и полномочий.", icon: "policy", status: "Ожидает Audit API" },
      { title: "События назначения ролей", desc: "Мониторинг контекстных назначений ролей (PLATFORM, ORGANIZATION, REVIEW_BOARD).", icon: "badge", status: "Ожидает Audit API" },
      { title: "События статусов пользователей", desc: "Мониторинг блокировки и активации учетных записей.", icon: "manage_accounts", status: "Ожидает Audit API" },
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

      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
        <div className="flex items-center gap-2 font-bold text-sm">
          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">info</span>
          <span>{t.gapNoticeTitle}</span>
        </div>
        <p className="mt-1.5 text-xs leading-5 text-amber-800 dark:text-amber-400/90">
          {t.gapNoticeDesc}
        </p>
      </div>

      <div className="space-y-4">
        {t.auditCategories.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] transition hover:border-[var(--accent-primary)] flex items-start gap-4"
          >
            <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400 mt-1">{item.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <strong className="block text-base font-bold text-text-primary">{item.title}</strong>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-text-secondary">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
