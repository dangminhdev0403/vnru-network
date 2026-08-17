# VN-RU Network Backend Service Guide

## Purpose

Use this guide when adding or refactoring a service or module inside the backend. The architecture target is domain-oriented microservices.

## Service ownership

Every service should declare:

* business capability it owns;
* data/models it owns;
* controllers/routes it exposes;
* public services/ports other services may use;
* events it publishes/consumes, if any;
* tests that protect behavior.

## Public vs internal files

Internal by default:

```txt
repositories/**
schemas/** implementation details
private helper services
Prisma query shapes
provider-specific adapters
```

Public only when intentionally exported:

```txt
module exports
index.ts / *-public.ts
public service/port interfaces
shared DTO/contract types
```

## Cross-service dependency rule

Allowed:

```ts
import { OrganizationService } from "../organization/organization-public";
```

Forbidden unless explicitly approved:

```ts
import { OrganizationRepository } from "../organization/infrastructure/repositories/organization.repository";
```

If another service needs data from an owning service, use its public API/port instead of accessing its repository or persistence layer.

## Refactor workflow

1. Add or identify a failing test that captures the desired boundary/behavior.
2. Move one slice at a time.
3. Keep HTTP routes and DTO behavior stable unless explicitly approved.
4. Run targeted tests after each slice.
5. Run full build/test/lint before finishing.

## Recommended service/module shapes

Small:

```txt
<domain>.module.ts
<domain>.controller.ts
<domain>.service.ts
```

Medium:

```txt
<domain>.module.ts
api/
application/
infrastructure/
tests/
```

Complex:

```txt
<domain>.module.ts
api/
application/
domain/
infrastructure/
tests/
<domain>-public.ts
```

Do not create empty folders. Let complexity justify structure.

## Service boundaries (Target Architecture)

| Service | Business Capability `[SOURCE]` | Owned Responsibility & Boundary | Implementation Status |
| --- | --- | --- | --- |
| `auth-service` | IAM & Governance | Authentication, SSO federation, 2FA policies, active context resolution, RBAC policies, audit log | **Current Implementation** |
| `api-gateway` | Edge Layer | Route dispatching, rate limiting, request context header propagation | **Target / Planned** |
| `organization-service` | Knowledge & Expert | Organizations, institutions, departments, researcher profiles/CVs, expert mapping, partner matches | **Target / Planned** |
| `knowledge-service` | Knowledge & Expert | Digital scientific publications, preprints, patents, conference papers repository | **Target / Planned** |
| `grant-service` | Grants & PMS | Funding programs, bilateral calls, paired proposals (VN/RU Co-PIs), version locking | **Target / Planned** |
| `review-service` | Grants & PMS | Reviewer pool, double-blind assignments, rubric scoring, aggregated evaluations | **Target / Planned** |
| `project-service` | Grants & PMS | Approved joint projects, milestones, bilateral financial reports, overdue alerts, acceptance | **Target / Planned** |
| `academic-service` | Academic Exchange | Scholarships, quotas, Pushkin Virtual Hub (language courses, exams, certs), JINR youth practice | **Target / Planned** |
| `technology-service` | Technology Transfer | Technology marketplace, enterprise needs, 2+2 consortium collaborations, IP advisory | **Target / Planned** |
| `analytics-service` | Science Diplomacy Dashboard | Standardized fact ingestion, executive KPIs, collaboration network graph, strategic exports *(Read-only)* | **Target / Planned (Read-only)** |

Each service owns its internal modules and persistence details (database-per-service).

## `auth-service` Internal Module Base

Module 1 is split into explicit internal boundaries from the beginning rather than collecting all IAM responsibilities in one large identity module:

```txt
auth-service/src/modules/
  identity/
  authentication/
  session/
  access-control/
  security/
```

Responsibilities:

* `identity`: platform user identity, federated identity linkage, and account status;
* `authentication`: login/SSO/callback/logout and step-up authentication orchestration;
* `session`: authenticated session creation, validation, expiration, and revocation;
* `access-control`: role, permission, role assignment, active authorization context, and baseline permission resolution;
* `security`: 2FA and authentication security policies, failed-authentication controls, and security events.

The modules remain inside one `auth-service` deployment boundary. This is internal modularization, not additional microservices.

Business services remain authoritative for resource ownership and workflow-state rules. `auth-service` provides identity, session, active context, and baseline permissions; it does not decide whether a grant proposal, review assignment, project milestone, or other business resource is in a valid domain state.

Exact SSO/IdP selection and the final multi-role/multi-context switching model remain unresolved under OPEN-01 and OPEN-02. The base structure must not silently lock either decision.

Detailed current notes live in `../auth-service/README.md`.

Do not access another service's repository, database, or internal implementation directly.
