import './App.css';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';
import { Dumbbell, Zap, Users, TrendingUp, Shield, Star, Menu, X } from 'lucide-react';
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
    <div className="bg-black text-white min-h-screen">
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
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur border-b border-gray-900' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter">
            <span className="text-white">Expert</span><span className="text-lime-400">28</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm text-gray-300 hover:text-lime-400 transition"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={() => scrollToSection('pricing')}
              variant="outline"
              size="sm"
              className="border-gray-700 text-white hover:bg-gray-900"
            >
              Join Today
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-gray-900 px-4 py-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm text-gray-300 hover:text-lime-400 transition text-left"
                >
                  {link.label}
                </button>
              ))}
              <Button onClick={() => scrollToSection('pricing')} className="w-full bg-lime-400 text-black hover:bg-lime-500 mt-2">
                Join Today
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

function Hero({ scrollToSection }: any) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 via-transparent to-black pointer-events-none" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-tight">
          Train Hard.
          <br />
          Get Stronger.
          <br />
          <span className="text-lime-400">Join Expert28.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          A modern gym with quality equipment, flexible memberships, and an environment built for real progress.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => scrollToSection('pricing')}
            size="lg"
            className="bg-lime-400 text-black hover:bg-lime-500 font-bold text-lg h-14"
          >
            Join Expert28 Today
          </Button>
          <Button
            onClick={() => scrollToSection('pricing')}
            variant="outline"
            size="lg"
            className="border-lime-400/50 text-white hover:bg-lime-400/10 font-bold text-lg h-14"
          >
            Claim Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { label: '500+ Active Members', value: '' },
    { label: '4.9/5 Member Rating', value: '' },
    { label: 'Open 7 Days a Week', value: '' },
    { label: 'Premium Equipment Zone', value: '' },
  ];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="border border-gray-800 rounded-lg p-4 md:p-6 bg-gray-950/50 text-center">
              <p className="text-lime-400 font-bold text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
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
    { title: 'Flexible Membership Options', icon: TrendingUp, description: 'Plans that work for your lifestyle.' },
    { title: 'Group Classes Available', icon: Users, description: 'High-energy classes with expert guidance.' },
    { title: 'Supportive Fitness Environment', icon: Star, description: 'Train with people committed to progress.' },
  ];

  return (
    <section id="why" className="py-20 md:py-32 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            Why People Choose <span className="text-lime-400">Expert28</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="bg-gray-950 border-gray-800 hover:border-lime-400/50 transition p-6 group">
                <Icon className="w-10 h-10 text-lime-400 mb-4 group-hover:scale-110 transition" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
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
    { title: 'Cardio Area', description: 'Treadmills, bikes, and conditioning equipment for endurance and fat loss goals.' },
    { title: 'Functional Training Space', description: 'Room for mobility work, circuits, and dynamic training sessions.' },
    { title: 'Group Class Studio', description: 'Space for high-energy classes and guided workouts.' },
    { title: 'Locker / Shower Area', description: 'Convenient amenities that make daily training easier.' },
    { title: 'Clean Training Environment', description: 'Well-maintained gym designed for comfort and consistency.' },
  ];

  return (
    <section id="facilities" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            Everything You Need to <span className="text-lime-400">Train Better</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, i) => (
            <Card key={i} className="bg-gray-950 border-gray-800 overflow-hidden hover:border-lime-400/50 transition">
              <div className="h-32 bg-gradient-to-br from-lime-400/10 to-transparent" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                <p className="text-gray-400">{facility.description}</p>
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
    <section className="py-20 md:py-32 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            What's Included at <span className="text-lime-400">Expert28</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <Card key={i} className="bg-gray-950 border-gray-800 p-6 hover:border-lime-400/50 transition">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-lime-400 mt-2 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
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
      name: 'Monthly Membership',
      price: '$29',
      period: '/month',
      description: 'Full access to gym equipment and training areas.',
      features: ['Full equipment access', 'Open 7 days a week', 'Locker area access', 'Shower facilities'],
      popular: true,
      cta: 'Join Monthly',
    },
    {
      name: 'Premium Membership',
      price: '$49',
      period: '/month',
      description: 'Gym access + classes + extra perks.',
      features: ['All Monthly features', 'Unlimited group classes', 'Priority gym hours', 'Guest passes (2/month)'],
      popular: false,
      cta: 'Choose Premium',
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            Choose Your <span className="text-lime-400">Membership</span>
          </h2>
          <p className="text-gray-300 text-lg">Simple Memberships. No Confusing Choices.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`relative border transition ${
                plan.popular
                  ? 'border-lime-400 bg-gray-950 ring-1 ring-lime-400/50'
                  : 'border-gray-800 bg-gray-950 hover:border-lime-400/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-lime-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-lime-400">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <Button
                  onClick={() => scrollToSection('pricing')}
                  className={`w-full mb-6 font-bold h-11 ${
                    plan.popular
                      ? 'bg-lime-400 text-black hover:bg-lime-500'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 border-t border-gray-800 pt-6">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-lime-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
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
    'Lost 5 kg in 8 weeks',
    'Built stronger gym routine',
    'Increased training consistency',
    'Improved confidence and energy',
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
    <section id="social-proof" className="py-20 md:py-32 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            Real Members. <span className="text-lime-400">Real Progress.</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Built for Members Who Want More Than Just a Gym. See why people choose Expert28 for the environment, energy, and consistency it helps create.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {results.map((result, i) => (
            <Card key={i} className="bg-gray-950 border-gray-800 p-4 text-center">
              <p className="text-lime-400 font-bold text-sm md:text-base">{result}</p>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="bg-gray-950 border-gray-800 p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="fill-lime-400 text-lime-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-bold">— {testimonial.author}, {testimonial.age}</p>
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
    {
      question: 'Do I need to commit long-term?',
      answer: 'Not necessarily. You can start with a simpler plan or trial option before committing.',
    },
    {
      question: 'Is the gym crowded?',
      answer: 'Expert28 is positioned as organized, spacious, and designed for a better training experience.',
    },
    {
      question: 'What are the opening hours?',
      answer: 'Open daily: 6:00 AM – 10:00 PM',
    },
    {
      question: 'Is this only for advanced gym users?',
      answer: 'No. Expert28 is built for beginners, intermediate members, and anyone serious about making progress.',
    },
    {
      question: 'How do I sign up?',
      answer: 'Choose your membership plan and complete the join form or contact the gym directly.',
    },
    {
      question: 'Is this a real gym website?',
      answer: 'This website is a prototype created for demonstration purposes.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
            Questions Before You <span className="text-lime-400">Join?</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-gray-800">
              <AccordionTrigger className="text-left hover:text-lime-400 transition py-4">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-4">
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
    <section className="py-20 md:py-32 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">
          Join a Gym Built for <span className="text-lime-400">Real Training</span>
        </h2>
        <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
          Train in a clean, modern, motivating environment with flexible membership options that fit your lifestyle.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => scrollToSection('pricing')}
            size="lg"
            className="bg-lime-400 text-black hover:bg-lime-500 font-bold text-lg h-14"
          >
            Join Expert28 Today
          </Button>
          <Button
            onClick={() => scrollToSection('pricing')}
            variant="outline"
            size="lg"
            className="border-lime-400/50 text-white hover:bg-lime-400/10 font-bold text-lg h-14"
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
    <footer className="bg-black border-t border-gray-900 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-white">Expert</span><span className="text-lime-400">28</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Modern gym membership for people who want serious training and real progress.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Membership</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-lime-400 transition">Day Pass</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Monthly Membership</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Premium Membership</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#facilities" className="hover:text-lime-400 transition">Facilities</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Classes</a></li>
              <li><a href="#social-proof" className="hover:text-lime-400 transition">Results</a></li>
              <li><a href="#faq" className="hover:text-lime-400 transition">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="mailto:hello@expert28.com" className="hover:text-lime-400 transition">hello@expert28.com</a></li>
              <li><a href="tel:+00000000000" className="hover:text-lime-400 transition">+00 000 000 000</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Instagram</a></li>
              <li><a href="#" className="hover:text-lime-400 transition">Location</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8">
          <p className="text-gray-500 text-sm text-center">
            This website is a prototype created for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}

function MobileBottomCTA({ scrollToSection }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black border-t border-gray-800 p-3 z-30">
      <Button
        onClick={() => scrollToSection('pricing')}
        className="w-full bg-lime-400 text-black hover:bg-lime-500 font-bold h-12"
      >
        Join Now
      </Button>
    </div>
  );
}

export default App;
