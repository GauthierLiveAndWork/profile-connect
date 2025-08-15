-- Remove the unique constraint on email to allow multiple NULL values
-- and empty emails, while still preventing duplicate non-empty emails
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_key;

-- Add a new unique constraint that allows multiple NULL values but prevents duplicate non-null emails
CREATE UNIQUE INDEX profiles_email_unique_idx ON public.profiles (email) WHERE email IS NOT NULL AND email != '';

-- Make email column nullable if it isn't already
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;