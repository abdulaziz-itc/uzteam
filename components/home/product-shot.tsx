'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard, Users, ShoppingCart, TrendingUp, Bell, Search,
  ArrowUpRight, ArrowDownRight, Circle,
} from 'lucide-react';

// ─── Demo data ────────────────────────────────────────────────
const CLIENT_NAMES = [
  'Anhor Trade', 'Samarqand Agro', 'Buxoro Textile', 'Chust Foods',
  'Navoi Logistics', 'Zarafshon Retail', 'Oqtepa Market', 'Fergana Plast',
];

const ORDER_STATUSES = [
  { key: 'new', label: 'Yangi', cls: 'bg-primary/10 text-primary' },
  { key: 'paid', label: "To'landi", cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { key: 'shipped', label: 'Yuborildi', cls: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number]['key'];
interface Order { id: number; client: string; amount: number; status: OrderStatus }

const INITIAL_BARS = [42, 68, 55, 84, 62, 92, 74, 58, 88, 70, 96, 80];
const INITIAL_ORDERS: Order[] = [
  { id: 1043, client: 'Anhor Trade', amount: 4.8, status: 'shipped' },
  { id: 1044, client: 'Samarqand Agro', amount: 12.4, status: 'paid' },
  { id: 1045, client: 'Buxoro Textile', amount: 7.1, status: 'paid' },
  { id: 1046, client: 'Chust Foods', amount: 2.9, status: 'new' },
];

const rnd = (min: number, max: number) => min + Math.random() * (max - min);

// Pops softly whenever the value changes.
function LiveNumber({ value, className }: { value: string; className?: string }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className={`inline-block ${className ?? ''}`}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export default function ProductShot() {
  const t = useTranslations('ProductShot');

  const [tab, setTab] = useState<'dashboard' | 'orders' | 'clients' | 'reports'>('dashboard');
  const [bars, setBars] = useState(INITIAL_BARS);
  const [sales, setSales] = useState(48.2);
  const [orderCount, setOrderCount] = useState(312);
  const [debt, setDebt] = useState(6.4);
  const [orderState, setOrderState] = useState<{ nextId: number; list: Order[] }>({
    nextId: 1047,
    list: INITIAL_ORDERS,
  });
  const [online, setOnline] = useState([true, true, false, true, false, true]);
  const [progress, setProgress] = useState([72, 48, 91]);
  const [hasAlert, setHasAlert] = useState(false);

  const tick = useCallback(() => {
    setBars((prev) => prev.map((b) => Math.round(Math.min(96, Math.max(25, b + rnd(-14, 14))))));
    setSales((s) => +(s + rnd(0.1, 0.9)).toFixed(1));
    setDebt((d) => +Math.max(1, d + rnd(-0.4, 0.3)).toFixed(1));
    setProgress((p) => p.map((v) => Math.round(Math.min(98, Math.max(20, v + rnd(-9, 9))))));
    setOnline((prev) => prev.map((o) => (Math.random() < 0.25 ? !o : o)));
    setHasAlert((a) => (Math.random() < 0.35 ? !a : a));

    // Sometimes a new order arrives; sometimes a status advances.
    // Randomness is computed OUTSIDE the updaters so they stay pure.
    if (Math.random() < 0.55) {
      const client = CLIENT_NAMES[Math.floor(Math.random() * CLIENT_NAMES.length)];
      const amount = +rnd(1.5, 18).toFixed(1);
      setOrderCount((c) => c + 1);
      setOrderState(({ nextId, list }) => ({
        nextId: nextId + 1,
        list: [{ id: nextId, client, amount, status: 'new' as const }, ...list].slice(0, 4),
      }));
    } else {
      const rolls = [Math.random(), Math.random(), Math.random(), Math.random()];
      setOrderState(({ nextId, list }) => ({
        nextId,
        list: list.map((o, i) =>
          o.status === 'new' && rolls[i] < 0.5
            ? { ...o, status: 'paid' as const }
            : o.status === 'paid' && rolls[i] < 0.3
              ? { ...o, status: 'shipped' as const }
              : o,
        ),
      }));
    }
  }, []);

  useEffect(() => {
    const iv = setInterval(tick, 3000);
    return () => clearInterval(iv);
  }, [tick]);

  const navItems = [
    { key: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'orders' as const, icon: ShoppingCart, label: 'Buyurtmalar' },
    { key: 'clients' as const, icon: Users, label: 'Mijozlar' },
    { key: 'reports' as const, icon: TrendingUp, label: 'Hisobotlar' },
  ];

  const stats = [
    { label: 'Bugungi savdo', value: `${sales.toFixed(1)}M`, delta: '+12%', up: true, color: 'text-emerald-500' },
    { label: 'Buyurtmalar', value: String(orderCount), delta: '+8%', up: true, color: 'text-primary' },
    { label: 'Qarzdorlik', value: `${debt.toFixed(1)}M`, delta: '-3%', up: false, color: 'text-orange-500' },
  ];

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
              app.uzteam.com/{tab === 'dashboard' ? 'dashboard' : tab}
            </span>
            <span className="relative">
              <Bell className="h-4 w-4 text-muted-foreground" />
              {hasAlert && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500"
                />
              )}
            </span>
          </div>

          {/* App body */}
          <div className="relative flex min-h-[330px]">
            {/* Sidebar */}
            <div className="hidden w-44 shrink-0 border-r border-border bg-muted/40 p-4 sm:block">
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">U</span>
                <span className="text-xs font-semibold text-foreground">UzTeam ERP</span>
              </div>
              {navItems.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                    tab === key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Mobile tab bar */}
            <div className="absolute z-10 flex w-full gap-1 border-b border-border bg-card p-2 sm:hidden">
              {navItems.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex flex-1 items-center justify-center rounded-lg py-2 ${
                    tab === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Main pane */}
            <div className="flex-1 p-5 pt-16 sm:pt-5">
              <AnimatePresence mode="wait">
                {tab === 'dashboard' && (
                  <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    <div className="mb-5 grid grid-cols-3 gap-3">
                      {stats.map((s) => (
                        <div key={s.label} className="rounded-xl border border-border bg-background p-3">
                          <div className="mb-1 text-[10px] text-muted-foreground">{s.label}</div>
                          <div className="text-base font-bold text-foreground">
                            <LiveNumber value={s.value} />
                          </div>
                          <div className={`flex items-center gap-0.5 text-[10px] font-medium ${s.color}`}>
                            {s.up ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                            {s.delta}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">Oylik savdo dinamikasi</span>
                        <span className="flex items-center gap-1.5 rounded-md bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">
                          <Circle className="h-1.5 w-1.5 animate-pulse fill-emerald-500 text-emerald-500" />
                          jonli
                        </span>
                      </div>
                      <div className="flex h-28 items-end gap-1.5">
                        {bars.map((h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className={`flex-1 rounded-t-md transition-all duration-700 ease-in-out ${
                              h === Math.max(...bars) ? 'bg-emerald-400' : 'bg-primary/70'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {tab === 'orders' && (
                  <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    <div className="mb-3 text-xs font-semibold text-foreground">So&apos;nggi buyurtmalar</div>
                    <div className="space-y-2">
                      <AnimatePresence initial={false}>
                        {orderState.list.map((o) => {
                          const st = ORDER_STATUSES.find((s) => s.key === o.status)!;
                          return (
                            <motion.div
                              key={o.id}
                              layout
                              initial={{ opacity: 0, x: -16 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-muted-foreground">#{o.id}</span>
                                <span className="text-xs font-medium text-foreground">{o.client}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-foreground">{o.amount}M</span>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${st.cls}`}>
                                  {st.label}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {tab === 'clients' && (
                  <motion.div key="clients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    <div className="mb-3 text-xs font-semibold text-foreground">Faol mijozlar</div>
                    <div className="grid grid-cols-2 gap-2">
                      {CLIENT_NAMES.slice(0, 6).map((name, i) => (
                        <div key={name} className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5">
                          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                            {name.charAt(0)}
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background transition-colors duration-500 ${
                                online[i] ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                              }`}
                            />
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-xs font-medium text-foreground">{name}</div>
                            <div className="text-[10px] text-muted-foreground">{online[i] ? 'onlayn' : 'oflayn'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {tab === 'reports' && (
                  <motion.div key="reports" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                    <div className="mb-3 text-xs font-semibold text-foreground">Oylik reja bajarilishi</div>
                    <div className="space-y-4">
                      {[
                        { label: 'Savdo rejasi', color: 'bg-primary' },
                        { label: 'Yig\'im rejasi', color: 'bg-emerald-500' },
                        { label: 'Yetkazib berish', color: 'bg-orange-500' },
                      ].map((r, i) => (
                        <div key={r.label} className="rounded-xl border border-border bg-background p-3">
                          <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground">{r.label}</span>
                            <span className="font-semibold text-foreground">
                              <LiveNumber value={`${progress[i]}%`} />
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              style={{ width: `${progress[i]}%` }}
                              className={`h-full rounded-full transition-all duration-700 ease-in-out ${r.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
