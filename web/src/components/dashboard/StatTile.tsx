import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkline } from '@/components/ui/Sparkline';
import { cn } from '@/lib/cn';

interface Props {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  sparkline?: number[];
  accent?: 'brand' | 'accent' | 'teal' | 'success' | 'warning' | 'token';
  className?: string;
}

const accents = {
  brand: { tint: 'from-brand-500/15 to-transparent', color: '#2f7fff', text: 'text-brand-600 dark:text-brand-300' },
  accent: { tint: 'from-accent-500/15 to-transparent', color: '#8b5cf6', text: 'text-accent-600 dark:text-accent-300' },
  teal: { tint: 'from-teal-500/15 to-transparent', color: '#06b6d4', text: 'text-teal-600 dark:text-teal-400' },
  success: { tint: 'from-success-500/15 to-transparent', color: '#10b981', text: 'text-success-600 dark:text-success-500' },
  warning: { tint: 'from-warning-500/15 to-transparent', color: '#f59e0b', text: 'text-warning-600 dark:text-warning-500' },
  token: { tint: 'from-token/15 to-transparent', color: '#22c55e', text: 'text-token' },
};

export function StatTile({ label, value, hint, icon, sparkline, accent = 'brand', className }: Props) {
  const a = accents[accent];
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className={cn('pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl', a.tint)} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</span>
          {icon && (
            <div className={cn('inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br', a.tint, a.text)}>
              {icon}
            </div>
          )}
        </div>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
          {value}
        </motion.div>
        {hint && <div className="mt-0.5 text-[11px] text-muted">{hint}</div>}
        {sparkline && <Sparkline data={sparkline} color={a.color} className="mt-3 h-9 w-full" />}
      </div>
    </Card>
  );
}
