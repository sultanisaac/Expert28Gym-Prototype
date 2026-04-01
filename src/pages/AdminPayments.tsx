import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { supabase } from '../lib/supabase';
import {
  Search, Download, DollarSign, CheckCircle, Clock,
  XCircle, Filter, ChevronDown, RefreshCw, AlertCircle, RotateCcw
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface PaymentRecord {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  amount: number | null;
  currency: string;
  status: string | null;
  created_at: string | null;
  // joined from profiles
  member_name?: string;
  member_email?: string;
  membership_tier?: string;
}

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  paid:      { label: 'Paid',      color: '#10b981', icon: CheckCircle },
  completed: { label: 'Paid',      color: '#10b981', icon: CheckCircle },
  pending:   { label: 'Pending',   color: '#f59e0b', icon: Clock },
  refunded:  { label: 'Refunded',  color: '#3b82f6', icon: DollarSign },
  failed:    { label: 'Failed',    color: '#ef4444', icon: XCircle },
};

const STATUS_FILTERS = ['All', 'paid', 'completed', 'pending', 'refunded', 'failed'];

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

function exportCSV(data: PaymentRecord[]) {
  const headers = ['ID', 'Member', 'Email', 'Tier', 'Amount', 'Currency', 'Status', 'Date', 'Stripe Session'];
  const rows = data.map(p => [
    p.id,
    p.member_name ?? 'Unknown',
    p.member_email ?? '—',
    p.membership_tier ?? '—',
    p.amount ?? 0,
    p.currency,
    p.status ?? '—',
    p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB') : '—',
    p.stripe_session_id ?? '—',
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'payments_export.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ─── SKELETON ────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 0.8fr 1fr 1fr', gap: '0.5rem', padding: '0.85rem 1.25rem', alignItems: 'center' }}>
      {[120, 160, 120, 60, 70, 80].map((w, i) => (
        <div key={i} style={{ height: 14, width: w, borderRadius: 4, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  );
}

const PAGE_SIZE = 25;

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminPayments({ setPathname }: { setPathname: (p: string) => void }) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusOpen, setStatusOpen] = useState(false);
  const [page, setPage] = useState(1);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch payment_history joined with profiles
      const { data, error: err } = await supabase
        .from('payment_history')
        .select(`
          id,
          user_id,
          stripe_session_id,
          amount,
          currency,
          status,
          created_at,
          profiles (
            full_name,
            email,
            membership_tier
          )
        `)
        .order('created_at', { ascending: false });

      if (err) throw err;

      interface PaymentJoinResult {
        id: string;
        user_id: string | null;
        stripe_session_id: string | null;
        amount: number | null;
        currency: string | null;
        status: string | null;
        created_at: string | null;
        profiles: {
          full_name: string | null;
          email: string | null;
          membership_tier: string | null;
        } | null;
      }

      const mapped: PaymentRecord[] = (data as unknown as PaymentJoinResult[] ?? []).map((p) => ({
        id: p.id,
        user_id: p.user_id,
        stripe_session_id: p.stripe_session_id,
        amount: p.amount,
        currency: p.currency ?? 'USD',
        status: p.status,
        created_at: p.created_at,
        member_name: p.profiles?.full_name ?? undefined,
        member_email: p.profiles?.email ?? undefined,
        membership_tier: p.profiles?.membership_tier ?? undefined,
      }));

      setPayments(mapped);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filtered = payments.filter(p => {
    const matchSearch = (p.member_name ?? '').toLowerCase().includes(search.toLowerCase())
      || (p.member_email ?? '').toLowerCase().includes(search.toLowerCase())
      || (p.stripe_session_id ?? '').includes(search)
      || p.id.includes(search);
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const paidPayments = payments.filter(p => p.status === 'paid' || p.status === 'completed');
  const totalRevenue = paidPayments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const refundedAmount = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + (p.amount ?? 0), 0);

  const getStatusCfg = (status: string | null) => STATUS_CFG[status ?? 'pending'] ?? STATUS_CFG.pending;

  return (
    <DashboardLayout currentPath="/admin/payments" setPathname={setPathname} breadcrumbs={[{ label: 'Admin' }, { label: 'Payments' }]}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} } @keyframes spin { to{transform:rotate(360deg)} }`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1100 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Payment <span style={{ color: '#3b82f6' }}>Logs</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0.3rem 0 0' }}>
              {loading ? 'Loading...' : `${filtered.length} transactions · ${totalPages > 1 ? `Page ${safePage}/${totalPages} · ` : ''}Live from Supabase`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={fetchPayments}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.6rem', cursor: 'pointer', color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600 }}
              title="Refresh"
            >
              <RefreshCw size={13} strokeWidth={1.5} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <button
              onClick={() => exportCSV(filtered)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.2rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '0.65rem', cursor: 'pointer', color: '#3b82f6', fontSize: '0.82rem', fontWeight: 700 }}
            >
              <Download size={14} strokeWidth={1.5} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.85rem 1.1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.65rem', color: '#ef4444', fontSize: '0.82rem' }}>
            <AlertCircle size={15} strokeWidth={1.5} />
            {error}
            <button onClick={fetchPayments} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.75rem' }}>
              <RotateCcw size={12} /> Retry
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && payments.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <SummaryStat label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} color="#10b981" />
            <SummaryStat label="Pending" value={`${pendingCount}`} color="#f59e0b" />
            <SummaryStat label="Refunded" value={`$${refundedAmount}`} color="#3b82f6" />
            <SummaryStat label="Total Transactions" value={`${payments.length}`} color="#f9fafb" />
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem' }}>
            <Search size={14} color="#6b7280" strokeWidth={1.5} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by member, email, or session ID..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f9fafb', fontSize: '0.82rem', fontFamily: 'inherit' }} />
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setStatusOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', cursor: 'pointer', color: '#d1d5db', fontSize: '0.8rem', fontWeight: 600 }}>
              <Filter size={13} strokeWidth={1.5} />
              {statusFilter === 'All' ? 'All Statuses' : STATUS_CFG[statusFilter]?.label ?? statusFilter}
              <ChevronDown size={12} color="#6b7280" style={{ transform: statusOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {statusOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setStatusOpen(false)} />
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.65rem', overflow: 'hidden', zIndex: 50, minWidth: 160 }}>
                  {STATUS_FILTERS.map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); setStatusOpen(false); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 1rem', background: s === statusFilter ? 'rgba(59,130,246,0.1)' : 'transparent', border: 'none', cursor: 'pointer', color: s === statusFilter ? '#3b82f6' : '#9ca3af', fontSize: '0.8rem', fontWeight: s === statusFilter ? 700 : 400 }}
                    >{s === 'All' ? 'All Statuses' : STATUS_CFG[s]?.label ?? s}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table - Responsive Container */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflowX: 'auto' }}>
          <div style={{ minWidth: 800 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 0.8fr 1fr 1fr', gap: '0.5rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              {['Session ID', 'Member', 'Tier', 'Amount', 'Status', 'Date'].map(h => (
                <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
              ))}
            </div>

            {loading ? (
              [1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)
            ) : paginated.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#4b5563', fontSize: '0.85rem' }}>
                {payments.length === 0 ? 'No payments recorded yet. Payments will appear here once Stripe integration is active.' : 'No transactions match your filter.'}
              </div>
            ) : (
              paginated.map((p, i) => {
                const cfg = getStatusCfg(p.status);
                const Icon = cfg.icon;
                const sessionShort = p.stripe_session_id ? `...${p.stripe_session_id.slice(-10)}` : p.id.slice(0, 8);
                const date = p.created_at ? new Date(p.created_at).toLocaleDateString('en-GB') : '—';
                return (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 0.8fr 1fr 1fr', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: i < paginated.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#6b7280' }} title={p.stripe_session_id ?? p.id}>{sessionShort}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#f9fafb' }}>{p.member_name ?? '—'}</p>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280' }}>{p.member_email ?? '—'}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{p.membership_tier ?? '—'}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f9fafb' }}>${p.amount?.toLocaleString() ?? '—'}</span>
                    <div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.65rem', fontWeight: 700, color: cfg.color, background: `${cfg.color}15`, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                        <Icon size={10} strokeWidth={2} />
                        {cfg.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{date}</span>
                  </div>
                );
              })
            )}
          </div>
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
                .filter(pg => pg === 1 || pg === totalPages || Math.abs(pg - safePage) <= 1)
                .map((pg, idx, arr) => (
                  <>
                    {idx > 0 && arr[idx - 1] !== pg - 1 && <span key={`ellipsis-${pg}`} style={{ padding: '0.4rem 0.5rem', color: '#374151', fontSize: '0.78rem' }}>…</span>}
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      style={{ padding: '0.4rem 0.75rem', background: pg === safePage ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${pg === safePage ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.09)'}`, borderRadius: '0.5rem', cursor: 'pointer', color: pg === safePage ? '#3b82f6' : '#9ca3af', fontSize: '0.78rem', fontWeight: pg === safePage ? 800 : 400 }}
                    >{pg}</button>
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
