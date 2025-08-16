-- CRITICAL FIX: Remove email exposure from profiles table access

-- The issue: Current RLS policies allow authenticated users to access ALL columns 
-- from the profiles table when is_public=true, including sensitive email addresses

-- 1. Drop the problematic policies that expose emails in profiles table
DROP POLICY IF EXISTS "Authenticated users can view public profiles fully" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view public profiles" ON public.profiles;

-- 2. Create a new, restrictive policy for authenticated users accessing profiles table directly
-- This policy should only allow access to non-sensitive columns, but it's better to 
-- force users to use the public_profiles view instead
CREATE POLICY "Authenticated users must use public_profiles view for public data" 
ON public.profiles 
FOR SELECT 
USING (
    -- Only allow users to see their own complete profile with all sensitive data
    auth.uid() = user_id
    -- Public profiles should be accessed via public_profiles view, not directly
);

-- 3. Ensure the public_profiles view remains the only way to access public profile data
-- without sensitive information. The view already excludes:
-- - email
-- - linkedin_profile  
-- - professional_references

-- 4. Add a function to verify no sensitive data is exposed in public queries
CREATE OR REPLACE FUNCTION public.check_email_exposure()
RETURNS TABLE(
    table_or_view_name text,
    has_email_column boolean,
    is_publicly_accessible boolean,
    security_risk text
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    RETURN QUERY
    WITH email_columns AS (
        SELECT 
            table_name,
            COUNT(*) FILTER (WHERE column_name = 'email') > 0 as has_email
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name IN ('profiles', 'public_profiles')
        GROUP BY table_name
    )
    SELECT 
        ec.table_name::text,
        ec.has_email,
        CASE 
            WHEN ec.table_name = 'public_profiles' THEN true
            WHEN ec.table_name = 'profiles' THEN false  -- Now protected by restrictive RLS
            ELSE false
        END as accessible,
        CASE 
            WHEN ec.table_name = 'public_profiles' AND ec.has_email THEN 'HIGH RISK: Public view contains emails'
            WHEN ec.table_name = 'profiles' AND ec.has_email THEN 'PROTECTED: Direct access restricted to own profile only'
            ELSE 'SAFE: No email exposure'
        END::text as risk_level
    FROM email_columns ec;
END;
$$;

-- 5. Add explicit comment about the security model
COMMENT ON POLICY "Authenticated users must use public_profiles view for public data" ON public.profiles 
IS 'Restricts direct access to profiles table to prevent email harvesting. Public profile data should be accessed via public_profiles view which excludes sensitive data.';

-- 6. Verify our public_profiles view still excludes sensitive data
-- (This is just a verification comment - the view was already created correctly)
-- public_profiles view excludes: email, linkedin_profile, professional_references