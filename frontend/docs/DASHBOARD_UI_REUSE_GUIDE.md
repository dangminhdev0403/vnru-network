# VN–RU Network Dashboard UI Reuse & Module Integration Guide

> Canonical guidance for agents implementing UI from `namdev131/vn-ru-network` into `dangminhdev0403/vnru-network`.
>
> Primary rule: **reuse the product shell and shared presentation contracts; never copy a whole module template into a new route.**

## 1. Goal

The source design repository contains standalone HTML prototypes for Module 01, Module 02, and Module 03. They are useful as **screen/content references**, but they are not the frontend architecture.

The implementation repository already has a Next.js workspace shell and feature-oriented frontend structure. New module UI must be integrated into that structure so the product feels like one VN–RU Network application rather than several unrelated dashboards.

The intended model is:

```text
one product shell
  -> one visual system
    -> reusable dashboard primitives
      -> module-specific composition
        -> feature data / actions
```

Not:

```text
Module 01 template copied into route A
Module 02 template copied into route B
Module 03 template copied into route C
```

---

## 2. Canonical source of truth

Before UI work, read the repository instructions required by `AGENTS.md` and the frontend guides.

For visual implementation, use this precedence:

1. Current source code and current package manifest.
2. Existing shared shell/components in the implementation repo.
3. Existing design tokens and global styles.
4. This guide.
5. Standalone HTML prototypes from the design repo as visual/content references only.

If a prototype conflicts with the current product shell, **the current product shell wins** unless the task explicitly requests a shell redesign.

Do not create a new `src/` tree just because architecture docs show a target structure when current source is still under `frontend/app`, `frontend/components`, and `frontend/features`.

---

## 3. Current product shell is canonical

The authenticated workspace must have exactly one shell owner:

```text
frontend/app/workspace/layout.tsx
  -> frontend/components/shared/WorkspaceShell.tsx
```

Module pages render **inside** this shell.

A module must never create its own duplicate:

- full-height sidebar;
- product brand block;
- global topbar;
- global search bar;
- mobile navigation drawer;
- account/context status area;
- page-wide background system.

Those responsibilities belong to `WorkspaceShell` or shared shell components extracted from it.

### Recommended shell decomposition

As the shell grows, split `WorkspaceShell.tsx` without changing ownership:

```text
frontend/components/shared/
  WorkspaceShell.tsx
  WorkspaceSidebar.tsx
  WorkspaceTopbar.tsx
  WorkspaceModuleSwitcher.tsx
  WorkspaceBreadcrumbs.tsx
  workspace-navigation.ts
```

Do not create `IamShell`, `KnowledgeShell`, `GrantShell`, etc.

---

## 4. Module registry instead of hard-coded duplicated navigation

Module identity and navigation metadata should be data, not repeated JSX.

Recommended contract:

```ts
export type WorkspaceModule = {
  id: string;
  number: string;
  label: string;
  shortLabel: string;
  href: string;
  icon: string;
  description: string;
};

export const workspaceModules: WorkspaceModule[] = [
  {
    id: "iam",
    number: "01",
    label: "IAM & Governance",
    shortLabel: "IAM",
    href: "/workspace/iam",
    icon: "shield_person",
    description: "Định danh, vai trò, quyền hạn và quản trị truy cập",
  },
  {
    id: "knowledge",
    number: "02",
    label: "Kho tri thức & Chuyên gia",
    shortLabel: "Knowledge",
    href: "/workspace/knowledge",
    icon: "hub",
    description: "Tri thức, chuyên gia, taxonomy và ghép nối hợp tác",
  },
  {
    id: "grants",
    number: "03",
    label: "Tài trợ & Dự án",
    shortLabel: "Grants",
    href: "/workspace/grants",
    icon: "account_balance_wallet",
    description: "Calls, proposals, review, funding và project lifecycle",
  },
];
```

The sidebar/module switcher maps this registry. Adding Module 04 later should be a registry change plus route/feature implementation, not a shell rewrite.

---

## 5. Visual system

The standalone prototypes already share a useful base language: light blue-gray canvas, white surfaces, dark navy sidebar, blue primary, compact data-heavy cards. Preserve that language but normalize it through the current application.

### Canonical visual direction

- Product character: institutional, research-oriented, modern, calm.
- Density: compact but not cramped.
- Radius: medium; avoid mixing sharp cards with pill-heavy cards randomly.
- Shadows: subtle; hierarchy should come primarily from border, spacing, typography and surface contrast.
- Accent: VN–RU blue as primary; red is secondary/accent only, not a competing primary.
- Module identity: use icon/title/context, not a different color theme per module.

### Suggested tokens

Put reusable values in `frontend/app/globals.css` instead of repeating arbitrary hex values in every feature.

```css
:root {
  --dashboard-bg: #f4f7fb;
  --dashboard-surface: #ffffff;
  --dashboard-surface-muted: #f8fafc;
  --dashboard-text: #172033;
  --dashboard-muted: #697386;
  --dashboard-line: #e5e9f0;

  --dashboard-primary: #2457d6;
  --dashboard-primary-soft: #eef3ff;

  --dashboard-success: #14804a;
  --dashboard-success-soft: #eaf8f0;
  --dashboard-warning: #9a6400;
  --dashboard-warning-soft: #fff6dc;
  --dashboard-danger: #c7362f;
  --dashboard-danger-soft: #fff0ef;

  --workspace-sidebar: #06152f;
  --workspace-sidebar-muted: #9cadc6;

  --dashboard-radius-sm: 10px;
  --dashboard-radius: 14px;
  --dashboard-radius-lg: 18px;
}
```

Do not paste each prototype's `<style>` block into a route or feature component.

---

## 6. Shared dashboard primitives

Create shared presentation components only when there is a real repeated visual contract. Start from existing code; extract instead of rebuilding.

Recommended reusable set:

```text
frontend/components/dashboard/
  DashboardPage.tsx
  PageHeader.tsx
  SectionCard.tsx
  MetricCard.tsx
  MetricGrid.tsx
  Toolbar.tsx
  FilterBar.tsx
  SearchField.tsx
  StatusBadge.tsx
  DataTable.tsx
  EmptyState.tsx
  DefinitionList.tsx
  SplitPane.tsx
  LifecycleStepper.tsx
```

Create only what is actually consumed. This is an inventory target, not mandatory scaffolding.

### `DashboardPage`

Owns page content width and vertical rhythm only.

```tsx
<DashboardPage>
  <PageHeader ... />
  {children}
</DashboardPage>
```

It must not know about IAM, knowledge, grant APIs, permissions, or repositories.

### `PageHeader`

Canonical order:

```text
Eyebrow / module label
Title
Description
Optional primary/secondary actions
Optional local tabs
```

Every module page uses this pattern instead of custom title spacing.

### `SectionCard`

Use for standard white bordered surfaces.

Suggested slots:

```tsx
<SectionCard
  title="..."
  description="..."
  actions={...}
>
  ...
</SectionCard>
```

No module should redefine `.panel-card`, `.card-header`, `.surface-card`, etc. with the same semantics.

### `MetricCard` / `MetricGrid`

Use for dashboard KPIs from all modules. Keep consistent:

- label position;
- metric size;
- icon box size;
- delta/status position;
- internal padding;
- responsive grid behavior.

Module-specific colors are allowed only for semantic status, not arbitrary decoration.

### `StatusBadge`

Use semantic variants:

```ts
type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";
```

Feature code maps domain states to tones. Shared UI must not import domain enums/services.

### `DataTable`

Keep table chrome consistent across IAM, knowledge and grants:

- header height;
- row height;
- border color;
- selection/hover behavior;
- empty state;
- loading skeleton;
- pagination footer;
- mobile overflow.

Column definitions remain feature-owned.

---

## 7. Page composition contract

All authenticated module pages should visually follow this stack:

```text
WorkspaceShell
└── DashboardPage
    ├── PageHeader
    ├── optional MetricGrid
    ├── optional local navigation/tabs
    ├── FilterBar / Toolbar
    └── content sections
        ├── SectionCard
        ├── DataTable
        ├── SplitPane
        └── feature-specific components
```

A route page should mostly orchestrate data and compose feature views. It should not contain hundreds of lines of bespoke shell/card/table markup.

---

## 8. Module 01 integration — IAM & Governance

Design reference: Module 1 prototype.

### Keep from the prototype

- overview metrics;
- role list + role detail split pane;
- permission grouping;
- assignments table;
- audit log;
- clear access-control status semantics.

### Do not copy

- prototype sidebar;
- prototype topbar;
- prototype `VR` brand block;
- prototype fixed page background;
- prototype modal/toast implementation if the current app already owns an equivalent interaction pattern;
- the full inline CSS system.

### Route ownership

```text
/workspace/iam
```

Use this for workspace-level IAM context and capability visibility.

```text
/admin/iam
```

Keep administrative access-management functions here when they are governance/admin-only. Do not duplicate the same admin screen inside `/workspace/iam` only to match the prototype.

### Suggested feature composition

```text
features/iam/components/
  IamOverview.tsx
  RoleList.tsx
  RoleDetail.tsx
  PermissionMatrix.tsx
  AssignmentTable.tsx
  AuditTable.tsx
```

These components consume shared dashboard primitives for surfaces and tables.

---

## 9. Module 02 integration — Knowledge & Experts

Design reference: Module 2 prototype.

The prototype mixes public discovery and authenticated workspace concepts in one HTML file. The implementation repo already has separate public routes and workspace routes, so preserve route boundaries instead of reproducing the prototype's internal fake navigation.

### Public surfaces stay public

Existing concepts such as:

```text
/knowledge
/experts
/experts/[id]
/publications/[id]
```

must not be reimplemented as hidden `view-*` panels inside `/workspace/knowledge`.

### Authenticated workspace

```text
/workspace/knowledge
```

Use for actions that require authenticated context: moderation, owned drafts, collaboration workflow, richer filters, user-specific views, etc.

### Reuse candidates from the prototype

- publication list/card patterns;
- expert identity row;
- taxonomy chips;
- moderation status badges;
- bilateral cooperation lifecycle;
- matchmaking explanation panel.

Normalize all of them through shared `SectionCard`, `StatusBadge`, `FilterBar`, `DataTable`, and `LifecycleStepper` where the visual contract matches.

---

## 10. Module 03 integration — Grants & Research Projects

Design reference: Module 3 prototype.

Recommended route:

```text
/workspace/grants
```

Recommended feature boundary:

```text
frontend/features/grants/
  components/
  repositories/
  resources/
  queries/
  hooks/
  types/
```

Create only folders required by current functionality.

Suggested screen model:

```text
Overview
Funding Calls
Proposals
Review / Evaluation
Funding Decisions
Projects
Lifecycle
```

Do not create a new Module 03 shell. Use the same global sidebar/topbar and place Module 03 local navigation under `PageHeader` or in a reusable module-local tab bar.

Use the lifecycle content from the prototype as domain reference, but render it with the shared lifecycle/stepper pattern rather than copying the prototype's inline step markup and inline styles.

---

## 11. Global nav vs module-local nav

This distinction prevents sidebar explosion.

### Global sidebar

Only product-level destinations:

```text
Overview
Module 01 · IAM
Module 02 · Knowledge
Module 03 · Grants
...
Governance
Security
Administration
```

### Module-local navigation

Views inside one module belong in page-level tabs/subnav:

```text
Module 01:
Overview | Roles | Assignments | Audit

Module 02:
Workspace | Publications | Experts | Taxonomy | Cooperation

Module 03:
Overview | Calls | Proposals | Review | Projects | Lifecycle
```

Do not put every subview of every module into the global sidebar.

---

## 12. Reuse decision tree for agents

Before creating any JSX/CSS, run this decision order:

```text
1. Does the current route already have the element?
   -> reuse it.

2. Does `frontend/components/shared` or existing shared UI already provide it?
   -> reuse it.

3. Does another feature have the same presentation contract?
   -> extract/promote the smallest shared presentation component.

4. Is it domain-specific but reused inside one feature?
   -> keep it under `features/<feature>/components`.

5. Is it truly unique to one screen?
   -> keep it local and small.
```

Only create a new shared abstraction when at least two real consumers have substantially the same visual/interaction contract, or when a canonical product contract (shell, page header, status badge, table) clearly requires one.

Do not build speculative design-system scaffolding.

---

## 13. Mandatory agent anti-copy rules

Agents implementing module UI **MUST NOT**:

1. Copy a whole `index.html` from the design repo into the implementation repo.
2. Translate a whole standalone HTML template into one large `.tsx` file.
3. Create a new sidebar/topbar/brand block inside a module feature.
4. Copy prototype `<style>` blocks into route components.
5. Recreate colors, radii, shadows and typography as arbitrary inline values when shared tokens already exist.
6. Create `Module1Layout`, `Module2Layout`, `Module3Layout` when `WorkspaceShell` already owns the product shell.
7. Add a UI dependency just to mimic the prototype without explicit approval.
8. Duplicate public Module 02 pages inside authenticated workspace routes.
9. Duplicate admin IAM behavior inside normal workspace IAM unless product requirements explicitly require both.
10. Add feature service/data access to shared presentation primitives.

---

## 14. Mandatory agent pre-implementation checklist

For any module UI task, the agent must inspect at minimum:

```text
frontend/app/workspace/layout.tsx
frontend/components/shared/WorkspaceShell.tsx
frontend/app/globals.css
nearest route page
nearest feature components
frontend/package.json
```

Then report a short reuse manifest before editing:

```text
Reuse manifest
- Shell: WorkspaceShell
- Page container: <existing/extract>
- Header: <existing/extract>
- Cards: <existing/extract>
- Table: <existing/extract>
- Status: <existing/extract>
- Feature-only components: ...
- New shared components required: ...
```

If the agent cannot name what is being reused, it is not ready to implement the module.

---

## 15. Agent implementation workflow

### Phase A — map prototype to product

For each requested prototype screen, classify every block as:

```text
SHELL
SHARED DASHBOARD UI
FEATURE UI
PUBLIC SURFACE
ADMIN/GOVERNANCE SURFACE
DATA/DOMAIN BEHAVIOR
```

Only `FEATURE UI` and necessary shared primitives should be ported into the route.

### Phase B — establish shared contracts first

If multiple module pages require the same card/header/table/status pattern, extract the smallest shared component before adding more copies.

### Phase C — implement one module vertically

Recommended order:

```text
1. shell normalization
2. shared page/header/card/status/table contracts
3. Module 01 normalization
4. Module 02 normalization
5. Module 03 implementation
6. cross-module visual QA
```

This avoids designing a new system independently for each module.

### Phase D — verify rendered UI

Check at least:

```text
1440px desktop
1024px laptop/tablet landscape
768px tablet
390px mobile
```

Verify:

- shell does not shift between modules;
- headings align to the same content grid;
- card radius/padding/borders match;
- table density matches;
- badges use the same semantic tones;
- local tabs do not become a second sidebar;
- no horizontal overflow except intentional tables;
- keyboard focus is visible;
- reduced-motion behavior is preserved;
- empty/loading/error states look like the same product.

Follow the repository's required browser visual inspection and UI quality gate.

---

## 16. Suggested dashboard layout

Desktop:

```text
┌──────────────────────┬───────────────────────────────────────────────┐
│                      │ Global topbar                                 │
│ Global sidebar       ├───────────────────────────────────────────────┤
│                      │ Module label / breadcrumb                     │
│ Overview             │ Page title                      Page actions  │
│ Module 01            │ Description                                   │
│ Module 02            │ Local tabs                                    │
│ Module 03            ├───────────────────────────────────────────────┤
│ ...                  │ KPI   KPI   KPI   KPI                         │
│                      ├───────────────────────────────────────────────┤
│ Governance           │ Filter / search / actions                     │
│ Security             ├───────────────────────────┬───────────────────┤
│ Admin                │ Primary content           │ Secondary/context │
│                      │                           │ panel              │
└──────────────────────┴───────────────────────────┴───────────────────┘
```

Mobile:

```text
Global topbar + menu button
Page header
horizontal local tabs (scrollable if needed)
KPI cards: 1 column / 2 columns when space permits
filters collapse into compact toolbar
content cards stack vertically
wide data tables scroll inside their own container
```

---

## 17. Definition of done for a new module

A module UI is complete only when:

- it renders under `WorkspaceShell`;
- it does not own a duplicate global shell;
- module navigation comes from shared/global navigation contracts;
- local subviews use local tabs/subnav;
- common cards/tables/badges/headers use shared presentation components;
- domain-specific components remain feature-owned;
- public/admin route boundaries are preserved;
- no new dependency was added without approval;
- responsive and accessibility checks were performed;
- browser visual inspection confirms the module looks like the same VN–RU product as the other modules;
- repository-required lint/typecheck/test/build and UI quality checks are reported truthfully.

---

## 18. Short instruction agents should remember

> **Treat the design repo as a catalogue of module requirements, not a catalogue of templates to copy. Keep one `WorkspaceShell`, one token system, and one set of dashboard presentation primitives. Port only feature-specific content and behavior. Before creating markup, prove that the existing shell/shared components cannot already express it.**
