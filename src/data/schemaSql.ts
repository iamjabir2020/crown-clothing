export const SCHEMA_SQL_CODE = `-- ==============================================================================
-- CROWN CLOTHING — SOVEREIGN ATELIER SUPABASE SCHEMA
-- Run this complete script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- File location in workspace: /schema.sql and /supabase/schema.sql
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Synced with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'vip_patron', 'courier', 'admin_manager')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create a profile when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Royal Patron'),
    NEW.raw_user_meta_data->>'phone',
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Products Catalog Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  gender TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  image TEXT NOT NULL,
  secondary_image TEXT,
  description TEXT NOT NULL,
  composition TEXT NOT NULL,
  fit TEXT NOT NULL,
  colors JSONB NOT NULL DEFAULT '[]',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  stock_count INT NOT NULL DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders & Courier Transit Telemetry Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- e.g. 'CRW-88219'
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Order Placed' CHECK (
    status IN ('Order Placed', 'Quality Check', 'Dispatched', 'Out for Delivery', 'Delivered')
  ),
  estimated_delivery TEXT NOT NULL,
  courier_name TEXT DEFAULT 'Marcus Vance',
  courier_id TEXT DEFAULT 'RC-042',
  courier_phone TEXT DEFAULT '+1 (555) 890-4412',
  courier_vehicle TEXT DEFAULT 'Mercedes eVito Royal Fleet #09',
  courier_lat NUMERIC(9, 6) DEFAULT 40.768000,
  courier_lng NUMERIC(9, 6) DEFAULT -73.964000,
  route_progress_percent INT DEFAULT 15,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Credit Card', 'Apple Pay', 'Cash on Delivery')),
  timeline JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VIP Bespoke Consultation Leads Table
CREATE TABLE IF NOT EXISTS public.bespoke_leads (
  id TEXT PRIMARY KEY, -- e.g. 'lead-101'
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  preferred_date TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Consultation Scheduled', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Delivery Zones Table
CREATE TABLE IF NOT EXISTS public.delivery_zones (
  zip_code_prefix TEXT PRIMARY KEY,
  zone_name TEXT NOT NULL,
  same_day_eligible BOOLEAN DEFAULT TRUE,
  radius_miles NUMERIC(5, 2) NOT NULL,
  estimated_time TEXT NOT NULL,
  cutoff_hour TEXT NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bespoke_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public manage products" ON public.products FOR ALL USING (true);

CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Public read leads" ON public.bespoke_leads FOR SELECT USING (true);
CREATE POLICY "Public insert leads" ON public.bespoke_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update leads" ON public.bespoke_leads FOR UPDATE USING (true);

CREATE POLICY "Public read zones" ON public.delivery_zones FOR SELECT USING (true);

-- ==============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bespoke_leads;
`;
