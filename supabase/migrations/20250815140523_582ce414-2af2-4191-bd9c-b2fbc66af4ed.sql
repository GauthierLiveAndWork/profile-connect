-- First, add a field to control profile visibility
ALTER TABLE public.profiles ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Drop the overly permissive policy
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;

-- Create proper RLS policies for profile access
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

-- Allow viewing of profiles that are explicitly marked as public
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (is_public = true);

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles ar 
    WHERE ar.email = current_setting('request.jwt.claims', true)::json->>'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.is_admin_user());

-- Update existing profiles to be public (to maintain current sharing functionality)
-- This ensures current shared profiles continue to work
UPDATE public.profiles SET is_public = true;