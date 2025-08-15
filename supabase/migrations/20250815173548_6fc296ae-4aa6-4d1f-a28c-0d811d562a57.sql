-- Fix the is_admin_user function to include proper search_path
CREATE OR REPLACE FUNCTION public.is_admin_user()
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles ar 
    WHERE ar.email = current_setting('request.jwt.claims', true)::json->>'email'
  );
END;
$function$;