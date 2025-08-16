-- Fix Function Search Path Mutable warning by setting search_path on functions

-- 1. Update existing functions to have explicit search_path
-- Drop and recreate functions with proper search_path

-- Update the admin check function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles ar 
    WHERE ar.email = current_setting('request.jwt.claims', true)::json->>'email'
  );
END;
$$;

-- Update the timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the view verification function
CREATE OR REPLACE FUNCTION public.verify_view_security()
RETURNS TABLE(
    view_name text,
    view_owner text,
    has_security_invoker boolean,
    has_security_barrier boolean
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.relname::text,
        pg_get_userbyid(c.relowner)::text,
        COALESCE(
            (SELECT option_value::boolean 
             FROM pg_options_to_table(c.reloptions) 
             WHERE option_name = 'security_invoker'), 
            false
        ),
        COALESCE(
            (SELECT option_value::boolean 
             FROM pg_options_to_table(c.reloptions) 
             WHERE option_name = 'security_barrier'), 
            false
        )
    FROM pg_class c
    WHERE c.relname = 'public_profiles' 
    AND c.relkind = 'v';
END;
$$;

-- Update the check security definer views function
CREATE OR REPLACE FUNCTION public.check_security_definer_views()
RETURNS TABLE(schema_name text, view_name text, has_security_definer boolean) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- Add comments to all functions for clarity
COMMENT ON FUNCTION public.is_admin_user() IS 'Uses SECURITY DEFINER to check admin status with explicit search_path for security. This is necessary to query admin_roles table with elevated privileges in RLS policies.';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Uses SECURITY DEFINER for trigger functionality with explicit search_path for security. This is standard practice for trigger functions.';
COMMENT ON FUNCTION public.verify_view_security() IS 'Development function to verify view security settings with explicit search_path.';
COMMENT ON FUNCTION public.check_security_definer_views() IS 'Development function to check for views with SECURITY DEFINER with explicit search_path. Should return no results with security_definer=true.';