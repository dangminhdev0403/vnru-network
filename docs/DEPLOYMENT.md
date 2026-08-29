# Deployment and Local Operation

The stack is PostgreSQL, the `auth-service` modular monolith, frontend, and Nginx.

## Local source development

Use only the existing `postgres-local` container and `vnru_auth_local` database:

```powershell
docker start postgres-local
pnpm --dir services/auth-service exec prisma migrate deploy --config prisma.config.ts
pnpm --dir services/auth-service start:dev
pnpm --dir frontend dev
```

For a production-equivalent frontend build, override any shell-level development value:

```powershell
$env:NODE_ENV = "production"
pnpm --dir frontend build
```

## Production Compose deployment

Run from the clean, fast-forwarded repository. Runtime secrets stay in `secrets/demo.env`.

```bash
set -euo pipefail
cd /var/www/vnru-network
git pull --ff-only origin master

set -a
. secrets/demo.env
set +a
install -d -m 700 /var/backups/vnru-network
umask 077
backup="/var/backups/vnru-network/auth_db_$(date -u +%Y%m%dT%H%M%SZ).dump"
docker compose --env-file secrets/demo.env -f docker-compose.yml -f docker-compose.prod.yml exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d auth_db -Fc > "$backup"
test -s "$backup"

docker compose --env-file secrets/demo.env -f docker-compose.yml -f docker-compose.prod.yml \
  up -d --build --remove-orphans --wait

docker compose --env-file secrets/demo.env -f docker-compose.yml -f docker-compose.prod.yml ps
docker compose --env-file secrets/demo.env -f docker-compose.yml -f docker-compose.prod.yml \
  logs --since=5m --no-color
```

`migrate` runs before the backend. Backend and frontend health checks gate Nginx startup. Docker DNS is resolved per request, so recreating an app container does not require recreating Nginx.

Do not run demo seed or catalog import in production without separate data-mutation approval.
