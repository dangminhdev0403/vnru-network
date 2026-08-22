# MODULE 1–2–3 ALIGNMENT REFACTOR GUIDE

Repository: `dangminhdev0403/vnru-network`

## Goal

Do a controlled alignment refactor, not a rewrite.

```text
Module 1 — IAM
WHO CAN DO IT
    ↓
Module 2 — Knowledge & Experts
WHO / WHAT CAN I FIND
    ↓
Module 3 — Research Collaboration
WHAT DO WE DO TOGETHER
```

Recommended order:

```text
1. Light refactor Module 1
2. Normalize Module 3 domain/contracts
3. Build Module 3 core UI/workflows
4. Return to Module 2 and add real bridges into Module 3
```

Do not continue strictly `1 → 2 → 3` if that forces Module 2 to invent interactions before Module 3 is defined.

## Current baseline (Synchronized & Implemented)

IAM, Collaboration, Review, and Project services are fully aligned:

- `grants.*` → `collab.*` normalized across all services and frontend permissions
- `PROGRAM_MANAGER` → `COLLABORATION_MANAGER`
- `SUPER_ADMIN` remains a system/IAM role, not a business-domain owner
- Module 3 is **Bilateral Research Collaboration & Project Management** (operating under `/api/v1/collab` and `/workspace/collaboration`)
- Financial/funding workflows are strictly out of scope (`fundingProgramRef` and `fundingProgramId` removed)

Frontend workspace surfaces:

```text
/workspace/iam
/workspace/knowledge
/workspace/collaboration
/workspace/iam/admin
/workspace/iam/security
```

Module 3 workspace is implemented as a tabbed runtime surface (`CollaborationWorkspaceView`) backed by BFF routes (`app/api/collab/*`).

Module 2 currently supports public/read-only discovery around publications and experts with bridges leading into Module 3 bilateral collaboration.

## Hard scope constraints

Keep:

- current authentication/session flow
- Keycloak/OIDC integration
- current IAM runtime
- current working Module 2 APIs/read models
- current Light/Dark theme
- current shared workspace shell
- backend-authoritative authorization
- VI / EN / RU support

Do not implement:

- budgets
- funding amounts
- sponsor/funding-source management
- disbursement
- financial reporting
- investment
- financial approval
- financial-support workflows
- fake KPI/data used only to populate dashboards

If old `grant` naming remains in source, treat it as a migration/alignment issue, not permission to reintroduce financial behavior.

## Refactor principle

Frontend owns:

- route composition
- visual state
- forms/interactions
- API consumption
- loading/empty/error/forbidden/success states

Backend owns:

- authorization
- workflow transitions
- persistence
- domain rules
- state validation
- API contracts

Do not:

- rewrite Module 1 from scratch
- replace working Module 2 runtime with mock UI
- add fake APIs
- duplicate backend business rules in frontend
- hard-code authorization from role names
- let `SUPER_ADMIN` automatically inherit Module 2/3 business permissions
- add Modules 4–6 in this task
- rename services/files blindly without checking imports/tests/contracts

# PART A — MODULE 1 ALIGNMENT

## Module 1 target

Module 1 remains the IAM/governance foundation:

```text
Identity
→ Active Context
→ Role Assignment
→ Capability
→ Backend authorization decision
```

Do not make IAM responsible for business content.

## Role model

System roles and business roles must stay conceptually separated.

System roles:

```text
SUPER_ADMIN
SECURITY_ADMIN
```

Business roles relevant to Modules 2–3:

```text
KNOWLEDGE_CURATOR
ORGANIZATION_REPRESENTATIVE
RESEARCHER
REVIEWER
COLLABORATION_MANAGER
FOUNDATION_DECISION_MAKER
```

Important:

```text
SUPER_ADMIN != KNOWLEDGE_CURATOR
SUPER_ADMIN != COLLABORATION_MANAGER
SUPER_ADMIN != FOUNDATION_DECISION_MAKER
```

A user may hold multiple roles, but business permissions must come from explicit business role assignments.

## Permission naming

Use capability naming, not UI labels.

Preferred domains:

```text
iam.*
knowledge.*
experts.*
collab.*
reviews.*
projects.*
```

Examples:

```text
iam.roles.manage
iam.users.manage
knowledge.workspace.view
experts.matches.view
collab.opportunities.create
collab.opportunities.publish
collab.proposals.create
collab.proposals.submit
collab.proposals.confirm_paired
collab.proposals.endorse
collab.proposals.screen
collab.decisions.issue_foundation
reviews.assignments.manage
reviews.assignments.view_assigned
reviews.evaluations.score
reviews.evaluations.submit
projects.projects.view
projects.milestones.update
projects.reports.submit
projects.reports.approve
```

Do not introduce frontend-only authorization semantics.

## Module 1 UI changes

Only light alignment is required:

- keep existing Roles & Permissions console
- group System Roles vs Business Roles
- display capabilities by domain/module
- make assignment context/scope visible
- keep role assignment UI
- keep backend read-only behavior where mutation contracts do not exist
- do not fake permission writes

No major IAM redesign is required during this refactor.

# PART B — MODULE 3 FIRST

## Canonical scope

Module 3 is **Bilateral Research Collaboration & Project Management**.

Core flow:

```text
Research Opportunity
    ↓
Joint Proposal
    ↓
VN–RU Participation Confirmation
    ↓
Independent Review
    ↓
Collaboration Decision
    ↓
Research Project
    ↓
Milestones / Deliverables / Progress
```

No funding workflow.

## Naming normalization

Target architecture terminology:

```text
collaboration-service
collab.*
collab_db
```

Current repository may still contain historical names such as:

```text
services/grant-service
grant.controller.ts
grant.service.ts
grant.repository.ts
```

Inspect before renaming. Do not perform a mechanical rename until checking:

- imports
- package names
- environment variables
- Prisma schema/config
- tests
- route paths
- service URLs
- OpenAPI generation
- event names
- permission names
- documentation
- CI scripts

If a full physical service rename is risky in this pass, normalize public contracts/domain terminology first and schedule folder/package rename separately.

## Recommended Module 3 frontend routes

```text
/workspace/collaboration
/workspace/collaboration/opportunities
/workspace/collaboration/proposals
/workspace/collaboration/proposals/[id]
/workspace/reviewer
/workspace/collaboration/decisions
/workspace/projects
/workspace/projects/[id]
```

Use existing route conventions. Keep pages thin and domain UI in feature modules.

Recommended feature boundaries:

```text
features/collaboration/
features/reviews/
features/projects/
```

Use repositories/resources/hooks/types/components/i18n only where needed.

## Module 3 core UI surfaces

### 1. Collaboration Hub

Purpose: action/work queue, not fake KPI dashboard.

Potential sections only when backend-supported:

```text
Needs your action
My proposals
Assigned reviews
Active projects
Explore opportunities
```

Do not invent counts if aggregate APIs do not exist.

### 2. Opportunities

Core interactions:

```text
search
filter
open detail
start proposal
```

Opportunity cards/details may show:

```text
title
research topics
country/organization context
status
related expertise signals if API supports them
```

Do not show budget/funding.

### 3. Proposal Workspace

This is the primary Module 3 authoring surface.

Recommended tabs:

```text
Overview
Team
Research Plan
References
Confirmations
Activity
```

Core visual model:

```text
Vietnam participant
       ↕
bilateral collaboration
       ↕
Russia participant
```

Actions depend on capabilities and backend state:

```text
edit draft
add participant
confirm participation
submit proposal
endorse proposal
```

Never let frontend local state override backend workflow state.

### 4. Review Workspace

Reviewer flow:

```text
Assigned proposal
→ anonymized view
→ rubric scoring
→ comments
→ save draft if supported
→ submit evaluation
```

Respect anonymization. Do not expose identities just because another frontend object contains them.

### 5. Collaboration Decision

Relevant business role/capability example:

```text
FOUNDATION_DECISION_MAKER
collab.decisions.issue_foundation
```

This is a collaboration decision, not a funding decision.

Potential states/actions:

```text
approve collaboration
request revision
decline
record decision note
```

Exact transitions must come from backend contracts.

### 6. Project Workspace

Recommended tabs:

```text
Overview
Team
Milestones
Deliverables
Progress
Activity
```

Primary interactions:

```text
view project
update milestone
submit progress/report if supported
```

No financial progress UI.

# PART C — MODULE 2 AFTER MODULE 3

## Keep Module 2 discovery foundation

Do not rewrite existing Module 2 APIs if they are working.

Current conceptual entities remain:

```text
Publication
Expert
Topic
Organization
Expertise
Match
```

Public discovery remains read-only unless governance is explicitly reopened later.

## Main Module 2 problem to fix

Avoid a UI that is only:

```text
Search
→ Publications list
→ Experts list
```

Module 2 must become a discovery layer that leads into collaboration actions.

## Module 2 → Module 3 bridges

Only add a bridge when the corresponding Module 3 route/action exists.

### Expert

```text
Expert Profile
→ Related publications
→ Related topics
→ Related experts
→ Add to proposal / Invite to collaboration
```

### Publication

```text
Publication
→ Authors
→ Topics
→ Related experts
→ Related opportunities
→ Use as proposal reference
```

### Topic

```text
Topic
→ Experts
→ Publications
→ Organizations
→ Collaboration opportunities
```

### Organization

```text
Organization
→ Experts
→ Research areas
→ Related opportunities
→ Collaboration participation
```

### Match

If matching is deterministic expertise overlap, describe it honestly as:

```text
related experts
expertise match
shared expertise
```

Do not call it AI/semantic recommendation unless that backend capability exists.

# PART D — SHARED UX

## Cross-module product flow

Optimize this end-to-end path:

```text
Discover expert in Module 2
→ Open expert profile
→ Add/select expert for Module 3 proposal
→ Complete VN–RU team
→ Submit proposal
→ Reviewer evaluates
→ Decision recorded
→ Project created
→ Milestones tracked
```

## Navigation

Do not add every future route to the sidebar.

Expose only implemented, usable surfaces.

Recommended grouping when Module 3 exists:

```text
Overview

Identity & Access
  IAM Overview
  Users
  Roles & Permissions
  Sessions & Security

Knowledge Network
  Knowledge
  Experts

Research Collaboration
  Collaboration Hub
  Opportunities
  Proposals
  Reviews   [only when relevant]
  Projects
```

Capability/persona-aware visibility is UX only. Backend must authorize every request/action.

## Visual system

Reuse the approved shared layout/theme:

- light neutral institutional mode
- dark graphite mode
- subtle VN–RU network motif
- blue primary interaction accent
- red only as restrained brand/destructive accent
- shared cards, inputs, tabs, tables, badges and modals

Do not create a separate visual language for Module 3.

# PART E — DATA & CONTRACT RULES

## Contract-first workflow

Before implementing each mutation:

1. inspect generated/OpenAPI contract
2. inspect backend controller/service
3. verify capability
4. verify request/response shape
5. then implement repository/resource/hook/UI

Do not infer mutation endpoints from UI designs.

## Standard frontend data flow

```text
Page / UI
→ Feature Hook / Query
→ Resource
→ Repository / Service
→ Core HTTP or Route Handler
→ Backend
```

No raw business fetch calls inside reusable UI components.

## Standard UI states

Every Module 2/3 surface must handle:

```text
Loading
Empty
Error
401 Unauthorized
403 Forbidden
Validation Error
409 Conflict
Success
```

Do not render stale mock content to hide missing backend data.

# PART F — EXECUTION PLAN

## Phase 1 — Audit

Before editing, inspect at least:

```text
docs/ARCHITECTURE.md
docs/DOMAIN_MAP.md
docs/API_SPEC.md
docs/RBAC_ARCHITECTURE.md
frontend/docs/ARCHITECTURE.md
frontend/docs/MODULE_GUIDE.md
frontend/docs/CONTRACT_GUIDE.md
frontend/docs/RUNTIME_UI_GUIDE.md
frontend/docs/RULES.md
frontend/app/(workspace)/*
frontend/features/iam/*
frontend/features/knowledge/*
services/grant-service/*
services/review-service/*
services/project-service/*
shared/api-contract/*
```

Report current mismatches before changing them.

## Phase 2 — Module 1 alignment

- verify role names
- verify `collab.*` permissions
- remove remaining invalid UI copy using `grants.*`
- keep `SUPER_ADMIN` separate
- verify assignment context
- avoid unrelated IAM refactor

## Phase 3 — Module 3 contract normalization

- identify current usable endpoints
- identify old `grant` names still representing collaboration domain
- decide safe rename boundary
- align frontend types/resources with actual backend
- do not invent missing endpoints

## Phase 4 — Module 3 UI

Implement supported flows in this order:

```text
1. Collaboration Hub shell
2. Opportunities
3. Proposal Workspace
4. Review Workspace
5. Collaboration Decision
6. Project Workspace
```

If an API is missing:

- omit the mutation or render an explicit unsupported/empty state
- do not create fake persistence

## Phase 5 — Module 2 bridges

After Module 3 routes/actions are stable:

- Expert → Proposal
- Publication → Proposal reference
- Topic → Opportunity
- Organization → Collaboration
- Match → Partner selection

Do not modify the public read-only contract unless explicitly required.

# PART G — ACCEPTANCE CRITERIA

## Architecture

Pass when:

- Module 1 remains IAM-only
- Module 2 remains knowledge/expert discovery owner
- Module 3 owns collaboration/review/project workflow UI
- no backend business rules are duplicated in frontend
- no cross-service DB assumptions are introduced

## Authorization

Pass when:

- UI uses capabilities/context for UX
- backend remains authoritative
- `SUPER_ADMIN` does not implicitly own business-domain permissions
- reviewer/decision/project actions are capability-bound

## Module 3

Pass when:

- no funding/financial workflow remains in UI
- terminology consistently says collaboration, not grants/funding
- proposals visibly support bilateral VN–RU participation
- review is separate from proposal ownership
- project lifecycle follows collaboration decision
- no fake runtime actions exist

## Module 2

Pass when:

- existing public discovery still works
- publication/expert contracts are preserved
- Module 2 gains meaningful bridges to Module 3
- matching claims do not exceed backend behavior

## UI

Pass when:

- Light/Dark theme remains consistent
- shared shell/nav is reused
- no example/mock data is introduced into runtime pages
- standard loading/empty/error/forbidden states exist
- VI/EN/RU does not regress

# PART H — VERIFICATION

Run repository-prescribed commands from the relevant package/workspace.

At minimum verify:

```text
lint
typecheck
tests
build
```

Also run any repository-specific UI/design gate required by current `RULES.md`.

Do not report PASS unless the command actually ran successfully.

Manual QA should cover:

```text
Module 1
- roles & permissions
- role assignment
- dark/light

Module 2
- knowledge search
- expert list/detail
- publication list/detail
- bridge links into Module 3

Module 3
- hub
- opportunity list/detail
- proposal workspace
- reviewer flow
- decision flow
- project/milestone flow

Cross-cutting
- 401
- 403
- empty
- API error
- dark/light
- VI/EN/RU
- responsive layout
```

# PART I — AGENT OUTPUT FORMAT

After refactor, report:

```text
1. Summary
2. Files changed
3. Module 1 changes
4. Module 3 changes
5. Module 2 changes
6. Contract/naming mismatches found
7. Backend gaps not faked
8. Verification commands + actual PASS/FAIL
9. Remaining blockers
10. Commit SHA
```

Do not claim completion if Module 3 interactions are only mock UI.

## Final rule

Treat this task as:

```text
ALIGN → BUILD MODULE 3 → CONNECT MODULE 2
```

not:

```text
REWRITE 1 → REWRITE 2 → REWRITE 3
```

Preserve working code, keep scope controlled, and make the network feel connected through real workflows rather than more dashboards.
