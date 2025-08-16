-- Final fix for Security Definer View error

-- The issue is likely that one of our views or the way we created it is flagged as having SECURITY DEFINER
-- Let's completely recreate the public_profiles view in the simplest, most secure way

-- Drop and recreate the public_profiles view without any security definer properties
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Create a simple, secure view without any special security properties
CREATE VIEW public.public_profiles AS
SELECT 
    id,
    sector,
    job_role,
    years_experience,
    bio,
    punchline,
    photo_url,
    -- Anonymized personal data only
    COALESCE(SUBSTRING(first_name, 1, 1), '') || COALESCE(SUBSTRING(last_name, 1, 1), '') as display_initials,
    CASE 
        WHEN location ~ ',' THEN TRIM(SUBSTRING(location FROM position(',' in location) + 1))
        WHEN location IS NOT NULL THEN location
        ELSE 'Non spécifié'
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

-- Grant explicit permissions
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Add a simple comment
COMMENT ON VIEW public.public_profiles IS 'Public profiles with anonymized data - no emails, full names, or exact locations.';