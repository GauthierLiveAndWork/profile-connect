import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  onPreview?: () => void;
  canGoNext: boolean;
  isLastStep: boolean;
}

export const FormNavigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  onPreview,
  canGoNext,
  isLastStep
}: FormNavigationProps) => {
  const handlePrevious = () => {
    onPrevious();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleNext = () => {
    onNext();
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
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

      <div className="flex gap-2 items-center">
        {isLastStep && onPreview && (
          <Button
            type="button"
            variant="outline"
            onClick={onPreview}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Prévisualiser
          </Button>
        )}
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
    </div>
  );
};