import { useAuth } from '../hooks/useAuth';
import { Dumbbell, Lock, ArrowLeft, Plus, CheckCircle2, Save, Trash2, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Workout {
  id: string;
  title: string;
  date: string;
  weights_lbs: number | null;
  reps: number | null;
  notes: string;
  is_completed: boolean;
}

export default function ClientWorkouts({ setPathname }: { setPathname?: (path: string) => void }) {
  const { profile, user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reps, setReps] = useState('');
  const [weights, setWeights] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const isGuest = !profile?.membership_tier || profile?.membership_tier === 'guest';

  useEffect(() => {
    if (!user || isGuest) {
      setLoading(false);
      return;
    }
    
    fetchWorkouts();
  }, [user, isGuest]);

  const fetchWorkouts = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('workout_checklists')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setWorkouts(data || []);
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('workout_checklists')
        .insert([{
          user_id: user.id,
          title,
          date,
          reps: reps ? parseInt(reps, 10) : null,
          weights_lbs: weights ? parseFloat(weights) : null,
          notes,
          is_completed: true
        }]);

      if (error) throw error;
      
      // Reset form
      setTitle('');
      setReps('');
      setWeights('');
      setNotes('');
      
      // Refresh list
      fetchWorkouts();
    } catch (err) {
      console.error(err);
      alert('Failed to log workout');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) return;
    try {
      await supabase.from('workout_checklists').delete().eq('id', id);
      fetchWorkouts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8">
      {/* Background decoration */}
      <div className="orb" style={{ width: '40vw', height: '40vw', background: 'var(--emerald)', top: '-15%', left: '-10%', opacity: 0.1 }} />

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => setPathname ? setPathname('/client/dashboard') : window.location.href = '/client/dashboard'}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-emerald-500" />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-emerald-500 flex items-center gap-2">
              <Dumbbell size={24} /> The Lab Tracker
            </h1>
            <p className="text-gray-500 mt-1 text-sm font-bold">Log your reps, track your progression.</p>
          </div>
        </header>

        {isGuest ? (
          // PAYWALL OVERLAY
          <div className="relative glass-card p-4 overflow-hidden border-emerald-500/20">
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#030712]/80 backdrop-blur-md">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl flex flex-col items-center text-center max-w-sm mb-8">
                <Lock className="text-emerald-500 mb-4" size={48} />
                <h2 className="text-xl font-black uppercase tracking-tight mb-2">Feature Locked</h2>
                <p className="text-gray-400 text-sm mb-6">Upgrade your membership to access the mobile workout tracker, log historical data, and monitor your consistency.</p>
                <button 
                  onClick={() => setPathname ? setPathname('/client/dashboard') : window.location.href = '/client/dashboard'}
                  className="btn-blue w-full font-black uppercase tracking-widest text-sm"
                >
                  Unlock Access
                </button>
              </div>
            </div>
            
            {/* Fake Content Behind Blur */}
            <div className="opacity-30 blur-[2px] pointer-events-none">
              <div className="space-y-4 mb-8">
                <div className="h-14 bg-white/5 rounded-xl border border-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-14 bg-white/5 rounded-xl border border-white/10" />
                  <div className="h-14 bg-white/5 rounded-xl border border-white/10" />
                </div>
                <div className="h-32 bg-white/5 rounded-xl border border-white/10" />
                <div className="h-14 bg-emerald-500/20 rounded-xl border border-emerald-500/30" />
              </div>
              
              <div className="h-24 bg-white/5 rounded-xl border border-white/10 mb-4" />
              <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* LOGGER FORM */}
            <div className="glass-card p-6 border-emerald-500/20">
              <h2 className="text-sm font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Plus size={16} /> New Entry
              </h2>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Exercise</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Bench Press"
                      className="w-full bg-[#030712] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#030712] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weight (lbs)</label>
                    <input 
                      type="number" 
                      value={weights}
                      onChange={(e) => setWeights(e.target.value)}
                      placeholder="225"
                      className="w-full bg-[#030712] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors font-black text-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Reps</label>
                    <input 
                      type="number" 
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      placeholder="12"
                      className="w-full bg-[#030712] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors font-black text-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notes (Optional)</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Felt strong today, good form..."
                    rows={2}
                    className="w-full bg-[#030712] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={saving || !title.trim()}
                  className="btn-blue w-full p-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
                >
                  {saving ? 'Logging...' : <><Save size={18} /> Log Workout</>}
                </button>
              </form>
            </div>

            {/* HISTORICAL LOGS */}
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                <CalendarDays size={20} className="text-emerald-500" /> Recent History
              </h2>

              {loading ? (
                <div className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                  Loading data...
                </div>
              ) : workouts.length === 0 ? (
                <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
                  <Dumbbell className="text-gray-600 mb-4" size={32} />
                  <p className="text-gray-400 font-bold">No workouts logged yet.</p>
                  <p className="text-xs text-gray-600 mt-1">Your history will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {workouts.map(workout => (
                    <div key={workout.id} className="glass-card p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:bg-white/5 transition-colors duration-200">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {workout.is_completed && <CheckCircle2 size={14} className="text-emerald-500" />}
                          <h3 className="font-black text-lg">{workout.title}</h3>
                          <span className="text-xs text-gray-500 font-bold tracking-widest bg-black/40 px-2 py-0.5 rounded-md">
                            {new Date(workout.date).toLocaleDateString()}
                          </span>
                        </div>
                        {(workout.weights_lbs || workout.reps) && (
                          <div className="flex gap-4 text-sm font-bold text-gray-400 mt-2">
                            {workout.weights_lbs && <p><span className="text-gray-600 uppercase tracking-widest text-[10px]">Weight </span> <span className="text-white">{workout.weights_lbs}</span> lbs</p>}
                            {workout.reps && <p><span className="text-gray-600 uppercase tracking-widest text-[10px]">Reps </span> <span className="text-white">{workout.reps}</span></p>}
                          </div>
                        )}
                        {workout.notes && <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">"{workout.notes}"</p>}
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(workout.id)}
                        className="text-gray-600 hover:text-red-500 p-2 md:opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 self-end md:self-auto"
                        title="Delete record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
