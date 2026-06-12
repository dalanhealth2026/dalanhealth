import { motion } from 'framer-motion';
import { Check, ExternalLink, Maximize2, MonitorPlay, Volume2 } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

const TV_FEATURES = [
  'Large Token Display',
  'Upcoming Patients',
  'Doctor Information',
  'Voice Announcement Ready',
  'Fullscreen Mode',
];

/** Waiting-room TV preview — a miniature of the real /display/clinic screen. */
export function TvDisplaySection() {
  return (
    <Section
      id="tv-display"
      eyebrow="TV Display System"
      title={<>Your waiting room gets a <span className="gradient-text">voice and a screen.</span></>}
      description="Plug any TV into the live queue. Patients see exactly where they stand — and hear their name called in Hindi or English."
    >
      <div className="grid lg:grid-cols-5 gap-10 items-center max-w-6xl mx-auto">
        {/* TV mock */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="relative mx-auto max-w-xl">
            {/* Bezel */}
            <div className="rounded-2xl bg-ink-900 dark:bg-black p-2.5 shadow-2xl">
              <div className="rounded-xl overflow-hidden bg-navy-950 aspect-video relative">
                {/* Screen content */}
                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col text-white">
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-white/60">
                    <span className="font-semibold text-white/90">Sharma ENT Clinic</span>
                    <span>Dr. Anil Sharma · ENT Specialist</span>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3 mt-3">
                    <div className="rounded-lg bg-white/[0.05] border border-white/10 flex flex-col items-center justify-center">
                      <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-token flex items-center gap-1">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-token animate-pulse" /> Now Serving
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ duration: 2.4, repeat: Infinity }}
                        className="text-4xl sm:text-5xl font-extrabold text-token"
                      >
                        #12
                      </motion.div>
                      <div className="text-[10px] sm:text-xs font-semibold">Raj Verma</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.05] border border-white/10 p-2 sm:p-2.5 space-y-1.5">
                      <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-brand-300">Up Next</div>
                      {[13, 14, 15].map((t, i) => (
                        <div key={t} className={`flex items-center justify-between rounded-md px-2 py-1 text-[9px] sm:text-[10px] ${i === 0 ? 'bg-brand-500/20 text-white' : 'bg-white/[0.04] text-white/70'}`}>
                          <span className="font-bold">#{t}</span>
                          <span>{['Pooja S.', 'Saurabh S.', 'Anjali D.'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[8px] sm:text-[9px] text-white/45">
                    <span className="inline-flex items-center gap-1"><Volume2 size={9} /> Voice announcements ON</span>
                    <span className="inline-flex items-center gap-1"><Maximize2 size={9} /> Fullscreen</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Stand */}
            <div className="mx-auto h-5 w-24 bg-gradient-to-b from-ink-700 to-ink-900 dark:from-ink-800 dark:to-black rounded-b-xl" />
            <div className="mx-auto h-1.5 w-44 bg-ink-900 dark:bg-black rounded-full" />
            {/* Glow under the TV */}
            <div aria-hidden className="pointer-events-none absolute -inset-8 -z-10 bg-gradient-to-b from-brand-500/10 via-token/10 to-transparent blur-2xl" />
          </div>
        </motion.div>

        {/* Feature list + CTA */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-500/15 text-accent-600 dark:text-accent-300">
            <MonitorPlay size={22} />
          </div>
          <ul className="mt-6 space-y-3">
            {TV_FEATURES.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 text-base text-ink-800 dark:text-ink-100"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success-500/15 text-success-600 dark:text-success-500">
                  <Check size={13} />
                </span>
                {f}
              </motion.li>
            ))}
          </ul>
          <div className="mt-8">
            <a href="/display/clinic" target="_blank" rel="noreferrer">
              <Button size="lg" rightIcon={<ExternalLink size={15} />}>View Live Demo</Button>
            </a>
            <p className="mt-2 text-xs text-muted">Opens the real TV display — the same screen your waiting room gets.</p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
