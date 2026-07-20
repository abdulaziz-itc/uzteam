'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

export default function CTABand() {
  const t = useTranslations('CTABand');

  return (
    <section className="relative overflow-hidden bg-primary py-16 md:py-20">
      {/* decorative shapes */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rotate-12 rounded-3xl bg-primary-foreground/5" />
      <div className="pointer-events-none absolute -bottom-14 right-10 h-48 w-48 -rotate-12 rounded-3xl bg-primary-foreground/5" />
      <div className="pointer-events-none absolute right-1/3 top-6 h-16 w-16 rotate-45 rounded-xl bg-primary-foreground/5" />

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center">
        <h2 className="mb-3 max-w-2xl text-2xl font-bold tracking-tight text-primary-foreground md:text-3xl">
          {t('heading')}
        </h2>
        <p className="mb-8 max-w-xl text-primary-foreground/80">{t('subheading')}</p>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 rounded-full bg-primary-foreground px-7 py-3.5 font-semibold text-primary transition-transform hover:scale-[1.02]"
        >
          {t('cta')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
