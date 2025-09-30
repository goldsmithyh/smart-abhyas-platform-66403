-- Enable RLS on download_logs table if not already enabled
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for download_logs
DROP POLICY IF EXISTS "Anyone can insert download logs" ON public.download_logs;
DROP POLICY IF EXISTS "Users can view download logs by email" ON public.download_logs;
DROP POLICY IF EXISTS "Allow public access to download_logs" ON public.download_logs;

-- Create new policies for download_logs
CREATE POLICY "Public can insert download logs" 
ON public.download_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view download logs" 
ON public.download_logs 
FOR SELECT 
USING (true);

-- Enable RLS on email_verification_codes if not already enabled
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for email_verification_codes
DROP POLICY IF EXISTS "Anyone can view verification codes" ON public.email_verification_codes;
DROP POLICY IF EXISTS "Anyone can insert verification codes" ON public.email_verification_codes;
DROP POLICY IF EXISTS "Anyone can update verification codes" ON public.email_verification_codes;
DROP POLICY IF EXISTS "Allow public access to email_verification_codes" ON public.email_verification_codes;

-- Create new policies for email_verification_codes
CREATE POLICY "Public can view verification codes" 
ON public.email_verification_codes 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert verification codes" 
ON public.email_verification_codes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update verification codes" 
ON public.email_verification_codes 
FOR UPDATE 
USING (true);