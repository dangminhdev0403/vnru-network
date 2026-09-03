"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { useIamAdministration } from "@/features/iam/hooks";
import { confirmAction, showError, showToast } from "@/lib/alerts";
import { PERMISSION_CATALOG } from "../config/rbac-catalog";
import { formatRoleName } from "../config/role-display";

/* ─── i18n copy ──────────────────────────────────────────────────────── */

const copy: Record<Locale, Record<string, string>> = {
  vi: {
    backToRoles: "Danh sách vai trò",
    systemRole: "Vai trò hệ thống",
    customRole: "Vai trò tùy chỉnh",
    active: "Đang hoạt động",
    tabOverview: "Tổng quan",
    tabPermissions: "Quyền hạn",
    tabUsers: "Người dùng",
    editRole: "Chỉnh sửa quyền",
    cloneRole: "Nhân bản",
    saveChanges: "Lưu thay đổi",
    cancel: "Hủy",
    reset: "Đặt lại cấu hình ban đầu",
    resetShort: "Đặt lại",
    resetToast: "Đã khôi phục về cấu hình ban đầu",
    unsaved: "Thay đổi chưa lưu",
    permissionsCount: "quyền hạn",
    usersCount: "người dùng",
    scopeSection: "Phạm vi áp dụng (Access Scope)",
    scopeDesc:
      "Xác định giới hạn dữ liệu và ranh giới bảo mật cho các quyền được gán.",
    filterAll: "Tất cả module",
    filterGranted: "Đã cấp",
    filterNotGranted: "Chưa cấp",
    moduleIam: "Quản trị danh tính (IAM)",
    moduleContent: "Nội dung & Portal",
    moduleCollaboration: "Hợp tác & Đề xuất",
    moduleKnowledge: "Tri thức & Ấn phẩm",
    searchPermissions: "Tìm quyền hạn...",
    granted: "được cấp",
    selectAll: "Chọn tất cả",
    deselectAll: "Bỏ chọn tất cả",
    usersAssignedTitle: "người dùng được phân công vai trò này",
    assignUserBtn: "Gán người dùng",
    colUser: "Người dùng",
    colStatus: "Trạng thái",
    colScope: "Ngữ cảnh",
    colActions: "Thao tác",
    noUsers: "Chưa có người dùng nào được gán vai trò này.",
    removeAssignment: "Gỡ vai trò",
    assignModalTitle: "Gán vai trò cho người dùng",
    selectUser: "Chọn người dùng...",
    contextTypeLabel: "Loại ngữ cảnh",
    contextIdLabel: "Mã ngữ cảnh",
    optional: "(tùy chọn)",
    confirmAssign: "Xác nhận gán",
    assigning: "Đang gán...",
    modalReviewTitle: "Lưu thay đổi quyền hạn?",
    modalReviewDesc: "Xác nhận cập nhật ma trận quyền hạn cho vai trò này.",
    grantedCapabilitiesTitle: "Danh sách quyền hạn được cấp",
    noPermsAssigned: "Chưa có quyền hạn nào được gán cho vai trò này.",
    systemInfoTitle: "Thông tin hệ thống",
    identifierId: "Mã định danh (ID):",
    classification: "Phân loại:",
    systemLocked: "Hệ thống (Bảo vệ)",
    customMutable: "Tùy chỉnh",
    statusLabel: "Trạng thái:",
    loadingRole: "Đang tải thông tin vai trò...",
    cloneSuccess: "Đã nhân bản cấu hình {role}",
    requestFailed: "Thao tác thất bại",
  },
  en: {
    backToRoles: "Back to Roles",
    systemRole: "System Role",
    customRole: "Custom Role",
    active: "Active",
    tabOverview: "Overview",
    tabPermissions: "Permissions",
    tabUsers: "Assigned Users",
    editRole: "Edit Permissions",
    cloneRole: "Clone Role",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    reset: "Reset to initial configuration",
    resetShort: "Reset",
    resetToast: "Reset permissions to initial configuration",
    unsaved: "Unsaved Changes",
    permissionsCount: "permissions",
    usersCount: "users",
    scopeSection: "Access Scope",
    scopeDesc: "Defines data boundaries and operational authorization scope.",
    filterAll: "All Modules",
    filterGranted: "Granted",
    filterNotGranted: "Not Granted",
    moduleIam: "Identity administration (IAM)",
    moduleContent: "Content & Portal",
    moduleCollaboration: "Collaboration & Proposals",
    moduleKnowledge: "Knowledge & Publications",
    searchPermissions: "Search permissions...",
    granted: "granted",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    usersAssignedTitle: "users currently assigned this role",
    assignUserBtn: "Assign User",
    colUser: "User",
    colStatus: "Status",
    colScope: "Scope",
    colActions: "Actions",
    noUsers: "No users currently hold this role.",
    removeAssignment: "Remove",
    assignModalTitle: "Assign Role to User",
    selectUser: "Select a user...",
    contextTypeLabel: "Context Type",
    contextIdLabel: "Context ID",
    optional: "(optional)",
    confirmAssign: "Confirm Assignment",
    assigning: "Assigning...",
    modalReviewTitle: "Save Permission Changes?",
    modalReviewDesc: "Confirm applying the new permission matrix to this role.",
    grantedCapabilitiesTitle: "Granted Capabilities",
    noPermsAssigned: "No permissions assigned to this role yet.",
    systemInfoTitle: "System Information",
    identifierId: "Identifier (ID):",
    classification: "Classification:",
    systemLocked: "System (Protected)",
    customMutable: "Custom",
    statusLabel: "Status:",
    loadingRole: "Loading role...",
    cloneSuccess: "Cloned configuration for {role}",
    requestFailed: "Action failed",
  },
  ru: {
    backToRoles: "К списку ролей",
    systemRole: "Системная роль",
    customRole: "Пользовательская роль",
    active: "Активна",
    tabOverview: "Обзор",
    tabPermissions: "Полномочия",
    tabUsers: "Пользователи",
    editRole: "Изменить права",
    cloneRole: "Клонировать",
    saveChanges: "Сохранить",
    cancel: "Отмена",
    reset: "Сбросить к исходной конфигурации",
    resetShort: "Сбросить",
    resetToast: "Восстановлена исходная конфигурация",
    unsaved: "Несохраненные изменения",
    permissionsCount: "полномочий",
    usersCount: "пользователей",
    scopeSection: "Область доступа (Access Scope)",
    scopeDesc:
      "Определяет границы данных и авторизации для назначенных полномочий.",
    filterAll: "Все модули",
    filterGranted: "Назначено",
    filterNotGranted: "Не назначено",
    moduleIam: "Управление идентификацией (IAM)",
    moduleContent: "Контент и портал",
    moduleCollaboration: "Сотрудничество и предложения",
    moduleKnowledge: "Знания и публикации",
    searchPermissions: "Поиск полномочий...",
    granted: "назначено",
    selectAll: "Выбрать все",
    deselectAll: "Снять все",
    usersAssignedTitle: "пользователей назначено на эту роль",
    assignUserBtn: "Назначить",
    colUser: "Пользователь",
    colStatus: "Статус",
    colScope: "Контекст",
    colActions: "Действия",
    noUsers: "В этой роли пока нет пользователей.",
    removeAssignment: "Отозвать",
    assignModalTitle: "Назначить роль пользователю",
    selectUser: "Выберите пользователя...",
    contextTypeLabel: "Тип контекста",
    contextIdLabel: "ID контекста",
    optional: "(опционально)",
    confirmAssign: "Подтвердить",
    assigning: "Назначение...",
    modalReviewTitle: "Сохранить изменения прав?",
    modalReviewDesc: "Подтвердите применение новой матрицы прав для этой роли.",
    grantedCapabilitiesTitle: "Список предоставленных прав",
    noPermsAssigned: "Этой роли пока не назначено никаких прав.",
    systemInfoTitle: "Системная информация",
    identifierId: "Идентификатор (ID):",
    classification: "Классификация:",
    systemLocked: "Системная (Защищена)",
    customMutable: "Пользовательская",
    statusLabel: "Статус:",
    loadingRole: "Загрузка роли...",
    cloneSuccess: "Конфигурация роли {role} клонирована",
    requestFailed: "Не удалось выполнить действие",
  },
};

type GrantFilter = "ALL" | "GRANTED" | "NOT_GRANTED";

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

/* ─── component ──────────────────────────────────────────────────────── */

export interface RoleDetailPageProps {
  roleId: string;
}

export default function RoleDetailPage({ roleId }: RoleDetailPageProps) {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const iam = useIamAdministration();

  const roles = useMemo(() => iam.roles.data ?? [], [iam.roles.data]);
  const users = useMemo(() => iam.users.data ?? [], [iam.users.data]);
  const selectedRole = roles.find((r) => r.id === roleId) ?? roles[0];
  const selectedRoleLabel = selectedRole
    ? formatRoleName(selectedRole.name, locale)
    : "";

  const [stagedPermissions, setStagedPermissions] =
    useState<Set<string> | null>(null);

  /* ── permissions filter ── */
  const [permQuery, setPermQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [grantFilter, setGrantFilter] = useState<GrantFilter>("ALL");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(["iam", "content", "collab", "knowledge"]),
  );

  const isSys = selectedRole ? isSystemRole(selectedRole.name) : false;
  const currentPermissions = useMemo(
    () => new Set(selectedRole?.permissions ?? []),
    [selectedRole],
  );
  const effectivePermissions = stagedPermissions ?? currentPermissions;
  const availablePermissionKeys = useMemo(
    () => new Set(roles.flatMap((role) => role.permissions ?? [])),
    [roles],
  );

  /* ── users with this role ── */
  const assignedUsers = useMemo(() => {
    if (!selectedRole) return [];
    return users.filter((u) => u.roles?.some((r) => r.id === selectedRole.id));
  }, [selectedRole, users]);

  /* ── module groups from catalog ── */
  const groupedModules = useMemo(() => {
    const map = new Map<string, typeof PERMISSION_CATALOG>();
    PERMISSION_CATALOG.forEach((item) => {
      if (!availablePermissionKeys.has(item.key)) return;
      const moduleName = item.module[locale] ?? item.module.vi;
      const resourceName = item.resource[locale] ?? item.resource.vi;
      const actionName = item.action[locale] ?? item.action.vi;

      // Filter query
      if (permQuery.trim()) {
        const q = permQuery.trim().toLowerCase();
        const matchesAction = actionName.toLowerCase().includes(q);
        const matchesResource = resourceName.toLowerCase().includes(q);
        if (!matchesAction && !matchesResource) return;
      }
      // Module filter
      if (moduleFilter && item.moduleKey !== moduleFilter) return;

      // Grant filter
      const isGranted = effectivePermissions.has(item.key);
      if (grantFilter === "GRANTED" && !isGranted) return;
      if (grantFilter === "NOT_GRANTED" && isGranted) return;

      const group = map.get(moduleName) ?? [];
      group.push(item);
      map.set(moduleName, group);
    });
    return [...map.entries()].map(([moduleName, items]) => ({
      moduleName,
      moduleKey: items[0]?.moduleKey ?? "iam",
      items,
    }));
  }, [
    permQuery,
    moduleFilter,
    grantFilter,
    effectivePermissions,
    availablePermissionKeys,
    locale,
  ]);

  /* ── toggle permission checkbox ── */
  const togglePermission = (key: string) => {
    if (isSys) return;
    setStagedPermissions((previous) => {
      const next = new Set(previous ?? currentPermissions);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /* ── toggle accordion ── */
  const toggleAccordion = (mod: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(mod)) next.delete(mod);
      else next.add(mod);
      return next;
    });
  };

  /* ── save permission changes ── */
  const handleSavePermissions = async () => {
    if (!selectedRole || isSys) return;
    const confirm = await confirmAction({
      title: t.modalReviewTitle,
      text: t.modalReviewDesc,
      confirmButtonText: t.saveChanges,
      cancelButtonText: t.cancel,
    });
    if (!confirm.isConfirmed) return;

    try {
      await iam.replaceRolePermissions.mutateAsync({
        roleId: selectedRole.id,
        permissions: [...effectivePermissions].sort(),
      });
      setStagedPermissions(null);
      showToast({ title: t.saveChanges, icon: "success" });
    } catch (cause) {
      showError(
        t.modalReviewTitle,
        cause instanceof Error ? cause.message : t.requestFailed,
      );
    }
  };

  /* ── reset permission changes ── */
  const handleResetPermissions = () => {
    setStagedPermissions(null);
    showToast({
      title: t.resetToast,
      icon: "info",
    });
  };

  if (!selectedRole) {
    return (
      <div className="p-8 text-center text-text-secondary">{t.loadingRole}</div>
    );
  }

  const dirty =
    stagedPermissions !== null &&
    ([...stagedPermissions].some((key) => !currentPermissions.has(key)) ||
      [...currentPermissions].some((key) => !stagedPermissions.has(key)));

  return (
    <div className="space-y-6">
      {/* ── Top Bar with back link ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/access/roles"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          {t.backToRoles}
        </Link>
      </div>

      {/* ── Role Identity Hero Card ── */}
      <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined grid size-16 shrink-0 place-items-center rounded-2xl bg-blue-50 text-3xl text-blue-600 ring-1 ring-blue-100 dark:bg-blue-950/50 dark:ring-blue-900">
              {isSys ? "admin_panel_settings" : "edit_square"}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {selectedRoleLabel}
                </h1>
                {isSys ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                    <span className="material-symbols-outlined text-xs">
                      lock
                    </span>
                    {t.systemRole}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-0.5 text-xs font-semibold text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                    {t.customRole}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {t.active}
                </span>
              </div>

              {/* Metadata row */}
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-text-secondary">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-base">
                    group
                  </span>
                  <strong className="text-slate-900 dark:text-white">
                    {assignedUsers.length}
                  </strong>{" "}
                  {t.usersCount}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-base">
                    key
                  </span>
                  <strong className="text-slate-900 dark:text-white">
                    {selectedRole.permissions?.length ?? 0}
                  </strong>{" "}
                  {t.permissionsCount}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {dirty && !isSys && (
              <>
                <button
                  type="button"
                  onClick={handleResetPermissions}
                  className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-[var(--surface-secondary)]"
                >
                  <span className="material-symbols-outlined text-base text-text-secondary">
                    restart_alt
                  </span>
                  {t.resetShort}
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={iam.replaceRolePermissions.isPending}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-base">
                    save
                  </span>
                  {t.saveChanges}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                showToast({
                  title: t.cloneSuccess.replace("{role}", selectedRoleLabel),
                  icon: "success",
                });
              }}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-[var(--surface-secondary)]"
            >
              <span className="material-symbols-outlined text-base">
                content_copy
              </span>
              {t.cloneRole}
            </button>
          </div>
        </div>
      </article>

      {/* ═══════════ PERMISSION MATRIX (FULL WIDTH) ═══════════ */}
      <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs">
        {/* Header & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] p-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.tabPermissions}
            </h3>
            <p className="text-xs text-text-secondary">
              <strong className="font-bold text-blue-600">
                {selectedRole.permissions?.length ?? 0}
              </strong>{" "}
              / {PERMISSION_CATALOG.length} {t.granted}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-0 basis-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 sm:basis-auto sm:min-w-[240px]">
              <span className="material-symbols-outlined text-base text-text-secondary">
                search
              </span>
              <input
                type="search"
                value={permQuery}
                onChange={(e) => setPermQuery(e.target.value)}
                placeholder={t.searchPermissions}
                className="w-full bg-transparent text-xs outline-none placeholder:text-text-secondary"
              />
            </div>

            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-text-primary outline-none sm:w-auto"
            >
              <option value="">{t.allModules}</option>
              <option value="iam">{t.moduleIam}</option>
              <option value="content">{t.moduleContent}</option>
              <option value="collab">{t.moduleCollaboration}</option>
              <option value="knowledge">{t.moduleKnowledge}</option>
            </select>

            <select
              value={grantFilter}
              onChange={(event) => {
                const value = event.target.value;
                if (
                  value === "ALL" ||
                  value === "GRANTED" ||
                  value === "NOT_GRANTED"
                ) {
                  setGrantFilter(value);
                }
              }}
              className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-text-primary outline-none sm:w-auto"
            >
              <option value="ALL">
                {t.filterGranted}: {t.all}
              </option>
              <option value="GRANTED">{t.grantedOnly}</option>
              <option value="NOT_GRANTED">{t.notGrantedOnly}</option>
            </select>
          </div>
        </div>

        {/* Module Accordions */}
        <div className="divide-y divide-[var(--border)]">
          {groupedModules.map((group) => {
            const isExpanded = expandedModules.has(group.moduleKey);
            const grantedInGroup = group.items.filter((p) =>
              effectivePermissions.has(p.key),
            ).length;

            return (
              <section key={group.moduleName} className="p-6">
                {/* Accordion Toggle Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(group.moduleKey)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-xl text-blue-600">
                      folder_open
                    </span>
                    <strong className="text-base font-bold text-slate-900 dark:text-white">
                      {group.moduleName}
                    </strong>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      {grantedInGroup} / {group.items.length} {t.granted}
                    </span>
                    <span className="material-symbols-outlined text-text-secondary">
                      {isExpanded ? "expand_less" : "expand_more"}
                    </span>
                  </div>
                </button>

                {/* Accordion Content Grid (Module → Resource → Action) */}
                {isExpanded && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((perm) => {
                      const isChecked = effectivePermissions.has(perm.key);
                      const resourceLabel =
                        perm.resource[locale] ?? perm.resource.vi;
                      const actionLabel = perm.action[locale] ?? perm.action.vi;
                      const descriptionLabel =
                        perm.description[locale] ?? perm.description.vi;

                      return (
                        <label
                          key={perm.key}
                          className={`flex items-start gap-3 rounded-2xl border p-4 transition-all ${
                            isChecked
                              ? "border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20"
                              : "border-[var(--border)] hover:bg-[var(--surface-secondary)]"
                          } ${isSys ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isSys}
                            onChange={() => togglePermission(perm.key)}
                            className={`mt-1 size-4 rounded accent-blue-600 ${
                              isSys
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                                {resourceLabel}
                              </span>
                              <span
                                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                  isChecked
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                                }`}
                              >
                                {isChecked ? t.statusGranted : t.statusDenied}
                              </span>
                            </div>
                            <strong className="mt-1 block text-sm font-semibold text-slate-900 dark:text-white">
                              {actionLabel}
                            </strong>
                            <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">
                              {descriptionLabel}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}

          {!groupedModules.length && (
            <div className="p-12 text-center text-sm text-text-secondary">
              {t.noPermsFound}
            </div>
          )}
        </div>

        {/* Sticky Editing Footer */}
        {dirty && !isSys && (
          <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">
                edit_note
              </span>
              <span className="text-xs font-semibold text-text-secondary">
                {t.unsaved}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetPermissions}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[var(--surface-secondary)] dark:text-slate-200"
              >
                <span className="material-symbols-outlined text-base text-text-secondary">
                  restart_alt
                </span>
                {t.reset}
              </button>
              <button
                type="button"
                disabled={iam.replaceRolePermissions.isPending}
                onClick={handleSavePermissions}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-40"
              >
                {t.saveChanges}
              </button>
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}
