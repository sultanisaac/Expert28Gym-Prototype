import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, Zap, Shield, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  goal: z.string().min(10, "Please tell us a bit more about your fitness goal"),
});

type FormData = z.infer<typeof formSchema>;

export default function ApplyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Elite Expert');

  // Parse URL params for plan and cancellation status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('cancelled')) setIsCancelled(true);
    if (params.get('plan')) {
      const p = params.get('plan');
      setSelectedPlan(p === 'base' ? 'Base Expert' : p === 'trial' ? '7-Day Trial' : 'Elite Expert');
    }
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, plan: selectedPlan }),
      });

      const result = await response.json();
      if (response.ok && result.url) {
        window.location.href = result.url; // Redirect to Stripe
      } else {
        throw new Error(result.error || 'Failed to initiate checkout');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#030712', minHeight: '100vh', color: '#f9fafb', position: 'relative', overflowX: 'hidden', padding: '5rem 2rem' }}>
      {/* Background Orbs */}
      <div className="orb" style={{ width: '40vw', height: '40vw', background: 'var(--emerald)', top: '-10%', left: '-10%', opacity: 0.15 }} />
      <div className="orb" style={{ width: '30vw', height: '30vw', background: 'var(--blue-cta)', bottom: '5%', right: '-5%', opacity: 0.1 }} />

      <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <button 
          onClick={() => window.location.href = '/'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginBottom: '2rem' }}
        >
          <ArrowLeft size={16} /> Back to home
        </button>

        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
            The <span style={{ color: '#10b981' }}>Expert28</span> Application.
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.7 }}>
            Complete your details below to secure your spot and start your transformation.
          </p>
        </div>

        {isCancelled && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <AlertTriangle color="#f59e0b" size={20} />
            <p style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 500 }}>
              Payment was cancelled. Your application details are still here if you want to try again.
            </p>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', color: '#ef4444', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          {/* Plan Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Selected Plan</p>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedPlan}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>{selectedPlan === 'Base Expert' ? '$29' : selectedPlan === '7-Day Trial' ? '$8' : '$49'}</p>
              <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>One-time payment</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="form-grid">
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.5rem' }}>Full Name</label>
                <input 
                  {...register('name')}
                  placeholder="John Doe"
                  className="form-input"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#f9fafb', fontSize: '0.9rem' }}
                />
                {errors.name && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.name.message}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.5rem' }}>Email Address</label>
                <input 
                  {...register('email')}
                  placeholder="john@example.com"
                  className="form-input"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#f9fafb', fontSize: '0.9rem' }}
                />
                {errors.email && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.5rem' }}>Phone Number</label>
              <input 
                {...register('phone')}
                placeholder="+44 7700 000000"
                className="form-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#f9fafb', fontSize: '0.9rem' }}
              />
              {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.phone.message}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.5rem' }}>Your Training Goal</label>
              <textarea 
                {...register('goal')}
                placeholder="Tell us what you want to achieve in 28 days..."
                rows={4}
                className="form-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#f9fafb', fontSize: '0.9rem', resize: 'none' }}
              />
              {errors.goal && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.25rem' }}>{errors.goal.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-blue"
              style={{ width: '100%', padding: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 700 }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} fill="currentColor" />}
              {loading ? 'Processing...' : 'Pay & Apply Securely'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem', opacity: 0.5 }}>
              <Shield size={14} />
              <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Secure encrypted payment via Stripe</span>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
        .form-input:focus {
          outline: none;
          border-color: rgba(16, 185, 129, 0.4) !important;
          background: rgba(16, 185, 129, 0.05) !important;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
