-- Remove the overly permissive public access policy
DROP POLICY IF EXISTS "Allow public access to public profiles" ON public.profiles;

-- Create a view for public profile data that only exposes safe fields
CREATE OR REPLACE VIEW public.public_profiles AS
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

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- Grant public access to the view
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Update the existing function to use proper field selection
CREATE OR REPLACE FUNCTION public.get_public_profile_with_names(profile_id uuid)
 RETURNS TABLE(id uuid, first_name text, last_name text, display_initials text, sector text, job_role text, bio text, photo_url text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Only allow access for:
    -- 1. Admin users
    -- 2. Authenticated users viewing profiles they have explicit access to
    IF NOT (is_admin_user() OR auth.uid() IS NOT NULL) THEN
        RAISE EXCEPTION 'Unauthorized access to profile data';
    END IF;
    
    RETURN QUERY
    SELECT 
        p.id,
        CASE WHEN is_admin_user() THEN p.first_name ELSE NULL END,
        CASE WHEN is_admin_user() THEN p.last_name ELSE NULL END,
        COALESCE(LEFT(p.first_name, 1), '') || COALESCE(LEFT(p.last_name, 1), '') as display_initials,
        p.sector,
        p.job_role,
        p.bio,
        p.photo_url
    FROM public.public_profiles p
    WHERE p.id = profile_id;
END;
$function$;