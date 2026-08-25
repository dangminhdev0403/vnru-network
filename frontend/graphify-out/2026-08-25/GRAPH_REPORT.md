# Graph Report - frontend  (2026-08-25)

## Corpus Check
- 179 files · ~547,775 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1052 nodes · 1902 edges · 86 communities (66 shown, 20 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e8a257bc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- DecisionInteractiveWorkspace.tsx
- PRE_TEST_FOCUSED_FIX_GUIDE.md
- useLocale
- workspace-server.ts
- demo-backend.ts
- PublicDiscoveryPages.tsx
- DemoWorkflowProvider.tsx
- OrganizationInteractiveWorkspace.tsx
- compilerOptions
- authServiceUrl
- ReviewerTaskWorkspace.tsx
- LanguageSwitcher.tsx
- CollaborationManagerInteractiveWorkspace.tsx
- interactive-workflow-v2.test.mjs
- WorkspaceSidebar.tsx
- ResearcherInteractiveWorkspace.tsx
- dependencies
- devDependencies
- CollaborationManagerTaskWorkspace.tsx
- RolePermissionsPage.tsx
- locale.ts
- server.ts
- SidebarIcons.tsx
- Frontend API Contract Guide
- mock-data.ts
- ResearcherTaskWorkspace.tsx
- UserAdministration.tsx
- hooks.ts
- DecisionTaskWorkspace.tsx
- OrganizationTaskWorkspace.tsx
- Frontend Runtime and UI Guide
- ReviewerInteractiveWorkspace.tsx
- SecurityClientPage.tsx
- AdminSidebar.tsx
- CollaborationManagerInteractiveWorkspace.tsx
- ResearcherInteractiveWorkspace.tsx
- iam.ts
- package.json
- style.md
- ReviewerInteractiveWorkspace.tsx
- commitDemoMutation
- class-variance-authority
- alerts.ts
- Product
- layout.tsx
- NotFoundClient.tsx
- DESIGN.md
- Frontend Rules
- GuestKnowledgeV2.tsx
- index.ts
- projects.ts
- Query Resource Guide
- decisions.ts
- This is NOT the Next.js you know
- GovernanceWorkspace.tsx
- ARCHITECTURE.md
- MODULE_GUIDE.md
- PROMPT_PRE_TEST_FOCUSED_FIX.md
- eslint.config.mjs
- home-i18n.test.mjs
- i18next
- motion
- next.config.ts
- react-aria-components
- react-dom
- react-i18next
- sweetalert2
- zod
- postcss.config.mjs
- README.md
- { GET, POST }

## God Nodes (most connected - your core abstractions)
1. `useLocale` - 56 edges
2. `cn()` - 47 edges
3. `commitDemoMutation()` - 33 edges
4. `authServiceUrl()` - 28 edges
5. `backendHeaders()` - 27 edges
6. `Locale` - 26 edges
7. `react` - 25 edges
8. `WorkspacePreviewNotice()` - 17 edges
9. `useDemoWorkflow()` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Collapsible()` --calls--> `cn()`  [EXTRACTED]
  components/tailgrids/core/collapsible.tsx → lib/cn.ts
- `CollapsibleTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/tailgrids/core/collapsible.tsx → lib/cn.ts
- `CollapsibleContent()` --calls--> `cn()`  [EXTRACTED]
  components/tailgrids/core/collapsible.tsx → lib/cn.ts
- `TableBody()` --calls--> `cn()`  [EXTRACTED]
  components/tailgrids/core/table.tsx → lib/cn.ts
- `TableRow()` --calls--> `cn()`  [EXTRACTED]
  components/tailgrids/core/table.tsx → lib/cn.ts

## Import Cycles
- None detected.

## Communities (86 total, 20 thin omitted)

### Community 0 - "cn"
Cohesion: 0.18
Nodes (16): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), DropdownContentProps (+8 more)

### Community 1 - "DecisionInteractiveWorkspace.tsx"
Cohesion: 0.07
Nodes (38): useDemoHandoffs(), DecisionItem, decisionMeta(), DecisionProject, DecisionState, DecisionView, DecisionWorkspaceContent(), initialItems (+30 more)

### Community 2 - "PRE_TEST_FOCUSED_FIX_GUIDE.md"
Cohesion: 0.05
Nodes (37): 10. P1 — Sidebar semantics still treat roles like modules, 11. P1 — Documentation must describe runtime truth correctly, 12. Exact files to inspect first, 13. Focused implementation slices, 14. Things NOT to do in this pre-test fix, 15. Verification after the focused fix, 16. Pre-test exit gate, 17. First real test after this guide (+29 more)

### Community 3 - "useLocale"
Cohesion: 0.13
Nodes (19): AdminAuditPage(), auditCopy, metadata, copy, RegisterPage(), BrandMark(), BrandMarkProps, Locale (+11 more)

### Community 4 - "workspace-server.ts"
Cohesion: 0.07
Nodes (37): metadata, Page(), metadata, Page(), metadata, Page(), metadata, Page() (+29 more)

### Community 5 - "demo-backend.ts"
Cohesion: 0.15
Nodes (26): commitDemoMutation(), DemoActivity, DemoHandoff, DemoMutationOptions, DemoNotification, emitChange(), markAllDemoNotificationsRead(), markDemoNotificationRead() (+18 more)

### Community 6 - "PublicDiscoveryPages.tsx"
Cohesion: 0.12
Nodes (19): metadata, Page(), metadata, metadata, Page(), ExpertDetailPage(), ExpertsIndexPage(), OpportunitiesIndexPage() (+11 more)

### Community 7 - "DemoWorkflowProvider.tsx"
Cohesion: 0.15
Nodes (12): DemoWorkflowContext, DemoWorkflowContextValue, DemoWorkflowProvider(), makeId(), nowLabel(), OrganizationEndorsement, WorkflowNotification, WorkflowRole (+4 more)

### Community 8 - "OrganizationInteractiveWorkspace.tsx"
Cohesion: 0.08
Nodes (51): copy, ModuleKey, modules, UnifiedWorkspaceDashboard(), toneClass, WorkspaceTaskDialog(), WorkspaceTaskDialogProps, Content() (+43 more)

### Community 9 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "authServiceUrl"
Cohesion: 0.08
Nodes (36): POST(), GET(), PATCH(), PATCH(), GET(), POST(), GET(), POST() (+28 more)

### Community 11 - "ReviewerTaskWorkspace.tsx"
Cohesion: 0.11
Nodes (16): DemoActivityPanel(), titles, EndorsementItem, OrganizationWorkspace(), ResearcherWorkspace(), ReviewerWorkspace(), WorkspacePreviewNotice(), WorkspacePreviewNoticeProps (+8 more)

### Community 12 - "LanguageSwitcher.tsx"
Cohesion: 0.11
Nodes (15): FlagProps, LANGUAGE_OPTIONS, LanguageOption, LanguageSwitcher(), LanguageSwitcherProps, LanguageSwitcherVariant, switcherCopy, COPY (+7 more)

### Community 13 - "CollaborationManagerInteractiveWorkspace.tsx"
Cohesion: 0.10
Nodes (22): Assignment, assignmentMeta(), AssignmentState, initialAssignments, initialScreenings, ManagerView, ManagerWorkspaceContent(), opportunities (+14 more)

### Community 14 - "interactive-workflow-v2.test.mjs"
Cohesion: 0.08
Nodes (22): academicsContent, activitiesContent, allMockDataContent, decision, decisionsContent, endorsementsContent, expertsContent, iamContent (+14 more)

### Community 15 - "WorkspaceSidebar.tsx"
Cohesion: 0.17
Nodes (14): SidebarProps, labels, WorkspaceSidebar(), WorkspaceSidebarProps, filterNavSections(), hasCapability(), resolveUserPersonas(), WORKSPACE_MEMBER_CAPABILITIES (+6 more)

### Community 16 - "ResearcherInteractiveWorkspace.tsx"
Cohesion: 0.12
Nodes (16): AcademicItem, academicItems, AcademicState, initialProjects, initialProposals, KnowledgeItem, knowledgeItems, Project (+8 more)

### Community 17 - "dependencies"
Cohesion: 0.12
Nodes (17): clsx, @dangminhdev04032005/query-resource, next, next-auth, next-themes, dependencies, clsx, @dangminhdev04032005/query-resource (+9 more)

### Community 18 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 19 - "CollaborationManagerTaskWorkspace.tsx"
Cohesion: 0.12
Nodes (13): DialogState, ManagerView, Opportunity, OpportunityState, ReportItem, ReportState, ReviewAssignment, reviewerCandidates (+5 more)

### Community 20 - "RolePermissionsPage.tsx"
Cohesion: 0.17
Nodes (14): Header(), headerCopy, HeaderProps, auth, authResource, CurrentUser, json(), useCurrentUser() (+6 more)

### Community 21 - "locale.ts"
Cohesion: 0.18
Nodes (10): shellCopy, WorkspaceShell(), SheetContent(), SheetContentProps, SheetOverlay(), SheetOverlayProps, SheetProps, SheetTitle() (+2 more)

### Community 22 - "server.ts"
Cohesion: 0.23
Nodes (11): TableBody(), TableCell(), tableCellStyles, TableHead(), TableHeader(), tableHeaderStyles, tableHeadStyles, TableRoot() (+3 more)

### Community 24 - "Frontend API Contract Guide"
Cohesion: 0.12
Nodes (15): Anti-patterns, Authentication and Session, Authorization Context, Caching, Contract Rules, Error Contract, Frontend API Contract Guide, Generated Contracts (+7 more)

### Community 25 - "mock-data.ts"
Cohesion: 0.24
Nodes (7): copy, NavItem, SidebarFrame(), SidebarFrameProps, Tooltip(), TooltipProps, TooltipTrigger()

### Community 26 - "ResearcherTaskWorkspace.tsx"
Cohesion: 0.16
Nodes (10): MOCK_PROPOSALS, academicItems, DialogState, knowledgeItems, MilestoneState, pillClass(), ResearcherTaskWorkspaceContent(), ResearcherView (+2 more)

### Community 27 - "UserAdministration.tsx"
Cohesion: 0.17
Nodes (9): copy, groupLabels, isSystemRole(), Modal, permissionLabels, roleLabels, RolePermissionsPage(), Tab (+1 more)

### Community 28 - "hooks.ts"
Cohesion: 0.15
Nodes (14): AccountClientPage(), copy, ProfileDialog(), iam, security, useProfile(), iamRepository, IamRole (+6 more)

### Community 29 - "DecisionTaskWorkspace.tsx"
Cohesion: 0.20
Nodes (8): DecisionItem, DecisionState, DecisionView, initialItems, stateClass(), stateLabel(), StatusPill(), views

### Community 30 - "OrganizationTaskWorkspace.tsx"
Cohesion: 0.18
Nodes (8): EndorsementItem, EndorsementState, initialEndorsements, OrganizationView, projects, stateCopy(), StatePill(), views

### Community 31 - "Frontend Runtime and UI Guide"
Cohesion: 0.18
Nodes (10): Component Ownership, Frontend Runtime and UI Guide, Loading, Error, and Standard UI States `[DESIGN]`, Multilingual Support & AI Translation `[SOURCE]`, Purpose, Realtime, Server and Client Components, State Ownership (+2 more)

### Community 32 - "ReviewerInteractiveWorkspace.tsx"
Cohesion: 0.22
Nodes (7): Collapsible(), CollapsibleContent(), CollapsibleContentProps, CollapsibleGroupProps, CollapsibleProps, CollapsibleTrigger(), CollapsibleTriggerProps

### Community 33 - "SecurityClientPage.tsx"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeStyles

### Community 34 - "AdminSidebar.tsx"
Cohesion: 0.18
Nodes (7): groupLabels, groupPermissions(), iamAdminCopy, permissionLabels, roleLabels, View, ApiError

### Community 35 - "CollaborationManagerInteractiveWorkspace.tsx"
Cohesion: 0.50
Nodes (3): BreadcrumbItem, Breadcrumbs(), BreadcrumbsProps

### Community 36 - "ResearcherInteractiveWorkspace.tsx"
Cohesion: 0.24
Nodes (9): NavSection, AdminSidebar(), AdminSidebarProps, labels, ADMIN_NAV_REGISTRY, AdminNavEntry, AdminNavSection, filterAdminNavSections() (+1 more)

### Community 37 - "iam.ts"
Cohesion: 0.22
Nodes (7): DEMO_AUDIT_EVENTS, DEMO_IAM_USERS, getIamUserById(), IamAssignmentScope, IamAuditEvent, IamDemoUser, IamUserStatus

### Community 38 - "package.json"
Cohesion: 0.20
Nodes (9): name, packageManager, private, scripts, build, dev, lint, start (+1 more)

### Community 39 - "style.md"
Cohesion: 0.20
Nodes (9): BlurText Component, Custom SVG Icons (no external icon library needed for these), Dependencies, FadingVideo Component, Fonts (Google Fonts), Key Design Principles, Liquid Glass CSS (in index.css), Section 1: Hero (+1 more)

### Community 40 - "ReviewerInteractiveWorkspace.tsx"
Cohesion: 0.25
Nodes (6): ReviewAssignment, ReviewState, DEMO_REVIEWS, DetailedReview, getReviewById(), RubricBreakdown

### Community 41 - "commitDemoMutation"
Cohesion: 0.67
Nodes (3): Button(), ButtonProps, buttonStyles

### Community 43 - "alerts.ts"
Cohesion: 0.17
Nodes (17): UserAdministration(), copy, MfaControl(), schema, SecurityClientPage(), securityCopy, useSessions(), alertCopy (+9 more)

### Community 44 - "Product"
Cohesion: 0.22
Nodes (8): Audience, Constraints, Core mechanism, Design success, Identity, Implemented surfaces, Product, Product truth

### Community 45 - "layout.tsx"
Cohesion: 0.29
Nodes (5): beVietnamPro, metadata, sans, serif, QueryProvider()

### Community 46 - "NotFoundClient.tsx"
Cohesion: 0.29
Nodes (5): metadata, Locale, NotFoundClient(), Translation, translations

### Community 47 - "DESIGN.md"
Cohesion: 0.25
Nodes (7): Brand & Style, Colors, Components, Elevation & Depth, Layout & Spacing, Shapes, Typography

### Community 48 - "Frontend Rules"
Cohesion: 0.25
Nodes (7): Before code, Boundaries, Completion, Frontend Rules, Server state, State, UI Quality & Impeccable Gate

### Community 50 - "GuestKnowledgeV2.tsx"
Cohesion: 0.21
Nodes (8): metadata, COPY, GuestKnowledgeV2(), TYPE_LABELS, DEMO_KNOWLEDGE_RESOURCES, getKnowledgeResourceById(), KnowledgeResource, KnowledgeType

### Community 51 - "index.ts"
Cohesion: 0.09
Nodes (14): ReportItem, AcademicEvent, DEMO_ACADEMIC_EVENTS, getAcademicEventById(), DEMO_ACTIVITIES, DEMO_EXPERTS, Expert, getExpertById() (+6 more)

### Community 52 - "projects.ts"
Cohesion: 0.11
Nodes (16): Milestone, MilestoneState, Opportunity, Project, ProjectState, Proposal, ProposalState, DEMO_OPPORTUNITIES (+8 more)

### Community 53 - "Query Resource Guide"
Cohesion: 0.33
Nodes (5): Before coding, Minimal pattern, Query Resource Guide, Required practices, Rule

### Community 55 - "decisions.ts"
Cohesion: 0.32
Nodes (6): Decision, DecisionState, DEMO_DECISIONS, DetailedDecision, getDecisionById(), getDecisionByProposalId()

## Knowledge Gaps
- **427 isolated node(s):** `auditCopy`, `metadata`, `metadata`, `metadata`, `metadata` (+422 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLocale` connect `useLocale` to `AdminSidebar.tsx`, `CollaborationManagerInteractiveWorkspace.tsx`, `ResearcherInteractiveWorkspace.tsx`, `PublicDiscoveryPages.tsx`, `OrganizationInteractiveWorkspace.tsx`, `authServiceUrl`, `alerts.ts`, `LanguageSwitcher.tsx`, `WorkspaceSidebar.tsx`, `GuestKnowledgeV2.tsx`, `RolePermissionsPage.tsx`, `locale.ts`, `mock-data.ts`, `UserAdministration.tsx`, `hooks.ts`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **Why does `react` connect `demo-backend.ts` to `DecisionInteractiveWorkspace.tsx`, `DemoWorkflowProvider.tsx`, `OrganizationInteractiveWorkspace.tsx`, `ReviewerTaskWorkspace.tsx`, `CollaborationManagerInteractiveWorkspace.tsx`, `ResearcherInteractiveWorkspace.tsx`, `dependencies`, `ResearcherTaskWorkspace.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `demo-backend.ts`, `package.json`, `class-variance-authority`, `i18next`, `motion`, `react-aria-components`, `react-dom`, `react-i18next`, `sweetalert2`, `zod`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **What connects `auditCopy`, `metadata`, `metadata` to the rest of the system?**
  _427 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DecisionInteractiveWorkspace.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07342995169082125 - nodes in this community are weakly interconnected._
- **Should `PRE_TEST_FOCUSED_FIX_GUIDE.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `useLocale` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._