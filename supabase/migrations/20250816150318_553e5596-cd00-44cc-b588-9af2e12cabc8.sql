-- Refresh schema cache and ensure table structure is correct
-- This migration fixes the role_title column cache issue

-- First, let's make sure the profiles table structure is correct
-- by explicitly refreshing the schema cache

-- Force a schema refresh by updating the table comment
COMMENT ON TABLE public.profiles IS 'User profiles with Big Five personality data - Updated 2025-08-16';

-- Notify PostgREST to reload the schema
NOTIFY pgrst, 'reload schema';