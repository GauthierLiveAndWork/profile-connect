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
  const { toast } = useToast();

  const updateStepData = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const canGoNext = () => {
    // For the last step, always allow finishing
    if (currentStep === STEPS.length - 1) return true;
    
    switch (currentStep) {
      case 0: return formData.first_name && formData.last_name && formData.email && formData.sector && formData.job_role;
      case 1: return formData.top_skills && formData.training_domains && formData.value_proposition;
      case 2: return formData.current_search && formData.collaboration_type && formData.main_objectives?.length;
      case 3: return formData.work_mode && formData.work_speed && formData.favorite_tools?.length;
      case 4: return formData.big_five_responses?.every(r => r !== null && r !== undefined);
      case 5: return formData.sector_badges?.length || formData.community_badges?.length;
      case 6: return true; // Matching step is optional
      case 7: return true; // Network step is optional
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Validate that all languages have both language and level selected
      const validLanguages = formData.languages?.filter(lang => lang.language && lang.level) || [];
      
      const bigFiveScores = calculateBigFiveScores(formData.big_five_responses || []);
      
      const profileData = {
        ...formData as ProfileFormData,
        languages: validLanguages,
        ...bigFiveScores
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) throw error;

      // Clear form data from localStorage
      localStorage.removeItem('livework-form-data');
      
      toast({
        title: "Profil créé avec succès !",
        description: "Découvrez maintenant votre profil Big Five."
      });

      onComplete(data.id);
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre profil.",
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

      <div className="mb-8">
        {renderStep()}
      </div>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={STEPS.length}
        onPrevious={() => setCurrentStep(prev => Math.max(0, prev - 1))}
        onNext={currentStep === STEPS.length - 1 ? handleSubmit : () => setCurrentStep(prev => prev + 1)}
        canGoNext={canGoNext() && !isSubmitting}
        isLastStep={currentStep === STEPS.length - 1}
      />
    </div>
  );
};