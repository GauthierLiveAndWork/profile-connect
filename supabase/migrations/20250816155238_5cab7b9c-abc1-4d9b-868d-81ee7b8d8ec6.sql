-- Fix public_profiles security issue by converting to proper materialized view

-- First, drop the existing view
DROP VIEW IF EXISTS public.public_profiles;

-- Create a materialized view instead with security_invoker
CREATE MATERIALIZED VIEW public.public_profiles
WITH (security_invoker = true)
AS
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

-- Grant access to authenticated and anonymous users
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION public.refresh_public_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW public.public_profiles;
END;
$$;

-- Create trigger to refresh materialized view when profiles are updated
CREATE OR REPLACE FUNCTION public.trigger_refresh_public_profiles()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM public.refresh_public_profiles();
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers on profiles table
CREATE TRIGGER refresh_public_profiles_on_insert
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_refresh_public_profiles();

CREATE TRIGGER refresh_public_profiles_on_update
    AFTER UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_refresh_public_profiles();

CREATE TRIGGER refresh_public_profiles_on_delete
    AFTER DELETE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_refresh_public_profiles();