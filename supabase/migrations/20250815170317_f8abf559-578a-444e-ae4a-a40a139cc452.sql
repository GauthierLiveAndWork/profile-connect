-- Fix infinite recursion in admin_roles RLS policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Admins can view admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can manage admin roles" ON public.admin_roles;

-- Create simple, non-recursive policies
CREATE POLICY "Only authenticated users can view admin roles" 
ON public.admin_roles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage admin roles" 
ON public.admin_roles 
FOR ALL 
USING (auth.uid() IS NOT NULL);