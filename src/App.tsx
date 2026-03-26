import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Dumbbell, Zap, Users, TrendingUp, Shield, Star, Menu, X, ArrowRight, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goto = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#030712', minHeight: '100vh', color: '#f9fafb' }}>
      <PrototypeBanner />
      <Header scrolled={scrolled} goto={goto} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main>
        <Hero goto={goto} />
        <Ticker />
        <WhatsIncluded />
        <Facilities />
        <Pricing goto={goto} />
        <Testimonials />
        <FAQ />
        <FinalCTA goto={goto} />
      </main>
      <Footer goto={goto} />
      <FloatingCTA goto={goto} />
    </div>
  );
}

// ─── PROTOTYPE BANNER ─────────────────────────────────────────────────────────

function PrototypeBanner() {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div style={{ background: 'rgba(245,158,11,0.15)', borderBottom: '1px solid rgba(245,158,11,0.3)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', color: '#f59e0b' }}>
      <span>⚠</span>
      <span>PROTOTYPE — This is a design prototype. Content is for demo purposes only.</span>
      <button onClick={() => setShow(false)} style={{ marginLeft: 'auto', color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer' }}><X size={14}/></button>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header({ scrolled, goto, mobileOpen, setMobileOpen }: any) {
  const links = [
    { label: 'Facilities', id: 'facilities' },
    { label: "What's Included", id: 'included' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Results', id: 'testimonials' },
    { label: 'FAQ', id: 'faq' },
  ];
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(3,7,18,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      padding: '0.9rem 2rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', transition: 'all 0.3s',
    }}>
      <div onClick={() => window.scrollTo(0,0)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
        <div style={{ width: 32, height: 32, background: '#10b981', borderRadius: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', color: '#030712' }}>28</div>
        <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>Expert<span style={{ color: '#10b981' }}>28</span></span>
      </div>

      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden md:flex">
        {links.map(l => (
          <button key={l.id} onClick={() => goto(l.id)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f9fafb')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
            {l.label}
          </button>
        ))}
      </nav>

      <div className="hidden md:flex" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button onClick={() => goto('pricing')} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>Log in</button>
        <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>Join Expert28</button>
      </div>

      <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem', color: '#f9fafb', cursor: 'pointer' }}>
        {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
      </button>

      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: '#030712', zIndex: -1, paddingTop: '5rem', padding: '6rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {links.map(l => (
            <button key={l.id} onClick={() => goto(l.id)} style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1.5rem', fontWeight: 700, color: '#f9fafb', cursor: 'pointer' }}>{l.label}</button>
          ))}
          <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '1rem', fontSize: '1rem', marginTop: '1rem' }}>Join Expert28</button>
        </div>
      )}
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ goto }: any) {
  return (
    <section id="hero" style={{ paddingTop: '7rem', paddingBottom: '5rem', maxWidth: '1280px', margin: '0 auto', padding: '7rem 2rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="grid-hero">
      {/* Left */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px', padding: '0.3rem 0.85rem', marginBottom: '1.75rem' }}>
          <Zap size={11} color="#10b981" />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#10b981' }}>Expert28 Gym — Join Now</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
          Get Stronger.<br />
          <span style={{ color: '#10b981' }}>Train Smarter.</span><br />
          In 28 Days.
        </h1>

        <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.7, maxWidth: '440px', marginBottom: '2rem' }}>
          6x/week access · Elite equipment · Expert coaching — designed for athletes who refuse to settle for average results.
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div><p style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>500+</p><p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem' }}>Active Members</p></div>
          <div className="stat-divider" />
          <div><p style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>4.9/5</p><p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem' }}>Member Rating</p></div>
          <div className="stat-divider" />
          <div><p style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>7</p><p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem' }}>Days a Week</p></div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '0.85rem 2rem', fontSize: '0.85rem' }}>Join Expert28</button>
          <button onClick={() => goto('facilities')} className="btn-outline-white" style={{ padding: '0.85rem 2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            View Facility <ChevronRight size={14}/>
          </button>
        </div>
      </div>

      {/* Right — Photo card */}
      <div className="hero-image-card" style={{ aspectRatio: '4/5', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format"
          alt="Expert28 Gym"
          style={{ width: '100%', height: '80%', objectFit: 'cover' }}
          onError={(e: any) => e.target.src = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000'}
        />
        <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>Expert28 Gym</p>
          <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.15rem' }}>Industrial Zone — Open 7 Days</p>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>Open Now</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .grid-hero { grid-template-columns: 1fr !important; padding-top: 5rem !important; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </section>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────

function Ticker() {
  const items = ['ELITE EQUIPMENT', 'EXPERT COACHING', '7-DAY ACCESS', 'ZERO LOCK-IN', '500+ MEMBERS', 'OPEN EVERY DAY', 'OLYMPIC PLATFORMS', 'INSTANT RESULTS', 'ELITE EQUIPMENT', 'EXPERT COACHING', '7-DAY ACCESS', 'ZERO LOCK-IN', '500+ MEMBERS', 'OPEN EVERY DAY', 'OLYMPIC PLATFORMS', 'INSTANT RESULTS'];
  return (
    <div className="ticker-wrap" style={{ padding: '0.75rem 0', margin: '2rem 0' }}>
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} style={{ padding: '0 2rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', color: '#4b5563' }}>
            {item} <span style={{ color: '#10b981', marginLeft: '2rem' }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── WHAT'S INCLUDED ──────────────────────────────────────────────────────────

function WhatsIncluded() {
  const { ref, visible } = useReveal();
  const items = [
    { icon: Clock, title: '6x/week Access', desc: 'Unrestricted access to all zones, any time, any day.' },
    { icon: Dumbbell, title: 'Olympic Equipment', desc: 'Rogue racks, platforms, and premium iron — no compromises.' },
    { icon: Users, title: 'Expert Coaching', desc: 'Guided sessions with certified performance coaches on-site.' },
    { icon: Shield, title: 'Institutional Standards', desc: 'A meticulously maintained, professional-grade environment.' },
    { icon: TrendingUp, title: 'Progress Tracking', desc: 'Built-in structure to track your lifts, habits, and results.' },
    { icon: Star, title: 'Community Network', desc: 'Train alongside a community of 500+ dedicated athletes.' },
  ];

  return (
    <section id="included" style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 2rem' }}>
      <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label" style={{ marginBottom: '0.75rem' }}>What You'll Get</p>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
          Everything <span style={{ color: '#10b981' }}>Included.</span>
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', maxWidth: '480px', lineHeight: 1.7, marginBottom: '3.5rem' }}>
          All memberships include full access to every zone, every feature, and every coach on-site.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', transitionDelay: `${i * 60}ms` }}>
                <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="#10b981" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.title}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.78rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FACILITIES ───────────────────────────────────────────────────────────────

function Facilities() {
  const { ref, visible } = useReveal();
  const zones = [
    { badge: 'Strength', badgeClass: 'badge-emerald', title: 'The Expert Pit', desc: 'Olympic platforms, deadlift jacks, squat stands, and heavy iron from Rogue.', capacity: '20 slots', duration: 'Unlimited access', image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?q=80&w=800' },
    { badge: 'Conditioning', badgeClass: 'badge-amber', title: 'High-Octane Turf', desc: 'Sleds, battle ropes, 30m sprint turf, and functional training rigs.', capacity: '15 slots', duration: 'Unlimited access', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800' },
    { badge: 'Coaching', badgeClass: 'badge-blue', title: 'The Crucible', desc: 'Dedicated coaching zone for guided high-intensity circuits and assessments.', capacity: '10 slots', duration: 'Expert-led' , image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800' },
    { badge: 'Hypertrophy', badgeClass: 'badge-purple', title: 'Isolation Zone', desc: 'Hammer Strength machines, cables, and premium isolation equipment.', capacity: '25 slots', duration: 'Unlimited access', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800' },
    { badge: 'Recovery', badgeClass: 'badge-emerald', title: 'Recovery Vault', desc: 'Foam rollers, stretching area, and professional-grade recovery tools.', capacity: 'Open', duration: 'Unlimited access', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800' },
    { badge: 'Community', badgeClass: 'badge-blue', title: 'The Arena', desc: 'A shared training floor for group sessions, challenges, and open workouts.', capacity: '30 slots', duration: 'All members', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800' },
  ];

  return (
    <section id="facilities" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <p className="section-label" style={{ marginBottom: '0.75rem' }}>The Facility</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Your Training <span style={{ color: '#10b981' }}>Zones.</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', maxWidth: '480px', lineHeight: 1.7, marginBottom: '3.5rem' }}>
            Six purpose-built performance zones, each dialed to a specific training goal.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {zones.map((zone, i) => (
              <div key={i} className="glass-card" style={{ overflow: 'hidden', transitionDelay: `${i * 60}ms` }}>
                <img src={zone.image} alt={zone.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} onError={(e: any) => e.target.src = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800'} />
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span className={`badge ${zone.badgeClass}`}>{zone.badge}</span>
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{zone.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.78rem', lineHeight: 1.6, marginBottom: '1rem' }}>{zone.desc}</p>
                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.65rem', fontWeight: 600, color: '#4b5563', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={11} color="#10b981" />{zone.capacity}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={11} color="#10b981" />{zone.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────

function Pricing({ goto }: any) {
  const { ref, visible } = useReveal();
  const plans = [
    { name: 'Base Expert', price: 29, per: '/mo', desc: 'Full access for the consistent athlete.', popular: false, badge: null, features: ['Unlimited Facility Access', 'All 6 Training Zones', 'Locker Access', 'Open 7 days/week'] },
    { name: 'Elite Expert', price: 49, per: '/mo', desc: 'Maximum results with elite support.', popular: true, badge: 'Most Popular', features: ['Everything in Base', 'Expert Coaching Sessions', '2x Monthly Guest Passes', 'Priority Booking', 'Recovery Vault Access'] },
    { name: '7-Day Trial', price: 8, per: '/week', desc: 'Zero commitment. Full access.', popular: false, badge: null, features: ['Full Facility Access', 'One-on-One Assessment', 'No lock-in', 'Cancellable anytime'] },
  ];

  return (
    <section id="pricing" style={{ maxWidth: '1280px', margin: '0 auto', padding: '6rem 2rem' }}>
      <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>Membership</p>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem', textAlign: 'center' }}>
          Choose Your <span style={{ color: '#10b981' }}>Plan.</span>
        </h2>
        <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '0.95rem', marginBottom: '3.5rem', maxWidth: '440px', margin: '0 auto 3.5rem' }}>
          No hidden fees, no long-term lock-ins. Just access to the best training environment in the city.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
          {plans.map((plan, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem', position: 'relative', border: plan.popular ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)', background: plan.popular ? 'rgba(16,185,129,0.06)' : undefined }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: '-0.75rem', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#030712', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.9rem', borderRadius: '999px' }}>
                  {plan.badge}
                </div>
              )}
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.3rem' }}>{plan.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: '1.5rem' }}>{plan.desc}</p>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.75rem', fontWeight: 900, letterSpacing: '-0.04em', color: plan.popular ? '#10b981' : '#f9fafb' }}>${plan.price}</span>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500 }}>{plan.per}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem 0', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: '#d1d5db' }}>
                    <CheckCircle2 size={13} color="#10b981" />
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => goto('pricing')} style={{ width: '100%', padding: '0.85rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', background: plan.popular ? '#2563eb' : 'rgba(255,255,255,0.07)', color: '#f9fafb', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = plan.popular ? '#1d4ed8' : 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = plan.popular ? '#2563eb' : 'rgba(255,255,255,0.07)'}>
                Join Expert28
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function Testimonials() {
  const { ref, visible } = useReveal();
  const reviews = [
    { name: 'Rafi M.', result: 'Lost 5kg · 8 weeks', text: 'Absolute elite environment. No crowds, top-tier iron, and a community that actually trains hard.' },
    { name: 'Dina K.', result: 'Strength PR +15%', text: 'The standard here is institutional. Everything is built for real athletic progress, not casual fitness.' },
    { name: 'Kevin A.', result: '5 days/week consistent', text: 'I finally found a gym that prioritizes tension and focus over distractions. Expert28 changed my training.' },
  ];

  return (
    <section id="testimonials" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <p className="section-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>Proven Results</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '3.5rem', textAlign: 'center' }}>
            Elite <span style={{ color: '#10b981' }}>Results.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {reviews.map((r, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.75rem' }}>
                <p style={{ color: '#d1d5db', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', color: '#10b981' }}>{r.name[0]}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.name}</p>
                    <p style={{ color: '#10b981', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{r.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { ref, visible } = useReveal();
  const faqs = [
    { q: 'Is Expert28 for beginners?', a: 'Expert28 is for anyone serious about progress — whether you\'re returning from a gap or a seasoned lifter. The environment is professional, not elitist.' },
    { q: 'Are there long-term contracts?', a: 'No. We believe in performance, not lock-ins. All memberships are flexible and cancellable monthly.' },
    { q: 'What equipment is available?', a: 'Rogue, Hammer Strength, and Olympic standard iron across all zones. No compromises on quality.' },
    { q: 'Will the gym be crowded?', a: 'Membership capacity is strictly managed to ensure zero crowding. Every zone has reserved capacity limits.' },
    { q: 'What are the opening hours?', a: 'Open every day of the week. Early access available for Elite Expert members from 5:30 AM.' },
  ];

  return (
    <section id="faq" style={{ maxWidth: '760px', margin: '0 auto', padding: '6rem 2rem' }}>
      <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>FAQ</p>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '3rem', textAlign: 'center' }}>
          Common <span style={{ color: '#10b981' }}>Questions.</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${open === i ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '0.75rem', overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '1.1rem 1.25rem', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#f9fafb', fontWeight: 600, fontSize: '0.88rem', textAlign: 'left', gap: '1rem' }}>
                {faq.q}
                <ChevronRight size={16} color="#6b7280" style={{ transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>
              {open === i && (
                <div style={{ padding: '0 1.25rem 1.1rem', color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ goto }: any) {
  return (
    <section style={{ background: 'rgba(16,185,129,0.05)', borderTop: '1px solid rgba(16,185,129,0.15)', borderBottom: '1px solid rgba(16,185,129,0.15)', padding: '6rem 2rem', textAlign: 'center' }}>
      <p className="section-label" style={{ marginBottom: '1rem' }}>Start Today</p>
      <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
        Join the <span style={{ color: '#10b981' }}>Expert28</span> Community.
      </h2>
      <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '440px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
        The ultimate environment for athletes who refuse to settle for average. Join 500+ members today.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '1rem 2.5rem', fontSize: '0.9rem' }}>Join Expert28</button>
        <button onClick={() => goto('facilities')} className="btn-outline-white" style={{ padding: '1rem 2.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          View Facility <ArrowRight size={14}/>
        </button>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ goto }: any) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3rem 2rem', maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem' }} className="footer-grid">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{ width: 28, height: 28, background: '#10b981', borderRadius: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.65rem', color: '#030712' }}>28</div>
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Expert<span style={{ color: '#10b981' }}>28</span></span>
        </div>
        <p style={{ color: '#4b5563', fontSize: '0.78rem', lineHeight: 1.7, maxWidth: '240px' }}>Modern institutional gym for unrelenting athletes. Open 7 days.</p>
      </div>
      <div>
        <p style={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Navigate</p>
        {['Facilities', "What's Included", 'Pricing', 'Results'].map((item, i) => (
          <button key={i} onClick={() => goto(['facilities', 'included', 'pricing', 'testimonials'][i])} style={{ display: 'block', background: 'none', border: 'none', color: '#4b5563', fontSize: '0.8rem', marginBottom: '0.6rem', cursor: 'pointer', padding: 0, textAlign: 'left' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f9fafb'}
            onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}>
            {item}
          </button>
        ))}
      </div>
      <div>
        <p style={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Social</p>
        {['Instagram', 'Strava', 'YouTube'].map((item) => (
          <a key={item} href="#" style={{ display: 'block', color: '#4b5563', fontSize: '0.8rem', marginBottom: '0.6rem', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#10b981'}
            onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}>
            {item}
          </a>
        ))}
      </div>
      <style>{`@media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr !important; } }`}</style>
    </footer>
  );
}

// ─── FLOATING CTA ─────────────────────────────────────────────────────────────

function FloatingCTA({ goto }: any) {
  return (
    <button onClick={() => goto('pricing')} className="floating-cta">
      <Zap size={13} />
      Join Expert28
      <ChevronRight size={12} />
    </button>
  );
}
