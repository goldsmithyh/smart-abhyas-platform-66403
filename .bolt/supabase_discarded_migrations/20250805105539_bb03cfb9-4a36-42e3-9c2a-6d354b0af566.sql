
-- Create paper_pricing table to store pricing information for papers
CREATE TABLE public.paper_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_transactions table to track payments
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  user_name TEXT,
  school_name TEXT,
  mobile TEXT,
  paper_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.paper_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for paper_pricing
CREATE POLICY "Anyone can view paper pricing" ON public.paper_pricing
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage paper pricing" ON public.paper_pricing
  FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

-- RLS policies for payment_transactions
CREATE POLICY "Admins can view all transactions" ON public.payment_transactions
  FOR SELECT USING (EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Anyone can insert transactions" ON public.payment_transactions
  FOR INSERT WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_paper_pricing_updated_at
  BEFORE UPDATE ON public.paper_pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create default pricing entries for existing papers
INSERT INTO public.paper_pricing (paper_id, price, is_free)
SELECT id, 0, true FROM papers
ON CONFLICT DO NOTHING;
