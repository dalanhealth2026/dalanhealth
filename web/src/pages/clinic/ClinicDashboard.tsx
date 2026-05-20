import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Ticket, IndianRupee, CheckCircle, Monitor } from 'lucide-react';
import { StatTile } from '@/components/dashboard/StatTile';
import { CurrentTokenCard } from '@/components/dashboard/CurrentTokenCard';
import { WalletMiniCard } from '@/components/dashboard/WalletMiniCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QueuePreview } from '@/components/dashboard/QueuePreview';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useQueue } from '@/store/queue';
import { useAuth } from '@/store/auth';
import { demoClinic, demoQueue } from '@/services/demoData';
import { clinicActivity, clinicSparklines } from '@/services/activityData';
import { inr } from '@/lib/format';

export function ClinicDashboard() {
  const { entries, setEntries, advance, skipCurrent } = useQueue();
  const userName = useAuth((s) => s.user?.name);

  useEffect(() => {
    if (entries.length === 0) setEntries(demoQueue);
  }, [entries.length, setEntries]);

  const current = entries[0];
  const completedToday = 25;
  const liveQueue = entries.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-bold tracking-tight text-ink-900 dark:text-ink-50">
            Good {greeting()}, {(userName ?? 'Doctor')} <span aria-hidden>👋</span>
          </div>
          <div className="text-sm text-muted">Here's what's happening at {demoClinic.name} today.</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="brand">{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</Badge>
          <a href="/display/clinic" target="_blank" rel="noreferrer">
            <Button variant="outline" leftIcon={<Monitor size={14} />}>TV display</Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatTile label="Patients today" value={demoClinic.todayPatients} hint="18 new · 14 old" icon={<Users size={14} />} accent="brand" sparkline={clinicSparklines.patients} />
        <StatTile label="Live queue" value={liveQueue} hint={`${liveQueue} tokens in line`} icon={<Ticket size={14} />} accent="accent" sparkline={clinicSparklines.queue} />
        <StatTile label="Completed" value={completedToday} hint="Successful visits" icon={<CheckCircle size={14} />} accent="success" sparkline={clinicSparklines.completed} />
        <StatTile label="Earnings today" value={inr(demoClinic.todayRevenue)} hint="Revenue generated" icon={<IndianRupee size={14} />} accent="warning" sparkline={clinicSparklines.earnings} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <QueuePreview entries={entries} viewAllTo="/clinic/queue" limit={5} />
        <CurrentTokenCard current={current} onComplete={advance} onSkip={skipCurrent} />
        <WalletMiniCard balance={demoClinic.walletBalance} perVisitRate={12} to="/clinic/wallet" />
        <ActivityFeed items={clinicActivity} />
      </div>

      <Link to="/clinic/queue" className="block">
        <Button size="xl" fullWidth>Call next patient</Button>
      </Link>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
