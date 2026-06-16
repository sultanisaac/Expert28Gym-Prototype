import { useEffect, useState } from 'react';
import { Dumbbell, Wrench, Clock, Instagram, Mail } from 'lucide-react';

export default function MaintenancePage() {
  const [dots, setDots] = useState('');

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030712',
      color: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', width: '40vw', height: '40vw',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
        top: '-10%', left: '-10%', borderRadius: '50%',
        animation: 'drift 8s ease-in-out infinite alternate',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '30vw', height: '30vw',
        background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)',
        bottom: '-5%', right: '-5%', borderRadius: '50%',
        animation: 'drift 10s ease-in-out infinite alternate-reverse',
        pointerEvents: 'none',
      }} />

      {/* Big watermark */}
      <div style={{
        position: 'absolute', fontSize: 'clamp(200px, 35vw, 500px)',
        fontWeight: 900, color: '#f9fafb', opacity: 0.025,
        userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.06em',
        lineHeight: 1, top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }}>28</div>

      <style>{`
        @keyframes drift {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.55s; opacity: 0; }
        .fade-up-5 { animation-delay: 0.7s; opacity: 0; }
      `}</style>

      {/* Logo */}
      <div className="fade-up fade-up-1" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src="/Logo.png" alt="Expert28" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
          Expert<span style={{ color: '#10b981' }}>28</span>
        </span>
      </div>

      {/* Icon */}
      <div className="fade-up fade-up-2" style={{ position: 'relative', marginBottom: '2.5rem' }}>
        {/* Pulse ring */}
        <div style={{
          position: 'absolute', inset: '-12px', borderRadius: '50%',
          border: '1px solid rgba(16,185,129,0.4)',
          animation: 'pulse-ring 2s ease-out infinite',
        }} />
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <Wrench size={32} color="#10b981" style={{ animation: 'spin-slow 4s linear infinite' }} />
        </div>
      </div>

      {/* Heading */}
      <div className="fade-up fade-up-3" style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '999px', padding: '0.3rem 0.9rem', marginBottom: '1.25rem',
        }}>
          <Clock size={11} color="#f59e0b" />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: '#f59e0b', textTransform: 'uppercase' }}>
            Under Maintenance
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900, letterSpacing: '-0.03em',
          lineHeight: 1.05, margin: 0,
        }}>
          We're levelling<br />
          <span style={{ color: '#10b981' }}>up the system{dots}</span>
        </h1>
      </div>

      {/* Subtitle */}
      <p className="fade-up fade-up-4" style={{
        color: '#6b7280', fontSize: '1rem', lineHeight: 1.7,
        maxWidth: 420, textAlign: 'center', marginBottom: '3rem',
      }}>
        Expert28 is undergoing scheduled maintenance to bring you a better experience.
        We'll be back stronger very soon.
      </p>

      {/* Status pills */}
      <div className="fade-up fade-up-4" style={{
        display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
        justifyContent: 'center', marginBottom: '3rem',
      }}>
        {[
          { label: 'Training Systems', status: 'Updating', color: '#f59e0b' },
          { label: 'Member Portal', status: 'Offline', color: '#ef4444' },
          { label: 'Stripe Payments', status: 'Operational', color: '#10b981' },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '0.6rem', padding: '0.5rem 0.85rem',
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: item.color,
              boxShadow: `0 0 6px ${item.color}`,
            }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af' }}>{item.label}</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: item.color, letterSpacing: '0.05em' }}>{item.status}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="fade-up fade-up-5" style={{
        width: '100%', maxWidth: 400,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '2rem',
      }} />

      {/* Contact */}
      <div className="fade-up fade-up-5" style={{
        display: 'flex', alignItems: 'center', gap: '1.5rem',
        flexWrap: 'wrap', justifyContent: 'center',
      }}>
        <a
          href="mailto:sultan.isaac26@gmail.com"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            color: '#6b7280', fontSize: '0.8rem', fontWeight: 600,
            textDecoration: 'none', transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f9fafb')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
        >
          <Mail size={15} />
          Contact Support
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            color: '#6b7280', fontSize: '0.8rem', fontWeight: 600,
            textDecoration: 'none', transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f9fafb')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
        >
          <Instagram size={15} />
          Follow @expert28
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.8rem' }}>
          <Dumbbell size={15} />
          <span>Est. Bandar Lampung, 2024</span>
        </div>
      </div>
    </div>
  );
}
