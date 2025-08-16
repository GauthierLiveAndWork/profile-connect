-- Fix the error: Drop the view correctly and implement security fixes

-- 1. Drop the existing view (not materialized view)
DROP VIEW IF EXISTS public.public_profiles;

-- 2. Drop any remaining functions from previous migration
DROP FUNCTION IF EXISTS public.refresh_public_profiles();
DROP FUNCTION IF EXISTS public.trigger_refresh_public_profiles();

-- 3. Drop any remaining triggers
DROP TRIGGER IF EXISTS refresh_public_profiles_on_insert ON public.profiles;
DROP TRIGGER IF EXISTS refresh_public_profiles_on_update ON public.profiles;
DROP TRIGGER IF EXISTS refresh_public_profiles_on_delete ON public.profiles;

-- 4. Create a secure view that excludes ALL sensitive data (email, linkedin_profile, professional_references)
CREATE VIEW public.public_profiles AS
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

-- 5. Enable RLS on the view for additional security
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- 6. Grant controlled access
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- 7. Fix the profiles table RLS policy - drop the problematic policy
DROP POLICY IF EXISTS "Public profiles viewable without sensitive data" ON public.profiles;

-- 8. Create new secure policies for the profiles table
-- Policy for anonymous users (very restrictive - should use public_profiles view instead)
CREATE POLICY "Anonymous users must use public_profiles view" 
ON public.profiles 
FOR SELECT 
USING (false); -- Block all direct anonymous access to force use of public_profiles view

-- 9. Policy for authenticated users to view public profiles
CREATE POLICY "Authenticated users can view public profiles" 
ON public.profiles 
FOR SELECT 
USING (
    is_public = true 
    AND auth.uid() IS NOT NULL
);

-- 10. Add security comment
COMMENT ON VIEW public.public_profiles IS 'Secure view for public profiles that excludes sensitive data like email, linkedin_profile, and professional_references. All users should use this view for public profile access.';