import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { MatchingWeights, DEFAULT_WEIGHTS, Secteur, FormatRencontre } from '@/types/matching';

interface MatchingFiltersProps {
  weights: MatchingWeights;
  onWeightsChange: (weights: MatchingWeights) => void;
  filters: MatchingFilters;
  onFiltersChange: (filters: MatchingFilters) => void;
}

export interface MatchingFilters {
  secteurs: Secteur[];
  formats: FormatRencontre[];
  radiusKm: number;
  remoteOnly: boolean;
  seniorite: ('junior' | 'intermediate' | 'senior')[];
  minScore: number;
}

export const MatchingFiltersPanel = ({
  weights,
  onWeightsChange,
  filters,
  onFiltersChange
}: MatchingFiltersProps) => {
  const [isWeightsOpen, setIsWeightsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const handleWeightChange = (key: keyof MatchingWeights, value: number[]) => {
    onWeightsChange({
      ...weights,
      [key]: value[0] / 100
    });
  };

  const resetWeights = () => {
    onWeightsChange(DEFAULT_WEIGHTS);
  };

  const secteurOptions: Secteur[] = [
    'HealthTech', 'FinTech', 'EdTech', 'CleanTech', 'RetailTech',
    'FoodTech', 'LegalTech', 'SaaS', 'Immobilier', 'Public_sector'
  ];

  const formatOptions: FormatRencontre[] = [
    'coffee', 'visio', 'cowork', 'mentorat', 'projet_court', 'cofondation'
  ];

  const formatLabels: Record<FormatRencontre, string> = {
    coffee: 'Café',
    visio: 'Visio',
    cowork: 'Coworking',
    mentorat: 'Mentorat',
    projet_court: 'Projet court',
    cofondation: 'Cofondation'
  };

  const toggleSecteur = (secteur: Secteur) => {
    const newSecteurs = filters.secteurs.includes(secteur)
      ? filters.secteurs.filter(s => s !== secteur)
      : [...filters.secteurs, secteur];
    
    onFiltersChange({
      ...filters,
      secteurs: newSecteurs
    });
  };

  const toggleFormat = (format: FormatRencontre) => {
    const newFormats = filters.formats.includes(format)
      ? filters.formats.filter(f => f !== format)
      : [...filters.formats, format];
    
    onFiltersChange({
      ...filters,
      formats: newFormats
    });
  };

  const toggleSeniorite = (level: 'junior' | 'intermediate' | 'senior') => {
    const newSeniorite = filters.seniorite.includes(level)
      ? filters.seniorite.filter(s => s !== level)
      : [...filters.seniorite, level];
    
    onFiltersChange({
      ...filters,
      seniorite: newSeniorite
    });
  };

  return (
    <div className="space-y-4">
      {/* Poids de compatibilité */}
      <Card>
        <Collapsible open={isWeightsOpen} onOpenChange={setIsWeightsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                Personnaliser les critères
                {isWeightsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Poids personnalisés</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetWeights}
                  className="text-xs"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Réinitialiser
                </Button>
              </div>
              
              <div className="grid gap-4">
                {Object.entries(weights).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm capitalize">
                        {key === 'big5' ? 'Personnalité' : 
                         key === 'valeurs' ? 'Valeurs' :
                         key === 'secteur' ? 'Secteur' :
                         key === 'competences' ? 'Compétences' :
                         key === 'localisation' ? 'Localisation' :
                         key === 'disponibilite' ? 'Disponibilité' :
                         key === 'comportement' ? 'Comportement' :
                         'Fraîcheur'}
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[value * 100]}
                      onValueChange={(newValue) => handleWeightChange(key as keyof MatchingWeights, newValue)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Filtres */}
      <Card>
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                Filtres de recherche
                {isFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Score minimum */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Score minimum</Label>
                  <span className="text-sm text-muted-foreground">
                    {filters.minScore}/100
                  </span>
                </div>
                <Slider
                  value={[filters.minScore]}
                  onValueChange={(value) => onFiltersChange({
                    ...filters,
                    minScore: value[0]
                  })}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Secteurs */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Secteurs d'intérêt</Label>
                <div className="flex flex-wrap gap-2">
                  {secteurOptions.map((secteur) => (
                    <Badge
                      key={secteur}
                      variant={filters.secteurs.includes(secteur) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/20 text-xs"
                      onClick={() => toggleSecteur(secteur)}
                    >
                      {secteur}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Formats de rencontre */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Formats souhaités</Label>
                <div className="flex flex-wrap gap-2">
                  {formatOptions.map((format) => (
                    <Badge
                      key={format}
                      variant={filters.formats.includes(format) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/20 text-xs"
                      onClick={() => toggleFormat(format)}
                    >
                      {formatLabels[format]}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Niveau de séniorité */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Niveaux d'expérience</Label>
                <div className="flex flex-wrap gap-2">
                  {(['junior', 'intermediate', 'senior'] as const).map((level) => (
                    <Badge
                      key={level}
                      variant={filters.seniorite.includes(level) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/20 text-xs"
                      onClick={() => toggleSeniorite(level)}
                    >
                      {level === 'junior' ? 'Junior' : 
                       level === 'intermediate' ? 'Intermédiaire' : 'Senior'}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Géolocalisation */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Localisation</Label>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={filters.remoteOnly}
                    onCheckedChange={(checked) => onFiltersChange({
                      ...filters,
                      remoteOnly: checked
                    })}
                  />
                  <Label className="text-sm">Télétravail uniquement</Label>
                </div>

                {!filters.remoteOnly && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm">Rayon de recherche</Label>
                      <span className="text-sm text-muted-foreground">
                        {filters.radiusKm} km
                      </span>
                    </div>
                    <Slider
                      value={[filters.radiusKm]}
                      onValueChange={(value) => onFiltersChange({
                        ...filters,
                        radiusKm: value[0]
                      })}
                      min={5}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};