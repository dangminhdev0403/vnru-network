"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      // For subsequent refreshes, display loading state
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

      // If the revoked session was current, we will be logged out and should redirect.
      if (sessionToRevoke.current) {
        router.push("/login");
      } else {
        triggerRefresh();
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to revoke session";
      setActionError(msg);
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
      triggerRefresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to revoke other sessions";
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Helper to format dates
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
        timeZoneName: "short",
      });
    } catch {
      return isoString;
    }
  };

  // Helper to mask session IDs safely
  const maskSessionId = (id: string) => {
    if (id.length <= 12) return id;
    return `${id.slice(0, 6)}••••${id.slice(-6)}`;
  };

  const otherSessions = sessions?.filter((s) => !s.current) || [];

  return (
    <div className="bg-background text-on-background antialiased min-h-screen flex flex-col font-sans">
      {/* TopNavBar */}
      <header className="bg-surface text-primary border-b border-outline-variant w-full top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-2xl"
            >
              menu
            </span>
            <span className="font-sans text-headline-md font-bold text-primary">
              Collaboration Network
            </span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4">
              <button
                aria-label="Vietnamese"
                className="text-on-surface-variant hover:text-primary transition-colors font-sans text-label-sm uppercase"
              >
                VI
              </button>
              <button
                aria-label="Russian"
                className="text-on-surface-variant hover:text-primary transition-colors font-sans text-label-sm uppercase"
              >
                RU
              </button>
              <button
                aria-current="true"
                aria-label="English"
                className="text-primary font-bold border-b-2 border-primary pb-1 font-sans text-label-sm uppercase"
              >
                EN
              </button>
            </nav>
            <div className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant">
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-on-surface-variant text-sm mr-2"
              >
                search
              </span>
              <input
                className="bg-transparent border-none outline-none text-sm text-on-surface w-48 placeholder-on-surface-variant font-sans focus:ring-0"
                placeholder="Search..."
                type="text"
                disabled
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                aria-label="Notifications"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  notifications
                </span>
              </button>
              <button
                aria-label="Settings"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <span aria-hidden="true" className="material-symbols-outlined">
                  settings
                </span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm border border-outline-variant">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-container-max mx-auto w-full">
        {/* SideNavBar */}
        <aside className="hidden md:flex flex-col p-stack-sm w-[280px] h-[calc(100vh-64px)] overflow-y-auto bg-surface-container-low border-r border-outline-variant sticky top-16 z-40">
          <div className="mb-8 px-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-lg">
              GR
            </div>
            <div>
              <h2 className="font-sans text-label-md font-bold text-primary truncate">
                Global Research
              </h2>
              <p className="font-sans text-label-sm text-on-surface-variant truncate">
                Institutional Admin
              </p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 group"
              href="#"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined group-hover:text-primary transition-colors"
              >
                dashboard
              </span>
              <span className="font-sans text-label-md">Dashboard</span>
            </a>
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 group"
              href="#"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined group-hover:text-primary transition-colors"
              >
                description
              </span>
              <span className="font-sans text-label-md">Research Papers</span>
            </a>
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 group"
              href="#"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined group-hover:text-primary transition-colors"
              >
                payments
              </span>
              <span className="font-sans text-label-md">Grants</span>
            </a>
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 group"
              href="#"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined group-hover:text-primary transition-colors"
              >
                account_balance
              </span>
              <span className="font-sans text-label-md">Institutions</span>
            </a>
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 group"
              href="#"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined group-hover:text-primary transition-colors"
              >
                group
              </span>
              <span className="font-sans text-label-md">Expert Directory</span>
            </a>
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 group"
              href="#"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined group-hover:text-primary transition-colors"
              >
                inventory_2
              </span>
              <span className="font-sans text-label-md">Archive</span>
            </a>
          </nav>
          <div className="mt-auto border-t border-outline-variant pt-4 space-y-1">
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 group"
              href="#"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined group-hover:text-primary transition-colors"
              >
                help
              </span>
              <span className="font-sans text-label-md">Support</span>
            </a>
            <button
              onClick={handleSignOut}
              className="w-full text-left flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all duration-200 group"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined group-hover:text-primary transition-colors"
              >
                logout
              </span>
              <span className="font-sans text-label-md">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-y-auto">
          {/* Page Header */}
          <div className="mb-stack-lg">
            <h1 className="font-sans text-headline-lg-mobile md:text-headline-lg text-primary font-bold mb-2">
              Security &amp; Sessions
            </h1>
            <p className="font-serif text-body-lg text-on-surface-variant max-w-3xl">
              Monitor active sessions across devices and manage your
              authentication security to ensure your institutional account
              remains secure.
            </p>
          </div>

          {/* MFA Status Section */}
          <section className="mb-stack-lg bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-1 md:mt-0">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-2xl"
                  >
                    shield_lock
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-sans text-headline-md text-primary">
                      Multi-Factor Authentication (MFA)
                    </h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-sans font-bold bg-surface-variant text-on-surface">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span>
                      Keycloak-managed
                    </span>
                  </div>
                  <p className="font-serif text-body-md text-on-surface-variant">
                    Your MFA settings are governed by institutional identity
                    provider policies.
                  </p>
                </div>
              </div>
              <button
                disabled
                className="shrink-0 bg-primary/20 text-on-primary-container cursor-not-allowed font-sans text-label-md font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 justify-center w-full md:w-auto"
                title="MFA management link is managed by institutional administrators"
              >
                <span>Manage MFA in Keycloak</span>
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-sm"
                >
                  open_in_new
                </span>
              </button>
            </div>
          </section>

          {/* Active Sessions Section */}
          <section className="mb-stack-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-stack-sm gap-4">
              <div>
                <h2 className="font-sans text-headline-md text-primary mb-1">
                  Active Sessions
                </h2>
                <p className="font-serif text-body-md text-on-surface-variant">
                  Devices currently logged into your account.
                </p>
              </div>
              {sessions && otherSessions.length > 0 && (
                <button
                  onClick={() => setShowRevokeOthersDialog(true)}
                  className="text-error hover:text-error/80 font-sans text-label-md font-bold transition-colors flex items-center gap-1.5 shrink-0 bg-error-container/20 px-4 py-2 rounded-lg border border-error-container hover:bg-error-container/40"
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-sm"
                  >
                    person_cancel
                  </span>
                  Sign out all other devices
                </button>
              )}
            </div>

            {/* Error message from background actions */}
            {actionError && (
              <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg border border-error flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-error"
                >
                  error
                </span>
                <div className="text-sm font-sans">{actionError}</div>
              </div>
            )}

            {/* Main States rendering */}
            {loading ? (
              /* Loading Skeleton */
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-pulse"
                  >
                    <div className="flex items-start gap-4 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded bg-outline-variant/30 shrink-0"></div>
                      <div className="space-y-2 w-48">
                        <div className="h-4 bg-outline-variant/30 rounded w-3/4"></div>
                        <div className="h-3 bg-outline-variant/30 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden min-h-[250px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
                <div className="w-16 h-16 rounded-full bg-error-container/30 flex items-center justify-center text-error mb-4">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-3xl"
                  >
                    error
                  </span>
                </div>
                <h4 className="font-sans text-headline-md text-primary mb-2">
                  Failed to load sessions
                </h4>
                <p className="font-serif text-sm text-on-surface-variant max-w-[280px] mb-4">
                  {error}
                </p>
                <button
                  onClick={triggerRefresh}
                  className="text-primary font-sans text-label-sm underline hover:text-secondary transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : !sessions || sessions.length === 0 ? (
              /* Empty State (Should theoretically contain at least current session, but fallback just in case) */
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm h-[250px]">
                <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant mb-4">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-3xl"
                  >
                    devices
                  </span>
                </div>
                <h4 className="font-sans text-headline-md text-primary mb-2">
                  No Active Sessions
                </h4>
                <p className="font-serif text-sm text-on-surface-variant max-w-[250px]">
                  You currently have no active sessions logged.
                </p>
              </div>
            ) : (
              /* List State */
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 md:p-6 hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-start gap-4 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
                        <span
                          aria-hidden="true"
                          className="material-symbols-outlined"
                        >
                          security
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-sans text-label-md font-bold text-primary">
                            Session {maskSessionId(session.id)}
                          </h3>
                          {session.current && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-sans font-bold bg-secondary-container text-on-secondary-container">
                              Current Session
                            </span>
                          )}
                          {session.activeContext && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-sans font-medium bg-primary-container text-on-primary-container">
                              Context: {session.activeContext.contextType} (
                              {session.activeContext.contextId})
                            </span>
                          )}
                        </div>
                        <div className="font-serif text-sm text-on-surface-variant flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <span className="flex items-center gap-1">
                            <span
                              aria-hidden="true"
                              className="material-symbols-outlined text-[14px]"
                            >
                              calendar_today
                            </span>
                            Created: {formatDate(session.createdAt)}
                          </span>
                          <span className="hidden sm:inline text-outline">
                            •
                          </span>
                          <span className="flex items-center gap-1">
                            <span
                              aria-hidden="true"
                              className="material-symbols-outlined text-[14px]"
                            >
                              hourglass_empty
                            </span>
                            Expires: {formatDate(session.expiresAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!session.current && (
                      <button
                        onClick={() => {
                          setSessionToRevoke(session);
                          setShowRevokeDialog(true);
                        }}
                        className="shrink-0 bg-surface-container-low border border-outline-variant text-on-surface-variant font-sans text-label-sm py-1.5 px-4 rounded-lg hover:bg-surface-variant hover:text-error transition-colors flex items-center gap-1"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Empty State visual indicator for other active sessions */}
          {!loading && !error && sessions && otherSessions.length === 0 && (
            <div className="mt-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm h-[200px]">
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant mb-3">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-2xl"
                >
                  devices
                </span>
              </div>
              <h4 className="font-sans text-[16px] font-bold text-primary mb-1">
                No Other Active Sessions
              </h4>
              <p className="font-serif text-sm text-on-surface-variant max-w-[280px]">
                You are not logged in on any other devices or browser sessions.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full bottom-0 border-t border-outline-variant mt-auto">
        <div className="flex justify-between items-center py-base px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto flex-col md:flex-row gap-4 md:gap-0">
          <span className="font-sans text-label-md font-bold text-primary text-center md:text-left">
            © 2026 VN-RU Scientific Collaboration Network. All Rights Reserved.
          </span>
          <nav className="flex items-center gap-6">
            <a
              className="font-sans text-label-sm text-on-surface-variant hover:text-primary underline decoration-1"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-sans text-label-sm text-on-surface-variant hover:text-primary underline decoration-1"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="font-sans text-label-sm text-on-surface-variant hover:text-primary underline decoration-1"
              href="#"
            >
              Contact Support
            </a>
          </nav>
        </div>
      </footer>

      {/* Confirmation Dialog Overlay - Revoke Specific Session */}
      {showRevokeDialog && sessionToRevoke && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant w-full max-w-md overflow-hidden transform scale-100 transition-transform duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center text-error mb-4">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-2xl"
                >
                  warning
                </span>
              </div>
              <h3 className="font-sans text-[20px] font-bold text-primary mb-2">
                Revoke Session?
              </h3>
              <p className="font-serif text-body-md text-on-surface-variant mb-6">
                Are you sure you want to sign out session &quot;
                {maskSessionId(sessionToRevoke.id)}&quot;? You will need to log
                in again on that device/browser.
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  disabled={actionLoading}
                  className="px-4 py-2 border border-outline-variant text-on-surface-variant font-sans text-label-sm rounded-lg hover:bg-surface-variant transition-colors disabled:opacity-50"
                  onClick={() => {
                    setShowRevokeDialog(false);
                    setSessionToRevoke(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleRevokeSession}
                  className="px-4 py-2 bg-error text-on-error font-sans text-label-sm rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {actionLoading ? "Revoking..." : "Revoke Session"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Overlay - Revoke Others */}
      {showRevokeOthersDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant w-full max-w-md overflow-hidden transform scale-100 transition-transform duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center text-error mb-4">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-2xl"
                >
                  warning
                </span>
              </div>
              <h3 className="font-sans text-[20px] font-bold text-primary mb-2">
                Sign Out All Other Devices?
              </h3>
              <p className="font-serif text-body-md text-on-surface-variant mb-6">
                Are you sure you want to log out from all other active sessions?
                All other logged-in devices and browsers will be disconnected
                immediately.
              </p>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  disabled={actionLoading}
                  className="px-4 py-2 border border-outline-variant text-on-surface-variant font-sans text-label-sm rounded-lg hover:bg-surface-variant transition-colors disabled:opacity-50"
                  onClick={() => setShowRevokeOthersDialog(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={handleRevokeOthers}
                  className="px-4 py-2 bg-error text-on-error font-sans text-label-sm rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "Signing out others..." : "Sign Out Others"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
