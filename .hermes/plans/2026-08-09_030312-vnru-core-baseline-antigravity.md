# VN-RU Core Baseline Adoption Plan

> **For Hermes:** After explicit user approval, execute with one bounded Antigravity writer. Planning only now.

**Goal:** Adapt only the durable documentation, architecture, agent, frontend-state, backend-boundary, and security rules from `fullstack-vietSage` into `vnru-network`, then produce one clean sibling base snapshot for the user to commit/push separately.

**Architecture:** VN-RU already declares domain-oriented microservices. Preserve that decision; do not copy VietSage's current modular-monolith topology. Reuse the governance pattern, then rewrite every rule for VN-RU paths, domains, Next.js 16.3, NestJS 11, pnpm, PostgreSQL/Kafka/Redis only where the VN-RU README already declares them. React Query becomes a documented target pattern, not runtime code, because TanStack Query and `@dangminhdev04032005/query-resource` are not installed and no client API module exists yet. Antigravity writes the eight adapted docs in the named repository; a native filesystem copy creates the second snapshot because an AI writer adds no value to a mechanical copy.

**Source:** `C:\Users\Dangminhdev0403\Desktop\workspace\fullstack-vietSage` at `b404bf659bd6d648405e2fe2ef21511523ba7434`

**Target:** `C:\Users\Dangminhdev0403\Desktop\workspace\vnru-network` at `f0e2d1ff2f137684319cf0fd1e0491882e9b55a9`

**Observed target state:** Next.js scaffold in `frontend/`; NestJS scaffold in `services/auth-service/`; root `README.md` untracked; tracked `services/auth-service/README.md` deleted. Preserve both exactly. No reset, checkout, deletion, overwrite, commit, dependency install, lockfile change, or package manifest change.

---

## Copy/adapt matrix

| VietSage concept | VN-RU destination | Action |
|---|---|---|
| Root agent navigation, approval, dirty-work rules | `AGENTS.md` | Create compact VN-RU version; preserve generated `frontend/AGENTS.md` block |
| Documentation index/read order | `docs/README.md` | Create; use VN-RU scopes |
| Architecture baseline and dependency direction | `docs/ARCHITECTURE.md` | Create; describe real VN-RU microservices, gateway, data ownership, sync/async boundaries |
| Documentation/source-of-truth/security governance | `docs/RULES.md` | Create; remove VietSage-specific names, paths, milestones |
| Frontend Server/Client, repository/resource/hook/component boundaries | `frontend/docs/ARCHITECTURE.md` | Create; match current Next.js 16.3 scaffold |
| React Query Rule, HTTP ownership, state ownership, UI errors | `frontend/docs/RULES.md` | Create; mark package activation prerequisite explicitly |
| Backend controller/application/domain/infrastructure boundaries | `services/docs/ARCHITECTURE.md` | Create; microservice-local ownership, no cross-service repository imports |
| Zod/API/security/tests/transactions/pagination rules | `services/docs/RULES.md` | Create; use VN-RU-neutral rules, avoid claiming missing packages/scripts exist |

## Explicitly do not copy

- VietSage domain names, hotel billing rules, routes, UI theme, migrations, plans, deployment addresses, credentials, generated OpenAPI, Graphify output, or source code.
- VietSage modular-monolith topology; VN-RU intentionally declares microservices.
- Kafka/Redis/OpenSearch/S3/Keycloak implementation scaffolding. Existing README declarations are architecture intent, not proof of installed runtime.
- Raw package versions or lockfiles.
- `@dangminhdev04032005/query-resource` or TanStack Query code before a real client API feature exists.
- Duplicate `PLANS.md`, `DESIGN.md`, `API_SPEC.md`, `EVENT_FLOW.md`, `SECRETS.md`, module guides, ADRs, shared packages. Add only when a real implementation task needs them.

---

### Task 1: Create the eight-file governance baseline

**Objective:** Establish one small, internally consistent rule set that agents and developers can follow immediately.

**Files:**
- Create: `AGENTS.md`
- Create: `docs/README.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/RULES.md`
- Create: `frontend/docs/ARCHITECTURE.md`
- Create: `frontend/docs/RULES.md`
- Create: `services/docs/ARCHITECTURE.md`
- Create: `services/docs/RULES.md`

**Steps:**

1. Re-check target canonical path, `HEAD`, and full dirty status. Stop if `HEAD` changed or any planned destination already exists/changed.
2. Read target root `README.md`, `frontend/package.json`, `frontend/AGENTS.md`, and `services/auth-service/package.json`; treat them as target truth.
3. Use the copy/adapt matrix. Summarize principles; do not mechanically copy prose.
4. Keep `docs/RULES.md` authoritative. Scope rules reference it instead of duplicating global text.
5. In `frontend/docs/RULES.md`, specify the future server-state chain:
   `repository -> query-resource resource -> feature hook -> component`.
   State that it applies only after approved installation of `@tanstack/react-query` and `@dangminhdev04032005/query-resource`. Until then, do not invent local substitutes or raw ad-hoc cache abstractions.
6. Keep backend validation wording capability-aware: Zod is the target boundary validator, but do not claim it is installed. Installation and migration require a separate approved feature slice.
7. Add concrete prohibitions: no secrets in code/docs; no cross-service DB access; no frontend-only authorization as a security boundary; no unbounded list APIs; no dependency/package/lockfile edits without approval; preserve unrelated dirty work.
8. Verify links, paths, terminology, duplicate rules, and absence of `VietSage`, hotel, billing, or modular-monolith leakage.

**Focused validation:**

```bash
git diff --check -- AGENTS.md docs frontend/docs services/docs
python -c "from pathlib import Path; files=['AGENTS.md','docs/README.md','docs/ARCHITECTURE.md','docs/RULES.md','frontend/docs/ARCHITECTURE.md','frontend/docs/RULES.md','services/docs/ARCHITECTURE.md','services/docs/RULES.md']; assert all(Path(f).is_file() for f in files); text='\n'.join(Path(f).read_text(encoding='utf-8') for f in files); assert 'VietSage' not in text; assert 'repository -> query-resource resource -> feature hook -> component' in text"
git status --short --untracked-files=all
```

**Expected:** no whitespace errors; eight files exist; no VietSage leakage; React Query ownership chain documented; original `D services/auth-service/README.md` and `?? README.md` remain untouched.

---

### Task 2: Create a standalone base repository copy

**Objective:** Create `C:\Users\Dangminhdev0403\Desktop\workspace\vnru-network-base` from the verified VN-RU working tree so the user can commit and push it independently.

**Owner:** Hermes/native Python stdlib after Antigravity stops and Task 1 passes. Do not spend a second Antigravity invocation on a byte-for-byte copy.

**Steps:**

1. Stop if `vnru-network-base` already exists. Never merge into or overwrite an existing directory.
2. Re-check source `HEAD` and dirty status. Require Task 1 validation PASS.
3. Copy the working tree with `shutil.copytree`; exclude only repository/runtime/generated state:
   - `.git/`
   - `.hermes/`
   - `node_modules/`
   - `.next/`
   - `dist/`, `coverage/`
   - `graphify-out/`
   - `.env`, `.env.*` except explicit example templates such as `.env.example`
4. Preserve the intentional filesystem state: include root `README.md`; keep `services/auth-service/README.md` absent. Do not alter the original repository.
5. Run `git init` in the copy only. Do not commit, add a remote, push, or change package/lockfiles. The user owns the separate base commit.
6. Verify source/copy content parity for included files using a Python SHA-256 manifest; ignore only `.git/` in the copy and the exclusions above. Fail on missing, extra, or mismatched files.
7. Report the new path, initialized branch state, excluded paths, file count, and parity result.

**Focused validation:**

```bash
git -C "C:/Users/Dangminhdev0403/Desktop/workspace/vnru-network-base" status --short --untracked-files=all
python scripts-or-inline-parity-check.py
```

**Expected:** standalone repository with no commits; all copied project files untracked; parity PASS; no secrets/runtime/generated state copied; original repository unchanged except Task 1 docs and this plan.

---

## Deferred slice: first real frontend API module

Do not execute now. When the first client-side API feature is approved:

1. Approve changes to `frontend/package.json` and `frontend/pnpm-lock.yaml` explicitly.
2. Install `@tanstack/react-query` and `@dangminhdev04032005/query-resource` with pnpm.
3. Add one app-level `QueryClient` provider.
4. Implement one real vertical example only: repository, resource, feature hook, component consumer.
5. Run focused test/typecheck/lint/build. Use that real implementation to refine frontend rules.

This avoids speculative abstractions and a fake sample disconnected from VN-RU APIs.

---

## Antigravity bounded dispatch

After user approval, launch one writer only, canonical workspace:

`C:\Users\Dangminhdev0403\Desktop\workspace\vnru-network`

Forbidden sibling repository:

`C:\Users\Dangminhdev0403\Desktop\workspace\fullstack-vietSage`

Writer constraints:

- One observable change: eight adapted governance docs.
- Maximum eight files; only destinations listed in Task 1.
- Source repository is read-only.
- No repository-wide scan; use this plan and named source pack/context.
- Preserve all dirty/untracked work, especially `D services/auth-service/README.md` and `?? README.md`.
- No code, package manifest, lockfile, install, Graphify generation, commit, push, Docker, DB, deploy, or notification changes.
- Stop `BLOCKED` on scope expansion, destination collision, target `HEAD` movement, or ambiguity requiring product decisions.
- Run only the focused validation above. Report exact files and real output.

## Risks / trade-offs

- Root README describes several services/infrastructure components not yet present. Docs must label these as target topology, not running implementation.
- React Query rules without packages could mislead. Explicit activation prerequisite prevents false compliance claims.
- Eight docs are the maximum useful baseline. More guides now would duplicate empty policy.
- The base copy intentionally has fresh Git history. Existing source commits/remotes/branches are not copied.

## Rollback

- Task 1: delete only the eight new docs after proving task ownership. Never touch the existing root README or deleted auth-service README state.
- Task 2: remove only the newly created `vnru-network-base` directory after proving it did not pre-exist. Never modify `vnru-network` during rollback.

## Approval required

Tasks 1–2 are planning-only until the user explicitly approves execution. Approval authorizes one Antigravity writer for Task 1, then Hermes/native copy for Task 2. No commit/push. The deferred frontend API slice always requires separate dependency/package approval.
