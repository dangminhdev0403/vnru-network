"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import Link from "next/link";
import React from "react";

const iamCopy: Record<
  Locale,
  {
    kicker: string;
    title: string;
    description: string;
    openAdmin: string;
    gatewayContract: string;
    gatewayHeading: string;
    gatewayDesc: string;
    telemetry: { label: string; value: string }[];
    decisionFlowTitle: string;
    decisionFlowDesc: string;
    decisions: [string, string, string][];
    capabilitiesTitle: string;
    capabilitiesDesc: string;
    permissions: [string, string][];
    authIdpTitle: string;
    authIdpDesc: string;
    sessionsTitle: string;
    sessionsDesc: string;
    openSessions: string;
    accessAdminTitle: string;
    accessAdminDesc: string;
    openAccessAdmin: string;
  }
> = {
  vi: {
    kicker: "Quản trị Danh tính & Quyền truy cập",
    title: "Không gian Quản trị IAM & Phân quyền",
    description:
      "Màn hình runtime cho danh tính, active context, capability và resource scope. Đây là lớp điều hướng/hiển thị; authorization authoritative vẫn nằm ở backend service boundary.",
    openAdmin: "Mở Quản trị Phân quyền →",
    gatewayContract: "Hợp đồng Security Gateway",
    gatewayHeading: "Identity → Context → Capability → Resource Scope",
    gatewayDesc:
      "Module 01 không sở hữu publication, project hay expert state. Module 01 cung cấp security context để các domain khác tự thi hành business authorization tại backend boundary.",
    telemetry: [
      { label: "Danh tính (Identity)", value: "Thành viên đã xác thực" },
      { label: "Ngữ cảnh hoạt động", value: "Theo phạm vi phiên" },
      { label: "Phiên làm việc", value: "Xác minh bởi auth-service" },
      { label: "Ủy quyền (Authz)", value: "Backend là nguồn chân lý" },
    ],
    decisionFlowTitle: "Quy trình Ra Quyết định Phân quyền",
    decisionFlowDesc:
      "Luồng hiển thị nhằm minh bạch ranh giới bảo mật, không trùng lặp các quy tắc nghiệp vụ phía backend.",
    decisions: [
      [
        "01",
        "Xác định danh tính",
        "Xác định authenticated identity từ session hợp lệ.",
      ],
      [
        "02",
        "Xác định active context",
        "Áp dụng context đang active cho workspace hiện tại.",
      ],
      [
        "03",
        "Kiểm tra capability",
        "Frontend chỉ dùng capability để điều khiển UX; backend vẫn quyết định.",
      ],
      [
        "04",
        "Áp dụng resource scope",
        "Giới hạn hành động theo resource/context cụ thể.",
      ],
      [
        "05",
        "Kiểm toán thao tác nhạy cảm",
        "Các hành động governance quan trọng đi vào security/audit trail.",
      ],
    ],
    capabilitiesTitle: "Quyền năng & Phạm vi Tài nguyên",
    capabilitiesDesc:
      "Tên permission chỉ là minh họa giao diện tích hợp; backend contract là nguồn sự thật.",
    permissions: [
      ["IAM.USER.READ", "Đọc danh tính/user theo scope được cấp."],
      ["IAM.ROLE.ASSIGN", "Gán role/context khi backend cho phép."],
      [
        "KNOWLEDGE.PUBLICATION.READ",
        "Đọc tri thức theo access scope.",
      ],
      ["KNOWLEDGE.EXPERT.READ", "Đọc expert directory theo context."],
    ],
    authIdpTitle: "Xác thực & Nhà cung cấp Danh tính (IdP)",
    authIdpDesc:
      "Keycloak/OIDC là auth boundary hiện tại. Provider upstream được cấu hình phía IdP, không hard-code credential trong frontend.",
    sessionsTitle: "Phiên làm việc & Bảo mật",
    sessionsDesc:
      "Quản lý phiên đăng nhập, thu hồi session và kiểm toán bảo mật nằm ở không gian chuyên biệt.",
    openSessions: "Mở Phiên & Bảo mật →",
    accessAdminTitle: "Quản trị Phân quyền IAM",
    accessAdminDesc:
      "Trạng thái người dùng, phân vai trò và gán context sử dụng API quản trị của hệ thống.",
    openAccessAdmin: "Mở Quản trị IAM →",
  },
  en: {
    kicker: "Identity & Access Governance",
    title: "IAM / Governance Workspace",
    description:
      "Runtime control surface for identity, active context, capability and resource scope. Frontend controls presentation; backend service boundaries remain authoritative.",
    openAdmin: "Open Access Administration →",
    gatewayContract: "Security Gateway Contract",
    gatewayHeading: "Identity → Context → Capability → Resource Scope",
    gatewayDesc:
      "Module 01 does not own publication, project, or expert state. It provides security context for other domain services to enforce authorization at backend boundaries.",
    telemetry: [
      { label: "Identity", value: "Authenticated member" },
      { label: "Active Context", value: "Session-scoped" },
      { label: "Session", value: "Validated by auth-service" },
      { label: "Authorization", value: "Backend authoritative" },
    ],
    decisionFlowTitle: "Authorization Decision Flow",
    decisionFlowDesc:
      "Presentation flow illustrating security boundaries without duplicating backend business logic.",
    decisions: [
      [
        "01",
        "Resolve identity",
        "Identify authenticated identity from a valid session token.",
      ],
      [
        "02",
        "Resolve active context",
        "Apply currently active context to workspace session.",
      ],
      [
        "03",
        "Check capability",
        "Frontend uses capability for UI control; backend validates access.",
      ],
      [
        "04",
        "Apply resource scope",
        "Constrain actions to specific resources and contexts.",
      ],
      [
        "05",
        "Audit sensitive action",
        "Governance mutations are recorded to security audit trails.",
      ],
    ],
    capabilitiesTitle: "Capabilities & Resource Scope",
    capabilitiesDesc:
      "Permission keys illustrate integration contracts; backend APIs remain the authoritative truth.",
    permissions: [
      [
        "IAM.USER.READ",
        "Read identity and account metadata within granted scope.",
      ],
      [
        "IAM.ROLE.ASSIGN",
        "Assign contextual roles subject to operator authorization.",
      ],
      [
        "KNOWLEDGE.PUBLICATION.READ",
        "Read research outputs within assigned access scope.",
      ],
      [
        "KNOWLEDGE.EXPERT.READ",
        "Search expert directory within organizational boundary.",
      ],
    ],
    authIdpTitle: "Authentication & IdP",
    authIdpDesc:
      "Keycloak/OIDC forms the central authentication boundary. Upstream providers are managed on the IdP without hardcoded credentials.",
    sessionsTitle: "Sessions & Security",
    sessionsDesc:
      "Active session tracking, revocation, and security audit telemetry reside in a dedicated workspace.",
    openSessions: "Open Security & Sessions →",
    accessAdminTitle: "Access Administration",
    accessAdminDesc:
      "User accounts, role definitions, and scoped context assignments managed through administrative APIs.",
    openAccessAdmin: "Open IAM Admin →",
  },
  ru: {
    kicker: "Управление доступом и идентификацией",
    title: "Панель управления IAM и безопасностью",
    description:
      "Интерфейс времени выполнения для идентификации, контекста сессии, прав и областей ресурсов. Бэкенд является единственным источником авторизации.",
    openAdmin: "Администрирование доступа →",
    gatewayContract: "Контракт шлюза безопасности",
    gatewayHeading: "Идентичность → Контекст → Права → Область ресурсов",
    gatewayDesc:
      "Модуль 01 не хранит публикации или экспертов, но предоставляет контекст безопасности для авторизации на уровне бэкенд-сервисов.",
    telemetry: [
      { label: "Идентификация", value: "Аутентифицированный участник" },
      { label: "Активный контекст", value: "В рамках сессии" },
      { label: "Сессия", value: "Проверена auth-service" },
      { label: "Авторизация", value: "Авторитетный бэкенд" },
    ],
    decisionFlowTitle: "Поток принятия решений по авторизации",
    decisionFlowDesc:
      "Визуализация границ безопасности без дублирования бизнес-правил сервера.",
    decisions: [
      [
        "01",
        "Определение личности",
        "Идентификация пользователя из действующего токена сессии.",
      ],
      [
        "02",
        "Определение контекста",
        "Применение активного контекста организации/проекта.",
      ],
      [
        "03",
        "Проверка полномочий",
        "Фронтенд адаптирует интерфейс; бэкенд строго валидирует права.",
      ],
      [
        "04",
        "Область ресурсов",
        "Ограничение действий рамками конкретного ресурса.",
      ],
      [
        "05",
        "Аудит действий",
        "Фиксация критических операций в журнале безопасности.",
      ],
    ],
    capabilitiesTitle: "Полномочия и область доступа",
    capabilitiesDesc:
      "Имена разрешений приведены для интеграции UI; серверный контракт авторитетен.",
    permissions: [
      ["IAM.USER.READ", "Чтение учетных данных в рамках выданного доступа."],
      ["IAM.ROLE.ASSIGN", "Назначение ролей при наличии прав оператора."],
      [
        "KNOWLEDGE.PUBLICATION.READ",
        "Чтение научных публикаций в заданной области.",
      ],
      ["KNOWLEDGE.EXPERT.READ", "Поиск в каталоге экспертов по контексту."],
    ],
    authIdpTitle: "Аутентификация & IdP",
    authIdpDesc:
      "Keycloak/OIDC обеспечивает центральную границу аутентификации. Внешние провайдеры настраиваются в IdP.",
    sessionsTitle: "Сессии и безопасность",
    sessionsDesc:
      "Управление активными сессиями, отзыв токенов и аудит безопасности.",
    openSessions: "Открыть безопасность и сессии →",
    accessAdminTitle: "Администрирование IAM",
    accessAdminDesc:
      "Учетные записи, роли и назначение контекстов через административные API.",
    openAccessAdmin: "Открыть IAM Admin →",
  },
};

export default function IamWorkspaceView() {
  const { locale } = useLocale();
  const t = iamCopy[locale] || iamCopy.vi;

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      {/* Header */}
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
          href="/workspace/iam/admin"
          className="rounded-[14px] bg-[var(--accent-primary)] px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
        >
          {t.openAdmin}
        </Link>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="pointer-events-none absolute right-8 top-8 size-24 opacity-[.035] [background:radial-gradient(circle,var(--accent-primary)_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
        <div className="relative z-10 grid gap-7 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)] xl:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent-primary)]">
              {t.gatewayContract}
            </span>
            <h2 className="mt-3 max-w-3xl text-2xl font-bold tracking-[-0.03em] text-text-primary sm:text-3xl">
              {t.gatewayHeading}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
              {t.gatewayDesc}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {t.telemetry.map((item) => (
              <div
                key={item.label}
                className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-secondary)] p-4"
              >
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">
                  {item.label}
                </span>
                <strong className="mt-2 block text-sm text-text-primary">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decision Flow and Capabilities Grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
        {/* Decision Flow */}
        <section className="app-panel p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-black text-text-primary">{t.decisionFlowTitle}</h3>
            <p className="mt-1 text-xs text-text-secondary">
              {t.decisionFlowDesc}
            </p>
          </div>
          <div className="mt-5 grid gap-3">
            {t.decisions.map(([index, title, description]) => (
              <div
                key={index}
                className="grid grid-cols-[42px_minmax(0,1fr)] gap-3 rounded-2xl border border-card-border bg-card-surface-area p-4 sm:grid-cols-[42px_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-xs font-black text-blue-600 dark:text-blue-400">
                  {index}
                </span>
                <div>
                  <strong className="text-sm font-bold text-text-primary">{title}</strong>
                  <span className="mt-1 block text-xs leading-5 text-text-secondary">
                    {description}
                  </span>
                </div>
                <span className="hidden rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 sm:inline-flex">
                  Boundary
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities & Resource Scope */}
        <section className="app-panel p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-black text-text-primary">{t.capabilitiesTitle}</h3>
            <p className="mt-1 text-xs text-text-secondary">
              {t.capabilitiesDesc}
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {t.permissions.map(([permission, description]) => (
              <div
                key={permission}
                className="rounded-2xl border border-card-border bg-card-surface-area p-4"
              >
                <code className="inline-block max-w-full [overflow-wrap:anywhere] rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-xs font-bold text-text-secondary">
                  {permission}
                </code>
                <p className="mt-2 text-xs leading-5 text-text-secondary font-medium">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 3 Domain Cards */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="app-panel p-5 sm:p-6">
          <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
            passkey
          </span>
          <h3 className="mt-4 text-lg font-black text-text-primary">{t.authIdpTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {t.authIdpDesc}
          </p>
        </section>

        <section className="app-panel p-5 sm:p-6">
          <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
            devices
          </span>
          <h3 className="mt-4 text-lg font-black text-text-primary">{t.sessionsTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {t.sessionsDesc}
          </p>
          <Link
            href="/workspace/iam/security"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t.openSessions}
          </Link>
        </section>

        <section className="app-panel p-5 sm:p-6">
          <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
            admin_panel_settings
          </span>
          <h3 className="mt-4 text-lg font-black text-text-primary">{t.accessAdminTitle}</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {t.accessAdminDesc}
          </p>
          <Link
            href="/workspace/iam/admin"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t.openAccessAdmin}
          </Link>
        </section>
      </div>
    </div>
  );
}
