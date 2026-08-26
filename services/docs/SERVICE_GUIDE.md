# Backend Module Guide

The current backend monolith is stored in `services/auth-service`. Its controllers handle transport, application services own workflows and authorization decisions, and Prisma adapters own persistence. The package name is legacy; it is not a microservice boundary.

Internal modules:

- identity: platform user and federated identity linkage;
- authentication: Auth.js assertion verification and opaque session creation;
- session: opaque session lifecycle;
- access-control: roles, permissions, assignments, active context and IAM audit writes.

`DatabaseModule` owns the only Prisma client/pool. Domain modules alias that client behind their narrow persistence contracts. Keep controllers thin, validate trust boundaries, use local database transactions for multi-write invariants and never expose provider tokens to the frontend.

Add future capabilities under `src/modules/` as domain modules. Reuse the same process, deployment and PostgreSQL database. A module may expose a narrow typed application contract; it must not expose repositories to sibling modules.
