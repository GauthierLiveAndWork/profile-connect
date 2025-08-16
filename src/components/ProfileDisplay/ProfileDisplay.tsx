import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Mail, Briefcase, Globe, Users, Target, Brain } from 'lucide-react';
import { BigFiveRadarChart } from './BigFiveRadarChart';
import { OptimizedBigFiveDisplay } from './OptimizedBigFiveDisplay';
import { ShareProfile } from './ShareProfile';
import { EmailProfileButton } from './EmailProfileButton';
import { ProfileFormData } from '@/types/profile';

interface ProfileDisplayProps {
  profileId: string;
  isPublic?: boolean;
}

interface DatabaseProfile {
  id: string;
  first_name: string;
  last_name: string;
  email?: string; // Made optional for public profiles
  photo_url?: string;
  location?: string;
  sector: string;
  job_role: string;
  years_experience: string;
  bio?: string;
  punchline?: string;
  top_skills: string;
  training_domains: string;
  value_proposition: string;
  current_search: string;
  collaboration_type: string;
  main_objectives: string[];
  work_mode: string;
  work_speed: string;
  favorite_tools: string[];
  community_badges?: string[];
  sector_badges?: string[];
  linkedin_profile?: string;
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  emotional_stability: number;
  languages?: any;
}

export const ProfileDisplay = ({ profileId, isPublic = false }: ProfileDisplayProps) => {
  const [profile, setProfile] = useState<DatabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let data, error;
        
        if (isPublic) {
          // For public access, use the secure public_profiles view that excludes sensitive data
          const result = await supabase
            .from('public_profiles')
            .select('*')
            .eq('id', profileId)
            .maybeSingle();
          data = result.data;
          error = result.error;
        } else {
          // For private access (authenticated users viewing their own profiles), get full data
          const result = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .maybeSingle();
          data = result.data;
          error = result.error;
        }

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId, isPublic]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Profil introuvable</h1>
          <p className="text-muted-foreground">Le profil demandé n'existe pas.</p>
        </div>
      </div>
    );
  }

  const bigFiveScores = [
    { dimension: 'Ouverture', score: profile.openness, color: '#8b5cf6' },
    { dimension: 'Consciencieuse', score: profile.conscientiousness, color: '#06b6d4' },
    { dimension: 'Extraversion', score: profile.extraversion, color: '#10b981' },
    { dimension: 'Agréabilité', score: profile.agreeableness, color: '#f59e0b' },
    { dimension: 'Stabilité émotionnelle', score: profile.emotional_stability, color: '#ef4444' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec photo et infos principales */}
      <section className="gradient-hero text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.photo_url} alt={`${profile.first_name} ${profile.last_name}`} />
              <AvatarFallback className="text-4xl bg-white text-primary">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <p className="text-xl opacity-90 mb-4">{profile.job_role}</p>
                </div>
                {!isPublic && (
                  <div className="flex gap-2">
                    <ShareProfile 
                      profileId={profileId} 
                      profileName={`${profile.first_name} ${profile.last_name}`} 
                    />
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                {!isPublic && profile.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {profile.sector}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio et punchline */}
            {(profile.bio || profile.punchline) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    À propos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.punchline && (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-lg">
                      "{profile.punchline}"
                    </blockquote>
                  )}
                  {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}
                </CardContent>
              </Card>
            )}

            {/* Module Big Five Optimisé */}
            <OptimizedBigFiveDisplay 
              scores={{
                openness: profile.openness,
                conscientiousness: profile.conscientiousness,
                extraversion: profile.extraversion,
                agreeableness: profile.agreeableness,
                emotional_stability: profile.emotional_stability
              }}
            />

            {/* Compétences et proposition de valeur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Compétences & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Compétences principales</h4>
                  <p className="text-muted-foreground">{profile.top_skills}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Domaines de formation</h4>
                  <p className="text-muted-foreground">{profile.training_domains}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Proposition de valeur</h4>
                  <p className="text-muted-foreground">{profile.value_proposition}</p>
                </div>
              </CardContent>
            </Card>

            {/* Objectifs et recherche actuelle */}
            <Card>
              <CardHeader>
                <CardTitle>Objectifs & Recherche</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Recherche actuelle</h4>
                  <p className="text-muted-foreground">{profile.current_search}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Type de collaboration</h4>
                  <p className="text-muted-foreground">{profile.collaboration_type}</p>
                </div>
                {profile.main_objectives && profile.main_objectives.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Objectifs principaux</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.main_objectives.map((objective, index) => (
                          <Badge key={index} variant="secondary">{objective}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Badges et identité */}
            {((profile.community_badges && profile.community_badges.length > 0) || 
              (profile.sector_badges && profile.sector_badges.length > 0)) && (
              <Card>
                <CardHeader>
                  <CardTitle>Badges</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.community_badges && profile.community_badges.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Communautaires</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.community_badges.map((badge, index) => (
                          <Badge key={index} variant="default">{badge}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {profile.sector_badges && profile.sector_badges.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Sectoriels</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.sector_badges.map((badge, index) => (
                          <Badge key={index} variant="outline">{badge}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Préférences de travail */}
            <Card>
              <CardHeader>
                <CardTitle>Préférences de travail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">Mode de travail</h4>
                  <p className="text-sm text-muted-foreground">{profile.work_mode}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Rythme de travail</h4>
                  <p className="text-sm text-muted-foreground">{profile.work_speed}</p>
                </div>
                {profile.favorite_tools && profile.favorite_tools.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Outils favoris</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.favorite_tools.map((tool, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Liens professionnels - Only for authenticated users */}
            {!isPublic && profile.linkedin_profile && (
              <Card>
                <CardHeader>
                  <CardTitle>Profils professionnels</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href={profile.linkedin_profile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    LinkedIn
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};