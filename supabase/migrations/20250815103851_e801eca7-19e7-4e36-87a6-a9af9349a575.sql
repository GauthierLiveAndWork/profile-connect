-- Make optional fields nullable to match the form interface
ALTER TABLE public.profiles 
ALTER COLUMN languages DROP NOT NULL,
ALTER COLUMN offer_tags DROP NOT NULL,
ALTER COLUMN search_tags DROP NOT NULL,
ALTER COLUMN sector_badges DROP NOT NULL,
ALTER COLUMN community_badges DROP NOT NULL,
ALTER COLUMN core_values DROP NOT NULL;

-- Set default empty arrays for array fields
ALTER TABLE public.profiles 
ALTER COLUMN offer_tags SET DEFAULT '{}',
ALTER COLUMN search_tags SET DEFAULT '{}',
ALTER COLUMN sector_badges SET DEFAULT '{}',
ALTER COLUMN community_badges SET DEFAULT '{}',
ALTER COLUMN core_values SET DEFAULT '{}';