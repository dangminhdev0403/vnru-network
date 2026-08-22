# Frontend Architecture

## 1. Purpose

This document defines the core frontend architecture for the project.

Keep this file short. Detailed conventions belong in topic-specific documents under `frontend/docs/`.

## 2. Docs Index

| Need | Read |
| --- | --- |
| Core architecture, layers, product surfaces & routes | `ARCHITECTURE.md` |
| Feature module structure, folders & standard features | `MODULE_GUIDE.md` |
| Backend API integration, contracts, auth & error handling | `CONTRACT_GUIDE.md` |
| Runtime boundaries, components, state, realtime & i18n | `RUNTIME_UI_GUIDE.md` |
| Development rules and execution constraints | `RULES.md` |
| Active/archived frontend milestones and plans | `PLANS.md` |

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

## 7. Product Surfaces & Route Architecture `[DESIGN]`

The Web experience structure maps the three canonical access areas and six business capabilities into distinct product surfaces with clear access rules:

```txt
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Public / Discovery Surface                                               │
│    /                   - Home & network highlights                          │
│    /news-events        - News, events, forums & announcements               │
│    /search             - Integrated global search across entities           │
│    /knowledge/*        - Knowledge Repository: papers, patents, documents   │
│    /experts/*          - Expert Directory: researcher CVs, partner matches  │
│    /opportunities/*    - Collaboration opportunities (Research/Academic/Tech)│
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. Authentication & Session Surface                                         │
│    /login              - Keycloak OIDC authentication & session bootstrap   │
│    /workspace/iam/security           - 2FA policy status, active sessions, security trail │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. Authenticated Persona Workspaces Surface                                  │
│    /workspace          - Context resolver & workspace dispatcher            │
│    /workspace/researcher   - Profiles, publications, joint proposals, projects│
│    /workspace/reviewer     - Assigned review queue (anonymized evaluation)  │
│    /workspace/enterprise   - Tech demands, expressions of interest, 2+2     │
│    /workspace/organization - Org profile, member verification, org activities│
│    /workspace/leadership   - Internal KPI dashboards, activity monitoring   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. Governance & Administration Surface (Foundation & System Operators only) │
│    /admin/access       - Identity, user management, and role assignments    │
│    /admin/catalogs     - Data/workflow governance & moderation queues       │
│    /admin/audit        - Immutable security & action audit review           │
│    /admin/kpi          - KPI definition and report administration           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.1. Persona User Journeys & Primary CTAs `[SOURCE]`

| Persona | Primary Entry Point | Core Flow | Primary CTA |
| --- | --- | --- | --- |
| **Visitor** | `/` (Home) / `/search` | Explore knowledge repository, view public expert profiles, research collaboration opportunities, training events, and tech catalog | *Search / Explore* |
| **Researcher / Scientist** | `/workspace/researcher` | Profile CV maintenance, VN–RU joint proposal collaboration, project milestone reporting | *Collaborate / Submit Proposal* |
| **Reviewer** | `/workspace/reviewer` or `/reviews` | Open assigned anonymized proposal, score against rubric, submit evaluation | *Score & Submit Review* |
| **Organization Representative** | `/workspace/organization` | Manage organization profile, endorse institutional proposals, propose organization-led activities | *Verify / Manage Org* |
| **Enterprise Representative** | `/workspace/enterprise` | Search IP/technologies, post demand, submit expression of interest (EOI), form 2+2 consortium | *Express Interest / Form 2+2* |
| **Leadership** | `/workspace/leadership` | Inspect internal bilateral KPIs, activity trends (projects, connections, tech transfer), export internal report | *Monitor KPIs / View Report* |
| **Governance Administrator** | `/admin/access` | Manage identities, assign roles, govern data catalogs, review audit logs, manage KPI definitions | *Administer Platform* |

### 7.2. Shared UI State Model `[DESIGN]`

All product surfaces must handle the eight standard UI states deterministically:

| State | UI Behavior & Meaning |
| --- | --- |
| **Loading** | Async fetch in progress; maintain layout stability with skeleton loaders. |
| **Empty** | Valid query executed with zero records; guide user toward relevant action/filter reset. |
| **Error** | Request failed; display user-friendly localized message with retry action. |
| **Forbidden (`403`)** | Authenticated user lacks permission for active context; display access request guidance. |
| **Unauthorized (`401`)** | Unauthenticated session or expired token; redirect to `/login` with return URL. |
| **Validation Error** | Form input invalid; display clear, localized field-level error messages. |
| **Conflict (`409`)** | State conflict (e.g. concurrent proposal edits, version mismatch); prompt user to refresh. |
| **Success** | Mutation complete; display clear feedback toast and update/invalidate cache. |

### 7.3. Multilingual Experience (VI / RU / EN) `[SOURCE]`

- All product surfaces must support seamless language switching between Vietnamese (`vi`), Russian (`ru`), and English (`en`).
- Scientific terminology translation assistance is integrated via AI hooks in specialized reading/authoring surfaces.


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
