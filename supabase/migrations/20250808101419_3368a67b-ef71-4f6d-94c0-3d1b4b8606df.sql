-- Add the user goldsmith.sir@gmail.com as super admin
-- First check if they exist, then add them

INSERT INTO public.admin_users (user_id, role)
SELECT id, 'super_admin'
FROM auth.users 
WHERE email = 'goldsmith.sir@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'super_admin';

-- Also update the trigger to automatically make this specific email a super admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Add new user to admin_users table automatically
  -- Special case for goldsmith.sir@gmail.com - make them super admin
  IF NEW.email = 'goldsmith.sir@gmail.com' THEN
    INSERT INTO public.admin_users (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
  ELSE
    INSERT INTO public.admin_users (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;