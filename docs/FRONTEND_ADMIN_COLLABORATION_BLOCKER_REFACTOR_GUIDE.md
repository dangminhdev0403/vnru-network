# FRONTEND / ADMIN / COLLABORATION BLOCKER REFACTOR GUIDE

Repository: `dangminhdev0403/vnru-network`  
Reviewed baseline: `9aa5f1cdd84710c7cd97538e8ae70e948d1d5c0d`

## 0. Purpose

This refactor is a **blocking cleanup pass** before implementing more Research Collaboration UI.

Do not expand Proposal / Review / Decision / Project UI until the items in this guide are resolved.

The objective is:

```text
clean route ownership
→ clean capability-driven navigation
→ clean admin/workspace separation
→ clean backend contracts
→ remove placeholder/fake runtime surfaces
→ then continue real collaboration UI
```

This is not a rewrite.

---

# 1. Blocker — Admin boundary is only partially separated

## Current problem

Canonical admin routes now exist:

```text
/admin/access
/admin/access/users
/admin/access/roles
/admin/access/assignments
/admin/audit
/admin/catalogs
```

But the runtime still couples admin routes to workspace page components.

Examples of current coupling:

```text
/admin/access/roles
→ imports app/(workspace)/workspace/iam/admin/RolePermissionsPage

/admin/access/users
→ imports app/(workspace)/workspace/iam/admin/IamClientPage

/admin/access/assignments
→ imports RolePermissionsPage
```

Also:

```text
app/(admin)/layout.tsx
→ WorkspaceShell
```

So URL ownership is separated, but component/shell ownership is not.

## Target

```text
frontend/app/
├── (workspace)/
│   └── workspace/...
│
├── (admin)/
│   └── admin/...
│
frontend/features/
├── iam/
├── admin/
│   ├── access/
│   ├── audit/
│   └── catalogs/
```

Admin pages must not import UI directly from another route tree.

## Required changes

Move/re-export reusable IAM admin UI into feature ownership, for example:

```text
frontend/features/admin/access/components/
  AccessOverview.tsx
  UserAdministration.tsx
  RolePermissionsPage.tsx
  RoleAssignmentsPage.tsx
```

or:

```text
frontend/features/iam/admin/
```

depending on current architecture conventions.

Then:

```text
app/(admin)/admin/access/users/page.tsx
→ feature component

app/(admin)/admin/access/roles/page.tsx
→ feature component
```

Do not make:

```text
app/admin → app/workspace
```

imports.

## Admin shell

Create a distinct Admin composition boundary if needed.

It may reuse shared low-level components:

```text
Header
theme
sidebar primitives
logo
tokens
```

but admin navigation should be admin-specific.

Suggested:

```text
components/shared/
  AppHeader.tsx
  NavigationShell.tsx

features/admin/
  AdminShell.tsx
  admin-nav-registry.ts
```

Do not duplicate visual design.

---

# 2. Blocker — Workspace registry exists but Sidebar does not consume it

## Current problem

A capability-aware registry exists:

```text
frontend/features/workspace/config/workspace-registry.ts
```

but `Sidebar.tsx` still builds static navigation arrays.

This means the registry is currently architectural decoration, not runtime behavior.

## Target

```text
session capabilities
        ↓
workspace registry
        ↓
filterNavSections()
        ↓
Sidebar
```

## Required changes

Refactor Sidebar so workspace navigation comes from the registry.

Do not duplicate navigation definitions in:

```text
workspace-registry.ts
Sidebar.tsx
Header.tsx
```

Keep a single presentation source where practical.

## Important

The collaboration link must not be unconditional.

Bad:

```text
/workspace/collaboration
visible for every authenticated user
```

Good:

```text
collab.* / reviews.* / projects.*
→ show relevant collaboration workspace entries
```

But use explicit capability lists rather than prefix matching if repo rules require explicit capability mapping.

Backend remains authoritative.

Sidebar filtering is UX only.

---

# 3. Blocker — Admin migration direction is wrong

## Current problem

The new canonical admin tree exists, but landing and legacy routing still prefer:

```text
/workspace/iam/admin
```

Current behavior includes:

```text
iam.roles.manage
→ /workspace/iam/admin
```

and:

```text
/admin/iam
→ /workspace/iam/admin
```

This keeps the old workspace admin route canonical.

## Target

Canonical:

```text
/admin/access
/admin/access/users
/admin/access/roles
/admin/access/assignments
```

Legacy:

```text
/workspace/iam/admin
```

should migrate toward `/admin/*`, not the reverse.

## Required migration

Recommended:

```text
/workspace/iam/admin?view=overview
→ /admin/access/users

/workspace/iam/admin?view=roles
→ /admin/access/roles

/admin/iam
→ /admin/access
```

Keep temporary redirects until tests/internal links are migrated.

## Landing resolver

Update:

```text
resolveLandingPath()
```

so IAM admin capability lands at:

```text
/admin/access
```

or the most appropriate canonical admin entry.

Do not force business users into admin because they have collaboration/review/project capabilities.

---

# 4. Blocker — Research Collaboration UI still contains forbidden financial/module copy

## Current problem

Production collaboration UI/types still contain old copy/fields such as:

```text
Module 03
Budget Cap
Ngân sách tối đa
Лимит финансирования
Quỹ phê duyệt tài trợ
budgetCapAmount
currency
```

These must not exist in the active collaboration runtime.

## Hard rule

Remove all financial workflow vocabulary and data fields from collaboration UI/runtime unless explicitly reopened later.

Forbidden in this scope:

```text
budget
funding amount
investment
sponsor
funding source
disbursement
financial reporting
financial approval
financial support workflow
```

## Correct language

Use:

```text
Cộng tác Nghiên cứu Song phương
Cơ hội Cộng tác
Đề xuất Cộng tác
Phản biện
Quyết định Cộng tác
Dự án Nghiên cứu
```

Do not display internal architecture numbering like:

```text
Module 02
Module 03
```

in user-facing UI.

## Types

Frontend types must match the real backend contract.

Do not keep stale fields just because previous design used them.

---

# 5. Blocker — Collaboration runtime surface is still placeholder-only

## Current problem

`/workspace/collaboration` currently renders a client view with:

```text
tabs
empty states
capability-based buttons
pipeline presentation
```

but main actions are not connected to real repository/resource/hook mutations.

This is acceptable as prototype HTML, but not as a runtime feature presented as implemented.

## Rule

For runtime:

```text
UI action
→ hook/resource
→ repository/BFF
→ actual backend
→ actual success/error
```

No fake interaction.

## If backend mutation does not exist

Choose one:

```text
hide action
disable action with accurate reason
show unsupported/backend-gap state
```

Do not:

```text
show success toast
fake local persistence
invent endpoint
```

## First real collaboration slice

Implement real **Opportunities** first.

Use the existing real backend contract:

```text
GET /api/v1/collab/opportunities
POST /api/v1/collab/opportunities
POST /api/v1/collab/opportunities/:id/publish
POST /api/v1/collab/opportunities/:id/close
```

Only expose mutations for matching capability/context.

---

# 6. Blocker — Frontend BFF contains unsupported/fake backend contracts

## Current problem

Frontend BFF currently exposes/proxies endpoints that the backend controller does not provide.

Examples:

```text
GET /api/collab/proposals
→ GET /api/v1/collab/proposals
```

but backend has:

```text
POST /api/v1/collab/proposals
GET  /api/v1/collab/proposals/:id
PUT  /api/v1/collab/proposals/:id
POST /api/v1/collab/proposals/:id/confirm
POST /api/v1/collab/proposals/:id/endorse
POST /api/v1/collab/proposals/:id/submit
POST /api/v1/collab/proposals/:id/screen
POST /api/v1/collab/proposals/:id/decision
```

Likewise current frontend BFF may expose:

```text
/api/collab/decisions
```

as a standalone list/create resource even though backend decision is a proposal action:

```text
POST /api/v1/collab/proposals/:id/decision
```

## Required changes

Delete unsupported BFF routes.

Only expose BFF routes that map to verified backend contracts.

## Proposal list

Do not create a fake proposal queue.

Until backend has a real bounded proposal list contract:

```text
support proposal detail by known ID
support actions by known ID
record proposal queue as backend gap
```

## Decision queue

Do not implement a standalone decision queue unless backend provides a real list/read contract.

A decision mutation alone does not justify a fake queue page.

---

# 7. Blocker — Header forwarding in BFF must preserve session correctly

## Risk

Do not use object spread on a `Headers` instance for backend forwarding.

Avoid:

```ts
headers: {
  ...backendHeaders(request),
  "content-type": "application/json",
}
```

`backendHeaders()` returns a `Headers` object; spreading it as a plain object may not preserve cookie/session headers as intended.

## Preferred

```ts
const headers = backendHeaders(request);
headers.set("content-type", "application/json");

await fetch(url, {
  method: "POST",
  headers,
  body: JSON.stringify(body),
});
```

Verify session cookie propagation in integration tests.

---

# 8. Blocker — Admin Catalog and Audit pages are fake/incorrect surfaces

## Catalog

Current admin catalog page contains hard-coded runtime counts such as:

```text
12 groups
84 organizations
1,240 keywords
```

These are mock/sample values.

Production runtime must not show invented values.

## Required action

Until backend catalog contract exists:

```text
remove route from navigation
or show a contract-accurate unavailable/empty state
```

Do not render fake counts/cards.

## Audit

Current `/admin/audit` reuses a self-service security page.

This is semantically incorrect.

Self-service security:

```text
/workspace/iam/security
```

Examples:

```text
my sessions
my account security
my MFA
```

Platform audit:

```text
/admin/audit
```

requires its own backend/admin capability and audit contract.

Until that exists:

```text
do not pretend SecurityClientPage is Audit
```

---

# 9. Workspace/persona architecture corrections

## Current registry issue

`WORKSPACE_PERSONAS` uses role-like keys:

```text
SUPER_ADMIN
RESEARCHER
REVIEWER
...
```

This can be acceptable for presentation labels, but must not become authorization logic.

Remember:

```text
role != persona
```

A user can have:

```text
RESEARCHER
+ REVIEWER
+ ORGANIZATION_REPRESENTATIVE
```

The UI should compose capabilities, not choose exactly one persona.

## Keep

```text
resolveUserPersonas(capabilities)
```

only as UI composition.

Do not use persona result to authorize requests.

---

# 10. Admin vs business workspace boundary

Use this rule consistently:

```text
ADMIN
= platform/access governance

WORKSPACE
= user/business work
```

Examples:

```text
/admin/access/users
/admin/access/roles
/admin/audit
```

are Admin.

But:

```text
/workspace/collaboration/proposals
/workspace/collaboration/reviews
/workspace/collaboration/decisions
/workspace/collaboration/projects
```

are business workspace.

Even `FOUNDATION_DECISION_MAKER` belongs in the business workspace when making a collaboration decision.

Senior business authority does not automatically mean platform admin.

---

# 11. Recommended target route tree

```text
frontend/app/
│
├── (workspace)/
│   ├── layout.tsx
│   └── workspace/
│       ├── page.tsx
│       ├── knowledge/
│       │   └── ...
│       │
│       ├── collaboration/
│       │   ├── page.tsx
│       │   ├── opportunities/
│       │   │   ├── page.tsx
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   ├── proposals/
│       │   │   └── [id]/
│       │   │       └── page.tsx
│       │   ├── reviews/
│       │   ├── decisions/
│       │   └── projects/
│       │
│       └── iam/
│           └── security/
│
└── (admin)/
    ├── layout.tsx
    └── admin/
        ├── access/
        │   ├── page.tsx
        │   ├── users/
        │   ├── roles/
        │   └── assignments/
        ├── audit/
        └── catalogs/
```

Only create route children that have real backend support.

---

# 12. Recommended frontend feature tree

```text
frontend/features/
│
├── auth/
├── iam/
├── workspace/
│   └── config/
│       └── workspace-registry.ts
│
├── admin/
│   ├── access/
│   ├── audit/
│   └── catalogs/
│
├── knowledge/
├── experts/
├── publications/
│
├── collaboration/
│   ├── components/
│   ├── repository.ts
│   ├── resources.ts
│   ├── hooks.ts
│   ├── types.ts
│   └── i18n/
│
├── reviews/
└── projects/
```

Pages should compose feature code.

Do not place reusable business components inside `app/*`.

---

# 13. Collaboration implementation order after blockers

Only after blockers 1–8 are fixed:

```text
1. Opportunities — real list/create/publish/close
2. Opportunity detail — only if backend supports read-by-id
3. Proposal create
4. Proposal detail by ID
5. Proposal revise/confirm/endorse/submit
6. Screening
7. Reviewer workspace
8. Collaboration decision
9. Project workspace
10. Knowledge/Expert bridges
```

Do not implement a queue page without a queue/list contract.

---

# 14. Proposal UI rule

The future Proposal Workspace must be one resource UI, not role-specific duplicates.

Example:

```text
Proposal detail
├── View
├── Revise            [capability + backend state]
├── Confirm pairing   [capability + participant scope]
├── Endorse           [capability + organization scope]
├── Submit            [capability + backend state]
├── Screen            [capability + platform scope]
└── Decide            [capability + platform/business decision scope]
```

Backend remains authoritative.

---

# 15. Review UI rule

Reviewer UI must use the review-service contract.

Preserve:

```text
proposalRef
reviewerId
boardRef
immutable anonymized snapshot
conflict declaration
scores
comments
submission state
```

Never use Module 2 expert data to reconstruct identities hidden by review anonymization.

---

# 16. Project UI rule

Project UI can use:

```text
proposalRef
decisionRef
members
milestones
deliverables
reports
outcomes
status
```

Do not add:

```text
budget
funding
financial progress
disbursement
financial report
```

---

# 17. Remove internal module numbering from user-facing UI

Internal planning documents may say:

```text
Module 1
Module 2
Module 3
```

Production UI should use business names.

Preferred VI:

```text
Quản trị Danh tính & Truy cập
Kho Tri thức & Danh bạ Chuyên gia
Cộng tác Nghiên cứu Song phương
Phản biện
Quyết định Cộng tác
Quản lý Dự án Nghiên cứu
```

Keep EN/RU equivalents.

---

# 18. Test corrections

Current tests must not claim route protection only because:

```text
file exists
proxy matcher exists
```

Add real checks for:

```text
unauthenticated → login
authenticated without capability → 403 / denied
authenticated with capability → route available
legacy route → canonical redirect
workspace registry filters links correctly
SUPER_ADMIN does not imply business capabilities
multiple business capabilities compose navigation correctly
```

## Required BFF contract tests

Verify:

```text
frontend BFF path
→ exact backend path
→ method
→ cookie forwarding
→ status passthrough
→ error passthrough
```

---

# 19. Documentation status correction

Do not mark the current alignment plan simply as:

```text
Status: implemented
```

while frontend integration remains incomplete.

Preferred:

```text
Status: IN PROGRESS

Backend domain normalization: substantially complete
Admin/workspace boundary: partial
Capability navigation integration: incomplete
Collaboration frontend: initial shell only
Knowledge → Collaboration bridges: not started
```

Update after real verification.

---

# 20. Required implementation sequence

Agent should execute in this exact order:

```text
A. Admin boundary
B. Legacy admin route migration
C. Wire workspace registry into Sidebar
D. Correct capability landing
E. Remove fake admin catalog/audit surfaces
F. Remove all financial/module-number UI copy
G. Delete unsupported BFF contracts
H. Fix backend header/session forwarding
I. Re-test IAM/admin/workspace
J. Implement real Opportunities data flow
K. Re-audit before Proposal UI
```

Stop after J and report before expanding further if major backend contract gaps appear.

---

# 21. Acceptance criteria

## Admin

Pass when:

- `/admin/*` is canonical for platform administration.
- Admin pages do not import route-owned components from `app/(workspace)`.
- Legacy IAM admin URLs redirect safely.
- Admin navigation is separate from business workspace navigation.
- Admin actions are capability-gated.

## Workspace

Pass when:

- Sidebar uses capability-aware registry at runtime.
- Collaboration link is not globally visible without relevant access.
- Multi-role users receive composed navigation.
- No frontend role-name authorization is introduced.

## Collaboration

Pass when:

- no `Module 03` label appears in production UI.
- no budget/funding/financial fields or wording remain.
- BFF paths correspond exactly to backend contracts.
- no fake proposal/decision list contract exists.
- no success interaction is faked.
- Opportunities are the first real data-driven surface.

## Admin placeholders

Pass when:

- no hard-coded catalog counts remain.
- Audit is not implemented using self-service security UI.
- unsupported admin surfaces are hidden/disabled/accurately unavailable.

## Tests

Pass when actual commands run successfully:

```text
lint
typecheck
tests
build
repository-specific UI/design gate
git diff --check
```

Do not report PASS without output.

---

# 22. Agent final report format

After completion, return:

```text
1. Commit SHA
2. Summary
3. Admin boundary changes
4. Route migrations / redirects
5. Workspace registry integration
6. Sidebar capability behavior
7. Financial/module copy removed
8. Unsupported BFF routes removed
9. Session/header forwarding fix
10. Placeholder admin surfaces removed or gated
11. Opportunities real integration status
12. Backend gaps
13. Tests run + exact PASS/FAIL
14. Remaining blockers
```

---

# Final rule

Before continuing Research Collaboration UI, the repository must obey:

```text
REAL CAPABILITY
+ REAL CONTEXT
+ REAL ROUTE
+ REAL BACKEND CONTRACT
= REAL UI ACTION
```

Never:

```text
PRETTY UI
+ INVENTED CONTRACT
+ MOCK SUCCESS
= PRODUCTION FEATURE
```
