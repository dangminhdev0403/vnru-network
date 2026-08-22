"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createResource,
  defineMutation,
  defineQuery,
} from "@dangminhdev04032005/query-resource";
import { httpClient } from "@/lib/httpClient";

export type CurrentUser = {
  id?: string;
  email?: string;
  fullName?: string;
  roles?: string[];
  capabilities?: string[];
  [key: string]: unknown;
};

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await httpClient(path, init);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json() as Promise<T>;
}

const authResource = createResource<void>()({
  name: "auth",
  namespace: ["vnru", "auth"],
  scopeKey: () => ["current-user"],
  queries: {
    me: defineQuery({
      inputKey: (input: undefined) => ["me", input],
      queryFn: ({ signal }) => json<CurrentUser>("/api/auth/me", { signal }),
    }),
  },
  mutations: {
    logout: defineMutation<void, void, { logoutUrl?: string }>({
      mutationFn: () =>
        json<{ logoutUrl?: string }>("/api/auth/logout", { method: "POST" }),
    }),
  },
});

const auth = authResource.bind(undefined);

export function useCurrentUser() {
  return useQuery(auth.queries.me.options(undefined));
}

export function useLogout() {
  return useMutation(auth.mutations.logout.options());
}
