import { setRequestLocale, getTranslations } from 'next-intl/server';
import CalculatorWizard from '@/components/calculator/wizard';

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Calculator');

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

        <CalculatorWizard />
      </div>
    </div>
  );
}
