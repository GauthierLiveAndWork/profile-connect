import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MatchCard } from './MatchCard';
import { MatchingFiltersPanel, MatchingFilters } from './MatchingFilters';
import { MatchExplanationModal } from './MatchExplanationModal';
import { ScheduleMeetingDialog } from './ScheduleMeetingDialog';
import { supabase } from '@/integrations/supabase/client';
import { suggestMatches } from '@/utils/matchingAlgorithm';
import { 
  MatchSuggestion, 
  MatchingWeights, 
  DEFAULT_WEIGHTS,
  FeedbackEvent,
  UserProfile,
  PlageHoraire,
  FormatRencontre
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
  userProfile?: UserProfile | null; // Profil de l'utilisateur actuel
}

export const MatchingDashboard = ({ userId, userProfile }: MatchingDashboardProps) => {
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(userProfile || null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
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

  // Charger les profils depuis la base de données
  const loadProfiles = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id, user_id, first_name, last_name, email, sector, job_role, 
          years_experience, top_skills, training_domains, value_proposition,
          current_search, collaboration_type, main_objectives, work_mode, 
          work_speed, favorite_tools, offer_tags, search_tags, current_projects,
          sector_badges, community_badges, core_values, vision, linkedin_profile,
          location, bio, favorite_quote, punchline, photo_url,
          openness, conscientiousness, extraversion, agreeableness, emotional_stability,
          big_five_responses, created_at, updated_at, languages, is_public
        `)
        .eq('is_public', true);

      if (error) throw error;

      // Transformer les données en format UserProfile
      const transformedProfiles: UserProfile[] = (profiles || []).map(profile => ({
        user_id: profile.id,
        identite: {
          prenom: profile.first_name || '',
          nom: profile.last_name || '',
          headline: `${profile.job_role} • ${profile.sector}`,
          photo_url: profile.photo_url || '',
          langues: Array.isArray(profile.languages) 
            ? profile.languages.map((lang: any) => lang.language).filter(Boolean)
            : ['fr']
        },
        localisation: {
          ville: profile.location || '',
          pays: 'France',
          lat: 48.8566,
          lng: 2.3522,
          mobilite: { rayon_km: 30, remote: true }
        },
        disponibilite: {
          plages_horaires: ['lun_matin', 'mar_matin', 'mer_matin'] as PlageHoraire[],
          format: (profile.collaboration_type ? [profile.collaboration_type as FormatRencontre] : ['coffee']) as FormatRencontre[]
        },
        secteur: (profile.sector ? [profile.sector as any] : []) as any[],
        competences: {
          hard: profile.top_skills ? profile.top_skills.split(',').map(s => s.trim()) : [],
          soft: ['Communication', 'Adaptabilité'],
          seniorite: (profile.years_experience as any) || 'intermediate'
        },
        badges: {
          communautaires: profile.community_badges || [],
          sectoriels: profile.sector_badges || [],
          personnalite: []
        },
        valeurs: (profile.core_values || []) as any[],
        mission_personnelle: profile.vision || '',
        projets_en_cours: profile.current_projects ? [profile.current_projects] : [],
        apporte: profile.offer_tags || [],
        recherche: profile.search_tags || [],
        big_five: {
          ouverture: profile.openness || 50,
          consciencieuse: profile.conscientiousness || 50,
          extraversion: profile.extraversion || 50,
          agreabilite: profile.agreeableness || 50,
          stabilite_emotionnelle: profile.emotional_stability || 50,
          source: 'auto_eval',
          date: profile.updated_at || profile.created_at
        },
        preferences_matching: {
          priorites: ['secteur', 'localisation', 'valeurs', 'complementarite_competences'],
          poids_personnalises: weights,
          radius_km: 30,
          visibilite_personnalite: 'public'
        },
        activite: {
          derniere_connexion: profile.updated_at || profile.created_at,
          signals: { vues: 0, likes: 0, reponses: 0, no_show: 0, messages_envoyes: 0 }
        },
        etat: { ouvert_aux_matches: true, bloque_ids: [] },
        version: 1
      }));

      setAllProfiles(transformedProfiles);

      // Si on n'a pas encore le profil utilisateur, essayer de le trouver
      if (!currentUserProfile && userId) {
        const userProfile = transformedProfiles.find(p => p.user_id === userId);
        if (userProfile) {
          setCurrentUserProfile(userProfile);
        }
      }

      return transformedProfiles;
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les profils depuis la base de données',
        variant: 'destructive'
      });
      return [];
    }
  };

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      // Charger tous les profils s'ils ne sont pas déjà chargés
      let profiles = allProfiles;
      if (profiles.length === 0) {
        profiles = await loadProfiles();
      }

      // Si nous avons un profil utilisateur (soit passé en prop, soit trouvé dans la DB)
      if (currentUserProfile && profiles.length > 0) {
        // Utiliser l'algorithme de matching réel
        const matchSuggestions = suggestMatches(currentUserProfile, profiles, weights);
        setSuggestions(matchSuggestions);
        
        setStats({
          totalMatches: matchSuggestions.length,
          avgScore: matchSuggestions.length > 0 
            ? Math.round(matchSuggestions.reduce((sum, s) => sum + s.compatibility_score, 0) / matchSuggestions.length)
            : 0,
          newMatches: matchSuggestions.filter(s => s.compatibility_score > 70).length,
          pendingMeetings: 2
        });
      } else {
        // Fallback vers des données de démo si pas de profil utilisateur
        console.log('Pas de profil utilisateur trouvé, utilisation de données de démo');
        setSuggestions([]);
        setStats({ totalMatches: 0, avgScore: 0, newMatches: 0, pendingMeetings: 0 });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des suggestions:', error);
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
  }, [userId, weights, filters, currentUserProfile]);

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