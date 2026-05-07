import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [view, setView] = useState<'login' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMsg('Check your email for the password reset link.');
    }
    setLoading(false);
  };

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
          <h1 className="text-2xl font-black tracking-tight text-white">
            {view === 'login' ? 'Welcome Back' : 'Reset Password'}
          </h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            {view === 'login' 
              ? 'Login to your Expert28 performance dashboard' 
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 flex items-start gap-3 text-sm animate-fade-in">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-lg mb-6 flex items-start gap-3 text-sm animate-fade-in">
            <CheckCircle2 size={18} className="shrink-0" />
            <p>{successMsg}</p>
          </div>
        )}

        {view === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-emerald-500">Password</label>
                <button 
                  type="button" 
                  onClick={() => { setView('forgot_password'); setError(null); setSuccessMsg(null); }}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-blue w-full p-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-blue w-full p-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  Send Reset Link <Mail size={18} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setView('login'); setError(null); setSuccessMsg(null); }}
              className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-white transition-colors py-2"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </form>
        )}

        {view === 'login' && (
          <p className="text-center text-gray-500 text-sm mt-8">
            Don't have an account?{' '}
            <a href="/signup" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">Apply Now</a>
          </p>
        )}
      </div>

      {/* Decorative Brand Text */}
      <div className="fixed bottom-8 left-8 hidden lg:block select-none opacity-20 transform -rotate-90 origin-bottom-left">
        <span className="text-8xl font-black tracking-tighter text-white">EXPERT<span className="text-emerald-500">28</span></span>
      </div>
    </div>
  );
}
