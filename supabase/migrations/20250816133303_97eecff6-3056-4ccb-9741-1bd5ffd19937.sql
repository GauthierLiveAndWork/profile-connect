-- FINAL SECURITY FIX: Remove anonymous access to profiles table entirely
-- Anonymous users should only access the secure public_profiles view

-- Drop the policy that allows anonymous access to profiles table
DROP POLICY IF EXISTS "Anonymous can view public profiles with app-level filtering" ON public.profiles;

-- Ensure anonymous users cannot access the profiles table directly
-- They should only use the public_profiles view which excludes sensitive data
-- No policy for anonymous users = no access to the table

-- Double check that authenticated users can still access their data
-- (These policies should already exist)
CREATE POLICY IF NOT EXISTS "Users can view their own profile" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Authenticated users can view public profiles fully" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (is_public = true AND auth.uid() IS NOT NULL);