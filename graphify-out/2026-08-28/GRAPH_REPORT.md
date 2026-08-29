# Graph Report - vnru-network  (2026-08-28)

## Corpus Check
- 333 files · ~996,274 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2395 nodes · 3311 edges · 219 communities (185 shown, 34 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `87c1c758`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- authServiceUrl
- RolePermissionsPage.tsx
- iam-admin.service.ts
- dependencies
- Auth Service Specification — Module 1
- compilerOptions
- MembershipApplicationService
- UI Quality Pro-Max — VN-RU Portal
- VN–RU Public Discovery UI Guide
- High-Agency Frontend Skill
- GuestExploreV2.tsx
- Discord Bot Setup Guide
- Workflow Commands
- Hooks
- MOCK_DATA_AGENT_GUIDE.md
- Locale
- useLocale
- news.controller.ts
- AuthenticatedRequest
- access-control.service.ts
- Archon Setup Wizard
- Anti-Patterns
- compilerOptions
- Archon CLI Skill
- Appendix B - Canonical Sources (read these before reinventing)
- Motion Design Skill
- GuestEcosystemV2.tsx
- State & Feedback Patterns
- Design Audit
- VN–RU Full Modules Prototype V3 — ROLE / FLOW UI GUIDE
- Analysis & Synthesis Instructions
- WorkspaceSidebar.tsx
- cn
- Common Failure Modes
- Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)
- Common Recipes
- Coordinated Sequences
- 3.4 Full
- WorkspaceShell.tsx
- seed-demo.ts
- Archon Configuration Guide
- devDependencies
- dependencies
- Choreography
- SessionService
- SidebarIcons.tsx
- server.ts
- Frontend API Contract Guide
- Design System: Taste Standard
- devDependencies
- GuestNewsArticleV2.tsx
- AdminNewsStudio.tsx
- Control
- Disney's 12 Principles — UI Adapted
- GUIDES.md
- Authoring Command Files
- Workflow Authoring
- Ambient & Continuous Patterns
- jest
- scripts
- IamAdminController
- Approval Nodes
- 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)
- 4-Level Decision Hierarchy
- Four Archetypes
- Timing & Easing Tables
- SidebarFrame.tsx
- Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network
- GitHub Webhook Setup Guide
- Interactive Workflow Guide
- Manage Archon Runs
- Context Adaptation
- Narrative Structure
- Quality Checklist
- Troubleshooting
- app.module.ts
- workspace-server.ts
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
- Header.tsx
- table.tsx
- Product
- Ponytail
- Primitives
- 9. AI TELLS (Forbidden Patterns)
- Emotion-to-Motion Mapping
- motion-design/SKILL.md
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
- authentication.service.ts
- GuestHomeV2.tsx
- auth-service/package.json
- Workflow-Level Fields
- Behaviors
- Core Components
- Surface Patterns
- Query Resource Guide
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
- GuestAboutV2.tsx
- docs/README.md
- register/page.tsx
- RoleListPage.tsx
- Portal Foundation Decisions
- Synthetic IAM Workflow Fixtures
- deploy.sh
- This is NOT the Next.js you know
- authenticated-request-context.ts
- rules/graphify.md
- impeccable.md
- principles.md
- workflows/graphify.md
- app/news/page.tsx
- frontend/package.json
- UserAdministration.tsx
- ProfileDialog.tsx
- exclude
- frontend/eslint.config.mjs
- home-i18n.test.mjs
- next.config.ts
- postcss.config.mjs
- frontend/README.md
- copilot-instructions.md
- VN-RU Monorepo Rules
- import-fixture.ts
- VN-RU Monorepo Architecture
- auth.ts
- Cancel Nodes
- VN-RU Module Map
- services/AGENTS.md
- VN-RU Architecture Hub
- Loop Group Nodes
- NotFoundClient.tsx
- iam-admin.controller.ts
- identity.module.ts
- AccessLogsPage.tsx
- .getCurrentUser
- vnru-full-modules-prototype-v3/README.md
- SCREEN_OWNERSHIP_MATRIX.md
- deploy-script.test.sh
- { GET, POST }
- 1. THE THREE DIALS (Core Configuration)
- i18next
- mfa/route.ts
- next-auth
- react-aria-components
- react-dom
- react-i18next
- @designcodeio/threeui
- workflow-fixture.spec.ts
- react
- tailwind-merge
- three
- zustand
- profile/route.ts
- badge.tsx
- motion

## God Nodes (most connected - your core abstractions)
1. `useLocale` - 80 edges
2. `cn()` - 47 edges
3. `Locale` - 36 edges
4. `authServiceUrl()` - 36 edges
5. `backendHeaders()` - 31 edges
6. `UI Quality Pro-Max — VN-RU Portal` - 27 edges
7. `compilerOptions` - 22 edges
8. `AuthenticatedRequest` - 20 edges
9. `SessionService` - 19 edges
10. `Workflow Authoring` - 19 edges

## Surprising Connections (you probably didn't know these)
- `RegisterPage()` --calls--> `useLocale`  [EXTRACTED]
  frontend/app/register/page.tsx → frontend/core/i18n/locale.ts
- `PermissionCatalogPage()` --calls--> `useLocale`  [EXTRACTED]
  frontend/features/admin/access/components/PermissionCatalogPage.tsx → frontend/core/i18n/locale.ts
- `ExpertsIndexPage()` --calls--> `useLocale`  [EXTRACTED]
  frontend/features/public-discovery/components/PublicDiscoveryPages.tsx → frontend/core/i18n/locale.ts
- `json()` --calls--> `httpClient()`  [EXTRACTED]
  frontend/features/iam/repository.ts → frontend/lib/httpClient.ts
- `bootstrap()` --indirect_call--> `AppModule`  [INFERRED]
  services/auth-service/src/main.ts → services/auth-service/src/app.module.ts

## Import Cycles
- None detected.

## Communities (219 total, 34 thin omitted)

### Community 0 - "authServiceUrl"
Cohesion: 0.15
Nodes (19): proxy(), POST(), GET(), PATCH(), PATCH(), PATCH(), GET(), POST() (+11 more)

### Community 1 - "RolePermissionsPage.tsx"
Cohesion: 0.13
Nodes (20): PageProps, copy, GrantFilter, isSystemRole(), RoleDetailPage(), RoleDetailPageProps, AttachmentFile, ContentPublishStudio() (+12 more)

### Community 2 - "iam-admin.service.ts"
Cohesion: 0.09
Nodes (32): IamAdminController, paginationSchema, passwordResetSchema, roleAssignmentSchema, rolePermissionsSchema, Body, Controller, Get (+24 more)

### Community 3 - "dependencies"
Cohesion: 0.12
Nodes (17): class-variance-authority, clsx, @dangminhdev04032005/query-resource, dependencies, class-variance-authority, clsx, @dangminhdev04032005/query-resource, next (+9 more)

### Community 4 - "Auth Service Specification — Module 1"
Cohesion: 0.05
Nodes (37): `access-control`, Auth Service — Module 1 Base, Authenticated request, `authentication`, Boundary Rules, Current Base, Current Non-Goals, `identity` (+29 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 6 - "MembershipApplicationService"
Cohesion: 0.17
Nodes (10): MembershipApplicationController, membershipApplicationSchema, Body, Controller, Post, Req, MembershipApplicationPrismaClient, MembershipApplicationService (+2 more)

### Community 7 - "UI Quality Pro-Max — VN-RU Portal"
Cohesion: 0.06
Nodes (32): 10. Spacing, geometry, and visual rhythm, 11. Color, hierarchy, and state styling, 12. Icons and imagery, 13. UX and information architecture, 14. Forms, tables, dialogs, menus, and data-dense surfaces, 15. Async/state completeness, 16. Accessibility baseline, 17. Zoom and content stress (+24 more)

### Community 8 - "VN–RU Public Discovery UI Guide"
Cohesion: 0.06
Nodes (32): 10. 2+2 rule, 11. Interaction integrity, 12. Responsive behavior, 13. Implementation mapping, 14. Acceptance test, 1. Product role, 2. Visual continuity with landing, 3. Typography (+24 more)

### Community 9 - "High-Agency Frontend Skill"
Cohesion: 0.06
Nodes (30): 10. FINAL PRE-FLIGHT CHECK, 1. ACTIVE BASELINE CONFIGURATION, 2. DEFAULT ARCHITECTURE & CONVENTIONS, 3. DESIGN ENGINEERING DIRECTIVES (Bias Correction), 4. CREATIVE PROACTIVITY (Anti-Slop Implementation), 5. PERFORMANCE GUARDRAILS, 6. TECHNICAL REFERENCE (Dial Definitions), 7. AI TELLS (Forbidden Patterns) (+22 more)

### Community 10 - "GuestExploreV2.tsx"
Cohesion: 0.18
Nodes (12): articleId(), CATALOGS, FEATURED, FeedCategory, GuestExploreV2(), ITEMS, LATEST, NewsItem (+4 more)

### Community 11 - "Discord Bot Setup Guide"
Cohesion: 0.07
Nodes (26): 1. Create a Discord Application, 2. Create a Bot, 3. Generate Invite URL, 4. Get Your User ID, 5. Add to `.env` (in the archon repo root), 6. Start the Server, 7. Test, Discord Bot Setup Guide (+18 more)

### Community 12 - "Workflow Commands"
Cohesion: 0.06
Nodes (30): `archon chat <message>`, Archon CLI Command Reference, `archon complete <branch> [flags]`, `archon continue <branch> [flags] [message]`, `archon doctor`, `archon isolation cleanup [days]`, `archon isolation list`, `archon setup [--spawn]` (+22 more)

### Community 13 - "Hooks"
Cohesion: 0.07
Nodes (29): Advanced Features: Hooks, MCP, Skills, Retry, Sessions, Typed Artifacts, Automatic Tool Wildcards, Claude vs Codex: How Each Gets MCP and Skills, Combining Skills with MCP, Common Patterns, Config File Format, Environment Variable Expansion, Error Classification (+21 more)

### Community 15 - "Locale"
Cohesion: 0.13
Nodes (13): FlagProps, LANGUAGE_OPTIONS, LanguageOption, LanguageSwitcher(), LanguageSwitcherProps, LanguageSwitcherVariant, switcherCopy, COPY (+5 more)

### Community 16 - "useLocale"
Cohesion: 0.13
Nodes (17): ExpertDetailPage(), ExpertsIndexPage(), OpportunitiesIndexPage(), OpportunityDetailPage(), UI, EXPERTS, getExpert(), getOpportunity() (+9 more)

### Community 17 - "news.controller.ts"
Cohesion: 0.05
Nodes (43): RequireAnyPermission(), RequireMfa(), RequirePermission(), context(), AdminNewsController, adminQuerySchema, articleFields, createSchema (+35 more)

### Community 18 - "AuthenticatedRequest"
Cohesion: 0.17
Nodes (18): Delete, Res, AuthenticatedRequest, extractSessionCookie(), isRecord(), RequestWithCookies, AuthenticationController, SESSION_COOKIE_OPTIONS (+10 more)

### Community 19 - "access-control.service.ts"
Cohesion: 0.13
Nodes (16): Optional, AccessControlPrismaClient, AccessControlService, PermissionRecord, ResolveCapabilitiesInput, RoleAssignmentRecord, RolePermissionRecord, RoleRecord (+8 more)

### Community 20 - "Archon Setup Wizard"
Cohesion: 0.09
Nodes (22): 4a: Launch the Setup Wizard, 4b: Wait for User Confirmation, 4c: Verify Configuration, 4d: Run Database Migrations (PostgreSQL only), Archon Setup Wizard, Config Files (YAML), Configuration Reference, Context (+14 more)

### Community 21 - "Anti-Patterns"
Cohesion: 0.09
Nodes (22): 1. Use deterministic nodes for deterministic work, 2. Use `output_format` for every node whose output downstream `when:` reads, 3. `trigger_rule: none_failed_min_one_success` after conditional branches, 4. `context: fresh` requires artifacts for state passing, 5. Cheap models for glue, strong models for substance, 6. Write the workflow description for routing, 7. Validate before shipping, 8. Design the artifact chain before writing command files (+14 more)

### Community 22 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 23 - "Archon CLI Skill"
Cohesion: 0.09
Nodes (21): Advanced Features (Command/Prompt Nodes), Archon CLI Skill, Authoring Quick Start, Available Workflows (live), Core Command, Creating a Command File, Example Files, Example Interactions (+13 more)

### Community 24 - "Appendix B - Canonical Sources (read these before reinventing)"
Cohesion: 0.09
Nodes (21): APPENDICES - Real Source-Backed Reference Material, Appendix A - Install Commands per Design System, Appendix B - Canonical Sources (read these before reinventing), Appendix C - Apple Liquid Glass: Honest Web Approximation, Apple Liquid Glass (Apple platforms only), Atlassian, Bootstrap, Carbon (+13 more)

### Community 25 - "Motion Design Skill"
Cohesion: 0.10
Nodes (21): Button Press (Playful), Card Entrance (Premium), Choreography Essentials, Common Patterns, CRITICAL — never break, Duration Table, Easing Selection, Emotion-to-Motion Map (+13 more)

### Community 26 - "GuestEcosystemV2.tsx"
Cohesion: 0.18
Nodes (9): CALLS_DATA, COPY, EXPERTS, GuestEcosystemV2(), PROJECTS, PUBLICATIONS, HOME_COPY, GuestPublicFooter() (+1 more)

### Community 27 - "State & Feedback Patterns"
Cohesion: 0.08
Nodes (23): Button Press, Checkmark Success, Confirmation Badge, Corporate, Disabled / Enabled, Error Shake, Error State, Focus States (+15 more)

### Community 28 - "Design Audit"
Cohesion: 0.10
Nodes (19): Code Quality, Color and Surfaces, Component Patterns, Content, Design Audit, Fix Priority, How This Works, Iconography (+11 more)

### Community 29 - "VN–RU Full Modules Prototype V3 — ROLE / FLOW UI GUIDE"
Cohesion: 0.10
Nodes (19): 1. Canonical demo architecture, 2. Public is physically separated, 3. Authenticated role layouts, 4. Governance is separate, 5. Demo interactions, 6. Interaction ownership, 7. Visual rule, 8. Financial exclusion (+11 more)

### Community 30 - "Analysis & Synthesis Instructions"
Cohesion: 0.11
Nodes (18): 1. Define the Atmosphere, 2. Map the Color Palette, 3. Establish Typography Rules, 4. Define the Hero Section, 5. Describe Component Stylings, 6. Define Layout Principles, 7. Define Responsive Rules, 8. Encode Motion Philosophy (+10 more)

### Community 31 - "WorkspaceSidebar.tsx"
Cohesion: 0.27
Nodes (9): filterNavSections(), hasCapability(), resolveUserPersonas(), WORKSPACE_MEMBER_CAPABILITIES, WORKSPACE_NAV_REGISTRY, WORKSPACE_PERSONAS, WorkspaceNavEntry, WorkspaceNavSection (+1 more)

### Community 32 - "cn"
Cohesion: 0.07
Nodes (40): Badge(), BadgeProps, badgeStyles, Button(), ButtonProps, buttonStyles, Card(), CardAction() (+32 more)

### Community 33 - "Common Failure Modes"
Cohesion: 0.11
Nodes (17): A node was skipped and I don't know why, A workflow-level field seems to have no effect, Approval gate not appearing on web UI, Artifact Locations, "Claude Code not found" / "Codex CLI binary not found", Common Failure Modes, Escalation: when nothing makes sense, Log Locations (+9 more)

### Community 34 - "Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)"
Cohesion: 0.11
Nodes (17): 1. Meta Information & Core Directive, 2. THE "ABSOLUTE ZERO" DIRECTIVE (STRICT ANTI-PATTERNS), 3. THE CREATIVE VARIANCE ENGINE, 4. HAPTIC MICRO-AESTHETICS (COMPONENT MASTERY), 5. MOTION CHOREOGRAPHY (FLUID DYNAMICS), 6. PERFORMANCE GUARDRAILS, 7. EXECUTION PROTOCOL, 8. PRE-OUTPUT CHECKLIST (+9 more)

### Community 35 - "Common Recipes"
Cohesion: 0.11
Nodes (17): 1. Direct Entrance (Slide In), 1. Direct Exit (Slide Out), 2. Dissolve Exit (Fade Out), 2. Emergent Entrance (Scale In), 3. Collapse Exit (Shrink Out), 3. Reveal Entrance (Clip/Mask), 4. Assembled Entrance (Multi-Part), 4. Transfer Exit (Move Away) (+9 more)

### Community 36 - "Coordinated Sequences"
Cohesion: 0.11
Nodes (17): Accordion, Choreography Rules, Coordinated Sequences, Counter-Motion, Dashboard Widgets, Drag and Drop, Grid Cards, Group Rules (+9 more)

### Community 37 - "3.4 Full"
Cohesion: 0.11
Nodes (17): 1. Command dispatch, 2. Common verification rules, 3.1 Quick, 3.2 Integration, 3.3 Browser UI, 3.4 Full, 3. Profile definitions, 4. Module-aware test selection (+9 more)

### Community 38 - "WorkspaceShell.tsx"
Cohesion: 0.10
Nodes (19): NavSection, shellCopy, WorkspaceShell(), SheetContent(), SheetContentProps, SheetOverlay(), SheetOverlayProps, SheetProps (+11 more)

### Community 39 - "seed-demo.ts"
Cohesion: 0.24
Nodes (10): @prisma/client, @prisma/client, importFixture(), accountsSchema, bindings, customRoles, legacyRoleNames, main() (+2 more)

### Community 40 - "Archon Configuration Guide"
Cohesion: 0.12
Nodes (16): Archon Configuration Guide, Environment Variable Overrides, For Global Config (~/.archon/config.yaml), For Repo Config (<repo>/.archon/config.yaml), Global Config (~/.archon/config.yaml), Global Config Options, Precedence Order (highest wins), Reference: All Configuration Options (+8 more)

### Community 41 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+9 more)

### Community 42 - "dependencies"
Cohesion: 0.11
Nodes (19): nestjs-cloudinary, @nestjs/common, @nestjs/core, @nestjs/platform-express, pg, @prisma/adapter-pg, reflect-metadata, rxjs (+11 more)

### Community 43 - "Choreography"
Cohesion: 0.12
Nodes (15): 1. Lead with the Hero, 2. Spatial Origin Consistency, 3. Counter-Motion, Attention Direction, Choreography, Common Recipes, Coordinated Entry Rules, Dashboard Load (+7 more)

### Community 44 - "SessionService"
Cohesion: 0.09
Nodes (6): AuthenticatedRequestGuard, Injectable, AuthenticationService, Injectable, SessionService, Injectable

### Community 46 - "server.ts"
Cohesion: 0.19
Nodes (11): GET(), POST(), copy, LoginPage(), PasswordField(), PasswordFieldProps, isSameOriginRequest(), isSystemAdministrator() (+3 more)

### Community 47 - "Frontend API Contract Guide"
Cohesion: 0.13
Nodes (15): Anti-patterns, Authentication and Session, Authorization Context, Caching, Contract Rules, Error Contract, Frontend API Contract Guide, Generated Contracts (+7 more)

### Community 48 - "Design System: Taste Standard"
Cohesion: 0.13
Nodes (14): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Hero Section, 6. Layout Principles, 7. Responsive Rules, 8. Motion & Interaction (Code-Phase Intent) (+6 more)

### Community 49 - "devDependencies"
Cohesion: 0.04
Nodes (49): eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, globals, jest, @nestjs/cli, @nestjs/schematics (+41 more)

### Community 50 - "GuestNewsArticleV2.tsx"
Cohesion: 0.14
Nodes (11): Page(), PageProps, VALID_IDS, ArticleRecord, articles, Category, categoryLabels, filterCopy (+3 more)

### Community 51 - "AdminNewsStudio.tsx"
Cohesion: 0.22
Nodes (12): AdminNewsStudio(), empty(), initial, locales, news, NewsArticle, NewsInput, NewsLocale (+4 more)

### Community 52 - "Control"
Cohesion: 0.14
Nodes (13): `archon workflow abandon <run-id> [--json]`, `archon workflow approve <run-id> [comment] [--json]`, `archon workflow get <run-id> [--verbose] [--json]`, `archon workflow reject <run-id> [reason] [--json]`, `archon workflow resume <run-id> [--json]`, `archon workflow run <workflow> "<message>" --detach [--json]`, `archon workflow runs [--all] [--status <s>] [--limit <n>] [--json]`, `archon workflow status [--verbose] [--json]` (+5 more)

### Community 53 - "Disney's 12 Principles — UI Adapted"
Cohesion: 0.14
Nodes (14): 10. Exaggeration, 11. Solid Drawing, 12. Appeal, 1. Squash and Stretch, 2. Anticipation, 3. Staging, 4. Straight Ahead vs. Pose to Pose, 5. Follow Through and Overlapping Action (+6 more)

### Community 54 - "GUIDES.md"
Cohesion: 0.09
Nodes (12): Task Guide Router, Module 1 API Contract Policy, Deployment and Local Operation, Module 1 RBAC Architecture, Product access classes, Frontend Architecture, Frontend Module Guide, Archived Pre-Test Prompt (+4 more)

### Community 55 - "Authoring Command Files"
Cohesion: 0.14
Nodes (13): Anti-Patterns, Artifact Conventions, Authoring Command Files, Complex Command Example, Discovery and Priority, File Format, File Location, Frontmatter Fields (+5 more)

### Community 56 - "Workflow Authoring"
Cohesion: 0.15
Nodes (12): Complete Example, Dependencies and Parallel Execution, Node Base Fields, Node Output Substitution, Per-Node Provider and Model, Resume on Failure, Schema, Structured Output (`output_format`) (+4 more)

### Community 57 - "Ambient & Continuous Patterns"
Cohesion: 0.15
Nodes (12): Ambient & Continuous Patterns, Breathing / Pulse, Combining Ambient Layers, Continuous Rotation, Dust/Motes: 5-10 elements, 10-30px/s mixed, 2-5px, 20-50% opacity, Floating / Hovering, Gradient Shift, Parallax (+4 more)

### Community 58 - "jest"
Cohesion: 0.15
Nodes (13): js, json, **/*.(t|j)s, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir (+5 more)

### Community 59 - "scripts"
Cohesion: 0.15
Nodes (13): scripts, build, format, lint, start, start:debug, start:dev, start:prod (+5 more)

### Community 60 - "IamAdminController"
Cohesion: 0.15
Nodes (13): AccessOverviewDashboard(), copy, quickActions, copy, groupLabels, isSystemRole(), permissionLabels, RolePermissionsPage() (+5 more)

### Community 61 - "Approval Nodes"
Cohesion: 0.33
Nodes (6): Approval Nodes, Approve and Reject Commands, Configuration, Fields, Web UI Requirement, What Does NOT Work on Approval Nodes

### Community 62 - "4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)"
Cohesion: 0.17
Nodes (12): 4.10 Quotes & Testimonials, 4.11 Page Theme Lock (Light / Dark Mode Consistency), 4.1 Typography, 4.2 Color Calibration, 4.3 Layout Diversification, 4.4 Materiality, Shadows, Cards, 4.5 Interactive UI States, 4.6 Data & Form Patterns (+4 more)

### Community 63 - "4-Level Decision Hierarchy"
Cohesion: 0.17
Nodes (12): 1. Purpose?, 2. Audience?, 3. Context?, 4-Level Decision Hierarchy, Decision Framework, Decision Quick-Path, Evaluation Before Delivery, Level 1: Motion Category (+4 more)

### Community 64 - "Four Archetypes"
Cohesion: 0.17
Nodes (12): 1. Signature Easing (80% of animations), 2. Duration Palette, 3. Entrance Pattern, Brand Motion Identity, Corporate / Professional, Energetic / Dynamic, Four Archetypes, Keyword Matching (+4 more)

### Community 65 - "Timing & Easing Tables"
Cohesion: 0.17
Nodes (12): Distance-Duration Scaling, Duration by Element Type, Duration by Personality, Easing: Directional Rules, Easing: Industry Standards, Enter vs. Exit, Interactive Feedback, Material-Based Easing (+4 more)

### Community 66 - "SidebarFrame.tsx"
Cohesion: 0.12
Nodes (16): copy, RegisterPage(), createRegistrationSchema(), isRegistrationField(), RegistrationField, RegistrationValidationCopy, BrandMark(), BrandMarkProps (+8 more)

### Community 67 - "Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network"
Cohesion: 0.20
Nodes (10): Agent Instructions — Russia-Vietnam Science-Technology Intelligence Network, AGY / Ponytail execution policy, Browser Verification Policy (On-Demand / Proposal-First), Default UI scope, Execution rules, Local test accounts, Mandatory pre-code gate, Mandatory UI/UX quality routing (+2 more)

### Community 68 - "GitHub Webhook Setup Guide"
Cohesion: 0.18
Nodes (10): 0. Check Existing .env Values, 1. Set Up a Public URL (ngrok), 2. Start ngrok, 3. Generate a Webhook Secret, 4. Collect GitHub Token and Username, 5. Write to `.env`, 6. Configure the Repository Webhook, 7. Verify the Webhook (+2 more)

### Community 69 - "Interactive Workflow Guide"
Cohesion: 0.17
Nodes (11): 1. Invoke the workflow, 2. Monitor for pause, 3. Fetch and relay the output — BE TRANSPARENT, 4. Collect user response and resume, 5. Repeat until workflow completes, Approval Commands, Identifying Interactive Workflows, Interactive Workflow Guide (+3 more)

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

### Community 75 - "app.module.ts"
Cohesion: 0.18
Nodes (10): AppController, Controller, Get, AppModule, Module, AppService, Injectable, bootstrap() (+2 more)

### Community 76 - "workspace-server.ts"
Cohesion: 0.12
Nodes (18): metadata, Page(), metadata, Page(), metadata, Page(), metadata, Page() (+10 more)

### Community 77 - "Initializing Archon in a Repository"
Cohesion: 0.20
Nodes (9): Directory Structure, .gitignore Considerations, Global Configuration, How Bundled Defaults Work, Initializing Archon in a Repository, Minimal config.yaml, Per-Project Env Injection, Three-Path Env Model (+1 more)

### Community 78 - "10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)"
Cohesion: 0.20
Nodes (10): 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know), Animation Library Choice, Cards & Containers, Galleries & Media, Hero Paradigms, Layout & Grids, Micro-Interactions & Effects, Navigation & Menus (+2 more)

### Community 79 - "tasteskill: Anti-Slop Frontend Skill"
Cohesion: 0.20
Nodes (10): 13. OUT OF SCOPE, 14. FINAL PRE-FLIGHT CHECK, 1.A Dial Inference (design read → dial values), 1.B Use-Case Presets, 1.C How the Dials Drive Output, 1. THE THREE DIALS (Core Configuration), 2.A When to reach for a real design system (use official packages), 2.B When the brief is an aesthetic, not a system (+2 more)

### Community 80 - "Frontend Runtime and UI Guide"
Cohesion: 0.20
Nodes (10): Component Ownership, Frontend Runtime and UI Guide, Loading, Error, and Standard UI States `[DESIGN]`, Multilingual Support & AI Translation `[SOURCE]`, Purpose, Realtime, Server and Client Components, State Ownership (+2 more)

### Community 81 - "GuestKnowledgeV2.tsx"
Cohesion: 0.08
Nodes (29): metadata, Copy, NotFoundClient(), BreadcrumbItem, Breadcrumbs(), BreadcrumbsProps, Locale, useLocale (+21 more)

### Community 82 - "style.md"
Cohesion: 0.20
Nodes (9): BlurText Component, Custom SVG Icons (no external icon library needed for these), Dependencies, FadingVideo Component, Fonts (Google Fonts), Key Design Principles, Liquid Glass CSS (in index.css), Section 1: Hero (+1 more)

### Community 83 - "Command Name"
Cohesion: 0.22
Nodes (8): Command Name, PHASE_1_CHECKPOINT, Phase 1: LOAD, PHASE_2_CHECKPOINT, Phase 2: EXECUTE, PHASE_3_CHECKPOINT, Phase 3: GENERATE, Phase 4: REPORT

### Community 84 - "Parameter Matrix (Quick Reference)"
Cohesion: 0.22
Nodes (8): Cross-References to Detailed Guides, Inline `agents:` (Task-tool sub-agents), Master Matrix: Parameters × Node Types, Parameter Matrix (Quick Reference), Parameter Selection by Intent, Providers at a Glance, Silent Failures (what gets ignored without erroring), Ten Principles for Safe Workflow Design

### Community 85 - "Variable Substitution Reference"
Cohesion: 0.22
Nodes (8): Context Auto-Append, Escaped Dollar Signs, Node Output Details (DAG Only), NOT Supported: `$1` … `$9` Positional Arguments, Substitution Order, Variable Substitution Reference, Variable Table, Where Variables Are Substituted

### Community 86 - "Core Philosophy"
Cohesion: 0.22
Nodes (8): Core Philosophy, Pillar 1: Emotional Intent, Pillar 2: Visual Narrative, Pillar 3: Motion Craft, The 1/3 Screen Rule, The Attention Budget, Three Motion Layers, Three Pillars

### Community 87 - "Russia-Vietnam Science-Technology Intelligence Network Global Rules (Authoritative)"
Cohesion: 0.22
Nodes (8): 1. Security & Authentication Boundaries, 2. Data Ownership & Module Boundaries, 3. Package & Dependency Governance, 4. API & Resource Design, 5. Working Tree & Scope Constraints, 6. Verification Request Dispatch & Browser Testing Policy, 7. UI Quality & Impeccable Gate, Russia-Vietnam Science-Technology Intelligence Network Global Rules (Authoritative)

### Community 88 - "Header.tsx"
Cohesion: 0.13
Nodes (17): Header(), headerCopy, HeaderProps, SidebarProps, auth, authResource, CurrentUser, json() (+9 more)

### Community 89 - "table.tsx"
Cohesion: 0.22
Nodes (8): groupLabels, groupPermissions(), iamAdminCopy, permissionLabels, roleLabels, subscribeToClient(), UserAdministration(), View

### Community 90 - "Product"
Cohesion: 0.22
Nodes (8): Audience, Constraints, Core mechanism, Design success, Identity, Implemented surfaces, Product, Product truth

### Community 91 - "Ponytail"
Cohesion: 0.22
Nodes (8): Boundaries, Intensity, Output, Persistence, Ponytail, Rules, The ladder, When NOT to be lazy

### Community 92 - "Primitives"
Cohesion: 0.25
Nodes (7): Color, Elevation, Motion, Primitives, Shape, Spacing, Typography

### Community 93 - "9. AI TELLS (Forbidden Patterns)"
Cohesion: 0.25
Nodes (8): 9.A Visual & CSS, 9. AI TELLS (Forbidden Patterns), 9.B Typography, 9.C Layout & Spacing, 9.D Content & Data ("Jane Doe" Effect), 9.E External Resources & Components, 9.F Production-Test Tells (banned outright), 9.G EM-DASH BAN (the single most-violated Tell)

### Community 94 - "Emotion-to-Motion Mapping"
Cohesion: 0.25
Nodes (7): Color Psychology, Color Transition Rules, Context-Based Emotion Defaults, Core Table, Emotion-to-Motion Mapping, Emotional Intensity, Path as Emotional Language

### Community 95 - "motion-design/SKILL.md"
Cohesion: 0.22
Nodes (9): Color, Combined Properties, Opacity, Performance, Position, Property Selection, Property Selection by Goal, Rotation (+1 more)

### Community 96 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): beVietnamPro, metadata, sans, serif, QueryProvider()

### Community 97 - "frontend/DESIGN.md"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 98 - "Frontend Rules"
Cohesion: 0.25
Nodes (7): Before code, Boundaries, Completion, Frontend Rules, Server state, State, UI Quality & Impeccable Gate

### Community 99 - "Backend Modular Monolith Rules"
Cohesion: 0.25
Nodes (7): Backend Modular Monolith Rules, Before code, Boundaries, Contracts and events, Data, Testing and completion, Trust boundaries

### Community 100 - "vnru-full-modules-prototype-v3/assets/app.js"
Cohesion: 0.43
Nodes (6): esc(), openDrawer(), openFlow(), openModal(), openPalette(), toast()

### Community 101 - "CLI Setup Guide"
Cohesion: 0.29
Nodes (6): 1. Install Dependencies, 2. Link the CLI Globally, 3. Verify Installation, 4. Authenticate Claude, CLI Setup Guide, Notes

### Community 102 - "Node Types (Mutually Exclusive)"
Cohesion: 0.29
Nodes (7): Bash Node, Command Node, Loop Group Node, Loop Node, Node Types (Mutually Exclusive), Prompt Node, Script Node

### Community 103 - "Loop Nodes"
Cohesion: 0.25
Nodes (8): Completion Detection, Configuration, Interactive Loops, Loop Nodes, Loop Output, Patterns, Session Patterns, What Works / Does NOT Work on Loop Nodes

### Community 104 - "VN–RU Portal Design DNA"
Cohesion: 0.29
Nodes (6): Inventory, Non-negotiable readability gate, Product mental model, Sources of truth, Visual direction, VN–RU Portal Design DNA

### Community 105 - "Scales"
Cohesion: 0.29
Nodes (6): Color modes, Density, Grid, Responsive, Scales, Stability

### Community 106 - "Design DNA"
Cohesion: 0.29
Nodes (6): Design DNA, Natural-language operations, Output, Required workflow, Source order, Trigger

### Community 107 - "11. REDESIGN PROTOCOL"
Cohesion: 0.29
Nodes (7): 11.A Detect the Mode (first action), 11.B Audit Before Touching, 11.C Preservation Rules, 11.D Modernisation Levers (priority order), 11.E Decision Tree: Targeted Evolution vs Full Redesign, 11.F What Never Changes Silently, 11. REDESIGN PROTOCOL

### Community 108 - "3. DEFAULT ARCHITECTURE & CONVENTIONS"
Cohesion: 0.29
Nodes (7): 3.A Stack, 3.B State, 3.C Icons, 3.D Emoji Policy, 3. DEFAULT ARCHITECTURE & CONVENTIONS, 3.E Responsiveness & Layout Mechanics, 3.F Dependency Verification (mandatory)

### Community 109 - "6. PERFORMANCE & ACCESSIBILITY GUARDRAILS"
Cohesion: 0.29
Nodes (7): 6.A Hardware Acceleration, 6.B Reduced Motion (mandatory), 6.C Dark Mode (mandatory for any consumer-facing page), 6.D Core Web Vitals Targets, 6.E DOM Cost, 6.F Z-Index Restraint, 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS

### Community 110 - "authentication.service.ts"
Cohesion: 0.20
Nodes (10): AuthJsExchangeInput, CallbackResult, ExchangeResult, ExternalIdentityRecord, IdentityPrismaClient, IdentityService, IdentityUser, ResolveExternalIdentityInput (+2 more)

### Community 111 - "GuestHomeV2.tsx"
Cohesion: 0.15
Nodes (7): GuestHomeV2(), HERO_BANNERS, NETWORK_DESKTOP_NODES, NETWORK_TONE_STYLES, NetworkStat, ConstellationField, ThreeContentBackground()

### Community 112 - "auth-service/package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 113 - "Workflow-Level Fields"
Cohesion: 0.33
Nodes (6): Claude SDK Advanced Options, Codex-Specific Options, Complete workflow-level example, Core, Isolation, Workflow-Level Fields

### Community 114 - "Behaviors"
Cohesion: 0.33
Nodes (5): Behaviors, Forms, Interaction, Loading and state, Motion

### Community 115 - "Core Components"
Cohesion: 0.33
Nodes (5): Buttons and inputs, Cards, Core Components, Navigation, Tables and status

### Community 116 - "Surface Patterns"
Cohesion: 0.33
Nodes (5): Authentication, Operational workspace, Public/marketing, Responsive, Surface Patterns

### Community 118 - "Query Resource Guide"
Cohesion: 0.33
Nodes (5): Before coding, Minimal pattern, Query Resource Guide, Required practices, Rule

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

### Community 130 - "GuestAboutV2.tsx"
Cohesion: 0.20
Nodes (6): metadata, COPY, GuestAboutV2(), LEADERS, MEMBER_ORGANIZATIONS, NetworkIconGlyph()

### Community 131 - "docs/README.md"
Cohesion: 0.25
Nodes (5): Documentation Index, Development, Documentation, Kept runtime, VN–RU Network Portal

### Community 132 - "register/page.tsx"
Cohesion: 0.43
Nodes (6): metadata, Page(), Home(), HomeSession, getCurrentSession(), resolveLandingPath()

### Community 133 - "RoleListPage.tsx"
Cohesion: 0.17
Nodes (11): copy, PermissionCatalogPage(), copy, isSystemRole(), resolveScopeForRole(), RoleListPage(), subscribeToClient(), AccessScope (+3 more)

### Community 134 - "Portal Foundation Decisions"
Cohesion: 0.50
Nodes (3): Access model, Current product boundary, Portal Foundation Decisions

### Community 136 - "Synthetic IAM Workflow Fixtures"
Cohesion: 0.50
Nodes (3): Critical notice, Synthetic IAM Workflow Fixtures, Usage

### Community 139 - "authenticated-request-context.ts"
Cohesion: 0.38
Nodes (5): copy, MfaControl(), SecurityClientPage(), securityCopy, useSessions()

### Community 144 - "app/news/page.tsx"
Cohesion: 0.33
Nodes (7): isNewsCategory(), metadata, Page(), GuestNewsFilterNav(), GuestNewsFilterNavProps, NEWS_CATEGORIES, NewsCategory

### Community 145 - "frontend/package.json"
Cohesion: 0.20
Nodes (9): name, packageManager, private, scripts, build, dev, lint, start (+1 more)

### Community 146 - "UserAdministration.tsx"
Cohesion: 0.19
Nodes (10): iam, security, iamRepository, IamRole, IamSession, IamUser, json(), Profile (+2 more)

### Community 153 - "ProfileDialog.tsx"
Cohesion: 0.47
Nodes (4): ProfileDialog(), schema, useProfile(), getFieldErrors()

### Community 154 - "exclude"
Cohesion: 0.25
Nodes (7): dist, **/*spec.ts, test, ./tsconfig.json, exclude, extends, node_modules

### Community 164 - "VN-RU Monorepo Rules"
Cohesion: 0.29
Nodes (6): Documentation, Implementation, Non-goals, Source precedence, VN-RU Monorepo Rules, Workspace boundaries

### Community 165 - "import-fixture.ts"
Cohesion: 0.29
Nodes (6): ALLOWED_CAPABILITIES, ALLOWED_CONTEXT_TYPES, ALLOWED_ROLES, fixturesDocumentSchema, ROLE_POLICIES, singleFixtureSchema

### Community 166 - "VN-RU Monorepo Architecture"
Cohesion: 0.33
Nodes (5): Decision, Dependency direction, Extraction policy, Repository shape, VN-RU Monorepo Architecture

### Community 167 - "auth.ts"
Cohesion: 0.32
Nodes (5): accountConfigSchema, backendUrl(), createBackendSession(), { handlers, auth, signIn, signOut }, verifyRegisteredAccount()

### Community 168 - "Cancel Nodes"
Cohesion: 0.40
Nodes (5): Cancel Nodes, Configuration, Fields, Typical Patterns, When to use `cancel` vs failing a `bash:` check

### Community 169 - "VN-RU Module Map"
Cohesion: 0.40
Nodes (5): Current backend modules, Frontend ownership, Future modules, Ownership rules, VN-RU Module Map

### Community 171 - "VN-RU Architecture Hub"
Cohesion: 0.40
Nodes (5): Canonical detailed docs, Read order, Runtime model, Task routing, VN-RU Architecture Hub

### Community 172 - "Loop Group Nodes"
Cohesion: 0.50
Nodes (4): Body Semantics, Configuration, Loop Group Nodes, When to use `loop:` vs `loop_group:`

### Community 173 - "NotFoundClient.tsx"
Cohesion: 0.40
Nodes (4): DEMO_KNOWLEDGE_RESOURCES, getKnowledgeResourceById(), KnowledgeResource, KnowledgeType

### Community 174 - "iam-admin.controller.ts"
Cohesion: 0.40
Nodes (4): DEMO_OPPORTUNITIES, DetailedOpportunity, getOpportunityById(), Opportunity

### Community 175 - "identity.module.ts"
Cohesion: 0.09
Nodes (23): configSchema, validateConfig(), DatabaseClient, DatabaseModule, Injectable, Module, AccessControlModule, Module (+15 more)

### Community 176 - "AccessLogsPage.tsx"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

### Community 203 - "mfa/route.ts"
Cohesion: 0.83
Nodes (3): DELETE(), GET(), proxy()

### Community 215 - "profile/route.ts"
Cohesion: 0.83
Nodes (3): GET(), PATCH(), proxy()

## Knowledge Gaps
- **1287 isolated node(s):** `PageProps`, `metadata`, `metadata`, `Copy`, `metadata` (+1282 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **34 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale` connect `GuestKnowledgeV2.tsx` to `RolePermissionsPage.tsx`, `SidebarFrame.tsx`, `GuestAboutV2.tsx`, `RoleListPage.tsx`, `WorkspaceShell.tsx`, `GuestExploreV2.tsx`, `authenticated-request-context.ts`, `workspace-server.ts`, `Locale`, `useLocale`, `GuestHomeV2.tsx`, `GuestNewsArticleV2.tsx`, `Header.tsx`, `table.tsx`, `GuestEcosystemV2.tsx`, `IamAdminController`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `GuestKnowledgeV2.tsx`, `SidebarFrame.tsx`, `WorkspaceShell.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `Locale` connect `GuestKnowledgeV2.tsx` to `RolePermissionsPage.tsx`, `SidebarFrame.tsx`, `GuestAboutV2.tsx`, `RoleListPage.tsx`, `WorkspaceShell.tsx`, `authenticated-request-context.ts`, `workspace-server.ts`, `Locale`, `useLocale`, `GuestHomeV2.tsx`, `Header.tsx`, `table.tsx`, `GuestEcosystemV2.tsx`, `IamAdminController`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `PageProps`, `metadata`, `metadata` to the rest of the system?**
  _1287 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `authServiceUrl` be split into smaller, more focused modules?**
  _Cohesion score 0.14919354838709678 - nodes in this community are weakly interconnected._
- **Should `RolePermissionsPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `iam-admin.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08549019607843138 - nodes in this community are weakly interconnected._