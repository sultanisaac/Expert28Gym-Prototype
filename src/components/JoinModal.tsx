import { X, Zap, ArrowRight, TrendingUp, Users, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { User, Profile } from '../hooks/useAuth';

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  badge: string;
  currency?: string;
  original_price?: number;
}

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: MembershipPlan | null;
  user?: User | null;
  profile?: Profile | null;
}

export default function JoinModal({ isOpen, onClose, selectedPlan, user, profile }: JoinModalProps) {
  const [loading, setLoading] = useState(false);

  const getCurrencySymbol = (currency?: string) => {
    const c = (currency || 'idr').toLowerCase();
    if (c === 'idr') return 'Rp';
    if (c === 'gbp') return '£';
    return '$';
  };

  if (!isOpen || !selectedPlan) return null;

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = `/signup?plan=${selectedPlan.name}`;
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user?.email, 
          plan: selectedPlan.name, 
          user_id: user?.id, 
          name: profile?.full_name 
        }),
      });
      const result = await response.json();
      if (response.ok && result.url) {
        window.location.href = result.url;
      } else {
        throw new Error(result.error || 'Failed to create checkout session');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(8px)' }}
      />

      {/* Modal */}
      <div 
        className="glass-card" 
        style={{ position: 'relative', width: '100%', maxWidth: '440px', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'modal-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>{selectedPlan.badge || 'Transformation Plan'}</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            {selectedPlan.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {selectedPlan.original_price && selectedPlan.original_price > selectedPlan.price && (
              <span style={{ fontSize: '1rem', color: '#6b7280', textDecoration: 'line-through', fontWeight: 600 }}>
                {getCurrencySymbol(selectedPlan.currency)}{selectedPlan.original_price.toLocaleString()}
              </span>
            )}
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>
              {getCurrencySymbol(selectedPlan.currency)} {selectedPlan.price.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>/ {selectedPlan.interval}</span>
            {selectedPlan.original_price && selectedPlan.original_price > selectedPlan.price && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem', textTransform: 'uppercase' }}>
                        Limited Time Offer: Save {Math.round(((selectedPlan.original_price - selectedPlan.price) / selectedPlan.original_price) * 100)}%
                    </span>
                </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '0.4rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={16} color="#10b981" />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>Full elite access in all zones</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '0.4rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={16} color="#10b981" />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>Join a community of dedicated athletes</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '0.4rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={16} color="#10b981" />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>No long-term contracts</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '0.4rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={16} color="#10b981" />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>Guaranteed performance progression</p>
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', marginBottom: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>{selectedPlan.description}</p>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="btn-blue"
          style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : user ? (
            <>Proceed to Payment <ArrowRight size={18} /></>
          ) : (
            <>Create Account to Join <ArrowRight size={18} /></>
          )}
        </button>
      </div>

      <style>{`
        @keyframes modal-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
