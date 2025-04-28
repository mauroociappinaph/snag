export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'business' | 'client'
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role: 'admin' | 'business' | 'client'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'business' | 'client'
        }
      }
      businesses: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          address: string | null
          phone: string | null
          email: string | null
          owner_id: string
          logo_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          owner_id: string
          logo_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          owner_id?: string
          logo_url?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          client_id: string
          business_id: string
          service_id: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          client_id: string
          business_id: string
          service_id?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          client_id?: string
          business_id?: string
          service_id?: string | null
          notes?: string | null
        }
      }
      services: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          duration: number
          price: number
          business_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          duration: number
          price: number
          business_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
          business_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
