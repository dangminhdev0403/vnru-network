# Module 1 IAM Implementation Plan

> **For Hermes:** Execute only after explicit user approval. Use one fresh bounded Antigravity writer per slice; host owns Git, verification, push, PR, and merge.

**Goal:** Complete Module 1 in `services/auth-service/`: identity, authentication, sessions, context-bound RBAC, security/2FA, IAM administration, selective audit, and a stable authenticated-request context.

**Architecture:** Keep the existing five internal NestJS modules inside one `auth-service`: `identity`, `authentication`, `session`, `access-control`, and `security`. Build vertical slices in dependency order. Do not create extra microservices, empty architecture folders, speculative shared packages, Kafka infrastructure, or frontend work.

**Tech stack now:** NestJS 11, TypeScript, Jest, pnpm. Persistence, IdP, token/session transport, validator, 2FA mechanism, OpenAPI exporter, and event infrastructure are not installed or resolved yet.

**Repository baseline:**
- Workspace: `C:\Users\Dangminhdev0403\Desktop\workspace\vnru-network`
- Branch: `master`
- HEAD: `b49e13c4fdcbdef26e0fc3a558dd3040acd9f68b`
- Working tree observed clean.
- Graphify absent; scoped Repomix pack created at `C:\tmp\vnru-module1-plan.xml` (30 files, 14,956 tokens, security PASS).
- `origin/feat/authz-core` contains an earlier authorization attempt that was deliberately reverted. It is reference-only, never a merge/cherry-pick source.

---

## Scope boundaries

### In scope
- Internal user identity and account status.
- Federated identity linkage.
- Authentication provider boundary and approved provider flow.
- Session create/validate/expire/revoke.
- Stable authenticated-request context.
- Context-bound roles, permissions, assignments, and fail-closed checks.
- Approved 2FA and failed-authentication controls.
- Minimal IAM administration endpoints.
- Selective IAM/security audit records.
- Focused tests, generated OpenAPI only after exporter exists, build/lint/e2e gates.

### Out of scope
- Frontend/workspace UI.
- API Gateway implementation.
- Organization, researcher, expert, grant, review, project, academic, technology, knowledge, or analytics records.
- Kafka/outbox, Redis, notification service, separate audit service.
- Social login/provider matrix beyond the approved first IdP.
- Permission inheritance DSL, policy engine, ABAC, concurrent active contexts.
- Cross-service DB access.

---

## Phase 0 — Decision and dependency gate

**Owner:** User/stakeholders + Hermes. No Antigravity writer.

**Status:** COMPLETE — stakeholder baseline approved and recorded in `docs/OPEN_QUESTIONS.md` on 2026-08-18.

Resolve before implementation:

1. **OPEN-01:** first IdP and protocol.
2. **OPEN-02:** one active context per session or another explicit model.
3. Persistence choice and migration workflow for `auth-service`.
4. Session transport: opaque server session or signed token plus revocation strategy.
5. First 2FA mechanism and enrollment/recovery policy.
6. Approved request-validation mechanism.
7. Audit persistence scope; keep Kafka publishing deferred unless separately approved.
8. Exact package and lockfile changes.

**Deliverable:** One short ADR/decision update plus explicit package approval. Do not let a writer infer unresolved choices.

**Exit gate:** OPEN-01/02 and technical choices have named answers; package changes approved; secrets remain environment-only.

**Resolved baseline:** Keycloak broker/OIDC with Keycloak-native TOTP; one active context per opaque PostgreSQL-backed cookie session; PostgreSQL + Prisma; Zod; PostgreSQL audit. Redis/Kafka and application-owned TOTP deferred. Approved packages are listed in `docs/OPEN_QUESTIONS.md`.

---

## Phase 1 — Runtime foundation

### Slice 1A — Persistence and validation setup

**Writer:** `AG-M1-01`

**Branch:** `feat/m1-runtime-foundation`

**Objective:** Add only the approved persistence/migration and controller-boundary validation mechanisms.

**Likely files:**
- Modify: `services/auth-service/package.json`
- Modify: `services/auth-service/pnpm-lock.yaml`
- Modify: `services/auth-service/src/app.module.ts`
- Create only the selected persistence config/schema and one migration path required by the approved tool.
- Create one configuration validation check if the selected stack requires runtime configuration.

**Rules:**
- Maximum 8 files per writer invocation. Split setup and first migration if the selected tool exceeds this.
- No IAM entities beyond the minimum infrastructure proof.
- No Docker/Kafka/Redis/API Gateway.
- No hardcoded secrets or fallback credentials.

**Check:** Migration applies to a disposable local DB, repeats safely where supported, focused config test passes, `pnpm build` passes.

### Slice 1B — Identity vertical slice

**Writer:** `AG-M1-02`

**Branch:** `feat/m1-identity`

**Objective:** Persist and retrieve internal users plus external identity links; enforce unique provider-subject linkage and account status.

**Likely files:**
- Grow only `services/auth-service/src/modules/identity/` with the smallest required domain/application/infrastructure files.
- Modify the approved persistence schema/migration.
- Add one real identity regression test.

**Acceptance:**
- Provider + subject resolves one internal `userId`.
- Duplicate linkage fails at the persistence boundary.
- Disabled/suspended status is represented without owning profile/business data.
- No provider-specific login orchestration inside `identity`.

**Check:** Focused identity test, migration check, build.

---

## Phase 2 — Authentication and session

### Slice 2A — Authentication provider port

**Writer:** `AG-M1-03`

**Branch:** `feat/m1-auth-provider`

**Objective:** Define the smallest approved provider adapter boundary and normalize a verified external subject into the identity flow.

**Likely files:**
- Grow `services/auth-service/src/modules/authentication/` only as required.
- Add one fake/test adapter for the real port.
- Import the identity public contract; never its repository.

**Acceptance:**
- Invalid provider result fails closed.
- Verified provider identity resolves/links through `identity`.
- Provider credentials/config are environment-only.
- No second IdP, provider factory, or generic plugin system.

**Check:** Focused authentication orchestration test, build.

### Slice 2B — Session lifecycle

**Writer:** `AG-M1-04`

**Branch:** `feat/m1-session-lifecycle`

**Objective:** Create, validate, expire, revoke one session, and revoke all sessions for a user using the approved transport model.

**Likely files:**
- Grow `services/auth-service/src/modules/session/` only as required.
- Modify persistence schema/migration if needed.
- Add one real lifecycle regression test.

**Acceptance:**
- Expired/revoked/missing sessions fail closed.
- Stored secrets/tokens use the approved protected representation.
- Session validation returns IDs and state, not business-domain records.
- Revocation behavior survives service restart when the approved model requires it.

**Check:** Focused session test including expiry/revocation, migration check, build.

### Slice 2C — Login, logout, current-session contract

**Writer:** `AG-M1-05`

**Branch:** `feat/m1-auth-flow`

**Objective:** Wire provider verification, identity status, security hook, context resolution hook, and session creation into the first end-to-end backend flow.

**Likely files:**
- Authentication controller/application files.
- Minimal public contracts from `identity`, `session`, and later-safe hooks.
- Focused e2e test.

**Acceptance:**
- Public auth entry/callback routes are explicitly allowlisted; all other endpoints remain private.
- Disabled/suspended identity cannot obtain or keep a trusted session.
- Logout revokes through `session`; authentication only orchestrates.
- Response exposes no provider tokens or sensitive internals.

**Check:** Focused unit test, focused e2e test, build.

---

## Phase 3 — Context-bound RBAC

### Slice 3A — Roles, permissions, assignments

**Writer:** `AG-M1-06`

**Branch:** `feat/m1-rbac-model`

**Objective:** Persist capability permissions, roles, and scoped assignments using `<domain>.<resource>.<action>` keys.

**Likely files:**
- Grow `services/auth-service/src/modules/access-control/` only as required.
- Modify persistence schema/migration.
- Add focused permission-resolution test.

**Acceptance:**
- Permission keys are exact capability strings, not role-name inference.
- Assignments reference stable external scope IDs only.
- Missing assignment/context/permission denies access.
- No copied organization or business resource records.

**Check:** Focused access-control test, migration check, build.

### Slice 3B — Active authorization context

**Writer:** `AG-M1-07`

**Branch:** `feat/m1-active-context`

**Objective:** Implement the approved OPEN-02 model and resolve permissions for exactly the active context.

**Acceptance:**
- Context belongs to the authenticated user and assignment scope.
- Permissions from separate contexts are never unioned by default.
- Invalid target context fails closed.
- Switching behavior exactly matches the resolved decision; no concurrent-context extension.

**Check:** Focused context test covering cross-context leakage, build.

### Slice 3C — Authenticated-request context and guard

**Writer:** `AG-M1-08`

**Branch:** `feat/m1-request-context`

**Objective:** Produce the stable request context and enforce session, account state, active context, and capability permission at backend boundaries.

**Logical output:** `userId`, `sessionId`, `activeContext`, optional stable scope references, `permissions`, `authenticationLevel`.

**Acceptance:**
- Guard pipeline denies missing/expired/revoked session, inactive user, invalid context, and absent permission.
- Business resource ownership/workflow remains outside `auth-service`.
- One protected sample endpoint/e2e seam proves anonymous and unauthorized denial plus authorized success.

**Check:** Focused guard unit test, e2e test, build.

---

## Phase 4 — Security policy and 2FA

### Slice 4A — Failed-authentication and account controls

**Writer:** `AG-M1-09`

**Branch:** `feat/m1-auth-security-policy`

**Objective:** Implement the approved failed-authentication, cooldown/lock, and suspicious-authentication minimum.

**Acceptance:**
- Policy state has one owner: `security`.
- Identity status changes use the identity public contract.
- Logs never contain credentials, provider assertions, session secrets, or 2FA secrets.
- Time-based behavior has deterministic clock-boundary tests.

**Check:** Focused policy test, build.

### Slice 4B — Approved 2FA flow

**Writer:** `AG-M1-10`

**Branch:** `feat/m1-2fa`

**Objective:** Add only the approved enrollment/challenge/verification/recovery behavior and propagate `authenticationLevel`.

**Acceptance:**
- Secret material uses approved encryption/protection.
- Replay, expired challenge, wrong code, and missing enrollment fail closed.
- Step-up is required only by explicit policy.
- No alternative 2FA channels or speculative device-management UI.

**Check:** Focused 2FA tests including negative paths, e2e step-up seam, build.

---

## Phase 5 — IAM administration and selective audit

### Slice 5A — Minimal IAM administration

**Writer:** `AG-M1-11`

**Branch:** `feat/m1-iam-admin`

**Objective:** Add only required user-status, role, permission, and assignment administration endpoints.

**Acceptance:**
- Every endpoint has boundary validation and `iam.*` permission enforcement.
- List endpoints use bounded pagination.
- Mutations preserve local transaction invariants.
- No organization/profile administration.

**Check:** Focused controller/application tests, pagination test, e2e authorization test, build.

### Slice 5B — Selective IAM/security audit

**Writer:** `AG-M1-12`

**Branch:** `feat/m1-iam-audit`

**Objective:** Persist traceability records only for security-relevant IAM actions.

**Minimum events:** successful/failed authentication where policy requires it, 2FA verification, session revocation, account-status change, role/permission assignment change.

**Acceptance:**
- Audit records are append-only through the application boundary.
- Sensitive payloads are excluded.
- Correlation/actor/target metadata is present where available.
- No Kafka/outbox unless separately approved.

**Check:** Focused audit test, mutation-to-audit integration test, build.

---

## Phase 6 — Contract closure and module gate

### Slice 6A — OpenAPI and contract closure

**Writer:** `AG-M1-13`

**Branch:** `chore/m1-contract-closure`

**Objective:** Export the actual backend contract only if the approved OpenAPI exporter now exists; align consumers only when present.

**Acceptance:**
- Generated OpenAPI is source of truth.
- No handwritten duplicate endpoint catalog.
- Breaking changes are explicit and versioned.
- No frontend client generation if no approved consumer exists.

**Check:** OpenAPI export command, deterministic diff check, build.

### Slice 6B — Final read-only review and context refresh

**Owner:** Hermes + independent read-only reviewer; no writer unless a bounded correction is approved.

**Review lanes:**
1. Identity/auth/session security and persistence.
2. RBAC/context isolation and admin authorization.
3. 2FA/audit/privacy and contract consistency.

**Required gates from `services/auth-service/`:**

```bash
pnpm test -- --runInBand
pnpm test:e2e -- --runInBand
pnpm build
pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
git diff --check -- services/auth-service
```

Use disposable local infrastructure only. Never run destructive migration reset against shared/production data.

After all gates pass:
- Run `graphify update .` if Graphify has been introduced; otherwise record `Graphify absent`.
- Regenerate one bounded Module 1 Repomix pack.
- Verify generated context is newer than changed source.
- Update `services/docs/PLANS.md` with real results only; it is currently empty.

---

## Antigravity dispatch contract

Every writer receives:

- Canonical workspace/worktree path.
- Exact base SHA and branch.
- One observable slice only.
- Proven flow and acceptance criteria from this plan.
- Maximum 8 allowed files.
- 20-minute internal time box; 25-minute outer timeout.
- Focused RED/GREEN check.
- `no reset/checkout/overwrite`, preserve unrelated work.
- No broad repository scan; use bounded Repomix plus exact named source.
- No commit, push, PR, merge, dependency changes, Docker, deploy, or production action unless the slice explicitly authorizes it.
- Stop `BLOCKED` on unresolved decision, scope expansion, >8 files, package surprise, migration risk, dirty target collision, auth/quota failure, or workspace mismatch.

Fresh conversation per slice. Antigravity codes only. Writer summaries are untrusted until host diff inspection and rerun gates pass.

---

## Git workflow

### Default: sequential short-lived PRs

Module 1 slices depend on each other. Do not run implementation writers concurrently against the same repository or long-lived integration branch.

For each approved slice:

```bash
git fetch origin
git switch master
git pull --ff-only origin master
git worktree add ../vnru-m1-<slice> -b <branch> origin/master
```

1. Record base SHA and clean/scoped status in the new worktree.
2. Bind one Antigravity writer to that exact worktree.
3. Host inspects `git status`, full diff, changed-file provenance, and reruns every gate.
4. Host commits only verified slice files using Conventional Commits.
5. Host pushes branch and opens one PR.
6. Independent read-only review plus GitHub CI.
7. User approves merge. Host merges squash or rebase according to repository policy; never let Antigravity merge.
8. Delete remote/local branch and worktree only after merge verification.
9. Start the next dependent slice from updated `origin/master`.

Suggested commit/PR sequence:

| Order | Branch | Commit type |
|---:|---|---|
| 1 | `feat/m1-runtime-foundation` | `build(auth): add approved runtime foundation` |
| 2 | `feat/m1-identity` | `feat(auth): add identity boundary` |
| 3 | `feat/m1-auth-provider` | `feat(auth): add authentication provider boundary` |
| 4 | `feat/m1-session-lifecycle` | `feat(auth): add session lifecycle` |
| 5 | `feat/m1-auth-flow` | `feat(auth): add login and logout flow` |
| 6 | `feat/m1-rbac-model` | `feat(auth): add context-bound RBAC model` |
| 7 | `feat/m1-active-context` | `feat(auth): add active authorization context` |
| 8 | `feat/m1-request-context` | `feat(auth): enforce authenticated request context` |
| 9 | `feat/m1-auth-security-policy` | `feat(auth): add authentication security policy` |
| 10 | `feat/m1-2fa` | `feat(auth): add approved 2FA flow` |
| 11 | `feat/m1-iam-admin` | `feat(auth): add IAM administration` |
| 12 | `feat/m1-iam-audit` | `feat(auth): add selective IAM audit` |
| 13 | `chore/m1-contract-closure` | `chore(auth): close Module 1 contracts` |

### Safe parallelism

Parallelize read-only discovery/review, not dependent writers. A writer lane may start only when it touches an independent file set and consumes a merged stable contract. Default for Module 1 remains sequential because schema, module contracts, and `AppModule` are shared hotspots.

### Failure handling

- Failed focused gate: writer stops; host preserves diff; no commit/push.
- Auth/quota failure: preserve diff; do not switch account or retry until user confirms readiness.
- Scope expansion: split a new slice; do not exceed 8 files to finish quickly.
- Base branch moved: inspect/rebase before writer launch, never during active writing.
- Migration conflict: stop; never reset shared data.
- Surprise edits outside worktree: inventory provenance; do not delete or overwrite.

---

## Phase completion criteria

A phase completes only when:

- Every slice PR merged into current `master`.
- Focused tests rerun on merged `master`.
- No unresolved review finding in that phase.
- Package/migration/contract impact documented.
- Exact `Docs read:` list and commands/results recorded.

Module 1 completes only when every criterion in `services/auth-service/SERVICE_SPEC.md:303-316` is demonstrated by real tests or runtime checks.

---

## Docs read

- `AGENTS.md`
- `docs/README.md`
- `docs/RULES.md`
- `docs/ARCHITECTURE.md`
- `docs/RBAC_ARCHITECTURE.md`
- `docs/API_SPEC.md`
- `docs/OPEN_QUESTIONS.md`
- `services/AGENTS.md`
- `services/docs/ARCHITECTURE.md`
- `services/docs/RULES.md`
- `services/docs/SERVICE_GUIDE.md`
- `services/auth-service/README.md`
- `services/auth-service/SERVICE_SPEC.md`
- `services/auth-service/package.json`
- Existing source/tests under `services/auth-service/src/` and `services/auth-service/test/`

## Approval boundary

This artifact is planning-only. No writer, dependency change, migration, commit, push, PR, merge, or implementation is authorized until the user explicitly approves the relevant phase. Phase 0 decisions and package approval must precede Phase 1.
