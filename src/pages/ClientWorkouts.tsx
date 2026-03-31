import { useAuth } from '../hooks/useAuth';
import {
  Dumbbell, Lock, ArrowLeft, Plus, Minus, CheckCircle2,
  Trash2, CalendarDays, Flame, RotateCcw, ChevronDown, ChevronUp
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all ${
                  title === ex
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
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            saved
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
        className={`flex-shrink-0 p-2 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100 ${
          confirming
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'text-gray-600 hover:text-red-400 hover:bg-red-500/10'
        }`}
        title={confirming ? 'Tap again to confirm delete' : 'Delete'}
      >
        {confirming ? <RotateCcw size={15} /> : <Trash2 size={15} />}
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

  // Group entries by date label for "Today"/"Yesterday" display
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const getDateLabel = (dateStr: string) => {
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Group by date
  const grouped = entries.reduce<Record<string, WorkoutEntry[]>>((acc, entry) => {
    const key = entry.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});
  const groupedKeys = Object.keys(grouped);
  const visibleKeys = showAll ? groupedKeys : groupedKeys.slice(0, 5);

  // Quick stats
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthCount = entries.filter(e => e.date.startsWith(thisMonth)).length;
  const totalVolume = entries
    .filter(e => e.date.startsWith(thisMonth) && e.weights_lbs && e.reps)
    .reduce((sum, e) => sum + (e.weights_lbs! * e.reps!), 0);

  return (
    <div className="min-h-screen bg-[#030712] text-white pb-16">
      {/* Background orb */}
      <div className="orb" style={{ width: '50vw', height: '50vw', background: 'var(--emerald)', top: '-20%', left: '-15%', opacity: 0.07 }} />

      <div className="max-w-2xl mx-auto px-4 pt-6 relative z-10">

        {/* ── HEADER ── */}
        <header className="flex items-center gap-4 mb-8">
          <button
            onClick={goBack}
            className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={20} className="text-emerald-500" />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Dumbbell size={22} className="text-emerald-500" />
              The Lab Tracker
            </h1>
            <p className="text-gray-500 text-xs font-bold mt-0.5">Log your reps. Track your progression.</p>
          </div>
        </header>

        {isGuest ? (
          <PaywallOverlay onUpgrade={goBack} />
        ) : (
          <div className="space-y-6">

            {/* ── MONTH STATS ── */}
            {!loading && entries.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">This Month</p>
                  <p className="text-3xl font-black text-white">{monthCount}</p>
                  <p className="text-[10px] text-emerald-500 font-bold mt-1">logged sets</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Volume</p>
                  <p className="text-3xl font-black text-white">
                    {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume}
                  </p>
                  <p className="text-[10px] text-blue-400 font-bold mt-1">lbs lifted</p>
                </div>
              </div>
            )}

            {/* ── QUICK LOG PANEL ── */}
            <QuickLogPanel onSaved={fetchEntries} />

            {/* ── HISTORY ── */}
            <div>
              <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CalendarDays size={14} />
                Session History
              </h2>

              {loading ? (
                <div className="glass-card p-10 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-3" />
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-widest animate-pulse">Loading...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
                  <Dumbbell className="text-gray-700 mb-3" size={36} />
                  <p className="text-sm font-black text-gray-500">No sets logged yet.</p>
                  <p className="text-xs text-gray-700 mt-1">Use the Quick Log above to log your first entry.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {visibleKeys.map(dateKey => (
                    <div key={dateKey}>
                      {/* Date group label */}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                          {getDateLabel(dateKey)}
                        </span>
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] font-bold text-gray-700">{grouped[dateKey].length} set{grouped[dateKey].length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="space-y-2">
                        {grouped[dateKey].map(entry => (
                          <HistoryEntry key={entry.id} entry={entry} onDelete={handleDelete} />
                        ))}
                      </div>
                    </div>
                  ))}

                  {groupedKeys.length > 5 && (
                    <button
                      onClick={() => setShowAll(v => !v)}
                      className="w-full p-3 bg-white/3 border border-white/8 rounded-xl text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-white/5 hover:text-gray-400 transition-all flex items-center justify-center gap-2"
                    >
                      {showAll ? <><ChevronUp size={14} /> Show Less</> : <><ChevronDown size={14} /> Show All {groupedKeys.length} Days</>}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
