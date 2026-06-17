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
  const [authInitialized, setAuthInitialized] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const { toast } = useToast();

  const loading = !authInitialized || (!!user && !profileLoaded);
  const isExpired = !!profile?.membership_expires_at && new Date(profile.membership_expires_at) < new Date();

  // 1. Initial auth check and listener (runs once on mount)
  useEffect(() => {
    let isMounted = true;

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log("[useAuth] onAuthStateChange event:", event, "user:", session?.user?.email);
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        if (event === 'SIGNED_IN') {
          toast({
            title: "Logged in successfully",
            description: `Welcome back, ${session.user.email}`,
          });
        }
      } else {
        console.log("[useAuth] onAuthStateChange: clear user/profile");
        setUser(null);
        setProfile(null);
        setProfileLoaded(false);
      }
      setAuthInitialized(true);
    });

    const checkInitialAuth = async () => {
      console.log("[useAuth] checkInitialAuth starting...");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("[useAuth] checkInitialAuth getSession resolved:", session?.user?.email);
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
        } else {
          console.log("[useAuth] checkInitialAuth: no session user");
          setUser(null);
          setProfile(null);
          setProfileLoaded(false);
        }
      } catch (err) {
        console.error('[useAuth] Auth check error:', err);
      } finally {
        if (isMounted) {
          setAuthInitialized(true);
        }
      }
    };

    checkInitialAuth();

    return () => {
      console.log("[useAuth] useEffect cleanup running");
      isMounted = false;
      authSubscription.unsubscribe();
    };
  }, []);

  // 2. Fetch profile when user changes (decoupled from initial check to prevent deadlocks)
  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setProfileLoaded(false);
      return;
    }

    let isCurrentFetch = true;
    const loadProfile = async () => {
      setProfileLoaded(false);
      await fetchProfile(user.id);
      if (isCurrentFetch) {
        setProfileLoaded(true);
      }
    };

    loadProfile();

    return () => {
      isCurrentFetch = false;
    };
  }, [user?.id]);

  // 3. Real-time profile subscription (runs when user changes)
  useEffect(() => {
    if (!user?.id) return;
    console.log("[useAuth] setting up real-time profile subscription for", user.id);

    const profileSubscription = supabase
      .channel(`profile:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("[useAuth] real-time profile update payload:", payload);
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

    return () => {
      console.log("[useAuth] unsubscribing real-time profile for", user.id);
      profileSubscription.unsubscribe();
    };
  }, [user?.id]);

  const fetchProfile = async (userId: string, retries = 3) => {
    console.log("[useAuth] fetchProfile called for", userId, "retries remaining:", retries);
    try {
      // 1. Try to fetch the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        console.warn("[useAuth] fetchProfile: profile not found (PGRST116)");
        if (retries > 0) {
          console.log("[useAuth] fetchProfile: waiting 500ms and retrying...");
          // Wait 500ms and retry, as the backend trigger might be creating it
          await new Promise(resolve => setTimeout(resolve, 500));
          return fetchProfile(userId, retries - 1);
        } else {
          console.log("[useAuth] fetchProfile: no retries left, falling back to local guest profile");
          // Fallback to a local guest profile if backend failed or is too slow
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            setProfile({
              id: userId,
              email: userData.user.email || '',
              role: 'guest', // Default role
              status: 'active',
              full_name: userData.user.user_metadata?.full_name || 'Member',
              avatar_url: userData.user.user_metadata?.avatar_url || '',
            });
          }
          return;
        }
      }

      if (error) {
        console.error("[useAuth] fetchProfile DB error:", error);
        throw error;
      }
      console.log("[useAuth] fetchProfile success, setting profile:", data);
      setProfile(data as Profile);
    } catch (e: unknown) {
      console.error('[useAuth] Error in fetchProfile:', e instanceof Error ? e.message : e);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    setAuthInitialized(false);
    setProfileLoaded(false);
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
