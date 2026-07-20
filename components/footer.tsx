import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MapPin, Phone, Mail, Send, Camera, Briefcase } from 'lucide-react';

export default function Footer() {
  const nav = useTranslations('Navigation');
  const t = useTranslations('Footer');

  return (
    <footer className="mt-auto w-full border-t border-border bg-background py-12 md:py-16">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand + contacts */}
        <div>
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              U
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">UzTeam</span>
          </Link>
          <p className="mb-5 max-w-xs text-sm leading-relaxed text-muted-foreground">{t('tagline')}</p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              Tashkent, Uzbekistan
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              +998 90 123 45 67
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              hello@uzteam.com
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
            {t('services')}
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/services" className="text-muted-foreground transition-colors hover:text-primary">{t('erp')}</Link></li>
            <li><Link href="/services" className="text-muted-foreground transition-colors hover:text-primary">{t('crm')}</Link></li>
            <li><Link href="/services" className="text-muted-foreground transition-colors hover:text-primary">{t('ai')}</Link></li>
            <li><Link href="/calculator" className="font-medium text-primary transition-opacity hover:opacity-80">{t('calculator')}</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
            {t('company')}
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className="text-muted-foreground transition-colors hover:text-primary">{nav('about')}</Link></li>
            <li><Link href="/portfolio" className="text-muted-foreground transition-colors hover:text-primary">{nav('portfolio')}</Link></li>
            <li><Link href="/pricing" className="text-muted-foreground transition-colors hover:text-primary">{nav('pricing')}</Link></li>
            <li><Link href="/blog" className="text-muted-foreground transition-colors hover:text-primary">{nav('blog')}</Link></li>
            <li><Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">{nav('contact')}</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
            Follow us
          </h3>
          <div className="flex gap-2.5">
            {[
              { icon: Send, href: 'https://t.me/uzteam', label: 'Telegram' },
              { icon: Camera, href: 'https://instagram.com/uzteam', label: 'Instagram' },
              { icon: Briefcase, href: 'https://linkedin.com/company/uzteam', label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-12 border-t border-border px-4 pt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} UzTeam. {t('rights')}
      </div>
    </footer>
  );
}
