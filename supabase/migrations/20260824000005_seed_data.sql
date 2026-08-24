-- ============================================================================
-- TEXAS GOLD BUYERS — IDEMPOTENT PRODUCTION SEED DATA
-- ============================================================================

-- 1. SEED TEXAS BRANCH LOCATIONS
INSERT INTO public.locations (id, location_code, name, address, city, state, zip_code, phone, email, is_primary)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'LOC-01', 'Dallas Flagship — Uptown', '2800 McKinney Ave, Suite 400', 'Dallas', 'TX', '75204', '(214) 555-4653', 'dallas@texasgoldbuyers.com', true),
  ('c1000000-0000-0000-0000-000000000002', 'LOC-02', 'Houston Galleria Store', '5085 Westheimer Rd, Suite B2800', 'Houston', 'TX', '77056', '(713) 555-4653', 'houston@texasgoldbuyers.com', false),
  ('c1000000-0000-0000-0000-000000000003', 'LOC-03', 'Austin Domain Branch', '11410 Century Oaks Terrace, Suite 120', 'Austin', 'TX', '78758', '(512) 555-4653', 'austin@texasgoldbuyers.com', false),
  ('c1000000-0000-0000-0000-000000000004', 'LOC-04', 'San Antonio — Riverwalk', '300 E Houston St, Suite 210', 'San Antonio', 'TX', '78205', '(210) 555-4653', 'sanantonio@texasgoldbuyers.com', false)
ON CONFLICT (location_code) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone;

-- 2. SEED INTERNAL STAFF PROFILES
INSERT INTO public.profiles (id, employee_code, full_name, email, phone, role, location_id, status)
VALUES
  ('e1000000-0000-0000-0000-000000000001', 'EMP-001', 'Alexander Sterling', 'admin@texasgoldbuyers.com', '(214) 555-0101', 'super_admin', 'c1000000-0000-0000-0000-000000000001', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000002', 'EMP-002', 'Marcus Vance', 'employee@texasgoldbuyers.com', '(214) 555-0102', 'employee', 'c1000000-0000-0000-0000-000000000001', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000003', 'EMP-003', 'Sarah Jenkins', 's.jenkins@texasgoldbuyers.com', '(713) 555-0103', 'employee', 'c1000000-0000-0000-0000-000000000002', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000004', 'EMP-004', 'David Rodriguez', 'd.rodriguez@texasgoldbuyers.com', '(512) 555-0104', 'employee', 'c1000000-0000-0000-0000-000000000003', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000005', 'EMP-005', 'Elena Rostova', 'e.rostova@texasgoldbuyers.com', '(210) 555-0105', 'employee', 'c1000000-0000-0000-0000-000000000004', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000006', 'EMP-006', 'James Holloway', 'j.holloway@texasgoldbuyers.com', '(214) 555-0106', 'employee', 'c1000000-0000-0000-0000-000000000001', 'ACTIVE')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- 3. SEED PREDEFINED CATALOG MENU (Valid UUIDs with valid hex characters)
INSERT INTO public.items (id, item_code, name, category, material, default_purity, typical_unit, est_price_per_unit, description)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'CAT-001', '10K Gold Scrap Jewelry', 'Gold', '10K Yellow/White Gold', '10K (41.7%)', 'g', 34.00, 'Assorted broken chains, rings, and mountings'),
  ('a1000000-0000-0000-0000-000000000002', 'CAT-002', '14K Gold Estate Jewelry', 'Gold', '14K Gold Alloy', '14K (58.5%)', 'g', 48.00, 'Hallmarked 14k chains, rings, bracelets'),
  ('a1000000-0000-0000-0000-000000000003', 'CAT-003', '18K Gold Fine Jewelry', 'Gold', '18K Gold Alloy', '18K (75.0%)', 'g', 62.00, 'High-end European and luxury designer gold'),
  ('a1000000-0000-0000-0000-000000000004', 'CAT-004', '22K / 24K Pure Gold Bullion', 'Gold', '24K Pure Gold', '24K (99.9%)', 'g', 81.00, 'Investment-grade bars and mint bullion'),
  ('a1000000-0000-0000-0000-000000000005', 'CAT-005', '999 Fine Silver Bar (10 oz)', 'Silver', '999 Fine Silver', '.999 Fine', 'oz', 29.50, 'Mint struck 10 troy ounce silver bar'),
  ('a1000000-0000-0000-0000-000000000006', 'CAT-006', 'Sterling Silver Flatware (.925)', 'Silver', 'Sterling Silver', '.925 Sterling', 'g', 0.85, 'Solid sterling tableware and tea sets'),
  ('a1000000-0000-0000-0000-000000000007', 'CAT-007', 'Platinum Ring / Ingot (950)', 'Platinum', '950 Platinum', 'PT950 (95.0%)', 'g', 32.00, 'Platinum mountings and minted ingots'),
  ('a1000000-0000-0000-0000-000000000008', 'CAT-008', '1.00 Carat Round Brilliant Diamond', 'Diamond', 'Natural Diamond', 'VS2 / F Color', 'ct', 3200.00, 'Certified natural loose diamond'),
  ('a1000000-0000-0000-0000-000000000009', 'CAT-009', 'Rolex Submariner Date (116610LN)', 'Watches', 'Stainless Steel / Ceramic', 'Authentic Swiss', 'pcs', 10500.00, 'Pre-owned luxury timepiece with box & papers'),
  ('a1000000-0000-0000-0000-000000000010', 'CAT-010', 'US Gold Eagle $50 Coin (1 oz)', 'Coins & Currency', '22K Coin Gold', '22K (91.67%)', 'oz', 2530.00, 'US Mint uncirculated legal tender gold bullion coin')
ON CONFLICT (item_code) DO UPDATE SET
  name = EXCLUDED.name,
  est_price_per_unit = EXCLUDED.est_price_per_unit;

-- 4. SEED VERIFIED CUSTOMER PROFILE
INSERT INTO public.customers (id, customer_code, full_name, phone, email, address, city, state, zip_code, id_type, id_number, created_by)
VALUES
  ('c2000000-0000-0000-0000-000000000001', 'TGB-CUS-000001', 'Eleanor Vance', '(214) 555-0199', 'eleanor.vance@gmail.com', '4521 Highland Park Blvd', 'Dallas', 'TX', '75205', 'Drivers License', 'TX-DL-8492019', 'e1000000-0000-0000-0000-000000000001'),
  ('c2000000-0000-0000-0000-000000000002', 'TGB-CUS-000002', 'Robert Chen', '(713) 555-0288', 'robert.chen@outlook.com', '1820 River Oaks Blvd', 'Houston', 'TX', '77019', 'Passport', 'US-PASS-948201', 'e1000000-0000-0000-0000-000000000002'),
  ('c2000000-0000-0000-0000-000000000003', 'TGB-CUS-000003', 'Sophia Martinez', '(512) 555-0377', 'sophia.m@austinmail.com', '3900 Barton Creek Blvd', 'Austin', 'TX', '78735', 'Drivers License', 'TX-DL-3819402', 'e1000000-0000-0000-0000-000000000004')
ON CONFLICT (customer_code) DO NOTHING;
