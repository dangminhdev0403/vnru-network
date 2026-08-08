# Frontend Architecture

## 1. Purpose

This document defines the core frontend architecture for the project.

Keep this file short. Detailed conventions belong in topic-specific documents under `frontend/docs/`.

## 2. Docs Index

| Need                                                          | Read                      |
| ------------------------------------------------------------- | ------------------------- |
| Core architecture and layer boundaries                        | `ARCHITECTURE.md`         |
| Feature/module structure and extension workflow               | `MODULE_GUIDE.md`         |
| Backend API, generated contracts, auth/session integration    | `CONTRACT_GUIDE.md`       |
| Runtime boundaries, components, state, realtime, errors, i18n | `RUNTIME_UI_GUIDE.md`     |
| Development rules and execution contracts                     | `RULES.md`                |
| Active/archived implementation plans                          | `PLANS.md`                |
| UI visual system and component style                          | `DESIGN.md`               |
| Smoke tests and manual route checks                           | `FRONTEND_SMOKE_TESTS.md` |

Rule: do not read all docs by default. Start with this file, then open only the document relevant to the current task.

## 3. Core Principles

* Frontend owns route composition, UI behavior, client interaction, display states, and API consumption.
* Backend owns business rules, authorization, persistence, domain workflows, API contracts, and external integrations.
* Pages compose product surfaces; features own domain-specific UI logic.
* API calls must go through feature services, repositories, resources, core HTTP utilities, or route handlers.
* Runtime boundaries must remain explicit between Server Components, Client Components, Route Handlers, browser storage, and realtime.
* Reusable UI components must not depend on domain services.
* Do not duplicate backend business rules in the frontend.
* Do not introduce client state when server state can be handled by the query/data layer.
* Keep architecture generic; domain-specific behavior belongs to feature modules.

## 4. Standard App Structure

```txt
frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── core/
│   ├── features/
│   ├── generated/
│   ├── libs/
│   ├── providers/
│   ├── configs/
│   ├── types/
│   └── proxy.ts
├── packages/
├── docs/
├── scripts/
└── package.json
```

Only create folders that the application actually needs.

## 5. Layer Responsibilities

| Layer         | Responsibility                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| `app/`        | Next.js App Router routes, layouts, route handlers, loading/error boundaries, and product surfaces.     |
| `features/`   | Domain-specific UI, services, queries, hooks, state, types, utilities, schemas, and feature components. |
| `core/`       | Cross-cutting infrastructure such as HTTP, errors, query setup, storage, i18n, and realtime primitives. |
| `components/` | Reusable UI primitives and shared presentation components.                                              |
| `generated/`  | Generated backend API contract types or generated client artifacts.                                     |
| `providers/`  | Application-level React providers.                                                                      |
| `configs/`    | Application and environment configuration.                                                              |
| `libs/`       | Small application utilities that do not belong to a feature or core infrastructure.                     |
| `packages/`   | Transport- and product-neutral packages that can be reused outside the application.                     |
| `docs/`       | Architecture, rules, guides, plans, design, and testing documentation.                                  |

## 6. Runtime Boundaries

Default to Server Components.

Use Client Components only when browser/client behavior is required, such as:

* browser APIs;
* event handlers;
* local interactive state;
* Zustand;
* TanStack Query hooks;
* realtime subscriptions;
* effects;
* client navigation hooks.

Use Route Handlers for:

* BFF/proxy endpoints;
* session-sensitive backend calls;
* cookie/session bridge behavior;
* authentication-related server-side communication;
* refresh-token handling where required.

Do not move server responsibilities into Client Components without a concrete requirement.

Detailed runtime rules belong in `RUNTIME_UI_GUIDE.md`.

## 7. Product Surface and Route Ownership

Before adding routes, define the product surface they belong to.

A product surface is a user-facing area with its own:

* route ownership;
* access rules;
* layout/shell;
* loading behavior;
* error behavior;
* feature composition.

Typical surfaces may include:

```txt
Public
Authentication
Management
Operations
User-facing application
Internal/BFF
```

Do not create route groups only for organizational convenience.

Rules:

* Route groups should represent product surfaces.
* Authenticated surfaces should define access, layout, loading, and error behavior.
* Route pages should compose feature components.
* Pages should not contain large amounts of domain business logic.
* Route ownership must remain clear as the application grows.

## 8. Feature Module

Domain-specific frontend logic belongs under:

```txt
features/[feature-name]/
├── repositories/
├── resources/
├── queries/
├── hooks/
├── service/
├── store/
├── types/
├── utils/
├── components/
├── i18n/
└── schemas/
```

Create only the folders required by the feature.

A feature owns its domain-specific UI and client-side coordination. It must not expose internal implementation details unnecessarily to unrelated features.

Detailed module rules belong in `MODULE_GUIDE.md`.

## 9. Data and API Flow

Standard flow:

```txt
Route / UI
  ↓
Feature Hook / Query
  ↓
Resource
  ↓
Repository / Service
  ↓
Core HTTP Utility or Route Handler
  ↓
Backend API
```

Rules:

* Do not place raw backend `fetch` calls in pages or reusable UI components.
* Repositories own transport calls and response mapping.
* Resources own stable query keys, query configuration, mutations, and cache invalidation.
* Feature hooks coordinate permissions, filters, feature state, and UI feedback.
* Components consume feature APIs and remain unaware of backend endpoints and query invalidation rules.
* Backend-backed types should come from generated contracts or stable feature contract wrappers.
* Route Handlers own session-sensitive proxy communication.
* Frontend must not become the source of truth for backend business rules.

## 10. State Management

Separate state by ownership:

```txt
Server state
  → TanStack Query / server data layer

Local UI state
  → React state

Global client state
  → Zustand only when state genuinely crosses feature/component boundaries

URL state
  → route/search parameters

Session/auth state
  → server/session boundary
```

Do not place server data into global client stores merely to avoid fetching.

Avoid duplicated state representations because they increase synchronization and rendering complexity.

## 11. Frontend and Backend Boundary

Frontend owns:

* UI rendering;
* route composition;
* API consumption;
* user interaction state;
* browser-specific behavior;
* loading, empty, and display states.

Backend owns:

* business rules;
* authentication enforcement;
* authorization enforcement;
* API contracts;
* persistence;
* migrations;
* domain workflows;
* external provider integrations.

Frontend permission checks are UX controls only.

Backend authorization remains the security source of truth.

## 12. Performance Principles

Frontend performance should be evaluated around:

* unnecessary client rendering;
* duplicate API requests;
* excessive hydration;
* oversized client bundles;
* unnecessary global state;
* inefficient query/cache behavior;
* unnecessary realtime subscriptions;
* repeated serialization or transformation.

Prefer:

```txt
Server Component
  → fetch/compose server data
  → Client Component only where interaction requires it
```

Avoid turning large route trees into Client Components without a concrete reason.

Query caching should solve repeated server-state reads before introducing additional global stores or custom caches.

## 13. Dependency Direction

Preferred direction:

```txt
app
 ↓
features
 ↓
core
```

Shared presentation:

```txt
components
```

Generated contracts:

```txt
generated
```

Rules:

* `components/` must not depend on feature internals.
* Features should not depend on route pages.
* Core infrastructure must not depend on a specific business feature.
* Generated contracts must not contain business logic.
* Avoid circular dependencies between features.
* Cross-feature dependencies should use explicit public interfaces when needed.

## 14. Architecture Rules Summary

* Keep pages thin.
* Keep domain UI logic inside features.
* Keep API calls outside reusable UI components.
* Keep reusable components independent from business services.
* Keep server state in the server-state layer.
* Keep global client state minimal.
* Keep backend business rules in the backend.
* Keep generated contracts as the source of truth for backend-backed types.
* Prefer Server Components by default.
* Introduce Client Components only where required.
* Keep runtime boundaries explicit.
* Create folders only when the implementation needs them.
* Keep detailed rules in the appropriate topic-specific document.
