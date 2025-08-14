import { ProgressBar } from '@/components/ui/progress-bar';

interface FormHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription: string;
}

export const FormHeader = ({ 
  currentStep, 
  totalSteps, 
  stepTitle, 
  stepDescription 
}: FormHeaderProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <ProgressBar progress={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          {currentStep + 1} / {totalSteps}
        </p>
      </div>
      
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{stepTitle}</h2>
        <p className="text-muted-foreground">{stepDescription}</p>
      </div>
    </div>
  );
};