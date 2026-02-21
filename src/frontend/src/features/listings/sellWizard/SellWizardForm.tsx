import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { PricingDetailsStep } from './steps/PricingDetailsStep';
import { ImagesStep } from './steps/ImagesStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';
import { AIAssistCards } from '../aiAssist/AIAssistCards';
import { useIsAIAssistEnabled } from '../../../api/aiAssist';
import type { SellWizardFormData, WizardStep } from './sellWizardTypes';
import { WIZARD_STEPS } from './sellWizardTypes';
import { validateBasicInfo, validatePricingDetails, validateAllSteps } from './sellWizardValidation';
import type { ValidationErrors } from './sellWizardValidation';

interface SellWizardFormProps {
  initialData?: Partial<SellWizardFormData>;
  onSubmit: (data: SellWizardFormData) => Promise<void>;
  onCancel: () => void;
}

export function SellWizardForm({ initialData, onSubmit, onCancel }: SellWizardFormProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(WIZARD_STEPS.BASIC_INFO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { data: aiEnabled } = useIsAIAssistEnabled();

  const [formData, setFormData] = useState<SellWizardFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    condition: initialData?.condition || '',
    category: initialData?.category || '',
    images: initialData?.images || [],
  });

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleFieldChange = (field: keyof SellWizardFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleNext = () => {
    let stepErrors: ValidationErrors = {};

    if (currentStep === WIZARD_STEPS.BASIC_INFO) {
      stepErrors = validateBasicInfo(formData);
    } else if (currentStep === WIZARD_STEPS.PRICING_DETAILS) {
      stepErrors = validatePricingDetails(formData);
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1) as WizardStep);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0) as WizardStep);
  };

  const handleSubmit = async () => {
    const allErrors = validateAllSteps(formData);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setCurrentStep(WIZARD_STEPS.BASIC_INFO);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplySuggestion = (field: keyof SellWizardFormData, value: string) => {
    handleFieldChange(field, value);
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* AI Assist Cards */}
      {aiEnabled && (currentStep === WIZARD_STEPS.BASIC_INFO || currentStep === WIZARD_STEPS.PRICING_DETAILS) && (
        <AIAssistCards
          formData={formData}
          currentStep={currentStep}
          onApplySuggestion={handleApplySuggestion}
        />
      )}

      {/* Step content */}
      {currentStep === WIZARD_STEPS.BASIC_INFO && (
        <BasicInfoStep data={formData} errors={errors} onChange={handleFieldChange} />
      )}
      {currentStep === WIZARD_STEPS.PRICING_DETAILS && (
        <PricingDetailsStep data={formData} errors={errors} onChange={handleFieldChange} />
      )}
      {currentStep === WIZARD_STEPS.IMAGES && (
        <ImagesStep data={formData} onChange={handleFieldChange} />
      )}
      {currentStep === WIZARD_STEPS.REVIEW && (
        <ReviewSubmitStep data={formData} />
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 0 ? onCancel : handleBack}
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>

        {currentStep < totalSteps - 1 ? (
          <Button type="button" onClick={handleNext} disabled={isSubmitting}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="min-w-32">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Listing'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
