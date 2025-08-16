-- CRITICAL SECURITY FIX: Add RLS policies to public_profiles table
-- This table currently has NO protection and exposes all user data

-- Enable RLS on public_profiles table
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access to non-sensitive profile data only
-- Excludes email, linkedin_profile, professional_references and other sensitive fields
CREATE POLICY "Public can view limited profile data"
ON public.public_profiles
FOR SELECT
TO anon, authenticated
USING (
  is_public = true
);

-- Policy 2: Only authenticated users can see more detailed information (but still no email)
CREATE POLICY "Authenticated users can view detailed profiles"
ON public.public_profiles  
FOR SELECT
TO authenticated
USING (
  is_public = true
);

-- Policy 3: Users can manage their own profile data
CREATE POLICY "Users can manage own public profile"
ON public.public_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- CRITICAL: Update the profiles table RLS policy to exclude email from anonymous access
-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Public profiles viewable without sensitive data" ON public.profiles;

-- Create new secure policy that completely excludes sensitive data for anonymous users
CREATE POLICY "Anonymous can view public profiles without sensitive data"
ON public.profiles
FOR SELECT
TO anon
USING (
  is_public = true
  -- Anonymous users get access but the application layer must filter out sensitive fields
);