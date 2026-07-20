-- UzTeam seed data (idempotent — safe to run multiple times)
-- Applied on the server with:  psql "$DATABASE_URL" -f scripts/seed.sql

-- ── Admin user (email: admin@uzteam.com, password: uzteam2026 — CHANGE IN PROD) ──
INSERT INTO admin_users (email, password_hash, name)
VALUES ('admin@uzteam.com', '$2a$10$lAitd3UU2a1qkPh/kMe9pe/vFza54g79HUgXrJPG7Z0GRilYGZ946', 'UzTeam Admin')
ON CONFLICT (email) DO NOTHING;

-- ── Settings (singleton) ──
INSERT INTO settings (company_name, address_en, address_uz, address_ru, email, phone, social_links)
SELECT 'UzTeam', 'Tashkent, Uzbekistan', 'Toshkent, O''zbekiston', 'Ташкент, Узбекистан',
       'hello@uzteam.com', '+998 90 123 45 67',
       '{"telegram":"","instagram":"","linkedin":""}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- ── Pricing matrix ──
INSERT INTO pricing_matrix (key, label, value, type) VALUES
  ('base_low', 'Base Price (Low Complexity)', 5000.00, 'base'),
  ('base_medium', 'Base Price (Medium Complexity)', 12000.00, 'base'),
  ('base_high', 'Base Price (High Complexity)', 25000.00, 'base'),
  ('hourly_rate', 'Standard Hourly Rate', 50.00, 'hourly'),
  ('multiplier_realtime', 'Realtime Sync Multiplier', 1.30, 'multiplier'),
  ('multiplier_high_security', 'High Security Multiplier', 1.50, 'multiplier'),
  ('feature_auth', 'Authentication Module', 40.00, 'feature_hours'),
  ('feature_payment', 'Payment Integration', 60.00, 'feature_hours'),
  ('feature_admin', 'Admin Dashboard', 80.00, 'feature_hours')
ON CONFLICT (key) DO NOTHING;

-- ── Services ──
INSERT INTO services (icon, title_en, title_ru, title_uz, description_en, description_ru, description_uz, display_order)
SELECT * FROM (VALUES
  ('Database', 'ERP Systems', 'Системы ERP', 'ERP Tizimlari',
   'Full-scale enterprise resource planning', 'Полномасштабное планирование ресурсов предприятия', 'Keng ko''lamli korxona resurslarini rejalashtirish', 1),
  ('Users', 'CRM Solutions', 'CRM Решения', 'CRM Yechimlari',
   'Customer relationship management tailored for you', 'Управление отношениями с клиентами', 'Mijozlar bilan munosabatlarni boshqarish', 2),
  ('Bot', 'Custom AI Assistants', 'ИИ Ассистенты', 'Maxsus AI Yordamchilari',
   'Chatbots, voice bots, and internal AI copilots.', 'Чат-боты, голосовые боты и внутренние ИИ-помощники.', 'Chatbotlar, ovozli botlar va ichki AI yordamchilari.', 3)
) AS v(icon, title_en, title_ru, title_uz, description_en, description_ru, description_uz, display_order)
WHERE NOT EXISTS (SELECT 1 FROM services);
