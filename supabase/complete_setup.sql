-- ============================================================================
-- TEXAS GOLD BUYERS — COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- RUN THIS ENTIRE SCRIPT IN YOUR SUPABASE DASHBOARD -> SQL EDITOR -> RUN
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'employee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM ('ACTIVE', 'DISABLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE metal_category AS ENUM (
        'Gold',
        'Silver',
        'Diamond',
        'Platinum',
        'Watches',
        'Coins & Currency',
        'Collectibles',
        'Other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('BUY', 'SELL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('COMPLETED', 'VOIDED', 'PENDING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('COMPLETED', 'PENDING', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('CASH', 'CARD', 'CHEQUE', 'WIRE', 'STORE_CREDIT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES DEFINITIONS
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'TX',
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role user_role NOT NULL DEFAULT 'employee',
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
    status account_status NOT NULL DEFAULT 'ACTIVE',
    avatar_url TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Dallas',
    state VARCHAR(50) NOT NULL DEFAULT 'TX',
    zip_code VARCHAR(20) NOT NULL DEFAULT '75201',
    id_type VARCHAR(100) NOT NULL DEFAULT 'Drivers License',
    id_number VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category metal_category NOT NULL,
    material VARCHAR(255) NOT NULL,
    default_purity VARCHAR(100) NOT NULL,
    typical_unit VARCHAR(20) NOT NULL DEFAULT 'g',
    est_price_per_unit NUMERIC(12, 2) DEFAULT 0,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    employee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE RESTRICT,
    transaction_type transaction_type NOT NULL,
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    balance_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
    payment_status payment_status NOT NULL DEFAULT 'COMPLETED',
    status transaction_status NOT NULL DEFAULT 'COMPLETED',
    notes TEXT,
    customer_signature_url TEXT,
    employee_signature_url TEXT,
    terms_accepted BOOLEAN DEFAULT true,
    void_reason TEXT,
    voided_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    voided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    category metal_category NOT NULL,
    material VARCHAR(255) NOT NULL,
    purity VARCHAR(100) NOT NULL,
    weight NUMERIC(10, 3) NOT NULL DEFAULT 1.0,
    unit VARCHAR(20) NOT NULL DEFAULT 'g',
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    estimated_value NUMERIC(14, 2) NOT NULL DEFAULT 0,
    offered_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
    is_custom BOOLEAN DEFAULT false,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    payment_method payment_method NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'COMPLETED',
    reference_number VARCHAR(100) NOT NULL,
    cheque_number VARCHAR(100),
    bank_name VARCHAR(255),
    cheque_date DATE,
    card_type VARCHAR(50),
    card_last_four VARCHAR(4),
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaction_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    transaction_item_id UUID REFERENCES public.transaction_items(id) ON DELETE CASCADE,
    bucket_name VARCHAR(100) NOT NULL DEFAULT 'transaction-images',
    storage_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT,
    view_tag VARCHAR(50) DEFAULT 'General',
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    details TEXT,
    before_data JSONB,
    after_data JSONB,
    ip_address VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    item_category VARCHAR(100) NOT NULL,
    approx_weight VARCHAR(100),
    description TEXT,
    preferred_location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'NEW',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_customers_code ON public.customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(full_name);

CREATE INDEX IF NOT EXISTS idx_transactions_tx_num ON public.transactions(transaction_number);
CREATE INDEX IF NOT EXISTS idx_transactions_inv_num ON public.transactions(invoice_number);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_customer ON public.transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_employee ON public.transactions(employee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);

CREATE INDEX IF NOT EXISTS idx_tx_items_transaction ON public.transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_tx_items_category ON public.transaction_items(category);

CREATE INDEX IF NOT EXISTS idx_payments_transaction ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_method ON public.payments(payment_method);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- 5. ROW LEVEL SECURITY (RLS) & HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid() AND role = 'super_admin' AND status = 'ACTIVE'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_active_employee()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid() AND status = 'ACTIVE'
  );
$$ LANGUAGE sql SECURITY DEFINER;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent duplicate errors
DROP POLICY IF EXISTS "Allow read profiles for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Super admin manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Read locations for all" ON public.locations;
DROP POLICY IF EXISTS "Super admin manage locations" ON public.locations;
DROP POLICY IF EXISTS "Active staff can view customers" ON public.customers;
DROP POLICY IF EXISTS "Active staff can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Active staff can update customers" ON public.customers;
DROP POLICY IF EXISTS "Active staff can read menu items" ON public.items;
DROP POLICY IF EXISTS "Super admin manage menu items" ON public.items;
DROP POLICY IF EXISTS "Active staff view transactions" ON public.transactions;
DROP POLICY IF EXISTS "Active staff create transactions" ON public.transactions;
DROP POLICY IF EXISTS "Super admin or creator manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "Active staff view transaction items" ON public.transaction_items;
DROP POLICY IF EXISTS "Active staff insert transaction items" ON public.transaction_items;
DROP POLICY IF EXISTS "Active staff view payments" ON public.payments;
DROP POLICY IF EXISTS "Active staff insert payments" ON public.payments;
DROP POLICY IF EXISTS "Super admin view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Staff append audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Public can submit quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Staff can view and manage quote requests" ON public.quote_requests;

-- Create RLS Policies
CREATE POLICY "Allow read profiles for authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Super admin manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Read locations for all" ON public.locations FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Super admin manage locations" ON public.locations FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "Active staff can view customers" ON public.customers FOR SELECT TO authenticated USING (public.is_active_employee());
CREATE POLICY "Active staff can insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (public.is_active_employee());
CREATE POLICY "Active staff can update customers" ON public.customers FOR UPDATE TO authenticated USING (public.is_active_employee());
CREATE POLICY "Active staff can read menu items" ON public.items FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Super admin manage menu items" ON public.items FOR ALL TO authenticated USING (public.is_super_admin());
CREATE POLICY "Active staff view transactions" ON public.transactions FOR SELECT TO authenticated USING (public.is_active_employee());
CREATE POLICY "Active staff create transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (public.is_active_employee());
CREATE POLICY "Super admin or creator manage transactions" ON public.transactions FOR UPDATE TO authenticated USING (public.is_super_admin() OR employee_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "Active staff view transaction items" ON public.transaction_items FOR SELECT TO authenticated USING (public.is_active_employee());
CREATE POLICY "Active staff insert transaction items" ON public.transaction_items FOR INSERT TO authenticated WITH CHECK (public.is_active_employee());
CREATE POLICY "Active staff view payments" ON public.payments FOR SELECT TO authenticated USING (public.is_active_employee());
CREATE POLICY "Active staff insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (public.is_active_employee());
CREATE POLICY "Super admin view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_super_admin());
CREATE POLICY "Staff append audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Public can submit quote requests" ON public.quote_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff can view and manage quote requests" ON public.quote_requests FOR ALL TO authenticated USING (public.is_active_employee());

-- 6. AUTOMATED TRIGGERS & IMMUTABILITY
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_locations_updated_at ON public.locations;
CREATE TRIGGER set_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_customers_updated_at ON public.customers;
CREATE TRIGGER set_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_items_updated_at ON public.items;
CREATE TRIGGER set_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_transactions_updated_at ON public.transactions;
CREATE TRIGGER set_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable permanent legal records and cannot be modified or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lock_audit_logs_update ON public.audit_logs;
CREATE TRIGGER lock_audit_logs_update BEFORE UPDATE OR DELETE ON public.audit_logs FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_modification();

-- 7. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('transaction-images', 'transaction-images', false),
  ('customer-documents', 'customer-documents', false),
  ('invoice-files', 'invoice-files', false),
  ('report-files', 'report-files', false),
  ('quote-images', 'quote-images', false)
ON CONFLICT (id) DO NOTHING;

-- 8. INITIAL SEED RECORDS (Locations, Profiles, Catalog, Customers)
INSERT INTO public.locations (id, location_code, name, address, city, state, zip_code, phone, email, is_primary)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'LOC-01', 'Dallas Flagship — Uptown', '2800 McKinney Ave, Suite 400', 'Dallas', 'TX', '75204', '(214) 555-4653', 'dallas@texasgoldbuyers.com', true),
  ('c1000000-0000-0000-0000-000000000002', 'LOC-02', 'Houston Galleria Store', '5085 Westheimer Rd, Suite B2800', 'Houston', 'TX', '77056', '(713) 555-4653', 'houston@texasgoldbuyers.com', false),
  ('c1000000-0000-0000-0000-000000000003', 'LOC-03', 'Austin Domain Branch', '11410 Century Oaks Terrace, Suite 120', 'Austin', 'TX', '78758', '(512) 555-4653', 'austin@texasgoldbuyers.com', false),
  ('c1000000-0000-0000-0000-000000000004', 'LOC-04', 'San Antonio — Riverwalk', '300 E Houston St, Suite 210', 'San Antonio', 'TX', '78205', '(210) 555-4653', 'sanantonio@texasgoldbuyers.com', false)
ON CONFLICT (location_code) DO NOTHING;

INSERT INTO public.profiles (id, employee_code, full_name, email, phone, role, location_id, status)
VALUES
  ('e1000000-0000-0000-0000-000000000001', 'EMP-001', 'Alexander Sterling', 'admin@texasgoldbuyers.com', '(214) 555-0101', 'super_admin', 'c1000000-0000-0000-0000-000000000001', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000002', 'EMP-002', 'Marcus Vance', 'employee@texasgoldbuyers.com', '(214) 555-0102', 'employee', 'c1000000-0000-0000-0000-000000000001', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000003', 'EMP-003', 'Sarah Jenkins', 's.jenkins@texasgoldbuyers.com', '(713) 555-0103', 'employee', 'c1000000-0000-0000-0000-000000000002', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000004', 'EMP-004', 'David Rodriguez', 'd.rodriguez@texasgoldbuyers.com', '(512) 555-0104', 'employee', 'c1000000-0000-0000-0000-000000000003', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000005', 'EMP-005', 'Elena Rostova', 'e.rostova@texasgoldbuyers.com', '(210) 555-0105', 'employee', 'c1000000-0000-0000-0000-000000000004', 'ACTIVE'),
  ('e1000000-0000-0000-0000-000000000006', 'EMP-006', 'James Holloway', 'j.holloway@texasgoldbuyers.com', '(214) 555-0106', 'employee', 'c1000000-0000-0000-0000-000000000001', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.items (id, item_code, name, category, material, default_purity, typical_unit, est_price_per_unit, description)
VALUES
  ('i1000000-0000-0000-0000-000000000001', 'CAT-001', '10K Gold Scrap Jewelry', 'Gold', '10K Yellow/White Gold', '10K (41.7%)', 'g', 34.00, 'Assorted broken chains, rings, and mountings'),
  ('i1000000-0000-0000-0000-000000000002', 'CAT-002', '14K Gold Estate Jewelry', 'Gold', '14K Gold Alloy', '14K (58.5%)', 'g', 48.00, 'Hallmarked 14k chains, rings, bracelets'),
  ('i1000000-0000-0000-0000-000000000003', 'CAT-003', '18K Gold Fine Jewelry', 'Gold', '18K Gold Alloy', '18K (75.0%)', 'g', 62.00, 'High-end European and luxury designer gold'),
  ('i1000000-0000-0000-0000-000000000004', 'CAT-004', '22K / 24K Pure Gold Bullion', 'Gold', '24K Pure Gold', '24K (99.9%)', 'g', 81.00, 'Investment-grade bars and mint bullion'),
  ('i1000000-0000-0000-0000-000000000005', 'CAT-005', '999 Fine Silver Bar (10 oz)', 'Silver', '999 Fine Silver', '.999 Fine', 'oz', 29.50, 'Mint struck 10 troy ounce silver bar'),
  ('i1000000-0000-0000-0000-000000000006', 'CAT-006', 'Sterling Silver Flatware (.925)', 'Silver', 'Sterling Silver', '.925 Sterling', 'g', 0.85, 'Solid sterling tableware and tea sets'),
  ('i1000000-0000-0000-0000-000000000007', 'CAT-007', 'Platinum Ring / Ingot (950)', 'Platinum', '950 Platinum', 'PT950 (95.0%)', 'g', 32.00, 'Platinum mountings and minted ingots'),
  ('i1000000-0000-0000-0000-000000000008', 'CAT-008', '1.00 Carat Round Brilliant Diamond', 'Diamond', 'Natural Diamond', 'VS2 / F Color', 'ct', 3200.00, 'Certified natural loose diamond'),
  ('i1000000-0000-0000-0000-000000000009', 'CAT-009', 'Rolex Submariner Date (116610LN)', 'Watches', 'Stainless Steel / Ceramic', 'Authentic Swiss', 'pcs', 10500.00, 'Pre-owned luxury timepiece with box & papers'),
  ('i1000000-0000-0000-0000-000000000010', 'CAT-010', 'US Gold Eagle $50 Coin (1 oz)', 'Coins & Currency', '22K Coin Gold', '22K (91.67%)', 'oz', 2530.00, 'US Mint uncirculated legal tender gold bullion coin')
ON CONFLICT (item_code) DO NOTHING;

INSERT INTO public.customers (id, customer_code, full_name, phone, email, address, city, state, zip_code, id_type, id_number, created_by)
VALUES
  ('c2000000-0000-0000-0000-000000000001', 'TGB-CUS-000001', 'Eleanor Vance', '(214) 555-0199', 'eleanor.vance@gmail.com', '4521 Highland Park Blvd', 'Dallas', 'TX', '75205', 'Drivers License', 'TX-DL-8492019', 'e1000000-0000-0000-0000-000000000001'),
  ('c2000000-0000-0000-0000-000000000002', 'TGB-CUS-000002', 'Robert Chen', '(713) 555-0288', 'robert.chen@outlook.com', '1820 River Oaks Blvd', 'Houston', 'TX', '77019', 'Passport', 'US-PASS-948201', 'e1000000-0000-0000-0000-000000000002'),
  ('c2000000-0000-0000-0000-000000000003', 'TGB-CUS-000003', 'Sophia Martinez', '(512) 555-0377', 'sophia.m@austinmail.com', '3900 Barton Creek Blvd', 'Austin', 'TX', '78735', 'Drivers License', 'TX-DL-3819402', 'e1000000-0000-0000-0000-000000000004')
ON CONFLICT (customer_code) DO NOTHING;
