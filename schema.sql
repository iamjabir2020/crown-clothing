-- ==============================================================================
-- CROWN CLOTHING — SOVEREIGN ATELIER SUPABASE SCHEMA
-- Run this complete script in your Supabase SQL Editor (Dashboard -> SQL Editor)
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

-- Products: Everyone can read; authenticated staff or anon service can manage
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public manage products" ON public.products FOR ALL USING (true);

-- Orders: Everyone can read and create; anyone can update status for courier tracking simulation
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

-- Bespoke Leads: Everyone can submit and read/update in console
CREATE POLICY "Public read leads" ON public.bespoke_leads FOR SELECT USING (true);
CREATE POLICY "Public insert leads" ON public.bespoke_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update leads" ON public.bespoke_leads FOR UPDATE USING (true);

-- Delivery Zones: Public read
CREATE POLICY "Public read zones" ON public.delivery_zones FOR SELECT USING (true);

-- ==============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bespoke_leads;

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Products
INSERT INTO public.products (
  id, name, category, gender, price, original_price, image, secondary_image,
  description, composition, fit, colors, sizes, stock_count, in_stock, rating, review_count, is_new, is_bestseller
) VALUES
(
  'crw-01',
  'The Sovereign Cashmere Double-Breasted Overcoat',
  'Outerwear',
  'Men',
  890.00,
  950.00,
  'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=1200',
  'Crafted from ultra-dense 620gsm Scottish cashmere and superfine virgin wool. Finished with handcrafted natural horn buttons and bespoke silk-cupro jacquard lining featuring our royal insignia.',
  '85% Virgin Wool, 15% Inner Mongolian Cashmere. 100% Cupro Lining.',
  'Tailored architectural drape. Structured shoulder canvas with gentle suppression at the waist.',
  '[{"name": "Royal Navy", "hex": "#1e3a8a"}, {"name": "Midnight Charcoal", "hex": "#1e293b"}, {"name": "Camel Vicuña", "hex": "#b45309"}]'::jsonb,
  ARRAY['38R', '40R', '42R', '44R', '46R'],
  14,
  TRUE,
  4.90,
  38,
  FALSE,
  TRUE
),
(
  'crw-02',
  'Aurelia Silk Charmeuse Bias-Cut Evening Slip',
  'Dresses',
  'Women',
  540.00,
  NULL,
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1200',
  NULL,
  'Cut on the true bias from fluid 28mm mulberry silk charmeuse for an effortlessly sculpted silhouette. Accented with subtle French seam finishing and delicate adjustable rouleau straps.',
  '100% Grade 6A Mulberry Silk.',
  'Fluid bias silhouette. Skims hips naturally with a graceful floor-sweeping pooling hem.',
  '[{"name": "Royal Sapphire", "hex": "#1d4ed8"}, {"name": "Emerald Forest", "hex": "#064e3b"}, {"name": "Champagne Pearl", "hex": "#fef3c7"}]'::jsonb,
  ARRAY['XS', 'S', 'M', 'L'],
  8,
  TRUE,
  4.80,
  29,
  TRUE,
  FALSE
),
(
  'crw-03',
  'Westminster Fine-Gauge Merino Cable Sweater',
  'Knitwear',
  'Unisex',
  320.00,
  NULL,
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200',
  NULL,
  'Spun from 19.5-micron extrafine Australian merino wool with a tactile heritage cable weave. Breathable, temperature-regulating, and soft against bare skin.',
  '100% Extrafine Merino Wool.',
  'Relaxed classic fit. Ribbed neck, hem, and cuffs for shape retention.',
  '[{"name": "Ivory Cream", "hex": "#f8fafc"}, {"name": "Navy Melange", "hex": "#1e3a8a"}, {"name": "Slate Heather", "hex": "#475569"}]'::jsonb,
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  22,
  TRUE,
  4.95,
  52,
  FALSE,
  TRUE
),
(
  'crw-04',
  'Windsor Bespoke Two-Piece Super 150s Suit',
  'Tailoring',
  'Men',
  1250.00,
  NULL,
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
  NULL,
  'Woven in Biella, Italy from 100% Super 150s worsted wool. Features a half-canvas construction that contours to your body over time, pick-stitched peak lapels, and side adjusters on flat-front trousers.',
  '100% Super 150s Italian Worsted Wool. Horn buttons.',
  'Modern tailored cut. Light chest canvas with natural drape.',
  '[{"name": "Deep Royal Navy", "hex": "#1e3a8a"}, {"name": "Monarch Charcoal", "hex": "#334155"}]'::jsonb,
  ARRAY['38R', '40R', '42R', '44R'],
  9,
  TRUE,
  5.00,
  19,
  TRUE,
  FALSE
)
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  stock_count = EXCLUDED.stock_count,
  in_stock = EXCLUDED.in_stock;

-- Seed Orders
INSERT INTO public.orders (
  id, customer_name, customer_phone, delivery_address, delivery_city, postal_code,
  status, estimated_delivery, courier_name, courier_id, courier_phone, courier_vehicle,
  courier_lat, courier_lng, route_progress_percent, items, subtotal, shipping_fee, total, payment_method, timeline
) VALUES
(
  'CRW-88219',
  'Eleanor Vance',
  '+1 (555) 234-8901',
  '742 Royal Palm Boulevard, Suite 12B',
  'Metropolis',
  '10021',
  'Out for Delivery',
  '35 mins (by 2:45 PM)',
  'Marcus Vance',
  'RC-042',
  '+1 (555) 890-4412',
  'Mercedes eVito Royal Fleet #09',
  40.768000,
  -73.964000,
  78,
  '[{"product": {"id": "crw-01", "name": "The Sovereign Cashmere Double-Breasted Overcoat", "price": 890, "image": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200"}, "selectedColor": "Royal Navy", "selectedSize": "40R", "quantity": 1}, {"product": {"id": "crw-03", "name": "Westminster Fine-Gauge Merino Cable Sweater", "price": 320, "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1200"}, "selectedColor": "Ivory Cream", "selectedSize": "M", "quantity": 1}]'::jsonb,
  1210.00,
  0.00,
  1210.00,
  'Credit Card',
  '[{"status": "Order Placed", "time": "09:15 AM", "description": "Order confirmed and registered in Royal Concierge system.", "completed": true}, {"status": "Quality Check", "time": "10:30 AM", "description": "Garments steamed, lint-inspected, and placed in breathable garment bags.", "completed": true}, {"status": "Dispatched", "time": "11:45 AM", "description": "Dispatched from Regent Flagship Hub into Royal Electric Fleet #09.", "completed": true}, {"status": "Out for Delivery", "time": "01:20 PM", "description": "Courier Marcus Vance is 1.4 miles away approaching your boulevard.", "completed": true}, {"status": "Delivered", "time": "Estimated 02:45 PM", "description": "Direct handoff with royal seal signature confirmation.", "completed": false}]'::jsonb
),
(
  'CRW-77402',
  'Lord Alistair Sterling',
  '+1 (555) 671-9982',
  '18 Grosvenor Terrace, Penthouse 4',
  'Metropolis',
  '10022',
  'Quality Check',
  'Today by 5:30 PM',
  'Julian Croft',
  'RC-018',
  '+1 (555) 431-7721',
  'Porsche Taycan Royal Escort #03',
  40.755000,
  -73.972000,
  32,
  '[{"product": {"id": "crw-04", "name": "Windsor Bespoke Two-Piece Super 150s Suit", "price": 1250, "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"}, "selectedColor": "Deep Royal Navy", "selectedSize": "42R", "quantity": 1}]'::jsonb,
  1250.00,
  0.00,
  1250.00,
  'Cash on Delivery',
  '[{"status": "Order Placed", "time": "11:20 AM", "description": "Order received with Cash On Delivery ($1,250.00 cash on handoff).", "completed": true}, {"status": "Quality Check", "time": "12:05 PM", "description": "Hand pressing lapels and final stitch certification.", "completed": true}, {"status": "Dispatched", "time": "Pending 02:15 PM", "description": "Awaiting scheduled courier departure wave.", "completed": false}, {"status": "Out for Delivery", "time": "Pending 03:30 PM", "description": "Route optimization active.", "completed": false}, {"status": "Delivered", "time": "Estimated 05:30 PM", "description": "Cash payment verification on delivery.", "completed": false}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Seed Delivery Zones
INSERT INTO public.delivery_zones (zip_code_prefix, zone_name, same_day_eligible, radius_miles, estimated_time, cutoff_hour)
VALUES
('100', 'Central Royal Core (Manhattan)', TRUE, 5.5, '1 - 2 Hours', '6:00 PM'),
('101', 'Midtown & Upper East Corridor', TRUE, 8.0, '2 - 3 Hours', '5:00 PM'),
('112', 'Brooklyn Heights & Waterfront', TRUE, 12.0, '3 - 4 Hours', '4:00 PM'),
('111', 'Long Island City & Queens', TRUE, 14.5, '3 - 5 Hours', '3:30 PM'),
('070', 'Hudson Waterfront / Jersey Gold Coast', TRUE, 15.0, '4 - 5 Hours', '2:30 PM'),
('900', 'Beverly Hills & West Hollywood Hub', TRUE, 10.0, '2 - 3 Hours', '5:00 PM'),
('SW1', 'Mayfair & Belgravia Royal Ward', TRUE, 6.0, '90 Minutes', '6:30 PM')
ON CONFLICT (zip_code_prefix) DO NOTHING;

-- Seed Bespoke Leads
INSERT INTO public.bespoke_leads (id, full_name, email, phone, service_type, preferred_date, notes, status)
VALUES
('lead-101', 'Lady Vivienne Montgomery', 'v.montgomery@sovereign-arts.org', '+1 (555) 492-1184', 'Wedding & Formal', '2026-10-15', 'Require matching bespoke velvet tuxedos and evening gown for Autumn Charity Gala.', 'Consultation Scheduled'),
('lead-102', 'Harrison Sterling Esq.', 'harrison@sterlingcapital.co', '+1 (555) 902-8833', 'Bespoke Tailoring', '2026-10-04', 'Inquiry for three Super 180s wool bespoke business suits with custom monogramming.', 'New'),
('lead-103', 'Clara Dubois', 'clara@duboisinteriors.com', '+1 (555) 310-7744', 'VIP Private Wardrobe', '2026-10-20', 'Seasonal wardrobe refresh. Interested in cashmere knitwear capsule and tailored overcoats.', 'Contacted')
ON CONFLICT (id) DO NOTHING;
