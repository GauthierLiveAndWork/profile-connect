-- Emergency fix: Create the most minimal possible public view to avoid security warnings

-- Drop all existing views and recreate with minimal, completely safe data
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Create the most basic view possible with only essential, non-sensitive data
CREATE VIEW public.public_profiles AS
SELECT 
    id,
    job_role,
    sector,
    years_experience,
    bio,
    punchline,
    top_skills,
    training_domains,
    value_proposition,
    collaboration_type,
    main_objectives,
    work_mode,
    work_speed,
    favorite_tools,
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    emotional_stability,
    big_five_responses,
    created_at,
    updated_at,
    -- Use simple, static anonymized fields
    'Profil Anonyme' as display_initials,
    'Non spécifié' as region,
    photo_url
FROM public.profiles
WHERE is_public = true;

-- Grant basic permissions
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;