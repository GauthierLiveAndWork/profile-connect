-- Create profiles table for user responses and Big Five scores
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  photo_url TEXT,
  sector TEXT NOT NULL,
  current_role TEXT NOT NULL,
  years_experience TEXT NOT NULL,
  languages TEXT[] NOT NULL DEFAULT '{}',
  
  -- Skills & Offer
  top_skills TEXT NOT NULL,
  training_domains TEXT NOT NULL,
  value_proposition TEXT NOT NULL,
  
  -- Needs & Goals
  current_search TEXT NOT NULL,
  collaboration_type TEXT NOT NULL,
  main_objectives TEXT[] NOT NULL DEFAULT '{}',
  
  -- Collaboration Preferences
  work_mode TEXT NOT NULL,
  work_speed TEXT NOT NULL,
  favorite_tools TEXT[] NOT NULL DEFAULT '{}',
  
  -- Big Five Test Results (scores 1-5)
  openness DECIMAL(3,2) NOT NULL,
  conscientiousness DECIMAL(3,2) NOT NULL,
  extraversion DECIMAL(3,2) NOT NULL,
  agreeableness DECIMAL(3,2) NOT NULL,
  emotional_stability DECIMAL(3,2) NOT NULL,
  
  -- Big Five Raw Responses (1-5 scale for each of 10 questions)
  big_five_responses INTEGER[] NOT NULL DEFAULT '{}',
  
  -- Network & Trust
  linkedin_profile TEXT,
  references TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies - profiles are viewable by everyone for networking purposes
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update profiles by email" 
ON public.profiles 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on email searches
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_sector ON public.profiles(sector);
CREATE INDEX idx_profiles_created_at ON public.profiles(created_at DESC);