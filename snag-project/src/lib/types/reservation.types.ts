export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  user_id: string;
  business_id: string;
  service: string;
  date: string;
  time: string;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
}

export interface ReservationCreate {
  user_id: string;
  business_id: string;
  service: string;
  date: string;
  time: string;
  status?: ReservationStatus;
}

export interface ReservationUpdate {
  service?: string;
  date?: string;
  time?: string;
  status?: ReservationStatus;
}
