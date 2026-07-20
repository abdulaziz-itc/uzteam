'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Users, ShoppingCart, TrendingUp, Bell, Search } from 'lucide-react';

const bars = [42, 68, 55, 84, 62, 92, 74, 58, 88, 70, 96, 80];

export default function ProductShot() {
  const t = useTranslations('ProductShot');

  return (
    <section className="bg-background py-20 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('heading')}
          </h2>
          <span className="mx-auto mb-4 block h-1 w-12 rounded-full bg-primary/60" />
          <p className="mx-auto max-w-2xl text-muted-foreground">{t('subheading')}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-border bg-card card-shadow"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-4 py-3">
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </span>
            <span className="flex flex-1 items-center gap-2 rounded-lg bg-background px-3 py-1.5 text-xs text-muted-foreground">
              <Search className="h-3 w-3" />
              app.uzteam.com/dashboard
            </span>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* App body */}
          <div className="flex">
            {/* Sidebar */}
            <div className="hidden w-44 shrink-0 border-r border-border bg-muted/40 p-4 sm:block">
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">U</span>
                <span className="text-xs font-semibold text-foreground">UzTeam ERP</span>
              </div>
              {[
                { icon: LayoutDashboard, label: 'Dashboard', active: true },
                { icon: ShoppingCart, label: 'Buyurtmalar', active: false },
                { icon: Users, label: 'Mijozlar', active: false },
                { icon: TrendingUp, label: 'Hisobotlar', active: false },
              ].map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${
                    active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </div>
              ))}
            </div>

            {/* Main */}
            <div className="flex-1 p-5">
              {/* Stat cards */}
              <div className="mb-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'Bugungi savdo', value: '48.2M', delta: '+12%', color: 'text-emerald-500' },
                  { label: 'Buyurtmalar', value: '312', delta: '+8%', color: 'text-primary' },
                  { label: 'Qarzdorlik', value: '6.4M', delta: '-3%', color: 'text-orange-500' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-background p-3">
                    <div className="mb-1 text-[10px] text-muted-foreground">{s.label}</div>
                    <div className="text-base font-bold text-foreground">{s.value}</div>
                    <div className={`text-[10px] font-medium ${s.color}`}>{s.delta}</div>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Oylik savdo dinamikasi</span>
                  <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">2026</span>
                </div>
                <div className="flex h-28 items-end gap-1.5">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 rounded-t-md ${i === 10 ? 'bg-emerald-400' : 'bg-primary/70'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
