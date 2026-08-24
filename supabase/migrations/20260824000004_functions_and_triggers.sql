-- ============================================================================
-- TEXAS GOLD BUYERS — SUPABASE FUNCTIONS & TRIGGERS
-- ============================================================================

-- 1. AUTOMATIC TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS set_locations_updated_at ON public.locations;
CREATE TRIGGER set_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_customers_updated_at ON public.customers;
CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_items_updated_at ON public.items;
CREATE TRIGGER set_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_transactions_updated_at ON public.transactions;
CREATE TRIGGER set_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. IMMUTABLE AUDIT LOG PROTECTION TRIGGER FUNCTION
-- Prevents ANY UPDATE or DELETE on audit_logs at the database trigger level
CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable permanent legal records and cannot be modified or deleted.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lock_audit_logs_update ON public.audit_logs;
CREATE TRIGGER lock_audit_logs_update
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_audit_log_modification();

-- 3. SETTLED TRANSACTION IMMUTABILITY & TAMPERING LOCK
-- Prevents financial value alterations once a transaction is COMPLETED
CREATE OR REPLACE FUNCTION public.lock_completed_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- If transaction was COMPLETED and someone attempts to change financial numbers without voiding
  IF OLD.status = 'COMPLETED' AND NEW.status = 'COMPLETED' THEN
    IF OLD.total_amount <> NEW.total_amount OR
       OLD.subtotal <> NEW.subtotal OR
       OLD.customer_id <> NEW.customer_id OR
       OLD.transaction_date <> NEW.transaction_date OR
       OLD.transaction_type <> NEW.transaction_type THEN
      RAISE EXCEPTION 'Settled transaction values are locked and cannot be edited. A Super Admin must void and reissue the transaction.';
    END IF;
  END IF;

  -- Only super_admin can void a completed transaction
  IF OLD.status = 'COMPLETED' AND NEW.status = 'VOIDED' THEN
    IF NOT public.is_super_admin() THEN
      RAISE EXCEPTION 'Only a Super Admin has authorization to void a settled transaction.';
    END IF;
    IF NEW.void_reason IS NULL OR LENGTH(TRIM(NEW.void_reason)) < 5 THEN
      RAISE EXCEPTION 'A detailed statutory void reason of at least 5 characters is required.';
    END IF;
    NEW.voided_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_transaction_lock ON public.transactions;
CREATE TRIGGER enforce_transaction_lock
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.lock_completed_transaction();

-- 4. AUTOMATIC AUDIT LOGGING ON TRANSACTION EVENTS
CREATE OR REPLACE FUNCTION public.audit_transaction_event()
RETURNS TRIGGER AS $$
DECLARE
  v_user_name VARCHAR(255) := 'System Staff';
  v_user_role VARCHAR(50) := 'EMPLOYEE';
  v_profile RECORD;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT full_name, role::text INTO v_profile FROM public.profiles WHERE id = NEW.employee_id;
    IF FOUND THEN
      v_user_name := v_profile.full_name;
      v_user_role := v_profile.role;
    END IF;

    INSERT INTO public.audit_logs (
      user_id,
      user_name,
      role,
      action,
      entity_type,
      entity_id,
      details,
      after_data
    ) VALUES (
      NEW.employee_id,
      v_user_name,
      v_user_role,
      'TRANSACTION_CREATED',
      'TRANSACTION',
      NEW.transaction_number,
      'Processed ' || NEW.transaction_type || ' transaction of $' || NEW.total_amount || ' for ' || NEW.transaction_number,
      row_to_json(NEW)::jsonb
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'COMPLETED' AND NEW.status = 'VOIDED' THEN
    SELECT full_name, role::text INTO v_profile FROM public.profiles WHERE id = NEW.voided_by;
    IF FOUND THEN
      v_user_name := v_profile.full_name;
      v_user_role := v_profile.role;
    END IF;

    INSERT INTO public.audit_logs (
      user_id,
      user_name,
      role,
      action,
      entity_type,
      entity_id,
      details,
      before_data,
      after_data
    ) VALUES (
      NEW.voided_by,
      v_user_name,
      v_user_role,
      'TRANSACTION_VOIDED',
      'TRANSACTION',
      NEW.transaction_number,
      'Voided transaction ' || NEW.transaction_number || '. Reason: ' || COALESCE(NEW.void_reason, 'No reason specified'),
      row_to_json(OLD)::jsonb,
      row_to_json(NEW)::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_transaction_audit ON public.transactions;
CREATE TRIGGER trigger_transaction_audit
  AFTER INSERT OR UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_transaction_event();
