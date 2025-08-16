-- Enable Row Level Security on public_profiles table
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can view public profiles
CREATE POLICY "Authenticated users can view public profiles" 
ON public.public_profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Policy: Admins can view all profiles in public_profiles view
CREATE POLICY "Admins can view all public profiles" 
ON public.public_profiles 
FOR SELECT 
USING (is_admin_user());

-- Note: Since public_profiles appears to be a view of the profiles table,
-- we should restrict it to only show truly public profiles
-- Add constraint to only show profiles where is_public = true
CREATE POLICY "Only show profiles marked as public" 
ON public.public_profiles 
FOR SELECT 
USING (is_public = true);