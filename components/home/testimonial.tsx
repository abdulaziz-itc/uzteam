'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';

export default function Testimonial() {
  const t = useTranslations('Testimonial');

  return (
    <section className="bg-background py-20 md:py-24">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
          {t('heading')}
        </h2>
        <span className="mx-auto mb-10 block h-1 w-12 rounded-full bg-primary/60" />

        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Quote className="mb-6 h-8 w-8 text-primary/40" />
          <blockquote className="mb-8 text-lg font-medium italic leading-relaxed text-foreground md:text-xl">
            “{t('quote')}”
          </blockquote>
          <figcaption className="flex flex-col items-center gap-1">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {t('author').charAt(0)}
            </span>
            <span className="mt-2 text-sm font-semibold text-foreground">{t('author')}</span>
            <span className="text-xs text-muted-foreground">{t('role')}</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
