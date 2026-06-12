import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Section } from '@/components/ui/Section';

const STATS = [
  { value: 50000, suffix: '+', label: 'Patients Managed' },
  { value: 500, suffix: '+', label: 'Clinics Served' },
  { value: 90, suffix: '%', label: 'Reduced Waiting Time' },
  { value: 99.9, suffix: '%', label: 'System Uptime', decimals: 1 },
];

/** Eased count-up that starts when the element scrolls into view. */
function CountUp({ to, suffix, decimals = 0 }: { to: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  const shown = decimals
    ? val.toFixed(decimals)
    : Math.round(val).toLocaleString('en-IN');

  return (
    <span ref={ref} className="tabular-nums">
      {shown}{suffix}
    </span>
  );
}

export function Stats() {
  return (
    <Section className="py-14 md:py-20">
      <div className="relative rounded-[28px] border hairline glass-strong px-6 py-10 sm:px-10 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-500/8 via-accent-500/6 to-token/8" />
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight gradient-text">
                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
