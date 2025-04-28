-- Add subscription-related fields to users table

-- Add trial_start_time column (when user registered)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS trial_start_time TIMESTAMPTZ DEFAULT NOW();

-- Add trial_duration_minutes column (default 14 days = 20160 minutes)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS trial_duration_minutes INTEGER DEFAULT 20160;

-- Add subscription_status column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'trial';

-- Comment on subscription_status column for documentation
COMMENT ON COLUMN users.subscription_status IS 'Possible values: trial, expired, active, cancelled'; 