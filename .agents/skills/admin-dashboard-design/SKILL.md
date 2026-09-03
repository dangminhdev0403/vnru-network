# Admin Dashboard Design Skill

## Purpose

Design and improve **administration interfaces, internal tools, dashboards, analytics pages, management consoles, settings pages, moderation interfaces, and operational workspaces**.

This skill is NOT for:

* Landing pages
* Marketing websites
* Promotional sections
* Portfolio pages
* Decorative storytelling interfaces

The objective is to produce interfaces that are:

* Data-first
* Operational
* Dense but readable
* Predictable
* Scannable
* Fast to use
* Consistent
* Extensible
* Role-aware
* Suitable for real production administration systems

---

# 1. CORE PRINCIPLE

Admin UI is a **tool**, not a presentation.

Always prioritize:

1. Information hierarchy
2. User task
3. Data visibility
4. Decision speed
5. Interaction efficiency
6. State clarity
7. Consistency
8. Visual polish

Visual decoration must NEVER override operational clarity.

---

# 2. STRICT DESIGN BOUNDARY

Do NOT redesign unrelated parts of the interface.

When asked to improve a page:

* Preserve the existing product structure unless there is a clear UX problem.
* Do not invent new modules.
* Do not invent new business functionality.
* Do not add cards just to fill empty space.
* Do not add charts without a meaningful analytical reason.
* Do not create fake statistics.
* Do not create fake activity.
* Do not create fake alerts.
* Do not add decorative sections.
* Do not change navigation architecture unless required.
* Do not introduce a new visual language if the application already has one.

Only modify what is necessary to solve the requested UI/UX problem.

---

# 3. NO RANDOM AI DESIGN

Avoid stereotypical AI-generated dashboard patterns.

Do NOT automatically use:

* Huge gradient KPI cards
* Excessive glassmorphism
* Random bento grids
* Decorative blobs
* Neon effects
* Oversized rounded cards
* Excessive shadows
* Giant dashboard headings
* Random illustrations
* Decorative charts
* Gradient backgrounds on every component
* Different colors for every statistic
* Excessive icons
* Floating UI without functional meaning

Avoid making every section a card.

Use cards only when a visual grouping boundary is useful.

---

# 4. ADMIN VISUAL LANGUAGE

Prefer a professional application-style visual system.

Recommended characteristics:

* Neutral application background
* Clear surface hierarchy
* Subtle borders
* Low or medium radius
* Compact spacing
* Strong typography hierarchy
* Restrained shadows
* Consistent controls
* High information density
* Minimal decorative color

Prefer:

```text
Background
└── Main workspace
    ├── Page header
    ├── Toolbar
    ├── Summary / KPI
    ├── Main data visualization
    └── Operational data
```

Do not make the interface visually compete with the information.

---

# 5. PAGE STRUCTURE

For most admin pages use:

```text
App Shell
├── Sidebar
├── Top Bar
└── Main Content
    ├── Breadcrumb / Context
    ├── Page Header
    │   ├── Title
    │   ├── Description
    │   └── Primary Actions
    │
    ├── Filters / Toolbar
    │
    ├── Summary
    │
    └── Main Content
```

Page header should normally contain:

* Page title
* Short context when necessary
* Maximum 1 primary action
* Secondary actions only when justified

Do not put every action in the header.

---

# 6. DASHBOARD INFORMATION HIERARCHY

A dashboard should answer questions in this order:

### Level 1 — What is happening?

Show the most important current values.

Examples:

* Total users
* Active users
* Pending requests
* Published content
* Active projects
* Pending approvals

### Level 2 — Is it changing?

Show trends only when historical information is relevant.

Examples:

* User growth
* Content publishing trend
* Application volume
* Engagement trend

### Level 3 — Why is it happening?

Use:

* Breakdown
* Distribution
* Category comparison
* Status distribution
* Role distribution

### Level 4 — What needs action?

Show:

* Pending approvals
* Recent requests
* Flagged content
* Failed operations
* Items requiring attention

Operational information should usually appear below analytical information.

---

# 7. KPI RULES

Do not overload the dashboard with KPI cards.

Recommended:

```text
3–5 KPI cards
```

Maximum default:

```text
6
```

A KPI must answer an actual management question.

Good:

```text
Total members
Pending approvals
Active projects
Published articles
```

Bad:

```text
Random metric
Decorative percentage
Fake engagement score
Meaningless growth indicator
```

KPI card anatomy:

```text
Label
Primary value
Secondary context
Optional trend
```

Example:

```text
Pending Applications
24
+6 this week
```

Avoid:

```text
Huge Icon

24

PENDING APPLICATIONS

+12.47%
```

Icons should support scanning, not dominate the component.

---

# 8. CHART RULES

Never add a chart just because this is a dashboard.

Before adding a chart, determine what question it answers.

Use:

### Line chart

For:

* Change over time
* Trend
* Growth

### Bar chart

For:

* Category comparison
* Ranking
* Volume comparison

### Stacked bar

For:

* Composition over time

### Donut / Pie

Only for:

* Simple distribution
* Few categories

Recommended maximum:

```text
5 categories
```

Avoid pie charts with many categories.

### Area chart

Use sparingly.

Prefer line charts when precise comparison is more important.

---

# 9. CHART DENSITY

Do not create dashboards containing many unrelated charts.

Default:

```text
1 primary chart
+
1 secondary analytical visualization
```

Additional charts require a clear reason.

Example:

```text
Dashboard

[ KPI ][ KPI ][ KPI ][ KPI ]

[ User growth             ][ Status distribution ]

[ Pending approvals / Recent activity table       ]
```

This is usually stronger than:

```text
[ chart ][ chart ][ chart ]
[ chart ][ chart ][ chart ]
```

---

# 10. TABLE-FIRST ADMIN DESIGN

Management interfaces should generally prefer tables for operational data.

Use tables when users need to:

* Compare records
* Search records
* Filter records
* Sort records
* Perform actions
* Inspect status
* Manage multiple entities

A standard admin table structure:

```text
Toolbar
├── Search
├── Filters
├── View controls
└── Primary action

Table
├── Select
├── Main identity
├── Metadata
├── Status
├── Updated
└── Actions

Footer
├── Result count
└── Pagination
```

Do not convert management data into cards unless card representation has a real benefit.

---

# 11. TABLE DENSITY

Prefer moderate density.

Rows should be compact enough for administration work but remain readable.

Recommended desktop row height:

```text
44–56px
```

Avoid:

```text
70–100px rows
```

unless the row contains substantial preview information.

---

# 12. FILTER SYSTEM

Filters should scale.

Do not expose 8–10 filters horizontally.

Use this model:

```text
Search
Status
Primary filter
More filters
```

Example:

```text
[ Search users... ]

[ Status ▼ ]
[ Role ▼ ]
[ More filters ]
```

Advanced filters can open:

* Popover
* Dropdown
* Sheet
* Filter panel

Active filters should be visible and removable.

Example:

```text
Role: Editor ×
Status: Active ×
Clear all
```

---

# 13. SEARCH

Search should normally appear before filters.

Placeholder should identify searchable content.

Good:

```text
Search users...
Search articles...
Search projects...
```

Avoid:

```text
Search...
```

when context is not immediately obvious.

---

# 14. STATUS SYSTEM

Statuses must use a consistent semantic system.

Example:

```text
Active
Pending
Draft
Published
Rejected
Archived
Suspended
```

Do not create a unique color for every state.

Use restrained semantic colors.

Example mapping:

```text
Positive → green family
Pending / warning → amber family
Error / rejected → red family
Neutral → gray family
Information → blue family
```

Status badge should remain readable without relying only on color.

---

# 15. ACTION HIERARCHY

There should normally be:

```text
1 primary action
```

per page context.

Examples:

```text
Create user
Create article
Invite member
New project
```

Secondary actions:

```text
Export
Import
Settings
Refresh
```

Destructive actions must never visually compete with the primary action.

---

# 16. ROW ACTIONS

For common actions:

```text
View
Edit
Approve
```

show directly only when frequently used.

For secondary or destructive actions use:

```text
...
```

menu.

Example:

```text
Open
Edit
⋯
```

Menu:

```text
Duplicate
Archive
Delete
```

Avoid placing 5 action buttons inside every table row.

---

# 17. DETAIL PAGE

Prefer the following hierarchy:

```text
Header
├── Entity identity
├── Status
└── Primary actions

Content
├── Main information
├── Metadata
├── Related entities
└── Activity / history
```

Use tabs when there are meaningful information domains.

Example:

```text
Overview
Permissions
Activity
Security
```

Do not use tabs merely to reduce page height.

---

# 18. ROLE & PERMISSION UI

RBAC interfaces must remain scalable.

Never assume there will only be 3–4 roles.

Avoid designs such as:

```text
Admin Card
Editor Card
Member Card
```

when roles are configurable.

Prefer:

```text
Role table

Name
Users
Permissions
Type
Updated
Actions
```

Role detail:

```text
Role name
Description

Permissions

Module
├── View
├── Create
├── Update
├── Delete
└── Special actions
```

When permissions become large, organize them by resource/module.

---

# 19. PERMISSION MATRIX

Use matrix UI only when it remains readable.

Example:

```text
                  View   Create   Update   Delete

Users              ✓       ✓        ✓        -
Articles           ✓       ✓        ✓        ✓
Projects           ✓       -        ✓        -
```

For very large permission systems prefer grouped permissions rather than one enormous matrix.

---

# 20. SIDEBAR

Sidebar represents product architecture.

Do not overload it.

Group items by operational domain.

Example:

```text
Overview

Management
├── Users
├── Content
└── Projects

Access Control
├── Roles
└── Permissions

System
├── Activity
└── Settings
```

Avoid navigation labels such as:

```text
Module 01
Module 02
Core System
Feature Group A
```

unless those terms are genuinely used by users.

Use business-facing labels.

---

# 21. ICON RULES

Icons are navigational aids.

They must:

* Use one icon family
* Use consistent stroke weight
* Use consistent size
* Have semantic relevance

Recommended:

```text
16px
18px
20px
```

Avoid:

* Emoji
* Mixed icon libraries
* Random filled icons
* Oversized icons
* Decorative icons inside every card

Do not add an icon when text alone is clearer.

---

# 22. TYPOGRAPHY

Recommended hierarchy:

```text
Page title        24–30px
Section title     16–20px
Body              14px
Table              13–14px
Metadata           12–13px
```

Avoid giant marketing typography inside admin interfaces.

Do not use:

```text
48px
56px
64px
```

dashboard titles unless there is an exceptional reason.

---

# 23. SPACING

Prefer consistent spacing based on a small scale.

Example:

```text
4
8
12
16
20
24
32
```

Do not invent different spacing values for every component.

Admin pages should generally have tighter vertical rhythm than marketing pages.

---

# 24. CARD RULES

A card should represent one meaningful grouped object.

Valid cards:

* KPI
* Chart
* Summary
* Entity overview
* System state

Do not wrap every section inside nested cards.

Avoid:

```text
Card
└── Card
    └── Card
```

Use spacing, borders and section hierarchy instead.

---

# 25. EMPTY STATES

Empty state should help users continue.

Structure:

```text
Short explanation
Optional guidance
Primary action
```

Example:

```text
No members found.

Try changing your filters or invite a new member.

[ Invite member ]
```

Do not create giant illustrations for ordinary admin empty states.

---

# 26. LOADING STATES

Use:

* Skeleton rows
* Skeleton charts
* Skeleton KPI values

Preserve layout while loading.

Do not use large blocking spinners for an entire page when individual sections can load independently.

---

# 27. ERROR STATES

Errors must provide:

```text
What failed
What the user can do
```

Example:

```text
Unable to load users.

[ Try again ]
```

Do not expose raw API errors to normal users.

---

# 28. RESPONSIVE ADMIN UI

Desktop is usually the primary environment, but responsive behavior must be intentional.

Desktop:

```text
Sidebar + content
```

Tablet:

```text
Collapsed sidebar
```

Mobile:

```text
Drawer navigation
Stacked KPI
Horizontal table scroll or responsive row representation
```

Do not blindly convert every table into unrelated cards.

Preserve information relationships.

---

# 29. MOTION

Motion must support state understanding.

Allowed:

* Fade-in
* Short slide
* Menu transition
* Dialog transition
* Accordion transition
* Row insertion/removal
* Skeleton transition

Recommended duration:

```text
120–240ms
```

Scroll-triggered animation may be used sparingly for secondary content.

Do NOT animate:

* Every dashboard card
* Every table row on initial load
* KPI numbers excessively
* Navigation continuously
* Background decorative objects

Admin UI should feel fast, not cinematic.

---

# 30. ACCESSIBILITY

Always ensure:

* Keyboard navigation
* Visible focus state
* Sufficient contrast
* Proper labels
* Accessible dialogs
* Accessible menus
* Accessible table controls
* Do not communicate status through color alone

Clickable target should normally be at least approximately:

```text
36–40px
```

for desktop application controls.

---

# 31. IMPLEMENTATION PREFERENCE

When the project uses:

```text
Next.js
React
Tailwind CSS
shadcn/ui
```

prefer existing primitives before creating custom components.

Preferred primitives:

```text
Button
Input
Select
DropdownMenu
Popover
Dialog
Sheet
Tabs
Badge
Table
Checkbox
Tooltip
Command
Pagination
Skeleton
```

Do not rebuild mature primitives unnecessarily.

---

# 32. COMPONENT REUSE

Before creating a new component:

1. Search the repository.
2. Check existing UI primitives.
3. Check existing layout components.
4. Check similar admin pages.
5. Reuse existing tokens and patterns.

Only create a new component if an appropriate abstraction does not exist.

---

# 33. EXISTING DESIGN SYSTEM IS AUTHORITATIVE

When working inside an existing application:

Inspect first:

```text
colors
typography
spacing
radius
sidebar
buttons
inputs
tables
badges
dialogs
page headers
```

Match the existing system.

Do NOT create a second design system inside the admin area.

---

# 34. DATA INTEGRITY

Never invent business data just to make the interface visually complete.

If data is unavailable during implementation:

Use clearly identifiable placeholders or mock structures.

Prefer:

```text
mockData
```

or:

```text
TODO: connect API
```

Do not present fabricated numbers as real application statistics.

---

# 35. DOMAIN INTEGRITY

Do not invent business concepts not supported by requirements.

Examples:

If the system manages:

```text
users
articles
projects
organizations
roles
permissions
```

do not suddenly introduce:

```text
revenue
MRR
sales
conversion
subscription
billing
investment
funding
```

unless explicitly required.

Domain correctness is more important than making a dashboard look full.

---

# 36. ANALYTICS DESIGN PROCESS

Before designing a dashboard, determine:

```text
WHO uses this dashboard?

WHAT decisions do they make?

WHAT needs their attention?

WHAT data helps those decisions?

WHAT actions can they perform?
```

Then create the interface.

Do not begin by asking:

```text
Which chart should I add?
```

Begin with:

```text
What question must this dashboard answer?
```

---

# 37. ADMIN PAGE DESIGN PROCESS

For every requested page:

## Step 1 — Inspect

Understand:

* Existing application shell
* Existing components
* Existing data
* Existing routes
* Existing business terminology

## Step 2 — Determine page purpose

Write internally:

```text
Primary user:
Primary task:
Primary data:
Primary action:
Secondary actions:
```

## Step 3 — Establish hierarchy

Determine:

```text
Page header
Toolbar
Primary information
Secondary information
Actions
```

## Step 4 — Choose UI pattern

Choose from:

```text
Dashboard
Table
Master-detail
Form
Settings
Permission matrix
Timeline
Queue
Review workflow
```

Do not mix patterns unnecessarily.

## Step 5 — Implement

Reuse existing components.

## Step 6 — Verify

Check:

* Density
* Alignment
* Empty states
* Loading states
* Error states
* Responsive behavior
* Accessibility
* Long content
* Many records
* Many roles
* Many permissions

---

# 38. SCALE TEST

Never design only for the current mock dataset.

Always mentally test:

```text
5 records
50 records
5,000 records

3 roles
30 roles

5 permissions
100 permissions
```

If the UI breaks conceptually at scale, redesign it.

---

# 39. CONTENT DENSITY TEST

Ask:

> Can an administrator understand the current state of this page within 3–5 seconds?

If not:

Improve:

* hierarchy
* grouping
* labels
* alignment
* density

Do NOT solve it by adding more decoration.

---

# 40. DECISION SPEED TEST

For dashboards ask:

> Can the user quickly identify what requires attention?

Prioritize exceptions.

Example:

```text
23 pending approvals
4 failed imports
2 suspended users
```

These can be more operationally important than:

```text
12,543 total records
```

---

# 41. DESIGN CONSISTENCY TEST

Before completing a page compare it with nearby admin pages.

Verify:

```text
Same page header?
Same toolbar height?
Same table style?
Same badges?
Same filters?
Same action placement?
Same spacing?
```

Consistency is more valuable than novelty.

---

# 42. PROHIBITED AGENT BEHAVIOR

The agent MUST NOT:

* Redesign the entire application when asked to modify one page
* Add unrelated features
* Introduce new navigation without reason
* Invent business logic
* Invent metrics
* Invent roles
* Invent workflows
* Add decorative sections
* Add fake charts
* Add fake notifications
* Change backend contracts just to fit UI
* Install unnecessary libraries
* Replace working components unnecessarily
* Rewrite unrelated files
* Introduce visual inconsistency

If existing implementation is functional but visually weak:

Improve it incrementally.

Do not rebuild everything automatically.

---

# 43. WHEN USER ASKS "UPGRADE UI"

Interpret:

```text
Improve hierarchy
Improve density
Improve spacing
Improve typography
Improve alignment
Improve states
Improve interaction
Improve consistency
```

Do NOT interpret it as:

```text
Invent new features
Add more widgets
Add more content
Add more cards
Add more gradients
```

---

# 44. WHEN USER PROVIDES A SCREENSHOT

Treat the screenshot as a UI problem to diagnose.

Analyze:

1. Information hierarchy
2. Alignment
3. Density
4. Spacing
5. Typography
6. Component consistency
7. Interaction clarity
8. Scalability

Then modify only the necessary components.

Do not blindly recreate the screenshot.

---

# 45. OUTPUT EXPECTATION

When explaining a redesign, describe:

```text
Problem
↓
Reason
↓
Change
↓
Expected UX improvement
```

Example:

```text
Problem:
Role cards do not scale when the number of roles increases.

Change:
Replace the role card grid with a searchable role table.

Result:
The interface remains manageable with dozens of roles and supports filtering,
sorting and row-level actions.
```

Avoid vague statements such as:

```text
Make UI modern.
Make it beautiful.
Improve UX.
```

---

# 46. DEFAULT ADMIN DASHBOARD BLUEPRINT

Use this only when requirements do not suggest a stronger structure.

```text
┌──────────────────────────────────────────────────────────────┐
│ Dashboard                                      Date / Action │
│ System overview                                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ [ KPI ]       [ KPI ]       [ KPI ]       [ KPI ]           │
│                                                              │
├─────────────────────────────────┬────────────────────────────┤
│                                 │                            │
│ Main trend                      │ Distribution               │
│                                 │                            │
│                                 │                            │
├─────────────────────────────────┴────────────────────────────┤
│                                                              │
│ Requires attention                                           │
│                                                              │
│ Table / Queue / Recent items                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

This is a starting point, not a mandatory template.

---

# 47. DEFAULT MANAGEMENT PAGE BLUEPRINT

```text
Users

Manage users and their access.

                                  [ Invite user ]

[ Search users... ] [ Role ] [ Status ] [ More filters ]

------------------------------------------------------------

□   User              Role       Status      Updated       ⋯
------------------------------------------------------------
□   Nguyen Van A      Editor     Active      2h ago        ⋯
□   Tran Van B        Member     Pending     1d ago        ⋯
------------------------------------------------------------

42 users                                      < 1 2 3 4 >
```

Prefer this pattern over a grid of user cards for administration.

---

# 48. DEFAULT ANALYTICS PAGE BLUEPRINT

```text
Analytics
Understand platform activity and growth.

[ Period ▼ ] [ Filters ]

[ Total ]     [ Active ]     [ New ]     [ Pending ]

User activity
─────────────────────────────────────────
                 LINE CHART

Breakdown                     Distribution
──────────────────           ───────────────
BAR CHART                    SIMPLE DONUT

Recent / detailed data
─────────────────────────────────────────
TABLE
```

---

# 49. FINAL RULE

A successful admin design should make the user think:

> "I immediately know what is happening and what I need to do."

Not:

> "This dashboard looks impressive."

Function first.

Clarity second.

Consistency third.

Visual polish fourth.
