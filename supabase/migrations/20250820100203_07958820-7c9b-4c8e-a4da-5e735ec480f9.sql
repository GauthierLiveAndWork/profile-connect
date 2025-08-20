-- Corriger les fonctions avec SECURITY DEFINER problématiques

-- 1. Corriger la fonction update_updated_at_column pour qu'elle soit plus sécurisée
-- Cette fonction est OK en SECURITY DEFINER car elle ne fait que mettre à jour un timestamp
-- Mais ajoutons des vérifications de sécurité

-- 2. La fonction is_admin_user est plus problématique car elle donne accès aux données
-- Recreons-la avec des vérifications plus strictes
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    user_email text;
    is_admin boolean := false;
BEGIN
    -- Vérifier que nous avons un utilisateur authentifié
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;
    
    -- Obtenir l'email de l'utilisateur authentifié de manière sécurisée
    SELECT current_setting('request.jwt.claims', true)::json->>'email' INTO user_email;
    
    -- Vérifier si cet email est dans la table admin_roles
    -- avec une requête limitée et sécurisée
    SELECT EXISTS (
        SELECT 1 FROM public.admin_roles ar 
        WHERE ar.email = user_email 
        LIMIT 1  -- Limiter à 1 résultat pour la performance
    ) INTO is_admin;
    
    RETURN COALESCE(is_admin, false);
END;
$function$;

-- 3. Alternativement, créons une version SECURITY INVOKER plus sécurisée
CREATE OR REPLACE FUNCTION public.is_admin_user_safe()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY INVOKER  -- Utilise les permissions de l'appelant
SET search_path TO 'public'
AS $function$
DECLARE
    user_email text;
    is_admin boolean := false;
BEGIN
    -- Vérifier que nous avons un utilisateur authentifié
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;
    
    -- Obtenir l'email de l'utilisateur authentifié
    SELECT current_setting('request.jwt.claims', true)::json->>'email' INTO user_email;
    
    -- Cette requête utilisera les politiques RLS de admin_roles
    SELECT EXISTS (
        SELECT 1 FROM public.admin_roles ar 
        WHERE ar.email = user_email 
        LIMIT 1
    ) INTO is_admin;
    
    RETURN COALESCE(is_admin, false);
EXCEPTION
    WHEN OTHERS THEN
        -- En cas d'erreur, retourner false par sécurité
        RETURN false;
END;
$function$;

-- 4. Mettre à jour les politiques pour utiliser la fonction sécurisée
-- Remplacer is_admin_user() par is_admin_user_safe() dans les politiques si nécessaire