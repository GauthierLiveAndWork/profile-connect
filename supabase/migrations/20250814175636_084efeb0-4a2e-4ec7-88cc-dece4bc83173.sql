-- First, create a new column with jsonb type
ALTER TABLE public.profiles ADD COLUMN languages_new jsonb DEFAULT '[]'::jsonb;

-- Convert existing text[] data to jsonb format
UPDATE public.profiles 
SET languages_new = (
  SELECT jsonb_agg(jsonb_build_object('language', lang, 'level', ''))
  FROM unnest(languages) AS lang
) 
WHERE languages IS NOT NULL AND array_length(languages, 1) > 0;

-- Drop the old column and rename the new one
ALTER TABLE public.profiles DROP COLUMN languages;
ALTER TABLE public.profiles RENAME COLUMN languages_new TO languages;