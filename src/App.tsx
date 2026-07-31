import { useState, useEffect, useRef, useCallback } from 'react';
import { Dumbbell, Users, TrendingUp, AlertTriangle, Star, Menu, X, ChevronRight, Clock, CheckCircle2, Shield, Bell, ArrowRight, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import ApplyPage from './pages/ApplyPage';
import SuccessPage from './pages/SuccessPage';
import JoinModal from './components/JoinModal';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
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
import MaintenancePage from './pages/MaintenancePage';
import { useAuth, Profile, User } from './hooks/useAuth';
import { supabase } from './lib/supabase';
import { QuickLogin } from './components/QuickLogin';
import FacilityPage, { facilityZones } from './pages/FacilityPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
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
  original_price?: number;
  currency?: string;
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
  // ── Maintenance Mode Gate ─────────────────────────────────────────────────
  if (import.meta.env.VITE_MAINTENANCE_MODE === 'true') {
    return <MaintenancePage />;
  }

  const { user, profile, loading, signOut } = useAuth();
  const [pathname, setPathname] = useState(window.location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
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

  // Handle hash scrolling on landing page
  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500); // Wait for load
    }
  }, [pathname]);

  // Handle automatic redirects based on role/auth
  useEffect(() => {
    if (loading) return;

    // Detect if user just came back from Google OAuth
    // Supabase PKCE flow uses ?code= in the URL; legacy flow uses #access_token
    const isOAuthCallback =
      window.location.search.includes('code=') ||
      window.location.hash.includes('access_token');

    if (user && (pathname === '/login' || pathname === '/signup' || isOAuthCallback)) {
      // Clean up the OAuth params from the URL bar
      if (isOAuthCallback) {
        history.replaceState({}, '', '/');
      }
      if (profile?.role === 'admin') {
        setPathname('/admin/dashboard');
        history.replaceState({}, '', '/admin/dashboard');
      } else {
        setPathname('/client/dashboard');
        history.replaceState({}, '', '/client/dashboard');
      }
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
    if (pathname === '/reset-password') return <ResetPasswordPage />;
    if (pathname === '/profile') return <ProfilePage />;
    if (pathname === '/apply') return <ApplyPage />;
    if (pathname === '/success') return <SuccessPage />;
    if (pathname === '/admin/dashboard' || (pathname === '/admin' && profile?.role === 'admin')) return <AdminDashboard setPathname={setPathname} />;
    if (pathname === '/admin/clients') return <AdminClients setPathname={setPathname} />;
    if (pathname === '/admin/payments') return <AdminPayments setPathname={setPathname} />;
    if (pathname === '/admin/reporting') return <AdminReporting setPathname={setPathname} />;
    if (pathname === '/admin/notifications') return <AdminNotifications setPathname={setPathname} />;
    if (pathname === '/admin/audit-logs') return <AdminAuditLogs setPathname={setPathname} />;
    if (pathname === '/client/dashboard' || (pathname === '/dashboard' && profile?.role === 'member')) return <ClientDashboard setPathname={setPathname} />;
    if (pathname === '/client/workouts') return <ClientWorkouts setPathname={setPathname} />;
    if (pathname === '/client/notifications') return <AthleteNotifications setPathname={setPathname} />;

    if (pathname.startsWith('/facility/')) {
      const id = pathname.split('/')[2];
      return <FacilityPage id={id} setPathname={setPathname} />;
    }

    if (pathname === '/privacy') return <PrivacyPolicyPage />;
    if (pathname === '/terms') return <TermsPage />;

    return (
      <main>
        <Hero goto={goto} />
        <div className="section-sep" />
        <Ticker />
        <div className="section-sep" />
        <WhatsIncluded />
        <div className="section-sep" />
        <Facilities setPathname={setPathname} />
        <div className="section-sep" />
        <Pricing plans={plans} openModal={openPlanModal} />
        <div className="section-sep" />
        <Testimonials />
        <div className="section-sep" />
        <FAQ />
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

      <Header
        scrolled={scrolled || pathname !== '/'}
        goto={goto}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        profile={profile}
        signOut={signOut}
        setPathname={setPathname}
      />

      {renderContent()}

      {['/', '/privacy', '/terms'].includes(pathname) && (
        <Footer goto={goto} setPathname={setPathname} />
      )}

      {pathname === '/' && (
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
      )}

      <JoinModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
        user={user}
        profile={profile}
      />
      {!user && <QuickLogin />}
    </div>
  );
}



// ─── HEADER ───────────────────────────────────────────────────────────────────

interface HeaderProps {
  scrolled: boolean;
  goto: (id: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  user: User | null;
  profile: Profile | null;
  signOut: () => Promise<void>;
  setPathname: (p: string) => void;
}

function Header({ scrolled, goto, mobileOpen, setMobileOpen, user, profile, signOut, setPathname }: HeaderProps) {
  const links = [
    { label: 'Home', id: 'hero' },
    { label: "What's Included", id: 'included' },
    { label: 'Facilities', id: 'facilities' },
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
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(3,7,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        padding: '0.9rem 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', transition: 'all 0.3s',
      }}>
        <div onClick={() => { window.history.pushState({}, '', '/'); if (setPathname) setPathname('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <img src="/Logo.png" alt="Expert28" style={{ height: 32, width: 'auto', borderRadius: '0.2rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Expert<span style={{ color: '#10b981' }}>28</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem', padding: '0.1rem 0.35rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '999px', fontSize: '0.5rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.06em' }}>
              <AlertTriangle size={8} strokeWidth={3} /> DEMO PROTOTYPE
            </span>
          </div>
        </div>

        <nav className="nav-desktop">
          {links.map(l => (
            <button key={l.id} onClick={() => goto(l.id)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {l.label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setPathname('/login')} className="btn-outline-white" style={{ padding: '0.55rem 1.4rem', fontSize: '0.8rem', fontWeight: 700 }} onMouseDown={addRipple}>Log in</button>
              <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '0.55rem 1.4rem', fontSize: '0.8rem', fontWeight: 700 }} onMouseDown={addRipple}>Join Expert28</button>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem', color: '#f9fafb', cursor: 'pointer', zIndex: 101, marginLeft: '0.5rem' }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div className={`mobile-menu-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {links.map(l => (
          <button key={l.id} onClick={() => { goto(l.id); setMobileOpen(false); }} style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '1.75rem', fontWeight: 900, color: '#f9fafb', cursor: 'pointer', letterSpacing: '-0.02em', padding: '0.25rem 0' }}>{l.label}</button>
        ))}
        {user ? (
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => { setPathname(profile?.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'); setMobileOpen(false); }}
              className="btn-blue" style={{ padding: '1.25rem', fontSize: '1rem', borderRadius: '1rem', width: '100%', fontWeight: 800 }}
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => { signOut(); setMobileOpen(false); }}
              style={{ padding: '1.25rem', fontSize: '1rem', borderRadius: '1rem', width: '100%', fontWeight: 800, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={() => { setPathname('/login'); setMobileOpen(false); }} className="btn-outline-white" style={{ padding: '1.25rem', fontSize: '1rem', borderRadius: '1rem', width: '100%', fontWeight: 800 }} onMouseDown={addRipple}>Log in</button>
            <button onClick={() => { goto('pricing'); setMobileOpen(false); }} className="btn-blue" style={{ padding: '1.25rem', fontSize: '1rem', borderRadius: '1rem', width: '100%', fontWeight: 800 }} onMouseDown={addRipple}>Join Expert28</button>
          </div>
        )}
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
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      const checkConnection = () => {
        setIsSlowConnection(conn.saveData || ['slow-2g', '2g', '3g'].includes(conn.effectiveType));
      };
      checkConnection();
      conn.addEventListener('change', checkConnection);
      return () => conn.removeEventListener('change', checkConnection);
    }
  }, []);

  return (
    <section id="hero" style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '8rem 2rem 4rem' }}>
      {/* Immersive Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {isSlowConnection ? (
          <img
            src="/hero-image.jpg"
            alt="Expert28 Gym"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-image.jpg"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            {/* Fallback image in case video fails to load */}
            <img
              src="/hero-image.jpg"
              alt="Expert28 Gym"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
            />
          </video>
        )}
        {/* Cinematic gradients to ensure text readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0.5) 40%, rgba(3,7,18,0.8) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,7,18,1) 0%, rgba(3,7,18,0) 30%)' }} />
      </div>

      {/* Decorative oversized typography in background */}
      <div style={{ position: 'absolute', right: '-2%', top: '25%', fontSize: 'clamp(300px, 45vw, 700px)', fontWeight: 900, lineHeight: 1, color: '#10b981', opacity: 0.04, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-0.05em', zIndex: 1 }}>28</div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '1280px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', marginTop: '4vh' }}>

          {/* Main Headline */}
          <div className="hero-content">
            <h1 style={{ fontSize: 'clamp(4rem, 9vw, 7.5rem)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em', textTransform: 'uppercase', margin: 0 }}>
              <span className="hero-line hero-line-1" style={{ display: 'block', color: '#fff' }}>Forged</span>
              <span className="hero-line hero-line-2" style={{ display: 'block', color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.7)' }}>In The</span>
              <span className="hero-line hero-line-3" style={{ display: 'block', color: '#10b981' }}>Expert Pit.</span>
            </h1>
          </div>

          {/* Right side intro and stats */}
          <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <p style={{ color: '#e5e7eb', fontSize: '1.15rem', lineHeight: 1.6, fontWeight: 500, maxWidth: '420px', borderLeft: '3px solid #10b981', paddingLeft: '1.5rem' }}>
              No crowds. Elite equipment. Real athletes. Experience the institutional standard of strength training designed for those who refuse to settle.
            </p>

            <div className="hero-button-group">
              <button onClick={() => goto('pricing')} className="btn-blue" style={{ padding: '1.2rem 2.5rem', fontSize: '1rem', fontWeight: 800 }} onMouseDown={addRipple}>Join The Ranks</button>
              <button onClick={() => goto('facilities')} className="btn-outline-white" style={{ padding: '1.2rem 2.5rem', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                View Facility <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Floating Glass Stats Bar */}
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`} style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', overflow: 'hidden', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>

          <div style={{ background: 'rgba(3,7,18,0.5)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <p style={{ fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.03em', lineHeight: 1, color: '#fff', marginBottom: '0.5rem' }}>{members}+</p>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Elite Athletes</p>
          </div>

          <div style={{ background: 'rgba(3,7,18,0.5)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <p style={{ fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.03em', lineHeight: 1, color: '#fff', marginBottom: '0.5rem' }}>{rating}/5</p>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avg Rating</p>
          </div>

          <div style={{ background: 'rgba(16,185,129,0.15)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, transparent 100%)' }} />
            <p style={{ fontWeight: 900, fontSize: '2.5rem', letterSpacing: '-0.03em', lineHeight: 1, color: '#10b981', marginBottom: '0.5rem', position: 'relative' }}>{days}</p>
            <p style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', position: 'relative' }}>Days/Week Access</p>
          </div>

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
    { icon: Dumbbell, title: 'Olympic Equipment', desc: 'Rogue racks, platforms, and premium iron no compromises.' },
    { icon: Users, title: 'Expert Coaching', desc: 'Guided sessions with certified performance coaches onsite.' },
    { icon: CheckCircle2, title: 'Institutional Standards', desc: 'A meticulously maintained, professional grade environment.' },
    { icon: TrendingUp, title: 'Progress Tracking', desc: 'Built in structure to track your lifts, habits, and results.' },
    { icon: Star, title: 'Community Network', desc: 'Train alongside a community of 500+ dedicated athletes.' },
  ];

  return (
    <section id="included" style={{ maxWidth: '1280px', margin: '0 auto', padding: 'var(--section-pad) 2rem' }}>
      <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
        <p className="section-label" style={{ marginBottom: '0.75rem' }}>What You'll Get</p>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
          Everything <span style={{ color: '#10b981' }}>Included.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

function Facilities({ setPathname }: { setPathname?: (path: string) => void }) {
  const { ref, visible } = useReveal();

  return (
    <section id="facilities" style={{ background: 'rgba(16,185,129,0.025)', padding: 'var(--section-pad) 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
              The <span style={{ color: '#10b981' }}>Facility.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facilityZones.map((zone, i) => (
              <div
                key={i}
                onClick={() => {
                  if (setPathname) {
                    window.history.pushState({}, '', `/facility/${zone.id}`);
                    setPathname(`/facility/${zone.id}`);
                  }
                }}
                className={`glass-card stagger-child ${visible ? 'visible' : ''}`}
                style={{ overflow: 'hidden', transitionDelay: `${i * 75}ms`, cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: '350px', position: 'relative' }}>
                  <img src={zone.image} alt={zone.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,7,18,0.95) 0%, rgba(3,7,18,0) 70%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {zone.title}
                      <ArrowRight size={20} color="#10b981" />
                    </h3>
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

function Pricing({ plans, openModal }: { plans: MembershipPlan[]; openModal: (p: string) => void }) {
  const getCurrencySymbol = (currency?: string) => {
    const c = (currency || 'idr').toLowerCase();
    if (c === 'idr') return 'Rp';
    if (c === 'gbp') return '£';
    return '$';
  };
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
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                  {getCurrencySymbol(plan.currency)}
                </span>
                <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>{plan.price.toLocaleString()}</span>

                {plan.original_price && plan.original_price > plan.price && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginLeft: '0.5rem' }}>
                    <span style={{ fontSize: '1rem', color: '#6b7280', textDecoration: 'line-through', fontWeight: 600 }}>
                      {getCurrencySymbol(plan.currency)}{plan.original_price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, background: 'rgba(16,185,129,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      Save {Math.round(((plan.original_price - plan.price) / plan.original_price) * 100)}%
                    </span>
                  </div>
                )}

                <span style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, marginLeft: 'auto' }}>/{plan.interval === 'week' ? 'week' : 'mo'}</span>
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
    { name: 'Marcus T.', text: 'The conditioning turf and elite coaching completely changed my approach to functional fitness. Unmatched quality.' },
    { name: 'Sarah L.', text: 'Finally a space that takes recovery as seriously as the training. The plunge pool and saunas are a game changer.' },
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
    { q: 'Is Expert28 for beginners?', a: 'Expert28 is for anyone serious about progress, with tailored coaching that adapts to all skill levels.' },
    { q: 'Are there long-term contracts?', a: 'No. All of our memberships are fully flexible and can be cancelled or modified monthly.' },
    { q: 'What is included in the Elite Expert plan?', a: 'You get full 24/7 facility access, a dedicated coach, customized weekly workout routines, and 1-on-1 nutritional guidance.' },
    { q: 'Do I need to book facility zones in advance?', a: 'Walk-ins are perfectly fine, though premium zones like the Recovery Lounge can be reserved via your dashboard to guarantee a spot.' },
    { q: 'Can I freeze my membership if I go on holiday?', a: 'Yes, you can pause your membership for up to 2 months per year directly from your billing settings at no extra cost.' },
    { q: 'What are your operating hours?', a: 'Expert28 is open 24/7 for all members, allowing you to train on your own schedule without restrictions.' },
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



// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ goto, setPathname }: { goto: (id: string) => void; setPathname?: (path: string) => void }) {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '5rem 2rem 3rem', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
        {/* Brand */}
        <div>
          <span style={{ fontWeight: 900, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <img src="/Logo.png" alt="Expert28" style={{ height: '36px', width: '36px', borderRadius: '8px', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <span style={{ lineHeight: 1, display: 'flex', alignItems: 'center' }}>Expert<span style={{ color: 'var(--emerald)' }}>28</span></span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.25rem', padding: '0.1rem 0.35rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '999px', fontSize: '0.5rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.06em', width: 'fit-content' }}>
                <AlertTriangle size={8} strokeWidth={3} /> DEMO PROTOTYPE
              </span>
            </div>
          </span>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            A modern institutional gym designed for serious athletes. We provide the tools, environment, and coaching to unlock your peak performance.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: '#4b5563', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#4b5563'}><Instagram size={22} /></a>
            <a href="#" style={{ color: '#4b5563', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#4b5563'}><Twitter size={22} /></a>
            <a href="#" style={{ color: '#4b5563', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#4b5563'}><Facebook size={22} /></a>
          </div>
        </div>

        {/* Links */}
        <div>
          <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>QUICK LINKS</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><button onClick={() => goto('included')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, fontSize: '0.95rem', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--emerald)'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>What's Included</button></li>
            <li><button onClick={() => goto('facilities')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, fontSize: '0.95rem', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--emerald)'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Facility</button></li>
            <li><button onClick={() => goto('pricing')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, fontSize: '0.95rem', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--emerald)'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Pricing</button></li>
            <li><button onClick={() => goto('faq')} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, fontSize: '0.95rem', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--emerald)'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>FAQ</button></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>CONTACT</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#9ca3af', fontSize: '0.95rem', lineHeight: '1.5' }}>
              <MapPin size={20} style={{ color: 'var(--emerald)', flexShrink: 0, marginTop: '2px' }} />
              <span>Jl. Jend. Sudirman Kav. 52-53<br />SCBD, Jakarta Selatan 12190</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#9ca3af', fontSize: '0.95rem' }}>
              <Phone size={20} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
              +62 811-1234-5678
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#9ca3af', fontSize: '0.95rem' }}>
              <Mail size={20} style={{ color: 'var(--emerald)', flexShrink: 0 }} />
              hello@expert28.com
            </li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', color: '#4b5563', fontSize: '0.85rem' }}>
        <p>&copy; {new Date().getFullYear()} Expert28. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button onClick={() => { window.history.pushState({}, '', '/privacy'); if (setPathname) setPathname('/privacy'); window.scrollTo(0, 0); }} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: 0, fontSize: '0.85rem', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = '#9ca3af'} onMouseOut={e => e.currentTarget.style.color = '#4b5563'}>Privacy Policy</button>
          <button onClick={() => { window.history.pushState({}, '', '/terms'); if (setPathname) setPathname('/terms'); window.scrollTo(0, 0); }} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: 0, fontSize: '0.85rem', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = '#9ca3af'} onMouseOut={e => e.currentTarget.style.color = '#4b5563'}>Terms of Service</button>
        </div>
      </div>
    </footer>
  );
}
