import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import {
  Bell, Check,
  RefreshCw, Zap
} from 'lucide-react';

interface NotificationRow {
  id: string;
  user_id: string | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

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

export default function AthleteNotifications({ setPathname }: { setPathname: (p: string) => void }) {
  const { user } = useAuth();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(40);
      if (error) throw error;
      setItems(data as NotificationRow[]);
    } catch (e: unknown) {
      console.error('Notification fetch error:', e instanceof Error ? e.message : e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('notifications-athlete')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (_payload: any) => { fetchNotifications(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchNotifications]);

  const markRead = async (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllRead = async () => {
    const unreadIds = items.filter(n => !n.is_read).map(n => n.id);
    setItems(prev => prev.map(n => ({ ...n, is_read: true })));
    if (unreadIds.length > 0) {
      await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
    }
  };

  const unreadCount = items.filter(n => !n.is_read).length;

  return (
    <DashboardLayout 
      currentPath="/client/notifications" 
      setPathname={setPathname} 
      breadcrumbs={[{ label: 'Athlete Hub', path: '/client/dashboard' }, { label: 'Notifications' }]}
    >
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Notifications</h1>
            <p className="text-gray-500 mt-1 font-bold">Stay updated on your training and gym alerts.</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={fetchNotifications} className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
               <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
             </button>
             {unreadCount > 0 && (
               <button onClick={markAllRead} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
                 Mark All Read
               </button>
             )}
          </div>
        </header>

        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Zap size={40} className="animate-pulse mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Checking alerts...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card p-20 text-center">
             <Bell size={48} className="mx-auto text-gray-800 mb-4 opacity-20" />
             <p className="text-gray-500 font-bold uppercase tracking-tight">All caught up!</p>
             <p className="text-xs text-gray-600 mt-1">No new activity to show.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(n => (
              <div 
                key={n.id} 
                className={`glass-card p-6 flex gap-5 group transition-all ${!n.is_read ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 opacity-70'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${!n.is_read ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                   <Bell size={20} />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start gap-4">
                      <p className={`font-black uppercase text-sm tracking-tight ${!n.is_read ? 'text-white' : 'text-gray-400'}`}>{n.title}</p>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">{timeAgo(n.created_at)}</span>
                   </div>
                   <p className="text-gray-500 text-xs mt-2 leading-relaxed">{n.message}</p>
                   {!n.is_read && (
                     <button onClick={() => markRead(n.id)} className="mt-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                       <Check size={12} /> Mark as read
                     </button>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
