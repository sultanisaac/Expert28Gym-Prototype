import './App.css';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';
import { Dumbbell, Zap, Users, TrendingUp, Shield, Star, Menu, X, Check, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// ─── SCROLL REVEAL HOOK ───────────────────────────────────────────────────────
function useRevealGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); } },
      { threshold: 0.08 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-black text-white min-h-screen noise-overlay selection:bg-lime-400 selection:text-black">
      <Header scrolled={scrolled} scrollToSection={scrollToSection} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <Hero scrollToSection={scrollToSection} />
      <StatsSection />
      <WhyChooseUs scrollToSection={scrollToSection} />
      <Facilities />
      <WhatsIncluded scrollToSection={scrollToSection} />
      <Pricing scrollToSection={scrollToSection} />
      <SocialProof />
      <FAQ />
      <FinalCTA scrollToSection={scrollToSection} />
      <Footer />
      <MobileBottomCTA scrollToSection={scrollToSection} />
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────

function Header({ scrolled, scrollToSection, mobileMenuOpen, setMobileMenuOpen }: any) {
  const navLinks = [
    { label: 'Why Us', id: 'why' },
    { label: 'Facilities', id: 'facilities' },
    { label: 'Included', id: 'included' },
    { label: 'Membership', id: 'pricing' },
    { label: 'Results', id: 'social-proof' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-black/20 backdrop-blur-sm py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="text-2xl font-black tracking-tighter group cursor-pointer" onClick={() => scrollToSection('hero')}>
          <span className="text-white">Expert</span><span className="text-lime-400 group-hover:drop-shadow-[0_0_8px_rgba(163,230,53,0.6)] transition-all">28</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-lime-400 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* FIX #2: Header CTA visible in both transparent and scrolled states */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={() => scrollToSection('pricing')}
            size="sm"
            className={`font-black text-xs uppercase tracking-widest rounded-none h-10 px-6 transition-all duration-300 flex items-center gap-2 ${
              scrolled
                ? 'bg-lime-400 text-black hover:bg-lime-300'
                : 'bg-white/10 border border-white/40 text-white hover:bg-lime-400 hover:text-black hover:border-lime-400'
            }`}
          >
            <span className="pulsing-dot" />
            Join Today
          </Button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 hover:text-lime-400 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/5 px-4 py-8 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-base font-black uppercase tracking-tighter text-gray-300 hover:text-lime-400 transition-colors text-left border-b border-white/5 pb-5"
              >
                {link.label}
              </button>
            ))}
            <Button onClick={() => scrollToSection('pricing')} className="w-full bg-lime-400 text-black hover:bg-lime-300 mt-2 rounded-none font-black h-14 text-xs uppercase tracking-widest">
              JOIN EXPERT28 →
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ scrollToSection }: any) {
  return (
    <section id="hero" className="relative min-h-[95vh] md:min-h-screen flex items-center justify-center overflow-hidden gym-grid">
      {/* Animated Orbs */}
      <div className="orb orb-lime-xl" style={{ top: '-200px', left: '-200px' }} />
      <div className="orb orb-lime-md" style={{ bottom: '-100px', right: '-100px' }} />
      <div className="orb orb-lime-sm" style={{ top: '40%', left: '60%' }} />

      {/* Light Rays */}
      <div className="light-ray" />
      <div className="light-ray light-ray-2" />

      <div className="absolute -left-1/4 top-0 w-1/2 h-full bg-lime-400/5 -skew-x-12 blur-3xl pointer-events-none" />
      
      {/* FIX #8: Watermark scaled down on mobile to prevent overflow */}
      <div className="absolute -right-10 md:-right-20 -bottom-10 md:-bottom-20 select-none pointer-events-none opacity-[0.07] animate-in fade-in duration-1000 delay-500 overflow-hidden">
        <h2 className="text-[10rem] md:text-[30rem] font-black italic tracking-tighter text-stroke-lime leading-none">28</h2>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 z-10">
        <div className="inline-block mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-lime-400 border-l-2 border-lime-400 pl-3">
            Premium Fitness Excellence
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter mb-8 leading-[0.85] uppercase italic">
          <span className="block animate-in fade-in slide-in-from-right-8 duration-700 delay-100 fill-mode-both">
            Train <span className="gradient-text">Hard.</span>
          </span>
          <span className="block animate-in fade-in slide-in-from-right-8 duration-700 delay-200 fill-mode-both">
            Get <span className="text-white">Stronger.</span>
          </span>
        </h1>

        <p className="text-base md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
          Experience a professional training environment designed for real progress, quality equipment, and results-driven consistency.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">
          <Button onClick={() => scrollToSection('pricing')} size="lg" className="bg-lime-400 text-black hover:bg-lime-300 font-black text-xs uppercase tracking-widest h-16 px-12 rounded-none glow-on-hover">
            Start Your Journey
          </Button>
          <Button onClick={() => scrollToSection('pricing')} variant="outline" size="lg" className="border-white/50 bg-white/8 text-white hover:bg-white hover:text-black font-black text-xs uppercase tracking-widest h-16 px-12 rounded-none transition-all duration-300">
            Claim Free Week
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />
    </section>
  );
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function StatsSection() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  // FIX #5: Corrected stat labels and suffixes — no more "24h Equipment Zone"
  const stats = [
    { label: 'Active Members', display: 500, suffix: '+' },
    { label: 'Member Rating', display: 4.9, suffix: '/5' },
    { label: 'Days a Week', display: 7, suffix: '' },
    { label: 'Pieces of Equipment', display: 80, suffix: '+' },
  ];

  useEffect(() => {
    const section = document.getElementById('stats-section');
    if (!section) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const duration = 2000;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let currentFrame = 0;
        const timer = setInterval(() => {
          currentFrame++;
          const progress = currentFrame / totalFrames;
          const newCounts = stats.map(stat => {
            const val = stat.display * progress;
            return stat.display % 1 === 0 ? Math.floor(val) : parseFloat(val.toFixed(1));
          });
          setCounts(newCounts);
          if (currentFrame === totalFrames) clearInterval(timer);
        }, frameRate);
        observer.unobserve(section);
      }
    }, { threshold: 0.1 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-16 bg-black relative z-10 -mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 glass-panel overflow-hidden scanline">
          {stats.map((stat, i) => (
            <div key={i} className="py-10 md:py-14 px-6 text-center border-white/5 md:border-r last:border-0 hover:bg-white/5 transition-colors group">
              <p className="text-lime-400 font-black text-3xl md:text-5xl tracking-tighter mb-1 group-hover:scale-110 transition-transform duration-500 italic">
                {counts[i]}{stat.suffix}
              </p>
              <p className="text-gray-500 uppercase font-black text-[10px] tracking-[0.3em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        {/* Growth Bar */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 italic">Capacity reached</span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-lime-400 italic">500 Members & Growing</span>
          </div>
          <div className="h-[1px] w-full bg-white/5 relative">
            <div className="absolute top-0 left-0 h-full bg-lime-400 w-3/4" />
            <div className="absolute top-[-3px] left-[75%] w-[1px] h-[7px] bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WHY CHOOSE US ────────────────────────────────────────────────────────────

function WhyChooseUs({ scrollToSection }: any) {
  const features = [
    { title: 'Full Gym Equipment', icon: Dumbbell, description: 'Complete range of free weights, machines, and strength equipment for every goal.' },
    { title: 'Strength & Cardio Zones', icon: Zap, description: 'Dedicated spaces for focused training — no crowding, no waiting.' },
    { title: 'Clean Modern Facility', icon: Shield, description: 'Immaculate gym maintained to the highest standards every single day.' },
    { title: 'Flexible Membership', icon: TrendingUp, description: 'Day passes, monthly, and premium plans that adapt to your lifestyle.' },
    { title: 'Group Classes', icon: Users, description: 'High-energy guided classes for all levels, included in premium plans.' },
    { title: 'Welcoming Environment', icon: Star, description: 'Train alongside people committed to progress, from beginners to advanced.' },
  ];
  const grid = useRevealGrid();

  return (
    <section id="why" className="py-16 md:py-40 bg-black relative overflow-hidden diag-stripes">
      {/* Orb */}
      <div className="orb orb-lime-md" style={{ top: '10%', right: '-150px' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400 block mb-4">Why Choose Us</span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">
            Built for <span className="gradient-text">Progress.</span>
          </h2>
        </div>

        <div ref={grid.ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="reveal-item"
                style={{ transitionDelay: grid.visible ? `${i * 80}ms` : '0ms' }}
                ref={(el) => { if (el && grid.visible) el.classList.add('is-visible'); }}
              >
                <Card className="bg-white/5 border-white/5 hover:border-lime-400/30 transition-all duration-500 p-8 md:p-10 rounded-none group relative overflow-hidden transform hover:-translate-y-2 h-full">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-lime-400/5 translate-x-8 -translate-y-8 rotate-45 group-hover:bg-lime-400/15 transition-colors duration-500" />
                  <Icon className="w-12 h-12 text-lime-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-lg font-black uppercase tracking-tight mb-3 italic">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm font-medium">{feature.description}</p>
                </Card>
              </div>
            );
          })}
        </div>

        {/* FIX #10: Mid-section CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => scrollToSection('pricing')}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-lime-400 transition-colors duration-200 group"
          >
            See membership plans
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── FACILITIES ───────────────────────────────────────────────────────────────

function Facilities() {
  const facilities = [
    { title: 'Strength Zone', description: 'Free weights, benches, racks, and machines for serious strength training.' },
    { title: 'Cardio Area', description: 'Treadmills, bikes, and conditioning equipment for endurance.' },
    { title: 'Functional Space', description: 'Room for mobility work, circuits, and dynamic training sessions.' },
    { title: 'Class Studio', description: 'Space for high-energy classes and guided workouts.' },
    { title: 'Recovery Area', description: 'Locker rooms and shower facilities for after your session.' },
    { title: 'Clean Facility', description: 'Well-maintained gym designed for comfort and daily consistency.' },
  ];

  const grid = useRevealGrid();

  return (
    <section id="facilities" className="py-16 md:py-40 bg-zinc-950 relative overflow-hidden">
      {/* Diagonal accent top */}
      <div className="section-angle-accent top bg-zinc-900/40" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-400/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400 block mb-4">Our Facility</span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Train <span className="gradient-text">Better.</span>
          </h2>
        </div>

        <div ref={grid.ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {facilities.map((facility, i) => (
            <div key={i} className="reveal-item" style={{ transitionDelay: grid.visible ? `${i * 80}ms` : '0ms' }}
              ref={(el) => { if (el && grid.visible) el.classList.add('is-visible'); }}>
              <Card className="bg-black/40 border-white/5 rounded-none overflow-hidden hover:border-lime-400/30 transition-all duration-500 group h-full">
                <div className="h-48 bg-gradient-to-br from-white/10 via-white/5 to-transparent relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-25 transition-all duration-700 group-hover:scale-110">
                    <Dumbbell size={120} className="text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                  </div>
                  <div className="absolute top-4 left-4 bg-lime-400 text-black px-3 py-1 text-[10px] font-black uppercase">
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="absolute bottom-4 right-4 text-lime-400 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-3 italic">{facility.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm font-medium">{facility.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHAT'S INCLUDED ──────────────────────────────────────────────────────────

function WhatsIncluded({ scrollToSection }: any) {
  const benefits = [
    { title: 'Full Equipment Access', description: 'Every machine, rack, and training tool available with your membership.' },
    { title: 'Group Workout Classes', description: 'Participate in high-energy group fitness sessions included in premium plans.' },
    { title: 'Flexible Membership Plans', description: 'Day pass, monthly, or premium. No lock-in. Cancel anytime.' },
    { title: 'Free Trial Access', description: 'Try the gym risk-free for a full week before committing to a plan.' },
    { title: 'Clean Professional Environment', description: 'Top-tier cleanliness maintained daily so you can focus on training.' },
    { title: 'Beginner-Friendly', description: 'Welcoming atmosphere for all fitness levels — no judgment, only progress.' },
  ];

  return (
    /* FIX #6: Added id="included" for nav link */
    <section id="included" className="py-16 md:py-40 bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400 block mb-4">Gym Benefits</span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">
            What's <span className="text-lime-400">Included.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, i) => (
            <Card key={i} className="bg-white/5 border-white/5 p-8 rounded-none hover:border-lime-400/30 transition-all duration-500 group">
              <div className="flex items-start gap-5">
                <div className="w-4 h-4 rounded-full bg-lime-400 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform duration-300" />
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight mb-2 italic">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">{benefit.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* FIX #10: Mid-section CTA */}
        <div className="text-center mt-16">
          <button
            onClick={() => scrollToSection('pricing')}
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-lime-400 transition-colors duration-200 group"
          >
            Choose your plan
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────

function Pricing({ scrollToSection }: any) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const grid = useRevealGrid();

  const plans = [
    {
      name: 'Day Pass',
      price: '$8',
      period: '',
      description: 'Perfect for first-timers. Try the full gym before committing to a plan.',
      features: ['Full gym access', 'Valid for 1 day', 'No registration required'],
      popular: false,
      cta: 'Get Day Pass',
      save: null,
    },
    {
      name: 'Monthly',
      price: billingCycle === 'monthly' ? '$29' : '$19',
      period: '/month',
      description: 'The most popular choice. Full access, flexible, no commitment.',
      features: ['Full equipment access', 'Open 7 days a week', 'Locker access', 'Shower facilities'],
      popular: true,
      cta: 'Join Now',
      save: billingCycle === 'yearly' ? 'Save 35%' : 'Best Value',
    },
    {
      name: 'Premium',
      price: billingCycle === 'monthly' ? '$49' : '$35',
      period: '/month',
      description: 'Everything in Monthly plus unlimited group classes and priority perks.',
      features: ['All Monthly features', 'Unlimited group classes', 'Priority gym hours', 'Guest passes (2/month)'],
      popular: false,
      cta: 'Choose Premium',
      save: billingCycle === 'yearly' ? 'Save 30%' : null,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-40 bg-zinc-950 relative overflow-hidden">
      {/* Orbs for depth */}
      <div className="orb orb-lime-xl" style={{ bottom: '-300px', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="orb orb-lime-md" style={{ top: '-100px', right: '-150px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400 block mb-4">Pricing Plans</span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">
            Pick Your <span className="gradient-text">Plan.</span>
          </h2>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-10 gap-4">
            <span className={`text-xs font-black uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 bg-white/10 border border-white/10 rounded-full relative focus:outline-none focus:ring-2 focus:ring-lime-400/50"
              aria-label="Toggle billing cycle"
            >
              <div className={`absolute top-1 w-5 h-5 bg-lime-400 rounded-full transition-all duration-300 shadow-lg ${billingCycle === 'monthly' ? 'left-1' : 'left-8'}`} />
            </button>
            <span className={`text-xs font-black uppercase tracking-widest transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
              Yearly <span className="text-lime-400 ml-1">(-40%)</span>
            </span>
          </div>
        </div>

        <div ref={grid.ref} className="grid md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {plans.map((plan, i) => (
            <div key={i} className="reveal-item" style={{ transitionDelay: grid.visible ? `${i * 100}ms` : '0ms' }}
              ref={(el) => { if (el && grid.visible) el.classList.add('is-visible'); }}>
              <Card
                className={`relative border transition-all duration-500 rounded-none overflow-hidden flex flex-col ${
                  plan.popular
                    ? 'border-lime-400 bg-black scale-100 md:scale-105 z-10 lime-glow'
                    : 'border-white/5 bg-white/5 hover:border-lime-400/20'
                }`}
              >
              {plan.popular && (
                <div className="bg-lime-400 text-black py-2 text-center text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              {plan.save && !plan.popular && (
                <div className="bg-white/5 border-b border-white/5 py-2 text-center text-[10px] font-black uppercase tracking-widest text-lime-400">
                  {plan.save}
                </div>
              )}
              {plan.popular && plan.save && (
                <div className="absolute top-10 right-4 bg-lime-400/10 text-lime-400 px-3 py-1 text-[9px] font-black uppercase tracking-widest border border-lime-400/20">
                  {plan.save}
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-xl font-black uppercase tracking-tighter mb-3 italic">{plan.name}</h3>
                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-lime-400 tracking-tighter italic">{plan.price}</span>
                  <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-8 font-medium leading-relaxed">{plan.description}</p>

                {/* FIX #3: Non-popular plan CTAs have clearly visible styling */}
                <Button
                  onClick={() => scrollToSection('pricing')}
                  className={`w-full mb-8 font-black text-xs uppercase tracking-widest h-14 rounded-none transition-all duration-300 ${
                    plan.popular
                      ? 'bg-lime-400 text-black hover:bg-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.3)]'
                      : 'bg-white/10 border border-white/25 text-white hover:bg-lime-400 hover:text-black hover:border-lime-400'
                  }`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 border-t border-white/10 pt-6 flex-1">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight">
                      <Check size={13} className="text-lime-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-8 text-[9px] text-gray-600 font-bold text-center uppercase tracking-widest">
                  No lock-in contract. Cancel anytime.
                </p>
              </div>
            </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SOCIAL PROOF ─────────────────────────────────────────────────────────────

function SocialProof() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const results = [
    { label: 'Lost 5kg', sub: 'In 8 Weeks', icon: TrendingUp },
    { label: 'Strength +25%', sub: 'On main lifts', icon: Dumbbell },
    { label: '90% Consistency', sub: 'Training routine', icon: Zap },
    { label: 'Confidence', sub: 'Mental growth', icon: Star },
  ];

  const testimonials = [
    {
      text: 'Expert28 gave me a place where I actually wanted to train consistently. The gym feels serious, clean, and motivating.',
      author: 'Rafi',
      age: 26,
    },
    {
      text: 'I tried other gyms before, but Expert28 felt much better in terms of atmosphere and equipment. Worth every penny.',
      author: 'Dina',
      age: 24,
    },
    {
      text: 'The membership was simple, the facility was great, and I felt comfortable training even as a beginner.',
      author: 'Kevin',
      age: 30,
    },
  ];

  // FIX #12: Track scroll position for carousel dot indicators
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const cardWidth = scrollWidth / testimonials.length;
    setActiveTestimonial(Math.round(scrollLeft / cardWidth));
  };

  return (
    <section id="social-proof" className="py-16 md:py-40 bg-black relative overflow-hidden">
      <div className="absolute top-10 left-10 text-[16rem] md:text-[20rem] font-black text-lime-400/[0.03] select-none pointer-events-none transform -rotate-12">"</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400 block mb-4">Community Results</span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Real <span className="gradient-text">Members.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 md:mb-24">
          {results.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} className="bg-white/5 border-white/5 p-6 md:p-8 text-center rounded-none group hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex flex-col items-center">
                  <Icon className="w-5 h-5 text-lime-400 mb-3 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  <p className="text-white font-black uppercase tracking-tighter text-sm italic mb-1">{item.label}</p>
                  <p className="text-gray-500 font-bold uppercase text-[9px] tracking-widest">{item.sub}</p>
                  <div className="mt-3 w-6 h-[1px] bg-lime-400/30 group-hover:w-full transition-all duration-700" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* FIX #12: Horizontal carousel with dot indicators */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-6 md:pb-0 snap-x snap-mandatory scrollbar-hide"
        >
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="min-w-[85vw] md:min-w-0 bg-white/5 border-white/5 p-8 md:p-10 rounded-none relative transform hover:-translate-y-2 transition-all duration-500 snap-center flex-shrink-0">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className="fill-lime-400 text-lime-400" />
                ))}
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-8 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-lime-400" />
                <p className="font-black uppercase tracking-tighter italic text-sm">{testimonial.author}, {testimonial.age}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile carousel dot indicators */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className={`h-[2px] transition-all duration-300 ${i === activeTestimonial ? 'w-6 bg-lime-400' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
  // FIX #11: Restored full FAQ — 9 questions covering all common objections
  const faqs = [
    {
      question: 'Can I try the gym before joining?',
      answer: 'Yes. You can claim a free trial week or purchase a day pass for just $8 to experience Expert28 before choosing a membership plan.',
    },
    {
      question: 'Is Expert28 beginner-friendly?',
      answer: 'Absolutely. The gym is designed for all levels — whether you have never trained before or have years of experience. The environment is supportive, not intimidating.',
    },
    {
      question: 'What equipment does the gym have?',
      answer: 'Expert28 includes a full strength zone with free weights and machines, a dedicated cardio area, functional training space, and a group class studio.',
    },
    {
      question: 'Are group classes included in my membership?',
      answer: 'Group classes are included in the Premium membership plan. Monthly members can add them as an optional upgrade.',
    },
    {
      question: 'Is there a long-term commitment required?',
      answer: 'No. All memberships are flexible with no lock-in contracts. You can cancel anytime without fees or penalties.',
    },
    {
      question: 'What are the opening hours?',
      answer: 'Expert28 is open 7 days a week: Monday–Friday 6:00 AM – 10:00 PM, Saturday–Sunday 8:00 AM – 8:00 PM.',
    },
    {
      question: 'Does the gym get crowded?',
      answer: 'Expert28 is intentionally sized to avoid overcrowding. Premium members also have access to priority hours, which are typically quieter.',
    },
    {
      question: 'Are there showers and lockers available?',
      answer: 'Yes. All paying members have access to locker rooms and shower facilities, making it easy to fit training into a busy schedule.',
    },
    {
      question: 'How do I sign up?',
      answer: 'Simply pick your plan above, click the join button, and complete the short sign-up form. You can start as soon as today.',
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-40 bg-zinc-950 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400 block mb-4">FAQ</span>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">
            Got <span className="text-lime-400">Questions?</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-white/5 px-6 rounded-none hover:border-white/10 transition-colors">
              <AccordionTrigger className="text-left hover:text-lime-400 transition-colors py-5">
                <span className="font-black uppercase tracking-tight italic text-sm">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-5 text-sm font-medium leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ scrollToSection }: any) {
  return (
    <section className="py-16 md:py-40 bg-black relative overflow-hidden">
      {/* Orbs for dramatic finale */}
      <div className="orb orb-lime-xl" style={{ top: '-200px', left: '-200px' }} />
      <div className="orb orb-lime-md" style={{ bottom: '-200px', right: '-150px' }} />

      <div className="absolute inset-0 bg-gradient-to-r from-lime-400/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />

      <div className="absolute -left-10 bottom-0 select-none pointer-events-none opacity-[0.04]">
        <h2 className="text-[12rem] md:text-[20rem] font-black italic tracking-tighter text-white uppercase leading-none">JOIN</h2>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-[6rem] font-black tracking-tighter mb-8 leading-[0.9] uppercase italic">
          Built for <span className="gradient-text">Real Training</span>
        </h2>
        <p className="text-gray-400 text-base md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          No commitment required. Clean, modern, and motivating. Try it free for a full week.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => scrollToSection('pricing')} size="lg" className="bg-lime-400 text-black hover:bg-lime-300 font-black text-xs uppercase tracking-widest h-16 px-14 rounded-none glow-on-hover">
            Join Expert28 Today
          </Button>
          <Button onClick={() => scrollToSection('pricing')} variant="outline" size="lg" className="border-white/50 bg-white/8 text-white hover:bg-white hover:text-black font-black text-xs uppercase tracking-widest h-16 px-14 rounded-none transition-all duration-300">
            Claim Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-16 pb-32 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-16">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-black italic mb-4">
              <span className="text-white">Expert</span><span className="text-lime-400">28</span>
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed font-medium uppercase tracking-tight">
              Modern gym membership for serious training and real progress.
            </p>
          </div>

          <div>
            <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-white mb-5 italic">Membership</h4>
            <ul className="space-y-3 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <li><a href="#pricing" className="hover:text-lime-400 transition-colors">Day Pass</a></li>
              <li><a href="#pricing" className="hover:text-lime-400 transition-colors">Monthly</a></li>
              <li><a href="#pricing" className="hover:text-lime-400 transition-colors">Premium</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-white mb-5 italic">Explore</h4>
            <ul className="space-y-3 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <li><a href="#facilities" className="hover:text-lime-400 transition-colors">Facilities</a></li>
              <li><a href="#included" className="hover:text-lime-400 transition-colors">What's Included</a></li>
              <li><a href="#social-proof" className="hover:text-lime-400 transition-colors">Results</a></li>
              <li><a href="#faq" className="hover:text-lime-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-white mb-5 italic">Contact</h4>
            <ul className="space-y-3 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <li><a href="mailto:hello@expert28.com" className="hover:text-lime-400 transition-colors normal-case">hello@expert28.com</a></li>
              <li><a href="tel:+00000000000" className="hover:text-lime-400 transition-colors">+00 000 000 000</a></li>
              <li><a href="#" className="hover:text-lime-400 transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-700 text-[9px] font-bold uppercase tracking-widest">
            © 2026 Expert28 Gym Prototype. All rights reserved.
          </p>
          <div className="flex gap-6 text-[9px] font-bold uppercase tracking-widest text-gray-700">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MOBILE BOTTOM CTA ────────────────────────────────────────────────────────

function MobileBottomCTA({ scrollToSection }: any) {
  return (
    /* FIX #4: Fully opaque background — no content bleeding through */
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black border-t border-white/10 p-3 z-30">
      <Button
        onClick={() => scrollToSection('pricing')}
        className="w-full bg-lime-400 text-black hover:bg-lime-300 font-black h-14 rounded-none text-xs uppercase tracking-widest"
      >
        Join Expert28 — From $8
      </Button>
    </div>
  );
}

export default App;
