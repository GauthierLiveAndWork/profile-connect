import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Users,
  Brain,
  Target,
  Settings
} from 'lucide-react';

const DemoLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Live&Work</h1>
                <p className="text-sm text-muted-foreground">Demo Platform</p>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="w-3 h-3" />
              Publié
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Live&Work – Plateforme de Matching Professionnel
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Découvrez notre algorithme de matching hybride basé sur la personnalité Big Five, 
            la complémentarité des compétences et l'intelligence artificielle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/matching-test">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                Tester le Matching
              </Button>
            </Link>
            <Link to="/profile/demo">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 text-lg px-8 py-6">
                Voir un Profil
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Application Déployée avec Succès
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Problèmes Résolus</h3>
                  <p className="text-sm text-muted-foreground">
                    Sécurité Supabase et authentification optimisées pour la démo
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Algorithme Actif</h3>
                  <p className="text-sm text-muted-foreground">
                    System de matching hybride entièrement fonctionnel
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Tests Disponibles</h3>
                  <p className="text-sm text-muted-foreground">
                    Toutes les fonctionnalités testables en temps réel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fonctionnalités Principales</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explorez les capacités complètes de notre système de matching professionnel
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Scoring Hybride
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Algorithme basé sur 8 critères : Big Five, valeurs, compétences, secteur, géolocalisation, disponibilité, comportement et fraîcheur.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Big Five</Badge>
                  <Badge variant="outline" className="text-xs">MMR Reranking</Badge>
                  <Badge variant="outline" className="text-xs">Explicabilité</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  Interface Intuitive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Cartes de matching style Tinder, filtres personnalisables, explications transparentes et planification de rendez-vous intégrée.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">Swipe Interface</Badge>
                  <Badge variant="outline" className="text-xs">Filtres Avancés</Badge>
                  <Badge variant="outline" className="text-xs">Calendrier</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Apprentissage Adaptatif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Système d'apprentissage par feedback avec poids personnalisés, exploration vs exploitation et diversité automatique.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">ε-greedy</Badge>
                  <Badge variant="outline" className="text-xs">Feedback Loop</Badge>
                  <Badge variant="outline" className="text-xs">Cold Start</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à explorer ?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Testez toutes les fonctionnalités de notre plateforme de matching professionnel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/matching-test">
              <Button size="lg" className="text-lg px-8 py-6">
                Démarrer la Démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold">Live&Work</span>
              <Badge variant="secondary" className="text-xs">Demo</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Système de matching professionnel basé sur l'IA • 2024
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoLanding;