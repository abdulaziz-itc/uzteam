'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import HeroIllustration from './hero-illustration';

export default function Hero() {
  const t = useTranslations('Index');
  const h = useTranslations('Hero');
  const locale = useLocale();

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.split('@')[0],
          email,
          message: 'Hero email signup',
          locale,
        }),
      });
      setStatus('success');
    } catch {
      setStatus('idle');
    }
  };

  return (
    <section className="relative overflow-hidden bg-accent/60">
      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 pt-20 text-center md:pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 max-w-3xl text-3xl font-bold leading-[1.15] tracking-tight text-foreground md:text-5xl"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {t('description')}
        </motion.p>

        {/* Email capture pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="w-full max-w-xl"
        >
          {status === 'success' ? (
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-card px-6 py-3.5 text-sm font-medium text-foreground card-shadow">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              {h('email_success')}
            </div>
          ) : (
            <form
              onSubmit={submitEmail}
              className="flex flex-col gap-2 rounded-2xl bg-card p-2 card-shadow sm:flex-row sm:rounded-full"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={h('email_placeholder')}
                className="min-w-0 flex-1 rounded-xl bg-transparent px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:rounded-full"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:rounded-full"
              >
                {h('email_cta')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          )}

          <div className="mt-3 text-sm text-muted-foreground">
            {h('or')}{' '}
            <Link href="/calculator" className="font-medium text-primary hover:underline">
              {h('secondary_cta')}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="container mx-auto flex justify-center px-4"
      >
        <HeroIllustration />
      </motion.div>
    </section>
  );
}
