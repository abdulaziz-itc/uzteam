import { setRequestLocale, getTranslations } from 'next-intl/server';
import { asc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { teamMembers } from '@/lib/db/schema';
import { pickL } from '@/lib/locale-field';
import { Target, ShieldCheck, Handshake } from 'lucide-react';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('AboutPage');

  const team = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.isActive, true))
    .orderBy(asc(teamMembers.displayOrder));

  const values = [
    { icon: Target, title: t('v1_title'), desc: t('v1_desc') },
    { icon: ShieldCheck, title: t('v2_title'), desc: t('v2_desc') },
    { icon: Handshake, title: t('v3_title'), desc: t('v3_desc') },
  ];

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

        {/* Mission */}
        <div className="mx-auto mb-14 max-w-3xl rounded-2xl border border-border bg-card p-8 text-center card-shadow md:p-10">
          <h2 className="mb-3 text-xl font-semibold text-foreground">{t('mission_title')}</h2>
          <p className="leading-relaxed text-muted-foreground">{t('mission_desc')}</p>
        </div>

        {/* Values */}
        <div className="mb-20 grid grid-cols-1 gap-5 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-7 card-shadow">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        {team.length > 0 && (
          <>
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
              {t('team_title')}
            </h2>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {team.map((member) => (
                <div key={member.id} className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center card-shadow">
                  {member.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="mb-4 h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {member.name.charAt(0)}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{pickL(member, 'role', locale)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
