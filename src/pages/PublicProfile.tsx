import React from 'react';
import { useParams } from 'react-router-dom';
import { ProfileDisplay } from '@/components/ProfileDisplay/ProfileDisplay';

export const PublicProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  
  if (!profileId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Profil introuvable</h1>
          <p className="text-muted-foreground">L'ID du profil est manquant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
      <ProfileDisplay profileId={profileId} isPublic={true} />
    </div>
  );
};