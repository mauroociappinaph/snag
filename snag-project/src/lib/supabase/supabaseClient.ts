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
    try {
      const result = await this.client.auth.signInWithPassword({ email, password });
      console.log('Sign in result:', result.error ? 'Error occurred' : 'Success');
      return result;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  }

  public async signUp(email: string, password: string) {
    try {
      const result = await this.client.auth.signUp({ email, password });
      console.log('Sign up result:', result.error ? 'Error occurred' : 'Success');
      return result;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  }

  public async signOut() {
    try {
      const result = await this.client.auth.signOut();
      console.log('Sign out result:', result.error ? 'Error occurred' : 'Success');
      return result;
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  }

  public async getSession() {
    try {
      const result = await this.client.auth.getSession();
      console.log('Get session result:', result.error ? 'Error occurred' : 'Session found');
      return result;
    } catch (error) {
      console.error('Error in getSession:', error);
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
    return this.client.from('profiles').select('*').eq('id', userId).single();
  }

  public async createUserProfile(userId: string, email: string, fullName: string, role: UserRole) {
    return this.client.from('profiles').insert({
      id: userId,
      name: fullName,
      full_name: fullName,
      email: email,
      role: role,
      created_at: new Date().toISOString(),
    });
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
