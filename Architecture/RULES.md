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

## Non-goals

No premature microservices, API gateway, broker, Redis, service mesh, distributed transaction, database-per-module, generic repository layer or empty future folders.
