-- ============================================================================
-- TEXAS GOLD BUYERS — SUPABASE STORAGE BUCKETS & SECURITY POLICIES
-- ============================================================================

-- Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('transaction-images', 'transaction-images', false),
  ('customer-documents', 'customer-documents', false),
  ('invoice-files', 'invoice-files', false),
  ('report-files', 'report-files', false),
  ('quote-images', 'quote-images', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Security Policies
-- 1. Transaction Images: Authenticated staff can upload and read
CREATE POLICY "Authenticated staff upload transaction images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'transaction-images');

CREATE POLICY "Authenticated staff read transaction images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'transaction-images');

-- 2. Customer Documents: Protected, staff only
CREATE POLICY "Authenticated staff manage customer docs"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'customer-documents');

-- 3. Invoice Files: Protected, staff only
CREATE POLICY "Authenticated staff manage invoices"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'invoice-files');

-- 4. Public Quote Images: Public can upload, staff can read
CREATE POLICY "Anyone upload quote images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'quote-images');

CREATE POLICY "Staff read quote images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'quote-images');
