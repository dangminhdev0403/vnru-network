# Frontend Rules

Read `../../docs/RULES.md` first. Current `frontend/package.json`, source, and tests are capability truth; target-state docs never authorize inventing missing packages or paths.

## Before code

1. Read `../AGENTS.md`, `docs/ARCHITECTURE.md`, this file, one matching guide, and relevant Next.js 16.3 docs under `node_modules/next/dist/docs/`.
2. Inspect the affected route/component, every caller of a changed shared symbol, current package manifest, and nearest tests.
3. If a named dependency/path does not exist, stop or request its separately approved setup. Do not create a substitute abstraction.

## Boundaries

- Prefer Server Components. Add `"use client"` only for browser APIs, events, or client hooks.
- Presentation components render state and emit events; they do not own transport, authorization, or business workflows.
- No raw backend `fetch`/Axios in pages, layouts, or reusable UI. Use an existing repository/service/HTTP boundary.
- Backend authorization is authoritative. Frontend capability checks only control UX.
- Forms select entities by human-readable labels, never raw-ID typing.
- Show localized inline errors where possible; never expose raw backend/stack/database errors.
- Reuse current UI primitives. Preserve responsive layout and accessibility basics.

## Server state

The installed `@tanstack/react-query` and `@dangminhdev04032005/query-resource` packages define this client server-state path:

```text
repository -> query-resource resource -> feature hook -> component
```

Repositories own transport and DTO mapping. Resources own keys/options/cache operations. Feature hooks own permissions, enabled guards, cross-resource coordination, navigation, and UI feedback. Every response-affecting scope/input belongs in deterministic serializable keys.

Do not add a local query-resource copy or second cache abstraction. Add an app-level `QueryClient` provider only with the first approved client query consumer; no provider is needed while the app has no client server-state usage.

## State

- Server data stays in server loading/query cache, not a client store.
- Shareable filters/pagination use URL state.
- Local interaction uses React state.
- Cross-route persistent client state uses an existing store/storage utility only when current source already provides one or the task explicitly adds it.

## UI Quality & Impeccable Gate

- After modifying, updating, or creating any UI component, the Agent is required to manually run `npx impeccable detect` and automatically resolve all anti-patterns (font scale, contrast, explicit button types, reduced motion) before completing the task.

## Completion

Run the smallest available lint/typecheck/test/build gate for touched behavior. Final report must include `Docs read:`, changed files, exact commands/results, and blockers. Do not update plans unless milestone state actually changed.
