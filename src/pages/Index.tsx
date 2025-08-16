import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/ProfileForm/ProfileForm';
import { ProfileDisplay } from '@/components/ProfileDisplay/ProfileDisplay';
import { Users, Target, BarChart3, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  if (profileId) {
    return <ProfileDisplay profileId={profileId} />;
  }

  if (showForm) {
    return <ProfileForm onComplete={setProfileId} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-end gap-2 mb-4">
            <Link to="/matching-test">
              <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Users className="w-4 h-4" />
                Test Matching
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Live&Work – Connectez-vous aux bons partenaires
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Complétez votre profil pour trouver des synergies professionnelles adaptées à vos besoins.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            onClick={() => setShowForm(true)}
          >
            Commencer le questionnaire
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
