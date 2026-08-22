# Russia-Vietnam Science-Technology Intelligence Network Backend Service Guide

## Purpose

Use this guide when adding or refactoring a service or module. The current architecture uses domain-bounded modules hosted by business-family deployables.

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
| `auth-service` | 1. IAM & Governance | Authentication, Keycloak OIDC broker, session lifecycle, active context resolution, RBAC policies, audit log | **Current Implementation** |
| `api-gateway` | Edge Layer | Route dispatching, rate limiting, request context header propagation | **Target / Planned** |
| `knowledge-service` | 2. Knowledge & Experts | Publications plus expert/organization directory and matching modules | **Current Implementation** |
| `collaboration-service` | 3. Bilateral Collaboration | Opportunities, proposals, decisions, anonymized reviews, and project execution modules | **Current Implementation** |
| `academic-service` | 4. Training & Academic Exchange | Seminars, conferences/forums (annual forum), academic exchange, participation tracking (`[DECISION]` no financial branch) | **Target / Planned** |
| `technology-service` | 5. Technology Transfer & 2+2 | Technology marketplace, enterprise needs, expressions of interest, 2+2 consortiums, IP advisory | **Target / Planned** |
| `analytics-service` | 6. Internal Monitoring Dashboard | Standardized fact ingestion, internal monitoring KPIs, collaboration graph, internal reports *(Read-only)* | **Target / Planned (Read-only)** |

Each domain module owns its state and persistence client. A module may be hosted inside a larger deployable without allowing direct cross-module repository access.

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
* `authentication`: login/broker/callback/logout orchestration with Keycloak;
* `session`: authenticated opaque session creation, validation, expiration, and revocation;
* `access-control`: role, permission, role assignment, single active authorization context, and baseline permission resolution;
* `security`: 2FA policy check, failed-authentication controls, and security audit events.

The modules remain inside one `auth-service` deployment boundary. This is internal modularization, not additional microservices.

Business services remain authoritative for resource ownership and workflow-state rules. `auth-service` provides identity, session, active context, and baseline permissions; it does not decide whether a collaboration proposal, review assignment, project milestone, or other business resource is in a valid domain state.

Detailed current notes live in `../auth-service/README.md` and `SERVICE_SPEC.md`.

Do not access another service's repository, database, or internal implementation directly.

