import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AIStatusBadge } from '@/components/ui/ai-status-badge';
import { 
  Heart, 
  X, 
  MessageCircle, 
  Calendar, 
  Info,
  MapPin,
  Briefcase
} from 'lucide-react';
import { MatchSuggestion } from '@/types/matching';

interface MatchCardProps {
  suggestion: MatchSuggestion;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onMessage: (id: string) => void;
  onSchedule: (id: string) => void;
  onShowDetails: (id: string) => void;
}

export const MatchCard = ({
  suggestion,
  onLike,
  onPass,
  onMessage,
  onSchedule,
  onShowDetails
}: MatchCardProps) => {
  const { profile_preview, compatibility_score, reasons, next_best_action } = suggestion;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-0">
        {/* Header avec photo et infos principales */}
        <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-white shadow-md">
              <AvatarImage 
                src={profile_preview.identite.photo_url} 
                alt={`${profile_preview.identite.prenom} ${profile_preview.identite.nom}`} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {getInitials(profile_preview.identite.prenom, profile_preview.identite.nom)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {profile_preview.identite.prenom} {profile_preview.identite.nom}
              </h3>
              <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                {profile_preview.identite.headline}
              </p>
              
              {/* Score de compatibilité */}
              <div className="flex items-center gap-2">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(compatibility_score)}`}>
                  <Heart className="w-3 h-3" />
                  Compatibilité {compatibility_score}/100
                </div>
                {reasons.some(r => r.includes('IA')) && (
                  <AIStatusBadge variant="outline" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Secteurs et badges */}
        <div className="p-4 space-y-3">
          {/* Secteurs */}
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {profile_preview.secteur.slice(0, 2).map((secteur, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {secteur}
                </Badge>
              ))}
              {profile_preview.secteur.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{profile_preview.secteur.length - 2}
                </Badge>
              )}
            </div>
          </div>

          {/* Badges communautaires */}
          {profile_preview.badges.communautaires.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {profile_preview.badges.communautaires.slice(0, 3).map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Raisons du match */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Pourquoi ce match ?</span>
            </div>
            <div className="space-y-1">
              {reasons.slice(0, 3).map((reason, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  <span className="line-clamp-1">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action recommandée */}
          {next_best_action && (
            <div className="bg-secondary/20 rounded-lg p-3">
              <p className="text-sm font-medium text-secondary-foreground">
                💡 {next_best_action}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPass(suggestion.id)}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage(suggestion.id)}
              className="flex-1"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSchedule(suggestion.id)}
              className="flex-1"
            >
              <Calendar className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={() => onLike(suggestion.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowDetails(suggestion.id)}
            className="w-full mt-2 text-xs"
          >
            Voir le profil complet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};