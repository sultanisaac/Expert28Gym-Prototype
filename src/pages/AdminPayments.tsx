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
  original_price?: number;
  currency?: string;
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
interface PlanCardProps {
  plan: MembershipPlan;
  onSave: (action: 'update' | 'delete', data: any, id: string) => Promise<any>;
  isUpdating: boolean;
}

function PlanManagerCard({ plan, onSave, isUpdating }: PlanCardProps) {
  const [editedPlan, setEditedPlan] = useState<Partial<MembershipPlan>>({});
  const isDirty = Object.keys(editedPlan).length > 0;

  const getCurrencySymbol = (currency?: string) => {
    const c = (currency || 'idr').toLowerCase();
    if (c === 'idr') return 'Rp';
    if (c === 'gbp') return '£';
    return '$';
  };
  const currencySymbol = getCurrencySymbol(plan.currency);

  const currentName = editedPlan.name ?? plan.name;
  const currentDesc = editedPlan.description ?? plan.description;
  const currentPrice = editedPlan.price ?? plan.price;
  const currentInterval = editedPlan.interval ?? plan.interval;
  const currentFeatures = editedPlan.features ?? plan.features;
  const currentBadge = editedPlan.badge ?? plan.badge;
  const currentOriginalPrice = editedPlan.original_price ?? plan.original_price;

  const handleUpdate = (field: keyof MembershipPlan, value: any) => {
    // Check if value is actually different from original
    if (value === plan[field]) {
      const next = { ...editedPlan };
      delete next[field];
      setEditedPlan(next);
    } else {
      setEditedPlan(prev => ({ ...prev, [field]: value }));
    }
  };

  const saveChanges = async () => {
    if (!isDirty) return;
    const finalData = { ...editedPlan };
    if (finalData.features) {
      finalData.features = finalData.features.map(f => f.trim()).filter(f => f);
    }
    const success = await onSave('update', finalData, plan.id);
    if (success) setEditedPlan({});
  };

  return (
    <div 
      className="glass-card"
      style={{ 
        background: 'rgba(255,255,255,0.015)', 
        border: `1px solid ${isDirty ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}`, 
        borderRadius: '1.5rem', 
        padding: '1.75rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem', 
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: isDirty ? '0 0 30px rgba(59,130,246,0.05)' : 'none'
      }}
    >
      {/* Status Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ 
            width: 8, height: 8, borderRadius: '50%', 
            background: plan.is_active ? '#10b981' : '#6b7280',
            boxShadow: plan.is_active ? '0 0 10px #10b981' : 'none'
          }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: plan.is_active ? '#10b981' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {plan.is_active ? 'Live' : 'Draft'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isDirty && (
            <button 
              onClick={() => setEditedPlan({})}
              style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
            >Reset</button>
          )}
          <button 
            onClick={() => onSave('update', { is_active: !plan.is_active }, plan.id)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', color: '#fff', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {plan.is_active ? 'Archive' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Badges & Categories */}
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.65rem', color: '#6b7280', fontWeight: 800, textTransform: 'uppercase' }}>Plan Label / Badge</p>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
          {['Most Popular', 'Best Value', 'New', 'Hot'].map(b => (
            <button 
              key={b}
              onClick={() => handleUpdate('badge', b)}
              style={{ padding: '0.25rem 0.5rem', background: currentBadge === b ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${currentBadge === b ? '#10b981' : 'rgba(255,255,255,0.06)'}`, borderRadius: '0.4rem', fontSize: '0.6rem', color: currentBadge === b ? '#10b981' : '#9ca3af', fontWeight: 700, cursor: 'pointer' }}
            >{b}</button>
          ))}
          <button 
            onClick={() => handleUpdate('badge', '')}
            style={{ padding: '0.25rem 0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.4rem', fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, cursor: 'pointer' }}
          >Clear</button>
        </div>
        <input 
          value={currentBadge || ''}
          onChange={(e) => handleUpdate('badge', e.target.value)}
          placeholder="Custom badge text (e.g. Recommended)"
          style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '0.5rem', color: '#fff', fontSize: '0.75rem', padding: '0.6rem', width: '100%', outline: 'none' }}
        />
        {currentBadge && (
            <div style={{ marginTop: '0.6rem', display: 'flex' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Preview: {currentBadge}
                </span>
            </div>
        )}
      </div>

      {/* Main Content */}
      <div>
        <input 
          value={currentName}
          onChange={(e) => handleUpdate('name', e.target.value)}
          placeholder="Plan Title"
          style={{ background: 'none', border: 'none', fontSize: '1.4rem', fontWeight: 900, color: '#fff', width: '100%', outline: 'none', letterSpacing: '-0.02em' }}
        />
        <textarea 
          value={currentDesc}
          onChange={(e) => handleUpdate('description', e.target.value)}
          placeholder="Short description..."
          style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.85rem', padding: '0.5rem 0', width: '100%', minHeight: '50px', outline: 'none', resize: 'none', lineHeight: '1.4' }}
        />
      </div>

      {/* Financials */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.6rem', color: '#6b7280', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Sale Price</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontWeight: 800, color: '#10b981' }}>{currencySymbol}</span>
            <input 
              type="number"
              value={currentPrice}
              onChange={(e) => handleUpdate('price', parseFloat(e.target.value))}
              style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 900, color: '#fff', width: '100%', outline: 'none' }}
            />
          </div>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.6rem', color: '#6b7280', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Original (Before Sale)</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontWeight: 800, color: '#6b7280' }}>{currencySymbol}</span>
            <input 
              type="number"
              value={currentOriginalPrice || ''}
              onChange={(e) => handleUpdate('original_price', e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="No discount"
              style={{ background: 'none', border: 'none', fontSize: '1rem', fontWeight: 700, color: '#6b7280', width: '100%', outline: 'none', textDecoration: currentOriginalPrice ? 'line-through' : 'none' }}
            />
          </div>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.6rem', color: '#6b7280', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem' }}>Billing Interval</p>
          <select 
            value={currentInterval}
            onChange={(e) => handleUpdate('interval', e.target.value)}
            style={{ background: 'none', border: 'none', fontSize: '0.9rem', fontWeight: 700, color: '#fff', cursor: 'pointer', outline: 'none', width: '100%' }}
          >
            <option value="month" style={{ background: '#0f172a' }}>Monthly</option>
            <option value="week" style={{ background: '#0f172a' }}>Weekly</option>
            <option value="one-time" style={{ background: '#0f172a' }}>One-time</option>
          </select>
        </div>
        {currentOriginalPrice && currentOriginalPrice > currentPrice && (
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(16,185,129,0.1)', padding: '0.4rem', borderRadius: '0.5rem', gridColumn: 'span 3', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase' }}>
                    Active Sale: Save {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}%
                </span>
            </div>
        )}
      </div>

      {/* Features */}
      <div>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.65rem', color: '#6b7280', fontWeight: 800, textTransform: 'uppercase' }}>Features</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {currentFeatures?.map((f: string, idx: number) => (
            <span key={idx} style={{ padding: '0.3rem 0.6rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.4rem', fontSize: '0.65rem', color: '#93c5fd', fontWeight: 600 }}>{f}</span>
          ))}
        </div>
        <textarea 
          value={currentFeatures?.join(',') || ''}
          onChange={(e) => handleUpdate('features', e.target.value.split(','))}
          placeholder="Comma separated features..."
          style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '0.75rem', color: '#9ca3af', fontSize: '0.7rem', padding: '0.75rem', width: '100%', outline: 'none', resize: 'none' }}
        />
      </div>

      {/* Confirm Button Area */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
        {isDirty ? (
          <button 
            onClick={saveChanges}
            disabled={isUpdating}
            className="btn-blue"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
          >
            {isUpdating ? <RefreshCw size={14} className="animate-spin" style={{ animation: 'spin 1.2s linear infinite' }} /> : <CheckCircle size={14} />}
            Confirm & Sync Changes
          </button>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />
              <span style={{ fontSize: '0.55rem', color: '#4b5563', fontFamily: 'monospace' }}>Synced: {plan.stripe_price_id.slice(-8)}</span>
            </div>
            <button 
              onClick={() => { if (confirm('Delete this plan?')) onSave('delete', {}, plan.id); }}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer' }}
            >Delete Plan</button>
          </div>
        )}
      </div>

      {/* Syncing Overlay */}
      {isUpdating && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(4px)', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, gap: '1rem' }}>
          <RefreshCw size={32} className="animate-spin" style={{ animation: 'spin 1.2s linear infinite', color: '#3b82f6' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Syncing with Stripe...</span>
        </div>
      )}
    </div>
  );
}

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
  const [liveConnected, setLiveConnected] = useState(false);

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

  // ─── REAL-TIME SUBSCRIPTION ────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('payment_history_live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'payment_history' },
        async (payload) => {
          // Fetch the full row with profile join so the new row matches our format
          const { data } = await supabase
            .from('payment_history')
            .select(`id, user_id, stripe_session_id, amount, currency, status, created_at,
              profiles ( full_name, email, membership_tier )`)
            .eq('id', payload.new.id)
            .single();
          if (data) {
            const enriched = {
              ...(data as any),
              member_name: (data as any).profiles?.full_name,
              member_email: (data as any).profiles?.email,
              membership_tier: (data as any).profiles?.membership_tier,
            };
            setPayments(prev => [enriched, ...prev]);
          }
        }
      )
      .subscribe((status) => {
        setLiveConnected(status === 'SUBSCRIBED');
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>
                Payment <span style={{ color: '#3b82f6' }}>Dashboard</span>
              </h1>
              {activeTab === 'logs' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', background: liveConnected ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', border: `1px solid ${liveConnected ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.2)'}`, borderRadius: '1rem' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: liveConnected ? '#10b981' : '#6b7280', boxShadow: liveConnected ? '0 0 8px #10b981' : 'none', animation: liveConnected ? 'pulse 2s ease-in-out infinite' : 'none' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: liveConnected ? '#10b981' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {liveConnected ? 'Live' : 'Connecting...'}
                  </span>
                </div>
              )}
            </div>
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
          <button onClick={fetchData} style={{ padding: '0.55rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '0.6rem', cursor: 'pointer' }} title="Manual refresh">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>

        {activeTab === 'logs' ? (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <SummaryStat label="Total Revenue" value={`Rp ${payments.filter(p => p.status === 'paid' || p.status === 'completed').reduce((s, p) => s + (p.amount ?? 0), 0).toLocaleString()}`} color="#10b981" />
              <SummaryStat label="Transactions" value={`${payments.length}`} color="#f9fafb" />
              <SummaryStat label="Paid" value={`${payments.filter(p => p.status === 'paid' || p.status === 'completed').length}`} color="#10b981" />
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
                {loading ? <SkeletonRow cols="1.2fr 2fr 1.5fr 0.8fr 1fr 1fr" /> : paginated.map(p => {
                  const curr = (p.currency || 'idr').toLowerCase();
                  const sym = curr === 'idr' ? 'Rp' : curr === 'gbp' ? '£' : '$';
                  return (
                    <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 0.8fr 1fr 1fr', gap: '0.5rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace' }}>{p.stripe_session_id?.slice(-10) || p.id.slice(0, 8)}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700 }}>{p.member_name || '—'}</p>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280' }}>{p.member_email || '—'}</p>
                      </div>
                      <span style={{ fontSize: '0.75rem' }}>{p.membership_tier}</span>
                      <span style={{ fontWeight: 800 }}>{sym} {p.amount?.toLocaleString()}</span>
                      <span style={{ fontSize: '0.65rem', color: STATUS_CFG[p.status || 'pending']?.color, background: `${STATUS_CFG[p.status || 'pending']?.color}15`, padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>{p.status}</span>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* Plans Management View */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
            {/* Create New Plan Card */}
            <div 
              onClick={() => {
                const name = prompt('Plan Name:');
                if (!name) return;
                handleManagePlan('create', { 
                  name, 
                  description: 'Elite training program for serious athletes.', 
                  price: 99, 
                  interval: 'month', 
                  features: ['All Access'] 
                });
              }}
              className="create-plan-card"
              style={{ 
                background: 'rgba(59,130,246,0.03)', 
                border: '2px dashed rgba(59,130,246,0.2)', 
                borderRadius: '1.5rem', 
                padding: '2rem', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '1.25rem', 
                cursor: 'pointer', 
                minHeight: 450,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%', 
                background: 'rgba(59,130,246,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#3b82f6',
              }}>
                <Edit2 size={28} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 900, fontSize: '1.2rem', color: '#3b82f6', margin: 0 }}>Create New Plan</p>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>Expand your gym's offering</p>
              </div>
            </div>

            {loading ? [1,2].map(i => <div key={i} style={{ height: 450, background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem' }} />) : plans.map(plan => (
              <PlanManagerCard 
                key={plan.id} 
                plan={plan} 
                onSave={handleManagePlan} 
                isUpdating={updatingPlanId === plan.id} 
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
