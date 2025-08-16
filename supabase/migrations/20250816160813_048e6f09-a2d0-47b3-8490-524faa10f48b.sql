-- Fix Security Definer View Issue: Recreate public_profiles with proper security invoker behavior

-- 1. Drop the existing view that runs with postgres superuser privileges
DROP VIEW IF EXISTS public.public_profiles;

-- 2. Check if we're on Postgres 15+ and create a secure view
-- For Postgres 15+, we can use security_invoker = true
-- For older versions, we need different approaches

-- 3. Create the view with security_invoker = true (for Postgres 15+)
-- This ensures the view uses the invoker's permissions, not the definer's
CREATE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT 
    id,
    first_name,
    last_name,
    photo_url,
    sector,
    job_role,
    years_experience,
    top_skills,
    training_domains,
    value_proposition,
    current_search,
    collaboration_type,
    main_objectives,
    work_mode,
    work_speed,
    work_style_details,
    work_rhythm_details,
    favorite_tools,
    offer_tags,
    search_tags,
    sector_badges,
    community_badges,
    core_values,
    bio,
    location,
    punchline,
    favorite_quote,
    vision,
    current_projects,
    languages,
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    emotional_stability,
    big_five_responses,
    is_public,
    created_at,
    updated_at
FROM profiles
WHERE is_public = true;

-- 4. Keep the security_barrier setting for additional protection
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- 5. Grant appropriate permissions
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- 6. Add comprehensive security comment
COMMENT ON VIEW public.public_profiles IS 'Secure public profiles view with security_invoker=true to respect RLS policies of the underlying profiles table. Excludes sensitive data (email, linkedin_profile, professional_references). Uses security_barrier=true for additional protection against information leakage through query optimization.';

-- 7. Verify the view owner and settings by creating a diagnostic function
CREATE OR REPLACE FUNCTION public.verify_view_security()
RETURNS TABLE(
    view_name text,
    view_owner text,
    has_security_invoker boolean,
    has_security_barrier boolean
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;