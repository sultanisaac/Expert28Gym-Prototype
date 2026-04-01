import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface NotificationRow {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationDropdownProps {
  onClose: () => void;
  setPathname: (p: string) => void;
}

export default function NotificationDropdown({ onClose, setPathname }: NotificationDropdownProps) {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        setItems(data as NotificationRow[] ?? []);
      } catch (err) {
        console.error('Notif fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const markAllRead = async () => {
    const unreadIds = items.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length > 0) {
      setItems(prev => prev.map(n => ({ ...n, is_read: true })));
      await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    }
  };

  const navigateToAll = () => {
    setPathname('/admin/notifications');
    history.pushState({}, '', '/admin/notifications');
    onClose();
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 8999 }} onClick={onClose} />
      <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.65rem', width: 320, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', overflow: 'hidden', zIndex: 9000, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', animation: 'slideUp 0.15s ease' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 800, margin: 0, color: '#f9fafb' }}>Notifications</h3>
          <button onClick={markAllRead} style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }}>Mark all read</button>
        </div>

        <div style={{ maxHeight: 320, overflowY: 'auto' }}>
          {loading ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: '#4b5563', fontSize: '0.75rem' }}>Loading notifications...</div>
          ) : items.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#4b5563', fontSize: '0.75rem' }}>No recent notifications</div>
          ) : (
            items.map((n, i) => (
              <div key={n.id} style={{ padding: '0.85rem 1.25rem', borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: n.is_read ? 'transparent' : 'rgba(16,185,129,0.03)', position: 'relative' }}>
                {!n.is_read && <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', width: 3, height: 24, background: '#10b981', borderRadius: 2 }} />}
                <p style={{ fontSize: '0.78rem', fontWeight: n.is_read ? 600 : 800, margin: 0, color: n.is_read ? '#9ca3af' : '#f9fafb' }}>{n.title}</p>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: '0.15rem 0 0', lineHeight: 1.4 }}>{n.message}</p>
              </div>
            ))
          )}
        </div>

        <button onClick={navigateToAll} style={{ display: 'block', width: '100%', padding: '0.85rem', background: 'rgba(255,255,255,0.02)', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6', textAlign: 'center', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        >
          View All Notifications
        </button>
      </div>
      <style>{`
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
