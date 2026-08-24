-- ============================================================================
-- TEXAS GOLD BUYERS — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LOCATIONS TABLE
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

-- 2. USERS / PROFILES (Links to supabase auth.users)
CREATE TYPE user_role AS ENUM ('super_admin', 'employee');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'DISABLED');

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

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. TGB-CUS-000001
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

-- 4. PREDEFINED ITEMS CATALOG
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

-- 5. TRANSACTIONS TABLE
CREATE TYPE transaction_type AS ENUM ('BUY', 'SELL');
CREATE TYPE transaction_status AS ENUM ('COMPLETED', 'VOIDED', 'PENDING');
CREATE TYPE payment_status AS ENUM ('COMPLETED', 'PENDING', 'REFUNDED');

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. TGB-2026-000001
    invoice_number VARCHAR(100) UNIQUE NOT NULL,     -- e.g. TGB-INV-2026-000001
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

-- 6. TRANSACTION ITEMS (Supports Unlimited Items Per Transaction)
CREATE TABLE IF NOT EXISTS public.transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    category metal_category NOT NULL,
    material VARCHAR(255) NOT NULL,
    purity VARCHAR(100) NOT NULL,
    weight NUMERIC(10, 3) NOT NULL DEFAULT 1.0,
    unit VARCHAR(20) NOT NULL DEFAULT 'g', -- 'g', 'oz', 'dwt', 'ct', 'pcs'
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

-- 7. PAYMENTS TABLE
CREATE TYPE payment_method AS ENUM ('CASH', 'CARD', 'CHEQUE', 'WIRE', 'STORE_CREDIT');

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

-- 8. TRANSACTION FILES & IMAGES (Supabase Storage Reference)
CREATE TABLE IF NOT EXISTS public.transaction_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
    transaction_item_id UUID REFERENCES public.transaction_items(id) ON DELETE CASCADE,
    bucket_name VARCHAR(100) NOT NULL DEFAULT 'transaction-images',
    storage_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT,
    view_tag VARCHAR(50) DEFAULT 'General', -- 'Front', 'Back', 'Close-up', 'Hallmark', 'General'
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS (Immutable Security Logs)
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

-- 10. PUBLIC QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    item_category VARCHAR(100) NOT NULL,
    approx_weight VARCHAR(100),
    description TEXT,
    preferred_location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'NEW', -- 'NEW', 'CONTACTED', 'APPRAISED', 'CLOSED'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- HIGH PERFORMANCE INDEXES
-- ============================================================================
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
