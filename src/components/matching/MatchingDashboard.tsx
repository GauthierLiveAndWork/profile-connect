import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MatchCard } from './MatchCard';
import { MatchingFiltersPanel, MatchingFilters } from './MatchingFilters';
import { MatchExplanationModal } from './MatchExplanationModal';
import { ScheduleMeetingDialog } from './ScheduleMeetingDialog';
import { 
  MatchSuggestion, 
  MatchingWeights, 
  DEFAULT_WEIGHTS,
  FeedbackEvent 
} from '@/types/matching';
import { 
  RefreshCw, 
  Heart, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MatchingDashboardProps {
  userId: string;
}

export const MatchingDashboard = ({ userId }: MatchingDashboardProps) => {
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weights, setWeights] = useState<MatchingWeights>(DEFAULT_WEIGHTS);
  const [filters, setFilters] = useState<MatchingFilters>({
    secteurs: [],
    formats: [],
    radiusKm: 30,
    remoteOnly: false,
    seniorite: [],
    minScore: 40
  });
  
  const [selectedMatch, setSelectedMatch] = useState<MatchSuggestion | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  
  const [stats, setStats] = useState({
    totalMatches: 0,
    avgScore: 0,
    newMatches: 0,
    pendingMeetings: 0
  });

  const { toast } = useToast();

  // Simulation de données pour la démo
  const mockSuggestions: MatchSuggestion[] = [
    {
      id: '1',
      compatibility_score: 87,
      reasons: [
        '3 valeurs en commun : Impact social, Transparence, Apprentissage',
        'Complémentarité : vous cherchez Backend Go et propose UX Research',
        'Disponible mardi matin, à 6 km'
      ],
      overlaps: {
        valeurs: ['Impact social', 'Transparence', 'Apprentissage continu'],
        competences_supply: ['Backend Go'],
        competences_demand: ['UX Research']
      },
      next_best_action: 'Proposer un créneau mardi matin',
      profile_preview: {
        identite: {
          prenom: 'Marie',
          nom: 'Dubois',
          headline: 'Product Designer • HealthTech passionnée',
          photo_url: '',
          langues: ['fr', 'en']
        },
        secteur: ['HealthTech'],
        badges: {
          communautaires: ['Organisatrice d\'événements', 'Mentor startups'],
          sectoriels: ['HealthTech certified']
        }
      }
    },
    {
      id: '2',
      compatibility_score: 73,
      reasons: [
        '2 secteurs en commun : SaaS, FinTech',
        'Complémentarité technique forte',
        'Format mentorat compatible'
      ],
      overlaps: {
        valeurs: ['Innovation', 'Excellence'],
        competences_supply: ['React', 'TypeScript'],
        competences_demand: ['Growth Hacking']
      },
      next_best_action: 'Envoyer un message d\'introduction',
      profile_preview: {
        identite: {
          prenom: 'Thomas',
          nom: 'Martin',
          headline: 'CTO & Entrepreneur • SaaS B2B',
          photo_url: '',
          langues: ['fr', 'en']
        },
        secteur: ['SaaS', 'FinTech'],
        badges: {
          communautaires: ['Mentor technique'],
          sectoriels: ['Y Combinator Alumni']
        }
      }
    }
  ];

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuggestions(mockSuggestions);
      setStats({
        totalMatches: mockSuggestions.length,
        avgScore: Math.round(mockSuggestions.reduce((sum, s) => sum + s.compatibility_score, 0) / mockSuggestions.length),
        newMatches: mockSuggestions.filter(s => s.compatibility_score > 70).length,
        pendingMeetings: 2
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les suggestions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSuggestions = async () => {
    setRefreshing(true);
    await loadSuggestions();
    setRefreshing(false);
    toast({
      title: 'Suggestions mises à jour',
      description: 'Nouvelles recommandations basées sur vos préférences'
    });
  };

  useEffect(() => {
    loadSuggestions();
  }, [userId, weights, filters]);

  const handleFeedback = async (targetId: string, event: FeedbackEvent['event']) => {
    try {
      // Simulation API call
      const feedback: FeedbackEvent = {
        user_id: userId,
        target_id: targetId,
        event,
        timestamp: new Date().toISOString()
      };
      
      console.log('Feedback envoyé:', feedback);
      
      // Retirer la suggestion de la liste après action
      setSuggestions(prev => prev.filter(s => s.id !== targetId));
      
      const eventLabels = {
        like: 'Intérêt marqué',
        pass: 'Profil passé',
        message: 'Message envoyé',
        meeting_confirmed: 'Rendez-vous confirmé',
        no_show: 'Absence signalée'
      };
      
      toast({
        title: eventLabels[event],
        description: event === 'like' ? 'Votre intérêt a été partagé' : 
                    event === 'message' ? 'Message envoyé avec succès' :
                    'Action enregistrée'
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer votre action',
        variant: 'destructive'
      });
    }
  };

  const handleLike = (id: string) => handleFeedback(id, 'like');
  const handlePass = (id: string) => handleFeedback(id, 'pass');
  const handleMessage = (id: string) => handleFeedback(id, 'message');
  
  const handleSchedule = (id: string) => {
    const match = suggestions.find(s => s.id === id);
    if (match) {
      setSelectedMatch(match);
      setShowScheduling(true);
    }
  };

  const handleShowDetails = (id: string) => {
    const match = suggestions.find(s => s.id === id);
    if (match) {
      setSelectedMatch(match);
      setShowExplanation(true);
    }
  };

  const filteredSuggestions = suggestions.filter(s => s.compatibility_score >= filters.minScore);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Suggestions de connexions</h1>
        <p className="text-muted-foreground">
          Découvrez des profils compatibles pour collaborer, apprendre et créer ensemble
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Matches disponibles</p>
                <p className="text-2xl font-bold">{stats.totalMatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <p className="text-2xl font-bold text-green-600">{stats.avgScore}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Nouveaux matches</p>
                <p className="text-2xl font-bold text-red-500">{stats.newMatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">RDV en attente</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pendingMeetings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="filters">Filtres</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredSuggestions.length} suggestion{filteredSuggestions.length > 1 ? 's' : ''}
              </Badge>
              {filters.minScore > 40 && (
                <Badge variant="outline">
                  Score ≥ {filters.minScore}
                </Badge>
              )}
            </div>
            
            <Button
              onClick={refreshSuggestions}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune suggestion trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez d'ajuster vos filtres ou de réduire le score minimum
                </p>
                <Button onClick={() => setFilters({
                  ...filters,
                  minScore: 30
                })} variant="outline">
                  Élargir les critères
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuggestions.map((suggestion) => (
                <MatchCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onLike={handleLike}
                  onPass={handlePass}
                  onMessage={handleMessage}
                  onSchedule={handleSchedule}
                  onShowDetails={handleShowDetails}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="filters">
          <MatchingFiltersPanel
            weights={weights}
            onWeightsChange={setWeights}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Historique de vos interactions et métriques d'engagement à venir...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {selectedMatch && showExplanation && (
        <MatchExplanationModal
          match={selectedMatch}
          open={showExplanation}
          onOpenChange={setShowExplanation}
        />
      )}

      {selectedMatch && showScheduling && (
        <ScheduleMeetingDialog
          match={selectedMatch}
          open={showScheduling}
          onOpenChange={setShowScheduling}
          onScheduled={() => {
            handleFeedback(selectedMatch.id, 'meeting_confirmed');
            setShowScheduling(false);
          }}
        />
      )}
    </div>
  );
};