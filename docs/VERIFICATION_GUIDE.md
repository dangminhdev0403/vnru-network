# Pro-Max Verification Guide — Selectable Test Profiles

This is the repository's **Pro-Max verification framework**. `Pro-Max` describes the quality and completeness of this guide itself; it is **not** a command suffix the user must type.

When the user says `kiểm tra và test module 1`, `test module 2`, `verify <feature>`, or an equivalent request, this guide determines how the agent offers and executes verification. Verification is separate from implementation: prove the current behavior first, then report defects before proposing source changes.

## 1. Command dispatch

When the user asks to test, verify, check, smoke-test, or validate a module/feature **without naming a test profile**, first return this selector and wait for the user's choice:

| Select | Profile | Static/tests | Real backend/API | Auth/security | Real browser UI | Perf sanity |
| --- | --- | --- | --- | --- | --- | --- |
| `1` | **Quick** | Yes, focused | Smoke only if required | Focused | No | No |
| `2` | **Integration** | Yes | Yes | Yes | No | No |
| `3` | **Browser UI** | Focused prerequisites | Required dependencies only | Relevant flows | **Yes — Chrome DevTools MCP** | Basic |
| `4` | **Full** *(recommended before declaring a module ready)* | **Full relevant validation** | **Yes** | **Yes** | **Yes — Chrome DevTools MCP** | **Yes, sanity only** |
| `5` | **Custom** | User-selected | User-selected | User-selected | User-selected | User-selected |

The selector response must explicitly say whether real browser interaction is included. Never hide browser testing behind a generic phrase such as `UI tests`.

If the user already names a profile, do not ask again:

- `test module 1 quick` → Quick.
- `test module 1 integration` → Integration.
- `test module 1 ui` / `browser` → Browser UI.
- `test module 1 full` / `toàn diện` → Full.
- `test module 1 custom: ...` → Custom.

The **Full** profile is the default recommendation for post-merge verification, release-readiness checks, and any request asking whether a module is complete, ready, production-ready, or integration-ready.

## 2. Common verification rules

For every profile:

1. Verify the intended branch/ref and inspect Git/worktree state.
2. Preserve unrelated dirty, unmerged, unfinished, ahead, or uncertain worktrees/branches.
3. Discover the actual target surfaces from current source/contracts; do not invent routes, APIs, scripts, fixtures, or infrastructure.
4. Never claim an unrun command passed.
5. Do not redesign, refactor, add features, or expand scope while verifying.
6. Do not modify source code merely to make a test pass.
7. If a real source defect is found, stop before editing and report: failing command/flow, expected behavior, actual behavior, root cause, affected files/functions, minimal proposed fix, and regression risk. Wait for approval before changing source.
8. Environment/setup-only corrections may be made when they do not modify source; report exactly what changed.
9. Do not commit, push, open a PR, or merge verification fixes unless explicitly requested.
10. Backend authorization remains authoritative. Frontend visibility is never proof of authorization.

## 3. Profile definitions

### 3.1 Quick

Use for fast confidence after a small change.

Run only the smallest relevant set:

- focused unit/component tests;
- lint/typecheck for the affected scope when available;
- focused build/compile check when needed;
- one smallest runnable backend/API smoke when the feature depends on runtime behavior;
- targeted regression around direct callers/dependents.

Real browser interaction: **No**, unless the user explicitly adds it.

### 3.2 Integration

Use to verify service and frontend/backend contract behavior without browser automation.

Include Quick plus, where applicable:

- runnable services and real development database/runtime;
- real HTTP success, empty, invalid-input and boundary cases;
- pagination/cursor/filter/search semantics;
- safe `4xx/5xx` behavior;
- data visibility and authorization boundaries;
- loading/empty/error/partial-success integration states;
- session/auth flow and token/secret exposure checks;
- adjacent regression surfaces.

Real browser interaction: **No**. This profile may validate rendered/server behavior with automated tests, but it does not count as a real browser UX pass.

### 3.3 Browser UI

Use when the main question is whether the actual web UI works for a user.

Run focused prerequisites first, then use the configured **Chrome DevTools MCP** against the real running application. Browser verification must include relevant user interactions, not only page loading.

Check as applicable:

- navigation, redirects and browser history;
- login/session flow using the existing development auth path;
- clicking primary actions, tabs, filters, search, pagination and forms in scope;
- loading, empty, error, partial-failure and success states;
- desktop and mobile viewport behavior;
- keyboard focus and basic accessibility/name semantics;
- DOM/rendered state;
- Network requests, responses, query parameters, status codes and duplicate calls;
- Console errors, hydration warnings, failed resources and unhandled rejections;
- browser storage/request/DOM exposure of secrets or provider/access/refresh tokens;
- screenshot evidence for key states;
- basic performance/network-waterfall sanity.

If Chrome DevTools MCP is unavailable or cannot connect, mark browser verification **BLOCKED** and state the exact tooling/runtime blocker. Do not silently replace it with manual clicking or code inspection.

Real browser interaction: **Yes — mandatory for web UI targets.**

### 3.4 Full

Use for the strongest practical verification before calling a module integration-ready. This is the fullest execution profile defined by the Pro-Max guide.

Run the relevant gates in order:

#### Gate A — Repository/static

- branch/ref/worktree sanity;
- focused + relevant full test suites;
- lint;
- typecheck;
- production build;
- schema/Prisma generation/migration sanity where relevant;
- security/secret/token scans already supported by the repository.

#### Gate B — Backend/runtime

Start the real required services and development dependencies. Exercise real HTTP contracts and important boundaries: success, empty, invalid input, filters/search, pagination/cursor, authorization/visibility, safe failures, and data-leak prevention.

#### Gate C — Integration

Verify the real flow across services and frontend. Include independent/partial failures when the architecture supports them. Confirm unsupported capabilities remain explicitly pending rather than showing fabricated production data.

#### Gate D — Auth/security

Verify the existing authoritative session path, unauthenticated and forbidden behavior, redirect/return semantics, downstream-service failure classification, and absence of browser-visible provider/access/refresh tokens or secrets.

#### Gate E — Real browser with Chrome DevTools MCP

For every web UI target, perform actual user interactions through Chrome DevTools MCP and inspect DOM, Network, Console, responsive behavior, focus/accessibility basics, screenshots and basic performance/network waterfalls.

#### Gate F — Regression sanity

Test only directly adjacent existing behavior needed to prove the target did not break neighboring flows. Do not turn verification into an unrelated full-system rewrite.

Real browser interaction: **Yes — mandatory for web UI targets.**

## 4. Module-aware test selection

After a profile is selected, discover the module's real runtime surface and show a short execution manifest before running destructive or expensive operations.

Example for an account/security request after the user chooses `4`:

```text
Target: Module 01 IAM
Profile: Full
Planned surfaces discovered from current source:
- auth/session service and its existing contracts
- /account and /security
- /admin/iam
- /security
- existing login/logout/returnTo flow
Browser UI: YES — Chrome DevTools MCP
Source edits during verification: NO
```

The manifest is descriptive, not an approval gate unless the user asked for plan-only behavior. After showing it, proceed with the selected verification profile.

## 5. Evidence standard

Every final verification report must separate what was actually verified from what was not verified.

Use this matrix:

| Area | Result | Evidence |
| --- | --- | --- |
| Git/ref | PASS / FAIL / BLOCKED / N/A | exact ref/status |
| Tests | PASS / FAIL / BLOCKED / N/A | exact commands and counts |
| Build/lint/typecheck | PASS / FAIL / BLOCKED / N/A | exact commands |
| Backend runtime | PASS / FAIL / BLOCKED / N/A | endpoint/runtime evidence |
| Integration | PASS / FAIL / BLOCKED / N/A | flow evidence |
| Auth/security | PASS / FAIL / BLOCKED / N/A | observed behavior |
| Browser UI / DevTools | PASS / FAIL / BLOCKED / N/A | interactions, Network/Console, screenshots |
| Regression sanity | PASS / FAIL / BLOCKED / N/A | adjacent flows checked |

Finish with:

- **Overall:** `PASS`, `PASS WITH NON-BLOCKING ISSUES`, `FAIL`, or `BLOCKED`.
- Blocking issues.
- Non-blocking issues.
- Browser/Chrome DevTools MCP findings.
- What was verified.
- What was not verified.
- Whether the target is ready for the next development slice.
- Recommended next step.

A build-only or unit-test-only result must never be described as a full module verification when the selected profile requires runtime or browser evidence.

## 6. Examples

User:

```text
kiểm tra và test module 1
```

Required first response:

```text
Select verification profile:
1. Quick — focused tests/build; Browser UI: NO
2. Integration — backend/API/auth integration; Browser UI: NO
3. Browser UI — real UI interaction via Chrome DevTools MCP; Browser UI: YES
4. Full — static + runtime + integration + auth + real browser + regression; Browser UI: YES (recommended)
5. Custom — choose specific checks
```

The user does **not** need to type `pro-max`. Pro-Max is the verification framework defined by this file.

User:

```text
test module 1 full
```

Action: execute Full directly; do not ask for profile selection again.
