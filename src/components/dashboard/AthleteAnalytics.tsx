import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Flame, TrendingUp } from 'lucide-react';

interface WorkoutData {
  date: string;
  weights_lbs: number | null;
  reps: number | null;
}

interface Props {
  workouts: WorkoutData[];
  consistencyPct: number | null;
}

export default function AthleteAnalytics({ workouts, consistencyPct }: Props) {
  // ─── VOLUME CALCULATION ─────────────────────────────────────────────────────
  const volumeData = useMemo(() => {
    const dailyVolume: Record<string, number> = {};
    
    // Last 14 days
    const last14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last14.forEach(d => dailyVolume[d] = 0);

    workouts.forEach(w => {
      if (w.date && w.weights_lbs && w.reps && dailyVolume[w.date] !== undefined) {
        dailyVolume[w.date] += (w.weights_lbs * w.reps);
      }
    });

    return last14.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      volume: dailyVolume[date]
    }));
  }, [workouts]);

  // ─── PR DETECTION ───────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* VOLUME CHART */}
      <div className="md:col-span-2 glass-card p-6 min-h-[300px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500">Volume Progression</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Total LBS Lifted (14-Day View)</p>
          </div>
          <TrendingUp className="text-emerald-500/50" size={18} />
        </div>
        
        <div className="flex-1 w-full min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="date" 
                fontSize={9} 
                tick={{ fill: '#4b5563', fontWeight: 600 }} 
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  background: '#0a0a0b', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#fff'
                }}
                itemStyle={{ color: '#10b981' }}
                cursor={{ stroke: 'rgba(16,185,129,0.2)', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="volume" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorVolume)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STREAK & ACHIEVEMENTS */}
      <div className="glass-card p-6 flex flex-col justify-between group overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6">Elite Status</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Flame size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Heat</p>
                <p className="text-xl font-black text-white">Advanced</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Consistency</p>
                <p className="text-xl font-black text-white">{consistencyPct ?? 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Badge */}
        <div className="mt-8 relative z-10">
          <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${
            (consistencyPct ?? 0) >= 80 
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
              : 'bg-white/5 border-white/10 text-gray-500'
          }`}>
            {(consistencyPct ?? 0) >= 80 ? 'Elite Streak Active' : 'Build Consistency'}
          </div>
        </div>

        <Flame 
          className="absolute -right-8 -bottom-8 text-blue-500 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000 rotate-12" 
          size={180} 
        />
      </div>
    </div>
  );
}
