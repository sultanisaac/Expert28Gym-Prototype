import { useState, useEffect, useRef, useCallback } from 'react';
import { Dumbbell, Zap, Users, TrendingUp, AlertTriangle, Star, Menu, X, ChevronRight, Clock, CheckCircle2, Shield, Bell } from 'lucide-react';
import ApplyPage from './pages/ApplyPage';
import SuccessPage from './pages/SuccessPage';
import JoinModal from './components/JoinModal';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminPayments from './pages/AdminPayments';
import AdminReporting from './pages/AdminReporting';
import AdminNotifications from './pages/AdminNotifications';
import AthleteNotifications from './pages/AthleteNotifications';
import AdminAuditLogs from './pages/AdminAuditLogs';
import ClientDashboard from './pages/ClientDashboard';
import ClientWorkouts from './pages/ClientWorkouts';
import ProfilePage from './pages/ProfilePage';
import ProfileDropdown from './components/ProfileDropdown';
import NotificationDropdown from './components/dashboard/NotificationDropdown';
import { useAuth, Profile, User } from './hooks/useAuth';
import { supabase } from './lib/supabase';
import { QuickLogin } from './components/QuickLogin';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  badge: string;
  stripe_price_id: string;
}

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
  const { user, profile, loading, signOut } = useAuth();
  const [pathname, setPathname] = useState(window.location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      if (data) setPlans(data);
    };
    fetchPlans();
  }, []);

  // Handle automatic redirects based on role/auth
  useEffect(() => {
    if (loading) return;

    if (user && (pathname === '/login' || pathname === '/signup')) {
      if (profile?.role === 'admin') setPathname('/admin/dashboard');
      else setPathname('/client/dashboard');
    }
  }, [user, profile, pathname, loading]);

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
    if (user && profile?.role === 'guest') {
      setPathname('/client/dashboard');
      history.pushState({}, '', '/client/dashboard');
      return;
    }
    const plan = plans.find(p => p.name === planName);
    if (plan) setSelectedPlan(plan);
    setModalOpen(true);
  };

  const goto = useCallback((id: string) => {
    setMobileOpen(false);
    if (pathname !== '/') {
      history.pushState({}, '', '/');
      setPathname('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, [pathname]);

  const isAdminRoute = pathname.startsWith('/admin');
  const isClientRoute = pathname.startsWith('/client');
  const isProtectedRoute = isAdminRoute || isClientRoute || pathname === '/profile';

  if (loading && isProtectedRoute) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(16,185,129,0.15)', borderTopColor: '#10b981', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isAdminRoute && !loading) {
    if (!user) {
      history.replaceState({}, '', '/login');
      return <LoginPage />;
    }
    if (profile?.role !== 'admin') {
      return (
        <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', color: '#f9fafb', fontFamily: 'inherit' }}>
          <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="#ef4444" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Access Denied</h1>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', maxWidth: 320, margin: 0, lineHeight: 1.6 }}>
            You don't have permission to access the Admin Portal.
          </p>
          <button
            onClick={() => { history.pushState({}, '', '/client/dashboard'); setPathname('/client/dashboard'); }}
            style={{ marginTop: '0.5rem', padding: '0.65rem 1.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.65rem', color: '#d1d5db', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Go to My Dashboard
          </button>
        </div>
      );
    }
  }

  if (isClientRoute && !loading && !user) {
    history.replaceState({}, '', '/login');
    return <LoginPage />;
  }

  const renderContent = () => {
    if (pathname === '/login') return <LoginPage />;
    if (pathname === '/signup') return <SignupPage />;
    if (pathname === '/profile') return <ProfilePage />;
    if (pathname === '/apply') return <ApplyPage />;
    if (pathname === '/success') return <SuccessPage />;
    if (pathname === '/admin/dashboard' || (pathname === '/admin' && profile?.role === 'admin')) return <AdminDashboard setPathname={setPathname} />;
    if (pathname === '/admin/clients') return <AdminClients setPathname={setPathname} />;
    if (pathname === '/admin/payments') return <AdminPayments setPathname={setPathname} />;
    if (pathname === '/admin/reporting') return <AdminReporting setPathname={setPathname} />;
    if (pathname === '/admin/notifications') return <AdminNotifications setPathname={setPathname} />;
    if (pathname === '/admin/audit-logs') return <AdminAuditLogs setPathname={setPathname} />;
    if (pathname === '/client/dashboard' || (pathname === '/dashboard' && profile?.role === 'client')) return <ClientDashboard setPathname={setPathname} />;
    if (pathname === '/client/workouts') return <ClientWorkouts setPathname={setPathname} />;
    if (pathname === '/client/notifications') return <AthleteNotifications setPathname={setPathname} />;

    return (
      <main>
        <Hero goto={goto} />
        <div className="section-sep" />
        <Ticker />
        <div className="section-sep" />
        <WhatsIncluded />
        <div className="section-sep" />
        <Facilities />
        <div className="section-sep" />
        <Pricing plans={plans} openModal={openPlanModal} />
        <div className="section-sep" />
        <Testimonials />
        <div className="section-sep" />
        <FAQ />
        <div className="section-sep" />
        <FinalCTA goto={goto} />
      </main>
    );
  };

  if (isAdminRoute || isClientRoute) {
    return renderContent();
  }

  // Find lowest price for sticky bar
  const lowestPrice = plans.length > 0 ? Math.min(...plans.map(p => p.price)) : 25;
  const lowestInterval = plans.find(p => p.price === lowestPrice)?.interval || 'week';

  return (
    <div style={{ background: '#030712', minHeight: '100vh', color: '#f9fafb', position: 'relative', overflowX: 'hidden' }} className="mobile-sticky-pad">
      <div id="scroll-progress-bar" style={{ width: `${scrollPct}%` }} />
      <div className="orb" style={{ width: '42vw', height: '42vw', background: 'var(--emerald)', top: '-12%', left: '-12%' }} />
      <div className="orb" style={{ width: '32vw', height: '32vw', background: 'var(--blue-cta)', bottom: '8%', right: '-6%', animationDelay: '-5s' }} />
      <div className="orb" style={{ width: '28vw', height: '28vw', background: 'var(--amber)', top: '38%', right: '8%', animationDelay: '-10s', opacity: 0.12 }} />

      <PrototypeBanner onToggle={setBannerVisible} />

      <Header
        scrolled={scrolled || pathname !== '/'}
        goto={goto}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        bannerVisible={bannerVisible}
        user={user}
        profile={profile}
        signOut={signOut}
        setPathname={setPathname}
      />

      {renderContent()}

      {pathname === '/' && (
        <>
          <Footer goto={goto} />
          <div className="mobile-sticky-bar">
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.85rem', lineHeight: 1 }}>Join Expert<span style={{ color: '#10b981' }}>28</span></p>
              <p style={{ color: '#6b7280', fontSize: '0.65rem', marginTop: '0.15rem' }}>From <span style={{ color: '#10b981' }}>Rp {lowestPrice.toLocaleString()}</span> / {lowestInterval}</p>
            </div>
            <button onClick={() => {
              const trial = plans.find(p => p.name.toLowerCase().includes('trial')) || plans[0];
              if (trial) openPlanModal(trial.name);
            }} className="btn-blue" style={{ padding: '0.75rem 1.5rem', fontSize: '0.78rem', flexShrink: 0 }} onMouseDown={addRipple}>Join Now</button>
          </div>
        </>
      )}

      <JoinModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
      />
      {!user && <QuickLogin />}
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
      <button onClick={() => { setShow(false); onToggle(false); }} style={{ position: 'absolute', right: '1rem', color: '#030712', background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} /></button>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────

interface HeaderProps {
  scrolled: boolean;
  goto: (id: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  bannerVisible: boolean;
  user: User | null;
  profile: Profile | null;
  signOut: () => Promise<void>;
  setPathname: (p: string) => void;
}

function Header({ scrolled, goto, mobileOpen, setMobileOpen, bannerVisible, user, profile, signOut, setPathname }: HeaderProps) {
  const links = [
    { label: 'Home', id: 'hero' },
    { label: 'Facilities', id: 'facilities' },
    { label: "What's Included", id: 'included' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Results', id: 'testimonials' },
    { label: 'FAQ', id: 'faq' },
  ];

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      setNotifCount(count || 0);
    };
    fetchCount();
  }, [user]);

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
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', animation: 'pulse-amber 2s ease-in-out infinite' }} />
            </span>
            <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.06em' }}>PROTOTYPE</span>
          </div>
        </div>

        <nav className="nav-desktop">
          {links.map(l => (
            <button key={l.id} onClick={() => goto(l.id)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {l.label}
            </button>
          ))}
        </nav>

        <div className="nav-desktop">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  style={{ position: 'relative', padding: '0.45rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.6rem', cursor: 'pointer', color: notifOpen ? '#f9fafb' : '#6b7280' }}
                >
                  <Bell size={15} strokeWidth={1.5} />
                  {notifCount > 0 && (
                    <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: '0.5rem', fontWeight: 800, borderRadius: '999px', minWidth: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {notifCount}
                    </span>
                  )}
                </button>
                {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} setPathname={setPathname} />}
              </div>
              <ProfileDropdown user={user} profile={profile} signOut={signOut} setPathname={setPathname} />
            </div>
          ) : (
            <>
              <button onClick={() => setPathname('/login')} style={{ background: 'none', border: 'none', color: '#4b5563', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', marginRight: '0.75rem' }}>Log in</button>
              <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '0.55rem 1.4rem', fontSize: '0.8rem', fontWeight: 700 }} onMouseDown={addRipple}>Join Expert28</button>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem', color: '#f9fafb', cursor: 'pointer', zIndex: 101 }}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      <div className={`mobile-menu-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {links.map(l => (
          <button key={l.id} onClick={() => goto(l.id)} style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1.75rem', fontWeight: 900, color: '#f9fafb', cursor: 'pointer', letterSpacing: '-0.02em', padding: '0.25rem 0' }}>{l.label}</button>
        ))}
        <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '1.25rem', fontSize: '1rem', marginTop: '2.5rem', borderRadius: '1rem', width: '100%', fontWeight: 800 }} onMouseDown={addRipple}>Join Expert28</button>
      </div>
      <style>{`@keyframes pulse-amber { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.7); } }`}</style>
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ goto }: { goto: (id: string) => void }) {
  const { ref, visible } = useReveal();
  const members = useCountUp(500, 0, visible);
  const rating = useCountUp(4.9, 1, visible);
  const days = useCountUp(7, 0, visible);

  return (
    <section id="hero" style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '7rem 2rem 5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="grid-hero">
      <div style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(280px, 40vw, 600px)', fontWeight: 900, lineHeight: 1, color: '#f9fafb', opacity: 0.032, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.06em', zIndex: 0 }}>28</div>
      <div style={{ position: 'absolute', top: '30%', left: '0', width: '50%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

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

        <div ref={ref} className={`reveal hero-stats ${visible ? 'visible' : ''}`} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div><p style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{members}+</p><p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem' }}>Active Members</p></div>
          <div className="stat-divider" />
          <div><p style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{rating}/5</p><p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem' }}>Member Rating</p></div>
          <div className="stat-divider" />
          <div><p style={{ fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{days}</p><p style={{ color: '#6b7280', fontSize: '0.7rem', fontWeight: 500, marginTop: '0.2rem' }}>Days a Week</p></div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '1rem 2.25rem', fontSize: '0.9rem', fontWeight: 800, minWidth: '180px' }} onMouseDown={addRipple}>Get Started Now</button>
          <button onClick={() => goto('facilities')} className="btn-outline-white" style={{ padding: '1rem 2rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Explore Facility <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="hero-image-card" style={{ aspectRatio: '3/4', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format"
          alt="Expert28 Gym"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, rgba(3,7,18,0.95) 0%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem' }}>
          <p style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>Expert28 Gym</p>
          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Industrial Zone — Open 7 Days</p>
        </div>
      </div>
    </section>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────

function Ticker() {
  const items = ['ELITE EQUIPMENT', 'EXPERT COACHING', '7-DAY ACCESS', 'ZERO LOCK-IN', '500+ MEMBERS', 'OPEN EVERY DAY', 'OLYMPIC PLATFORMS', 'INSTANT RESULTS'];
  return (
    <div className="ticker-wrap" style={{ padding: '0.75rem 0', margin: '2rem 0' }}>
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={`glass-card stagger-child ${visible ? 'visible' : ''}`} style={{ padding: '1.5rem', display: 'flex', gap: '1rem', transitionDelay: `${i * 75}ms` }}>
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
    { badge: 'Strength', title: 'The Expert Pit', desc: 'Olympic platforms, deadlift jacks, squat stands, and heavy iron from Rogue.', image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?q=80&w=800' },
    { badge: 'Conditioning', title: 'High-Octane Turf', desc: 'Sleds, battle ropes, 30m sprint turf, and functional training rigs.', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800' },
    { badge: 'Coaching', title: 'The Crucible', desc: 'Dedicated coaching zone for guided high-intensity circuits and assessments.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800' },
  ];

  return (
    <section id="facilities" style={{ background: 'rgba(16,185,129,0.025)', padding: 'var(--section-pad) 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <p className="section-label" style={{ marginBottom: '0.75rem' }}>The Facility</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {zones.map((zone, i) => (
              <div key={i} className={`glass-card stagger-child ${visible ? 'visible' : ''}`} style={{ overflow: 'hidden', transitionDelay: `${i * 75}ms` }}>
                <div style={{ height: '200px' }}>
                  <img src={zone.image} alt={zone.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.4rem' }}>{zone.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.78rem' }}>{zone.desc}</p>
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

function Pricing({ plans, openModal }: { plans: MembershipPlan[]; openModal: (p: string) => void }) {
  const { ref, visible } = useReveal();

  return (
    <section id="pricing" style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--section-pad) 2rem' }}>
      <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>Membership</p>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '3.5rem', textAlign: 'center' }}>
          Choose Your <span style={{ color: '#10b981' }}>Plan.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`glass-card stagger-child ${visible ? 'visible' : ''}`}
              style={{ padding: '2.5rem', position: 'relative', transitionDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column' }}
            >
              {plan.badge && (
                <div style={{ position: 'absolute', top: '-0.75rem', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: '#030712', fontSize: '0.6rem', fontWeight: 800, padding: '0.25rem 0.9rem', borderRadius: '999px' }}>
                  {plan.badge}
                </div>
              )}
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.3rem' }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>Rp</span>
                <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>{plan.price.toLocaleString()}</span>
                <span style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600 }}>/{plan.interval === 'week' ? 'week' : 'mo'}</span>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem 0', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {plan.features?.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#d1d5db' }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => openModal(plan.name)}
                className="btn-blue"
                style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', fontWeight: 800, marginTop: 'auto' }}
                onMouseDown={addRipple}
              >
                Join Now
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
    { name: 'Rafi M.', text: 'Absolute elite environment. No crowds, top-tier iron, and a community that actually trains hard.' },
    { name: 'Dina K.', text: 'The standard here is institutional. Everything is built for real athletic progress, not casual fitness.' },
  ];

  return (
    <section id="testimonials" style={{ background: 'rgba(255,255,255,0.015)', padding: 'var(--section-pad) 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, textAlign: 'center', marginBottom: '3.5rem' }}>Elite Results.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {reviews.map((r, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.75rem' }}>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1rem' }}>"{r.text}"</p>
                <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>— {r.name}</p>
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
    { q: 'Is Expert28 for beginners?', a: 'Expert28 is for anyone serious about progress.' },
    { q: 'Are there long-term contracts?', a: 'No. Flexible and cancellable monthly.' },
  ];

  return (
    <section id="faq" style={{ maxWidth: '760px', margin: '0 auto', padding: 'var(--section-pad) 2rem' }}>
      <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, textAlign: 'center', marginBottom: '3rem' }}>FAQ</h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: '1rem' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: 'none', borderRadius: '0.75rem', color: '#fff', textAlign: 'left', fontWeight: 700 }}>{faq.q}</button>
            {open === i && <div style={{ padding: '1rem', color: '#9ca3af' }}>{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ goto }: { goto: (id: string) => void }) {
  return (
    <section style={{ padding: 'var(--section-pad) 2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, marginBottom: '2.5rem' }}>Join the community.</h2>
      <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '1.25rem 3.5rem', fontSize: '1.1rem', fontWeight: 800 }}>Start Now</button>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ goto }: { goto: (id: string) => void }) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '5rem 2rem 8rem', maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem' }}>
      <div>
        <span style={{ fontWeight: 800, fontSize: '1rem' }}>Expert<span style={{ color: '#10b981' }}>28</span></span>
        <p style={{ color: '#4b5563', fontSize: '0.8rem', marginTop: '1rem' }}>Modern institutional gym.</p>
      </div>
      <div>
        <p style={{ color: '#9ca3af', fontWeight: 800, fontSize: '0.7rem', marginBottom: '1.5rem' }}>NAVIGATE</p>
        <button onClick={() => goto('pricing')} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: 0 }}>Pricing</button>
      </div>
    </footer>
  );
}
