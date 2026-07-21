'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MessageSquarePlus, CheckCircle2 } from 'lucide-react';

const inputCls =
  'w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none';

export default function TestimonialForm() {
  const t = useTranslations('Testimonial');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', position: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center card-shadow">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <p className="text-sm text-foreground">{t('form_success')}</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted card-shadow"
      >
        <MessageSquarePlus className="h-4 w-4 text-primary" />
        {t('leave_btn')}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid w-full max-w-xl grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-6 text-left card-shadow sm:grid-cols-2"
    >
      <input required type="text" placeholder={t('form_name')} className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input type="text" placeholder={t('form_position')} className={inputCls} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
      <textarea
        required
        minLength={10}
        rows={4}
        placeholder={t('form_message')}
        className={`${inputCls} resize-none sm:col-span-2`}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      {status === 'error' && (
        <p className="text-sm text-destructive sm:col-span-2">{t('form_error')}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 sm:col-span-2"
      >
        {status === 'sending' ? t('form_sending') : t('form_submit')}
      </button>
    </form>
  );
}
