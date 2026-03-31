import { CheckCircle2, Instagram, Mail, LayoutGrid } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div style={{ background: '#030712', minHeight: '100vh', color: '#f9fafb', position: 'relative', overflowX: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Background Orbs */}
      <div className="orb" style={{ width: '50vw', height: '50vw', background: 'var(--emerald)', top: '10%', left: '10%', opacity: 0.2, animationDelay: '-2s' }} />

      <div style={{ maxWidth: '540px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2.5rem', animation: 'success-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <CheckCircle2 size={56} color="#10b981" />
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Payment <span style={{ color: '#10b981' }}>Confirmed.</span>
        </h1>

        <p style={{ color: '#9ca3af', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '3rem' }}>
          You're in. Welcome to the Expert28 community. Your journey to peak performance starts now. Check your inbox for your welcome kit.
        </p>

        <div className="glass-card" style={{ padding: '2rem', textAlign: 'left', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', marginBottom: '1.5rem' }}>Next Steps</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#10b981', flexShrink: 0 }}>1</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Check your email</p>
                <p style={{ color: '#6b7280', fontSize: '0.78rem' }}>We've sent a detailed welcome guide to your inbox with your first training block.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#10b981', flexShrink: 0 }}>2</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Follow the lab</p>
                <p style={{ color: '#6b7280', fontSize: '0.78rem' }}>Join our community on Instagram for daily performance tips and athlete spotlights.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#10b981', flexShrink: 0 }}>3</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>Schedule Assessment</p>
                <p style={{ color: '#6b7280', fontSize: '0.78rem' }}>A coach will reach out within 24 hours to book your on-site assessment.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexDirection: 'column', alignItems: 'center' }}>
          <button 
            onClick={() => window.location.href = '/client/dashboard'}
            className="btn-blue"
            style={{ padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '280px', justifyContent: 'center' }}
          >
            Go to My Dashboard <LayoutGrid size={20} />
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}
          >
            Back to Home
          </button>
        </div>

        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem', opacity: 0.5 }}>
          <Instagram size={20} />
          <Mail size={20} />
          <LayoutGrid size={20} />
        </div>
      </div>

      <style>{`
        @keyframes success-pop {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
