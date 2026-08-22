"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocale, type Locale } from "@/app/HomeMotion";
import { useIamAdministration } from "@/features/iam/hooks";
import { ApiError, type IamRole } from "@/features/iam/repository";
import { confirmAction, showError, showToast } from "@/lib/alerts";

const copy: Record<Locale, Record<string, string>> = {
  vi: {
    title: "Vai trò & quyền", desc: "Quản lý vai trò, phân quyền và phạm vi áp dụng trong hệ thống.", directory: "Danh sách vai trò",
    searchRole: "Tìm vai trò…", systemRoles: "System roles", businessRoles: "Business roles", permissions: "Quyền hạn",
    assignments: "Gán người dùng", scope: "Phạm vi áp dụng", audit: "Nhật ký thay đổi", active: "Đang hoạt động",
    roleId: "ID vai trò", roleType: "Loại vai trò", systemRole: "System Role", businessRole: "Business Role",
    searchPermission: "Tìm quyền…", allModules: "Tất cả module", addPermission: "Thêm quyền", granted: "Đã cấp",
    notGranted: "Chưa cấp", permission: "Quyền", description: "Mô tả", status: "Trạng thái", quickActions: "Thao tác nhanh",
    assignUser: "Gán cho người dùng", reviewEffective: "Xem hiệu lực quyền", roleInfo: "Thông tin vai trò", statistics: "Thống kê",
    totalPermissions: "Tổng quyền", grantedPermissions: "Đã cấp", totalRoles: "Vai trò", users: "Người dùng",
    editPermissions: "Chỉnh sửa quyền", cancel: "Hủy", reviewChanges: "Xem thay đổi", saveChanges: "Lưu thay đổi",
    unsaved: "Thay đổi chưa lưu", add: "thêm", remove: "gỡ", modalAddTitle: "Thêm quyền cho vai trò",
    modalAddDesc: "Chỉ hiển thị capability đang tồn tại trong role matrix của backend.", continue: "Tiếp tục", modalReviewTitle: "Xem lại thay đổi",
    modalReviewDesc: "Kiểm tra diff trước khi gửi thay đổi quyền.", close: "Đóng",
    assignTitle: "Gán vai trò cho người dùng", selectUser: "Chọn người dùng…", confirmAssign: "Xác nhận gán vai trò", assigning: "Đang gán…",
    contextTypeLabel: "Loại ngữ cảnh", contextIdLabel: "Mã ngữ cảnh (Context ID)", optional: "tùy chọn",
    assignmentNote: "Endpoint hiện có cho phép gán role; backend tiếp tục là nguồn quyết định authorization.", noAssignments: "Frontend contract hiện chưa cung cấp danh sách assignment của từng role.",
    scopeNote: "Role contract hiện tại chưa expose scope metadata. Scope cụ thể được backend xác thực khi thực hiện assignment.",
    auditNote: "Frontend contract hiện chưa expose audit trail cho role-permission mapping.", noPermission: "Không có quyền phù hợp.",
    noRole: "Không có vai trò phù hợp.", readOnly: "Role matrix do backend cung cấp", loading: "Đang tải dữ liệu IAM…", stale: "Đang hiển thị dữ liệu cũ.",
    denied: "Không có quyền truy cập IAM trong ngữ cảnh hiện tại.", retry: "Làm mới", platformContext: "Platform / backend-managed context",
  },
  en: {
    title: "Roles & Permissions", desc: "Manage roles, permissions and their application across the system.", directory: "Role directory",
    searchRole: "Search roles…", systemRoles: "System roles", businessRoles: "Business roles", permissions: "Permissions",
    assignments: "Assignments", scope: "Scope", audit: "Audit log", active: "Active", roleId: "Role ID", roleType: "Role type",
    systemRole: "System Role", businessRole: "Business Role", searchPermission: "Search permissions…", allModules: "All modules",
    addPermission: "Add permission", granted: "Granted", notGranted: "Not granted", permission: "Permission", description: "Description",
    status: "Status", quickActions: "Quick actions", assignUser: "Assign user", reviewEffective: "View effective permissions",
    roleInfo: "Role information", statistics: "Statistics", totalPermissions: "Total permissions", grantedPermissions: "Granted",
    totalRoles: "Roles", users: "Users", editPermissions: "Edit permissions", cancel: "Cancel", reviewChanges: "Review changes",
    saveChanges: "Save changes", unsaved: "Unsaved changes", add: "add", remove: "remove", modalAddTitle: "Add permissions to role",
    modalAddDesc: "Only capabilities already exposed by the backend role matrix are listed.", continue: "Continue", modalReviewTitle: "Review changes",
    modalReviewDesc: "Inspect the diff before submitting permission changes.", close: "Close",
    assignTitle: "Assign role to user", selectUser: "Select user…", confirmAssign: "Confirm assignment", assigning: "Assigning…",
    contextTypeLabel: "Context type", contextIdLabel: "Context ID", optional: "optional",
    assignmentNote: "The existing endpoint supports role assignment; backend authorization remains authoritative.", noAssignments: "The frontend contract does not currently expose assignments per role.",
    scopeNote: "The current role contract does not expose scope metadata. Backend validates the effective scope during assignment.",
    auditNote: "The frontend contract does not currently expose role-permission audit history.", noPermission: "No matching permissions.",
    noRole: "No matching roles.", readOnly: "Backend-provided role matrix", loading: "Loading IAM data…", stale: "Showing stale data.",
    denied: "IAM administration is not allowed in the current context.", retry: "Refresh", platformContext: "Platform / backend-managed context",
  },
  ru: {
    title: "Роли и права", desc: "Управление ролями, правами и областью их применения.", directory: "Каталог ролей",
    searchRole: "Поиск ролей…", systemRoles: "Системные роли", businessRoles: "Бизнес-роли", permissions: "Права",
    assignments: "Назначения", scope: "Область", audit: "Аудит", active: "Активна", roleId: "ID роли", roleType: "Тип роли",
    systemRole: "Системная роль", businessRole: "Бизнес-роль", searchPermission: "Поиск прав…", allModules: "Все модули",
    addPermission: "Добавить право", granted: "Предоставлено", notGranted: "Не предоставлено", permission: "Право", description: "Описание",
    status: "Статус", quickActions: "Быстрые действия", assignUser: "Назначить пользователю", reviewEffective: "Эффективные права",
    roleInfo: "Информация о роли", statistics: "Статистика", totalPermissions: "Всего прав", grantedPermissions: "Предоставлено",
    totalRoles: "Роли", users: "Пользователи", editPermissions: "Изменить права", cancel: "Отмена", reviewChanges: "Просмотр изменений",
    saveChanges: "Сохранить", unsaved: "Несохранённые изменения", add: "добавить", remove: "удалить", modalAddTitle: "Добавить права роли",
    modalAddDesc: "Показываются только capability, уже присутствующие в матрице ролей backend.", continue: "Продолжить", modalReviewTitle: "Проверка изменений",
    modalReviewDesc: "Проверьте diff перед отправкой изменений.", close: "Закрыть",
    assignTitle: "Назначить роль пользователю", selectUser: "Выберите пользователя…", confirmAssign: "Подтвердить", assigning: "Назначение…",
    contextTypeLabel: "Тип контекста", contextIdLabel: "ID контекста", optional: "опционально",
    assignmentNote: "Существующий endpoint поддерживает назначение роли; backend остаётся источником авторизации.", noAssignments: "Текущий frontend-контракт не предоставляет список назначений роли.",
    scopeNote: "Текущий контракт роли не предоставляет metadata области. Backend проверяет область при назначении.",
    auditNote: "Frontend-контракт пока не предоставляет аудит связей role-permission.", noPermission: "Подходящие права не найдены.",
    noRole: "Подходящие роли не найдены.", readOnly: "Матрица ролей backend", loading: "Загрузка IAM…", stale: "Показаны устаревшие данные.",
    denied: "Нет доступа к управлению IAM в текущем контексте.", retry: "Обновить", platformContext: "Platform / backend-managed context",
  },
};

const roleLabels: Record<Locale, Record<string, string>> = {
  vi: { FOUNDATION_DECISION_MAKER: "Quản trị quyết định cộng tác", KNOWLEDGE_CURATOR: "Quản trị nội dung tri thức", ORGANIZATION_REPRESENTATIVE: "Đại diện tổ chức", COLLABORATION_MANAGER: "Quản lý cộng tác nghiên cứu", RESEARCHER: "Nhà nghiên cứu", REVIEWER: "Chuyên gia phản biện", SUPER_ADMIN: "Quản trị tối cao" },
  en: { FOUNDATION_DECISION_MAKER: "Collaboration decision administrator", KNOWLEDGE_CURATOR: "Knowledge curator", ORGANIZATION_REPRESENTATIVE: "Organization representative", COLLABORATION_MANAGER: "Collaboration manager", RESEARCHER: "Researcher", REVIEWER: "Reviewer", SUPER_ADMIN: "Super administrator" },
  ru: { FOUNDATION_DECISION_MAKER: "Администратор решений о сотрудничестве", KNOWLEDGE_CURATOR: "Куратор базы знаний", ORGANIZATION_REPRESENTATIVE: "Представитель организации", COLLABORATION_MANAGER: "Менеджер научного сотрудничества", RESEARCHER: "Исследователь", REVIEWER: "Эксперт-рецензент", SUPER_ADMIN: "Главный администратор" },
};

const permissionLabels: Record<Locale, Record<string, string>> = {
  vi: {"collab.proposals.screen": "Sàng lọc đề xuất cộng tác", "experts.matches.view": "Xem gợi ý kết nối chuyên gia", "collab.decisions.issue_foundation": "Ban hành quyết định cộng tác của Quỹ", "collab.opportunities.create": "Tạo cơ hội cộng tác nghiên cứu", "collab.opportunities.publish": "Công bố cơ hội cộng tác nghiên cứu", "collab.proposals.confirm_paired": "Xác nhận hồ sơ đề xuất song phương", "collab.proposals.create": "Tạo đề xuất cộng tác nghiên cứu", "collab.proposals.endorse": "Xác nhận hồ sơ thay mặt tổ chức", "collab.proposals.submit": "Nộp đề xuất cộng tác nghiên cứu", "iam.roles.manage": "Quản lý vai trò và quyền hạn", "iam.users.manage": "Quản lý người dùng", "knowledge.workspace.view": "Truy cập không gian tri thức", "projects.milestones.update": "Cập nhật mốc tiến độ dự án", "projects.projects.view": "Xem dự án", "projects.reports.approve": "Phê duyệt báo cáo dự án", "projects.reports.submit": "Nộp báo cáo dự án", "projects.reports.view_org": "Xem báo cáo dự án của tổ chức", "reviews.assignments.manage": "Quản lý phân công phản biện", "reviews.assignments.view_assigned": "Xem hồ sơ được phân công phản biện", "reviews.evaluations.score": "Chấm điểm phản biện", "reviews.evaluations.submit": "Nộp kết quả phản biện" },
  en: {"collab.proposals.screen": "Screen collaboration proposals", "experts.matches.view": "View expert matching signals", "collab.decisions.issue_foundation": "Issue Foundation collaboration decision", "collab.opportunities.create": "Create research opportunities", "collab.opportunities.publish": "Publish research opportunities", "collab.proposals.confirm_paired": "Confirm bilateral joint proposal pairing", "collab.proposals.create": "Create collaboration proposals", "collab.proposals.endorse": "Endorse proposals on behalf of institution", "collab.proposals.submit": "Submit collaboration proposals", "iam.roles.manage": "Manage roles and permissions", "iam.users.manage": "Manage users", "knowledge.workspace.view": "Access knowledge workspace", "projects.milestones.update": "Update project milestones", "projects.projects.view": "View projects", "projects.reports.approve": "Approve project reports", "projects.reports.submit": "Submit project reports", "projects.reports.view_org": "View institutional project reports", "reviews.assignments.manage": "Manage review assignments", "reviews.assignments.view_assigned": "View assigned reviews", "reviews.evaluations.score": "Score proposal reviews", "reviews.evaluations.submit": "Submit review evaluation" },
  ru: {"collab.proposals.screen": "Скрининг предложений о сотрудничестве", "experts.matches.view": "Просмотр сопоставлений экспертов", "collab.decisions.issue_foundation": "Принятие решения Фонда о сотрудничестве", "collab.opportunities.create": "Создание возможностей сотрудничества", "collab.opportunities.publish": "Публикация возможностей сотрудничества", "collab.proposals.confirm_paired": "Подтверждение двусторонней пары заявки", "collab.proposals.create": "Создание предложений о сотрудничестве", "collab.proposals.endorse": "Институциональное одобрение заявки", "collab.proposals.submit": "Подача предложений о сотрудничестве", "iam.roles.manage": "Управление ролями и правами", "iam.users.manage": "Управление пользователями", "knowledge.workspace.view": "Доступ к базе знаний", "projects.milestones.update": "Обновление этапов проекта", "projects.projects.view": "Просмотр проектов", "projects.reports.approve": "Утверждение отчетов по проекту", "projects.reports.submit": "Подача отчетов по проекту", "projects.reports.view_org": "Просмотр отчетов организации по проектам", "reviews.assignments.manage": "Управление назначениями на экспертизу", "reviews.assignments.view_assigned": "Просмотр назначенных экспертиз", "reviews.evaluations.score": "Оценка заявок", "reviews.evaluations.submit": "Отправка экспертной оценки" },
};

const groupLabels: Record<Locale, Record<string, string>> = {
  vi: { collab: "Cộng tác nghiên cứu", experts: "Mạng lưới chuyên gia", iam: "Danh tính & truy cập", knowledge: "Kho tri thức", projects: "Dự án nghiên cứu", reviews: "Phản biện" },
  en: { collab: "Research Collaboration", experts: "Expert Network", iam: "Identity & Access", knowledge: "Knowledge", projects: "Projects", reviews: "Review" },
  ru: { collab: "Научное сотрудничество", experts: "Сеть экспертов", iam: "Доступ и идентичность", knowledge: "База знаний", projects: "Проекты", reviews: "Экспертиза" },
};

type Tab = "permissions" | "assignments" | "scope" | "audit";
type Modal = "add" | "review" | "assign" | null;

function isSystemRole(role: IamRole) {
  return role.name.replace(/[\s_-]/g, "").toUpperCase() === "SUPERADMIN";
}

export default function RolePermissionsPage() {
  const { locale } = useLocale(); const t = copy[locale] ?? copy.vi;
  const iam = useIamAdministration(); const roles = useMemo(() => iam.roles.data ?? [], [iam.roles.data]); const users = iam.users.data ?? [];
  const error = iam.roles.error ?? iam.users.error; const denied = error instanceof ApiError && error.status === 403;
  const [selectedRoleId, setSelectedRoleId] = useState(""); const [roleQuery, setRoleQuery] = useState(""); const [permissionQuery, setPermissionQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState(""); const [tab, setTab] = useState<Tab>("permissions"); const [editing, setEditing] = useState(false);
  const [staged, setStaged] = useState<Set<string>>(new Set()); const [modal, setModal] = useState<Modal>(null);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignContextType, setAssignContextType] = useState("ORGANIZATION");
  const [assignContextId, setAssignContextId] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const selectedRole = roles.find((role) => role.id === selectedRoleId) ?? roles[0];
  const currentPermissions = useMemo(() => new Set(selectedRole?.permissions ?? []), [selectedRole]);
  const permissionCatalogue = useMemo(() => [...new Set(roles.flatMap((role) => role.permissions ?? []))].sort(), [roles]);
  const modules = useMemo(() => [...new Set(permissionCatalogue.map((permission) => permission.split(".")[0] || "other"))].sort(), [permissionCatalogue]);

  useEffect(() => { setStaged(new Set(selectedRole?.permissions ?? [])); setEditing(false); setExpandedGroup(null); }, [selectedRole?.id, selectedRole?.permissions]);

  const visibleRoles = roles.filter((role) => `${role.name} ${roleLabels[locale][role.name] ?? role.name}`.toLowerCase().includes(roleQuery.trim().toLowerCase()));
  const systemRoles = visibleRoles.filter(isSystemRole); const businessRoles = visibleRoles.filter((role) => !isSystemRole(role));
  const filteredCatalogue = permissionCatalogue.filter((permission) => (!moduleFilter || permission.startsWith(`${moduleFilter}.`)) && `${permission} ${permissionLabels[locale][permission] ?? permission}`.toLowerCase().includes(permissionQuery.trim().toLowerCase()));
  const groups = useMemo(() => { const map = new Map<string, string[]>(); filteredCatalogue.forEach((permission) => { const group = permission.split(".")[0] || "other"; map.set(group, [...(map.get(group) ?? []), permission]); }); return [...map.entries()].map(([name, items]) => ({ name, items })); }, [filteredCatalogue]);
  const added = [...staged].filter((permission) => !currentPermissions.has(permission)); const removed = [...currentPermissions].filter((permission) => !staged.has(permission)); const dirty = added.length + removed.length > 0;
  const chooseRole = (role: IamRole) => { setSelectedRoleId(role.id); setStaged(new Set(role.permissions ?? [])); setTab("permissions"); setEditing(false); };
  const togglePermission = (permission: string) => setStaged((previous) => { const next = new Set(previous); next.has(permission) ? next.delete(permission) : next.add(permission); return next; });

  const assignRole = async (event: FormEvent) => {
    event.preventDefault(); if (!assignUserId || !selectedRole) return;
    try {
      await iam.assignRole.mutateAsync({
        userId: assignUserId,
        roleId: selectedRole.id,
        contextType: assignContextType.trim() || undefined,
        contextId: assignContextId.trim() || undefined,
      });
      setAssignUserId("");
      setAssignContextId("");
      setModal(null);
      showToast({ title: t.confirmAssign, icon: "success" });
    } catch (cause) {
      showError(t.assignTitle, cause instanceof Error ? cause.message : "Request failed");
    }
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
      setModal(null);
      showToast({ title: t.saveChanges, icon: "success" });
    } catch (cause) {
      showError(t.modalReviewTitle, cause instanceof Error ? cause.message : "Request failed");
    }
  };

  if (denied) return <div className="grid min-h-[70vh] place-items-center p-6"><div className="max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 text-center"><span className="material-symbols-outlined text-4xl text-amber-500">shield_person</span><h1 className="mt-4 text-xl font-bold">{t.denied}</h1></div></div>;

  const RoleButton = ({ role }: { role: IamRole }) => <button type="button" onClick={() => chooseRole(role)} className={`relative mb-1 flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-r-full ${selectedRole?.id === role.id ? "bg-[color-mix(in_srgb,var(--accent-primary)_11%,var(--surface-secondary))] text-[var(--accent-primary)] before:bg-[var(--accent-primary)]" : "before:bg-transparent hover:bg-[var(--surface-secondary)]"}`}><span className="material-symbols-outlined grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--surface-secondary)] text-lg text-[var(--accent-primary)]">{isSystemRole(role) ? "admin_panel_settings" : "badge"}</span><span className="min-w-0"><strong className="block truncate text-sm">{roleLabels[locale][role.name] ?? role.name}</strong><small className="mt-0.5 block text-xs font-normal text-text-secondary">{role.permissions?.length ?? 0} {t.permissions.toLowerCase()}</small></span></button>;

  return <div className="min-w-0 p-4 text-text-primary sm:p-6 lg:p-8">
    <header className="mb-5 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-[-.035em]">{t.title}</h1><p className="mt-1 text-sm text-text-secondary">{t.desc}</p></div><button type="button" onClick={() => iam.refresh()} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-bold hover:bg-[var(--surface-secondary)]">{t.retry}</button></header>
    {iam.isFetching ? <p className="mb-3 text-xs text-[var(--accent-primary)]" role="status">{t.loading}</p> : null}{iam.hasStaleData ? <p className="mb-3 text-xs text-amber-600" role="status">{t.stale}</p> : null}

    <section className="grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"><div className="px-2 py-1"><div className="flex items-baseline justify-between"><h2 className="text-lg font-semibold">{t.directory}</h2><span className="text-xs text-text-secondary">{roles.length}</span></div><input type="search" value={roleQuery} onChange={(event) => setRoleQuery(event.target.value)} placeholder={t.searchRole} className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)]" /></div><div className="mt-3 max-h-[72vh] overflow-y-auto pr-1">{systemRoles.length ? <><p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[.12em] text-text-secondary">{t.systemRoles}</p>{systemRoles.map((role) => <RoleButton key={role.id} role={role} />)}</> : null}{businessRoles.length ? <><p className="mt-4 px-2 pb-1 text-[10px] font-bold uppercase tracking-[.12em] text-text-secondary">{t.businessRoles}</p>{businessRoles.map((role) => <RoleButton key={role.id} role={role} />)}</> : null}{!visibleRoles.length ? <p className="p-3 text-sm text-text-secondary">{t.noRole}</p> : null}</div></aside>

      <div className="min-w-0 space-y-4">
        <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"><div className="flex flex-wrap items-start gap-4 p-5"><span className="material-symbols-outlined grid size-12 place-items-center rounded-[14px] bg-[var(--surface-secondary)] text-2xl text-[var(--accent-primary)]">policy</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-semibold">{selectedRole ? roleLabels[locale][selectedRole.name] ?? selectedRole.name : "—"}</h2>{selectedRole ? <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">{t.active}</span> : null}</div><p className="mt-1 text-sm text-text-secondary">{selectedRole?.permissions?.length ?? 0} {t.permissions.toLowerCase()} · {t.readOnly}</p></div>{selectedRole && tab === "permissions" ? <button type="button" onClick={() => { setEditing(true); setStaged(new Set(selectedRole.permissions ?? [])); }} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-bold hover:bg-[var(--surface-secondary)]"><span className="material-symbols-outlined mr-1 align-middle text-lg">edit</span>{t.editPermissions}</button> : null}</div><nav className="flex overflow-x-auto border-t border-[var(--border)] px-4">{(["permissions","assignments","scope","audit"] as Tab[]).map((id) => <button key={id} type="button" onClick={() => setTab(id)} className={`min-h-12 whitespace-nowrap border-b-2 px-3 text-sm font-bold ${tab === id ? "border-[var(--accent-primary)] text-[var(--accent-primary)]" : "border-transparent text-text-secondary"}`}>{t[id]}</button>)}</nav></article>

        {tab === "permissions" ? <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_270px]">
          <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"><header className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border)] p-4"><div><h3 className="text-lg font-semibold">{t.permissions}</h3><p className="mt-1 text-xs text-text-secondary">{selectedRole?.permissions?.length ?? 0} {t.granted.toLowerCase()}</p></div><div className="flex w-full flex-wrap gap-2 sm:w-auto"><input type="search" value={permissionQuery} onChange={(event) => setPermissionQuery(event.target.value)} placeholder={t.searchPermission} className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 text-sm outline-none sm:w-56" /><select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"><option value="">{t.allModules}</option>{modules.map((module) => <option key={module} value={module}>{groupLabels[locale][module] ?? module}</option>)}</select>{editing ? <button type="button" onClick={() => setModal("add")} className="rounded-xl bg-[var(--accent-primary)] px-3 py-2 text-sm font-bold text-white">＋ {t.addPermission}</button> : null}</div></header><div className="grid gap-3 p-4">{groups.map((group) => <section key={group.name} className="overflow-hidden rounded-xl border border-[var(--border)]"><button type="button" onClick={() => setExpandedGroup(expandedGroup === group.name ? null : group.name)} className="flex min-h-14 w-full items-center justify-between gap-4 bg-[var(--surface-secondary)] px-4 py-3 text-left"><span className="flex items-center gap-3"><span className="material-symbols-outlined text-[var(--accent-primary)]">folder_open</span><span><strong className="block">{groupLabels[locale][group.name] ?? group.name}</strong><small className="text-text-secondary">{group.items.filter((permission) => staged.has(permission)).length}/{group.items.length} {t.granted.toLowerCase()}</small></span></span><span className="material-symbols-outlined text-text-secondary">{expandedGroup === group.name ? "expand_less" : "expand_more"}</span></button>{expandedGroup === group.name ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-t border-[var(--border)] bg-[var(--surface)] text-[10px] uppercase tracking-[.06em] text-text-secondary"><tr><th className="w-12 px-4 py-3"></th><th className="px-3 py-3">{t.permission}</th><th className="px-3 py-3">{t.description}</th><th className="px-4 py-3 text-right">{t.status}</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{group.items.map((permission) => <tr key={permission} className="hover:bg-[var(--surface-secondary)]"><td className="px-4 py-3"><input type="checkbox" checked={staged.has(permission)} disabled={!editing} onChange={() => togglePermission(permission)} className="size-4 accent-[var(--accent-primary)]" /></td><td className="px-3 py-3"><code className="break-all text-xs font-semibold">{permission}</code></td><td className="px-3 py-3 text-text-secondary">{permissionLabels[locale][permission] ?? permission}</td><td className="px-4 py-3 text-right"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${staged.has(permission) ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-[var(--surface-secondary)] text-text-secondary"}`}>{staged.has(permission) ? t.granted : t.notGranted}</span></td></tr>)}</tbody></table></div> : null}</section>)}{!groups.length ? <p className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-text-secondary">{t.noPermission}</p> : null}</div>{editing ? <footer className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] p-4 backdrop-blur"><div><strong className="text-sm">{t.unsaved}</strong><p className="text-xs text-text-secondary">+{added.length} {t.add} · −{removed.length} {t.remove}</p></div><div className="flex gap-2"><button type="button" onClick={() => { setStaged(new Set(selectedRole?.permissions ?? [])); setEditing(false); }} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-bold">{t.cancel}</button><button type="button" disabled={!dirty} onClick={() => setModal("review")} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-bold disabled:opacity-40">{t.reviewChanges}</button><button type="button" disabled={!dirty} onClick={savePermissions} className="rounded-xl bg-[var(--accent-primary)] px-3 py-2 text-sm font-bold text-white disabled:opacity-40">{t.saveChanges}</button></div></footer> : null}</article>

          <aside className="space-y-4"><section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><h4 className="text-sm font-semibold">{t.quickActions}</h4><div className="mt-3 space-y-2"><button type="button" onClick={() => setModal("assign")} className="w-full rounded-xl bg-[var(--accent-primary)] px-3 py-2.5 text-sm font-bold text-white"><span className="material-symbols-outlined mr-1 align-middle text-lg">person_add</span>{t.assignUser}</button><button type="button" onClick={() => setModal("review")} className="w-full rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm font-bold hover:bg-[var(--surface-secondary)]">{t.reviewEffective}</button></div></section><section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><h4 className="text-sm font-semibold">{t.roleInfo}</h4><dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between gap-2"><dt className="text-text-secondary">{t.roleId}</dt><dd className="font-mono text-text-primary">{selectedRole?.id ?? "—"}</dd></div><div className="flex justify-between gap-2"><dt className="text-text-secondary">{t.roleType}</dt><dd className="text-text-primary">{selectedRole && isSystemRole(selectedRole) ? t.systemRole : t.businessRole}</dd></div></dl></section></aside>
        </div> : null}

        {tab === "assignments" ? <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><h3 className="text-lg font-semibold">{t.assignments}</h3><p className="mt-1 text-sm text-text-secondary">{t.assignmentNote}</p><div className="mt-4 rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-text-secondary">{t.noAssignments}</div></article> : null}
        {tab === "scope" ? <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><h3 className="text-lg font-semibold">{t.scope}</h3><p className="mt-1 text-sm text-text-secondary">{t.scopeNote}</p><div className="mt-4 rounded-xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-text-secondary">{t.platformContext}</div></article> : null}
        {tab === "audit" ? <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><h3 className="text-lg font-semibold">{t.audit}</h3><p className="mt-1 text-sm text-text-secondary">{t.auditNote}</p></article> : null}
      </div>
    </section>

    {modal === "assign" ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><form onSubmit={assignRole} className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"><h3 className="text-lg font-bold">{t.assignTitle}</h3><p className="mt-1 text-xs text-text-secondary">{roleLabels[locale][selectedRole?.name ?? ""] ?? selectedRole?.name}</p><label className="mt-4 block text-xs font-semibold text-text-secondary">{t.users}<select value={assignUserId} onChange={(event) => setAssignUserId(event.target.value)} required className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm"><option value="">{t.selectUser}</option>{users.map((user) => <option key={user.id} value={user.id}>{user.email || user.id}</option>)}</select></label><label className="mt-3 block text-xs font-semibold text-text-secondary">{t.contextTypeLabel} <span className="font-normal text-text-secondary">{t.optional}</span><select value={assignContextType} onChange={(event) => setAssignContextType(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm"><option value="ORGANIZATION">ORGANIZATION</option><option value="REVIEW_BOARD">REVIEW_BOARD</option><option value="PLATFORM">PLATFORM</option></select></label><label className="mt-3 block text-xs font-semibold text-text-secondary">{t.contextIdLabel} <span className="font-normal text-text-secondary">{t.optional}</span><input type="text" value={assignContextId} onChange={(event) => setAssignContextId(event.target.value)} placeholder="e.g. org-123 hoặc board-456" className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)]" /></label><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold">{t.cancel}</button><button type="submit" disabled={iam.assignRole.isPending} className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-bold text-white">{iam.assignRole.isPending ? t.assigning : t.confirmAssign}</button></div></form></div> : null}

    {modal === "add" ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"><h3 className="text-lg font-bold">{t.modalAddTitle}</h3><p className="mt-1 text-xs text-text-secondary">{t.modalAddDesc}</p><div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">{permissionCatalogue.map((permission) => <label key={permission} className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--surface-secondary)]"><input type="checkbox" checked={staged.has(permission)} onChange={() => togglePermission(permission)} className="size-4 accent-[var(--accent-primary)]" /><span className="min-w-0"><code className="block text-xs font-bold">{permission}</code><small className="text-text-secondary">{permissionLabels[locale][permission] ?? permission}</small></span></label>)}</div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-bold text-white">{t.continue}</button></div></div></div> : null}

    {modal === "review" ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"><h3 className="text-lg font-bold">{t.modalReviewTitle}</h3><p className="mt-1 text-xs text-text-secondary">{t.modalReviewDesc}</p><div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">{added.map((permission) => <div key={permission} className="flex items-center justify-between rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300"><code>+{permission}</code><span>{t.add}</span></div>)}{removed.map((permission) => <div key={permission} className="flex items-center justify-between rounded-xl bg-rose-500/10 p-3 text-xs font-semibold text-rose-800 dark:text-rose-300"><code>−{permission}</code><span>{t.remove}</span></div>)}{!dirty ? <p className="p-4 text-center text-xs text-text-secondary">{t.noPermission}</p> : null}</div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold">{t.close}</button><button type="button" disabled={!dirty || iam.replaceRolePermissions.isPending} onClick={savePermissions} className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">{t.saveChanges}</button></div></div></div> : null}
  </div>;
}
