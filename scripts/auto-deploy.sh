#!/bin/bash
# UzTeam auto-deploy — runs from cron every few minutes on the ahost server.
# Checks the GitHub "latest" release; if a new build was published, downloads
# and activates it. Designed to be piped from GitHub raw, so the server never
# needs a pre-installed copy:
#
#   */5 * * * * curl -sL https://raw.githubusercontent.com/abdulaziz-itc/uzteam/main/scripts/auto-deploy.sh | /bin/bash >> /home/uzteamuz/logs/deploy.log 2>&1
#
set -u

APP_DIR="$HOME/uzteam"
URL="https://github.com/abdulaziz-itc/uzteam/releases/download/latest/deploy.tar.gz"
ETAG_FILE="$APP_DIR/.deployed-etag"
LOCK_FILE="$HOME/.uzteam-deploy.lock"

# Prevent overlapping runs.
exec 9>"$LOCK_FILE"
flock -n 9 || exit 0

mkdir -p "$APP_DIR"
cd "$APP_DIR" || exit 1

# What is currently published?
REMOTE=$(curl -sIL --max-time 30 "$URL" | grep -i '^etag' | tail -1 | awk '{print $2}' | tr -d '\r')
[ -z "$REMOTE" ] && exit 0   # network hiccup — try again next tick

LOCAL=$(cat "$ETAG_FILE" 2>/dev/null || echo "none")
[ "$REMOTE" = "$LOCAL" ] && exit 0   # up to date — stay silent

echo "──────────────────────────────────────────────"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Yangi release topildi: $REMOTE (avvalgisi: $LOCAL)"

# Download and sanity-check the bundle.
curl -sL --max-time 300 -o deploy.tar.gz.new "$URL" || { echo "❌ yuklab olish xatosi"; exit 1; }
SIZE=$(stat -c%s deploy.tar.gz.new 2>/dev/null || stat -f%z deploy.tar.gz.new)
if [ "${SIZE:-0}" -lt 1000000 ]; then
  echo "❌ paket juda kichik (${SIZE:-0} bayt) — bekor qilindi"
  rm -f deploy.tar.gz.new
  exit 1
fi

echo "── Eski release tozalanmoqda (.env.local, tmp, logs saqlanadi) ──"
rm -rf .next node_modules public app components lib messages i18n \
       drizzle scripts .git server.js package.json package-lock.json \
       next.config.ts tsconfig.json proxy.ts eslint.config.mjs \
       postcss.config.mjs components.json README.md PROJECT.md DEPLOYMENT.md \
       AGENTS.md CLAUDE.md drizzle.config.ts

echo "── Yangi release ochilmoqda ──"
tar -xzf deploy.tar.gz.new || { echo "❌ arxiv ochilmadi"; exit 1; }
rm -f deploy.tar.gz.new

echo "── Aktivatsiya ──"
bash scripts/activate.sh

echo "$REMOTE" > "$ETAG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Deploy yakunlandi: $REMOTE"
