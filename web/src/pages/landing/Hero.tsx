import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, Sparkles, Check, Wallet, IndianRupee, BellRing, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const TRUST_TICKS = ['QR Token Booking', 'Walk-In Patients', 'Online Appointments', 'TV Queue Display'];

// Deterministic particle field (no Math.random at render → stable rerenders).
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3 + 4) % 96}%`,
  top: `${58 + ((i * 13) % 38)}%`,
  size: 3 + (i % 3) * 2,
  dur: `${7 + (i % 5) * 2}s`,
  delay: `${(i % 7) * 1.2}s`,
  drift: `${((i % 3) - 1) * 28}px`,
  tone: i % 3 === 0 ? 'bg-token/50' : i % 3 === 1 ? 'bg-brand-500/50' : 'bg-accent-500/45',
}));

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* Drifting gradient + grid backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-50" />
      <div className="gradient-drift pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-brand-500/20 blur-3xl -z-10" />
      <div className="gradient-drift pointer-events-none absolute top-40 -right-24 h-[420px] w-[420px] rounded-full bg-accent-500/20 blur-3xl -z-10" style={{ animationDelay: '-6s' }} />
      <div className="gradient-drift pointer-events-none absolute bottom-0 -left-24 h-[380px] w-[380px] rounded-full bg-token/15 blur-3xl -z-10" style={{ animationDelay: '-12s' }} />

      {/* Floating glow particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className={`particle ${p.tone}`}
          style={{
            left: p.left, top: p.top, width: p.size, height: p.size,
            ['--dur' as string]: p.dur, ['--delay' as string]: p.delay, ['--drift' as string]: p.drift,
          }}
        />
      ))}

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 md:pt-20 pb-20 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Badge tone="brand" icon={<Sparkles size={11} />}>Trusted by Modern Clinics Across India</Badge>
          </motion.div>

          {/* Staggered headline */}
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-ink-900 dark:text-ink-50">
            <motion.span initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="block">
              Eliminate Waiting Lines.
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="block gradient-text">
              Modernize Your Clinic.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
            className="mt-6 max-w-xl text-base sm:text-lg text-muted"
          >
            Transform your clinic with Smart Queue Management, Digital OPD, QR Token Booking,
            and Real-Time Patient Tracking.
          </motion.p>

          {/* Pricing highlight */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
            className="mt-6 inline-flex flex-col gap-1 rounded-2xl border border-token/30 bg-token/5 px-5 py-3"
          >
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
              ₹9 <span className="text-sm font-semibold text-ink-600 dark:text-ink-300">+ GST</span>
              <span className="text-sm font-medium text-muted"> per completed patient</span>
            </span>
            <span className="text-[11px] text-muted">No Setup Fee • No Monthly Fee • No Annual Contract</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <Link to="/signup"><Button size="lg" rightIcon={<ArrowRight size={16} />}>Book Free Demo</Button></Link>
            <Link to="/demo">
              <Button size="lg" variant="outline" leftIcon={<PlayCircle size={16} />}>Watch Live Queue Demo</Button>
            </Link>
          </motion.div>

          {/* Trust ticks */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted"
          >
            {TRUST_TICKS.map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-success-500/15 text-success-600 dark:text-success-500">
                  <Check size={10} />
                </span>
                {t}
              </div>
            ))}
          </motion.div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

/** Animated doctor-dashboard mockup with mouse parallax + floating cards. */
function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 14,
      y: ((e.clientY - r.top) / r.height - 0.5) * -10,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative h-[540px] hidden sm:block"
      style={{ perspective: 1200 }}
      aria-hidden
    >
      <motion.div
        animate={{ rotateY: tilt.x, rotateX: tilt.y }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="absolute inset-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Main doctor dashboard card */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-0 top-6 w-[86%] glass-strong rounded-3xl p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted">Doctor Dashboard</div>
              <div className="mt-1 text-lg font-semibold text-ink-900 dark:text-ink-50">Sharma ENT Clinic</div>
            </div>
            <Badge tone="success" pulse>Queue LIVE</Badge>
          </div>

          {/* Current token spotlight */}
          <div className="mt-4 rounded-2xl border hairline bg-gradient-to-br from-token/10 via-transparent to-brand-500/10 p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted">Current Token</div>
              <div className="text-4xl font-extrabold tracking-tight text-token">#12</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted">Patients Waiting</div>
              <div className="text-3xl font-bold text-ink-900 dark:text-ink-50 inline-flex items-center gap-1.5">
                <Users size={18} className="text-brand-500" /> 8
              </div>
            </div>
          </div>

          {/* Wallet + revenue */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border hairline bg-white/60 dark:bg-ink-900/60 p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted"><Wallet size={11} /> Wallet Balance</div>
              <div className="mt-1 text-xl font-bold text-ink-900 dark:text-ink-50">₹2,340</div>
            </div>
            <div className="rounded-xl border hairline bg-white/60 dark:bg-ink-900/60 p-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted"><IndianRupee size={11} /> Revenue Today</div>
              <div className="mt-1 text-xl font-bold text-success-600 dark:text-success-500">₹3,780</div>
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="mt-3 flex items-end gap-1.5 h-14 px-1">
            {[35, 55, 40, 70, 52, 85, 64, 92, 75, 58, 80, 66].map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.5 + i * 0.05, type: 'spring', stiffness: 160, damping: 18 }}
                className="flex-1 rounded-t bg-gradient-to-t from-brand-500/60 to-accent-500/60"
              />
            ))}
          </div>
        </motion.div>

        {/* Floating notification card */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute right-0 top-0 w-[240px] glass-strong rounded-2xl p-4 shadow-xl"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted">
            <BellRing size={12} className="text-brand-500" /> Token Called
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-token/15 text-token font-bold">
              <span className="absolute inset-0 rounded-xl bg-token/25 animate-ping" />
              <span className="relative">12</span>
            </span>
            <div>
              <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">Raj Verma</div>
              <div className="text-[11px] text-muted">Please proceed to room 2</div>
            </div>
          </div>
        </motion.div>

        {/* Floating patient-app card */}
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-4 bottom-4 w-[250px] glass-strong rounded-[24px] p-4 shadow-2xl"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 p-4 text-white">
            <div className="text-[10px] uppercase tracking-wider opacity-90">Your Token</div>
            <div className="mt-1 text-3xl font-bold">#18</div>
            <div className="mt-2 text-[11px] opacity-90">Now serving <span className="font-semibold">#12</span> · ~18 min</div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted px-1">
            <span>Patients ahead</span>
            <span className="font-bold text-ink-900 dark:text-ink-50">6</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
