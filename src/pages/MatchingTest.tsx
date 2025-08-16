import React from 'react';
import { MatchingDashboard } from '@/components/matching/MatchingDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain, 
  Heart, 
  Target, 
  Users,
  Lightbulb,
  Sparkles
} from 'lucide-react';

const MatchingTest = () => {
  // Simulation d'un utilisateur connecté pour la démo
  const currentUserId = 'user_1'; // Marie Dubois

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Test du Système de Matchmaking</h1>
                <p className="text-sm text-muted-foreground">Live&Work • Algorithme hybride</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Demo
            </Badge>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Démo du système de matching
              </h2>
              <p className="text-muted-foreground mb-3">
                Explorez l'algorithme hybride avec scoring Big Five, complémentarité des compétences, 
                et re-ranking pour la diversité. Testez les filtres personnalisables et les explications transparentes.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  <Heart className="w-3 h-3 mr-1" />
                  Big Five
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Target className="w-3 h-3 mr-1" />
                  Complémentarité
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  MMR Reranking
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Explicabilité
                </Badge>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Profil de test actuel</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      MD
                    </div>
                    <div>
                      <p className="font-medium">Marie Dubois</p>
                      <p className="text-sm text-muted-foreground">Product Designer • HealthTech</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">Paris</Badge>
                    <Badge variant="secondary" className="text-xs">Senior</Badge>
                    <Badge variant="secondary" className="text-xs">Télétravail OK</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <main>
        <MatchingDashboard userId={currentUserId} />
      </main>

      {/* Footer Info */}
      <footer className="border-t bg-gray-50/50 mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Fonctionnalités testées</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto">
                  <Brain className="w-4 h-4" />
                </div>
                <p className="font-medium">Scoring hybride</p>
                <p className="text-muted-foreground">8 critères pondérés avec fonction logistique</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto">
                  <Target className="w-4 h-4" />
                </div>
                <p className="font-medium">Filtres avancés</p>
                <p className="text-muted-foreground">Poids personnalisés et filtres contextuels</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-4 h-4" />
                </div>
                <p className="font-medium">Diversité MMR</p>
                <p className="text-muted-foreground">Re-ranking pour éviter les bulles de filtres</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mx-auto">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <p className="font-medium">Explicabilité</p>
                <p className="text-muted-foreground">Raisons transparentes pour chaque match</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MatchingTest;