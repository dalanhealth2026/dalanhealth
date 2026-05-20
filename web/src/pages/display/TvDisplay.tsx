import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartLeafMark } from '@/components/ui/Logo';
import { SourceBadge } from '@/components/ui/SourceBadge';
import { useQueue } from '@/store/queue';
import { demoQueue, demoClinic } from '@/services/demoData';

/**
 * TV / kiosk display for the clinic waiting room.
 *
 * Designed to be opened in a separate browser tab/window and projected
 * on a TV. Auto-cycles the running token, shows up-next patients, and
 * renders huge numerals for legibility from across the room.
 */
export function TvDisplay() {
  const { entries, setEntries } = useQueue();
  const [now, setNow] = useState(new Date());

  // Seed the demo queue if nothing has been loaded yet.
  useEffect(() => {
    if (entries.length === 0) setEntries(demoQueue);
  }, [entries.length, setEntries]);

  // Tick the clock every second.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Force the TV view into dark mode for in-room legibility.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.classList.contains('dark');
    root.classList.add('dark');
    return () => { if (!prev) root.classList.remove('dark'); };
  }, []);

  const current = entries[0];
  const upNext = entries.slice(1, 6);

  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-navy-950 text-white relative overflow-hidden">
      {/* Decorative gradient backdrop */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full bg-token/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[640px] w-[640px] rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-10" />

      {/* Header */}
      <header className="relative z-10 px-10 lg:px-14 py-7 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <HeartLeafMark size={56} />
          <div>
            <div className="text-3xl font-extrabold tracking-tight font-brand">{demoClinic.name}</div>
            <div className="text-sm text-white/60">{demoClinic.doctor} · {demoClinic.specialization} · {demoClinic.city}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-5xl font-extrabold tabular-nums leading-none font-brand">{time}</div>
          <div className="mt-1 text-sm text-white/60">{date}</div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 px-10 lg:px-14 py-10 grid lg:grid-cols-[1.6fr_1fr] gap-10">
        {/* Now serving */}
        <section className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-10 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-token/10 via-transparent to-brand-500/10" />
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.32em] text-token font-semibold">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 inline-flex h-full w-full rounded-full bg-token opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-token" />
            </span>
            Now serving
          </div>

          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.token}
                initial={{ scale: 0.7, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.15, opacity: 0, y: -16 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="mt-8"
              >
                <div className="text-[12rem] lg:text-[16rem] font-extrabold leading-none tracking-tight text-token drop-shadow-[0_0_60px_rgba(34,197,94,0.55)] font-brand">
                  #{current.token}
                </div>
                <div className="mt-6 text-4xl lg:text-5xl font-bold text-white">{current.patientName}</div>
                <div className="mt-4 flex items-center justify-center gap-3 text-white/70 text-lg">
                  <SourceBadge source={current.source} />
                  <span>Joined {current.joinedAt}</span>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-token/15 px-5 py-2 text-token font-semibold uppercase tracking-wider text-sm">
                  Please proceed to the consultation room
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-white/40 text-3xl">
                Waiting for the next patient…
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Up next */}
        <section className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-8">
          <div className="text-xs uppercase tracking-[0.32em] text-brand-300 font-semibold">Up next</div>

          <div className="mt-6 space-y-3">
            <AnimatePresence initial={false}>
              {upNext.map((e, idx) => (
                <motion.div
                  key={e.id}
                  layout
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  className={`flex items-center gap-5 rounded-2xl border border-white/10 p-5 ${
                    idx === 0 ? 'bg-brand-500/15' : 'bg-white/[0.02]'
                  }`}
                >
                  <div className={`w-24 text-center text-5xl font-extrabold tabular-nums leading-none font-brand ${
                    idx === 0 ? 'text-brand-300' : 'text-white/70'
                  }`}>
                    #{e.token}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-semibold text-white truncate">{e.patientName}</div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-white/60">
                      <SourceBadge source={e.source} />
                      <span>Joined {e.joinedAt}</span>
                    </div>
                  </div>
                  {idx === 0 && (
                    <div className="text-xs uppercase tracking-wider text-brand-300 font-semibold">Get ready</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {upNext.length === 0 && (
              <div className="text-white/50 text-lg text-center py-10">No further patients in queue.</div>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-xs uppercase tracking-wider text-white/60">Doctor sitting</div>
            <div className="mt-1 text-2xl font-bold">{demoClinic.timing}</div>
          </div>
        </section>
      </main>

      {/* Ticker / footer */}
      <footer className="relative z-10 mt-2 border-t border-white/10 bg-black/30 backdrop-blur">
        <div className="px-10 lg:px-14 py-4 flex items-center justify-between text-sm text-white/60">
          <span>Powered by <span className="font-brand font-bold text-white tracking-[0.18em]">DALAN HEALTH</span></span>
          <span>{entries.length} patient{entries.length === 1 ? '' : 's'} in today's queue</span>
        </div>
      </footer>
    </div>
  );
}
