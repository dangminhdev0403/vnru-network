# Backend Modular Monolith Rules

Read `../../docs/RULES.md` first. Current service manifests, source, schemas, migrations, and tests are capability truth; target-state docs never authorize inventing missing tools or infrastructure.

## Before code

1. Read `../AGENTS.md`, `docs/ARCHITECTURE.md`, this file, one matching guide, and the affected service manifest/README/tests.
2. Trace the endpoint or workflow end to end. Inspect every caller of a changed shared symbol.
3. If a package, schema, migration tool, route config, OpenAPI exporter, broker, cache, or shared contract is absent, stop or request a separately approved setup slice.

## Boundaries

- Controller handles transport only.
- Application service/use case owns orchestration, authorization/resource checks, and transaction decisions.
- Domain owns business rules; it imports no framework or infrastructure.
- Infrastructure implements inward-facing ports for persistence/providers.
- One backend application owns one PostgreSQL database.
- Each domain module owns its tables, repositories and business mutations. Other modules use its typed application contract; never import its repository/entity internals or query its tables directly.
- Cross-module calls are in-process. Do not add internal HTTP, brokers, versioned events, distributed transactions or module-specific databases.

## Trust boundaries

- Endpoints are private by default. Public routes require an explicit narrow allowlist plus tests for anonymous access.
- Validate body/query/params at the controller boundary using the validation mechanism actually installed in that service.
- Zod is preferred only after it exists in the service manifest and an approved slice wires a shared parser. Never reference an uninstalled validator.
- Enforce resource ownership and permission scope in backend code. Frontend checks are not security.
- Keep secrets in environment/runtime secret stores; never source/docs/log output.
- News/banner media uses the backend `POST /api/v1/admin/news/media` endpoint backed by `nestjs-cloudinary@1.0.7`. Do not duplicate Cloudinary SDK/config/signing or image processing in frontend/shared code.

## Data

- List APIs use explicit bounded pagination.
- Review query shape for N+1, indexes, selected fields, and redundant reads.
- Use a local DB transaction for multi-write invariants. No transaction for simple reads.
- Cache only after a measured need; document key, TTL, invalidation, and stale-data risk.
- Migrations use the service's existing tool and workflow. Never rename applied migrations or run destructive reset/push against shared/production data.

## Contracts and events

- Current generated OpenAPI, when present, is HTTP source of truth. Do not hand-maintain a conflicting endpoint catalog.
- Contract changes update producer, consumers, focused tests, and contract history in one approved slice.
- Events use stable names, versions, IDs, timestamps, producer, correlation ID, and payload. Consumers must define idempotency/retry behavior before activation.

## Testing and completion

Write one smallest real regression check for non-trivial behavior. Run focused tests first; then only existing build/lint/e2e gates required by impact. Final report must include `Docs read:`, root cause/objective, changed files, exact commands/results, contract/migration impact, and blockers. Never claim an unrun gate passed.
