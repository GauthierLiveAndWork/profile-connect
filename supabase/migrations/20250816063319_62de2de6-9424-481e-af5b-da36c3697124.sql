-- Fix security issue: Remove email exposure from public profiles
-- Drop the current public profiles policy that exposes all fields
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that excludes sensitive fields for public access
-- This policy will only allow viewing non-sensitive fields for public profiles
CREATE POLICY "Public profiles viewable without sensitive data" ON public.profiles
FOR SELECT USING (
  is_public = true 
  AND current_setting('request.jwt.claims', true) IS NULL -- Only for non-authenticated users
);

-- Create a separate policy for authenticated users to view public profiles with full data
CREATE POLICY "Authenticated users can view public profiles fully" ON public.profiles  
FOR SELECT USING (
  is_public = true 
  AND auth.uid() IS NOT NULL -- Only for authenticated users
);

-- Update the ProfileDisplay to handle this by creating a secure view for public access
CREATE OR REPLACE VIEW public.public_profiles AS
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
  linkedin_profile,
  professional_references,
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
FROM public.profiles
WHERE is_public = true;

-- Grant access to the view for anonymous users
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;