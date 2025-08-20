-- Corriger le problème Security Definer View
-- Le problème vient probablement de la vue public_profiles ou d'une fonction

-- 1. Supprimer la fonction problématique get_public_profile_with_names 
DROP FUNCTION IF EXISTS public.get_public_profile_with_names(uuid);

-- 2. Recréer la vue public_profiles sans SECURITY DEFINER
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
SELECT 
    p.id,
    p.first_name,
    p.last_name,
    COALESCE(LEFT(p.first_name, 1), '') || COALESCE(LEFT(p.last_name, 1), '') as display_initials,
    p.sector,
    p.job_role,
    p.bio,
    p.photo_url,
    p.location,
    p.punchline,
    p.value_proposition,
    p.main_objectives,
    p.top_skills,
    p.years_experience,
    p.training_domains,
    p.work_mode,
    p.work_speed,
    p.favorite_tools,
    p.collaboration_type,
    p.current_search,
    p.languages,
    p.extraversion,
    p.openness,
    p.conscientiousness,
    p.agreeableness,
    p.emotional_stability,
    p.created_at
FROM public.profiles p
WHERE p.is_public = true;

-- 3. Ajouter des politiques RLS appropriées pour la vue
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- 4. Permettre l'accès public en lecture seule aux profils publics
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 5. Créer une fonction sécurisée pour obtenir les profils publics spécifiques si nécessaire
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
SECURITY INVOKER  -- Utilise les permissions de l'appelant, pas du créateur
STABLE
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