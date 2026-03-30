import { useAuth } from '../hooks/useAuth';
import { Dumbbell, CreditCard, LogOut, CheckCircle2, TrendingUp, Zap, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ClientDashboard({ setPathname }: { setPathname?: (path: string) => void }) {
  const { profile, user, signOut } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const isGuest = !profile?.membership_tier || profile?.membership_tier === 'guest';

  // On mount, check if the user has already checked in today
  useEffect(() => {
    if (!user || isGuest) return;

    const checkTodayAttendance = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('attendance')
        .select('id')
        .eq('user_id', user.id)
        .gte('check_in_time', today.toISOString())
        .limit(1);

      if (!error && data && data.length > 0) {
        setIsCheckedIn(true);
      }
    };

    checkTodayAttendance();
  }, [user, isGuest]);

  const handleSelfCheckIn = async () => {
    if (!user || isCheckedIn) return;
    setIsCheckingIn(true);

    try {
      const { error } = await supabase
        .from('attendance')
        .insert([{ user_id: user.id, method: 'self_check_in' }]);

      if (error) throw error;
      setIsCheckedIn(true);
    } catch (err) {
      console.error('Failed to check in:', err);
      alert('Failed to check in. Please try again or see front desk.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckout = async (plan: string) => {
    setCheckoutLoading(plan);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user?.email, 
          plan,
          user_id: user?.id,
          name: profile?.full_name
        }),
      });

      const result = await response.json();
      if (response.ok && result.url) {
        window.location.href = result.url; // Redirect to Stripe
      } else {
        throw new Error(result.error || 'Checkout failed');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8">
      {/* Background decoration */}
      <div className="orb" style={{ width: '40vw', height: '40vw', background: 'var(--emerald)', top: '-15%', left: '-10%', opacity: 0.1 }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Athlete Performance Hub</h1>
            <p className="text-gray-500 mt-1">Welcome back, {profile?.full_name || 'Expert'}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { signOut(); window.location.href = '/'; }}
              className="flex items-center gap-2 p-3 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all"
            >
              <LogOut size={20} /> <span className="hidden md:inline">Logout</span>
            </button>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-500">
              {profile?.full_name?.charAt(0) || 'E'}
            </div>
          </div>
        </header>

        {/* TOP METRICS ROW */}
        {!isGuest && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {/* Main action card */}
            <div className="md:col-span-2 glass-card p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10">
                <h2 className="text-xl font-black uppercase tracking-tight mb-2">Facility Access</h2>
                <p className="text-gray-400 text-sm mb-6">Tap below to check-in at the front desk</p>
                
                <button 
                  onClick={handleSelfCheckIn}
                  disabled={isCheckedIn || isCheckingIn}
                  className={`btn-${isCheckedIn ? 'outline-white' : 'blue'} w-full p-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors relative`}
                >
                  {isCheckingIn ? (
                    <Loader2 className="animate-spin text-white" size={20} />
                  ) : isCheckedIn ? (
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  ) : (
                    <Zap size={20} />
                  )}
                  {isCheckingIn ? 'Processing...' : isCheckedIn ? 'Checked In' : 'Self Check-In'}
                </button>
              </div>
              
              {/* Background design */}
              <Zap className={`absolute -right-8 -bottom-8 text-emerald-500 transition-all duration-700 ease-out ${isCheckedIn ? 'opacity-20 scale-110' : 'opacity-5 group-hover:scale-105'}`} size={240} />
            </div>

            <div 
              onClick={() => setPathname ? setPathname('/client/workouts') : window.location.href = '/client/workouts'}
              className="glass-card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors"
            >
              <Dumbbell className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Workouts</h3>
              <p className="text-2xl font-black">12</p>
              <p className="text-xs text-emerald-500 mt-2 font-bold">This month</p>
            </div>

            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <TrendingUp className="text-blue-500 mb-4" size={32} />
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Consistency</h3>
              <p className="text-2xl font-black">94%</p>
              <p className="text-blue-500 text-xs mt-2 font-bold">Elite Tier</p>
            </div>
          </div>
        )}

        {isGuest && (
          <div className="mb-10 p-8 glass-card border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tight text-emerald-400 mb-2">Unlock Lab Access</h2>
              <p className="text-gray-300 mb-6">You've created your identity. Now it's time to choose your path and unlock full access to the Expert28 training platform and facility check-ins.</p>
              <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500"/> Workout Tracking</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500"/> Facility Entry</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500"/> Progress Stats</span>
              </div>
            </div>
            <Zap className="absolute -right-20 top-1/2 -translate-y-1/2 text-emerald-500 opacity-10" size={300} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {!isGuest ? (
              <div className="glass-card p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-black uppercase tracking-tight">Recent Workouts</h2>
                  <button 
                    onClick={() => setPathname ? setPathname('/client/workouts') : window.location.href = '/client/workouts'}
                    className="text-emerald-500 text-xs font-black tracking-widest uppercase hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-gray-500 text-xs">
                          {i === 1 ? 'MON' : i === 2 ? 'WED' : 'FRI'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">Full Body Power</p>
                          <p className="text-gray-500 text-xs">Squat / Bench / Row</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black">8,450 lbs</p>
                        <p className="text-gray-500 text-xs text-emerald-500 font-bold tracking-widest">COMPLETE</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 flex flex-col items-center justify-center text-center opacity-50 relative pointer-events-none">
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <div className="bg-black/80 p-4 px-8 rounded-full border border-white/10 backdrop-blur-md">
                    <p className="font-black tracking-widest uppercase text-sm">Select A Membership to Unlock</p>
                  </div>
                </div>
                <div className="blur-sm w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black uppercase tracking-tight">Recent Workouts</h2>
                  </div>
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5" />
                          <div className="space-y-2">
                            <div className="w-24 h-4 bg-white/10 rounded" />
                            <div className="w-32 h-3 bg-white/5 rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={`glass-card p-6 ${isGuest ? 'ring-2 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative z-30' : ''}`}>
              <h2 className="text-lg font-black uppercase tracking-tight mb-4">Membership</h2>
              
              {isGuest ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-2">Upgrade to Unlock Lab Access</p>
                  
                  <button 
                    onClick={() => handleCheckout('Elite Expert')}
                    disabled={checkoutLoading !== null}
                    className="flex flex-col items-start w-full p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-colors text-left relative overflow-hidden group"
                  >
                    {checkoutLoading === 'Elite Expert' && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-emerald-500" size={20} />}
                    <span className="text-xs text-emerald-500 font-black tracking-widest uppercase mb-1 drop-shadow-md">MOST POPULAR</span>
                    <span className="text-lg font-black text-white">Elite Expert</span>
                    <span className="text-gray-400 text-xs font-bold">$149 / month</span>
                  </button>

                  <button 
                    onClick={() => handleCheckout('Base Expert')}
                    disabled={checkoutLoading !== null}
                    className="flex flex-col items-start w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left relative"
                  >
                    {checkoutLoading === 'Base Expert' && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-white" size={20} />}
                    <span className="text-lg font-black text-white">Base Expert</span>
                    <span className="text-gray-400 text-xs font-bold">$100 / month</span>
                  </button>

                  <button 
                    onClick={() => handleCheckout('7-Day Trial')}
                    disabled={checkoutLoading !== null}
                    className="flex flex-col items-start w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left relative"
                  >
                     {checkoutLoading === '7-Day Trial' && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-white" size={20} />}
                    <span className="text-lg font-black text-white">7-Day Trial</span>
                    <span className="text-gray-400 text-xs font-bold">$40 one-time</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
                    <p className="text-xs text-emerald-500 font-black tracking-widest uppercase mb-1">Status</p>
                    <p className="text-xl font-black text-white">{profile?.membership_tier || 'Client'}</p>
                    <p className="text-emerald-400 text-xs mt-2 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Active Access</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full p-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                    <CreditCard size={14} /> Manage Billing
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
