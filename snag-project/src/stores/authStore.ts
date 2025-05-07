import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabaseService } from '../lib/supabase/supabaseClient';
import type { AuthState, AuthActions, UserProfile } from '../lib/types/auth.types';

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      loading: true,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabaseService.signIn(email, password);
          if (error) throw error;

          if (data.user) {
            const { data: profile, error: profileError } = await supabaseService.getUserProfile(data.user.id);

            if (profileError) {
              console.error('Error fetching profile:', profileError);
              throw new Error('Error al cargar el perfil del usuario');
            }

            if (!profile) {
              console.error('No profile found for user');
              throw new Error('No se encontró el perfil del usuario');
            }

            set({
              user: {
                id: data.user.id,
                email: data.user.email || ''
              },
              profile: profile as UserProfile,
              isAuthenticated: true,
              loading: false
            });
          }
        } catch (error) {
          set({ error: 'Error desconocido', loading: false });
          console.error('Error during sign in:', error);
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabaseService.signUp(email, password);
          if (error) throw error;

          if (data.user) {
            const { data: profile, error: profileError } = await supabaseService.getUserProfile(data.user.id);

            if (profileError) {
              console.error('Error fetching profile:', profileError);
              throw new Error('Error al cargar el perfil del usuario');
            }

            if (!profile) {
              console.error('No profile found for user');
              throw new Error('No se encontró el perfil del usuario');
            }

            set({
              user: {
                id: data.user.id,
                email: data.user.email || ''
              },
              profile: profile as UserProfile,
              isAuthenticated: true,
              loading: false
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({ error: errorMessage, loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabaseService.signOut();
          if (error) throw error;

          // Forzar un reset completo del estado
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            loading: false,
            error: null
          });

          // Limpiar el almacenamiento persistente
          localStorage.removeItem('auth-storage');
          sessionStorage.clear();

          // Forzar una recarga de la página para limpiar cualquier estado residual
          window.location.href = '/';
        } catch (error) {
          console.error('Error during sign out:', error);
          set({ error: 'Error desconocido', loading: false });
        }
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      reset: () => set({
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
        error: null
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
      }),
    }
  )
);

// Subscribe to auth state changes
supabaseService.getClient().auth.onAuthStateChange(async (event, session) => {
  console.log('AUTH STORE: Auth state changed:', { event, userId: session?.user?.id });

  if (session?.user) {
    console.log('AUTH STORE: User authenticated, fetching profile');
    try {
      const { data: profile, error } = await supabaseService.getUserProfile(session.user.id);

      if (error) {
        console.error('AUTH STORE: Error fetching profile:', error);
        useAuthStore.setState({
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false,
          error: 'Error desconocido'
        });
      } else if (!profile) {
        console.error('AUTH STORE: No profile found for user');
        useAuthStore.setState({
          user: null,
          profile: null,
          isAuthenticated: false,
          loading: false,
          error: 'Error desconocido'
        });
      } else {
        console.log('AUTH STORE: Profile fetched successfully:', {
          profileExists: !!profile,
          role: profile?.role
        });

        useAuthStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email || ''
          },
          profile: profile as UserProfile,
          isAuthenticated: true,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('AUTH STORE: Error in auth state change handler:', error);
      useAuthStore.setState({
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
        error: 'Error desconocido'
      });
    }
  } else {
    console.log('AUTH STORE: No user in session, resetting state');
    useAuthStore.setState({
      user: null,
      profile: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  }
});
