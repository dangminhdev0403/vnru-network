# Russia-Vietnam Science-Technology Intelligence Network Backend Architecture

## 1. Purpose

This document defines the reusable backend architecture standard for Russia-Vietnam Science-Technology Intelligence Network backend code. The backend runtime is organized as microservices under `services/`, with each service owning its domain boundary.

Keep this file short. Detailed conventions live in topic-specific docs in this same `docs/` folder.

## 2. Docs Index

| Need | Read |
| --- | --- |
| Core backend architecture and service boundaries | `ARCHITECTURE.md` |
| Service structure, dependency direction, and service boundaries | `SERVICE_GUIDE.md` |
| Migration rules and schema guidelines | `MIGRATION_GUIDE.md` |
| Multilingual backend plan | `MULTILINGUAL_BACKEND_PLAN.md` |
| Authoritative global API contracts & event standards | `../../docs/API_SPEC.md` |
| Development rules, security rules, validation gates | `RULES.md` |
| Active/archived backend milestones and progress tracking | `PLANS.md` |

Rule: do not read all docs by default. Start with this file, then open only the doc matching the current task.

## 3. Core Principles

* Organize services by domain boundaries.
* Split responsibilities by service ownership, scaling, deployment, security, or integration needs.
* Keep controllers thin, services workflow-focused, and repositories persistence-focused.
* Keep repositories internal to their owning service; expose public ports/services for cross-service use.
* Keep contracts explicit and stable through OpenAPI or versioned event contracts.
* Keep service data ownership explicit.
* Do not introduce shared business logic across services without a defined ownership boundary.

## 4. Target Backend Services & Capability Ownership

Target microservice ecosystem (Currently implemented: `auth-service`):

```txt
services/
  auth-service/         # IAM, Keycloak OIDC broker, session lifecycle, active context, RBAC policies, audit log (Current)
  api-gateway/          # Edge routing, rate limiting, request context propagation (Target)
  organization-service/ # Institutions, partner agreements, researcher CVs/profiles, expert mapping, partner matches (Target)
  knowledge-service/    # Scientific publications, preprints, patents, conference documents repository (Target)
  grant-service/        # Independent funding opportunities, VN–RU joint proposals, mutual confirmation (Target)
  review-service/       # Independent peer review pool, anonymized assignments, rubric scoring, recommendations (Target)
  project-service/      # Joint research projects, milestones, progress reports, deliverables, outcome links (Target)
  academic-service/     # Seminars, conferences/forums, academic exchange, training ([DECISION] no financial branch) (Target)
  technology-service/   # Tech marketplace, enterprise demands, expressions of interest, 2+2 consortiums, IP advisory (Target)
  analytics-service/    # Internal fact ingestion, monitoring KPIs, collaboration network graph, internal reports (Target, Read-only)
```

`auth-service` implements Module 1 through five internal module boundaries: `identity`, `authentication`, `session`, `access-control`, and `security`. These are modules inside one service deployment boundary, not separate microservices. Detailed responsibilities and flows are documented in `../auth-service/README.md` and `SERVICE_GUIDE.md`.

Each service owns its domain modules and persistence boundary (database-per-service). Cross-service communication uses synchronous REST via OpenAPI contracts or asynchronous Kafka events published via the Transactional Outbox pattern.




## 5. Standard Service Boundary

Small service:

```txt
module.ts
controller.ts
service.ts
```

Medium service:

```txt
api/
application/
infrastructure/
tests/
```

Complex service:

```txt
api/
application/
domain/
infrastructure/
tests/
index.ts
```

Create only folders that are needed now. Do not add empty architecture folders just to match a template.

## 6. Request and Contract Flow

```txt
HTTP Request
  -> API Gateway
  -> Request Context / Logging Middleware
  -> Service Guards
  -> Controller
  -> Schema Validation
  -> Service/Application Use Case
  -> Repository / Integration Adapter
  -> Database / External Provider
  -> Exception Filter / Response Transformation
  -> HTTP Response
```

Rules:

* API Gateway handles service routing.
* Controllers delegate; they do not own business rules.
* Services decide workflow and transaction boundaries.
* Repositories isolate persistence details.
* Integration adapters isolate external providers.
* OpenAPI is the HTTP contract source of truth.
* Event contracts must be versioned before asynchronous messaging is introduced.

## 7. Backend and Frontend Boundary

Backend owns business rules, authorization, data persistence/migrations, API/event contracts, external integrations, and operational readiness.

Frontend owns UI rendering, route composition, API consumption, browser state, loading/empty/error display, and user interactions.

Frontend may hide unavailable actions, but backend authorization remains source of truth.
