import { type ReactNode, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Search, Bell, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/store/auth';
import { cn } from '@/lib/cn';

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
  badge?: string | number;
}

export interface NavSection {
  /** Uppercase section heading shown above its items. */
  title: string;
  items: NavItem[];
  /** Optional accent for the section heading. Defaults to brand. */
  accent?: 'brand' | 'token' | 'accent' | 'warning';
}

interface Props {
  /** Either a flat list of items or grouped sections. */
  nav: NavItem[] | NavSection[];
  children: ReactNode;
  title?: string;
  subtitle?: string;
  topRight?: ReactNode;
}

const isSectioned = (n: NavItem[] | NavSection[]): n is NavSection[] =>
  Array.isArray(n) && n.length > 0 && (n[0] as NavSection).items !== undefined;

const accentClass: Record<NonNullable<NavSection['accent']>, string> = {
  brand: 'text-brand-300',
  token: 'text-token',
  accent: 'text-accent-300',
  warning: 'text-warning-500',
};

export function DashboardShell({ nav, children, title, subtitle, topRight }: Props) {
  const sections: NavSection[] = isSectioned(nav)
    ? nav
    : [{ title: 'Menu', items: nav as NavItem[] }];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.title, true])),
  );
  const { user, isDemo, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const setAllExpanded = (v: boolean) =>
    setExpanded(Object.fromEntries(sections.map((s) => [s.title, v])));

  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setMobileOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-900 text-white">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <Logo asLink={false} variant="onDark" />
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Expand / Collapse all */}
      <div className="px-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setAllExpanded(true)}
          className="rounded-lg border border-white/10 bg-white/[0.04] py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
        >
          Expand all
        </button>
        <button
          onClick={() => setAllExpanded(false)}
          className="rounded-lg border border-white/10 bg-white/[0.04] py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/70 hover:bg-white/[0.08] hover:text-white transition-colors"
        >
          Collapse all
        </button>
      </div>

      {/* Sections */}
      <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-3 space-y-4">
        {sections.map((section) => {
          const open = expanded[section.title] ?? true;
          return (
            <div key={section.title}>
              <button
                onClick={() => setExpanded((e) => ({ ...e, [section.title]: !open }))}
                className="w-full flex items-center justify-between px-3 mb-1.5"
              >
                <span className={cn('text-[10px] font-bold uppercase tracking-[0.18em]', accentClass[section.accent ?? 'brand'])}>
                  {section.title}
                </span>
                <ChevronDown size={12} className={cn('text-white/40 transition-transform', !open && '-rotate-90')} />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden space-y-1"
                  >
                    {section.items.map((n) => (
                      <NavLink
                        key={n.to}
                        to={n.to}
                        end={n.end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                            isActive
                              ? 'bg-gradient-to-r from-brand-500/90 via-brand-500/80 to-brand-400/70 text-white shadow-glowBright'
                              : 'text-white/65 hover:text-white hover:bg-white/[0.05]',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span className={cn(
                              'inline-flex h-5 w-5 items-center justify-center transition-colors',
                              isActive ? 'text-white' : 'text-white/55 group-hover:text-white',
                            )}>{n.icon}</span>
                            <span className="truncate flex-1">{n.label}</span>
                            {n.badge !== undefined && (
                              <span className={cn(
                                'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                                isActive ? 'bg-white/25 text-white' : 'bg-brand-500/25 text-brand-200',
                              )}>{n.badge}</span>
                            )}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {user && (
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{user.name}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/50">{user.role.replace('_', ' ')}</div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger-500 hover:bg-danger-500/10 transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-ink-50 dark:bg-ink-950">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex sticky top-0 h-screen w-[244px] flex-col">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 flex"
          >
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="w-[260px] h-full"
            >
              {sidebar}
            </motion.div>
            <button className="flex-1 bg-ink-950/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 border-b hairline bg-white/70 dark:bg-ink-950/70 backdrop-blur-xl">
          <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border hairline"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              {title && <h1 className="text-base sm:text-lg font-semibold tracking-tight text-ink-900 dark:text-ink-50 truncate">{title}</h1>}
              {subtitle && <p className="text-xs text-muted truncate">{subtitle}</p>}
            </div>
            <div className="hidden lg:flex items-center gap-2 max-w-md flex-1">
              <div className="w-full inline-flex items-center gap-2 rounded-xl border hairline bg-white/70 dark:bg-ink-900/60 px-3 py-2 text-sm text-ink-500 dark:text-ink-400">
                <Search size={14} /> <span className="truncate">Search patients, tokens, invoices…</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isDemo && <Badge tone="accent" size="sm">Demo</Badge>}
              {topRight}
              <ThemeToggle />
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border hairline relative">
                <Bell size={16} />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-danger-500" />
              </button>
              <div className="hidden sm:flex items-center gap-2 rounded-xl border hairline pl-1 pr-3 py-1">
                <Avatar name={user?.name ?? 'You'} size="sm" />
                <div className="leading-tight">
                  <div className="text-xs font-semibold text-ink-900 dark:text-ink-50 truncate max-w-[120px]">{user?.name ?? 'Guest'}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted">{user?.role?.replace('_', ' ') ?? 'guest'}</div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-5 sm:p-8 max-w-[1600px] w-full mx-auto">{children}</div>
      </div>
    </div>
  );
}
