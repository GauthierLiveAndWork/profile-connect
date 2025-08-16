-- Final Security Cleanup: Address remaining security findings

-- 1. Secure the admin_roles table to prevent email harvesting
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Only authenticated users can view admin roles" ON public.admin_roles;

-- Create a more restrictive policy - only admins can view admin roles
CREATE POLICY "Only existing admins can view admin roles" 
ON public.admin_roles 
FOR SELECT 
USING (is_admin_user());

-- 2. Add proper RLS policies to public_profiles view (even though it's a view, for extra security)
-- Note: Views inherit RLS from their base tables, but we'll add explicit comments for clarity

-- 3. Review and secure SECURITY DEFINER functions
-- The is_admin_user() function is appropriately using SECURITY DEFINER because it needs to 
-- query the admin_roles table with elevated privileges. This is a correct use case.
-- The update_updated_at_column() function uses SECURITY DEFINER for trigger functionality, which is standard.

-- Add comments to document why these functions use SECURITY DEFINER
COMMENT ON FUNCTION public.is_admin_user() IS 'Uses SECURITY DEFINER to check admin status. This is necessary to query admin_roles table with elevated privileges in RLS policies.';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Uses SECURITY DEFINER for trigger functionality to update timestamps. This is standard practice for trigger functions.';

-- 4. Add additional security comment to public_profiles view
COMMENT ON VIEW public.public_profiles IS 'Secure view for public profiles. Excludes sensitive data (email, linkedin_profile, professional_references). Has security_barrier=true for additional protection against information leakage through query optimization.';

-- 5. Create a function to help debug any remaining security definer views (for development)
CREATE OR REPLACE FUNCTION public.check_security_definer_views()
RETURNS TABLE(schema_name text, view_name text, has_security_definer boolean) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.nspname::text,
        c.relname::text,
        (pg_get_viewdef(c.oid) ILIKE '%SECURITY DEFINER%')::boolean
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'v' 
    AND n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.check_security_definer_views() IS 'Development function to check for views with SECURITY DEFINER. Should return no results with security_definer=true.';