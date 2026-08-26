# Backend Architecture

The backend is one modular monolith and one deployable. Its current path and package name remain `services/auth-service` only to avoid a destructive rename.

It contains four internal Module 1 boundaries:

- `identity`;
- `authentication`;
- `session`;
- `access-control`.

These modules share one process, one `DatabaseModule`/Prisma pool and PostgreSQL `auth_db` while retaining explicit table and use-case ownership. Auth.js verifies runtime credentials and sends a short-lived HMAC assertion to the backend for opaque session creation. Security invariants currently live with their owning flows; add a security module only when it owns real behavior.

Future portal content, knowledge and management capabilities belong here as internal domain modules. Do not create additional services, databases, internal HTTP APIs, brokers or distributed transactions.
