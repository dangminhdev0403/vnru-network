# Frontend API Contract Guide

## Purpose

Define how frontend code consumes backend APIs, generated contracts, route handlers, and authentication/session-sensitive flows.

This document focuses on frontend integration. Backend API design and authorization rules remain owned by the backend.

## Standard API Flow

```txt
Route / UI
  ↓
Feature Hook / Query
  ↓
Feature Service
  ↓
Core HTTP Utility or Route Handler
  ↓
Backend API
```

## Contract Rules

* Generated API artifacts should live under `src/generated/`.
* Backend-backed feature types should use generated contracts or narrow wrappers around them.
* Do not invent response shapes that are not backed by a backend contract.
* Do not manually duplicate backend DTO definitions when generated contracts are available.
* Contract changes must be synchronized through the agreed API contract workflow before frontend assumptions change.
* Breaking contract changes require explicit coordination between frontend and backend.

## HTTP Rules

* Do not introduce raw backend `fetch` calls in pages, layouts, or reusable UI components.
* Use feature services for domain-specific API calls.
* Use core HTTP utilities for shared transport concerns.
* Use Route Handlers for BFF/proxy behavior or session-sensitive calls.
* Feature services must not contain UI display decisions.
* Transport concerns must remain separate from feature presentation logic.

## Generated Contracts

Generated contracts are the preferred source for backend-backed types.

```txt
Backend OpenAPI
  ↓
Generated contract
  ↓
Feature service
  ↓
Feature hook/query
  ↓
UI
```

When the backend contract changes:

1. Update/export the backend contract.
2. Regenerate or synchronize frontend contract artifacts.
3. Update affected feature wrappers.
4. Run the relevant frontend validation.

Do not silently modify generated files to represent an API that the backend does not expose.

## Authentication and Session

* Backend remains the authentication and authorization source of truth.
* Frontend session state is a UX/session bridge, not a security authority.
* Refresh tokens and sensitive credentials must remain in server-safe boundaries.
* Client Components must never access backend refresh tokens directly.
* Do not expose authentication secrets through browser-exposed environment variables.
* Do not rotate refresh tokens from arbitrary Server Components.
* Session-sensitive backend calls should use a server-safe boundary such as a Route Handler or server-side service.
* Route protection must remain consistent with backend authorization.
* Frontend permission checks may control visibility and UX, but must never replace backend authorization.

## Authorization Context

Frontend should consume the authorization context provided by the backend.

Use the backend-provided:

```txt
role
permissions
resource/tenant scope
```

according to the active session/workspace context.

Rules:

* Do not infer permissions from role names.
* Do not infer permissions from route names.
* Do not merge unrelated roles or authorization contexts.
* Do not assume resource access from a permission alone.
* Treat missing authorization information as unavailable access.

The frontend may hide unavailable actions, but the backend must enforce the operation.

## Route Handlers and BFF

Use Route Handlers when a backend call requires a server-side boundary.

Valid reasons include:

* session/cookie handling;
* refresh-token handling;
* secure backend communication;
* request transformation required by the BFF;
* hiding server-only configuration from the browser.

Do not create Route Handlers merely to proxy every backend endpoint.

If no server-side boundary is required, the feature service may communicate through the core HTTP layer according to the application's runtime model.

## Error Contract

Backend errors must be mapped before reaching user-facing UI.

Rules:

* Preserve stable backend error codes where deterministic UI behavior requires them.
* Convert technical errors into user-facing messages.
* Localize user-facing error messages where required.
* Never expose raw database, provider, stack-trace, or infrastructure errors.
* Keep error mapping close to the transport/feature boundary rather than inside reusable UI components.

Standard flow:

```txt
Backend Error
  ↓
HTTP / Route Handler
  ↓
Feature Error Mapping
  ↓
Feature Hook / Query
  ↓
UI Error State
```

## Loading and Empty States

API integration must distinguish:

```txt
Loading
Empty
Success
Error
Unauthorized
Forbidden
```

Do not treat an empty result as an error.

Do not use loading state as a substitute for authorization state.

## Pagination

Pagination parameters and response structures must follow the backend contract.

Frontend must not:

* invent pagination semantics;
* assume an unbounded list;
* calculate total counts from incomplete pages;
* duplicate backend filtering rules.

Feature query state should preserve pagination/filter state consistently with the route or product surface.

## Caching

Use the application's server-state/query layer for API response caching.

Do not introduce custom global caches for ordinary API data.

When caching API data:

* use stable query keys;
* invalidate after relevant mutations;
* avoid duplicated cache representations;
* respect backend data freshness requirements.

Caching must not bypass authorization or resource-scope checks.

## Realtime

Realtime data must remain consistent with the backend API contract.

Rules:

* Authenticate realtime connections through the approved session mechanism.
* Do not expose long-lived secrets to the browser.
* Realtime events should update or invalidate feature-owned server state.
* Do not treat realtime delivery as the only source of correctness.
* Re-fetch or reconcile with the backend when required after reconnect or missed events.

## Anti-patterns

Do not:

* scatter raw `fetch` calls through components;
* manually duplicate generated API types;
* invent backend response shapes;
* duplicate backend business rules;
* use frontend authorization as security;
* expose refresh tokens or private credentials;
* create unnecessary Route Handlers;
* create global stores for server data;
* introduce custom caches without a concrete requirement;
* couple reusable UI components directly to backend endpoints.
