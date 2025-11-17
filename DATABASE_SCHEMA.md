# Database Schema

This document describes the Supabase database schema for Zuro booking platform.

## Tables

### services

Stores service offerings that can be booked.

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL, -- Duration in minutes
  price INTEGER NOT NULL, -- Price in cents
  deposit_percent INTEGER NOT NULL DEFAULT 20, -- Deposit percentage (0-100)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### business_hours

Stores business hours for each day of the week.

```sql
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 6 = Saturday
  open_time TIME NOT NULL, -- Format: HH:mm
  close_time TIME NOT NULL, -- Format: HH:mm
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(day_of_week)
);
```

### bookings

Stores customer bookings.

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL, -- Format: HH:mm
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  deposit_amount INTEGER NOT NULL, -- Deposit amount in cents
  total_amount INTEGER NOT NULL, -- Total amount in cents
  stripe_payment_intent_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Indexes

```sql
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
```

## Row Level Security (RLS)

For production, you should set up Row Level Security policies:

```sql
-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Services: Public read, Admin write
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Services are insertable by authenticated users" ON services FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Business Hours: Public read, Admin write
CREATE POLICY "Business hours are viewable by everyone" ON business_hours FOR SELECT USING (true);
CREATE POLICY "Business hours are insertable by authenticated users" ON business_hours FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Bookings: Users can create, Admins can view all
CREATE POLICY "Bookings are insertable by everyone" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Bookings are viewable by authenticated users" ON bookings FOR SELECT USING (auth.role() = 'authenticated');
```

## Initial Data

### Default Business Hours

You can insert default business hours (Monday-Friday, 9 AM - 5 PM):

```sql
INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed) VALUES
  (0, '09:00', '17:00', true),  -- Sunday - Closed
  (1, '09:00', '17:00', false), -- Monday
  (2, '09:00', '17:00', false), -- Tuesday
  (3, '09:00', '17:00', false), -- Wednesday
  (4, '09:00', '17:00', false), -- Thursday
  (5, '09:00', '17:00', false), -- Friday
  (6, '09:00', '17:00', true);  -- Saturday - Closed
```

