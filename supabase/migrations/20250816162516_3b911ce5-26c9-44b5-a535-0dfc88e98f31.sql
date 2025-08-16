-- Final security fix: Update all functions to have secure search_path

-- Fix all public functions to have secure search_path
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';
ALTER FUNCTION public.is_admin_user() SET search_path = 'public';
ALTER FUNCTION public.verify_view_security() SET search_path = 'public';
ALTER FUNCTION public.check_security_definer_views() SET search_path = 'public';
ALTER FUNCTION public.check_email_exposure() SET search_path = 'public';
ALTER FUNCTION public.get_public_profile_with_names(uuid) SET search_path = 'public';
ALTER FUNCTION public.verify_public_data_safety() SET search_path = 'public';

-- Grant usage on schema to authenticated users for the public_profiles view
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- Ensure the view is accessible to public users
COMMENT ON VIEW public.public_profiles IS 'Secure public view of profiles - no personal data exposed, accessible to all users.';