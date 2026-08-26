"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { useIamAdministration } from "@/features/iam/hooks";
import { ApiError, type IamRole } from "@/features/iam/repository";
import { confirmAction, showError, showToast } from "@/lib/alerts";
import {
  PERMISSION_CATALOG,
  SCOPE_DESCRIPTIONS,
  type AccessScope,
} from "../config/rbac-catalog";
import { formatRoleName } from "../config/role-display";

const subscribeToClient = () => () => {};

/* ─── i18n copy ──────────────────────────────────────────────────────── */

const copy: Record<Locale, Record<string, string>> = {
  vi: {
    title: "Vai trò & quyền",
    desc: "Quản lý vai trò, phân quyền và phạm vi áp dụng trong hệ thống.",
    createRoleBtn: "Tạo vai trò",
    totalRoles: "Tổng vai trò",
    systemCount: "Hệ thống",
    customCount: "Tùy chỉnh",
    assignmentsCount: "Lượt phân công hoạt động",
    searchPlaceholder: "Tìm theo tên hoặc mã vai trò…",
    typeFilter: "Loại vai trò",
    statusFilter: "Trạng thái",
    moduleFilter: "Phân hệ",
    all: "Tất cả",
    system: "Hệ thống",
    custom: "Tùy chỉnh",
    active: "Hoạt động",
    inactive: "Tạm dừng",
    colRole: "Vai trò & Mã định danh",
    colType: "Phân loại",
    colUsers: "Người dùng",
    colPermissions: "Quyền hạn",
    colScope: "Phạm vi",
    colStatus: "Trạng thái",
    colUpdated: "Cập nhật",
    colActions: "Thao tác",
    viewDetails: "Xem chi tiết",
    editRole: "Chỉnh sửa quyền",
    cloneRole: "Nhân bản vai trò",
    disableRole: "Tạm dừng vai trò",
    enableRole: "Kích hoạt vai trò",
    deleteRole: "Xóa vai trò",
    systemLockedNote: "Vai trò hệ thống được bảo vệ",
    loading: "Đang tải dữ liệu IAM…",
    stale: "Đang hiển thị dữ liệu đã lưu trong bộ nhớ tạm.",
    denied: "Không có quyền truy cập quản trị vai trò trong ngữ cảnh hiện tại.",
    noRolesFound: "Không tìm thấy vai trò nào phù hợp với bộ lọc.",
    rowsPerPage: "Dòng trên trang",
    showing: "Hiển thị",
    of: "trên",
    roles: "vai trò",
    createModalTitle: "Tạo vai trò mới",
    step1Title: "1. Thông tin vai trò",
    step2Title: "2. Phân quyền",
    step3Title: "3. Phạm vi & Xác nhận",
    roleNameLabel: "Tên vai trò",
    roleCodeLabel: "Mã định danh (Role Code)",
    roleDescLabel: "Mô tả vai trò",
    roleScopeLabel: "Phạm vi áp dụng mặc định",
    cloneFromLabel: "Nhân bản từ vai trò có sẵn (Tùy chọn)",
    selectTemplate: "Chọn vai trò mẫu…",
    next: "Tiếp tục",
    prev: "Quay lại",
    createSubmit: "Xác nhận tạo vai trò",
    cancel: "Hủy",
    namePlaceholder: "Ví dụ: Chuyên viên thẩm định",
    codePlaceholder: "Ví dụ: PEER_REVIEWER",
    descPlaceholder:
      "Mô tả trách nhiệm và nhiệm vụ của vai trò này trong hệ thống…",
  },
  en: {
    title: "Roles & Permissions",
    desc: "Manage roles, permissions, and access scopes across the system.",
    createRoleBtn: "Create Role",
    totalRoles: "Total Roles",
    systemCount: "System",
    customCount: "Custom",
    assignmentsCount: "Active Assignments",
    searchPlaceholder: "Search by role name or code...",
    typeFilter: "Role Type",
    statusFilter: "Status",
    moduleFilter: "Module",
    all: "All",
    system: "System",
    custom: "Custom",
    active: "Active",
    inactive: "Inactive",
    colRole: "Role & Code",
    colType: "Type",
    colUsers: "Users",
    colPermissions: "Permissions",
    colScope: "Scope",
    colStatus: "Status",
    colUpdated: "Updated",
    colActions: "Actions",
    viewDetails: "View Details",
    editRole: "Edit Permissions",
    cloneRole: "Clone Role",
    disableRole: "Disable Role",
    enableRole: "Enable Role",
    deleteRole: "Delete Role",
    systemLockedNote: "Protected system role",
    loading: "Loading IAM roles...",
    stale: "Showing cached IAM data.",
    denied: "Access denied to role administration in the current context.",
    noRolesFound: "No roles matching current filters.",
    rowsPerPage: "Rows per page",
    showing: "Showing",
    of: "of",
    roles: "roles",
    createModalTitle: "Create New Role",
    step1Title: "1. Role Info",
    step2Title: "2. Permissions",
    step3Title: "3. Scope & Review",
    roleNameLabel: "Role Name",
    roleCodeLabel: "Role Code",
    roleDescLabel: "Description",
    roleScopeLabel: "Default Access Scope",
    cloneFromLabel: "Clone from existing role (Optional)",
    selectTemplate: "Select template role...",
    next: "Next",
    prev: "Back",
    createSubmit: "Confirm Creation",
    cancel: "Cancel",
    namePlaceholder: "e.g. Peer Reviewer",
    codePlaceholder: "e.g. PEER_REVIEWER",
    descPlaceholder:
      "Describe responsibilities and authorities for this role...",
  },
  ru: {
    title: "Роли và права",
    desc: "Управление ролями, полномочиями и областями доступа в системе.",
    createRoleBtn: "Создать роль",
    totalRoles: "Всего ролей",
    systemCount: "Системные",
    customCount: "Пользовательские",
    assignmentsCount: "Активные назначения",
    searchPlaceholder: "Поиск по названию или коду роли...",
    typeFilter: "Тип роли",
    statusFilter: "Статус",
    moduleFilter: "Модуль",
    all: "Все",
    system: "Системные",
    custom: "Пользовательские",
    active: "Активен",
    inactive: "Приостановлен",
    colRole: "Роль и код",
    colType: "Тип",
    colUsers: "Пользователи",
    colPermissions: "Права",
    colScope: "Область",
    colStatus: "Статус",
    colUpdated: "Обновлено",
    colActions: "Действия",
    viewDetails: "Подробнее",
    editRole: "Редактировать права",
    cloneRole: "Клонировать роль",
    disableRole: "Отключить роль",
    enableRole: "Включить роль",
    deleteRole: "Удалить роль",
    systemLockedNote: "Защищенная системная роль",
    loading: "Загрузка ролей IAM...",
    stale: "Отображаются кэшированные данные.",
    denied: "Доступ к управлению ролями запрещен в текущем контексте.",
    noRolesFound: "Роли, соответствующие фильтрам, не найдены.",
    rowsPerPage: "Строк на странице",
    showing: "Показано",
    of: "из",
    roles: "ролей",
    createModalTitle: "Создание новой роли",
    step1Title: "1. Информация",
    step2Title: "2. Права",
    step3Title: "3. Область и проверка",
    roleNameLabel: "Название роли",
    roleCodeLabel: "Код роли",
    roleDescLabel: "Описание",
    roleScopeLabel: "Область доступа по умолчанию",
    cloneFromLabel: "Клонировать из существующей роли (Опционально)",
    selectTemplate: "Выберите шаблон...",
    next: "Далее",
    prev: "Назад",
    createSubmit: "Подтвердить создание",
    cancel: "Отмена",
    namePlaceholder: "Например: Рецензент",
    codePlaceholder: "Например: PEER_REVIEWER",
    descPlaceholder: "Опишите обязанности и полномочия роли...",
  },
};

/* ─── helpers ────────────────────────────────────────────────────────── */

function isSystemRole(roleName: string) {
  const normalized = roleName.replace(/[\s_-]/g, "").toUpperCase();
  return (
    normalized === "SUPERADMIN" ||
    normalized === "PORTALADMIN" ||
    normalized === "MEMBER" ||
    normalized === "READER" ||
    normalized === "PORTALMEMBER"
  );
}

function resolveScopeForRole(roleName: string): AccessScope {
  const norm = roleName.toUpperCase();
  if (norm.includes("SUPER_ADMIN") || norm.includes("GLOBAL")) return "Global";
  if (
    norm.includes("PORTAL") ||
    norm.includes("CONTENT") ||
    norm.includes("REVIEWER")
  )
    return "Portal";
  if (norm.includes("ORG") || norm.includes("COORDINATOR"))
    return "Organization";
  return "Own";
}

/* ─── component ──────────────────────────────────────────────────────── */

export default function RoleListPage() {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const iam = useIamAdministration();

  const rawRoles = useMemo(() => iam.roles.data ?? [], [iam.roles.data]);
  const users = iam.users.data ?? [];
  const error = iam.roles.error;
  const denied = error instanceof ApiError && error.status === 403;

  /* ── search & filters ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "SYSTEM" | "CUSTOM">(
    "ALL",
  );
  const [moduleFilter, setModuleFilter] = useState("");
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(
    new Set(),
  );

  /* ── pagination ── */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  /* ── open actions dropdown ── */
  const [actionMenuRoleId, setActionMenuRoleId] = useState<string | null>(null);

  /* ── create role modal ── */
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2 | 3>(1);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCode, setNewRoleCode] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [newRoleScope, setNewRoleScope] = useState<AccessScope>("Portal");
  const [newRolePermissions, setNewRolePermissions] = useState<Set<string>>(
    new Set(),
  );
  const [cloneSourceId, setCloneSourceId] = useState("");
  const mounted = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (isCreateModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isCreateModalOpen]);

  /* ── calculate counts ── */
  const systemCount = rawRoles.filter((r) => isSystemRole(r.name)).length;
  const customCount = rawRoles.length - systemCount;
  const totalAssignments = users.reduce(
    (sum, user) => sum + (user.roles?.length ?? 0),
    0,
  );

  /* ── filtered list ── */
  const filteredRoles = useMemo(() => {
    return rawRoles.filter((role) => {
      const isSys = isSystemRole(role.name);
      if (typeFilter === "SYSTEM" && !isSys) return false;
      if (typeFilter === "CUSTOM" && isSys) return false;

      if (moduleFilter) {
        const hasModule = (role.permissions ?? []).some((p) =>
          p.toLowerCase().startsWith(moduleFilter.toLowerCase()),
        );
        if (!hasModule) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesName =
          role.name.toLowerCase().includes(q) ||
          formatRoleName(role.name, locale).toLowerCase().includes(q);
        const matchesPerm = (role.permissions ?? []).some((p) =>
          p.toLowerCase().includes(q),
        );
        if (!matchesName && !matchesPerm) return false;
      }

      return true;
    });
  }, [rawRoles, typeFilter, moduleFilter, searchQuery, locale]);

  /* ── paginated slice ── */
  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize));
  const currentPageRoles = filteredRoles.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  /* ── selection toggle ── */
  const toggleSelectAll = () => {
    if (selectedRoleIds.size === currentPageRoles.length) {
      setSelectedRoleIds(new Set());
    } else {
      setSelectedRoleIds(new Set(currentPageRoles.map((r) => r.id)));
    }
  };

  const toggleSelectRole = (id: string) => {
    setSelectedRoleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* ── quick actions ── */
  const handleCloneRole = (role: IamRole) => {
    setCloneSourceId(role.id);
    setNewRoleName(`${role.name}_CLONE`);
    setNewRoleCode(`${role.name}_CLONE`);
    setNewRolePermissions(new Set(role.permissions ?? []));
    setNewRoleScope(resolveScopeForRole(role.name));
    setCreateStep(1);
    setIsCreateModalOpen(true);
    setActionMenuRoleId(null);
  };

  const handleCreateSubmit = async () => {
    if (!newRoleCode.trim()) {
      showError(t.createModalTitle, "Mã vai trò không được để trống.");
      return;
    }
    showToast({
      title: `Đã chuẩn bị vai trò ${newRoleCode}. Phân quyền sẽ áp dụng trên ma trận!`,
      icon: "success",
    });
    setIsCreateModalOpen(false);
    setCreateStep(1);
    setNewRoleName("");
    setNewRoleCode("");
    setNewRoleDesc("");
    setNewRolePermissions(new Set());
  };

  /* ── denied boundary ── */
  if (denied) {
    return (
      <div className="grid min-h-[70vh] place-items-center p-6">
        <div className="max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-lg">
          <span className="material-symbols-outlined text-5xl text-amber-500">
            shield_person
          </span>
          <h1 className="mt-4 text-xl font-bold">{t.denied}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6 p-4 text-text-primary sm:p-6 lg:p-8">
      {/* ── 1. Page Header ── */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{t.desc}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCloneSourceId("");
            setNewRoleName("");
            setNewRoleCode("");
            setNewRoleDesc("");
            setNewRolePermissions(new Set());
            setCreateStep(1);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {t.createRoleBtn}
        </button>
      </header>

      {/* ── 2. Compact Metric Summary Bar ── */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-3.5 text-sm shadow-2xs">
        <span className="font-bold text-slate-900 dark:text-white">
          {rawRoles.length} {t.totalRoles}
        </span>
        <span className="text-text-secondary">·</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          <strong className="font-bold text-slate-900 dark:text-white">
            {systemCount}
          </strong>{" "}
          {t.systemCount}
        </span>
        <span className="text-text-secondary">·</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          <strong className="font-bold text-slate-900 dark:text-white">
            {customCount}
          </strong>{" "}
          {t.customCount}
        </span>
        <span className="text-text-secondary">·</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          <strong className="font-bold text-blue-600 dark:text-blue-400">
            {totalAssignments.toLocaleString()}
          </strong>{" "}
          {t.assignmentsCount}
        </span>
      </div>

      {/* ── 3. Search & Filter Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs">
        <div className="flex min-w-0 basis-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 sm:basis-auto sm:min-w-[280px] sm:flex-1">
          <span className="material-symbols-outlined text-lg text-text-secondary">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <select
            value={typeFilter}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "ALL" || value === "SYSTEM" || value === "CUSTOM") {
                setTypeFilter(value);
              }
              setPage(1);
            }}
            className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-text-primary outline-none hover:bg-[var(--surface-secondary)] sm:w-auto"
          >
            <option value="ALL">
              {t.typeFilter}: {t.all}
            </option>
            <option value="SYSTEM">{t.system}</option>
            <option value="CUSTOM">{t.custom}</option>
          </select>

          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-text-primary outline-none hover:bg-[var(--surface-secondary)] sm:w-auto"
          >
            <option value="">
              {t.moduleFilter}: {t.all}
            </option>
            <option value="iam">Quản trị IAM</option>
            <option value="portal">Cổng thành viên</option>
            <option value="content">Nội dung</option>
            <option value="collab">Hợp tác</option>
            <option value="knowledge">Kho tri thức</option>
          </select>

          {/* Quick Filter Pills */}
          <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setTypeFilter("ALL");
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                typeFilter === "ALL"
                  ? "bg-white text-blue-600 shadow-2xs dark:bg-slate-800 dark:text-blue-400"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.all} ({rawRoles.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setTypeFilter("SYSTEM");
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                typeFilter === "SYSTEM"
                  ? "bg-white text-blue-600 shadow-2xs dark:bg-slate-800 dark:text-blue-400"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.system} ({systemCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setTypeFilter("CUSTOM");
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                typeFilter === "CUSTOM"
                  ? "bg-white text-blue-600 shadow-2xs dark:bg-slate-800 dark:text-blue-400"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.custom} ({customCount})
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Scalable Data Table ── */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--surface-secondary)] text-[11px] font-bold uppercase tracking-[.06em] text-text-secondary">
              <tr>
                <th className="w-12 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={
                      currentPageRoles.length > 0 &&
                      selectedRoleIds.size === currentPageRoles.length
                    }
                    onChange={toggleSelectAll}
                    className="size-4 rounded accent-blue-600"
                  />
                </th>
                <th className="px-4 py-3.5">{t.colRole}</th>
                <th className="px-4 py-3.5">{t.colType}</th>
                <th className="px-4 py-3.5">{t.colUsers}</th>
                <th className="px-4 py-3.5">{t.colPermissions}</th>
                <th className="px-4 py-3.5">{t.colScope}</th>
                <th className="px-4 py-3.5">{t.colStatus}</th>
                <th className="px-4 py-3.5 text-right">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {currentPageRoles.map((role) => {
                const isSys = isSystemRole(role.name);
                const scope = resolveScopeForRole(role.name);
                const scopeMeta = SCOPE_DESCRIPTIONS[scope];
                const userCount = users.filter((u) =>
                  u.roles?.some((r) => r.id === role.id),
                ).length;
                const isSelected = selectedRoleIds.has(role.id);

                return (
                  <tr
                    key={role.id}
                    className={`group transition-colors hover:bg-blue-50/40 dark:hover:bg-slate-800/40 ${
                      isSelected ? "bg-blue-50/60 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRole(role.id)}
                        className="size-4 rounded accent-blue-600"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/access/roles/${role.id}`}
                        className="flex items-center gap-3 font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                      >
                        <span className="material-symbols-outlined grid size-8 place-items-center rounded-lg bg-blue-50 text-base text-blue-600 dark:bg-blue-950/50">
                          {isSys ? "admin_panel_settings" : "policy"}
                        </span>
                        <div>
                          <strong className="block font-bold tracking-tight">
                            {formatRoleName(role.name, locale)}
                          </strong>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      {isSys ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200/80 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                          <span className="material-symbols-outlined text-xs">
                            lock
                          </span>
                          System
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {userCount}
                      </span>{" "}
                      <span className="text-xs text-text-secondary">
                        {t.colUsers.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {role.permissions?.length ?? 0}
                      </span>{" "}
                      <span className="text-xs text-text-secondary">
                        {t.colPermissions.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${scopeMeta.color}`}
                      >
                        {scope}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {t.active}
                      </span>
                    </td>
                    <td className="relative px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setActionMenuRoleId(
                            actionMenuRoleId === role.id ? null : role.id,
                          )
                        }
                        className="rounded-lg p-1.5 text-text-secondary hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
                      >
                        <span className="material-symbols-outlined text-lg">
                          more_horiz
                        </span>
                      </button>

                      {/* Action Dropdown Menu */}
                      {actionMenuRoleId === role.id && (
                        <div
                          onMouseLeave={() => setActionMenuRoleId(null)}
                          className="absolute right-4 top-12 z-20 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl"
                        >
                          <Link
                            href={`/admin/access/roles/${role.id}`}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-text-primary hover:bg-[var(--surface-secondary)]"
                          >
                            <span className="material-symbols-outlined text-base">
                              visibility
                            </span>
                            {t.viewDetails}
                          </Link>
                          <Link
                            href={`/admin/access/roles/${role.id}`}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-text-primary hover:bg-[var(--surface-secondary)]"
                          >
                            <span className="material-symbols-outlined text-base">
                              edit
                            </span>
                            {t.editRole}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCloneRole(role)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-text-primary hover:bg-[var(--surface-secondary)]"
                          >
                            <span className="material-symbols-outlined text-base">
                              content_copy
                            </span>
                            {t.cloneRole}
                          </button>
                          {!isSys ? (
                            <button
                              type="button"
                              onClick={async () => {
                                setActionMenuRoleId(null);
                                const confirm = await confirmAction({
                                  title: t.disableRole,
                                  text: `Bạn có chắc chắn muốn tạm dừng vai trò ${formatRoleName(role.name, locale)}?`,
                                });
                                if (confirm.isConfirmed) {
                                  showToast({
                                    title: "Đã tạm dừng vai trò",
                                    icon: "success",
                                  });
                                }
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                            >
                              <span className="material-symbols-outlined text-base">
                                block
                              </span>
                              {t.disableRole}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {!currentPageRoles.length && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-12 text-center text-sm text-text-secondary"
                  >
                    <span className="material-symbols-outlined mb-2 text-4xl text-slate-300">
                      manage_search
                    </span>
                    <p>{t.noRolesFound}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── 5. Enterprise Pagination Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] px-5 py-3.5 text-sm text-text-secondary">
          <div>
            {t.showing}{" "}
            <strong className="font-semibold text-text-primary">
              {filteredRoles.length === 0 ? 0 : (page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filteredRoles.length)}
            </strong>{" "}
            {t.of}{" "}
            <strong className="font-semibold text-text-primary">
              {filteredRoles.length}
            </strong>{" "}
            {t.roles}
          </div>

          <div className="flex items-center gap-3">
            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="grid size-8 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-text-primary hover:bg-[var(--surface-secondary)] disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-base">
                  chevron_left
                </span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(0, 5)
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`grid size-8 place-items-center rounded-lg text-xs font-bold transition-colors ${
                      page === p
                        ? "bg-blue-600 text-white shadow-2xs"
                        : "border border-[var(--border)] bg-[var(--surface)] text-text-primary hover:bg-[var(--surface-secondary)]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              {totalPages > 5 && <span className="px-1">…</span>}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="grid size-8 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-text-primary hover:bg-[var(--surface-secondary)] disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Page Size Selector */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-text-primary outline-none"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 6. 3-Step Create Role Wizard Modal ── */}
      {mounted && isCreateModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
              <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-4 sm:items-center sm:px-6">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t.createModalTitle}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold">
                      <span
                        className={
                          createStep === 1
                            ? "text-blue-600 font-bold"
                            : "text-text-secondary"
                        }
                      >
                        {t.step1Title}
                      </span>
                      <span>→</span>
                      <span
                        className={
                          createStep === 2
                            ? "text-blue-600 font-bold"
                            : "text-text-secondary"
                        }
                      >
                        {t.step2Title}
                      </span>
                      <span>→</span>
                      <span
                        className={
                          createStep === 3
                            ? "text-blue-600 font-bold"
                            : "text-text-secondary"
                        }
                      >
                        {t.step3Title}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-lg p-1 text-text-secondary hover:bg-[var(--surface-secondary)]"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6">
                  {createStep === 1 && (
                    <div className="space-y-4">
                      {/* Clone Source Template */}
                      <div>
                        <label className="block text-xs font-bold text-text-secondary">
                          {t.cloneFromLabel}
                        </label>
                        <select
                          value={cloneSourceId}
                          onChange={(e) => {
                            const source = rawRoles.find(
                              (r) => r.id === e.target.value,
                            );
                            if (source) {
                              setCloneSourceId(source.id);
                              setNewRoleName(`${source.name}_CUSTOM`);
                              setNewRoleCode(`${source.name}_CUSTOM`);
                              setNewRolePermissions(
                                new Set(source.permissions ?? []),
                              );
                            }
                          }}
                          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm"
                        >
                          <option value="">{t.selectTemplate}</option>
                          {rawRoles.map((r) => (
                            <option key={r.id} value={r.id}>
                              {formatRoleName(r.name, locale)} (
                              {r.permissions?.length ?? 0} quyền)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-text-secondary">
                          {t.roleNameLabel}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder={t.namePlaceholder}
                          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-text-secondary">
                          {t.roleCodeLabel}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newRoleCode}
                          onChange={(e) =>
                            setNewRoleCode(
                              e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9_]/g, "_"),
                            )
                          }
                          placeholder={t.codePlaceholder}
                          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 font-mono text-sm outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-text-secondary">
                          {t.roleDescLabel}
                        </label>
                        <textarea
                          rows={3}
                          value={newRoleDesc}
                          onChange={(e) => setNewRoleDesc(e.target.value)}
                          placeholder={t.descPlaceholder}
                          className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                  )}

                  {createStep === 2 && (
                    <div className="space-y-3">
                      <p className="text-xs text-text-secondary">
                        Chọn các quyền hạn chức năng từ danh mục hệ thống cấp
                        cho vai trò này:
                      </p>
                      <div className="space-y-2">
                        {PERMISSION_CATALOG.map((perm) => {
                          const isChecked = newRolePermissions.has(perm.key);
                          return (
                            <label
                              key={perm.key}
                              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                                isChecked
                                  ? "border-blue-300 bg-blue-50/50 dark:bg-blue-950/20"
                                  : "border-[var(--border)] hover:bg-[var(--surface-secondary)]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setNewRolePermissions((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(perm.key))
                                      next.delete(perm.key);
                                    else next.add(perm.key);
                                    return next;
                                  });
                                }}
                                className="mt-1 size-4 rounded accent-blue-600"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                  <strong className="text-sm font-semibold">
                                    {perm.action[locale] ?? perm.action.vi}
                                  </strong>
                                  <code className="max-w-full break-all text-xs text-blue-600 dark:text-blue-400">
                                    {perm.key}
                                  </code>
                                </div>
                                <p className="mt-0.5 text-xs text-text-secondary">
                                  {perm.description[locale] ??
                                    perm.description.vi}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {createStep === 3 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-text-secondary">
                          {t.roleScopeLabel}
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {(
                            [
                              "Own",
                              "Organization",
                              "Portal",
                              "Global",
                            ] as AccessScope[]
                          ).map((sc) => (
                            <button
                              key={sc}
                              type="button"
                              onClick={() => setNewRoleScope(sc)}
                              className={`rounded-xl border p-3 text-center transition-all ${
                                newRoleScope === sc
                                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs dark:bg-blue-950/50 dark:text-blue-300 font-bold"
                                  : "border-[var(--border)] text-text-primary hover:bg-[var(--surface-secondary)]"
                              }`}
                            >
                              <span className="block text-sm font-bold">
                                {sc}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                          Tóm tắt cấu hình vai trò
                        </h4>
                        <dl className="mt-3 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <dt className="text-text-secondary">
                              Tên vai trò:
                            </dt>
                            <dd className="font-bold">{newRoleName || "—"}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-text-secondary">
                              Mã định danh:
                            </dt>
                            <dd className="font-mono font-bold text-blue-600">
                              {newRoleCode || "—"}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-text-secondary">
                              Quyền hạn đã chọn:
                            </dt>
                            <dd className="font-bold">
                              {newRolePermissions.size} quyền
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-text-secondary">Phạm vi:</dt>
                            <dd className="font-bold">{newRoleScope}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] px-4 py-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (createStep > 1)
                        setCreateStep((step) => (step === 3 ? 2 : 1));
                      else setIsCreateModalOpen(false);
                    }}
                    className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold"
                  >
                    {createStep === 1 ? t.cancel : t.prev}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (createStep < 3)
                        setCreateStep((step) => (step === 1 ? 2 : 3));
                      else handleCreateSubmit();
                    }}
                    className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    {createStep === 3 ? t.createSubmit : t.next}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
