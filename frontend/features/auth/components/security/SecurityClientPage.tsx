"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmAction, showToast, showError } from "@/lib/alerts";
import { useSessions } from "@/features/iam/hooks";
import type { IamSession as Session } from "@/features/iam/repository";
import ProfileDialog from "./ProfileDialog";
import MfaControl from "./MfaControl";

const securityCopy: Record<
  Locale,
  {
    gateBadge: string;
    title: string;
    description: string;
    refreshBtn: string;
    profileTitle: string;
    profileDesc: string;
    profileAction: string;
    mfaTitle: string;
    mfaEnforced: string;
    mfaDesc: string;
    mfaManaged: string;
    sessionsHeader: string;
    sessionsSubheader: string;
    revokeOthersBtn: string;
    noSessions: string;
    errorSessions: string;
    retryBtn: string;
    currentDevice: string;
    authenticatedSession: string;
    currentTag: string;
    sessionLabel: string;
    createdLabel: string;
    expiresLabel: string;
    signOutBtn: string;
    revokeBtn: string;
    modalSignOutTitle: string;
    modalRevokeTitle: string;
    modalSignOutDesc: string;
    modalRevokeDesc: string;
    cancelBtn: string;
    confirmSignOutBtn: string;
    confirmRevokeBtn: string;
    modalOthersTitle: string;
    modalOthersDesc: string;
    confirmRevokeOthersBtn: string;
    toastRevokedOthers: string;
    revokeFailedTitle: string;
    sessionColumn: string;
    contextColumn: string;
    createdColumn: string;
    expiresColumn: string;
    actionColumn: string;
  }
> = {
  vi: {
    gateBadge: "Cổng bảo mật Auth.js",
    title: "Phiên hoạt động & Quản lý Bảo mật",
    description:
      "Giám sát các phiên trình duyệt được mã hóa và đảm bảo ranh giới danh tính trên các dịch vụ song phương.",
    refreshBtn: "Làm mới trạng thái",
    profileTitle: "Hồ sơ cá nhân",
    profileDesc:
      "Cập nhật tên, email và thông tin tài khoản trong hồ sơ ứng dụng.",
    profileAction: "Chỉnh sửa hồ sơ",
    mfaTitle: "Xác thực Đa yếu tố (MFA)",
    mfaEnforced: "Bắt buộc",
    mfaDesc:
      "Quản trị bởi cơ quan thẩm quyền danh tính Quỹ Truyền thống và Hữu nghị thông qua Auth.js.",
    mfaManaged: "Quản lý 2FA",
    sessionsHeader: "Danh sách Phiên đang Hoạt động",
    sessionsSubheader:
      "Các mã phiên hợp lệ gắn liền với ngữ cảnh đang kích hoạt của bạn.",
    revokeOthersBtn: "Thu hồi tất cả phiên khác",
    noSessions: "Không tìm thấy phiên hoạt động nào.",
    errorSessions: "Không thể tải danh sách phiên hoạt động",
    retryBtn: "Thử kết nối lại",
    currentDevice: "Thiết bị hiện tại",
    authenticatedSession: "Phiên đã xác thực",
    currentTag: "Hiện tại",
    sessionLabel: "Mã phiên",
    createdLabel: "Khởi tạo",
    expiresLabel: "Hết hạn",
    signOutBtn: "Đăng xuất",
    revokeBtn: "Thu hồi",
    modalSignOutTitle: "Đăng xuất khỏi phiên hiện tại?",
    modalRevokeTitle: "Thu hồi mã phiên này?",
    modalSignOutDesc:
      "Bạn sẽ được chuyển hướng về trang đăng nhập và phiên làm việc sẽ kết thúc ngay lập tức.",
    modalRevokeDesc:
      "Thiết bị này sẽ bị ngắt kết nối ngay lập tức khỏi Mạng lưới tri thức Nga - Việt.",
    cancelBtn: "Hủy",
    confirmSignOutBtn: "Xác nhận đăng xuất",
    confirmRevokeBtn: "Xác nhận thu hồi",
    modalOthersTitle: "Thu hồi tất cả thiết bị khác?",
    modalOthersDesc:
      "Tất cả các thiết bị khác đang hoạt động sẽ bị đăng xuất ngay lập tức. Phiên hiện tại của bạn vẫn được duy trì.",
    confirmRevokeOthersBtn: "Thu hồi tất cả thiết bị khác",
    toastRevokedOthers: "Đã đăng xuất khỏi tất cả thiết bị khác",
    revokeFailedTitle: "Thu hồi phiên thất bại",
    sessionColumn: "Phiên đăng nhập",
    contextColumn: "Ngữ cảnh",
    createdColumn: "Khởi tạo",
    expiresColumn: "Hết hạn",
    actionColumn: "Hành động",
  },
  en: {
    gateBadge: "Auth.js Security Gate",
    title: "Security & Active Sessions",
    description:
      "Monitor cryptographic browser sessions and ensure identity boundaries across bilateral services.",
    refreshBtn: "Refresh Status",
    profileTitle: "Personal Profile",
    profileDesc:
      "Update your name, email, and account details in your application profile.",
    profileAction: "Edit profile",
    mfaTitle: "Multi-Factor Authentication (MFA)",
    mfaEnforced: "Enforced",
    mfaDesc:
      "Governed by the Traditions and Friendship Foundation identity authority via Auth.js.",
    mfaManaged: "Manage 2FA",
    sessionsHeader: "Cryptographically Active Sessions",
    sessionsSubheader: "Validated session tokens bound to your active context.",
    revokeOthersBtn: "Revoke All Other Sessions",
    noSessions: "No active sessions found.",
    errorSessions: "Failed to load active sessions",
    retryBtn: "Retry Connection",
    currentDevice: "Current Active Device",
    authenticatedSession: "Authenticated Session",
    currentTag: "Current",
    sessionLabel: "Session",
    createdLabel: "Created",
    expiresLabel: "Expires",
    signOutBtn: "Sign Out",
    revokeBtn: "Revoke",
    modalSignOutTitle: "Sign Out of Current Session?",
    modalRevokeTitle: "Revoke Session Token?",
    modalSignOutDesc:
      "You will be redirected to the sign-in portal and your session will be invalidated immediately.",
    modalRevokeDesc:
      "This device will be immediately disconnected from Mạng lưới tri thức Nga - Việt.",
    cancelBtn: "Cancel",
    confirmSignOutBtn: "Confirm Sign Out",
    confirmRevokeBtn: "Confirm Revoke",
    modalOthersTitle: "Revoke All Other Sessions?",
    modalOthersDesc:
      "All other active devices will be signed out immediately. Your current session will remain active.",
    confirmRevokeOthersBtn: "Revoke All Other Devices",
    toastRevokedOthers: "Signed out of all other devices successfully",
    revokeFailedTitle: "Failed to revoke session",
    sessionColumn: "Session",
    contextColumn: "Context",
    createdColumn: "Created",
    expiresColumn: "Expires",
    actionColumn: "Action",
  },
  ru: {
    gateBadge: "Шлюз безопасности Auth.js",
    title: "Безопасность и активные сессии",
    description:
      "Мониторинг зашифрованных сессий браузера и обеспечение границ безопасности двусторонних сервисов.",
    refreshBtn: "Обновить статус",
    profileTitle: "Личный профиль",
    profileDesc:
      "Измените имя, email и данные учетной записи в профиле приложения.",
    profileAction: "Изменить профиль",
    mfaTitle: "Многофакторная аутентификация (MFA)",
    mfaEnforced: "Обязательно",
    mfaDesc:
      "Управляется центром идентификации Фонда «Традиции и дружба» через Auth.js.",
    mfaManaged: "Управление 2FA",
    sessionsHeader: "Активные зашифрованные сессии",
    sessionsSubheader:
      "Проверенные токены сессий, привязанные к вашему текущему контексту.",
    revokeOthersBtn: "Отозвать все другие сессии",
    noSessions: "Активных сессий не найдено.",
    errorSessions: "Не удалось загрузить активные сессии",
    retryBtn: "Повторить попытку",
    currentDevice: "Текущее устройство",
    authenticatedSession: "Аутентифицированная сессия",
    currentTag: "Текущая",
    sessionLabel: "Сессия",
    createdLabel: "Создана",
    expiresLabel: "Истекает",
    signOutBtn: "Выйти",
    revokeBtn: "Отозвать",
    modalSignOutTitle: "Выйти из текущей сессии?",
    modalRevokeTitle: "Отозвать токен сессии?",
    modalSignOutDesc:
      "Вы будете перенаправлены на страницу входа, а текущая сессия завершится немедленно.",
    modalRevokeDesc:
      "Это устройство будет немедленно отключено от Сети НТИ Россия — Вьетнам.",
    cancelBtn: "Отмена",
    confirmSignOutBtn: "Подтвердить выход",
    confirmRevokeBtn: "Подтвердить отзыв",
    modalOthersTitle: "Отозвать все остальные сессии?",
    modalOthersDesc:
      "Все остальные активные устройства будут немедленно отключены. Ваша текущая сессия сохранится.",
    confirmRevokeOthersBtn: "Отозвать остальные устройства",
    toastRevokedOthers: "Выполнен выход на всех остальных устройствах",
    revokeFailedTitle: "Ошибка отзыва сессии",
    sessionColumn: "Сессия",
    contextColumn: "Контекст",
    createdColumn: "Создана",
    expiresColumn: "Истекает",
    actionColumn: "Действие",
  },
};

export default function SecurityClientPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = securityCopy[locale] || securityCopy.vi;
  const sessionState = useSessions();
  const sessions = sessionState.sessions.data;
  const loading = sessionState.sessions.isPending;
  const error = sessionState.sessions.error;

  // Dialog & Action States
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<Session | null>(null);
  const [showRevokeOthersDialog, setShowRevokeOthersDialog] = useState(false);
  const actionLoading =
    sessionState.revokeSession.isPending ||
    sessionState.revokeOtherSessions.isPending;
  const [actionError, setActionError] = useState<string | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const triggerRefresh = () => void sessionState.sessions.refetch();

  const handleRevokeSession = async (session = sessionToRevoke) => {
    if (!session) return;
    if (!(await confirmAction({ title: session.current ? t.modalSignOutTitle : t.modalRevokeTitle, text: session.current ? t.modalSignOutDesc : t.modalRevokeDesc, isDestructive: true })).isConfirmed) return;
    setActionError(null);
    try {
      await sessionState.revokeSession.mutateAsync(session.id);

      setShowRevokeDialog(false);
      showToast({
        title: t.toastRevokedOthers, // Assuming simple success message
        icon: "success",
      });

      if (session.current) {
        router.push("/login?state=revoked");
      } else {
        triggerRefresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.revokeFailedTitle;
      setActionError(msg);
      showError(t.revokeFailedTitle, msg);
    } finally {
      setSessionToRevoke(null);
    }
  };

  const handleRevokeOthers = async () => {
    if (!(await confirmAction({ title: t.modalOthersTitle, text: t.modalOthersDesc, isDestructive: true })).isConfirmed) return;
    setActionError(null);
    try {
      await sessionState.revokeOtherSessions.mutateAsync();

      setShowRevokeOthersDialog(false);
      showToast({
        title: t.toastRevokedOthers,
        icon: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.revokeFailedTitle;
      setActionError(msg);
      showError(t.revokeFailedTitle, msg);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString(
        locale === "ru" ? "ru-RU" : locale === "vi" ? "vi-VN" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    } catch {
      return isoString;
    }
  };

  const maskSessionId = (id: string) => {
    if (id.length <= 12) return id;
    return `${id.slice(0, 6)}••••${id.slice(-6)}`;
  };

  const otherSessions = sessions?.filter((s) => !s.current) || [];

  return (
    <>
      <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--accent-primary)]">
              {t.gateBadge}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
              {t.title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-text-secondary">
              {t.description}
            </p>
          </div>
          <button
            type="button"
            onClick={triggerRefresh}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-card-border bg-card-background px-4 text-sm font-semibold text-text-primary hover:bg-card-surface-area"
          >
            <span
              className="material-symbols-outlined text-lg"
              aria-hidden="true"
            >
              refresh
            </span>
            {t.refreshBtn}
          </button>
        </header>

        <section
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6"
          aria-labelledby="profile-title"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined grid size-11 shrink-0 place-items-center rounded-[14px] bg-[var(--surface-secondary)] text-[var(--accent-primary)]"
                aria-hidden="true"
              >
                person
              </span>
              <div>
                <h2
                  id="profile-title"
                  className="text-lg font-bold text-text-primary"
                >
                  {t.profileTitle}
                </h2>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  {t.profileDesc}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowProfileDialog(true)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-card-border px-4 text-sm font-semibold text-text-primary hover:bg-card-surface-area"
            >
              {t.profileAction}
            </button>
          </div>
        </section>

        <section
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] sm:p-6"
          aria-labelledby="mfa-title"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span
                className="material-symbols-outlined grid size-11 shrink-0 place-items-center rounded-[14px] bg-[var(--surface-secondary)] text-[var(--accent-primary)]"
                aria-hidden="true"
              >
                shield_lock
              </span>
              <div>
                <h2
                  id="mfa-title"
                  className="text-lg font-bold text-text-primary"
                >
                  {t.mfaTitle}
                </h2>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  {t.mfaDesc}
                </p>
              </div>
            </div>
            <MfaControl locale={locale} />
          </div>
        </section>

        {actionError && (
          <div
            role="alert"
            className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          >
            {actionError}
          </div>
        )}

        <section
          className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
          aria-labelledby="sessions-title"
        >
          <div className="flex flex-col justify-between gap-3 border-b border-card-border p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2
                id="sessions-title"
                className="text-xl font-bold text-text-primary"
              >
                {t.sessionsHeader}
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                {t.sessionsSubheader}
              </p>
            </div>
            {sessions && otherSessions.length > 0 && (
              <button
                type="button"
                disabled={actionLoading}
                aria-busy={actionLoading}
                onClick={() => handleRevokeOthers()}
                className="min-h-11 rounded-xl border border-red-300 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
              >
                {t.revokeOthersBtn}
              </button>
            )}
          </div>

          {loading ? (
            <div
              className="p-8 text-center text-sm text-text-secondary"
              role="status"
            >
              {t.refreshBtn}…
            </div>
          ) : error ? (
            <div className="space-y-3 p-8 text-center">
              <p className="font-semibold text-red-700 dark:text-red-300">
                {t.errorSessions}
              </p>
              <p className="text-sm text-text-secondary">
                {error instanceof Error ? error.message : t.errorSessions}
              </p>
              <button
                type="button"
                onClick={triggerRefresh}
                className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {t.retryBtn}
              </button>
            </div>
          ) : sessions?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-[var(--surface-secondary)] text-xs uppercase tracking-wide text-text-secondary">
                  <tr>
                    <th className="px-5 py-3 font-semibold">
                      {t.sessionColumn}
                    </th>
                    <th className="px-5 py-3 font-semibold">
                      {t.contextColumn}
                    </th>
                    <th className="px-5 py-3 font-semibold">
                      {t.createdColumn}
                    </th>
                    <th className="px-5 py-3 font-semibold">
                      {t.expiresColumn}
                    </th>
                    <th className="px-5 py-3 text-right font-semibold">
                      {t.actionColumn}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className={
                        session.current
                          ? "bg-[var(--surface-secondary)]"
                          : undefined
                      }
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="material-symbols-outlined text-xl text-text-secondary"
                            aria-hidden="true"
                          >
                            {session.current ? "laptop_mac" : "devices"}
                          </span>
                          <div>
                            <p className="font-semibold text-text-primary">
                              {session.current
                                ? t.currentDevice
                                : t.authenticatedSession}
                            </p>
                            <p className="mt-0.5 font-mono text-xs text-text-secondary">
                              {maskSessionId(session.id)}
                            </p>
                          </div>
                          {session.current && (
                            <span className="rounded-full bg-[var(--surface-raised)] px-2 py-1 text-xs font-bold text-[var(--accent-primary)]">
                              {t.currentTag}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-secondary">
                        {session.activeContext
                          ? `${session.activeContext.contextType} / ${session.activeContext.contextId}`
                          : "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-secondary">
                        {formatDate(session.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-secondary">
                        {formatDate(session.expiresAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={actionLoading}
                          aria-busy={actionLoading}
                          onClick={() => handleRevokeSession(session)}
                          className="min-h-10 rounded-xl border border-red-300 px-3 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                        >
                          {session.current ? t.signOutBtn : t.revokeBtn}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-text-secondary">
              {t.noSessions}
            </div>
          )}
          {sessionState.sessions.isFetching && !loading ? (
            <p
              className="border-t border-card-border p-3 text-center text-sm text-blue-700"
              role="status"
            >
              Đang cập nhật phiên…
            </p>
          ) : null}
          {sessionState.sessions.isError && sessions ? (
            <p
              className="border-t border-card-border p-3 text-center text-sm text-amber-700"
              role="status"
            >
              Đang hiển thị dữ liệu phiên cũ.
            </p>
          ) : null}
        </section>
      </main>

      {showProfileDialog && (
        <ProfileDialog
          onClose={() => setShowProfileDialog(false)}
          locale={locale}
        />
      )}

      {/* Revoke Single Session Modal */}
      {showRevokeDialog && sessionToRevoke && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="revoke-single-title"
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 text-text-primary shadow-[var(--shadow-soft)] sm:p-8">
            <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-error">
                logout
              </span>
            </div>
            <h3
              id="revoke-single-title"
              className="font-serif font-bold text-xl text-primary"
            >
              {sessionToRevoke.current
                ? t.modalSignOutTitle
                : t.modalRevokeTitle}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {sessionToRevoke.current ? t.modalSignOutDesc : t.modalRevokeDesc}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setShowRevokeDialog(false)}
                className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface cursor-pointer"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleRevokeSession()}
                className="px-5 py-2 rounded-xl bg-error text-white text-xs font-semibold hover:bg-error/90 transition-all flex items-center gap-2 cursor-pointer"
              >
                {actionLoading && (
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                )}
                <span>
                  {sessionToRevoke.current
                    ? t.confirmSignOutBtn
                    : t.confirmRevokeBtn}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Others Modal */}
      {showRevokeOthersDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="revoke-others-title"
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 text-text-primary shadow-[var(--shadow-soft)] sm:p-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">
                power_settings_new
              </span>
            </div>
            <h3
              id="revoke-others-title"
              className="font-serif font-bold text-xl text-primary"
            >
              {t.modalOthersTitle}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {t.modalOthersDesc}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setShowRevokeOthersDialog(false)}
                className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface cursor-pointer"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleRevokeOthers}
                className="px-5 py-2 rounded-xl bg-error text-white text-xs font-semibold hover:bg-error/90 transition-all flex items-center gap-2 cursor-pointer"
              >
                {actionLoading && (
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                )}
                <span>{t.confirmRevokeOthersBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
