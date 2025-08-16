-- Solution finale : supprimer la vue publique et créer des politiques RLS directes

-- Supprimer complètement la vue problématique
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Créer une politique RLS pour permettre l'accès public aux profils publics
-- sans utiliser de vue qui cause des problèmes de sécurité
CREATE POLICY "Allow public access to public profiles" 
ON public.profiles 
FOR SELECT 
TO anon, authenticated
USING (is_public = true);

-- S'assurer que la table profiles a RLS activé
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Mettre à jour le composant frontend pour qu'il utilise directement la table profiles
-- au lieu de la vue public_profiles problématique