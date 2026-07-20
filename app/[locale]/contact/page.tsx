import { setRequestLocale, getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { pickL } from '@/lib/locale-field';
import ContactForm from '@/components/contact-form';
import { MapPin, Phone, Mail } from 'lucide-react';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ContactPage');

  const [info] = await db.select().from(settings).limit(1);

  const contacts = info
    ? [
        { icon: MapPin, label: t('info_address'), value: pickL(info, 'address', locale) },
        { icon: Phone, label: t('info_phone'), value: info.phone ?? '' },
        { icon: Mail, label: t('info_email'), value: info.email ?? '' },
      ].filter((c) => c.value)
    : [];

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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          <ContactForm />

          {contacts.length > 0 && (
            <aside className="h-fit rounded-2xl border border-border bg-card p-6 card-shadow md:p-8">
              <h2 className="mb-6 text-lg font-semibold text-foreground">{t('info_title')}</h2>
              <ul className="space-y-5">
                {contacts.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </span>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {label}
                      </div>
                      <div className="text-sm text-foreground">{value}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
