"use client";

import { useMemo, useState } from "react";
import { useLocale, type Locale } from "@/app/HomeMotion";
import type { IamRole, IamUser } from "@/features/iam/repository";

const labels: Record<Locale, Record<string, string>> = {
  vi: {
    directory: "Danh mục vai trò", system: "Vai trò hệ thống", business: "Vai trò nghiệp vụ",
    searchRole: "Tìm vai trò", roleInfo: "Thông tin vai trò", permissions: "Quyền hạn",
    assignments: "Gán người dùng", scope: "Phạm vi", audit: "Nhật ký", active: "Đang hoạt động",
    searchPermission: "Tìm quyền hạn", granted: "Đã cấp", notGranted: "Chưa cấp", edit: "Chỉnh sửa quyền",
    cancel: "Hủy", review: "Xem thay đổi", submit: "Submit thay đổi", unsaved: "Thay đổi chưa lưu",
    add: "thêm", remove: "gỡ", backendNote: "Backend hiện chỉ cung cấp role matrix dạng đọc. UI cho phép review thay đổi nhưng không giả lập mutation chưa có contract.",
    assignRole: "Gán vai trò", user: "Người dùng", contextType: "Loại ngữ cảnh", contextId: "Mã ngữ cảnh",
    confirmAssign: "Xác nhận gán vai trò", noAssignments: "Chưa chọn người dùng để gán.", platform: "Platform", organization: "Organization", resource: "Resource",
    scopeHelp: "Scope phải được backend xác thực khi role được gán.", auditHelp: "Audit trail của role/permission cần đọc từ backend khi API được cung cấp.",
    systemHint: "IAM / platform governance", businessHint: "Domain-scoped capability role", roleId: "Role ID", type: "Loại", effective: "Effective permissions",
    reviewTitle: "Review permission changes", close: "Đóng", unsupportedTitle: "Chưa có backend contract", unsupportedDesc: "Repository hiện chưa có endpoint để create/edit role-permission mapping. Thiết kế đã đặt đúng interaction point để nối mutation sau.",
  },
  en: {
    directory: "Role directory", system: "System roles", business: "Business roles", searchRole: "Search roles", roleInfo: "Role information",
    permissions: "Permissions", assignments: "Assignments", scope: "Scope", audit: "Audit", active: "Active", searchPermission: "Search permissions",
    granted: "Granted", notGranted: "Not granted", edit: "Edit permissions", cancel: "Cancel", review: "Review changes", submit: "Submit changes",
    unsaved: "Unsaved changes", add: "add", remove: "remove", backendNote: "The backend currently exposes the role matrix as read-only. The UI supports staging and reviewing changes without faking a missing mutation contract.",
    assignRole: "Assign role", user: "User", contextType: "Context type", contextId: "Context ID", confirmAssign: "Confirm assignment", noAssignments: "No user selected for assignment.",
    platform: "Platform", organization: "Organization", resource: "Resource", scopeHelp: "Scope is validated by the backend when a role is assigned.", auditHelp: "Role/permission audit data should come from backend once the API is available.",
    systemHint: "IAM / platform governance", businessHint: "Domain-scoped capability role", roleId: "Role ID", type: "Type", effective: "Effective permissions",
    reviewTitle: "Review permission changes", close: "Close", unsupportedTitle: "Backend contract not available", unsupportedDesc: "The repository does not currently expose create/edit role-permission mapping endpoints. The interaction point is ready for the future mutation.",
  },
  ru: {
    directory: "Каталог ролей", system: "Системные роли", business: "Бизнес-роли", searchRole: "Поиск ролей", roleInfo: "Информация о роли",
    permissions: "Права", assignments: "Назначения", scope: "Область", audit: "Аудит", active: "Активна", searchPermission: "Поиск прав",
    granted: "Предоставлено", notGranted: "Не предоставлено", edit: "Изменить права", cancel: "Отмена", review: "Просмотр изменений", submit: "Отправить изменения",
    unsaved: "Несохранённые изменения", add: "добавить", remove: "удалить", backendNote: "Сервер сейчас предоставляет матрицу ролей только для чтения. Интерфейс позволяет подготовить и проверить изменения без имитации отсутствующего API.",
    assignRole: "Назначить роль", user: "Пользователь", contextType: "Тип контекста", contextId: "ID контекста", confirmAssign: "Подтвердить назначение", noAssignments: "Пользователь не выбран.",
    platform: "Platform", organization: "Organization", resource: "Resource", scopeHelp: "Область проверяется сервером при назначении роли.", auditHelp: "Данные аудита должны загружаться с сервера после появления API.",
    systemHint: "IAM / управление платформой", businessHint: "Роль с доменными полномочиями", roleId: "ID роли", type: "Тип", effective: "Эффективные права",
    reviewTitle: "Проверка изменений прав", close: "Закрыть", unsupportedTitle: "Нет серверного контракта", unsupportedDesc: "В репозитории пока нет endpoint для изменения связи role-permission. Точка взаимодействия готова к подключению mutation.",
  },
};

const permissionNames: Record<string, string> = {
  "iam.roles.manage": "Manage roles and permissions", "iam.users.manage": "Manage users", "knowledge.workspace.view": "Access knowledge workspace",
  "experts.matches.view": "View expert suggestions", "grants.opportunities.create": "Create funding opportunities", "grants.opportunities.publish": "Publish funding opportunities",
  "grants.proposals.create": "Create proposals", "grants.proposals.submit": "Submit proposals", "reviews.assignments.manage": "Manage review assignments",
  "reviews.evaluations.submit": "Submit reviews", "projects.projects.view": "View projects", "projects.milestones.update": "Update milestones",
};

function isSystemRole(role: IamRole) {
  return role.name.replace(/[\s_-]/g, "").toUpperCase() === "SUPERADMIN" || role.name.toUpperCase().includes("ADMIN");
}

export default function RolePermissionsConsole({
  roles,
  users,
  selectedRoleId,
  onSelectRole,
  onAssign,
}: Readonly<{
  roles: IamRole[];
  users: IamUser[];
  selectedRoleId: string;
  onSelectRole: (id: string) => void;
  onAssign: (userId: string, roleId: string, contextType?: string, contextId?: string) => Promise<void>;
}>) {
  const { locale } = useLocale(); const t = labels[locale] ?? labels.vi;
  const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0];
  const [roleQuery, setRoleQuery] = useState(""); const [permissionQuery, setPermissionQuery] = useState("");
  const [tab, setTab] = useState<"permissions" | "assignments" | "scope" | "audit">("permissions");
  const [editing, setEditing] = useState(false); const [staged, setStaged] = useState<Set<string>>(new Set(selectedRole?.permissions ?? []));
  const [reviewOpen, setReviewOpen] = useState(false); const [unsupportedOpen, setUnsupportedOpen] = useState(false);
  const [userId, setUserId] = useState(""); const [contextType, setContextType] = useState(""); const [contextId, setContextId] = useState(""); const [assigning, setAssigning] = useState(false);

  const allPermissions = useMemo(() => [...new Set(roles.flatMap((r) => r.permissions ?? []))].sort(), [roles]);
  const current = useMemo(() => new Set(selectedRole?.permissions ?? []), [selectedRole]);
  const visiblePermissions = allPermissions.filter((permission) => `${permission} ${permissionNames[permission] ?? permission}`.toLowerCase().includes(permissionQuery.toLowerCase()));
  const groups = useMemo(() => {
    const map = new Map<string, string[]>();
    visiblePermissions.forEach((permission) => { const key = permission.split(".")[0] || "other"; map.set(key, [...(map.get(key) ?? []), permission]); });
    return [...map.entries()];
  }, [visiblePermissions]);
  const added = [...staged].filter((p) => !current.has(p)); const removed = [...current].filter((p) => !staged.has(p)); const dirty = added.length + removed.length > 0;
  const filteredRoles = roles.filter((role) => `${role.name} ${role.id}`.toLowerCase().includes(roleQuery.toLowerCase()));
  const systemRoles = filteredRoles.filter(isSystemRole); const businessRoles = filteredRoles.filter((r) => !isSystemRole(r));

  const chooseRole = (id: string) => { onSelectRole(id); const next = roles.find((role) => role.id === id); setStaged(new Set(next?.permissions ?? [])); setEditing(false); setTab("permissions"); };
  const togglePermission = (permission: string) => { if (!editing) return; setStaged((prev) => { const next = new Set(prev); next.has(permission) ? next.delete(permission) : next.add(permission); return next; }); };
  const cancelEditing = () => { setStaged(new Set(selectedRole?.permissions ?? [])); setEditing(false); };
  const submitAssignment = async () => { if (!userId || !selectedRole) return; setAssigning(true); try { await onAssign(userId, selectedRole.id, contextType || undefined, contextId || undefined); setUserId(""); setContextType(""); setContextId(""); } finally { setAssigning(false); } };

  const roleButton = (role: IamRole) => (
    <button key={role.id} type="button" onClick={() => chooseRole(role.id)} className={`mb-1 w-full rounded-xl border px-3 py-3 text-left transition ${selectedRole?.id === role.id ? "border-[color-mix(in_srgb,var(--accent-primary)_35%,var(--border))] bg-[color-mix(in_srgb,var(--accent-primary)_9%,var(--surface-secondary))]" : "border-transparent hover:bg-[var(--surface-secondary)]"}`}>
      <strong className="block truncate text-sm">{role.name}</strong><span className="mt-1 block text-xs text-text-secondary">{role.permissions?.length ?? 0} {t.permissions.toLowerCase()}</span>
    </button>
  );

  return <section className="grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
    <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="flex items-center justify-between px-2 py-1"><div><h2 className="text-lg font-semibold">{t.directory}</h2><p className="text-xs text-text-secondary">{roles.length} roles</p></div><span className="material-symbols-outlined text-[var(--accent-primary)]">shield_person</span></div>
      <input value={roleQuery} onChange={(e) => setRoleQuery(e.target.value)} placeholder={t.searchRole} className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)]" />
      <div className="mt-4 max-h-[68vh] overflow-y-auto pr-1">
        {systemRoles.length ? <><p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[.12em] text-text-secondary">{t.system}</p>{systemRoles.map(roleButton)}</> : null}
        {businessRoles.length ? <><p className="mt-4 px-2 pb-1 text-[10px] font-bold uppercase tracking-[.12em] text-text-secondary">{t.business}</p>{businessRoles.map(roleButton)}</> : null}
      </div>
    </aside>

    <div className="min-w-0 space-y-4">
      <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex flex-wrap items-start gap-4 p-5">
          <span className="material-symbols-outlined grid size-12 place-items-center rounded-[14px] bg-[var(--surface-secondary)] text-[var(--accent-primary)]">policy</span>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-semibold">{selectedRole?.name ?? "—"}</h2><span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">{t.active}</span></div><p className="mt-1 text-sm text-text-secondary">{isSystemRole(selectedRole ?? {id:"",name:"",permissions:[]}) ? t.systemHint : t.businessHint}</p><div className="mt-3 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-[var(--surface-secondary)] px-2.5 py-1">{t.roleId}: {selectedRole?.id}</span><span className="rounded-full bg-[var(--surface-secondary)] px-2.5 py-1">{t.effective}: {selectedRole?.permissions?.length ?? 0}</span></div></div>
          {tab === "permissions" ? <button type="button" onClick={() => { setEditing(true); setStaged(new Set(selectedRole?.permissions ?? [])); }} className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-sm font-bold hover:bg-[var(--surface-secondary)]">{t.edit}</button> : null}
        </div>
        <nav className="flex overflow-x-auto border-t border-[var(--border)] px-4">{(["permissions","assignments","scope","audit"] as const).map((id) => <button key={id} onClick={() => setTab(id)} className={`min-h-12 whitespace-nowrap border-b-2 px-3 text-sm font-bold ${tab === id ? "border-[var(--accent-primary)] text-[var(--accent-primary)]" : "border-transparent text-text-secondary"}`}>{t[id]}</button>)}</nav>
      </article>

      {tab === "permissions" ? <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-5"><div><h3 className="text-lg font-semibold">{t.permissions}</h3><p className="mt-1 text-xs text-text-secondary">{t.backendNote}</p></div><input value={permissionQuery} onChange={(e) => setPermissionQuery(e.target.value)} placeholder={t.searchPermission} className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none sm:w-72" /></header>
        <div className="grid gap-3 p-4">{groups.map(([group, permissions]) => <section key={group} className="overflow-hidden rounded-xl border border-[var(--border)]"><div className="flex items-center justify-between bg-[var(--surface-secondary)] px-4 py-3"><div><strong className="capitalize">{group}</strong><p className="text-xs text-text-secondary">{permissions.filter((p) => staged.has(p)).length}/{permissions.length} {t.granted.toLowerCase()}</p></div><span className="material-symbols-outlined text-text-secondary">expand_less</span></div><div className="divide-y divide-[var(--border)]">{permissions.map((permission) => <label key={permission} className={`grid items-center gap-3 px-4 py-3 sm:grid-cols-[28px_minmax(180px,1fr)_minmax(180px,1fr)_92px] ${editing ? "cursor-pointer hover:bg-[var(--surface-secondary)]" : ""}`}><input type="checkbox" checked={staged.has(permission)} disabled={!editing} onChange={() => togglePermission(permission)} className="size-4 accent-[var(--accent-primary)]" /><code className="break-all text-xs font-semibold">{permission}</code><span className="text-xs text-text-secondary">{permissionNames[permission] ?? permission}</span><span className={`justify-self-start rounded-full px-2.5 py-1 text-xs font-bold sm:justify-self-end ${staged.has(permission) ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-[var(--surface-secondary)] text-text-secondary"}`}>{staged.has(permission) ? t.granted : t.notGranted}</span></label>)}</div></section>)}</div>
        {editing ? <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 backdrop-blur"><div><strong className="text-sm">{t.unsaved}</strong><p className="text-xs text-text-secondary">+{added.length} {t.add} · −{removed.length} {t.remove}</p></div><div className="flex gap-2"><button onClick={cancelEditing} className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-sm font-bold">{t.cancel}</button><button disabled={!dirty} onClick={() => setReviewOpen(true)} className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-sm font-bold disabled:opacity-40">{t.review}</button><button disabled={!dirty} onClick={() => setUnsupportedOpen(true)} className="rounded-xl bg-[var(--accent-primary)] px-3.5 py-2 text-sm font-bold text-white disabled:opacity-40">{t.submit}</button></div></div> : null}
      </article> : null}

      {tab === "assignments" ? <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold">{t.assignments}</h3><p className="mt-1 text-xs text-text-secondary">Identity → context → role. Assignment mutation already uses backend authorization.</p></div><span className="material-symbols-outlined text-[var(--accent-primary)]">person_add</span></div><div className="mt-5 grid gap-3 md:grid-cols-2"><label className="grid gap-1.5 text-xs font-bold">{t.user}<select value={userId} onChange={(e) => setUserId(e.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm font-normal"><option value="">—</option>{users.map((user) => <option key={user.id} value={user.id}>{user.email ?? user.id}</option>)}</select></label><label className="grid gap-1.5 text-xs font-bold">{t.contextType}<input value={contextType} onChange={(e) => setContextType(e.target.value)} placeholder="ORGANIZATION" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm font-normal" /></label><label className="grid gap-1.5 text-xs font-bold">{t.contextId}<input value={contextId} onChange={(e) => setContextId(e.target.value)} placeholder="Context ID" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm font-normal" /></label></div><div className="mt-4 flex justify-end"><button disabled={!userId || assigning} onClick={submitAssignment} className="rounded-xl bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">{assigning ? "…" : t.confirmAssign}</button></div></article> : null}

      {tab === "scope" ? <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><h3 className="text-lg font-semibold">{t.scope}</h3><p className="mt-1 text-xs text-text-secondary">{t.scopeHelp}</p><div className="mt-5 grid gap-3 md:grid-cols-3">{[[t.platform,"public"],[t.organization,"apartment"],[t.resource,"dataset"]].map(([name,icon], index) => <div key={name} className={`rounded-xl border p-4 ${index === (isSystemRole(selectedRole ?? {id:"",name:"",permissions:[]}) ? 0 : 1) ? "border-[var(--accent-primary)] bg-[color-mix(in_srgb,var(--accent-primary)_8%,var(--surface))]" : "border-[var(--border)]"}`}><span className="material-symbols-outlined text-[var(--accent-primary)]">{icon}</span><strong className="mt-3 block">{name}</strong><p className="mt-1 text-xs text-text-secondary">{index===0?"System-wide context":index===1?"Organization-scoped context":"Resource / assignment scoped context"}</p></div>)}</div></article> : null}

      {tab === "audit" ? <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><h3 className="text-lg font-semibold">{t.audit}</h3><p className="mt-1 text-xs text-text-secondary">{t.auditHelp}</p><div className="mt-5 rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-text-secondary"><span className="material-symbols-outlined mb-2 block">history</span>No role-permission audit endpoint is exposed in the current frontend contract.</div></article> : null}
    </div>

    {reviewOpen ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4"><section className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"><div className="flex items-center justify-between"><h3 className="text-lg font-bold">{t.reviewTitle}</h3><button onClick={() => setReviewOpen(false)} className="material-symbols-outlined">close</button></div><div className="mt-4 grid gap-2">{added.map((p) => <div key={p} className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 text-sm"><b>+ {t.add}</b><code className="ml-2 text-xs">{p}</code></div>)}{removed.map((p) => <div key={p} className="rounded-xl border border-red-500/25 bg-red-500/5 p-3 text-sm"><b>− {t.remove}</b><code className="ml-2 text-xs">{p}</code></div>)}</div><div className="mt-5 flex justify-end"><button onClick={() => setReviewOpen(false)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold">{t.close}</button></div></section></div> : null}
    {unsupportedOpen ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4"><section className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><span className="material-symbols-outlined text-3xl text-amber-600">contract_edit</span><h3 className="mt-3 text-lg font-bold">{t.unsupportedTitle}</h3><p className="mt-2 text-sm text-text-secondary">{t.unsupportedDesc}</p><div className="mt-5 flex justify-end"><button onClick={() => setUnsupportedOpen(false)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold">{t.close}</button></div></section></div> : null}
  </section>;
}
