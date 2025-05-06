-- Set up administrative role functionality

-- Ensure is_admin column exists on users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create comment for documentation
COMMENT ON COLUMN users.is_admin IS 'Whether this user has administrative privileges';

-- Set the designated admin user
UPDATE users 
SET is_admin = true 
WHERE email = 'Adminus@gmail.com';

-- Add index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) 
WHERE is_admin = true;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin_user(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  admin_status BOOLEAN;
BEGIN
  SELECT is_admin INTO admin_status
  FROM users
  WHERE id = user_id_param;
  
  RETURN COALESCE(admin_status, FALSE);
END;
$$; 