-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;

-- Create a non-recursive policy - users can see their own admin record
CREATE POLICY "Users can view own admin status"
ON public.admin_users
FOR SELECT
USING (user_id = auth.uid());