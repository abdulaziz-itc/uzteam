'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Rocket, Shield, Building2, ArrowRight } from 'lucide-react';

export default function PricingPreview() {
  const t = useTranslations('PricingPreview');

  const tiers = [
    {
      icon: Rocket,
      title: t('p1_title'),
      price: '$5,000',
      desc: t('p1_desc'),
      accent: 'text-emerald-500',
      highlighted: false,
    },
    {
      icon: Shield,
      title: t('p2_title'),
      price: '$12,000',
      desc: t('p2_desc'),
      accent: 'text-primary',
      highlighted: true,
    },
    {
      icon: Building2,
      title: t('p3_title'),
      price: '$25,000',
      desc: t('p3_desc'),
      accent: 'text-orange-500',
      highlighted: false,
    },
  ];

  return (
    <section className="bg-accent/50 py-20 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('heading')}
          </h2>
          <span className="mx-auto mb-4 block h-1 w-12 rounded-full bg-primary/60" />
          <p className="mx-auto max-w-2xl text-muted-foreground">{t('subheading')}</p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-6 md:grid-cols-3">
          {tiers.map(({ icon: Icon, title, price, desc, accent, highlighted }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`relative flex flex-col items-center rounded-2xl border bg-card p-8 text-center card-shadow ${
                highlighted ? 'border-primary md:-my-4 md:py-12' : 'border-border'
              }`}
            >
              {highlighted && (
                <span className="absolute -top-3 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  {t('popular')}
                </span>
              )}
              <Icon className={`mb-4 h-9 w-9 ${accent}`} />
              <h3 className="mb-1 text-lg font-semibold text-foreground">{title}</h3>
              <div className="mb-3">
                <span className="text-xs text-muted-foreground">{t('from')} </span>
                <span className="text-3xl font-bold tracking-tight text-foreground">{price}</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <Link
                href="/calculator"
                className={`mt-auto inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  highlighted
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'border border-border text-foreground hover:bg-muted'
                }`}
              >
                {t('cta')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
