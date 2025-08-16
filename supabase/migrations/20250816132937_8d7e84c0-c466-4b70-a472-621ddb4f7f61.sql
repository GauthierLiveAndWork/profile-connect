-- Fix the Security Definer View issue by recreating the view properly
-- The current view was flagged as having security definer issues

DROP VIEW IF EXISTS public.public_profiles;

-- Create a simple view without security definer that just filters data
-- This view inherits the RLS policies from the underlying profiles table
CREATE VIEW public.public_profiles 
WITH (security_invoker=true) AS 
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
    -- EXCLUDED: email, linkedin_profile, professional_references
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
COMMENT ON VIEW public.public_profiles IS 'Public view of profiles that excludes sensitive data. Uses security_invoker to inherit caller permissions.';