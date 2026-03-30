import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {
  Search, UserPlus, MoreVertical, Shield, Ban, Eye,
  CheckCircle, Clock, XCircle, ChevronDown, Filter
} from 'lucide-react';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_CLIENTS = [
  { id: 1, name: 'James Thornton', email: 'james.t@example.com', role: 'client', tier: 'Elite Expert', status: 'active', joined: '2026-02-01', avatar: 'JT' },
  { id: 2, name: 'Aisha Rahman', email: 'aisha.r@example.com', role: 'client', tier: 'Base Expert', status: 'active', joined: '2026-01-15', avatar: 'AR' },
  { id: 3, name: 'Marcus Webb', email: 'marcus.w@example.com', role: 'user', tier: '7-Day Trial', status: 'pending', joined: '2026-03-28', avatar: 'MW' },
  { id: 4, name: 'Lea Voss', email: 'lea.v@example.com', role: 'client', tier: 'Elite Expert', status: 'active', joined: '2026-01-05', avatar: 'LV' },
  { id: 5, name: 'Daniel Kahn', email: 'daniel.k@example.com', role: 'client', tier: 'Base Expert', status: 'active', joined: '2026-02-18', avatar: 'DK' },
  { id: 6, name: 'Ben Clarke', email: 'ben.c@example.com', role: 'client', tier: 'Elite Expert', status: 'active', joined: '2025-12-10', avatar: 'BC' },
  { id: 7, name: 'Nour Hassan', email: 'nour.h@example.com', role: 'client', tier: 'Base Expert', status: 'active', joined: '2026-03-01', avatar: 'NH' },
  { id: 8, name: 'Sofia Melo', email: 'sofia.m@example.com', role: 'user', tier: 'Unassigned', status: 'banned', joined: '2026-02-22', avatar: 'SM' },
];

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

function ActionMenu({ client, onAction }: { client: typeof MOCK_CLIENTS[0]; onAction: (a: string, c: typeof MOCK_CLIENTS[0]) => void }) {
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
              { label: client.status === 'banned' ? 'Unban' : 'Ban User', icon: Ban, color: '#ef4444' },
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

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminClients({ setPathname }: { setPathname: (p: string) => void }) {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('All Tiers');
  const [tierOpen, setTierOpen] = useState(false);
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === 'All Tiers' || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = (action: string, client: typeof MOCK_CLIENTS[0]) => {
    if (action === 'Ban User' || action === 'Unban') {
      setClients(prev => prev.map(c => c.id === client.id ? { ...c, status: c.status === 'banned' ? 'active' : 'banned' } : c));
      showToast(`${client.name} has been ${client.status === 'banned' ? 'unbanned' : 'banned'}.`);
    } else if (action === 'Change Role') {
      const next = client.role === 'client' ? 'user' : 'client';
      setClients(prev => prev.map(c => c.id === client.id ? { ...c, role: next } : c));
      showToast(`${client.name}'s role changed to ${next}.`);
    } else {
      showToast(`Viewing profile for ${client.name}.`);
    }
  };

  return (
    <DashboardLayout
      currentPath="/admin/clients"
      setPathname={setPathname}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Clients' }]}
    >
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: '#0d1117', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.85rem 1.25rem', zIndex: 9999, fontSize: '0.82rem', color: '#f9fafb', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Client <span style={{ color: '#10b981' }}>Management</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.3rem 0 0' }}>{filtered.length} of {clients.length} members</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.2rem', background: '#10b981', border: 'none', borderRadius: '0.65rem', cursor: 'pointer', color: '#030712', fontSize: '0.82rem', fontWeight: 800 }}>
            <UserPlus size={15} strokeWidth={2} />
            Add Member
          </button>
        </div>

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
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.65rem', overflow: 'hidden', zIndex: 50, minWidth: 160 }}>
                {TIER_FILTERS.map(t => (
                  <button key={t} onClick={() => { setTierFilter(t); setTierOpen(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', background: t === tierFilter ? 'rgba(16,185,129,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: t === tierFilter ? '#10b981' : '#9ca3af', fontSize: '0.8rem', fontWeight: t === tierFilter ? 700 : 400 }}
                  >{t}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>
          {/* Table Head */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1fr 1fr auto', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            {['Member', 'Email', 'Role', 'Tier', 'Status', 'Joined', ''].map(h => (
              <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
            ))}
          </div>

          {/* Table Body */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#4b5563', fontSize: '0.85rem' }}>No clients match your search.</div>
          ) : (
            filtered.map((client, i) => {
              const roleCfg = ROLE_CONFIG[client.role] ?? ROLE_CONFIG.user;
              return (
                <div key={client.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1.5fr 1fr 1fr auto', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#10b981', flexShrink: 0 }}>{client.avatar}</div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f9fafb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.name}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.email}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: roleCfg.color, background: `${roleCfg.color}15`, padding: '0.2rem 0.5rem', borderRadius: '0.3rem', display: 'inline-block' }}>{roleCfg.label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{client.tier}</span>
                  <StatusBadge status={client.status} />
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{client.joined}</span>
                  <ActionMenu client={client} onAction={handleAction} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
