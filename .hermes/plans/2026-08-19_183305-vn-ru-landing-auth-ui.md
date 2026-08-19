# VN–RU Landing/Auth UI Implementation Plan

> **For Hermes:** Implement task-by-task only after user approval. Preserve unrelated dirty work.

**Goal:** Port the useful UI from `C:\Users\Dangminhdev0403\Downloads\vn-ru-landing(4)\vn-ru-landing` into the existing Next.js + Keycloak application without duplicating static HTML or replacing the real authentication flow.

**Architecture:** The downloaded `index.html` is already byte-equivalent to the active landing design except its static `login.html` link; retain the current home implementation and `/login` route. Port the downloaded auth visual into the existing Keycloak theme because Keycloak owns credential forms, validation, password reset, registration, social login, and same-tab OIDC. Do not ship `auth.js`, standalone credential forms, fake OAuth, or a second auth application.

**Tech Stack:** Next.js 16.3, React 19, Keycloak FreeMarker theme, existing CSS, Node assert smoke tests.

---

## Inspection result

| Source artifact | Decision | Reason |
| --- | --- | --- |
| `vn-ru-landing/index.html` | Reuse current home; no port | Matches `frontend/stitch/index.html`; only link differs (`login.html` vs `/login`). |
| `vn-ru-landing/login.html` | Visual reference only | Static demo form conflicts with real same-tab Keycloak OIDC flow. |
| `vn-ru-landing/register.html` | Visual reference for Keycloak registration only | Registration must remain Keycloak-owned and only render when realm registration is enabled. |
| `vn-ru-landing/auth.css` | Port selected visual tokens/layout | Useful source; must be adapted to Keycloak DOM rather than copied wholesale. |
| `vn-ru-landing/auth.js` | Skip | Demo validation/OAuth behavior duplicates and weakens Keycloak behavior. |
| `mnt/data/vn-ru-landing/*` | Ignore | Older/incomplete duplicate export. |

## Decisions

- **FIXED:** `/login` remains a same-tab redirect through `frontend/app/api/auth/login/route.ts` to Keycloak.
- **FIXED:** Backend/Keycloak remains authentication authority; no credentials handled by React.
- **FIXED:** Keep one active implementation. No iframe, `public/` copy, runtime HTML parsing, or `dangerouslySetInnerHTML` for the auth UI.
- **FIXED:** Preserve existing home i18n, Motion, and `/login` button behavior.
- **OPTIONAL:** Port the registration screen after confirming Keycloak realm self-registration is enabled.
- **BLOCKED:** Exact registration behavior, Google IdP availability, and password policy depend on live Keycloak realm configuration; UI must conditionally follow those capabilities.

**Recommendation:** Implement the login visual in the Keycloak theme first. Add registration styling only when the realm exposes `${url.registrationUrl}`. Confidence: high.

---

### Task 1: Lock the source contract with focused smoke checks

**Objective:** Make the expected auth route and downloaded visual invariants executable before CSS changes.

**Files:**
- Modify: `frontend/login-stitch.test.mjs`
- Modify: `infra/keycloak/theme-smoke.test.mjs`

**Steps:**
1. Extend `frontend/login-stitch.test.mjs` to assert:
   - `/login` redirects to `/api/auth/login` in the same tab;
   - no `window.open`, iframe, static `login.html`, or client credential form is introduced;
   - home login CTA remains `/login`.
2. Extend `infra/keycloak/theme-smoke.test.mjs` to assert the target visual hooks and real Keycloak form fields/actions.
3. Run:
   ```bash
   node frontend/login-stitch.test.mjs
   node infra/keycloak/theme-smoke.test.mjs
   ```
4. Expected before implementation: new visual assertions fail; auth-boundary assertions pass.

---

### Task 2: Port the downloaded login composition into the Keycloak template

**Objective:** Match the two-column downloaded login layout while retaining native Keycloak form behavior.

**Files:**
- Modify: `infra/keycloak/themes/vnru/login/login.ftl`

**Steps:**
1. Keep the existing `layout.registrationLayout`, `${url.loginAction}`, `username`, `password`, remember-me, reset-password, registration, messages, social providers, and passkey hooks.
2. Add only semantic wrappers/classes required by the downloaded layout:
   - left brand/banner content;
   - strategic-cooperation label;
   - headline and supporting copy;
   - form intro;
   - footer/home/security labels.
3. Use Keycloak conditions:
   - registration button only under `realm.registrationAllowed`;
   - social login only when providers exist;
   - password reset only when enabled;
   - remember-me only when enabled.
4. Do not hardcode fake member counts (`1k+`, `50+`, `10+`) from the visual reference. Replace with non-quantified RU–VN capability labels or omit.
5. Do not add Google-specific markup unless Keycloak exposes Google in `social.providers`.

---

### Task 3: Replace brittle generated-content CSS with direct responsive styling

**Objective:** Reproduce the downloaded auth appearance using the existing Keycloak DOM and the smallest maintainable CSS.

**Files:**
- Modify: `infra/keycloak/themes/vnru/login/resources/css/login.css`

**Steps:**
1. Retain the downloaded visual direction: 50/50 navy banner + white form, responsive single-column mobile layout.
2. Style real semantic elements/classes from `login.ftl`; remove CSS that synthesizes primary copy using `content:` where markup can own it.
3. Reuse existing CSS variables. No new font/package dependency; use the current stack unless a project-local font already exists.
4. Preserve:
   - visible keyboard focus;
   - field errors and `aria-live` messages;
   - password visibility button;
   - responsive scrolling on small screens;
   - reduced-motion behavior.
5. Avoid the remote `placehold.co` background. Use gradients/native CSS until an approved project-owned image exists.

---

### Task 4: Add registration styling only through Keycloak

**Objective:** Support the downloaded registration visual without creating a standalone Next.js registration form.

**Files:**
- Modify if needed: `infra/keycloak/themes/vnru/login/resources/css/login.css`
- Create only if Keycloak parent template cannot express the approved visual: `infra/keycloak/themes/vnru/login/register.ftl`
- Test: `infra/keycloak/theme-smoke.test.mjs`

**Steps:**
1. Inspect the installed Keycloak parent `register.ftl` and current realm registration capability.
2. If parent markup plus CSS is sufficient, add CSS only.
3. Otherwise add the smallest `register.ftl` override while preserving Keycloak registration action, server validation, password policy, terms, and messages.
4. Do not port `auth.js` password scoring; Keycloak policy/error output is authoritative.
5. If self-registration is disabled, skip this task and retain only the conditional login-page registration link.

---

### Task 5: Verify integration

**Objective:** Prove routing, theme structure, build health, and responsive behavior.

**Files:** No new production files expected.

**Commands:**
```bash
node frontend/login-stitch.test.mjs
node infra/keycloak/theme-smoke.test.mjs
cd frontend
node ./node_modules/eslint/bin/eslint.js app/login/page.tsx app/api/auth/login/route.ts
node ./node_modules/next/dist/bin/next build
```

**Runtime checks:**
1. Start existing frontend, auth service, and Keycloak using the repository’s current workflow.
2. Navigate `/` and activate **Đăng nhập**.
3. Verify same-tab redirect reaches the styled Keycloak page.
4. Verify username/password submission uses Keycloak action; no client interception.
5. Verify forgot-password, remember-me, registration, and social-provider controls only appear when enabled.
6. Verify invalid credentials produce localized, visible errors.
7. Verify desktop and mobile layouts have no horizontal overflow; keyboard tab order and focus indicators remain usable.
8. Verify Back returns to `/` and `returnTo` remains sanitized.

## Likely production file delta

```text
infra/keycloak/themes/vnru/login/login.ftl
infra/keycloak/themes/vnru/login/resources/css/login.css
frontend/login-stitch.test.mjs
infra/keycloak/theme-smoke.test.mjs
```

Optional only when required by live realm capability:

```text
infra/keycloak/themes/vnru/login/register.ftl
```

## Explicitly skipped

- Replacing the existing home: downloaded home already matches it.
- Copying `login.html`, `register.html`, `auth.css`, or `auth.js` into `public/`.
- React email/password forms.
- Fake Google OAuth or client-side success messages.
- New dependencies, form libraries, validators, or auth abstractions.
- Fake KPI/member counts.

## Approval gate

Approve one scope before implementation:

1. **Recommended:** Keycloak login visual only; registration remains conditional/current.
2. Keycloak login + registration visual, contingent on realm self-registration being enabled.
