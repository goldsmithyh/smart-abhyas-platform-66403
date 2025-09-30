/*
  # Add Pricing System for Papers

  1. New Tables
    - `paper_pricing`
      - `id` (uuid, primary key)
      - `paper_id` (uuid, foreign key to papers)
      - `price` (decimal, price in INR)
      - `is_free` (boolean, whether paper is free)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `payment_transactions`
      - `id` (uuid, primary key)
      - `user_email` (text)
      - `paper_id` (uuid, foreign key to papers)
      - `razorpay_payment_id` (text)
      - `razorpay_order_id` (text)
      - `amount` (decimal)
      - `status` (text: pending, completed, failed)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for admin management and user access
*/

-- Create paper_pricing table
CREATE TABLE IF NOT EXISTS paper_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id uuid NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  price decimal(10,2) DEFAULT 0.00,
  is_free boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(paper_id)
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  user_name text,
  school_name text,
  mobile text,
  paper_id uuid NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  razorpay_payment_id text,
  razorpay_order_id text,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE paper_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for paper_pricing
CREATE POLICY "Anyone can view pricing"
  ON paper_pricing
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage pricing"
  ON paper_pricing
  FOR ALL
  TO public
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

-- Policies for payment_transactions
CREATE POLICY "Users can view their own transactions"
  ON payment_transactions
  FOR SELECT
  TO public
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Anyone can insert payment transactions"
  ON payment_transactions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all transactions"
  ON payment_transactions
  FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  ));

-- Update trigger for paper_pricing
CREATE OR REPLACE FUNCTION update_paper_pricing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_paper_pricing_updated_at
  BEFORE UPDATE ON paper_pricing
  FOR EACH ROW
  EXECUTE FUNCTION update_paper_pricing_updated_at();

-- Insert default free pricing for existing papers
INSERT INTO paper_pricing (paper_id, price, is_free)
SELECT id, 0.00, true
FROM papers
WHERE id NOT IN (SELECT paper_id FROM paper_pricing);