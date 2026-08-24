# VN–RU Network Portal

Current implementation is intentionally limited to **Module 1: Identity & Access Governance** plus the public landing page.

## Kept runtime

- `frontend/`: landing page, Keycloak login bridge, account, security/session management, IAM administration and audit UI.
- `services/auth-service/`: identity, authentication, sessions, access control and security audit.
- `infra/keycloak/`: Keycloak login theme.
- `infra/nginx/`: reverse proxy for frontend, auth-service and Keycloak.
- PostgreSQL: `auth_db` only.

Knowledge, expert directory, research collaboration, reviews, projects, academic, technology and analytics runtimes are not present.

## Development

Start local PostgreSQL and Keycloak, then run the two source processes in separate terminals:

```powershell
docker start postgres-local vnru-keycloak-dev
pnpm --dir services/auth-service start:dev
pnpm --dir frontend dev
```

Local endpoints:

- Frontend: `http://localhost:3000`
- Auth service: `http://localhost:8080`
- Keycloak: `http://localhost:8081`
- PostgreSQL: `localhost:5432`

For the containerized stack:

```powershell
Copy-Item .env.docker.example .env
docker compose up --build -d
docker compose logs -f --tail=100
```

## Documentation

Start at [`docs/README.md`](docs/README.md).
