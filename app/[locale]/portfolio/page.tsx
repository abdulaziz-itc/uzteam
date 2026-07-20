import { setRequestLocale, getTranslations } from 'next-intl/server';
import { desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { portfolioItems } from '@/lib/db/schema';
import { pickL } from '@/lib/locale-field';
import { Link } from '@/i18n/routing';
import { FolderOpen, ArrowRight } from 'lucide-react';

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('PortfolioPage');

  const items = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));

  return (
    <div className="bg-background py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 text-center card-shadow">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <FolderOpen className="h-7 w-7 text-muted-foreground" />
            </span>
            <p className="text-muted-foreground">{t('empty')}</p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t('cta')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-primary/30 card-shadow"
              >
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  {pickL(item, 'title', locale)}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {pickL(item, 'description', locale)}
                </p>
                {Array.isArray(item.techTags) && (item.techTags as string[]).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(item.techTags as string[]).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
