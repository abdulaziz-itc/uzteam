'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Send, CheckCircle2 } from 'lucide-react';

const inputCls =
  'w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none';

export default function ContactForm() {
  const t = useTranslations('ContactPage');
  const locale = useLocale();
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
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
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center card-shadow">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <p className="max-w-sm text-foreground">{t('form_success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-6 card-shadow md:grid-cols-2 md:p-8">
      <input required type="text" placeholder={t('form_name')} className={inputCls} value={form.name} onChange={set('name')} />
      <input required type="email" placeholder={t('form_email')} className={inputCls} value={form.email} onChange={set('email')} />
      <input type="tel" placeholder={t('form_phone')} className={inputCls} value={form.phone} onChange={set('phone')} />
      <input type="text" placeholder={t('form_company')} className={inputCls} value={form.company} onChange={set('company')} />
      <textarea
        required
        placeholder={t('form_message')}
        rows={5}
        className={`${inputCls} resize-none md:col-span-2`}
        value={form.message}
        onChange={set('message')}
      />
      {status === 'error' && (
        <p className="text-sm text-destructive md:col-span-2">{t('form_error')}</p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 md:col-span-2"
      >
        <Send className="h-4 w-4" />
        {status === 'sending' ? t('form_sending') : t('form_submit')}
      </button>
    </form>
  );
}
