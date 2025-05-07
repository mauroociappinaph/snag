import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import type { UserRole } from '../types/database.types';


class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient<Database>;

  private validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.error('Invalid Supabase URL format:', e);
      return false;
    }
  }

  private constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    console.log('Initializing Supabase client with:', {
      url: supabaseUrl ? 'URL present' : 'URL missing',
      key: supabaseAnonKey ? 'Key present' : 'Key missing'
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Missing Supabase environment variables');
    }

    if (!this.validateUrl(supabaseUrl)) {
      console.error('Invalid Supabase URL format:', supabaseUrl);
      throw new Error('Invalid Supabase URL format. URL must start with https:// and be a valid Supabase project URL');
    }

    try {
      this.client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        },
        global: {
          headers: {
            'X-Client-Info': 'snag-web'
          }
        }
      });
      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      throw error;
    }
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public getClient(): SupabaseClient<Database> {
    return this.client;
  }

  // Auth methods
  public async signIn(email: string, password: string) {
    console.log('SupabaseService: signIn called for email:', email);
    try {
      const result = await this.client.auth.signInWithPassword({ email, password });
      console.log('SupabaseService: Sign in result:', {
        success: !result.error,
        user: result.data?.user ? 'User exists' : 'No user',
        error: result.error ? result.error.message : null
      });
      return result;
    } catch (error) {
      console.error('SupabaseService: Error in signIn:', error);
      throw error;
    }
  }

  public async signUp(email: string, password: string) {
    console.log('SupabaseService: signUp called for email:', email);
    try {
      const result = await this.client.auth.signUp({ email, password });
      console.log('SupabaseService: Sign up result:', {
        success: !result.error,
        user: result.data?.user ? 'User created' : 'No user created',
        userId: result.data?.user?.id || null,
        errorMessage: result.error?.message || null
      });

      // Check session after signup
      if (result.data?.user) {
        const sessionResult = await this.getSession();
        console.log('SupabaseService: Session after signup:', {
          hasSession: !!sessionResult.data.session,
          user: sessionResult.data.session?.user ? 'User in session' : 'No user in session'
        });
      }

      return result;
    } catch (error) {
      console.error('SupabaseService: Error in signUp:', error);
      throw error;
    }
  }

  public async signOut() {
    console.log('SupabaseService: signOut called');
    try {
      // Primero, limpiar la sesión local
      await this.client.auth.signOut();

      // Luego, limpiar la sesión del servidor
      const { error } = await this.client.auth.signOut({ scope: 'global' });

      console.log('SupabaseService: Sign out result:', {
        success: !error,
        error: error ? error.message : null
      });

      if (error) {
        console.error('SupabaseService: Error in signOut:', error);
        throw error;
      }

      // Limpiar cualquier estado persistente
      localStorage.removeItem('auth-storage');
      sessionStorage.clear();

      // Limpiar la sesión de Supabase
      await this.client.auth.signOut();

      return { error: null };
    } catch (error) {
      console.error('SupabaseService: Error in signOut:', error);
      throw error;
    }
  }

  public async getSession() {
    console.log('SupabaseService: getSession called');
    try {
      const result = await this.client.auth.getSession();
      console.log('SupabaseService: Get session result:', {
        hasSession: !!result.data.session,
        user: result.data.session?.user ? 'User exists' : 'No user',
        error: result.error ? result.error.message : null
      });

      // Si hay una sesión, verificar que el usuario tenga un perfil
      if (result.data.session?.user) {
        const { data: profile, error: profileError } = await this.getUserProfile(result.data.session.user.id);
        if (profileError || !profile) {
          console.error('SupabaseService: No profile found for user in session');
          // Limpiar la sesión si no hay perfil
          await this.client.auth.signOut();
          return { data: { session: null }, error: null };
        }
      }

      return result;
    } catch (error) {
      console.error('SupabaseService: Error in getSession:', error);
      throw error;
    }
  }

  // Data methods
  public async getReservations() {
    return this.client.from('reservations').select('*');
  }

  public async getUserProfile(userId: string) {
    console.log('SupabaseService: getUserProfile called for userId:', userId);
    try {
      const result = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('SupabaseService: getUserProfile result:', {
        success: !result.error,
        hasData: !!result.data,
        error: result.error ? result.error.message : null,
        profile: result.data ? {
          id: result.data.id,
          role: result.data.role,
          name: result.data.name
        } : null
      });

      if (result.error) {
        console.error('SupabaseService: Error fetching profile:', result.error);
        throw result.error;
      }

      return result;
    } catch (error) {
      console.error('SupabaseService: Error in getUserProfile:', error);
      throw error;
    }
  }

  public async createUserProfile(userId: string, name: string, role: UserRole) {
    console.log('SupabaseService: createUserProfile called with:', { userId, name, role });
    try {
      const result = await this.client
        .from('profiles')
        .insert({
          id: userId,
          name: name,
          role: role,
        })
        .select()
        .single();

      console.log('SupabaseService: createUserProfile result:', {
        success: !result.error,
        error: result.error ? result.error.message : null,
        profile: result.data ? {
          id: result.data.id,
          role: result.data.role,
          name: result.data.name
        } : null
      });

      if (result.error) {
        console.error('SupabaseService: Error creating profile:', result.error);
        throw result.error;
      }

      return result;
    } catch (error) {
      console.error('SupabaseService: Error in createUserProfile:', error);
      throw error;
    }
  }

  public async createReservation(userId: string, service: string, date: string, time: string) {
    console.log('SupabaseService: createReservation called with:', { userId, service, date, time });
    const result = await this.client.from('reservations').insert({
      user_id: userId,
      service: service,
      date: date,
      time: time,
    });

    console.log('SupabaseService: createReservation result:', {
      success: !result.error,
      error: result.error ? result.error.message : null
    });

    return result;
    }

  public async getUserReservations(userId: string) {
    return this.client.from('reservations').select('*').eq('user_id', userId);
  }
}

export const supabase = SupabaseService.getInstance().getClient();
export const supabaseService = SupabaseService.getInstance();
