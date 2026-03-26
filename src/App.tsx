import { useState, useEffect, useRef, useCallback } from 'react';
import { Dumbbell, Zap, Users, TrendingUp, AlertTriangle, Star, Menu, X, ArrowRight, ChevronRight, ChevronDown, Clock, CheckCircle2, Shield } from 'lucide-react';
import ApplyPage from './pages/ApplyPage';
import SuccessPage from './pages/SuccessPage';
import JoinModal from './components/JoinModal';

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

function useCountUp(target: number, decimals = 0, visible = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1400;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(parseFloat(start.toFixed(decimals)));
    }, step);
    return () => clearInterval(timer);
  }, [visible, target, decimals]);
  return count;
}

function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;
  const rect = btn.getBoundingClientRect();
  circle.style.cssText = `width:${diameter}px;height:${diameter}px;left:${e.clientX - rect.left - radius}px;top:${e.clientY - rect.top - radius}px;`;
  circle.classList.add('ripple');
  btn.querySelector('.ripple')?.remove();
  btn.appendChild(circle);
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Elite Expert');

  // Listen for browser navigation
  useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    const fn = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 40);
      setScrollPct(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const openPlanModal = (planName: string) => {
    setSelectedPlan(planName);
    setModalOpen(true);
  };

  const goto = useCallback((id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (pathname === '/apply') return <ApplyPage />;
  if (pathname === '/success') return <SuccessPage />;

  return (
    <div style={{ background: '#030712', minHeight: '100vh', color: '#f9fafb', position: 'relative', overflowX: 'hidden' }} className="mobile-sticky-pad">

      {/* Scroll Progress Bar */}
      <div id="scroll-progress-bar" style={{ width: `${scrollPct}%` }} />

      {/* Background Orbs — higher opacity, reduced blur */}
      <div className="orb" style={{ width: '42vw', height: '42vw', background: 'var(--emerald)', top: '-12%', left: '-12%' }} />
      <div className="orb" style={{ width: '32vw', height: '32vw', background: 'var(--blue-cta)', bottom: '8%', right: '-6%', animationDelay: '-5s' }} />
      <div className="orb" style={{ width: '28vw', height: '28vw', background: 'var(--amber)', top: '38%', right: '8%', animationDelay: '-10s', opacity: 0.12 }} />

      <PrototypeBanner onToggle={setBannerVisible} />
      <Header scrolled={scrolled} goto={goto} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} bannerVisible={bannerVisible} />
      <main>
        <Hero goto={goto} />
        <div className="section-sep" />
        <Ticker />
        <div className="section-sep" />
        <WhatsIncluded />
        <div className="section-sep" />
        <Facilities />
        <div className="section-sep" />
        <Pricing goto={goto} openModal={openPlanModal} />
        <div className="section-sep" />
        <Testimonials />
        <div className="section-sep" />
        <FAQ />
        <div className="section-sep" />
        <FinalCTA goto={goto} openModal={() => openPlanModal('Elite Expert')} />
      </main>
      <Footer goto={goto} />

      {/* Floating CTA — desktop only */}
      <FloatingCTA openModal={() => openPlanModal('Elite Expert')} />

      {/* Mobile sticky bottom bar */}
      <div className="mobile-sticky-bar">
        <div>
          <p style={{ fontWeight: 800, fontSize: '0.85rem', lineHeight: 1 }}>Join Expert<span style={{ color: '#10b981' }}>28</span></p>
          <p style={{ color: '#6b7280', fontSize: '0.65rem', marginTop: '0.15rem' }}>From <span style={{ color: '#10b981' }}>$8</span> / week</p>
        </div>
        <button onClick={() => openPlanModal('7-Day Trial')} className="btn-blue" style={{ padding: '0.75rem 1.5rem', fontSize: '0.78rem', flexShrink: 0 }} onMouseDown={addRipple}>Join Now</button>
      </div>

      <JoinModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        selectedPlan={selectedPlan} 
      />
    </div>
  );
}

// ─── PROTOTYPE BANNER ─────────────────────────────────────────────────────────

function PrototypeBanner({ onToggle }: { onToggle: (show: boolean) => void }) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div id="proto-banner" className="prototype-banner" style={{ background: '#f59e0b', color: '#030712', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 900, letterSpacing: '0.05em', position: 'relative', zIndex: 1100 }}>
      <AlertTriangle size={13} />
      <span style={{ fontSize: '0.63rem' }}>DESIGN PROTOTYPE — DEMO DATA ONLY. ALL BRANDING IS LIVE.</span>
      <button onClick={() => { setShow(false); onToggle(false); }} style={{ position: 'absolute', right: '1rem', color: '#030712', background: 'none', border: 'none', cursor: 'pointer' }}><X size={14}/></button>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

function Header({ scrolled, goto, mobileOpen, setMobileOpen, bannerVisible }: any) {
  const links = [
    { label: 'Facilities', id: 'facilities' },
    { label: "What's Included", id: 'included' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Results', id: 'testimonials' },
    { label: 'FAQ', id: 'faq' },
  ];
  return (
    <>
      <header style={{
        position: 'fixed', top: bannerVisible ? '1.75rem' : 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(3,7,18,0.92)' : (bannerVisible ? '#030712' : 'transparent'),
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        padding: '0.9rem 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', transition: 'all 0.3s',
      }}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <img src="/Logo.png" alt="Expert28" style={{ height: 32, width: 'auto', borderRadius: '0.2rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Expert<span style={{ color: '#10b981' }}>28</span>
              {/* Amber pulsing dot */}
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'pulse-amber 2s ease-in-out infinite' }} />
            </span>
            <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.06em' }}>PROTOTYPE</span>
          </div>
        </div>

        <nav className="nav-desktop">
          {links.map(l => (
            <button key={l.id} onClick={() => goto(l.id)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s', letterSpacing: '0.05em', textTransform: 'uppercase' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f9fafb'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; }}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="nav-desktop">
          <button onClick={() => goto('pricing')} style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', marginRight: '0.75rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}>Log in</button>
          <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '0.55rem 1.4rem', fontSize: '0.8rem', fontWeight: 700 }} onMouseDown={addRipple}>Join Expert28</button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem', color: '#f9fafb', cursor: 'pointer', zIndex: 101, position: 'relative' }}>
          {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
        </button>
      </header>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile slide-in menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {links.map(l => (
          <button key={l.id} onClick={() => goto(l.id)} style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1.75rem', fontWeight: 900, color: '#f9fafb', cursor: 'pointer', letterSpacing: '-0.02em', padding: '0.25rem 0', minHeight: '48px' }}>{l.label}</button>
        ))}
        <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '1.25rem', fontSize: '1rem', marginTop: '2.5rem', borderRadius: '1rem', minHeight: '56px', width: '100%', fontWeight: 800 }} onMouseDown={addRipple}>Join Expert28</button>
      </div>

      <style>{`
        @keyframes pulse-amber {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ goto }: any) {
  const { ref, visible } = useReveal();
  const members = useCountUp(500, 0, visible);
  const rating  = useCountUp(4.9, 1, visible);
  const days    = useCountUp(7, 0, visible);

  return (
    <section id="hero" style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '7rem 2rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="grid-hero">

      {/* "28" watermark */}
      <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(280px, 40vw, 600px)', fontWeight: 900, lineHeight: 1, color: '#f9fafb', opacity: 0.032, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.06em', zIndex: 0 }}>28</div>

      {/* Radial glow behind headline */}
      <div style={{ position: 'absolute', top: '30%', left: '0', width: '50%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Left */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px', padding: '0.3rem 0.85rem', marginBottom: '1.75rem' }}>
          <Zap size={11} color="#10b981" />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#10b981' }}>Expert28 Gym — Join Now</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
          <span className="hero-line hero-line-1" style={{ display: 'block' }}>Get Stronger.</span>
          <span className="hero-line hero-line-2" style={{ display: 'block', color: '#10b981' }}>Train Smarter.</span>
          <span className="hero-line hero-line-3" style={{ display: 'block' }}>In 28 Days.</span>
        </h1>

        <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.7, maxWidth: '440px', marginBottom: '2rem' }}>
          6x/week access · Elite equipment · Expert coaching — designed for athletes who refuse to settle for average results.
        </p>

        {/* Stats with count-up */}
        <div ref={ref} className={`reveal hero-stats ${visible ? 'visible' : ''}`} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div><p style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{members}+</p><p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem' }}>Active Members</p></div>
          <div className="stat-divider" />
          <div><p style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{rating}/5</p><p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem' }}>Member Rating</p></div>
          <div className="stat-divider" />
          <div><p style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{days}</p><p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem' }}>Days a Week</p></div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '1rem 2.25rem', fontSize: '0.9rem', fontWeight: 800, minWidth: '180px' }} onMouseDown={addRipple}>Get Started Now</button>
          <button onClick={() => goto('facilities')} className="btn-outline-white" style={{ padding: '1rem 2rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '48px' }}>
            Explore Facility <ChevronRight size={16}/>
          </button>
        </div>
      </div>

      {/* Right — Photo card (taller) */}
      <div className="hero-image-card" style={{ aspectRatio: '3/4', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format"
            alt="Expert28 Gym"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e: any) => e.target.src = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000'}
          />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.5) 50%, transparent 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
            <p style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>Expert28 Gym</p>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.15rem' }}>Industrial Zone — Open 7 Days</p>
            <div style={{ marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse-dot 2s infinite' }} />
              <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>Open Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll chevron */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)' }} className="scroll-chevron">
        <span style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.1em', color: '#4b5563', textTransform: 'uppercase' }}>Scroll</span>
        <ChevronDown size={16} color="#4b5563" />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-hero { grid-template-columns: 1fr !important; padding-top: 5rem !important; }
          .scroll-chevron { display: none; }
        }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
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
          <span key={i} style={{ padding: '0 1.75rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', color: '#9ca3af', display: 'inline-flex', alignItems: 'center', gap: '1.75rem' }}>
            {item}
            <span style={{ color: '#10b981', fontSize: '0.5rem' }}>●</span>
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
    { icon: CheckCircle2, title: 'Institutional Standards', desc: 'A meticulously maintained, professional-grade environment.' },
    { icon: TrendingUp, title: 'Progress Tracking', desc: 'Built-in structure to track your lifts, habits, and results.' },
    { icon: Star, title: 'Community Network', desc: 'Train alongside a community of 500+ dedicated athletes.' },
  ];

  return (
    <section id="included" style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--section-pad) 2rem' }}>
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
            const index = String(i + 1).padStart(2, '0');
            return (
              <div key={i} className={`glass-card stagger-child ${visible ? 'visible' : ''}`} style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', transitionDelay: `${i * 75}ms`, position: 'relative', overflow: 'hidden' }}>
                {/* Background index number */}
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.85rem', fontSize: '3.5rem', fontWeight: 900, color: '#f9fafb', opacity: 0.04, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.04em' }}>{index}</div>
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
    { badge: 'Coaching', badgeClass: 'badge-blue', title: 'The Crucible', desc: 'Dedicated coaching zone for guided high-intensity circuits and assessments.', capacity: '10 slots', duration: 'Expert-led', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800' },
    { badge: 'Hypertrophy', badgeClass: 'badge-purple', title: 'Isolation Zone', desc: 'Hammer Strength machines, cables, and premium isolation equipment.', capacity: '25 slots', duration: 'Unlimited access', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800' },
    { badge: 'Recovery', badgeClass: 'badge-emerald', title: 'Recovery Vault', desc: 'Foam rollers, stretching area, and professional-grade recovery tools.', capacity: 'Open', duration: 'Unlimited access', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800' },
    { badge: 'Community', badgeClass: 'badge-blue', title: 'The Arena', desc: 'A shared training floor for group sessions, challenges, and open workouts.', capacity: '30 slots', duration: 'All members', image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800' },
  ];

  return (
    <section id="facilities" style={{ background: 'rgba(16,185,129,0.025)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: 'var(--section-pad) 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <p className="section-label" style={{ marginBottom: '0.75rem' }}>The Facility</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Your Training <span style={{ color: '#10b981' }}>Zones.</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', maxWidth: '480px', lineHeight: 1.7, marginBottom: '3.5rem' }}>
            Six purpose-built performance zones, each dialed to a specific training goal.
          </p>

          <div className="facilities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {zones.map((zone, i) => (
              <div key={i} className={`glass-card stagger-child ${visible ? 'visible' : ''}`} style={{ overflow: 'hidden', transitionDelay: `${i * 75}ms` }}>
                <div style={{ overflow: 'hidden', height: '200px' }}>
                  <img
                    src={zone.image}
                    alt={zone.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)'}
                    onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                    onError={(e: any) => e.target.src = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800'}
                  />
                </div>
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

function Pricing({ openModal }: any) {
  const { ref, visible } = useReveal();
  const plans = [
    { name: 'Base Expert', price: 100, per: '/mo', desc: 'Full access for the consistent athlete.', popular: false, badge: null, features: ['Unlimited Facility Access', 'All 6 Training Zones', 'Locker Access', 'Open 7 days/week'] },
    { name: 'Elite Expert', price: 149, per: '/mo', desc: 'Maximum guidance for elite performance.', popular: true, badge: 'MOST POPULAR', features: ['All Base Access', '2x Personal Training / mo', 'Custom Nutrition Plan', 'Performance Recovery Zone'] },
    { name: '7-Day Trial', price: 40, per: '/week', desc: 'Full access experience for a week.', popular: false, badge: 'TRIAL', features: ['Full Access for 7 Days', 'Intro Strategy Session', 'All Class Access', 'Locker access included'] },
  ];

  return (
    <section id="pricing" style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--section-pad) 2rem' }}>
      <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>Membership</p>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem', textAlign: 'center' }}>
          Choose Your <span style={{ color: '#10b981' }}>Plan.</span>
        </h2>
        <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '0.95rem', marginBottom: '3.5rem', maxWidth: '440px', margin: '0 auto 3.5rem' }}>
          No hidden fees, no long-term lock-ins. Just access to the best training environment in the city.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`glass-card stagger-child ${plan.popular ? 'pricing-popular' : ''} ${visible ? 'visible' : ''}`}
              style={{ padding: '2rem', position: 'relative', transitionDelay: `${i * 80}ms` }}
            >
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
              <button onClick={() => openModal(plan.name)} style={{ width: '100%', padding: '0.85rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', background: plan.popular ? '#2563eb' : 'rgba(255,255,255,0.07)', color: '#f9fafb', transition: 'background 0.2s, transform 0.15s', minHeight: '48px', position: 'relative', overflow: 'hidden' }}
                onMouseDown={addRipple}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = plan.popular ? '#1d4ed8' : 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = plan.popular ? '#2563eb' : 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}>
                Join The Tribe
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
    <section id="testimonials" style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'var(--section-pad) 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <p className="section-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>Proven Results</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '3.5rem', textAlign: 'center' }}>
            Elite <span style={{ color: '#10b981' }}>Results.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {reviews.map((r, i) => (
              <div key={i} className={`glass-card testimonial-card stagger-child ${visible ? 'visible' : ''}`} style={{ padding: '1.75rem', position: 'relative', transitionDelay: `${i * 80}ms` }}>
                {/* Large quote anchor */}
                <div style={{ position: 'absolute', top: '0.75rem', left: '1rem', fontSize: '6rem', lineHeight: 1, color: '#10b981', opacity: 0.08, fontFamily: 'Georgia, serif', userSelect: 'none', pointerEvents: 'none' }}>"</div>

                {/* VERIFIED badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.35rem', padding: '0.2rem 0.6rem', marginBottom: '0.85rem' }}>
                  <CheckCircle2 size={10} color="#10b981" />
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Verified Member</span>
                </div>

                {/* 5 stars */}
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.85rem' }}>
                  {[...Array(5)].map((_, s) => <Star key={s} size={12} color="#f59e0b" fill="#f59e0b" />)}
                </div>

                <p style={{ color: '#d1d5db', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>"{r.text}"</p>
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
    <section id="faq" style={{ maxWidth: '760px', margin: '0 auto', padding: 'var(--section-pad) 2rem' }}>
      <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>FAQ</p>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '3rem', textAlign: 'center' }}>
          Common <span style={{ color: '#10b981' }}>Questions.</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${open === i ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '1rem', overflow: 'hidden', transition: 'border-color 0.3s' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: open === i ? '#10b981' : '#f9fafb', fontWeight: 700, fontSize: '0.95rem', textAlign: 'left', gap: '1rem', minHeight: '48px' }}>
                {faq.q}
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: open === i ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', flexShrink: 0 }}>
                  <ChevronRight size={14} style={{ transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} />
                </div>
              </button>
              <div className={`faq-answer ${open === i ? 'open' : ''}`}>
                <div style={{ padding: '0 1.5rem 1.5rem', color: '#9ca3af', paddingTop: '0.25rem' }}>{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ goto, openModal }: { goto: (id: string) => void, openModal: () => void }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(16,185,129,0.15)', borderBottom: '1px solid rgba(16,185,129,0.15)', padding: 'var(--section-pad) 2rem', textAlign: 'center' }}>
      {/* Radial emerald glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* JOIN watermark */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 'clamp(120px, 22vw, 280px)', fontWeight: 900, letterSpacing: '-0.04em', color: '#f9fafb', opacity: 0.025, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>JOIN</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p className="section-label" style={{ marginBottom: '1rem' }}>Start Today</p>
        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1rem' }}>
          Join the <span style={{ color: '#10b981' }}>Expert28</span> Community.
        </h2>
        <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '440px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          The ultimate environment for athletes who refuse to settle for average. Join 500+ members today.
        </p>
        <div className="cta-group-box" style={{ margin: '0 auto' }}>
          <button onClick={() => openModal()} className="btn-blue" style={{ padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 800, minHeight: '56px' }} onMouseDown={addRipple}>Start Your Transformation</button>
          <button onClick={() => goto('facilities')} className="btn-outline-white" style={{ padding: '1rem 2.5rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '56px' }}>
            Explore Facility <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ goto }: any) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3rem 2rem 6rem', maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem' }} className="footer-grid">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <img src="/Logo.png" alt="Expert28" style={{ height: 28, width: 'auto', borderRadius: '0.2rem' }} />
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Expert<span style={{ color: '#10b981' }}>28</span></span>
        </div>
        <p style={{ color: '#4b5563', fontSize: '0.78rem', lineHeight: 1.7, maxWidth: '240px' }}>Modern institutional gym for unrelenting athletes. Open 7 days.</p>
        {/* Footer prototype badge — clean [P] tag */}
        <div style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.25rem 0.6rem', borderRadius: '0.4rem', color: '#f59e0b', fontSize: '0.6rem', fontWeight: 800 }}>
          <Shield size={10} />
          <span>[P] PROTOTYPE STATUS</span>
        </div>
      </div>
      <div>
        <p style={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Navigate</p>
        {['Facilities', "What's Included", 'Pricing', 'Results'].map((item, i) => (
          <button key={i} onClick={() => goto(['facilities', 'included', 'pricing', 'testimonials'][i])} style={{ display: 'block', background: 'none', border: 'none', color: '#4b5563', fontSize: '0.8rem', marginBottom: '0.6rem', cursor: 'pointer', padding: 0, textAlign: 'left', minHeight: '48px', lineHeight: 1 }}
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

function FloatingCTA({ openModal }: any) {
  return (
    <button onClick={openModal} className="floating-cta" onMouseDown={addRipple}>
      <Zap size={13} />
      Join Expert28
      <ChevronRight size={12} />
    </button>
  );
}
