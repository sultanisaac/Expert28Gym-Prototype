import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { supabase } from '../lib/supabase';
import {
  Shield, User, Settings, Database, Lock,
  RefreshCw, ChevronDown, Search
} from 'lucide-react';;

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface AuditLogRow {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: string;
  ip_address: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const ENTITY_FILTERS = ['All', 'profile', 'payment', 'system', 'security'];
const ACTION_FILTERS = ['All', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function getActionColor(action: string): string {
  if (action.includes('CREATE')) return '#10b981';
  if (action.includes('UPDATE')) return '#3b82f6';
  if (action.includes('DELETE')) return '#ef4444';
  if (action.includes('LOGIN')) return '#8b5cf6';
  if (action.includes('SECURITY')) return '#f59e0b';
  return '#6b7280';
}

function getEntityIcon(type: string) {
  if (type === 'profile' || type === 'user') return User;
  if (type === 'system') return Settings;
  if (type === 'security') return Lock;
  return Database;
}

// ─── LOG ITEM ────────────────────────────────────────────────────────────────

function LogItem({ log }: { log: AuditLogRow }) {
  const Icon = getEntityIcon(log.entity_type);
  const actionColor = getActionColor(log.action);
  const adminName = log.profiles?.full_name ?? log.profiles?.email ?? 'System';

  return (
    <div
      style={{
        display: 'flex', gap: '1rem', padding: '1rem 1.25rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '0.75rem', transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
    >
      <div style={{ width: 36, height: 36, borderRadius: '0.6rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color="#6b7280" strokeWidth={1.5} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: actionColor, background: `${actionColor}15`, padding: '0.15rem 0.45rem', borderRadius: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {log.action}
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f9fafb' }}>{adminName}</span>
          </div>
          <span style={{ fontSize: '0.68rem', color: '#4b5563' }}>{timeAgo(log.created_at)}</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af', lineHeight: 1.4 }}>
          {log.details}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem' }}>
          <span style={{ fontSize: '0.65rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Database size={10} /> {log.entity_type}{(log.entity_id ? ` · ${log.entity_id}` : '')}
          </span>
          {log.ip_address && (
            <span style={{ fontSize: '0.65rem', color: '#374151' }}>IP: {log.ip_address}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminAuditLogs({ setPathname }: { setPathname: (p: string) => void }) {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEntity, setFilterEntity] = useState('All');
  const [filterAction, setFilterAction] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('audit_logs')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filterEntity !== 'All') query = query.eq('entity_type', filterEntity);
      if (filterAction !== 'All') query = query.ilike('action', `%${filterAction}%`);

      const { data, error } = await query;
      if (error) throw error;
      setLogs(data as any[]);
    } catch (e) {
      console.error('Audit log fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [filterEntity, filterAction]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filteredLogs = logs.filter(l => 
    searchQuery === '' || 
    l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (l.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout currentPath="/admin/audit-logs" setPathname={setPathname} breadcrumbs={[{ label: 'Admin' }, { label: 'Security' }, { label: 'Audit Logs' }]}>
      <style>{`@keyframes spin { to{transform:rotate(360deg)} } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1000 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Audit <span style={{ color: '#10b981' }}>Explorer</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.3rem 0 0' }}>
              Immutable record of all administrative and system actions
            </p>
          </div>
          <button
            onClick={fetchLogs}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.6rem', cursor: 'pointer', color: '#9ca3af', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} strokeWidth={1.5} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.015)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <Search size={14} color="#4b5563" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by admin name, email or event details..."
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', color: '#f9fafb', fontSize: '0.82rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {/* Entity Filter */}
            <div style={{ position: 'relative' }}>
              <select 
                value={filterEntity}
                onChange={e => setFilterEntity(e.target.value)}
                style={{ appearance: 'none', padding: '0.6rem 2.2rem 0.6rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', color: '#d1d5db', fontSize: '0.82rem', cursor: 'pointer', outline: 'none' }}
              >
                {ENTITY_FILTERS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
              </select>
              <ChevronDown size={12} color="#6b7280" style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* Action Filter */}
            <div style={{ position: 'relative' }}>
              <select 
                value={filterAction}
                onChange={e => setFilterAction(e.target.value)}
                style={{ appearance: 'none', padding: '0.6rem 2.2rem 0.6rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', color: '#d1d5db', fontSize: '0.82rem', cursor: 'pointer', outline: 'none' }}
              >
                {ACTION_FILTERS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown size={12} color="#6b7280" style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Logs Feed */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ height: 86, borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.01)', borderRadius: '1rem', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <Shield size={32} color="#374151" strokeWidth={1} style={{ margin: '0 auto 1.25rem' }} />
            <p style={{ fontSize: '0.85rem', color: '#4b5563' }}>No audit logs found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredLogs.map(log => <LogItem key={log.id} log={log} />)}
            
            <div style={{ textAlign: 'center', padding: '1rem', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#374151' }}>Showing last 100 system events</p>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
