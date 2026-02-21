import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { PricingDetailsStep } from './steps/PricingDetailsStep';
import { LocationStep } from './steps/LocationStep';
import { ImagesStep } from './steps/ImagesStep';
import { ReviewSubmitStep } from './steps/ReviewSubmitStep';
import type { SellWizardFormData, WizardStep } from './sellWizardTypes';
import { WIZARD_STEPS } from './sellWizardTypes';
import { validateBasicInfo, validatePricing, validateLocation, validateImages } from './sellWizardValidation';
import { useSellDraftAutosave } from './useSellDraftAutosave';

const STEPS: WizardStep[] = [
  WIZARD_STEPS.BASIC_INFO,
  WIZARD_STEPS.PRICING_DETAILS,
  WIZARD_STEPS.LOCATION,
  WIZARD_STEPS.IMAGES,
  WIZARD_STEPS.REVIEW,
];

interface SellWizardFormProps {
  initialData?: Partial<SellWizardFormData>;
  onSubmit: (data: SellWizardFormData) => void;
  onCancel: () => void;
  onFormChange?: (data: SellWizardFormData | null) => void;
}

export function SellWizardForm({ initialData, onSubmit, onCancel, onFormChange }: SellWizardFormProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(WIZARD_STEPS.BASIC_INFO);
  const [formData, setFormData] = useState<SellWizardFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    original_price: initialData?.original_price?.toString(),
    condition: initialData?.condition || ('' as any),
    category: initialData?.category || '',
    meetup_locations: initialData?.meetup_locations || [],
    images: initialData?.images || [],
    defect_description: initialData?.defect_description,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Autosave draft
  useSellDraftAutosave(formData);

  // Notify parent of form changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData, onFormChange]);

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  const updateFormData = (field: keyof SellWizardFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors({});
  };

  const validateCurrentStep = (): boolean => {
    let stepErrors: Record<string, string> = {};

    switch (currentStep) {
      case WIZARD_STEPS.BASIC_INFO:
        stepErrors = validateBasicInfo(formData);
        break;
      case WIZARD_STEPS.PRICING_DETAILS:
        stepErrors = validatePricing(formData);
        break;
      case WIZARD_STEPS.LOCATION:
        stepErrors = validateLocation(formData);
        break;
      case WIZARD_STEPS.IMAGES:
        stepErrors = validateImages(formData);
        break;
      case WIZARD_STEPS.REVIEW:
        return true;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleEditStep = (step: WizardStep) => {
    setCurrentStep(step);
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Step {currentStepIndex + 1} of {STEPS.length}
          </span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === WIZARD_STEPS.BASIC_INFO && (
          <BasicInfoStep data={formData} errors={errors} onChange={updateFormData} />
        )}
        {currentStep === WIZARD_STEPS.PRICING_DETAILS && (
          <PricingDetailsStep data={formData} errors={errors} onChange={updateFormData} />
        )}
        {currentStep === WIZARD_STEPS.LOCATION && (
          <LocationStep data={formData} onChange={updateFormData} />
        )}
        {currentStep === WIZARD_STEPS.IMAGES && (
          <ImagesStep data={formData} onChange={updateFormData} />
        )}
        {currentStep === WIZARD_STEPS.REVIEW && (
          <ReviewSubmitStep data={formData} onEditStep={handleEditStep} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={currentStepIndex === 0 ? onCancel : handleBack}>
          {currentStepIndex === 0 ? 'Cancel' : 'Back'}
        </Button>
        {currentStep === WIZARD_STEPS.REVIEW ? (
          <Button onClick={handleSubmit}>Submit Listing</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  );
}
