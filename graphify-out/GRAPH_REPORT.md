# Graph Report - .  (2026-08-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2171 nodes · 2822 edges · 197 communities (159 shown, 38 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b410ee26`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- server.ts
- RolePermissionsPage.tsx
- cn
- dependencies
- Auth Service Specification — Module 1
- IdentityService
- compilerOptions
- UI Quality Pro-Max — VN-RU Portal
- authentication.service.ts
- VN–RU Public Discovery UI Guide
- High-Agency Frontend Skill
- Discord Bot Setup Guide
- Workflow Commands
- SidebarFrame.tsx
- Hooks
- Mock Data Agent Guide — Interactive Role Workflows
- GuestExploreV2.tsx
- AuthenticatedRequest
- State & Feedback Patterns
- locale.ts
- SessionService
- Archon Setup Wizard
- Anti-Patterns
- PublicDiscoveryPages.tsx
- compilerOptions
- Archon CLI Skill
- Appendix B - Canonical Sources (read these before reinventing)
- iam-admin.service.ts
- Motion Design Skill
- GuestNewsArticleV2.tsx
- Design Audit
- useLocale
- VN–RU Full Modules Prototype V3 — ROLE / FLOW UI GUIDE
- Analysis & Synthesis Instructions
- Locale
- iam-admin.controller.ts
- app.module.ts
- access-control.service.ts
- Common Failure Modes
- Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)
- Common Recipes
- Coordinated Sequences
- 3.4 Full
- import-fixture.ts
- authentication.module.ts
- Archon Configuration Guide
- devDependencies
- dependencies
- Choreography
- SidebarIcons.tsx
- Frontend API Contract Guide
- Design System: Taste Standard
- devDependencies
- Control
- Disney's 12 Principles — UI Adapted
- docs/README.md
- PublicHome.tsx
- authoring-commands.md
- Workflow Authoring
- Ambient & Continuous Patterns
- jest
- scripts
- Approval Nodes
- 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)
- 4-Level Decision Hierarchy
- Four Archetypes
- Timing & Easing Tables
- Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network
- GitHub Webhook Setup Guide
- Protocol: Running Interactive Workflows
- Manage Archon Runs
- Context Adaptation
- Narrative Structure
- Quality Checklist
- Troubleshooting
- workspace-registry.ts
- Initializing Archon in a Repository
- 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)
- tasteskill: Anti-Slop Frontend Skill
- Frontend Runtime and UI Guide
- GuestKnowledgeV2.tsx
- style.md
- Command Name
- Parameter Matrix (Quick Reference)
- Variable Substitution Reference
- Core Philosophy
- Russia-Vietnam Science-Technology Intelligence Network Global Rules (Authoritative)
- Product
- Ponytail
- dev-actor-session-bridge.js
- Primitives
- 9. AI TELLS (Forbidden Patterns)
- Emotion-to-Motion Mapping
- Property Selection
- app/layout.tsx
- frontend/DESIGN.md
- Frontend Rules
- Backend Modular Monolith Rules
- vnru-full-modules-prototype-v3/assets/app.js
- CLI Setup Guide
- Node Types (Mutually Exclusive)
- Loop Nodes
- VN–RU Portal Design DNA
- Scales
- Design DNA
- 11. REDESIGN PROTOCOL
- 3. DEFAULT ARCHITECTURE & CONVENTIONS
- 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS
- NotFoundClient.tsx
- promax-actor-preflight.js
- auth-service/package.json
- Workflow-Level Fields
- Behaviors
- Core Components
- Surface Patterns
- Query Resource Guide
- opportunities.ts
- Task: Rebranding & Identity Customization
- Task: Add a New Workspace / Portal Page
- nest-cli.json
- Conditions (`when:`)
- Semantics
- 0. BRIEF INFERENCE (Read the Room Before Anything Else)
- 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)
- 5. CONTEXT-AWARE PROACTIVITY
- 8. DARK MODE PROTOCOL
- React Aria Components & TailGrids Primitives in VN-RU Portal
- System Architecture
- VN–RU Network Portal
- 7. DIAL DEFINITIONS (Technical Reference)
- Portal Foundation Decisions
- Synthetic IAM Workflow Fixtures
- deploy.sh
- This is NOT the Next.js you know
- eslint
- rules/graphify.md
- impeccable.md
- principles.md
- workflows/graphify.md
- DEPLOYMENT.md
- supertest
- @eslint/js
- eslint-plugin-prettier
- MODULE_GUIDE.md
- PROMPT_PRE_TEST_FOCUSED_FIX.md
- frontend/eslint.config.mjs
- home-i18n.test.mjs
- next.config.ts
- postcss.config.mjs
- frontend/README.md
- copilot-instructions.md
- globals
- jest
- @nestjs/schematics
- @nestjs/testing
- prettier
- prisma
- services/AGENTS.md
- ts-node
- @types/express
- @types/jest
- @types/supertest
- typescript-eslint
- MIGRATION_GUIDE.md
- MULTILINGUAL_BACKEND_PLAN.md
- vnru-full-modules-prototype-v3/README.md
- SCREEN_OWNERSHIP_MATRIX.md
- deploy-script.test.sh
- { GET, POST }
- Module

## God Nodes (most connected - your core abstractions)
1. `useLocale` - 62 edges
2. `cn()` - 47 edges
3. `authServiceUrl()` - 30 edges
4. `Locale` - 28 edges
5. `UI Quality Pro-Max — VN-RU Portal` - 27 edges
6. `backendHeaders()` - 27 edges
7. `compilerOptions` - 22 edges
8. `Workflow Authoring` - 19 edges
9. `SessionService` - 19 edges
10. `AuthenticatedRequest` - 17 edges

## Surprising Connections (you probably didn't know these)
- `exclude` --extends--> `node_modules`  [EXTRACTED]
  services/auth-service/tsconfig.build.json → frontend/tsconfig.json
- `RegisterPage()` --calls--> `useLocale`  [EXTRACTED]
  frontend/app/register/page.tsx → frontend/core/i18n/locale.ts
- `ExpertsIndexPage()` --calls--> `useLocale`  [EXTRACTED]
  frontend/features/public-discovery/components/PublicDiscoveryPages.tsx → frontend/core/i18n/locale.ts
- `AdminAuditPage()` --calls--> `useLocale`  [EXTRACTED]
  frontend/app/(admin)/admin/audit/page.tsx → frontend/core/i18n/locale.ts
- `NotFoundClient()` --calls--> `useLocale`  [EXTRACTED]
  frontend/app/NotFoundClient.tsx → frontend/core/i18n/locale.ts

## Import Cycles
- None detected.

## Communities (197 total, 38 thin omitted)

### Community 0 - "server.ts"
Cohesion: 0.06
Nodes (54): POST(), GET(), PATCH(), PATCH(), GET(), POST(), GET(), POST() (+46 more)

### Community 1 - "RolePermissionsPage.tsx"
Cohesion: 0.06
Nodes (46): copy, groupLabels, isSystemRole(), Modal, permissionLabels, roleLabels, RolePermissionsPage(), Tab (+38 more)

### Community 2 - "cn"
Cohesion: 0.07
Nodes (40): Badge(), BadgeProps, badgeStyles, Button(), ButtonProps, buttonStyles, Card(), CardAction() (+32 more)

### Community 3 - "dependencies"
Cohesion: 0.04
Nodes (44): class-variance-authority, clsx, @dangminhdev04032005/query-resource, dependencies, class-variance-authority, clsx, @dangminhdev04032005/query-resource, i18next (+36 more)

### Community 4 - "Auth Service Specification — Module 1"
Cohesion: 0.05
Nodes (39): `access-control`, Auth Service — Module 1 Base, Authenticated request, `authentication`, Boundary Rules, Current Base, Current Non-Goals, `identity` (+31 more)

### Community 5 - "IdentityService"
Cohesion: 0.10
Nodes (21): Body, Controller, Post, Req, CallbackResult, IdentityModule, Module, ExternalIdentityRecord (+13 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (34): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+26 more)

### Community 7 - "UI Quality Pro-Max — VN-RU Portal"
Cohesion: 0.06
Nodes (32): 10. Spacing, geometry, and visual rhythm, 11. Color, hierarchy, and state styling, 12. Icons and imagery, 13. UX and information architecture, 14. Forms, tables, dialogs, menus, and data-dense surfaces, 15. Async/state completeness, 16. Accessibility baseline, 17. Zoom and content stress (+24 more)

### Community 8 - "authentication.service.ts"
Cohesion: 0.15
Nodes (16): AuthenticatedRequestGuard, extractSessionCookie(), isRecord(), REQUIRE_MFA_KEY, RequireMfa(), RequirePermission(), SESSION_COOKIE_NAME, context() (+8 more)

### Community 9 - "VN–RU Public Discovery UI Guide"
Cohesion: 0.06
Nodes (32): 10. 2+2 rule, 11. Interaction integrity, 12. Responsive behavior, 13. Implementation mapping, 14. Acceptance test, 1. Product role, 2. Visual continuity with landing, 3. Typography (+24 more)

### Community 10 - "High-Agency Frontend Skill"
Cohesion: 0.06
Nodes (30): 10. FINAL PRE-FLIGHT CHECK, 1. ACTIVE BASELINE CONFIGURATION, 2. DEFAULT ARCHITECTURE & CONVENTIONS, 3. DESIGN ENGINEERING DIRECTIVES (Bias Correction), 4. CREATIVE PROACTIVITY (Anti-Slop Implementation), 5. PERFORMANCE GUARDRAILS, 6. TECHNICAL REFERENCE (Dial Definitions), 7. AI TELLS (Forbidden Patterns) (+22 more)

### Community 11 - "Discord Bot Setup Guide"
Cohesion: 0.07
Nodes (26): 1. Create a Discord Application, 2. Create a Bot, 3. Generate Invite URL, 4. Get Your User ID, 5. Add to `.env` (in the archon repo root), 6. Start the Server, 7. Test, Discord Bot Setup Guide (+18 more)

### Community 12 - "Workflow Commands"
Cohesion: 0.07
Nodes (29): `archon chat <message>`, Archon CLI Command Reference, `archon complete <branch> [flags]`, `archon continue <branch> [flags] [message]`, `archon doctor`, `archon isolation cleanup [days]`, `archon isolation list`, `archon setup [--spawn]` (+21 more)

### Community 13 - "SidebarFrame.tsx"
Cohesion: 0.10
Nodes (21): SidebarProps, copy, NavItem, NavSection, SidebarFrame(), SidebarFrameProps, Tooltip(), TooltipProps (+13 more)

### Community 14 - "Hooks"
Cohesion: 0.08
Nodes (27): Advanced Features: Hooks, MCP, Skills, Retry, Sessions, Typed Artifacts, Automatic Tool Wildcards, Claude vs Codex: How Each Gets MCP and Skills, Combining Skills with MCP, Common Patterns, Config File Format, Environment Variable Expansion, Error Classification (+19 more)

### Community 15 - "Mock Data Agent Guide — Interactive Role Workflows"
Cohesion: 0.07
Nodes (27): Activity fixtures, COLLABORATION_MANAGER, Deadline distribution, Decision, Edge cases bắt buộc, FOUNDATION_DECISION_MAKER / DECISION AUTHORITY, IAM / account, Khác biệt dữ liệu theo role (+19 more)

### Community 16 - "GuestExploreV2.tsx"
Cohesion: 0.10
Nodes (20): metadata, GuestExploreMedia(), MEDIA_COPY, articleId(), CATALOGS, Category, FEATURED, FeedCategory (+12 more)

### Community 17 - "AuthenticatedRequest"
Cohesion: 0.20
Nodes (14): Delete, Res, AuthenticatedRequest, RequestWithCookies, AuthenticationController, Body, Controller, Get (+6 more)

### Community 18 - "State & Feedback Patterns"
Cohesion: 0.08
Nodes (23): Button Press, Checkmark Success, Confirmation Badge, Corporate, Disabled / Enabled, Error Shake, Error State, Focus States (+15 more)

### Community 19 - "locale.ts"
Cohesion: 0.14
Nodes (13): Header(), headerCopy, HeaderProps, shellCopy, WorkspaceShell(), SheetContent(), SheetContentProps, SheetOverlay() (+5 more)

### Community 20 - "SessionService"
Cohesion: 0.09
Nodes (7): Optional, AccessControlService, Inject, Injectable, SessionService, Inject, Injectable

### Community 21 - "Archon Setup Wizard"
Cohesion: 0.09
Nodes (22): 4a: Launch the Setup Wizard, 4b: Wait for User Confirmation, 4c: Verify Configuration, 4d: Run Database Migrations (PostgreSQL only), Archon Setup Wizard, Config Files (YAML), Configuration Reference, Context (+14 more)

### Community 22 - "Anti-Patterns"
Cohesion: 0.09
Nodes (22): 1. Use deterministic nodes for deterministic work, 2. Use `output_format` for every node whose output downstream `when:` reads, 3. `trigger_rule: none_failed_min_one_success` after conditional branches, 4. `context: fresh` requires artifacts for state passing, 5. Cheap models for glue, strong models for substance, 6. Write the workflow description for routing, 7. Validate before shipping, 8. Design the artifact chain before writing command files (+14 more)

### Community 23 - "PublicDiscoveryPages.tsx"
Cohesion: 0.14
Nodes (17): ExpertDetailPage(), ExpertsIndexPage(), OpportunitiesIndexPage(), OpportunityDetailPage(), UI, EXPERTS, getExpert(), getOpportunity() (+9 more)

### Community 24 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 25 - "Archon CLI Skill"
Cohesion: 0.09
Nodes (21): Advanced Features (Command/Prompt Nodes), Archon CLI Skill, Authoring Quick Start, Available Workflows (live), Core Command, Creating a Command File, Example Files, Example Interactions (+13 more)

### Community 26 - "Appendix B - Canonical Sources (read these before reinventing)"
Cohesion: 0.09
Nodes (21): APPENDICES - Real Source-Backed Reference Material, Appendix A - Install Commands per Design System, Appendix B - Canonical Sources (read these before reinventing), Appendix C - Apple Liquid Glass: Honest Web Approximation, Apple Liquid Glass (Apple platforms only), Atlassian, Bootstrap, Carbon (+13 more)

### Community 27 - "iam-admin.service.ts"
Cohesion: 0.18
Nodes (14): create(), createMany(), deleteMany(), findMany(), findUnique(), IamAdminPrismaClient, IamAdminService, isSuperAdminRole() (+6 more)

### Community 28 - "Motion Design Skill"
Cohesion: 0.10
Nodes (21): Button Press (Playful), Card Entrance (Premium), Choreography Essentials, Common Patterns, CRITICAL — never break, Duration Table, Easing Selection, Emotion-to-Motion Map (+13 more)

### Community 29 - "GuestNewsArticleV2.tsx"
Cohesion: 0.11
Nodes (13): Page(), PageProps, VALID_IDS, copy, RegisterPage(), BrandMark(), BrandMarkProps, ArticleRecord (+5 more)

### Community 30 - "Design Audit"
Cohesion: 0.10
Nodes (19): Code Quality, Color and Surfaces, Component Patterns, Content, Design Audit, Fix Priority, How This Works, Iconography (+11 more)

### Community 31 - "useLocale"
Cohesion: 0.15
Nodes (15): AdminAuditPage(), auditCopy, BreadcrumbItem, Breadcrumbs(), BreadcrumbsProps, useLocale, Expert, COPY (+7 more)

### Community 32 - "VN–RU Full Modules Prototype V3 — ROLE / FLOW UI GUIDE"
Cohesion: 0.10
Nodes (19): 1. Canonical demo architecture, 2. Public is physically separated, 3. Authenticated role layouts, 4. Governance is separate, 5. Demo interactions, 6. Interaction ownership, 7. Visual rule, 8. Financial exclusion (+11 more)

### Community 33 - "Analysis & Synthesis Instructions"
Cohesion: 0.11
Nodes (18): 1. Define the Atmosphere, 2. Map the Color Palette, 3. Establish Typography Rules, 4. Define the Hero Section, 5. Describe Component Stylings, 6. Define Layout Principles, 7. Define Responsive Rules, 8. Encode Motion Philosophy (+10 more)

### Community 34 - "Locale"
Cohesion: 0.13
Nodes (13): FlagProps, LANGUAGE_OPTIONS, LanguageOption, LanguageSwitcher(), LanguageSwitcherProps, LanguageSwitcherVariant, switcherCopy, Locale (+5 more)

### Community 35 - "iam-admin.controller.ts"
Cohesion: 0.13
Nodes (17): Query, IamAdminController, paginationSchema, roleAssignmentSchema, rolePermissionsSchema, Body, Controller, Get (+9 more)

### Community 36 - "app.module.ts"
Cohesion: 0.17
Nodes (9): AppController, Controller, Get, AppModule, Module, AppService, Injectable, AuthenticationModule (+1 more)

### Community 37 - "access-control.service.ts"
Cohesion: 0.19
Nodes (14): ACCESS_CONTROL_PRISMA, AccessControlPrismaClient, PermissionRecord, ResolveCapabilitiesInput, RoleAssignmentRecord, RolePermissionRecord, RoleRecord, CreateSessionInput (+6 more)

### Community 38 - "Common Failure Modes"
Cohesion: 0.11
Nodes (17): A node was skipped and I don't know why, A workflow-level field seems to have no effect, Approval gate not appearing on web UI, Artifact Locations, "Claude Code not found" / "Codex CLI binary not found", Common Failure Modes, Escalation: when nothing makes sense, Log Locations (+9 more)

### Community 39 - "Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)"
Cohesion: 0.11
Nodes (17): 1. Meta Information & Core Directive, 2. THE "ABSOLUTE ZERO" DIRECTIVE (STRICT ANTI-PATTERNS), 3. THE CREATIVE VARIANCE ENGINE, 4. HAPTIC MICRO-AESTHETICS (COMPONENT MASTERY), 5. MOTION CHOREOGRAPHY (FLUID DYNAMICS), 6. PERFORMANCE GUARDRAILS, 7. EXECUTION PROTOCOL, 8. PRE-OUTPUT CHECKLIST (+9 more)

### Community 40 - "Common Recipes"
Cohesion: 0.11
Nodes (17): 1. Direct Entrance (Slide In), 1. Direct Exit (Slide Out), 2. Dissolve Exit (Fade Out), 2. Emergent Entrance (Scale In), 3. Collapse Exit (Shrink Out), 3. Reveal Entrance (Clip/Mask), 4. Assembled Entrance (Multi-Part), 4. Transfer Exit (Move Away) (+9 more)

### Community 41 - "Coordinated Sequences"
Cohesion: 0.11
Nodes (17): Accordion, Choreography Rules, Coordinated Sequences, Counter-Motion, Dashboard Widgets, Drag and Drop, Grid Cards, Group Rules (+9 more)

### Community 42 - "3.4 Full"
Cohesion: 0.11
Nodes (17): 1. Command dispatch, 2. Common verification rules, 3.1 Quick, 3.2 Integration, 3.3 Browser UI, 3.4 Full, 3. Profile definitions, 4. Module-aware test selection (+9 more)

### Community 43 - "import-fixture.ts"
Cohesion: 0.14
Nodes (15): @prisma/client, @prisma/client, ALLOWED_CAPABILITIES, ALLOWED_CONTEXT_TYPES, ALLOWED_ROLES, fixturesDocumentSchema, importFixture(), ROLE_POLICIES (+7 more)

### Community 44 - "authentication.module.ts"
Cohesion: 0.19
Nodes (10): configSchema, validateConfig(), DatabaseClient, DatabaseModule, Injectable, Module, AccessControlModule, Module (+2 more)

### Community 45 - "Archon Configuration Guide"
Cohesion: 0.12
Nodes (16): Archon Configuration Guide, Environment Variable Overrides, For Global Config (~/.archon/config.yaml), For Repo Config (<repo>/.archon/config.yaml), Global Config (~/.archon/config.yaml), Global Config Options, Precedence Order (highest wins), Reference: All Configuration Options (+8 more)

### Community 46 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint-config-next, devDependencies, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+9 more)

### Community 47 - "dependencies"
Cohesion: 0.12
Nodes (17): @nestjs/common, @nestjs/core, @nestjs/platform-express, pg, @prisma/adapter-pg, reflect-metadata, rxjs, dependencies (+9 more)

### Community 48 - "Choreography"
Cohesion: 0.12
Nodes (15): 1. Lead with the Hero, 2. Spatial Origin Consistency, 3. Counter-Motion, Attention Direction, Choreography, Common Recipes, Coordinated Entry Rules, Dashboard Load (+7 more)

### Community 50 - "Frontend API Contract Guide"
Cohesion: 0.12
Nodes (15): Anti-patterns, Authentication and Session, Authorization Context, Caching, Contract Rules, Error Contract, Frontend API Contract Guide, Generated Contracts (+7 more)

### Community 51 - "Design System: Taste Standard"
Cohesion: 0.13
Nodes (14): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Hero Section, 6. Layout Principles, 7. Responsive Rules, 8. Motion & Interaction (Code-Phase Intent) (+6 more)

### Community 52 - "devDependencies"
Cohesion: 0.13
Nodes (15): eslint-config-prettier, @eslint/eslintrc, @nestjs/cli, devDependencies, eslint-config-prettier, @eslint/eslintrc, @nestjs/cli, source-map-support (+7 more)

### Community 53 - "Control"
Cohesion: 0.14
Nodes (13): `archon workflow abandon <run-id> [--json]`, `archon workflow approve <run-id> [comment] [--json]`, `archon workflow get <run-id> [--verbose] [--json]`, `archon workflow reject <run-id> [reason] [--json]`, `archon workflow resume <run-id> [--json]`, `archon workflow run <workflow> "<message>" --detach [--json]`, `archon workflow runs [--all] [--status <s>] [--limit <n>] [--json]`, `archon workflow status [--verbose] [--json]` (+5 more)

### Community 54 - "Disney's 12 Principles — UI Adapted"
Cohesion: 0.14
Nodes (14): 10. Exaggeration, 11. Solid Drawing, 12. Appeal, 1. Squash and Stretch, 2. Anticipation, 3. Staging, 4. Straight Ahead vs. Pose to Pose, 5. Follow Through and Overlapping Action (+6 more)

### Community 55 - "docs/README.md"
Cohesion: 0.14
Nodes (7): Module 1 API Contract Policy, Module 1 RBAC Architecture, Product access classes, Documentation Index, Frontend Architecture, Backend Architecture, Backend Module Guide

### Community 56 - "PublicHome.tsx"
Cohesion: 0.20
Nodes (11): auth, authResource, CurrentUser, json(), useLogout(), json(), HERO_DYNAMIC_PHRASES, HERO_STATIC_TITLE (+3 more)

### Community 57 - "authoring-commands.md"
Cohesion: 0.15
Nodes (12): Anti-Patterns, Artifact Conventions, Complex Command Example, Discovery and Priority, File Format, File Location, Frontmatter Fields, Name Validation Rules (+4 more)

### Community 58 - "Workflow Authoring"
Cohesion: 0.15
Nodes (12): Complete Example, Dependencies and Parallel Execution, Node Base Fields, Node Output Substitution, Per-Node Provider and Model, Resume on Failure, Schema, Structured Output (`output_format`) (+4 more)

### Community 59 - "Ambient & Continuous Patterns"
Cohesion: 0.15
Nodes (12): Ambient & Continuous Patterns, Breathing / Pulse, Combining Ambient Layers, Continuous Rotation, Dust/Motes: 5-10 elements, 10-30px/s mixed, 2-5px, 20-50% opacity, Floating / Hovering, Gradient Shift, Parallax (+4 more)

### Community 60 - "jest"
Cohesion: 0.15
Nodes (13): js, json, **/*.(t|j)s, ts, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions (+5 more)

### Community 61 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 62 - "Approval Nodes"
Cohesion: 0.18
Nodes (12): Approval Nodes, Approve and Reject Commands, Body Semantics, Cancel Nodes, Configuration, Fields, Loop Group Nodes, Typical Patterns (+4 more)

### Community 63 - "4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)"
Cohesion: 0.17
Nodes (12): 4.10 Quotes & Testimonials, 4.11 Page Theme Lock (Light / Dark Mode Consistency), 4.1 Typography, 4.2 Color Calibration, 4.3 Layout Diversification, 4.4 Materiality, Shadows, Cards, 4.5 Interactive UI States, 4.6 Data & Form Patterns (+4 more)

### Community 64 - "4-Level Decision Hierarchy"
Cohesion: 0.17
Nodes (12): 1. Purpose?, 2. Audience?, 3. Context?, 4-Level Decision Hierarchy, Decision Framework, Decision Quick-Path, Evaluation Before Delivery, Level 1: Motion Category (+4 more)

### Community 65 - "Four Archetypes"
Cohesion: 0.17
Nodes (12): 1. Signature Easing (80% of animations), 2. Duration Palette, 3. Entrance Pattern, Brand Motion Identity, Corporate / Professional, Energetic / Dynamic, Four Archetypes, Keyword Matching (+4 more)

### Community 66 - "Timing & Easing Tables"
Cohesion: 0.17
Nodes (12): Distance-Duration Scaling, Duration by Element Type, Duration by Personality, Easing: Directional Rules, Easing: Industry Standards, Enter vs. Exit, Interactive Feedback, Material-Based Easing (+4 more)

### Community 67 - "Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network"
Cohesion: 0.18
Nodes (10): Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network, AGY / Ponytail execution policy, Browser Verification Policy (On-Demand / Proposal-First), Default UI scope, Execution rules, Local test accounts, Mandatory pre-code gate, Mandatory UI/UX quality routing (+2 more)

### Community 68 - "GitHub Webhook Setup Guide"
Cohesion: 0.18
Nodes (10): 0. Check Existing .env Values, 1. Set Up a Public URL (ngrok), 2. Start ngrok, 3. Generate a Webhook Secret, 4. Collect GitHub Token and Username, 5. Write to `.env`, 6. Configure the Repository Webhook, 7. Verify the Webhook (+2 more)

### Community 69 - "Protocol: Running Interactive Workflows"
Cohesion: 0.18
Nodes (10): 1. Invoke the workflow, 2. Monitor for pause, 3. Fetch and relay the output — BE TRANSPARENT, 4. Collect user response and resume, 5. Repeat until workflow completes, Approval Commands, Identifying Interactive Workflows, Key Behavior Rules (+2 more)

### Community 70 - "Manage Archon Runs"
Cohesion: 0.18
Nodes (10): Approve or reject a paused run (two steps), How output works, Interactive-loop gates: no comment = accept & complete, Manage Archon Runs, Monitor a run to completion, Patterns, Recent runs (live), Reference (+2 more)

### Community 71 - "Context Adaptation"
Cohesion: 0.18
Nodes (10): Accessibility, Cognitive Accessibility, Content Type Adaptation, Context Adaptation, Dark Mode, Performance Budgets, Platform Scaling, prefers-reduced-motion (+2 more)

### Community 72 - "Narrative Structure"
Cohesion: 0.18
Nodes (10): Act 1: Anticipation (10-20%), Act 2: Action (30-50%), Act 3: Reaction (10-20%), Act 4: Resolution (20-30%), By Personality, Common Patterns, Four-Act Structure, Multi-Beat Narratives (+2 more)

### Community 73 - "Quality Checklist"
Cohesion: 0.18
Nodes (10): Accessibility Quality, CRITICAL, Emotional Quality, HIGH, MEDIUM, Performance Quality, Quality Checklist, Severity Tiers (+2 more)

### Community 74 - "Troubleshooting"
Cohesion: 0.18
Nodes (11): Feels Cheap / Flat, Feels Too Fast / Jarring, Feels Too Slow, Inconsistent Feel, Looks Robotic, No Personality, Performance (Dropped Frames), Personality Mistakes (+3 more)

### Community 75 - "workspace-registry.ts"
Cohesion: 0.27
Nodes (9): filterNavSections(), hasCapability(), resolveUserPersonas(), WORKSPACE_MEMBER_CAPABILITIES, WORKSPACE_NAV_REGISTRY, WORKSPACE_PERSONAS, WorkspaceNavEntry, WorkspaceNavSection (+1 more)

### Community 76 - "Initializing Archon in a Repository"
Cohesion: 0.20
Nodes (9): Directory Structure, .gitignore Considerations, Global Configuration, How Bundled Defaults Work, Initializing Archon in a Repository, Minimal config.yaml, Per-Project Env Injection, Three-Path Env Model (+1 more)

### Community 77 - "10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)"
Cohesion: 0.20
Nodes (10): 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know), Animation Library Choice, Cards & Containers, Galleries & Media, Hero Paradigms, Layout & Grids, Micro-Interactions & Effects, Navigation & Menus (+2 more)

### Community 78 - "tasteskill: Anti-Slop Frontend Skill"
Cohesion: 0.20
Nodes (10): 13. OUT OF SCOPE, 14. FINAL PRE-FLIGHT CHECK, 1.A Dial Inference (design read → dial values), 1.B Use-Case Presets, 1.C How the Dials Drive Output, 1. THE THREE DIALS (Core Configuration), 2.A When to reach for a real design system (use official packages), 2.B When the brief is an aesthetic, not a system (+2 more)

### Community 79 - "Frontend Runtime and UI Guide"
Cohesion: 0.20
Nodes (10): Component Ownership, Frontend Runtime and UI Guide, Loading, Error, and Standard UI States `[DESIGN]`, Multilingual Support & AI Translation `[SOURCE]`, Purpose, Realtime, Server and Client Components, State Ownership (+2 more)

### Community 80 - "GuestKnowledgeV2.tsx"
Cohesion: 0.27
Nodes (7): COPY, GuestKnowledgeV2(), TYPE_LABELS, DEMO_KNOWLEDGE_RESOURCES, getKnowledgeResourceById(), KnowledgeResource, KnowledgeType

### Community 81 - "style.md"
Cohesion: 0.20
Nodes (9): BlurText Component, Custom SVG Icons (no external icon library needed for these), Dependencies, FadingVideo Component, Fonts (Google Fonts), Key Design Principles, Liquid Glass CSS (in index.css), Section 1: Hero (+1 more)

### Community 82 - "Command Name"
Cohesion: 0.22
Nodes (8): Command Name, PHASE_1_CHECKPOINT, Phase 1: LOAD, PHASE_2_CHECKPOINT, Phase 2: EXECUTE, PHASE_3_CHECKPOINT, Phase 3: GENERATE, Phase 4: REPORT

### Community 83 - "Parameter Matrix (Quick Reference)"
Cohesion: 0.22
Nodes (8): Cross-References to Detailed Guides, Inline `agents:` (Task-tool sub-agents), Master Matrix: Parameters × Node Types, Parameter Matrix (Quick Reference), Parameter Selection by Intent, Providers at a Glance, Silent Failures (what gets ignored without erroring), Ten Principles for Safe Workflow Design

### Community 84 - "Variable Substitution Reference"
Cohesion: 0.22
Nodes (8): Context Auto-Append, Escaped Dollar Signs, Node Output Details (DAG Only), NOT Supported: `$1` … `$9` Positional Arguments, Substitution Order, Variable Substitution Reference, Variable Table, Where Variables Are Substituted

### Community 85 - "Core Philosophy"
Cohesion: 0.22
Nodes (8): Core Philosophy, Pillar 1: Emotional Intent, Pillar 2: Visual Narrative, Pillar 3: Motion Craft, The 1/3 Screen Rule, The Attention Budget, Three Motion Layers, Three Pillars

### Community 86 - "Russia-Vietnam Science-Technology Intelligence Network Global Rules (Authoritative)"
Cohesion: 0.22
Nodes (8): 1. Security & Authentication Boundaries, 2. Data Ownership & Module Boundaries, 3. Package & Dependency Governance, 4. API & Resource Design, 5. Working Tree & Scope Constraints, 6. Verification Request Dispatch & Browser Testing Policy, 7. UI Quality & Impeccable Gate, Russia-Vietnam Science-Technology Intelligence Network Global Rules (Authoritative)

### Community 87 - "Product"
Cohesion: 0.22
Nodes (8): Audience, Constraints, Core mechanism, Design success, Identity, Implemented surfaces, Product, Product truth

### Community 88 - "Ponytail"
Cohesion: 0.22
Nodes (8): Boundaries, Intensity, Output, Persistence, Ponytail, Rules, The ladder, When NOT to be lazy

### Community 89 - "dev-actor-session-bridge.js"
Cohesion: 0.22
Nodes (7): account, accounts, env, fs, http, inventory, server

### Community 90 - "Primitives"
Cohesion: 0.25
Nodes (7): Color, Elevation, Motion, Primitives, Shape, Spacing, Typography

### Community 91 - "9. AI TELLS (Forbidden Patterns)"
Cohesion: 0.25
Nodes (8): 9.A Visual & CSS, 9. AI TELLS (Forbidden Patterns), 9.B Typography, 9.C Layout & Spacing, 9.D Content & Data ("Jane Doe" Effect), 9.E External Resources & Components, 9.F Production-Test Tells (banned outright), 9.G EM-DASH BAN (the single most-violated Tell)

### Community 92 - "Emotion-to-Motion Mapping"
Cohesion: 0.25
Nodes (7): Color Psychology, Color Transition Rules, Context-Based Emotion Defaults, Core Table, Emotion-to-Motion Mapping, Emotional Intensity, Path as Emotional Language

### Community 93 - "Property Selection"
Cohesion: 0.25
Nodes (8): Color, Combined Properties, Opacity, Performance, Position, Property Selection, Rotation, Scale

### Community 94 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): beVietnamPro, metadata, sans, serif, QueryProvider()

### Community 95 - "frontend/DESIGN.md"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 96 - "Frontend Rules"
Cohesion: 0.25
Nodes (7): Before code, Boundaries, Completion, Frontend Rules, Server state, State, UI Quality & Impeccable Gate

### Community 97 - "Backend Modular Monolith Rules"
Cohesion: 0.25
Nodes (7): Backend Modular Monolith Rules, Before code, Boundaries, Contracts and events, Data, Testing and completion, Trust boundaries

### Community 98 - "vnru-full-modules-prototype-v3/assets/app.js"
Cohesion: 0.43
Nodes (6): esc(), openDrawer(), openFlow(), openModal(), openPalette(), toast()

### Community 99 - "CLI Setup Guide"
Cohesion: 0.29
Nodes (6): 1. Install Dependencies, 2. Link the CLI Globally, 3. Verify Installation, 4. Authenticate Claude, CLI Setup Guide, Notes

### Community 100 - "Node Types (Mutually Exclusive)"
Cohesion: 0.29
Nodes (7): Bash Node, Command Node, Loop Group Node, Loop Node, Node Types (Mutually Exclusive), Prompt Node, Script Node

### Community 101 - "Loop Nodes"
Cohesion: 0.29
Nodes (7): Completion Detection, Interactive Loops, Loop Nodes, Loop Output, Patterns, Session Patterns, What Works / Does NOT Work on Loop Nodes

### Community 102 - "VN–RU Portal Design DNA"
Cohesion: 0.29
Nodes (6): Inventory, Non-negotiable readability gate, Product mental model, Sources of truth, Visual direction, VN–RU Portal Design DNA

### Community 103 - "Scales"
Cohesion: 0.29
Nodes (6): Color modes, Density, Grid, Responsive, Scales, Stability

### Community 104 - "Design DNA"
Cohesion: 0.29
Nodes (6): Design DNA, Natural-language operations, Output, Required workflow, Source order, Trigger

### Community 105 - "11. REDESIGN PROTOCOL"
Cohesion: 0.29
Nodes (7): 11.A Detect the Mode (first action), 11.B Audit Before Touching, 11.C Preservation Rules, 11.D Modernisation Levers (priority order), 11.E Decision Tree: Targeted Evolution vs Full Redesign, 11.F What Never Changes Silently, 11. REDESIGN PROTOCOL

### Community 106 - "3. DEFAULT ARCHITECTURE & CONVENTIONS"
Cohesion: 0.29
Nodes (7): 3.A Stack, 3.B State, 3.C Icons, 3.D Emoji Policy, 3. DEFAULT ARCHITECTURE & CONVENTIONS, 3.E Responsiveness & Layout Mechanics, 3.F Dependency Verification (mandatory)

### Community 107 - "6. PERFORMANCE & ACCESSIBILITY GUARDRAILS"
Cohesion: 0.29
Nodes (7): 6.A Hardware Acceleration, 6.B Reduced Motion (mandatory), 6.C Dark Mode (mandatory for any consumer-facing page), 6.D Core Web Vitals Targets, 6.E DOM Cost, 6.F Z-Index Restraint, 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS

### Community 109 - "NotFoundClient.tsx"
Cohesion: 0.33
Nodes (3): metadata, Copy, NotFoundClient()

### Community 110 - "promax-actor-preflight.js"
Cohesion: 0.29
Nodes (5): accounts, env, fs, inventory, required

### Community 111 - "auth-service/package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 112 - "Workflow-Level Fields"
Cohesion: 0.33
Nodes (6): Claude SDK Advanced Options, Codex-Specific Options, Complete workflow-level example, Core, Isolation, Workflow-Level Fields

### Community 113 - "Behaviors"
Cohesion: 0.33
Nodes (5): Behaviors, Forms, Interaction, Loading and state, Motion

### Community 114 - "Core Components"
Cohesion: 0.33
Nodes (5): Buttons and inputs, Cards, Core Components, Navigation, Tables and status

### Community 115 - "Surface Patterns"
Cohesion: 0.33
Nodes (5): Authentication, Operational workspace, Public/marketing, Responsive, Surface Patterns

### Community 117 - "Query Resource Guide"
Cohesion: 0.33
Nodes (5): Before coding, Minimal pattern, Query Resource Guide, Required practices, Rule

### Community 118 - "opportunities.ts"
Cohesion: 0.40
Nodes (4): DEMO_OPPORTUNITIES, DetailedOpportunity, getOpportunityById(), Opportunity

### Community 119 - "Task: Rebranding & Identity Customization"
Cohesion: 0.33
Nodes (5): Step 1 — Gather Branding Inputs, Step 2 — Confirm Summary Before Applying, Step 3 — Apply Targeted Updates, Step 4 — Verify, Task: Rebranding & Identity Customization

### Community 120 - "Task: Add a New Workspace / Portal Page"
Cohesion: 0.33
Nodes (5): Step 0 — Gather Inputs, Step 1 — Create `page.tsx`, Step 2 — Wire into `Sidebar.tsx`, Step 3 — Verify, Task: Add a New Workspace / Portal Page

### Community 121 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 122 - "Conditions (`when:`)"
Cohesion: 0.40
Nodes (5): Compound Expressions, Conditions (`when:`), Dot Notation (JSON Field Access) — Strict Semantics, Error Modes: Skip vs Fail, Operators

### Community 123 - "Semantics"
Cohesion: 0.40
Nodes (4): Color, Semantics, Spacing and elevation, Typography

### Community 124 - "0. BRIEF INFERENCE (Read the Room Before Anything Else)"
Cohesion: 0.40
Nodes (5): 0.A Read these signals first, 0.B Output a one-line "Design Read" before generating, 0. BRIEF INFERENCE (Read the Room Before Anything Else), 0.C If the brief is ambiguous, ask one question, do not guess, 0.D Anti-Default Discipline

### Community 125 - "12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)"
Cohesion: 0.40
Nodes (5): 12.A File Location, 12.B Required Frontmatter, 12.C Required Body Sections, 12.D Block-Library Discipline, 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)

### Community 126 - "5. CONTEXT-AWARE PROACTIVITY"
Cohesion: 0.40
Nodes (5): 5.A Sticky-Stack - Canonical Skeleton, 5.B Horizontal-Pan - Canonical Skeleton, 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative), 5. CONTEXT-AWARE PROACTIVITY, 5.D Forbidden Animation Patterns

### Community 127 - "8. DARK MODE PROTOCOL"
Cohesion: 0.40
Nodes (5): 8.A Token Strategy (pick one, stick to it), 8.B Do Not Prescribe Specific Colors Here, 8.C Default Mode, 8.D Test in Both Modes Before Finishing, 8. DARK MODE PROTOCOL

### Community 128 - "React Aria Components & TailGrids Primitives in VN-RU Portal"
Cohesion: 0.40
Nodes (4): Available Primitives, Overview, React Aria Components & TailGrids Primitives in VN-RU Portal, Rules

### Community 129 - "System Architecture"
Cohesion: 0.40
Nodes (4): Canonical routes, Current scope, Runtime ownership, System Architecture

### Community 130 - "VN–RU Network Portal"
Cohesion: 0.40
Nodes (4): Development, Documentation, Kept runtime, VN–RU Network Portal

### Community 131 - "7. DIAL DEFINITIONS (Technical Reference)"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

### Community 132 - "Portal Foundation Decisions"
Cohesion: 0.50
Nodes (3): Access model, Current product boundary, Portal Foundation Decisions

### Community 133 - "Synthetic IAM Workflow Fixtures"
Cohesion: 0.50
Nodes (3): Critical notice, Synthetic IAM Workflow Fixtures, Usage

### Community 136 - "eslint"
Cohesion: 0.67
Nodes (3): eslint, eslint, eslint

## Knowledge Gaps
- **1226 isolated node(s):** `eslintConfig`, `config`, `target`, `dom`, `dom.iterable` (+1221 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **38 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale` connect `useLocale` to `server.ts`, `RolePermissionsPage.tsx`, `Locale`, `SidebarFrame.tsx`, `NotFoundClient.tsx`, `GuestExploreV2.tsx`, `GuestKnowledgeV2.tsx`, `locale.ts`, `PublicDiscoveryPages.tsx`, `PublicHome.tsx`, `GuestNewsArticleV2.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `SidebarFrame.tsx`, `locale.ts`, `GuestNewsArticleV2.tsx`, `useLocale`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `Troubleshooting` connect `Troubleshooting` to `motion-design/SKILL.md`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `config`, `target` to the rest of the system?**
  _1226 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `server.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05721168322794339 - nodes in this community are weakly interconnected._
- **Should `RolePermissionsPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056692242114237 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06826241134751773 - nodes in this community are weakly interconnected._