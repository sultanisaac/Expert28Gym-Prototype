import { useAuth } from '../hooks/useAuth';
import { Dumbbell, CreditCard, LogOut, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

export default function ClientDashboard() {
  const { profile, signOut } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Main action card */}
          <div className="md:col-span-2 glass-card p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-xl font-black uppercase tracking-tight mb-2">Facility Access</h2>
              <p className="text-gray-400 text-sm mb-6">Tap below to check-in at the front desk</p>
              
              <button 
                onClick={() => setIsCheckedIn(true)}
                disabled={isCheckedIn}
                className={`btn-${isCheckedIn ? 'outline-white' : 'blue'} w-full p-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors`}
              >
                {isCheckedIn ? <CheckCircle2 className="text-emerald-500" /> : <Zap size={20} />}
                {isCheckedIn ? 'Checked In' : 'Self Check-In'}
              </button>
            </div>
            
            {/* Background design */}
            <Zap className="absolute -right-8 -bottom-8 text-emerald-500 opacity-5" size={240} />
          </div>

          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black uppercase tracking-tight">Recent Workouts</h2>
                <button className="text-emerald-500 text-xs font-black tracking-widest uppercase hover:underline">View All</button>
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
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-black uppercase tracking-tight mb-4">Membership</h2>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-4">
                <p className="text-xs text-emerald-500 font-black tracking-widest uppercase mb-1">Status</p>
                <p className="text-xl font-black text-white">Elite Expert Member</p>
                <p className="text-gray-400 text-xs mt-2 font-medium">Renews in 12 days</p>
              </div>
              <button className="flex items-center justify-center gap-2 w-full p-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                <CreditCard size={14} /> Manage Billing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
