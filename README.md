# UzTeam — IT Business Automation & AI Solutions

<div align="center">
  <img src="public/logo.png" alt="UzTeam Logo" width="300" />
  <br/><br/>
  <p><strong>Corporate website with AI-powered project estimation and a built-in admin panel</strong></p>

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38bdf8?logo=tailwind-css)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-336791?logo=postgresql)
</div>

---

## ✨ Features

- 🌍 **Trilingual** — Uzbek, English, Russian (`next-intl`), full professional copy in all three
- 🎨 **Light & dark mode** — modest corporate design system on shadcn tokens (`next-themes` toggle)
- 🤖 **AI Project Calculator** — 3-step wizard → LLM generates a BR summary → deterministic pricing engine → 2-tier lead gate
- 💬 **AI Chat Widget** — floating assistant with streaming responses (mock mode without an API key)
- 📊 **Admin Panel** — own JWT auth (bcrypt + HttpOnly cookie), dashboard, leads, team management
- 📥 **Lead capture** — contact form and calculator gate write into PostgreSQL
- ⚡ **SSR** — Next.js App Router, server components read the DB directly

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui tokens, light/dark |
| Animations | Framer Motion |
| Database | PostgreSQL + Drizzle ORM (`node-postgres`) |
| Auth | Own JWT (jose) + bcryptjs, HttpOnly cookie |
| AI | Vercel AI SDK + OpenAI (optional — mock mode without key) |
| i18n | next-intl (uz / en / ru) |

## 📦 Getting Started

```bash
git clone https://github.com/abdulaziz-itc/uzteam.git
cd uzteam
npm install
cp .env.example .env.local   # then fill in the values
```

`.env.local`:

```env
DATABASE_URL=postgres://user:password@localhost:5432/uzteam
JWT_SECRET=<openssl rand -base64 48>
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=              # optional — mock mode without it
```

Create the schema and seed data (admin user, settings, pricing matrix, services):

```bash
npm run db:push
npm run db:seed
```

Run the dev server:

```bash
npm run dev
```

Open http://localhost:3000 — the site; http://localhost:3000/en/admin — the admin panel.

Default seeded admin: `admin@uzteam.com` / `uzteam2026` (override with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` before seeding; change in production!).

## 🗄️ Database scripts

| Command | Purpose |
|---|---|
| `npm run db:push` | Sync the Drizzle schema to the database |
| `npm run db:generate` | Generate SQL migration files into `drizzle/` |
| `npm run db:migrate` | Apply generated migrations |
| `npm run db:seed` | Seed admin user, settings, pricing matrix, services |
| `npm run db:studio` | Open Drizzle Studio (DB browser) |

## 📁 Project Structure

```
uzteam/
├── app/
│   ├── [locale]/            # i18n routes (uz, en, ru)
│   │   ├── page.tsx         # Home
│   │   ├── services/        # From DB (localized columns)
│   │   ├── portfolio/       # From DB + empty state
│   │   ├── pricing/         # From DB + empty state
│   │   ├── blog/            # Published posts from DB
│   │   ├── about/           # Values + team from DB
│   │   ├── contact/         # Lead form + company info from DB
│   │   ├── calculator/      # AI project estimator
│   │   └── admin/           # JWT-protected admin panel
│   └── api/
│       ├── admin/login|logout  # Session endpoints
│       ├── calculator[/gate]   # LLM + pricing engine + lead gate
│       ├── chat/               # Streaming chat
│       └── leads/              # Contact form target
├── components/              # UI (header, footer, home/*, calculator, chat, forms)
├── i18n/                    # next-intl routing & config
├── lib/
│   ├── db/                  # Drizzle schema, client, seed
│   ├── auth.ts              # JWT sign/verify (edge-safe)
│   ├── session.ts           # Cookie session reader (server-only)
│   ├── locale-field.ts      # Localized DB column picker
│   └── pricing-engine.ts    # Deterministic pricing logic
├── messages/                # uz.json / en.json / ru.json
├── drizzle.config.ts
└── proxy.ts                 # Middleware: i18n + admin auth guard
```

## 🔒 Admin Panel

`/en/admin` is protected by middleware: the `uzteam_admin_session` HttpOnly cookie must contain a valid JWT (7-day expiry, HS256, `JWT_SECRET`). Login checks bcrypt hashes in the `admin_users` table.

To add another admin, insert a row into `admin_users` with a bcrypt hash, or re-run the seed with `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`.

## 🤖 AI — Mock Mode

Without `OPENAI_API_KEY` the calculator returns a static BR summary (pricing still comes from the DB matrix) and the chat streams a mock reply. Set the key to enable real LLM output.

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) — covers ahost (cPanel Node.js App) with GitHub Actions auto-deploy over SSH.

## 📄 License

MIT © UzTeam
