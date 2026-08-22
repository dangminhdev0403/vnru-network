"use client";

import { useLocale, type Locale } from "@/app/HomeMotion";
import Link from "next/link";

import { useMemo, useState } from "react";
import { showError, showToast } from "@/lib/alerts";
import { useIamAdministration } from "@/features/iam/hooks";
import { ApiError, type IamUser as User } from "@/features/iam/repository";

type View = "overview" | "roles";

const iamAdminCopy: Record<
  Locale,
  {
    kicker: string;
    subheading: string;
    refresh: string;
    workspace: string;
    accessDeniedTitle: string;
    accessDeniedDesc: string;
    backToModule: string;
    views: { id: View; label: string; icon: string }[];
    metricActiveUsers: string;
    metricRoles: string;
    metricPermissions: string;
    usersTitle: string;
    usersDesc: string;
    email: string;
    status: string;
    action: string;
    activeStatus: string;
    inactiveStatus: string;
    lockBtn: string;
    unlockBtn: string;
    assignBtn: string;
    rolesTitle: string;
    rolesSummary: (visible: number, total: number) => string;
    searchRoles: string;
    searchPermissions: string;
    noRoles: string;
    noPermissions: string;
    permissionGroups: string;
    permissionName: string;
    permissionDescription: string;
    roleInformation: string;
    permissionsTab: string;
    granted: string;
    expandGroup: string;
    collapseGroup: string;
    policyTag: string;
    selectRole: string;
    permissionsCount: (count: number) => string;
    readOnlyNote: string;
    assignTitle: string;
    assignDesc: string;
    userLabel: string;
    selectUserPrompt: string;
    roleLabel: string;
    selectRolePrompt: string;
    contextTypeLabel: string;
    contextIdLabel: string;
    optional: string;
    submitAssign: string;
    submitting: string;
    dialogLockTitle: string;
    dialogUnlockTitle: string;
    cancel: string;
    confirm: string;
  }
> = {
  vi: {
    kicker: "Quản trị Danh tính & Quyền truy cập",
    subheading: "Identity → Context → Role → Phán quyết Backend.",
    refresh: "Làm mới",
    workspace: "Không gian làm việc",
    accessDeniedTitle: "Không có quyền truy cập",
    accessDeniedDesc:
      "Backend từ chối quyền quản trị IAM trong ngữ cảnh hiện tại.",
    backToModule: "Về Module 01",
    views: [
      { id: "overview", label: "Quản lý người dùng", icon: "group" },
      { id: "roles", label: "Vai trò & quyền", icon: "admin_panel_settings" },
    ],
    metricActiveUsers: "Người dùng hoạt động",
    metricRoles: "Vai trò hệ thống",
    metricPermissions: "Quyền hạn hiện có",
    usersTitle: "Danh tính nền tảng",
    usersDesc:
      "Dữ liệu thật từ auth-service; thay đổi trạng thái được backend kiểm tra và audit.",
    email: "Email",
    status: "Trạng thái",
    action: "Hành động",
    activeStatus: "Đang hoạt động",
    inactiveStatus: "Đã khóa",
    lockBtn: "Khóa",
    unlockBtn: "Kích hoạt",
    assignBtn: "Gán vai trò",
    rolesTitle: "Danh mục vai trò",
    rolesSummary: (visible, total) => `${visible}/${total} vai trò`,
    searchRoles: "Tìm vai trò",
    searchPermissions: "Tìm quyền hạn",
    noRoles: "Không có vai trò phù hợp.",
    noPermissions: "Không có quyền hạn phù hợp.",
    permissionGroups: "Nhóm quyền hạn",
    permissionName: "Quyền hạn",
    permissionDescription: "Mô tả",
    roleInformation: "Thông tin vai trò",
    permissionsTab: "Quyền hạn",
    granted: "đang cấp",
    expandGroup: "Mở nhóm quyền",
    collapseGroup: "Thu gọn nhóm quyền",
    policyTag: "Chính sách ủy quyền",
    selectRole: "Chọn vai trò",
    permissionsCount: (c) => `${c} quyền`,
    readOnlyNote: "Chế độ xem: backend quản lý định nghĩa quyền cho vai trò.",
    assignTitle: "Gán vai trò cho người dùng",
    assignDesc:
      "Chọn danh tính và vai trò bằng nhãn người dùng; backend xác thực scope và quyền quản trị.",
    userLabel: "Người dùng",
    selectUserPrompt: "Chọn người dùng…",
    roleLabel: "Vai trò",
    selectRolePrompt: "Chọn vai trò…",
    contextTypeLabel: "Loại ngữ cảnh",
    contextIdLabel: "Mã ngữ cảnh",
    optional: "(tùy chọn)",
    submitAssign: "Xác nhận gán vai trò",
    submitting: "Đang xử lý…",
    dialogLockTitle: "Khóa tài khoản?",
    dialogUnlockTitle: "Kích hoạt tài khoản?",
    cancel: "Hủy",
    confirm: "Xác nhận",
  },
  en: {
    kicker: "Identity & Access Governance",
    subheading: "Identity → Context → Role → Backend authoritative decision.",
    refresh: "Refresh",
    workspace: "Workspace",
    accessDeniedTitle: "Access Denied",
    accessDeniedDesc:
      "Backend rejected administrative permissions in the current context.",
    backToModule: "Back to IAM Workspace",
    views: [
      { id: "overview", label: "User Management", icon: "group" },
      {
        id: "roles",
        label: "Roles & Permissions",
        icon: "admin_panel_settings",
      },
    ],
    metricActiveUsers: "Active Users",
    metricRoles: "System Roles",
    metricPermissions: "Active Permissions",
    usersTitle: "Platform Identities",
    usersDesc:
      "Verified live data from auth-service; mutations are audited by backend.",
    email: "Email",
    status: "Status",
    action: "Action",
    activeStatus: "Active",
    inactiveStatus: "Inactive",
    lockBtn: "Lock",
    unlockBtn: "Activate",
    assignBtn: "Assign role",
    rolesTitle: "Role Directory",
    rolesSummary: (visible, total) => `${visible}/${total} roles`,
    searchRoles: "Search roles",
    searchPermissions: "Search permissions",
    noRoles: "No matching roles.",
    noPermissions: "No matching permissions.",
    permissionGroups: "Permission groups",
    permissionName: "Permission",
    permissionDescription: "Description",
    roleInformation: "Role information",
    permissionsTab: "Permissions",
    granted: "granted",
    expandGroup: "Expand permission group",
    collapseGroup: "Collapse permission group",
    policyTag: "Authoritative Policy",
    selectRole: "Select a Role",
    permissionsCount: (c) => `${c} permissions`,
    readOnlyNote:
      "Read-only: permission matrix is defined at backend service boundary.",
    assignTitle: "Assign Roles to Users",
    assignDesc:
      "Select identity and role; backend authorizes assignment scope.",
    userLabel: "User Account",
    selectUserPrompt: "Select user…",
    roleLabel: "Role",
    selectRolePrompt: "Select role…",
    contextTypeLabel: "Context Type",
    contextIdLabel: "Context ID",
    optional: "(optional)",
    submitAssign: "Confirm Assignment",
    submitting: "Processing…",
    dialogLockTitle: "Lock account?",
    dialogUnlockTitle: "Activate account?",
    cancel: "Cancel",
    confirm: "Confirm",
  },
  ru: {
    kicker: "Управление доступом и идентификацией",
    subheading: "Идентичность → Контекст → Роль → Серверное решение.",
    refresh: "Обновить",
    workspace: "Рабочее пространство",
    accessDeniedTitle: "Доступ запрещен",
    accessDeniedDesc:
      "Сервер отклонил административные права в текущем контексте.",
    backToModule: "В Модуль 01",
    views: [
      { id: "overview", label: "Управление пользователями", icon: "group" },
      { id: "roles", label: "Роли и права", icon: "admin_panel_settings" },
    ],
    metricActiveUsers: "Активные пользователи",
    metricRoles: "Системные роли",
    metricPermissions: "Полномочия",
    usersTitle: "Учетные записи платформы",
    usersDesc:
      "Данные из auth-service; изменение статуса проверяется и логируется бэкендом.",
    email: "Email",
    status: "Статус",
    action: "Действие",
    activeStatus: "Активен",
    inactiveStatus: "Заблокирован",
    lockBtn: "Блокировать",
    unlockBtn: "Активировать",
    assignBtn: "Назначить роль",
    rolesTitle: "Каталог ролей",
    rolesSummary: (visible, total) => `${visible}/${total} ролей`,
    searchRoles: "Поиск ролей",
    searchPermissions: "Поиск прав",
    noRoles: "Подходящие роли не найдены.",
    noPermissions: "Подходящие права не найдены.",
    permissionGroups: "Группы прав",
    permissionName: "Право",
    permissionDescription: "Описание",
    roleInformation: "Информация о роли",
    permissionsTab: "Права",
    granted: "предоставлено",
    expandGroup: "Развернуть группу прав",
    collapseGroup: "Свернуть группу прав",
    policyTag: "Политика авторизации",
    selectRole: "Выберите роль",
    permissionsCount: (c) => `${c} прав`,
    readOnlyNote:
      "Только для чтения: права ролей настраиваются на уровне бэкенда.",
    assignTitle: "Назначение ролей пользователям",
    assignDesc:
      "Выберите пользователя и роль; сервер проверит область действия прав.",
    userLabel: "Пользователь",
    selectUserPrompt: "Выберите пользователя…",
    roleLabel: "Роль",
    selectRolePrompt: "Выберите роль…",
    contextTypeLabel: "Тип контекста",
    contextIdLabel: "Идентификатор контекста",
    optional: "(опционально)",
    submitAssign: "Подтвердить назначение",
    submitting: "Обработка…",
    dialogLockTitle: "Заблокировать аккаунт?",
    dialogUnlockTitle: "Активировать аккаунт?",
    cancel: "Отмена",
    confirm: "Подтвердить",
  },
};

const permissionLabels: Record<Locale, Record<string, string>> = {
  vi: {
    "collab.proposals.screen": "Sàng lọc đề xuất cộng tác",
    "experts.matches.view": "Xem gợi ý kết nối chuyên gia",
    "collab.decisions.issue_foundation": "Ban hành quyết định cộng tác của Quỹ",
    "collab.opportunities.create": "Tạo cơ hội cộng tác nghiên cứu",
    "collab.opportunities.publish": "Công bố cơ hội cộng tác nghiên cứu",
    "collab.proposals.confirm_paired": "Xác nhận hồ sơ đề xuất song phương",
    "collab.proposals.create": "Tạo đề xuất cộng tác nghiên cứu",
    "collab.proposals.endorse": "Xác nhận hồ sơ thay mặt tổ chức",
    "collab.proposals.submit": "Nộp đề xuất cộng tác nghiên cứu",
    "iam.roles.manage": "Quản lý vai trò và quyền hạn",
    "iam.users.manage": "Quản lý người dùng",
    "knowledge.workspace.view": "Truy cập không gian tri thức",
    "projects.milestones.update": "Cập nhật mốc tiến độ dự án",
    "projects.projects.view": "Xem dự án",
    "projects.reports.approve": "Phê duyệt báo cáo dự án",
    "projects.reports.submit": "Nộp báo cáo dự án",
    "projects.reports.view_org": "Xem báo cáo dự án của tổ chức",
    "reviews.assignments.manage": "Quản lý phân công phản biện",
    "reviews.assignments.view_assigned": "Xem hồ sơ được phân công phản biện",
    "reviews.evaluations.score": "Chấm điểm phản biện",
    "reviews.evaluations.submit": "Nộp kết quả phản biện",
  },
  en: {
    "collab.proposals.screen": "Screen collaboration proposals",
    "experts.matches.view": "View expert connection suggestions",
    "collab.decisions.issue_foundation": "Issue Foundation collaboration decisions",
    "collab.opportunities.create": "Create research collaboration opportunities",
    "collab.opportunities.publish": "Publish research collaboration opportunities",
    "collab.proposals.confirm_paired": "Confirm bilateral proposal pairing",
    "collab.proposals.create": "Create research collaboration proposals",
    "collab.proposals.endorse": "Endorse proposals for an organization",
    "collab.proposals.submit": "Submit research collaboration proposals",
    "iam.roles.manage": "Manage roles and permissions",
    "iam.users.manage": "Manage users",
    "knowledge.workspace.view": "Access the knowledge workspace",
    "projects.milestones.update": "Update project milestones",
    "projects.projects.view": "View projects",
    "projects.reports.approve": "Approve project reports",
    "projects.reports.submit": "Submit project reports",
    "projects.reports.view_org": "View organization project reports",
    "reviews.assignments.manage": "Manage review assignments",
    "reviews.assignments.view_assigned": "View assigned review submissions",
    "reviews.evaluations.score": "Score reviews",
    "reviews.evaluations.submit": "Submit review results",
  },
  ru: {
    "collab.proposals.screen": "Проверка предложений о сотрудничестве",
    "experts.matches.view": "Просмотр рекомендаций по подбору экспертов",
    "collab.decisions.issue_foundation": "Принятие решений Фонда о сотрудничестве",
    "collab.opportunities.create": "Создание возможностей научного сотрудничества",
    "collab.opportunities.publish": "Публикация возможностей научного сотрудничества",
    "collab.proposals.confirm_paired": "Подтверждение парной двусторонней заявки",
    "collab.proposals.create": "Создание предложения о научном сотрудничестве",
    "collab.proposals.endorse": "Подтверждение заявки от имени организации",
    "collab.proposals.submit": "Подача предложения о научном сотрудничестве",
    "iam.roles.manage": "Управление ролями и правами",
    "iam.users.manage": "Управление пользователями",
    "knowledge.workspace.view": "Доступ к рабочему пространству знаний",
    "projects.milestones.update": "Обновление этапов проекта",
    "projects.projects.view": "Просмотр проектов",
    "projects.reports.approve": "Утверждение отчётов проекта",
    "projects.reports.submit": "Подача отчётов проекта",
    "projects.reports.view_org": "Просмотр отчётов проектов организации",
    "reviews.assignments.manage": "Управление назначениями рецензентов",
    "reviews.assignments.view_assigned": "Просмотр назначенных заявок",
    "reviews.evaluations.score": "Оценивание рецензий",
    "reviews.evaluations.submit": "Подача результатов рецензирования",
  },
};

const groupLabels: Record<Locale, Record<string, string>> = {
  vi: { experts: "Chuyên gia", collab: "Cộng tác nghiên cứu", iam: "Định danh và phân quyền", knowledge: "Kho tri thức", projects: "Quản lý dự án", reviews: "Phản biện" },
  en: { experts: "Experts", collab: "Research collaboration", iam: "Identity and access", knowledge: "Knowledge repository", projects: "Project management", reviews: "Peer review" },
  ru: { experts: "Эксперты", collab: "Научное сотрудничество", iam: "Идентификация и доступ", knowledge: "База знаний", projects: "Управление проектами", reviews: "Рецензирование" },
};

const roleLabels: Record<Locale, Record<string, string>> = {
  vi: {
    FOUNDATION_DECISION_MAKER: "Quản trị quyết định cộng tác",
    KNOWLEDGE_CURATOR: "Quản trị nội dung tri thức",
    ORGANIZATION_REPRESENTATIVE: "Đại diện tổ chức",
    COLLABORATION_MANAGER: "Quản lý cộng tác nghiên cứu",
    RESEARCHER: "Nhà nghiên cứu",
    REVIEWER: "Chuyên gia phản biện",
    SUPER_ADMIN: "Quản trị tối cao",
  },
  en: {
    FOUNDATION_DECISION_MAKER: "Collaboration decision administrator",
    KNOWLEDGE_CURATOR: "Knowledge curator",
    ORGANIZATION_REPRESENTATIVE: "Organization representative",
    COLLABORATION_MANAGER: "Collaboration manager",
    RESEARCHER: "Researcher",
    REVIEWER: "Reviewer",
    SUPER_ADMIN: "Super administrator",
  },
  ru: {
    FOUNDATION_DECISION_MAKER: "Администратор решений о сотрудничестве",
    KNOWLEDGE_CURATOR: "Куратор базы знаний",
    ORGANIZATION_REPRESENTATIVE: "Представитель организации",
    COLLABORATION_MANAGER: "Менеджер научного сотрудничества",
    RESEARCHER: "Исследователь",
    REVIEWER: "Эксперт-рецензент",
    SUPER_ADMIN: "Главный администратор",
  },
};

function groupPermissions(permissions: string[] = [], query = "", locale: Locale) {
  const needle = query.trim().toLocaleLowerCase();
  const groups = new Map<string, string[]>();
  permissions
    .filter((permission) =>
      `${permission} ${permissionLabels[locale][permission] ?? permission}`
        .toLocaleLowerCase()
        .includes(needle),
    )
    .forEach((permission) => {
      const group = permission.split(".")[0] || "other";
      groups.set(group, [...(groups.get(group) ?? []), permission]);
    });
  return [...groups.entries()].map(([name, items]) => ({ name, items }));
}

export default function IamClientPage({
  initialView = "overview",
}: Readonly<{ initialView?: View }>) {
  const { locale } = useLocale();
  const t = iamAdminCopy[locale] || iamAdminCopy.vi;
  const view = initialView;
  const iam = useIamAdministration();
  const users = iam.users.data ?? [];
  const roles = useMemo(() => iam.roles.data ?? [], [iam.roles.data]);
  const loading = iam.users.isPending || iam.roles.isPending;
  const queryError = iam.users.error ?? iam.roles.error;
  const error = queryError instanceof Error ? queryError.message : null;
  const accessDenied = queryError instanceof ApiError && queryError.status === 403;
  const submitting = iam.updateUserStatus.isPending || iam.assignRole.isPending;
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [roleQuery, setRoleQuery] = useState("");
  const [permissionQuery, setPermissionQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignRoleId, setAssignRoleId] = useState("");
  const [contextType, setContextType] = useState("");
  const [contextId, setContextId] = useState("");
  const [statusTarget, setStatusTarget] = useState<User | null>(null);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? roles[0],
    [roles, selectedRoleId],
  );
  const visibleRoles = useMemo(() => {
    const needle = roleQuery.trim().toLocaleLowerCase();
    return roles.filter((role) =>
      `${role.name} ${roleLabels[locale][role.name] ?? role.name}`
        .toLocaleLowerCase()
        .includes(needle),
    );
  }, [locale, roleQuery, roles]);
  const permissionGroups = useMemo(
    () => groupPermissions(selectedRole?.permissions, permissionQuery, locale),
    [locale, permissionQuery, selectedRole?.permissions],
  );
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const permissionCount = new Set(
    roles.flatMap((role) => role.permissions ?? []),
  ).size;

  const updateUserStatus = async () => {
    if (!statusTarget) return;
    const status = statusTarget.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await iam.updateUserStatus.mutateAsync({ id: statusTarget.id, status });
      setStatusTarget(null);
      showToast({
        title: "Đã cập nhật trạng thái người dùng",
        icon: "success",
      });
    } catch (cause) {
      showError(
        "Cập nhật thất bại",
        cause instanceof Error ? cause.message : "Vui lòng thử lại.",
      );
    }
  };

  const assignRole = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!assignUserId || !assignRoleId) {
      showError("Thiếu thông tin", "Chọn người dùng và vai trò.");
      return;
    }
    try {
      await iam.assignRole.mutateAsync({
        userId: assignUserId,
        roleId: assignRoleId,
        contextType: contextType.trim() || undefined,
        contextId: contextId.trim() || undefined,
      });
      setAssignUserId("");
      setAssignRoleId("");
      setContextType("");
      setContextId("");
      showToast({ title: "Đã gán vai trò", icon: "success" });
    } catch (cause) {
      showError(
        "Gán vai trò thất bại",
        cause instanceof Error ? cause.message : "Vui lòng thử lại.",
      );
    }
  };

  if (accessDenied) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f7fb] p-6">
        <section className="w-full max-w-md rounded-2xl border border-amber-200 bg-[var(--surface)] p-8 text-center shadow-xl">
          <span className="material-symbols-outlined text-4xl text-amber-700">
            shield_person
          </span>
          <h1 className="mt-4 text-2xl font-bold">{t.accessDeniedTitle}</h1>
          <p className="mt-2 text-sm text-text-secondary">{t.accessDeniedDesc}</p>
          <Link
            href="/workspace/iam"
            className="mt-6 inline-flex rounded-xl bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-bold text-white"
          >
            {t.backToModule}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="iam-admin-surface min-w-0 p-4 text-text-primary sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-5 border-b border-[var(--border)] pb-5">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-[-0.035em] text-text-primary">
            {t.views.find((item) => item.id === view)?.label}
          </h1>
          <p className="mt-2 text-sm font-medium text-text-secondary">
            {t.subheading}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent-primary)]">
            {t.kicker}
          </p>
        </div>

      </header>

      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      {iam.isFetching && !loading ? (
        <p className="mb-3 text-sm text-blue-700" role="status">
          Đang cập nhật dữ liệu…
        </p>
      ) : null}
      {iam.hasStaleData ? (
        <p className="mb-3 text-sm text-amber-700" role="status">
          Đang hiển thị dữ liệu cũ.
        </p>
      ) : null}

      {view === "overview" ? (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            {[
              ["group", activeUsers, t.metricActiveUsers],
              ["admin_panel_settings", roles.length, t.metricRoles],
              ["key", permissionCount, t.metricPermissions],
            ].map(([icon, value, label]) => (
              <article
                key={String(label)}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 "
              >
                <span className="material-symbols-outlined text-[#2457d6]">
                  {icon}
                </span>
                <strong className="mt-3 block text-3xl">
                  {loading ? "—" : value}
                </strong>
                <span className="text-sm text-text-secondary">{label}</span>
              </article>
            ))}
          </section>
          <section className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] ">
            <div className="border-b border-[var(--border)] p-5">
              <h2 className="font-bold">{t.usersTitle}</h2>
              <p className="mt-1 text-xs text-text-secondary">{t.usersDesc}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--surface-secondary)] text-xs text-text-secondary">
                  <tr>
                    <th className="p-4">{t.email}</th>
                    <th className="p-4">{t.status}</th>
                    <th className="p-4 text-right">{t.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-[var(--border)]">
                      <td className="p-4">
                        <strong>{user.email || "—"}</strong>
                        <small className="block font-mono text-text-secondary">
                          {user.id}
                        </small>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-bold ${user.status === "ACTIVE" ? "border-emerald-200 text-emerald-700" : "border-[var(--border)] text-text-secondary"}`}
                        >
                          {user.status === "ACTIVE"
                            ? t.activeStatus
                            : t.inactiveStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {user.canManageUser ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setAssignUserId(user.id)}
                              className="mr-2 cursor-pointer rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50   "
                            >
                              {t.assignBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => setStatusTarget(user)}
                              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-bold hover:bg-[var(--surface-raised)] transition cursor-pointer"
                            >
                              {user.status === "ACTIVE"
                                ? t.lockBtn
                                : t.unlockBtn}
                            </button>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}

      {view === "roles" ? (
        <section className="grid min-w-0 gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="px-2 pb-3">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold">{t.rolesTitle}</h2>
                <span className="text-xs text-text-secondary">
                  {t.rolesSummary(visibleRoles.length, roles.length)}
                </span>
              </div>
              <label className="mt-4 block">
                <span className="sr-only">{t.searchRoles}</span>
                <input
                  type="search"
                  value={roleQuery}
                  onChange={(event) => setRoleQuery(event.target.value)}
                  aria-label={t.searchRoles}
                  placeholder={t.searchRoles}
                  className="w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-blue-500/10"
                />
              </label>
            </div>
            <div className="max-h-[68vh] overflow-y-auto" role="list">
              {visibleRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  aria-current={selectedRole?.id === role.id ? "true" : undefined}
                  className={`mb-1 flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-[14px] px-3 py-2.5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] ${selectedRole?.id === role.id ? "bg-[color-mix(in_srgb,var(--accent-primary)_12%,var(--surface-secondary))] text-text-primary" : "hover:bg-[var(--surface-secondary)]"}`}
                >
                  <span className="material-symbols-outlined grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--surface-secondary)] text-lg text-[var(--accent-primary)]" aria-hidden="true">
                    badge
                  </span>
                  <span className="min-w-0">
                    <strong className="block truncate text-sm">
                      {roleLabels[locale][role.name] ?? role.name}
                    </strong>
                    <small className="mt-0.5 block text-xs font-normal text-text-secondary">
                      {t.permissionsCount(role.permissions?.length || 0)}
                    </small>
                  </span>
                </button>
              ))}
              {!visibleRoles.length ? <p className="p-3 text-sm text-text-secondary">{t.noRoles}</p> : null}
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <article className="role-profile overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="flex flex-wrap items-start gap-4 p-5 sm:p-6">
                <span className="material-symbols-outlined grid size-12 shrink-0 place-items-center rounded-[14px] bg-[var(--surface-secondary)] text-2xl text-[var(--accent-primary)]" aria-hidden="true">
                  policy
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="break-words text-2xl font-semibold text-text-primary">
                      {selectedRole ? roleLabels[locale][selectedRole.name] ?? selectedRole.name : t.selectRole}
                    </h2>
                    <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      {t.activeStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    {t.permissionsCount(selectedRole?.permissions?.length ?? 0)} · {t.readOnlyNote}
                  </p>
                </div>
              </div>
              <nav className="overflow-x-auto border-t border-[var(--border)] px-5" aria-label={t.permissionsTab}>
                <span aria-current="page" className="inline-flex min-h-12 items-center border-b-2 border-[var(--accent-primary)] px-1 text-sm font-bold text-[var(--accent-primary)]">
                  {t.permissionsTab}
                </span>
              </nav>
            </article>

            <div className="min-w-0">
              <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] p-5 sm:p-6">
                  <div>
                    <h3 className="text-xl font-semibold">{t.permissionGroups}</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {t.permissionsCount(selectedRole?.permissions?.length ?? 0)}
                    </p>
                  </div>
                  <label className="w-full sm:w-72">
                    <span className="sr-only">{t.searchPermissions}</span>
                    <input
                      type="search"
                      value={permissionQuery}
                      onChange={(event) => setPermissionQuery(event.target.value)}
                      aria-label={t.searchPermissions}
                      placeholder={t.searchPermissions}
                      className="w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-blue-500/10"
                    />
                  </label>
                </header>

                <div className="grid gap-3 p-4 sm:p-5">
                  {permissionGroups.map((group) => (
                    <section key={group.name} className="permission-module overflow-hidden rounded-[14px] border border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => setExpandedGroup(expandedGroup === group.name ? null : group.name)}
                        aria-expanded={expandedGroup === group.name}
                        className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 bg-[var(--surface-secondary)] px-4 py-3 text-left outline-none transition hover:bg-[var(--surface-raised)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent-primary)]"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="material-symbols-outlined text-xl text-[var(--accent-primary)]" aria-hidden="true">folder_open</span>
                          <span className="min-w-0">
                            <strong className="block break-words">{groupLabels[locale][group.name] ?? group.name}</strong>
                            <small className="text-text-secondary">{group.items.length} {t.granted}</small>
                          </span>
                        </span>
                        <span className="material-symbols-outlined text-text-secondary" aria-hidden="true">
                          {expandedGroup === group.name ? "expand_less" : "expand_more"}
                        </span>
                        <span className="sr-only">
                          {expandedGroup === group.name ? t.collapseGroup : t.expandGroup}
                        </span>
                      </button>
                      {expandedGroup === group.name ? (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[620px] text-left text-sm">
                            <thead className="border-t border-[var(--border)] bg-[var(--surface)] text-xs uppercase tracking-[.06em] text-text-secondary">
                              <tr>
                                <th className="w-12 px-4 py-3"><span className="sr-only">{t.status}</span></th>
                                <th className="px-3 py-3">{t.permissionName}</th>
                                <th className="px-3 py-3">{t.permissionDescription}</th>
                                <th className="px-4 py-3 text-right">{t.status}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                              {group.items.map((permission) => (
                                <tr key={permission}>
                                  <td className="px-4 py-3">
                                    <span className="material-symbols-outlined text-lg text-emerald-600" aria-hidden="true">check_circle</span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <code className="break-all text-xs font-semibold text-text-primary">{permission}</code>
                                  </td>
                                  <td className="px-3 py-3 text-text-secondary">
                                    {permissionLabels[locale][permission] ?? permission}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                      {t.granted}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : null}
                    </section>
                  ))}
                  {!permissionGroups.length ? <p className="rounded-[14px] border border-dashed border-[var(--border)] p-6 text-center text-sm text-text-secondary">{t.noPermissions}</p> : null}
                </div>
              </article>

            </div>
          </div>
        </section>
      ) : null}

      {assignUserId ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="assign-dialog-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4"
        >
          <section className="w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 ">
            <h2 id="assign-dialog-title" className="text-xl font-bold">
              {t.assignTitle}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">{t.assignDesc}</p>
            <p className="mt-2 text-sm font-bold">
              {users.find((user) => user.id === assignUserId)?.email ||
                assignUserId}
            </p>
            <form
              onSubmit={assignRole}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <label className="grid gap-1.5 text-xs font-bold">
                {t.roleLabel}
                <select
                  required
                  value={assignRoleId}
                  onChange={(event) => setAssignRoleId(event.target.value)}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm font-normal"
                >
                  <option value="">{t.selectRolePrompt}</option>
                  {roles
                    .filter(
                      (role) =>
                        role.name.replace(/[\s_-]/g, "").toUpperCase() !==
                        "SUPERADMIN",
                    )
                    .map((role) => (
                      <option key={role.id} value={role.id}>
                        {roleLabels[locale][role.name] ?? role.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-bold">
                {t.contextTypeLabel}{" "}
                <span className="font-normal text-text-secondary">{t.optional}</span>
                <input
                  value={contextType}
                  onChange={(event) => setContextType(event.target.value)}
                  placeholder="ORGANIZATION"
                  className="rounded-xl border border-[var(--border)] p-3 text-sm font-normal"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-bold">
                {t.contextIdLabel}{" "}
                <span className="font-normal text-text-secondary">{t.optional}</span>
                <input
                  value={contextId}
                  onChange={(event) => setContextId(event.target.value)}
                  placeholder="Context ID"
                  className="rounded-xl border border-[var(--border)] p-3 text-sm font-normal"
                />
              </label>
              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setAssignUserId("")}
                  className="cursor-pointer rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer rounded-xl bg-[var(--accent-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? t.submitting : t.submitAssign}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {statusTarget ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="status-dialog-title"
          className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4"
        >
          <section className="w-full max-w-md rounded-2xl bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
            <h2 id="status-dialog-title" className="text-xl font-bold">
              {statusTarget.status === "ACTIVE"
                ? t.dialogLockTitle
                : t.dialogUnlockTitle}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {statusTarget.email || statusTarget.id}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setStatusTarget(null)}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={updateUserStatus}
                className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-sm font-bold text-white cursor-pointer hover:bg-slate-800 transition"
              >
                {t.confirm}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
