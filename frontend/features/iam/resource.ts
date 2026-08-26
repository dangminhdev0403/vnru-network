import {
  createResource,
  defineMutation,
  defineQuery,
} from "@dangminhdev04032005/query-resource";
import { iamRepository } from "./repository";

export const iamResource = createResource<void>()({
  namespace: ["vnru", "iam"],
  name: "administration",
  scopeKey: () => ["current-context"],
  queries: {
    users: defineQuery({
      inputKey: (input: undefined) => ["all", input],
      queryFn: ({ signal }) => iamRepository.users(signal),
    }),
    roles: defineQuery({
      inputKey: (input: undefined) => ["all", input],
      queryFn: ({ signal }) => iamRepository.roles(signal),
    }),
  },
  mutations: {
    updateUserStatus: defineMutation<void, { id: string; status: "ACTIVE" | "INACTIVE" }, unknown>({
      mutationFn: ({ variables }) => iamRepository.updateUserStatus(variables),
    }),
    resetUserPassword: defineMutation<void, { id: string; password: string }, { reset: true }>({
      mutationFn: ({ variables }) => iamRepository.resetUserPassword(variables),
    }),
    assignRole: defineMutation<void, { userId: string; roleId: string; contextType?: string; contextId?: string }, unknown>({
      mutationFn: ({ variables }) => iamRepository.assignRole(variables),

    }),
    replaceRolePermissions: defineMutation<void, { roleId: string; permissions: string[] }, import("./repository").IamRole>({
      mutationFn: ({ variables }) => iamRepository.replaceRolePermissions(variables),
    }),
  },
});

export const securityResource = createResource<void>()({
  namespace: ["vnru", "iam"],
  name: "security",
  scopeKey: () => ["current-user"],
  queries: {
    sessions: defineQuery({
      inputKey: (input: undefined) => ["all", input],
      queryFn: ({ signal }) => iamRepository.sessions(signal),
    }),
    profile: defineQuery({
      inputKey: (input: undefined) => ["self", input],
      queryFn: ({ signal }) => iamRepository.profile(signal),
    }),
    mfa: defineQuery({
      inputKey: (input: undefined) => ["status", input],
      queryFn: ({ signal }) => iamRepository.mfa(signal),
    }),
  },
  mutations: {
    revokeSession: defineMutation<void, string, unknown>({
      mutationFn: ({ variables }: { variables: string }) =>
        iamRepository.revokeSession(variables),

    }),
    revokeOtherSessions: defineMutation<void, void, unknown>({
      mutationFn: () => iamRepository.revokeOtherSessions(),

    }),
    updateProfile: defineMutation<void, { firstName: string; lastName: string }, import("./repository").Profile>({
      mutationFn: ({ variables }) => iamRepository.updateProfile(variables),

    }),
    disableMfa: defineMutation<void, void, unknown>({
      mutationFn: () => iamRepository.disableMfa(),

    }),
  },
});
