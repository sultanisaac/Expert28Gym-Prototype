import { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Search, Download, DollarSign, CheckCircle, Clock, XCircle, Filter, ChevronDown } from 'lucide-react';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_PAYMENTS = [
  { id: 'txn_001', member: 'James Thornton', email: 'james.t@example.com', plan: 'Elite Expert', amount: 149, currency: 'USD', status: 'paid', date: '2026-03-30', method: 'Stripe' },
  { id: 'txn_002', member: 'Aisha Rahman', email: 'aisha.r@example.com', plan: 'Base Expert', amount: 100, currency: 'USD', status: 'paid', date: '2026-03-29', method: 'Stripe' },
  { id: 'txn_003', member: 'Lea Voss', email: 'lea.v@example.com', plan: 'Elite Expert', amount: 149, currency: 'USD', status: 'paid', date: '2026-03-28', method: 'Stripe' },
  { id: 'txn_004', member: 'Marcus Webb', email: 'marcus.w@example.com', plan: '7-Day Trial', amount: 40, currency: 'USD', status: 'pending', date: '2026-03-28', method: 'Stripe' },
  { id: 'txn_005', member: 'Daniel Kahn', email: 'daniel.k@example.com', plan: 'Base Expert', amount: 100, currency: 'USD', status: 'paid', date: '2026-03-27', method: 'Stripe' },
  { id: 'txn_006', member: 'Nour Hassan', email: 'nour.h@example.com', plan: 'Base Expert', amount: 100, currency: 'USD', status: 'paid', date: '2026-03-25', method: 'Stripe' },
  { id: 'txn_007', member: 'Ben Clarke', email: 'ben.c@example.com', plan: 'Elite Expert', amount: 149, currency: 'USD', status: 'refunded', date: '2026-03-22', method: 'Stripe' },
  { id: 'txn_008', member: 'Sofia Melo', email: 'sofia.m@example.com', plan: 'Base Expert', amount: 100, currency: 'USD', status: 'failed', date: '2026-03-20', method: 'Stripe' },
];

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  paid:     { label: 'Paid',     color: '#10b981', icon: CheckCircle },
  pending:  { label: 'Pending',  color: '#f59e0b', icon: Clock },
  refunded: { label: 'Refunded', color: '#3b82f6', icon: DollarSign },
  failed:   { label: 'Failed',   color: '#ef4444', icon: XCircle },
};

const STATUS_FILTERS = ['All', 'paid', 'pending', 'refunded', 'failed'];

// ─── SUMMARY STAT ─────────────────────────────────────────────────────────────

function SummaryStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.85rem', flex: 1, minWidth: 140 }}>
      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.03em', color, margin: '0.3rem 0 0' }}>{value}</p>
    </div>
  );
}

// ─── EXPORT CSV ───────────────────────────────────────────────────────────────

function exportCSV(data: typeof MOCK_PAYMENTS) {
  const headers = ['ID', 'Member', 'Email', 'Plan', 'Amount', 'Currency', 'Status', 'Date', 'Method'];
  const rows = data.map(p => [p.id, p.member, p.email, p.plan, p.amount, p.currency, p.status, p.date, p.method]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'payments_export.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminPayments({ setPathname }: { setPathname: (p: string) => void }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusOpen, setStatusOpen] = useState(false);

  const filtered = MOCK_PAYMENTS.filter(p => {
    const matchSearch = p.member.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = MOCK_PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = MOCK_PAYMENTS.filter(p => p.status === 'pending').length;
  const refunded = MOCK_PAYMENTS.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);

  return (
    <DashboardLayout currentPath="/admin/payments" setPathname={setPathname} breadcrumbs={[{ label: 'Admin' }, { label: 'Payments' }]}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Payment <span style={{ color: '#3b82f6' }}>Logs</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.3rem 0 0' }}>{filtered.length} transactions · Stripe-synced</p>
          </div>
          <button
            onClick={() => exportCSV(filtered)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.2rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '0.65rem', cursor: 'pointer', color: '#3b82f6', fontSize: '0.82rem', fontWeight: 700 }}
          >
            <Download size={14} strokeWidth={1.5} />
            Export CSV
          </button>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <SummaryStat label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="#10b981" />
          <SummaryStat label="Pending" value={`${pending}`} color="#f59e0b" />
          <SummaryStat label="Refunded" value={`$${refunded}`} color="#3b82f6" />
          <SummaryStat label="Total Transactions" value={`${MOCK_PAYMENTS.length}`} color="#f9fafb" />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem' }}>
            <Search size={14} color="#6b7280" strokeWidth={1.5} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by member, email or transaction ID..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f9fafb', fontSize: '0.82rem', fontFamily: 'inherit' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setStatusOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', cursor: 'pointer', color: '#d1d5db', fontSize: '0.8rem', fontWeight: 600 }}>
              <Filter size={13} strokeWidth={1.5} />
              {statusFilter === 'All' ? 'All Statuses' : STATUS_CFG[statusFilter]?.label}
              <ChevronDown size={12} color="#6b7280" style={{ transform: statusOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {statusOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.65rem', overflow: 'hidden', zIndex: 50, minWidth: 160 }}>
                {STATUS_FILTERS.map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', background: s === statusFilter ? 'rgba(59,130,246,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: s === statusFilter ? '#3b82f6' : '#9ca3af', fontSize: '0.8rem', fontWeight: s === statusFilter ? 700 : 400 }}
                  >{s === 'All' ? 'All Statuses' : STATUS_CFG[s]?.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 0.8fr 1fr 1fr', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            {['Transaction ID', 'Member', 'Plan', 'Amount', 'Status', 'Date'].map(h => (
              <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#4b5563', fontSize: '0.85rem' }}>No transactions match your filter.</div>
          ) : (
            filtered.map((p, i) => {
              const cfg = STATUS_CFG[p.status] ?? STATUS_CFG.pending;
              const Icon = cfg.icon;
              return (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 0.8fr 1fr 1fr', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#6b7280' }}>{p.id}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#f9fafb' }}>{p.member}</p>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280' }}>{p.email}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{p.plan}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f9fafb' }}>${p.amount}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: cfg.color, background: `${cfg.color}15`, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                    <Icon size={10} strokeWidth={2} />
                    {cfg.label}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{p.date}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
