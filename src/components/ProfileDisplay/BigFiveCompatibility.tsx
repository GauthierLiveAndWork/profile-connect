import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { BigFiveScores } from '@/types/profile';
import { calculateCompatibility } from '@/utils/bigFiveOptimized';
import { supabase } from '@/integrations/supabase/client';

interface CompatibilityMember {
  id: string;
  display_initials: string;
  photo_url?: string;
  sector: string;
  scores: BigFiveScores;
  compatibility: number;
}

interface BigFiveCompatibilityProps {
  userScores: BigFiveScores;
  userId?: string;
}

export const BigFiveCompatibility = ({ userScores, userId }: BigFiveCompatibilityProps) => {
  const [compatibleMembers, setCompatibleMembers] = useState<CompatibilityMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompatibleMembers();
  }, [userScores, userId]);

  const loadCompatibleMembers = async () => {
    try {
      setLoading(true);
      
      // Récupérer les profils publics avec leurs scores Big Five (données anonymisées)
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          photo_url,
          sector,
          openness,
          conscientiousness,
          extraversion,
          agreeableness,
          emotional_stability
        `)
        .eq('is_public', true)
        .neq('id', userId || 'null') // Exclure l'utilisateur actuel si connecté
        .limit(6);

      if (error) {
        console.error('Error loading profiles:', error);
        return;
      }

      if (!data) return;

      // Add computed fields for each profile
      const profiles = data.map(profile => ({
        ...profile,
        display_initials: (profile.first_name?.charAt(0) || '') + (profile.last_name?.charAt(0) || ''),
      }));


      // Calculer la compatibilité pour chaque profil
      const membersWithCompatibility = profiles
        .map(profile => {
          const memberScores: BigFiveScores = {
            openness: profile.openness,
            conscientiousness: profile.conscientiousness,
            extraversion: profile.extraversion,
            agreeableness: profile.agreeableness,
            emotional_stability: profile.emotional_stability
          };

          const compatibility = calculateCompatibility(userScores, memberScores);

          return {
            id: profile.id,
            display_initials: profile.display_initials,
            photo_url: profile.photo_url,
            sector: profile.sector,
            scores: memberScores,
            compatibility
          };
        })
        .sort((a, b) => b.compatibility - a.compatibility) // Trier par compatibilité décroissante
        .slice(0, 5); // Garder les 5 premiers

      setCompatibleMembers(membersWithCompatibility);
    } catch (error) {
      console.error('Error in loadCompatibleMembers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
  };

  const getInitials = (displayInitials: string) => {
    return displayInitials || '??';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Compatibilités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
                <div className="w-16 h-6 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Membres Compatibles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {compatibleMembers.length === 0 ? (
          <div className="text-center py-6">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Aucun membre compatible trouvé pour le moment.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Revenez plus tard quand plus de membres auront rejoint la communauté !
            </p>
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-4">
              Basé sur votre profil Big Five, voici les membres les plus compatibles avec vous :
            </div>
            
            {compatibleMembers.map((member, index) => (
              <div 
                key={member.id} 
                className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.photo_url} alt={`Membre ${member.display_initials}`} />
                  <AvatarFallback>
                    {getInitials(member.display_initials)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {member.display_initials || 'Membre Anonyme'}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {member.sector}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={member.compatibility} 
                      className="h-2 flex-1"
                    />
                    <span className="text-xs text-muted-foreground">
                      {member.compatibility}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getCompatibilityColor(member.compatibility)} text-white`}
                  >
                    {getCompatibilityLabel(member.compatibility)}
                  </Badge>
                </div>
                
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Voir plus de membres compatibles
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};