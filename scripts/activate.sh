#!/bin/bash
# UzTeam release activation — run from the app root after extracting deploy.tar.gz.
# Loads .env.local, applies DB schema (first run) + seed (idempotent), restarts Passenger.
set -e
cd "$(dirname "$0")/.."

echo "── Loading DATABASE_URL from .env.local ──"
set -a; source ./.env.local; set +a

if ! command -v psql >/dev/null 2>&1; then
  echo "⚠️  psql topilmadi — DB bosqichi o'tkazib yuborildi."
  echo "    Sxema/seed'ni cPanel phpPgAdmin orqali qo'lda qo'llang:"
  echo "    drizzle/0000_init.sql  va  scripts/seed.sql"
else
  echo "── Applying DB schema (first run only) ──"
  if [ "$(psql "$DATABASE_URL" -tAc "SELECT to_regclass('public.admin_users')")" = "" ]; then
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f drizzle/0000_init.sql
    echo "schema applied"
  else
    echo "schema already present — skipped"
  fi

  echo "── Seeding (idempotent) ──"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/seed.sql
fi

echo "── Restarting Passenger app ──"
mkdir -p tmp && touch tmp/restart.txt

echo "✅ Release activated"
