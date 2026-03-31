import { useState, useEffect } from 'react';
import { Dumbbell, LogOut, CheckCircle2, TrendingUp, Zap, Loader2, ExternalLink, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import AthleteAnalytics from '../components/dashboard/AthleteAnalytics';

interface RecentWorkout {
  id: string;
  title: string;
  date: string;
  weights_lbs: number | null;
  reps: number | null;
  is_completed: boolean;
}

export default function ClientDashboard({ setPathname }: { setPathname?: (path: string) => void }) {
  const { profile, user, signOut } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [workoutCount, setWorkoutCount] = useState<number | null>(null);
  const [consistencyPct, setConsistencyPct] = useState<number | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<RecentWorkout[]>([]);

  const isGuest = !profile?.role || profile?.role === 'guest';

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

  // Fetch real workout count and consistency for this month
  useEffect(() => {
    if (!user || isGuest) return;

    const fetchStats = async () => {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthStartISO = monthStart.toISOString();

      // Workout count (sets logged this month)
      const { count: wCount } = await supabase
        .from('workout_checklists')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', monthStartISO);

      setWorkoutCount(wCount ?? 0);

      // Consistency: (days attended / days elapsed this month) * 100
      const { data: attData } = await supabase
        .from('attendance')
        .select('check_in_time')
        .eq('user_id', user.id)
        .gte('check_in_time', monthStartISO);

      const uniqueDays = new Set(
        (attData || []).map(a => new Date(a.check_in_time).toDateString())
      ).size;
      const daysElapsed = new Date().getDate(); // day-of-month = days elapsed
      const pct = daysElapsed > 0 ? Math.round((uniqueDays / daysElapsed) * 100) : 0;
      setConsistencyPct(Math.min(100, pct));

      // Recent 3 workout entries
      const { data: wRecent } = await supabase
        .from('workout_checklists')
        .select('id, title, date, weights_lbs, reps, is_completed')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentWorkouts(wRecent || []);

      // All workouts for analytics (limit to 100 for perf)
      const { data: wAll } = await supabase
        .from('workout_checklists')
        .select('id, title, date, weights_lbs, reps, is_completed')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(200);

      setAllWorkouts(wAll || []);
    };

    fetchStats();
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
        window.location.href = result.url;
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

  const handleManageBilling = async () => {
    if (!user?.email || billingLoading) return;
    setBillingLoading(true);
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const result = await response.json();
      if (response.ok && result.url) {
        window.location.href = result.url;
      } else {
        throw new Error(result.error || 'Could not open billing portal');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to open billing portal. Please try again.');
    } finally {
      setBillingLoading(false);
    }
  };

  const shareStats = () => {
    const text = `Athlete: ${profile?.full_name}\nMonth Volume: ${workoutCount || 0} Sets\nConsistency: ${consistencyPct || 0}%\nElite Labs Status: Active`;
    if (navigator.share) {
      navigator.share({ title: 'Expert28 Lab Stats', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('Performance stats copied to clipboard!');
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
              onClick={shareStats}
              className="flex items-center gap-2 p-3 text-emerald-400 hover:bg-emerald-500/10 rounded-xl font-bold transition-all"
            >
              <ExternalLink size={20} /> <span className="hidden md:inline">Share Progress</span>
            </button>
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
          <>
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
                <p className="text-2xl font-black">{workoutCount ?? '—'}</p>
                <p className="text-xs text-emerald-500 mt-2 font-bold">Sets this month</p>
              </div>

              <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                <TrendingUp className="text-blue-500 mb-4" size={32} />
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Consistency</h3>
                <p className="text-2xl font-black">{consistencyPct !== null ? `${consistencyPct}%` : '—'}</p>
                <p className="text-blue-500 text-xs mt-2 font-bold">
                  {consistencyPct !== null && consistencyPct >= 80 ? 'Elite Tier' : consistencyPct !== null && consistencyPct >= 50 ? 'On Track' : 'Building Habit'}
                </p>
              </div>
            </div>

            {/* PERFORMANCE ANALYTICS */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-black tracking-widest uppercase text-gray-600">Advanced Analytics</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <AthleteAnalytics workouts={allWorkouts} consistencyPct={consistencyPct} />
            </div>
          </>
        )}

        {isGuest && (
          <div className="mb-10 p-8 glass-card border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tight text-emerald-400 mb-2">Unlock Lab Access</h2>
              <p className="text-gray-300 mb-6">You've created your identity. Now it's time to choose your path and unlock full access to the Expert28 training platform and facility check-ins.</p>
              <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Workout Tracking</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Facility Entry</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-emerald-500" /> Progress Stats</span>
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
                <div className="space-y-3">
                  {recentWorkouts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Dumbbell className="text-gray-700 mb-2" size={28} />
                      <p className="text-sm text-gray-500 font-bold">No workouts logged yet.</p>
                      <button
                        onClick={() => setPathname ? setPathname('/client/workouts') : window.location.href = '/client/workouts'}
                        className="mt-3 text-xs font-black text-emerald-500 uppercase tracking-widest hover:underline"
                      >
                        Start Logging →
                      </button>
                    </div>
                  ) : (
                    recentWorkouts.map(w => {
                      const dayLabel = new Date(w.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
                      return (
                        <div key={w.id} className="flex items-center justify-between p-4 border border-white/5 rounded-xl hover:bg-white/3 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center font-black text-gray-500 text-[10px]">
                              {dayLabel}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{w.title}</p>
                              <p className="text-gray-500 text-xs mt-0.5">
                                {[w.weights_lbs ? `${w.weights_lbs} lbs` : null, w.reps ? `${w.reps} reps` : null].filter(Boolean).join(' · ') || 'No metrics logged'}
                              </p>
                            </div>
                          </div>
                          {w.is_completed && (
                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })
                  )}
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
                  
                  {/* ELITE PLAN */}
                  <div className="relative group">
                    <div className="absolute top-0 right-4 -translate-y-1/2 bg-emerald-500 text-[#030712] text-[10px] font-black tracking-widest px-3 py-1 rounded-full z-10">MOST POPULAR</div>
                    <button
                      onClick={() => handleCheckout('Elite Expert')}
                      disabled={checkoutLoading !== null}
                      className="flex flex-col items-start w-full p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl hover:bg-emerald-500/20 transition-all text-left relative overflow-hidden group shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                    >
                      {checkoutLoading === 'Elite Expert' && <Loader2 className="absolute right-6 top-6 animate-spin text-emerald-500" size={20} />}
                      <div className="flex justify-between items-end w-full mb-4">
                        <div>
                          <span className="text-lg font-black text-white block">Elite Expert</span>
                          <span className="text-emerald-500 text-xl font-black">$149<span className="text-xs text-gray-500 font-bold ml-1">/mo</span></span>
                        </div>
                        <Zap size={40} className="text-emerald-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                      </div>
                      <div className="space-y-2 mb-6">
                        {['All Base Access', '2x Personal Training / mo', 'Custom Nutrition Plan', 'Recovery Zone'].map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-300">
                            <CheckCircle2 size={12} className="text-emerald-500" /> {f}
                          </div>
                        ))}
                      </div>
                      <div className="w-full py-3 bg-emerald-500 text-[#030712] text-center rounded-xl font-black text-xs uppercase tracking-widest group-hover:scale-[1.02] transition-transform">Unlock Access</div>
                    </button>
                  </div>

                  {/* BASE PLAN */}
                  <button
                    onClick={() => handleCheckout('Base Expert')}
                    disabled={checkoutLoading !== null}
                    className="flex flex-col items-start w-full p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-left relative group"
                  >
                    {checkoutLoading === 'Base Expert' && <Loader2 className="absolute right-6 top-6 animate-spin text-white" size={20} />}
                    <div className="flex justify-between items-end w-full mb-4">
                      <div>
                        <span className="text-lg font-black text-white block">Base Expert</span>
                        <span className="text-white text-xl font-black">$100<span className="text-xs text-gray-500 font-bold ml-1">/mo</span></span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      {['Unlimited Access', 'All 6 Training Zones', 'Locker Access', '7 Days a Week'].map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                          <CheckCircle2 size={12} className="text-gray-600" /> {f}
                        </div>
                      ))}
                    </div>
                    <div className="w-full py-3 border border-white/20 text-center rounded-xl font-black text-xs uppercase tracking-widest group-hover:bg-white/5 transition-colors">Select Plan</div>
                  </button>

                  {/* TRIAL PLAN */}
                  <button
                    onClick={() => handleCheckout('7-Day Trial')}
                    disabled={checkoutLoading !== null}
                    className="flex flex-col items-start w-full p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-left relative group"
                  >
                    {checkoutLoading === '7-Day Trial' && <Loader2 className="absolute right-6 top-6 animate-spin text-white" size={20} />}
                    <div className="flex justify-between items-end w-full mb-4">
                      <div>
                        <span className="text-lg font-black text-white block">7-Day Trial</span>
                        <span className="text-white text-xl font-black">$40<span className="text-xs text-gray-500 font-bold ml-1">/one-time</span></span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-6">
                      {['Full Access for 7 Days', 'Intro Strategy Session', 'Class Access', 'Locker Included'].map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                          <CheckCircle2 size={12} className="text-gray-600" /> {f}
                        </div>
                      ))}
                    </div>
                    <div className="w-full py-3 border border-white/20 text-center rounded-xl font-black text-xs uppercase tracking-widest group-hover:bg-white/5 transition-colors">Start Trial</div>
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
                    <p className="text-xs text-emerald-500 font-black tracking-widest uppercase mb-1">Status</p>
                    <p className="text-xl font-black text-white">{profile?.membership_tier || 'Client'}</p>
                    <p className="text-emerald-400 text-xs mt-2 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Active Access</p>
                  </div>
                  <button
                    onClick={handleManageBilling}
                    disabled={billingLoading}
                    className="flex items-center justify-center gap-2 w-full p-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {billingLoading
                      ? <Loader2 size={14} className="animate-spin" />
                      : <CreditCard size={14} />}
                    {billingLoading ? 'Opening...' : 'Manage Billing'}
                    {!billingLoading && <ExternalLink size={11} className="text-gray-600" />}
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
