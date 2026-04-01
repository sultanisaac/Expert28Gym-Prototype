import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, LogOut, ChevronDown, Settings } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Profile } from '../hooks/useAuth';

interface ProfileDropdownProps {
  user: User | null;
  profile: Profile | null;
  signOut: () => Promise<void>;
  setPathname: (path: string) => void;
}

export default function ProfileDropdown({ user, profile, signOut, setPathname }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleNavigation = (path: string) => {
    setPathname(path);
    setIsOpen(false);
    window.location.hash = ''; // Clear hash if navigating via pathname
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'text-amber-500';
      case 'client': return 'text-blue-500';
      default: return 'text-emerald-500';
    }
  };

  const getDashboardLink = () => {
    if (profile?.role === 'admin') return '/admin/dashboard';
    return '/client/dashboard';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 pl-2.5 pr-1 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
      >
        <div className="flex flex-col items-end mr-1 hidden sm:flex">
          <span className={`text-[10px] font-bold uppercase tracking-tighter leading-none mb-1 ${getRoleColor(profile?.role || 'guest')}`}>
            {profile?.role || 'Guest'}
          </span>
          <span className="text-xs font-semibold text-gray-200 leading-none">
            {profile?.full_name?.split(' ')[0] || 'Member'}
          </span>
        </div>
        
        <div className="relative">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-emerald-500/30 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-[10px] font-black text-white border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
              {getInitials(profile?.full_name || user?.email || 'U')}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#030712] rounded-full" />
        </div>
        
        <ChevronDown 
          size={14} 
          className={`text-gray-500 group-hover:text-gray-300 transition-transform duration-300 mr-1 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0a0f1d] border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Status: {profile?.status || 'Member'}</p>
            <p className="text-sm font-semibold text-white truncate">{profile?.full_name || 'Member Account'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="p-2">
            <button 
              onClick={() => handleNavigation('/profile')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                <Settings size={16} />
              </div>
              My Profile
            </button>

            <button 
              onClick={() => handleNavigation(getDashboardLink())}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-colors">
                <LayoutDashboard size={16} />
              </div>
              Dashboard
            </button>
          </div>

          <div className="p-2 border-t border-white/5 bg-white/[0.01]">
            <button 
              onClick={() => { signOut(); setPathname('/'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all group"
            >
              <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-red-400/20 transition-colors">
                <LogOut size={16} />
              </div>
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
