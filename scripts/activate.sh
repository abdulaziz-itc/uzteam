#!/bin/bash
# UzTeam release activation — run from the app root after extracting deploy.tar.gz.
# Loads .env.local, applies pending DB migrations + seed (idempotent), restarts Passenger.
set -e
cd "$(dirname "$0")/.."

echo "── Loading DATABASE_URL from .env.local ──"
set -a; source ./.env.local; set +a

if ! command -v psql >/dev/null 2>&1; then
  echo "⚠️  psql topilmadi — DB bosqichi o'tkazib yuborildi."
  echo "    Sxema/seed'ni cPanel phpPgAdmin orqali qo'lda qo'llang:"
  echo "    drizzle/*.sql  va  scripts/seed.sql"
else
  echo "── Migration tracking table ──"
  psql "$DATABASE_URL" -q -c "CREATE TABLE IF NOT EXISTS _migrations (name text PRIMARY KEY, applied_at timestamptz DEFAULT now());"

  # Bootstrap: schema was originally applied before tracking existed.
  if [ "$(psql "$DATABASE_URL" -tAc "SELECT to_regclass('public.admin_users')")" != "" ] && \
     [ "$(psql "$DATABASE_URL" -tAc "SELECT count(*) FROM _migrations")" = "0" ]; then
    psql "$DATABASE_URL" -q -c "INSERT INTO _migrations(name) VALUES ('0000_init.sql') ON CONFLICT DO NOTHING;"
    echo "bootstrap: 0000_init.sql marked as applied"
  fi

  echo "── Applying pending migrations ──"
  for f in drizzle/*.sql; do
    n=$(basename "$f")
    if [ "$(psql "$DATABASE_URL" -tAc "SELECT 1 FROM _migrations WHERE name='$n'")" != "1" ]; then
      echo "applying $n ..."
      psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
      psql "$DATABASE_URL" -q -c "INSERT INTO _migrations(name) VALUES ('$n');"
    else
      echo "skip $n (already applied)"
    fi
  done

  echo "── Seeding (idempotent) ──"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/seed.sql
fi

echo "── Restarting Passenger app ──"
mkdir -p tmp && touch tmp/restart.txt

echo "✅ Release activated"
