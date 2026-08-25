# Graph Report - vnru-network  (2026-08-25)

## Corpus Check
- 326 files · ~1,317,832 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2553 nodes · 3572 edges · 211 communities (178 shown, 33 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.61)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c43703c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- demo-v2/CollaborationManagerInteractiveWorkspace.tsx
- compilerOptions
- devDependencies
- Auth Service Specification — Module 1
- compilerOptions
- dependencies
- exclude
- scripts
- components/DecisionInteractiveWorkspace.tsx
- nest-cli.json
- app/layout.tsx
- authServiceUrl
- frontend/eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- PRE_TEST_FOCUSED_FIX_GUIDE.md
- DemoWorkflowProvider.tsx
- VN–RU Public Discovery UI Guide
- impeccable.md
- commitDemoMutation
- demo-backend.ts
- 7. DIAL DEFINITIONS (Technical Reference)
- docs/README.md
- SessionService
- index.ts
- authentication.controller.ts
- Mock Data Agent Guide — Interactive Role Workflows
- requireWorkspaceCapability
- Frontend API Contract Guide
- authentication.service.ts
- components/CollaborationManagerInteractiveWorkspace.tsx
- GuestExpertsV2.tsx
- interactive-workflow-v2.test.mjs
- server.ts
- Frontend Runtime and UI Guide
- VN–RU Full Modules Prototype V3 — ROLE / FLOW UI GUIDE
- components/ResearcherInteractiveWorkspace.tsx
- app.module.ts
- CollaborationManagerTaskWorkspace.tsx
- authentication.module.ts
- app/page.tsx
- Backend Service Rules
- Russia-Vietnam Science-Technology Intelligence Network Global Rules (Authoritative)
- Frontend Rules
- ResearcherTaskWorkspace.tsx
- ReviewerTaskWorkspace.tsx
- Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network
- DecisionTaskWorkspace.tsx
- AuthenticationService
- WorkspaceShell.tsx
- table.tsx
- This is NOT the Next.js you know
- rules/graphify.md
- workflows/graphify.md
- copilot-instructions.md
- services/AGENTS.md
- MIGRATION_GUIDE.md
- MULTILINGUAL_BACKEND_PLAN.md
- DEPLOYMENT.md
- prototype-v3/mock-data.ts
- iam.ts
- GuestKnowledgeV2.tsx
- iam-admin.service.ts
- reviews.ts
- workspace-server.ts
- cn
- 3.4 Full
- OrganizationTaskWorkspace.tsx
- vnru-full-modules-prototype-v3/assets/app.js
- reports.ts
- opportunities.ts
- Workflow Commands
- Workflow Commands
- System Architecture
- RolePermissionsPage.tsx
- Discord Bot Setup Guide
- admin-nav-registry.ts
- AuthenticatedRequestGuard
- style.md
- auth.ts
- VN–RU Network Portal
- jest
- PORTAL_FOUNDATION_REFACTOR.md
- High-Agency Frontend Skill
- NotFoundClient.tsx
- GovernanceWorkspace.tsx
- frontend/DESIGN.md
- auth-service/package.json
- proposals.ts
- Hooks
- MODULE_GUIDE.md
- PROMPT_PRE_TEST_FOCUSED_FIX.md
- i18next
- Discord Bot Setup Guide
- react-aria-components
- promax-actor-preflight.js
- react-dom
- Hooks
- frontend/README.md
- import-fixture.ts
- theme-smoke.test.mjs
- Archon Setup Wizard
- home-i18n.test.mjs
- iam-admin.service.ts
- Anti-Patterns
- Archon Setup Wizard
- Anti-Patterns
- vnru-full-modules-prototype-v3/README.md
- SCREEN_OWNERSHIP_MATRIX.md
- UI Quality Pro-Max — VN-RU Portal
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
- Archon CLI Skill
- 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)
- 5. CONTEXT-AWARE PROACTIVITY
- 8. DARK MODE PROTOCOL
- Archon CLI Skill
- KeycloakProfileService
- useLocale
- Common Failure Modes
- Common Failure Modes
- dev-actor-session-bridge.js
- Archon Configuration Guide
- Archon Configuration Guide
- dependencies
- mfa/route.ts
- decisions.ts
- 1. THE THREE DIALS (Core Configuration)
- route.ts
- SidebarIcons.tsx
- cn.ts
- Authoring Command Files
- Control
- Control
- Workflow Authoring
- Workflow Authoring
- Interactive Workflow Guide
- Interactive Workflow Guide
- Scales
- GitHub Webhook Setup Guide
- Manage Archon Runs
- GitHub Webhook Setup Guide
- Manage Archon Runs
- Core Components
- Initializing Archon in a Repository
- Initializing Archon in a Repository
- frontend/package.json
- Semantics
- route.ts
- Command Name
- Parameter Matrix (Quick Reference)
- Variable Substitution Reference
- Parameter Matrix (Quick Reference)
- Variable Substitution Reference
- Product
- Ponytail
- deploy-script.test.sh
- Loop Nodes
- CLI Setup Guide
- Node Types (Mutually Exclusive)
- Approval Nodes
- Workflow-Level Fields
- Query Resource Guide
- Task: Rebranding & Identity Customization
- Task: Add a New Workspace / Portal Page
- Cancel Nodes
- Conditions (`when:`)
- React Aria Components & TailGrids Primitives in VN-RU Portal
- Loop Group Nodes
- Synthetic IAM Workflow Fixtures
- class-variance-authority
- next-auth
- workspace-registry.ts
- { GET, POST }
- next
- tailwind-merge
- zustand

## God Nodes (most connected - your core abstractions)
1. `useLocale` - 54 edges
2. `cn()` - 47 edges
3. `commitDemoMutation()` - 33 edges
4. `authServiceUrl()` - 28 edges
5. `backendHeaders()` - 27 edges
6. `UI Quality Pro-Max — VN-RU Portal` - 27 edges
7. `Locale` - 25 edges
8. `react` - 25 edges
9. `compilerOptions` - 22 edges
10. `SessionService` - 19 edges

## Surprising Connections (you probably didn't know these)
- `SecurityClientPage()` --indirect_call--> `session()`  [INFERRED]
  frontend/features/auth/components/security/SecurityClientPage.tsx → secrets/dev-actor-session-bridge.js
- `AdminAuditPage()` --calls--> `useLocale`  [EXTRACTED]
  frontend/app/(admin)/admin/audit/page.tsx → frontend/core/i18n/locale.ts
- `OrganizationWorkspace()` --calls--> `commitDemoMutation()`  [EXTRACTED]
  frontend/features/prototype-v3/components/OrganizationWorkspace.tsx → frontend/features/prototype-v3/demo-backend.ts
- `ResearcherWorkspace()` --calls--> `commitDemoMutation()`  [EXTRACTED]
  frontend/features/prototype-v3/components/ResearcherWorkspace.tsx → frontend/features/prototype-v3/demo-backend.ts
- `ReviewerWorkspace()` --calls--> `commitDemoMutation()`  [EXTRACTED]
  frontend/features/prototype-v3/components/ReviewerWorkspace.tsx → frontend/features/prototype-v3/demo-backend.ts

## Import Cycles
- None detected.

## Communities (211 total, 33 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.04
Nodes (49): eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest, @nestjs/cli, @nestjs/schematics (+41 more)

### Community 1 - "demo-v2/CollaborationManagerInteractiveWorkspace.tsx"
Cohesion: 0.09
Nodes (46): copy, ModuleKey, modules, Content(), reportTone(), reviewers, screeningLabel, screeningTone() (+38 more)

### Community 2 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 3 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+9 more)

### Community 4 - "Auth Service Specification — Module 1"
Cohesion: 0.05
Nodes (39): `access-control`, Auth Service — Module 1 Base, Authenticated request, `authentication`, Boundary Rules, Current Base, Current Non-Goals, `identity` (+31 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 6 - "dependencies"
Cohesion: 0.12
Nodes (17): @nestjs/common, @nestjs/core, @nestjs/platform-express, pg, @prisma/adapter-pg, reflect-metadata, rxjs, dependencies (+9 more)

### Community 7 - "exclude"
Cohesion: 0.25
Nodes (7): dist, **/*spec.ts, test, ./tsconfig.json, exclude, extends, node_modules

### Community 8 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 9 - "components/DecisionInteractiveWorkspace.tsx"
Cohesion: 0.08
Nodes (34): DecisionItem, DecisionProject, DecisionState, DecisionView, initialItems, projects, views, Endorsement (+26 more)

### Community 10 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 11 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): beVietnamPro, metadata, sans, serif, QueryProvider()

### Community 12 - "authServiceUrl"
Cohesion: 0.18
Nodes (18): POST(), GET(), PATCH(), PATCH(), GET(), POST(), GET(), POST() (+10 more)

### Community 17 - "PRE_TEST_FOCUSED_FIX_GUIDE.md"
Cohesion: 0.05
Nodes (37): 10. P1 — Sidebar semantics still treat roles like modules, 11. P1 — Documentation must describe runtime truth correctly, 12. Exact files to inspect first, 13. Focused implementation slices, 14. Things NOT to do in this pre-test fix, 15. Verification after the focused fix, 16. Pre-test exit gate, 17. First real test after this guide (+29 more)

### Community 18 - "DemoWorkflowProvider.tsx"
Cohesion: 0.13
Nodes (13): DemoWorkflowContext, DemoWorkflowContextValue, DemoWorkflowProvider(), makeId(), nowLabel(), Proposal, ProposalState, WorkflowNotification (+5 more)

### Community 19 - "VN–RU Public Discovery UI Guide"
Cohesion: 0.06
Nodes (32): 10. 2+2 rule, 11. Interaction integrity, 12. Responsive behavior, 13. Implementation mapping, 14. Acceptance test, 1. Product role, 2. Visual continuity with landing, 3. Typography (+24 more)

### Community 21 - "commitDemoMutation"
Cohesion: 0.12
Nodes (18): DemoActivityPanel(), titles, EndorsementItem, OrganizationWorkspace(), ResearcherWorkspace(), ReviewerWorkspace(), WorkspacePreviewNotice(), WorkspacePreviewNoticeProps (+10 more)

### Community 22 - "demo-backend.ts"
Cohesion: 0.14
Nodes (29): commitDemoMutation(), DemoActivity, DemoHandoff, DemoMutationOptions, DemoNotification, emitChange(), markAllDemoNotificationsRead(), markDemoNotificationRead() (+21 more)

### Community 23 - "7. DIAL DEFINITIONS (Technical Reference)"
Cohesion: 0.08
Nodes (23): Button Press, Checkmark Success, Confirmation Badge, Corporate, Disabled / Enabled, Error Shake, Error State, Focus States (+15 more)

### Community 24 - "docs/README.md"
Cohesion: 0.15
Nodes (6): Module 1 API Contract Policy, Module 1 RBAC Architecture, Documentation Index, Frontend Architecture, Backend Architecture, Module 1 Service Guide

### Community 25 - "SessionService"
Cohesion: 0.10
Nodes (21): Button Press (Playful), Card Entrance (Premium), Choreography Essentials, Common Patterns, CRITICAL — never break, Duration Table, Easing Selection, Emotion-to-Motion Map (+13 more)

### Community 26 - "index.ts"
Cohesion: 0.09
Nodes (16): ActivityItem, Opportunity, AcademicEvent, DEMO_ACADEMIC_EVENTS, getAcademicEventById(), DEMO_ACTIVITIES, DEMO_KNOWLEDGE_RESOURCES, getKnowledgeResourceById() (+8 more)

### Community 27 - "authentication.controller.ts"
Cohesion: 0.10
Nodes (12): Delete, Res, RequestWithCookies, AuthenticationController, Body, Controller, Get, Param (+4 more)

### Community 28 - "Mock Data Agent Guide — Interactive Role Workflows"
Cohesion: 0.07
Nodes (27): Activity fixtures, COLLABORATION_MANAGER, Deadline distribution, Decision, Edge cases bắt buộc, FOUNDATION_DECISION_MAKER / DECISION AUTHORITY, IAM / account, Khác biệt dữ liệu theo role (+19 more)

### Community 29 - "requireWorkspaceCapability"
Cohesion: 0.12
Nodes (18): metadata, Page(), metadata, Page(), metadata, Page(), metadata, Page() (+10 more)

### Community 30 - "Frontend API Contract Guide"
Cohesion: 0.12
Nodes (15): Anti-patterns, Authentication and Session, Authorization Context, Caching, Contract Rules, Error Contract, Frontend API Contract Guide, Generated Contracts (+7 more)

### Community 31 - "authentication.service.ts"
Cohesion: 0.23
Nodes (9): IdentityModule, Module, ExternalIdentityRecord, IdentityPrismaClient, IdentityService, IdentityUser, ResolveExternalIdentityInput, Inject (+1 more)

### Community 32 - "components/CollaborationManagerInteractiveWorkspace.tsx"
Cohesion: 0.10
Nodes (22): Assignment, assignmentMeta(), AssignmentState, initialAssignments, initialScreenings, ManagerView, ManagerWorkspaceContent(), opportunities (+14 more)

### Community 33 - "GuestExpertsV2.tsx"
Cohesion: 0.07
Nodes (28): AdminAuditPage(), auditCopy, metadata, metadata, BrandMark(), BrandMarkProps, FlagProps, LANGUAGE_OPTIONS (+20 more)

### Community 34 - "interactive-workflow-v2.test.mjs"
Cohesion: 0.08
Nodes (22): academicsContent, activitiesContent, allMockDataContent, decision, decisionsContent, endorsementsContent, expertsContent, iamContent (+14 more)

### Community 35 - "server.ts"
Cohesion: 0.24
Nodes (6): GET(), POST(), LoginPage(), getCurrentSession(), sanitizeLocale(), sanitizeReturnTo()

### Community 36 - "Frontend Runtime and UI Guide"
Cohesion: 0.20
Nodes (10): Component Ownership, Frontend Runtime and UI Guide, Loading, Error, and Standard UI States `[DESIGN]`, Multilingual Support & AI Translation `[SOURCE]`, Purpose, Realtime, Server and Client Components, State Ownership (+2 more)

### Community 37 - "VN–RU Full Modules Prototype V3 — ROLE / FLOW UI GUIDE"
Cohesion: 0.10
Nodes (19): 1. Canonical demo architecture, 2. Public is physically separated, 3. Authenticated role layouts, 4. Governance is separate, 5. Demo interactions, 6. Interaction ownership, 7. Visual rule, 8. Financial exclusion (+11 more)

### Community 38 - "components/ResearcherInteractiveWorkspace.tsx"
Cohesion: 0.12
Nodes (16): AcademicItem, academicItems, AcademicState, initialProjects, initialProposals, KnowledgeItem, knowledgeItems, Project (+8 more)

### Community 39 - "app.module.ts"
Cohesion: 0.29
Nodes (5): AppController, Controller, Get, AppService, Injectable

### Community 40 - "CollaborationManagerTaskWorkspace.tsx"
Cohesion: 0.12
Nodes (13): DialogState, ManagerView, Opportunity, OpportunityState, ReportItem, ReportState, ReviewAssignment, reviewerCandidates (+5 more)

### Community 41 - "authentication.module.ts"
Cohesion: 0.13
Nodes (9): Assignment, AssignmentState, DialogState, initialAssignments, ReviewerView, views, toneClass, WorkspaceTaskDialog() (+1 more)

### Community 42 - "app/page.tsx"
Cohesion: 0.11
Nodes (17): 1. Direct Entrance (Slide In), 1. Direct Exit (Slide Out), 2. Dissolve Exit (Fade Out), 2. Emergent Entrance (Scale In), 3. Collapse Exit (Shrink Out), 3. Reveal Entrance (Clip/Mask), 4. Assembled Entrance (Multi-Part), 4. Transfer Exit (Move Away) (+9 more)

### Community 43 - "Backend Service Rules"
Cohesion: 0.25
Nodes (7): Backend Service Rules, Before code, Boundaries, Contracts and events, Data, Testing and completion, Trust boundaries

### Community 44 - "Russia-Vietnam Science-Technology Intelligence Network Global Rules (Authoritative)"
Cohesion: 0.22
Nodes (8): 1. Security & Authentication Boundaries, 2. Data Ownership & Module Boundaries, 3. Package & Dependency Governance, 4. API & Resource Design, 5. Working Tree & Scope Constraints, 6. Verification Request Dispatch & Browser Testing Policy, 7. UI Quality & Impeccable Gate, Russia-Vietnam Science-Technology Intelligence Network Global Rules (Authoritative)

### Community 45 - "Frontend Rules"
Cohesion: 0.25
Nodes (7): Before code, Boundaries, Completion, Frontend Rules, Server state, State, UI Quality & Impeccable Gate

### Community 46 - "ResearcherTaskWorkspace.tsx"
Cohesion: 0.24
Nodes (10): filterNavSections(), hasCapability(), resolveUserPersonas(), WORKSPACE_MEMBER_CAPABILITIES, WORKSPACE_NAV_REGISTRY, WORKSPACE_PERSONAS, WorkspaceNavEntry, WorkspaceNavSection (+2 more)

### Community 47 - "ReviewerTaskWorkspace.tsx"
Cohesion: 0.06
Nodes (46): copy, groupLabels, isSystemRole(), Modal, permissionLabels, roleLabels, RolePermissionsPage(), Tab (+38 more)

### Community 48 - "Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network"
Cohesion: 0.18
Nodes (10): Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network, AGY / Ponytail execution policy, Browser Verification Policy (On-Demand / Proposal-First), Default UI scope, Execution rules, Local test accounts, Mandatory pre-code gate, Mandatory UI/UX quality routing (+2 more)

### Community 49 - "DecisionTaskWorkspace.tsx"
Cohesion: 0.19
Nodes (9): DecisionItem, DecisionState, DecisionTaskWorkspaceContent(), DecisionView, initialItems, stateClass(), stateLabel(), StatusPill() (+1 more)

### Community 50 - "AuthenticationService"
Cohesion: 0.12
Nodes (18): Optional, AccessControlPrismaClient, AccessControlService, PermissionRecord, ResolveCapabilitiesInput, RoleAssignmentRecord, RolePermissionRecord, RoleRecord (+10 more)

### Community 51 - "WorkspaceShell.tsx"
Cohesion: 0.19
Nodes (12): shellCopy, WorkspaceShell(), SheetContent(), SheetContentProps, SheetOverlay(), SheetOverlayProps, SheetProps, SheetTitle() (+4 more)

### Community 52 - "table.tsx"
Cohesion: 0.11
Nodes (17): Accordion, Choreography Rules, Coordinated Sequences, Counter-Motion, Dashboard Widgets, Drag and Drop, Grid Cards, Group Rules (+9 more)

### Community 64 - "prototype-v3/mock-data.ts"
Cohesion: 0.33
Nodes (8): INITIAL_2PLUS2_SLOTS, ROLE_CONFIGS, RU_ENTERPRISE_CANDIDATES, ConsortiumSlot, ProposalItem, RoleConfig, RoleType, RubricScore

### Community 69 - "iam.ts"
Cohesion: 0.22
Nodes (7): DEMO_AUDIT_EVENTS, DEMO_IAM_USERS, getIamUserById(), IamAssignmentScope, IamAuditEvent, IamDemoUser, IamUserStatus

### Community 71 - "GuestKnowledgeV2.tsx"
Cohesion: 0.33
Nodes (7): Home(), HomeSession, metadata, Page(), isSystemAdministrator(), resolveLandingPath(), UnifiedWorkspaceDashboard()

### Community 72 - "iam-admin.service.ts"
Cohesion: 0.14
Nodes (18): Query, IamAdminController, paginationSchema, roleAssignmentSchema, rolePermissionsSchema, Body, Controller, Get (+10 more)

### Community 73 - "reviews.ts"
Cohesion: 0.25
Nodes (6): ReviewAssignment, ReviewState, DEMO_REVIEWS, DetailedReview, getReviewById(), RubricBreakdown

### Community 74 - "workspace-server.ts"
Cohesion: 0.27
Nodes (7): metadata, Page(), metadata, Page(), requireWorkspaceSession(), EnterpriseWorkspace(), LeadershipWorkspace()

### Community 75 - "cn"
Cohesion: 0.07
Nodes (43): Badge(), BadgeProps, badgeStyles, BreadcrumbItem, Breadcrumbs(), BreadcrumbsProps, Button(), ButtonProps (+35 more)

### Community 76 - "3.4 Full"
Cohesion: 0.11
Nodes (17): 1. Command dispatch, 2. Common verification rules, 3.1 Quick, 3.2 Integration, 3.3 Browser UI, 3.4 Full, 3. Profile definitions, 4. Module-aware test selection (+9 more)

### Community 77 - "OrganizationTaskWorkspace.tsx"
Cohesion: 0.16
Nodes (10): MOCK_PROPOSALS, academicItems, DialogState, knowledgeItems, MilestoneState, pillClass(), ResearcherTaskWorkspaceContent(), ResearcherView (+2 more)

### Community 78 - "vnru-full-modules-prototype-v3/assets/app.js"
Cohesion: 0.43
Nodes (6): esc(), openDrawer(), openFlow(), openModal(), openPalette(), toast()

### Community 79 - "reports.ts"
Cohesion: 0.33
Nodes (4): ReportItem, DEMO_REPORTS, DetailedReport, getReportById()

### Community 80 - "opportunities.ts"
Cohesion: 0.40
Nodes (3): DEMO_EXPERTS, Expert, getExpertById()

### Community 81 - "Workflow Commands"
Cohesion: 0.06
Nodes (30): `archon chat <message>`, Archon CLI Command Reference, `archon complete <branch> [flags]`, `archon continue <branch> [flags] [message]`, `archon doctor`, `archon isolation cleanup [days]`, `archon isolation list`, `archon setup [--spawn]` (+22 more)

### Community 82 - "Workflow Commands"
Cohesion: 0.12
Nodes (15): 1. Lead with the Hero, 2. Spatial Origin Consistency, 3. Counter-Motion, Attention Direction, Choreography, Common Recipes, Coordinated Entry Rules, Dashboard Load (+7 more)

### Community 83 - "System Architecture"
Cohesion: 0.40
Nodes (4): Canonical routes, Current scope, Runtime ownership, System Architecture

### Community 84 - "RolePermissionsPage.tsx"
Cohesion: 0.22
Nodes (9): Color, Combined Properties, Opacity, Performance, Position, Property Selection, Property Selection by Goal, Rotation (+1 more)

### Community 85 - "Discord Bot Setup Guide"
Cohesion: 0.07
Nodes (26): 1. Create a Discord Application, 2. Create a Bot, 3. Generate Invite URL, 4. Get Your User ID, 5. Add to `.env` (in the archon repo root), 6. Start the Server, 7. Test, Discord Bot Setup Guide (+18 more)

### Community 86 - "admin-nav-registry.ts"
Cohesion: 0.12
Nodes (16): copy, NavItem, NavSection, SidebarFrame(), SidebarFrameProps, Tooltip(), TooltipProps, TooltipTrigger() (+8 more)

### Community 87 - "AuthenticatedRequestGuard"
Cohesion: 0.14
Nodes (15): AuthenticatedRequestGuard, extractSessionCookie(), isRecord(), RequireMfa(), RequirePermission(), context(), Injectable, SESSION_COOKIE_OPTIONS (+7 more)

### Community 88 - "style.md"
Cohesion: 0.20
Nodes (9): BlurText Component, Custom SVG Icons (no external icon library needed for these), Dependencies, FadingVideo Component, Fonts (Google Fonts), Key Design Principles, Liquid Glass CSS (in index.css), Section 1: Hero (+1 more)

### Community 89 - "auth.ts"
Cohesion: 0.25
Nodes (5): accountConfigSchema, backendUrl(), createBackendSession(), { handlers, auth, signIn, signOut }, config

### Community 90 - "VN–RU Network Portal"
Cohesion: 0.40
Nodes (4): Development, Documentation, Kept runtime, VN–RU Network Portal

### Community 91 - "jest"
Cohesion: 0.15
Nodes (13): js, json, **/*.(t|j)s, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir (+5 more)

### Community 93 - "High-Agency Frontend Skill"
Cohesion: 0.06
Nodes (30): 10. FINAL PRE-FLIGHT CHECK, 1. ACTIVE BASELINE CONFIGURATION, 2. DEFAULT ARCHITECTURE & CONVENTIONS, 3. DESIGN ENGINEERING DIRECTIVES (Bias Correction), 4. CREATIVE PROACTIVITY (Anti-Slop Implementation), 5. PERFORMANCE GUARDRAILS, 6. TECHNICAL REFERENCE (Dial Definitions), 7. AI TELLS (Forbidden Patterns) (+22 more)

### Community 94 - "NotFoundClient.tsx"
Cohesion: 0.29
Nodes (5): metadata, Locale, NotFoundClient(), Translation, translations

### Community 96 - "frontend/DESIGN.md"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 99 - "auth-service/package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 101 - "proposals.ts"
Cohesion: 0.14
Nodes (14): 10. Exaggeration, 11. Solid Drawing, 12. Appeal, 1. Squash and Stretch, 2. Anticipation, 3. Staging, 4. Straight Ahead vs. Pose to Pose, 5. Follow Through and Overlapping Action (+6 more)

### Community 102 - "Hooks"
Cohesion: 0.07
Nodes (29): Advanced Features: Hooks, MCP, Skills, Retry, Sessions, Typed Artifacts, Automatic Tool Wildcards, Claude vs Codex: How Each Gets MCP and Skills, Combining Skills with MCP, Common Patterns, Config File Format, Environment Variable Expansion, Error Classification (+21 more)

### Community 107 - "Discord Bot Setup Guide"
Cohesion: 0.15
Nodes (12): Ambient & Continuous Patterns, Breathing / Pulse, Combining Ambient Layers, Continuous Rotation, Dust/Motes: 5-10 elements, 10-30px/s mixed, 2-5px, 20-50% opacity, Floating / Hovering, Gradient Shift, Parallax (+4 more)

### Community 109 - "promax-actor-preflight.js"
Cohesion: 0.29
Nodes (5): accounts, env, fs, inventory, required

### Community 111 - "Hooks"
Cohesion: 0.17
Nodes (12): 1. Purpose?, 2. Audience?, 3. Context?, 4-Level Decision Hierarchy, Decision Framework, Decision Quick-Path, Evaluation Before Delivery, Level 1: Motion Category (+4 more)

### Community 113 - "import-fixture.ts"
Cohesion: 0.14
Nodes (15): @prisma/client, @prisma/client, ALLOWED_CAPABILITIES, ALLOWED_CONTEXT_TYPES, ALLOWED_ROLES, fixturesDocumentSchema, importFixture(), ROLE_POLICIES (+7 more)

### Community 114 - "theme-smoke.test.mjs"
Cohesion: 0.60
Nodes (4): OrganizationEndorsement, DEMO_ENDORSEMENTS, getEndorsementById(), getEndorsementByProposalId()

### Community 115 - "Archon Setup Wizard"
Cohesion: 0.09
Nodes (22): 4a: Launch the Setup Wizard, 4b: Wait for User Confirmation, 4c: Verify Configuration, 4d: Run Database Migrations (PostgreSQL only), Archon Setup Wizard, Config Files (YAML), Configuration Reference, Context (+14 more)

### Community 117 - "iam-admin.service.ts"
Cohesion: 0.17
Nodes (13): create(), createMany(), deleteMany(), findMany(), findUnique(), IamAdminPrismaClient, IamAdminService, RoleWithPermissions (+5 more)

### Community 118 - "Anti-Patterns"
Cohesion: 0.09
Nodes (22): 1. Use deterministic nodes for deterministic work, 2. Use `output_format` for every node whose output downstream `when:` reads, 3. `trigger_rule: none_failed_min_one_success` after conditional branches, 4. `context: fresh` requires artifacts for state passing, 5. Cheap models for glue, strong models for substance, 6. Write the workflow description for routing, 7. Validate before shipping, 8. Design the artifact chain before writing command files (+14 more)

### Community 119 - "Archon Setup Wizard"
Cohesion: 0.17
Nodes (12): 1. Signature Easing (80% of animations), 2. Duration Palette, 3. Entrance Pattern, Brand Motion Identity, Corporate / Professional, Energetic / Dynamic, Four Archetypes, Keyword Matching (+4 more)

### Community 120 - "Anti-Patterns"
Cohesion: 0.15
Nodes (12): Distance-Duration Scaling, Duration by Element Type, Duration by Personality, Easing: Directional Rules, Easing: Industry Standards, Enter vs. Exit, Interactive Feedback, Material-Based Easing (+4 more)

### Community 127 - "UI Quality Pro-Max — VN-RU Portal"
Cohesion: 0.06
Nodes (32): 10. Spacing, geometry, and visual rhythm, 11. Color, hierarchy, and state styling, 12. Icons and imagery, 13. UX and information architecture, 14. Forms, tables, dialogs, menus, and data-dense surfaces, 15. Async/state completeness, 16. Accessibility baseline, 17. Zoom and content stress (+24 more)

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

### Community 140 - "Archon CLI Skill"
Cohesion: 0.09
Nodes (21): Advanced Features (Command/Prompt Nodes), Archon CLI Skill, Authoring Quick Start, Available Workflows (live), Core Command, Creating a Command File, Example Files, Example Interactions (+13 more)

### Community 141 - "12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)"
Cohesion: 0.40
Nodes (5): 12.A File Location, 12.B Required Frontmatter, 12.C Required Body Sections, 12.D Block-Library Discipline, 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)

### Community 142 - "5. CONTEXT-AWARE PROACTIVITY"
Cohesion: 0.40
Nodes (5): 5.A Sticky-Stack - Canonical Skeleton, 5.B Horizontal-Pan - Canonical Skeleton, 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative), 5. CONTEXT-AWARE PROACTIVITY, 5.D Forbidden Animation Patterns

### Community 143 - "8. DARK MODE PROTOCOL"
Cohesion: 0.40
Nodes (5): 8.A Token Strategy (pick one, stick to it), 8.B Do Not Prescribe Specific Colors Here, 8.C Default Mode, 8.D Test in Both Modes Before Finishing, 8. DARK MODE PROTOCOL

### Community 144 - "Archon CLI Skill"
Cohesion: 0.18
Nodes (10): Accessibility, Cognitive Accessibility, Content Type Adaptation, Context Adaptation, Dark Mode, Performance Budgets, Platform Scaling, prefers-reduced-motion (+2 more)

### Community 145 - "KeycloakProfileService"
Cohesion: 0.16
Nodes (13): AppModule, Module, configSchema, validateConfig(), bootstrap(), AccessControlModule, Module, AuthenticationModule (+5 more)

### Community 147 - "useLocale"
Cohesion: 0.09
Nodes (24): metadata, Page(), metadata, metadata, Page(), ExpertDetailPage(), OpportunitiesIndexPage(), OpportunityDetailPage() (+16 more)

### Community 148 - "Common Failure Modes"
Cohesion: 0.11
Nodes (17): A node was skipped and I don't know why, A workflow-level field seems to have no effect, Approval gate not appearing on web UI, Artifact Locations, "Claude Code not found" / "Codex CLI binary not found", Common Failure Modes, Escalation: when nothing makes sense, Log Locations (+9 more)

### Community 149 - "Common Failure Modes"
Cohesion: 0.18
Nodes (10): Act 1: Anticipation (10-20%), Act 2: Action (30-50%), Act 3: Reaction (10-20%), Act 4: Resolution (20-30%), By Personality, Common Patterns, Four-Act Structure, Multi-Beat Narratives (+2 more)

### Community 151 - "dev-actor-session-bridge.js"
Cohesion: 0.22
Nodes (8): account, accounts, env, fs, http, inventory, server, session()

### Community 152 - "Archon Configuration Guide"
Cohesion: 0.12
Nodes (16): Archon Configuration Guide, Environment Variable Overrides, For Global Config (~/.archon/config.yaml), For Repo Config (<repo>/.archon/config.yaml), Global Config (~/.archon/config.yaml), Global Config Options, Precedence Order (highest wins), Reference: All Configuration Options (+8 more)

### Community 153 - "Archon Configuration Guide"
Cohesion: 0.18
Nodes (10): Accessibility Quality, CRITICAL, Emotional Quality, HIGH, MEDIUM, Performance Quality, Quality Checklist, Severity Tiers (+2 more)

### Community 154 - "dependencies"
Cohesion: 0.12
Nodes (17): clsx, @dangminhdev04032005/query-resource, dependencies, clsx, @dangminhdev04032005/query-resource, motion, next-themes, react-i18next (+9 more)

### Community 155 - "mfa/route.ts"
Cohesion: 0.17
Nodes (11): Feels Cheap / Flat, Feels Too Fast / Jarring, Feels Too Slow, Inconsistent Feel, Looks Robotic, No Personality, Performance (Dropped Frames), Personality Mistakes (+3 more)

### Community 157 - "decisions.ts"
Cohesion: 0.16
Nodes (13): Decision, DecisionState, Milestone, MilestoneState, Project, ProjectState, DEMO_DECISIONS, DetailedDecision (+5 more)

### Community 158 - "1. THE THREE DIALS (Core Configuration)"
Cohesion: 0.40
Nodes (5): 0.A Read these signals first, 0.B Output a one-line "Design Read" before generating, 0. BRIEF INFERENCE (Read the Room Before Anything Else), 0.C If the brief is ambiguous, ask one question, do not guess, 0.D Anti-Default Discipline

### Community 159 - "route.ts"
Cohesion: 0.22
Nodes (8): Core Philosophy, Pillar 1: Emotional Intent, Pillar 2: Visual Narrative, Pillar 3: Motion Craft, The 1/3 Screen Rule, The Attention Budget, Three Motion Layers, Three Pillars

### Community 164 - "cn.ts"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

### Community 165 - "Authoring Command Files"
Cohesion: 0.14
Nodes (13): Anti-Patterns, Artifact Conventions, Authoring Command Files, Complex Command Example, Discovery and Priority, File Format, File Location, Frontmatter Fields (+5 more)

### Community 166 - "Control"
Cohesion: 0.14
Nodes (13): `archon workflow abandon <run-id> [--json]`, `archon workflow approve <run-id> [comment] [--json]`, `archon workflow get <run-id> [--verbose] [--json]`, `archon workflow reject <run-id> [reason] [--json]`, `archon workflow resume <run-id> [--json]`, `archon workflow run <workflow> "<message>" --detach [--json]`, `archon workflow runs [--all] [--status <s>] [--limit <n>] [--json]`, `archon workflow status [--verbose] [--json]` (+5 more)

### Community 168 - "Control"
Cohesion: 0.25
Nodes (7): Color, Elevation, Motion, Primitives, Shape, Spacing, Typography

### Community 169 - "Workflow Authoring"
Cohesion: 0.15
Nodes (12): Complete Example, Dependencies and Parallel Execution, Node Base Fields, Node Output Substitution, Per-Node Provider and Model, Resume on Failure, Schema, Structured Output (`output_format`) (+4 more)

### Community 170 - "Workflow Authoring"
Cohesion: 0.25
Nodes (7): Color Psychology, Color Transition Rules, Context-Based Emotion Defaults, Core Table, Emotion-to-Motion Mapping, Emotional Intensity, Path as Emotional Language

### Community 171 - "Interactive Workflow Guide"
Cohesion: 0.17
Nodes (11): 1. Invoke the workflow, 2. Monitor for pause, 3. Fetch and relay the output — BE TRANSPARENT, 4. Collect user response and resume, 5. Repeat until workflow completes, Approval Commands, Identifying Interactive Workflows, Interactive Workflow Guide (+3 more)

### Community 172 - "Interactive Workflow Guide"
Cohesion: 0.29
Nodes (6): Inventory, Non-negotiable readability gate, Product mental model, Sources of truth, Visual direction, VN–RU Portal Design DNA

### Community 173 - "Scales"
Cohesion: 0.29
Nodes (6): Color modes, Density, Grid, Responsive, Scales, Stability

### Community 174 - "GitHub Webhook Setup Guide"
Cohesion: 0.18
Nodes (10): 0. Check Existing .env Values, 1. Set Up a Public URL (ngrok), 2. Start ngrok, 3. Generate a Webhook Secret, 4. Collect GitHub Token and Username, 5. Write to `.env`, 6. Configure the Repository Webhook, 7. Verify the Webhook (+2 more)

### Community 175 - "Manage Archon Runs"
Cohesion: 0.18
Nodes (10): Approve or reject a paused run (two steps), How output works, Interactive-loop gates: no comment = accept & complete, Manage Archon Runs, Monitor a run to completion, Patterns, Recent runs (live), Reference (+2 more)

### Community 176 - "GitHub Webhook Setup Guide"
Cohesion: 0.29
Nodes (6): Design DNA, Natural-language operations, Output, Required workflow, Source order, Trigger

### Community 177 - "Manage Archon Runs"
Cohesion: 0.33
Nodes (5): Behaviors, Forms, Interaction, Loading and state, Motion

### Community 178 - "Core Components"
Cohesion: 0.33
Nodes (5): Buttons and inputs, Cards, Core Components, Navigation, Tables and status

### Community 179 - "Initializing Archon in a Repository"
Cohesion: 0.20
Nodes (9): Directory Structure, .gitignore Considerations, Global Configuration, How Bundled Defaults Work, Initializing Archon in a Repository, Minimal config.yaml, Per-Project Env Injection, Three-Path Env Model (+1 more)

### Community 180 - "Initializing Archon in a Repository"
Cohesion: 0.33
Nodes (5): Authentication, Operational workspace, Public/marketing, Responsive, Surface Patterns

### Community 181 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): name, packageManager, private, scripts, build, dev, lint, start (+1 more)

### Community 182 - "Semantics"
Cohesion: 0.40
Nodes (4): Color, Semantics, Spacing and elevation, Typography

### Community 184 - "route.ts"
Cohesion: 0.83
Nodes (3): DELETE(), GET(), proxy()

### Community 185 - "Command Name"
Cohesion: 0.22
Nodes (8): Command Name, PHASE_1_CHECKPOINT, Phase 1: LOAD, PHASE_2_CHECKPOINT, Phase 2: EXECUTE, PHASE_3_CHECKPOINT, Phase 3: GENERATE, Phase 4: REPORT

### Community 186 - "Parameter Matrix (Quick Reference)"
Cohesion: 0.22
Nodes (8): Cross-References to Detailed Guides, Inline `agents:` (Task-tool sub-agents), Master Matrix: Parameters × Node Types, Parameter Matrix (Quick Reference), Parameter Selection by Intent, Providers at a Glance, Silent Failures (what gets ignored without erroring), Ten Principles for Safe Workflow Design

### Community 187 - "Variable Substitution Reference"
Cohesion: 0.22
Nodes (8): Context Auto-Append, Escaped Dollar Signs, Node Output Details (DAG Only), NOT Supported: `$1` … `$9` Positional Arguments, Substitution Order, Variable Substitution Reference, Variable Table, Where Variables Are Substituted

### Community 191 - "Product"
Cohesion: 0.22
Nodes (8): Audience, Constraints, Core mechanism, Design success, Identity, Implemented surfaces, Product, Product truth

### Community 192 - "Ponytail"
Cohesion: 0.22
Nodes (8): Boundaries, Intensity, Output, Persistence, Ponytail, Rules, The ladder, When NOT to be lazy

### Community 195 - "Loop Nodes"
Cohesion: 0.25
Nodes (8): Completion Detection, Configuration, Interactive Loops, Loop Nodes, Loop Output, Patterns, Session Patterns, What Works / Does NOT Work on Loop Nodes

### Community 199 - "CLI Setup Guide"
Cohesion: 0.29
Nodes (6): 1. Install Dependencies, 2. Link the CLI Globally, 3. Verify Installation, 4. Authenticate Claude, CLI Setup Guide, Notes

### Community 200 - "Node Types (Mutually Exclusive)"
Cohesion: 0.29
Nodes (7): Bash Node, Command Node, Loop Group Node, Loop Node, Node Types (Mutually Exclusive), Prompt Node, Script Node

### Community 207 - "Approval Nodes"
Cohesion: 0.33
Nodes (6): Approval Nodes, Approve and Reject Commands, Configuration, Fields, Web UI Requirement, What Does NOT Work on Approval Nodes

### Community 208 - "Workflow-Level Fields"
Cohesion: 0.33
Nodes (6): Claude SDK Advanced Options, Codex-Specific Options, Complete workflow-level example, Core, Isolation, Workflow-Level Fields

### Community 211 - "Query Resource Guide"
Cohesion: 0.33
Nodes (5): Before coding, Minimal pattern, Query Resource Guide, Required practices, Rule

### Community 212 - "Task: Rebranding & Identity Customization"
Cohesion: 0.33
Nodes (5): Step 1 — Gather Branding Inputs, Step 2 — Confirm Summary Before Applying, Step 3 — Apply Targeted Updates, Step 4 — Verify, Task: Rebranding & Identity Customization

### Community 213 - "Task: Add a New Workspace / Portal Page"
Cohesion: 0.33
Nodes (5): Step 0 — Gather Inputs, Step 1 — Create `page.tsx`, Step 2 — Wire into `Sidebar.tsx`, Step 3 — Verify, Task: Add a New Workspace / Portal Page

### Community 217 - "Cancel Nodes"
Cohesion: 0.40
Nodes (5): Cancel Nodes, Configuration, Fields, Typical Patterns, When to use `cancel` vs failing a `bash:` check

### Community 218 - "Conditions (`when:`)"
Cohesion: 0.40
Nodes (5): Compound Expressions, Conditions (`when:`), Dot Notation (JSON Field Access) — Strict Semantics, Error Modes: Skip vs Fail, Operators

### Community 219 - "React Aria Components & TailGrids Primitives in VN-RU Portal"
Cohesion: 0.40
Nodes (4): Available Primitives, Overview, React Aria Components & TailGrids Primitives in VN-RU Portal, Rules

### Community 225 - "Loop Group Nodes"
Cohesion: 0.50
Nodes (4): Body Semantics, Configuration, Loop Group Nodes, When to use `loop:` vs `loop_group:`

### Community 229 - "Synthetic IAM Workflow Fixtures"
Cohesion: 0.50
Nodes (3): Critical notice, Synthetic IAM Workflow Fixtures, Usage

### Community 240 - "workspace-registry.ts"
Cohesion: 0.12
Nodes (19): Header(), headerCopy, HeaderProps, SidebarProps, auth, authResource, CurrentUser, json() (+11 more)

## Knowledge Gaps
- **1416 isolated node(s):** `auditCopy`, `metadata`, `metadata`, `metadata`, `metadata` (+1411 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale` connect `WorkspaceShell.tsx` to `GuestExpertsV2.tsx`, `demo-v2/CollaborationManagerInteractiveWorkspace.tsx`, `GuestKnowledgeV2.tsx`, `cn`, `ReviewerTaskWorkspace.tsx`, `workspace-registry.ts`, `useLocale`, `admin-nav-registry.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `react` connect `demo-backend.ts` to `components/CollaborationManagerInteractiveWorkspace.tsx`, `demo-v2/CollaborationManagerInteractiveWorkspace.tsx`, `components/ResearcherInteractiveWorkspace.tsx`, `components/DecisionInteractiveWorkspace.tsx`, `OrganizationTaskWorkspace.tsx`, `DecisionTaskWorkspace.tsx`, `DemoWorkflowProvider.tsx`, `commitDemoMutation`, `dependencies`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `WorkspacePreviewNotice()` connect `commitDemoMutation` to `prototype-v3/mock-data.ts`, `components/CollaborationManagerInteractiveWorkspace.tsx`, `demo-v2/CollaborationManagerInteractiveWorkspace.tsx`, `components/ResearcherInteractiveWorkspace.tsx`, `CollaborationManagerTaskWorkspace.tsx`, `components/DecisionInteractiveWorkspace.tsx`, `workspace-server.ts`, `authentication.module.ts`, `OrganizationTaskWorkspace.tsx`, `DecisionTaskWorkspace.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `auditCopy`, `metadata`, `metadata` to the rest of the system?**
  _1416 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `demo-v2/CollaborationManagerInteractiveWorkspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09216255442670537 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._