'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ProcessTimeline() {
  const t = useTranslations('Process');

  const processSteps = [
    { num: '01', title: t('s1_title'), desc: t('s1_desc') },
    { num: '02', title: t('s2_title'), desc: t('s2_desc') },
    { num: '03', title: t('s3_title'), desc: t('s3_desc') },
    { num: '04', title: t('s4_title'), desc: t('s4_desc') },
    { num: '05', title: t('s5_title'), desc: t('s5_desc') },
  ];

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('heading')}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            {t('subheading')}
          </p>
        </div>

        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-border md:block" />

          <div className="space-y-6 md:space-y-0">
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className={`relative flex flex-col items-center justify-between md:flex-row ${
                  idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Connector dot */}
                <div className="absolute left-1/2 top-1/2 z-10 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background md:flex" />

                <div className="group relative w-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30 card-shadow md:w-[45%]">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {step.num}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>

                <div className="hidden w-[45%] md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
