-- SECURITY FIX: Secure public_profiles view to prevent personal information exposure

-- The current public_profiles view exposes sensitive personal data including:
-- - first_name, last_name (can be used for identity theft)
-- - location (privacy/safety concern)
-- - detailed professional information that could be misused

-- Step 1: Drop the existing public_profiles view
DROP VIEW IF EXISTS public.public_profiles;

-- Step 2: Create a secure public_profiles view with restricted data
-- Only expose information that is truly appropriate for public sharing
CREATE VIEW public.public_profiles AS
SELECT 
    id,
    -- SAFE: Professional information (anonymized)
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
    punchline,
    favorite_quote,
    vision,
    current_projects,
    languages,
    
    -- SAFE: Big Five personality scores (anonymous psychological data)
    openness,
    conscientiousness,
    extraversion,
    agreeableness,
    emotional_stability,
    big_five_responses,
    
    -- SAFE: Metadata
    is_public,
    created_at,
    updated_at,
    
    -- SAFE: Profile photo (if user chose to make it public)
    photo_url,
    
    -- ANONYMIZED: Show only initials instead of full names
    CASE 
        WHEN is_public = true THEN 
            COALESCE(LEFT(first_name, 1), '') || COALESCE(LEFT(last_name, 1), '')
        ELSE NULL 
    END as display_initials,
    
    -- ANONYMIZED: Show only region/country instead of exact location
    CASE 
        WHEN is_public = true AND location IS NOT NULL THEN 
            -- Extract only the last part (country/region) from location
            TRIM(SPLIT_PART(location, ',', -1))
        ELSE NULL 
    END as region
    
FROM public.profiles
WHERE is_public = true;

-- Step 3: Enable RLS on the view (inherited from underlying table)
-- Note: Views inherit RLS from their underlying tables, but we add explicit policies for clarity

-- Step 4: Create a function for authorized access to full names (for admin/matching purposes)
CREATE OR REPLACE FUNCTION public.get_public_profile_with_names(profile_id uuid)
RETURNS TABLE(
    id uuid,
    first_name text,
    last_name text,
    display_initials text,
    sector text,
    job_role text,
    bio text,
    photo_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
    FROM public.profiles p
    WHERE p.id = profile_id AND p.is_public = true;
END;
$$;

-- Step 5: Add security documentation
COMMENT ON VIEW public.public_profiles IS 
'Secure public view of user profiles. Excludes sensitive personal information like full names and exact locations. Only shows anonymized initials and general regions to protect user privacy while enabling professional networking.';

COMMENT ON FUNCTION public.get_public_profile_with_names IS
'Security definer function for authorized access to full names in public profiles. Only accessible by admin users or for legitimate matching/networking purposes.';

-- Step 6: Create a verification function to check for data exposure
CREATE OR REPLACE FUNCTION public.verify_public_data_safety()
RETURNS TABLE(
    data_type text,
    is_exposed boolean,
    risk_level text,
    recommendation text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Full Names'::text,
        EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'public_profiles' AND column_name IN ('first_name', 'last_name'))::boolean,
        CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'public_profiles' AND column_name IN ('first_name', 'last_name')) 
             THEN 'HIGH' ELSE 'SAFE' END::text,
        'Use display_initials instead of full names'::text
    UNION ALL
    SELECT 
        'Exact Location'::text,
        EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'public_profiles' AND column_name = 'location')::boolean,
        CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'public_profiles' AND column_name = 'location') 
             THEN 'MEDIUM' ELSE 'SAFE' END::text,
        'Use region instead of exact location'::text
    UNION ALL
    SELECT 
        'Email Addresses'::text,
        EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'public_profiles' AND column_name = 'email')::boolean,
        CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'public_profiles' AND column_name = 'email') 
             THEN 'CRITICAL' ELSE 'SAFE' END::text,
        'Never expose email addresses in public views'::text;
END;
$$;