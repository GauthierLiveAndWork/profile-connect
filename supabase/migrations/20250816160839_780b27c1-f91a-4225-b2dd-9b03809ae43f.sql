-- Fix Function Search Path Mutable warnings

-- 1. Update verify_view_security function to set search_path
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

-- 2. Update check_security_definer_views function to set search_path  
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

COMMENT ON FUNCTION public.check_security_definer_views() IS 'Development function to check for views with SECURITY DEFINER. Should return no results with security_definer=true. Updated with SET search_path for security.';

COMMENT ON FUNCTION public.verify_view_security() IS 'Diagnostic function to verify view security settings including security_invoker and security_barrier options. Updated with SET search_path for security.';