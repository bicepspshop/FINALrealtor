-- Create payments table for subscription payment tracking
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id VARCHAR(255) NOT NULL UNIQUE, -- YooKassa payment identifier
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'RUB',
  plan_type VARCHAR(50) NOT NULL, -- 'monthly' or 'yearly'
  payment_date TIMESTAMPTZ NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- 'yookassa', etc.
  status VARCHAR(50) NOT NULL, -- 'succeeded', 'canceled', 'pending'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB -- For storing additional payment details
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Add RLS (Row Level Security) policies to protect payment data
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own payments
CREATE POLICY payments_select_policy ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Only authenticated users can insert their own payments
CREATE POLICY payments_insert_policy ON payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own payments (limited, as payments typically shouldn't be modified)
CREATE POLICY payments_update_policy ON payments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add additional columns to users table for subscription details if not already present
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50);

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_payment_id VARCHAR(255);

-- Comment on subscription columns for documentation
COMMENT ON COLUMN users.subscription_plan IS 'Subscription plan type: monthly, yearly';
COMMENT ON COLUMN users.subscription_start_date IS 'When the current subscription started';
COMMENT ON COLUMN users.subscription_end_date IS 'When the current subscription will end';
COMMENT ON COLUMN users.last_payment_id IS 'ID of the last successful payment';

-- Add function to check if a subscription is active
CREATE OR REPLACE FUNCTION is_subscription_active(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  is_active BOOLEAN;
BEGIN
  SELECT 
    CASE 
      WHEN subscription_status = 'active' AND subscription_end_date > NOW() THEN TRUE
      WHEN subscription_status = 'trial' AND 
           (trial_start_time + (trial_duration_minutes || ' minutes')::interval) > NOW() THEN TRUE
      ELSE FALSE
    END INTO is_active
  FROM users
  WHERE id = user_id_param;
  
  RETURN COALESCE(is_active, FALSE);
END;
$$; 