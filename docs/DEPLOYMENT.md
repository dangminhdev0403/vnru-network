# Deployment and Local Operation

The containerized stack contains PostgreSQL, Keycloak, auth-service, frontend and Nginx.

```powershell
Copy-Item .env.docker.example .env
docker compose up --build -d
docker compose ps
docker compose logs -f --tail=100
```

Endpoints use the ports configured in `.env`; defaults are frontend `3000`, auth-service `3001`, Keycloak `8080`, PostgreSQL `5432`, and Nginx `80`/`443`.

For source development, use the existing local PostgreSQL and Keycloak containers, then run:

```powershell
pnpm --dir services/auth-service start:dev
pnpm --dir frontend dev
```

The auth-service container runs Prisma migrations against `auth_db` before startup. No Module 2–6 database or service is created.
