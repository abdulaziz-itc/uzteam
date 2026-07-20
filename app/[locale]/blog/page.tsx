import { setRequestLocale, getTranslations } from 'next-intl/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { pickL } from '@/lib/locale-field';
import { Newspaper } from 'lucide-react';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('BlogPage');

  const items = await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt));

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

        {items.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-2xl border border-border bg-card p-10 text-center card-shadow">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Newspaper className="h-7 w-7 text-muted-foreground" />
            </span>
            <p className="text-muted-foreground">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 card-shadow"
              >
                {post.category && (
                  <span className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    {post.category}
                  </span>
                )}
                <h2 className="mb-2 text-lg font-semibold leading-snug text-foreground">
                  {pickL(post, 'title', locale)}
                </h2>
                <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {pickL(post, 'excerpt', locale)}
                </p>
                {post.publishedAt && (
                  <time className="mt-auto text-xs text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString(locale)}
                  </time>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
