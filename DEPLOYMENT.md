# UzTeam — Deploy yo'riqnomasi (ahost cPanel + GitHub Actions)

## Arxitektura

```
GitHub (main push)
   │  GitHub Actions (.github/workflows/deploy.yml)
   ▼  SSH
ahost server
   ├─ ~/uzteam            # repo klon (yoki cPanel'dagi app papkasi)
   ├─ PostgreSQL          # cPanel'da yaratilgan baza
   └─ cPanel "Setup Node.js App" (Passenger) → domen
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

### 1.4 Birinchi deploy (qo'lda)

```bash
ssh <user>@<host>
git clone https://github.com/abdulaziz-itc/uzteam.git ~/uzteam
cd ~/uzteam
npm ci
npm run db:push && npm run db:seed   # birinchi marta
npm run build
# cPanel Node.js App'ni restart qiling (UI'da Restart tugmasi)
```

## 2. Avto-deploy (GitHub Actions)

`main`ga har push → `.github/workflows/deploy.yml`:
1. SSH orqali serverga kiradi
2. `git fetch && git reset --hard origin/main`
3. `npm ci` (faqat lock o'zgargan bo'lsa tez)
4. `npm run build`
5. Passenger restart: `touch tmp/restart.txt` (yoki cloudlinux `cloudlinux-selector restart`)

Workflow fayli allaqachon repoda — faqat Secrets to'ldirilsa ishlaydi.

## 3. DB migratsiyalar (prod)

Sxema o'zgarganda:
```bash
# lokalda: migratsiya fayli yaratish
npm run db:generate
git add drizzle/ && git commit && git push
# serverda (Actions buildidan keyin yoki qo'lda):
npm run db:migrate
```
> `db:push` dev uchun; prod'da `generate + migrate` tavsiya (tarix saqlanadi).

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
