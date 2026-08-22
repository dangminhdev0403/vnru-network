# Query Resource Guide

Authoritative upstream: <https://www.npmjs.com/package/@dangminhdev04032005/query-resource>
Installed API reference: `node_modules/@dangminhdev04032005/query-resource/README.md`
Current installed version: `0.1.1`

## Rule

For browser server-state, use `@dangminhdev04032005/query-resource` over raw `fetch`, direct `httpClient` calls in components, handwritten query keys, or ordinary ad-hoc TanStack Query options.

Keep these outside it:

- Server Components and repositories that fetch SEO-rendered content.
- Next.js Route Handlers/BFF transport.
- Server-only authentication helpers.
- Purely local UI state.

## Minimal pattern

```ts
const resource = createResource<Scope>()({
  name: "publications",
  namespace: ["vnru", "knowledge"],
  scopeKey: (scope) => [scope.workspaceId],
  queries: {
    list: defineQuery({
      inputKey: (filters: Filters) => [filters],
      queryFn: ({ input, signal }) => repository.list(input, signal),
    }),
  },
  mutations: {
    update: defineMutation<Scope, UpdateInput, Publication>({
      mutationFn: ({ variables }) => repository.update(variables),
    }),
  },
});

const bound = resource.bind(scope);
const list = useQuery(bound.queries.list.options(filters));
const update = useMutation(
  bound.mutations.update.options({
    optimistic: ({ client, cache, variables }) =>
      cache.queries.list.patch(client, filters, (current) =>
        current?.map((item) =>
          item.id === variables.id ? { ...item, ...variables } : item,
        ),
      ),
    onSettled: ({ client, cache }) =>
      cache.queries.list.invalidateAll(client),
  }),
);
```

## Required practices

1. Colocate transport in a domain repository; pass `AbortSignal` to GET requests.
2. Let the resource generate keys from `namespace`, `scopeKey`, operation, and `inputKey`.
3. Use generated cache helpers: `patch`, `set`, `invalidate`, or `invalidateAll`.
4. Use optimistic updates only when rollback is safe and the expected result is deterministic.
5. Invalidate only affected domain queries after writes.
6. Render initial loading, error, empty, background-refetch, and stale-data states.
7. Never mirror query data into Zustand, Context, or component state.
8. Do not retry security mutations blindly after `401`.

## Before coding

Read the installed README and existing examples in `features/iam/resource.ts`, `features/iam/hooks.ts`, and `features/auth/server-state.ts`. If the installed API or upstream guidance is unclear, stop and request the authoritative guide instead of implementing raw query/cache logic.
