-- Add new columns to profiles table for complete profile
ALTER TABLE public.profiles 
ADD COLUMN location text,
ADD COLUMN bio text,
ADD COLUMN favorite_quote text,
ADD COLUMN punchline text,
ADD COLUMN offer_tags text[] DEFAULT '{}',
ADD COLUMN search_tags text[] DEFAULT '{}',
ADD COLUMN current_projects text,
ADD COLUMN sector_badges text[] DEFAULT '{}',
ADD COLUMN community_badges text[] DEFAULT '{}',
ADD COLUMN core_values text[] DEFAULT '{}',
ADD COLUMN vision text,
ADD COLUMN work_style_details text,
ADD COLUMN work_rhythm_details text;