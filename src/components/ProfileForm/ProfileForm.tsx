import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FormHeader } from './FormHeader';
import { FormNavigation } from './FormNavigation';
import { ProfileStep } from './FormSteps/ProfileStep';
import { SkillsStep } from './FormSteps/SkillsStep';
import { NeedsStep } from './FormSteps/NeedsStep';
import { PreferencesStep } from './FormSteps/PreferencesStep';
import { BigFiveStep } from './FormSteps/BigFiveStep';
import { IdentityStep } from './FormSteps/IdentityStep';
import { MatchingStep } from './FormSteps/MatchingStep';
import { NetworkStep } from './FormSteps/NetworkStep';
import { calculateBigFiveScores } from '@/utils/bigFive';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProfileFormData } from '@/types/profile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfileDisplay } from '@/components/ProfileDisplay/ProfileDisplay';

const STEPS = [
  { title: 'Profil', description: 'Vos informations personnelles et professionnelles' },
  { title: 'Compétences', description: 'Vos compétences et ce que vous pouvez offrir' },
  { title: 'Besoins', description: 'Ce que vous recherchez et vos objectifs' },
  { title: 'Préférences', description: 'Votre style de travail et outils favoris' },
  { title: 'Personnalité', description: 'Test Big Five pour mieux vous connaître' },
  { title: 'Identité', description: 'Vos badges et valeurs' },
  { title: 'Matching', description: 'Informations pour le matching' },
  { title: 'Réseau', description: 'Vos références et profils professionnels' }
];

interface ProfileFormProps {
  onComplete: (profileId: string) => void;
}

export const ProfileForm = ({ onComplete }: ProfileFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useLocalStorage<Partial<ProfileFormData>>('livework-form-data', {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewProfileId, setPreviewProfileId] = useState<string | null>(null);
  const { toast } = useToast();

  const updateStepData = (stepData: any) => {
    setFormData(prev => {
      const newData = { ...prev, ...stepData };
      console.log('Données sauvegardées automatiquement');
      return newData;
    });
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0: return formData.first_name && formData.last_name && formData.sector && formData.job_role;
      case 1: return formData.top_skills && formData.training_domains && formData.value_proposition;
      case 2: return formData.current_search && formData.collaboration_type && formData.main_objectives?.length;
      case 3: return formData.work_mode && formData.work_speed && formData.favorite_tools?.length;
      case 4: return formData.big_five_responses?.every(r => r !== null && r !== undefined);
      case 5: return true; // Identity step is optional
      case 6: return true; // Matching step is optional  
      case 7: return true; // Network step is optional
      default: return false;
    }
  };

  const handlePreview = async () => {
    if (!canGoNext() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour prévisualiser un profil.",
          variant: "destructive"
        });
        return;
      }

      // Check if user already has a profile by user_id first
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile for preview
        await updateProfile(existingProfile.id, user);
        setPreviewProfileId(existingProfile.id);
      } else {
        // Check if a profile exists with the same email
        const { data: profileByEmail } = await supabase
          .from('profiles')
          .select('id, user_id')
          .eq('email', formData.email)
          .maybeSingle();
        
        if (profileByEmail) {
          // Profile exists with this email - update it if it belongs to current user
          // or if it has no user_id (legacy profile)
          if (!profileByEmail.user_id || profileByEmail.user_id === user.id) {
            await updateProfile(profileByEmail.id, user);
            setPreviewProfileId(profileByEmail.id);
          } else {
            toast({
              title: "Email déjà utilisé",
              description: "Cette adresse email est déjà associée à un autre profil.",
              variant: "destructive"
            });
            return;
          }
        } else {
          // No existing profile, create new one
          const profileId = await createProfile(user, true);
          if (profileId) {
            setPreviewProfileId(profileId);
          }
        }
      }
      
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error creating preview:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la prévisualisation.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createProfile = async (user: any, isPreview: boolean = false) => {
    const validLanguages = formData.languages?.filter(lang => lang.language && lang.level) || [];
    const bigFiveScores = calculateBigFiveScores(formData.big_five_responses || []);
    
    const profileData = {
      ...formData as ProfileFormData,
      user_id: user.id,
      languages: validLanguages,
      offer_tags: formData.offer_tags || [],
      search_tags: formData.search_tags || [],
      sector_badges: formData.sector_badges || [],
      community_badges: formData.community_badges || [],
      core_values: formData.core_values || [],
      main_objectives: formData.main_objectives || [],
      favorite_tools: formData.favorite_tools || [],
      is_public: !isPreview, // Preview profiles are not public
      ...bigFiveScores
    };
    
    console.log('Submitting profile data:', profileData);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      if (error.code === '23505' && error.message.includes('profiles_email_unique_idx')) {
        toast({
          title: "Email déjà utilisé",
          description: "Un profil avec cette adresse email existe déjà. Tentative de mise à jour...",
          variant: "destructive"
        });
        return null;
      }
      
      throw error;
    }

    return data.id;
  };

  const updateProfile = async (profileId: string, user: any) => {
    const validLanguages = formData.languages?.filter(lang => lang.language && lang.level) || [];
    const bigFiveScores = calculateBigFiveScores(formData.big_five_responses || []);
    
    const profileData = {
      ...formData as ProfileFormData,
      user_id: user.id,
      languages: validLanguages,
      offer_tags: formData.offer_tags || [],
      search_tags: formData.search_tags || [],
      sector_badges: formData.sector_badges || [],
      community_badges: formData.community_badges || [],
      core_values: formData.core_values || [],
      main_objectives: formData.main_objectives || [],
      favorite_tools: formData.favorite_tools || [],
      is_public: true,
      ...bigFiveScores
    };
    
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', profileId);

    if (error) {
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour créer un profil.",
          variant: "destructive"
        });
        return;
      }

      // Check if user already has a profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      let profileId: string;

      if (existingProfile) {
        // Update existing profile
        await updateProfile(existingProfile.id, user);
        profileId = existingProfile.id;
        toast({
          title: "Profil mis à jour avec succès !",
          description: "Découvrez maintenant votre profil Big Five mis à jour."
        });
      } else {
        // Create new profile
        const newProfileId = await createProfile(user);
        if (!newProfileId) return;
        profileId = newProfileId;
        toast({
          title: "Profil créé avec succès !",
          description: "Découvrez maintenant votre profil Big Five."
        });
      }

      // Clear form data from localStorage
      localStorage.removeItem('livework-form-data');
      onComplete(profileId);
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de votre profil. Vérifiez que tous les champs obligatoires sont remplis.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const props = { data: formData, onUpdate: updateStepData };
    
    switch (currentStep) {
      case 0: return <ProfileStep {...props} />;
      case 1: return <SkillsStep {...props} />;
      case 2: return <NeedsStep {...props} />;
      case 3: return <PreferencesStep {...props} />;
      case 4: return <BigFiveStep {...props} />;
      case 5: return <IdentityStep {...props} />;
      case 6: return <MatchingStep {...props} />;
      case 7: return <NetworkStep {...props} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <FormHeader
        currentStep={currentStep}
        totalSteps={STEPS.length}
        stepTitle={STEPS[currentStep].title}
        stepDescription={STEPS[currentStep].description}
      />

      {/* Indicateur de sauvegarde automatique */}
      <div className="mb-4 text-center">
        <p className="text-sm text-muted-foreground">
          ✅ Vos données sont automatiquement sauvegardées à chaque modification
        </p>
      </div>

      <div className="mb-8">
        {renderStep()}
      </div>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={STEPS.length}
        onPrevious={() => setCurrentStep(prev => Math.max(0, prev - 1))}
        onNext={() => setCurrentStep(prev => prev + 1)}
        onSubmit={handleSubmit}
        onPreview={handlePreview}
        canGoNext={canGoNext() && !isSubmitting}
        isLastStep={currentStep === STEPS.length - 1}
      />

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prévisualisation de votre profil</DialogTitle>
          </DialogHeader>
          {previewProfileId && (
            <ProfileDisplay profileId={previewProfileId} isPublic={false} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};