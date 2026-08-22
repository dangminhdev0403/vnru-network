# ROLE / WORKSPACE / ADMIN REFACTOR GUIDE

Repository: `dangminhdev0403/vnru-network`  
Purpose: refactor role handling, workspace routing, admin boundaries, navigation, and future persona expansion without coupling the frontend to hard-coded role names.

---

# 1. Core objective

Refactor the frontend around this model:

```text
Identity
  ↓
Active Context
  ↓
Role Assignments
  ↓
Capabilities
  ↓
Product Surface
  ↓
Route / Navigation / Action
  ↓
Backend authorization
```

Do **not** use:

```text
Role name
  ↓
Hard-coded page access
```

The target is to let new business roles, new personas, and new workspaces be added later without rewriting the whole navigation or route tree.

---

# 2. Current problem to solve

The current runtime still mixes several responsibilities:

```text
/workspace
/workspace/knowledge
/workspace/iam
/workspace/iam/admin
/workspace/iam/security
```

This creates ambiguity between:

- personal/business workspace
- IAM self-service
- platform administration
- business governance

The architecture should instead distinguish:

```text
PUBLIC
AUTHENTICATED WORKSPACE
ADMIN / GOVERNANCE
```

---

# 3. Canonical product surfaces

## 3.1 Public surface

Examples:

```text
/
 /knowledge/*
 /experts/*
 /publications/*
 /opportunities/*
```

Purpose:

- discovery
- public reading
- public expert profile
- public research opportunity discovery

No privileged business mutation.

---

## 3.2 Authenticated workspace

Base:

```text
/workspace
```

Purpose:

- user/business work
- role-dependent work queues
- collaboration workflows
- reviews
- projects
- organization-related activities
- self-service account/security where appropriate

Examples:

```text
/workspace/knowledge
/workspace/collaboration
/workspace/collaboration/opportunities
/workspace/collaboration/proposals
/workspace/collaboration/reviews
/workspace/collaboration/decisions
/workspace/collaboration/projects
/workspace/iam/security
```

Important:

A page does **not** become "admin" simply because the user making the decision is senior.

Example:

```text
FOUNDATION_DECISION_MAKER
→ /workspace/collaboration/decisions
```

This is still a business workflow.

---

## 3.3 Admin / governance surface

Base:

```text
/admin
```

Purpose:

- platform governance
- user administration
- role assignment
- permission administration
- catalogs
- audit
- platform configuration

Target routes:

```text
/admin/access
/admin/access/users
/admin/access/roles
/admin/access/assignments
/admin/audit
/admin/catalogs
```

Only add new admin routes when corresponding backend/admin capability exists.

---

# 4. Role taxonomy

Do not keep all roles in one conceptual bucket.

Use three categories.

---

## 4.1 System roles

System roles manage infrastructure or access governance.

Examples:

```text
SUPER_ADMIN
SECURITY_ADMIN
IAM_ADMIN
```

Possible capability domains:

```text
iam.*
security.*
admin.*
audit.*
```

Important:

```text
SUPER_ADMIN
!= KNOWLEDGE_CURATOR
!= COLLABORATION_MANAGER
!= FOUNDATION_DECISION_MAKER
```

`SUPER_ADMIN` must not automatically become business owner.

---

## 4.2 Business roles

Business roles operate domain workflows.

Examples:

```text
KNOWLEDGE_CURATOR
ORGANIZATION_REPRESENTATIVE
RESEARCHER
REVIEWER
COLLABORATION_MANAGER
FOUNDATION_DECISION_MAKER
```

Possible capability domains:

```text
knowledge.*
experts.*
collab.*
reviews.*
projects.*
```

Business role assignment should be explicit.

---

## 4.3 Persona aliases

A persona is a UI composition concept, not an authorization authority.

Examples:

```text
researcher
reviewer
organization
collaboration-manager
decision-maker
```

Persona can be resolved from capabilities and context.

Do not assume:

```text
role === persona
```

A user can hold several roles simultaneously.

Example:

```text
User
├── RESEARCHER
├── REVIEWER
└── ORGANIZATION_REPRESENTATIVE
```

The UI can expose multiple workspace entries.

---

# 5. Capability-first frontend

Frontend navigation and actions should use capability checks.

Example:

```text
canViewKnowledge
  ← knowledge.workspace.view

canViewMatches
  ← experts.matches.view

canCreateOpportunity
  ← collab.opportunities.create

canPublishOpportunity
  ← collab.opportunities.publish

canCreateProposal
  ← collab.proposals.create

canSubmitProposal
  ← collab.proposals.submit

canReviewAssigned
  ← reviews.assignments.view_assigned

canSubmitEvaluation
  ← reviews.evaluations.submit

canIssueDecision
  ← collab.decisions.issue_foundation

canViewProjects
  ← projects.projects.view

canUpdateMilestone
  ← projects.milestones.update
```

Frontend capability checks are UX only.

Backend must still enforce every request.

---

# 6. Context model

Do not authorize only by capability.

Effective access should be understood as:

```text
Capability
+
Active Context
+
Resource Scope
```

Potential contexts:

```text
PLATFORM
ORGANIZATION
PROJECT
COLLABORATION
REVIEW_ASSIGNMENT
```

Examples:

```text
ORGANIZATION_REPRESENTATIVE
+ organization context
→ manage that organization-owned workflow

REVIEWER
+ review assignment context
→ access assigned anonymized review

COLLABORATION_MANAGER
+ organization/platform context
→ manage permitted collaboration flows
```

Frontend must not invent scope rules.

---

# 7. Route ownership

Recommended route structure:

```text
frontend/app/
│
├── (workspace)/
│   ├── layout.tsx
│   └── workspace/
│       ├── page.tsx
│       │
│       ├── knowledge/
│       │   └── ...
│       │
│       ├── collaboration/
│       │   ├── page.tsx
│       │   ├── opportunities/
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   │
│       │   ├── proposals/
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   │       ├── page.tsx
│       │   │       └── edit/
│       │   │           └── page.tsx
│       │   │
│       │   ├── reviews/
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   │
│       │   ├── decisions/
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   │
│       │   └── projects/
│       │       ├── page.tsx
│       │       └── [id]/
│       │           └── page.tsx
│       │
│       └── iam/
│           └── security/
│               └── page.tsx
│
├── (admin)/
│   ├── layout.tsx
│   └── admin/
│       ├── access/
│       │   ├── page.tsx
│       │   ├── users/
│       │   │   └── page.tsx
│       │   ├── roles/
│       │   │   └── page.tsx
│       │   └── assignments/
│       │       └── page.tsx
│       │
│       ├── catalogs/
│       │   └── page.tsx
│       │
│       └── audit/
│           └── page.tsx
│
├── knowledge/
├── experts/
├── publications/
└── ...
```

---

# 8. Do not create role-named route trees by default

Avoid:

```text
/workspace/researcher/...
/workspace/reviewer/...
/workspace/admin/...
```

for domain resources when the actual resource already has a canonical route.

Prefer:

```text
/workspace/collaboration/proposals
/workspace/collaboration/reviews
/workspace/collaboration/projects
```

Then personalize navigation/work queue per capability.

Role/persona routes should only exist if they represent a genuinely distinct composite workspace.

---

# 9. Workspace home

`/workspace` should become a context-aware dispatcher/composition surface.

It should not contain domain business logic.

Target:

```text
/workspace
  ↓
resolve session
  ↓
resolve active context
  ↓
resolve capabilities
  ↓
build available workspace widgets/navigation
```

Possible widgets:

```text
My proposals
Assigned reviews
Active projects
Knowledge shortcuts
Organization tasks
Security notices
```

Only load widgets that are actually visible.

---

# 10. Workspace registry

Introduce a central workspace registry if the current refactor requires it.

Suggested path:

```text
frontend/features/workspace/config/workspace-registry.ts
```

Suggested shape:

```ts
type WorkspaceNavEntry = {
  key: string;
  href: string;
  labelKey: string;
  icon: string;
  requiredCapabilities?: string[];
};

type WorkspaceWidget = {
  key: string;
  requiredCapabilities?: string[];
};

type WorkspacePersona = {
  key: string;
  matchCapabilities?: string[];
  navigation?: WorkspaceNavEntry[];
  widgets?: WorkspaceWidget[];
};
```

Do not make registry authoritative for security.

It controls presentation only.

---

# 11. Navigation generation

Current Sidebar should evolve from static route lists into capability-aware navigation composition.

Concept:

```text
Session capabilities
        ↓
Workspace registry
        ↓
Visible sections
        ↓
Sidebar
```

Example:

```text
knowledge.workspace.view
→ show "Kho Tri thức & Chuyên gia"

collab.proposals.create
OR collab.proposals.submit
→ show "Đề xuất cộng tác"

reviews.assignments.view_assigned
→ show "Phản biện"

projects.projects.view
→ show "Dự án"

iam.users.manage
OR iam.roles.manage
→ show "Quản trị truy cập"
```

Do not show an item just because a role name matches.

---

# 12. Suggested navigation model

Authenticated workspace:

```text
TỔNG QUAN
  Tổng quan

TRI THỨC & CHUYÊN GIA
  Kho tri thức
  Chuyên gia

CỘNG TÁC NGHIÊN CỨU
  Tổng quan cộng tác
  Cơ hội cộng tác
  Đề xuất cộng tác
  Phản biện
  Quyết định cộng tác
  Dự án

TÀI KHOẢN & BẢO MẬT
  Phiên & bảo mật
```

Visibility depends on capability.

Admin:

```text
QUẢN TRỊ TRUY CẬP
  Người dùng
  Vai trò & quyền
  Phân công vai trò

QUẢN TRỊ DỮ LIỆU
  Danh mục

KIỂM SOÁT
  Nhật ký kiểm toán
```

---

# 13. Role-to-navigation examples

These are presentation examples only.

## RESEARCHER

Likely visible:

```text
Knowledge
Experts
Opportunities
My Proposals
My Projects
```

Not automatically visible:

```text
Role Administration
Decision Administration
Review Assignment Management
```

---

## REVIEWER

Likely visible:

```text
Knowledge
Assigned Reviews
```

Optional if separately assigned:

```text
Proposals
Projects
```

Do not infer these from `REVIEWER`.

---

## ORGANIZATION_REPRESENTATIVE

Likely visible:

```text
Knowledge
Experts
Organization-related collaboration
Proposal endorsement
```

Context must be organization-bound.

---

## KNOWLEDGE_CURATOR

Likely visible:

```text
Knowledge governance UI
```

Do not grant:

```text
IAM administration
Collaboration decision
```

unless separately assigned.

---

## COLLABORATION_MANAGER

Likely visible:

```text
Opportunities
Proposals
Review coordination
Projects
```

Exact actions still capability-based.

---

## FOUNDATION_DECISION_MAKER

Likely visible:

```text
Decision queue
Proposal/review summaries needed for decision
```

This is business governance, not platform admin.

---

## SUPER_ADMIN

Likely visible:

```text
/admin/access
/admin/audit
```

Do not implicitly show:

```text
Knowledge moderation
Collaboration decisions
Review operations
Project operations
```

unless explicit business permissions also exist.

---

# 14. Role composition

Support multiple simultaneous assignments.

Do not use:

```ts
if (role === "RESEARCHER") ...
else if (role === "REVIEWER") ...
```

Prefer:

```text
Capabilities from all active assignments
          ↓
deduplicate
          ↓
evaluate active context
          ↓
compose workspace
```

This allows:

```text
RESEARCHER + REVIEWER
RESEARCHER + ORGANIZATION_REPRESENTATIVE
COLLABORATION_MANAGER + REVIEWER
```

without special-case routes.

---

# 15. Role assignment model

An assignment should conceptually include:

```text
userId
roleId
contextType
contextId
status
```

Potential examples:

```text
REVIEWER
contextType = REVIEW_ASSIGNMENT / PLATFORM

ORGANIZATION_REPRESENTATIVE
contextType = ORGANIZATION
contextId = org_x

COLLABORATION_MANAGER
contextType = ORGANIZATION
contextId = org_x
```

Do not store frontend-derived role meaning in the assignment.

---

# 16. Future extensibility

New role example:

```text
PROJECT_COORDINATOR
```

Should require only:

1. backend role/capability definition
2. assignment
3. optional UI labels
4. navigation registry entry if new surfaces are needed

It should **not** require:

- rewriting Sidebar logic
- adding global `if role === ...`
- duplicating a route tree

---

# 17. New feature extensibility

Future business feature example:

```text
Academic Exchange
```

Recommended:

```text
features/academic/
app/(workspace)/workspace/academic/
```

Then navigation is registered using capability such as:

```text
academic.activities.view
```

No existing role code should need modification except optional presentation mapping.

---

# 18. Admin migration plan

Current:

```text
/workspace/iam/admin?view=overview
/workspace/iam/admin?view=roles
```

Target:

```text
/admin/access/users
/admin/access/roles
```

Migration:

```text
Phase 1
- add target admin routes
- reuse existing IAM components where possible

Phase 2
- update Sidebar/admin links

Phase 3
- add redirects from legacy routes

Phase 4
- remove legacy routing only after tests and external links are updated
```

Do not break current URLs without migration.

---

# 19. IAM security route

Separate:

```text
self-service security
```

from:

```text
platform security administration
```

Self-service:

```text
/workspace/iam/security
```

Examples:

```text
my sessions
my MFA
my profile security
```

Administration:

```text
/admin/access
/admin/audit
```

Examples:

```text
user security actions
global audit
role/permission governance
```

---

# 20. Feature folder target

Recommended:

```text
frontend/features/
│
├── auth/
├── iam/
├── knowledge/
├── experts/
├── publications/
│
├── collaboration/
│   ├── components/
│   ├── repositories/
│   ├── resources/
│   ├── queries/
│   ├── hooks/
│   ├── types/
│   ├── schemas/
│   └── i18n/
│
├── reviews/
│   ├── components/
│   ├── repositories/
│   ├── resources/
│   ├── hooks/
│   └── ...
│
├── projects/
│   ├── components/
│   ├── repositories/
│   ├── resources/
│   ├── hooks/
│   └── ...
│
├── workspace/
│   ├── components/
│   ├── config/
│   │   └── workspace-registry.ts
│   └── hooks/
│
└── admin/
    ├── access/
    ├── audit/
    └── catalogs/
```

Create only required folders.

---

# 21. Cross-feature boundaries

Allowed:

```text
collaboration UI
→ opens expert selector using a stable expert public interface
```

Avoid:

```text
collaboration
→ deep import internal knowledge repository implementation
```

Prefer explicit integration interfaces.

Example:

```text
features/experts/public.ts
```

Could expose:

```ts
export type ExpertReference = ...
export function searchExpertsForSelection(...)
```

The exact implementation depends on current architecture.

---

# 22. No financial workflow

Hard constraint for collaboration/project UI:

Do not add:

```text
budget
funding
investment
sponsor management
financial support
disbursement
financial report
funding approval
```

Old `grant` naming must not revive financial behavior.

---

# 23. Refactor execution order

Recommended order:

```text
1. Inventory existing role/capability/session structures
2. Separate workspace vs admin route ownership
3. Introduce capability-aware workspace registry
4. Refactor Sidebar to consume registry
5. Migrate IAM admin routes
6. Add collaboration/review/project routes
7. Add business workspace widgets
8. Connect Knowledge/Experts discovery to collaboration
9. Remove remaining role-name UI conditionals
10. Verify all legacy redirects
```

---

# 24. Agent audit checklist

Before editing, search for:

```text
role ===
role.name
SUPER_ADMIN
PROGRAM_MANAGER
COLLABORATION_MANAGER
KNOWLEDGE_CURATOR
REVIEWER
FOUNDATION_DECISION_MAKER

/workspace/iam/admin
/workspace/reviewer
/admin/

capabilities.includes
```

Classify each result:

```text
AUTHORIZATION
PRESENTATION
LABEL
LEGACY ROUTE
TEST
```

Do not blindly replace labels/tests.

---

# 25. Anti-patterns

Do not implement:

```ts
if (role === "SUPER_ADMIN") {
  showEverything();
}
```

Do not implement:

```ts
if (role === "REVIEWER") {
  redirect("/workspace/reviewer");
}
```

unless the route is truly persona-specific.

Do not duplicate:

```text
Proposal UI for researcher
Proposal UI for organization representative
Proposal UI for manager
```

Use one proposal resource UI with capability-specific actions.

---

# 26. Action visibility

Preferred:

```text
Proposal detail
├── View
├── Edit                 [collab.proposals.edit]
├── Submit               [collab.proposals.submit]
├── Confirm participation[collab.proposals.confirm_paired]
├── Endorse              [collab.proposals.endorse]
└── Screen               [collab.proposals.screen]
```

One page, different capabilities.

Same principle for:

```text
Review
Decision
Project
Knowledge
```

---

# 27. Server/client boundary

Route page:

```text
session
capability/context gate
server loader
page composition
```

Feature component:

```text
presentation
local interaction
forms
modals
```

Repository/resource:

```text
API
query
mutation
cache
```

Do not put backend workflow rules inside React components.

---

# 28. Standard UI states

Every protected route must support:

```text
Loading
Empty
Error
401
403
409
Validation error
Success
```

For unsupported backend action:

```text
hide or disable
```

Do not fake successful interaction.

---

# 29. Internationalization

Role labels, navigation labels and business UI should remain:

```text
VI
EN
RU
```

Do not localize capability keys.

Example:

```text
collab.proposals.submit
```

remains stable.

Only display label changes.

---

# 30. Acceptance criteria

Refactor is acceptable when:

## Role architecture

- no global role-name-driven authorization
- multiple assignments compose correctly
- system roles and business roles are separated conceptually
- `SUPER_ADMIN` does not inherit business workflows

## Routes

- admin routes are separated from business workspace
- legacy `/workspace/iam/admin` has a migration strategy
- collaboration/review/project resources have canonical routes

## Navigation

- navigation is capability-aware
- hidden items do not load unnecessary business queries
- same Sidebar structure can support future features

## UI actions

- actions are capability-gated
- backend remains authoritative
- unsupported mutations are not faked

## Extensibility

Adding a new business role does not require rewriting the application shell.

Adding a new feature does not require adding role-specific branches everywhere.

---

# 31. Recommended agent report

After refactor, report:

```text
1. Role/capability model changes
2. Workspace/admin boundary changes
3. Routes added/migrated
4. Navigation registry changes
5. Sidebar changes
6. Legacy redirects
7. Role-name conditionals removed
8. Backend gaps
9. Verification commands
10. Remaining risks
11. Commit SHA
```

---

# Final rule

Use:

```text
ROLE
  ↓
ASSIGNMENT
  ↓
CAPABILITY + CONTEXT
  ↓
WORKSPACE COMPOSITION
  ↓
RESOURCE ACTION
```

Never use:

```text
ROLE NAME
  ↓
HARDCODED APP
```

This is the key rule that keeps the portal extensible as more personas, organizations, collaboration workflows, and future business capabilities are added.
