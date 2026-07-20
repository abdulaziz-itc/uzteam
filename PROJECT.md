# UzTeam — To'liq loyiha hujjati

> Oxirgi yangilanish: 2026-07-21. Bu fayl loyihaning to'liq texnik pasporti:
> arxitektura, DB sxema, API, auth, i18n, dizayn tizimi va ish jarayonlari.

## 1. Umumiy ma'lumot

**UzTeam** — IT biznes-avtomatlashtirish kompaniyasining korporativ sayti:

- Ochiq sayt: bosh sahifa, xizmatlar, portfolio, narxlar, blog, biz haqimizda, aloqa
- **AI kalkulyator**: mijoz g'oyasini yozadi → LLM biznes-talablar (BR) xulosasini tuzadi →
  deterministik narx dvigateli byudjet oralig'i va muddatni hisoblaydi → natija
  kontakt formasi ("gate") orqali ochiladi va lead sifatida saqlanadi
- **AI chat vidjeti**: saytdagi suzuvchi yordamchi (streaming)
- **Admin panel**: leadlar, dashboard, jamoa boshqaruvi (JWT bilan himoyalangan)

## 2. Texnologiyalar

| Qatlam | Texnologiya | Izoh |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR, server components, Turbopack |
| Til | TypeScript 5 | strict |
| UI | Tailwind CSS v4 + shadcn tokenlar | `app/[locale]/globals.css` da palitra |
| Tema | next-themes | class strategiyasi, light default + dark toggle |
| Animatsiya | framer-motion | scroll-reveal, wizard o'tishlari |
| DB | PostgreSQL | lokal: `uzteam` bazasi |
| ORM | Drizzle ORM + node-postgres (pg Pool) | `lib/db/` |
| Auth | jose (JWT HS256) + bcryptjs | HttpOnly cookie `uzteam_admin_session`, 7 kun |
| AI | Vercel AI SDK (`ai` v6) + `@ai-sdk/openai` | `OPENAI_API_KEY`siz mock rejim |
| i18n | next-intl v4 | uz / en / ru |

**Muhim**: Supabase butunlay olib tashlangan (2026-07-21). Auth ham, data ham endi o'zimizniki.

## 3. Papka tuzilmasi

```
app/
├── [locale]/                # uz|en|ru prefiksli sahifalar
│   ├── layout.tsx           # ThemeProvider + NextIntl + Header/Footer/Chat
│   ├── page.tsx             # Bosh sahifa (Hero, Marquee, Services, Stats, Process, CTA)
│   ├── services/page.tsx    # DB `services` jadvalidan (lokalizatsiyalangan ustunlar)
│   ├── portfolio/page.tsx   # DB `portfolio_items` + bo'sh holat dizayni
│   ├── pricing/page.tsx     # DB `pricing_plans` + bo'sh holat (kalkulyatorga CTA)
│   ├── blog/page.tsx        # DB `posts` (is_published=true)
│   ├── about/page.tsx       # Qadriyatlar (i18n) + DB `team_members`
│   ├── contact/page.tsx     # ContactForm + DB `settings` (manzil/tel/email)
│   ├── calculator/page.tsx  # CalculatorWizard
│   └── admin/               # Admin panel (login, dashboard, team, ...)
└── api/
    ├── admin/login/route.ts    # POST — bcrypt tekshirish → JWT cookie
    ├── admin/logout/route.ts   # POST — cookie o'chirish
    ├── calculator/route.ts     # POST — rate-limit → LLM/mock → narx → DB
    ├── calculator/gate/route.ts# POST — lead yaratish → tier2 natija
    ├── chat/route.ts           # POST — matn stream (LLM yoki mock)
    └── leads/route.ts          # POST — kontakt formasi

components/
├── header.tsx               # Sticky, nav + til + tema toggle + CTA
├── footer.tsx
├── theme-provider.tsx       # next-themes wrapper
├── theme-toggle.tsx         # Quyosh/oy tugmasi (hydration-safe)
├── contact-form.tsx         # Client form → /api/leads
├── home/                    # hero, tech-marquee, services-overview, stats,
│                            # process-timeline, contact-cta
├── calculator/wizard.tsx    # 3 bosqich + loading + natija + gate
└── chat/widget.tsx          # Streaming chat (fetch + ReadableStream)

lib/
├── db/schema.ts             # 12 jadval (Drizzle)
├── db/index.ts              # pg Pool (dev'da global qayta ishlatish)
├── db/seed.ts               # admin + settings + pricing_matrix + services
├── auth.ts                  # signSession/verifySession (edge-safe, next/headers'siz)
├── session.ts               # getSession() — server-only cookie o'quvchi
├── locale-field.ts          # pickL(row,'title','uz') → row.titleUz
└── pricing-engine.ts        # calculateEstimate() — DB matritsadan

i18n/routing.ts              # locales: uz/en/ru, default: uz
messages/{uz,en,ru}.json     # 15 namespace to'liq professional matn
proxy.ts                     # Middleware: /api skip, /admin JWT guard, i18n
drizzle.config.ts            # drizzle-kit konfiguratsiyasi (.env.local o'qiydi)
```

## 4. DB sxema (12 jadval)

| Jadval | Vazifasi | Muhim ustunlar |
|---|---|---|
| `admin_users` | Admin akkauntlar | email (unique), password_hash (bcrypt), is_active |
| `settings` | Kompaniya rekvizitlari (singleton) | company_name, address_{uz,en,ru}, phone, email, social_links |
| `services` | Xizmatlar | icon (lucide nomi), title/description/features ×3 til, display_order |
| `portfolio_items` | Keys-stadilar | title/description/problem/solution/results ×3 til, tech_tags, is_featured |
| `portfolio_images` | Portfolio rasmlari | portfolio_item_id (cascade), image_url |
| `team_members` | Jamoa | name, role/bio ×3 til, photo_url, is_active |
| `posts` | Blog | slug (unique), title/excerpt/body ×3 til, is_published, published_at |
| `pricing_plans` | Tariflar | title ×3, price, features ×3, is_highlighted |
| `leads` | Lidlar | name, email, phone, company, message, source (contact_form/calculator/chat_widget), status |
| `pricing_matrix` | Kalkulyator narxlari | key (unique), value, type (base/hourly/feature_hours/multiplier) |
| `calculator_submissions` | Kalkulyator arizalari | raw_input_*, generated_br_text, complexity, min/max_price, lead_id |
| `calculator_rate_limits` | IP rate-limit | ip_hash (PK), attempt_count, window_start |

Lokalizatsiya: `*_uz`, `*_en`, `*_ru` ustunlar; `pickL()` helper joriy locale bo'yicha tanlaydi (en — fallback).

## 5. Auth oqimi

1. `POST /api/admin/login` — email topiladi, `bcrypt.compare`, muvaffaqiyatda
   `jose` bilan HS256 JWT (sub=user.id, email, name; 7 kun) → `uzteam_admin_session`
   HttpOnly cookie (secure prod'da, sameSite=lax).
2. `proxy.ts` middleware — `/admin` yo'llarida cookie'ni `verifySession` bilan tekshiradi:
   - Sessiya yo'q + login sahifasi emas → `/en/admin/login` ga redirect
   - Sessiya bor + login sahifasi → `/en/admin` ga redirect
   - `/api/*` yo'llari middleware'dan butunlay o'tkazib yuboriladi (i18n prefiks qo'shilmasin)
3. `POST /api/admin/logout` — cookie o'chiriladi.
4. Server komponentlarda joriy sessiya: `lib/session.ts` → `getSession()`.

`lib/auth.ts` **edge-safe** (next/headers import qilmaydi) — middleware'da ishlaydi.

## 6. AI kalkulyator oqimi

1. Wizard 3 bosqich: funksiyalar → muammo → integratsiyalar (barchasi i18n).
2. `POST /api/calculator`:
   - IP sha256 hash bo'yicha rate-limit (24 soatda 3 urinish, DB'da)
   - `OPENAI_API_KEY` yo'q → mock BR + DB'dan real narx hisoblanadi
   - Kalit bor → `generateObject` (gpt-4o-mini, zod sxema): br_summary_text, features,
     integrations, isRealtime, needsHighSecurity, complexity
   - `calculateEstimate()`: baza narx (complexity) + feature-soatlar × stavka +
     integratsiyalar + multiplikatorlar → min/max/kunlar
   - `calculator_submissions` ga yoziladi, faqat **tier1** (BR + complexity) qaytadi
3. `POST /api/calculator/gate`: ism+email majburiy → `leads` yozuvi → submission'ga
   lead_id bog'lanadi → **tier2** (narx oralig'i, muddat, PDF url) ochiladi.
   Takror so'rovda (lead_id bor) tier2 to'g'ridan-to'g'ri qaytadi.

## 7. Dizayn tizimi

Uslub: **yengil, do'stona marketing-sayt** (Smooth-template ruhida), lekin IT
kompaniyaga xos professional ijro. Light default + dark toggle.

- **Palitra**: oklch tokenlar `globals.css`da. Light — oq fon, yumshoq periwinkle
  band (`--accent: oklch(0.955 0.025 264)`), do'stona indigo-ko'k
  `--primary: oklch(0.55 0.17 264)`. Dark — yumshoq navy-slate (0.17), och ko'k
  primary (0.7). Qo'shimcha aksent ranglar (ikonka chiplari): emerald, orange —
  Tailwind klasslari bilan.
- **Bosh sahifa bo'limlari** (tartib `app/[locale]/page.tsx`): Hero (email-capture
  pill + flat SVG illyustratsiya `hero-illustration.tsx`) → FeatureTrio (3 rangli
  ikonka) → Flagship AI band (accent fonda, checklist) → ProductShot (CSS bilan
  qurilgan dashboard mock, brauzer ramkasida) → Stats → PricingPreview (3 tarif,
  o'rtadagisi ko'tarilgan) → Process → Testimonial → TechMarquee → CTABand
  (to'q primary fon, dekorativ shakllar).
- **Shriftlar**: Inter (matn, `--font-sans`), Space Grotesk (h1–h6, `--font-heading`),
  letter-spacing -0.02em.
- **Cardlar**: `bg-card border-border rounded-2xl card-shadow` (maxsus utility —
  ikki qatlamli yumshoq soya, dark'da qoraroq).
- **Qoida**: asosiy ranglar faqat token klasslar orqali (`bg-background`,
  `text-foreground`, `bg-primary`, `bg-accent`, `border-border`, ...) — light/dark
  avtomatik. SVG illyustratsiya ham CSS var'lardan (`var(--primary)`, `var(--card)`)
  foydalanadi.
- Tema: `next-themes` class strategiyasi, `<html suppressHydrationWarning>`,
  toggle header'da (mounted-check bilan hydration xatosiz).
- Har bo'lim sarlavhasi ostida kichik `h-1 w-12 bg-primary/60` chiziqcha — reference
  uslubidagi ornament.

## 8. i18n

- `i18n/routing.ts`: `locales: ['uz','en','ru']`, `defaultLocale: 'uz'`.
- URL: `/uz/...`, `/en/...`, `/ru/...` (default ham prefiksli).
- 15 namespace: Index, Navigation, TechMarquee, Services, Stats, Process, CTA,
  Footer, Chat, PortfolioPage, PricingPage, BlogPage, AboutPage, ContactPage, Calculator.
- Server sahifalarda `getTranslations`, client komponentlarda `useTranslations`.
- DB kontenti: `pickL(row, field, locale)` (lib/locale-field.ts).

## 9. Muhit o'zgaruvchilari

| O'zgaruvchi | Majburiy | Izoh |
|---|---|---|
| `DATABASE_URL` | ✅ | `postgres://user:pass@host:5432/db` |
| `JWT_SECRET` | ✅ | 32+ belgi random (`openssl rand -base64 48`) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Sayt bazaviy URL |
| `OPENAI_API_KEY` | ➖ | Yo'q bo'lsa AI mock rejimda |
| `SEED_ADMIN_EMAIL/PASSWORD` | ➖ | Faqat seed vaqtida |

## 10. Buyruqlar

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm run start        # production server
npm run lint         # eslint
npm run db:push      # sxemani DB'ga sinxronlash (dev uchun qulay)
npm run db:generate  # SQL migratsiya fayllari yaratish (drizzle/)
npm run db:migrate   # migratsiyalarni qo'llash (prod uchun)
npm run db:seed      # boshlang'ich ma'lumotlar
npm run db:studio    # Drizzle Studio
```

## 11. Ma'lum cheklovlar / keyingi qadamlar

- Admin CRUD sahifalari: blog/portfolio/services/calculator-settings hozircha
  faqat nav'da — sahifalari qurilishi kerak (team faqat ro'yxat, add/edit tugmalari stub).
- Blog post detail sahifasi (`/blog/[slug]`) hali yo'q.
- Kalkulyator PDF: `/placeholder-br.pdf` mock — real PDF generatsiya qilinmagan.
- Rate-limit faqat kalkulyatorda; login endpoint'ga brute-force himoya qo'shish tavsiya.
- Test yo'q. Muhim oqimlar (auth, calculator, leads) uchun test yozish tavsiya.

## 12. Deploy

To'liq yo'riqnoma: [DEPLOYMENT.md](DEPLOYMENT.md) — ahost cPanel (Node.js App / Passenger),
PostgreSQL, GitHub Actions orqali SSH avto-deploy.
