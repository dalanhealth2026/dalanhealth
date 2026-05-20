import { Activity, Zap, Database, Wifi, Bell, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { demoSystemHealth } from '@/services/demoData';
import { num } from '@/lib/format';

const serviceIcon: Record<string, React.ReactNode> = {
  API: <Zap size={14} />,
  WebSocket: <Wifi size={14} />,
  MongoDB: <Database size={14} />,
  Notifications: <Bell size={14} />,
  Razorpay: <AlertTriangle size={14} />,
};

export function AdminSystem() {
  const d = demoSystemHealth;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="API latency" value={`${d.apiLatencyMs}ms`} icon={<Zap size={16} />} accent="brand" />
        <StatCard label="Uptime (30d)" value={`${d.apiUptime}%`} icon={<Activity size={16} />} accent="success" />
        <StatCard label="WebSocket connections" value={num(d.wsConnections)} icon={<Wifi size={16} />} accent="accent" />
        <StatCard label="Error rate" value={`${(d.errorRate * 100).toFixed(2)}%`} accent={d.errorRate < 0.05 ? 'success' : 'danger'} />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Service status</CardTitle>
            <CardSubtitle>Realtime health of each subsystem</CardSubtitle>
          </div>
          <Badge tone="success" pulse>Operational</Badge>
        </CardHeader>
        <div className="space-y-2">
          {d.services.map((s) => (
            <div key={s.name} className="flex items-center justify-between rounded-xl border hairline p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300 flex items-center justify-center">
                  {serviceIcon[s.name]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">{s.name}</div>
                  <div className="text-xs text-muted">avg latency {s.latency}ms</div>
                </div>
              </div>
              <Badge tone={s.status === 'Operational' ? 'success' : s.status === 'Degraded' ? 'warning' : 'danger'} pulse>{s.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Database</CardTitle>
              <CardSubtitle>MongoDB Atlas</CardSubtitle>
            </div>
          </CardHeader>
          <div className="space-y-2 text-sm">
            <Row label="Write ops / sec" value={`${num(d.dbWriteOpsPerSec)}/s`} />
            <Row label="Connection pool" value="38 / 100" />
            <Row label="Indexes" value="22 active" />
            <Row label="Disk usage" value="42% (4.1 GB)" />
          </div>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Notification queue</CardTitle>
              <CardSubtitle>Pending dispatches</CardSubtitle>
            </div>
          </CardHeader>
          <div className="space-y-2 text-sm">
            <Row label="Backlog" value={`${d.notifBacklog} messages`} />
            <Row label="Push workers" value="4 active" />
            <Row label="WhatsApp rate limit" value="80 / sec" />
            <Row label="Last successful dispatch" value="3 sec ago" />
          </div>
        </Card>
      </div>
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between rounded-lg bg-ink-50 dark:bg-ink-900/60 px-3 py-2">
    <span className="text-muted">{label}</span>
    <span className="font-semibold text-ink-900 dark:text-ink-50">{value}</span>
  </div>
);
