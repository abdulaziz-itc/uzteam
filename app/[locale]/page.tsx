import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Hero from '@/components/home/hero';
import FeatureTrio from '@/components/home/feature-trio';
import ServicesOverview from '@/components/home/services-overview';
import ProductShot from '@/components/home/product-shot';
import Stats from '@/components/home/stats';
import PricingPreview from '@/components/home/pricing-preview';
import ProcessTimeline from '@/components/home/process-timeline';
import Testimonial from '@/components/home/testimonial';
import TechMarquee from '@/components/home/tech-marquee';
import CTABand from '@/components/home/cta-band';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Hero />
      <FeatureTrio />
      <ServicesOverview />
      <ProductShot />
      <Stats />
      <PricingPreview />
      <ProcessTimeline />
      <Testimonial />
      <TechMarquee />
      <CTABand />
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}
