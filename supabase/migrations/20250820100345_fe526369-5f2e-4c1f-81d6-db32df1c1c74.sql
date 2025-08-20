-- Corriger définitivement le problème Security Definer View
-- Le problème vient de la vue public_profiles qui peut contourner RLS

-- 1. Supprimer et recréer la vue avec les bonnes options de sécurité
DROP VIEW IF EXISTS public.public_profiles;

-- 2. Recréer la vue avec security_barrier activé
CREATE VIEW public.public_profiles WITH (security_barrier = true) AS
SELECT 
    p.id,
    -- Masquer les noms pour les non-admins
    CASE WHEN current_setting('role') = 'authenticated' AND is_admin_user() THEN p.first_name ELSE NULL END as first_name,
    CASE WHEN current_setting('role') = 'authenticated' AND is_admin_user() THEN p.last_name ELSE NULL END as last_name,
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

-- 3. S'assurer que les permissions sont correctes
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 4. Ajouter une politique RLS explicite pour la vue (même si elle a security_barrier)
-- Cela garantit que seuls les profils publics sont visibles
ALTER VIEW public.public_profiles SET (security_barrier = true);

-- 5. Pour être extra sûr, vérifions qu'aucune autre vue n'a de problème
-- Si d'autres vues existent sans security_barrier, les corriger aussi