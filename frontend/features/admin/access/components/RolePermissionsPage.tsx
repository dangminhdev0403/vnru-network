"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { useIamAdministration } from "@/features/iam/hooks";
import { ApiError, type IamRole } from "@/features/iam/repository";
import { confirmAction, showError, showToast } from "@/lib/alerts";
import { z } from "zod";
import { formatRoleName } from "../config/role-display";

/* ─── i18n copy ──────────────────────────────────────────────────────── */

const copy: Record<Locale, Record<string, string>> = {
  vi: {
    title: "Vai trò & quyền",
    desc: "Quản lý vai trò, phân quyền và phạm vi áp dụng trong hệ thống.",
    directory: "Danh sách vai trò",
    searchRole: "Tìm vai trò…",
    systemRoles: "SYSTEM ROLES",
    businessRoles: "CUSTOM ROLES",
    permissions: "Quyền hạn",
    usersTab: "Người dùng",
    active: "Đang hoạt động",
    systemRole: "System role",
    customRole: "Custom role",
    searchPermission: "Tìm quyền…",
    allModules: "Tất cả module",
    granted: "đã cấp",
    noPermission: "Không có quyền phù hợp.",
    noRole: "Không có vai trò phù hợp.",
    loading: "Đang tải dữ liệu IAM…",
    stale: "Đang hiển thị dữ liệu cũ.",
    denied: "Không có quyền truy cập IAM trong ngữ cảnh hiện tại.",
    editPermissions: "Chỉnh sửa vai trò",
    cancel: "Hủy",
    saveChanges: "Lưu thay đổi",
    unsaved: "Thay đổi chưa lưu",
    add: "thêm",
    remove: "gỡ",
    modalReviewTitle: "Xem lại thay đổi",
    modalReviewDesc: "Kiểm tra diff trước khi gửi thay đổi quyền.",
    requestFailed: "Yêu cầu thất bại",
    nUsers: "người dùng",
    nPermissions: "quyền hạn",
    noUsersInRole: "Chưa có người dùng nào được gán vai trò này.",
    userEmail: "Email",
    userStatus: "Trạng thái",
    assignUser: "Gán người dùng",
    assignTitle: "Gán vai trò cho người dùng",
    selectUser: "Chọn người dùng…",
    confirmAssign: "Xác nhận gán vai trò",
    assigning: "Đang gán…",
    contextTypeLabel: "Loại ngữ cảnh",
    contextIdLabel: "Mã ngữ cảnh (Context ID)",
    optional: "tùy chọn",
    contextPlaceholder: "Ví dụ: org-123 hoặc board-456",
    close: "Đóng",
  },
  en: {
    title: "Roles & Permissions",
    desc: "Manage roles, permissions and their application across the system.",
    directory: "Role directory",
    searchRole: "Search roles…",
    systemRoles: "SYSTEM ROLES",
    businessRoles: "CUSTOM ROLES",
    permissions: "Permissions",
    usersTab: "Users",
    active: "Active",
    systemRole: "System role",
    customRole: "Custom role",
    searchPermission: "Search permissions…",
    allModules: "All modules",
    granted: "granted",
    noPermission: "No matching permissions.",
    noRole: "No matching roles.",
    loading: "Loading IAM data…",
    stale: "Showing stale data.",
    denied: "IAM administration is not allowed in the current context.",
    editPermissions: "Edit role",
    cancel: "Cancel",
    saveChanges: "Save changes",
    unsaved: "Unsaved changes",
    add: "add",
    remove: "remove",
    modalReviewTitle: "Review changes",
    modalReviewDesc: "Inspect the diff before submitting permission changes.",
    requestFailed: "Request failed",
    nUsers: "users",
    nPermissions: "permissions",
    noUsersInRole: "No users assigned to this role yet.",
    userEmail: "Email",
    userStatus: "Status",
    assignUser: "Assign user",
    assignTitle: "Assign role to user",
    selectUser: "Select user…",
    confirmAssign: "Confirm assignment",
    assigning: "Assigning…",
    contextTypeLabel: "Context type",
    contextIdLabel: "Context ID",
    optional: "optional",
    contextPlaceholder: "Example: org-123 or board-456",
    close: "Close",
  },
  ru: {
    title: "Роли и права",
    desc: "Управление ролями, правами и областью их применения.",
    directory: "Каталог ролей",
    searchRole: "Поиск ролей…",
    systemRoles: "СИСТЕМНЫЕ РОЛИ",
    businessRoles: "ПОЛЬЗОВАТЕЛЬСКИЕ РОЛИ",
    permissions: "Права",
    usersTab: "Пользователи",
    active: "Активна",
    systemRole: "Системная роль",
    customRole: "Пользовательская роль",
    searchPermission: "Поиск прав…",
    allModules: "Все модули",
    granted: "предоставлено",
    noPermission: "Подходящие права не найдены.",
    noRole: "Подходящие роли не найдены.",
    loading: "Загрузка IAM…",
    stale: "Показаны устаревшие данные.",
    denied: "Нет доступа к управлению IAM в текущем контексте.",
    editPermissions: "Изменить роль",
    cancel: "Отмена",
    saveChanges: "Сохранить",
    unsaved: "Несохранённые изменения",
    add: "добавить",
    remove: "удалить",
    modalReviewTitle: "Проверка изменений",
    modalReviewDesc: "Проверьте diff перед отправкой изменений.",
    requestFailed: "Запрос не выполнен",
    nUsers: "пользователей",
    nPermissions: "прав",
    noUsersInRole: "В этой роли пока нет пользователей.",
    userEmail: "Эл. почта",
    userStatus: "Статус",
    assignUser: "Назначить пользователю",
    assignTitle: "Назначить роль пользователю",
    selectUser: "Выберите пользователя…",
    confirmAssign: "Подтвердить",
    assigning: "Назначение…",
    contextTypeLabel: "Тип контекста",
    contextIdLabel: "ID контекста",
    optional: "опционально",
    contextPlaceholder: "Например: org-123 или board-456",
    close: "Закрыть",
  },
};

const permissionLabels: Record<Locale, Record<string, string>> = {
  vi: {
    "iam.audit.view": "Xem nhật ký kiểm toán",
    "iam.roles.manage": "Quản lý vai trò và quyền hạn",
    "iam.users.manage": "Quản lý người dùng",
    "portal.member.access": "Truy cập khu vực thành viên",
  },
  en: {
    "iam.audit.view": "View audit logs",
    "iam.roles.manage": "Manage roles and permissions",
    "iam.users.manage": "Manage users",
    "portal.member.access": "Access member area",
  },
  ru: {
    "iam.audit.view": "Просмотр журнала аудита",
    "iam.roles.manage": "Управление ролями и правами",
    "iam.users.manage": "Управление пользователями",
    "portal.member.access": "Доступ к разделу участников",
  },
};

const groupLabels: Record<Locale, Record<string, string>> = {
  vi: { iam: "Danh tính & truy cập", portal: "Portal thành viên" },
  en: { iam: "Identity & access", portal: "Member portal" },
  ru: { iam: "Идентификация и доступ", portal: "Портал участников" },
};

/* ─── helpers ────────────────────────────────────────────────────────── */

type Tab = "permissions" | "users";

function isSystemRole(role: IamRole) {
  return role.name.replace(/[\s_-]/g, "").toUpperCase() === "SUPERADMIN";
}

/* ─── component ──────────────────────────────────────────────────────── */

export default function RolePermissionsPage() {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const iam = useIamAdministration();
  const roles = useMemo(() => iam.roles.data ?? [], [iam.roles.data]);
  const users = useMemo(() => iam.users.data ?? [], [iam.users.data]);
  const error = iam.roles.error ?? iam.users.error;
  const denied = error instanceof ApiError && error.status === 403;

  /* ── selection state ── */
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [roleQuery, setRoleQuery] = useState("");
  const [permissionQuery, setPermissionQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [tab, setTab] = useState<Tab>("permissions");
  const [editing, setEditing] = useState(false);
  const [staged, setStaged] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignContextType, setAssignContextType] = useState("PLATFORM");
  const [assignContextId, setAssignContextId] = useState("GLOBAL");
  const [assignError, setAssignError] = useState("");

  const selectedRole =
    roles.find((role) => role.id === selectedRoleId) ?? roles[0];
  const currentPermissions = useMemo(
    () => new Set(selectedRole?.permissions ?? []),
    [selectedRole],
  );
  const effectivePermissions = editing ? staged : currentPermissions;

  /* ── permission catalogue (union of all role permissions) ── */
  const permissionCatalogue = useMemo(
    () => [...new Set(roles.flatMap((role) => role.permissions ?? []))].sort(),
    [roles],
  );
  const modules = useMemo(
    () =>
      [
        ...new Set(
          permissionCatalogue.map(
            (permission) => permission.split(".")[0] || "other",
          ),
        ),
      ].sort(),
    [permissionCatalogue],
  );

  /* ── reset staged when role changes ── */
  const [prevRoleId, setPrevRoleId] = useState<string | undefined>(
    selectedRole?.id,
  );
  if (selectedRole && selectedRole.id !== prevRoleId) {
    setPrevRoleId(selectedRole.id);
    setStaged(new Set(selectedRole.permissions ?? []));
    setEditing(false);
    setExpandedGroups(new Set());
  }

  /* ── filtered roles ── */
  const visibleRoles = roles.filter((role) =>
    `${role.name} ${formatRoleName(role.name, locale)}`
      .toLowerCase()
      .includes(roleQuery.trim().toLowerCase()),
  );
  const systemRoles = visibleRoles.filter(isSystemRole);
  const businessRoles = visibleRoles.filter((role) => !isSystemRole(role));

  /* ── filtered permissions ── */
  const filteredCatalogue = permissionCatalogue.filter(
    (permission) =>
      (!moduleFilter || permission.startsWith(`${moduleFilter}.`)) &&
      `${permission} ${permissionLabels[locale][permission] ?? permission}`
        .toLowerCase()
        .includes(permissionQuery.trim().toLowerCase()),
  );
  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    filteredCatalogue.forEach((permission) => {
      const group = permission.split(".")[0] || "other";
      map.set(group, [...(map.get(group) ?? []), permission]);
    });
    return [...map.entries()].map(([name, items]) => ({ name, items }));
  }, [filteredCatalogue]);

  /* ── diff tracking ── */
  const added = [...staged].filter(
    (permission) => !currentPermissions.has(permission),
  );
  const removed = [...currentPermissions].filter(
    (permission) => !staged.has(permission),
  );
  const dirty = added.length + removed.length > 0;

  /* ── users in this role ── */
  const roleUsers = useMemo(
    () =>
      selectedRole
        ? users.filter((u) => u.roles?.some((r) => r.id === selectedRole.id))
        : [],
    [selectedRole, users],
  );

  /* ── handlers ── */
  const chooseRole = (role: IamRole) => {
    setSelectedRoleId(role.id);
    setStaged(new Set(role.permissions ?? []));
    setTab("permissions");
    setEditing(false);
  };

  const togglePermission = (permission: string) => {
    setStaged((previous) => {
      const next = new Set(previous);
      if (next.has(permission)) {
        next.delete(permission);
      } else {
        next.add(permission);
      }
      return next;
    });
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const savePermissions = async () => {
    if (!selectedRole || !dirty) return;
    const confirmation = await confirmAction({
      title: t.modalReviewTitle,
      text: t.modalReviewDesc,
      confirmButtonText: t.saveChanges,
      cancelButtonText: t.cancel,
    });
    if (!confirmation.isConfirmed) return;
    try {
      await iam.replaceRolePermissions.mutateAsync({
        roleId: selectedRole.id,
        permissions: [...staged].sort(),
      });
      setEditing(false);
      showToast({ title: t.saveChanges, icon: "success" });
    } catch (cause) {
      showError(
        t.modalReviewTitle,
        cause instanceof Error ? cause.message : t.requestFailed,
      );
    }
  };

  const assignRole = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = z
      .string()
      .trim()
      .min(1, t.selectUser)
      .safeParse(assignUserId);
    if (!parsed.success || !selectedRole)
      return setAssignError(
        parsed.success
          ? t.noRole
          : (parsed.error.issues[0]?.message ?? t.selectUser),
      );
    setAssignError("");
    if (!(await confirmAction({ title: t.confirmAssign })).isConfirmed) return;
    try {
      await iam.assignRole.mutateAsync({
        userId: parsed.data,
        roleId: selectedRole.id,
        contextType: assignContextType.trim() || undefined,
        contextId: assignContextId.trim() || undefined,
      });
      setAssignUserId("");
      setAssignContextId("");
      setShowAssignModal(false);
      showToast({ title: t.confirmAssign, icon: "success" });
    } catch (cause) {
      showError(
        t.assignTitle,
        cause instanceof Error ? cause.message : t.requestFailed,
      );
    }
  };

  /* ── denied state ── */
  if (denied)
    return (
      <div className="grid min-h-[70vh] place-items-center p-6">
        <div className="max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 text-center">
          <span className="material-symbols-outlined text-4xl text-amber-500">
            shield_person
          </span>
          <h1 className="mt-4 text-xl font-bold">{t.denied}</h1>
        </div>
      </div>
    );

  /* ── role button ── */
  const RoleButton = ({ role }: { role: IamRole }) => {
    const isSelected = selectedRole?.id === role.id;
    const isSys = isSystemRole(role);
    return (
      <button
        type="button"
        onClick={() => chooseRole(role)}
        className={`group relative mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
          isSelected
            ? "bg-blue-50/90 text-blue-700 shadow-2xs ring-1 ring-blue-200/80"
            : "text-slate-700 hover:bg-slate-50/90 hover:text-slate-900"
        }`}
      >
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl transition-colors ${
            isSelected
              ? "bg-white text-blue-600 shadow-2xs ring-1 ring-blue-200"
              : "border border-slate-200/90 bg-slate-100/70 text-slate-500 group-hover:border-slate-300 group-hover:bg-white group-hover:text-blue-600"
          }`}
          aria-hidden="true"
        >
          <span className="material-symbols-outlined text-lg">
            {isSys ? "admin_panel_settings" : "badge"}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-sm font-bold leading-snug line-clamp-1">
            {formatRoleName(role.name, locale)}
          </strong>
          <small
            className={`mt-0.5 block text-[11px] font-medium ${isSelected ? "text-blue-600/80" : "text-slate-500"}`}
          >
            {isSys ? t.systemRole : t.customRole}
          </small>
        </span>
      </button>
    );
  };

  /* ═══════════ RENDER ═══════════ */
  return (
    <div className="min-w-0 p-4 text-text-primary sm:p-6 lg:p-8">
      {/* ── page header ── */}
      <header className="mb-5">
        <h1 className="text-3xl font-bold tracking-[-.035em]">{t.title}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t.desc}</p>
      </header>

      {iam.isFetching ? (
        <p className="mb-3 text-xs text-[var(--accent-primary)]" role="status">
          {t.loading}
        </p>
      ) : null}
      {iam.hasStaleData ? (
        <p className="mb-3 text-xs text-amber-600" role="status">
          {t.stale}
        </p>
      ) : null}

      {/* ── main grid: sidebar + content ── */}
      <section className="grid min-w-0 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* ─── LEFT SIDEBAR ─── */}
        <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <div className="px-1 py-1">
            <h2 className="text-base font-semibold">{t.directory}</h2>
            <div className="relative mt-3">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-secondary">
                search
              </span>
              <input
                type="search"
                value={roleQuery}
                onChange={(event) => setRoleQuery(event.target.value)}
                placeholder={t.searchRole}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
          <div className="mt-3 max-h-[72vh] overflow-y-auto pr-1">
            {systemRoles.length ? (
              <>
                <p className="px-2 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[.14em] text-text-secondary">
                  {t.systemRoles}
                </p>
                {systemRoles.map((role) => (
                  <RoleButton key={role.id} role={role} />
                ))}
              </>
            ) : null}
            {businessRoles.length ? (
              <>
                <p className="mt-3 px-2 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[.14em] text-text-secondary">
                  {t.businessRoles}
                </p>
                {businessRoles.map((role) => (
                  <RoleButton key={role.id} role={role} />
                ))}
              </>
            ) : null}
            {!visibleRoles.length ? (
              <p className="p-3 text-sm text-text-secondary">{t.noRole}</p>
            ) : null}
          </div>
        </aside>

        {/* ─── RIGHT CONTENT ─── */}
        <div className="min-w-0 space-y-4">
          {/* ── role header card ── */}
          <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex flex-wrap items-start gap-4 p-5">
              <span className="material-symbols-outlined grid size-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[28px] text-blue-600 ring-1 ring-blue-100">
                {selectedRole && isSystemRole(selectedRole)
                  ? "admin_panel_settings"
                  : "edit_square"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {selectedRole?.name ?? "—"}
                  </h2>
                  {selectedRole ? (
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      {t.active}
                    </span>
                  ) : null}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-blue-500">
                      {selectedRole && isSystemRole(selectedRole)
                        ? "verified_user"
                        : "tune"}
                    </span>
                    {selectedRole && isSystemRole(selectedRole)
                      ? t.systemRole
                      : t.customRole}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">
                      group
                    </span>
                    {roleUsers.length} {t.nUsers}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">
                      key
                    </span>
                    {selectedRole?.permissions?.length ?? 0} {t.nPermissions}
                  </span>
                </div>
              </div>
              {selectedRole &&
              !isSystemRole(selectedRole) &&
              tab === "permissions" &&
              !editing ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setStaged(new Set(selectedRole.permissions ?? []));
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:brightness-110"
                >
                  <span className="material-symbols-outlined text-lg">
                    edit
                  </span>
                  {t.editPermissions}
                </button>
              ) : null}
            </div>

            {/* ── tabs ── */}
            <nav className="flex border-t border-[var(--border)] px-5">
              {(["permissions", "users"] as Tab[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`min-h-12 whitespace-nowrap border-b-2 px-4 text-sm font-bold transition-colors ${
                    tab === id
                      ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {id === "permissions" ? t.permissions : t.usersTab}
                </button>
              ))}
            </nav>
          </article>

          {/* ══════ PERMISSIONS TAB ══════ */}
          {tab === "permissions" ? (
            <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              {/* search + filter bar */}
              <header className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] p-4">
                <h3 className="text-base font-semibold">{t.permissions}</h3>
                <span className="text-xs text-text-secondary">
                  {selectedRole?.permissions?.length ?? 0}/
                  {permissionCatalogue.length} {t.granted}
                </span>
                <div className="ml-auto flex flex-wrap gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-base text-text-secondary">
                      search
                    </span>
                    <input
                      type="search"
                      value={permissionQuery}
                      onChange={(event) =>
                        setPermissionQuery(event.target.value)
                      }
                      placeholder={t.searchPermission}
                      className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] py-2 pl-9 pr-3 text-sm outline-none sm:w-52"
                    />
                  </div>
                  <select
                    value={moduleFilter}
                    onChange={(event) => setModuleFilter(event.target.value)}
                    className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                  >
                    <option value="">{t.allModules}</option>
                    {modules.map((module) => (
                      <option key={module} value={module}>
                        {groupLabels[locale][module] ?? module}
                      </option>
                    ))}
                  </select>
                </div>
              </header>

              {/* permission groups */}
              <div className="space-y-3 p-4">
                {groups.map((group) => {
                  const isOpen = expandedGroups.has(group.name);
                  const grantedCount = group.items.filter((p) =>
                    effectivePermissions.has(p),
                  ).length;
                  return (
                    <section
                      key={group.name}
                      className="overflow-hidden rounded-xl border border-[var(--border)]"
                    >
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.name)}
                        className="flex min-h-12 w-full items-center justify-between gap-4 bg-[var(--surface-secondary)] px-4 py-3 text-left"
                      >
                        <span className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[var(--accent-primary)]">
                            folder_open
                          </span>
                          <strong className="text-sm">
                            {groupLabels[locale][group.name] ?? group.name}
                          </strong>
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--accent-primary)]">
                            {grantedCount} / {group.items.length}
                          </span>
                          <span className="material-symbols-outlined text-text-secondary">
                            {isOpen ? "expand_less" : "expand_more"}
                          </span>
                        </span>
                      </button>
                      {isOpen ? (
                        <div className="grid gap-x-4 gap-y-0 border-t border-[var(--border)] p-4 sm:grid-cols-2 lg:grid-cols-3">
                          {group.items.map((permission) => (
                            <label
                              key={permission}
                              className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--surface-secondary)]"
                            >
                              <input
                                type="checkbox"
                                checked={effectivePermissions.has(permission)}
                                disabled={!editing}
                                onChange={() => togglePermission(permission)}
                                className="size-4 shrink-0 rounded accent-[var(--accent-primary)]"
                              />
                              <span className="min-w-0 text-sm">
                                {permissionLabels[locale][permission] ??
                                  permission}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : null}
                    </section>
                  );
                })}
                {!groups.length ? (
                  <p className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-text-secondary">
                    {t.noPermission}
                  </p>
                ) : null}
              </div>

              {/* editing footer */}
              {editing ? (
                <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 backdrop-blur">
                  <div>
                    <strong className="text-sm">{t.unsaved}</strong>
                    <p className="text-xs text-text-secondary">
                      +{added.length} {t.add} · −{removed.length} {t.remove}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStaged(new Set(selectedRole?.permissions ?? []));
                        setEditing(false);
                      }}
                      className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="button"
                      disabled={!dirty || iam.replaceRolePermissions.isPending}
                      onClick={savePermissions}
                      className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
                    >
                      {t.saveChanges}
                    </button>
                  </div>
                </footer>
              ) : null}
            </article>
          ) : null}

          {/* ══════ USERS TAB ══════ */}
          {tab === "users" ? (
            <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-4">
                <h3 className="text-base font-semibold">
                  {t.usersTab}{" "}
                  <span className="font-normal text-text-secondary">
                    ({roleUsers.length})
                  </span>
                </h3>
                {selectedRole && !isSystemRole(selectedRole) ? (
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-[var(--accent-primary)] px-3 py-2 text-sm font-bold text-white"
                  >
                    <span className="material-symbols-outlined text-lg">
                      person_add
                    </span>
                    {t.assignUser}
                  </button>
                ) : null}
              </header>
              {roleUsers.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px] text-left text-sm">
                    <thead className="border-b border-[var(--border)] bg-[var(--surface-secondary)] text-[10px] uppercase tracking-[.06em] text-text-secondary">
                      <tr>
                        <th className="px-4 py-3">{t.userEmail}</th>
                        <th className="px-4 py-3">{t.userStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {roleUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-[var(--surface-secondary)]"
                        >
                          <td className="px-4 py-3 font-medium">
                            {user.email || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                user.status === "ACTIVE"
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                  : "bg-rose-500/10 text-rose-700 dark:text-rose-300"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-text-secondary">
                  {t.noUsersInRole}
                </div>
              )}
            </article>
          ) : null}
        </div>
      </section>

      {/* ═══ ASSIGN USER MODAL ═══ */}
      {showAssignModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <form
            noValidate
            onSubmit={assignRole}
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold">{t.assignTitle}</h3>
            {assignError && (
              <p
                id="assign-user-error"
                role="alert"
                className="mt-2 rounded-lg bg-rose-500/10 p-2 text-xs text-rose-600"
              >
                {assignError}
              </p>
            )}
            <p className="mt-1 text-xs text-text-secondary">
              {selectedRole
                ? formatRoleName(selectedRole.name, locale)
                : ""}
            </p>
            <label className="mt-4 block text-xs font-semibold text-text-secondary">
              {t.usersTab}
              <select
                value={assignUserId}
                onChange={(event) => setAssignUserId(event.target.value)}
                aria-invalid={Boolean(assignError)}
                aria-describedby={assignError ? "assign-user-error" : undefined}
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm"
              >
                <option value="">{t.selectUser}</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email || "—"}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-xs font-semibold text-text-secondary">
              {t.contextTypeLabel}{" "}
              <span className="font-normal text-text-secondary">
                {t.optional}
              </span>
              <select
                value={assignContextType}
                onChange={(event) => setAssignContextType(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm"
              >
                <option value="ORGANIZATION">ORGANIZATION</option>
                <option value="REVIEW_BOARD">REVIEW_BOARD</option>
                <option value="PLATFORM">PLATFORM</option>
              </select>
            </label>
            <label className="mt-3 block text-xs font-semibold text-text-secondary">
              {t.contextIdLabel}{" "}
              <span className="font-normal text-text-secondary">
                {t.optional}
              </span>
              <input
                type="text"
                value={assignContextId}
                onChange={(event) => setAssignContextId(event.target.value)}
                placeholder={t.contextPlaceholder}
                className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)]"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={iam.assignRole.isPending}
                className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-bold text-white"
              >
                {iam.assignRole.isPending ? t.assigning : t.confirmAssign}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
