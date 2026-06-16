import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useToast } from './use-toast';
export type { User, AuthChangeEvent, Session };

export interface Profile {
  id: string;
  email: string;
  role: 'admin' | 'client' | 'guest';
  status: 'active' | 'pending' | 'banned';
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  address_line1?: string;
  city?: string;
  post_code?: string;
  membership_tier?: string;
  membership_expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isExpired: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  isExpired: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isExpired = !!profile?.membership_expires_at && new Date(profile.membership_expires_at) < new Date();

  useEffect(() => {
    // Initial loading setup
    let isMounted = true;

    const checkInitialAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          // Await profile to ensure state is ready
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Logged in successfully",
            description: `Welcome back, ${session.user.email}`,
          });
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    // SET UP REAL-TIME PROFILE SYNC
    let profileSubscription: any = null;

    const setupProfileSubscription = (userId: string) => {
      if (profileSubscription) profileSubscription.unsubscribe();

      profileSubscription = supabase
        .channel(`profile:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            const updatedProfile = payload.new as Profile;
            setProfile(updatedProfile);

            // SECURITY LOCKDOWN: If user is banned, kick them immediately
            if (updatedProfile.status === 'banned') {
              toast({
                variant: "destructive",
                title: "Account Banned",
                description: "Your account has been suspended. Contact support.",
              });
              signOut();
            }
          }
        )
        .subscribe();
    };

    if (user?.id) {
      setupProfileSubscription(user.id);
    }

    checkInitialAuth();

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();
      if (profileSubscription) profileSubscription.unsubscribe();
    };
  }, [user?.id]);

  const fetchProfile = async (userId: string) => {
    try {
      // 1. Try to fetch the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Code PGRST116 means no rows found - let's create the profile
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const newProfile = {
          id: userId,
          email: userData.user.email,
          full_name: userData.user.user_metadata?.full_name || 'Expert28 Member',
          role: 'guest', // Default role
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile as Profile);
        return;
      }

      if (error) throw error;
      setProfile(data as Profile);
    } catch (e: unknown) {
      console.error('Error in fetchProfile:', e instanceof Error ? e.message : e);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // 1. Immediately wipe all browser storage unconditionally
      localStorage.clear();
      sessionStorage.clear();

      // 2. Clear React state
      setUser(null);
      setProfile(null);

      // 3. Fire and forget the server signout (do not await, it can hang)
      supabase.auth.signOut().catch(console.error);

      // 4. Force a hard redirect to home
      window.location.replace('/');
    } catch (err) {
      console.error('Error during signOut:', err);
      window.location.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, isExpired }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
