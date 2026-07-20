'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef, useEffect, useState } from 'react';

function Counter({ from, to, suffix }: { from: number; to: number; suffix: string }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (inView) {
      const controls = setInterval(() => {
        setCount((prev) => {
          const step = (to - from) / 30;
          const next = prev + step;
          if (next >= to) {
            clearInterval(controls);
            return to;
          }
          return next;
        });
      }, 40);
      return () => clearInterval(controls);
    }
  }, [inView, from, to]);

  return (
    <span ref={nodeRef}>
      {Number.isInteger(to) ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const t = useTranslations('Stats');

  const stats = [
    { label: t('projects'), value: 120, suffix: '+' },
    { label: t('years'), value: 10, suffix: '+' },
    { label: t('clients'), value: 45, suffix: '' },
    { label: t('uptime'), value: 99.9, suffix: '%' },
  ];

  return (
    <section className="border-y border-border bg-muted/40 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col items-center"
            >
              <div className="mb-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                <Counter from={0} to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-medium text-muted-foreground md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
