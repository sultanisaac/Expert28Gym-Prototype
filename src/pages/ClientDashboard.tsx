import { useState, useEffect } from 'react';
import { Dumbbell, CheckCircle2, TrendingUp, Zap, Loader2, CreditCard, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import AthleteAnalytics from '../components/dashboard/AthleteAnalytics';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface RecentWorkout {
  id: string;
  title: string;
  date: string;
  weights_lbs: number | null;
  reps: number | null;
  is_completed: boolean;
}

export default function ClientDashboard({ setPathname }: { setPathname?: (path: string) => void }) {
  const { profile, user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [workoutCount, setWorkoutCount] = useState<number | null>(null);
  const [consistencyPct, setConsistencyPct] = useState<number | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([]);
  const [allWorkouts, setAllWorkouts] = useState<RecentWorkout[]>([]);

  const isGuest = !profile?.role || profile?.role === 'guest';

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

      if (!error && data && data.length > 0) setIsCheckedIn(true);
    };

    checkTodayAttendance();
  }, [user, isGuest]);

  useEffect(() => {
    if (!user || isGuest) return;

    const fetchStats = async () => {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthStartISO = monthStart.toISOString();

      const { count: wCount } = await supabase
        .from('workout_checklists')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', monthStartISO);

      setWorkoutCount(wCount ?? 0);

      const { data: attData } = await supabase
        .from('attendance')
        .select('check_in_time')
        .eq('user_id', user.id)
        .gte('check_in_time', monthStartISO);

      const uniqueDays = new Set((attData || []).map(a => new Date(a.check_in_time).toDateString())).size;
      const daysElapsed = new Date().getDate();
      const pct = daysElapsed > 0 ? Math.round((uniqueDays / daysElapsed) * 100) : 0;
      setConsistencyPct(Math.min(100, pct));

      const { data: wRecent } = await supabase
        .from('workout_checklists')
        .select('id, title, date, weights_lbs, reps, is_completed')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3);

      setRecentWorkouts(wRecent || []);

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
      const { error } = await supabase.from('attendance').insert([{ user_id: user.id, method: 'self_check_in' }]);
      if (error) throw error;
      setIsCheckedIn(true);
    } catch (err) {
      alert('Failed to check in. Please try again.');
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
        body: JSON.stringify({ email: user?.email, plan, user_id: user?.id, name: profile?.full_name }),
      });
      const result = await response.json();
      if (response.ok && result.url) window.location.href = result.url;
      else throw new Error(result.error);
    } catch (err) {
      alert('Failed to initiate checkout.');
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
      if (response.ok && result.url) window.location.href = result.url;
    } catch (err) {
      alert('Failed to open billing portal.');
    } finally {
      setBillingLoading(false);
    }
  };

  return (
    <DashboardLayout currentPath="/client/dashboard" setPathname={setPathname || (() => {})}>
      <div className="p-4 md:p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tight">Athlete Hub</h1>
          <p className="text-gray-500 mt-1">Welcome back, {profile?.full_name || 'Expert'}</p>
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase text-emerald-500">Tier: {profile?.membership_tier || 'Elite'}</span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase text-blue-500">Goal: 50 Sets / Mo</span>
          </div>
        </header>

        {!isGuest ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="md:col-span-2 glass-card p-8 relative overflow-hidden group">
              <h2 className="text-xl font-black uppercase tracking-tight mb-2">Facility Access</h2>
              <p className="text-gray-400 text-sm mb-6">Log your entry at the front desk</p>
              <button
                onClick={handleSelfCheckIn}
                disabled={isCheckedIn || isCheckingIn}
                className={`btn-${isCheckedIn ? 'outline-white' : 'blue'} w-full p-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 relative z-10`}
              >
                {isCheckingIn ? <Loader2 className="animate-spin" size={20} /> : isCheckedIn ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Zap size={20} />}
                {isCheckingIn ? 'Processing...' : isCheckedIn ? 'Checked In' : 'Self Check-In'}
              </button>
              <Zap className="absolute -right-8 -bottom-8 text-emerald-500 opacity-5 group-hover:opacity-10 transition-all pointer-events-none" size={240} />
            </div>

            <div onClick={() => setPathname?.('/client/workouts')} className="glass-card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors">
              <Dumbbell className="text-emerald-500 mb-4" size={32} />
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Workout Sets</h3>
              <p className="text-2xl font-black">{workoutCount ?? '0'}</p>
              <div className="w-12 h-1 bg-emerald-500/20 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, ((workoutCount || 0) / 50) * 100)}%` }} />
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <TrendingUp className="text-blue-500 mb-4" size={32} />
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Consistency</h3>
              <p className="text-2xl font-black">{consistencyPct ?? 0}%</p>
              <p className="text-blue-500 text-[10px] mt-2 font-black uppercase tracking-widest">Building Habit</p>
            </div>
          </div>
        ) : (
          <div className="mb-10 p-8 glass-card border-emerald-500/30 bg-emerald-500/5 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tight text-emerald-400 mb-2">Unlock Lab Access</h2>
              <p className="text-gray-300 mb-6">Upgrade to unlock full analytics, workout tracking, and facility check-ins.</p>
              <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-500/60">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Workout History</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Live Performance Radar</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> 24/7 Facility Entry</span>
              </div>
            </div>
            <Zap className="absolute -right-20 top-1/2 -translate-y-1/2 text-emerald-500 opacity-5" size={300} />
          </div>
        )}

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-black tracking-widest uppercase text-gray-600">Performance Radar</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <AthleteAnalytics workouts={allWorkouts} consistencyPct={consistencyPct} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             <div className="glass-card p-8">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-xl font-black uppercase tracking-tight">Recent Workouts</h2>
                   <button onClick={() => setPathname?.('/client/workouts')} className="text-emerald-500 text-xs font-black tracking-widest uppercase hover:underline">View All</button>
                </div>
                {!isGuest ? (
                  <div className="space-y-4">
                    {recentWorkouts.length === 0 ? (
                       <p className="text-gray-500 text-sm font-bold py-10 text-center">No segments logged this month.</p>
                    ) : (
                      recentWorkouts.map(w => (
                        <div key={w.id} className="flex items-center justify-between p-5 border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-gray-500 text-xs">
                                {new Date(w.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-black text-white uppercase text-sm tracking-tight">{w.title}</p>
                                <p className="text-gray-500 text-xs mt-1 font-bold">
                                  {w.weights_lbs ? `${w.weights_lbs} lbs` : 'Bodyweight'} · {w.reps || 0} Reps
                                </p>
                              </div>
                           </div>
                           <CheckCircle2 size={20} className={w.is_completed ? 'text-emerald-500' : 'text-gray-800'} />
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="blur-sm opacity-20 pointer-events-none space-y-4">
                       {[1,2,3].map(i => (
                         <div key={i} className="h-20 bg-white/5 rounded-2xl border border-white/5" />
                       ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-black/60 backdrop-blur-md p-4 px-6 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-emerald-500">Membership Required</div>
                    </div>
                  </div>
                )}
             </div>
          </div>

          <div className="space-y-6">
             <div className="glass-card p-8 border-white/5">
                <h2 className="text-xl font-black uppercase tracking-tight mb-8">Status</h2>
                {isGuest ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl group hover:border-emerald-500/50 transition-all">
                      <p className="text-sm font-black text-white uppercase group-hover:text-emerald-400 transition-colors">Elite member</p>
                      <p className="text-2xl font-black text-emerald-500 mt-1 mb-6">$149/mo</p>
                      <button
                        onClick={() => handleCheckout('Elite Expert')}
                        disabled={checkoutLoading !== null}
                        className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {checkoutLoading === 'Elite Expert' ? <Loader2 className="animate-spin" size={16} /> : 'Claim Elite Status'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleCheckout('Base Expert')}
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all text-left flex justify-between items-center group"
                    >
                       <div>
                          <p className="text-xs font-black text-white uppercase mb-1">Base Plan</p>
                          <p className="text-lg font-black text-white/50">$100/mo</p>
                       </div>
                       <ArrowRight size={14} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-emerald-500/[0.03] border border-emerald-500/20 rounded-2xl p-6">
                      <p className="text-[10px] text-emerald-500/50 font-black tracking-widest uppercase mb-2">Member Tier</p>
                      <p className="text-3xl font-black text-white mb-2">{profile?.membership_tier || 'Elite member'}</p>
                      <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active Access
                      </div>
                    </div>
                    <button
                      onClick={handleManageBilling}
                      disabled={billingLoading}
                      className="w-full p-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                    >
                      {billingLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                      {billingLoading ? 'Loading Portal...' : 'Manage Billing'}
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
