import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Bell, Check, CheckCheck, UserPlus, DollarSign, AlertTriangle, Info, X, Filter, ChevronDown } from 'lucide-react';

// ─── MOCK NOTIFICATIONS ───────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'signup',  title: 'New Member Registered', body: 'James Thornton joined the Elite Expert plan.', time: '2 min ago', read: false, color: '#10b981', icon: UserPlus },
  { id: 2, type: 'payment', title: 'Payment Received', body: '$149 received from Aisha Rahman (Elite Expert).', time: '18 min ago', read: false, color: '#3b82f6', icon: DollarSign },
  { id: 3, type: 'alert',   title: 'Membership Renewal Due', body: "Ben Clarke's membership expires in 3 days.", time: '1 hr ago', read: false, color: '#f59e0b', icon: AlertTriangle },
  { id: 4, type: 'signup',  title: 'New Member Registered', body: 'Lea Voss joined the Elite Expert plan.', time: '2 hr ago', read: true, color: '#10b981', icon: UserPlus },
  { id: 5, type: 'payment', title: 'Payment Received', body: '$100 received from Daniel Kahn (Base Expert).', time: '3 hr ago', read: true, color: '#3b82f6', icon: DollarSign },
  { id: 6, type: 'info',    title: 'System Update Applied', body: 'Avatar storage policies have been updated.', time: '5 hr ago', read: true, color: '#8b5cf6', icon: Info },
  { id: 7, type: 'alert',   title: 'Failed Payment', body: 'Payment of $100 failed for Sofia Melo.', time: 'Yesterday', read: true, color: '#ef4444', icon: AlertTriangle },
  { id: 8, type: 'payment', title: 'Payment Received', body: '$100 received from Nour Hassan (Base Expert).', time: 'Yesterday', read: true, color: '#3b82f6', icon: DollarSign },
];

const TYPE_FILTERS = ['All', 'signup', 'payment', 'alert', 'info'];
const TYPE_LABELS: Record<string, string> = { All: 'All Types', signup: 'Sign-ups', payment: 'Payments', alert: 'Alerts', info: 'System' };

// ─── NOTIFICATION ITEM ────────────────────────────────────────────────────────

function NotificationItem({ n, onRead, onDismiss }: {
  n: typeof MOCK_NOTIFICATIONS[0];
  onRead: (id: number) => void;
  onDismiss: (id: number) => void;
}) {
  const Icon = n.icon;
  return (
    <div
      style={{
        display: 'flex', gap: '0.85rem', padding: '1rem 1.1rem',
        background: n.read ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.035)',
        border: `1px solid ${n.read ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.09)'}`,
        borderLeft: `3px solid ${n.read ? 'transparent' : n.color}`,
        borderRadius: '0.75rem', transition: 'background 0.15s', position: 'relative',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = n.read ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.035)'}
    >
      {/* Icon */}
      <div style={{ width: 36, height: 36, borderRadius: '0.6rem', background: `${n.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.1rem' }}>
        <Icon size={16} color={n.color} strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: n.read ? 600 : 800, color: n.read ? '#9ca3af' : '#f9fafb' }}>{n.title}</p>
          <span style={{ fontSize: '0.62rem', color: '#4b5563', flexShrink: 0 }}>{n.time}</span>
        </div>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>{n.body}</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
        {!n.read && (
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
      {!n.read && (
        <div style={{ position: 'absolute', top: 12, right: 56, width: 7, height: 7, borderRadius: '50%', background: n.color }} />
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminNotifications({ setPathname }: { setPathname: (p: string) => void }) {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);
  const [typeFilter, setTypeFilter] = useState('All');
  const [typeOpen, setTypeOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const unreadCount = items.filter(n => !n.read).length;

  const filtered = items.filter(n => {
    const matchType = typeFilter === 'All' || n.type === typeFilter;
    const matchUnread = !showUnreadOnly || !n.read;
    return matchType && matchUnread;
  });

  const markRead = (id: number) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: number) => setItems(prev => prev.filter(n => n.id !== id));
  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <DashboardLayout currentPath="/admin/notifications" setPathname={setPathname} breadcrumbs={[{ label: 'Admin' }, { label: 'Notifications' }]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Notification <span style={{ color: '#8b5cf6' }}>Center</span>
            </h1>
            {unreadCount > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, borderRadius: '999px', padding: '0.15rem 0.55rem' }}>
                {unreadCount} unread
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.6rem', cursor: 'pointer', color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#f9fafb'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#9ca3af'; }}
            >
              <CheckCheck size={14} strokeWidth={1.5} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Type filter */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setTypeOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.55rem', cursor: 'pointer', color: '#d1d5db', fontSize: '0.78rem', fontWeight: 600 }}>
              <Filter size={12} strokeWidth={1.5} />
              {TYPE_LABELS[typeFilter]}
              <ChevronDown size={12} color="#6b7280" style={{ transform: typeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {typeOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.65rem', overflow: 'hidden', zIndex: 50, minWidth: 150 }}>
                {TYPE_FILTERS.map(t => (
                  <button key={t} onClick={() => { setTypeFilter(t); setTypeOpen(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', background: t === typeFilter ? 'rgba(139,92,246,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: t === typeFilter ? '#8b5cf6' : '#9ca3af', fontSize: '0.78rem', fontWeight: t === typeFilter ? 700 : 400 }}
                  >{TYPE_LABELS[t]}</button>
                ))}
              </div>
            )}
          </div>

          {/* Unread toggle */}
          <button
            onClick={() => setShowUnreadOnly(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', background: showUnreadOnly ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showUnreadOnly ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '0.55rem', cursor: 'pointer', color: showUnreadOnly ? '#8b5cf6' : '#9ca3af', fontSize: '0.78rem', fontWeight: 600 }}
          >
            <Bell size={12} strokeWidth={1.5} />
            Unread only
          </button>

          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#4b5563' }}>{filtered.length} notification{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#4b5563' }}>
            <Bell size={32} color="#374151" strokeWidth={1} style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '0.85rem' }}>No notifications found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filtered.map(n => (
              <NotificationItem key={n.id} n={n} onRead={markRead} onDismiss={dismiss} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
