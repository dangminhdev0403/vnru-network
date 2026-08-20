"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast, showError } from "@/lib/alerts";

interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
  activeContext: {
    contextType: string;
    contextId: string;
  } | null;
  current: boolean;
}

export default function SecurityClientPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Dialog & Action States
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<Session | null>(null);
  const [showRevokeOthersDialog, setShowRevokeOthersDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const triggerRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    let active = true;

    async function load() {
      if (refreshCount > 0) {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await fetch("/api/auth/sessions");
        if (!active) return;
        if (res.status === 401) {
          router.push("/api/auth/login?returnTo=/security");
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to load sessions");
        }
        const data = await res.json();
        if (active) {
          setSessions(data);
        }
      } catch (err: unknown) {
        if (active) {
          const msg =
            err instanceof Error ? err.message : "An unexpected error occurred";
          setError(msg);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [refreshCount, router]);

  const handleRevokeSession = async () => {
    if (!sessionToRevoke) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/auth/sessions/${sessionToRevoke.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to revoke session");
      }

      setShowRevokeDialog(false);
      showToast({
        title: "Đã thu hồi phiên đăng nhập thành công",
        icon: "success",
      });

      if (sessionToRevoke.current) {
        router.push("/login");
      } else {
        triggerRefresh();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to revoke session";
      setActionError(msg);
      showError("Thu hồi phiên thất bại", msg);
    } finally {
      setActionLoading(false);
      setSessionToRevoke(null);
    }
  };

  const handleRevokeOthers = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch("/api/auth/sessions", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to revoke other sessions");
      }

      setShowRevokeOthersDialog(false);
      showToast({
        title: "Đã đăng xuất khỏi tất cả thiết bị khác",
        icon: "success",
      });
      triggerRefresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to revoke other sessions";
      setActionError(msg);
      showError("Thu hồi phiên thất bại", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        const { logoutUrl } = (await res.json()) as { logoutUrl: string };
        window.location.assign(logoutUrl);
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
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
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
      {/* Top Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-outline-variant w-full sticky top-0 z-40">
        <div className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary-container to-secondary flex items-center justify-center text-white font-serif font-bold text-sm shadow-sm">
              VR
            </div>
            <div>
              <span className="font-serif font-bold text-base text-primary tracking-tight">VN-RU Security Center</span>
              <p className="text-[10px] text-on-surface-variant hidden sm:block">Cryptographic Token &amp; Session Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-surface-container border border-outline-variant text-on-surface-variant">
              <span className="text-primary font-bold">VN</span>
              <span>/</span>
              <span>RU</span>
              <span>/</span>
              <span>EN</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-low text-xs font-semibold text-primary transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 space-y-8 animate-fade-in-up">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-outline-variant">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Keycloak OIDC Security Gate
              </div>
              <h1 className="font-serif text-3xl font-bold text-primary">Security &amp; Active Sessions</h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Monitor cryptographic browser sessions and ensure identity boundaries across bilateral services.
              </p>
            </div>
            <button
              onClick={triggerRefresh}
              className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant text-xs font-semibold text-primary transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Refresh Status</span>
            </button>
          </div>

          {/* MFA Status Banner */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pl-2">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">shield_lock</span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h2 className="font-serif font-bold text-lg text-primary">Multi-Factor Authentication (MFA)</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Enforced
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Governed by the Traditions and Friendship Foundation identity authority via Keycloak.
                  </p>
                </div>
              </div>
              <button
                disabled
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface-variant cursor-not-allowed text-xs font-semibold shrink-0"
                title="MFA is managed by institutional identity providers"
              >
                Managed in Keycloak
              </button>
            </div>
          </div>

          {/* Action Error Alert */}
          {actionError && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl border border-error/30 flex items-start gap-3 text-xs">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              <div className="font-medium">{actionError}</div>
            </div>
          )}

          {/* Active Sessions List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="font-serif font-bold text-xl text-primary">Cryptographically Active Sessions</h2>
                <p className="text-xs text-on-surface-variant">Validated session tokens bound to your active context.</p>
              </div>
              {sessions && otherSessions.length > 0 && (
                <button
                  onClick={() => setShowRevokeOthersDialog(true)}
                  className="px-4 py-2 rounded-xl bg-error-container text-on-error-container hover:bg-error-container/80 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>Revoke All Other Sessions</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 bg-white rounded-2xl border border-outline-variant shadow-xs animate-pulse flex items-center justify-between">
                    <div className="space-y-2 w-1/3">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-8 bg-white rounded-2xl border border-outline-variant text-center space-y-3">
                <span className="material-symbols-outlined text-error text-4xl">error</span>
                <h3 className="font-serif font-bold text-lg text-primary">Failed to load active sessions</h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">{error}</p>
                <button
                  onClick={triggerRefresh}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  Retry Connection
                </button>
              </div>
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-5 rounded-2xl border transition-all card-hover-lift flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                      session.current
                        ? "bg-white border-secondary/40 shadow-sm ring-1 ring-secondary/20"
                        : "bg-white border-outline-variant shadow-xs"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          session.current
                            ? "bg-secondary-container text-on-secondary-container"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          {session.current ? "laptop_mac" : "devices"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-primary">
                            {session.current ? "Current Active Device" : "Authenticated Session"}
                          </span>
                          {session.current && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-on-surface-variant mt-1 space-y-0.5">
                          <p className="font-mono text-[11px]">
                            Session: <span className="text-primary">{maskSessionId(session.id)}</span>
                          </p>
                          <p className="text-[11px]">
                            Created: {formatDate(session.createdAt)} • Expires: {formatDate(session.expiresAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSessionToRevoke(session);
                        setShowRevokeDialog(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-outline-variant hover:bg-error-container hover:text-error hover:border-error/40 text-xs font-semibold text-on-surface-variant transition-colors"
                    >
                      {session.current ? "Sign Out" : "Revoke"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-outline-variant text-center text-xs text-on-surface-variant">
                No active sessions found.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Revoke Single Session Modal */}
      {showRevokeDialog && sessionToRevoke && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="revoke-single-title"
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-outline-variant space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-error">logout</span>
            </div>
            <h3 id="revoke-single-title" className="font-serif font-bold text-xl text-primary">
              {sessionToRevoke.current ? "Sign Out of Current Session?" : "Revoke Session Token?"}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {sessionToRevoke.current
                ? "You will be redirected to the sign-in portal and your session will be invalidated immediately."
                : "This device will be immediately disconnected from the VN-RU Knowledge Network."}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setShowRevokeDialog(false)}
                className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleRevokeSession}
                className="px-5 py-2 rounded-xl bg-error text-white text-xs font-semibold hover:bg-error/90 transition-all flex items-center gap-2"
              >
                {actionLoading && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
                <span>{sessionToRevoke.current ? "Confirm Sign Out" : "Confirm Revoke"}</span>
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-outline-variant space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">power_settings_new</span>
            </div>
            <h3 id="revoke-others-title" className="font-serif font-bold text-xl text-primary">Revoke All Other Sessions?</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              All other active devices will be signed out immediately. Your current session will remain active.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setShowRevokeOthersDialog(false)}
                className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleRevokeOthers}
                className="px-5 py-2 rounded-xl bg-error text-white text-xs font-semibold hover:bg-error/90 transition-all flex items-center gap-2"
              >
                {actionLoading && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
                <span>Revoke All Other Devices</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
