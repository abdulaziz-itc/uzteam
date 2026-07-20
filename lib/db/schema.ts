import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  numeric,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

// ─────────────────────────────────────────────────────────────
// Auth — admin users (replaces Supabase Auth)
// ─────────────────────────────────────────────────────────────
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 1. Settings (singleton)
// ─────────────────────────────────────────────────────────────
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  addressUz: text('address_uz'),
  addressEn: text('address_en'),
  addressRu: text('address_ru'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  socialLinks: jsonb('social_links').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 2. Services
// ─────────────────────────────────────────────────────────────
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  icon: varchar('icon', { length: 100 }),
  titleUz: varchar('title_uz', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleRu: varchar('title_ru', { length: 255 }).notNull(),
  descriptionUz: text('description_uz'),
  descriptionEn: text('description_en'),
  descriptionRu: text('description_ru'),
  featuresUz: jsonb('features_uz').default([]),
  featuresEn: jsonb('features_en').default([]),
  featuresRu: jsonb('features_ru').default([]),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 3. Portfolio items
// ─────────────────────────────────────────────────────────────
export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'set null' }),
  titleUz: varchar('title_uz', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleRu: varchar('title_ru', { length: 255 }).notNull(),
  descriptionUz: text('description_uz'),
  descriptionEn: text('description_en'),
  descriptionRu: text('description_ru'),
  problemUz: text('problem_uz'),
  problemEn: text('problem_en'),
  problemRu: text('problem_ru'),
  solutionUz: text('solution_uz'),
  solutionEn: text('solution_en'),
  solutionRu: text('solution_ru'),
  resultsUz: text('results_uz'),
  resultsEn: text('results_en'),
  resultsRu: text('results_ru'),
  techTags: jsonb('tech_tags').default([]),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 4. Portfolio images
// ─────────────────────────────────────────────────────────────
export const portfolioImages = pgTable('portfolio_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  portfolioItemId: uuid('portfolio_item_id').references(() => portfolioItems.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 5. Team members
// ─────────────────────────────────────────────────────────────
export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  roleUz: varchar('role_uz', { length: 255 }),
  roleEn: varchar('role_en', { length: 255 }),
  roleRu: varchar('role_ru', { length: 255 }),
  bioUz: text('bio_uz'),
  bioEn: text('bio_en'),
  bioRu: text('bio_ru'),
  photoUrl: text('photo_url'),
  socialLinks: jsonb('social_links').default({}),
  displayOrder: integer('display_order').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 6. Blog posts
// ─────────────────────────────────────────────────────────────
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  category: varchar('category', { length: 100 }),
  titleUz: varchar('title_uz', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleRu: varchar('title_ru', { length: 255 }).notNull(),
  excerptUz: text('excerpt_uz'),
  excerptEn: text('excerpt_en'),
  excerptRu: text('excerpt_ru'),
  bodyUz: text('body_uz'),
  bodyEn: text('body_en'),
  bodyRu: text('body_ru'),
  coverImage: text('cover_image'),
  isPublished: boolean('is_published').default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 7. Pricing plans
// ─────────────────────────────────────────────────────────────
export const pricingPlans = pgTable('pricing_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  titleUz: varchar('title_uz', { length: 255 }).notNull(),
  titleEn: varchar('title_en', { length: 255 }).notNull(),
  titleRu: varchar('title_ru', { length: 255 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('USD'),
  featuresUz: jsonb('features_uz').default([]),
  featuresEn: jsonb('features_en').default([]),
  featuresRu: jsonb('features_ru').default([]),
  isHighlighted: boolean('is_highlighted').default(false),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 8. Leads
// ─────────────────────────────────────────────────────────────
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  serviceInterest: varchar('service_interest', { length: 255 }),
  message: text('message'),
  source: varchar('source', { length: 50 }).default('contact_form'),
  status: varchar('status', { length: 50 }).default('new'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 9. Pricing matrix (AI calculator)
// ─────────────────────────────────────────────────────────────
export const pricingMatrix = pgTable('pricing_matrix', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  label: varchar('label', { length: 255 }),
  value: numeric('value', { precision: 15, scale: 2 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 10. Calculator submissions
// ─────────────────────────────────────────────────────────────
export const calculatorSubmissions = pgTable('calculator_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  locale: varchar('locale', { length: 10 }).default('en'),
  ipHash: varchar('ip_hash', { length: 255 }),
  rawInputFeatures: text('raw_input_features'),
  rawInputProblem: text('raw_input_problem'),
  rawInputIntegrations: text('raw_input_integrations'),
  generatedBrText: text('generated_br_text'),
  extractedTags: jsonb('extracted_tags'),
  complexity: varchar('complexity', { length: 50 }),
  minPrice: numeric('min_price', { precision: 15, scale: 2 }),
  maxPrice: numeric('max_price', { precision: 15, scale: 2 }),
  estimatedDays: integer('estimated_days'),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'set null' }),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─────────────────────────────────────────────────────────────
// 11. Calculator rate limits
// ─────────────────────────────────────────────────────────────
export const calculatorRateLimits = pgTable('calculator_rate_limits', {
  ipHash: varchar('ip_hash', { length: 255 }).primaryKey(),
  attemptCount: integer('attempt_count').default(1),
  windowStart: timestamp('window_start', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
