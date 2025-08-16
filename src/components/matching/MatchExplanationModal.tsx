import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Users, 
  MapPin, 
  Briefcase, 
  Clock,
  Target,
  Brain,
  TrendingUp
} from 'lucide-react';
import { MatchSuggestion } from '@/types/matching';

interface MatchExplanationModalProps {
  match: MatchSuggestion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MatchExplanationModal = ({
  match,
  open,
  onOpenChange
}: MatchExplanationModalProps) => {
  const { profile_preview, compatibility_score, reasons, overlaps } = match;

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`;
  };

  // Simulation des scores détaillés
  const detailedScores = {
    personnalite: 85,
    valeurs: 90,
    competences: 75,
    secteur: 95,
    localisation: 70,
    disponibilite: 80
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const scoreIcon = (category: string) => {
    switch (category) {
      case 'personnalite': return <Brain className="w-4 h-4" />;
      case 'valeurs': return <Heart className="w-4 h-4" />;
      case 'competences': return <Target className="w-4 h-4" />;
      case 'secteur': return <Briefcase className="w-4 h-4" />;
      case 'localisation': return <MapPin className="w-4 h-4" />;
      case 'disponibilite': return <Clock className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const categoryLabel = (category: string) => {
    switch (category) {
      case 'personnalite': return 'Personnalité';
      case 'valeurs': return 'Valeurs';
      case 'competences': return 'Compétences';
      case 'secteur': return 'Secteur';
      case 'localisation': return 'Localisation';
      case 'disponibilite': return 'Disponibilité';
      default: return category;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={profile_preview.identite.photo_url} 
                alt={`${profile_preview.identite.prenom} ${profile_preview.identite.nom}`} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(profile_preview.identite.prenom, profile_preview.identite.nom)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                Pourquoi ce match avec {profile_preview.identite.prenom} ?
              </h2>
              <p className="text-sm text-muted-foreground">
                Analyse détaillée de compatibilité
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score global */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="text-3xl font-bold text-primary">
                    {compatibility_score}
                  </span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Score de compatibilité global
                </p>
                <Progress value={compatibility_score} className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Raisons principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-5 h-5" />
                Points forts de cette connexion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{reason}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Scores détaillés */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Analyse par critère</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(detailedScores).map(([category, score]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {scoreIcon(category)}
                      <span className="text-sm font-medium">
                        {categoryLabel(category)}
                      </span>
                    </div>
                    <span className={`text-sm font-semibold ${scoreColor(score)}`}>
                      {score}/100
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Éléments en commun */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Valeurs partagées */}
            {overlaps.valeurs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Valeurs communes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {overlaps.valeurs.map((valeur, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {valeur}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Complémentarité */}
            {(overlaps.competences_supply.length > 0 || overlaps.competences_demand.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    Complémentarité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {overlaps.competences_supply.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {profile_preview.identite.prenom} peut vous aider avec :
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {overlaps.competences_supply.map((comp, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {overlaps.competences_demand.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Vous pouvez aider avec :
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {overlaps.competences_demand.map((comp, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Badges et expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile_preview.badges.communautaires.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Communautaire</p>
                  <div className="flex flex-wrap gap-2">
                    {profile_preview.badges.communautaires.map((badge, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile_preview.badges.sectoriels.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Sectoriel</p>
                  <div className="flex flex-wrap gap-2">
                    {profile_preview.badges.sectoriels.map((badge, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};