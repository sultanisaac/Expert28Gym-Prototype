import { X, Zap, ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
}

export default function JoinModal({ isOpen, onClose, selectedPlan }: JoinModalProps) {
  if (!isOpen) return null;

  const planValue = selectedPlan.toLowerCase().includes('base') ? 'base' : selectedPlan.toLowerCase().includes('trial') ? 'trial' : 'elite';
  const price = planValue === 'base' ? '$100' : planValue === 'trial' ? '$40' : '$149';

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
          <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Transformation Plan</p>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            {selectedPlan}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>{price}</span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>/ one-time</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '0.4rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Zap size={16} color="#10b981" />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>Full 6x/week elite access</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '0.4rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={16} color="#10b981" />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>Expert assessment & kit included</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '0.4rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={16} color="#10b981" />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>Cancellable any time</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 32, height: 32, borderRadius: '0.4rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={16} color="#10b981" />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: 500 }}>Guaranteed 28-day progression</p>
          </div>
        </div>

        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', marginBottom: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>Join 500+ athletes already in the lab</p>
        </div>

        <button 
          onClick={() => window.location.href = `/apply?plan=${planValue}`}
          className="btn-blue"
          style={{ width: '100%', padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
        >
          Continue to Application <ArrowRight size={18} />
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
