# Backend Agent Instructions

Before changing anything under `services/`:

1. Read `../Architecture/README.md`, `../Architecture/ARCHITECTURE.md`, `../Architecture/MODULE_MAP.md`, and `../Architecture/RULES.md`.
2. Read `docs/ARCHITECTURE.md` and `docs/RULES.md`.
3. Read only the matching guide routed by `../Architecture/GUIDES.md`: `docs/SERVICE_GUIDE.md`, `docs/MIGRATION_GUIDE.md`, or `docs/MULTILINGUAL_BACKEND_PLAN.md`.
4. Read the affected service's `package.json`, nearest README/instructions, current code, and tests. Current files override target-state prose.

The backend is a modular monolith. Add capabilities as internal modules; do not create standalone services, internal HTTP calls, brokers, or module-specific databases. Modules access another module only through its application contract, never its repository or tables. No package/lockfile edits without approval. Final report must list exact docs read.

Local development uses `postgres-local` with database `vnru_auth_local`; do not start a second PostgreSQL container or volume for this repository. This does not define VPS behavior.
