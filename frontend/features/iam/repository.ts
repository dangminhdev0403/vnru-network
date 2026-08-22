import { httpClient } from "@/lib/httpClient";

export type IamUser = {
  id: string;
  email: string | null;
  status: "ACTIVE" | "INACTIVE";
  canManageUser?: boolean;
};
export type IamRole = { id: string; name: string; permissions: string[] };
export type IamSession = {
  id: string;
  createdAt: string;
  expiresAt: string;
  activeContext: { contextType: string; contextId: string } | null;
  current: boolean;
};
export type Profile = { firstName: string; lastName: string; email: string };

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await httpClient(path, init);
  if (!response.ok) throw new ApiError(response.status, `Request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export const iamRepository = {
  users: (signal?: AbortSignal) =>
    json<IamUser[]>("/api/admin/users?limit=100&offset=0", { signal }),
  roles: (signal?: AbortSignal) =>
    json<IamRole[]>("/api/admin/roles?limit=100&offset=0", { signal }),
  sessions: (signal?: AbortSignal) =>
    json<IamSession[]>("/api/auth/sessions", { signal }),
  profile: (signal?: AbortSignal) => json<Profile>("/api/auth/profile", { signal }),
  mfa: (signal?: AbortSignal) =>
    json<{ enabled: boolean }>("/api/auth/mfa", { signal }),
  updateUserStatus: (input: { id: string; status: IamUser["status"] }) =>
    json<unknown>(`/api/admin/users/${input.id}/status`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: input.status }),
    }),
  assignRole: (input: {
    userId: string;
    roleId: string;
    contextType?: string;
    contextId?: string;
  }) =>
    json<unknown>("/api/admin/role-assignments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...input, status: "ACTIVE" }),
    }),
  revokeSession: (id: string) =>
    json<unknown>(`/api/auth/sessions/${id}`, { method: "DELETE" }),
  revokeOtherSessions: () =>
    json<unknown>("/api/auth/sessions", { method: "DELETE" }),
  updateProfile: (input: Pick<Profile, "firstName" | "lastName">) =>
    json<Profile>("/api/auth/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    }),
  disableMfa: () => json<unknown>("/api/auth/mfa", { method: "DELETE" }),
};
