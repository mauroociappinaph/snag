export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Represents the client's profile information joined from a profiles table
export interface ClientProfile {
  full_name: string;
  email: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  business_id: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  // The client's profile can be nested when fetched with a join
  client: ClientProfile | null;
}

export interface AppointmentCreate {
  user_id: string;
  business_id: string;
  service: string;
  date: string;
  time: string;
  status?: AppointmentStatus;
}

export interface AppointmentUpdate {
  service?: string;
  date?: string;
  time?: string;
  status?: AppointmentStatus;
}
