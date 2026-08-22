# Agent Integration Guide — Research Collaboration UI

Use the HTML references in this directory as **design specifications**, not source code to paste wholesale into Next.js.

## Goal

Integrate the approved Research Collaboration visual surfaces into the existing repository while preserving current architecture:

```text
app route
→ feature-owned component
→ hook/resource
→ repository/BFF
→ backend contract
```

Do not change unrelated domains.

## HARD RULE — COPY ONLY THE CORE PAGE BODY

The repository **already has the approved application layout**. The HTML references contain a fake/static shell only so each design can be previewed standalone.

When integrating into Next.js, the agent must copy/adapt **only the core business content inside the page body**.

### KEEP the existing repository layout

Do not replace, recreate, fork, or restyle these existing runtime responsibilities:

```text
AdminShell / WorkspaceShell
Header
Sidebar / SidebarFrame
WorkspaceSidebar
AdminSidebar
workspace/admin navigation registries
responsive shell behavior
light/dark theme system
global design tokens
network motif
locale/language controls
session/current-user shell behavior
```

The static HTML shell is **reference scaffolding only**.

### DO NOT copy from HTML into runtime

Do not copy/adapt:

```text
<aside class="sidebar">...</aside>
<header class="topbar">...</header>
prototype breadcrumb shell
prototype search box
prototype theme button
prototype locale/account buttons
standalone page wrapper/layout dimensions
prototype navigation links
prototype network SVG shell
reference.css global shell rules
```

Do not create a second navigation/layout system under `features/collaboration`.

### COPY / ADAPT only the core UI

Examples of valid material to adapt:

```text
page heading / intro block
work queues
opportunity list/filter composition
proposal bilateral team visualization
proposal tabs/content sections
review rubric/form composition
decision form/summary composition
project milestone/deliverable/progress composition
knowledge → collaboration bridge controls
modals/drawers that belong to the business action
empty/error/loading/forbidden states
```

The intended integration model is:

```text
EXISTING WorkspaceShell
├── EXISTING Header
├── EXISTING capability-aware WorkspaceSidebar
└── EXISTING <main>
      └── NEW CORE BUSINESS UI ONLY
```

If the HTML reference conflicts with the current repository shell, **the repository shell wins**. Preserve the design intent of the core surface without importing the prototype shell.

## Route ownership

```text
frontend/app/(workspace)/workspace/collaboration/
├── page.tsx                         # Collaboration Hub
├── opportunities/
│   ├── page.tsx                     # Opportunity list
│   └── [id]/page.tsx                # only when detail contract exists
├── proposals/
│   └── [id]/page.tsx                # Proposal Workspace
├── reviews/
│   └── [id]/page.tsx                # Reviewer Workspace
├── decisions/
│   └── [id]/page.tsx                # only with real read context/contract
└── projects/
    └── [id]/page.tsx                # Project Workspace
```

Feature ownership remains separated:

```text
frontend/features/collaboration/
frontend/features/reviews/
frontend/features/projects/
frontend/features/knowledge/
```

Do not place reusable business UI directly under `app/*`.

## Integration policy

### Collaboration Hub
- Do not build fake KPI cards.
- Compose task/queue sections only from real supported data.
- If a queue contract does not exist, omit that section.
- Capability-aware visibility is UX only.

### Opportunities
- Keep current real `limit + cursor` pagination contract.
- Parse the actual backend envelope (`items`, `nextCursor`) exactly.
- Render only backend fields.
- Create/publish/close must call real mutations and reflect real errors.
- Do not add date/code fields until backend exposes them.

### Proposal Workspace
Before implementing the HTML reference:
- align `CreateProposalInput` and `CollaborationProposal` to the current backend DTO/state model;
- map participant arrays/confirmations/endorsements honestly;
- use the proposal's real revision/state;
- enforce active context and participant scope server-side/backend-side.

Suggested visual tabs from the reference:

```text
Overview
Team
Research Plan
References
Confirmations
Activity
```

Only enable a tab/action if the underlying data or mutation exists.

### Review Workspace
- Use `features/reviews`, not `features/collaboration` internals.
- Preserve anonymized proposal snapshots.
- Never recover or leak hidden identities from Knowledge/Expert data.
- Score/save/submit only through real review-service mutations.

### Collaboration Decision
- This is business workflow, not platform admin.
- Keep decision-maker capability/context checks.
- Do not invent a decision list endpoint.
- If backend only exposes proposal-scoped decision mutation, keep route/action proposal-scoped until a read model exists.

### Project Workspace
- Use `features/projects`.
- Tabs may include Overview, Team, Milestones, Deliverables, Progress, Activity only where contracts exist.
- Milestone/progress mutations must use project-service state and concurrency rules.

### Knowledge → Collaboration bridges
Do not create a standalone production page from `07-knowledge-collaboration-bridges.html`. Integrate bridge actions into existing Knowledge/Expert/Publication surfaces:

```text
Expert → Add/select for Proposal Team
Publication → Use as Proposal Reference
Topic → Related Opportunities
Organization → Collaboration Context
```

Only show each bridge after its target route/action is real.

## No fake interaction rule

Every runtime business control must satisfy:

```text
REAL CAPABILITY
+ REAL ACTIVE CONTEXT
+ REAL ROUTE
+ REAL BACKEND CONTRACT
= ENABLED ACTION
```

If any part is missing, do not simulate success.

## Visual integration

Reuse the repository's approved shell and tokens. Do not paste the static HTML sidebar/header into runtime pages. Extract only page-body composition and relevant visual patterns.

Preserve:
- light/dark theme;
- shared spacing/radius/typography tokens;
- subtle network motif from the shell;
- full-width selected navigation treatment;
- VI/EN/RU localization.

## Verification before reporting completion

Run repository-prescribed lint/typecheck/tests/build plus UI/design gate. For each integrated surface manually verify:

```text
loading
empty
error
401
403
validation error
409/conflict where relevant
success
light/dark
responsive
VI/EN/RU
```

Report backend gaps rather than filling them with local mock behavior.
