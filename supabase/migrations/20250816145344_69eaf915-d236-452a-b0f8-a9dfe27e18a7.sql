-- Fix the security definer issue with public_profiles view
-- Drop the existing public_profiles view
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate the view without SECURITY DEFINER to properly respect RLS policies
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
FROM public.profiles
WHERE is_public = true;