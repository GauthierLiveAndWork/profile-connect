import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Users, Calendar, Download, HelpCircle } from 'lucide-react';
import { BigFiveScores } from '@/types/profile';
import { 
  BIG_FIVE_COLORS,
  getBigFiveInterpretation,
  generateBigFiveBadges,
  getEventRecommendations,
  exportBigFiveProfile
} from '@/utils/bigFiveOptimized';
import { getDimensionLabel } from '@/utils/bigFive';
import { BigFiveExportDialog } from './BigFiveExportDialog';
import { BigFiveCompatibility } from './BigFiveCompatibility';

interface OptimizedBigFiveDisplayProps {
  scores: BigFiveScores;
  onPrivacyChange?: (privacy: 'public' | 'visible_amis' | 'prive') => void;
  currentPrivacy?: 'public' | 'visible_amis' | 'prive';
}

export const OptimizedBigFiveDisplay = ({ 
  scores, 
  onPrivacyChange,
  currentPrivacy = 'visible_amis' 
}: OptimizedBigFiveDisplayProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [privacy, setPrivacy] = useState(currentPrivacy);

  // Préparer les données pour le graphique radar
  const radarData = Object.entries(scores).map(([key, value]) => ({
    dimension: getDimensionLabel(key as keyof BigFiveScores),
    score: (value / 5) * 100, // Convertir en pourcentage
    fullMark: 100,
    color: BIG_FIVE_COLORS[key as keyof BigFiveScores]
  }));

  // Générer les badges et recommandations
  const badges = generateBigFiveBadges(scores);
  const eventRecommendations = getEventRecommendations(scores);

  const handlePrivacyChange = (newPrivacy: 'public' | 'visible_amis' | 'prive') => {
    setPrivacy(newPrivacy);
    onPrivacyChange?.(newPrivacy);
  };


  const getPrivacyIcon = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'public': return <Users className="w-4 h-4" />;
      case 'visible_amis': return <Eye className="w-4 h-4" />;
      case 'prive': return <EyeOff className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getPrivacyLabel = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'public': return 'Public';
      case 'visible_amis': return 'Amis seulement';
      case 'prive': return 'Privé';
      default: return 'Amis seulement';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec paramètres de confidentialité */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Profil Big Five
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={privacy} onValueChange={handlePrivacyChange}>
                <SelectTrigger className="w-44">
                  <div className="flex items-center gap-2">
                    {getPrivacyIcon(privacy)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="visible_amis">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Amis seulement
                    </div>
                  </SelectItem>
                  <SelectItem value="prive">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4" />
                      Privé
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <BigFiveExportDialog scores={scores} profileName="Mon Profil Big Five" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique radar interactif */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Visualisation Interactive
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Comprendre mon profil Big Five</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {Object.entries(scores).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: BIG_FIVE_COLORS[key as keyof BigFiveScores] }}
                          />
                          <h4 className="font-semibold">{getDimensionLabel(key as keyof BigFiveScores)}</h4>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((value / 5) * 100)}%
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                          {getBigFiveInterpretation(key as keyof BigFiveScores, value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid 
                    gridType="polygon" 
                    stroke="hsl(var(--border))" 
                    strokeOpacity={0.3}
                  />
                  <PolarAngleAxis 
                    dataKey="dimension" 
                    tick={{ 
                      fill: 'hsl(var(--foreground))', 
                      fontSize: 12,
                      fontWeight: 500
                    }}
                    className="text-sm"
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ 
                      fill: 'hsl(var(--muted-foreground))', 
                      fontSize: 10 
                    }}
                    tickCount={6}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={3}
                    dot={{ 
                      fill: 'hsl(var(--primary))', 
                      strokeWidth: 2, 
                      stroke: 'hsl(var(--background))',
                      r: 5
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Détails des dimensions avec pourcentages */}
        <Card>
          <CardHeader>
            <CardTitle>Détails des Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(scores).map(([key, value]) => {
              const percentage = Math.round((value / 5) * 100);
              const color = BIG_FIVE_COLORS[key as keyof BigFiveScores];
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium text-sm">
                        {getDimensionLabel(key as keyof BigFiveScores)}
                      </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color }}>
                      {percentage}%
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    style={{ 
                      '--progress-background': color,
                    } as React.CSSProperties}
                  />
                  <p className="text-xs text-muted-foreground">
                    {getBigFiveInterpretation(key as keyof BigFiveScores, value)}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Badges communautaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Badges Communautaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-3 py-1 text-sm font-medium animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations d'événements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recommandations Personnalisées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Événements suggérés :</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {eventRecommendations.map((event, index) => (
                <div 
                  key={index}
                  className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-sm font-medium">{event}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Matching communautaire :</h4>
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                Votre profil sera utilisé pour vous suggérer des membres compatibles et des opportunités de collaboration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compatibilités avec autres membres */}
      <BigFiveCompatibility userScores={scores} />
    </div>
  );
};