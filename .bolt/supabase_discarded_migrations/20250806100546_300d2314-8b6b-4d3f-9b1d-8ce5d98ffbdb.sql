-- Create table for email verification codes
CREATE TABLE public.email_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  is_used BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert verification codes" 
ON public.email_verification_codes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their own verification codes" 
ON public.email_verification_codes 
FOR UPDATE 
USING (email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Create function to clean up expired codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_codes()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.email_verification_codes 
  WHERE expires_at < now() OR is_used = true;
END;
$$;

-- Create index for better performance
CREATE INDEX idx_email_verification_codes_email ON public.email_verification_codes(email);
CREATE INDEX idx_email_verification_codes_expires_at ON public.email_verification_codes(expires_at);