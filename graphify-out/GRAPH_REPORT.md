# Graph Report - vnru-network  (2026-08-18)

## Corpus Check
- 84 files · ~41,582 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 886 nodes · 1009 edges · 71 communities (60 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `032de8e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- app.module.ts
- compilerOptions
- devDependencies
- Auth Service Specification — Module 1
- compilerOptions
- dependencies
- exclude
- scripts
- MODULE 6 — INTERNAL MONITORING & REPORTING DASHBOARD
- nest-cli.json
- layout.tsx
- frontend/eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- MODULE 1 — IAM / GOVERNANCE
- MODULE 2 — KNOWLEDGE REPOSITORY AND EXPERT DIRECTORY
- MODULE 3 — BILATERAL RESEARCH FUNDING & PROJECT MANAGEMENT
- Module 1 IAM Implementation Plan
- MODULE 5 — TECHNOLOGY TRANSFER & ENTERPRISE CONNECTION
- MODULE 4 — TRAINING, KNOWLEDGE TRANSFER & ACADEMIC EXCHANGE
- Module 1 Antigravity Assignment Plan
- docs/README.md
- session-public.ts
- Frontend Architecture
- AuthenticationController
- 🇻🇳🇷🇺 VN-RU Network
- AuthenticationService
- Frontend API Contract Guide
- identity-public.ts
- authentication.service.ts
- authentication.module.ts
- VN-RU Network System Architecture
- VN-RU Core Baseline Adoption Plan
- Frontend Runtime and UI Guide
- authentication.controller.ts
- VN-RU Network Backend Service Guide
- VN-RU Network API Specification & Event Contracts
- Frontend Feature Guide
- VN-RU Network Backend Architecture
- RBAC Architecture & Access Governance
- Backend Service Rules
- VN-RU Network Domain Map
- Frontend Rules
- 29. API Contract
- 38. Acceptance Criteria — IAM
- Agent Instructions — VN-RU Network
- VN-RU Network — Centralized Open Decisions & Unresolved Questions
- VN-RU Network — Web Portal Frontend
- 16. IAM UI
- VN-RU Network Documentation Index
- This is NOT the Next.js you know
- rules/graphify.md
- workflows/graphify.md
- copilot-instructions.md
- services/AGENTS.md
- MIGRATION_GUIDE.md
- MULTILINGUAL_BACKEND_PLAN.md
- 23. IAM — detailed domain model

## God Nodes (most connected - your core abstractions)
1. `MODULE 1 — IAM / GOVERNANCE` - 42 edges
2. `MODULE 2 — KNOWLEDGE REPOSITORY AND EXPERT DIRECTORY` - 29 edges
3. `compilerOptions` - 22 edges
4. `MODULE 3 — BILATERAL RESEARCH FUNDING & PROJECT MANAGEMENT` - 22 edges
5. `MODULE 5 — TECHNOLOGY TRANSFER & ENTERPRISE CONNECTION` - 22 edges
6. `MODULE 4 — TRAINING, KNOWLEDGE TRANSFER & ACADEMIC EXCHANGE` - 20 edges
7. `MODULE 6 — INTERNAL MONITORING & REPORTING DASHBOARD` - 20 edges
8. `compilerOptions` - 16 edges
9. `Frontend Architecture` - 15 edges
10. `Frontend API Contract Guide` - 15 edges

## Surprising Connections (you probably didn't know these)
- `CallbackResult` --references--> `IdentityUser`  [EXTRACTED]
  services/auth-service/src/modules/authentication/authentication.service.ts → services/auth-service/src/modules/identity/identity.service.ts

## Import Cycles
- None detected.

## Communities (71 total, 11 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.04
Nodes (49): eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest, @nestjs/cli, @nestjs/schematics (+41 more)

### Community 1 - "app.module.ts"
Cohesion: 0.08
Nodes (23): AppController, Controller, Get, AppModule, Module, AppService, Injectable, AccessControlModule (+15 more)

### Community 2 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (37): @dangminhdev04032005/query-resource, eslint-config-next, dependencies, @dangminhdev04032005/query-resource, next, react, react-dom, @tanstack/react-query (+29 more)

### Community 4 - "Auth Service Specification — Module 1"
Cohesion: 0.05
Nodes (39): `access-control`, Auth Service — Module 1 Base, Authenticated request, `authentication`, Boundary Rules, Current Base, Current Non-Goals, `identity` (+31 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): @nestjs/common, @nestjs/core, @nestjs/platform-express, openid-client, pg, @prisma/adapter-pg, @prisma/client, reflect-metadata (+13 more)

### Community 7 - "exclude"
Cohesion: 0.25
Nodes (7): dist, **/*spec.ts, test, ./tsconfig.json, exclude, extends, node_modules

### Community 8 - "scripts"
Cohesion: 0.06
Nodes (32): js, json, **/*.(t|j)s, author, description, jest, collectCoverageFrom, coverageDirectory (+24 more)

### Community 9 - "MODULE 6 — INTERNAL MONITORING & REPORTING DASHBOARD"
Cohesion: 0.05
Nodes (39): 0.1. Three canonical access areas, 0.2. Actors and participation forms, 0.3. Portal-level onboarding flow, 0.4. Canonical module scope after the update, 0.5. Replacements that must be treated as canonical, 0.6. Confidence labels, 0. PORTAL-WIDE IMPLEMENTATION BASELINE AFTER REVIEW, 10. Conceptual data model (+31 more)

### Community 10 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 11 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 17 - "MODULE 1 — IAM / GOVERNANCE"
Cohesion: 0.05
Nodes (38): 10. Logout, 11. 2FA, 12. Audit, 13. Performance / concurrency, 14. Do not cache authorization for too long, 15. Complete authorization flow, 17. Most important IAM UX issue: context switching, 18. IAM output (+30 more)

### Community 18 - "MODULE 2 — KNOWLEDGE REPOSITORY AND EXPERT DIRECTORY"
Cohesion: 0.06
Nodes (36): 10. Why use a dedicated search engine?, 11. Semantic search, 12. Expert matching, 13. Suggestions must be explainable, 14. Knowledge relationship model, 15. Pagination, 16. Caching, 17. Synchronization jobs must run in the background (+28 more)

### Community 19 - "MODULE 3 — BILATERAL RESEARCH FUNDING & PROJECT MANAGEMENT"
Cohesion: 0.06
Nodes (35): 10. State models must remain separate, 11. Conceptual data model, 12. Authorization, 13. UI capability, 14. API capability proposal, 15. Events and audit, 16. Concurrency and idempotency, 17. Acceptance Criteria — Module 3 (+27 more)

### Community 20 - "Module 1 IAM Implementation Plan"
Cohesion: 0.06
Nodes (33): Antigravity dispatch contract, Approval boundary, Default: sequential short-lived PRs, Docs read, Failure handling, Git workflow, In scope, Module 1 IAM Implementation Plan (+25 more)

### Community 21 - "MODULE 5 — TECHNOLOGY TRANSFER & ENTERPRISE CONNECTION"
Cohesion: 0.08
Nodes (25): 10. IP / legal / advisory boundary, 11. State model, 12. Conceptual data model, 13. Authorization, 14. UI capability, 15. API capability proposal, 16. Events and audit, 17. Concurrency / idempotency (+17 more)

### Community 22 - "MODULE 4 — TRAINING, KNOWLEDGE TRANSFER & ACADEMIC EXCHANGE"
Cohesion: 0.09
Nodes (23): 10. Conceptual data model, 11. Authorization, 12. UI capability, 13. API capability proposal, 14. Events and audit, 15. Concurrency / idempotency, 16. Integration, 17. Acceptance Criteria — Module 4 (+15 more)

### Community 23 - "Module 1 Antigravity Assignment Plan"
Cohesion: 0.10
Nodes (20): Approval boundary, Assignment model, Dispatch constraints, Git workflow, Module 1 Antigravity Assignment Plan, Ponytail deletions from the earlier plan, Slice 1A — Prisma + Zod foundation, Slice 1B — Internal identity (+12 more)

### Community 24 - "docs/README.md"
Cohesion: 0.16
Nodes (6): 1. Security & Authentication Boundaries, 2. Data Ownership & Microservice Boundaries, 3. Package & Dependency Governance, 4. API & Resource Design, 5. Working Tree & Scope Constraints, VN-RU Network Global Rules (Authoritative)

### Community 25 - "session-public.ts"
Cohesion: 0.19
Nodes (13): Optional, SessionModule, Module, CreateSessionInput, CreateSessionResult, DEFAULT_MAX_SESSION_TTL_MS, SESSION_PRISMA, SessionPrismaClient (+5 more)

### Community 26 - "Frontend Architecture"
Cohesion: 0.11
Nodes (18): 10. State Management, 11. Frontend and Backend Boundary, 12. Performance Principles, 13. Dependency Direction, 14. Architecture Rules Summary, 1. Purpose, 2. Docs Index, 3. Core Principles (+10 more)

### Community 27 - "AuthenticationController"
Cohesion: 0.18
Nodes (8): Post, Query, Req, Res, AuthenticationController, Controller, Get, AuthenticatedUser

### Community 28 - "🇻🇳🇷🇺 VN-RU Network"
Cohesion: 0.12
Nodes (16): Backend (Current & Target), 📍 Current State vs. Target Architecture, 🗄️ Data Ownership Principles, 🚀 Development Quickstart, 📖 Documentation Index, Frontend (Current), Infrastructure (Target), ✦ Overview `[SOURCE]` (+8 more)

### Community 29 - "AuthenticationService"
Cohesion: 0.17
Nodes (5): AuthenticationService, Injectable, KeycloakOidcService, Inject, Injectable

### Community 30 - "Frontend API Contract Guide"
Cohesion: 0.13
Nodes (15): Anti-patterns, Authentication and Session, Authorization Context, Caching, Contract Rules, Error Contract, Frontend API Contract Guide, Generated Contracts (+7 more)

### Community 31 - "identity-public.ts"
Cohesion: 0.26
Nodes (9): IdentityModule, Module, ExternalIdentityRecord, IDENTITY_PRISMA, IdentityPrismaClient, IdentityService, ResolveExternalIdentityInput, Inject (+1 more)

### Community 32 - "authentication.service.ts"
Cohesion: 0.23
Nodes (11): MockAuthService, MockResponse, BeginLoginInput, BeginLoginResult, CallbackResult, HandleCallbackInput, MockIdentityService, MockOidcService (+3 more)

### Community 33 - "authentication.module.ts"
Cohesion: 0.21
Nodes (9): CreateAuthorizationRequestParams, HandleCallbackParams, NormalizedOidcUser, OIDC_CLIENT_BOUNDARY, OidcAuthorizationUrlParams, OidcCallbackResult, OidcClaims, OidcClientBoundary (+1 more)

### Community 34 - "VN-RU Network System Architecture"
Cohesion: 0.17
Nodes (12): 1. Overview & Legal Baseline `[SOURCE]`, 2.1. Layer 1: User Interface & Multilingual Experience (`exp`) `[SOURCE]`, 2.2. Layer 2: Business & Platform Services (`biz`) `[SOURCE]`, 2.3. Layer 3: Infrastructure & Digital Sovereignty Security (`infra`) `[SOURCE]`, 2.4. Cross-Cutting: Analytics & KPI Foundation (`analytics`) `[DESIGN]`, 2. Three-Layer Portal Architecture, 3. Six Business Capabilities & Domain Microservices, 4.1. Communication Patterns (+4 more)

### Community 35 - "VN-RU Core Baseline Adoption Plan"
Cohesion: 0.18
Nodes (10): Antigravity bounded dispatch, Approval required, Copy/adapt matrix, Deferred slice: first real frontend API module, Explicitly do not copy, Risks / trade-offs, Rollback, Task 1: Create the eight-file governance baseline (+2 more)

### Community 36 - "Frontend Runtime and UI Guide"
Cohesion: 0.20
Nodes (10): Component Ownership, Frontend Runtime and UI Guide, Loading, Error, and Standard UI States `[DESIGN]`, Multilingual Support & AI Translation `[SOURCE]`, Purpose, Realtime, Server and Client Components, State Ownership (+2 more)

### Community 37 - "authentication.controller.ts"
Cohesion: 0.27
Nodes (7): configSchema, validateConfig(), extractSessionCookie(), isRecord(), RequestWithCookies, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS

### Community 38 - "VN-RU Network Backend Service Guide"
Cohesion: 0.20
Nodes (9): `auth-service` Internal Module Base, Cross-service dependency rule, Public vs internal files, Purpose, Recommended service/module shapes, Refactor workflow, Service boundaries (Target Architecture), Service ownership (+1 more)

### Community 39 - "VN-RU Network API Specification & Event Contracts"
Cohesion: 0.22
Nodes (8): 1. Contract Source of Truth, 2.1. Resource Modeling & URI Structure, 2.2. Bounded Collection Responses, 2. API Design Conventions, 3.1. Canonical Domain Events, 3.2. Audit Logging Events, 3. Asynchronous Event Contracts & Envelope Standard, VN-RU Network API Specification & Event Contracts

### Community 40 - "Frontend Feature Guide"
Cohesion: 0.22
Nodes (9): Adding a Feature, Anti-patterns, Dependency Rules, Extending a Workspace Dashboard, Folder Responsibilities, Frontend Feature Guide, Purpose, Standard Feature Shape (+1 more)

### Community 41 - "VN-RU Network Backend Architecture"
Cohesion: 0.22
Nodes (8): 1. Purpose, 2. Docs Index, 3. Core Principles, 4. Target Backend Services & Capability Ownership, 5. Standard Service Boundary, 6. Request and Contract Flow, 7. Backend and Frontend Boundary, VN-RU Network Backend Architecture

### Community 42 - "RBAC Architecture & Access Governance"
Cohesion: 0.25
Nodes (8): 1. Overview & Core Principles, 2. Portal Personas & Access Areas `[SOURCE]`, 3. Business Capability Permission Taxonomy, 4. Active Authorization Context & Context Switching, 5. Resource Scope & Independent Review Isolation, 6. Backend Enforcement & Explicit Decorators, 7. Frontend Permission Projection Rules, RBAC Architecture & Access Governance

### Community 43 - "Backend Service Rules"
Cohesion: 0.25
Nodes (7): Backend Service Rules, Before code, Boundaries, Contracts and events, Data, Testing and completion, Trust boundaries

### Community 44 - "VN-RU Network Domain Map"
Cohesion: 0.33
Nodes (6): 1. Purpose, 2. Six Business Capabilities & Domain Mapping, 3. Data Ownership & Source-of-Truth Rules, 4. Inter-Domain Dependency & Communication Rules, 5. Service Extraction Readiness, VN-RU Network Domain Map

### Community 45 - "Frontend Rules"
Cohesion: 0.33
Nodes (6): Before code, Boundaries, Completion, Frontend Rules, Server state, State

### Community 46 - "29. API Contract"
Cohesion: 0.33
Nodes (6): 29. API Contract, Access administration, Account, Authentication, Security, Workspace

### Community 47 - "38. Acceptance Criteria — IAM"
Cohesion: 0.33
Nodes (6): 38. Acceptance Criteria — IAM, Authentication, Authorization, Integration, Security, Workspace

### Community 48 - "Agent Instructions — VN-RU Network"
Cohesion: 0.40
Nodes (4): Agent Instructions — VN-RU Network, Execution rules, Mandatory pre-code gate, Navigation

### Community 49 - "VN-RU Network — Centralized Open Decisions & Unresolved Questions"
Cohesion: 0.40
Nodes (5): Approved package changes for the first implementation slices, Guidelines for Resolving Open Decisions, Module 1 Approved Technical Baseline — 2026-08-18, Open Decisions Register, VN-RU Network — Centralized Open Decisions & Unresolved Questions

### Community 50 - "VN-RU Network — Web Portal Frontend"
Cohesion: 0.40
Nodes (5): Documentation Index, Getting Started, Product Surfaces `[SOURCE]`, Technology Stack, VN-RU Network — Web Portal Frontend

### Community 51 - "16. IAM UI"
Cohesion: 0.40
Nodes (5): 16. IAM UI, Governance & Administration, IAM entry points, Public / Discovery, Role-based Workspace

### Community 52 - "VN-RU Network Documentation Index"
Cohesion: 0.50
Nodes (4): Portal Architectural Overview `[SOURCE]`, Recommended Read Order, State Distinction, VN-RU Network Documentation Index

## Knowledge Gaps
- **570 isolated node(s):** `geistSans`, `geistMono`, `metadata`, `eslintConfig`, `nextConfig` (+565 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MODULE 1 — IAM / GOVERNANCE` connect `MODULE 1 — IAM / GOVERNANCE` to `MODULE 6 — INTERNAL MONITORING & REPORTING DASHBOARD`, `29. API Contract`, `38. Acceptance Criteria — IAM`, `16. IAM UI`, `23. IAM — detailed domain model`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `MODULE 2 — KNOWLEDGE REPOSITORY AND EXPERT DIRECTORY` connect `MODULE 2 — KNOWLEDGE REPOSITORY AND EXPERT DIRECTORY` to `MODULE 6 — INTERNAL MONITORING & REPORTING DASHBOARD`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `MODULE 3 — BILATERAL RESEARCH FUNDING & PROJECT MANAGEMENT` connect `MODULE 3 — BILATERAL RESEARCH FUNDING & PROJECT MANAGEMENT` to `MODULE 6 — INTERNAL MONITORING & REPORTING DASHBOARD`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `geistSans`, `geistMono`, `metadata` to the rest of the system?**
  _570 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `app.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._