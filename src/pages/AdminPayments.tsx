import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { supabase } from '../lib/supabase';
import {
  Search, CheckCircle, Clock,
  XCircle, RefreshCw,
  Edit2
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
  member_name?: string;
  member_email?: string;
  membership_tier?: string;
}

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  badge: string;
  stripe_product_id: string;
  stripe_price_id: string;
  is_active: boolean;
  updated_at: string;
}

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  paid:      { label: 'Paid',      color: '#10b981', icon: CheckCircle },
  completed: { label: 'Paid',      color: '#10b981', icon: CheckCircle },
  pending:   { label: 'Pending',   color: '#f59e0b', icon: Clock },
  refunded:  { label: 'Refunded',  color: '#3b82f6', icon: CheckCircle },
  failed:    { label: 'Failed',    color: '#ef4444', icon: XCircle },
};

// ─── SUMMARY STAT ─────────────────────────────────────────────────────────────

function SummaryStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.85rem', flex: 1, minWidth: 140 }}>
      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
      <p style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.03em', color, margin: '0.3rem 0 0' }}>{value}</p>
    </div>
  );
}

// ─── SKELETON ────────────────────────────────────────────────────────────────

function SkeletonRow({ cols }: { cols: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '0.5rem', padding: '0.85rem 1.25rem', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} style={{ height: 14, width: '80%', borderRadius: 4, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  );
}

const PAGE_SIZE = 25;

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AdminPayments({ setPathname }: { setPathname: (p: string) => void }) {
  const [activeTab, setActiveTab] = useState<'logs' | 'plans'>('logs');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter] = useState('All');
  const [page] = useState(1);
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'logs') {
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
        setPayments((data as any[] ?? []).map(p => ({
          ...p,
          member_name: p.profiles?.full_name,
          member_email: p.profiles?.email,
          membership_tier: p.profiles?.membership_tier,
        })));
      } else {
        const { data, error: err } = await supabase
          .from('membership_plans')
          .select('*')
          .order('price', { ascending: true });

        if (err) throw err;
        setPlans(data ?? []);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleManagePlan = async (action: 'create' | 'update' | 'delete', data?: any, planId?: string) => {
    setUpdatingPlanId(planId || 'new');
    try {
      const response = await fetch('/api/manage-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, plan_id: planId, data }),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || `Failed to ${action} plan`);

      await fetchData();
      return resData;
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUpdatingPlanId(null);
    }
  };

  const filtered = payments.filter(p => {
    const matchSearch = (p.member_name ?? '').toLowerCase().includes(search.toLowerCase())
      || (p.member_email ?? '').toLowerCase().includes(search.toLowerCase())
      || (p.stripe_session_id ?? '').includes(search);
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout currentPath="/admin/payments" setPathname={setPathname} breadcrumbs={[{ label: 'Admin' }, { label: 'Payments' }]}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} } @keyframes spin { to{transform:rotate(360deg)} }`}</style>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 1100 }}>
        
        {/* Header & Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
              Payment <span style={{ color: '#3b82f6' }}>Dashboard</span>
            </h1>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
              <button 
                onClick={() => setActiveTab('logs')}
                style={{ padding: '0.4rem 0.8rem', background: activeTab === 'logs' ? 'rgba(59,130,246,0.1)' : 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === 'logs' ? '#3b82f6' : 'transparent'}`, color: activeTab === 'logs' ? '#3b82f6' : '#6b7280', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >Transactions</button>
              <button 
                onClick={() => setActiveTab('plans')}
                style={{ padding: '0.4rem 0.8rem', background: activeTab === 'plans' ? 'rgba(59,130,246,0.1)' : 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === 'plans' ? '#3b82f6' : 'transparent'}`, color: activeTab === 'plans' ? '#3b82f6' : '#6b7280', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
              >Manage Plans</button>
            </div>
          </div>
          <button onClick={fetchData} style={{ padding: '0.55rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.6rem', cursor: 'pointer' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>

        {activeTab === 'logs' ? (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <SummaryStat label="Total Revenue" value={`$${payments.filter(p => p.status === 'paid').reduce((s, p) => s + (p.amount ?? 0), 0).toLocaleString()}`} color="#10b981" />
              <SummaryStat label="Transactions" value={`${payments.length}`} color="#f9fafb" />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem' }}>
                <Search size={14} color="#6b7280" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.8rem', width: '100%' }} />
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflowX: 'auto' }}>
              <div style={{ minWidth: 800 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 0.8fr 1fr 1fr', gap: '0.5rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  {['Session ID', 'Member', 'Tier', 'Amount', 'Status', 'Date'].map(h => <span key={h} style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase' }}>{h}</span>)}
                </div>
                {loading ? <SkeletonRow cols="1.2fr 2fr 1.5fr 0.8fr 1fr 1fr" /> : paginated.map(p => (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 0.8fr 1fr 1fr', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', fontFamily: 'monospace' }}>{p.stripe_session_id?.slice(-10) || p.id.slice(0, 8)}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>{p.member_name || '—'}</p>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280' }}>{p.member_email || '—'}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem' }}>{p.membership_tier}</span>
                    <span style={{ fontWeight: 800 }}>${p.amount}</span>
                    <span style={{ fontSize: '0.65rem', color: STATUS_CFG[p.status || 'pending']?.color, background: `${STATUS_CFG[p.status || 'pending']?.color}15`, padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>{p.status}</span>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Plans Management View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div 
              onClick={() => {
                const name = prompt('Plan Name:');
                if (!name) return;
                handleManagePlan('create', { name, description: 'New plan description', price: 99, interval: 'month', features: ['Feature 1'] });
              }}
              style={{ background: 'rgba(59,130,246,0.05)', border: '2px dashed rgba(59,130,246,0.2)', borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', cursor: 'pointer', minHeight: 400 }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                <Edit2 size={24} />
              </div>
              <p style={{ fontWeight: 800, color: '#3b82f6' }}>Create New Plan</p>
            </div>

            {loading ? [1,2].map(i => <div key={i} style={{ height: 400, background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }} />) : plans.map(plan => (
              <div key={plan.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input 
                      defaultValue={plan.name}
                      onBlur={(e) => { if (e.target.value !== plan.name) handleManagePlan('update', { name: e.target.value }, plan.id); }}
                      style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 800, color: '#fff', width: '100%', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.4rem' }}>
                      <input 
                        type="checkbox" 
                        checked={plan.is_active} 
                        onChange={(e) => handleManagePlan('update', { is_active: e.target.checked }, plan.id)}
                        style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#10b981' }}
                      />
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: plan.is_active ? '#10b981' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {plan.is_active ? 'Live' : 'Hidden'}
                      </span>
                    </label>
                    <button 
                      onClick={() => { if (confirm('Delete this plan?')) handleManagePlan('delete', {}, plan.id); }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Description</p>
                  <textarea 
                    defaultValue={plan.description}
                    onBlur={(e) => { if (e.target.value !== plan.description) handleManagePlan('update', { description: e.target.value }, plan.id); }}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', color: '#d1d5db', fontSize: '0.75rem', padding: '0.6rem', width: '100%', minHeight: '60px', marginTop: '0.4rem', outline: 'none', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.6rem', color: '#9ca3af' }}>Price (Rp)</p>
                    <input 
                      type="number"
                      defaultValue={plan.price}
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        if (val !== plan.price && !isNaN(val)) handleManagePlan('update', { price: val }, plan.id);
                      }}
                      style={{ background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 900, color: '#fff', width: '100%', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.6rem', color: '#9ca3af' }}>Interval</p>
                    <select 
                      defaultValue={plan.interval}
                      onChange={(e) => handleManagePlan('update', { interval: e.target.value }, plan.id)}
                      style={{ background: 'none', border: 'none', fontSize: '0.9rem', color: '#fff', cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="month">Monthly</option>
                      <option value="week">Weekly</option>
                      <option value="one-time">One-time</option>
                    </select>
                  </div>
                </div>

                <div>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#9ca3af', fontWeight: 600 }}>Features (comma sep)</p>
                  <textarea 
                    defaultValue={plan.features?.join(', ')}
                    onBlur={(e) => {
                      const feats = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                      handleManagePlan('update', { features: feats }, plan.id);
                    }}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', color: '#d1d5db', fontSize: '0.75rem', padding: '0.6rem', width: '100%', minHeight: '60px', marginTop: '0.4rem', outline: 'none', resize: 'none' }}
                  />
                </div>

                <div style={{ fontSize: '0.6rem', color: '#4b5563', marginTop: 'auto' }}>
                  <Clock size={10} style={{ marginRight: 4 }} />
                  Updated: {new Date(plan.updated_at).toLocaleString()}
                </div>

                {updatingPlanId === plan.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                    <RefreshCw size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
