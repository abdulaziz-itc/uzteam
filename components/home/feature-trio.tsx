'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ClipboardList, Code2, LifeBuoy } from 'lucide-react';

export default function FeatureTrio() {
  const t = useTranslations('FeatureTrio');

  const items = [
    {
      icon: ClipboardList,
      title: t('t1_title'),
      desc: t('t1_desc'),
      chip: 'bg-orange-500/10 text-orange-500',
    },
    {
      icon: Code2,
      title: t('t2_title'),
      desc: t('t2_desc'),
      chip: 'bg-primary/10 text-primary',
    },
    {
      icon: LifeBuoy,
      title: t('t3_title'),
      desc: t('t3_desc'),
      chip: 'bg-emerald-500/10 text-emerald-500',
    },
  ];

  return (
    <section className="bg-background py-20 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('heading')}
          </h2>
          <span className="mx-auto mb-4 block h-1 w-12 rounded-full bg-primary/60" />
          <p className="mx-auto max-w-2xl text-muted-foreground">{t('subheading')}</p>
        </div>

        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc, chip }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex flex-col items-center"
            >
              <span className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${chip}`}>
                <Icon className="h-8 w-8" />
              </span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
