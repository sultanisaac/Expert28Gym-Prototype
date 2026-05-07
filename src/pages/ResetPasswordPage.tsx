import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if the user has an active session from the recovery link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If they don't have a session, they might have navigated here without clicking the email link
        // However, Supabase automatically parses the URL fragment hash and sets the session.
        setError("You don't have an active recovery session. Please request a new password reset link.");
      }
    });

    // Listen to auth changes, specifically for the PASSWORD_RECOVERY event
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // The user is ready to reset their password
        setError(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="orb" style={{ width: '40vw', height: '40vw', background: 'var(--emerald)', top: '-15%', left: '-10%', opacity: 0.2 }} />
        <div className="glass-card w-full max-w-md p-10 text-center relative z-10 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-[#10b981]" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white mb-4">Password Updated!</h1>
          <p className="text-gray-400 mb-8">Your password has been successfully reset. You can now log in with your new credentials.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="btn-blue w-full p-4 text-sm font-black uppercase tracking-widest"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="orb" style={{ width: '40vw', height: '40vw', background: 'var(--emerald)', top: '-15%', left: '-10%', opacity: 0.2 }} />
      <div className="orb" style={{ width: '30vw', height: '30vw', background: 'var(--blue-cta)', bottom: '-10%', right: '-5%', opacity: 0.15 }} />

      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl overflow-hidden mb-4">
            <img src="/Logo.png" alt="Expert28" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Update Password</h1>
          <p className="text-gray-400 text-sm mt-2 text-center">Enter your new password below</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 flex items-start gap-3 text-sm animate-fade-in">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-500 ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="••••••••"
                disabled={error?.includes('session')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-500 ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="••••••••"
                disabled={error?.includes('session')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!error?.includes('session')}
            className="btn-blue w-full p-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-6"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                Update Password <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
