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

## Service boundaries

| Service                | Responsibility                                     |
| ---------------------- | -------------------------------------------------- |
| `auth-service`         | Authentication, users, roles, permissions, RBAC    |
| `organization-service` | Organizations, institutions, researchers, experts  |
| `knowledge-service`    | Knowledge repository, publications, documents      |
| `grant-service`        | Programs, funding calls, proposals, funding        |
| `review-service`       | Reviewers, assignments, peer review                |
| `project-service`      | Research projects, milestones, reports             |
| `academic-service`     | Scholarships, academic exchange, academic programs |
| `technology-service`   | Technology transfer, enterprises, technology       |

Each service owns its internal modules and persistence details.

Do not access another service's repository, database, or internal implementation directly.
