---
name: ui-quality-promax
description: Strict UI/UX quality, visual-stability, responsive, typography, interaction, accessibility, and browser-verification skill for VN-RU Portal. Use for any UI audit, UI fix, polish, redesign, responsive issue, visual bug, workspace/page review, or when deciding whether a rendered interface is stable or production-ready.
---

# UI Quality Pro-Max

UI quality is not decoration. A page is acceptable only when it is visually coherent, usable, responsive, accessible at a practical baseline, stable at runtime, and verified in a real browser after the final source change.

This skill is intentionally strict. Tests/build success never substitute for rendered-browser quality.

## 1. When this skill is mandatory

Load and follow this skill when the user asks to:

- inspect/review/audit UI or UX;
- fix visual defects;
- stabilize responsive behavior;
- polish a page/module/workspace;
- redesign an existing interface;
- improve typography, spacing, hierarchy, density, color, icons, forms, tables, navigation, loading/empty/error states;
- compare implementation against a visual reference;
- decide whether UI is stable, integration-ready, or release-ready.

Examples include: `soi lại giao diện`, `fix UI`, `polish`, `responsive`, `review UX`, `ổn định workspace`, `kiểm tra giao diện`, `redesign existing page`.

## 2. Supporting taste skills

When these local skills exist, inspect and use the relevant ones as supporting design heuristics before editing:

- `.agents/skills/design-taste-frontend/`
- `.agents/skills/design-taste-frontend-v1/`
- `.agents/skills/high-end-visual-design/`
- `.agents/skills/redesign-existing-projects/`
- `.agents/skills/stitch-design-taste/`

They are advisory inputs, not independent authorities. Resolve conflicts in this order:

1. current user request;
2. repository architecture/rules and security boundaries;
3. current product behavior and established design language;
4. this UI Quality Pro-Max skill;
5. supporting taste skills.

Do not blindly combine every taste rule. Choose the smallest coherent set that improves the current product.

## 3. Product baseline for VN-RU Portal

Preserve the established RU–VN / Nga–Việt product identity.

The public/landing experience is the reference for brand finish: premium institutional technology, dark navy, electric blue, strong typography, controlled contrast, sparse high-signal surfaces, and restrained visual effects.

Application/workspace UI must share the same design DNA without copying marketing-page composition. Workspace surfaces must prioritize clarity, density, navigation, state visibility, and task efficiency.

Never turn the workspace into a generic admin template or a marketing hero page.

## 4. Non-negotiable browser-first rule

For web UI targets, real browser inspection through the configured Chrome DevTools MCP is mandatory.

A UI task cannot be marked PASS from any combination of:

- unit tests;
- lint/typecheck;
- production build;
- code inspection;
- DOM existence;
- absence of compile errors;
- a single screenshot taken before changes.

If Chrome DevTools MCP is unavailable, mark the browser/visual gate `BLOCKED`. Do not silently substitute manual assumptions.

## 5. Required working loop

For audit-only tasks:

`discover -> render -> interact -> inspect -> capture -> classify -> report`

For fix tasks:

`discover -> baseline screenshots -> inspect -> classify -> fix smallest root cause -> reload -> interact -> inspect again -> compare -> repeat until stable -> final regression`

After the final source change, the agent MUST perform at least one fresh rendered-browser pass. Evidence captured before the final edit is stale and cannot close the task.

Before reporting any defect, re-read the current exact source/ref and reproduce it once in the current browser session when practical. Do not report stale defects from an older snapshot.

## 6. Minimum responsive matrix

Do not claim “all devices” from one desktop and one mobile screenshot. Verify representative widths and fluid behavior between breakpoints.

Minimum viewport matrix for a full UI-quality pass:

- 360px wide — small phone;
- 390px wide — common phone;
- 430px wide — large phone;
- 768px wide — tablet portrait;
- 1024px wide — tablet landscape / small laptop;
- 1280px wide — compact desktop;
- 1440px wide — standard desktop;
- 1920px wide — large desktop when the surface is intended to stretch that far.

Height may follow a realistic device/browser height. Also drag/resize across breakpoint transitions where Chrome DevTools MCP permits it; discrete screenshots alone may miss a layout break between presets.

A smaller scoped fix may test fewer widths only when the changed component cannot affect other breakpoints. State the reduced matrix explicitly.

## 7. Visual defect hard-fail list

Any of the following visible on a primary surface prevents a clean UI PASS until fixed or explicitly accepted:

- icon ligature names rendered as text, e.g. `space_dashboard`, `shield_person`, `verified_user`;
- missing icon/font assets;
- text overlapping controls, icons, badges, inputs, placeholders, or other text;
- clipped navigation labels or content escaping its container;
- unintended horizontal page scroll;
- broken sidebar/topbar at any tested width;
- unreadable contrast or disappearing text;
- controls too small/crowded to operate reliably on mobile;
- mixed locale caused by missing translations rather than intentional terminology;
- raw developer/debug/contract wording exposed to normal users;
- fake or unsupported production-looking metrics/capabilities without an explicit preview/pending treatment;
- loading/empty/error states collapsing or causing major layout jumps;
- duplicate or contradictory primary actions;
- severe alignment drift between repeated components;
- obvious runtime/React/hydration errors affecting the surface;
- focus trapped, invisible, or impossible to follow for primary keyboard flows.

Treat these as P1/P2 depending on impact, not cosmetic P3 polish.

## 8. Typography audit — mandatory

Typography must be inspected, not assumed.

For every primary surface check:

- actual `font-family` applied in computed styles;
- whether the intended web font loaded successfully in Network;
- fallback behavior if it did not load;
- whether requested weights actually exist or the browser is synthesizing bold/light;
- heading/body/label/button hierarchy;
- font size;
- font weight;
- line-height;
- letter spacing;
- uppercase tracking where used;
- paragraph measure/line length;
- wrapping and truncation;
- baseline/alignment with icons and controls;
- readability on dark and light surfaces.

Language stress is mandatory for this project where the surface supports it:

- Vietnamese diacritics;
- Russian Cyrillic;
- English;
- longer translated navigation/action labels.

Do not approve typography based only on the Vietnamese default if Russian/English can break the same layout.

## 9. Spacing, density, and geometry audit

Inspect:

- container max-width and gutters;
- grid alignment;
- spacing rhythm;
- repeated component padding consistency;
- section gaps;
- sidebar width;
- topbar height;
- card radius/border/shadow consistency;
- row heights;
- table density;
- form field height;
- icon-to-label spacing;
- button padding;
- badge/pill spacing;
- content alignment between neighboring panels.

Prefer existing design tokens and shared components. Avoid fixing one page with arbitrary one-off numbers when the defect comes from a shared token/component.

Do not force identical spacing everywhere; information density may differ between marketing, workspace, admin, and security surfaces. The goal is coherent rhythm, not mechanical uniformity.

## 10. Color and visual hierarchy audit

Check:

- background/surface layering;
- primary/secondary/tertiary text contrast;
- actionable vs non-actionable visual distinction;
- primary vs secondary button emphasis;
- hover/focus/active/disabled states;
- success/warning/error/info semantics;
- selected navigation state;
- borders/dividers;
- badges/status chips;
- dark/light transition consistency;
- decorative gradients/glows competing with content.

Color alone must not be the only way to communicate critical state.

## 11. Icons and imagery audit

Check every visible icon on primary navigation and actions:

- renders as an icon, never as raw glyph-name text;
- consistent family/style/optical weight;
- appropriate size relative to text;
- alignment and touch target;
- meaningful accessible name when required;
- decorative icons hidden from assistive semantics when appropriate;
- no random emoji replacement unless intentionally part of the design language.

Do not add a new icon package without explicit dependency approval. Reuse current installed assets/dependencies first.

## 12. Information architecture and UX audit

A visually attractive page can still fail UX.

Inspect whether a first-time user can understand:

- where they are;
- what the page is for;
- what they can do next;
- what is current state vs action;
- what is pending/preview/unavailable;
- what belongs to Identity, Authentication, MFA, Context, Roles, Capabilities, Resource Scope, Sessions, Security, and Administration on Module 01 surfaces;
- why an action is disabled or unavailable;
- whether an error is recoverable and how.

Flag:

- duplicated concepts;
- contradictory labels;
- internal engineering vocabulary exposed to end users;
- unclear hierarchy;
- excessive cognitive load;
- important information buried below decorative content;
- action labels that describe implementation rather than user intent.

## 13. State-completeness audit

For each meaningful async/data component, inspect the states that exist in current product scope:

- initial/loading;
- success;
- empty;
- partial success;
- recoverable error;
- forbidden/unauthenticated where applicable;
- disabled/read-only;
- pending/preview for unsupported capability.

Do not invent fake data to make an empty layout look finished.

If a capability is not implemented, present it as pending/preview only when that presentation is useful to the user. Avoid raw internal phrases such as database, contract, service, DTO, API, or aggregate implementation details on normal member-facing screens.

## 14. Interaction audit

Use the real browser to operate the interface, not just load it.

Check relevant:

- primary navigation;
- sidebar/module switching;
- search;
- filters;
- pagination;
- tabs;
- forms;
- dialogs;
- dropdowns;
- menus;
- tables;
- destructive confirmations;
- logout;
- auth redirects/returnTo;
- mobile navigation;
- retry actions;
- keyboard navigation for primary paths.

Inspect hover, focus, active, disabled, loading, and error feedback where applicable.

## 15. Accessibility baseline

Do not reduce accessibility to a score.

Inspect primary flows for:

- semantic heading order;
- accessible names for buttons/links/inputs;
- explicit or programmatic form labels;
- visible focus indicators;
- logical keyboard order;
- no keyboard trap;
- sufficient practical contrast;
- meaningful status/error announcements where current implementation supports them;
- icon-only action names;
- clickable elements implemented with appropriate semantics;
- readable zoom/responsive behavior.

Never remove accessible behavior to improve visual appearance.

## 16. Runtime and performance-stability audit

Using Chrome DevTools MCP inspect:

- Console errors/warnings relevant to the page;
- React/hydration errors;
- failed font/icon/image requests;
- failed API/resources;
- redirect loops;
- duplicate requests caused by UI behavior;
- obvious request waterfalls;
- major layout shifts/jank;
- repeated rerenders or interactions that visibly freeze the UI;
- oversized assets when they visibly affect UX.

This is a sanity gate, not permission for speculative performance refactoring.

## 17. Security-sensitive UI rules

UI work must not weaken application security.

For auth/IAM surfaces verify:

- backend remains authorization authority;
- frontend capability checks are presentation only;
- access/refresh/provider tokens are not exposed in DOM, normal payloads, localStorage, sessionStorage, screenshots, or logs;
- secret/session values are redacted from evidence;
- UI fixes do not bypass 401/403 behavior;
- UI fixes do not duplicate Keycloak/MFA/RBAC business logic in frontend code.

## 18. Defect classification

Use both severity and change type.

Severity:

- `P0` — security/data-loss/core-flow blocker;
- `P1` — primary interaction broken or severely unusable;
- `P2` — clearly visible quality/responsive/accessibility defect;
- `P3` — polish with no meaningful usability/stability impact.

Change type:

- `CONFIG ONLY`;
- `SMALL UI FIX`;
- `SHARED COMPONENT/TOKEN FIX`;
- `COMPONENT REWORK`;
- `PRODUCT/UX DECISION`;
- `BACKEND/ARCHITECTURE — OUT OF SCOPE`.

Do not hide a visible P1/P2 issue behind a high overall visual score.

## 19. Fix policy

When the task authorizes fixes, fix clearly in-scope UI defects without waiting after every minor change.

Prefer this order:

1. fix shared root cause;
2. reuse existing component/token;
3. reuse installed dependency/native platform;
4. smallest local change.

Stop for approval before:

- adding/upgrading/removing dependencies;
- changing backend business rules;
- changing Keycloak/MFA policy;
- changing RBAC semantics/capabilities;
- schema/migration work;
- destructive data mutation;
- introducing a new design system when one already exists;
- making a product decision not defined by current requirements.

## 20. Mandatory before/after evidence for fix tasks

For each meaningful fix batch retain concise evidence:

- route/state;
- viewport;
- before finding;
- affected source/root cause;
- after browser result;
- Console result;
- Network result when relevant.

Screenshots are evidence, not decoration. The agent must visually inspect them.

Do not claim “fixed” because CSS compiled.

## 21. Final regression pass

After all fixes, perform a fresh pass over every directly affected primary route at representative desktop and mobile widths.

For a broad workspace/UI stabilization task, minimum final routes are the changed routes plus their shared shell neighbors.

Check again:

- layout;
- typography;
- icons;
- responsive behavior;
- language wrapping;
- interaction;
- focus;
- loading/empty/error states;
- Console;
- Network;
- auth/session behavior where relevant.

One clean pass must occur after the final edit.

## 22. Completion criteria

A UI target may be called `stable for integration` only when:

- no known P0/P1 UI defect remains;
- no obvious overlap/clipping/unintended overflow remains on tested widths;
- primary desktop and mobile flows are usable;
- intended fonts/icons load and render correctly;
- typography hierarchy is coherent;
- no user-facing raw engineering/debug text remains unless intentionally admin/debug-only;
- localization does not visibly break tested layouts;
- meaningful loading/empty/error states are usable;
- no significant Console/runtime issue remains unexplained;
- browser Network behavior is sane for the tested interaction;
- basic keyboard/accessibility semantics work on primary actions;
- security/auth boundaries remain intact;
- final browser evidence was captured after the final source change.

`release-ready` is a stronger statement and requires whatever additional release/security/accessibility/performance gates the repository defines; do not infer it solely from this skill.

## 23. Final report format

Return a concise matrix:

| Surface | Viewports | Visual | Responsive | Typography | Interaction | A11y basics | Console/Network | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Then report:

- Overall: `PASS`, `PASS WITH NON-BLOCKING ISSUES`, `FAIL`, or `BLOCKED`;
- fixes made;
- remaining P0/P1/P2/P3 findings;
- exact browser routes/interactions tested;
- viewports tested;
- typography/font/icon findings;
- localization findings;
- Console/Network findings;
- what was not verified;
- whether UI is unstable, usable with known issues, stable for integration, or release-ready under the repository's broader gates.

For fix tasks, list changed files and the root cause each change addresses.

Never award a high UI score to a surface with obvious visible defects just because its underlying functionality works.
