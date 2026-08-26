"use client";

import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { useIamAdministration } from "@/features/iam/hooks";
import { ApiError } from "@/features/iam/repository";
import { formatRoleName } from "../config/role-display";

const copy: Record<Locale, Record<string, string>> = {
  vi: {
    eyebrow: "Quản trị danh tính & truy cập",
    title: "Tổng quan quản trị truy cập",
    description:
      "Theo dõi người dùng, vai trò và quyền hạn trong ngữ cảnh quản trị hiện tại.",
    activeUsers: "Người dùng hoạt động",
    inactiveUsers: "Tài khoản tạm khóa",
    roles: "Vai trò",
    permissions: "Quyền hạn duy nhất",
    roleDistribution: "Phân bố vai trò",
    roleDistributionDescription:
      "Số người dùng đang được gán cho từng vai trò.",
    accountHealth: "Trạng thái tài khoản",
    accountHealthDescription:
      "Tỷ lệ tài khoản có thể truy cập trong tổng số người dùng.",
    active: "Hoạt động",
    inactive: "Tạm khóa",
    unassigned: "Chưa gán vai trò",
    quickActions: "Truy cập nhanh",
    usersAction: "Quản lý người dùng",
    usersActionDescription: "Tài khoản, trạng thái và mật khẩu.",
    rolesAction: "Vai trò & phân quyền",
    rolesActionDescription: "Vai trò, quyền hạn và người được gán.",
    permissionsAction: "Danh mục quyền hạn",
    permissionsActionDescription: "Tra cứu capability do backend định nghĩa.",
    logsAction: "Nhật ký truy cập",
    logsActionDescription: "Theo dõi sự kiện quản trị và bảo mật.",
    noRoleData: "Chưa có dữ liệu gán vai trò.",
    loading: "Đang tải dữ liệu IAM…",
    refreshing: "Đang cập nhật dữ liệu…",
    stale: "Đang hiển thị dữ liệu cũ do lần cập nhật gần nhất thất bại.",
    deniedTitle: "Không có quyền truy cập",
    deniedDescription:
      "Backend từ chối quyền xem tổng quan IAM trong ngữ cảnh hiện tại.",
    errorTitle: "Không thể tải tổng quan IAM",
  },
  en: {
    eyebrow: "Identity & access governance",
    title: "Access administration overview",
    description:
      "Monitor users, roles, and permissions in the current administration context.",
    activeUsers: "Active users",
    inactiveUsers: "Suspended accounts",
    roles: "Roles",
    permissions: "Unique permissions",
    roleDistribution: "Role distribution",
    roleDistributionDescription: "Users currently assigned to each role.",
    accountHealth: "Account status",
    accountHealthDescription:
      "Share of accessible accounts across all users.",
    active: "Active",
    inactive: "Suspended",
    unassigned: "Without a role",
    quickActions: "Quick access",
    usersAction: "Manage users",
    usersActionDescription: "Accounts, status, and passwords.",
    rolesAction: "Roles & permissions",
    rolesActionDescription: "Roles, capabilities, and assignments.",
    permissionsAction: "Permission catalog",
    permissionsActionDescription: "Review backend-defined capabilities.",
    logsAction: "Access logs",
    logsActionDescription: "Review administration and security events.",
    noRoleData: "No role assignment data yet.",
    loading: "Loading IAM data…",
    refreshing: "Refreshing data…",
    stale: "Showing stale data because the latest refresh failed.",
    deniedTitle: "Access denied",
    deniedDescription:
      "Backend denied access to the IAM overview in the current context.",
    errorTitle: "Unable to load IAM overview",
  },
  ru: {
    eyebrow: "Управление идентификацией и доступом",
    title: "Обзор управления доступом",
    description:
      "Состояние пользователей, ролей и прав в текущем контексте администрирования.",
    activeUsers: "Активные пользователи",
    inactiveUsers: "Заблокированные аккаунты",
    roles: "Роли",
    permissions: "Уникальные права",
    roleDistribution: "Распределение ролей",
    roleDistributionDescription: "Количество пользователей для каждой роли.",
    accountHealth: "Состояние аккаунтов",
    accountHealthDescription: "Доля доступных аккаунтов среди всех пользователей.",
    active: "Активны",
    inactive: "Заблокированы",
    unassigned: "Без роли",
    quickActions: "Быстрый доступ",
    usersAction: "Управление пользователями",
    usersActionDescription: "Аккаунты, статусы и пароли.",
    rolesAction: "Роли и права",
    rolesActionDescription: "Роли, права и назначения.",
    permissionsAction: "Каталог прав",
    permissionsActionDescription: "Права, определенные backend.",
    logsAction: "Журнал доступа",
    logsActionDescription: "События администрирования и безопасности.",
    noRoleData: "Данных о назначении ролей пока нет.",
    loading: "Загрузка данных IAM…",
    refreshing: "Обновление данных…",
    stale: "Показаны устаревшие данные: последнее обновление завершилось ошибкой.",
    deniedTitle: "Доступ запрещен",
    deniedDescription:
      "Backend запретил просмотр обзора IAM в текущем контексте.",
    errorTitle: "Не удалось загрузить обзор IAM",
  },
};

const quickActions = [
  { href: "/admin/access/users", icon: "group", label: "usersAction" },
  { href: "/admin/access/roles", icon: "policy", label: "rolesAction" },
  { href: "/admin/access/permissions", icon: "key", label: "permissionsAction" },
  { href: "/admin/access/logs", icon: "receipt_long", label: "logsAction" },
] as const;

export default function AccessOverviewDashboard() {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const iam = useIamAdministration();
  const users = iam.users.data ?? [];
  const roles = iam.roles.data ?? [];
  const loading = iam.users.isPending || iam.roles.isPending;
  const queryError = iam.users.error ?? iam.roles.error;
  const denied = queryError instanceof ApiError && queryError.status === 403;

  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const inactiveUsers = users.length - activeUsers;
  const unassignedUsers = users.filter((user) => !user.roles.length).length;
  const permissionCount = new Set(
    roles.flatMap((role) => role.permissions ?? []),
  ).size;
  const activePercent = users.length
    ? Math.round((activeUsers / users.length) * 100)
    : 0;
  const roleDistribution = roles
    .map((role) => ({
      ...role,
      userCount: users.filter((user) =>
        user.roles.some((assignedRole) => assignedRole.id === role.id),
      ).length,
    }))
    .sort(
      (left, right) =>
        right.userCount - left.userCount ||
        left.name.localeCompare(right.name),
    );
  const largestRoleCount = Math.max(
    1,
    ...roleDistribution.map((role) => role.userCount),
  );

  if (denied) {
    return (
      <main className="grid min-h-[70vh] place-items-center p-6">
        <section className="w-full max-w-md rounded-2xl border border-amber-200 bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-soft)]">
          <span className="material-symbols-outlined text-4xl text-amber-700">
            shield_person
          </span>
          <h1 className="mt-4 text-2xl font-bold">{t.deniedTitle}</h1>
          <p className="mt-2 text-sm text-text-secondary">
            {t.deniedDescription}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="iam-admin-surface min-w-0 space-y-6 p-4 text-text-primary sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-5 border-b border-[var(--border)] pb-5">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--accent-primary)]">
            {t.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.035em]">
            {t.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-secondary">
            {t.description}
          </p>
        </div>
      </header>

      {queryError && !iam.hasStaleData ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <strong>{t.errorTitle}.</strong>{" "}
          {queryError instanceof Error ? queryError.message : null}
        </div>
      ) : null}
      {iam.isFetching && !loading ? (
        <p className="text-sm text-blue-700" role="status">
          {t.refreshing}
        </p>
      ) : null}
      {iam.hasStaleData ? (
        <p className="text-sm text-amber-700" role="status">
          {t.stale}
        </p>
      ) : null}

      <section
        aria-label={t.title}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          ["group", activeUsers, t.activeUsers, "text-emerald-700 bg-emerald-50"],
          [
            "person_off",
            inactiveUsers,
            t.inactiveUsers,
            "text-amber-700 bg-amber-50",
          ],
          ["policy", roles.length, t.roles, "text-blue-700 bg-blue-50"],
          [
            "key",
            permissionCount,
            t.permissions,
            "text-cyan-700 bg-cyan-50",
          ],
        ].map(([icon, value, label, tone]) => (
          <article
            key={String(label)}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]"
          >
            <span
              className={`material-symbols-outlined grid size-11 place-items-center rounded-[14px] ${tone}`}
              aria-hidden="true"
            >
              {icon}
            </span>
            <strong className="mt-4 block text-3xl tracking-tight">
              {loading ? "—" : value}
            </strong>
            <span className="mt-1 block text-sm font-medium text-text-secondary">
              {label}
            </span>
          </article>
        ))}
      </section>

      {loading ? (
        <div
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-sm text-text-secondary"
          role="status"
        >
          {t.loading}
        </div>
      ) : (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-bold">{t.roleDistribution}</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {t.roleDistributionDescription}
            </p>
            <div className="mt-5 space-y-4">
              {roleDistribution.map((role) => (
                <div key={role.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
                    <span className="truncate font-semibold">
                      {formatRoleName(role.name, locale)}
                    </span>
                    <span className="font-mono text-xs text-text-secondary">
                      {role.userCount}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent-primary)]"
                      style={{
                        width: `${Math.max(
                          role.userCount ? 6 : 0,
                          (role.userCount / largestRoleCount) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
              {!roleDistribution.length ? (
                <p className="text-sm text-text-secondary">{t.noRoleData}</p>
              ) : null}
            </div>
          </article>

          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-bold">{t.accountHealth}</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {t.accountHealthDescription}
            </p>
            <div className="mt-6 flex items-end gap-3">
              <strong className="text-5xl tracking-[-0.06em]">
                {activePercent}%
              </strong>
              <span className="pb-1 text-sm text-text-secondary">
                {t.active}
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-amber-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${activePercent}%` }}
              />
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-5 text-center">
              {[
                [activeUsers, t.active],
                [inactiveUsers, t.inactive],
                [unassignedUsers, t.unassigned],
              ].map(([value, label]) => (
                <div key={String(label)}>
                  <dt className="text-xs text-text-secondary">{label}</dt>
                  <dd className="mt-1 text-xl font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </section>
      )}

      <section aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="text-lg font-bold">
          {t.quickActions}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const descriptionKey =
              `${action.label}Description` as keyof typeof t;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex min-h-28 items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              >
                <span
                  className="material-symbols-outlined grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--surface-secondary)] text-[var(--accent-primary)]"
                  aria-hidden="true"
                >
                  {action.icon}
                </span>
                <span className="min-w-0">
                  <strong className="block text-sm">{t[action.label]}</strong>
                  <span className="mt-1 block text-xs leading-5 text-text-secondary">
                    {t[descriptionKey]}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
