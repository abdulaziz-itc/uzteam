'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Bot, Check, ArrowRight } from 'lucide-react';

export default function ServicesOverview() {
  const t = useTranslations('Services');
  const f = useTranslations('Flagship');

  const flagshipFeatures = [t('flagship_f1'), t('flagship_f2'), t('flagship_f3'), t('flagship_f4')];

  return (
    <section className="bg-accent/50 py-20 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-10 md:flex-row md:gap-16"
        >
          {/* Bot illustration */}
          <div className="flex w-full justify-center md:w-2/5">
            <div className="relative flex h-56 w-56 items-center justify-center">
              <span className="absolute inset-0 rounded-[2.5rem] bg-primary/10" />
              <span className="absolute inset-6 rounded-[2rem] bg-primary/10" />
              <span className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-primary card-shadow">
                <Bot className="h-14 w-14 text-primary-foreground" />
              </span>
              {/* floating dots */}
              <span className="absolute -right-1 top-8 h-4 w-4 rounded-full bg-emerald-400" />
              <span className="absolute -left-2 bottom-12 h-3 w-3 rounded-full bg-orange-400" />
              <span className="absolute right-8 -bottom-1 h-5 w-5 rounded-full bg-primary/40" />
            </div>
          </div>

          {/* Copy + checklist */}
          <div className="w-full md:w-3/5">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {f('badge')}
            </span>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {t('flagship_title')}
            </h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">{t('flagship_desc')}</p>

            <ul className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {flagshipFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                    <Check className="h-3 w-3 text-emerald-500" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {f('learn_more')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
