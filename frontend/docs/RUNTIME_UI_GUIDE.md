# Frontend Runtime and UI Guide

## Purpose

This guide contains detailed runtime, component, state, realtime, error, loading, and i18n conventions.

## Server and Client Components

Default to Server Components.

Use Client Components only when the code needs:

- Browser APIs.
- Event handlers.
- `useState`, `useEffect`, or client navigation hooks.
- Zustand or another client store.
- TanStack Query hooks.
- Realtime sockets.

Client components must be explicit with `"use client"`.

## Component Ownership

| Component type | Location | Rule |
| --- | --- | --- |
| Route-local components | `src/app/**/_components` or colocated route files | Use only within that route area. |
| Feature components | `src/features/[feature]/components` | May use feature hooks/services. |
| UI primitives | `src/components/ui` | Must not import feature services or app routes. |
| Shared app components | `src/components/shared` or route-group `_components` | Shared presentation/shell logic. |
| Marketing components | `src/components/marketing` | Public marketing sections and shells. |

## State Ownership

| State type | Recommended owner |
| --- | --- |
| Server state | TanStack Query or server data loading. |
| URL/shareable state | Route params and search params. |
| Local UI state | React state. |
| Cross-component client state | Zustand or another explicit client store. |
| Session state | Auth/session provider. |
| Persistent browser state | Storage abstraction. |

Rules:

- Do not store server state in Zustand.
- Do not use TanStack Query for purely local UI state.
- Prefer URL state for shareable filters, pagination, and selected views.
- Browser storage must be wrapped by feature/core utilities.

Persistent identifiers or server-state resources may be added only when current product contracts require them. Browser identifiers are never authentication authority; backend validation remains authoritative.

## Workspace navigation and RBAC rendering

- If a typed workspace registry exists, it owns aliases, dashboard definitions, labels, and navigation order.
- Navigation uses session-bound capabilities and explicit resource scope; raw permission keys are not user-facing labels.
- Mutating controls render only with the matching manage capability.
- Resource scope belongs in URL/local query state when it must be shareable.
- Frontend capability filtering improves clarity and request volume; it never replaces backend
  authorization.

## Realtime

- Isolate socket clients behind a feature or core realtime module.
- Components should subscribe through hooks, not direct socket instances.
- Realtime events should update or invalidate server-state caches when appropriate.
- Connection lifecycle, cleanup, reconnect behavior, and auth context must be centralized.

## Loading, Error, and Standard UI States `[DESIGN]`

- Use route-level `loading.tsx` and `error.tsx` when a product surface needs its own boundary.
- Implement explicit handling for the eight standard UI states:
  1. `Loading`: Stable layout with skeleton indicators.
  2. `Empty`: Informative empty-state graphics and actionable reset/create CTA.
  3. `Error`: Localized error messages with retry action.
  4. `Forbidden (403)`: Clear permission denial explanation and request-access CTA.
  5. `Unauthorized (401)`: Redirect to `/login` preserving target return URL.
  6. `Validation Error`: Form field error highlights and localized feedback strings.
  7. `Conflict (409)`: Concurrency conflict banner with diff / refresh prompts.
  8. `Success`: Feedback toasts and automated cache invalidation.
- Do not display raw backend error objects directly.
- Use toasts for user-triggered action feedback, not as the only error boundary.

## Multilingual Support & AI Translation `[SOURCE]`

- **Supported Locales**: Vietnamese (`vi`), Russian (`ru`), and English (`en`).
- App-wide copy belongs in `core/i18n` or config-level i18n dictionaries.
- Feature-specific copy belongs in `features/[feature]/i18n`.
- **AI-Assisted Terminology Translation**:
  - Specialized scientific/technical terminology translation hooks (`useTerminologyTranslation`) are available for reading and authoring interfaces.
  - Translation suggestions must remain non-blocking and clearly marked as AI-assisted until confirmed by the user.
- Avoid hardcoding user-facing copy in large interactive flows.

## Workspace Context Switching

- Authenticated users holding multiple roles (e.g. Researcher + Reviewer) switch active context via the workspace context switcher.
- Context changes update the active session authorization token and trigger workspace re-rendering without a hard browser reload.

