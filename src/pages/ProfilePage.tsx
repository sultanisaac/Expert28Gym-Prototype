import { useAuth } from '../hooks/useAuth';
import { Mail, Shield, Calendar, MapPin, Phone, CreditCard, ChevronLeft } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors mb-8 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Profile Header */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0f1d] mb-8 group shadow-2xl">
          {/* Accent Header Gradient */}
          <div className="h-32 bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-emerald-600/20" />
          
          <div className="px-8 pb-8 flex flex-col md:flex-row md:items-end gap-6 -mt-12">
            <div className="relative">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-[#0a0f1d] object-cover shadow-2xl shadow-emerald-500/10" 
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-4xl font-black text-white border-4 border-[#0a0f1d] shadow-2xl shadow-emerald-500/10">
                  {profile?.full_name?.[0] || 'U'}
                </div>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] uppercase font-black tracking-widest">
                  {profile?.role || 'Expert28 Admin'}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                  {profile?.status || 'Active'}
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight">{profile?.full_name || 'Expert28 Elite Member'}</h1>
              <p className="text-gray-500 text-sm font-medium mt-1">{user?.email}</p>
            </div>

            <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl border border-white/10 bg-[#0a0f1d]/50 backdrop-blur-xl">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6">Profile Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="p-2 rounded-lg bg-white/5"><Mail size={16} /></div>
                  <div className="truncate flex-1">
                    <p className="text-[10px] uppercase font-bold text-gray-600 leading-none mb-1">Email</p>
                    <p className="text-sm font-semibold truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="p-2 rounded-lg bg-white/5"><Calendar size={16} /></div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-gray-600 leading-none mb-1">Joined</p>
                    <p className="text-sm font-semibold">March 28, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="p-2 rounded-lg bg-white/5"><Shield size={16} /></div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-gray-600 leading-none mb-1">Role Permission</p>
                    <p className="text-sm font-semibold capitalize">{profile?.role || 'Admin'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.02] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-16 -translate-y-16" />
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Membership</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-black">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-lg font-black leading-none">Elite Multi-Access</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-tighter">Gold Tier Access</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-gray-500 uppercase tracking-widest">Next Billing</span>
                  <span className="text-emerald-500">April 28, 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Address & Contact (Placeholder for form) */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0a0f1d] shadow-xl">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3">
                Account Settings
                <div className="h-[2px] flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent ml-2" />
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input 
                      type="text" 
                      placeholder="+61 400 000 000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Preferred Facility</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all appearance-none">
                      <option className="bg-[#0a0f1d]">Expert28 Performance Center - CBD</option>
                      <option className="bg-[#0a0f1d]">Expert28 South Park</option>
                      <option className="bg-[#0a0f1d]">Expert28 North Shore</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Physical Address</label>
                  <input 
                    type="text" 
                    placeholder="Enter your home address"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-4">
                <button className="px-6 py-3 rounded-xl border border-white/5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancel</button>
                <button className="px-10 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
