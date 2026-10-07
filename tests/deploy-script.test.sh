#!/usr/bin/env bash
set -euo pipefail

script=$(<deploy.sh)
grep -Fq '[[ $PWD == /var/www/vnru-network ]]' <<< "$script"
grep -Fq 'stat -c %a "$file"' <<< "$script"
grep -Fq 'GCP_CREDENTIAL_FILE=secrets/gcs-key.json' <<< "$script"
grep -Fq 'Google Cloud configuration still contains placeholders' <<< "$script"
grep -Fq 'http://127.0.0.1:8080/' <<< "$script"
grep -Fq 'pg_dump -U "$POSTGRES_USER" -d auth_db -Fc' <<< "$script"
! grep -Fq -- 'demo-seed' <<< "$script"
grep -Fq 'build migrate auth-service frontend nginx' <<< "$script"
grep -Fq 'restart nginx' <<< "$script"
grep -Fq 'GCS_BUCKET: ${GCS_BUCKET:?set in secrets/demo.env}' docker-compose.yml
grep -Fq 'gcp-service-account.json:ro' docker-compose.yml
grep -Fq 'profiles: [media-migration]' docker-compose.yml
grep -Fq './secrets/media-migration:/run/media-migration' docker-compose.yml
! grep -q 'SOURCE_CLOUDINARY_CLOUD_NAME' docker-compose.yml
grep -Fq 'GOOGLE_CLOUD_PROJECT=fill-google-cloud-project-id' .env.docker.example
grep -Fq 'GCS_BUCKET=fill-globally-unique-vnru-media-bucket' .env.docker.example
! grep -q 'SOURCE_CLOUDINARY_CLOUD_NAME' .env.docker.example services/auth-service/.env.example services/auth-service/.env.production.example
grep -Fq 'complete media:migrate:gcs before deploy' deploy.sh
test -f secrets/media-migration/.gitkeep
git check-ignore -q secrets/gcs-key.json
! grep -Eq '(PASSWORD|SECRET)=[^$]' deploy.sh

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
cp deploy.sh "$tmp/deploy.sh"
mkdir -p "$tmp/bin" "$tmp/secrets"
printf 'GOOGLE_CLOUD_PROJECT=fill-google-cloud-project-id\n' > "$tmp/secrets/demo.env"
printf '{}\n' > "$tmp/secrets/account.json"
printf '{"project_id":"fill-google-cloud-project-id"}\n' > "$tmp/secrets/gcs-key.json"
printf '#!/usr/bin/env sh\nexit 0\n' > "$tmp/bin/docker"
printf '#!/usr/bin/env sh\nprintf "600\\n"\n' > "$tmp/bin/stat"
chmod +x "$tmp/bin/docker" "$tmp/bin/stat"
set +e
output=$(cd "$tmp" && PATH="$tmp/bin:$PATH" bash ./deploy.sh check 2>&1)
status=$?
set -e
(( status != 0 ))
grep -Fq 'Google Cloud configuration still contains placeholders' <<< "$output"

printf 'GOOGLE_CLOUD_PROJECT=vnru-project-510917\nGCS_BUCKET=vnru-knowledge-data\n' > "$tmp/secrets/demo.env"
printf '{"project_id":"vnru-project-510917"}\n' > "$tmp/secrets/gcs-key.json"
cat > "$tmp/bin/docker" <<'EOF'
#!/usr/bin/env sh
case "$*" in
  *" ps -aq postgres"*) printf 'postgres-id\n' ;;
  *" ps -q postgres"*) [[ ${POSTGRES_RUNNING:-1} == 1 ]] && printf 'postgres-id\n' ;;
  *"pg_isready"*) exit 0 ;;
  *"SELECT count(*) FROM pg_class"*) printf '2\n' ;;
  *"res.cloudinary.com"*) printf '%s\n' "${LEGACY_MEDIA_COUNT:-1}" ;;
esac
exit 0
EOF
chmod +x "$tmp/bin/docker"
set +e
output=$(cd "$tmp" && POSTGRES_RUNNING=0 PATH="$tmp/bin:$PATH" bash ./deploy.sh check 2>&1)
status=$?
set -e
(( status != 0 ))
grep -Fq 'Existing production PostgreSQL is stopped' <<< "$output"

set +e
output=$(cd "$tmp" && PATH="$tmp/bin:$PATH" bash ./deploy.sh check 2>&1)
status=$?
set -e
(( status != 0 ))
grep -Fq 'complete media:migrate:gcs before deploy' <<< "$output"

output=$(cd "$tmp" && LEGACY_MEDIA_COUNT=0 PATH="$tmp/bin:$PATH" bash ./deploy.sh check 2>&1)
grep -Fq 'Deploy configuration OK' <<< "$output"

printf 'deploy script contract PASS\n'
