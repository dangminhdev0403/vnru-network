# VN-RU Monorepo Architecture

## Decision

VN-RU is a product workspace with two deployables. The NestJS API is the modular monolith. The repository itself is not a single runtime process.

```text
Browser
  -> frontend/                 Next.js web + BFF
     -> HTTP /api/v1
        -> services/auth-service/  NestJS modular monolith
           -> PostgreSQL auth_db
```

## Dependency direction

```text
Route/UI
  -> feature/server boundary
  -> Next.js BFF when session isolation is needed
  -> versioned HTTP contract
  -> NestJS controller
  -> owning application service
  -> owning persistence contract
  -> shared DatabaseClient/PostgreSQL
```

Rules:

- Frontend never imports backend source or accesses PostgreSQL.
- Backend never depends on frontend implementation.
- Controllers map transport; application services own workflows and authorization decisions.
- Backend modules call exported application contracts, never another module's repository/table internals.
- One `DatabaseModule` owns one Prisma client/pool; domain modules retain model and mutation ownership.
- No internal HTTP, broker, distributed transaction, service mesh or module-specific database.

## Repository shape

```text
vnru-network/
├── Architecture/          architecture entry and ownership map
├── frontend/              Next.js deployable
├── services/
│   └── auth-service/      NestJS API modular monolith (legacy name retained)
├── docs/                  global operational/product contracts
├── shared/                retained templates/artifacts; not a runtime boundary
├── infra/                 reverse-proxy/runtime infrastructure
└── docker-compose*.yml    local/production composition
```

## Extraction policy

A module is not a microservice. Consider extraction only for measured independent deployment, scaling, team ownership, SLA or compliance pressure. Until then, keep calls in-process and persistence transactional inside `auth_db`.
