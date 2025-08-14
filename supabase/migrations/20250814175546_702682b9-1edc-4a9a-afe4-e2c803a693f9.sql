-- Change languages column from text[] to jsonb to support language objects with levels
ALTER TABLE public.profiles 
ALTER COLUMN languages TYPE jsonb USING languages::jsonb;