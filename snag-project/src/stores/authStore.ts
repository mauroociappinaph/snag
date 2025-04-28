import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: {
    id: string;
    name: string;
    role: 'Admin' | 'Business' | 'Client';
  } | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  
  signUp: async (email: string, password: string, name: string, role: string) => {
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !user) {
      throw signUpError || new Error('Failed to sign up');
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: user.id, name, role }]);

    if (profileError) {
      throw profileError;
    }

    await get().loadProfile();
  },

  signIn: async (email: string, password: string) => {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !user) {
      throw error || new Error('Failed to sign in');
    }

    await get().loadProfile();
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
  },

  loadProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      set({ user: null, profile: null, loading: false });
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      set({ user: null, profile: null, loading: false });
      return;
    }

    set({ 
      user, 
      profile: {
        id: profile.id,
        name: profile.name,
        role: profile.role as 'Admin' | 'Business' | 'Client'
      },
      loading: false 
    });
  }
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    useAuthStore.getState().loadProfile();
  } else {
    useAuthStore.setState({ user: null, profile: null, loading: false });
  }
});