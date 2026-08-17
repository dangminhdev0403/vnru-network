# Module 1 Antigravity Assignment Plan

> **For Hermes:** Planning only. After explicit implementation approval, dispatch one bounded writer at a time. Four Docker lanes provide ownership rotation and parallel read-only review, not concurrent writes.

**Goal:** Deliver the smallest secure Module 1 backend from the approved Phase 0 baseline.

**Architecture:** Keep the existing five internal modules in one `auth-service`. PostgreSQL/Prisma owns persistence; Keycloak owns OIDC and TOTP; `auth-service` owns opaque sessions, one active context, RBAC, and audit. Reuse Node.js `crypto`; avoid application-owned TOTP, JWT, Redis, Kafka, policy engines, provider factories, and speculative OpenAPI infrastructure.

**Baseline:**
- Repository: `C:\Users\Dangminhdev0403\Desktop\workspace\vnru-network`
- HEAD: `b49e13c4fdcbdef26e0fc3a558dd3040acd9f68b`
- Docker image: `antigravity-cli:local`
- Ready lanes: `account-01` through `account-04`
- Current tree is dirty with approved Phase 0/Graphify artifacts. No worktree or writer starts until that baseline is reviewed and committed by the host with explicit approval.

---

## Assignment model

| Lane | Primary ownership | Writer waves | Parallel read-only duty |
|---|---|---|---|
| **AGY-01** | Runtime + identity | Wave 1 | Review persistence/schema in later waves |
| **AGY-02** | OIDC + sessions | Wave 2 | Review auth/session security in later waves |
| **AGY-03** | Context-bound RBAC | Wave 3 | Review authorization isolation in later waves |
| **AGY-04** | Admin + audit + closure | Wave 4 | Final contract/privacy review |

**Hard rule:** one writer active. Other lanes may review the merged prior wave read-only. Account isolation is not source-code isolation.

---

## Wave 0 — Host baseline gate

**Owner:** Hermes/host. No AGY writer.

1. Inspect Phase 0 and Graphify artifacts.
2. Decide which generated Graphify files are tracked.
3. Commit/push one baseline checkpoint only after explicit approval.
4. Require clean `master`, current `origin/master`, passing existing tests/build.
5. Generate one bounded Repomix pack for Wave 1.

**Stop:** dirty baseline, failed current gates, or unapproved commit/push.

---

## Wave 1 — AGY-01: runtime and identity

### Slice 1A — Prisma + Zod foundation

**Branch:** `feat/m1-runtime-foundation`

**Observable result:** service boots with validated configuration and Prisma connectivity; one migration workflow exists.

**Allowed scope:** maximum 8 exact files selected after Graphify query. Expected hotspots:
- `services/auth-service/package.json`
- `services/auth-service/pnpm-lock.yaml`
- `services/auth-service/prisma/schema.prisma`
- one initial migration
- one Prisma/config module
- one focused config test
- `services/auth-service/src/app.module.ts`

**Packages:** only approved Phase 0 list. Use pnpm. No Docker Compose, Redis, Kafka, shared package, or repository abstraction.

**Check:** focused config test, Prisma validation/migration against disposable local DB, build.

### Slice 1B — Internal identity

**Branch:** `feat/m1-identity`

**Observable result:** `(issuer, subject)` resolves exactly one internal user; inactive users are represented; DB uniqueness enforces linkage.

**Minimum models:** `User`, `ExternalIdentity`. Nothing else.

**Check:** one real test covering resolve/create, duplicate provider subject, inactive status.

**Wave gate:** host inspects diff, reruns checks, commits/pushes/PRs sequentially, merges after approval. AGY-02 starts from merged `master` only.

---

## Wave 2 — AGY-02: OIDC and opaque sessions

### Slice 2A — Keycloak OIDC boundary

**Branch:** `feat/m1-keycloak-oidc`

**Observable result:** Authorization Code + PKCE callback normalizes verified Keycloak claims into the identity contract.

**Use:** `openid-client`, Zod, Node.js `crypto`. One Keycloak adapter; no provider factory/interface tree.

**Security checks:** issuer, audience/client, state, nonce, PKCE, required subject. Provider tokens never enter logs/API responses.

**Check:** focused orchestration test using the real adapter seam with network boundary mocked.

### Slice 2B — Opaque session lifecycle

**Branch:** `feat/m1-session-lifecycle`

**Observable result:** random cookie token creates, validates, expires, revokes one/all sessions; DB stores SHA-256 digest only.

**Use:** Node.js `crypto.randomBytes` and `createHash`. No JWT, refresh token, Redis, custom crypto wrapper.

**Cookie:** `Secure`, `HttpOnly`, explicit `SameSite`, bounded expiry. Context switch later rotates token.

**Check:** one lifecycle test covering valid, expired, revoked, digest-not-plaintext.

### Slice 2C — Login/logout/current session

**Branch:** `feat/m1-auth-flow`

**Observable result:** OIDC success checks identity status, creates session, exposes current authenticated identity; logout revokes session.

**TOTP rule:** trust Keycloak authentication level/AMR only. No TOTP enrollment, secret, code verification, or `otplib` in application code.

**Check:** focused e2e: callback success, inactive denial, current session, logout denial afterward.

**Wave gate:** merge each slice sequentially. AGY-01 reviews schema ownership read-only; AGY-03 starts after merged session contract.

---

## Wave 3 — AGY-03: context-bound RBAC

### Slice 3A — Role assignments and one active context

**Branch:** `feat/m1-context-rbac`

**Observable result:** roles contain exact capability keys; assignments bind stable scope references; each session selects one valid context.

**Minimum models:** `Role`, `Permission`, `RolePermission`, `RoleAssignment`, `AuthorizationContext` only if assignment cannot represent context cleanly. Prefer fewer tables when constraints preserve semantics.

**Rules:**
- No role-name authorization.
- No permission union across contexts.
- No copied organization/business records.
- DB uniqueness/foreign keys before application duplicate checks.

**Check:** one test for permission resolution and cross-context leakage denial.

### Slice 3B — Request context and capability guard

**Branch:** `feat/m1-request-context`

**Observable result:** backend produces `userId`, `sessionId`, active context/scope, permissions, authentication level; guard fails closed.

**Check:** protected seam proves anonymous `401`, missing capability `403`, valid capability success, inactive/invalid context denial.

**Wave gate:** AGY-02 reviews session rotation and account-status checks read-only. Merge before admin endpoints.

---

## Wave 4 — AGY-04: minimal administration and audit

### Slice 4A — IAM administration + selective audit

**Branch:** `feat/m1-iam-admin-audit`

**Observable result:** authorized operator can change user status and role assignments; each security-relevant mutation writes an append-only audit record in the same local transaction.

**Endpoints only:**
- bounded user list/read needed for administration;
- user status mutation;
- role/permission assignment mutation.

Skip role-builder CRUD unless a real caller requires it. Seed fixed baseline capabilities instead of building a generic policy editor.

**Audit only:** login outcome where policy requires, logout/revocation, status change, assignment change, Keycloak-authentication-level observation. Exclude secrets/tokens/assertions.

**Check:** focused tests for permission enforcement, pagination bound, transaction rollback, append-only audit fields.

### Slice 4B — Module closure

**Owner:** Hermes + AGY-01/02/03/04 read-only reviewers. No writer unless a concrete defect is found.

Parallel review lanes:
1. **AGY-01:** Prisma constraints, migrations, identity ownership.
2. **AGY-02:** OIDC/session/cookie/security boundary.
3. **AGY-03:** context isolation, fail-closed guards.
4. **AGY-04:** admin pagination, audit privacy, contract consistency.

Host runs:

```bash
pnpm test -- --runInBand
pnpm test:e2e -- --runInBand
pnpm build
pnpm exec eslint "{src,apps,libs,test}/**/*.ts"
git diff --check -- services/auth-service
```

Then refresh:

```bash
graphify update .
```

Regenerate one bounded Module 1 Repomix pack. Completion requires graph/pack newer than changed source.

---

## Git workflow

For every slice:

```bash
git fetch origin
git worktree add ../vnru-m1-<slice> -b <branch> origin/master
```

1. Host records SHA/status and prepares exact Graphify-selected file list plus Repomix pack.
2. Assigned AGY receives one change, maximum 8 files, 20-minute internal time box, focused RED/GREEN, no broad scan.
3. Host verifies real mounted-worktree diff; reruns every claimed check.
4. Host alone commits, pushes, opens PR.
5. Read-only reviewer checks bounded pack and real gate evidence.
6. User approves merge. Host merges; AGY never merges.
7. Remove worktree only after merge verification.
8. Next slice starts from updated `origin/master`.

**No parallel writer branches from stale base.** Parallel speed comes from review/discovery while one writer works, not conflicting schema edits.

---

## Dispatch constraints

Every writer prompt includes:
- canonical worktree path and base SHA;
- exact allowed files, maximum 8;
- forbidden sibling repositories and scratch copies;
- one observable acceptance result;
- one focused test command;
- no reset/checkout/overwrite, install beyond approved packages, build-all, Graphify refresh, commit, push, PR, merge, deploy, or shared DB mutation;
- `BLOCKED` on scope growth, package surprise, migration ambiguity, dirty collision, quota/auth failure, or missing contract.

Writer model/account choice is capacity routing, not architecture ownership. Fresh conversation per slice.

---

## Ponytail deletions from the earlier plan

- Delete application-owned TOTP slice: Keycloak already owns TOTP.
- Delete custom suspicious-login engine: add only after measurable policy exists.
- Delete standalone OpenAPI closure writer: exporter package/script does not exist; add when first consumer requires generated contracts.
- Combine admin and audit: same security mutations and transaction boundary.
- Do not run four writers concurrently: shared Prisma schema/contracts make that slower, not faster.

## Approval boundary

Planning only. No baseline commit, worktree, dependency install, AGY writer, push, PR, merge, or implementation is authorized by this request.
