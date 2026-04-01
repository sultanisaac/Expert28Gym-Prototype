import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import ProfileDropdown from '../ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import {
  LayoutDashboard, Users, CreditCard, BarChart3, Bell,
  ChevronLeft, ChevronRight, Search, Command, Shield,
  UserCheck, DollarSign, TrendingUp, Menu, X
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface BreadcrumbSegment {
  label: string;
  path?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  setPathname: (path: string) => void;
  breadcrumbs?: BreadcrumbSegment[];
}

// ─── MOCK SEARCH DATA ─────────────────────────────────────────────────────────

const SEARCH_DATA = [
  { type: 'client', label: 'James Thornton', sub: 'Elite Expert · Active', path: '/admin/clients', icon: UserCheck },
  { type: 'client', label: 'Aisha Rahman', sub: 'Base Expert · Active', path: '/admin/clients', icon: UserCheck },
  { type: 'client', label: 'Marcus Webb', sub: '7-Day Trial · Pending', path: '/admin/clients', icon: UserCheck },
  { type: 'payment', label: '$149.00 — Elite Expert', sub: 'James Thornton · Today', path: '/admin/payments', icon: DollarSign },
  { type: 'payment', label: '$100.00 — Base Expert', sub: 'Aisha Rahman · Yesterday', path: '/admin/payments', icon: DollarSign },
  { type: 'page', label: 'Dashboard Overview', sub: 'Admin / Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { type: 'page', label: 'Client Management', sub: 'Admin / Clients', path: '/admin/clients', icon: Users },
  { type: 'page', label: 'Payment Logs', sub: 'Admin / Payments', path: '/admin/payments', icon: CreditCard },
  { type: 'page', label: 'Reports & Analytics', sub: 'Admin / Reporting', path: '/admin/reporting', icon: TrendingUp },
  { type: 'page', label: 'Notifications', sub: 'Admin / Notifications', path: '/admin/notifications', icon: Bell },
  { type: 'page', label: 'Audit Logs', sub: 'Admin / Audit Logs', path: '/admin/audit-logs', icon: Shield },
];

// ─── COMMAND SEARCH MODAL ─────────────────────────────────────────────────────

function CommandSearch({ onClose, setPathname }: { onClose: () => void; setPathname: (p: string) => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const results = SEARCH_DATA.filter(item =>
    query === '' || item.label.toLowerCase().includes(query.toLowerCase()) || item.sub.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const navigate = useCallback((path: string) => {
    setPathname(path);
    history.pushState({}, '', path);
    onClose();
  }, [setPathname, onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, results.length - 1));
      if (e.key === 'ArrowUp') setSelected(s => Math.max(s - 1, 0));
      if (e.key === 'Enter' && results[selected]) navigate(results[selected].path);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [results, selected, navigate, onClose]);

  const typeColors: Record<string, string> = {
    client: '#10b981',
    payment: '#3b82f6',
    page: '#f59e0b',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 9000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 600, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={18} color="#6b7280" strokeWidth={1.5} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search clients, payments, pages..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f9fafb', fontSize: '0.95rem', fontFamily: 'inherit' }}
          />
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.35rem', padding: '0.2rem 0.5rem', cursor: 'pointer', color: '#6b7280', fontSize: '0.65rem', fontWeight: 700 }}>ESC</button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '0.5rem' }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#4b5563', fontSize: '0.85rem' }}>No results found</div>
          ) : (
            results.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.7rem 0.85rem', borderRadius: '0.6rem', border: 'none', background: selected === i ? 'rgba(255,255,255,0.06)' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '0.4rem', background: `${typeColors[item.type]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color={typeColors[item.type]} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f9fafb', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</p>
                    <p style={{ fontSize: '0.68rem', color: '#6b7280', margin: 0, marginTop: '0.1rem' }}>{item.sub}</p>
                  </div>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', color: typeColors[item.type], background: `${typeColors[item.type]}15`, padding: '0.15rem 0.5rem', borderRadius: '0.25rem', textTransform: 'uppercase', flexShrink: 0 }}>{item.type}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '0.65rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '1.25rem' }}>
          {[{ keys: ['↑', '↓'], label: 'Navigate' }, { keys: ['↵'], label: 'Select' }, { keys: ['Esc'], label: 'Close' }].map(hint => (
            <div key={hint.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {hint.keys.map(k => (
                <kbd key={k} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.25rem', padding: '0.1rem 0.35rem', fontSize: '0.6rem', fontFamily: 'monospace', color: '#9ca3af' }}>{k}</kbd>
              ))}
              <span style={{ fontSize: '0.65rem', color: '#6b7280' }}>{hint.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ collapsed, setCollapsed, currentPath, setPathname, notificationCount, role }: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  currentPath: string;
  setPathname: (p: string) => void;
  notificationCount: number;
  role?: string;
}) {
  const isAdmin = role === 'admin';

  const adminNav: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Clients', icon: Users, path: '/admin/clients' },
    { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { label: 'Reporting', icon: BarChart3, path: '/admin/reporting' },
    { label: 'Notifications', icon: Bell, path: '/admin/notifications', badge: notificationCount },
    { label: 'Audit Logs', icon: Shield, path: '/admin/audit-logs' },
  ];

  const clientNav: NavItem[] = [
    { label: 'Athlete Hub', icon: LayoutDashboard, path: '/client/dashboard' },
    { label: 'The Lab Tracker', icon: BarChart3, path: '/client/workouts' },
    { label: 'Notifications', icon: Bell, path: '/client/notifications', badge: notificationCount },
  ];

  const navItems = isAdmin ? adminNav : clientNav;

  const navigate = (path: string) => {
    setPathname(path);
    history.pushState({}, '', path);
  };

  return (
    <aside style={{
      width: collapsed ? 64 : 220,
      background: 'rgba(255,255,255,0.02)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.75rem',
      gap: '0.25rem',
      transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.25rem 0.5rem', marginBottom: '1.5rem', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Shield size={16} color="#f59e0b" strokeWidth={1.5} />
        </div>
        {!collapsed && (
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2, whiteSpace: 'nowrap' }}>Expert<span style={{ color: '#10b981' }}>28</span></p>
            <p style={{ fontSize: '0.55rem', fontWeight: 700, color: isAdmin ? '#f59e0b' : '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{isAdmin ? 'Admin Panel' : 'Athlete Hub'}</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
                padding: '0.6rem 0.65rem',
                borderRadius: '0.6rem',
                border: 'none',
                background: isActive ? 'rgba(16,185,129,0.1)' : 'transparent',
                cursor: 'pointer',
                color: isActive ? '#10b981' : '#6b7280',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.82rem',
                textAlign: 'left',
                transition: 'all 0.15s',
                position: 'relative',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                borderLeft: isActive ? '2px solid #10b981' : '2px solid transparent',
                flexShrink: 0,
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; if (!isActive) e.currentTarget.style.color = '#d1d5db'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; if (!isActive) e.currentTarget.style.color = '#6b7280'; }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', fontSize: '0.5rem', fontWeight: 800, borderRadius: '999px', minWidth: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span style={{ marginLeft: 'auto', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: '0.6rem', fontWeight: 800, borderRadius: '999px', padding: '0.1rem 0.45rem' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle - Hidden on mobile */}
      <button
        className="collapse-toggle"
        onClick={() => setCollapsed(!collapsed)}
        style={{ display: window.innerWidth < 768 ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', color: '#6b7280', transition: 'all 0.15s', marginTop: '0.5rem' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f9fafb'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#6b7280'; }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={16} strokeWidth={1.5} /> : <ChevronLeft size={16} strokeWidth={1.5} />}
      </button>
    </aside>
  );
}

// ─── BREADCRUMBS ──────────────────────────────────────────────────────────────

function Breadcrumbs({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
      {segments.map((seg, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {i > 0 && <ChevronRight size={12} color="#374151" strokeWidth={1.5} />}
          <span style={{ fontSize: '0.72rem', fontWeight: i === segments.length - 1 ? 600 : 400, color: i === segments.length - 1 ? '#9ca3af' : '#4b5563', letterSpacing: '0.01em' }}>
            {seg.label}
          </span>
        </span>
      ))}
    </div>
  );
}

// ─── MAIN LAYOUT ──────────────────────────────────────────────────────────────

export default function DashboardLayout({ children, currentPath, setPathname, breadcrumbs }: DashboardLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // ── Responsive: auto-collapse sidebar below 768px ────────────────────────
  useEffect(() => {
    const onResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setCollapsed(true);
      } else {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Live unread count from notifications table ────────────────────────────
  useEffect(() => {
    // Initial fetch
    const fetchCount = async () => {
      try {
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);
        setNotificationCount(count ?? 0);
      } catch {
        setNotificationCount(0);
      }
    };
    fetchCount();

    // Realtime subscription — update badge on any INSERT or UPDATE to notifications
    const channel = supabase
      .channel('dashboard-notification-count')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => {
        setNotificationCount(c => c + 1);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, () => {
        // Re-fetch on update (a read could decrease count)
        fetchCount();
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'notifications' }, () => {
        fetchCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Default breadcrumbs from path
  const defaultBreadcrumbs: BreadcrumbSegment[] = [
    { label: 'Admin' },
    ...currentPath.split('/').filter(Boolean).slice(1).map(seg => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1)
    }))
  ];

  const crumbs = breadcrumbs ?? defaultBreadcrumbs;

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#f9fafb', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @media (max-width: 767px) {
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar { 
            position: fixed; top: 0; left: 0; bottom: 0; width: 280px; 
            z-index: 10000; animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: #030712; border-right: 1px solid rgba(255,255,255,0.06);
          }
          .mobile-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
            z-index: 9999; animation: fadeIn 0.2s ease;
          }
          .search-label { display: none !important; }
          .shortcut-hint { display: none !important; }
          .collapse-toggle { display: none !important; }
        }
        @media (min-width: 768px) {
          .mobile-toggle { display: none !important; }
          .search-label { display: block !important; }
        }
      `}</style>

      {searchOpen && <CommandSearch onClose={() => setSearchOpen(false)} setPathname={setPathname} />}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-sidebar">
            <Sidebar
              collapsed={false}
              setCollapsed={() => { }}
              currentPath={currentPath}
              setPathname={(p) => { setPathname(p); setIsMobileMenuOpen(false); }}
              notificationCount={notificationCount}
              role={profile?.role}
            />
            {/* Close button for mobile drawer */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1rem', padding: '0.4rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7280', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </>
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Desktop Sidebar */}
        <div className="desktop-sidebar">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            currentPath={currentPath}
            setPathname={setPathname}
            notificationCount={notificationCount}
            role={profile?.role}
          />
        </div>

        {/* Main column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
          {/* Top Header */}
          <header style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.85rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(16px)',
            position: 'sticky', top: 0, zIndex: 50, flexShrink: 0, gap: '1rem',
          }}>
            {/* Left: Mobile Menu Toggle + Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className="mobile-toggle"
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ padding: '0.45rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', cursor: 'pointer', color: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Menu size={20} />
              </button>
              <Breadcrumbs segments={crumbs} />
            </div>

            {/* Right: Home + Search + Notifications + Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              {/* Home button */}

              {/* Quick Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', cursor: 'pointer', color: '#6b7280', fontSize: '0.75rem', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <Search size={13} strokeWidth={1.5} />
                <span className="search-label">Quick search...</span>
                <div className="shortcut-hint" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.5rem' }}>
                  <Command size={10} />
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace' }}>K</span>
                </div>
              </button>

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  style={{ position: 'relative', padding: '0.45rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', cursor: 'pointer', color: notifOpen ? '#f9fafb' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f9fafb'; }}
                  onMouseLeave={e => { if (!notifOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#6b7280'; } }}
                >
                  <Bell size={15} strokeWidth={1.5} />
                  {notificationCount > 0 && (
                    <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: '0.5rem', fontWeight: 800, borderRadius: '999px', minWidth: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {notificationCount}
                    </span>
                  )}
                </button>
                {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} setPathname={setPathname} />}
              </div>

              {/* Profile Dropdown */}
              {user && (
                <ProfileDropdown
                  user={user}
                  profile={profile}
                  signOut={signOut}
                  setPathname={(p: string) => { setPathname(p); history.pushState({}, '', p); setIsMobileMenuOpen(false); }}
                />
              )}
            </div>
          </header>

          {/* Page Content */}
          <main style={{ flex: 1, padding: window.innerWidth < 768 ? '1rem' : '1.75rem', overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
