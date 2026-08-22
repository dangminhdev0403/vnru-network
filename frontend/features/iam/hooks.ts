"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { iamResource, securityResource } from "./resource";
import type { IamUser, Profile } from "./repository";

const iam = iamResource.bind(undefined);
const security = securityResource.bind(undefined);

export function useIamAdministration() {
  const users = useQuery(iam.queries.users.options(undefined));
  const roles = useQuery(iam.queries.roles.options(undefined));
  const updateUserStatus = useMutation(
    iam.mutations.updateUserStatus.options({
      optimistic: ({ client, cache, variables }) =>
        cache.queries.users.patch(client, undefined, (current) =>
          current?.map((user: IamUser) =>
            user.id === variables.id ? { ...user, status: variables.status } : user,
          ),
        ),
      onSettled: ({ client, cache }) => cache.queries.users.invalidateAll(client),
    }),
  );
  const assignRole = useMutation(
    iam.mutations.assignRole.options({
      onSuccess: ({ client, cache }) => cache.queries.users.invalidateAll(client),
    }),
  );

  return {
    users,
    roles,
    updateUserStatus,
    assignRole,
    refresh: () => Promise.all([users.refetch(), roles.refetch()]),
    isFetching: users.isFetching || roles.isFetching,
    hasStaleData: (users.isError && Boolean(users.data)) || (roles.isError && Boolean(roles.data)),
  };
}

export function useSessions() {
  const sessions = useQuery(security.queries.sessions.options(undefined));
  const revokeSession = useMutation(
    security.mutations.revokeSession.options({
      onSuccess: ({ client, cache }) => cache.queries.sessions.invalidateAll(client),
    }),
  );
  const revokeOtherSessions = useMutation(
    security.mutations.revokeOtherSessions.options({
      onSuccess: ({ client, cache }) => cache.queries.sessions.invalidateAll(client),
    }),
  );
  return { sessions, revokeSession, revokeOtherSessions };
}

export function useProfile() {
  const profile = useQuery(security.queries.profile.options(undefined));
  const updateProfile = useMutation(
    security.mutations.updateProfile.options({
      optimistic: ({ client, cache, variables }) =>
        cache.queries.profile.patch(client, undefined, (current) =>
          current ? { ...current, ...variables } : current,
        ),
      onSuccess: ({ client, cache, data }) => {
        cache.queries.profile.set(client, undefined, data as Profile);
      },
    }),
  );
  return { profile, updateProfile };
}

export function useMfa() {
  const mfa = useQuery(security.queries.mfa.options(undefined));
  const disableMfa = useMutation(
    security.mutations.disableMfa.options({
      optimistic: ({ client, cache }) =>
        cache.queries.mfa.patch(client, undefined, (current) =>
          current ? { ...current, enabled: false } : current,
        ),
      onSettled: ({ client, cache }) => cache.queries.mfa.invalidateAll(client),
    }),
  );
  return { mfa, disableMfa };
}
