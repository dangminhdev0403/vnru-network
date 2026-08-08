# VN-RU Network Backend Rules For Multi-Agent

## Scope Rules

* Work only inside `services/` unless the user explicitly expands scope.
* For backend implementation, work primarily inside the service related to the current milestone.
* Do not modify frontend files.
* Do not change existing UI, frontend routes, or frontend user flow.
* Do not refactor unrelated code.
* Only change files required for the current milestone.
* Do not introduce extra services, packages, or infrastructure without a clear reason tied to the milestone.

## Engineering Rules

* Analyze root cause before changing code.
* Propose and execute one optimal direction.
* Keep controllers thin; controllers handle transport only.
* Put orchestration in application services/use cases.
* Keep domain rules out of infrastructure and controllers.
* Keep database access behind repositories or infrastructure services.
* **Mandatory Zod Validation**: ALL request payload/query/param validation MUST use Zod schemas defined in `src/modules/<module>/domain/schemas/<module>.schema.ts` parsed via `parseWithZod(schema, payload)`. DO NOT use `class-validator` decorators (`@IsString`, `@IsNumber`, `@IsEnum`, etc.) on DTO classes. Controller action parameters MUST receive `@Body() body: unknown` or `@Query() query: unknown` or `@Param("id") idParam: string` and validate them via `parseWithZod`.
* **PostgreSQL Timezone Standard**: The canonical timezone for Vietnam is `Asia/Ho_Chi_Minh` (UTC+7). All default timezone schema properties MUST use `Asia/Ho_Chi_Minh` (NOT `Asia/Saigon`). In raw SQL queries using `AT TIME ZONE`, handle non-canonical strings safely with: `CASE WHEN tz = 'Asia/Saigon' OR tz IS NULL THEN 'Asia/Ho_Chi_Minh' ELSE tz END`.
* Use consistent error response shape.
* Add or update tests for implemented behavior.

## Patch Reliability Rules

To reduce tool-loop failures such as `repeated_exact_failure_warning`, follow this flow:

* Never retry the exact same patch more than once.
* After any patch failure, re-read the target file and regenerate patch context from current content.
* Keep patches small and atomic; prefer one concern per patch with stable anchor lines.
* Avoid ambiguous anchors that can appear multiple times in the same file.
* If the same failure appears twice, stop patch retry loop and switch strategy.
* Confirm the exact target path before patching, and patch real file paths only.
* After patching, verify the result immediately with file readback or diff before the next change.

## Multi-Agent Rules

* Every agent must identify the current milestone and task scope before making changes.
* Agents must work only within their assigned scope.
* Agents must not modify files owned by another active agent unless explicitly coordinated.
* Do not duplicate implementation work already assigned to another agent.
* Shared contracts must be agreed before dependent agents implement against them.
* Agents must not silently change service boundaries, API contracts, database ownership, or event contracts.
* If a dependency or contract is missing, stop and report the blocker instead of inventing one.
* One agent acts as the final integration owner for each milestone.
* The integration owner verifies cross-agent compatibility before marking the milestone complete.

## Milestone Execution Rule

* Authentication and RBAC milestones must be completed and validated before dependent business-service milestones begin.
* Do not start dependent service APIs before the required authentication, authorization, and service boundary contracts are implemented and tested.
* Each service milestone must remain within its defined service boundary.

## Route Access Rules (Public vs Private)

Default policy:

* Every new endpoint is private by default.
* A route is public only when explicitly listed in the service's route configuration.
* When creating a new endpoint/module, decide and document route access type: `Public` or `Private`.
* If a route is `Public`, add it to the service's public route allowlist first.
* Do not add broad wildcards (for example `/api/**`, `/auth/**`) that can expose protected endpoints.
* Keep auth-sensitive routes (`logout`, profile, admin, internal) private unless explicitly approved.

### Guard and Matcher Usage

* `JwtAuthGuard` is the enforcement point for request authentication where JWT authentication is used.
* Public route matching is allowlist-only bypass logic.
* Any route not matched by the public route allowlist must require valid authentication.
* Match order must stay deterministic and security-first: explicit allowlist, then authentication guard.

### Validation Requirements for Access Control Changes

* Add/update e2e tests for route access behavior.
* For `Public` routes: verify success without token.
* For `Private` routes: verify `401` without token and success with valid token.
* Run full validation for the affected service:

  * `npm run build`
  * `npm run test`
  * `npm run test:e2e`
  * `npm run lint`

## Backend Priorities

* DB schema design first.
* Index strategy must match query patterns.
* Pagination must be explicit and bounded.
* Transaction boundaries must be intentional.
* Security and role checks must be implemented at API boundaries.
* OpenTelemetry tracing must be considered for production hardening.

## Cache Rules

* Do not propose Redis/cache by default.
* Only propose cache when a real bottleneck exists.
* If cache is proposed, document:

  * reason
  * cache key
  * TTL
  * invalidation strategy
  * trade-off and stale-data risk

## Transaction Rules

Use DB transaction for:

* Any multi-write operation that must be atomic.
* Any operation that writes business data and its required related data within the same service boundary.

Do not use transaction for:

* Simple read endpoints.
* Dashboard read aggregation.
* Independent logs/telemetry.

Do not use distributed database transactions across services.

## Query Rules

Review every list endpoint for:

* N+1 query risk.
* Missing index.
* Unbounded pagination.
* Unnecessary selected fields.
* Redundant query.

## Prisma Migration Rules

Use migration-based Prisma flow as the project default.

Required Prisma scripts must be maintained by each service that owns a Prisma schema.

Environment rules:

* Local development: use `prisma:create--create-only` for reviewable SQL, then apply with `prisma:dev`.
* CI/staging/production-like: run `prisma:check`, then deploy only with `prisma:deploy`.
* Production: never run `prisma migrate dev`; use `prisma:deploy` only.
* `prisma:push` is for local prototyping only, not for release flow.

Pipeline rules:

* Schema change PRs must include generated migration files.
* Fail pipeline when `prisma:check` fails.
* Do not replace migration flow with ad-hoc schema sync as default process.

## OpenAPI Export Rules

Use OpenAPI as the backend contract source of truth for frontend sync.

* Every active controller must declare `@ApiTags("<module-name>")` for stable grouped docs.
* Keep tag names stable and lowercase.
* Swagger setup must stay enabled in app bootstrap.
* Export the contract from the affected service using its configured OpenAPI export command.
* The canonical contract location remains:

  * `shared/api-contract/openapi/v1/openapi.json`
  * `shared/api-contract/openapi/v1/openapi.yaml`
* After export, run sync checks in `shared/api-contract`.
* Do not maintain duplicated SDK schema mirrors; frontend tools must read the canonical OpenAPI contract directly.
* Keep contract history updated in:

  * `shared/api-contract/docs/CONTRACT_CHANGES.md`
* Do not change tags, paths, or security schema silently; treat them as contract changes and log them.

## Testing Rules

After code changes, run the smallest reliable validation first.

Preferred final validation for the affected service:

```bash
npm run build
npm run test
npm run test:e2e
npm run lint
```

If a command is not run, report that it was not run. Never claim unexecuted validation passed.

## Progress Tracking Rule

Use `docs/PLANS.md` as the source of truth for project progress.

* During execution, mark the active plan item as `processing` directly in `PLANS.md`.
* After implementation and validation, mark the item as `complete` in `PLANS.md`.
* Keep tracking lightweight: update only the relevant milestone/task line, not a verbose session log.
* If validation is skipped or blocked, note that directly on the relevant plan item instead of creating a separate status file.
* Never claim an item is `complete` before the required validation for that scope has run or the validation gap is explicitly documented.

## Agent Completion Report

Every agent completion report must include:

1. Root cause / objective
2. Files changed
3. Commands run
4. Test/build result
5. Risks or blockers
6. Follow-up required, if any

Only report actions actually performed.
