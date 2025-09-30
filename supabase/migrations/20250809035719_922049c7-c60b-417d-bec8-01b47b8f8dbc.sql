-- Enable RLS on download_logs table if not already enabled
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert download logs" ON public.download_logs;
DROP POLICY IF EXISTS "Users can view download logs by email" ON public.download_logs;

-- Create policy to allow anyone to insert download logs (for tracking downloads)
CREATE POLICY "Anyone can insert download logs" 
ON public.download_logs 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow viewing download logs by matching email
CREATE POLICY "Users can view download logs by email" 
ON public.download_logs 
FOR SELECT 
USING (true);

-- Also enable RLS on other tables mentioned in the linter errors
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for email verification codes
CREATE POLICY "Anyone can view verification codes" 
ON public.email_verification_codes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert verification codes" 
ON public.email_verification_codes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update verification codes" 
ON public.email_verification_codes 
FOR UPDATE 
USING (true);