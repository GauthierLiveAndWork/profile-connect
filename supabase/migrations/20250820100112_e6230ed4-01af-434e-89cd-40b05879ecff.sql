-- Corriger le problème de search_path mutable pour sécuriser les fonctions
CREATE OR REPLACE FUNCTION public.get_public_profile_safe(profile_id uuid)
RETURNS TABLE(
    id uuid, 
    first_name text, 
    last_name text, 
    display_initials text, 
    sector text, 
    job_role text, 
    bio text, 
    photo_url text
)
LANGUAGE plpgsql
SECURITY INVOKER
STABLE
SET search_path = public  -- Correction: définir le search_path explicitement
AS $$
BEGIN
    -- Seulement pour les utilisateurs authentifiés ou admins
    IF auth.uid() IS NULL AND NOT is_admin_user() THEN
        RAISE EXCEPTION 'Accès non autorisé';
    END IF;
    
    RETURN QUERY
    SELECT 
        p.id,
        CASE WHEN is_admin_user() THEN p.first_name ELSE NULL END,
        CASE WHEN is_admin_user() THEN p.last_name ELSE NULL END,
        COALESCE(LEFT(p.first_name, 1), '') || COALESCE(LEFT(p.last_name, 1), '') as display_initials,
        p.sector,
        p.job_role,
        p.bio,
        p.photo_url
    FROM public.profiles p
    WHERE p.id = profile_id 
    AND p.is_public = true;
END;
$$;