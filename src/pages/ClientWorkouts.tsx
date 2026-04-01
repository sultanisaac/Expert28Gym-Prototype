import { useAuth } from '../hooks/useAuth';
import {
  Dumbbell, Lock, Plus, Minus, CheckCircle2,
  Trash2, CalendarDays, Flame, RotateCcw, ChevronDown, ChevronUp
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/dashboard/DashboardLayout';

interface WorkoutEntry {
  id: string;
  title: string;
  date: string;
  weights_lbs: number | null;
  reps: number | null;
  notes: string | null;
  is_completed: boolean;
  created_at: string;
}

// ─── QUICK-LOG PANEL ──────────────────────────────────────────────────────────

function QuickLogPanel({ onSaved }: { onSaved: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reps, setReps] = useState(10);
  const [weights, setWeights] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [saved, setSaved] = useState(false);

  const common = ['Bench Press', 'Squat', 'Deadlift', 'OHP', 'Pull-Ups', 'Row', 'Dips', 'Curls'];

  const handleSave = async () => {
    if (!user || !title.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('workout_checklists').insert([{
        user_id: user.id,
        title: title.trim(),
        date,
        reps,
        weights_lbs: weights || null,
        notes: notes.trim() || null,
        is_completed: true,
      }]);
      if (error) throw error;
      // Flash success then reset
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
      setTitle('');
      setReps(10);
      setWeights(0);
      setNotes('');
      setShowNotes(false);
      onSaved();
    } catch (err) {
      console.error(err);
      alert('Failed to log. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const Counter = ({
    label, value, onChange, step, unit, min = 0
  }: { label: string; value: number; onChange: (v: number) => void; step: number; unit: string; min?: number }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
        >
          <Minus size={18} className="text-gray-400" />
        </button>
        <div className="text-center min-w-[64px]">
          <span className="text-3xl font-black text-white">{value}</span>
          <span className="text-xs text-gray-500 ml-1">{unit}</span>
        </div>
        <button
          type="button"
          onClick={() => onChange(value + step)}
          className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus size={18} className="text-emerald-400" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="glass-card border-emerald-500/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <Flame size={16} className="text-emerald-500" />
        <h2 className="text-sm font-black text-emerald-500 uppercase tracking-widest">Quick Log</h2>
      </div>

      <div className="p-5 space-y-5">
        {/* Exercise name */}
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Exercise</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Bench Press"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
          {/* Quick-pick chips */}
          <div className="flex flex-wrap gap-2 mt-2">
            {common.map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => setTitle(ex)}
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all ${title === ex
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                  }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Date row */}
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>

        {/* Big counters */}
        <div className="grid grid-cols-2 gap-4 py-2">
          <Counter label="Weight" value={weights} onChange={setWeights} step={5} unit="lbs" />
          <Counter label="Reps" value={reps} onChange={setReps} step={1} unit="reps" min={1} />
        </div>

        {/* Notes toggle */}
        <button
          type="button"
          onClick={() => setShowNotes(v => !v)}
          className="flex items-center gap-1.5 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-gray-400 transition-colors"
        >
          {showNotes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {showNotes ? 'Hide Notes' : '+ Add Notes'}
        </button>

        {showNotes && (
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Felt strong today..."
            rows={2}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none text-sm"
          />
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${saved
            ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
            : 'btn-blue'
            } ${(!title.trim() || saving) ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {saved ? (
            <><CheckCircle2 size={18} /> Logged!</>
          ) : saving ? (
            'Saving...'
          ) : (
            <><Plus size={18} /> Log This Set</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── HISTORY LIST ─────────────────────────────────────────────────────────────

function HistoryEntry({ entry, onDelete }: { entry: WorkoutEntry; onDelete: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) { setConfirming(true); setTimeout(() => setConfirming(false), 3000); return; }
    onDelete(entry.id);
  };

  const formattedDate = new Date(entry.date + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short'
  });

  return (
    <div className="glass-card p-4 flex items-center gap-4 group hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all duration-200">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-500/30 transition-colors">
        {entry.is_completed
          ? <CheckCircle2 size={18} className="text-emerald-500" />
          : <Dumbbell size={18} className="text-gray-500" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-black text-white text-sm">{entry.title}</h3>
          <span className="text-[10px] text-gray-600 font-bold tracking-widest bg-black/40 px-1.5 py-0.5 rounded-md uppercase">{formattedDate}</span>
        </div>
        <div className="flex gap-3 mt-1">
          {entry.weights_lbs != null && entry.weights_lbs > 0 && (
            <span className="text-xs text-gray-400 font-bold">
              <span className="text-gray-600 text-[10px] uppercase tracking-widest">Wt </span>
              <span className="text-white">{entry.weights_lbs}</span> lbs
            </span>
          )}
          {entry.reps != null && (
            <span className="text-xs text-gray-400 font-bold">
              <span className="text-gray-600 text-[10px] uppercase tracking-widest">Reps </span>
              <span className="text-white">{entry.reps}</span>
            </span>
          )}
        </div>
        {entry.notes && (
          <p className="text-[11px] text-gray-500 mt-1 italic line-clamp-1">"{entry.notes}"</p>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${confirming
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
          : 'bg-white/5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 border border-white/5'
          }`}
        title={confirming ? 'Confirm deletion' : 'Delete entry'}
      >
        {confirming ? (
          <>
            <span className="text-[10px] font-black uppercase tracking-widest">Confirm?</span>
            <RotateCcw size={14} className="animate-spin-slow" />
          </>
        ) : (
          <Trash2 size={15} />
        )}
      </button>
    </div>
  );
}

// ─── PAYWALL OVERLAY ──────────────────────────────────────────────────────────

function PaywallOverlay({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="relative glass-card border-white/5 overflow-hidden">
      {/* Frosted lock panel */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#030712]/80 backdrop-blur-md p-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-7 rounded-2xl flex flex-col items-center text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
            <Lock className="text-emerald-500" size={28} />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-2">Feature Locked</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Upgrade your membership to access The Lab Tracker — log sets, track weight, and monitor your progression.
          </p>
          <button
            onClick={onUpgrade}
            className="btn-blue w-full font-black uppercase tracking-widest text-sm py-3.5"
          >
            Unlock Access →
          </button>
        </div>
      </div>

      {/* Blurred ghost content behind */}
      <div className="opacity-30 blur-[3px] pointer-events-none p-6 space-y-4">
        <div className="h-12 bg-white/5 rounded-xl border border-white/10" />
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-7 flex-1 bg-white/5 rounded-lg border border-white/10" />)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
          <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
        </div>
        <div className="h-12 bg-emerald-500/20 rounded-xl border border-emerald-500/30" />
        <div className="h-14 bg-white/5 rounded-xl border border-white/10" />
        <div className="h-14 bg-white/5 rounded-xl border border-white/10" />
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ClientWorkouts({ setPathname }: { setPathname?: (path: string) => void }) {
  const { profile, user } = useAuth();
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showAll, setShowAll] = useState(false);

  const isGuest = !profile?.role || profile?.role === 'guest';

  useEffect(() => {
    if (!user || isGuest) { setLoading(false); return; }
    fetchEntries();
  }, [user, isGuest]);

  const fetchEntries = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workout_checklists')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Failed to fetch workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('workout_checklists').delete().eq('id', id);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const goBack = () => setPathname ? setPathname('/client/dashboard') : (window.location.href = '/client/dashboard');
  const today = new Date().toISOString().split('T')[0];

  // ─── DATA CALCULATIONS ──────────────────────────────────────────────────────
  
  // Weekly Consistency (Last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  // Monthly breakdown
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthEntries = entries.filter(e => e.date.startsWith(thisMonth));
  const monthVolume = monthEntries.reduce((sum, e) => sum + ((e.weights_lbs || 0) * (e.reps || 0)), 0);

  // Grouping for Daily view
  const grouped = entries.reduce<Record<string, WorkoutEntry[]>>((acc, entry) => {
    const key = entry.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});
  const groupedKeys = Object.keys(grouped);
  const visibleKeys = showAll ? groupedKeys : groupedKeys.slice(0, 5);

  return (
    <DashboardLayout 
      currentPath="/client/workouts" 
      setPathname={setPathname || (() => {})}
      breadcrumbs={[{ label: 'Athlete Hub', path: '/client/dashboard' }, { label: 'The Lab Tracker' }]}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
            <Dumbbell size={28} className="text-emerald-500" />
            The Lab Tracker
          </h1>
          <p className="text-gray-500 mt-1 font-bold">Monitor your progression across all timeframes.</p>
        </header>

        {isGuest ? (
          <PaywallOverlay onUpgrade={goBack} />
        ) : (
          <div className="space-y-8">

            {/* ── VIEW MODE SWITCHER ── */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 max-w-sm mx-auto md:mx-0">
              {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
                <button 
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === mode ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-white'}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <RotateCcw className="animate-spin text-emerald-500 mb-4" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest">Analyzing performance...</p>
              </div>
            ) : (
              <>
                {/* ── DAILY VIEW ── */}
                {viewMode === 'daily' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <QuickLogPanel onSaved={fetchEntries} />
                    
                    <div>
                      <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <CalendarDays size={12} /> Recent Sessions
                      </h2>
                      <div className="space-y-8">
                        {visibleKeys.length === 0 ? (
                          <div className="glass-card p-12 text-center border-white/5">
                            <Dumbbell className="mx-auto text-gray-800 mb-4" size={40} />
                            <p className="text-gray-500 font-bold italic">No sessions logged yet.</p>
                          </div>
                        ) : visibleKeys.map(dateKey => (
                          <div key={dateKey}>
                            <div className="flex items-center gap-4 mb-4">
                              <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] whitespace-nowrap">
                                {dateKey === today ? 'Today' : new Date(dateKey).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </span>
                              <div className="h-px flex-1 bg-white/5" />
                            </div>
                            <div className="space-y-3">
                              {grouped[dateKey].map(entry => (
                                <HistoryEntry key={entry.id} entry={entry} onDelete={handleDelete} />
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {groupedKeys.length > 5 && (
                          <button onClick={() => setShowAll(!showAll)} className="w-full p-4 border border-white/5 rounded-xl text-[10px] font-black text-gray-600 uppercase hover:text-gray-400 transition-colors">
                            {showAll ? 'Show Less' : `Show All ${groupedKeys.length} Days`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── WEEKLY VIEW ── */}
                {viewMode === 'weekly' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="glass-card p-6">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Weekly Consistency Strip</h3>
                      <div className="flex justify-between gap-1.5 md:gap-3">
                        {last7Days.map((d) => {
                          const hasWorkout = entries.some(e => e.date === d);
                          const isToday = d === today;
                          const dayName = new Date(d).toLocaleDateString('en-GB', { weekday: 'narrow' });
                          return (
                            <div key={d} className="flex-1 flex flex-col items-center gap-2">
                              <span className={`text-[10px] font-black uppercase ${isToday ? 'text-emerald-500' : 'text-gray-600'}`}>{dayName}</span>
                              <div className={`w-full aspect-square md:h-12 rounded-lg md:rounded-xl border flex items-center justify-center transition-all ${hasWorkout ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-white/5 border-white/10 opacity-30'}`}>
                                {hasWorkout && <CheckCircle2 size={16} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass-card p-6 border-blue-500/20">
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Weekly Volume Trend</p>
                         <p className="text-3xl font-black text-white">Calculated...</p>
                         <div className="h-1 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
                           <div className="h-full bg-blue-500 w-[65%]" />
                         </div>
                      </div>
                      <div className="glass-card p-6 border-emerald-500/20">
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Top Performer</p>
                         <p className="text-3xl font-black text-white">Compound Lifts</p>
                         <div className="flex gap-2 mt-4">
                            <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500">SQ</div>
                            <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500">BP</div>
                            <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500">DL</div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── MONTHLY VIEW ── */}
                {viewMode === 'monthly' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="glass-card p-6 text-center">
                        <Flame className="mx-auto text-orange-500 mb-2" size={20} />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Days</p>
                        <p className="text-3xl font-black text-white">{new Set(monthEntries.map(e => e.date)).size}</p>
                      </div>
                      <div className="glass-card p-6 text-center">
                        <Dumbbell className="mx-auto text-emerald-500 mb-2" size={20} />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Sets</p>
                        <p className="text-3xl font-black text-white">{monthEntries.length}</p>
                      </div>
                      <div className="glass-card p-6 text-center">
                        <RotateCcw className="mx-auto text-blue-500 mb-2" size={20} />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Avg Volume/Day</p>
                        <p className="text-3xl font-black text-white">
                          {monthEntries.length > 0 ? (monthVolume / new Set(monthEntries.map(e => e.date)).size / 1000).toFixed(1) : 0}k
                        </p>
                      </div>
                    </div>

                    <div className="glass-card p-8 text-center border-white/5">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="text-gray-600" size={24} />
                      </div>
                      <h3 className="font-black uppercase tracking-tight text-gray-400">Monthly Progress Map</h3>
                      <p className="text-xs text-gray-600 mt-2 max-w-sm mx-auto">Visualize your daily commitment in a calendar heatmap (Coming in v1.4)</p>
                      
                      {/* Simple dot grid placeholder */}
                      <div className="flex flex-wrap gap-2 justify-center mt-8 opacity-20">
                        {[...Array(30)].map((_, i) => (
                          <div key={i} className="w-4 h-4 rounded bg-emerald-500/50" />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
