#!/usr/bin/env bash
set -euo pipefail

script=$(<deploy.sh)
grep -Fq '[[ $PWD == /var/www/vnru-network ]]' <<< "$script"
grep -Fq 'stat -c %a "$file"' <<< "$script"
grep -Fq 'http://127.0.0.1:8080/' <<< "$script"
grep -Fq 'pg_dump -U "$POSTGRES_USER" -d auth_db -Fc' <<< "$script"
grep -Fq -- '--profile seed run --rm -T demo-seed' <<< "$script"
grep -Fq 'restart nginx' <<< "$script"
! grep -Eq '(PASSWORD|SECRET)=[^$]' deploy.sh
printf 'deploy script contract PASS\n'
