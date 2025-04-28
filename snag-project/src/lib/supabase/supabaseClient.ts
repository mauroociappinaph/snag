import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';


class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient<Database>;

  private constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

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
    return this.client.auth.signInWithPassword({ email, password });
  }

  public async signUp(email: string, password: string) {
    return this.client.auth.signUp({ email, password });
  }

  public async signOut() {
    return this.client.auth.signOut();
  }

  public async getSession() {
    return this.client.auth.getSession();
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
}

export const supabase = SupabaseService.getInstance().getClient();
export const supabaseService = SupabaseService.getInstance();
