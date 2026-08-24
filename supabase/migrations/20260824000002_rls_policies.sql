-- ============================================================================
-- TEXAS GOLD BUYERS — SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Helper functions to get current user role
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

-- Enable RLS on all tables
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

-- 1. PROFILES POLICIES
-- Anyone authenticated can read profiles (to see employee names)
CREATE POLICY "Allow read profiles for authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Only Super Admin can insert/update/delete profiles (create/disable employees)
CREATE POLICY "Super admin manage profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- 2. LOCATIONS POLICIES
CREATE POLICY "Read locations for all"
ON public.locations FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Super admin manage locations"
ON public.locations FOR ALL
TO authenticated
USING (public.is_super_admin());

-- 3. CUSTOMERS POLICIES
CREATE POLICY "Active staff can view customers"
ON public.customers FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "Active staff can insert customers"
ON public.customers FOR INSERT
TO authenticated
WITH CHECK (public.is_active_employee());

CREATE POLICY "Active staff can update customers"
ON public.customers FOR UPDATE
TO authenticated
USING (public.is_active_employee());

-- 4. ITEMS POLICIES
CREATE POLICY "Active staff can read menu items"
ON public.items FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Super admin manage menu items"
ON public.items FOR ALL
TO authenticated
USING (public.is_super_admin());

-- 5. TRANSACTIONS POLICIES
-- Super admin can view all; employees can view all branch transactions
CREATE POLICY "Active staff view transactions"
ON public.transactions FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "Active staff create transactions"
ON public.transactions FOR INSERT
TO authenticated
WITH CHECK (public.is_active_employee());

-- Only super admin or originating employee can edit/void
CREATE POLICY "Super admin or creator manage transactions"
ON public.transactions FOR UPDATE
TO authenticated
USING (
  public.is_super_admin() OR 
  employee_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);

-- 6. TRANSACTION ITEMS POLICIES
CREATE POLICY "Active staff view transaction items"
ON public.transaction_items FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "Active staff insert transaction items"
ON public.transaction_items FOR INSERT
TO authenticated
WITH CHECK (public.is_active_employee());

-- 7. PAYMENTS POLICIES
CREATE POLICY "Active staff view payments"
ON public.payments FOR SELECT
TO authenticated
USING (public.is_active_employee());

CREATE POLICY "Active staff insert payments"
ON public.payments FOR INSERT
TO authenticated
WITH CHECK (public.is_active_employee());

-- 8. AUDIT LOGS POLICIES
-- Super Admin can view all audit logs
CREATE POLICY "Super admin view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_super_admin());

-- All active staff can append to audit logs
CREATE POLICY "Staff append audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- NO ONE CAN UPDATE OR DELETE AUDIT LOGS (Immutable)
-- (No UPDATE or DELETE policies created)

-- 9. QUOTE REQUESTS POLICIES
CREATE POLICY "Public can submit quote requests"
ON public.quote_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Staff can view and manage quote requests"
ON public.quote_requests FOR ALL
TO authenticated
USING (public.is_active_employee());
