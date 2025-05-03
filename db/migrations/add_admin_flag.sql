-- Run in Supabase SQL Editor
-- Add admin flag to users table

-- Add is_admin column to identify administrators
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN users.is_admin IS 'Flag indicating if user has administrative privileges (true/false)';

-- Create index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- Grant the first user admin rights (replace with the actual user ID or email)
-- Uncomment and modify the query below to make a specific user an admin
-- UPDATE users
-- SET is_admin = TRUE
-- WHERE email = 'your-admin-email@example.com'; 