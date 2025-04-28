import { useState, useEffect } from 'react';
import { supabaseService } from '../supabase/supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Get initial session
    supabaseService.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, user: session?.user ?? null, loading: false }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabaseService.getClient().auth.onAuthStateChange(async (event, session) => {
      setState(prev => ({ ...prev, user: session?.user ?? null, loading: false }));

      if (session?.user) {
        try {
          const { data: profile } = await supabaseService.getUserProfile(session.user.id);
          setState(prev => ({ ...prev, profile }));
        } catch (error) {
          setState(prev => ({ ...prev, error: error as Error }));
        }
      } else {
        setState(prev => ({ ...prev, profile: null }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabaseService.signIn(email, password);
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabaseService.signUp(email, password);
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabaseService.signOut();
      if (error) throw error;
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut
  };
};
