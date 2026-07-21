# UzTeam — Deploy yo'riqnomasi (ahost cPanel + GitHub Actions)

## Arxitektura (build-on-CI — serverda npm YO'Q)

> ⚠️ ahost'da disk kvota kichik — `npm install` serverda ishlamaydi (EDQUOT -122).
> Shu sabab **build GitHub Actions'da** bajariladi, serverga faqat tayyor
> standalone paket (~12 MB tar.gz) yuklanadi. DB sxema/seed — tayyor SQL
> fayllar bilan `psql` orqali qo'llanadi.

```
GitHub (main push)
   │  Actions: npm ci → build (standalone) → deploy.tar.gz (~12MB)
   │  scp → ahost, ssh: extract + psql migratsiya + Passenger restart
   ▼
ahost server (DEPLOY_PATH=/home/uzteamuz/uzteam)
   ├─ server.js            # Next standalone server (tarball ichidan)
   ├─ node_modules/        # minimal traced deps (tarball ichidan)
   ├─ .next/ public/       # build natijasi
   ├─ drizzle/ scripts/    # SQL migratsiya + seed
   ├─ .env.local           # DATABASE_URL... (qo'lda, bir marta)
   └─ cPanel "Setup Node.js App" (Passenger, startup: server.js) → uz-team.uz
```

## 1. ahost'da bir martalik sozlash

### 1.1 PostgreSQL

cPanel → **PostgreSQL Databases**:
1. Baza yarating: `<prefix>_uzteam`
2. Foydalanuvchi yarating va bazaga to'liq huquq bering
3. `DATABASE_URL` shakli: `postgres://<user>:<pass>@localhost:5432/<prefix>_uzteam`

> ahost'da PostgreSQL bo'lmasa: tashqi managed Postgres (Neon/Supabase — faqat DB sifatida)
> ishlatiladi, `DATABASE_URL` o'sha ulanish stringi bo'ladi.

### 1.2 Node.js App

cPanel → **Setup Node.js App** → Create Application:
- Node.js version: **20.x** (yoki eng yangisi)
- Application mode: **Production**
- Application root: `uzteam` (home ichida)
- Application URL: domeningiz
- Application startup file: `server.js` *(pastga qarang)*

Passenger Next.js'ni to'g'ridan-to'g'ri bilmaydi — repo ildizidagi `server.js`
Next'ning standalone serverini ishga tushiradi (build `output: 'standalone'` bilan).

Environment variables (shu sahifada): `DATABASE_URL`, `JWT_SECRET`,
`NEXT_PUBLIC_APP_URL=https://<domen>`, `OPENAI_API_KEY` (bo'lsa), `NODE_ENV=production`.

### 1.3 SSH kalit (Actions uchun)

Lokalda:
```bash
ssh-keygen -t ed25519 -f uzteam_deploy -C "uzteam-deploy" -N ""
```
- `uzteam_deploy.pub` → serverda `~/.ssh/authorized_keys` ga qo'shing
  (cPanel → SSH Access → Manage SSH Keys orqali ham bo'ladi)
- `uzteam_deploy` (privat) → GitHub repo → Settings → Secrets and variables →
  Actions → New repository secret

GitHub Secrets:

| Secret | Qiymat |
|---|---|
| `SSH_HOST` | server IP yoki host |
| `SSH_PORT` | odatda 22 (ahost'da boshqacha bo'lishi mumkin) |
| `SSH_USER` | cPanel foydalanuvchi |
| `SSH_KEY` | privat kalit (to'liq matn) |
| `DEPLOY_PATH` | masalan `/home/<user>/uzteam` |

### 1.4 Serverda bir martalik tayyorgarlik

Faqat `.env.local` yaratish kifoya (kod Actions o'zi olib keladi):

```bash
mkdir -p ~/uzteam && cd ~/uzteam
cat > .env.local <<'EOF'
DATABASE_URL=postgres://<db_user>:<parol>@localhost:5432/<db_nomi>
JWT_SECRET=<uzun random>
NEXT_PUBLIC_APP_URL=https://uz-team.uz
EOF
```

Keyin GitHub'da **Actions → Build & Deploy → Run workflow** (yoki istalgan push).

## 2. Avto-deploy — TO'LIQ AVTOMATIK (cron polling)

ahost tashqi SSH'ni yopgani uchun teskari model ishlaydi: **server o'zi
GitHub'ni tekshiradi**.

- `main`ga push → Actions build qilib `deploy.tar.gz`ni **"latest" Release**ga chiqaradi
- Serverdagi **cron** (5 daqiqada bir) `scripts/auto-deploy.sh`ni GitHub raw'dan
  olib ishga tushiradi: Release ETag o'zgargan bo'lsa — yuklab oladi, ochadi,
  `activate.sh` (migratsiya + seed + restart) ni bajaradi

### Cron'ni bir marta sozlash (cPanel → Cron Jobs)

- **Minute**: `*/5`, qolganlari `*`
- **Command**:

```
curl -sL https://raw.githubusercontent.com/abdulaziz-itc/uzteam/main/scripts/auto-deploy.sh | /bin/bash >> /home/uzteamuz/logs/deploy.log 2>&1
```

Shu bilan tamom — bundan keyin har push ~8 daqiqa ichida (3 min build + 5 min cron)
saytga o'zi chiqadi. Jurnal: `~/logs/deploy.log`.

> SSH orqali variant ham workflow'da saqlangan (`continue-on-error`) — ahost
> SSH'ni ochsa, push'дан keyin darhol deploy ham ishlay boshlaydi.

## 3. DB migratsiyalar (prod)

Sxema o'zgarganda **lokalda**:
```bash
npm run db:generate        # drizzle/000N_*.sql yaratadi
git add drizzle/ && git commit && git push
```
Yangi SQL fayllarni serverda qo'llash uchun workflow'dagi schema bosqichini
kengaytiring yoki qo'lda: `psql "$DATABASE_URL" -f drizzle/000N_*.sql`.

## 4. Tekshirish

```bash
curl -I https://<domen>/uz          # 200
curl -X POST https://<domen>/api/leads -H 'Content-Type: application/json' \
     -d '{"name":"Test","email":"t@t.uz","message":"ping"}'   # {"success":true}
```

Admin: `https://<domen>/en/admin/login`.

## 5. Muammolar

| Belgi | Sabab / yechim |
|---|---|
| 503 / Passenger xato | `server.js` yo'lini tekshiring; Node versiya 20+; `npm run build` muvaffaqiyatlimi |
| DB ulanish xatosi | `DATABASE_URL` env to'g'rimi; cPanel'da user→db huquq berilganmi |
| Admin login 401 | Seed ishga tushganmi (`admin_users` bo'shmi); `JWT_SECRET` o'zgargan bo'lsa eski cookie yaroqsiz — qayta login |
| Rasm/statik 404 | `public/` deploy bo'lganmi; standalone rejimda `.next/static` ko'chirilganmi (workflow buni qiladi) |
