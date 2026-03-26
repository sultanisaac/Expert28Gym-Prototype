import './App.css';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';
import { Dumbbell, Zap, Users, TrendingUp, Shield, Star, Menu, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

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
      <WhyChooseUs />
      <Facilities />
      <WhatsIncluded />
      <Pricing scrollToSection={scrollToSection} />
      <SocialProof />
      <FAQ />
      <FinalCTA scrollToSection={scrollToSection} />
      <Footer />
      <MobileBottomCTA scrollToSection={scrollToSection} />
    </div>
  );
}

function Header({ scrolled, scrollToSection, mobileMenuOpen, setMobileMenuOpen }: any) {
  const navLinks = [
    { label: 'Why Choose Us', id: 'why' },
    { label: 'Facilities', id: 'facilities' },
    { label: 'Membership', id: 'pricing' },
    { label: 'Results', id: 'social-proof' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="text-2xl font-black tracking-tighter group cursor-pointer" onClick={() => scrollToSection('hero')}>
          <span className="text-white">Expert</span><span className="text-lime-400 group-hover:drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] transition-all">28</span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-lime-400 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={() => scrollToSection('pricing')}
            variant="outline"
            size="sm"
            className="border-white/10 text-white hover:bg-white hover:text-black transition-all rounded-none font-bold uppercase tracking-tight flex items-center"
          >
            <span className="pulsing-dot" />
            Join Today
          </Button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/5 px-4 py-8 animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-lg font-black uppercase tracking-tighter text-gray-300 hover:text-lime-400 transition text-left"
              >
                {link.label}
              </button>
            ))}
            <Button onClick={() => scrollToSection('pricing')} className="w-full bg-lime-400 text-black hover:bg-lime-500 mt-4 rounded-none font-black h-14">
              JOIN EXPERT28
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero({ scrollToSection }: any) {
  return (
    <section id="hero" className="relative h-[95vh] md:h-[100vh] flex items-center justify-center overflow-hidden gym-grid">
      <div className="absolute -left-1/4 top-0 w-1/2 h-full bg-lime-400/5 -skew-x-12 blur-3xl" />
      
      <div className="absolute -right-20 -bottom-20 select-none pointer-events-none opacity-10 animate-in fade-in duration-1000 delay-500">
        <h2 className="text-[30rem] font-black italic tracking-tighter text-stroke-lime leading-none">28</h2>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block mb-6 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-both">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-lime-400 border-l border-lime-400 pl-3">
            Premium Fitness Excellence
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter mb-8 leading-[0.85] uppercase italic">
          <span className="block animate-in fade-in slide-in-from-right-8 duration-700 delay-100 fill-mode-both">
            Train <span className="text-lime-400">Hard.</span>
          </span>
          <span className="block animate-in fade-in slide-in-from-right-8 duration-700 delay-200 fill-mode-both">
            Get <span className="text-white">Stronger.</span>
          </span>
        </h1>

        <p className="text-base md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
          Experience a professional training environment designed for real progress, quality equipment, and results-driven consistency.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">
          <Button
            onClick={() => scrollToSection('pricing')}
            size="lg"
            className="bg-lime-400 text-black hover:bg-lime-300 font-black text-xs uppercase tracking-widest h-16 px-12 rounded-none border-sweep"
          >
            Start Your Journey
          </Button>
          <Button
            onClick={() => scrollToSection('pricing')}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white hover:text-black font-black text-xs uppercase tracking-widest h-16 px-12 rounded-none transition-all"
          >
            Claim Free Week
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />
    </section>
  );
}

function StatsSection() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const stats = [
    { label: '500+ Active Members', target: 500 },
    { label: '4.9/5 Member Rating', target: 4.9 },
    { label: 'Open 7 Days a Week', target: 7 },
    { label: 'Premium Equipment Zone', target: 24 },
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
            const val = stat.target * progress;
            return stat.target % 1 === 0 ? Math.floor(val) : parseFloat(val.toFixed(1));
          });
          
          setCounts(newCounts);
          
          if (currentFrame === totalFrames) {
            clearInterval(timer);
          }
        }, frameRate);
        
        observer.unobserve(section);
      }
    }, { threshold: 0.1 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-20 bg-black relative z-10 -mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-px bg-white/5 border border-white/5 rounded-none glass-panel overflow-hidden scanline">
          {stats.map((stat, i) => (
            <div key={i} className="py-10 md:py-16 px-6 text-center border-white/5 md:border-r last:border-0 hover:bg-white/5 transition-colors group">
              <p className="text-lime-400 font-black text-2xl md:text-5xl tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-500 italic">
                {i === 1 ? counts[i] : counts[i] + (i === 0 ? '+' : i === 3 ? 'h' : '')}
              </p>
              <p className="text-gray-500 uppercase font-black text-[10px] tracking-[0.3em] whitespace-nowrap">
                {stat.label.split(' ').slice(1).join(' ')}
              </p>
            </div>
          ))}
        </div>

        {/* Growth Bar */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Capacity: 75% Peak reached</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400 italic">500 Members & Growing</span>
          </div>
          <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-lime-400 w-3/4" />
            <div className="absolute top-0 left-[75%] w-1 h-full bg-white shadow-[0_0_10px_#fff]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    { title: 'Full Gym Equipment', icon: Dumbbell, description: 'Complete range of strength and training equipment.' },
    { title: 'Strength & Cardio Zones', icon: Zap, description: 'Dedicated spaces for focused training.' },
    { title: 'Clean Modern Facility', icon: Shield, description: 'Immaculate gym designed for your comfort.' },
    { title: 'Flexible Membership', icon: TrendingUp, description: 'Plans that work for your lifestyle.' },
    { title: 'Group Classes', icon: Users, description: 'High-energy classes with expert guidance.' },
    { title: 'Fitness Environment', icon: Star, description: 'Train with people committed to progress.' },
  ];

  return (
    <section id="why" className="py-24 md:py-48 bg-black relative overflow-hidden diag-stripes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 uppercase italic">
            Built for <span className="text-lime-400">Progress.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="bg-white/5 border-white/5 hover:border-lime-400/30 transition-all duration-500 p-10 rounded-none group relative overflow-hidden transform hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-16 h-16 bg-lime-400/5 translate-x-8 -translate-y-8 rotate-45 group-hover:bg-lime-400/10 transition-colors" />
                <Icon className="w-14 h-14 text-lime-400 mb-6 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-xl font-black uppercase tracking-tight mb-4 italic">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Facilities() {
  const facilities = [
    { title: 'Strength Zone', description: 'Free weights, benches, racks, and machines for serious strength training.' },
    { title: 'Cardio Area', description: 'Treadmills, bikes, and conditioning equipment for endurance.' },
    { title: 'Functional Space', description: 'Room for mobility work, circuits, and dynamic training sessions.' },
    { title: 'Class Studio', description: 'Space for high-energy classes and guided workouts.' },
    { title: 'Recovery Area', description: 'Convenient amenities that make daily training easier.' },
    { title: 'Clean Facility', description: 'Well-maintained gym designed for comfort and consistency.' },
  ];

  return (
    <section id="facilities" className="py-24 md:py-48 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-lime-400/[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400">
              Our Facility
            </span>
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 uppercase italic leading-none">
            Train <span className="text-lime-400">Better.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, i) => (
            <Card key={i} className="bg-black/40 border-white/5 rounded-none overflow-hidden hover:border-lime-400/30 transition-all duration-500 group">
              <div className="h-56 bg-gradient-to-br from-white/10 via-white/5 to-transparent relative overflow-hidden">
                {/* CSS Gradient Panel Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-25 transition-all duration-700 group-hover:scale-110">
                   <Dumbbell size={150} className="text-white transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                </div>
                <div className="absolute top-4 left-4 bg-lime-400 text-black px-4 py-1 text-[10px] font-black uppercase">
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                
                {/* Visual Accent Arrow */}
                <div className="absolute bottom-4 right-4 text-lime-400 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="p-10 relative bg-black/40">
                <h3 className="text-xl font-black uppercase tracking-tight mb-4 italic">{facility.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{facility.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsIncluded() {
  const benefits = [
    { title: 'Full Equipment Access', description: 'Access to all gym equipment and training areas.' },
    { title: 'Group Workout Classes', description: 'Participate in high-energy group fitness sessions.' },
    { title: 'Flexible Membership Plans', description: 'Choose the plan that fits your needs.' },
    { title: 'Free Trial Access', description: 'Try the gym risk-free before committing.' },
    { title: 'Clean Professional Environment', description: 'Top-tier facility maintenance and hygiene.' },
    { title: 'Beginner-Friendly Atmosphere', description: 'Welcoming space for all fitness levels.' },
  ];

  return (
    <section className="py-24 md:py-48 bg-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-block mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400">
              Gym Benefits
            </span>
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 uppercase italic">
            What's <span className="text-lime-400">Included.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <Card key={i} className="bg-white/5 border-white/5 p-8 rounded-none hover:border-lime-400/30 transition-all group">
              <div className="flex items-start gap-5">
                <div className="w-4 h-4 rounded-full bg-lime-400 mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2 italic">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">{benefit.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ scrollToSection }: any) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const plans = [
    {
      name: 'Day Pass',
      price: '$8',
      description: 'Perfect for first-time visitors who want to try the gym.',
      features: ['Full gym access', '1 day only', 'Try before you buy'],
      popular: false,
      cta: 'Get Day Pass',
    },
    {
      name: 'Monthly',
      price: billingCycle === 'monthly' ? '$29' : '$19',
      period: '/month',
      description: 'Full access to gym equipment and training areas.',
      features: ['Full equipment access', 'Open 7 days a week', 'Locker area access', 'Shower facilities'],
      popular: true,
      cta: 'Join Now',
      save: billingCycle === 'yearly' ? 'Save 35%' : null
    },
    {
      name: 'Premium',
      price: billingCycle === 'monthly' ? '$49' : '$35',
      period: '/month',
      description: 'Gym access + classes + extra perks.',
      features: ['All Monthly features', 'Unlimited group classes', 'Priority gym hours', 'Guest passes (2/month)'],
      popular: false,
      cta: 'Choose Premium',
      save: billingCycle === 'yearly' ? 'Save 30%' : null
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-48 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400">
              Pricing Plans
            </span>
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 uppercase italic">
            Pick Your <span className="text-lime-400">Plan.</span>
          </h2>
          
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center mt-12 gap-4">
            <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 bg-white/10 rounded-full relative transition-colors focus:outline-none border-white/5"
            >
              <div className={`absolute top-1 w-5 h-5 bg-lime-400 rounded-full transition-all duration-300 ${billingCycle === 'monthly' ? 'left-1' : 'left-8'}`} />
            </button>
            <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>Yearly <span className="text-lime-400 ml-1">(-40%)</span></span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-8 items-center">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`relative border transition-all duration-500 rounded-none overflow-hidden ${
                plan.popular
                  ? 'border-lime-400 bg-black scale-105 z-10 lime-glow py-12'
                  : 'border-white/5 bg-white/5 hover:border-lime-400/20 py-8'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-lime-400 text-black px-6 py-1.5 text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              
              {plan.save && (
                <div className="absolute top-4 right-4 bg-lime-400/10 text-lime-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-lime-400/20">
                  {plan.save}
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">{plan.name}</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-lime-400 tracking-tighter italic">{plan.price}</span>
                  <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-8 font-medium leading-relaxed">{plan.description}</p>

                <Button
                  onClick={() => scrollToSection('pricing')}
                  className={`w-full mb-10 font-black text-xs uppercase tracking-widest h-14 rounded-none border-sweep ${
                    plan.popular
                      ? 'bg-lime-400 text-black hover:bg-lime-300'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4 border-t border-white/10 pt-8">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-4 text-xs font-bold uppercase tracking-tight">
                      <Check size={14} className="text-lime-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <p className="mt-8 text-[10px] text-gray-600 font-bold text-center uppercase tracking-widest">No lock-in contract. Cancel anytime.</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const results = [
    { label: 'Lost 5kg', sub: 'In 8 Weeks', icon: TrendingUp },
    { label: 'Built Routine', sub: '90% Consistency', icon: Zap },
    { label: 'Strength +25%', sub: 'On main lifts', icon: Dumbbell },
    { label: 'Confidence', sub: 'Mental growth', icon: Star },
  ];

  const testimonials = [
    {
      text: 'Expert28 gave me a place where I actually wanted to train consistently. The gym feels serious, clean, and motivating.',
      author: 'Rafi',
      age: 26,
    },
    {
      text: 'I tried other gyms before, but Expert28 felt much better in terms of atmosphere and equipment.',
      author: 'Dina',
      age: 24,
    },
    {
      text: 'The membership was simple, the facility was great, and I felt comfortable training even as a beginner.',
      author: 'Kevin',
      age: 30,
    },
  ];

  return (
    <section id="social-proof" className="py-24 md:py-48 bg-black relative overflow-hidden">
      <div className="absolute top-10 left-10 text-[20rem] font-black text-lime-400/[0.03] select-none pointer-events-none transform -rotate-12">"</div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-block mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400">
              Community Results
            </span>
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 uppercase italic leading-none">
            Real <span className="text-lime-400">Members.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
          {results.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} className="bg-white/5 border-white/5 p-8 text-center rounded-none group hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-1">
                <div className="flex flex-col items-center">
                  <Icon className="w-6 h-6 text-lime-400 mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  <p className="text-white font-black uppercase tracking-tighter text-sm md:text-md italic mb-1">{item.label}</p>
                  <p className="text-gray-500 font-bold uppercase text-[9px] tracking-widest">{item.sub}</p>
                  
                  {/* Subtle Progress Arrow Indicator */}
                  <div className="mt-4 w-8 h-[1px] bg-lime-400/20 group-hover:w-full transition-all duration-700" />
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto pb-12 md:pb-0 snap-x scrollbar-hide">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="min-w-[85vw] md:min-w-0 bg-white/5 border-white/5 p-12 rounded-none relative transform hover:-translate-y-2 transition-all duration-500 snap-center">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-lime-400 text-lime-400" />
                ))}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-10 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-[2px] bg-lime-400" />
                <p className="font-black uppercase tracking-tighter italic text-sm">{testimonial.author}, {testimonial.age}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      question: 'Can I try the gym before joining?',
      answer: 'Yes. You can claim a free trial or day pass to experience Expert28 before choosing a membership.',
    },
    {
      question: 'Is Expert28 beginner-friendly?',
      answer: 'Yes. The gym is designed for both beginners and experienced members.',
    },
    {
      question: 'What equipment does the gym have?',
      answer: 'Expert28 includes strength equipment, cardio machines, free weights, and functional training areas.',
    },
    {
      question: 'Are group classes included?',
      answer: 'Some membership plans include classes. You can compare plans in the pricing section.',
    },
  ];

  return (
    <section id="faq" className="py-24 md:py-48 bg-zinc-950 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-block mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-8xl font-black tracking-tighter mb-4 uppercase italic">
            Got <span className="text-lime-400">Questions?</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-white/5 px-6 rounded-none">
              <AccordionTrigger className="text-left hover:text-lime-400 transition py-6 no-underline">
                <span className="font-black uppercase tracking-tight italic">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-6 font-medium leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCTA({ scrollToSection }: any) {
  return (
    <section className="py-24 md:py-48 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-lime-400/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />
      
      <div className="absolute -left-20 bottom-0 select-none pointer-events-none opacity-5">
        <h2 className="text-[20rem] font-black italic tracking-tighter text-white uppercase leading-none">JOIN</h2>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-5xl md:text-[7rem] font-black tracking-tighter mb-10 leading-[0.9] uppercase italic">
          Built for <span className="text-lime-400">Real Training</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
          No commitment required. Experience a clean, modern, and motivating environment. Start today.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            onClick={() => scrollToSection('pricing')}
            size="lg"
            className="bg-lime-400 text-black hover:bg-lime-300 font-black text-xs uppercase tracking-widest h-16 px-14 rounded-none border-sweep"
          >
            Join Expert28 Today
          </Button>
          <Button
            onClick={() => scrollToSection('pricing')}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white hover:text-black font-black text-xs uppercase tracking-widest h-16 px-14 rounded-none transition-all"
          >
            Claim Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-24 pb-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div>
            <h3 className="text-2xl font-black italic mb-6">
              <span className="text-white">Expert</span><span className="text-lime-400">28</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium uppercase tracking-tight">
              Modern gym membership for serious training and real progress. Join the elite.
            </p>
          </div>

          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.3em] text-white mb-8 italic">Membership</h4>
            <ul className="space-y-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-lime-400 transition">Day Pass</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Monthly</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Premium</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.3em] text-white mb-8 italic">Explore</h4>
            <ul className="space-y-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <li><a href="#facilities" className="hover:text-lime-400 transition">Facilities</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Classes</a></li>
              <li><a href="#social-proof" className="hover:text-lime-400 transition">Results</a></li>
              <li><a href="#faq" className="hover:text-lime-400 transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.3em] text-white mb-8 italic">Contact</h4>
            <ul className="space-y-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <li><a href="mailto:hello@expert28.com" className="hover:text-lime-400 transition italic tracking-normal">hello@expert28.com</a></li>
              <li><a href="tel:+00000000000" className="hover:text-lime-400 transition">+00 000 000 000</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 EXPERT28 GYM PROTOTYPE. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MobileBottomCTA({ scrollToSection }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black/80 backdrop-blur-xl border-t border-white/5 p-4 z-30 animate-in slide-in-from-bottom-full duration-700">
      <Button
        onClick={() => scrollToSection('pricing')}
        className="w-full bg-lime-400 text-black hover:bg-lime-300 font-black h-16 rounded-none text-xs uppercase tracking-widest italic"
      >
        Join Expert28 Now
      </Button>
    </div>
  );
}

export default App;
