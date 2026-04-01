import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { supabase } from '../lib/supabase';
import {
  Bell, Check, CheckCheck, UserPlus, DollarSign,
  AlertTriangle, X, Filter, ChevronDown,
  RefreshCw, Zap
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface NotificationRow {
  id: string;
  user_id: string | null;
  type: 'signup' | 'payment' | 'alert' | 'info' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, unknown>;
}

const TYPE_FILTERS = ['All', 'signup', 'payment', 'alert', 'info', 'system'];
const TYPE_LABELS: Record<string, string> = {
  All: 'All Types', signup: 'Sign-ups', payment: 'Payments',
  alert: 'Alerts', info: 'Info', system: 'System'
};
const TYPE_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  signup:  { color: '#10b981', icon: UserPlus },
  payment: { color: '#3b82f6', icon: DollarSign },
  alert:   { color: '#f59e0b', icon: AlertTriangle },
  info:    { color: '#8b5cf6', icon: Bell },
  system:  { color: '#6b7280', icon: Bell },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

// ─── NOTIFICATION ITEM ────────────────────────────────────────────────────────

function NotifItem({ n, onRead, onDismiss }: {
  n: NotificationRow;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
  const Icon = cfg.icon;
  return (
    <div
      style={{
        display: 'flex', gap: '0.85rem', padding: '1rem 1.1rem',
        background: n.is_read ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.035)',
        border: `1px solid ${n.is_read ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.09)'}`,
        borderLeft: `3px solid ${n.is_read ? 'transparent' : cfg.color}`,
        borderRadius: '0.75rem', transition: 'background 0.15s', position: 'relative',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = n.is_read ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.035)'}
    >
      {/* Icon */}
      <div style={{ width: 36, height: 36, borderRadius: '0.6rem', background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
        <Icon size={16} color={cfg.color} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: n.is_read ? 600 : 800, color: n.is_read ? '#9ca3af' : '#f9fafb' }}>{n.title}</p>
          <span style={{ fontSize: '0.62rem', color: '#4b5563', flexShrink: 0 }}>{timeAgo(n.created_at)}</span>
        </div>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>{n.message}</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
        {!n.is_read && (
          <button onClick={() => onRead(n.id)} title="Mark as read"
            style={{ width: 24, height: 24, borderRadius: '0.35rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <Check size={12} strokeWidth={2.5} />
          </button>
        )}
        <button onClick={() => onDismiss(n.id)} title="Dismiss"
          style={{ width: 24, height: 24, borderRadius: '0.35rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
          <X size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Unread dot */}
      {!n.is_read && (
        <div style={{ position: 'absolute', top: 12, right: 56, width: 7, height: 7, borderRadius: '50%', background: cfg.color }} />
      )}
    </div>
  );
}

// ─── REALTIME BADGE ──────────────────────────────────────────────────────────

function RealtimeBadge({ active }: { active: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', background: active ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '999px' }}>
      <Zap size={10} color={active ? '#10b981' : '#6b7280'} strokeWidth={2} />
      <span style={{ fontSize: '0.62rem', fontWeight: 700, color: active ? '#10b981' : '#6b7280', letterSpacing: '0.04em' }}>
        {active ? 'REALTIME ACTIVE' : 'CONNECTING...'}
      </span>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminNotifications({ setPathname }: { setPathname: (p: string) => void }) {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [typeOpen, setTypeOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [realtimeActive, setRealtimeActive] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // ── Fetch all notifications ───────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setItems(data as NotificationRow[]);
    } catch (e: unknown) {
      console.error('Notification fetch error:', e instanceof Error ? e.message : e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // ── Supabase Realtime subscription ────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('notifications-admin')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          const newItem = payload.new as NotificationRow;
          setItems(prev => [newItem, ...prev]);
          showToast(`New: ${newItem.title}`);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'notifications' },
        (payload) => {
          const updated = payload.new as NotificationRow;
          setItems(prev => prev.map(n => n.id === updated.id ? updated : n));
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notifications' },
        (payload) => {
          setItems(prev => prev.filter(n => n.id !== (payload.old as NotificationRow).id));
        }
      )
      .subscribe((status) => {
        setRealtimeActive(status === 'SUBSCRIBED');
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Mark read (DB + local) ────────────────────────────────────────────────
  const markRead = async (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  // ── Dismiss (soft-delete from DB) ────────────────────────────────────────
  const dismiss = async (id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
    await supabase.from('notifications').delete().eq('id', id);
  };

  // ── Mark all read ─────────────────────────────────────────────────────────
  const markAllRead = async () => {
    const unreadIds = items.filter(n => !n.is_read).map(n => n.id);
    setItems(prev => prev.map(n => ({ ...n, is_read: true })));
    if (unreadIds.length > 0) {
      await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    }
  };

  const unreadCount = items.filter(n => !n.is_read).length;

  const filtered = items.filter(n => {
    const matchType = typeFilter === 'All' || n.type === typeFilter;
    const matchUnread = !showUnreadOnly || !n.is_read;
    return matchType && matchUnread;
  });

  return (
    <DashboardLayout currentPath="/admin/notifications" setPathname={setPathname} breadcrumbs={[{ label: 'Admin' }, { label: 'Notifications' }]}>
      <style>{`@keyframes spin { to{transform:rotate(360deg)} } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} } @keyframes slideUp { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }`}</style>

      {/* Toast */}
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: '#0d1117', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '0.75rem', padding: '0.85rem 1.25rem', zIndex: 9999, fontSize: '0.82rem', color: '#10b981', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', animation: 'slideUp 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={13} strokeWidth={2} />
          {toastMsg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Notification <span style={{ color: '#8b5cf6' }}>Center</span>
            </h1>
            {unreadCount > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: '999px', padding: '0.15rem 0.55rem' }}>
                {unreadCount} unread
              </span>
            )}
            <RealtimeBadge active={realtimeActive} />
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={fetchNotifications}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', cursor: 'pointer', color: '#9ca3af', fontSize: '0.78rem' }}
              title="Refresh"
            >
              <RefreshCw size={13} strokeWidth={1.5} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            {unreadCount > 0 && (
              <button onClick={markAllRead}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.6rem', cursor: 'pointer', color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f9fafb'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9ca3af'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <CheckCheck size={14} strokeWidth={1.5} />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Type dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setTypeOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.55rem', cursor: 'pointer', color: '#d1d5db', fontSize: '0.78rem', fontWeight: 600 }}>
              <Filter size={12} strokeWidth={1.5} />
              {TYPE_LABELS[typeFilter]}
              <ChevronDown size={12} color="#6b7280" style={{ transform: typeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {typeOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setTypeOpen(false)} />
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.65rem', overflow: 'hidden', zIndex: 50, minWidth: 150 }}>
                  {TYPE_FILTERS.map(t => (
                    <button key={t} onClick={() => { setTypeFilter(t); setTypeOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', background: t === typeFilter ? 'rgba(139,92,246,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: t === typeFilter ? '#8b5cf6' : '#9ca3af', fontSize: '0.78rem', fontWeight: t === typeFilter ? 700 : 400 }}>
                      {TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Unread toggle */}
          <button
            onClick={() => setShowUnreadOnly(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', background: showUnreadOnly ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showUnreadOnly ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '0.55rem', cursor: 'pointer', color: showUnreadOnly ? '#8b5cf6' : '#9ca3af', fontSize: '0.78rem', fontWeight: 600 }}>
            <Bell size={12} strokeWidth={1.5} />
            Unread only
          </button>

          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#4b5563' }}>
            {loading ? 'Loading...' : `${filtered.length} notification${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Notification List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ height: 76, borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#4b5563' }}>
            <Bell size={32} color="#374151" strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '0.85rem' }}>
              {items.length === 0 ? 'No notifications yet. They will appear here in real-time.' : 'No notifications match your filter.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filtered.map(n => (
              <NotifItem key={n.id} n={n} onRead={markRead} onDismiss={dismiss} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
