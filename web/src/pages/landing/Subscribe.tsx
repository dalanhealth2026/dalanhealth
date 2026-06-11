import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Building2, HeartPulse, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SUBSCRIBE_PLANS, type SubscribePlan } from './featureData';
import { cn } from '@/lib/cn';

/**
 * Subscribe — the two pay-per-visit plans. Clicking "Subscribe" on a card
 * unfolds the complete in-depth feature tree for that plan; clicking again
 * folds it back. Every feature from the product catalog is listed, grouped
 * exactly as in the spec (emoji section → subgroups → items).
 */
export function Subscribe() {
  const [openPlan, setOpenPlan] = useState<string | null>(null);

  return (
    <Section
      id="subscribe"
      eyebrow="Subscribe"
      title={<>Two plans. <span className="gradient-text">Per visit, nothing more.</span></>}
      description="Tap Subscribe to explore everything included — tap again to fold it back."
    >
      <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-start">
        {SUBSCRIBE_PLANS.map((plan, i) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            featured={i === 0}
            open={openPlan === plan.id}
            onToggle={() => setOpenPlan(openPlan === plan.id ? null : plan.id)}
          />
        ))}
      </div>
    </Section>
  );
}

function PlanCard({ plan, featured, open, onToggle }: {
  plan: SubscribePlan;
  featured?: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const featureCount = plan.groups.reduce(
    (n, g) => n + g.subgroups.reduce((m, s) => m + s.items.length, 0),
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className={cn(
        'relative rounded-3xl border backdrop-blur-xl overflow-hidden transition-shadow',
        featured
          ? 'border-brand-500/40 bg-gradient-to-br from-brand-500/10 to-accent-500/10 shadow-glow'
          : 'hairline bg-white/70 dark:bg-ink-900/70',
      )}
    >
      {featured && (
        <div className="absolute top-4 right-4">
          <Badge tone="brand" size="sm">Most popular</Badge>
        </div>
      )}

      {/* Plan header */}
      <div className="p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <span className={cn(
            'inline-flex h-12 w-12 items-center justify-center rounded-2xl',
            featured
              ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300'
              : 'bg-token/15 text-token',
          )}>
            {plan.id === 'clinic' ? <Building2 size={22} /> : <HeartPulse size={22} />}
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">For</div>
            <div className="text-lg font-semibold text-ink-900 dark:text-ink-50">{plan.audience}</div>
          </div>
        </div>

        <div className="mt-6 flex items-baseline gap-1.5">
          <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
            {plan.price}
          </span>
          <span className="text-base text-muted">{plan.period}</span>
        </div>
        <p className="mt-2 text-sm text-muted">{plan.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-500/10 text-success-600 dark:text-success-500 px-3 py-1 font-semibold">
            <Check size={12} /> {featureCount}+ features included
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 dark:bg-ink-800 text-muted px-3 py-1 font-semibold">
            No fixed cost
          </span>
        </div>

        {/* Subscribe toggle — expands / collapses the full feature tree */}
        <div className="mt-7 flex gap-2">
          <Button
            size="lg"
            fullWidth
            variant={featured ? 'primary' : 'outline'}
            onClick={onToggle}
            rightIcon={
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} className="inline-flex">
                <ChevronDown size={16} />
              </motion.span>
            }
          >
            {open ? 'Hide plan details' : 'Subscribe'}
          </Button>
        </div>
      </div>

      {/* Deep feature tree — unfolds on Subscribe, folds on second click */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t hairline px-7 sm:px-8 py-6 space-y-6 bg-white/50 dark:bg-ink-950/30">
              {plan.groups.map((group, gi) => (
                <motion.div
                  key={group.title + gi}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(gi * 0.03, 0.3) }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none" aria-hidden>{group.emoji}</span>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-ink-50">
                      {group.title}
                    </h4>
                  </div>
                  <div className="mt-3 space-y-3">
                    {group.subgroups.map((sub, si) => (
                      <div key={(sub.name ?? '') + si}>
                        {sub.name && (
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1.5">
                            {sub.name}
                          </div>
                        )}
                        <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                          {sub.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                              <Check size={13} className="mt-0.5 shrink-0 text-success-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* CTA at the bottom of the expanded tree */}
              <div className="pt-2">
                <Link to="/signup">
                  <Button size="lg" fullWidth rightIcon={<ArrowRight size={16} />}>
                    Get started — {plan.price}{plan.period}
                  </Button>
                </Link>
                <p className="mt-2 text-center text-[11px] text-muted">
                  No setup fee • No monthly fee • No annual contract
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
