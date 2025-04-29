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
      const result = await this.client.auth.signOut();
      console.log('SupabaseService: Sign out result:', {
        success: !result.error,
        error: result.error ? result.error.message : null
      });
      return result;
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
      return result;
    } catch (error) {
      console.error('SupabaseService: Error in getSession:', error);
      throw error;
    }
  }

  // Data methods
  public async getBusinesses() {
    return this.client.from('businesses').select('*');
  }

  public async getAppointments() {
    return this.client.from('appointments').select('*');
  }

  public async getUserProfile(userId: string) {
    console.log('SupabaseService: getUserProfile called for userId:', userId);
    const result = await this.client.from('profiles').select('*').eq('id', userId).single();
    console.log('SupabaseService: getUserProfile result:', {
      success: !result.error,
      hasData: !!result.data,
      error: result.error ? result.error.message : null
    });
    return result;
  }

  public async createUserProfile(userId: string, email: string, fullName: string, role: UserRole) {
    console.log('SupabaseService: createUserProfile called with:', { userId, email, fullName, role });
    const result = await this.client.from('profiles').insert({
      id: userId,
      name: fullName,
      full_name: fullName,
      email: email,
      role: role,
      created_at: new Date().toISOString(),
    });

    console.log('SupabaseService: createUserProfile result:', {
      success: !result.error,
      error: result.error ? result.error.message : null
    });

    return result;
  }

  public async debugProfileStructure() {
    // Get database structure for profiles table
    const { data, error } = await this.client.rpc('get_table_columns', {
      table_name: 'profiles'
    });

    if (error) {
      console.error('Error getting table structure:', error);
      return null;
    }

    return data;
  }
}

export const supabase = SupabaseService.getInstance().getClient();
export const supabaseService = SupabaseService.getInstance();
