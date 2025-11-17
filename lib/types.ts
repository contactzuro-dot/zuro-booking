export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number; // in cents
  deposit_percent: number; // 0-100
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  open_time: string; // HH:mm format
  close_time: string; // HH:mm format
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  service_id: string;
  service?: Service;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string; // YYYY-MM-DD
  booking_time: string; // HH:mm
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  deposit_amount: number; // in cents
  total_amount: number; // in cents
  stripe_payment_intent_id: string | null;
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
}

