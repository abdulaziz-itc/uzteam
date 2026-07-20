import { config } from 'dotenv';
config({ path: '.env.local' });

import bcrypt from 'bcryptjs';

async function seed() {
  // Dynamic imports so DATABASE_URL is loaded (above) before the pool is created.
  const { db } = await import('./index');
  const { adminUsers, settings, services, pricingMatrix } = await import('./schema');

  console.log('🌱 Seeding database...');

  // ── Admin user ────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@uzteam.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'uzteam2026';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await db
    .insert(adminUsers)
    .values({ email: adminEmail, passwordHash, name: 'UzTeam Admin' })
    .onConflictDoNothing({ target: adminUsers.email });
  console.log(`✅ Admin user: ${adminEmail} (password: ${adminPassword})`);

  // ── Settings (singleton) ──────────────────────────────────
  const existingSettings = await db.select({ id: settings.id }).from(settings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(settings).values({
      companyName: 'UzTeam',
      addressEn: 'Tashkent, Uzbekistan',
      addressUz: 'Toshkent, O‘zbekiston',
      addressRu: 'Ташкент, Узбекистан',
      email: 'hello@uzteam.com',
      phone: '+998 90 123 45 67',
      socialLinks: { telegram: '', instagram: '', linkedin: '' },
    });
    console.log('✅ Settings seeded');
  } else {
    console.log('↩️  Settings already present');
  }

  // ── Pricing matrix (AI calculator) ────────────────────────
  const matrixRows = [
    { key: 'base_low', label: 'Base Price (Low Complexity)', value: '5000.00', type: 'base' },
    { key: 'base_medium', label: 'Base Price (Medium Complexity)', value: '12000.00', type: 'base' },
    { key: 'base_high', label: 'Base Price (High Complexity)', value: '25000.00', type: 'base' },
    { key: 'hourly_rate', label: 'Standard Hourly Rate', value: '50.00', type: 'hourly' },
    { key: 'multiplier_realtime', label: 'Realtime Sync Multiplier', value: '1.30', type: 'multiplier' },
    { key: 'multiplier_high_security', label: 'High Security Multiplier', value: '1.50', type: 'multiplier' },
    { key: 'feature_auth', label: 'Authentication Module', value: '40.00', type: 'feature_hours' },
    { key: 'feature_payment', label: 'Payment Integration', value: '60.00', type: 'feature_hours' },
    { key: 'feature_admin', label: 'Admin Dashboard', value: '80.00', type: 'feature_hours' },
  ];
  for (const row of matrixRows) {
    await db.insert(pricingMatrix).values(row).onConflictDoNothing({ target: pricingMatrix.key });
  }
  console.log(`✅ Pricing matrix seeded (${matrixRows.length} rows)`);

  // ── Services ──────────────────────────────────────────────
  const existingServices = await db.select({ id: services.id }).from(services).limit(1);
  if (existingServices.length === 0) {
    await db.insert(services).values([
      {
        icon: 'Database',
        titleEn: 'ERP Systems',
        titleRu: 'Системы ERP',
        titleUz: 'ERP Tizimlari',
        descriptionEn: 'Full-scale enterprise resource planning',
        descriptionRu: 'Полномасштабное планирование ресурсов предприятия',
        descriptionUz: 'Keng ko‘lamli korxona resurslarini rejalashtirish',
        displayOrder: 1,
      },
      {
        icon: 'Users',
        titleEn: 'CRM Solutions',
        titleRu: 'CRM Решения',
        titleUz: 'CRM Yechimlari',
        descriptionEn: 'Customer relationship management tailored for you',
        descriptionRu: 'Управление отношениями с клиентами',
        descriptionUz: 'Mijozlar bilan munosabatlarni boshqarish',
        displayOrder: 2,
      },
      {
        icon: 'Bot',
        titleEn: 'Custom AI Assistants',
        titleRu: 'ИИ Ассистенты',
        titleUz: 'Maxsus AI Yordamchilari',
        descriptionEn: 'Chatbots, voice bots, and internal AI copilots.',
        descriptionRu: 'Чат-боты, голосовые боты и внутренние ИИ-помощники.',
        descriptionUz: 'Chatbotlar, ovozli botlar va ichki AI yordamchilari.',
        displayOrder: 3,
      },
    ]);
    console.log('✅ Services seeded (3 rows)');
  } else {
    console.log('↩️  Services already present');
  }

  console.log('🎉 Seed complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
