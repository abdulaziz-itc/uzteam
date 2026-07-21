'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Lock, CheckCircle2, Clock } from 'lucide-react';

const INTEGRATION_OPTIONS = [
  'Payment Systems (Stripe, Payme, Click)',
  'Telegram Bot',
  '1C Enterprise',
  'CRM (AmoCRM, Bitrix24)',
  'SMS Providers',
];

const inputCls =
  'w-full rounded-xl border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none';

const primaryBtn =
  'rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50';

const ghostBtn =
  'rounded-xl border border-border bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted';

interface Tier1 { br_summary: string; complexity: string }
interface Tier2 { estimated_days: number }

export default function CalculatorWizard() {
  const locale = useLocale();
  const t = useTranslations('Calculator');

  const [step, setStep] = useState(1);
  const [features, setFeatures] = useState('');
  const [problem, setProblem] = useState('');
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [otherIntegration, setOtherIntegration] = useState('');

  const [tier1Data, setTier1Data] = useState<Tier1 | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const [gateForm, setGateForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [tier2Data, setTier2Data] = useState<Tier2 | null>(null);
  const [isGateLoading, setIsGateLoading] = useState(false);

  const handleIntegrationToggle = (opt: string) => {
    setIntegrations((prev) =>
      prev.includes(opt) ? prev.filter((i) => i !== opt) : [...prev, opt],
    );
  };

  const submitTier1 = async () => {
    if (features.length < 10 || problem.length < 10) return;
    setStep(4);

    try {
      const allIntegrations = [...integrations];
      if (otherIntegration.trim()) allIntegrations.push(otherIntegration.trim());

      const res = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features, problem, integrations: allIntegrations, locale }),
      });

      const data = await res.json();
      if (data.success) {
        setTier1Data(data.tier1);
        setSubmissionId(data.submission_id);
        setStep(5);
      } else {
        alert(data.error || 'Something went wrong.');
        setStep(3);
      }
    } catch {
      alert('Failed to connect.');
      setStep(3);
    }
  };

  const submitGate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateForm.name || !gateForm.email || !submissionId) return;
    setIsGateLoading(true);

    try {
      const res = await fetch('/api/calculator/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: submissionId, ...gateForm }),
      });
      const data = await res.json();
      if (data.success) {
        setTier2Data(data.tier2);
      } else {
        alert(data.error || 'Failed to unlock.');
      }
    } catch {
      alert('Failed to connect.');
    } finally {
      setIsGateLoading(false);
    }
  };

  return (
    <div className="relative mx-auto min-h-[500px] w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card p-6 card-shadow md:p-12">
      {/* Progress bar */}
      {step < 4 && (
        <>
          <div className="absolute left-0 top-0 h-1 w-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <div className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t('step_label', { n: step })}
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex h-full flex-col"
          >
            <h2 className="mb-2 text-2xl font-bold text-foreground">{t('s1_title')}</h2>
            <p className="mb-6 text-muted-foreground">{t('s1_desc')}</p>

            <textarea
              className={`${inputCls} h-40 resize-none`}
              placeholder={t('s1_placeholder')}
              maxLength={500}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />
            <div className="mt-2 text-right text-xs text-muted-foreground">{features.length}/500</div>

            <div className="mt-8 flex justify-end">
              <button onClick={() => setStep(2)} disabled={features.length < 10} className={primaryBtn}>
                {t('next')}
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex h-full flex-col"
          >
            <h2 className="mb-2 text-2xl font-bold text-foreground">{t('s2_title')}</h2>
            <p className="mb-6 text-muted-foreground">{t('s2_desc')}</p>

            <textarea
              className={`${inputCls} h-40 resize-none`}
              placeholder={t('s2_placeholder')}
              maxLength={500}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
            <div className="mt-2 text-right text-xs text-muted-foreground">{problem.length}/500</div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className={ghostBtn}>{t('back')}</button>
              <button onClick={() => setStep(3)} disabled={problem.length < 10} className={primaryBtn}>
                {t('next')}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex h-full flex-col"
          >
            <h2 className="mb-2 text-2xl font-bold text-foreground">{t('s3_title')}</h2>
            <p className="mb-6 text-muted-foreground">{t('s3_desc')}</p>

            <div className="mb-6 flex flex-wrap gap-3">
              {INTEGRATION_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleIntegrationToggle(opt)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    integrations.includes(opt)
                      ? 'border-primary bg-primary/10 font-medium text-primary'
                      : 'border-border bg-background text-muted-foreground hover:border-ring'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder={t('s3_other')}
              className={inputCls}
              value={otherIntegration}
              onChange={(e) => setOtherIntegration(e.target.value)}
            />

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className={ghostBtn}>{t('back')}</button>
              <button onClick={submitTier1} className={primaryBtn}>
                {t('analyze')}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-64 flex-col items-center justify-center"
          >
            <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <h3 className="mb-2 animate-pulse text-xl font-medium text-foreground">
              {t('analyzing_title')}
            </h3>
            <p className="text-sm text-muted-foreground">{t('analyzing_desc')}</p>
          </motion.div>
        )}

        {step === 5 && tier1Data && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">{t('results_title')}</h2>
              <div className="w-fit rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
                {t('complexity')}: <span className="font-semibold text-foreground">{t(`complexity_${tier1Data.complexity.toLowerCase()}` as 'complexity_low')}</span>
              </div>
            </div>

            <div className="mb-8 max-h-[300px] overflow-y-auto rounded-xl border border-border bg-muted/40 p-6">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('br_title')}
              </h3>
              <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: tier1Data.br_summary.replace(/\n/g, '<br/>') }} />
              </div>
            </div>

            {!tier2Data ? (
              <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-6">
                <Lock className="absolute right-6 top-6 h-8 w-8 text-primary/20" />

                <h3 className="mb-2 text-xl font-bold text-foreground">{t('unlock_title')}</h3>
                <p className="mb-6 max-w-lg text-sm text-muted-foreground">{t('unlock_desc')}</p>

                <form onSubmit={submitGate} className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input required type="text" placeholder={t('gate_name')} className={inputCls} value={gateForm.name} onChange={(e) => setGateForm({ ...gateForm, name: e.target.value })} />
                  <input required type="email" placeholder={t('gate_email')} className={inputCls} value={gateForm.email} onChange={(e) => setGateForm({ ...gateForm, email: e.target.value })} />
                  <input type="tel" placeholder={t('gate_phone')} className={inputCls} value={gateForm.phone} onChange={(e) => setGateForm({ ...gateForm, phone: e.target.value })} />
                  <input type="text" placeholder={t('gate_company')} className={inputCls} value={gateForm.company} onChange={(e) => setGateForm({ ...gateForm, company: e.target.value })} />

                  <button type="submit" disabled={isGateLoading} className={`${primaryBtn} md:col-span-2`}>
                    {isGateLoading ? t('unlocking') : t('unlock_btn')}
                  </button>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center"
              >
                <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-500" />
                <h3 className="mb-2 text-xl font-bold text-foreground">{t('t2_title')}</h3>
                <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {t('t2_desc')}
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {t('timeline_label')}: <b>~{Math.max(10, tier2Data.estimated_days)} {t('days')}</b>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
