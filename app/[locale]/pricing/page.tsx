import { setRequestLocale, getTranslations } from 'next-intl/server';
import { asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { pricingPlans } from '@/lib/db/schema';
import { pickL } from '@/lib/locale-field';
import { Link } from '@/i18n/routing';
import { Calculator, ArrowRight, Check } from 'lucide-react';

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('PricingPage');

  const plans = await db.select().from(pricingPlans).orderBy(asc(pricingPlans.displayOrder));

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

        {plans.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 text-center card-shadow">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Calculator className="h-7 w-7 text-primary" />
            </span>
            <div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">{t('empty_title')}</h2>
              <p className="text-muted-foreground">{t('empty_desc')}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/calculator"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t('cta_calculator')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
              >
                {t('cta_contact')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const features = (
                locale === 'uz' ? plan.featuresUz : locale === 'ru' ? plan.featuresRu : plan.featuresEn
              ) as string[] | null;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border bg-card p-7 card-shadow ${
                    plan.isHighlighted ? 'border-primary' : 'border-border'
                  }`}
                >
                  {plan.isHighlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                      {t('popular')}
                    </span>
                  )}
                  <h2 className="mb-2 text-lg font-semibold text-foreground">
                    {pickL(plan, 'title', locale)}
                  </h2>
                  {plan.price && (
                    <div className="mb-5 text-3xl font-bold text-foreground">
                      ${Number(plan.price).toLocaleString()}
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        {plan.currency}
                      </span>
                    </div>
                  )}
                  {Array.isArray(features) && (
                    <ul className="mb-6 space-y-2.5">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href="/contact"
                    className={`mt-auto inline-flex items-center justify-center rounded-xl px-6 py-3 font-medium transition-all ${
                      plan.isHighlighted
                        ? 'bg-primary text-primary-foreground hover:opacity-90'
                        : 'border border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    {t('cta_contact')}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
