"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "assign">(
    "users",
  );

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
  const [statusMutationError, setStatusMutationError] = useState<string | null>(
    null,
  );
  const statusDialogRef = useRef<HTMLDialogElement>(null);

  // Role Assignment Form State
  const [assignUser, setAssignUser] = useState("");
  const [assignRole, setAssignRole] = useState("");
  const [assignContextType, setAssignContextType] = useState("");
  const [assignContextId, setAssignContextId] = useState("");
  const [assignStatus, setAssignStatus] = useState<"ACTIVE" | "INACTIVE">(
    "ACTIVE",
  );
  const [assignmentPending, setAssignmentPending] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string | null>(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  // Success Notification banner
  const [globalSuccessMessage, setGlobalSuccessMessage] = useState<
    string | null
  >(null);
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
    [router],
  );

  // Refresh state to trigger data reloading
  const [refreshCount, setRefreshCount] = useState(0);
  const triggerRefresh = () => setRefreshCount((prev) => prev + 1);

  // Load Users Effect
  useEffect(() => {
    let active = true;

    async function load() {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const res = await fetch(
          `/api/admin/users?limit=${USERS_LIMIT}&offset=${usersOffset}`,
        );
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
          setUsersError(
            err instanceof Error ? err.message : "An unexpected error occurred",
          );
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

  // Load Roles Effect
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
          setRolesError(
            err instanceof Error ? err.message : "An unexpected error occurred",
          );
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

  // Handle patch user status
  const handleConfirmStatusChange = async () => {
    if (!statusTargetUser) return;
    setStatusMutationPending(true);
    setStatusMutationError(null);

    const nextStatus =
      statusTargetUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      const res = await fetch(
        `/api/admin/users/${statusTargetUser.id}/status`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      );

      if (handleAuthFailure(res.status)) return;

      if (!res.ok) {
        throw new Error("Failed to update user status");
      }

      setGlobalSuccessMessage(
        `Successfully updated user ${statusTargetUser.email || statusTargetUser.id} to ${nextStatus}.`,
      );
      setTimeout(() => setGlobalSuccessMessage(null), 5000);

      statusDialogRef.current?.close();
      setStatusTargetUser(null);
      triggerRefresh();
    } catch (err: unknown) {
      setStatusMutationError(
        err instanceof Error ? err.message : "Failed to change user status",
      );
    } finally {
      setStatusMutationPending(false);
    }
  };

  // Handle post role assignment
  const handleAssignRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !assignUser ||
      !assignRole ||
      !assignContextType.trim() ||
      !assignContextId.trim()
    ) {
      setAssignmentError("All fields are required.");
      return;
    }

    setAssignmentPending(true);
    setAssignmentError(null);
    setAssignmentSuccess(false);

    try {
      const res = await fetch("/api/admin/role-assignments", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: assignUser,
          roleId: assignRole,
          contextType: assignContextType.trim(),
          contextId: assignContextId.trim(),
          status: assignStatus,
        }),
      });

      if (handleAuthFailure(res.status)) return;

      if (!res.ok) {
        throw new Error(
          "Failed to assign role. Make sure fields are valid and context exists.",
        );
      }

      setAssignmentSuccess(true);
      setAssignContextType("");
      setAssignContextId("");
      // Refresh list of users to reflect any state changes if needed
      triggerRefresh();
    } catch (err: unknown) {
      setAssignmentError(
        err instanceof Error ? err.message : "Failed to assign role.",
      );
    } finally {
      setAssignmentPending(false);
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

  // Helper to mask IDs safely
  const maskId = (id: string) => {
    if (id.length <= 12) return id;
    return `${id.slice(0, 6)}••••${id.slice(-6)}`;
  };

  const renderUsersTab = () => {
    if (usersLoading) {
      return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm divide-y divide-outline-variant">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 md:p-6 flex justify-between items-center animate-pulse"
            >
              <div className="space-y-2 w-48">
                <div className="h-4 bg-outline-variant/30 rounded w-3/4"></div>
                <div className="h-3 bg-outline-variant/30 rounded w-5/6"></div>
              </div>
              <div className="h-8 bg-outline-variant/30 rounded w-24"></div>
            </div>
          ))}
        </div>
      );
    }

    if (usersError) {
      return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden min-h-[250px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
          <div className="w-16 h-16 rounded-full bg-error-container/30 flex items-center justify-center text-error mb-4">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <h4 className="font-sans text-headline-md text-primary mb-2">
            Failed to load users
          </h4>
          <p className="font-serif text-sm text-on-surface-variant max-w-[280px] mb-4">
            {usersError}
          </p>
          <button
            onClick={triggerRefresh}
            className="text-primary font-sans text-label-sm underline hover:text-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm h-[250px]">
          <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant mb-4">
            <span className="material-symbols-outlined text-3xl">group</span>
          </div>
          <h4 className="font-sans text-headline-md text-primary mb-2">
            No Users Found
          </h4>
          <p className="font-serif text-sm text-on-surface-variant max-w-[250px]">
            No user records are available in this slice.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-surface border border-outline-variant rounded shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-label-sm text-on-surface uppercase tracking-wider">
                <th className="p-4 font-bold">User ID</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-body-md text-body-md text-on-surface">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="p-4 font-mono text-sm">{maskId(user.id)}</td>
                  <td className="p-4">
                    {user.email || (
                      <span className="text-on-surface-variant italic">
                        No Email
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                        user.status === "ACTIVE"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-outline-variant text-on-surface-variant"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setStatusTargetUser(user);
                        setStatusMutationError(null);
                        statusDialogRef.current?.showModal();
                      }}
                      className={`px-3 py-1.5 rounded font-sans text-label-sm font-semibold transition-colors ${
                        user.status === "ACTIVE"
                          ? "bg-error-container/20 text-error border border-error-container hover:bg-error-container/40"
                          : "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors"
                      }`}
                    >
                      {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-2">
          <button
            onClick={() =>
              setUsersOffset((prev) => Math.max(0, prev - USERS_LIMIT))
            }
            disabled={usersOffset === 0}
            className="px-4 py-2 border border-outline-variant rounded font-sans text-label-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setUsersOffset((prev) => prev + USERS_LIMIT)}
            disabled={users.length < USERS_LIMIT}
            className="px-4 py-2 border border-outline-variant rounded font-sans text-label-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderRolesTab = () => {
    if (rolesLoading) {
      return (
        <div className="flex gap-6 h-[400px]">
          <div className="w-[280px] bg-surface-container-lowest border border-outline-variant rounded animate-pulse"></div>
          <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded animate-pulse"></div>
        </div>
      );
    }

    if (rolesError) {
      return (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden min-h-[250px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
          <div className="w-16 h-16 rounded-full bg-error-container/30 flex items-center justify-center text-error mb-4">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <h4 className="font-sans text-headline-md text-primary mb-2">
            Failed to load roles
          </h4>
          <p className="font-serif text-sm text-on-surface-variant max-w-[280px] mb-4">
            {rolesError}
          </p>
          <button
            onClick={triggerRefresh}
            className="text-primary font-sans text-label-sm underline hover:text-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* Left Pane: Role List */}
        <div className="w-full md:w-[320px] bg-surface border border-outline-variant rounded shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low">
            <h3 className="font-sans text-label-md font-bold text-on-surface uppercase tracking-wider">
              Roles
            </h3>
          </div>
          <div className="divide-y divide-outline-variant overflow-y-auto max-h-[400px]">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left p-4 hover:bg-surface-container-low transition-colors flex justify-between items-center ${
                  selectedRole?.id === role.id
                    ? "bg-surface-container-low border-l-4 border-primary"
                    : ""
                }`}
              >
                <div>
                  <h4 className="font-sans text-label-md font-semibold text-on-surface">
                    {role.name}
                  </h4>
                  <p className="font-sans text-label-sm text-on-surface-variant line-clamp-1">
                    {maskId(role.id)}
                  </p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">
                  chevron_right
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Role Details */}
        <div className="flex-1 bg-surface border border-outline-variant rounded shadow-sm p-6">
          {selectedRole ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-sans text-headline-md font-bold text-primary mb-1">
                  {selectedRole.name}
                </h3>
                <p className="font-mono text-sm text-on-surface-variant">
                  {selectedRole.id}
                </p>
              </div>

              <div>
                <h4 className="font-sans text-label-sm font-bold text-on-surface uppercase tracking-wider mb-2">
                  Permissions Granted
                </h4>
                {selectedRole.permissions &&
                selectedRole.permissions.length > 0 ? (
                  <div className="bg-surface-container-low border border-outline-variant rounded overflow-hidden">
                    <ul
                      className="divide-y divide-outline-variant"
                      aria-label="Permissions list"
                    >
                      {selectedRole.permissions.map((perm) => (
                        <li
                          key={perm}
                          className="p-3 font-mono text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                        >
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="font-serif text-body-md text-on-surface-variant italic">
                    No permissions are explicitly assigned to this role.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8">
              <p className="font-serif text-body-md text-on-surface-variant italic">
                Select a role from the left pane to view details.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAssignTab = () => {
    return (
      <div className="bg-surface border border-outline-variant rounded shadow-sm p-6 max-w-2xl">
        <h3 className="font-sans text-headline-md font-bold text-primary mb-4">
          New Role Assignment
        </h3>

        {assignmentSuccess && (
          <div
            className="mb-6 p-4 bg-secondary-container text-on-secondary-container rounded-lg border border-outline-variant flex items-start gap-3"
            role="alert"
          >
            <span className="material-symbols-outlined text-secondary">
              check_circle
            </span>
            <div>
              <div className="font-sans font-bold">
                Role Assigned Successfully
              </div>
              <div className="font-serif text-sm">
                The user assignment has been recorded.
              </div>
            </div>
          </div>
        )}

        {assignmentError && (
          <div
            className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error flex items-start gap-3"
            role="alert"
          >
            <span className="material-symbols-outlined text-error">error</span>
            <div>
              <div className="font-sans font-bold">Failed to Assign Role</div>
              <div className="font-serif text-sm">{assignmentError}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleAssignRoleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="assign-user"
              className="block font-sans text-label-sm font-bold text-on-surface uppercase tracking-wider mb-2"
            >
              Select User *
            </label>
            <select
              id="assign-user"
              value={assignUser}
              onChange={(e) => setAssignUser(e.target.value)}
              disabled={assignmentPending}
              required
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded text-on-surface focus:outline-none focus:border-primary disabled:opacity-50 font-sans"
            >
              <option value="">-- Choose User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email || u.id} ({u.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="assign-role"
              className="block font-sans text-label-sm font-bold text-on-surface uppercase tracking-wider mb-2"
            >
              Select Role *
            </label>
            <select
              id="assign-role"
              value={assignRole}
              onChange={(e) => setAssignRole(e.target.value)}
              disabled={assignmentPending}
              required
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded text-on-surface focus:outline-none focus:border-primary disabled:opacity-50 font-sans"
            >
              <option value="">-- Choose Role --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="assign-context-type"
                className="block font-sans text-label-sm font-bold text-on-surface uppercase tracking-wider mb-2"
              >
                Context Type *
              </label>
              <input
                id="assign-context-type"
                type="text"
                value={assignContextType}
                onChange={(e) => setAssignContextType(e.target.value)}
                placeholder="e.g. GLOBAL or INSTITUTION"
                disabled={assignmentPending}
                required
                className="w-full px-3 py-2 bg-surface border border-outline-variant rounded text-on-surface focus:outline-none focus:border-primary disabled:opacity-50 font-sans"
              />
            </div>
            <div>
              <label
                htmlFor="assign-context-id"
                className="block font-sans text-label-sm font-bold text-on-surface uppercase tracking-wider mb-2"
              >
                Context ID *
              </label>
              <input
                id="assign-context-id"
                type="text"
                value={assignContextId}
                onChange={(e) => setAssignContextId(e.target.value)}
                placeholder="e.g. global or institute-uuid"
                disabled={assignmentPending}
                required
                className="w-full px-3 py-2 bg-surface border border-outline-variant rounded text-on-surface focus:outline-none focus:border-primary disabled:opacity-50 font-sans"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="assign-status"
              className="block font-sans text-label-sm font-bold text-on-surface uppercase tracking-wider mb-2"
            >
              Assignment Status *
            </label>
            <select
              id="assign-status"
              value={assignStatus}
              onChange={(e) =>
                setAssignStatus(e.target.value as "ACTIVE" | "INACTIVE")
              }
              disabled={assignmentPending}
              required
              className="w-full px-3 py-2 bg-surface border border-outline-variant rounded text-on-surface focus:outline-none focus:border-primary disabled:opacity-50 font-sans"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={assignmentPending}
            className="w-full md:w-auto px-6 py-2.5 bg-secondary hover:bg-secondary-fixed text-on-secondary font-sans text-label-md font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {assignmentPending ? "Assigning..." : "Assign Role"}
          </button>
        </form>
      </div>
    );
  };

  if (accessDenied) {
    return (
      <main className="min-h-screen grid place-items-center bg-background p-6">
        <section
          className="max-w-md rounded border border-outline-variant bg-surface p-8 text-center"
          role="alert"
        >
          <h1 className="font-sans text-headline-md font-bold text-primary">
            Access Denied
          </h1>
          <p className="mt-2 font-serif text-on-surface-variant">
            Your active context does not grant IAM administration access.
          </p>
        </section>
      </main>
    );
  }

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
                A
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
                System Governance
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
              className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container font-bold rounded-lg transition-all duration-200 group"
              href="#"
            >
              <span
                aria-hidden="true"
                className="material-symbols-outlined filled-icon"
              >
                admin_panel_settings
              </span>
              <span className="font-sans text-label-md">IAM Console</span>
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
          </nav>
          <div className="mt-auto border-t border-outline-variant pt-4 space-y-1">
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
          <div className="mb-stack-lg border-b border-outline-variant pb-6">
            <h1 className="font-sans text-headline-lg-mobile md:text-headline-lg text-primary font-bold mb-2">
              IAM Administration Console
            </h1>
            <p className="font-serif text-body-lg text-on-surface-variant max-w-3xl">
              Manage identities, access controls, and role-based context
              privileges.
            </p>
          </div>

          {/* Success Banner */}
          {globalSuccessMessage && (
            <div
              className="mb-6 p-4 bg-secondary-container text-on-secondary-container rounded-lg border border-outline-variant flex items-center gap-3"
              role="status"
              aria-live="polite"
            >
              <span className="material-symbols-outlined text-secondary">
                check_circle
              </span>
              <span className="font-sans font-medium">
                {globalSuccessMessage}
              </span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-outline-variant mb-6 gap-6 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab("users");
                setAssignmentSuccess(false);
                setAssignmentError(null);
              }}
              aria-current={activeTab === "users" ? "page" : undefined}
              className={`pb-3 font-sans text-label-md font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "users"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              Users{" "}
              <span className="font-normal text-on-surface-variant ml-1">
                Người dùng / Пользователи
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("roles");
                setAssignmentSuccess(false);
                setAssignmentError(null);
              }}
              aria-current={activeTab === "roles" ? "page" : undefined}
              className={`pb-3 font-sans text-label-md font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "roles"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              Roles &amp; Permissions{" "}
              <span className="font-normal text-on-surface-variant ml-1">
                Vai trò / Роли
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("assign");
                setAssignmentSuccess(false);
                setAssignmentError(null);
              }}
              aria-current={activeTab === "assign" ? "page" : undefined}
              className={`pb-3 font-sans text-label-md font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === "assign"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              Assign Role{" "}
              <span className="font-normal text-on-surface-variant ml-1">
                Phân công / Назначения
              </span>
            </button>
          </div>

          {/* Tab Panes */}
          <div className="py-2">
            {activeTab === "users" && renderUsersTab()}
            {activeTab === "roles" && renderRolesTab()}
            {activeTab === "assign" && renderAssignTab()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full border-t border-outline-variant mt-auto">
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

      {/* Confirmation Dialog - Native dialog element */}
      <dialog
        ref={statusDialogRef}
        className="backdrop:bg-primary/20 backdrop:backdrop-blur-sm p-0 rounded-xl shadow-lg border border-outline-variant w-full max-w-md overflow-hidden bg-surface"
        onClose={() => setStatusTargetUser(null)}
      >
        {statusTargetUser && (
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center text-error mb-4">
              <span className="material-symbols-outlined text-2xl">
                warning
              </span>
            </div>
            <h3 className="font-sans text-[20px] font-bold text-primary mb-2">
              Confirm Status Change
            </h3>
            <p className="font-serif text-body-md text-on-surface-variant mb-6">
              Are you sure you want to change the status of user &quot;
              {statusTargetUser.email || statusTargetUser.id}&quot; to{" "}
              <strong>
                {statusTargetUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"}
              </strong>
              ?
            </p>

            {statusMutationError && (
              <div
                className="mb-4 p-3 bg-error-container text-on-error-container rounded text-sm font-sans"
                role="alert"
              >
                {statusMutationError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={statusMutationPending}
                className="px-4 py-2 border border-outline-variant text-on-surface-variant font-sans text-label-sm rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50"
                onClick={() => statusDialogRef.current?.close()}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={statusMutationPending}
                onClick={handleConfirmStatusChange}
                className="px-4 py-2 bg-secondary text-on-secondary font-sans text-label-sm rounded-lg hover:bg-secondary-fixed transition-colors disabled:opacity-50"
              >
                {statusMutationPending ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
