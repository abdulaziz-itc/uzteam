import { setRequestLocale, getTranslations } from 'next-intl/server';
import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { pickL } from '@/lib/locale-field';
import { Database, Users, Settings, Package, UserCheck, Bot, Boxes, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Database, Users, Settings, Package, UserCheck, Bot, Boxes,
};

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Services');

  const rows = await db.select().from(services).orderBy(asc(services.displayOrder));

  return (
    <div className="bg-background py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {t('heading')}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            {t('subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {rows.map((service) => {
            const Icon = iconMap[service.icon ?? ''] ?? Boxes;
            const features = (
              locale === 'uz' ? service.featuresUz : locale === 'ru' ? service.featuresRu : service.featuresEn
            ) as string[] | null;

            return (
              <div
                key={service.id}
                className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-primary/30 card-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary/10">
                  <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  {pickL(service, 'title', locale)}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pickL(service, 'description', locale)}
                </p>
                {Array.isArray(features) && features.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
