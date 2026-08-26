# Deployment and Local Operation

The containerized stack contains one PostgreSQL database, one backend monolith (currently named `auth-service`), frontend and Nginx.

```powershell
Copy-Item .env.docker.example .env
docker compose up --build -d
docker compose ps
docker compose logs -f --tail=100
```

Endpoints use the ports configured in `.env`; defaults are frontend `3000`, auth-service `3001`, PostgreSQL `5432`, and Nginx `80`/`443`.

For source development, use only the existing `postgres-local` container and its `vnru_auth_local` database:

```powershell
docker start postgres-local
pnpm --dir services/auth-service exec prisma migrate deploy --config prisma.config.ts
pnpm --dir services/auth-service start:dev
pnpm --dir frontend dev
```

Do not start another PostgreSQL container or create another PostgreSQL volume for local development. This local rule does not define VPS database behavior.

The backend container runs Prisma migrations against shared `auth_db` before startup. No Module 2–6 module or separate database is created.
