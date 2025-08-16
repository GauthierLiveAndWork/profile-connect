-- FINAL SECURITY FIX: Remove anonymous access to profiles table entirely
-- Anonymous users should only access the secure public_profiles view

-- Drop the policy that allows anonymous access to profiles table
DROP POLICY IF EXISTS "Anonymous can view public profiles with app-level filtering" ON public.profiles;

-- No policy for anonymous users = no access to the profiles table
-- Anonymous users should use the public_profiles view which excludes sensitive data

-- The following policies for authenticated users should already exist, but let's ensure they're in place
-- (We'll drop and recreate to be sure)

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can view public profiles fully" ON public.profiles;
CREATE POLICY "Authenticated users can view public profiles fully" 
ON public.profiles
FOR SELECT 
TO authenticated
USING (is_public = true AND auth.uid() IS NOT NULL);