-- Drop existing table and function
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informations personnelles
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  photo_url TEXT,
  
  -- Informations professionnelles
  sector TEXT NOT NULL,
  job_role TEXT NOT NULL,
  years_experience TEXT NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{}',
  
  -- Compétences et offre
  top_skills TEXT NOT NULL,
  training_domains TEXT NOT NULL,
  value_proposition TEXT NOT NULL,
  
  -- Besoins et objectifs
  current_search TEXT NOT NULL,
  collaboration_type TEXT NOT NULL,
  main_objectives TEXT[] NOT NULL DEFAULT '{}',
  
  -- Préférences de collaboration
  work_mode TEXT NOT NULL,
  work_speed TEXT NOT NULL,
  favorite_tools TEXT[] NOT NULL DEFAULT '{}',
  
  -- Scores Big Five (de 1 à 5)
  openness DECIMAL(3,2) NOT NULL,
  conscientiousness DECIMAL(3,2) NOT NULL,
  extraversion DECIMAL(3,2) NOT NULL,
  agreeableness DECIMAL(3,2) NOT NULL,
  emotional_stability DECIMAL(3,2) NOT NULL,
  
  -- Réponses brutes Big Five (1-5 pour chacune des 10 questions)
  big_five_responses INTEGER[] NOT NULL DEFAULT '{}',
  
  -- Réseau et confiance
  linkedin_profile TEXT,
  professional_references TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies RLS
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour les performances
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_sector ON public.profiles(sector);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);

-- Table pour les matches entre profils
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  profile2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  compatibility_score DECIMAL(3,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(profile1_id, profile2_id)
);

-- RLS pour matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches" 
ON public.matches 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = profile1_id AND auth.uid() = user_id
  ) OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = profile2_id AND auth.uid() = user_id
  )
);

CREATE POLICY "Users can update their own matches" 
ON public.matches 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = profile1_id AND auth.uid() = user_id
  ) OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = profile2_id AND auth.uid() = user_id
  )
);

-- Trigger pour matches updated_at
CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Table pour les messages entre profils matchés
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS pour messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from their matches" 
ON public.messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.profiles p1 ON m.profile1_id = p1.id
    JOIN public.profiles p2 ON m.profile2_id = p2.id
    WHERE m.id = match_id 
    AND (p1.user_id = auth.uid() OR p2.user_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their matches" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = sender_profile_id AND p.user_id = auth.uid()
  ) AND
  EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.profiles p1 ON m.profile1_id = p1.id
    JOIN public.profiles p2 ON m.profile2_id = p2.id
    WHERE m.id = match_id 
    AND (p1.user_id = auth.uid() OR p2.user_id = auth.uid())
  )
);

-- Storage bucket pour les photos de profil
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour le storage
CREATE POLICY "Profile photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);