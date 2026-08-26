# VN–RU Network Portal

VN–RU is a product workspace/monorepo with a Next.js web deployable and one NestJS API modular monolith.

## Kept runtime

- `frontend/`: landing page, Auth.js Credentials login bridge, account, security/session management, IAM administration and audit UI.
- `services/auth-service/`: the single backend monolith; currently contains identity, authentication, sessions, access control and security audit modules. The legacy directory name is retained.
- `infra/nginx/`: reverse proxy for frontend and auth-service.
- PostgreSQL: `auth_db` only.

Knowledge, expert directory, research collaboration, reviews, projects, academic, technology and analytics modules are not present. Add them as internal modules of the same backend and PostgreSQL database; do not create microservices.

## Development

Use the existing `postgres-local` container and its `vnru_auth_local` database, then run the two source processes in separate terminals:

```powershell
docker start postgres-local
pnpm --dir services/auth-service exec prisma migrate deploy --config prisma.config.ts
pnpm --dir services/auth-service start:dev
pnpm --dir frontend dev
```

Local endpoints:

- Frontend: `http://localhost:3000`
- Auth service: `http://localhost:8080`

- PostgreSQL: `postgres-local` at `localhost:5432`, database `vnru_auth_local`

For local demo identities, keep `secrets/account.json` local and ignored:

```bash
pnpm --dir services/auth-service exec ts-node prisma/seed-demo.ts ../../secrets/account.json
```

Open `http://localhost:3000`. Do not run a second project PostgreSQL container during development.

## Documentation

Start at [`Architecture/README.md`](Architecture/README.md). Global operational/product contracts remain indexed by [`docs/README.md`](docs/README.md).
