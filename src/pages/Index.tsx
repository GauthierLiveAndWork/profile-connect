import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/ProfileForm/ProfileForm';
import { ProfileDisplay } from '@/components/ProfileDisplay/ProfileDisplay';
import { Users, Target, BarChart3, Settings, ArrowLeft, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Charger le profil de l'utilisateur connecté
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Chercher le profil de l'utilisateur connecté
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erreur lors du chargement du profil:', error);
        } else if (profile) {
          setProfileId(profile.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (profileId && !showForm) {
    return (
      <div>
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Button>
            </Link>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier le profil
            </Button>
          </div>
        </div>
        <ProfileDisplay profileId={profileId} />
      </div>
    );
  }

  if (showForm) {
    return (
      <div>
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour à l'accueil
              </Button>
            </Link>
            {profileId && (
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                Annuler la modification
              </Button>
            )}
          </div>
        </div>
        <ProfileForm onComplete={(newProfileId) => {
          setProfileId(newProfileId);
          setShowForm(false);
        }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-end gap-2 mb-4">
            <Link to="/matching-test">
              <Button 
                size="sm" 
                className="gap-2 bg-white/20 border border-white/40 text-white hover:bg-white/30 font-medium"
                style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <Users className="w-4 h-4" style={{ color: 'white' }} />
                Test Matching
              </Button>
            </Link>
            <Link to="/admin">
              <Button 
                size="sm" 
                className="gap-2 bg-white/20 border border-white/40 text-white hover:bg-white/30 font-medium"
                style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <Settings className="w-4 h-4" style={{ color: 'white' }} />
                Admin
              </Button>
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Live&Work – Connectez-vous aux bons partenaires
          </h1>
          <p className="text-xl mb-8 opacity-90">
            {user 
              ? "Créez votre profil pour commencer à recevoir des suggestions de matching personnalisées."
              : "Complétez votre profil pour trouver des synergies professionnelles adaptées à vos besoins."
            }
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            onClick={() => setShowForm(true)}
          >
            {user ? "Créer mon profil" : "Commencer le questionnaire"}
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Matching Intelligent</h3>
              <p className="text-muted-foreground">Trouvez les partenaires parfaits grâce à notre algorithme basé sur la personnalité Big Five.</p>
            </div>
            <div className="text-center">
              <Target className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Objectifs Ciblés</h3>
              <p className="text-muted-foreground">Définissez précisément vos besoins et objectifs professionnels pour des collaborations réussies.</p>
            </div>
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Profil Détaillé</h3>
              <p className="text-muted-foreground">Créez un profil complet avec test de personnalité pour maximiser vos chances de connexion.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
