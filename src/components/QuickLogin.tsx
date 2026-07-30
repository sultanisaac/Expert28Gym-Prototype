import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, X, Play, ShieldAlert, Users, HelpCircle, ChevronRight, Check, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Account {
  email: string;
  pas: string;
  role: 'User' | 'Member' | 'Admin';
}

const ACCOUNTS: Account[] = [
  { email: 'user1@gmail.com', pas: 'user123', role: 'User' },
  { email: 'user2@gmail.com', pas: 'user123', role: 'User' },
  { email: 'member1@gmail.com', pas: 'member123', role: 'Member' },
  { email: 'member2@gmail.com', pas: 'member123', role: 'Member' },
  { email: 'admin1@gmail.com', pas: 'admin123', role: 'Admin' },
];

import { useAuth } from '../hooks/useAuth';

export function QuickLogin() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  if (user) return null;
  const [filter, setFilter] = useState<'All' | 'User' | 'Member' | 'Admin'>('All');

  const handleLogin = async (account: Account) => {
    setLoading(account.email);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.pas,
      });
      if (error) throw error;
      // App instance of AuthProvider will handle the redirect
      setIsOpen(false);
    } catch (err) {
      console.error('Quick login failed:', err);
    } finally {
      setLoading(null);
    }
  };

  const filteredAccounts = ACCOUNTS.filter(acc => filter === 'All' || acc.role === filter);

  return (
    <>
      {/* Desktop Trigger - Vertical Side Tab (Left) */}
      <div className="fixed left-0 top-[calc(50%-228px)] -translate-y-1/2 z-[1000] hidden md:block">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-auto py-8 px-2 rounded-r-2xl rounded-l-none bg-gradient-to-b from-blue-600 to-indigo-700 shadow-[20px_0_40px_rgba(0,0,0,0.4)] hover:translate-x-1.5 transition-all flex flex-col items-center gap-5 border-2 border-l-0 border-white/20 group"
        >
          {isOpen ? <X className="h-6 w-6" /> : (
            <>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </motion.div>
              <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.3em] text-white/90 group-hover:text-white transition-colors py-2">
                Account Demo
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Mobile Trigger - Bottom Left (Raised above sticky bar) */}
      <div className="fixed bottom-24 left-6 z-[1000] md:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center border-2 border-white/20"
        >
          {isOpen ? <X className="h-6 w-6" /> : <User className="h-6 w-6" />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[1000] bg-black/5 md:bg-transparent"
            />
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              className="fixed bottom-24 left-6 md:bottom-auto md:top-[calc(50%-200px)] md:-translate-y-1/2 md:left-20 z-[1001] w-[320px] max-w-[calc(100vw-3rem)]"
            >
              <Card className="overflow-hidden border-0 bg-white/10 dark:bg-black/60 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border-white/10">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-4 border-b border-white/5 relative">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <Play className="h-5 w-5 text-blue-400 fill-blue-400" />
                      <h3 className="font-bold text-base text-white">Account Demo</h3>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-white/50 text-xs">Select a role to preview the platform</p>
                </div>

                {/* Filters */}
                <div className="p-3 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
                  {(['All', 'User', 'Member', 'Admin'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setFilter(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        filter === role
                          ? 'bg-white text-black'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                {/* Account List */}
                <div className="max-h-[350px] overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  {filteredAccounts.map((account) => (
                    <button
                      key={account.email}
                      onClick={() => handleLogin(account)}
                      disabled={!!loading}
                      className="w-full group relative flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          account.role === 'Admin' ? 'bg-purple-500/20' :
                          account.role === 'Member' ? 'bg-blue-500/20' :
                          'bg-slate-500/20'
                        }`}>
                          {account.role === 'Admin' ? <ShieldAlert className="h-4 w-4 text-purple-400" /> :
                           account.role === 'Member' ? <Users className="h-4 w-4 text-blue-400" /> :
                           <HelpCircle className="h-4 w-4 text-slate-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                              {account.email.split('@')[0]}
                            </span>
                            <Badge variant="outline" className={`text-[9px] uppercase py-0 px-1.5 h-3.5 ${
                              account.role === 'Admin' ? 'text-purple-400 border-purple-400/30' :
                              account.role === 'Member' ? 'text-blue-400 border-blue-400/30' :
                              'text-slate-400 border-slate-400/30'
                            }`}>
                              {account.role}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-white/40 font-mono tracking-tight">{account.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        {loading === account.email ? (
                          <div className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <motion.div
                            whileHover={{ x: 2 }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="h-4 w-4 text-blue-400" />
                          </motion.div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-3 bg-black/20 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold font-mono">
                    EXPERT28 DEMO
                  </span>
                  <div className="flex items-center gap-1 text-[9px] text-blue-400/60 font-bold">
                    <Check className="h-2.5 w-2.5" />
                    PERSISTENT LOGIN
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
