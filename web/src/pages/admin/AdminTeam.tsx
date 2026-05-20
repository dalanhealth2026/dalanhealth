import { useState } from 'react';
import { Plus, Mail, UserCog, Shield } from 'lucide-react';
import { Card, CardHeader, CardSubtitle, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { demoCompanyAdmins } from '@/services/demoData';

const roleTone: Record<string, 'brand' | 'accent' | 'success' | 'warning' | 'danger'> = {
  Owner: 'danger',
  'Support Admin': 'brand',
  'Sales Admin': 'accent',
  'Finance Admin': 'success',
  'Technical Admin': 'warning',
};

const roleDescriptions: Record<string, string> = {
  Owner: 'Full access — pricing, finance, system, team management.',
  'Support Admin': 'Tickets, login resets, queue troubleshooting. No financial access.',
  'Sales Admin': 'Leads, onboarding, plan assignment. No financial access.',
  'Finance Admin': 'Revenue, recharge ledger, invoices. No technical controls.',
  'Technical Admin': 'API monitoring, logs, system health. No financial access.',
};

export function AdminTeam() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Company admins</CardTitle>
            <CardSubtitle>Dalansoft internal team — scoped role-based access</CardSubtitle>
          </div>
          <Button leftIcon={<Plus size={14} />} onClick={() => setOpen(true)}>Invite admin</Button>
        </CardHeader>
        <div className="space-y-2">
          {demoCompanyAdmins.map((a) => (
            <div key={a.id} className="flex items-center gap-4 rounded-xl border hairline p-3">
              <Avatar name={a.name} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">{a.name}</div>
                <div className="text-xs text-muted">{a.email} · last seen {a.lastSeen}</div>
              </div>
              <Badge tone={roleTone[a.role]} size="sm">{a.role}</Badge>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Role definitions</CardTitle>
            <CardSubtitle>RBAC enforced at the API layer via FastAPI dependency injection</CardSubtitle>
          </div>
          <Shield size={16} className="text-muted" />
        </CardHeader>
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(roleDescriptions).map(([r, d]) => (
            <div key={r} className="rounded-xl border hairline p-4">
              <div className="flex items-center gap-2">
                <UserCog size={14} className="text-brand-600 dark:text-brand-300" />
                <span className="text-sm font-semibold text-ink-900 dark:text-ink-50">{r}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Invite company admin">
        <div className="space-y-3">
          <Input label="Full name" placeholder="Name" />
          <Input label="Email" type="email" leftIcon={<Mail size={14} />} placeholder="name@dalansoft.com" />
          <div>
            <div className="mb-1.5 text-xs font-medium text-ink-700 dark:text-ink-300 uppercase tracking-wide">Role</div>
            <select className="w-full rounded-xl border hairline bg-white dark:bg-ink-900/80 px-3 py-2.5 text-sm">
              <option>Support Admin</option>
              <option>Sales Admin</option>
              <option>Finance Admin</option>
              <option>Technical Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Send invite</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
