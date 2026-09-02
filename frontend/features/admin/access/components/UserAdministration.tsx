"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { confirmAction, showError, showToast } from "@/lib/alerts";
import { useIamAdministration } from "@/features/iam/hooks";
import { ApiError, type IamUser as User } from "@/features/iam/repository";
import { z } from "zod";
import { formatRoleName } from "../config/role-display";

type View = "overview" | "roles";

const subscribeToClient = () => () => {};

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
    searchUsersPlaceholder: string;
    filterStatus: string;
    filterRole: string;
    filterAll: string;
    showing: string;
    of: string;
    usersTotal: string;
    rowsPerPage: string;
    noUsersMatching: string;
    email: string;
    role: string;
    noRole: string;
    status: string;
    action: string;
    activeStatus: string;
    inactiveStatus: string;
    lockBtn: string;
    unlockBtn: string;
    assignBtn: string;
    resetPasswordBtn: string;
    resetPasswordTitle: string;
    resetPasswordDesc: string;
    newPassword: string;
    confirmPassword: string;
    passwordRules: string;
    passwordMismatch: string;
    resetPasswordSubmit: string;
    resetPasswordSuccess: string;
    resetPasswordFailed: string;
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
    currentRolesLabel: string;
    noAssignedRoles: string;
    assignNewRoleLabel: string;
    userIdLabel: string;
    userEmailLabel: string;
    userStatusLabel: string;
    closeModal: string;
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
    backToModule: "Về Quản trị IAM",
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
    searchUsersPlaceholder: "Tìm theo email người dùng…",
    filterStatus: "Trạng thái",
    filterRole: "Vai trò",
    filterAll: "Tất cả",
    showing: "Hiển thị",
    of: "trên",
    usersTotal: "người dùng",
    rowsPerPage: "Dòng trên trang",
    noUsersMatching: "Không tìm thấy người dùng nào phù hợp với bộ lọc.",
    email: "Email",
    role: "Vai trò",
    noRole: "Chưa gán vai trò",
    status: "Trạng thái",
    action: "Hành động",
    activeStatus: "Đang hoạt động",
    inactiveStatus: "Đã khóa",
    lockBtn: "Khóa",
    unlockBtn: "Kích hoạt",
    assignBtn: "Gán vai trò",
    resetPasswordBtn: "Cấp lại mật khẩu",
    resetPasswordTitle: "Cấp lại mật khẩu",
    resetPasswordDesc:
      "Mật khẩu mới có hiệu lực ngay; toàn bộ phiên đăng nhập của người dùng sẽ bị thu hồi.",
    newPassword: "Mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu",
    passwordRules: "Từ 8 đến 128 ký tự.",
    passwordMismatch: "Mật khẩu xác nhận không khớp.",
    resetPasswordSubmit: "Xác nhận cấp lại",
    resetPasswordSuccess: "Đã cấp lại mật khẩu",
    resetPasswordFailed: "Cấp lại mật khẩu thất bại",
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
    assignTitle: "Chi tiết & Phân quyền người dùng",
    assignDesc:
      "Xem thông tin danh tính tài khoản và quản trị danh sách vai trò được cấp.",
    currentRolesLabel: "Vai trò hiện tại",
    noAssignedRoles: "Chưa có vai trò nào được gán cho người dùng này.",
    assignNewRoleLabel: "Gán vai trò mới",
    userIdLabel: "Mã định danh (ID)",
    userEmailLabel: "Địa chỉ Email",
    userStatusLabel: "Trạng thái",
    closeModal: "Đóng",
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
    backToModule: "Back to IAM Governance",
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
    searchUsersPlaceholder: "Search by user email...",
    filterStatus: "Status",
    filterRole: "Role",
    filterAll: "All",
    showing: "Showing",
    of: "of",
    usersTotal: "users",
    rowsPerPage: "Rows per page",
    noUsersMatching: "No users matching current filters.",
    email: "Email",
    role: "Role",
    noRole: "No role assigned",
    status: "Status",
    action: "Action",
    activeStatus: "Active",
    inactiveStatus: "Inactive",
    lockBtn: "Lock",
    unlockBtn: "Activate",
    assignBtn: "Assign role",
    resetPasswordBtn: "Reset password",
    resetPasswordTitle: "Reset password",
    resetPasswordDesc:
      "The new password takes effect immediately; all user sessions will be revoked.",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    passwordRules: "Use 8 to 128 characters.",
    passwordMismatch: "Passwords do not match.",
    resetPasswordSubmit: "Confirm reset",
    resetPasswordSuccess: "Password reset completed",
    resetPasswordFailed: "Password reset failed",
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
    assignTitle: "User Details & Role Governance",
    assignDesc:
      "Inspect identity details and manage assigned security roles for this account.",
    currentRolesLabel: "Current Roles",
    noAssignedRoles: "No roles assigned to this account yet.",
    assignNewRoleLabel: "Assign New Role",
    userIdLabel: "User ID",
    userEmailLabel: "Email Address",
    userStatusLabel: "Status",
    closeModal: "Close",
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
    backToModule: "Назад к управлению IAM",
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
    searchUsersPlaceholder: "Поиск по email...",
    filterStatus: "Статус",
    filterRole: "Роль",
    filterAll: "Все",
    showing: "Показано",
    of: "из",
    usersTotal: "пользователей",
    rowsPerPage: "Строк на странице",
    noUsersMatching: "Пользователи, соответствующие фильтрам, не найдены.",
    email: "Email",
    role: "Роль",
    noRole: "Роль не назначена",
    status: "Статус",
    action: "Действие",
    activeStatus: "Активен",
    inactiveStatus: "Заблокирован",
    lockBtn: "Блокировать",
    unlockBtn: "Активировать",
    assignBtn: "Назначить роль",
    resetPasswordBtn: "Сбросить пароль",
    resetPasswordTitle: "Сброс пароля",
    resetPasswordDesc:
      "Новый пароль вступит в силу немедленно; все сеансы пользователя будут отозваны.",
    newPassword: "Новый пароль",
    confirmPassword: "Подтверждение пароля",
    passwordRules: "От 8 до 128 символов.",
    passwordMismatch: "Пароли не совпадают.",
    resetPasswordSubmit: "Подтвердить сброс",
    resetPasswordSuccess: "Пароль сброшен",
    resetPasswordFailed: "Не удалось сбросить пароль",
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
    assignTitle: "Данные пользователя и права",
    assignDesc:
      "Просмотр информации об учетной записи и управление назначенными ролями.",
    currentRolesLabel: "Текущие роли",
    noAssignedRoles: "Учетной записи пока не назначены роли.",
    assignNewRoleLabel: "Назначить новую роль",
    userIdLabel: "Идентификатор (ID)",
    userEmailLabel: "Email адрес",
    userStatusLabel: "Статус",
    closeModal: "Закрыть",
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

const roleLabels: Record<Locale, Record<string, string>> = {
  vi: {
    READER: "Bạn đọc",
    PORTAL_MEMBER: "Quản lý portal",
    SUPER_ADMIN: "Quản trị tối cao",
  },
  en: {
    READER: "Reader",
    PORTAL_MEMBER: "Portal member",
    SUPER_ADMIN: "Super administrator",
  },
  ru: {
    READER: "Читатель",
    PORTAL_MEMBER: "Участник портала",
    SUPER_ADMIN: "Главный администратор",
  },
};

function groupPermissions(
  permissions: string[] = [],
  query = "",
  locale: Locale,
) {
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

export default function UserAdministration({
  initialView = "overview",
}: Readonly<{ initialView?: View }>) {
  const { locale } = useLocale();
  const t = iamAdminCopy[locale] || iamAdminCopy.vi;
  const view = initialView;
  const iam = useIamAdministration();
  const users = useMemo(() => iam.users.data ?? [], [iam.users.data]);
  const roles = useMemo(() => iam.roles.data ?? [], [iam.roles.data]);
  const loading = iam.users.isPending || iam.roles.isPending;
  const queryError = iam.users.error ?? iam.roles.error;
  const error = queryError instanceof Error ? queryError.message : null;
  const accessDenied =
    queryError instanceof ApiError && queryError.status === 403;
  const submitting =
    iam.updateUserStatus.isPending ||
    iam.assignRole.isPending ||
    iam.resetUserPassword.isPending;
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [roleQuery, setRoleQuery] = useState("");
  const [permissionQuery, setPermissionQuery] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignRoleId, setAssignRoleId] = useState("");
  const [assignError, setAssignError] = useState("");
  const [passwordTarget, setPasswordTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [userQuery, setUserQuery] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [userRoleFilter, setUserRoleFilter] = useState("ALL");
  const [userPage, setUserPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);
  const mounted = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  useEffect(() => {
    const isModalActive = Boolean(assignUserId || passwordTarget);
    if (isModalActive) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [assignUserId, passwordTarget]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (userStatusFilter !== "ALL" && u.status !== userStatusFilter)
        return false;
      if (userRoleFilter !== "ALL") {
        const hasRole = (u.roles ?? []).some(
          (r) => r.id === userRoleFilter || r.name === userRoleFilter,
        );
        if (!hasRole) return false;
      }
      if (userQuery.trim()) {
        const q = userQuery.trim().toLowerCase();
        const matchEmail = (u.email || "").toLowerCase().includes(q);
        const matchId = u.id.toLowerCase().includes(q);
        if (!matchEmail && !matchId) return false;
      }
      return true;
    });
  }, [users, userStatusFilter, userRoleFilter, userQuery]);

  const totalUserPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / userPageSize),
  );
  const currentPageUsers = useMemo(() => {
    const start = (userPage - 1) * userPageSize;
    return filteredUsers.slice(start, start + userPageSize);
  }, [filteredUsers, userPage, userPageSize]);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? roles[0],
    [roles, selectedRoleId],
  );
  const visibleRoles = useMemo(() => {
    const query = roleQuery.trim().toLowerCase();
    return query
      ? roles.filter((role) =>
          formatRoleName(role.name, locale).toLowerCase().includes(query),
        )
      : roles;
  }, [roles, roleQuery, locale]);
  const permissionGroups = useMemo(
    () => groupPermissions(selectedRole?.permissions, permissionQuery, locale),
    [selectedRole?.permissions, permissionQuery, locale],
  );
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const permissionCount = new Set(
    roles.flatMap((role) => role.permissions ?? []),
  ).size;

  const handleToggleUserStatus = async (user: User) => {
    const isLocking = user.status === "ACTIVE";
    const confirm = await confirmAction({
      title: isLocking ? t.dialogLockTitle : t.dialogUnlockTitle,
      text: isLocking
        ? `Khóa tài khoản "${user.email || ""}"? Người dùng sẽ tạm thời bị vô hiệu hóa quyền truy cập hệ thống.`
        : `Kích hoạt lại tài khoản "${user.email || ""}"? Người dùng sẽ có thể đăng nhập vào hệ thống.`,
      confirmButtonText: isLocking ? t.lockBtn : t.unlockBtn,
      cancelButtonText: t.cancel,
      isDestructive: isLocking,
      icon: isLocking ? "warning" : "question",
    });

    if (!confirm.isConfirmed) return;

    const newStatus = isLocking ? "INACTIVE" : "ACTIVE";
    try {
      await iam.updateUserStatus.mutateAsync({
        id: user.id,
        status: newStatus,
      });
      showToast({
        title: isLocking
          ? "Đã khóa tài khoản thành công"
          : "Đã kích hoạt tài khoản thành công",
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
    const parsed = z
      .object({
        userId: z.string().trim().min(1),
        roleId: z.string().trim().min(1),
      })
      .safeParse({ userId: assignUserId, roleId: assignRoleId });
    if (!parsed.success) return setAssignError("Chọn vai trò để gán.");
    setAssignError("");

    const targetRole = roles.find((r) => r.id === assignRoleId);
    const roleTitle = targetRole ? formatRoleName(targetRole.name, locale) : "";

    const confirm = await confirmAction({
      title: t.submitAssign,
      text: `Gán vai trò "${roleTitle}" cho tài khoản này?`,
      confirmButtonText: t.confirm,
      cancelButtonText: t.cancel,
      icon: "question",
    });

    if (!confirm.isConfirmed) return;

    try {
      await iam.assignRole.mutateAsync({
        userId: parsed.data.userId,
        roleId: parsed.data.roleId,
      });
      setAssignRoleId("");
      showToast({ title: "Đã gán vai trò thành công", icon: "success" });
    } catch (cause) {
      showError(
        "Gán vai trò thất bại",
        cause instanceof Error ? cause.message : "Vui lòng thử lại.",
      );
    }
  };

  const closePasswordDialog = () => {
    setPasswordTarget(null);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!passwordTarget) return;
    const parsed = z
      .object({
        password: z.string().min(8).max(128),
        confirmPassword: z.string().min(8).max(128),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: t.passwordMismatch,
        path: ["confirmPassword"],
      })
      .safeParse({ password: newPassword, confirmPassword });

    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message || t.passwordRules);
      return;
    }
    setPasswordError("");

    const confirm = await confirmAction({
      title: t.resetPasswordTitle,
      text: `Cấp lại mật khẩu mới cho tài khoản "${passwordTarget.email || ""}"? Toàn bộ phiên đăng nhập hiện tại sẽ bị thu hồi.`,
      confirmButtonText: t.resetPasswordSubmit,
      cancelButtonText: t.cancel,
      isDestructive: true,
      icon: "warning",
    });

    if (!confirm.isConfirmed) return;

    try {
      await iam.resetUserPassword.mutateAsync({
        id: passwordTarget.id,
        password: parsed.data.password,
      });
      closePasswordDialog();
      showToast({ title: t.resetPasswordSuccess, icon: "success" });
    } catch (cause) {
      showError(
        t.resetPasswordFailed,
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
          <p className="mt-2 text-sm text-text-secondary">
            {t.accessDeniedDesc}
          </p>
          <Link
            href="/admin/access"
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
          {/* ── Search & Filter Toolbar ── */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xs">
            <div className="flex min-w-0 basis-full items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 sm:basis-auto sm:min-w-[280px] sm:flex-1">
              <span className="material-symbols-outlined text-lg text-text-secondary">
                search
              </span>
              <input
                type="search"
                value={userQuery}
                onChange={(e) => {
                  setUserQuery(e.target.value);
                  setUserPage(1);
                }}
                placeholder={t.searchUsersPlaceholder}
                className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
              />
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <select
                value={userStatusFilter}
                onChange={(event) => {
                  const value = event.target.value;
                  if (
                    value === "ALL" ||
                    value === "ACTIVE" ||
                    value === "INACTIVE"
                  ) {
                    setUserStatusFilter(value);
                  }
                  setUserPage(1);
                }}
                className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-text-primary outline-none hover:bg-[var(--surface-secondary)] sm:w-auto"
              >
                <option value="ALL">
                  {t.filterStatus}: {t.filterAll}
                </option>
                <option value="ACTIVE">{t.activeStatus}</option>
                <option value="INACTIVE">{t.inactiveStatus}</option>
              </select>

              <select
                value={userRoleFilter}
                onChange={(e) => {
                  setUserRoleFilter(e.target.value);
                  setUserPage(1);
                }}
                className="w-full max-w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-text-primary outline-none hover:bg-[var(--surface-secondary)] sm:w-auto"
              >
                <option value="ALL">
                  {t.filterRole}: {t.filterAll}
                </option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {roleLabels[locale][r.name] ?? r.name}
                  </option>
                ))}
              </select>

              {/* Quick Filter Tab Pills */}
              <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setUserStatusFilter("ALL");
                    setUserPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    userStatusFilter === "ALL"
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {t.filterAll} ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserStatusFilter("ACTIVE");
                    setUserPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    userStatusFilter === "ACTIVE"
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {t.activeStatus} ({activeUsers})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserStatusFilter("INACTIVE");
                    setUserPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 transition-all ${
                    userStatusFilter === "INACTIVE"
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {t.inactiveStatus} ({users.length - activeUsers})
                </button>
              </div>
            </div>
          </div>

          {/* ── Scalable DataTable ── */}
          <section className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs">
            <div className="border-b border-[var(--border)] p-5">
              <h2 className="font-bold">{t.usersTitle}</h2>
              <p className="mt-1 text-xs text-text-secondary">{t.usersDesc}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-secondary)] text-[11px] font-bold uppercase tracking-[.06em] text-text-secondary">
                  <tr>
                    <th className="p-4">{t.email}</th>
                    <th className="p-4">{t.role}</th>
                    <th className="p-4">{t.status}</th>
                    <th className="p-4 text-right">{t.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {currentPageUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-blue-50/40"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 shadow-2xs">
                            {(user.email?.[0] || "U").toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <strong className="block truncate text-sm font-semibold text-text-primary">
                              {user.email || "—"}
                            </strong>
                            <span className="block truncate text-xs text-text-secondary">
                              {user.roles?.length
                                ? user.roles
                                    .map(
                                      (r) =>
                                        roleLabels[locale][r.name] ?? r.name,
                                    )
                                    .join(", ")
                                : t.noRole}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles?.length ? (
                            user.roles.map((role) => (
                              <span
                                key={role.id}
                                className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                              >
                                {formatRoleName(role.name, locale)}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-text-secondary">
                              {t.noRole}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              user.status === "ACTIVE"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {user.status === "ACTIVE"
                            ? t.activeStatus
                            : t.inactiveStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {user.canManageUser ? (
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setAssignUserId(user.id)}
                              className="cursor-pointer rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
                            >
                              {t.assignBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPasswordTarget(user)}
                              className="cursor-pointer rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50"
                            >
                              {t.resetPasswordBtn}
                            </button>
                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => handleToggleUserStatus(user)}
                              className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                                user.status === "ACTIVE"
                                  ? "border-amber-200 bg-white text-amber-700 hover:bg-amber-50"
                                  : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                              }`}
                            >
                              {user.status === "ACTIVE"
                                ? t.lockBtn
                                : t.unlockBtn}
                            </button>
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))}

                  {!currentPageUsers.length && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-12 text-center text-sm text-text-secondary"
                      >
                        <span className="material-symbols-outlined mb-2 text-4xl text-slate-300">
                          person_search
                        </span>
                        <p>{t.noUsersMatching}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Enterprise Pagination Bar ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] px-5 py-3.5 text-sm text-text-secondary">
              <div>
                {t.showing}{" "}
                <strong className="font-semibold text-text-primary">
                  {filteredUsers.length === 0
                    ? 0
                    : (userPage - 1) * userPageSize + 1}
                  –{Math.min(userPage * userPageSize, filteredUsers.length)}
                </strong>{" "}
                {t.of}{" "}
                <strong className="font-semibold text-text-primary">
                  {filteredUsers.length}
                </strong>{" "}
                {t.usersTotal}
              </div>

              <div className="flex items-center gap-3">
                {/* Page number buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="grid size-8 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-text-primary hover:bg-[var(--surface-secondary)] disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-base">
                      chevron_left
                    </span>
                  </button>
                  {Array.from({ length: totalUserPages }, (_, i) => i + 1)
                    .slice(0, 5)
                    .map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setUserPage(p)}
                        className={`grid size-8 place-items-center rounded-lg text-xs font-bold transition-colors ${
                          userPage === p
                            ? "bg-blue-600 text-white shadow-2xs"
                            : "border border-[var(--border)] bg-[var(--surface)] text-text-primary hover:bg-[var(--surface-secondary)]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  {totalUserPages > 5 && <span className="px-1">…</span>}
                  <button
                    type="button"
                    disabled={userPage >= totalUserPages}
                    onClick={() =>
                      setUserPage((p) => Math.min(totalUserPages, p + 1))
                    }
                    className="grid size-8 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-text-primary hover:bg-[var(--surface-secondary)] disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-base">
                      chevron_right
                    </span>
                  </button>
                </div>

                {/* Page Size Selector */}
                <select
                  value={userPageSize}
                  onChange={(e) => {
                    setUserPageSize(Number(e.target.value));
                    setUserPage(1);
                  }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-text-primary outline-none"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
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
              {visibleRoles.map((role) => {
                const isSelected = selectedRole?.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRoleId(role.id)}
                    aria-current={isSelected ? "true" : undefined}
                    className={`group mb-1.5 flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 ${
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
                        {role.name === "SUPER_ADMIN"
                          ? "shield_person"
                          : "badge"}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <strong className="block truncate text-sm font-bold">
                        {roleLabels[locale][role.name] ||
                          formatRoleName(role.name, locale)}
                      </strong>
                      <small
                        className={`mt-0.5 block text-xs font-medium ${isSelected ? "text-blue-600/80" : "text-slate-500"}`}
                      >
                        {t.permissionsCount(role.permissions?.length || 0)}
                      </small>
                    </span>
                  </button>
                );
              })}
              {!visibleRoles.length ? (
                <p className="p-3 text-sm text-text-secondary">{t.noRoles}</p>
              ) : null}
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <article className="role-profile overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="flex flex-wrap items-start gap-4 p-5 sm:p-6">
                <span
                  className="material-symbols-outlined grid size-12 shrink-0 place-items-center rounded-[14px] bg-[var(--surface-secondary)] text-2xl text-[var(--accent-primary)]"
                  aria-hidden="true"
                >
                  policy
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="break-words text-2xl font-semibold text-text-primary">
                      {selectedRole
                        ? formatRoleName(selectedRole.name, locale)
                        : t.selectRole}
                    </h2>
                    <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      {t.activeStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    {t.permissionsCount(selectedRole?.permissions?.length ?? 0)}{" "}
                    · {t.readOnlyNote}
                  </p>
                </div>
              </div>
              <nav
                className="overflow-x-auto border-t border-[var(--border)] px-5"
                aria-label={t.permissionsTab}
              >
                <span
                  aria-current="page"
                  className="inline-flex min-h-12 items-center border-b-2 border-[var(--accent-primary)] px-1 text-sm font-bold text-[var(--accent-primary)]"
                >
                  {t.permissionsTab}
                </span>
              </nav>
            </article>

            <div className="min-w-0">
              <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] p-5 sm:p-6">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {t.permissionGroups}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {t.permissionsCount(
                        selectedRole?.permissions?.length ?? 0,
                      )}
                    </p>
                  </div>
                  <label className="w-full sm:w-72">
                    <span className="sr-only">{t.searchPermissions}</span>
                    <input
                      type="search"
                      value={permissionQuery}
                      onChange={(event) =>
                        setPermissionQuery(event.target.value)
                      }
                      aria-label={t.searchPermissions}
                      placeholder={t.searchPermissions}
                      className="w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-blue-500/10"
                    />
                  </label>
                </header>

                <div className="grid gap-3 p-4 sm:p-5">
                  {permissionGroups.map((group) => (
                    <section
                      key={group.name}
                      className="permission-module overflow-hidden rounded-[14px] border border-[var(--border)]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedGroup(
                            expandedGroup === group.name ? null : group.name,
                          )
                        }
                        aria-expanded={expandedGroup === group.name}
                        className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 bg-[var(--surface-secondary)] px-4 py-3 text-left outline-none transition hover:bg-[var(--surface-raised)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent-primary)]"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span
                            className="material-symbols-outlined text-xl text-[var(--accent-primary)]"
                            aria-hidden="true"
                          >
                            folder_open
                          </span>
                          <span className="min-w-0">
                            <strong className="block break-words">
                              {groupLabels[locale][group.name] ?? group.name}
                            </strong>
                            <small className="text-text-secondary">
                              {group.items.length} {t.granted}
                            </small>
                          </span>
                        </span>
                        <span
                          className="material-symbols-outlined text-text-secondary"
                          aria-hidden="true"
                        >
                          {expandedGroup === group.name
                            ? "expand_less"
                            : "expand_more"}
                        </span>
                        <span className="sr-only">
                          {expandedGroup === group.name
                            ? t.collapseGroup
                            : t.expandGroup}
                        </span>
                      </button>
                      {expandedGroup === group.name ? (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[620px] text-left text-sm">
                            <thead className="border-t border-[var(--border)] bg-[var(--surface)] text-xs uppercase tracking-[.06em] text-text-secondary">
                              <tr>
                                <th className="w-12 px-4 py-3">
                                  <span className="sr-only">{t.status}</span>
                                </th>
                                <th className="px-3 py-3">
                                  {t.permissionName}
                                </th>
                                <th className="px-3 py-3">
                                  {t.permissionDescription}
                                </th>
                                <th className="px-4 py-3 text-right">
                                  {t.status}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                              {group.items.map((permission) => (
                                <tr key={permission}>
                                  <td className="px-4 py-3">
                                    <span
                                      className="material-symbols-outlined text-lg text-emerald-600"
                                      aria-hidden="true"
                                    >
                                      check_circle
                                    </span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <code className="break-all text-xs font-semibold text-text-primary">
                                      {permission}
                                    </code>
                                  </td>
                                  <td className="px-3 py-3 text-text-secondary">
                                    {permissionLabels[locale][permission] ??
                                      permission}
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
                  {!permissionGroups.length ? (
                    <p className="rounded-[14px] border border-dashed border-[var(--border)] p-6 text-center text-sm text-text-secondary">
                      {t.noPermissions}
                    </p>
                  ) : null}
                </div>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      {mounted && assignUserId
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="assign-dialog-title"
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
            >
              <section className="relative my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
                {/* Modal Header */}
                <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] bg-gradient-to-r from-blue-50/50 via-[var(--surface)] to-transparent px-4 py-4 sm:items-center sm:px-8 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      <span className="material-symbols-outlined text-2xl">
                        manage_accounts
                      </span>
                    </div>
                    <div>
                      <h2
                        id="assign-dialog-title"
                        className="text-xl font-bold tracking-tight text-text-primary"
                      >
                        {t.assignTitle}
                      </h2>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        {t.assignDesc}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAssignUserId("");
                      setAssignRoleId("");
                      setAssignError("");
                    }}
                    className="grid size-9 place-items-center rounded-xl text-text-secondary transition hover:bg-[var(--surface-secondary)] hover:text-text-primary"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      close
                    </span>
                  </button>
                </div>

                <div className="max-h-[78vh] space-y-4 overflow-y-auto p-4 sm:space-y-6 sm:p-8">
                  {/* 1. Account Details Card */}
                  {(() => {
                    const targetUser = users.find((u) => u.id === assignUserId);
                    return (
                      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] p-4 shadow-xs transition-all sm:p-6">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                          <div className="flex min-w-0 items-center gap-4">
                            <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-extrabold text-white shadow-md">
                              {(targetUser?.email?.[0] || "U").toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-lg font-bold text-text-primary">
                                {targetUser?.email || "—"}
                              </h3>
                              <p className="mt-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                                {targetUser?.roles?.length
                                  ? targetUser.roles
                                      .map(
                                        (r) =>
                                          roleLabels[locale][r.name] ?? r.name,
                                      )
                                      .join(", ")
                                  : "Chưa được cấp vai trò"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-2xs ${
                              targetUser?.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                            }`}
                          >
                            <span
                              className={`size-2 rounded-full ${
                                targetUser?.status === "ACTIVE"
                                  ? "bg-emerald-500 animate-pulse"
                                  : "bg-rose-500"
                              }`}
                            />
                            {targetUser?.status === "ACTIVE"
                              ? t.activeStatus
                              : t.inactiveStatus}
                          </span>
                        </div>

                        {/* 2. Current Roles List */}
                        <div className="mt-5 border-t border-[var(--border)] pt-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                            <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">
                              shield_person
                            </span>
                            <span>{t.currentRolesLabel}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2.5">
                            {targetUser?.roles?.length ? (
                              targetUser.roles.map((role) => (
                                <span
                                  key={role.id}
                                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-[var(--surface)] px-3.5 py-2 text-xs font-bold text-blue-800 shadow-2xs"
                                >
                                  <span className="material-symbols-outlined text-base text-blue-600">
                                    verified_user
                                  </span>
                                  {formatRoleName(role.name, locale)}
                                </span>
                              ))
                            ) : (
                              <p className="text-xs italic text-text-secondary">
                                {t.noAssignedRoles}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* 3. Assign New Role Form */}
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xs sm:p-6">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-blue-600 dark:text-blue-400">
                        add_moderator
                      </span>
                      <h3 className="text-sm font-bold text-text-primary">
                        {t.assignNewRoleLabel}
                      </h3>
                    </div>
                    <form
                      noValidate
                      onSubmit={assignRole}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <label className="mb-2 block text-xs font-bold text-text-secondary">
                          {t.roleLabel} <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <select
                            value={assignRoleId}
                            onChange={(event) =>
                              setAssignRoleId(event.target.value)
                            }
                            aria-invalid={Boolean(assignError)}
                            aria-describedby={
                              assignError ? "user-assignment-error" : undefined
                            }
                            className="h-12 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 text-sm font-semibold text-text-primary outline-none transition focus:border-blue-600 focus:bg-[var(--surface)] focus:ring-2 focus:ring-blue-500/20"
                          >
                            <option value="">{t.selectRolePrompt}</option>
                            {roles
                              .filter(
                                (role) =>
                                  role.name
                                    .replace(/[\s_-]/g, "")
                                    .toUpperCase() !== "SUPERADMIN",
                              )
                              .map((role) => (
                                <option key={role.id} value={role.id}>
                                  {formatRoleName(role.name, locale)}
                                </option>
                              ))}
                          </select>
                          <button
                            type="submit"
                            disabled={submitting || !assignRoleId}
                            aria-busy={submitting}
                            className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-98 disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-lg">
                              person_add
                            </span>
                            <span>
                              {submitting ? t.submitting : t.submitAssign}
                            </span>
                          </button>
                        </div>
                        {assignError && (
                          <p
                            id="user-assignment-error"
                            role="alert"
                            className="mt-2 text-xs font-medium text-rose-600"
                          >
                            {assignError}
                          </p>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end border-t border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-4 sm:px-8">
                  <button
                    type="button"
                    onClick={() => {
                      setAssignUserId("");
                      setAssignRoleId("");
                      setAssignError("");
                    }}
                    className="h-11 cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-bold text-text-primary transition hover:bg-[var(--surface-secondary)]"
                  >
                    {t.closeModal}
                  </button>
                </div>
              </section>
            </div>,
            document.body,
          )
        : null}

      {mounted && passwordTarget
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="password-dialog-title"
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
            >
              <section className="relative my-auto w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl sm:p-6">
                <h2 id="password-dialog-title" className="text-xl font-bold">
                  {t.resetPasswordTitle}
                </h2>
                <p className="mt-2 text-sm text-text-secondary">
                  {t.resetPasswordDesc}
                </p>
                <p className="mt-2 text-sm font-bold">
                  {passwordTarget.email || "—"}
                </p>
                <form
                  noValidate
                  onSubmit={resetPassword}
                  className="mt-6 grid gap-4"
                >
                  <label className="grid gap-1.5 text-sm font-bold">
                    {t.newPassword}
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      aria-invalid={Boolean(passwordError)}
                      aria-describedby="password-reset-help"
                      className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-base font-normal outline-none focus:border-[var(--accent-primary)]"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold">
                    {t.confirmPassword}
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      aria-invalid={Boolean(passwordError)}
                      aria-describedby="password-reset-help"
                      className="min-h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-base font-normal outline-none focus:border-[var(--accent-primary)]"
                    />
                  </label>
                  <p
                    id="password-reset-help"
                    role={passwordError ? "alert" : undefined}
                    className={`text-sm ${passwordError ? "text-rose-700" : "text-text-secondary"}`}
                  >
                    {passwordError || t.passwordRules}
                  </p>
                  <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={closePasswordDialog}
                      className="min-h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-bold"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      aria-busy={iam.resetUserPassword.isPending}
                      className="min-h-11 rounded-xl bg-[var(--accent-primary)] px-4 text-sm font-bold text-white disabled:opacity-50"
                    >
                      {t.resetPasswordSubmit}
                    </button>
                  </div>
                </form>
              </section>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
