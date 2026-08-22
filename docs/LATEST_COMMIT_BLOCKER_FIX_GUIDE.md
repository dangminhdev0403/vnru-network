# LATEST COMMIT BLOCKER FIX GUIDE

Repository: `dangminhdev0403/vnru-network`  
Reviewed commit: `1fc6ab935f45e2b4474407d7fd24632c84b208d4`

## Purpose

This guide is the **second blocker-fix pass** after the frontend/admin/collaboration refactor.

Do **not** expand Proposal, Review, Decision, or Project UI during this pass.

The goal is to make the current foundation truthful and internally consistent:

```text
Admin boundary
→ navigation ownership
→ canonical routes
→ exact backend contracts
→ truthful runtime surfaces
→ meaningful tests
```

The repository should only move to deeper collaboration UI after the items below pass.

---

# 1. Admin shell is still not separated at runtime

## Current state

Canonical `/admin/*` routes exist, but:

```text
frontend/app/(admin)/layout.tsx
→ WorkspaceShell
```

The same workspace Sidebar is therefore still being used inside Admin.

`frontend/components/shared/Sidebar.tsx` also still hard-codes navigation arrays.

This means:

```text
/admin/*
```

is a different URL tree, but not yet a genuinely different product surface.

## Target

Keep shared visual primitives, but separate navigation composition:

```text
Shared visual shell primitives
├── Header
├── layout frame
├── theme
├── logo
└── responsive sidebar container

Workspace navigation
→ WORKSPACE_NAV_REGISTRY

Admin navigation
→ ADMIN_NAV_REGISTRY
```

Recommended composition:

```text
frontend/components/shared/
├── AppShell.tsx
├── Header.tsx
└── SidebarFrame.tsx

frontend/features/workspace/
├── components/
│   └── WorkspaceShell.tsx
└── config/
    └── workspace-registry.ts

frontend/features/admin/
├── components/
│   └── AdminShell.tsx
└── config/
    └── admin-nav-registry.ts
```

Exact filenames may follow the existing repository conventions.

## Required behavior

```text
/workspace/*
→ workspace navigation only

/admin/*
→ admin navigation only
```

Do not duplicate the design system.

---

# 2. Wire the registries into real navigation

## Current problem

Both registries exist:

```text
frontend/features/workspace/config/workspace-registry.ts
frontend/features/admin/config/admin-nav-registry.ts
```

but `Sidebar.tsx` still defines static sections.

The registry is not currently authoritative for presentation.

## Required change

Workspace:

```text
current session capabilities
        ↓
filterNavSections(capabilities)
        ↓
Workspace Sidebar
```

Admin:

```text
current session capabilities
        ↓
filterAdminNavSections(capabilities)
        ↓
Admin Sidebar
```

If `filterAdminNavSections` does not exist, add the equivalent capability filter.

## Important

There must be only one real source for each navigation tree.

Avoid:

```text
registry + hard-coded Sidebar copy
```

---

# 3. Remove legacy admin links from workspace navigation

## Current problem

`WORKSPACE_NAV_REGISTRY` still contains:

```text
/workspace/iam/admin
```

and the static Sidebar still links:

```text
/workspace/iam/admin?view=overview
/workspace/iam/admin?view=roles
```

## Target

Workspace should not expose platform-admin routes as workspace business navigation.

Canonical admin links:

```text
/admin/access
/admin/access/users
/admin/access/roles
/admin/access/assignments
```

## Migration rule

Legacy URLs may exist temporarily only as redirects:

```text
/workspace/iam/admin
→ /admin/access

/workspace/iam/admin?view=overview
→ /admin/access/users

/workspace/iam/admin?view=roles
→ /admin/access/roles
```

Do not render the legacy page as an active UI surface.

---

# 4. Remove route-owned component duplication

## Current problem

A new feature-owned component exists:

```text
frontend/features/admin/access/components/RolePermissionsPage.tsx
```

but the old route-owned version still exists:

```text
frontend/app/(workspace)/workspace/iam/admin/RolePermissionsPage.tsx
```

There is also:

```text
frontend/features/admin/access/components/UserAdministration.tsx
```

which still imports:

```text
@/app/(workspace)/workspace/iam/admin/IamClientPage
```

This violates the intended ownership direction.

## Target dependency direction

Allowed:

```text
app route
→ feature component
→ repository/hook
```

Not allowed:

```text
feature component
→ app route component
```

## Required changes

Move the active user-administration implementation into feature ownership, for example:

```text
frontend/features/admin/access/components/UserAdministration.tsx
```

with its actual implementation there.

Then:

```text
app/(admin)/admin/access/users/page.tsx
→ UserAdministration
```

Delete or reduce old workspace-admin components to redirect-only compatibility.

No duplicated active implementations.

---

# 5. Opportunities GET contract is currently wrong

## Backend source of truth

Backend query supports:

```text
limit
cursor
```

It does **not** support:

```text
offset
```

Current backend parser rejects unknown query parameters.

## Current frontend problem

The BFF currently sends:

```text
?limit=20&offset=0
```

This can produce a backend `400`.

## Required fix

BFF:

```text
GET /api/collab/opportunities?limit=20
GET /api/collab/opportunities?limit=20&cursor=<cursor>
```

Forward only supported query parameters.

Suggested BFF logic:

```ts
const limit = url.searchParams.get("limit") ?? "20";
const cursor = url.searchParams.get("cursor");

const target = new URL(collabServiceUrl("api/v1/collab/opportunities"));
target.searchParams.set("limit", limit);

if (cursor) {
  target.searchParams.set("cursor", cursor);
}
```

Do not introduce offset pagination unless the backend contract is deliberately changed first.

---

# 6. Opportunities response type is currently wrong

## Backend response item

The active backend list maps opportunity items to:

```text
id
title
description
state
createdAt
updatedAt
```

## Current frontend type expects

```text
id
code
title
description
status
openDate
closeDate
createdAt
updatedAt
```

The following fields are not supported by the current backend contract:

```text
code
status
openDate
closeDate
```

`state` is the backend field, not `status`.

## Required frontend type

Align to the current real contract:

```ts
export type OpportunityState =
  | "DRAFT"
  | "PUBLISHED"
  | "CLOSED";

export interface ResearchOpportunity {
  id: string;
  title: string;
  description?: string | null;
  state: OpportunityState;
  createdAt: string;
  updatedAt: string;
}
```

Use the exact backend optionality after inspecting runtime DTOs.

## UI change

Opportunity cards should render only real fields.

Example:

```text
Title
Description
State
Created / Updated
```

Do not fabricate:

```text
Opportunity code
Open date
Close date
```

until the backend contract supports them.

---

# 7. Create Opportunity request is currently wrong

## Backend request

Current backend expects:

```ts
{
  id: string;          // valid UUID
  title: string;
  description?: string;
}
```

## Current frontend sends

```ts
{
  code,
  title,
  description,
  openDate,
  closeDate
}
```

This is not compatible.

## Required fix

For this refactor, align the frontend to the current backend.

Example:

```ts
{
  id: crypto.randomUUID(),
  title,
  description
}
```

Only use `crypto.randomUUID()` where browser/runtime support is already acceptable for this frontend.

Alternative:

Move UUID generation to an agreed backend/BFF contract **only if that contract is intentionally changed and tested**.

Do not silently invent `code`, `openDate`, or `closeDate`.

## Create modal

Current modal should become approximately:

```text
Title
Description
```

The UUID should normally not be a user-facing business field.

---

# 8. Opportunity create success must be real

After create:

```text
POST BFF
→ backend 2xx
→ invalidate/refetch opportunity list
→ show success
```

If backend returns:

```text
400
401
403
409
500
```

show the actual failure state.

Do not locally append a fake opportunity to the list unless the returned backend resource is used as the authoritative result.

---

# 9. Proposal frontend contract is also mismatched

## Backend create proposal contract

Current backend expects:

```ts
{
  id: string;
  opportunityId: string;
  content: string;
  vnParticipant: {
    userId: string;
    organizationRef: string;
  };
  ruParticipant: {
    userId: string;
    organizationRef: string;
  };
}
```

## Current frontend repository uses

```ts
{
  opportunityRef,
  title,
  summary,
  leadResearcherId,
  counterpartResearcherId,
  leadOrganizationRef,
  counterpartOrganizationRef
}
```

These are two different contracts.

## Required action in this pass

Do **not** build more Proposal UI.

First normalize:

```text
frontend types
repository payload
BFF payload
backend payload
```

to the existing backend contract.

Suggested frontend draft type:

```ts
interface CreateProposalInput {
  id: string;
  opportunityId: string;
  content: string;
  vnParticipant: {
    userId: string;
    organizationRef: string;
  };
  ruParticipant: {
    userId: string;
    organizationRef: string;
  };
}
```

Exact names must remain aligned 1:1 with backend unless an explicit API redesign is performed.

---

# 10. Proposal detail route must not be claimed before it exists

A BFF route exists for:

```text
/api/collab/proposals/[id]
```

That does **not** automatically mean a product page exists.

Before claiming Proposal Workspace is implemented, verify an actual page such as:

```text
/workspace/collaboration/proposals/[id]
```

exists and is wired to the BFF.

During this blocker pass:

```text
BFF readiness != UI readiness
```

Do not expose navigation to a route that does not exist.

---

# 11. Remove inactive Proposal / Screening / Decision tabs from runtime hub

## Current issue

The collaboration hub currently renders tabs for:

```text
Proposals
Screening
Decisions
```

but they only display static empty placeholders.

This creates the impression that these product surfaces exist.

## Required behavior

Until a real list/read contract and route exists:

```text
do not render the tab
```

or render a clearly non-interactive development status only in development tooling, not production product UI.

Production navigation should expose only implemented surfaces.

## Current allowed collaboration surface

At this stage:

```text
Collaboration Hub
└── Opportunities
```

is enough if Opportunities is real.

---

# 12. Do not render an unsupported proposal-create button

Current collaboration header includes a Proposal button based on:

```text
collab.proposals.create
```

but the button currently has no real action.

Remove it until:

```text
real create form
+ exact backend payload
+ context handling
+ error states
```

are implemented.

Capability alone does not justify displaying a dead action.

---

# 13. Collaboration vocabulary cleanup

Financial fields were removed, but review the remaining business language.

Preferred user-facing wording:

```text
Cộng tác Nghiên cứu Song phương
Cơ hội Cộng tác
Đề xuất Cộng tác
Phản biện
Quyết định Cộng tác
Dự án Nghiên cứu
```

Avoid language that implies financial approval.

Review wording such as:

```text
Quỹ phê duyệt
Foundation Approved
```

If the business authority is a Foundation decision maker, this may remain an organizational label, but it must describe a **collaboration decision**, not funding approval.

Preferred:

```text
Quỹ chấp thuận cộng tác
Foundation collaboration approved
```

or equivalent locale wording.

No budget/funding meaning should be reintroduced.

---

# 14. Admin Audit is still not backed by a read contract

## Current UI problem

`/admin/audit` now displays hard-coded audit categories/source identifiers such as:

```text
auth-service.role_permission_audit
auth-service.role_assignment_audit
auth-service.user_status_audit
```

The verified auth Prisma schema currently exposes:

```text
SecurityAuditEvent
```

The frontend does not yet have a verified audit-list/read API contract.

## Required change

Until a real audit read contract exists, `/admin/audit` must be an explicit backend-gap state.

Example:

```text
Nhật ký kiểm toán

Dịch vụ hiện ghi nhận sự kiện kiểm toán ở backend.
Frontend chưa có API đọc danh sách sự kiện kiểm toán.
```

Do not display invented source names as if they were queryable data sources.

Do not render fake rows/counts.

---

# 15. Admin Catalog is informational only

The fake numeric metrics were correctly removed.

However, `/admin/catalogs` currently remains a static informational surface.

That is acceptable only if it is presented as:

```text
capability / architecture information
```

not as an implemented catalog-management feature.

If no catalog management API exists:

```text
remove admin navigation entry
```

or label the page clearly as unavailable/read-only architecture status.

Do not imply the user can manage catalog data.

---

# 16. Admin navigation capability mapping must match actual backend capabilities

Current admin registry uses:

```text
iam.roles.manage
```

for:

```text
catalogs
audit
```

That should not be assumed automatically.

Before exposing those entries, verify the actual backend permission model.

If there is no separate capability:

```text
do not invent one
```

but also do not imply `iam.roles.manage` authorizes unrelated catalog/audit business operations.

Until contracts are defined:

```text
hide unsupported admin items
```

---

# 17. Workspace registry should not expose legacy admin route

Change:

```text
access_admin
href: /workspace/iam/admin
```

Either remove admin from `WORKSPACE_NAV_REGISTRY` entirely or point users to a separate Admin entry outside business workspace composition.

Preferred separation:

```text
Workspace Sidebar
→ business + self-service

Admin Sidebar
→ platform administration
```

If there is a global "Switch to Admin" control, it should be capability-aware and point to:

```text
/admin/access
```

---

# 18. Landing resolver: keep capability-first, but avoid broad prefix assumptions where possible

Current landing resolver uses:

```text
c.startsWith("collab.")
c.startsWith("reviews.")
c.startsWith("projects.")
```

This is acceptable as a temporary landing heuristic, but explicit surface capability mapping is safer.

Preferred eventual approach:

```text
resolveLandingPath()
→ use route/surface registry
```

Do not change this during the blocker pass if it introduces unnecessary scope.

The priority is:

```text
no role-name landing
```

which is already correct.

---

# 19. Route-level authorization must be tested for real

## Current weak test

A test named approximately:

```text
canonical admin routes exist and are protected
```

currently checks source text/file existence and proxy matcher presence.

That does not prove capability authorization.

## Required tests

At minimum verify behavior conceptually equivalent to:

```text
no session
→ redirect/login

session without admin capability
→ denied / 403

session with iam.users.manage
→ users administration available

session with iam.roles.manage
→ roles administration available
```

For business routes:

```text
no relevant collaboration capability
→ route denied or product access denied

relevant capability
→ route may load
```

Backend must still reject unauthorized API actions.

---

# 20. Add BFF contract tests

Test the actual mapping:

## Opportunities

```text
Frontend:
GET /api/collab/opportunities?limit=20&cursor=X

Backend:
GET /api/v1/collab/opportunities?limit=20&cursor=X
```

Verify:

```text
method
query
cookie/session forwarding
status passthrough
response passthrough
```

## Create opportunity

Verify exact payload:

```text
id
title
description
```

No:

```text
code
openDate
closeDate
```

## Proposal

Verify create contract matches backend exactly before building UI.

---

# 21. Error normalization

Current repository code may read:

```text
err.error
```

but backend errors can be structured like:

```json
{
  "error": {
    "code": "...",
    "message": "..."
  }
}
```

Normalize errors centrally.

Example concept:

```ts
function getApiErrorMessage(payload: unknown): string
```

Support:

```text
error as string
error.message
message
fallback
```

Do not display:

```text
[object Object]
```

---

# 22. Documentation status is still inaccurate

Current:

```text
Status: implemented
```

in the alignment plan is too strong.

Change to something like:

```text
Status: IN PROGRESS

Backend domain normalization: complete for current scope
Admin route migration: partial
Admin/workspace navigation separation: incomplete
Collaboration Opportunities integration: being aligned
Proposal frontend: not yet ready
Review/Decision/Project frontend: not started
```

Only mark fully implemented after actual verification.

---

# 23. Exact execution order

Execute in this order:

```text
1. Create real AdminShell navigation composition
2. Wire ADMIN_NAV_REGISTRY
3. Wire WORKSPACE_NAV_REGISTRY
4. Remove static Sidebar navigation
5. Remove legacy workspace-admin navigation links
6. Convert /workspace/iam/admin into redirects
7. Move UserAdministration implementation out of app route tree
8. Delete duplicate active admin components
9. Fix Opportunities BFF cursor query
10. Fix ResearchOpportunity frontend type
11. Fix Create Opportunity payload
12. Remove unsupported code/openDate/closeDate UI
13. Remove dead Proposal button
14. Remove placeholder Proposal/Screening/Decision tabs
15. Normalize Proposal create types/repository only
16. Downgrade Audit to explicit backend-gap state
17. Hide Catalog/Audit nav if no verified management/read capability
18. Strengthen tests
19. Update docs status
20. Run full verification
```

Do not proceed to deeper collaboration UI before step 20 passes.

---

# 24. Files to inspect first

Primary files:

```text
frontend/app/(admin)/layout.tsx

frontend/components/shared/Sidebar.tsx
frontend/components/shared/WorkspaceShell.tsx

frontend/features/workspace/config/workspace-registry.ts
frontend/features/admin/config/admin-nav-registry.ts

frontend/app/(workspace)/workspace/iam/admin/page.tsx
frontend/app/(workspace)/workspace/iam/admin/IamClientPage.tsx
frontend/app/(workspace)/workspace/iam/admin/RolePermissionsPage.tsx

frontend/features/admin/access/components/UserAdministration.tsx
frontend/features/admin/access/components/RolePermissionsPage.tsx

frontend/app/api/collab/opportunities/route.ts
frontend/app/api/collab/proposals/route.ts
frontend/app/api/collab/proposals/[id]/route.ts

frontend/features/collaboration/types.ts
frontend/features/collaboration/repository.ts
frontend/features/collaboration/hooks.ts
frontend/features/collaboration/components/CollaborationWorkspaceView.tsx

services/grant-service/src/grant.controller.ts
services/grant-service/src/grant.service.ts
services/grant-service/src/opportunity-query.ts

frontend/app/(admin)/admin/audit/page.tsx
frontend/app/(admin)/admin/catalogs/page.tsx

frontend/tests/workspace-registry.test.mjs

docs/MODULE_1_2_3_ALIGNMENT_PLAN.md
```

Do not blindly modify unrelated files.

---

# 25. Forbidden patterns scan

Before and after changes, search active frontend runtime for:

```text
/workspace/iam/admin
offset=
budgetCap
currency
openDate
closeDate
opportunityRef
leadResearcherId
counterpartResearcherId
auth-service.role_permission_audit
auth-service.role_assignment_audit
auth-service.user_status_audit
Module 03
```

Important:

Some terms may legitimately exist in historical docs/tests.

Classify each hit before changing it:

```text
ACTIVE RUNTIME
LEGACY REDIRECT
TEST
DOC
MIGRATION/HISTORY
```

Do not blindly delete history.

---

# 26. Acceptance gate

## Admin boundary

PASS only when:

```text
/admin/* uses admin navigation
/workspace/* uses workspace navigation
feature code does not import app route components
legacy workspace admin URLs redirect
no active duplicated admin implementation
```

## Workspace registry

PASS only when:

```text
Sidebar consumes registry
capability filtering is visible at runtime
collaboration is hidden without relevant capability
admin routes are not mixed into business workspace navigation
```

## Opportunities

PASS only when:

```text
GET uses limit + cursor
response uses state
UI does not read code/openDate/closeDate
POST sends id/title/description
actual backend success drives success UI
actual backend error drives error UI
```

## Proposal foundation

PASS only when:

```text
frontend CreateProposalInput matches backend
no fake proposal list exists
no dead create button exists
no Proposal product page is claimed before route/data flow exists
```

## Audit/Catalog

PASS only when:

```text
no invented audit source identifiers are shown as live data
no fake metrics
unsupported surfaces are hidden or explicitly marked unavailable
```

## Verification

Run the repository-prescribed commands.

At minimum report actual output for:

```text
frontend lint
frontend typecheck
frontend tests
frontend build
git diff --check
npx impeccable detect
```

Also run affected service tests if backend/BFF contract changes require them.

Do not write:

```text
PASS
67/67
implemented
```

unless the actual command output was observed.

---

# 27. Required agent report

Return:

```text
Commit SHA

1. AdminShell
2. Workspace navigation registry integration
3. Admin navigation registry integration
4. Legacy route redirects
5. Route-owned component cleanup
6. Opportunities GET contract
7. Opportunities POST contract
8. Opportunity frontend type changes
9. Proposal contract normalization
10. Placeholder UI removed
11. Audit/Catalog handling
12. Tests actually executed
13. Exact PASS/FAIL results
14. Remaining backend gaps
15. Remaining frontend blockers
```

---

# Final rule

The next UI phase can begin only when:

```text
ROUTE IS REAL
+
CAPABILITY IS REAL
+
PAYLOAD IS REAL
+
BACKEND CONTRACT IS REAL
+
SUCCESS/ERROR IS REAL
```

No placeholder surface should be presented as a completed product feature.
