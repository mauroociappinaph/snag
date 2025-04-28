import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabaseService } from '../lib/supabase/supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../lib/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Profile['role'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  role: null,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabaseService.signIn(email, password);
          if (error) throw error;
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      signUp: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabaseService.signUp(email, password);
          if (error) throw error;
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null });
          const { error } = await supabaseService.signOut();
          if (error) throw error;
          set(initialState);
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
);

// Subscribe to auth state changes
supabaseService.getClient().auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    try {
      const { data: profile } = await supabaseService.getUserProfile(session.user.id);
      useAuthStore.setState({
        user: session.user,
        profile,
        isAuthenticated: true,
        role: profile?.role ?? null,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  } else {
    useAuthStore.setState(initialState);
  }
});
