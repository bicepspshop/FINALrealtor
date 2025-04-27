-- Setup password recovery functionality

-- 1. Create auth_user_id column in the users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'auth_user_id'
  ) THEN
    ALTER TABLE public.users ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) NULL;
  END IF;
END $$;

-- 2. Create a function to handle user registration with Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  -- If a user with this email already exists in our custom users table, update their auth ID
  UPDATE public.users 
  SET auth_user_id = NEW.id
  WHERE email = NEW.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create a trigger to link auth.users with our public.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_created();

-- 4. Create a function to handle password reset requests
CREATE OR REPLACE FUNCTION public.request_password_reset(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_auth_user_id UUID;
BEGIN
  -- Find the user in our custom users table
  SELECT id, auth_user_id INTO v_user_id, v_auth_user_id FROM public.users WHERE email = user_email;
  
  IF v_user_id IS NULL THEN
    -- User not found, but we return true for security (don't reveal if email exists)
    RETURN TRUE;
  END IF;
  
  -- If we have an auth_user_id, we can use Supabase Auth
  IF v_auth_user_id IS NOT NULL THEN
    -- The actual reset email will be sent by the Supabase Auth service
    RETURN TRUE;
  ELSE
    -- No auth user linked yet, let's create one
    INSERT INTO auth.users (id, email, instance_id, confirmation_token)
    VALUES (
      gen_random_uuid(),
      user_email,
      (SELECT instance_id FROM auth.instances LIMIT 1),
      encode(gen_random_bytes(20), 'hex')
    )
    RETURNING id INTO v_auth_user_id;
    
    -- Link the auth user to our custom user
    UPDATE public.users SET auth_user_id = v_auth_user_id WHERE id = v_user_id;
    
    RETURN TRUE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create a function to update the password in both auth.users and public.users
CREATE OR REPLACE FUNCTION public.update_user_password(user_email TEXT, new_password_hash TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_auth_user_id UUID;
BEGIN
  -- Find the user in our custom users table
  SELECT id, auth_user_id INTO v_user_id, v_auth_user_id FROM public.users WHERE email = user_email;
  
  IF v_user_id IS NULL THEN
    -- User not found
    RETURN FALSE;
  END IF;
  
  -- Update the password in our custom users table
  UPDATE public.users SET password_hash = new_password_hash WHERE id = v_user_id;
  
  -- If we have an auth_user_id, update the password in auth.users as well
  IF v_auth_user_id IS NOT NULL THEN
    UPDATE auth.users SET encrypted_password = new_password_hash WHERE id = v_auth_user_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;