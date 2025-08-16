-- Fix the security definer view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_profiles;

-- Create the view without SECURITY DEFINER to fix the linter warning
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

-- Enable RLS on the view 
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;