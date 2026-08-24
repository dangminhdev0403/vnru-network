---
name: ui-quality-promax
description: Strict repository-wide UI/UX quality, visual-stability, responsive, typography, interaction, accessibility, localization, and browser-verification skill for the VN-RU Portal. Use for any UI audit, UI fix, polish, redesign, responsive issue, visual bug, frontend review, or when deciding whether the rendered product is stable or production-ready.
---

# UI Quality Pro-Max — VN-RU Portal

UI quality is not decoration. UI includes the rendered interface; UX includes usability, clarity, interaction quality, feedback, efficiency, state communication, and task completion.

This skill is intentionally strict. Tests, lint, typecheck, build success, DOM existence, or a clean Console never substitute for rendered-browser quality.

## 1. Default scope is the complete frontend

For a generic UI/UX request, the default target is the **entire currently implemented VN-RU frontend**, not one module.

Examples that mean repository-wide frontend review unless the user explicitly narrows scope:

- `soi lại giao diện`;
- `soi và fix toàn bộ UI/UX`;
- `fix UI`;
- `fix UX`;
- `polish frontend`;
- `review UX`;
- `responsive`;
- `kiểm tra giao diện`;
- `ổn định giao diện`;
- `redesign existing UI`.

Repository-wide means discover and audit the actual current frontend surfaces, including when present:

- public/landing/discovery surfaces;
- login/authentication transitions where visually observable;
- authenticated workspace shell;
- all implemented module workspaces;
- governance/admin surfaces;
- security/session surfaces;
- shared navigation, headers, sidebars, layouts, typography, icons, forms, tables, dialogs, states, and responsive behavior.

Do **not** silently reduce a generic UI request to Module 01, Module 02, one route, or one screenshot.

If the user explicitly names a module/page/component, keep the task scoped to that target plus directly affected shared-shell neighbors.

Before editing, output a concise discovered surface manifest so the actual review scope is explicit.

## 2. Supporting taste skills

When these local skills exist, inspect and use the relevant ones as supporting design heuristics:

- `.agents/skills/design-taste-frontend/`
- `.agents/skills/design-taste-frontend-v1/`
- `.agents/skills/high-end-visual-design/`
- `.agents/skills/redesign-existing-projects/`
- `.agents/skills/stitch-design-taste/`

They are advisory inputs, not independent authorities. Resolve conflicts in this order:

1. current user request;
2. repository architecture/rules and security boundaries;
3. current product behavior and established VN-RU design language;
4. this UI Quality Pro-Max skill;
5. supporting taste skills.

Do not blindly merge several aesthetics. Choose the smallest coherent set of heuristics that improves the current product.

## 3. Product baseline

Preserve the established RU–VN / Nga–Việt product identity.

The public/landing experience is the brand-finish reference: premium institutional technology, dark navy, electric blue, strong typography, controlled contrast, sparse high-signal surfaces, restrained effects, and a serious bilateral research-infrastructure character.

Application/workspace/admin UI must share that design DNA without copying marketing composition. Operational surfaces must prioritize clarity, density, navigation, state visibility, and task efficiency.

Never turn the workspace into a generic SaaS/admin template or turn operational pages into marketing hero layouts.

## 4. Browser verification policy — On-Demand & Proposal-First

For web UI development, standard code completion relies on static validation (lint, typecheck, component tests, impeccable anti-pattern checks).

- **No Auto-Launch After Code Edits**: The agent must **NOT** automatically launch Chrome or Chrome DevTools MCP after editing code.
- **Code Done -> Report Immediately**: Immediately report the completed changes, touched files, and static validation results.
- **Propose Browser Testing**: If real interactive browser testing or visual inspection is recommended, propose it in the report (e.g. *"Bạn có muốn mở Chrome để test tương tác thực tế luồng này không?"*).
- **Explicit Trigger**: Chrome DevTools MCP is executed only when:
  1. The user explicitly requests browser testing (e.g. `test browser`, `mở chrome test`, `audit UI browser`); or
  2. The user approves an agent's proposal for browser verification.

## 5. Working loop

### Standard code fix task:
`discover target -> identify root cause -> edit smallest coherent scope -> validate (lint / typecheck / impeccable) -> report immediately -> propose browser testing if needed`

### Dedicated UI audit / Approved browser verification task:
`discover surfaces -> run app -> open Chrome DevTools MCP -> render -> interact -> inspect -> capture -> classify -> report`

## 6. Repository-wide route/surface discovery

Do not guess routes from memory. Discover the current frontend surfaces from repository rules and current source.

For a full frontend pass:

- inventory public routes;
- inventory authenticated workspace routes;
- inventory implemented module workspaces;
- inventory admin/governance routes;
- inventory auth/security/session routes;
- identify shared shell/layout/navigation primitives;
- identify shared design tokens/primitives affecting multiple surfaces.

Audit every primary implemented surface at least once, then deepen coverage where shared components or visual defects indicate broader impact.

Do not invent routes or unfinished product areas just to satisfy a checklist.

## 7. Responsive matrix — mandatory for full frontend passes

Do not claim “responsive” from desktop + mobile only.

Minimum representative width matrix:

- 320px — very small phone;
- 360px — small phone;
- 390px — common phone;
- 430px — large phone;
- 768px — tablet portrait;
- 820px — larger tablet portrait;
- 1024px — tablet landscape / small laptop;
- 1280px — compact desktop;
- 1440px — standard desktop;
- 1920px — large desktop where the surface is designed to stretch that far.

Also test at least one mobile-landscape viewport for relevant interactive surfaces.

Perform resize sweeps around important breakpoint transitions. A layout may pass 430 and 768 but fail at 600–700.

For repository-wide passes, not every route needs screenshots at all ten widths. Use the full matrix across representative shared shells/layout families and test every primary route at minimum representative phone + tablet/compact + desktop widths. Any shared-shell defect requires retesting all routes using that shell.

## 8. Visual hard-fail defects

Any of these on a primary surface prevents a clean UI PASS until fixed or explicitly accepted:

- icon ligature names rendered as text such as `space_dashboard`, `shield_person`, `verified_user`, `admin_panel_settings`;
- missing icon/font/image assets;
- text overlapping controls, icons, badges, inputs, or placeholders;
- clipped navigation labels or content escaping containers;
- unintended horizontal page scroll;
- broken sidebar/topbar/drawer behavior;
- unreadable contrast or disappearing text;
- primary touch controls too small/crowded to operate reliably;
- mixed locale caused by missing translations;
- raw developer/debug/contract/service wording shown to normal users;
- fake or unsupported production-looking metrics/capabilities without explicit preview/pending treatment;
- loading/empty/error states collapsing or causing major layout jumps;
- duplicate/contradictory primary actions;
- major visual inconsistency between surfaces sharing the same shell;
- significant React/hydration/runtime errors affecting the page;
- focus trapped, invisible, or impossible to follow on primary keyboard flows.

Treat visible hard-fail items as P1/P2 by impact, not cosmetic P3 polish.

## 9. Typography audit — extremely strict

Typography must be inspected in the real browser, not inferred from CSS.

For primary surfaces inspect:

- actual computed `font-family`;
- whether intended font files loaded in Network;
- fallback behavior;
- requested weight vs actually available weight;
- accidental synthetic bold/light;
- font-size;
- font-weight;
- line-height;
- letter-spacing;
- heading hierarchy;
- label/button/table typography;
- paragraph measure/line length;
- placeholder/disabled readability;
- truncation/wrapping;
- baseline alignment with icons/controls;
- numerical typography where relevant;
- readability across dark/light surfaces.

Language stress is mandatory where supported:

- Vietnamese diacritics;
- Russian Cyrillic;
- English;
- long translated navigation/action labels.

Do not approve typography based only on the Vietnamese default if RU/EN can break the same layout.

## 10. Spacing, geometry, and visual rhythm

Inspect:

- container widths and page gutters;
- grid alignment;
- vertical rhythm;
- section gaps;
- repeated component padding consistency;
- sidebar width and topbar height;
- row/control heights;
- icon-to-label spacing;
- card radius/border/shadow consistency;
- table density;
- form grouping;
- button padding;
- badges/pills;
- alignment across neighboring panels.

Catch visibly harmful 1–4px alignment drift when it breaks repeated rhythm or optical alignment.

Prefer existing tokens/shared primitives. Do not solve shared defects with repeated route-specific magic numbers.

## 11. Color, hierarchy, and state styling

Inspect:

- background/surface hierarchy;
- primary/secondary/tertiary text;
- actionable vs non-actionable distinction;
- primary vs secondary action emphasis;
- hover/focus/active/selected/disabled states;
- success/warning/error/info semantics;
- selected navigation state;
- borders/dividers;
- badges/status chips;
- dark/light surface consistency;
- decorative gradients/glows competing with content.

Critical status must not rely on color alone.

## 12. Icons and imagery

Inspect every visible icon on primary navigation/actions:

- renders as an icon, never raw glyph-name text;
- intended asset/font loaded;
- consistent family/style/optical weight;
- appropriate size relative to text;
- correct baseline alignment;
- usable touch target;
- accessible name when meaningful;
- decorative semantics hidden when appropriate.

Do not add an icon dependency without explicit approval. Reuse existing assets/dependencies first.

## 13. UX and information architecture

A visually attractive interface can still fail UX.

For every primary surface ask:

- What is the user's goal?
- What is the primary action?
- Is it obvious?
- Is information ordered by importance?
- Is state distinct from action?
- Is pending/preview/unavailable behavior clear?
- Is technical/internal vocabulary leaking into member-facing copy?
- Are errors actionable?
- Do empty states guide the next step?
- Are disabled/read-only states understandable?
- Is navigation predictable?
- Do Back/Forward and URL state behave sensibly where relevant?
- Are permissions/capabilities presented clearly without pretending frontend checks are security?

On IAM/security surfaces, clearly distinguish Identity, Authentication, MFA/authentication level, Active Context, Roles, Capabilities, Resource Scope, Sessions, Security, and Administration without unnecessary duplication.

## 14. Forms, tables, dialogs, menus, and data-dense surfaces

### Forms
Inspect labels, required state, helper text, validation placement, grouping, keyboard flow, autocomplete, loading/submission state, double-submit prevention, read-only/disabled state, and mobile keyboard behavior. Placeholders are never the only label.

### Tables/data-dense UI
Inspect column priority, header clarity, density, numeric alignment, actions, sticky regions, horizontal behavior, filtering, pagination, empty/loading/error states, long content, and mobile adaptation. A desktop table squeezed into 390px is not responsive.

### Dialogs/menus/popovers/toasts
Inspect viewport collision, clipping, z-index, focus management, Escape, click-outside behavior, destructive confirmation, button order, readable errors, toast stacking, and mobile positioning.

## 15. Async/state completeness

For meaningful async/data components inspect applicable states:

- loading;
- success;
- empty;
- error;
- retry;
- partial failure;
- stale/refetch;
- disabled/read-only;
- forbidden/unauthenticated;
- pending/preview for unsupported capability.

Reject blank boxes, raw backend errors, fake production data hiding failures, or transient toasts as the only durable representation of a persistent section error.

If a capability is not implemented, avoid normal-user copy containing raw concepts such as DTO, aggregate contract, database, service, endpoint, or implementation details.

## 16. Accessibility baseline

Perform practical accessibility inspection:

- heading structure;
- landmark/semantic structure where appropriate;
- button vs link semantics;
- form labels;
- accessible names;
- keyboard reachability;
- logical focus order;
- visible focus;
- no keyboard traps;
- dialog focus behavior;
- practical contrast;
- status/error messaging;
- icon accessibility;
- image alt behavior;
- reduced-motion behavior where motion exists;
- readable zoom/responsive behavior.

Inspect the accessibility tree through Chrome DevTools MCP where practical.

Do not claim formal WCAG compliance unless a dedicated compliance audit was performed.

## 17. Zoom and content stress

Where practical test representative important workflows at:

- 125% browser zoom;
- 150%;
- 200% for critical application flows.

Stress layouts with long names, long emails, long organization names, large numbers, zero/missing optional values, Russian labels, multiple badges, and translated copy.

Do not assume ideal demo strings.

## 18. Runtime/performance sanity

Using Chrome DevTools MCP inspect:

- Console errors/warnings relevant to the surface;
- React/hydration errors;
- failed font/icon/image requests;
- failed API/resources;
- redirect loops;
- duplicate requests caused by UI behavior;
- obvious request waterfalls;
- major layout shift/jank;
- obvious interaction freezes;
- oversized/blocking assets when visibly affecting UX.

This is a sanity gate, not permission for speculative performance refactoring.

## 19. Security-sensitive UI rules

UI work must never weaken security.

For auth/IAM/security surfaces verify:

- backend remains authorization authority;
- frontend capability checks are presentation only;
- access/refresh/provider tokens are not exposed in DOM, normal payloads, localStorage, sessionStorage, screenshots, or logs;
- secret/session values are redacted from evidence;
- UI fixes do not bypass 401/403 behavior;
- UI fixes do not duplicate Keycloak/MFA/RBAC business logic in frontend code.

## 20. Defect classification

Severity:

- `P0` — security/data-loss/core-flow blocker;
- `P1` — primary interaction broken or severely unusable;
- `P2` — clearly visible quality/responsive/accessibility defect;
- `P3` — minor polish.

Change type:

- `CONFIG ONLY`;
- `TOKEN / DESIGN SYSTEM`;
- `SMALL UI FIX`;
- `SHARED COMPONENT/TOKEN FIX`;
- `COMPONENT REWORK`;
- `PAGE/FLOW REWORK`;
- `PRODUCT/UX DECISION`;
- `BACKEND/ARCHITECTURE — OUT OF UI SCOPE`.

Do not hide visible P1/P2 defects behind a high overall score.

## 21. Fix policy

When the task authorizes fixes, fix clearly in-scope UI/UX defects directly.

Prefer:

1. shared root cause;
2. existing token/component;
3. installed dependency/native platform;
4. smallest coherent local change.

Before changing a shared primitive/layout/token, inspect all relevant callers/impact.

Stop for approval before:

- adding/upgrading/removing dependencies;
- changing backend business rules;
- changing Keycloak/MFA policy;
- changing RBAC semantics/capabilities;
- schema/migration work;
- destructive data mutation;
- introducing a new design system when one already exists;
- making a product decision not defined by current requirements.

## 22. Before/after evidence

For every meaningful fix batch record concise evidence:

- route/state;
- viewport;
- BEFORE defect;
- source/root cause;
- AFTER browser result;
- Console result;
- Network result where relevant.

Screenshots are evidence, not decoration. Visually inspect them and state what changed.

Never claim “fixed” because CSS compiled.

## 23. Repository-wide UI regression (Dedicated Browser Audits Only)

When performing a dedicated UI audit or user-approved full browser pass, inspect the affected frontend surfaces:

For repository-wide UI work, include representative coverage of:

- public/landing/discovery;
- authenticated workspace shell;
- every implemented module workspace;
- governance/admin;
- security/session;
- auth/login transitions where relevant.

Recheck shared-shell neighbors after any shell/navigation/token change.

Inspect:

- layout;
- typography;
- icons;
- responsive behavior;
- VI/RU/EN wrapping;
- interactions;
- focus;
- loading/empty/error states;
- Console;
- Network;
- auth/session behavior where relevant.

## 24. Strict scorecard

For full frontend reviews return:

| Area | Score |
| --- | --- |
| Public experience | /10 |
| Auth/Login UX | /10 |
| Workspace shell | /10 |
| Module workspaces | /10 |
| Governance/Admin | /10 |
| Security/Sessions | /10 |
| Visual hierarchy | /10 |
| Typography | /10 |
| Spacing & rhythm | /10 |
| Color & contrast | /10 |
| Iconography | /10 |
| Forms | /10 |
| Tables/data density | /10 |
| Navigation | /10 |
| Feedback/states | /10 |
| Responsive 320–1920 | /10 |
| Touch usability | /10 |
| Accessibility basics | /10 |
| Runtime/browser stability | /10 |
| VI/RU/EN resilience | /10 |
| RU–VN visual coherence | /10 |
| Overall frontend UI quality | /10 |

Scoring discipline:

- 5 = functional but visibly unfinished;
- 6 = acceptable internal tooling;
- 7 = solid product quality;
- 8 = polished production quality;
- 9 = exceptionally refined;
- 10 = rare; nearly no meaningful improvement remains.

Never award 9/10 while obvious overflow, broken icons, bad typography, poor mobile adaptation, mixed locale, or raw technical copy remains.

## 25. Completion criteria

A repository-wide UI pass may be called `stable for integration` only when:

- no known P0/P1 UI defect remains;
- no obvious broken fonts/icons remain;
- no obvious overlap/clipping/unintended overflow remains across tested representative widths;
- primary public/workspace/admin/security flows are usable;
- intended fonts/icons load and render correctly;
- typography hierarchy is coherent;
- VI/RU/EN do not visibly break supported surfaces tested;
- meaningful loading/empty/error states are usable;
- no significant Console/runtime issue remains unexplained;
- browser Network behavior is sane for tested flows;
- keyboard/focus basics work on primary actions;
- security/auth boundaries remain intact;
- static code gates pass (lint/typecheck/impeccable), and browser evidence is provided if running under an explicit browser-testing profile.

P2/P3 may remain only when explicitly documented.

`release-ready` is stronger and requires additional repository release/security/accessibility/performance gates; do not infer it solely from this skill.

## 26. Final report

Return:

- discovered routes/surfaces audited;
- defects grouped P0/P1/P2/P3;
- shared root causes;
- fixes applied;
- files changed;
- BEFORE vs AFTER browser findings;
- responsive matrix results;
- typography/font/icon findings;
- UX findings;
- accessibility findings;
- localization findings;
- Network/Console findings;
- what was not verified;
- remaining issues;
- strict scorecard;
- final readiness.

For fix tasks, list the root cause each changed file addresses.

Never declare a high UI score because underlying functionality works while visible product-quality defects remain.
