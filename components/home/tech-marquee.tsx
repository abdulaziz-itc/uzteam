'use client';

import { useTranslations } from 'next-intl';

const technologies = [
  'SAP', 'Odoo', '1C Enterprise', 'Microsoft Dynamics 365', 'Oracle NetSuite',
  'Salesforce', 'Bitrix24', 'amoCRM', 'Zoho', 'SAP Business One',
  'Telegram API', 'OpenAI', 'PostgreSQL', 'Payme', 'Click',
];

export default function TechMarquee() {
  const t = useTranslations('TechMarquee');

  return (
    <section className="overflow-hidden border-b border-border bg-muted/40 py-10">
      <div className="container mx-auto mb-6 px-4 text-center">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t('heading')}
        </h3>
      </div>

      <div className="group relative flex overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
        <div className="flex animate-marquee items-center whitespace-nowrap py-1">
          {technologies.map((tech, idx) => (
            <span key={idx} className="mx-7 text-lg font-semibold text-muted-foreground/50 md:text-xl">
              {tech}
            </span>
          ))}
        </div>
        <div className="absolute top-0 flex animate-marquee2 items-center whitespace-nowrap py-1">
          {technologies.map((tech, idx) => (
            <span key={`dup-${idx}`} className="mx-7 text-lg font-semibold text-muted-foreground/50 md:text-xl">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
