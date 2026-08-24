# VN–RU Portal — PRE-TEST FOCUSED FIX GUIDE

> Repository: `dangminhdev0403/vnru-network`  
> Baseline branch: `master`  
> Baseline commit: `5f55656428218785f9b0cb1f2140c86224c317a9`  
> Commit message: `feat(workspace): integrate full prototype v3 modules into shared Next.js shell with widescreen typography`
>
> Purpose: **fix only the blockers that would make real flow testing misleading or invalid.**
>
> This guide is PRE-EXECUTION. Do not expand product capability while applying it.

---

# 1. Current-state conclusion

The latest commit integrated the Prototype V3 role surfaces into the Next.js workspace, but the current runtime truth remains:

```text
CURRENT RUNTIME
├── frontend
├── auth-service
├── Keycloak
└── auth_db
```

The repository documentation currently states that Knowledge, Collaboration, Review, Project, Academic, Technology and Analytics runtimes are not present.

Therefore, before real testing, the product must distinguish:

```text
REAL / TESTABLE NOW
Auth
Session
Active Context
Capabilities
Account
Security
IAM Administration
Audit

UI PREVIEW ONLY
Researcher business workflow
Reviewer business workflow
Organization business workflow
Enterprise / 2+2
Leadership Analytics
```

Do NOT restore removed backend services just to make the new UI appear complete.

---

# 2. What is wrong in the latest commit

## P0-01 — `/workspace` is currently an architecture/demo hub, not a user workspace

Current:

```text
/workspace
→ PrototypeHub
→ Public
→ Researcher
→ Reviewer
→ Organization
→ Enterprise
→ Leadership
→ Governance
```

This is useful as a design showcase but wrong as the normal authenticated entry.

A real user must not see a menu asking them to choose another role arbitrarily.

### Required fix

Move the architecture showcase out of the live workspace entry.

Recommended:

```text
/demo/workspace
```

or make it development-only.

Canonical `/workspace` behavior:

```text
authenticated user
→ read /auth/me
→ resolve active context + capabilities
→ redirect to allowed primary workspace
```

Examples:

```text
RESEARCHER
→ /workspace/researcher

REVIEWER
→ /workspace/reviewer

ORGANIZATION_REPRESENTATIVE
→ /workspace/organization

SUPER_ADMIN
→ /admin/access
```

If a user genuinely has multiple active assignments, `/workspace` may show an authorized context/persona chooser, but never expose unowned roles.

---

# 3. P0-02 — Workspace navigation currently exposes role routes without capability gates

`WORKSPACE_NAV_REGISTRY` currently includes:

```text
/workspace/researcher
/workspace/reviewer
/workspace/organization
/workspace/enterprise
/workspace/leadership
```

without `requiredCapabilities`.

That means navigation filtering cannot prevent one persona from seeing unrelated role entries.

This is an ACCESS-BOUNDARY blocker.

## Required fix

Gate current implemented personas using capabilities that already exist.

Suggested mapping:

```text
/workspace/researcher
requires at least one of:
- collab.proposals.create
- projects.projects.view
- knowledge.workspace.view

/workspace/reviewer
requires:
- reviews.assignments.view_assigned

/workspace/organization
requires:
- collab.proposals.endorse
```

Do NOT invent new capabilities for Enterprise or Leadership.

Because the current auth policy does not define real Enterprise/Leadership capabilities, these must NOT appear in normal live navigation.

For now:

```text
Enterprise
Leadership
→ preview/demo-only
```

If they remain available for presentation, keep them under an explicit demo/preview entry, not capability-authorized production navigation.

---

# 4. P0-03 — Governance canonical route is inconsistent

Current registry / PrototypeHub references:

```text
/governance
```

but the actual governance implementation is under:

```text
/admin
/admin/access
/admin/access/users
/admin/access/roles
/admin/access/assignments
/admin/audit
```

and `/admin` already redirects to `/admin/access`.

## Required fix

Canonicalize Governance navigation to:

```text
/admin
```

or directly:

```text
/admin/access
```

Recommended:

```text
member workspace
→ optional "Quản trị hệ thống" bridge
→ /admin

/admin
→ redirect /admin/access
```

Remove `/governance` from live registry unless a deliberate compatibility redirect is added.

Do not create a second Governance tree.

---

# 5. P0-04 — `/account` and `/security` are referenced but not present as canonical routes

Current state includes legacy redirects:

```text
/workspace/iam
→ /account

/workspace/iam/security
→ /security
```

But the canonical `/account` and `/security` route directories are currently absent.

This creates broken redirects / 404 behavior.

## Required fix

Create canonical self-service routes:

```text
/account
/security
```

Reuse existing account/security UI and auth APIs.

Do NOT reintroduce IAM as a member-facing business module.

Keep compatibility redirects:

```text
/workspace/iam
→ /account

/workspace/iam/security
→ /security

/workspace/iam/admin
→ /admin/access
```

The user-facing sidebar should contain:

```text
Tài khoản
Bảo mật & Phiên đăng nhập
```

not "IAM".

---

# 6. P0-05 — Current UI violates the no-financial-domain decision

Known examples in the new prototype include wording such as:

```text
"tiến độ giải ngân"
"Cơ hội Tài trợ & Hợp tác Song phương"
```

These are invalid current-product UI terms.

## Required fix

Replace implementation-facing terminology with non-financial collaboration language.

Examples:

```text
"theo dõi tiến độ giải ngân & thực hiện"
→ "theo dõi tiến độ thực hiện"

"Cơ hội Tài trợ & Hợp tác Song phương"
→ "Cơ hội Cộng tác Nghiên cứu Song phương"
```

Run a focused scan across the latest frontend for:

```text
tài trợ
giải ngân
funding
grant amount
budget
investment
payment
financial
finance
ROI
royalty
deal value
```

Do not blindly replace historical/source documentation. This fix concerns CURRENT implementation-facing UI.

---

# 7. P0-06 — Prototype currently fakes backend success

Example:

```text
"Gửi lời mời ngay"
→ closes modal
→ toast "Đã gửi lời mời Co-PI..."
```

But no collaboration backend exists in the current runtime.

This makes a live demo misleading.

## Required fix

Classify every action as one of:

### REAL

Backed by the current runtime.

Examples:

```text
login
logout
auth/me
session revoke
context switch
admin role assignment
audit query
```

### LOCAL PREVIEW

Frontend-only interaction.

Use explicit language such as:

```text
"Mô phỏng bước mời"
"Xem trạng thái mẫu"
"Preview luồng"
```

Toast:

```text
"Đã cập nhật trạng thái demo cục bộ — chưa gửi backend"
```

### DISABLED / FUTURE

Use when even local simulation has little value.

Never display:

```text
"Đã gửi"
"Đã nộp"
"Đã xác nhận"
"Đã tạo dự án"
```

unless the real API succeeds.

---

# 8. P0-07 — UI preview data must not be mistaken for authenticated user data

The role pages contain names, KPI counts, proposal counts, project state and organizations hard-coded in prototype components.

That is acceptable for a UI preview but not acceptable as if returned from `/auth/me` or a business API.

## Required fix

Add a subtle preview contract on non-runtime business pages:

```text
Dữ liệu minh họa · UI Preview
```

Do not add this label to real auth/admin surfaces.

Any number such as:

```text
4 proposals
18 co-authors
3 seminars
```

must be visibly understood as preview/demo data until backed by an API.

Do not use fake platform-wide statistics.

---

# 9. P0-08 — Role boundary must be enforced at route level, not only sidebar level

Fixing the sidebar is necessary but insufficient.

A Researcher could manually enter:

```text
/workspace/reviewer
```

Frontend route protection must resolve current user capability/context.

## Required fix

Introduce/reuse a single route-authorization mechanism for workspace role entry.

Conceptually:

```text
/workspace/researcher
→ require researcher capability family

/workspace/reviewer
→ require reviews.assignments.view_assigned

/workspace/organization
→ require collab.proposals.endorse

/admin/*
→ require IAM admin capability appropriate to each surface
```

Do not duplicate authorization logic inside every visual component if a shared server-side guard/layout can enforce it.

Frontend authorization is defense-in-depth only.

Backend remains the security boundary.

---

# 10. P1 — Sidebar semantics still treat roles like modules

Current labels include:

```text
KHÔNG GIAN LÀM VIỆC
Researcher
Reviewer
Organization
Enterprise
Leadership
```

This is still structurally close to a demo role switcher.

## Fix after P0 blockers

For an ordinary single-context user, sidebar should show TASK AREAS, not all personas.

Researcher example:

```text
TỔNG QUAN
  Tổng quan

NGHIÊN CỨU
  Tri thức & Chuyên gia
  Cộng tác nghiên cứu
  Dự án của tôi

HỌC THUẬT
  Học thuật & Trao đổi   [only if enabled]

────────
Tài khoản
Bảo mật
```

Reviewer example:

```text
TỔNG QUAN
  Tổng quan phản biện

PHẢN BIỆN
  Hồ sơ được phân công

────────
Tài khoản
Bảo mật
```

Organization example:

```text
TỔNG QUAN
  Tổng quan tổ chức

TỔ CHỨC
  Đề xuất cần xác nhận
  Dự án liên quan
  Hoạt động tổ chức

────────
Tài khoản
Bảo mật
```

Do not implement future task groups before capabilities/routes exist.

---

# 11. P1 — Documentation must describe runtime truth correctly

Current docs saying "Module 1/runtime auth only" should NOT be rewritten to claim Prototype V3 business capabilities are implemented.

Instead document the distinction:

```text
CURRENT RUNTIME
Auth / IAM / sessions / account / admin / audit

INTEGRATED UI PREVIEW
Role-based prototype surfaces

NOT CURRENT BACKEND
Knowledge
Collaboration
Academic
Technology
Analytics
```

This prevents the next agent from assuming that a pretty page means a backend capability exists.

Update only the active docs that describe current state.

Do not resurrect superseded Module 2–6 implementation claims.

---

# 12. Exact files to inspect first

Before editing, inspect at minimum:

```text
AGENTS.md
docs/README.md
docs/ARCHITECTURE.md
docs/RULES.md
docs/PORTAL_FOUNDATION_REFACTOR.md

frontend/AGENTS.md
frontend/docs/ARCHITECTURE.md
frontend/docs/RULES.md
frontend/docs/RUNTIME_UI_GUIDE.md

frontend/app/(workspace)/layout.tsx
frontend/app/(workspace)/workspace/page.tsx
frontend/app/(workspace)/workspace/researcher/page.tsx
frontend/app/(workspace)/workspace/reviewer/page.tsx
frontend/app/(workspace)/workspace/organization/page.tsx

frontend/components/shared/WorkspaceShell.tsx
frontend/features/workspace/components/WorkspaceSidebar.tsx
frontend/features/workspace/config/workspace-registry.ts

frontend/features/prototype-v3/components/PrototypeHub.tsx
frontend/features/prototype-v3/components/ResearcherWorkspace.tsx
frontend/features/prototype-v3/components/ReviewerWorkspace.tsx
frontend/features/prototype-v3/components/OrganizationWorkspace.tsx
frontend/features/prototype-v3/components/EnterpriseWorkspace.tsx
frontend/features/prototype-v3/components/LeadershipWorkspace.tsx

frontend/app/(admin)/admin/page.tsx
frontend/app/(admin)/admin/access/*
frontend/app/(admin)/admin/audit/*

frontend/app/(workspace)/workspace/iam/*
```

Also inspect the current auth guard/session/current-user utilities before inventing a new guard.

---

# 13. Focused implementation slices

Do not perform one giant refactor.

## Slice A — Route truth

Fix only:

```text
/workspace entry behavior
/admin canonical Governance
/account
/security
legacy IAM redirects
```

Verify before moving on.

## Slice B — Access/role navigation

Fix:

```text
workspace registry capability gates
role-specific visible navigation
direct-route guards
```

Verify with real accounts.

## Slice C — Interaction honesty

Fix:

```text
fake success toasts
preview labels
disabled/future actions
```

## Slice D — Scope terminology

Remove current UI finance regressions.

## Slice E — Docs reconciliation

Update current-state docs after code behavior is stable.

---

# 14. Things NOT to do in this pre-test fix

Do NOT:

```text
restore collaboration-service
restore knowledge-service
create academic-service
create technology-service
create analytics-service

invent Enterprise capabilities
invent Leadership capabilities

rewrite authentication
replace Keycloak
change database architecture

redesign all pages
add new dashboard KPIs
build 2+2 backend
implement research proposal backend

fix unrelated styling
change dependencies unless absolutely required
```

The purpose is to make testing **truthful**, not to make the whole product complete.

---

# 15. Verification after the focused fix

Only after P0 items are resolved, run:

```text
pnpm --dir frontend lint
pnpm --dir frontend build
```

Then start:

```text
PostgreSQL
Keycloak
auth-service
frontend
```

And verify these first:

```text
/login
/workspace
/account
/security
/admin
/admin/access
/admin/audit
```

Then test roles:

```text
RESEARCHER
REVIEWER
ORGANIZATION_REPRESENTATIVE
SUPER_ADMIN
```

Expected:

```text
Researcher
- no Reviewer nav
- no Organization nav
- no Enterprise nav
- no Leadership nav
- no Admin unless capability allows

Reviewer
- no Researcher workflow controls
- no Organization/Enterprise/Leadership nav
- only review-related preview + account/security

Organization Representative
- no system-admin implication
- no Reviewer/Researcher role switch menu
- organization scoped surface only

SUPER_ADMIN
- /admin/access works
- /admin/audit works
- member workspace is not used as the admin tree
```

---

# 16. Pre-test exit gate

Do NOT begin the real flow test until all are true:

```text
[ ] /workspace no longer acts as unrestricted persona showcase
[ ] live sidebar does not expose unrelated personas
[ ] direct role routes are guarded
[ ] /admin is the canonical Governance route
[ ] /account exists
[ ] /security exists
[ ] legacy IAM paths redirect correctly
[ ] no current UI financial workflow terminology
[ ] frontend-only business actions do not fake backend success
[ ] UI preview data is identified as preview where necessary
[ ] lint passes
[ ] build passes
[ ] docs do not claim nonexistent backend runtime
```

If any item fails, keep testing at PRE-TEST FIX stage.

---

# 17. First real test after this guide

Once the exit gate is green:

```text
FLOW 00 — Identity & Session Preflight
```

Accounts:

```text
SUPER_ADMIN
RESEARCHER @ ORGANIZATION
REVIEWER @ REVIEW_BOARD
ORGANIZATION_REPRESENTATIVE @ ORGANIZATION
```

For each:

```text
Keycloak
→ auth exchange
→ /auth/me
→ active context
→ capabilities
→ /workspace
→ route resolution
→ sidebar visibility
```

Do not begin Research Collaboration business E2E until a real Collaboration runtime exists.

---

# 18. Final report required from the coding agent

Return:

```text
Baseline SHA
New SHA(s)

Files changed

P0-01 result
P0-02 result
P0-03 result
P0-04 result
P0-05 result
P0-06 result
P0-07 result
P0-08 result

Routes after fix
Capability → route mapping

Finance-term scan result
Fake-action scan result

lint result
build result

Remaining blockers

Docs read:
- exact paths
```

Do not claim "ready for full flow test" if any PRE-TEST exit item remains open.
