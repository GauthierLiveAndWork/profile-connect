-- Drop the existing public_profiles view if it exists
DROP VIEW IF EXISTS public.public_profiles;

-- Create a secure view that only shows public profiles to authenticated users
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
  current_search,
  collaboration_type,
  main_objectives,
  languages,
  current_projects,
  extraversion,
  agreeableness,
  conscientiousness,
  emotional_stability,
  openness,
  big_five_responses,
  is_public,
  created_at,
  updated_at
FROM public.profiles 
WHERE is_public = true 
  AND (auth.uid() IS NOT NULL OR is_admin_user());