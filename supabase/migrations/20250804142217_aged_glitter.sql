/*
  # Ensure Admin User Setup

  1. Security
    - Add the specific admin user to admin_users table
    - Ensure proper RLS policies are in place
  
  2. Changes
    - Insert admin user if not exists
    - Update trigger to handle new user registration
*/

-- First, let's ensure the admin user exists in admin_users table
-- We'll use a DO block to handle the case where the user might not exist yet
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Try to find the user by email in auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'goldsmith.sir@gmail.com';
    
    -- If user exists, ensure they're in admin_users table
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO admin_users (user_id, role)
        VALUES (admin_user_id, 'super_admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
    END IF;
END $$;

-- Create or replace the trigger function to automatically add admin users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    -- Check if the new user is the admin
    IF NEW.email = 'goldsmith.sir@gmail.com' THEN
        INSERT INTO admin_users (user_id, role)
        VALUES (NEW.id, 'super_admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();