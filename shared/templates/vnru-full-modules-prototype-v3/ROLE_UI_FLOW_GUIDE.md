# VN–RU Full Modules Prototype V3 — ROLE / FLOW UI GUIDE

## 1. Canonical demo architecture

The prototype is no longer presented as “17 screens”.

The hierarchy is:

```text
Access Area
→ Role / Context
→ User Journey
→ Screen
→ Interaction / State
```

Canonical folders:

```text
public/
auth/
workspace/
  researcher/
  reviewer/
  organization/
  enterprise/
  leadership/
governance/
demo/
assets/
```

## 2. Public is physically separated

`public/*` does not use Workspace sidebar, role switcher, reviewer controls, enterprise controls, leadership analytics, or Governance navigation.

Public includes:
- landing;
- search;
- knowledge;
- expert directory/detail.

The login entry lives under `auth/`.

## 3. Authenticated role layouts

### Researcher
Entry: `workspace/researcher/index.html`

Primary flow:
`Overview → Collaboration → Proposal → Project → Academic`

Purpose:
- manage personal research collaboration;
- follow proposals/projects;
- use academic exchange surfaces;
- contextual knowledge.

Must not show:
- reviewer assignment controls;
- organization governance;
- enterprise 2+2 controls;
- system administration.

### Reviewer
Entry: `workspace/reviewer/index.html`

Primary flow:
`Assigned queue → Anonymized review → Submit state`

Reviewer only sees assigned review material allowed by backend authorization.

### Organization Representative
Entry: `workspace/organization/index.html`

Primary flow:
`Organization overview → Proposal endorsement → Organization activities`

This role is NOT Governance Admin.

### Enterprise Representative
Entry: `workspace/enterprise/index.html`

Primary flow:
`Enterprise need → Technology discovery → Interest → 2+2 consortium`

2+2 keeps four explicit slots:
1. VN institution
2. VN enterprise
3. RU institution
4. RU enterprise

### Leadership
Entry: `workspace/leadership/index.html`

Primary flow:
`Analytics overview → Drill-down → Internal report`

Read-oriented. No write-back to business domains.

## 4. Governance is separate

Entry: `governance/index.html`

Governance contains:
- Identity & Access;
- Workflow / moderation;
- Audit & Security.

Do not embed the Governance tree in member Workspace.

## 5. Demo interactions

### Role switcher
On authenticated Workspace pages, the role chip navigates to the home page of the selected role.
It does NOT merely change a label.

### Ctrl / Cmd + K
The command palette is scoped to the current access area and role:
- Researcher sees Researcher screens;
- Reviewer sees Reviewer screens;
- Public sees Public screens;
- Governance sees Governance screens.

### Current Flow
The demo toolbar opens the current role flow only.

### Local state
Allowed:
- score sliders;
- local draft state;
- local endorsement demo state;
- 2+2 slot focus;
- filter/search;
- KPI highlight;
- stepper state.

Not allowed:
- fake backend persistence;
- fake login success;
- fake submission success;
- fake partner matching success.

## 6. Interaction ownership

Every screen should answer:
1. Who owns this screen?
2. What task starts here?
3. What is the primary action?
4. Where does it navigate next?
5. What state is local demo only?
6. What backend permission would ultimately be authoritative?

## 7. Visual rule

Role layouts share one design system but use restrained role accents.
Do not create five unrelated themes.

Public and Workspace share brand language but not navigation structure.

## 8. Financial exclusion

Do not add funding, investment, budget, disbursement, payment, financial reporting, ROI, royalty, deal value, sponsor management, or financial KPI.

## 9. Demo acceptance gate

The prototype is acceptable only when:
- Public can be demoed without entering Workspace;
- switching role changes the actual role layout;
- Reviewer never lands on Researcher/Enterprise pages by normal navigation;
- Organization Representative is not presented as system admin;
- Governance is separately addressable;
- Enterprise 2+2 keeps four slots;
- Leadership analytics is read-only;
- every primary CTA either navigates to a real demo page or is clearly local/demo-only.
