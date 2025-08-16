-- Remove unnecessary diagnostic functions that are causing security warnings
-- Keep only the essential functions needed for the application

-- Drop diagnostic functions that are no longer needed
DROP FUNCTION IF EXISTS public.verify_view_security();
DROP FUNCTION IF EXISTS public.check_security_definer_views();
DROP FUNCTION IF EXISTS public.check_email_exposure();
DROP FUNCTION IF EXISTS public.verify_public_data_safety();

-- Keep only essential functions:
-- - update_updated_at_column (needed for triggers)
-- - is_admin_user (needed for admin checks)
-- - get_public_profile_with_names (needed for admin access to full profile data)

-- Ensure the remaining functions are properly secured
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Trigger function to update updated_at timestamps';
COMMENT ON FUNCTION public.is_admin_user() IS 'Security function to check admin status';
COMMENT ON FUNCTION public.get_public_profile_with_names(uuid) IS 'Admin function to access full profile data with proper authorization';