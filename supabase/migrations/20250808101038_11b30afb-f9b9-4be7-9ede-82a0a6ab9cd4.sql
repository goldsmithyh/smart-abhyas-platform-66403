-- Fix infinite recursion in RLS policies by creating security definer functions

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop and recreate all policies using the security definer function

-- Standards policies
DROP POLICY IF EXISTS "Only admins can manage standards" ON public.standards;
CREATE POLICY "Only admins can manage standards" ON public.standards
  FOR ALL USING (public.is_admin());

-- Exam types policies  
DROP POLICY IF EXISTS "Only admins can manage exam types" ON public.exam_types;
CREATE POLICY "Only admins can manage exam types" ON public.exam_types
  FOR ALL USING (public.is_admin());

-- Subjects catalog policies
DROP POLICY IF EXISTS "Only admins can manage subjects catalog" ON public.subjects_catalog;
CREATE POLICY "Only admins can manage subjects catalog" ON public.subjects_catalog
  FOR ALL USING (public.is_admin());

-- Papers policies
DROP POLICY IF EXISTS "Only admins can manage papers" ON public.papers;
CREATE POLICY "Only admins can manage papers" ON public.papers
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Subjects policies (old table)
DROP POLICY IF EXISTS "Only admins can manage subjects" ON public.subjects;
CREATE POLICY "Only admins can manage subjects" ON public.subjects
  FOR ALL USING (public.is_admin());

-- Paper pricing policies
DROP POLICY IF EXISTS "Only admins can manage paper pricing" ON public.paper_pricing;
CREATE POLICY "Only admins can manage paper pricing" ON public.paper_pricing
  FOR ALL USING (public.is_admin());

-- Admin users policies (keep simple)
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users admin_users_1
      WHERE admin_users_1.user_id = auth.uid() 
      AND admin_users_1.role = 'super_admin'
    )
  );

-- Download logs policies
DROP POLICY IF EXISTS "Admins can view download logs" ON public.download_logs;
CREATE POLICY "Admins can view download logs" ON public.download_logs
  FOR SELECT USING (public.is_admin());