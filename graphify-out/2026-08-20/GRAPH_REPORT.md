# Graph Report - vnru-network  (2026-08-20)

## Corpus Check
- 199 files · ~166,575 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1735 nodes · 2127 edges · 145 communities (127 shown, 18 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a6e827ee`
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
- page.tsx
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
- expert-query.ts
- iam-admin.service.ts
- Module 2 — AGY Swarm Implementation Plan
- module2.repository.ts
- Module 2 Knowledge & Expert Discovery — AGY Assignment Plan
- 3.4 Full
- dependencies
- compilerOptions
- dependencies
- compilerOptions
- screens
- dashboard.py
- devDependencies
- devDependencies
- Decisions
- AppService
- PORTAL-WIDE FLOW SUMMARY — IMPLEMENTATION BASELINE
- style.md
- jest
- jest
- jest
- VN-RU_Portal_Architecture_Business_Analysis_UPDATED_FINAL_EN.md
- VN-RU Network Global Rules (Authoritative)
- NotFoundClient.tsx
- WorkspaceShell.tsx
- DESIGN.md
- exclude
- exclude
- package.json
- scripts
- scripts
- IamWorkspaceView.tsx
- nest-cli.json
- schema.test.mjs
- dev-seed.test.mjs
- nest-cli.json
- expert-matching.ts
- package.json
- package.json
- schema.test.mjs
- moduleFileExtensions
- 3. Public / Workspace / Governance
- module1-template.test.mjs
- theme-smoke.test.mjs
- home-i18n.test.mjs
- README.md
- rxjs
- UI Quality Pro-Max
- Appendix B - Canonical Sources (read these before reinventing)
- Design Audit
- Analysis & Synthesis Instructions
- Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)
- Design System: Taste Standard
- 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)
- 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)
- tasteskill: Anti-Slop Frontend Skill
- 9. AI TELLS (Forbidden Patterns)
- 11. REDESIGN PROTOCOL
- 3. DEFAULT ARCHITECTURE & CONVENTIONS
- 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS
- 0. BRIEF INFERENCE (Read the Room Before Anything Else)
- 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)
- 5. CONTEXT-AWARE PROACTIVITY
- 8. DARK MODE PROTOCOL
- 7. DIAL DEFINITIONS (Technical Reference)

## God Nodes (most connected - your core abstractions)
1. `MODULE 1 — IAM / GOVERNANCE` - 42 edges
2. `authServiceUrl()` - 29 edges
3. `MODULE 2 — KNOWLEDGE REPOSITORY AND EXPERT DIRECTORY` - 29 edges
4. `UI Quality Pro-Max` - 24 edges
5. `backendHeaders()` - 22 edges
6. `compilerOptions` - 22 edges
7. `MODULE 3 — BILATERAL RESEARCH FUNDING & PROJECT MANAGEMENT` - 22 edges
8. `MODULE 5 — TECHNOLOGY TRANSFER & ENTERPRISE CONNECTION` - 22 edges
9. `SessionService` - 21 edges
10. `MODULE 4 — TRAINING, KNOWLEDGE TRANSFER & ACADEMIC EXCHANGE` - 20 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  services/auth-service/src/main.ts → services/auth-service/src/app.module.ts
- `Home()` --calls--> `getCurrentSession()`  [EXTRACTED]
  frontend/app/page.tsx → frontend/features/auth/server.ts
- `IamAdminController` --references--> `RequirePermission()`  [EXTRACTED]
  services/auth-service/src/modules/access-control/iam-admin.controller.ts → services/auth-service/src/modules/authentication/authenticated-request-context.ts
- `CallbackResult` --references--> `IdentityUser`  [EXTRACTED]
  services/auth-service/src/modules/authentication/authentication.service.ts → services/auth-service/src/modules/identity/identity.service.ts
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  services/knowledge-service/src/main.ts → services/knowledge-service/src/app.module.ts

## Import Cycles
- None detected.

## Communities (145 total, 18 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.04
Nodes (49): eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, @nestjs/schematics, @nestjs/testing, prettier (+41 more)

### Community 1 - "app.module.ts"
Cohesion: 0.14
Nodes (15): AppModule, Module, configSchema, validateConfig(), bootstrap(), AccessControlModule, Module, AuthenticationModule (+7 more)

### Community 2 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 3 - "devDependencies"
Cohesion: 0.04
Nodes (45): @dangminhdev04032005/query-resource, eslint-config-next, dependencies, @dangminhdev04032005/query-resource, i18next, motion, next, react (+37 more)

### Community 4 - "Auth Service Specification — Module 1"
Cohesion: 0.05
Nodes (39): `access-control`, Auth Service — Module 1 Base, Authenticated request, `authentication`, Boundary Rules, Current Base, Current Non-Goals, `identity` (+31 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 6 - "dependencies"
Cohesion: 0.11
Nodes (19): openid-client, dependencies, @nestjs/common, @nestjs/core, @nestjs/platform-express, openid-client, pg, @prisma/adapter-pg (+11 more)

### Community 7 - "exclude"
Cohesion: 0.25
Nodes (7): test, exclude, extends, dist, node_modules, **/*spec.ts, ./tsconfig.json

### Community 8 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 9 - "MODULE 6 — INTERNAL MONITORING & REPORTING DASHBOARD"
Cohesion: 0.10
Nodes (20): 10. Conceptual data model, 11. Authorization, 12. UI capability, 13. API capability proposal, 14. Event/fact ingestion, 15. Audit, 16. Performance, 17. Acceptance Criteria — Module 6 (+12 more)

### Community 10 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 11 - "layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, sans, serif

### Community 12 - "page.tsx"
Cohesion: 0.09
Nodes (28): Role, User, POST(), GET(), PATCH(), GET(), GET(), POST() (+20 more)

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
Cohesion: 0.11
Nodes (19): 10. Conceptual data model, 11. Authorization, 12. UI capability, 13. API capability proposal, 14. Events and audit, 15. Concurrency / idempotency, 16. Integration, 17. Acceptance Criteria — Module 4 (+11 more)

### Community 23 - "Module 1 Antigravity Assignment Plan"
Cohesion: 0.10
Nodes (20): Approval boundary, Assignment model, Dispatch constraints, Git workflow, Module 1 Antigravity Assignment Plan, Ponytail deletions from the earlier plan, Slice 1A — Prisma + Zod foundation, Slice 1B — Internal identity (+12 more)

### Community 24 - "docs/README.md"
Cohesion: 0.16
Nodes (7): 1. Security & Authentication Boundaries, 2. Data Ownership & Microservice Boundaries, 3. Package & Dependency Governance, 4. API & Resource Design, 5. Working Tree & Scope Constraints, 6. Verification Request Dispatch, VN-RU Network Global Rules (Authoritative)

### Community 25 - "session-public.ts"
Cohesion: 0.16
Nodes (14): AccessControlPrismaClient, AccessControlService, PermissionRecord, ResolveCapabilitiesInput, RoleAssignmentRecord, RolePermissionRecord, RoleRecord, Inject (+6 more)

### Community 26 - "Frontend Architecture"
Cohesion: 0.11
Nodes (18): 10. State Management, 11. Frontend and Backend Boundary, 12. Performance Principles, 13. Dependency Direction, 14. Architecture Rules Summary, 1. Purpose, 2. Docs Index, 3. Core Principles (+10 more)

### Community 27 - "AuthenticationController"
Cohesion: 0.10
Nodes (15): Delete, Optional, Res, AuthenticationController, Body, Controller, Get, Param (+7 more)

### Community 28 - "🇻🇳🇷🇺 VN-RU Network"
Cohesion: 0.12
Nodes (16): Backend (Current & Target), 📍 Current State vs. Target Architecture, 🗄️ Data Ownership Principles, 🚀 Development Quickstart, 📖 Documentation Index, Frontend (Current), Infrastructure (Target), ✦ Overview `[SOURCE]` (+8 more)

### Community 30 - "Frontend API Contract Guide"
Cohesion: 0.13
Nodes (15): Anti-patterns, Authentication and Session, Authorization Context, Caching, Contract Rules, Error Contract, Frontend API Contract Guide, Generated Contracts (+7 more)

### Community 31 - "identity-public.ts"
Cohesion: 0.32
Nodes (7): ExternalIdentityRecord, IdentityPrismaClient, IdentityService, IdentityUser, ResolveExternalIdentityInput, Inject, Injectable

### Community 32 - "authentication.service.ts"
Cohesion: 0.17
Nodes (18): AuthenticatedRequest, AuthenticatedRequestGuard, extractSessionCookie(), isRecord(), RequestWithCookies, RequireMfa(), RequirePermission(), context() (+10 more)

### Community 33 - "authentication.module.ts"
Cohesion: 0.12
Nodes (16): mockClientInstance, mockIssuerInstance, MockIdentityService, MockOidcService, MockSessionService, CreateAuthorizationRequestParams, HandleCallbackParams, KeycloakOidcService (+8 more)

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
Cohesion: 0.07
Nodes (32): AppModule, Module, SafeHttpExceptionFilter, Catch, bootstrap(), PublicationController, Controller, Get (+24 more)

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
Cohesion: 0.29
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
Cohesion: 0.33
Nodes (5): Agent Instructions — VN-RU Network, Execution rules, Mandatory pre-code gate, Mandatory UI/UX quality routing, Navigation

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

### Community 71 - "expert-query.ts"
Cohesion: 0.10
Nodes (22): AppModule, Module, ExpertController, Controller, Get, Query, isPlainObject(), isValidISODate() (+14 more)

### Community 72 - "iam-admin.service.ts"
Cohesion: 0.08
Nodes (27): Patch, IamAdminController, paginationSchema, roleAssignmentSchema, Body, Controller, Get, Param (+19 more)

### Community 73 - "Module 2 — AGY Swarm Implementation Plan"
Cohesion: 0.06
Nodes (32): Agent ownership, AGY-01 — Knowledge backend, AGY-01 Slice K1, AGY-01 Slice K2, AGY-02 — Expert backend, AGY-02 Slice E1, AGY-02 Slice E2, AGY-03/04 read-only contract review (+24 more)

### Community 74 - "module2.repository.ts"
Cohesion: 0.15
Nodes (18): KnowledgeWorkspacePage(), one(), Params, WorkspacePage(), Props, fetchDiscoverySection(), Fetcher, getExperts() (+10 more)

### Community 75 - "Module 2 Knowledge & Expert Discovery — AGY Assignment Plan"
Cohesion: 0.08
Nodes (24): AGY-01 — Slice 1A: publication read model, AGY-01 — Slice 2A: native publication search, AGY-02 — Slice 1B: organization/expert read model, AGY-02 — Slice 2B: publication references in expert detail, AGY ownership, Approval boundary, Decision Gate 0 — stakeholder input required, Definition of done (+16 more)

### Community 76 - "3.4 Full"
Cohesion: 0.11
Nodes (17): 1. Command dispatch, 2. Common verification rules, 3.1 Quick, 3.2 Integration, 3.3 Browser UI, 3.4 Full, 3. Profile definitions, 4. Module-aware test selection (+9 more)

### Community 77 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @nestjs/common, @nestjs/core, @nestjs/platform-express, pg, @prisma/adapter-pg, @prisma/client, reflect-metadata (+9 more)

### Community 78 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, incremental, isolatedModules, module (+8 more)

### Community 79 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @nestjs/common, @nestjs/core, @nestjs/platform-express, pg, @prisma/adapter-pg, @prisma/client, reflect-metadata (+9 more)

### Community 80 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, incremental, isolatedModules, module (+8 more)

### Community 81 - "screens"
Cohesion: 0.12
Nodes (15): projectId, screens, experts, governance, home, iam-admin, knowledge, login (+7 more)

### Community 82 - "dashboard.py"
Cohesion: 0.29
Nodes (12): board(), git_events(), Handler, lane_state(), latest_log(), processes(), redact(), run() (+4 more)

### Community 83 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, jest, @nestjs/cli, prisma, ts-jest, @types/jest, @types/node, typescript (+7 more)

### Community 84 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, jest, @nestjs/cli, prisma, ts-jest, @types/jest, @types/node, typescript (+7 more)

### Community 85 - "Decisions"
Cohesion: 0.17
Nodes (11): Approval gate, Decisions, Explicitly skipped, Inspection result, Likely production file delta, Task 1: Lock the source contract with focused smoke checks, Task 2: Port the downloaded login composition into the Keycloak template, Task 3: Replace brittle generated-content CSS with direct responsive styling (+3 more)

### Community 86 - "AppService"
Cohesion: 0.29
Nodes (5): AppController, Controller, Get, AppService, Injectable

### Community 87 - "PORTAL-WIDE FLOW SUMMARY — IMPLEMENTATION BASELINE"
Cohesion: 0.18
Nodes (11): 10. Definition of Ready before coding each flow, 1. Public journey, 2. Member onboarding, 3. Authenticated request, 4. Cross-module research-collaboration journey, 5. Academic / knowledge-exchange journey, 6. Technology-transfer journey, 7. Analytics journey (+3 more)

### Community 88 - "style.md"
Cohesion: 0.20
Nodes (9): BlurText Component, Custom SVG Icons (no external icon library needed for these), Dependencies, FadingVideo Component, Fonts (Google Fonts), Key Design Principles, Liquid Glass CSS (in index.css), Section 1: Hero (+1 more)

### Community 89 - "jest"
Cohesion: 0.20
Nodes (10): jest, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform, js, json (+2 more)

### Community 90 - "jest"
Cohesion: 0.20
Nodes (10): jest, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform, js, json (+2 more)

### Community 91 - "jest"
Cohesion: 0.22
Nodes (9): **/*.(t|j)s, jest, collectCoverageFrom, coverageDirectory, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 92 - "VN-RU_Portal_Architecture_Business_Analysis_UPDATED_FINAL_EN.md"
Cohesion: 0.22
Nodes (8): 0.1. Three canonical access areas, 0.2. Actors and participation forms, 0.3. Portal-level onboarding flow, 0.4. Canonical module scope after the update, 0.5. Replacements that must be treated as canonical, 0.6. Confidence labels, 0. PORTAL-WIDE IMPLEMENTATION BASELINE AFTER REVIEW, SOURCE UPDATE — NEW BOUNDARIES TO APPLY

### Community 93 - "VN-RU Network Global Rules (Authoritative)"
Cohesion: 0.06
Nodes (30): 10. FINAL PRE-FLIGHT CHECK, 1. ACTIVE BASELINE CONFIGURATION, 2. DEFAULT ARCHITECTURE & CONVENTIONS, 3. DESIGN ENGINEERING DIRECTIVES (Bias Correction), 4. CREATIVE PROACTIVITY (Anti-Slop Implementation), 5. PERFORMANCE GUARDRAILS, 6. TECHNICAL REFERENCE (Dial Definitions), 7. AI TELLS (Forbidden Patterns) (+22 more)

### Community 94 - "NotFoundClient.tsx"
Cohesion: 0.29
Nodes (5): metadata, Locale, NotFoundClient(), Translation, translations

### Community 95 - "WorkspaceShell.tsx"
Cohesion: 0.29
Nodes (5): metadata, governanceNavigation, isActive(), primaryNavigation, WorkspaceShell()

### Community 96 - "DESIGN.md"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 97 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*.spec.ts, **/*.test.ts, ./tsconfig.json

### Community 98 - "exclude"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*.spec.ts, **/*.test.ts, ./tsconfig.json

### Community 99 - "package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 100 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, prisma:generate, prisma:migrate, start, start:prod, test

### Community 101 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, prisma:generate, prisma:migrate, start, start:prod, test

### Community 103 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 104 - "schema.test.mjs"
Cohesion: 0.33
Nodes (5): __dirname, migrationContent, migrationPath, schemaContent, schemaPath

### Community 105 - "dev-seed.test.mjs"
Cohesion: 0.33
Nodes (4): __dirname, __filename, MIGRATION_PATH, SEED_PATH

### Community 106 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 107 - "expert-matching.ts"
Cohesion: 0.47
Nodes (4): Expert, Expertise, matchExperts(), MatchResult

### Community 108 - "package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, version

### Community 109 - "package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, version

### Community 110 - "schema.test.mjs"
Cohesion: 0.40
Nodes (4): __dirname, __filename, MIGRATION_PATH, SCHEMA_PATH

### Community 111 - "moduleFileExtensions"
Cohesion: 0.50
Nodes (4): moduleFileExtensions, js, json, ts

### Community 112 - "3. Public / Workspace / Governance"
Cohesion: 0.50
Nodes (4): 3.1. Public / Discovery, 3.2. Role-based Workspace, 3.3. Governance & Administration, 3. Public / Workspace / Governance

### Community 127 - "UI Quality Pro-Max"
Cohesion: 0.08
Nodes (24): 10. Color and visual hierarchy audit, 11. Icons and imagery audit, 12. Information architecture and UX audit, 13. State-completeness audit, 14. Interaction audit, 15. Accessibility baseline, 16. Runtime and performance-stability audit, 17. Security-sensitive UI rules (+16 more)

### Community 128 - "Appendix B - Canonical Sources (read these before reinventing)"
Cohesion: 0.09
Nodes (21): APPENDICES - Real Source-Backed Reference Material, Appendix A - Install Commands per Design System, Appendix B - Canonical Sources (read these before reinventing), Appendix C - Apple Liquid Glass: Honest Web Approximation, Apple Liquid Glass (Apple platforms only), Atlassian, Bootstrap, Carbon (+13 more)

### Community 129 - "Design Audit"
Cohesion: 0.10
Nodes (19): Code Quality, Color and Surfaces, Component Patterns, Content, Design Audit, Fix Priority, How This Works, Iconography (+11 more)

### Community 130 - "Analysis & Synthesis Instructions"
Cohesion: 0.11
Nodes (18): 1. Define the Atmosphere, 2. Map the Color Palette, 3. Establish Typography Rules, 4. Define the Hero Section, 5. Describe Component Stylings, 6. Define Layout Principles, 7. Define Responsive Rules, 8. Encode Motion Philosophy (+10 more)

### Community 131 - "Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)"
Cohesion: 0.11
Nodes (17): 1. Meta Information & Core Directive, 2. THE "ABSOLUTE ZERO" DIRECTIVE (STRICT ANTI-PATTERNS), 3. THE CREATIVE VARIANCE ENGINE, 4. HAPTIC MICRO-AESTHETICS (COMPONENT MASTERY), 5. MOTION CHOREOGRAPHY (FLUID DYNAMICS), 6. PERFORMANCE GUARDRAILS, 7. EXECUTION PROTOCOL, 8. PRE-OUTPUT CHECKLIST (+9 more)

### Community 132 - "Design System: Taste Standard"
Cohesion: 0.13
Nodes (14): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Hero Section, 6. Layout Principles, 7. Responsive Rules, 8. Motion & Interaction (Code-Phase Intent) (+6 more)

### Community 133 - "4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)"
Cohesion: 0.17
Nodes (12): 4.10 Quotes & Testimonials, 4.11 Page Theme Lock (Light / Dark Mode Consistency), 4.1 Typography, 4.2 Color Calibration, 4.3 Layout Diversification, 4.4 Materiality, Shadows, Cards, 4.5 Interactive UI States, 4.6 Data & Form Patterns (+4 more)

### Community 134 - "10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)"
Cohesion: 0.20
Nodes (10): 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know), Animation Library Choice, Cards & Containers, Galleries & Media, Hero Paradigms, Layout & Grids, Micro-Interactions & Effects, Navigation & Menus (+2 more)

### Community 135 - "tasteskill: Anti-Slop Frontend Skill"
Cohesion: 0.20
Nodes (10): 13. OUT OF SCOPE, 14. FINAL PRE-FLIGHT CHECK, 1.A Dial Inference (design read → dial values), 1.B Use-Case Presets, 1.C How the Dials Drive Output, 1. THE THREE DIALS (Core Configuration), 2.A When to reach for a real design system (use official packages), 2.B When the brief is an aesthetic, not a system (+2 more)

### Community 136 - "9. AI TELLS (Forbidden Patterns)"
Cohesion: 0.25
Nodes (8): 9.A Visual & CSS, 9. AI TELLS (Forbidden Patterns), 9.B Typography, 9.C Layout & Spacing, 9.D Content & Data ("Jane Doe" Effect), 9.E External Resources & Components, 9.F Production-Test Tells (banned outright), 9.G EM-DASH BAN (the single most-violated Tell)

### Community 137 - "11. REDESIGN PROTOCOL"
Cohesion: 0.29
Nodes (7): 11.A Detect the Mode (first action), 11.B Audit Before Touching, 11.C Preservation Rules, 11.D Modernisation Levers (priority order), 11.E Decision Tree: Targeted Evolution vs Full Redesign, 11.F What Never Changes Silently, 11. REDESIGN PROTOCOL

### Community 138 - "3. DEFAULT ARCHITECTURE & CONVENTIONS"
Cohesion: 0.29
Nodes (7): 3.A Stack, 3.B State, 3.C Icons, 3.D Emoji Policy, 3. DEFAULT ARCHITECTURE & CONVENTIONS, 3.E Responsiveness & Layout Mechanics, 3.F Dependency Verification (mandatory)

### Community 139 - "6. PERFORMANCE & ACCESSIBILITY GUARDRAILS"
Cohesion: 0.29
Nodes (7): 6.A Hardware Acceleration, 6.B Reduced Motion (mandatory), 6.C Dark Mode (mandatory for any consumer-facing page), 6.D Core Web Vitals Targets, 6.E DOM Cost, 6.F Z-Index Restraint, 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS

### Community 140 - "0. BRIEF INFERENCE (Read the Room Before Anything Else)"
Cohesion: 0.40
Nodes (5): 0.A Read these signals first, 0.B Output a one-line "Design Read" before generating, 0. BRIEF INFERENCE (Read the Room Before Anything Else), 0.C If the brief is ambiguous, ask one question, do not guess, 0.D Anti-Default Discipline

### Community 141 - "12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)"
Cohesion: 0.40
Nodes (5): 12.A File Location, 12.B Required Frontmatter, 12.C Required Body Sections, 12.D Block-Library Discipline, 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)

### Community 142 - "5. CONTEXT-AWARE PROACTIVITY"
Cohesion: 0.40
Nodes (5): 5.A Sticky-Stack - Canonical Skeleton, 5.B Horizontal-Pan - Canonical Skeleton, 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative), 5. CONTEXT-AWARE PROACTIVITY, 5.D Forbidden Animation Patterns

### Community 143 - "8. DARK MODE PROTOCOL"
Cohesion: 0.40
Nodes (5): 8.A Token Strategy (pick one, stick to it), 8.B Do Not Prescribe Specific Colors Here, 8.C Default Mode, 8.D Test in Both Modes Before Finishing, 8. DARK MODE PROTOCOL

### Community 144 - "7. DIAL DEFINITIONS (Technical Reference)"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

## Knowledge Gaps
- **1033 isolated node(s):** `Locale`, `resources`, `Locale`, `Translation`, `translations` (+1028 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `MODULE 1 — IAM / GOVERNANCE` connect `MODULE 1 — IAM / GOVERNANCE` to `29. API Contract`, `23. IAM — detailed domain model`, `38. Acceptance Criteria — IAM`, `16. IAM UI`, `VN-RU_Portal_Architecture_Business_Analysis_UPDATED_FINAL_EN.md`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `MODULE 5 — TECHNOLOGY TRANSFER & ENTERPRISE CONNECTION` connect `MODULE 5 — TECHNOLOGY TRANSFER & ENTERPRISE CONNECTION` to `VN-RU_Portal_Architecture_Business_Analysis_UPDATED_FINAL_EN.md`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `MODULE 3 — BILATERAL RESEARCH FUNDING & PROJECT MANAGEMENT` connect `MODULE 3 — BILATERAL RESEARCH FUNDING & PROJECT MANAGEMENT` to `VN-RU_Portal_Architecture_Business_Analysis_UPDATED_FINAL_EN.md`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `Locale`, `resources`, `Locale` to the rest of the system?**
  _1033 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `app.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14245014245014245 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._