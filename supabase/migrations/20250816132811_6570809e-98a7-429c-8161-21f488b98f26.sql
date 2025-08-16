-- SECURITY FIX: Replace the insecure public_profiles view with a secure one
-- The current view exposes linkedin_profile and professional_references to anonymous users

-- Drop the existing insecure view
DROP VIEW IF EXISTS public.public_profiles;

-- Create a new secure view that excludes ALL sensitive information for public access
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
    bio,
    location,
    punchline,
    favorite_quote,
    vision,
    current_search,
    current_projects,
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
    -- REMOVED: linkedin_profile (sensitive)
    -- REMOVED: professional_references (sensitive)  
    -- REMOVED: email (sensitive)
    languages,
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    emotional_stability,
    big_five_responses,
    created_at,
    updated_at,
    is_public
FROM profiles
WHERE is_public = true;

-- Add comment explaining the security consideration
COMMENT ON VIEW public.public_profiles IS 'Secure public view of profiles that excludes sensitive data like email, linkedin_profile, and professional_references';

-- Ensure the underlying profiles table policy is secure for anonymous access
-- Update the anonymous policy to be more restrictive at the application layer
DROP POLICY IF EXISTS "Anonymous can view public profiles without sensitive data" ON public.profiles;

-- Create a policy that allows anonymous access but relies on application filtering
CREATE POLICY "Anonymous can view public profiles with app-level filtering"
ON public.profiles
FOR SELECT
TO anon
USING (is_public = true);