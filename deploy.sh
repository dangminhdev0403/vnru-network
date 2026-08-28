#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(dirname "$(readlink -f "$0")")"

ENV_FILE=secrets/demo.env
ACCOUNT_FILE=secrets/account.json
COMPOSE=(docker compose --env-file "$ENV_FILE" -f docker-compose.yml -f docker-compose.prod.yml)

check() {
  command -v docker >/dev/null
  docker compose version >/dev/null
  for file in "$ENV_FILE" "$ACCOUNT_FILE"; do
    [[ -s "$file" ]] || { echo "Missing secret: $file" >&2; return 1; }
    mode=$(stat -c %a "$file")
    (( (8#$mode & 8#077) == 0 )) || { echo "Unsafe permissions: $file ($mode); run chmod 600 $file" >&2; return 1; }
  done
  "${COMPOSE[@]}" config --quiet
}

check
[[ ${1:-} == check ]] && { echo "Deploy configuration OK"; exit 0; }
[[ $PWD == /var/www/vnru-network ]] || { echo "Run only from /var/www/vnru-network" >&2; exit 1; }
git diff --quiet && git diff --cached --quiet || { echo "Tracked VPS files are dirty; deployment stopped" >&2; exit 1; }

if [[ -n $("${COMPOSE[@]}" ps -q postgres) ]] && "${COMPOSE[@]}" exec -T postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d auth_db' >/dev/null 2>&1; then
  backup_dir=/var/www/vnru-network-backups
  backup="$backup_dir/auth_db-$(date -u +%Y%m%dT%H%M%SZ).dump"
  install -d -m 700 "$backup_dir"
  "${COMPOSE[@]}" exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d auth_db -Fc' > "$backup"
  chmod 600 "$backup"
  [[ -s $backup ]] && "${COMPOSE[@]}" exec -T postgres pg_restore --list < "$backup" >/dev/null
  echo "Backup verified: $backup"
fi

"${COMPOSE[@]}" --profile seed build
"${COMPOSE[@]}" run --rm migrate
"${COMPOSE[@]}" --profile seed run --rm -T demo-seed < "$ACCOUNT_FILE"
"${COMPOSE[@]}" up -d --remove-orphans
"${COMPOSE[@]}" restart nginx

for _ in {1..60}; do
  if curl -fsS "${DEPLOY_HEALTH_URL:-http://127.0.0.1:8080/}" >/dev/null; then
    "${COMPOSE[@]}" ps
    echo "Deployment healthy: $(git rev-parse HEAD)"
    exit 0
  fi
  sleep 2
done

"${COMPOSE[@]}" logs --tail=100 nginx frontend auth-service >&2
exit 1
