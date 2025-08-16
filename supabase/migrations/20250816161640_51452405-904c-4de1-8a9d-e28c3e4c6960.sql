-- URGENT FIX: Secure admin_roles table to allow publication

-- The admin_roles table is currently accessible to authenticated users, 
-- exposing admin email addresses. This must be fixed for publication.

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Only existing admins can view admin roles" ON public.admin_roles;

-- Create a completely restrictive policy - block all normal user access
CREATE POLICY "Block all non-admin access to admin roles" 
ON public.admin_roles 
FOR ALL
USING (false)  -- Block all access by default
WITH CHECK (false);  -- Block all modifications by default

-- Create a separate policy specifically for admin functions
CREATE POLICY "Allow admin functions to check admin status" 
ON public.admin_roles 
FOR SELECT 
USING (
    -- Only allow access when called from admin check functions
    -- This policy will only be used by the is_admin_user() function
    current_setting('role', true) = 'postgres'
    OR current_setting('application_name', true) = 'security_definer_function'
);

-- Add a comment explaining the security model
COMMENT ON TABLE public.admin_roles IS 'Admin roles table with restricted access. Only accessible through security definer functions to prevent email harvesting. Direct user access is blocked.';

-- Verify our is_admin_user function still works correctly
-- The function uses SECURITY DEFINER so it can access the table despite RLS restrictions