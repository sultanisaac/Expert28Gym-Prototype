import { useAuth } from '../hooks/useAuth';
import { Shield, Users, CreditCard, BarChart3, LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      {/* Sidebar */}
      <div className="w-64 border-right border-white/5 bg-white/2 backdrop-blur-xl p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Shield className="text-emerald-500" size={24} />
          <span className="font-black tracking-tight uppercase">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 bg-emerald-500/10 text-emerald-500 rounded-xl font-bold transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-gray-400 hover:text-white rounded-xl font-bold transition-all">
            <Users size={20} /> Clients
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-gray-400 hover:text-white rounded-xl font-bold transition-all">
            <CreditCard size={20} /> Payments
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-gray-400 hover:text-white rounded-xl font-bold transition-all">
            <BarChart3 size={20} /> Reports
          </button>
        </nav>

        <button 
          onClick={() => { signOut(); window.location.href = '/'; }}
          className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all mt-auto"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Performance Lab Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back, {profile?.full_name || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">{profile?.email}</p>
              <p className="text-xs text-emerald-500 font-black tracking-widest uppercase">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-500">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-6 border-l-4 border-l-emerald-500">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Total Members</p>
            <p className="text-4xl font-black">542</p>
            <p className="text-emerald-500 text-xs mt-2 font-bold">+12% from last month</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-blue-500">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Monthly Revenue</p>
            <p className="text-4xl font-black">$12,850</p>
            <p className="text-blue-500 text-xs mt-2 font-bold">+5% from last month</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-amber-500">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Daily Attendance</p>
            <p className="text-4xl font-black">86</p>
            <p className="text-amber-500 text-xs mt-2 font-bold">Steady performance</p>
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-xl hover:bg-white/2 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Users size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">New Member Registration</p>
                    <p className="text-gray-500 text-xs">User signed up for Base Expert plan</p>
                  </div>
                </div>
                <span className="text-gray-500 text-xs font-medium">2 hours ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
