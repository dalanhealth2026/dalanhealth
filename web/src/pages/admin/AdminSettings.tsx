import { useState } from 'react';
import { Save, Building2, Palette, Flag, Globe } from 'lucide-react';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTheme } from '@/store/theme';
import { cn } from '@/lib/cn';

const Toggle = ({ on, onChange, label, desc }: { on: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border hairline p-4">
    <div className="min-w-0">
      <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">{label}</div>
      {desc && <div className="text-xs text-muted">{desc}</div>}
    </div>
    <button
      onClick={() => onChange(!on)}
      className={cn('relative h-6 w-11 rounded-full transition-colors shrink-0', on ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700')}
      aria-pressed={on}
    >
      <span className={cn('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', on && 'translate-x-5')} />
    </button>
  </div>
);

export function AdminSettings() {
  const [companyName, setCompanyName] = useState('Dalansoft Technologies Pvt Ltd');
  const [productName, setProductName] = useState('DalanHealth');
  const [supportEmail, setSupportEmail] = useState('info@dalansoft.com');
  const [website, setWebsite] = useState('dalansoft.com');

  const [autoRecharge, setAutoRecharge] = useState(true);
  const [demoMode, setDemoMode] = useState(true);
  const [websocketRequired, setWebsocketRequired] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const { theme, set } = useTheme();
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Company</CardTitle>
            <CardSubtitle>Shown across the platform — landing, invoices, prescriptions</CardSubtitle>
          </div>
          <Building2 size={16} className="text-muted" />
        </CardHeader>
        <div className="grid md:grid-cols-2 gap-3">
          <Input label="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input label="Product name" value={productName} onChange={(e) => setProductName(e.target.value)} />
          <Input label="Support email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
          <Input label="Website" leftIcon={<Globe size={14} />} value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Feature flags</CardTitle>
            <CardSubtitle>Roll changes out across all clinics</CardSubtitle>
          </div>
          <Flag size={16} className="text-muted" />
        </CardHeader>
        <div className="grid md:grid-cols-2 gap-3">
          <Toggle on={autoRecharge} onChange={setAutoRecharge} label="Auto-recharge offer" desc="Show banner to clinics with low balance" />
          <Toggle on={demoMode} onChange={setDemoMode} label="Demo mode" desc="Enable the one-click demo selector on the landing page" />
          <Toggle on={websocketRequired} onChange={setWebsocketRequired} label="WebSocket required" desc="Disable polling fallback" />
          <Toggle on={maintenanceMode} onChange={setMaintenanceMode} label="Maintenance mode" desc="Show maintenance page to all users" />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Theme</CardTitle>
            <CardSubtitle>Default theme for new admins</CardSubtitle>
          </div>
          <Palette size={16} className="text-muted" />
        </CardHeader>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {(['light', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => set(t)}
              className={cn(
                'rounded-xl border-2 p-4 text-left transition-all',
                theme === t ? 'border-brand-500 bg-brand-500/5' : 'border-transparent bg-ink-50 dark:bg-ink-900',
              )}
            >
              <div className="text-sm font-semibold text-ink-900 dark:text-ink-50 capitalize">{t}</div>
              <div className="text-xs text-muted">{t === 'dark' ? 'Default for ops dashboards' : 'Default for finance views'}</div>
            </button>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-5 sm:-mx-8 px-5 sm:px-8 py-4 border-t hairline bg-white/80 dark:bg-ink-950/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto flex items-center justify-end gap-2">
          {saved && <Badge tone="success" pulse>Saved</Badge>}
          <Button leftIcon={<Save size={14} />} onClick={save}>Save settings</Button>
        </div>
      </div>
    </div>
  );
}
