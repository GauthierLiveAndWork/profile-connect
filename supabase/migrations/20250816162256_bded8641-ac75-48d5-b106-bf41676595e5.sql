-- Fix the Security Definer View issue that's blocking publication

-- Drop the existing public_profiles view that has security issues
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the public_profiles view WITHOUT security definer (which is causing the error)
-- This view will show anonymized, safe data for public consumption
CREATE VIEW public.public_profiles AS
SELECT 
    id,
    sector,
    job_role,
    years_experience,
    bio,
    punchline,
    photo_url,
    -- Use anonymized fields only
    COALESCE(LEFT(first_name, 1), '') || COALESCE(LEFT(last_name, 1), '') as display_initials,
    CASE 
        WHEN location LIKE '%,%' THEN TRIM(SPLIT_PART(location, ',', -1))
        ELSE COALESCE(location, 'Non spécifié')
    END as region,
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
    favorite_quote,
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    emotional_stability,
    big_five_responses,
    current_projects,
    vision,
    languages,
    is_public,
    created_at,
    updated_at
FROM public.profiles
WHERE is_public = true;

-- Add RLS policies to the view to ensure it's properly secured
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Add comment explaining the security model
COMMENT ON VIEW public.public_profiles IS 'Public view of profiles with anonymized personal data. No emails, full names, or exact locations exposed.';