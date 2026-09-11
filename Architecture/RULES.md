# VN-RU Monorepo Rules

## Source precedence

Current manifests, source, schemas, migrations and tests are capability truth. Documentation describes constraints and current direction; it does not authorize missing packages, routes or infrastructure.

## Workspace boundaries

- Repository = product workspace/monorepo.
- `frontend/` = web deployable and BFF.
- `services/auth-service/` = API modular monolith.
- PostgreSQL = API-owned; frontend has no database access.
- HTTP contract = frontend/backend integration seam.

## Implementation

- Preserve unrelated dirty work.
- No package/lockfile change without explicit approval.
- Prefer the smallest complete vertical slice; no speculative scaffolding.
- Keep routes/controllers thin; business workflow belongs to owning application services.
- Another backend module must not write an owner's tables directly.
- Cross-module interaction is in-process through exported contracts.
- Validate every trust boundary. Backend authorization remains authoritative.
- Never put secrets, credentials or connection strings in source/docs/logs.

## Documentation

- `Architecture/` is the routing hub and ownership map.
- Existing `docs/`, `frontend/docs/` and `services/docs/` remain canonical for detailed scope rules.
- Do not duplicate endpoint catalogs when controller/source or generated contracts are authoritative.
- Update `MODULE_MAP.md` when ownership or dependency direction changes.
- Final reports list exact docs read, files changed, commands/results and blockers.

## Plan lifecycle

- `.hermes/plans/` is the only task-plan and cross-session continuation source. Do not create or update legacy planning documents elsewhere.
- Simple tasks need no plan. For complex work, create one English `.hermes/plans/<timestamp>-<slug>.md` before code and update that same file only at phase boundaries, blockers, decisions, or verification changes.
- Required frontmatter: `status: processing|blocked|success`, `current_phase`, `updated_at`, `next`, and `verification: pending|blocked|passed`.
- Split large work into phases marked `[pending]`, `[processing]`, `[blocked]`, or `[success]`; only one phase may be `[processing]`.
- Keep a compact `## Resume` with `Completed`, `Decisions`, `Changed files`, `Verification`, `Blocker`, and `Next action`.
- A new session reads only the frontmatter, `Resume`, and current phase before checking live source. `success` means do not re-execute; `processing` or `blocked` continues from `next` after minimal state verification.
- Completion requires every phase `[success]`, `status: success`, and `verification: passed`. Keep the successful plan as the compact completion marker; Git/PR history remains the detailed work log.
- Legacy plans without this frontmatter are archival and must not be resumed automatically.
- `.hermes/plans/` is workspace-local continuation state; do not rely on it after a fresh clone. Git/PR history and permanent docs remain shared history.
- `.hermes/tasks/` is temporary execution scratch, not project progress; remove scoped task files when their parent plan succeeds.
- Permanent docs change only when architecture, API contracts, operating procedures, or repository rules change.

## Non-goals

No premature microservices, API gateway, broker, Redis, service mesh, distributed transaction, database-per-module, generic repository layer or empty future folders.
