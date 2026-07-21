import { getTranslations } from 'next-intl/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { testimonials } from '@/lib/db/schema';
import { Quote } from 'lucide-react';
import TestimonialForm from './testimonial-form';

// Server component: renders only admin-approved testimonials + a submit form.
export default async function Testimonial() {
  const t = await getTranslations('Testimonial');

  const approved = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isApproved, true))
    .orderBy(desc(testimonials.createdAt))
    .limit(6);

  return (
    <section className="bg-background py-20 md:py-24">
      <div className="container mx-auto max-w-5xl px-4 text-center">
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
          {t('heading')}
        </h2>
        <span className="mx-auto mb-10 block h-1 w-12 rounded-full bg-primary/60" />

        {approved.length === 0 ? (
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">{t('empty')}</p>
        ) : (
          <div className="mb-12 grid grid-cols-1 gap-5 text-left md:grid-cols-2 lg:grid-cols-3">
            {approved.map((item) => (
              <figure
                key={item.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 card-shadow"
              >
                <Quote className="mb-4 h-6 w-6 text-primary/40" />
                <blockquote className="mb-5 flex-1 text-sm leading-relaxed text-foreground">
                  “{item.message}”
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{item.name}</div>
                    {item.position && (
                      <div className="text-xs text-muted-foreground">{item.position}</div>
                    )}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <TestimonialForm />
      </div>
    </section>
  );
}
