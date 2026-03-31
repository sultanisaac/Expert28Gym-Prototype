import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { supabase } from '../lib/supabase';
import {
  Search, UserPlus, MoreVertical, Shield, Ban, Eye,
  CheckCircle, Clock, XCircle, ChevronDown, Filter,
  RefreshCw, AlertCircle
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface ClientProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'client' | 'user';
  status: 'active' | 'pending' | 'banned';
  membership_tier: string | null;
  avatar_url: string | null;
  membership_expires_at: string | null;
  created_at: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active:  { label: 'Active',  color: '#10b981', icon: CheckCircle },
  pending: { label: 'Pending', color: '#f59e0b', icon: Clock },
  banned:  { label: 'Banned',  color: '#ef4444', icon: XCircle },
};

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  admin:  { label: 'Admin',  color: '#f59e0b' },
  client: { label: 'Client', color: '#3b82f6' },
  user:   { label: 'User',   color: '#10b981' },
};

const TIER_FILTERS = ['All Tiers', 'Elite Expert', 'Base Expert', '7-Day Trial', 'Unassigned'];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: cfg.color, background: `${cfg.color}15`, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
      <Icon size={10} strokeWidth={2} />
      {cfg.label}
    </span>
  );
}

// ─── ACTION MENU ─────────────────────────────────────────────────────────────

function ActionMenu({ client, onAction }: { client: ClientProfile; onAction: (a: string, c: ClientProfile) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ padding: '0.35rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.4rem', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
        <MoreVertical size={14} strokeWidth={1.5} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.65rem', zIndex: 50, minWidth: 160, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            {[
              { label: 'View Profile', icon: Eye, color: '#9ca3af' },
              { label: 'Change Role', icon: Shield, color: '#3b82f6' },
              { label: client.status === 'banned' ? 'Unban User' : 'Ban User', icon: Ban, color: '#ef4444' },
            ].map(a => {
              const Icon = a.icon;
              return (
                <button key={a.label} onClick={() => { onAction(a.label, client); setOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.65rem 0.85rem', background: 'transparent', border: 'none', cursor: 'pointer', color: a.color, fontSize: '0.78rem', fontWeight: 600, textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <Icon size={13} strokeWidth={1.5} />
                  {a.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── LOADING SKELETON ────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1fr 1fr auto', gap: '0.5rem', padding: '0.85rem 1.25rem', alignItems: 'center' }}>
      {[180, 160, 60, 100, 70, 80, 24].map((w, i) => (
        <div key={i} style={{ height: 14, width: w, borderRadius: 4, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 25;

export default function AdminClients({ setPathname }: { setPathname: (p: string) => void }) {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All Tiers');
  const [tierOpen, setTierOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, status, membership_tier, avatar_url, created_at, membership_expires_at')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setClients(data as ClientProfile[]);
    } catch (e: any) {
      setError(e.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filtered = clients.filter(c => {
    const matchSearch = (c.full_name ?? '').toLowerCase().includes(search.toLowerCase())
      || c.email.toLowerCase().includes(search.toLowerCase());
    const tier = c.membership_tier ?? 'Unassigned';
    const matchTier = tierFilter === 'All Tiers' || tier === tierFilter;
    return matchSearch && matchTier;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleAction = async (action: string, client: ClientProfile) => {
    if (action === 'View Profile') {
      showToast(`Viewing ${client.full_name ?? client.email}`);
      return;
    }

    setSaving(client.id);
    try {
      if (action === 'Ban User' || action === 'Unban User') {
        const newStatus = client.status === 'banned' ? 'active' : 'banned';
        const { error: err } = await supabase
          .from('profiles')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', client.id);
        if (err) throw err;
        setClients(prev => prev.map(c => c.id === client.id ? { ...c, status: newStatus } : c));
        showToast(`${client.full_name ?? client.email} has been ${newStatus === 'banned' ? 'banned' : 'unbanned'}.`);
      } else if (action === 'Change Role') {
        const nextRole = client.role === 'client' ? 'user' : 'client';
        const { error: err } = await supabase
          .from('profiles')
          .update({ role: nextRole, updated_at: new Date().toISOString() })
          .eq('id', client.id);
        if (err) throw err;
        setClients(prev => prev.map(c => c.id === client.id ? { ...c, role: nextRole } : c));
        showToast(`${client.full_name ?? client.email}'s role changed to ${nextRole}.`);
      }
    } catch (e: any) {
      showToast(e.message || 'Action failed', 'error');
    } finally {
      setSaving(null);
    }
  };

  return (
    <DashboardLayout
      currentPath="/admin/clients"
      setPathname={setPathname}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Clients' }]}
    >
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: '#0d1117', border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`, borderRadius: '0.75rem', padding: '0.85rem 1.25rem', zIndex: 9999, fontSize: '0.82rem', color: toast.type === 'error' ? '#ef4444' : '#10b981', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {toast.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Client <span style={{ color: '#10b981' }}>Management</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.3rem 0 0' }}>
              {loading ? 'Loading...' : `${filtered.length} of ${clients.length} members · ${totalPages > 1 ? `Page ${safePage}/${totalPages} · ` : ''}Live from Supabase`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={fetchClients}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.6rem', cursor: 'pointer', color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600 }}
              title="Refresh"
            >
              <RefreshCw size={13} strokeWidth={1.5} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.2rem', background: '#10b981', border: 'none', borderRadius: '0.65rem', cursor: 'pointer', color: '#030712', fontSize: '0.82rem', fontWeight: 800 }}>
              <UserPlus size={15} strokeWidth={2} />
              Add Member
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.82rem' }}>
            <AlertCircle size={15} strokeWidth={1.5} />
            {error}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem' }}>
            <Search size={14} color="#6b7280" strokeWidth={1.5} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f9fafb', fontSize: '0.82rem', fontFamily: 'inherit' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setTierOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', cursor: 'pointer', color: '#d1d5db', fontSize: '0.8rem', fontWeight: 600 }}>
              <Filter size={13} strokeWidth={1.5} />
              {tierFilter}
              <ChevronDown size={12} color="#6b7280" style={{ transform: tierOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {tierOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setTierOpen(false)} />
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.65rem', overflow: 'hidden', zIndex: 50, minWidth: 160 }}>
                  {TIER_FILTERS.map(t => (
                    <button key={t} onClick={() => { setTierFilter(t); setTierOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', background: t === tierFilter ? 'rgba(16,185,129,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: t === tierFilter ? '#10b981' : '#9ca3af', fontSize: '0.8rem', fontWeight: t === tierFilter ? 700 : 400 }}
                    >{t}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>
          {/* Table Head */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 1.5fr 1fr 1fr 1fr auto', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            {['Member', 'Email', 'Role', 'Tier', 'Status', 'Expiry', 'Joined', ''].map(h => (
              <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
            ))}
          </div>

          {/* Table Body */}
          {loading ? (
            [1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)
          ) : paginated.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#4b5563', fontSize: '0.85rem' }}>
              {clients.length === 0 ? 'No members found in database.' : 'No clients match your search.'}
            </div>
          ) : (
            paginated.map((client, i) => {
              const roleCfg = ROLE_CONFIG[client.role] ?? ROLE_CONFIG.user;
              const initials = getInitials(client.full_name, client.email);
              const tier = client.membership_tier ?? 'Unassigned';
              const joined = client.created_at ? new Date(client.created_at).toLocaleDateString('en-GB') : '—';
              const expiry = client.membership_expires_at ? new Date(client.membership_expires_at).toLocaleDateString('en-GB') : 'No Expiry';
              const isSaving = saving === client.id;
              
              const isExpired = client.membership_expires_at && new Date(client.membership_expires_at) < new Date();

              return (
                <div key={client.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 1.5fr 1fr 1fr 1fr auto', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: i < paginated.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s', opacity: isSaving ? 0.5 : 1 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {client.avatar_url ? (
                      <img src={client.avatar_url} alt={initials} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#10b981', flexShrink: 0 }}>{initials}</div>
                    )}
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f9fafb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.full_name ?? '—'}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.email}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: roleCfg.color, background: `${roleCfg.color}15`, padding: '0.2rem 0.5rem', borderRadius: '0.3rem', display: 'inline-block' }}>{roleCfg.label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{tier}</span>
                  <StatusBadge status={client.status} />
                  <span style={{ fontSize: '0.72rem', color: isExpired ? '#ef4444' : '#6b7280', fontWeight: isExpired ? 700 : 400 }}>{expiry}</span>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{joined}</span>
                  <ActionMenu client={client} onAction={handleAction} />
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
            <span style={{ fontSize: '0.72rem', color: '#4b5563' }}>
              Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                style={{ padding: '0.4rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.5rem', cursor: safePage === 1 ? 'not-allowed' : 'pointer', color: safePage === 1 ? '#374151' : '#9ca3af', fontSize: '0.78rem', fontWeight: 600 }}
              >← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .map((p, idx, arr) => (
                  <>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span key={`ellipsis-${p}`} style={{ padding: '0.4rem 0.5rem', color: '#374151', fontSize: '0.78rem' }}>…</span>}
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{ padding: '0.4rem 0.75rem', background: p === safePage ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${p === safePage ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.09)'}`, borderRadius: '0.5rem', cursor: 'pointer', color: p === safePage ? '#10b981' : '#9ca3af', fontSize: '0.78rem', fontWeight: p === safePage ? 800 : 400 }}
                    >{p}</button>
                  </>
                ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                style={{ padding: '0.4rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.5rem', cursor: safePage === totalPages ? 'not-allowed' : 'pointer', color: safePage === totalPages ? '#374151' : '#9ca3af', fontSize: '0.78rem', fontWeight: 600 }}
              >Next →</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
