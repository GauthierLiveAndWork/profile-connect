-- Enable Row Level Security on public_profiles table
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public access to public profiles for anonymous users
-- This allows anyone (even unauthenticated) to view profiles marked as public
CREATE POLICY "Anonymous users can view public profiles"
ON public.public_profiles
FOR SELECT
TO anon
USING (is_public = true);

-- Policy 2: Allow authenticated users to view public profiles
-- This allows authenticated users to view profiles marked as public
CREATE POLICY "Authenticated users can view public profiles"
ON public.public_profiles
FOR SELECT
TO authenticated
USING (is_public = true);

-- Policy 3: Allow admins to view all public profiles
-- This allows admin users to view all profiles in the public_profiles table
CREATE POLICY "Admins can view all public profiles"
ON public.public_profiles
FOR SELECT
TO authenticated
USING (is_admin_user());