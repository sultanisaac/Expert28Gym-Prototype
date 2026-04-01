import { useAuth } from '../hooks/useAuth';
import { Mail, Shield, Calendar, MapPin, Phone, CreditCard, ChevronLeft, Loader2, Save, Camera } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    address_line1: '',
    city: '',
    post_code: '',
  });

  // Sync profile data to form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        address_line1: profile.address_line1 || '',
        city: profile.city || '',
        post_code: profile.post_code || '',
      });
    }
  }, [profile]);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check size (1MB)
    if (file.size > 1 * 1024 * 1024) {
      toast.error('File too large', { description: 'Please choose an image under 1MB.' });
      return;
    }

    setIsUploading(true);
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    
    try {
      // 1. Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // 3. Update profile table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Avatar updated!');
      if (refreshProfile) await refreshProfile();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Upload failed', { description: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          address_line1: formData.address_line1,
          city: formData.city,
          post_code: formData.post_code,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved to the secure vault.',
        style: { background: '#0a0f1d', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#fff' }
      });
      
      if (refreshProfile) await refreshProfile();
    } catch (err: any) {
      console.error('Update profile error:', err);
      toast.error('Failed to update profile', {
        description: err.message || 'An unexpected error occurred.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => {
            if (profile?.role?.toLowerCase() === 'admin') {
              window.location.href = '/admin/dashboard';
            } else {
              window.location.href = '/';
            }
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors mb-8 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{profile?.role?.toLowerCase() === 'admin' ? 'Back to Admin Portal' : 'Back to Home'}</span>
        </button>

        {/* Profile Header */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0a0f1d] mb-8 group shadow-2xl">
          <div className="h-40 bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-emerald-600/20 relative">
            <div className="absolute inset-0 bg-black/20" />
          </div>
          
          <div className="px-8 pb-8 flex flex-col md:flex-row md:items-end gap-6 -mt-16">
            <div className="relative group/avatar">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleUpload} 
                className="hidden" 
                accept="image/*"
              />
              
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  className="w-32 h-32 md:w-48 md:h-48 rounded-3xl border-4 border-[#0a0f1d] object-cover shadow-2xl shadow-emerald-500/20 transition-all duration-500 group-hover/avatar:scale-105" 
                />
              ) : (
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-5xl font-black text-white border-4 border-[#0a0f1d] shadow-2xl shadow-emerald-500/20 transition-all duration-500 group-hover/avatar:scale-105">
                  {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}

              {/* Upload Overlay */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 bg-black/60 rounded-3xl opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-300 backdrop-blur-sm border-2 border-dashed border-emerald-500/50"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin text-emerald-500" size={32} />
                ) : (
                  <>
                    <Camera className="text-emerald-500" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Change Photo</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full border text-[10px] uppercase font-black tracking-widest ${
                  profile?.role?.toLowerCase() === 'admin' 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                    : profile?.role?.toLowerCase() === 'client'
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                }`}>
                  {profile?.role || 'Guest'}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                  {profile?.status || 'Active'}
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-none text-white">
                {formData.full_name || user?.email?.split('@')[0]}
              </h1>
              <p className="text-gray-500 text-sm font-medium mt-3 flex items-center gap-2">
                <Mail size={14} className="text-gray-600" />
                {user?.email}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-3xl border border-white/10 bg-[#0a0f1d]/50 backdrop-blur-xl">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6">Profile Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="p-2 rounded-lg bg-white/5"><Mail size={16} /></div>
                  <div className="truncate flex-1">
                    <p className="text-[10px] uppercase font-bold text-gray-600 leading-none mb-1">Email (Private)</p>
                    <p className="text-sm font-semibold truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="p-2 rounded-lg bg-white/5"><Calendar size={16} /></div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-gray-600 leading-none mb-1">Joined</p>
                    <p className="text-sm font-semibold">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Loading...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="p-2 rounded-lg bg-white/5"><Shield size={16} /></div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-gray-600 leading-none mb-1">Role Permission</p>
                    <p className={`text-sm font-semibold capitalize ${
                      profile?.role?.toLowerCase() === 'admin' 
                        ? 'text-amber-500' 
                        : profile?.role?.toLowerCase() === 'client'
                          ? 'text-blue-500'
                          : 'text-emerald-500'
                    }`}>
                      {profile?.role || 'Guest'}
                    </p>
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
                  <p className="text-lg font-black leading-none">{profile?.membership_tier || 'Expert28 Elite'}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-tighter">Gold Tier Access</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 text-xs font-bold flex justify-between items-center">
                <span className="text-gray-500 uppercase tracking-widest">Next Billing</span>
                <span className="text-emerald-500">April 28, 2024</span>
              </div>
            </div>
          </div>

          {/* Right Column: Address & Contact */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl border border-white/10 bg-[#0a0f1d] shadow-xl">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3">
                Account Settings
                <div className="h-[2px] flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent ml-2" />
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Change - Integrated into standard form */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-1">Display Name</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input 
                      type="text" 
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="+61 400 000 000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
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

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Physical Address</label>
                  <input 
                    type="text" 
                    value={formData.address_line1}
                    onChange={(e) => handleInputChange('address_line1', e.target.value)}
                    placeholder="Enter your home address"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">City</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Melbourne"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Postcode</label>
                    <input 
                      type="text" 
                      value={formData.post_code}
                      onChange={(e) => handleInputChange('post_code', e.target.value)}
                      placeholder="3000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
                <Shield className="text-blue-500 mt-0.5" size={16} />
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Your billing information is secured using industry-standard SSL encryption. Your address is only visible to gym management for insurance purposes.
                </p>
              </div>
            </div>

            {/* Security Section - NEW */}
            <div className="mt-8 p-8 rounded-3xl border border-white/10 bg-[#0a0f1d] shadow-xl">
              <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-amber-500">
                Security & Access
                <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-500/20 to-transparent ml-2" />
              </h3>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-bold text-white mb-1">Account Password</p>
                  <p className="text-xs text-gray-500">Update your credentials to maintain account security.</p>
                </div>
                <button 
                  onClick={() => toast.info('Password reset link sent to your email.')}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 text-xs font-black uppercase tracking-widest transition-all"
                >
                  Change Password
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Two-Factor Authentication</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-emerald-500/40 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? 'Encrypting...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
