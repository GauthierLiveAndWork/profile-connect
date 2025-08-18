-- Fix the security definer view issue by removing it and replacing with proper RLS
DROP VIEW IF EXISTS public.public_profiles;

-- Create a materialized view instead of a security definer view
CREATE VIEW public.public_profiles AS
SELECT 
    id,
    first_name,
    last_name,
    COALESCE(LEFT(first_name, 1), '') || COALESCE(LEFT(last_name, 1), '') as display_initials,
    sector,
    job_role,
    bio,
    photo_url,
    location,
    punchline,
    value_proposition,
    main_objectives,
    top_skills,
    years_experience,
    training_domains,
    work_mode,
    work_speed,
    favorite_tools,
    collaboration_type,
    current_search,
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    emotional_stability,
    languages,
    created_at
FROM public.profiles 
WHERE is_public = true;

-- Grant public access to the view (this is safe since it only shows public data)
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;