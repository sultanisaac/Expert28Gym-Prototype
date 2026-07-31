import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export const facilityZones = [
  { 
    id: 'strength',
    badge: 'Strength', 
    title: 'Strength Training Zone', 
    desc: [
      { name: 'Free Weights', text: 'A dedicated area containing dumbbells, barbells, weight plates, and kettlebells.' },
      { name: 'Support Benches', text: 'Flat, incline, and adjustable utility benches for weight exercises.' },
      { name: 'Power Racks & Cages', text: 'Sturdy metal frames used for safe squats, bench presses, and overhead lifts.' },
      { name: 'Resistance Machines', text: 'Cable crossovers, lat pulldowns, leg presses, and Smith machines that guide your movement path.' }
    ],
    image: '/images/strength_training_zone.png' 
  },
  { 
    id: 'cardio',
    badge: 'Cardio', 
    title: 'Cardio Zone', 
    desc: [
      { name: 'Treadmills', text: 'Motorized running belts used for walking, jogging, or interval sprinting.' },
      { name: 'Elliptical Trainers', text: 'Low-impact cross-trainers that simulate running without joint impact.' },
      { name: 'Stationary Bikes', text: 'Upright, recumbent, or spin bicycles for lower-body conditioning.' },
      { name: 'Rowing Machines & Stair Climbers', text: 'High-intensity cardiovascular equipment mimicking rowing or stair climbing.' }
    ],
    image: '/images/cardio_zone.png' 
  },
  { 
    id: 'mobility',
    badge: 'Mobility', 
    title: 'Functional & Mobility Space', 
    desc: [
      { name: 'Stretching Areas', text: 'Open floor space equipped with padded mats, foam rollers, and yoga blocks.' },
      { name: 'Functional Gear', text: 'Multi-use tools like medicine balls, resistance bands, TRX straps, and jump ropes.' }
    ],
    image: '/images/functional_mobility_space.png' 
  },
  { 
    id: 'amenities',
    badge: 'Amenities', 
    title: 'Hygiene & General Amenities', 
    desc: [
      { name: 'Locker Rooms', text: 'Secure storage spaces for your personal bags, clothing, and valuables.' },
      { name: 'Showers & Restrooms', text: 'Dedicated facilities for cleaning up post-workout, often supplied with complimentary toiletries.' },
      { name: 'Hydration Stations', text: 'Water coolers or bottle-refilling fountains spread throughout the floor.' }
    ],
    image: '/images/hygiene_amenities.png' 
  },
];

interface FacilityPageProps {
  id: string;
  setPathname: (p: string) => void;
}

export default function FacilityPage({ id, setPathname }: FacilityPageProps) {
  const zone = facilityZones.find(z => z.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!zone) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#f9fafb' }}>
        <h2>Facility not found</h2>
        <button onClick={() => { window.history.pushState({}, '', '/'); setPathname('/'); }} className="btn-blue" style={{ padding: '0.75rem 1.5rem', marginTop: '1rem' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingTop: '6rem' }}>
      {/* Background Effect */}
      <div className="orb" style={{ width: '40vw', height: '40vw', background: 'var(--emerald)', top: '-10%', left: '-10%', opacity: 0.15 }} />
      


      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ animation: 'fade-in 0.6s ease-out forwards' }}>
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
            
            {/* Image on the left */}
            <div className="w-full md:w-1/2 relative md:sticky md:top-32 h-[45vh] md:h-[calc(100vh-10rem)] mb-8 md:mb-0">
              <div style={{ borderRadius: '1.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', height: '100%' }}>
                <img src={zone.image} alt={zone.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* Information on the right */}
            <div className="w-full md:w-1/2" style={{ display: 'flex', flexDirection: 'column' }}>
              <button 
                onClick={() => { window.history.pushState({}, '', '/'); setPathname('/'); }}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: '#9ca3af', 
                  cursor: 'pointer', 
                  fontWeight: 600, 
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                  marginBottom: '2rem',
                  alignSelf: 'flex-start',
                  background: 'none',
                  border: 'none',
                  padding: 0
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
              >
                <ArrowLeft size={18} /> Back to Home
              </button>

              <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '0.25rem 0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                {zone.badge}
              </div>
              
              <h1 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.15rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '2rem' }}>
                {zone.title}
              </h1>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>What to Expect</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {zone.desc.map((item, i) => (
                    <div key={i} className="glass-card" style={{ padding: '2rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginBottom: '0.75rem' }}>{item.name}</h3>
                      <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.6 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
