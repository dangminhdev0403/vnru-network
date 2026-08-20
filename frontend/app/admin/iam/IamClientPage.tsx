"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast, showError } from "@/lib/alerts";

interface User {
  id: string;
  email: string | null;
  status: "ACTIVE" | "INACTIVE";
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export default function IamClientPage() {
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "assign">("users");

  // Users State
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [usersOffset, setUsersOffset] = useState(0);
  const USERS_LIMIT = 10;

  // Roles State
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Status Change Dialog State
  const [statusTargetUser, setStatusTargetUser] = useState<User | null>(null);
  const [statusMutationPending, setStatusMutationPending] = useState(false);
  const [statusMutationError, setStatusMutationError] = useState<string | null>(null);

  // Role Assignment Form State
  const [assignUser, setAssignUser] = useState("");
  const [assignRole, setAssignRole] = useState("");
  const [assignContextType, setAssignContextType] = useState("");
  const [assignContextId, setAssignContextId] = useState("");
  const [assignStatus, setAssignStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [assignmentPending, setAssignmentPending] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);

  // Global Alerts & Permissions
  const [globalSuccessMessage, setGlobalSuccessMessage] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const handleAuthFailure = useCallback(
    (status: number) => {
      if (status === 401) {
        router.push("/api/auth/login?returnTo=/admin/iam");
        return true;
      }
      if (status === 403) {
        setAccessDenied(true);
        return true;
      }
      return false;
    },
    [router]
  );

  // Trigger data reloads
  const [refreshCount, setRefreshCount] = useState(0);
  const triggerRefresh = () => setRefreshCount((prev) => prev + 1);

  // Load Users
  useEffect(() => {
    let active = true;

    async function load() {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const res = await fetch(`/api/admin/users?limit=${USERS_LIMIT}&offset=${usersOffset}`);
        if (handleAuthFailure(res.status)) return;
        if (!res.ok) {
          throw new Error("Failed to load users");
        }
        const data = await res.json();
        if (active) {
          setUsers(data);
        }
      } catch (err: unknown) {
        if (active) {
          setUsersError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
      } finally {
        if (active) {
          setUsersLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [usersOffset, refreshCount, handleAuthFailure]);

  // Load Roles
  useEffect(() => {
    let active = true;

    async function load() {
      setRolesLoading(true);
      setRolesError(null);
      try {
        const res = await fetch("/api/admin/roles?limit=100&offset=0");
        if (handleAuthFailure(res.status)) return;
        if (!res.ok) {
          throw new Error("Failed to load roles");
        }
        const data = await res.json();
        if (active) {
          setRoles(data);
          setSelectedRole((prev) => prev || data[0] || null);
        }
      } catch (err: unknown) {
        if (active) {
          setRolesError(err instanceof Error ? err.message : "An unexpected error occurred");
        }
      } finally {
        if (active) {
          setRolesLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [refreshCount, handleAuthFailure]);

  // Handle User Status Mutation
  const handleUpdateUserStatus = async () => {
    if (!statusTargetUser) return;
    setStatusMutationPending(true);
    setStatusMutationError(null);
    const newStatus = statusTargetUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const res = await fetch(`/api/admin/users/${statusTargetUser.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (handleAuthFailure(res.status)) return;
      if (!res.ok) {
        throw new Error("Failed to update user status");
      }

      setStatusTargetUser(null);
      setGlobalSuccessMessage(`User status updated to ${newStatus} successfully.`);
      showToast({
        title: `Đã cập nhật trạng thái người dùng sang ${newStatus}`,
        icon: "success",
      });
      triggerRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred while updating status";
      setStatusMutationError(msg);
      showError("Cập nhật trạng thái thất bại", msg);
    } finally {
      setStatusMutationPending(false);
    }
  };

  // Handle Role Assignment
  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUser || !assignRole) {
      const msg = "Vui lòng chỉ định cả người dùng và vai trò.";
      setAssignmentError(msg);
      showError("Thiếu thông tin", msg);
      return;
    }

    setAssignmentPending(true);
    setAssignmentError(null);

    try {
      const res = await fetch("/api/admin/role-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: assignUser,
          roleId: assignRole,
          contextType: assignContextType.trim() || undefined,
          contextId: assignContextId.trim() || undefined,
          status: assignStatus,
        }),
      });

      if (handleAuthFailure(res.status)) return;
      if (!res.ok) {
        throw new Error("Failed to assign role");
      }

      setAssignUser("");
      setAssignRole("");
      setAssignContextType("");
      setAssignContextId("");
      setGlobalSuccessMessage("Role assigned successfully.");
      showToast({
        title: "Đã gán vai trò người dùng thành công!",
        icon: "success",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred during role assignment";
      setAssignmentError(msg);
      showError("Gán vai trò thất bại", msg);
    } finally {
      setAssignmentPending(false);
    }
  };

  // 403 Access Denied State (Authoritative Backend Boundary)
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface antialiased font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-outline-variant p-8 shadow-xl text-center space-y-4 animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-3xl">shield_person</span>
          </div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">HTTP 403 • Authorization Required</span>
          <h1 className="font-serif text-2xl font-bold text-primary">Access Denied</h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Your active authorization context does not have permissions to manage IAM governance. This boundary is strictly enforced by the backend auth service.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/" className="px-4 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface">
              Return Home
            </Link>
            <a href="/login" className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container">
              Switch Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
      {/* Top Header */}
      <header className="bg-primary text-white sticky top-0 z-40 border-b border-primary-container">
        <div className="flex justify-between items-center px-6 lg:px-10 h-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-white font-serif font-bold text-sm shadow-sm">
              VR
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight">IAM Governance Console</span>
              <p className="text-[10px] text-white/70 hidden sm:block">Module 1 Identity &amp; Access Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white/80 hidden md:inline">Traditions and Friendship Foundation</span>
            <Link href="/" className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all">
              Exit Console
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex-grow w-full space-y-6 animate-fade-in-up">
        {/* Success Toast */}
        {globalSuccessMessage && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              <span>{globalSuccessMessage}</span>
            </div>
            <button onClick={() => setGlobalSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs">
              ✕
            </button>
          </div>
        )}

        {/* Top Overview */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">Identity &amp; Access Governance</h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Administer user directory, examine permission capabilities, and grant scoped RBAC assignments.
            </p>
          </div>
          <button
            onClick={triggerRefresh}
            className="px-4 py-2 rounded-xl bg-white hover:bg-surface-container border border-outline-variant text-xs font-semibold text-primary transition-all flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Sync Directory</span>
          </button>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-2xl border border-outline-variant/80 w-fit">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "users"
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group</span>
            <span>Identities &amp; Users</span>
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "roles"
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Roles &amp; Policies</span>
          </button>
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "assign"
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">assignment_ind</span>
            <span>Assign Role</span>
          </button>
        </div>

        {/* TAB 1: USERS */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl border border-outline-variant shadow-xs overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif font-bold text-lg text-primary">Registered Platform Identities</h2>
                <p className="text-xs text-on-surface-variant">Validated accounts mapped to Keycloak OIDC subjects.</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-surface-container text-on-surface-variant">
                Page {Math.floor(usersOffset / USERS_LIMIT) + 1}
              </span>
            </div>

            {usersError && (
              <div className="p-4 m-6 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                <span>{usersError}</span>
              </div>
            )}

            {usersLoading ? (
              <div className="p-8 space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-xl"></div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-xs text-on-surface-variant">
                No users found for current filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-semibold border-b border-outline-variant">
                      <th className="py-3.5 px-6">User Identifier</th>
                      <th className="py-3.5 px-6">Email Address</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                        <td className="py-3.5 px-6 font-mono text-[11px] text-primary">{user.id}</td>
                        <td className="py-3.5 px-6 font-medium">{user.email || "—"}</td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              user.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                user.status === "ACTIVE" ? "bg-emerald-600" : "bg-slate-500"
                              }`}
                            ></span>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => setStatusTargetUser(user)}
                            className="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-semibold text-secondary transition-all"
                          >
                            {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="p-4 border-t border-outline-variant flex justify-between items-center">
              <button
                disabled={usersOffset === 0 || usersLoading}
                onClick={() => setUsersOffset((prev) => Math.max(0, prev - USERS_LIMIT))}
                className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface"
              >
                Previous
              </button>
              <button
                disabled={users.length < USERS_LIMIT || usersLoading}
                onClick={() => setUsersOffset((prev) => prev + USERS_LIMIT)}
                className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ROLES */}
        {activeTab === "roles" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-outline-variant p-6 shadow-xs space-y-3">
              <h2 className="font-serif font-bold text-lg text-primary mb-2">Defined RBAC Roles</h2>
              {rolesLoading ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-xl"></div>
                  ))}
                </div>
              ) : rolesError ? (
                <div className="text-xs text-error">{rolesError}</div>
              ) : (
                <div className="space-y-1.5">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                        selectedRole?.id === role.id
                          ? "bg-primary text-white shadow-sm"
                          : "hover:bg-surface text-on-surface"
                      }`}
                    >
                      <span>{role.name}</span>
                      <span className="font-mono text-[10px] opacity-70">
                        {role.permissions?.length || 0} permissions
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant p-6 shadow-xs">
              {selectedRole ? (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-outline-variant mb-4">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-primary">{selectedRole.name}</h3>
                      <p className="text-xs font-mono text-outline mt-0.5">Role ID: {selectedRole.id}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                      Authoritative Policy
                    </span>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-3">
                    Granted Capability Scopes
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                      selectedRole.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-3 py-1 rounded-lg bg-surface-container border border-outline-variant font-mono text-xs text-primary"
                        >
                          {perm}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-on-surface-variant">No explicit capability keys attached.</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-on-surface-variant">
                  Select a role to inspect permission capabilities.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGN ROLE */}
        {activeTab === "assign" && (
          <div className="max-w-2xl bg-white rounded-3xl border border-outline-variant p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif font-bold text-2xl text-primary">Grant Scoped Capability Assignment</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Assign roles scoped to specific organizations, grants, or technology projects.
              </p>
            </div>

            {assignmentError && (
              <div className="p-4 bg-error-container text-on-error-container rounded-xl text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[18px]">error</span>
                <span>{assignmentError}</span>
              </div>
            )}

            <form onSubmit={handleAssignRole} className="space-y-4">
              <div>
                <label htmlFor="assign-user-id" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                  User ID / Principal *
                </label>
                <input
                  id="assign-user-id"
                  type="text"
                  required
                  value={assignUser}
                  onChange={(e) => setAssignUser(e.target.value)}
                  placeholder="e.g. usr_01928374a"
                  className="w-full text-xs rounded-xl border border-outline-variant p-3 focus:ring-secondary font-mono"
                />
              </div>

              <div>
                <label htmlFor="assign-role-id" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                  Assigned Role *
                </label>
                <select
                  id="assign-role-id"
                  required
                  value={assignRole}
                  onChange={(e) => setAssignRole(e.target.value)}
                  className="w-full text-xs rounded-xl border border-outline-variant p-3 focus:ring-secondary bg-white"
                >
                  <option value="">Select a role...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="assign-context-type" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    Context Type (Optional)
                  </label>
                  <input
                    id="assign-context-type"
                    type="text"
                    value={assignContextType}
                    onChange={(e) => setAssignContextType(e.target.value)}
                    placeholder="e.g. ORGANIZATION"
                    className="w-full text-xs rounded-xl border border-outline-variant p-3 focus:ring-secondary font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="assign-context-id" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                    Context ID (Optional)
                  </label>
                  <input
                    id="assign-context-id"
                    type="text"
                    value={assignContextId}
                    onChange={(e) => setAssignContextId(e.target.value)}
                    placeholder="e.g. org_vast_01"
                    className="w-full text-xs rounded-xl border border-outline-variant p-3 focus:ring-secondary font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="assign-status" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant block mb-1.5">
                  Assignment Status
                </label>
                <select
                  id="assign-status"
                  value={assignStatus}
                  onChange={(e) => setAssignStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                  className="w-full text-xs rounded-xl border border-outline-variant p-3 focus:ring-secondary bg-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={assignmentPending}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-md"
                >
                  {assignmentPending && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
                  <span>Submit Assignment</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Status Change Confirmation Modal */}
      {statusTargetUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="status-modal-title"
          className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-outline-variant space-y-4 animate-scale-in">
            <h3 id="status-modal-title" className="font-serif font-bold text-xl text-primary">
              {statusTargetUser.status === "ACTIVE" ? "Deactivate User Identity?" : "Activate User Identity?"}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Target identity: <span className="font-mono font-semibold text-primary">{statusTargetUser.id}</span>
              <br />
              New status will be:{" "}
              <strong>{statusTargetUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"}</strong>
            </p>

            {statusMutationError && (
              <div className="p-3 bg-error-container text-on-error-container text-xs rounded-xl">
                {statusMutationError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={statusMutationPending}
                onClick={() => setStatusTargetUser(null)}
                className="px-4 py-2 rounded-xl border border-outline-variant text-xs font-semibold hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={statusMutationPending}
                onClick={handleUpdateUserStatus}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-container flex items-center gap-2"
              >
                {statusMutationPending && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
                <span>Confirm Status Change</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
