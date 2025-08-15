import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  canGoNext: boolean;
  isLastStep: boolean;
}

export const FormNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  canGoNext,
  isLastStep
}: FormNavigationProps) => {
  const handlePrevious = () => {
    onPrevious();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    onNext();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={handlePrevious}
        disabled={currentStep === 0}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Précédent
      </Button>

      <div className="text-sm text-muted-foreground">
        Étape {currentStep + 1} sur {totalSteps}
      </div>

      <Button
        type="button"
        onClick={isLastStep ? onSubmit : handleNext}
        disabled={!canGoNext}
        className="flex items-center gap-2"
      >
        {isLastStep ? 'Terminer' : 'Suivant'}
        {!isLastStep && <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  );
};